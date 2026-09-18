import mongoose, { Schema, Document, Model } from 'mongoose';

export type PaymentRecordStatus = 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

export interface IPayment extends Document {
  _id: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId | string;
  userId?: mongoose.Types.ObjectId | string;
  provider: string;
  providerReference: string;
  amount: number;
  currency: string;
  status: PaymentRecordStatus;
  channel?: string;
  paidAt?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    orderId: {
      type: Schema.Types.Mixed,
      ref: 'Order',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.Mixed,
      ref: 'User',
      index: true,
    },
    provider: {
      type: String,
      required: true,
      trim: true,
    },
    providerReference: {
      type: String,
      required: true,
      unique: true,
      index: true,
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
    status: {
      type: String,
      enum: ['PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'REFUNDED'],
      default: 'PENDING',
      index: true,
    },
    channel: {
      type: String,
      trim: true,
    },
    paidAt: {
      type: Date,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

PaymentSchema.index({ orderId: 1, providerReference: 1 });
PaymentSchema.index({ createdAt: -1 });

export const Payment: Model<IPayment> =
  mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);

export default Payment;
