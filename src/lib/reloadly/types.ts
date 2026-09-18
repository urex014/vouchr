/**
 * Type definitions for the official Reloadly Gift Cards API and normalized internal domain models.
 * Reference: https://developers.reloadly.com/api.html#gift-cards
 */

// ==========================================
// 1. RELOADLY RAW API PAYLOADS
// ==========================================

export interface ReloadlyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope?: string;
}

export interface ReloadlyCountry {
  isoName: string;
  name: string;
  currencyCode: string;
  currencyName: string;
  currencySymbol: string;
  flagUrl: string;
}

export interface ReloadlyBrand {
  brandId: number;
  brandName: string;
}

export interface ReloadlyRedeemInstruction {
  concise: string;
  verbose: string;
}

export interface ReloadlyProduct {
  productId: number;
  productName: string;
  global: boolean;
  supportsPreOrder: boolean;
  senderFee: number;
  senderFeePercentage: number;
  discountPercentage: number;
  denominationType: 'FIXED' | 'RANGE';
  recipientCurrencyCode: string;
  minRecipientDenomination: number | null;
  maxRecipientDenomination: number | null;
  senderCurrencyCode: string;
  minSenderDenomination: number | null;
  maxSenderDenomination: number | null;
  fixedRecipientDenominations: number[];
  fixedSenderDenominations: number[];
  fixedRecipientToSenderDenominationsMap: Record<string, number>;
  logoUrls: string[];
  brand: ReloadlyBrand;
  country: ReloadlyCountry;
  redeemInstruction?: ReloadlyRedeemInstruction;
}

export interface ReloadlyOrderRequest {
  productId: number;
  countryCode: string;
  quantity: number;
  unitPrice: number;
  customIdentifier: string;
  senderName: string;
  recipientEmail: string;
  recipientPhoneDetails?: {
    countryCode: string;
    phoneNumber: string;
  };
}

export interface ReloadlyOrderResponse {
  transactionId: number;
  status: 'SUCCESSFUL' | 'PENDING' | 'REFUNDED' | 'FAILED';
  amount: number;
  discount: number;
  currencyCode: string;
  fee: number;
  smsFee: number;
  recipientEmail: string;
  customIdentifier: string;
  createdDate: string;
  product: {
    productId: number;
    productName: string;
    countryCode: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    currencyCode: string;
    brand: ReloadlyBrand;
  };
}

export interface ReloadlyCardCode {
  cardNumber?: string;
  pin?: string;
  claimCode?: string;
  barcodeUrl?: string;
  expiryDate?: string;
}

// ==========================================
// 2. NORMALIZED DOMAIN MODELS (UI CONSUMABLE)
// ==========================================

export interface NormalizedGiftCard {
  id: string; // stringified productId e.g. "120"
  numericId: number;
  slug?: string;
  brandName: string;
  brand: string;
  brandSlug: string;
  productName: string;
  brandLogo: string;
  logoUrl: string;
  productImage: string; // Actual gift-card artwork from Reloadly
  giftCardImage: string;
  giftCardUrl: string;
  category: string;
  country: string; // ISO 2-letter code e.g. "US", "NG", "GB"
  countryName: string;
  currency: string;
  currencySymbol: string;
  denominations: number[];
  minAmount: number;
  maxAmount: number;
  minCustomAmount?: number;
  maxCustomAmount?: number;
  fixedAmounts: number[];
  denominationType: 'FIXED' | 'RANGE';
  deliveryMethod: string;
  description: string;
  redemptionInstructions: string;
  redemptionInstructionsList?: string[];
  terms: string;
  termsAndConditions?: string[];
  isAvailable: boolean;
  available: boolean;
  availability: 'in_stock' | 'low_stock' | 'out_of_stock';
  discountPercentage?: number;
  global: boolean;
  region?: string;
  regionDisclaimer?: string;
  isPopular?: boolean;
  isTrending?: boolean;
  isBestSeller?: boolean;
  isRecentlyAdded?: boolean;
}

export interface ReloadlyProductFilter {
  countryCode?: string;
  country?: string;
  category?: string;
  brand?: string;
  search?: string;
  page?: number;
  size?: number;
  sortBy?: 'popular' | 'price_asc' | 'price_desc' | 'brand_asc' | 'discount';
}

export interface ReloadlyApiError {
  message: string;
  code?: string;
  statusCode: number;
  details?: any;
}
