'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, CurrencyCode, Order, SavedRecipient, GiftCard } from '@/types';
import { CURRENCIES, formatPrice } from '@/data/currencies';
import { GIFT_CARDS } from '@/data/giftCards';

interface VouchrContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  orders: Order[];
  createOrder: (newOrder: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'voucherCode' | 'claimUrl'>) => Order;
  savedRecipients: SavedRecipient[];
  addSavedRecipient: (recipient: SavedRecipient) => void;
  format: (amountUSD: number) => string;
  cartTotalUSD: number;
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const INITIAL_RECIPIENTS: SavedRecipient[] = [
  {
    id: 'rec-1',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    phone: '+1 (555) 349-8201',
    relationship: 'Best Friend',
    occasion: 'Birthday',
    occasionDate: '2026-10-04',
    favoriteBrands: ['Spotify', 'Airbnb', 'Starbucks'],
    totalGiftsSent: 4,
  },
  {
    id: 'rec-2',
    name: 'Kofi Mensah',
    email: 'kofi.mensah@example.com',
    phone: '+234 803 123 4567',
    relationship: 'Colleague',
    occasion: 'Promotion Celebration',
    occasionDate: '2026-09-28',
    favoriteBrands: ['PlayStation', 'Steam', 'Uber'],
    totalGiftsSent: 2,
  },
  {
    id: 'rec-3',
    name: 'Elena Rostova',
    email: 'elena.rostova@example.com',
    relationship: 'Sister',
    occasion: 'Graduation',
    occasionDate: '2026-11-15',
    favoriteBrands: ['Apple', 'Sephora', 'Nike'],
    totalGiftsSent: 3,
  },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-849201',
    orderNumber: 'VCR-99214',
    createdAt: '2026-09-15T14:22:00Z',
    items: [
      {
        id: 'ci-1',
        giftCard: GIFT_CARDS[0], // Spotify
        denomination: 30,
        recipientType: 'other',
        recipientName: 'Sarah Chen',
        recipientEmail: 'sarah.chen@example.com',
        senderName: 'Alex Mercer',
        message: 'Happy early birthday Sarah! Enjoy uninterrupted playlists all year.',
        deliveryOption: 'instant',
        cardDesignSkin: 'classic',
      },
    ],
    totalUSD: 30,
    currency: 'USD',
    totalInCurrency: 30,
    paymentMethod: 'apple_pay',
    paymentStatus: 'completed',
    deliveryStatus: 'opened',
    deliveryTimestamp: '2026-09-15T14:22:18Z',
    voucherCode: 'SPOT-9942-8812-7491',
    pinCode: '8839',
    claimUrl: 'https://vouchr.com/claim/vcr-99214-spot',
  },
  {
    id: 'ord-849202',
    orderNumber: 'VCR-99182',
    createdAt: '2026-09-08T09:10:00Z',
    items: [
      {
        id: 'ci-2',
        giftCard: GIFT_CARDS[2], // PlayStation
        denomination: 50,
        recipientType: 'other',
        recipientName: 'Kofi Mensah',
        recipientEmail: 'kofi.mensah@example.com',
        senderName: 'Alex Mercer',
        message: 'Congrats on the promotion mate! Time to get that new game.',
        deliveryOption: 'instant',
        cardDesignSkin: 'electric-neon',
      },
    ],
    totalUSD: 47.5, // 5% discount
    currency: 'USD',
    totalInCurrency: 47.5,
    paymentMethod: 'card',
    paymentStatus: 'completed',
    deliveryStatus: 'claimed',
    deliveryTimestamp: '2026-09-08T09:10:14Z',
    voucherCode: 'PSN-7731-9024-1148',
    pinCode: '4410',
    claimUrl: 'https://vouchr.com/claim/vcr-99182-psn',
  },
];

const VouchrContext = createContext<VouchrContextType | undefined>(undefined);

