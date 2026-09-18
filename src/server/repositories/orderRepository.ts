import { connectToDatabase } from '@/lib/mongodb/connection';
import { Order, IOrder, PaymentStatus, PurchaseStatus, DeliveryStatus, GiftCardStatus } from '@/models/Order';

export interface AdminOrderFilters {
  search?: string;
  paymentStatus?: string;
  purchaseStatus?: string;
  deliveryStatus?: string;
  country?: string;
  product?: string;
  startDate?: string;
  endDate?: string;
}

export class OrderRepository {
  static async create(orderData: Partial<IOrder>): Promise<IOrder> {
    await connectToDatabase();
    return Order.create(orderData);
  }

  static async findById(id: string): Promise<IOrder | null> {
    await connectToDatabase();
    return Order.findById(id).exec();
  }

  static async findByOrderNumber(orderNumber: string): Promise<IOrder | null> {
    await connectToDatabase();
    return Order.findOne({ orderNumber: orderNumber.trim() }).exec();
  }

  static async findByUser(
    userId?: string,
    customerEmail?: string,
    limit = 50
  ): Promise<IOrder[]> {
    await connectToDatabase();
    const orConditions: any[] = [];
    if (userId) {
      orConditions.push({ userId });
    }
    if (customerEmail) {
      orConditions.push({ customerEmail: customerEmail.toLowerCase().trim() });
    }
    if (orConditions.length === 0) return [];

    return Order.find({ $or: orConditions })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
      .exec() as unknown as IOrder[];
  }

  static async findWithFilters(
    filters: AdminOrderFilters = {},
    options: { page?: number; limit?: number } = {}
  ): Promise<{ orders: IOrder[]; total: number; page: number; totalPages: number }> {
    await connectToDatabase();
    const query: any = {};

    if (filters.paymentStatus && filters.paymentStatus !== 'ALL') {
      query.paymentStatus = filters.paymentStatus;
    }
    if (filters.purchaseStatus && filters.purchaseStatus !== 'ALL') {
      query.purchaseStatus = filters.purchaseStatus;
    }
    if (filters.deliveryStatus && filters.deliveryStatus !== 'ALL') {
      query.deliveryStatus = filters.deliveryStatus;
    }
    if (filters.country && filters.country !== 'ALL') {
      query.country = filters.country.toUpperCase();
    }
    if (filters.product && filters.product !== 'ALL') {
      query.brandName = { $regex: new RegExp(`^${filters.product}$`, 'i') };
    }
    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      if (filters.startDate) query.createdAt.$gte = new Date(filters.startDate);
      if (filters.endDate) query.createdAt.$lte = new Date(filters.endDate);
    }
    if (filters.search) {
      const searchRegex = new RegExp(filters.search.trim(), 'i');
      const numericSearch = Number(filters.search.trim());
      const orClause: any[] = [
        { orderNumber: searchRegex },
        { customerEmail: searchRegex },
        { recipientEmail: searchRegex },
        { brandName: searchRegex },
      ];
      if (!isNaN(numericSearch)) {
        orClause.push({ reloadlyTransactionId: numericSearch });
      }
      query.$or = orClause;
    }

    const page = Math.max(1, options.page || 1);
    const limit = Math.min(100, Math.max(1, options.limit || 20));
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      Order.countDocuments(query).exec(),
    ]);

    return {
      orders: orders as unknown as IOrder[],
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  static async updateStatuses(
    id: string,
    updates: {
      paymentStatus?: PaymentStatus;
      purchaseStatus?: PurchaseStatus;
      deliveryStatus?: DeliveryStatus;
      giftCardStatus?: GiftCardStatus;
      paymentId?: string;
      reloadlyTransactionId?: number;
      failureReason?: string;
      claimUrl?: string;
    }
  ): Promise<IOrder | null> {
    await connectToDatabase();
    return Order.findByIdAndUpdate(id, { $set: updates }, { returnDocument: 'after' }).exec();
  }

  static async count(query: any = {}): Promise<number> {
    await connectToDatabase();
    return Order.countDocuments(query).exec();
  }
}
