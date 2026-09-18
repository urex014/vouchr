export type GiftCardCategory =
  | 'Shopping'
  | 'Gaming'
  | 'Entertainment'
  | 'Food'
  | 'Travel'
  | 'Subscriptions'
  | 'Lifestyle'
  | 'Digital Services';

export type CountryCode = 'US' | 'UK' | 'NG' | 'EU' | 'KE' | 'GLOBAL';

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  category: GiftCardCategory;
  countriesAvailable: CountryCode[];
}

export interface ProviderGiftCard {
  id: string; // e.g. "amazon-us"
  brand: string; // e.g. "Amazon"
  brandSlug: string;
  logoUrl: string;
  giftCardUrl: string; // Actual gift-card artwork URL
  category: GiftCardCategory;
  country: CountryCode;
  countryName: string;
  currency: string;
  currencySymbol: string;
  denominations: number[];
  minCustomAmount?: number;
  maxCustomAmount?: number;
  deliveryMethod: 'digital' | 'scheduled';
  availability: 'in_stock' | 'low_stock' | 'out_of_stock';
  isPopular?: boolean;
  isTrending?: boolean;
  isBestSeller?: boolean;
  isRecentlyAdded?: boolean;
  discountPercentage?: number;
  description: string;
  redemptionInstructions: string[];
  termsAndConditions: string[];
  regionDisclaimer: string;
}

export interface GiftCardFilter {
  category?: GiftCardCategory | 'All';
  country?: CountryCode | 'ALL';
  brand?: string;
  search?: string;
  tag?: 'popular' | 'trending' | 'gaming' | 'shopping' | 'entertainment' | 'bestsellers' | 'recently_added';
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'popular' | 'price_asc' | 'price_desc' | 'brand_asc' | 'newest';
}

export interface PurchaseRequest {
  productId: string;
  denomination: number;
  quantity: number;
  recipientEmail: string;
  recipientName: string;
  senderName: string;
  senderEmail: string;
  message?: string;
  scheduledDeliveryDate?: string;
}

export interface PurchaseResponse {
  success: boolean;
  orderId: string;
  orderNumber: string;
  createdAt: string;
  productId: string;
  brand: string;
  denomination: number;
  currency: string;
  recipientEmail: string;
  recipientName: string;
  deliveryMethod: string;
  deliveryStatus: 'delivered' | 'processing' | 'scheduled';
  deliveryEstimatedSeconds: number;
  claimUrl: string;
  // Security protocol: gift card voucher code and pin are held server-side
  // and only delivered to recipient or securely viewed by authenticated cardholder
  isCodeSecured: boolean;
}
