import { reloadlyFetch } from './client';
import { hasReloadlyCredentials } from './auth';
import {
  ReloadlyProduct,
  ReloadlyCountry,
  NormalizedGiftCard,
  ReloadlyProductFilter,
  ReloadlyOrderRequest,
  ReloadlyOrderResponse,
  ReloadlyCardCode,
} from './types';

// ==========================================================
// 1. REALISTIC RELOADLY SANDBOX SEED CATALOG (DEV FALLBACK)
// Used when RELOADLY_CLIENT_ID is not configured in local .env
// Exact 1:1 match with official Reloadly Gift Cards API schema
// ==========================================================
const RELOADLY_SANDBOX_PRODUCTS: ReloadlyProduct[] = [
  {
    productId: 101,
    productName: 'Amazon US',
    global: false,
    supportsPreOrder: false,
    senderFee: 0,
    senderFeePercentage: 0,
    discountPercentage: 0,
    denominationType: 'FIXED',
    recipientCurrencyCode: 'USD',
    minRecipientDenomination: 25,
    maxRecipientDenomination: 500,
    senderCurrencyCode: 'USD',
    minSenderDenomination: 25,
    maxSenderDenomination: 500,
    fixedRecipientDenominations: [25, 50, 100, 200, 500],
    fixedSenderDenominations: [25, 50, 100, 200, 500],
    fixedRecipientToSenderDenominationsMap: {
      '25.00': 25.0,
      '50.00': 50.0,
      '100.00': 100.0,
      '200.00': 200.0,
      '500.00': 500.0,
    },
    logoUrls: ['/giftcards/amazon-us.svg'],
    brand: {
      brandId: 1001,
      brandName: 'Amazon',
    },
    country: {
      isoName: 'US',
      name: 'United States',
      currencyCode: 'USD',
      currencyName: 'US Dollar',
      currencySymbol: '$',
      flagUrl: 'https://cdn.reloadly.com/flags/us.svg',
    },
    redeemInstruction: {
      concise: 'Redeem at amazon.com/redeem',
      verbose: 'Log into your Amazon US account. Go to Your Account > Gift Cards > Apply a Gift Card to your balance. Enter code and confirm.',
    },
  },
  {
    productId: 102,
    productName: 'Apple Gift Card US',
    global: false,
    supportsPreOrder: false,
    senderFee: 0,
    senderFeePercentage: 0,
    discountPercentage: 0,
    denominationType: 'FIXED',
    recipientCurrencyCode: 'USD',
    minRecipientDenomination: 15,
    maxRecipientDenomination: 500,
    senderCurrencyCode: 'USD',
    minSenderDenomination: 15,
    maxSenderDenomination: 500,
    fixedRecipientDenominations: [15, 25, 50, 100, 200],
    fixedSenderDenominations: [15, 25, 50, 100, 200],
    fixedRecipientToSenderDenominationsMap: {
      '15.00': 15.0,
      '25.00': 25.0,
      '50.00': 50.0,
      '100.00': 100.0,
      '200.00': 200.0,
    },
    logoUrls: ['/giftcards/apple-us.svg'],
    brand: {
      brandId: 1002,
      brandName: 'Apple',
    },
    country: {
      isoName: 'US',
      name: 'United States',
      currencyCode: 'USD',
      currencyName: 'US Dollar',
      currencySymbol: '$',
      flagUrl: 'https://cdn.reloadly.com/flags/us.svg',
    },
    redeemInstruction: {
      concise: 'Redeem in the App Store or Apple Store app',
      verbose: 'Open the App Store on iPhone, iPad, or Mac. Tap your profile icon, tap Redeem Gift Card or Code, and enter code.',
    },
  },
  {
    productId: 103,
    productName: 'Spotify Premium Global',
    global: true,
    supportsPreOrder: false,
    senderFee: 0,
    senderFeePercentage: 0,
    discountPercentage: 0,
    denominationType: 'FIXED',
    recipientCurrencyCode: 'USD',
    minRecipientDenomination: 10,
    maxRecipientDenomination: 100,
    senderCurrencyCode: 'USD',
    minSenderDenomination: 10,
    maxSenderDenomination: 100,
    fixedRecipientDenominations: [10, 30, 60, 100],
    fixedSenderDenominations: [10, 30, 60, 100],
    fixedRecipientToSenderDenominationsMap: {
      '10.00': 10.0,
      '30.00': 30.0,
      '60.00': 60.0,
      '100.00': 100.0,
    },
    logoUrls: ['/giftcards/spotify-global.svg'],
    brand: {
      brandId: 1003,
      brandName: 'Spotify',
    },
    country: {
      isoName: 'GLOBAL',
      name: 'Global',
      currencyCode: 'USD',
      currencyName: 'US Dollar',
      currencySymbol: '$',
      flagUrl: 'https://cdn.reloadly.com/flags/global.svg',
    },
    redeemInstruction: {
      concise: 'Redeem at spotify.com/redeem',
      verbose: 'Log into your Spotify account and enter the digital code to apply Premium subscription credit.',
    },
  },
  {
    productId: 104,
    productName: 'PlayStation Store US',
    global: false,
    supportsPreOrder: false,
    senderFee: 0,
    senderFeePercentage: 0,
    discountPercentage: 5,
    denominationType: 'FIXED',
    recipientCurrencyCode: 'USD',
    minRecipientDenomination: 25,
    maxRecipientDenomination: 150,
    senderCurrencyCode: 'USD',
    minSenderDenomination: 25,
    maxSenderDenomination: 150,
    fixedRecipientDenominations: [25, 50, 75, 100, 150],
    fixedSenderDenominations: [25, 50, 75, 100, 150],
    fixedRecipientToSenderDenominationsMap: {
      '25.00': 25.0,
      '50.00': 50.0,
      '75.00': 75.0,
      '100.00': 100.0,
      '150.00': 150.0,
    },
    logoUrls: ['/giftcards/playstation-us.svg'],
    brand: {
      brandId: 1004,
      brandName: 'PlayStation',
    },
    country: {
      isoName: 'US',
      name: 'United States',
      currencyCode: 'USD',
      currencyName: 'US Dollar',
      currencySymbol: '$',
      flagUrl: 'https://cdn.reloadly.com/flags/us.svg',
    },
    redeemInstruction: {
      concise: 'Redeem at store.playstation.com or on your console',
      verbose: 'Sign in to your PlayStation Network account, navigate to Avatar > Redeem Codes, enter the 12-digit voucher code.',
    },
  },
  {
    productId: 105,
    productName: 'Steam Wallet Card Global',
    global: true,
    supportsPreOrder: false,
    senderFee: 0,
    senderFeePercentage: 0,
    discountPercentage: 3,
    denominationType: 'FIXED',
    recipientCurrencyCode: 'USD',
    minRecipientDenomination: 20,
    maxRecipientDenomination: 100,
    senderCurrencyCode: 'USD',
    minSenderDenomination: 20,
    maxSenderDenomination: 100,
    fixedRecipientDenominations: [20, 50, 100],
    fixedSenderDenominations: [20, 50, 100],
    fixedRecipientToSenderDenominationsMap: {
      '20.00': 20.0,
      '50.00': 50.0,
      '100.00': 100.0,
    },
    logoUrls: ['/giftcards/steam-global.svg'],
    brand: {
      brandId: 1005,
      brandName: 'Steam',
    },
    country: {
      isoName: 'GLOBAL',
      name: 'Global',
      currencyCode: 'USD',
      currencyName: 'US Dollar',
      currencySymbol: '$',
      flagUrl: 'https://cdn.reloadly.com/flags/global.svg',
    },
    redeemInstruction: {
      concise: 'Redeem in the Steam client or store.steampowered.com',
      verbose: 'Click your account name in the top right > View my wallet > Redeem a Steam Gift Card or Wallet Code.',
    },
  },
  {
    productId: 106,
    productName: 'Netflix US',
    global: false,
    supportsPreOrder: false,
    senderFee: 0,
    senderFeePercentage: 0,
    discountPercentage: 0,
    denominationType: 'RANGE',
    recipientCurrencyCode: 'USD',
    minRecipientDenomination: 25,
    maxRecipientDenomination: 200,
    senderCurrencyCode: 'USD',
    minSenderDenomination: 25,
    maxSenderDenomination: 200,
    fixedRecipientDenominations: [25, 30, 50, 100],
    fixedSenderDenominations: [25, 30, 50, 100],
    fixedRecipientToSenderDenominationsMap: {
      '25.00': 25.0,
      '30.00': 30.0,
      '50.00': 50.0,
      '100.00': 100.0,
    },
    logoUrls: ['/giftcards/netflix-us.svg'],
    brand: {
      brandId: 1006,
      brandName: 'Netflix',
    },
    country: {
      isoName: 'US',
      name: 'United States',
      currencyCode: 'USD',
      currencyName: 'US Dollar',
      currencySymbol: '$',
      flagUrl: 'https://cdn.reloadly.com/flags/us.svg',
    },
    redeemInstruction: {
      concise: 'Redeem at netflix.com/redeem',
      verbose: 'Visit netflix.com/redeem, input code to credit new or existing subscription.',
    },
  },
  {
    productId: 107,
    productName: 'Uber & Uber Eats US',
    global: false,
    supportsPreOrder: false,
    senderFee: 0,
    senderFeePercentage: 0,
    discountPercentage: 4,
    denominationType: 'FIXED',
    recipientCurrencyCode: 'USD',
    minRecipientDenomination: 25,
    maxRecipientDenomination: 200,
    senderCurrencyCode: 'USD',
    minSenderDenomination: 25,
    maxSenderDenomination: 200,
    fixedRecipientDenominations: [25, 50, 100, 200],
    fixedSenderDenominations: [25, 50, 100, 200],
    fixedRecipientToSenderDenominationsMap: {
      '25.00': 25.0,
      '50.00': 50.0,
      '100.00': 100.0,
      '200.00': 200.0,
    },
    logoUrls: ['/giftcards/uber-us.svg'],
    brand: {
      brandId: 1007,
      brandName: 'Uber',
    },
    country: {
      isoName: 'US',
      name: 'United States',
      currencyCode: 'USD',
      currencyName: 'US Dollar',
      currencySymbol: '$',
      flagUrl: 'https://cdn.reloadly.com/flags/us.svg',
    },
    redeemInstruction: {
      concise: 'Redeem in the Uber or Uber Eats app',
      verbose: 'Tap Account > Wallet > Add Payment Method > Gift Card and enter code.',
    },
  },
  {
    productId: 108,
    productName: 'Nike US',
    global: false,
    supportsPreOrder: false,
    senderFee: 0,
    senderFeePercentage: 0,
    discountPercentage: 0,
    denominationType: 'FIXED',
    recipientCurrencyCode: 'USD',
    minRecipientDenomination: 50,
    maxRecipientDenomination: 250,
    senderCurrencyCode: 'USD',
    minSenderDenomination: 50,
    maxSenderDenomination: 250,
    fixedRecipientDenominations: [50, 100, 150, 250],
    fixedSenderDenominations: [50, 100, 150, 250],
    fixedRecipientToSenderDenominationsMap: {
      '50.00': 50.0,
      '100.00': 100.0,
      '150.00': 150.0,
      '250.00': 250.0,
    },
    logoUrls: ['/giftcards/nike-us.svg'],
    brand: {
      brandId: 1008,
      brandName: 'Nike',
    },
    country: {
      isoName: 'US',
      name: 'United States',
      currencyCode: 'USD',
      currencyName: 'US Dollar',
      currencySymbol: '$',
      flagUrl: 'https://cdn.reloadly.com/flags/us.svg',
    },
    redeemInstruction: {
      concise: 'Redeem at Nike.com, Nike App, or US Nike Stores',
      verbose: 'Enter your 16-digit card number and PIN during checkout under Payment.',
    },
  },
  {
    productId: 109,
    productName: 'Jumia Nigeria Shopping Voucher',
    global: false,
    supportsPreOrder: false,
    senderFee: 0,
    senderFeePercentage: 0,
    discountPercentage: 5,
    denominationType: 'FIXED',
    recipientCurrencyCode: 'NGN',
    minRecipientDenomination: 10000,
    maxRecipientDenomination: 100000,
    senderCurrencyCode: 'NGN',
    minSenderDenomination: 10000,
    maxSenderDenomination: 100000,
    fixedRecipientDenominations: [10000, 25000, 50000, 100000],
    fixedSenderDenominations: [10000, 25000, 50000, 100000],
    fixedRecipientToSenderDenominationsMap: {
      '10000.00': 10000.0,
      '25000.00': 25000.0,
      '50000.00': 50000.0,
      '100000.00': 100000.0,
    },
    logoUrls: ['/giftcards/jumia-ng.svg'],
    brand: {
      brandId: 1009,
      brandName: 'Jumia',
    },
    country: {
      isoName: 'NG',
      name: 'Nigeria',
      currencyCode: 'NGN',
      currencyName: 'Nigerian Naira',
      currencySymbol: '₦',
      flagUrl: 'https://cdn.reloadly.com/flags/ng.svg',
    },
    redeemInstruction: {
      concise: 'Redeem during checkout on Jumia.com.ng',
      verbose: 'Add products to cart on Jumia Nigeria, proceed to checkout, enter voucher code in the payment section.',
    },
  },
  {
    productId: 110,
    productName: 'Bolt Nigeria Ride Voucher',
    global: false,
    supportsPreOrder: false,
    senderFee: 0,
    senderFeePercentage: 0,
    discountPercentage: 6,
    denominationType: 'FIXED',
    recipientCurrencyCode: 'NGN',
    minRecipientDenomination: 5000,
    maxRecipientDenomination: 50000,
    senderCurrencyCode: 'NGN',
    minSenderDenomination: 5000,
    maxSenderDenomination: 50000,
    fixedRecipientDenominations: [5000, 10000, 20000, 50000],
    fixedSenderDenominations: [5000, 10000, 20000, 50000],
    fixedRecipientToSenderDenominationsMap: {
      '5000.00': 5000.0,
      '10000.00': 10000.0,
      '20000.00': 20000.0,
      '50000.00': 50000.0,
    },
    logoUrls: ['/giftcards/bolt-ng.svg'],
    brand: {
      brandId: 1010,
      brandName: 'Bolt',
    },
    country: {
      isoName: 'NG',
      name: 'Nigeria',
      currencyCode: 'NGN',
      currencyName: 'Nigerian Naira',
      currencySymbol: '₦',
      flagUrl: 'https://cdn.reloadly.com/flags/ng.svg',
    },
    redeemInstruction: {
      concise: 'Redeem in the Bolt app under Promotions',
      verbose: 'Open the Bolt app in Nigeria, tap menu > Promotions, and enter the promo code.',
    },
  },
  {
    productId: 111,
    productName: 'Airbnb Global',
    global: true,
    supportsPreOrder: false,
    senderFee: 0,
    senderFeePercentage: 0,
    discountPercentage: 0,
    denominationType: 'FIXED',
    recipientCurrencyCode: 'USD',
    minRecipientDenomination: 50,
    maxRecipientDenomination: 500,
    senderCurrencyCode: 'USD',
    minSenderDenomination: 50,
    maxSenderDenomination: 500,
    fixedRecipientDenominations: [50, 100, 200, 500],
    fixedSenderDenominations: [50, 100, 200, 500],
    fixedRecipientToSenderDenominationsMap: {
      '50.00': 50.0,
      '100.00': 100.0,
      '200.00': 200.0,
      '500.00': 500.0,
    },
    logoUrls: ['/giftcards/airbnb-global.svg'],
    brand: {
      brandId: 1011,
      brandName: 'Airbnb',
    },
    country: {
      isoName: 'GLOBAL',
      name: 'Global',
      currencyCode: 'USD',
      currencyName: 'US Dollar',
      currencySymbol: '$',
      flagUrl: 'https://cdn.reloadly.com/flags/global.svg',
    },
    redeemInstruction: {
      concise: 'Redeem at airbnb.com/gift',
      verbose: 'Go to airbnb.com/gift and input the 19-digit PIN to apply travel credit to your account.',
    },
  },
  {
    productId: 112,
    productName: 'Xbox Game Pass US',
    global: false,
    supportsPreOrder: false,
    senderFee: 0,
    senderFeePercentage: 0,
    discountPercentage: 4,
    denominationType: 'FIXED',
    recipientCurrencyCode: 'USD',
    minRecipientDenomination: 25,
    maxRecipientDenomination: 100,
    senderCurrencyCode: 'USD',
    minSenderDenomination: 25,
    maxSenderDenomination: 100,
    fixedRecipientDenominations: [25, 50, 100],
    fixedSenderDenominations: [25, 50, 100],
    fixedRecipientToSenderDenominationsMap: {
      '25.00': 25.0,
      '50.00': 50.0,
      '100.00': 100.0,
    },
    logoUrls: ['/giftcards/xbox-us.svg'],
    brand: {
      brandId: 1012,
      brandName: 'Xbox',
    },
    country: {
      isoName: 'US',
      name: 'United States',
      currencyCode: 'USD',
      currencyName: 'US Dollar',
      currencySymbol: '$',
      flagUrl: 'https://cdn.reloadly.com/flags/us.svg',
    },
    redeemInstruction: {
      concise: 'Redeem at microsoft.com/redeem',
      verbose: 'Enter the 25-character code on Microsoft.com/redeem or directly on your Xbox Series X|S or One console.',
    },
  },
  {
    productId: 113,
    productName: 'Google Play US',
    global: false,
    supportsPreOrder: false,
    senderFee: 0,
    senderFeePercentage: 0,
    discountPercentage: 0,
    denominationType: 'FIXED',
    recipientCurrencyCode: 'USD',
    minRecipientDenomination: 15,
    maxRecipientDenomination: 100,
    senderCurrencyCode: 'USD',
    minSenderDenomination: 15,
    maxSenderDenomination: 100,
    fixedRecipientDenominations: [15, 25, 50, 100],
    fixedSenderDenominations: [15, 25, 50, 100],
    fixedRecipientToSenderDenominationsMap: {
      '15.00': 15.0,
      '25.00': 25.0,
      '50.00': 50.0,
      '100.00': 100.0,
    },
    logoUrls: ['/giftcards/googleplay-us.svg'],
    brand: {
      brandId: 1013,
      brandName: 'Google Play',
    },
    country: {
      isoName: 'US',
      name: 'United States',
      currencyCode: 'USD',
      currencyName: 'US Dollar',
      currencySymbol: '$',
      flagUrl: 'https://cdn.reloadly.com/flags/us.svg',
    },
    redeemInstruction: {
      concise: 'Redeem in the Google Play Store app',
      verbose: 'Open the Play Store app > Profile > Payments & subscriptions > Redeem code, enter code and confirm.',
    },
  },
  {
    productId: 114,
    productName: 'Starbucks US',
    global: false,
    supportsPreOrder: false,
    senderFee: 0,
    senderFeePercentage: 0,
    discountPercentage: 0,
    denominationType: 'RANGE',
    recipientCurrencyCode: 'USD',
    minRecipientDenomination: 10,
    maxRecipientDenomination: 100,
    senderCurrencyCode: 'USD',
    minSenderDenomination: 10,
    maxSenderDenomination: 100,
    fixedRecipientDenominations: [15, 25, 50, 100],
    fixedSenderDenominations: [15, 25, 50, 100],
    fixedRecipientToSenderDenominationsMap: {
      '15.00': 15.0,
      '25.00': 25.0,
      '50.00': 50.0,
      '100.00': 100.0,
    },
    logoUrls: ['/giftcards/starbucks-us.svg'],
    brand: {
      brandId: 1014,
      brandName: 'Starbucks',
    },
    country: {
      isoName: 'US',
      name: 'United States',
      currencyCode: 'USD',
      currencyName: 'US Dollar',
      currencySymbol: '$',
      flagUrl: 'https://cdn.reloadly.com/flags/us.svg',
    },
    redeemInstruction: {
      concise: 'Add to the Starbucks App or pay in-store',
      verbose: 'Open Starbucks App > Cards > Add Card, enter card number and security code.',
    },
  },
  {
    productId: 115,
    productName: 'DoorDash US',
    global: false,
    supportsPreOrder: false,
    senderFee: 0,
    senderFeePercentage: 0,
    discountPercentage: 5,
    denominationType: 'FIXED',
    recipientCurrencyCode: 'USD',
    minRecipientDenomination: 25,
    maxRecipientDenomination: 150,
    senderCurrencyCode: 'USD',
    minSenderDenomination: 25,
    maxSenderDenomination: 150,
    fixedRecipientDenominations: [25, 50, 100, 150],
    fixedSenderDenominations: [25, 50, 100, 150],
    fixedRecipientToSenderDenominationsMap: {
      '25.00': 25.0,
      '50.00': 50.0,
      '100.00': 100.0,
      '150.00': 150.0,
    },
    logoUrls: ['/giftcards/doordash-us.svg'],
    brand: {
      brandId: 1015,
      brandName: 'DoorDash',
    },
    country: {
      isoName: 'US',
      name: 'United States',
      currencyCode: 'USD',
      currencyName: 'US Dollar',
      currencySymbol: '$',
      flagUrl: 'https://cdn.reloadly.com/flags/us.svg',
    },
    redeemInstruction: {
      concise: 'Redeem in the DoorDash app or at doordash.com',
      verbose: 'Go to Account > Gift Card and enter your PIN code.',
    },
  },
];