export const VouchrProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>('USD');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [savedRecipients, setSavedRecipients] = useState<SavedRecipient[]>(INITIAL_RECIPIENTS);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Initialize from localStorage safely in browser
  useEffect(() => {
    try {
      const storedCurrency = localStorage.getItem('vouchr_currency') as CurrencyCode;
      if (storedCurrency && CURRENCIES[storedCurrency]) {
        setCurrencyState(storedCurrency);
      }

      const storedCart = localStorage.getItem('vouchr_cart');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }

      const storedOrders = localStorage.getItem('vouchr_orders');
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      }

      const storedRecipients = localStorage.getItem('vouchr_recipients');
      if (storedRecipients) {
        setSavedRecipients(JSON.parse(storedRecipients));
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, []);

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    try {
      localStorage.setItem('vouchr_currency', code);
    } catch (_) {}
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const updated = [...prev, item];
      try {
        localStorage.setItem('vouchr_cart', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
    showToast(`Added ${item.giftCard.brand} gift card to your bag!`, 'success');
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem('vouchr_cart', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem('vouchr_cart');
    } catch (_) {}
  };

  const createOrder = (
    newOrderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'voucherCode' | 'claimUrl'>
  ): Order => {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const brandPrefix = newOrderData.items[0]?.giftCard.brand.slice(0, 4).toUpperCase() || 'VCR';
    const codePart1 = Math.floor(1000 + Math.random() * 9000);
    const codePart2 = Math.floor(1000 + Math.random() * 9000);
    const codePart3 = Math.floor(1000 + Math.random() * 9000);

    const fullOrder: Order = {
      ...newOrderData,
      id: `ord-${Date.now()}`,
      orderNumber: `VCR-${randomSuffix}`,
      createdAt: new Date().toISOString(),
      voucherCode: `${brandPrefix}-${codePart1}-${codePart2}-${codePart3}`,
      pinCode: `${Math.floor(1000 + Math.random() * 9000)}`,
      claimUrl: `https://vouchr.com/claim/vcr-${randomSuffix}`,
    };

    setOrders((prev) => {
      const updated = [fullOrder, ...prev];
      try {
        localStorage.setItem('vouchr_orders', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });

    // If recipient is new and has name and email, auto-add to saved recipients
    const primaryItem = newOrderData.items[0];
    if (primaryItem && primaryItem.recipientName && primaryItem.recipientEmail) {
      const exists = savedRecipients.some(
        (r) => r.email.toLowerCase() === primaryItem.recipientEmail!.toLowerCase()
      );
      if (!exists) {
        const newRecipient: SavedRecipient = {
          id: `rec-${Date.now()}`,
          name: primaryItem.recipientName,
          email: primaryItem.recipientEmail,
          phone: primaryItem.recipientPhone,
          relationship: 'Friend',
          favoriteBrands: [primaryItem.giftCard.brand],
          totalGiftsSent: 1,
        };
        addSavedRecipient(newRecipient);
      }
    }

    clearCart();
    return fullOrder;
  };

  const addSavedRecipient = (recipient: SavedRecipient) => {
    setSavedRecipients((prev) => {
      const updated = [recipient, ...prev];
      try {
        localStorage.setItem('vouchr_recipients', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
  };

  const format = (amountUSD: number) => {
    return formatPrice(amountUSD, currency);
  };

  const cartTotalUSD = cart.reduce((acc, item) => {
    const discount = item.giftCard.discountPercentage ? item.giftCard.discountPercentage / 100 : 0;
    return acc + item.denomination * (1 - discount);
  }, 0);

  return (
    <VouchrContext.Provider
      value={{
        currency,
        setCurrency,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        orders,
        createOrder,
        savedRecipients,
        addSavedRecipient,
        format,
        cartTotalUSD,
        toast,
        showToast,
      }}
    >
      {children}
    </VouchrContext.Provider>
  );
};

export const useVouchr = () => {
  const context = useContext(VouchrContext);
  if (!context) {
    throw new Error('useVouchr must be used within a VouchrProvider');
  }
  return context;
};
