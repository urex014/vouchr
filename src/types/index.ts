export type GiftCardCategory = 
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
  rateAgainstUSD: number; // 1 USD = rate
}

export interface GiftCard {
  id: string;
  slug: string;
  brand: string;
  tagline: string;
  description: string;
  category: GiftCardCategory;
  denominations: number[]; // in USD base
  minCustomAmount?: number;
  maxCustomAmount?: number;
  region: string;
  regionsSupported: string[];
  discountPercentage?: number; // e.g., 5% off
  isPopular?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  cardTheme: {
    bgGradient: string;
    textColor: string;
    accentColor: string;
    pattern?: string;
    badgeBg: string;
  };
  logoUrl: string;
  heroImage?: string;
  redemptionSteps: string[];
  termsAndConditions: string[];
  rating: number;
  reviewsCount: number;
}

export interface CartItem {
  id: string;
  giftCard: GiftCard;
  denomination: number; // in USD
  recipientType: 'other' | 'self';
  recipientName?: string;
  recipientEmail?: string;
  recipientPhone?: string;
  senderName?: string;
  message?: string;
  deliveryOption: 'instant' | 'scheduled';
  scheduledDate?: string;
  scheduledTime?: string;
  cardDesignSkin: 'classic' | 'warm-coral' | 'electric-neon' | 'midnight-velvet';
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: CartItem[];
  totalUSD: number;
  currency: CurrencyCode;
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