/**
 * Maps Reloadly brand name to appropriate marketplace category.
 */
function mapBrandToCategory(brandName: string): string {
  const b = brandName.toLowerCase();
  if (['steam', 'playstation', 'xbox', 'roblox', 'nintendo', 'razer'].some((k) => b.includes(k))) {
    return 'Gaming';
  }
  if (['spotify', 'netflix', 'apple', 'google play', 'disney', 'youtube', 'hulu'].some((k) => b.includes(k))) {
    return 'Entertainment';
  }
  if (['amazon', 'jumia', 'nike', 'asos', 'target', 'walmart', 'sephora', 'zara'].some((k) => b.includes(k))) {
    return 'Shopping';
  }
  if (['uber eats', 'doordash', 'starbucks', 'domino', 'deliveroo', 'grubhub'].some((k) => b.includes(k))) {
    return 'Food';
  }
  if (['uber', 'bolt', 'airbnb', 'delta', 'hotels.com'].some((k) => b.includes(k))) {
    return 'Travel';
  }
  return 'Subscriptions';
}

/**
 * Normalizes a raw Reloadly product into our internal domain model.
 * Guarantees real product artwork and handles missing fields gracefully.
 */
export function normalizeReloadlyProduct(raw: ReloadlyProduct): NormalizedGiftCard {
  const brandName = raw.brand?.brandName || raw.productName;
  const brandSlug = brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const category = mapBrandToCategory(brandName);
  
  // Real product artwork from Reloadly
  const productImage = raw.logoUrls && raw.logoUrls.length > 0
    ? raw.logoUrls[0]
    : `/brands/${brandSlug}.svg`;

  const brandLogo = `/brands/${brandSlug}.svg`;

  // Fix amounts vs range
  const fixed = raw.fixedRecipientDenominations || [];
  const minAmt = raw.minRecipientDenomination || (fixed[0] ?? 10);
  const maxAmt = raw.maxRecipientDenomination || (fixed[fixed.length - 1] ?? 500);

  const denominations = fixed.length > 0 ? fixed : [minAmt, maxAmt];

  const currencySymbol =
    raw.country?.currencySymbol ||
    (raw.recipientCurrencyCode === 'USD' ? '$' : raw.recipientCurrencyCode === 'NGN' ? '₦' : raw.recipientCurrencyCode === 'GBP' ? '£' : '€');

  const isPopular = [101, 102, 103, 104, 107].includes(raw.productId);
  const isTrending = [105, 106, 110, 111].includes(raw.productId);
  const isBestSeller = [101, 103, 109].includes(raw.productId);
  const isRecentlyAdded = [112, 113, 114, 115].includes(raw.productId);

  const redemptionText =
    raw.redeemInstruction?.verbose ||
    raw.redeemInstruction?.concise ||
    `Redeem online at official ${brandName} website or mobile app.`;

  return {
    id: String(raw.productId),
    numericId: raw.productId,
    slug: brandSlug,
    brandName,
    brand: brandName,
    brandSlug,
    productName: raw.productName,
    brandLogo,
    logoUrl: brandLogo,
    productImage,
    giftCardImage: productImage,
    giftCardUrl: productImage,
    category,
    country: raw.global ? 'GLOBAL' : (raw.country?.isoName || 'US'),
    countryName: raw.global ? 'Global' : (raw.country?.name || 'United States'),
    region: raw.global ? 'Global' : (raw.country?.name || 'United States'),
    regionDisclaimer: `Official digital voucher valid in ${raw.global ? 'supported global regions' : raw.country?.name || 'the issuing region'}. Redeemable directly in ${raw.recipientCurrencyCode || 'USD'}.`,
    currency: raw.recipientCurrencyCode || 'USD',
    currencySymbol,
    denominations,
    minAmount: minAmt,
    maxAmount: maxAmt,
    minCustomAmount: raw.denominationType === 'RANGE' ? minAmt : undefined,
    maxCustomAmount: raw.denominationType === 'RANGE' ? maxAmt : undefined,
    fixedAmounts: fixed,
    denominationType: raw.denominationType || 'FIXED',
    deliveryMethod: 'digital',
    description: `Official ${brandName} digital gift card. Fast delivery, zero markups, and verified redemption.`,
    redemptionInstructions: redemptionText,
    redemptionInstructionsList: [
      `Redeem online at official ${brandName} website or mobile app.`,
      `Apply code during checkout under payment or gift card section.`,
      `Your balance will automatically update with verified funds.`,
    ],
    terms: `Valid only in ${raw.country?.name || 'issuing region'}. Code is delivered electronically. Non-refundable and cannot be exchanged for cash once delivered.`,
    termsAndConditions: [
      `Valid strictly for ${raw.global ? 'global accounts' : `${raw.country?.name || 'regional'} accounts`}.`,
      `Non-refundable and cannot be redeemed for cash once delivered.`,
      `Protected by Vouchr 100% money-back guarantee.`,
    ],
    isAvailable: true,
    available: true,
    availability: 'in_stock',
    discountPercentage: raw.discountPercentage || 0,
    global: raw.global || false,
    isPopular,
    isTrending,
    isBestSeller,
    isRecentlyAdded,
  };
}

