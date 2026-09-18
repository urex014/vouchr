import { GiftCardProvider } from './provider';
import {
  ProviderGiftCard,
  Brand,
  GiftCardFilter,
  PurchaseRequest,
  PurchaseResponse,
  CountryCode,
} from './types';

export const MOCK_BRANDS: Brand[] = [
  {
    id: 'amazon',
    name: 'Amazon',
    slug: 'amazon',
    logoUrl: '/brands/amazon.svg',
    category: 'Shopping',
    countriesAvailable: ['US', 'UK', 'EU'],
  },
  {
    id: 'apple',
    name: 'Apple',
    slug: 'apple',
    logoUrl: '/brands/apple.svg',
    category: 'Entertainment',
    countriesAvailable: ['US', 'UK', 'EU', 'NG', 'KE'],
  },
  {
    id: 'spotify',
    name: 'Spotify',
    slug: 'spotify',
    logoUrl: '/brands/spotify.svg',
    category: 'Entertainment',
    countriesAvailable: ['GLOBAL', 'US', 'UK', 'NG', 'KE', 'EU'],
  },
  {
    id: 'playstation',
    name: 'PlayStation',
    slug: 'playstation',
    logoUrl: '/brands/playstation.svg',
    category: 'Gaming',
    countriesAvailable: ['US', 'UK', 'EU'],
  },
  {
    id: 'steam',
    name: 'Steam',
    slug: 'steam',
    logoUrl: '/brands/steam.svg',
    category: 'Gaming',
    countriesAvailable: ['GLOBAL', 'US', 'UK', 'EU', 'NG'],
  },
  {
    id: 'netflix',
    name: 'Netflix',
    slug: 'netflix',
    logoUrl: '/brands/netflix.svg',
    category: 'Entertainment',
    countriesAvailable: ['US', 'UK', 'NG', 'KE', 'EU'],
  },
  {
    id: 'uber',
    name: 'Uber',
    slug: 'uber',
    logoUrl: '/brands/uber.svg',
    category: 'Travel',
    countriesAvailable: ['US', 'UK', 'NG', 'KE', 'EU'],
  },
  {
    id: 'nike',
    name: 'Nike',
    slug: 'nike',
    logoUrl: '/brands/nike.svg',
    category: 'Shopping',
    countriesAvailable: ['US', 'UK', 'EU'],
  },
  {
    id: 'jumia',
    name: 'Jumia',
    slug: 'jumia',
    logoUrl: '/brands/jumia.svg',
    category: 'Shopping',
    countriesAvailable: ['NG', 'KE'],
  },
  {
    id: 'bolt',
    name: 'Bolt',
    slug: 'bolt',
    logoUrl: '/brands/bolt.svg',
    category: 'Travel',
    countriesAvailable: ['NG', 'KE', 'UK', 'EU'],
  },
  {
    id: 'airbnb',
    name: 'Airbnb',
    slug: 'airbnb',
    logoUrl: '/brands/airbnb.svg',
    category: 'Travel',
    countriesAvailable: ['GLOBAL', 'US', 'UK', 'EU'],
  },
  {
    id: 'xbox',
    name: 'Xbox',
    slug: 'xbox',
    logoUrl: '/brands/xbox.svg',
    category: 'Gaming',
    countriesAvailable: ['US', 'UK', 'EU'],
  },
  {
    id: 'googleplay',
    name: 'Google Play',
    slug: 'googleplay',
    logoUrl: '/brands/googleplay.svg',
    category: 'Entertainment',
    countriesAvailable: ['US', 'UK', 'NG', 'EU'],
  },
  {
    id: 'starbucks',
    name: 'Starbucks',
    slug: 'starbucks',
    logoUrl: '/brands/starbucks.svg',
    category: 'Food',
    countriesAvailable: ['US', 'UK'],
  },
  {
    id: 'doordash',
    name: 'DoorDash',
    slug: 'doordash',
    logoUrl: '/brands/doordash.svg',
    category: 'Food',
    countriesAvailable: ['US'],
  },
];

