import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId;
  reloadlyProductId: number;
  brandName: string;
  productName: string;
  brandLogo: string;
  productImage: string;
  description: string;
  category: string;
  country: string;
  currency: string;
  minAmount: number;
  maxAmount: number;
  fixedAmounts: number[];
  denominationType: 'FIXED' | 'RANGE';
  deliveryMethod: string;
  isActive: boolean;
  lastSyncedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    reloadlyProductId: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    brandName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    brandLogo: {
      type: String,
      default: '',
    },
    productImage: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    country: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    currency: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    minAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    maxAmount: {
      type: Number,
      required: true,
      default: 0,
    },
    fixedAmounts: {
      type: [Number],
      default: [],
    },
    denominationType: {
      type: String,
      enum: ['FIXED', 'RANGE'],
      default: 'FIXED',
    },
    deliveryMethod: {
      type: String,
      default: 'digital',
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    lastSyncedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for fast marketplace lookups
ProductSchema.index({ country: 1, category: 1, isActive: 1 });
ProductSchema.index({ brandName: 1, country: 1 });

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