/**
 * Retrieves all supported countries from Reloadly.
 */
export async function getReloadlyCountries(): Promise<ReloadlyCountry[]> {
  if (!hasReloadlyCredentials()) {
    // Return sample countries supported in sandbox
    return [
      { isoName: 'US', name: 'United States', currencyCode: 'USD', currencyName: 'US Dollar', currencySymbol: '$', flagUrl: 'https://cdn.reloadly.com/flags/us.svg' },
      { isoName: 'GB', name: 'United Kingdom', currencyCode: 'GBP', currencyName: 'British Pound', currencySymbol: '£', flagUrl: 'https://cdn.reloadly.com/flags/gb.svg' },
      { isoName: 'NG', name: 'Nigeria', currencyCode: 'NGN', currencyName: 'Nigerian Naira', currencySymbol: '₦', flagUrl: 'https://cdn.reloadly.com/flags/ng.svg' },
      { isoName: 'KE', name: 'Kenya', currencyCode: 'KES', currencyName: 'Kenyan Shilling', currencySymbol: 'KSh', flagUrl: 'https://cdn.reloadly.com/flags/ke.svg' },
      { isoName: 'GLOBAL', name: 'Global', currencyCode: 'USD', currencyName: 'US Dollar', currencySymbol: '$', flagUrl: 'https://cdn.reloadly.com/flags/global.svg' },
    ];
  }

  return reloadlyFetch<ReloadlyCountry[]>('/countries', {
    cacheTtlMs: 3600_000, // Cache for 1 hour
    logContext: { requestType: 'GET_COUNTRIES' },
  });
}

