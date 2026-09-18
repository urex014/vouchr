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
    try {
      const existingCount = await ProductRepository.count();
      if (existingCount === 0) {
        await this.syncReloadlyProducts();
      }
      return await ProductRepository.findAll(filters, options);
    } catch (dbErr: any) {
      console.warn('[ProductService] Database unavailable, serving catalog directly from Reloadly provider:', dbErr.message);
      const reloadlyProducts = await getReloadlyGiftCards({
        country: filters.country,
        category: filters.category,
        search: filters.search,
        size: options.limit || 30,
      });

      const mappedProducts = reloadlyProducts.map((item) => ({
        _id: String(item.numericId),
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
        denominationType: (item.denominationType === 'FIXED' ? 'FIXED' : 'RANGE') as 'FIXED' | 'RANGE',
        deliveryMethod: 'digital' as const,
        isActive: true,
        lastSyncedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })) as unknown as IProduct[];

      return {
        products: mappedProducts,
        total: mappedProducts.length,
      };
    }
  }

  /**
   * Retrieves a single product by MongoDB ID, brand slug, or numeric reloadlyProductId
   */
  static async getProductById(identifier: string | number): Promise<IProduct | null> {
    try {
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
    } catch (dbErr: any) {
      console.warn('[ProductService] Database unavailable, resolving product from Reloadly provider:', dbErr.message);
      const reloadlyProducts = await getReloadlyGiftCards({ size: 100 });
      const found = reloadlyProducts.find(
        (p) =>
          String(p.numericId) === String(identifier) ||
          p.brandSlug.toLowerCase() === String(identifier).toLowerCase() ||
          p.brandName.toLowerCase().replace(/\s+/g, '-') === String(identifier).toLowerCase()
      );
      if (!found) return null;

      return {
        _id: String(found.numericId),
        reloadlyProductId: found.numericId,
        brandName: found.brandName || found.brand,
        productName: found.productName || found.brand,
        brandLogo: found.brandLogo || found.logoUrl || '',
        productImage: found.productImage || found.giftCardUrl || '',
        description: found.description || `Official ${found.brandName} digital voucher.`,
        category: found.category || 'Shopping',
        country: found.country || 'GLOBAL',
        currency: found.currency || 'USD',
        minAmount: found.minAmount || 10,
        maxAmount: found.maxAmount || 500,
        fixedAmounts: found.fixedAmounts || [],
        denominationType: (found.denominationType === 'FIXED' ? 'FIXED' : 'RANGE') as 'FIXED' | 'RANGE',
        deliveryMethod: 'digital' as const,
        isActive: true,
        lastSyncedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      } as unknown as IProduct;
    }
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