export const MOCK_GIFT_CARDS: ProviderGiftCard[] = [
  {
    id: 'amazon-us',
    brand: 'Amazon',
    brandSlug: 'amazon',
    logoUrl: '/brands/amazon.svg',
    giftCardUrl: '/giftcards/amazon-us.svg',
    category: 'Shopping',
    country: 'US',
    countryName: 'United States',
    currency: 'USD',
    currencySymbol: '$',
    denominations: [25, 50, 100, 150, 200, 500],
    minCustomAmount: 10,
    maxCustomAmount: 1000,
    deliveryMethod: 'digital',
    availability: 'in_stock',
    isPopular: true,
    isTrending: true,
    isBestSeller: true,
    description: 'The world’s most versatile gift card. Redeemable towards millions of physical goods, digital books, music, movies, and electronics on Amazon.com.',
    redemptionInstructions: [
      'Locate the claim code on your Vouchr delivery receipt',
      'Go to amazon.com/redeem or navigate to Your Account > Gift Cards in the Amazon app',
      'Enter the claim code and select Apply to Your Balance',
      'Your Amazon balance is automatically applied to your next purchase'
    ],
    termsAndConditions: [
      'Valid only on Amazon.com (US). Cannot be redeemed on Amazon.co.uk or other country stores.',
      'No expiration date and no service fees.',
      'Non-transferable and non-refundable once redeemed.'
    ],
    regionDisclaimer: 'Region: United States. This card is valid for redemption exclusively on Amazon.com with a US billing address.'
  },
  {
    id: 'apple-us',
    brand: 'Apple',
    brandSlug: 'apple',
    logoUrl: '/brands/apple.svg',
    giftCardUrl: '/giftcards/apple-us.svg',
    category: 'Entertainment',
    country: 'US',
    countryName: 'United States',
    currency: 'USD',
    currencySymbol: '$',
    denominations: [15, 25, 50, 100, 200, 500],
    minCustomAmount: 10,
    maxCustomAmount: 1000,
    deliveryMethod: 'digital',
    availability: 'in_stock',
    isPopular: true,
    isTrending: true,
    isBestSeller: true,
    description: 'Use the Apple Gift Card to get products, accessories, apps, games, music, movies, TV shows, and iCloud+ subscriptions. One card, endless Apple possibilities.',
    redemptionInstructions: [
      'Open the App Store on your iPhone, iPad, or Mac',
      'Tap your profile photo or sign-in button at the top of the screen',
      'Tap Redeem Gift Card or Code and input the 16-digit code',
      'Your Apple Account balance will instantly reflect the card amount'
    ],
    termsAndConditions: [
      'Valid only for purchases from Apple retail stores, Apple.com, App Store, and Apple services in the US.',
      'Requires an Apple ID registered in the United States.',
      'Funds never expire.'
    ],
    regionDisclaimer: 'Region: United States. Requires a US Apple ID account for App Store and Apple Store redemption.'
  },
  {
    id: 'spotify-global',
    brand: 'Spotify',
    brandSlug: 'spotify',
    logoUrl: '/brands/spotify.svg',
    giftCardUrl: '/giftcards/spotify-global.svg',
    category: 'Entertainment',
    country: 'GLOBAL',
    countryName: 'Global',
    currency: 'USD',
    currencySymbol: '$',
    denominations: [10, 30, 60, 100],
    deliveryMethod: 'digital',
    availability: 'in_stock',
    isPopular: true,
    isBestSeller: true,
    description: 'Gift uninterrupted music, podcasts, and offline downloads. Redeemable for Spotify Premium Individual subscription months with zero ads.',
    redemptionInstructions: [
      'Log into your Spotify account at spotify.com/redeem',
      'Enter the unique PIN code provided on your Vouchr voucher',
      'Click Redeem to instantly fund your Premium plan'
    ],
    termsAndConditions: [
      'Valid for standalone Spotify Premium Individual accounts only.',
      'Cannot be applied to Premium Family, Duo, or Student discounted subscriptions.'
    ],
    regionDisclaimer: 'Region: Global. Compatible with any standard Spotify account where Premium is available.'
  },
  {
    id: 'playstation-us',
    brand: 'PlayStation',
    brandSlug: 'playstation',
    logoUrl: '/brands/playstation.svg',
    giftCardUrl: '/giftcards/playstation-us.svg',
    category: 'Gaming',
    country: 'US',
    countryName: 'United States',
    currency: 'USD',
    currencySymbol: '$',
    denominations: [25, 50, 75, 100, 150],
    deliveryMethod: 'digital',
    availability: 'in_stock',
    isPopular: true,
    isTrending: true,
    discountPercentage: 5,
    description: 'Top up your PlayStation Network wallet to buy full PS5 and PS4 games, add-on packs, season passes, and PlayStation Plus memberships.',
    redemptionInstructions: [
      'Sign in to PlayStation Network on your PS5, PS4 console, or store.playstation.com',
      'Go to your profile avatar and select Redeem Codes',
      'Enter the 12-digit voucher code and select Redeem'
    ],
    termsAndConditions: [
      'Must have a PlayStation Network account registered in the United States.',
      'Wallet balance limit applies. Codes do not expire.'
    ],
    regionDisclaimer: 'Region: United States. This voucher code can ONLY be redeemed on a US PlayStation Network account.'
  },
  {
    id: 'steam-global',
    brand: 'Steam',
    brandSlug: 'steam',
    logoUrl: '/brands/steam.svg',
    giftCardUrl: '/giftcards/steam-global.svg',
    category: 'Gaming',
    country: 'GLOBAL',
    countryName: 'Global',
    currency: 'USD',
    currencySymbol: '$',
    denominations: [20, 50, 100],
    deliveryMethod: 'digital',
    availability: 'in_stock',
    isPopular: true,
    isBestSeller: true,
    discountPercentage: 3,
    description: 'Steam Wallet codes are the passport to 50,000+ PC games, indie releases, downloadable content, and Steam Community Market assets.',
    redemptionInstructions: [
      'Log into the Steam client or store.steampowered.com',
      'Click your username in the top-right and choose Account details > Add funds to your Steam Wallet',
      'Select Redeem a Steam Gift Card or Wallet Code and type in your code'
    ],
    termsAndConditions: [
      'Redeemable globally on Steam. Converts to your account’s local currency upon redemption.'
    ],
    regionDisclaimer: 'Region: Global. Automatically converts to your local Steam currency upon activation.'
  },
  {
    id: 'netflix-us',
    brand: 'Netflix',
    brandSlug: 'netflix',
    logoUrl: '/brands/netflix.svg',
    giftCardUrl: '/giftcards/netflix-us.svg',
    category: 'Entertainment',
    country: 'US',
    countryName: 'United States',
    currency: 'USD',
    currencySymbol: '$',
    denominations: [25, 50, 100],
    deliveryMethod: 'digital',
    availability: 'in_stock',
    isPopular: true,
    isTrending: true,
    description: 'Prepay your Netflix subscription with complete privacy and zero monthly card commitments. Watch blockbuster films, award-winning dramas, and documentaries.',
    redemptionInstructions: [
      'Visit netflix.com/redeem',
      'Enter the 11-digit code provided in your Vouchr delivery',
      'Amount is applied directly towards your monthly subscription'
    ],
    termsAndConditions: [
      'Valid for existing or new Netflix accounts billed in US Dollars.',
      'Non-refundable and cannot be redeemed for cash.'
    ],
    regionDisclaimer: 'Region: United States. Compatible with US dollar accounts.'
  },
  {
    id: 'uber-us',
    brand: 'Uber',
    brandSlug: 'uber',
    logoUrl: '/brands/uber.svg',
    giftCardUrl: '/giftcards/uber-us.svg',
    category: 'Travel',
    country: 'US',
    countryName: 'United States',
    currency: 'USD',
    currencySymbol: '$',
    denominations: [25, 50, 100, 200],
    deliveryMethod: 'digital',
    availability: 'in_stock',
    isPopular: true,
    discountPercentage: 4,
    description: 'One seamless card for airport rides, daily commutes, and late-night cravings via Uber Eats across hundreds of US cities.',
    redemptionInstructions: [
      'Open the Uber or Uber Eats app',
      'Go to Account > Wallet > Add Payment Method',
      'Choose Gift Card and input your voucher code'
    ],
    termsAndConditions: [
      'Usable only in the United States where Uber rides and Uber Eats are available.',
      'Funds never expire.'
    ],
    regionDisclaimer: 'Region: United States. Operates exclusively within the US in USD currency.'
  },
  {
    id: 'jumia-ng',
    brand: 'Jumia',
    brandSlug: 'jumia',
    logoUrl: '/brands/jumia.svg',
    giftCardUrl: '/giftcards/jumia-ng.svg',
    category: 'Shopping',
    country: 'NG',
    countryName: 'Nigeria',
    currency: 'NGN',
    currencySymbol: '₦',
    denominations: [10000, 25000, 50000, 100000],
    deliveryMethod: 'digital',
    availability: 'in_stock',
    isPopular: true,
    isRecentlyAdded: true,
    discountPercentage: 5,
    description: 'The preferred retail shopping voucher for Nigeria. Shop smartphones, computing equipment, home appliances, groceries, and fashion on Jumia Nigeria.',
    redemptionInstructions: [
      'Shop on jumia.com.ng or the Jumia Nigeria mobile app',
      'Add items to your cart and proceed to Checkout',
      'Enter the voucher code in the "Do you have a voucher?" box at Payment'
    ],
    termsAndConditions: [
      'Valid only for orders delivered within Nigeria through Jumia.com.ng.',
      'Active for 12 months from delivery.'
    ],
    regionDisclaimer: 'Region: Nigeria (NG). Redeemable exclusively on Jumia Nigeria in Naira (₦).'
  },
  {
    id: 'bolt-ng',
    brand: 'Bolt',
    brandSlug: 'bolt',
    logoUrl: '/brands/bolt.svg',
    giftCardUrl: '/giftcards/bolt-ng.svg',
    category: 'Travel',
    country: 'NG',
    countryName: 'Nigeria',
    currency: 'NGN',
    currencySymbol: '₦',
    denominations: [5000, 10000, 20000, 50000],
    deliveryMethod: 'digital',
    availability: 'in_stock',
    isRecentlyAdded: true,
    discountPercentage: 6,
    description: 'Fast, dependable urban rides across Lagos, Abuja, Port Harcourt, and Ibadan. Safe rides to meetings, airports, and dinners.',
    redemptionInstructions: [
      'Open the Bolt app in Nigeria',
      'Tap Menu > Promotions > Enter Promo Code',
      'Enter your unique code to credit your Bolt wallet for your next trips'
    ],
    termsAndConditions: [
      'Valid for Bolt rides within Nigeria.',
      'Active for 6 months after redemption in the Bolt app.'
    ],
    regionDisclaimer: 'Region: Nigeria (NG). Valid exclusively for rides in Nigerian cities.'
  },
  {
    id: 'nike-us',
    brand: 'Nike',
    brandSlug: 'nike',
    logoUrl: '/brands/nike.svg',
    giftCardUrl: '/giftcards/nike-us.svg',
    category: 'Shopping',
    country: 'US',
    countryName: 'United States',
    currency: 'USD',
    currencySymbol: '$',
    denominations: [50, 100, 150, 250],
    deliveryMethod: 'digital',
    availability: 'in_stock',
    isBestSeller: true,
    description: 'Empower their fitness goals, athletic performance, and street style. Redeemable on Nike.com, Nike App, SNKRS, and in US Nike Retail stores.',
    redemptionInstructions: [
      'Visit Nike.com or open the Nike app',
      'Add gear to your bag and proceed to Payment',
      'Select "Do you have a Nike Gift Card?" and enter card number and PIN'
    ],
    termsAndConditions: [
      'Valid online and at US Nike retail stores.',
      'Funds never expire and have no dormancy fees.'
    ],
    regionDisclaimer: 'Region: United States. Redeemable at Nike US online and retail stores.'
  },
  {
    id: 'airbnb-global',
    brand: 'Airbnb',
    brandSlug: 'airbnb',
    logoUrl: '/brands/airbnb.svg',
    giftCardUrl: '/giftcards/airbnb-global.svg',
    category: 'Travel',
    country: 'GLOBAL',
    countryName: 'Global',
    currency: 'USD',
    currencySymbol: '$',
    denominations: [50, 100, 200, 500],
    deliveryMethod: 'digital',
    availability: 'in_stock',
    isPopular: true,
    isTrending: true,
    description: 'From beachfront villas to cozy cabins and guided city excursions, Airbnb gift cards unlock unforgettable stays across 190+ countries.',
    redemptionInstructions: [
      'Go to airbnb.com/gift and sign in or create an account',
      'Enter the 19-digit redemption PIN',
      'Travel credits automatically apply to your next booking'
    ],
    termsAndConditions: [
      'Credits never expire once added to an Airbnb profile.',
      'Valid for stays and experiences globally.'
    ],
    regionDisclaimer: 'Region: Global. Redeemable for Airbnb bookings worldwide.'
  },
  {
    id: 'xbox-us',
    brand: 'Xbox',
    brandSlug: 'xbox',
    logoUrl: '/brands/xbox.svg',
    giftCardUrl: '/giftcards/xbox-us.svg',
    category: 'Gaming',
    country: 'US',
    countryName: 'United States',
    currency: 'USD',
    currencySymbol: '$',
    denominations: [25, 50, 100],
    deliveryMethod: 'digital',
    availability: 'in_stock',
    discountPercentage: 4,
    description: 'Jump in with Xbox digital cards. Use for Game Pass Ultimate subscriptions, digital games, and DLC packs on Xbox Series X|S, Xbox One, and Windows PC.',
    redemptionInstructions: [
      'Go to microsoft.com/redeem on your browser or Xbox console',
      'Sign in and input the 25-character code',
      'Funds are added to your Microsoft balance instantly'
    ],
    termsAndConditions: [
      'Valid for Microsoft Store purchases in the United States.'
    ],
    regionDisclaimer: 'Region: United States. Requires a US Microsoft account.'
  },
  {
    id: 'googleplay-us',
    brand: 'Google Play',
    brandSlug: 'googleplay',
    logoUrl: '/brands/googleplay.svg',
    giftCardUrl: '/giftcards/googleplay-us.svg',
    category: 'Entertainment',
    country: 'US',
    countryName: 'United States',
    currency: 'USD',
    currencySymbol: '$',
    denominations: [15, 25, 50, 100],
    deliveryMethod: 'digital',
    availability: 'in_stock',
    isBestSeller: true,
    description: 'Fuel apps, premium games, and in-game upgrades like Clash of Clans gems and Genshin crystals across Android devices.',
    redemptionInstructions: [
      'Open the Google Play Store app',
      'Tap your profile icon > Payments & subscriptions > Redeem code',
      'Enter the code and confirm'
    ],
    termsAndConditions: [
      'Valid only for Google Play US accounts.'
    ],
    regionDisclaimer: 'Region: United States. This code cannot be redeemed on non-US Google Play accounts.'
  },
  {
    id: 'starbucks-us',
    brand: 'Starbucks',
    brandSlug: 'starbucks',
    logoUrl: '/brands/starbucks.svg',
    giftCardUrl: '/giftcards/starbucks-us.svg',
    category: 'Food',
    country: 'US',
    countryName: 'United States',
    currency: 'USD',
    currencySymbol: '$',
    denominations: [15, 25, 50, 100],
    deliveryMethod: 'digital',
    availability: 'in_stock',
    description: 'Treat them to handcrafted espresso, artisan teas, and morning breakfast. Easy to link to the Starbucks Rewards app for points.',
    redemptionInstructions: [
      'Open the Starbucks App',
      'Go to Cards > Add Card',
      'Enter the card number and security code'
    ],
    termsAndConditions: [
      'Redeemable at participating Starbucks stores in North America.'
    ],
    regionDisclaimer: 'Region: United States. Valid at participating US Starbucks locations.'
  },
  {
    id: 'doordash-us',
    brand: 'DoorDash',
    brandSlug: 'doordash',
    logoUrl: '/brands/doordash.svg',
    giftCardUrl: '/giftcards/doordash-us.svg',
    category: 'Food',
    country: 'US',
    countryName: 'United States',
    currency: 'USD',
    currencySymbol: '$',
    denominations: [25, 50, 100, 150],
    deliveryMethod: 'digital',
    availability: 'in_stock',
    discountPercentage: 5,
    description: 'Instant doorstep delivery from favorite local restaurants, diners, top sushi bars, and convenience stores across the US.',
    redemptionInstructions: [
      'Open the DoorDash app or visit doordash.com',
      'Go to Account > Gift Card and enter your PIN'
    ],
    termsAndConditions: [
      'Redeemable only on DoorDash US.'
    ],
    regionDisclaimer: 'Region: United States. Valid for deliveries within the US.'
  },
];

