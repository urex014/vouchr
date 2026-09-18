import mongoose, { Schema, Document, Model } from 'mongoose';

export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
export type PurchaseStatus = 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED';
export type DeliveryStatus = 'PENDING' | 'PROCESSING' | 'DELIVERED' | 'FAILED';
export type GiftCardStatus = 'PENDING' | 'AVAILABLE' | 'REDEEMED' | 'EXPIRED' | 'FAILED';

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;
  orderNumber: string;
  userId?: mongoose.Types.ObjectId | string;
  productId?: mongoose.Types.ObjectId;
  reloadlyProductId: number;
  brandName: string;
  productName: string;
  productImage: string;
  country: string;
  currency: string;
  amount: number;
  quantity: number;
  subtotal: number;
  fees: number;
  total: number;
  customerEmail: string;
  customerName?: string;
  recipientEmail: string;
  recipientName?: string;
  personalMessage?: string;
  paymentId?: mongoose.Types.ObjectId | string;
  reloadlyTransactionId?: number;
  paymentStatus: PaymentStatus;
  purchaseStatus: PurchaseStatus;
  deliveryStatus: DeliveryStatus;
  giftCardStatus: GiftCardStatus;
  failureReason?: string;
  claimUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    userId: {
      type: Schema.Types.Mixed,
      ref: 'User',
      index: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    reloadlyProductId: {
      type: Number,
      required: true,
      index: true,
    },
    brandName: {
      type: String,
      required: true,
      trim: true,
    },
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    productImage: {
      type: String,
      default: '',
    },
    country: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    currency: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    fees: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    customerEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    customerName: {
      type: String,
      trim: true,
    },
    recipientEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    recipientName: {
      type: String,
      trim: true,
    },
    personalMessage: {
      type: String,
    },
    paymentId: {
      type: Schema.Types.Mixed,
      ref: 'Payment',
      index: true,
    },
    reloadlyTransactionId: {
      type: Number,
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'REFUNDED'],
      default: 'PENDING',
      index: true,
    },
    purchaseStatus: {
      type: String,
      enum: ['PENDING', 'PROCESSING', 'SUCCESS', 'FAILED'],
      default: 'PENDING',
      index: true,
    },
    deliveryStatus: {
      type: String,
      enum: ['PENDING', 'PROCESSING', 'DELIVERED', 'FAILED'],
      default: 'PENDING',
      index: true,
    },
    giftCardStatus: {
      type: String,
      enum: ['PENDING', 'AVAILABLE', 'REDEEMED', 'EXPIRED', 'FAILED'],
      default: 'PENDING',
      index: true,
    },
    failureReason: {
      type: String,
    },
    claimUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for admin search, user lookups, and lifecycle filtering
OrderSchema.index({ customerEmail: 1, createdAt: -1 });
OrderSchema.index({ paymentStatus: 1, purchaseStatus: 1 });
OrderSchema.index({ createdAt: -1 });

export const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
