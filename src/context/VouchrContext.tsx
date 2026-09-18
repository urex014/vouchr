'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, CurrencyCode, Order, SavedRecipient } from '@/types';
import { CURRENCIES, formatPrice } from '@/data/currencies';

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
    favoriteBrands: [],
    totalGiftsSent: 0,
  },
];

const INITIAL_ORDERS: Order[] = [];

const VouchrContext = createContext<VouchrContextType | undefined>(undefined);

export const VouchrProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>('USD');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [savedRecipients, setSavedRecipients] = useState<SavedRecipient[]>(INITIAL_RECIPIENTS);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

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

    const countryCode = newOrderData.items[0]?.giftCard.country || 'US';

    const fullOrder: Order = {
      ...newOrderData,
      id: `ord-${Date.now()}`,
      orderNumber: `VCR-${countryCode}-${randomSuffix}`,
      createdAt: new Date().toISOString(),
      voucherCode: `${brandPrefix}-${codePart1}-${codePart2}-${codePart3}`,
      pinCode: `${Math.floor(1000 + Math.random() * 9000)}`,
      claimUrl: `https://vouchr.com/claim/vcr-${countryCode.toLowerCase()}-${randomSuffix}`,
    };

    setOrders((prev) => {
      const updated = [fullOrder, ...prev];
      try {
        localStorage.setItem('vouchr_orders', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });

    // Auto-save recipient if new
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
    return acc + (item.denomination * item.quantity) * (1 - discount);
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