export class MockGiftCardProvider implements GiftCardProvider {
  async getBrands(): Promise<Brand[]> {
    return MOCK_BRANDS;
  }

  async getGiftCards(filter?: GiftCardFilter): Promise<ProviderGiftCard[]> {
    let results = [...MOCK_GIFT_CARDS];

    if (filter) {
      if (filter.category && filter.category !== 'All') {
        results = results.filter((c) => c.category === filter.category);
      }

      if (filter.country && filter.country !== 'ALL') {
        results = results.filter(
          (c) => c.country === filter.country || c.country === 'GLOBAL'
        );
      }

      if (filter.brand) {
        const brandSlug = filter.brand.toLowerCase();
        results = results.filter((c) => c.brandSlug === brandSlug);
      }

      if (filter.tag) {
        if (filter.tag === 'popular') results = results.filter((c) => c.isPopular);
        if (filter.tag === 'trending') results = results.filter((c) => c.isTrending);
        if (filter.tag === 'gaming') results = results.filter((c) => c.category === 'Gaming');
        if (filter.tag === 'shopping') results = results.filter((c) => c.category === 'Shopping');
        if (filter.tag === 'entertainment') results = results.filter((c) => c.category === 'Entertainment');
        if (filter.tag === 'bestsellers') results = results.filter((c) => c.isBestSeller);
        if (filter.tag === 'recently_added') results = results.filter((c) => c.isRecentlyAdded);
      }

      if (filter.search) {
        const query = filter.search.toLowerCase();
        results = results.filter(
          (c) =>
            c.brand.toLowerCase().includes(query) ||
            c.description.toLowerCase().includes(query) ||
            c.category.toLowerCase().includes(query) ||
            c.countryName.toLowerCase().includes(query)
        );
      }

      if (filter.minPrice !== undefined) {
        results = results.filter((c) => c.denominations[0] >= filter.minPrice!);
      }

      if (filter.maxPrice !== undefined) {
        results = results.filter((c) => c.denominations[0] <= filter.maxPrice!);
      }

      if (filter.sortBy) {
        if (filter.sortBy === 'price_asc') {
          results.sort((a, b) => a.denominations[0] - b.denominations[0]);
        } else if (filter.sortBy === 'price_desc') {
          results.sort((a, b) => b.denominations[0] - a.denominations[0]);
        } else if (filter.sortBy === 'brand_asc') {
          results.sort((a, b) => a.brand.localeCompare(b.brand));
        } else if (filter.sortBy === 'newest') {
          results.sort((a, b) => (b.isRecentlyAdded ? 1 : 0) - (a.isRecentlyAdded ? 1 : 0));
        }
      }
    }

    return results;
  }

