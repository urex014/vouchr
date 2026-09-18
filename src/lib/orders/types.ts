export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PAYMENT_SUCCESS'
  | 'PURCHASING'
  | 'PURCHASED'
  | 'DELIVERED'
  | 'FAILED'
  | 'REFUNDED';

export interface VouchrOrder {
  orderId: string;
  orderNumber: string;
  userId: string;
  reloadlyProductId: number;
  brandName: string;
  productName: string;
  productImage: string;
  country: string;
  currency: string;
  amount: number;
  quantity: number;
  customerEmail: string;
  recipientEmail: string;
  recipientName: string;
  senderName: string;
  personalMessage?: string;
  reloadlyTransactionId?: number;
  status: OrderStatus;
  paymentStatus: 'UNPAID' | 'VERIFIED' | 'REFUNDED' | 'FAILED';
  paymentMethod?: string;
  cryptoTxHash?: string;
  explorerUrl?: string;
  deliveryStatus: 'PENDING' | 'DISPATCHED' | 'DELIVERED' | 'SCHEDULED';
  deliveryTimestamp?: string;
  scheduledDate?: string;
  claimUrl: string;
  createdAt: string;
  updatedAt: string;
  // Encrypted / Server-held credentials (NEVER returned in public API payloads)
  secureCodes?: {
    cardNumber?: string;
    pin?: string;
    claimCode?: string;
  };
}

export interface CreateOrderInput {
  userId?: string;
  reloadlyProductId: number;
  brandName: string;
  productName: string;
  productImage: string;
  country: string;
  currency: string;
  amount: number;
  quantity: number;
  customerEmail: string;
  recipientEmail: string;
  recipientName: string;
  senderName: string;
  personalMessage?: string;
  scheduledDate?: string;
}
