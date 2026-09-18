import {
  ProviderGiftCard,
  Brand,
  GiftCardFilter,
  PurchaseRequest,
  PurchaseResponse,
} from './types';

/**
 * Interface representing a gift-card supplier provider (e.g. Tillo, Reloadly, Bitrefill).
 * The UI and service layers communicate exclusively through this interface,
 * allowing seamless switching of providers without touching frontend components.
 */
export interface GiftCardProvider {
  /**
   * Retrieves all available partner brands supported by the provider.
   */
  getBrands(): Promise<Brand[]>;

  /**
   * Retrieves gift card products with optional filtering.
   */
  getGiftCards(filter?: GiftCardFilter): Promise<ProviderGiftCard[]>;

  /**
   * Retrieves a single gift card product by its unique provider ID.
   */
  getGiftCard(id: string): Promise<ProviderGiftCard | null>;

  /**
   * Retrieves valid denominations for a specific gift card product.
   */
  getDenominations(id: string): Promise<number[]>;

  /**
   * Checks inventory and provider availability for a product and denomination.
   */
  checkAvailability(id: string, denomination: number): Promise<boolean>;

  /**
   * Executes a gift card order securely through the provider API.
   * Keeps sensitive API credentials strictly server-side.
   */
  purchaseGiftCard(request: PurchaseRequest): Promise<PurchaseResponse>;
}