  async getGiftCard(id: string): Promise<ProviderGiftCard | null> {
    const card = MOCK_GIFT_CARDS.find((c) => c.id === id);
    return card || null;
  }

  async getDenominations(id: string): Promise<number[]> {
    const card = await this.getGiftCard(id);
    return card ? card.denominations : [];
  }

  async checkAvailability(id: string, denomination: number): Promise<boolean> {
    const card = await this.getGiftCard(id);
    if (!card) return false;
    return card.availability !== 'out_of_stock';
  }

  async purchaseGiftCard(request: PurchaseRequest): Promise<PurchaseResponse> {
    const card = await this.getGiftCard(request.productId);
    if (!card) {
      throw new Error(`Product with ID ${request.productId} not found in provider catalog.`);
    }

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `VCR-${card.country}-${randomSuffix}`;
    const orderId = `ord-${Date.now()}`;

    return {
      success: true,
      orderId,
      orderNumber,
      createdAt: new Date().toISOString(),
      productId: card.id,
      brand: card.brand,
      denomination: request.denomination,
      currency: card.currency,
      recipientEmail: request.recipientEmail,
      recipientName: request.recipientName,
      deliveryMethod: request.scheduledDeliveryDate ? 'scheduled' : 'digital',
      deliveryStatus: request.scheduledDeliveryDate ? 'scheduled' : 'delivered',
      deliveryEstimatedSeconds: 15,
      claimUrl: `https://vouchr.com/claim/${orderNumber.toLowerCase()}`,
      isCodeSecured: true,
    };
  }
}
