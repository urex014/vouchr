import mongoose, { Schema, Document, Model } from 'mongoose';

export type VoucherStatus = 'PENDING' | 'AVAILABLE' | 'REDEEMED' | 'EXPIRED' | 'FAILED';

export interface IGiftCard extends Document {
  _id: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId | string;
  reloadlyTransactionId?: number;
  productId?: number;
  brandName: string;
  amount: number;
  currency: string;
  recipientEmail: string;
  code?: string;
  pin?: string;
  redemptionUrl?: string;
  expiresAt?: Date;
  status: VoucherStatus;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const GiftCardSchema = new Schema<IGiftCard>(
  {
    orderId: {
      type: Schema.Types.Mixed,
      ref: 'Order',
      required: true,
      index: true,
    },
    reloadlyTransactionId: {
      type: Number,
      index: true,
    },
    productId: {
      type: Number,
    },
    brandName: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    recipientEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    // Sensitive codes: NEVER returned in default queries or public APIs
    code: {
      type: String,
      select: false,
    },
    pin: {
      type: String,
      select: false,
    },
    redemptionUrl: {
      type: String,
    },
    expiresAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['PENDING', 'AVAILABLE', 'REDEEMED', 'EXPIRED', 'FAILED'],
      default: 'AVAILABLE',
      index: true,
    },
    deliveredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

GiftCardSchema.index({ orderId: 1, status: 1 });

export const GiftCard: Model<IGiftCard> =
  mongoose.models.GiftCard || mongoose.model<IGiftCard>('GiftCard', GiftCardSchema);

export default GiftCard;
