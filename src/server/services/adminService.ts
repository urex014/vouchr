import { AdminRepository, AdminStats, CustomerSummary } from '../repositories/adminRepository';
import { OrderRepository, AdminOrderFilters } from '../repositories/orderRepository';
import { ProductRepository } from '../repositories/productRepository';
import { PaymentRepository } from '../repositories/paymentRepository';
import { GiftCardRepository } from '../repositories/giftCardRepository';
import { ReloadlyTransaction } from '@/models/ReloadlyTransaction';
import { FulfillmentService } from './fulfillmentService';
import { IOrder } from '@/models/Order';
import { IProduct } from '@/models/Product';
import { IPayment } from '@/models/Payment';
import { IGiftCard } from '@/models/GiftCard';
import { IAdminAuditLog } from '@/models/AdminAuditLog';

export class AdminService {
  /**
   * Retrieves real-time administrative stats aggregated from MongoDB
   */
  static async getStats(): Promise<AdminStats> {
    return AdminRepository.getStats();
  }

  /**
   * Retrieves orders list with server-side pagination, search, and filters
   */
  static async getOrders(
    filters: AdminOrderFilters = {},
    options: { page?: number; limit?: number } = {}
  ): Promise<{ orders: IOrder[]; total: number; page: number; totalPages: number }> {
    return OrderRepository.findWithFilters(filters, options);
  }

  /**
   * Retrieves full order details with payment, Reloadly transaction, and masked card info
   */
  static async getOrderDetails(orderId: string): Promise<{
    order: IOrder;
    payment?: IPayment | null;
    reloadlyTransaction?: any | null;
    hasGiftCard: boolean;
  }> {
    const order = await OrderRepository.findById(orderId);
    if (!order) {
      const err: any = new Error('Order not found.');
      err.status = 404;
      throw err;
    }

    const [payments, reloadlyTx, giftCard] = await Promise.all([
      PaymentRepository.findByOrderId(order._id.toString()),
      ReloadlyTransaction.findOne({ orderId: order._id }).lean().exec(),
      GiftCardRepository.findByOrderId(order._id.toString(), false),
    ]);

    return {
      order,
      payment: payments[0] || null,
      reloadlyTransaction: reloadlyTx,
      hasGiftCard: !!giftCard,
    };
  }

  /**
   * Reveals sensitive gift card code & PIN behind an explicit admin action and writes an audit log
   */
  static async revealGiftCard(
    orderId: string,
    adminUser: { userId: string; email: string }
  ): Promise<{ code?: string; pin?: string; redemptionUrl?: string; expiresAt?: Date }> {
    const order = await OrderRepository.findById(orderId);
    if (!order) {
      const err: any = new Error('Order not found.');
      err.status = 404;
      throw err;
    }

    const giftCard = await GiftCardRepository.findByOrderId(order._id.toString(), true);
    if (!giftCard) {
      const err: any = new Error('No gift card credentials found for this order.');
      err.status = 404;
      throw err;
    }

    // Write audit log entry
    await AdminRepository.createAuditLog({
      adminUserId: adminUser.userId,
      adminEmail: adminUser.email,
      action: 'GIFT_CARD_VIEWED',
      orderId: order.orderNumber,
      target: `GiftCard for Order ${order._id}`,
      metadata: { recipientEmail: order.recipientEmail },
    });

    return {
      code: giftCard.code,
      pin: giftCard.pin,
      redemptionUrl: giftCard.redemptionUrl,
      expiresAt: giftCard.expiresAt,
    };
  }

  /**
   * Retries failed Reloadly gift card purchase
   */
  static async retryOrderFulfillment(
    orderId: string,
    adminUser: { userId: string; email: string }
  ): Promise<IOrder> {
    return FulfillmentService.retryFulfillment(orderId, adminUser);
  }

  /**
   * Retrieves aggregated customers list
   */
  static async getCustomers(options: { page?: number; limit?: number } = {}): Promise<{
    customers: CustomerSummary[];
    total: number;
  }> {
    return AdminRepository.getCustomers(options);
  }

  /**
   * Retrieves products for admin management
   */
  static async getProducts(
    options: { page?: number; limit?: number; search?: string } = {}
  ): Promise<{ products: IProduct[]; total: number }> {
    return ProductRepository.findAll(
      { search: options.search },
      { page: options.page, limit: options.limit }
    );
  }

  /**
   * Toggles product active state with audit log
   */
  static async toggleProduct(
    productId: string,
    isActive: boolean,
    adminUser: { userId: string; email: string }
  ): Promise<IProduct | null> {
    const updated = await ProductRepository.setActive(productId, isActive);
    if (updated) {
      await AdminRepository.createAuditLog({
        adminUserId: adminUser.userId,
        adminEmail: adminUser.email,
        action: isActive ? 'PRODUCT_ENABLED' : 'PRODUCT_DISABLED',
        target: `Product ${updated.brandName} (${updated.reloadlyProductId})`,
        metadata: { productId, isActive },
      });
    }
    return updated;
  }

  /**
   * Retrieves payments for admin management
   */
  static async getPayments(
    options: { page?: number; limit?: number } = {}
  ): Promise<{ payments: IPayment[]; total: number }> {
    return PaymentRepository.findAll(options);
  }

  /**
   * Retrieves gift cards metadata list (excluding codes)
   */
  static async getGiftCards(
    options: { page?: number; limit?: number } = {}
  ): Promise<{ giftCards: IGiftCard[]; total: number }> {
    return GiftCardRepository.findAll(options);
  }

  /**
   * Retrieves audit logs for security monitoring
   */
  static async getAuditLogs(
    options: { page?: number; limit?: number } = {}
  ): Promise<{ logs: IAdminAuditLog[]; total: number }> {
    return AdminRepository.getAuditLogs(options);
  }
}
