import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReloadlyTransaction extends Document {
  _id: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId | string;
  reloadlyTransactionId: number;
  reloadlyProductId: number;
  amount: number;
  currency: string;
  status: string;
  recipient?: string;
  responseMetadata?: Record<string, any>;
  purchasedAt: Date;
  createdAt: Date;
}

const ReloadlyTransactionSchema = new Schema<IReloadlyTransaction>(
  {
    orderId: {
      type: Schema.Types.Mixed,
      ref: 'Order',
      required: true,
      index: true,
    },
    reloadlyTransactionId: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    reloadlyProductId: {
      type: Number,
      required: true,
      index: true,
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
      required: true,
      trim: true,
    },
    recipient: {
      type: String,
      trim: true,
    },
    responseMetadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    purchasedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const ReloadlyTransaction: Model<IReloadlyTransaction> =
  mongoose.models.ReloadlyTransaction ||
  mongoose.model<IReloadlyTransaction>('ReloadlyTransaction', ReloadlyTransactionSchema);

export default ReloadlyTransaction;
