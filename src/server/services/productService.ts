import { ProductRepository, ProductQueryFilters } from '../repositories/productRepository';
import { getReloadlyGiftCards } from '@/lib/reloadly/giftcards';
import { IProduct } from '@/models/Product';
import mongoose from 'mongoose';

export class ProductService {
  /**
   * Retrieves products from MongoDB. If cache is empty, automatically synchronizes from Reloadly.
   */
  static async getProducts(
    filters: ProductQueryFilters = {},
    options: { page?: number; limit?: number; sort?: any } = {}
  ): Promise<{ products: IProduct[]; total: number }> {
    const existingCount = await ProductRepository.count();
    if (existingCount === 0) {
      await this.syncReloadlyProducts();
    }

    return ProductRepository.findAll(filters, options);
  }

  /**
   * Retrieves a single product by MongoDB ID, brand slug, or numeric reloadlyProductId
   */
  static async getProductById(identifier: string | number): Promise<IProduct | null> {
    const existingCount = await ProductRepository.count();
    if (existingCount === 0) {
      await this.syncReloadlyProducts();
    }

    // 1. Try as numeric reloadlyProductId
    const numericId = Number(identifier);
    if (!isNaN(numericId) && numericId > 0) {
      const byReloadly = await ProductRepository.findByReloadlyId(numericId);
      if (byReloadly) return byReloadly;
    }

    // 2. Try as MongoDB ObjectId
    if (typeof identifier === 'string' && mongoose.Types.ObjectId.isValid(identifier)) {
      const byId = await ProductRepository.findById(identifier);
      if (byId) return byId;
    }

    // 3. Try matching brandName or brandSlug
    const searchString = String(identifier).replace(/-/g, ' ');
    const { products } = await ProductRepository.findAll(
      { search: searchString },
      { limit: 1 }
    );
    return products[0] || null;
  }

  /**
   * Synchronizes and normalizes external Reloadly gift-card catalog into MongoDB
   */
  static async syncReloadlyProducts(): Promise<{ syncedCount: number }> {
    try {
      const reloadlyProducts = await getReloadlyGiftCards({ size: 100 });
      let syncedCount = 0;

      for (const item of reloadlyProducts) {
        await ProductRepository.upsert({
          reloadlyProductId: item.numericId,
          brandName: item.brandName || item.brand,
          productName: item.productName || item.brand,
          brandLogo: item.brandLogo || item.logoUrl || '',
          productImage: item.productImage || item.giftCardUrl || '',
          description: item.description || `Official ${item.brandName} digital voucher.`,
          category: item.category || 'Shopping',
          country: item.country || 'GLOBAL',
          currency: item.currency || 'USD',
          minAmount: item.minAmount || 10,
          maxAmount: item.maxAmount || 500,
          fixedAmounts: item.fixedAmounts || [],
          denominationType: item.denominationType === 'FIXED' ? 'FIXED' : 'RANGE',
          deliveryMethod: 'digital',
          isActive: true,
          lastSyncedAt: new Date(),
        });
        syncedCount++;
      }

      console.info(`[ProductService] Synchronized ${syncedCount} Reloadly products to MongoDB.`);
      return { syncedCount };
    } catch (err: any) {
      console.error('[ProductService] Reloadly sync error:', err.message);
      return { syncedCount: 0 };
    }
  }

  /**
   * Admin toggle to enable or disable products
   */
  static async toggleProductActive(id: string, isActive: boolean): Promise<IProduct | null> {
    return ProductRepository.setActive(id, isActive);
  }
}
