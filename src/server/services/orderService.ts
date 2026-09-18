import { OrderRepository } from '../repositories/orderRepository';
import { ProductRepository } from '../repositories/productRepository';
import { IOrder } from '@/models/Order';
import { TokenPayload } from '@/lib/auth/jwt';

export interface CreateOrderInput {
  productId?: string;
  reloadlyProductId: number;
  amount: number;
  quantity?: number;
  customerEmail: string;
  customerName?: string;
  recipientEmail: string;
  recipientName?: string;
  personalMessage?: string;
  userId?: string;
}

export class OrderService {
  /**
   * Generates human-readable order number format: GC-YYYYMMDD-XXXXX
   */
  static generateOrderNumber(): string {
    const now = new Date();
    const datePart = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomChars = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `GC-${datePart}-${randomChars}`;
  }

  /**
   * Validates product, amount, denomination, and creates order document in PENDING state
   */
  static async createOrder(input: CreateOrderInput): Promise<IOrder> {
    const { reloadlyProductId, amount, quantity = 1 } = input;

    // 1. Fetch product from MongoDB
    const product = await ProductRepository.findByReloadlyId(reloadlyProductId);
    if (!product) {
      const err: any = new Error('Selected gift card product was not found.');
      err.status = 404;
      throw err;
    }

    if (!product.isActive) {
      const err: any = new Error('This gift card is currently unavailable.');
      err.status = 400;
      throw err;
    }

    // 2. Validate denomination strictly on server (Never trust frontend amount)
    if (product.denominationType === 'FIXED') {
      if (product.fixedAmounts.length > 0 && !product.fixedAmounts.includes(amount)) {
        const err: any = new Error(
          `Invalid denomination ${amount}. Allowed denominations: ${product.fixedAmounts.join(', ')}`
        );
        err.status = 400;
        throw err;
      }
    } else {
      if (amount < product.minAmount || amount > product.maxAmount) {
        const err: any = new Error(
          `Amount ${amount} is outside allowed range (${product.minAmount} - ${product.maxAmount} ${product.currency}).`
        );
        err.status = 400;
        throw err;
      }
    }

    const subtotal = amount * quantity;
    const fees = 0; // Zero checkout fees
    const total = subtotal + fees;
    const orderNumber = this.generateOrderNumber();

    // 3. Create Order document in MongoDB
    const order = await OrderRepository.create({
      orderNumber,
      userId: input.userId,
      productId: product._id,
      reloadlyProductId: product.reloadlyProductId,
      brandName: product.brandName,
      productName: product.productName,
      productImage: product.productImage,
      country: product.country,
      currency: product.currency,
      amount,
      quantity,
      subtotal,
      fees,
      total,
      customerEmail: input.customerEmail.toLowerCase().trim(),
      customerName: input.customerName,
      recipientEmail: input.recipientEmail.toLowerCase().trim(),
      recipientName: input.recipientName,
      personalMessage: input.personalMessage,
      paymentStatus: 'PENDING',
      purchaseStatus: 'PENDING',
      deliveryStatus: 'PENDING',
      giftCardStatus: 'PENDING',
      claimUrl: `https://vouchr.com/claim/${orderNumber.toLowerCase()}`,
    });

    return order;
  }

  /**
   * Retrieves an order by ID or order number, verifying ownership or admin authorization
   */
  static async getOrder(
    identifier: string,
    requestingUser?: TokenPayload | null
  ): Promise<IOrder | null> {
    let order: IOrder | null = null;

    if (identifier.startsWith('GC-')) {
      order = await OrderRepository.findByOrderNumber(identifier);
    } else {
      order = await OrderRepository.findById(identifier);
      if (!order && identifier.includes('-')) {
        order = await OrderRepository.findByOrderNumber(identifier);
      }
    }

    if (!order) return null;

    // Authorization check
    if (requestingUser) {
      const isOwner =
        (order.userId && String(order.userId) === requestingUser.userId) ||
        order.customerEmail.toLowerCase() === requestingUser.email.toLowerCase();
      const isAdmin = requestingUser.role === 'ADMIN';

      if (!isOwner && !isAdmin) {
        const err: any = new Error('You are not authorized to view this order.');
        err.status = 403;
        throw err;
      }
    }

    return order;
  }

  /**
   * Retrieves orders for authenticated user
   */
  static async getUserOrders(user: TokenPayload): Promise<IOrder[]> {
    return OrderRepository.findByUser(user.userId, user.email);
  }
}
