import { GiftCard } from '@/types';

// Real-time catalog is provided exclusively by Reloadly Gift Cards API
export const GIFT_CARDS: GiftCard[] = [];

export const CATEGORIES = [
  { id: 'all', name: 'All Cards', icon: 'Sparkles', count: 0, color: 'from-purple-600 to-indigo-600' },
  { id: 'gaming', name: 'Gaming', icon: 'Gamepad2', count: 0, color: 'from-indigo-600 to-blue-600' },
  { id: 'entertainment', name: 'Entertainment', icon: 'Film', count: 0, color: 'from-purple-600 to-pink-600' },
  { id: 'shopping', name: 'Shopping', icon: 'ShoppingBag', count: 0, color: 'from-orange-500 to-amber-600' },
  { id: 'food', name: 'Food & Dining', icon: 'Utensils', count: 0, color: 'from-rose-500 to-orange-500' },
  { id: 'travel', name: 'Travel & Stays', icon: 'Plane', count: 0, color: 'from-cyan-500 to-blue-600' },
  { id: 'lifestyle', name: 'Lifestyle', icon: 'Heart', count: 0, color: 'from-pink-500 to-rose-500' },
  { id: 'subscriptions', name: 'Subscriptions', icon: 'CreditCard', count: 0, color: 'from-violet-600 to-purple-700' },
] as const;

export const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Pick their favorite brand',
    description: 'Choose from verified global and regional brands across gaming, entertainment, fashion, rides, and food.',
    icon: 'Search',
    badge: 'Verified Brands',
  },
  {
    step: '02',
    title: 'Personalize & write a note',
    description: 'Select an amount, pick a celebratory card skin, and add your heartfelt message. Preview the collectible card in real-time.',
    icon: 'Gift',
    badge: 'Live Preview',
  },
  {
    step: '03',
    title: 'Instant delivery in seconds',
    description: 'Sent directly via email and SMS within 60 seconds, or schedule for the exact second of their birthday or celebration.',
    icon: 'Send',
    badge: 'Instant & Zero Fees',
  },
];

export const WHY_CHOOSE_US = [
  {
    title: 'Delivered in 60 seconds',
    description: 'No waiting for plastic in the mail. The digital voucher arrives in their inbox & phone almost immediately.',
    icon: 'Zap',
  },
  {
    title: 'Zero markups or hidden fees',
    description: 'Pay exact face value with total transparency. A $50 gift card costs exactly $50.',
    icon: 'ShieldCheck',
  },
  {
    title: 'Direct provider integration',
    description: 'Codes are generated directly through official partner APIs, guaranteeing 100% redemption validity.',
    icon: 'BadgeCheck',
  },
  {
    title: 'Recipient swap guarantee',
    description: 'Before redeeming, recipients can swap eligible digital vouchers for equal value across our catalog for free.',
    icon: 'RefreshCw',
  },
];

export const TESTIMONIALS = [
  {
    id: '1',
    name: 'Amina Bello',
    location: 'Lagos, Nigeria',
    avatar: 'AB',
    cardBrand: 'Verified Digital Code',
    comment: 'Sent a digital gift card for a birthday at 11:59 PM. Arrived at midnight sharp with my note. Flawless service.',
    rating: 5,
    role: 'Product Designer',
  },
  {
    id: '2',
    name: 'Marcus Vance',
    location: 'London, United Kingdom',
    avatar: 'MV',
    cardBrand: 'Digital Voucher',
    comment: 'Instant issuance, crystal-clear redemption instructions, and genuine digital codes delivered straight to the inbox.',
    rating: 5,
    role: 'Software Engineer',
  },
  {
    id: '3',
    name: 'Nia Kamau',
    location: 'Nairobi, Kenya',
    avatar: 'NK',
    cardBrand: 'Travel & Lifestyle',
    comment: 'The multi-currency support and instant delivery are unmatched. Seamless checkout and verified codes.',
    rating: 5,
    role: 'Creative Director',
  },
];

export const GENERAL_FAQS = [
  {
    question: 'How fast is delivery really?',
    answer: 'Virtually instantaneous. Digital gift cards are dispatched to the recipient’s email within 30 to 60 seconds of payment verification.',
    category: 'delivery',
  },
  {
    question: 'Are there any extra fees or charges?',
    answer: 'None whatsoever. When you purchase a $50 gift card, you pay $50. We partner directly with authorized providers, keeping digital delivery fee-free.',
    category: 'payments',
  },
  {
    question: 'Can the recipient swap their gift card if they prefer another brand?',
    answer: 'Yes! As long as the digital voucher has not been unmasked or redeemed, the recipient can exchange it for equal value across available catalog brands.',
    category: 'redemption',
  },
  {
    question: 'Can I schedule a gift for a future birthday or anniversary?',
    answer: 'Absolutely. During checkout, simply select "Schedule for later" and pick the exact date and time. We handle delivery at the precise moment.',
    category: 'delivery',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major Visa, Mastercard, and American Express cards, Apple Pay, Google Pay, local bank transfers, and mobile money.',
    category: 'payments',
  },
  {
    question: 'What happens if my recipient does not receive the email?',
    answer: 'You have full control. You can view, copy, or resend the direct gift claim link anytime from your Vouchr receipt or account history. Our support team is always ready to assist.',
    category: 'support',
  },
];