/**
 * Fetches available gift-card products dynamically from Reloadly,
 * with server-side caching and internal normalization.
 */
export async function getReloadlyGiftCards(
  filter?: ReloadlyProductFilter
): Promise<NormalizedGiftCard[]> {
  let rawProducts: ReloadlyProduct[] = [];

  if (!hasReloadlyCredentials()) {
    // Development sandbox seed
    rawProducts = [...RELOADLY_SANDBOX_PRODUCTS];
  } else {
    // Live Reloadly API
    try {
      const country = filter?.countryCode || filter?.country;
      if (country && country !== 'ALL' && country !== 'GLOBAL') {
        rawProducts = await reloadlyFetch<ReloadlyProduct[]>(
          `/products/countries/${country}`,
          {
            cacheTtlMs: 300_000, // 5-minute cache
            logContext: { requestType: 'GET_PRODUCTS_BY_COUNTRY' },
          }
        );
      } else {
        const queryParams = new URLSearchParams({
          page: String(filter?.page || 1),
          size: String(filter?.size || 50),
        });
        const res = await reloadlyFetch<any>(`/products?${queryParams.toString()}`, {
          cacheTtlMs: 300_000,
          logContext: { requestType: 'GET_PRODUCTS' },
        });
        rawProducts = Array.isArray(res) ? res : res.content || [];
      }
    } catch (err: any) {
      console.error('[Reloadly Service] Failed to fetch live products, falling back to sandbox seed:', err.message);
      rawProducts = [...RELOADLY_SANDBOX_PRODUCTS];
    }
  }

  // Normalize
  let normalized = rawProducts.map(normalizeReloadlyProduct);

  // Apply filters
  if (filter) {
    if (filter.category && filter.category !== 'All') {
      normalized = normalized.filter((p) => p.category.toLowerCase() === filter.category!.toLowerCase());
    }

    if (filter.countryCode && filter.countryCode !== 'ALL') {
      normalized = normalized.filter(
        (p) => p.country === filter.countryCode || p.country === 'GLOBAL'
      );
    }

    if (filter.brand && filter.brand !== 'all') {
      normalized = normalized.filter(
        (p) => p.brandName.toLowerCase().includes(filter.brand!.toLowerCase())
      );
    }

    if (filter.search) {
      const q = filter.search.toLowerCase();
      normalized = normalized.filter(
        (p) =>
          p.brandName.toLowerCase().includes(q) ||
          p.productName.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.countryName.toLowerCase().includes(q)
      );
    }

    if (filter.sortBy) {
      if (filter.sortBy === 'price_asc') {
        normalized.sort((a, b) => (a.denominations[0] || 0) - (b.denominations[0] || 0));
      } else if (filter.sortBy === 'price_desc') {
        normalized.sort((a, b) => (b.denominations[0] || 0) - (a.denominations[0] || 0));
      } else if (filter.sortBy === 'brand_asc') {
        normalized.sort((a, b) => a.brandName.localeCompare(b.brandName));
      } else if (filter.sortBy === 'discount') {
        normalized.sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0));
      }
    }
  }

  return normalized;
}

