import { CurrencyCode, CurrencyConfig } from '@/types';

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: {
    code: 'USD',
    symbol: '$',
    label: 'USD ($)',
    flag: '🇺🇸',
    rateAgainstUSD: 1.0,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    label: 'EUR (€)',
    flag: '🇪🇺',
    rateAgainstUSD: 0.92,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    label: 'GBP (£)',
    flag: '🇬🇧',
    rateAgainstUSD: 0.78,
  },
  NGN: {
    code: 'NGN',
    symbol: '₦',
    label: 'NGN (₦)',
    flag: '🇳🇬',
    rateAgainstUSD: 1550.0,
  },
  KES: {
    code: 'KES',
    symbol: 'KSh',
    label: 'KES (KSh)',
    flag: '🇰🇪',
    rateAgainstUSD: 130.0,
  },
};

export function formatPrice(amountUSD: number, targetCurrency: CurrencyCode = 'USD'): string {
  const config = CURRENCIES[targetCurrency] || CURRENCIES.USD;
  const converted = amountUSD * config.rateAgainstUSD;

  if (targetCurrency === 'NGN') {
    return `₦${Math.round(converted).toLocaleString('en-US')}`;
  }
  if (targetCurrency === 'KES') {
    return `KSh ${Math.round(converted).toLocaleString('en-US')}`;
  }
  if (targetCurrency === 'EUR') {
    return `€${converted.toFixed(2)}`;
  }
  if (targetCurrency === 'GBP') {
    return `£${converted.toFixed(2)}`;
  }
  return `$${converted.toFixed(2)}`;
}
