import { connectToDatabase } from '@/lib/mongodb/connection';
import { Product, IProduct } from '@/models/Product';

export interface ProductQueryFilters {
  country?: string;
  category?: string;
  search?: string;
  isActive?: boolean;
}

export class ProductRepository {
  static async findAll(
    filters: ProductQueryFilters = {},
    options: { page?: number; limit?: number; sort?: any } = {}
  ): Promise<{ products: IProduct[]; total: number }> {
    await connectToDatabase();
    const query: any = {};

    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }
    if (filters.country && filters.country !== 'ALL' && filters.country !== 'GLOBAL') {
      query.$or = [{ country: filters.country.toUpperCase() }, { country: 'GLOBAL' }];
    } else if (filters.country === 'GLOBAL') {
      query.country = 'GLOBAL';
    }
    if (filters.category && filters.category !== 'All') {
      query.category = { $regex: new RegExp(`^${filters.category}$`, 'i') };
    }
    if (filters.search) {
      const searchRegex = new RegExp(filters.search.trim(), 'i');
      query.$or = [
        { brandName: searchRegex },
        { productName: searchRegex },
        { description: searchRegex },
      ];
    }

    const page = Math.max(1, options.page || 1);
    const limit = Math.min(100, Math.max(1, options.limit || 24));
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(options.sort || { brandName: 1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      Product.countDocuments(query).exec(),
    ]);

    return { products: products as unknown as IProduct[], total };
  }

  static async findById(id: string): Promise<IProduct | null> {
    await connectToDatabase();
    return Product.findById(id).exec();
  }

  static async findByReloadlyId(reloadlyProductId: number): Promise<IProduct | null> {
    await connectToDatabase();
    return Product.findOne({ reloadlyProductId }).exec();
  }

  static async upsert(productData: Partial<IProduct>): Promise<IProduct> {
    await connectToDatabase();
    return Product.findOneAndUpdate(
      { reloadlyProductId: productData.reloadlyProductId },
      {
        $set: {
          ...productData,
          lastSyncedAt: new Date(),
        },
      },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    ).exec() as Promise<IProduct>;
  }

  static async setActive(id: string, isActive: boolean): Promise<IProduct | null> {
    await connectToDatabase();
    return Product.findByIdAndUpdate(id, { isActive }, { returnDocument: 'after' }).exec();
  }

  static async count(query: any = {}): Promise<number> {
    await connectToDatabase();
    return Product.countDocuments(query).exec();
  }
}
