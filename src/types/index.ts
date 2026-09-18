import { NormalizedGiftCard, ReloadlyProductFilter } from '@/lib/reloadly/types';

export type GiftCard = NormalizedGiftCard;
export type ProviderGiftCard = NormalizedGiftCard;
export type { ReloadlyProductFilter };

export type GiftCardCategory =
  | 'Shopping'
  | 'Gaming'
  | 'Entertainment'
  | 'Food'
  | 'Travel'
  | 'Subscriptions'
  | 'Lifestyle'
  | 'Digital Services'
  | 'Fashion'
  | 'Department Store'
  | 'Sports'
  | 'Beauty'
  | 'All';

export type CountryCode = string;

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'NGN' | 'KES';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  label: string;
  flag: string;
  rateAgainstUSD: number;
}

export interface CartItem {
  id: string;
  giftCard: GiftCard;
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
  paymentMethod: 'crypto';
  paymentStatus: 'completed' | 'processing' | 'refunded';
  deliveryStatus: 'delivered' | 'scheduled' | 'opened' | 'claimed';
  deliveryTimestamp: string;
  voucherCode: string;
  pinCode?: string;
  claimUrl: string;
  cryptoTxHash?: string;
  explorerUrl?: string;
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
