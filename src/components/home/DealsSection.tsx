'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { GiftCard } from '@/types';
import { useVouchr } from '@/context/VouchrContext';
import { Percent, Clock, ArrowRight, Zap, Globe } from 'lucide-react';

export const DealsSection: React.FC = () => {
  const { format } = useVouchr();
  const [dealCards, setDealCards] = useState<GiftCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadDeals() {
      try {
        const res = await fetch('/api/giftcards');
        if (res.ok) {
          const json = await res.json();
          if (active && Array.isArray(json.data)) {
            const discounts = json.data.filter(
              (c: GiftCard) => c.available && c.discountPercentage && c.discountPercentage > 0
            );
            setDealCards(discounts);
          }
        }
      } catch (err) {
        console.warn('Failed to load deals:', err);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadDeals();
    return () => {
      active = false;
    };
  }, []);

  if (!loading && dealCards.length === 0) {
    return null;
  }

  return (
    <section id="deals" className="py-20 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white relative overflow-hidden">
      {/* Glow orbs */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5722]/20 border border-[#FF5722]/40 text-[#FF7A59] text-xs font-black uppercase tracking-wider mb-2">
              <Percent className="w-3.5 h-3.5" />
              Special Offers & Discounts
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Featured discounts & bonuses.
            </h2>
            <p className="text-sm text-zinc-400 mt-1">
              Real-time discounts and exclusive digital gift card savings.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 rounded-xl">
            <Clock className="w-4 h-4" />
            <span>Updated in real time • Auto-applied at checkout</span>
          </div>
        </div>

        {/* Deals Grid with real gift card images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dealCards.map((card) => {
            const minAmount = (card.denominations && card.denominations[0]) || 25;
            const discountedPrice = minAmount * (1 - (card.discountPercentage || 0) / 100);

            return (
              <div
                key={card.id}
                className="rounded-3xl bg-zinc-900/80 border border-zinc-800 p-5 flex flex-col justify-between hover:border-purple-500/50 hover:bg-zinc-900 transition-all duration-300 group overflow-hidden"
              >
                <div>
                  {/* Real gift card artwork container */}
                  <Link
                    href={`/cards/${card.id}`}
                    className="relative w-full pt-[60%] bg-zinc-950 rounded-2xl overflow-hidden p-3 mb-4 flex items-center justify-center border border-zinc-800 block"
                  >
                    <div className="absolute inset-2 flex items-center justify-center transition-transform group-hover:scale-105">
                      {card.giftCardUrl ? (
                        <img
                          src={card.giftCardUrl}
                          alt={`${card.brandName} card`}
                          className="w-full h-full object-contain filter drop-shadow-md"
                        />
                      ) : (
                        <div className="text-center text-white p-2">
                          <p className="font-extrabold text-base">{card.brandName}</p>
                          <p className="text-[10px] text-purple-400">{card.country} • {card.currency}</p>
                        </div>
                      )}
                    </div>
                    <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-[#FF5722] text-white font-black text-xs shadow-md">
                      {card.discountPercentage}% OFF
                    </div>
                  </Link>

                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-400">
                      {card.category}
                    </span>
                    <span className="text-[10px] font-bold text-zinc-400">
                      Region: {card.country}
                    </span>
                  </div>

                  <Link href={`/cards/${card.id}`}>
                    <h3 className="font-extrabold text-lg text-white group-hover:text-purple-400 transition-colors">
                      {card.brandName}
                    </h3>
                  </Link>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-500 block">
                      From
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-black text-white">
                        {card.currencySymbol || '$'}{discountedPrice.toLocaleString()}
                      </span>
                      <span className="text-xs text-zinc-500 line-through">
                        {card.currencySymbol || '$'}{minAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/cards/${card.id}`}
                    className="p-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center transition group-hover:scale-105"
                    title={`Claim ${card.brandName} discount`}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