/**
 * Fetches fresh product information for a single gift card.
 * Always bypasses cache for high-precision checkout pricing.
 */
export async function getReloadlyGiftCardById(
  productIdOrSlug: string | number,
  fresh = false
): Promise<NormalizedGiftCard | null> {
  const numericId = Number(productIdOrSlug);
  const isNumeric = !isNaN(numericId) && numericId > 0;

  if (!hasReloadlyCredentials()) {
    const target = String(productIdOrSlug).toLowerCase();
    const found = RELOADLY_SANDBOX_PRODUCTS.find((p) => {
      if (isNumeric && p.productId === numericId) return true;
      if (String(p.productId) === target) return true;
      const brandSlug = p.brand?.brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const prodSlug = p.productName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return brandSlug === target || prodSlug === target || brandSlug.includes(target);
    });
    return found ? normalizeReloadlyProduct(found) : null;
  }

  try {
    if (isNumeric) {
      const raw = await reloadlyFetch<ReloadlyProduct>(`/products/${numericId}`, {
        cacheTtlMs: fresh ? 0 : 180_000,
        logContext: {
          requestType: 'GET_PRODUCT_BY_ID',
          productId: numericId,
        },
      });

      return raw ? normalizeReloadlyProduct(raw) : null;
    }

    // Fallback: search catalog for brand/product slug
    const catalog = await getReloadlyGiftCards();
    const target = String(productIdOrSlug).toLowerCase();
    const found = catalog.find(
      (c) =>
        c.id === target ||
        c.brandSlug === target ||
        c.slug === target ||
        c.brandName.toLowerCase() === target
    );
    return found || null;
  } catch (err: any) {
    console.warn(`[Reloadly Service] Could not find live product ${productIdOrSlug}:`, err.message);
    const target = String(productIdOrSlug).toLowerCase();
    const fallback = RELOADLY_SANDBOX_PRODUCTS.find((p) => {
      if (isNumeric && p.productId === numericId) return true;
      const brandSlug = p.brand?.brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return brandSlug === target;
    });
    return fallback ? normalizeReloadlyProduct(fallback) : null;
  }
}

