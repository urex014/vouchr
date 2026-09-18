import { ProviderGiftCard, CountryCode, GiftCardCategory as ProviderCategory } from '@/lib/giftcards/types';

export type GiftCardCategory = 
  | 'Shopping'
  | 'Gaming'
  | 'Entertainment'
  | 'Food'
  | 'Travel'
  | 'Subscriptions'
  | 'Lifestyle'
  | 'Digital Services'
  | 'all'
  | 'gaming'
  | 'entertainment'
  | 'shopping'
  | 'food'
  | 'travel'
  | 'lifestyle'
  | 'subscriptions';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'NGN' | 'KES';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  label: string;
  flag: string;
  rateAgainstUSD: number;
}

export interface GiftCard {
  id: string;
  slug?: string;
  brand: string;
  brandSlug?: string;
  tagline?: string;
  description: string;
  category: any;
  denominations: number[];
  minCustomAmount?: number;
  maxCustomAmount?: number;
  region?: string;
  country?: string;
  regionsSupported?: string[];
  discountPercentage?: number;
  isPopular?: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  isNew?: boolean;
  cardTheme?: {
    bgGradient: string;
    textColor: string;
    accentColor: string;
    pattern?: string;
    badgeBg: string;
  };
  logoUrl: string;
  giftCardUrl?: string;
  redemptionSteps?: string[];
  termsAndConditions?: string[];
  rating?: number;
  reviewsCount?: number;
}

export interface CartItem {
  id: string;
  giftCard: ProviderGiftCard;
  denomination: number;
  quantity: number;
  recipientType: 'other' | 'self';
  recipientName?: string;
  recipientEmail?: string;
  recipientPhone?: string;
  senderName?: string;
  message?: string;
  deliveryOption: 'instant' | 'scheduled';
  scheduledDate?: string;
  scheduledTime?: string;
  cardDesignSkin?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: CartItem[];
  totalUSD: number;
  currency: string;
  totalInCurrency: number;
  paymentMethod: 'card' | 'apple_pay' | 'google_pay' | 'instant_bank' | 'mobile_money' | 'crypto';
  paymentStatus: 'completed' | 'processing' | 'refunded';
  deliveryStatus: 'delivered' | 'scheduled' | 'opened' | 'claimed';
  deliveryTimestamp: string;
  voucherCode: string;
  pinCode?: string;
  claimUrl: string;
}

export interface SavedRecipient {
  id: string;
  name: string;
  email: string;
  phone?: string;
  relationship: string;
  occasion?: string;
  occasionDate?: string;
  favoriteBrands: string[];
  totalGiftsSent: number;
}

export interface FaqItem {
  question: string;
  answer: string;
  category?: string;
}
