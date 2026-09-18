'use client';

import React from 'react';
import Link from 'next/link';
import { useVouchr } from '@/context/VouchrContext';
import { BrandIcon } from '@/components/common/BrandIcon';
import { X, Trash2, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { cart, removeFromCart, clearCart, isCartOpen, setIsCartOpen, format, cartTotalUSD } = useVouchr();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-purple-700" />
              <h2 className="font-extrabold text-lg text-zinc-900">Your Gift Bag</h2>
              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
                {cart.length}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition"
              aria-label="Close bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500 space-y-3">
                <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-zinc-800 text-base">Your gift bag is empty</h3>
                <p className="text-xs text-zinc-400 max-w-xs">
                  Pick a card from top global brands and personalize it in seconds.
                </p>
                <Link
                  href="/cards"
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition"
                >
                  Browse Gift Cards
                </Link>
              </div>
            ) : (
              cart.map((item) => {
                const discount = item.giftCard.discountPercentage || 0;
                const finalPrice = item.denomination * (1 - discount / 100);

                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl border border-zinc-200/90 bg-zinc-50/50 flex gap-3.5 relative group"
                  >
                    <div className="w-14 h-14 rounded-xl bg-zinc-900 flex items-center justify-center shrink-0 p-2 shadow-sm">
                      <BrandIcon brandId={item.giftCard.id} size={28} className="w-7 h-7" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h4 className="font-extrabold text-sm text-zinc-900 truncate">
                          {item.giftCard.brand}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-zinc-400 hover:text-red-500 p-1 transition"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-xs text-zinc-500 font-medium">
                        To: <span className="text-zinc-800 font-semibold">{item.recipientName || 'Myself'}</span>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                          {format(item.denomination)} card
                        </span>
                        <span className="font-extrabold text-sm text-zinc-900">
                          {format(finalPrice)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-zinc-100 bg-white space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-zinc-800">{format(cartTotalUSD)}</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Digital Delivery & Fees</span>
                  <span className="font-bold text-emerald-600">FREE (0.00)</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-zinc-950 pt-2 border-t border-zinc-100">
                  <span>Total</span>
                  <span className="text-lg text-purple-700">{format(cartTotalUSD)}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>256-bit encrypted checkout • Instant delivery</span>
              </div>

              <div className="space-y-2">
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-3.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 transition-all hover:scale-[1.01]"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  onClick={clearCart}
                  className="w-full text-center text-xs text-zinc-400 hover:text-zinc-600 py-1"
                >
                  Clear Bag
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