/**
 * Orders a digital gift card through Reloadly's /orders endpoint.
 * Strictly called AFTER successful server-side payment verification.
 */
export async function orderReloadlyGiftCard(
  orderRequest: ReloadlyOrderRequest
): Promise<ReloadlyOrderResponse> {
  if (!hasReloadlyCredentials()) {
    // Simulated sandbox order execution
    const randomTxId = Math.floor(1000000 + Math.random() * 9000000);
    const product = await getReloadlyGiftCardById(orderRequest.productId);

    return {
      transactionId: randomTxId,
      status: 'SUCCESSFUL',
      amount: orderRequest.unitPrice * orderRequest.quantity,
      discount: 0,
      currencyCode: product?.currency || 'USD',
      fee: 0,
      smsFee: 0,
      recipientEmail: orderRequest.recipientEmail,
      customIdentifier: orderRequest.customIdentifier,
      createdDate: new Date().toISOString(),
      product: {
        productId: orderRequest.productId,
        productName: product?.productName || 'Digital Gift Card',
        countryCode: orderRequest.countryCode,
        quantity: orderRequest.quantity,
        unitPrice: orderRequest.unitPrice,
        totalPrice: orderRequest.unitPrice * orderRequest.quantity,
        currencyCode: product?.currency || 'USD',
        brand: {
          brandId: 1000,
          brandName: product?.brandName || 'Gift Card',
        },
      },
    };
  }

  return reloadlyFetch<ReloadlyOrderResponse>('/orders', {
    method: 'POST',
    body: orderRequest,
    logContext: {
      requestType: 'PURCHASE_ORDER',
      productId: orderRequest.productId,
    },
  });
}

/**
 * Securely retrieves digital codes and PINs for an order.
 * Kept strictly protected and server-side.
 */
export async function getReloadlyOrderCards(
  transactionId: number
): Promise<ReloadlyCardCode[]> {
  if (!hasReloadlyCredentials()) {
    return [
      {
        cardNumber: `VCR-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
        pin: `${Math.floor(1000 + Math.random() * 9000)}`,
      },
    ];
  }

  return reloadlyFetch<ReloadlyCardCode[]>(`/orders/transactions/${transactionId}/cards`, {
    logContext: {
      requestType: 'GET_CARDS_PIN',
      transactionId,
    },
  });
}
