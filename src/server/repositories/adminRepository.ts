import { connectToDatabase } from '@/lib/mongodb/connection';
import { Order } from '@/models/Order';
import { User } from '@/models/User';
import { AdminAuditLog, IAdminAuditLog } from '@/models/AdminAuditLog';

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  successfulOrders: number;
  failedOrders: number;
  pendingOrders: number;
  giftCardsSold: number;
  numberOfCustomers: number;
  todaySales: number;
  thisWeekSales: number;
  thisMonthSales: number;
}

export interface CustomerSummary {
  email: string;
  name: string;
  totalOrders: number;
  totalSpent: number;
  lastPurchaseDate: Date | null;
  accountStatus: string;
  createdAt: Date;
}

export class AdminRepository {
  static async getStats(): Promise<AdminStats> {
    await connectToDatabase();

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      overallAggregation,
      todayAggregation,
      weekAggregation,
      monthAggregation,
      uniqueCustomerCount,
      registeredUserCount,
    ] = await Promise.all([
      // Overall stats aggregation
      Order.aggregate([
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalRevenue: {
              $sum: {
                $cond: [{ $eq: ['$paymentStatus', 'SUCCESS'] }, '$total', 0],
              },
            },
            successfulOrders: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $eq: ['$paymentStatus', 'SUCCESS'] },
                      { $eq: ['$purchaseStatus', 'SUCCESS'] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            failedOrders: {
              $sum: {
                $cond: [
                  {
                    $or: [
                      { $eq: ['$paymentStatus', 'FAILED'] },
                      { $eq: ['$purchaseStatus', 'FAILED'] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            pendingOrders: {
              $sum: {
                $cond: [
                  {
                    $or: [
                      { $eq: ['$paymentStatus', 'PENDING'] },
                      { $eq: ['$purchaseStatus', 'PENDING'] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            giftCardsSold: {
              $sum: {
                $cond: [{ $eq: ['$paymentStatus', 'SUCCESS'] }, '$quantity', 0],
              },
            },
          },
        },
      ]),

      // Today's sales
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfToday },
            paymentStatus: 'SUCCESS',
          },
        },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),

      // 7-day sales
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: sevenDaysAgo },
            paymentStatus: 'SUCCESS',
          },
        },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),

      // 30-day sales
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: thirtyDaysAgo },
            paymentStatus: 'SUCCESS',
          },
        },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),

      // Distinct customer emails who purchased
      Order.distinct('customerEmail').then((emails) => emails.length),

      // Registered users count
      User.countDocuments({ role: 'USER' }),
    ]);

    const statsData = overallAggregation[0] || {
      totalOrders: 0,
      totalRevenue: 0,
      successfulOrders: 0,
      failedOrders: 0,
      pendingOrders: 0,
      giftCardsSold: 0,
    };

    return {
      totalRevenue: Math.round(statsData.totalRevenue * 100) / 100,
      totalOrders: statsData.totalOrders,
      successfulOrders: statsData.successfulOrders,
      failedOrders: statsData.failedOrders,
      pendingOrders: statsData.pendingOrders,
      giftCardsSold: statsData.giftCardsSold,
      numberOfCustomers: Math.max(uniqueCustomerCount, registeredUserCount),
      todaySales: Math.round((todayAggregation[0]?.total || 0) * 100) / 100,
      thisWeekSales: Math.round((weekAggregation[0]?.total || 0) * 100) / 100,
      thisMonthSales: Math.round((monthAggregation[0]?.total || 0) * 100) / 100,
    };
  }

  static async getCustomers(options: { page?: number; limit?: number } = {}): Promise<{
    customers: CustomerSummary[];
    total: number;
  }> {
    await connectToDatabase();
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(100, Math.max(1, options.limit || 20));
    const skip = (page - 1) * limit;

    const aggregation = await Order.aggregate([
      {
        $group: {
          _id: '$customerEmail',
          name: { $first: '$customerName' },
          totalOrders: { $sum: 1 },
          totalSpent: {
            $sum: {
              $cond: [{ $eq: ['$paymentStatus', 'SUCCESS'] }, '$total', 0],
            },
          },
          lastPurchaseDate: { $max: '$createdAt' },
          firstOrderDate: { $min: '$createdAt' },
        },
      },
      { $sort: { totalSpent: -1, totalOrders: -1 } },
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          data: [{ $skip: skip }, { $limit: limit }],
        },
      },
    ]);

    const total = aggregation[0]?.metadata[0]?.total || 0;
    const rawData = aggregation[0]?.data || [];

    const customers: CustomerSummary[] = rawData.map((item: any) => ({
      email: item._id,
      name: item.name || item._id.split('@')[0],
      totalOrders: item.totalOrders,
      totalSpent: Math.round(item.totalSpent * 100) / 100,
      lastPurchaseDate: item.lastPurchaseDate,
      accountStatus: 'Active',
      createdAt: item.firstOrderDate || new Date(),
    }));

    return { customers, total };
  }

  static async createAuditLog(logData: {
    adminUserId: string;
    adminEmail: string;
    action: string;
    orderId?: string;
    target?: string;
    metadata?: Record<string, any>;
  }): Promise<IAdminAuditLog> {
    await connectToDatabase();
    return AdminAuditLog.create({
      ...logData,
      timestamp: new Date(),
    });
  }

  static async getAuditLogs(options: { page?: number; limit?: number } = {}): Promise<{
    logs: IAdminAuditLog[];
    total: number;
  }> {
    await connectToDatabase();
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(100, Math.max(1, options.limit || 25));
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      AdminAuditLog.find()
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      AdminAuditLog.countDocuments().exec(),
    ]);

    return { logs: logs as unknown as IAdminAuditLog[], total };
  }
}
