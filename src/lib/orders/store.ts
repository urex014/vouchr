import { VouchrOrder, CreateOrderInput, OrderStatus } from './types';

// In-memory persistent order repository with initial demo records
const ordersDatabase = new Map<string, VouchrOrder>();

// Pre-populate with realistic orders for demo user
const INITIAL_DEMO_ORDERS: VouchrOrder[] = [
  {
    orderId: 'ord-849201',
    orderNumber: 'VCR-US-99214',
    userId: 'usr_demo_alex',
    reloadlyProductId: 101,
    brandName: 'Amazon',
    productName: 'Amazon US',
    productImage: '/giftcards/amazon-us.svg',
    country: 'US',
    currency: 'USD',
    amount: 50,
    quantity: 1,
    customerEmail: 'alex.mercer@example.com',
    recipientEmail: 'sarah.chen@example.com',
    recipientName: 'Sarah Chen',
    senderName: 'Alex Mercer',
    personalMessage: 'Enjoy your gift!',
    reloadlyTransactionId: 9840192,
    status: 'DELIVERED',
    paymentStatus: 'VERIFIED',
    deliveryStatus: 'DELIVERED',
    deliveryTimestamp: '2026-09-15T14:22:18Z',
    claimUrl: 'https://vouchr.com/claim/vcr-us-99214',
    createdAt: '2026-09-15T14:22:00Z',
    updatedAt: '2026-09-15T14:22:18Z',
    secureCodes: {
      claimCode: 'AMZN-8921-4412-9901',
      pin: '4491',
    },
  },
  {
    orderId: 'ord-849202',
    orderNumber: 'VCR-GLOBAL-99182',
    userId: 'usr_demo_alex',
    reloadlyProductId: 103,
    brandName: 'Spotify',
    productName: 'Spotify Premium Global',
    productImage: '/giftcards/spotify-global.svg',
    country: 'GLOBAL',
    currency: 'USD',
    amount: 30,
    quantity: 1,
    customerEmail: 'alex.mercer@example.com',
    recipientEmail: 'kofi.mensah@example.com',
    recipientName: 'Kofi Mensah',
    senderName: 'Alex Mercer',
    personalMessage: 'Enjoy the music tunes brother!',
    reloadlyTransactionId: 9840193,
    status: 'DELIVERED',
    paymentStatus: 'VERIFIED',
    deliveryStatus: 'DELIVERED',
    deliveryTimestamp: '2026-09-08T09:10:14Z',
    claimUrl: 'https://vouchr.com/claim/vcr-global-99182',
    createdAt: '2026-09-08T09:10:00Z',
    updatedAt: '2026-09-08T09:10:14Z',
    secureCodes: {
      claimCode: 'SPOT-3391-7721-0021',
      pin: '7721',
    },
  },
];

for (const o of INITIAL_DEMO_ORDERS) {
  ordersDatabase.set(o.orderId, o);
}

/**
 * Creates a new order in PENDING_PAYMENT status.
 */
export async function createOrder(input: CreateOrderInput): Promise<VouchrOrder> {
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const orderId = `ord_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const orderNumber = `VCR-${input.country.toUpperCase()}-${randomSuffix}`;
  const now = new Date().toISOString();

  const newOrder: VouchrOrder = {
    orderId,
    orderNumber,
    userId: input.userId || 'guest',
    reloadlyProductId: input.reloadlyProductId,
    brandName: input.brandName,
    productName: input.productName,
    productImage: input.productImage,
    country: input.country,
    currency: input.currency,
    amount: input.amount,
    quantity: input.quantity,
    customerEmail: input.customerEmail,
    recipientEmail: input.recipientEmail,
    recipientName: input.recipientName,
    senderName: input.senderName,
    personalMessage: input.personalMessage,
    status: 'PENDING_PAYMENT',
    paymentStatus: 'UNPAID',
    deliveryStatus: input.scheduledDate ? 'SCHEDULED' : 'PENDING',
    scheduledDate: input.scheduledDate,
    claimUrl: `https://vouchr.com/claim/${orderNumber.toLowerCase()}`,
    createdAt: now,
    updatedAt: now,
  };

  ordersDatabase.set(orderId, newOrder);
  return newOrder;
}

/**
 * Updates order status and audit properties.
 */
export async function updateOrder(
  orderId: string,
  updates: Partial<VouchrOrder>
): Promise<VouchrOrder | null> {
  const existing = ordersDatabase.get(orderId);
  if (!existing) return null;

  const updated: VouchrOrder = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  ordersDatabase.set(orderId, updated);
  return updated;
}

/**
 * Retrieves an order by ID.
 * Automatically sanitizes sensitive security credentials unless includeSecureCodes is explicitly set true.
 */
export async function getOrderById(
  orderId: string,
  includeSecureCodes = false
): Promise<VouchrOrder | null> {
  const order = ordersDatabase.get(orderId);
  if (!order) return null;

  if (includeSecureCodes) {
    return order;
  }

  // Sanitize out sensitive gift card PIN/codes
  const { secureCodes, ...sanitized } = order;
  return sanitized as VouchrOrder;
}

/**
 * Retrieves orders by customer email.
 */
export async function getOrdersByCustomer(
  customerEmail: string
): Promise<VouchrOrder[]> {
  const results: VouchrOrder[] = [];
  for (const order of ordersDatabase.values()) {
    if (order.customerEmail.toLowerCase() === customerEmail.toLowerCase()) {
      const { secureCodes, ...sanitized } = order;
      results.push(sanitized as VouchrOrder);
    }
  }
  return results.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Retrieves all orders (sanitized for dashboard).
 */
export async function getAllOrders(): Promise<VouchrOrder[]> {
  const results: VouchrOrder[] = [];
  for (const order of ordersDatabase.values()) {
    const { secureCodes, ...sanitized } = order;
    results.push(sanitized as VouchrOrder);
  }
  return results.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
