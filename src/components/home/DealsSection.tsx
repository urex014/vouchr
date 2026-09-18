'use client';

import React from 'react';
import Link from 'next/link';
import { GIFT_CARDS } from '@/data/giftCards';
import { BrandIcon } from '@/components/common/BrandIcon';
import { useVouchr } from '@/context/VouchrContext';
import { Percent, Clock, ArrowRight, Zap, ShieldCheck } from 'lucide-react';

export const DealsSection: React.FC = () => {
  const { format } = useVouchr();
  const dealCards = GIFT_CARDS.filter((c) => c.discountPercentage && c.discountPercentage > 0);

  return (
    <section id="deals" className="py-20 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white relative overflow-hidden">
      {/* Glow orb */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5722]/20 border border-[#FF5722]/40 text-[#FF7A59] text-xs font-black uppercase tracking-wider mb-2">
              <Percent className="w-3.5 h-3.5" />
              Limited-Time Exclusive Deals
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Featured discounts & bonuses.
            </h2>
            <p className="text-sm text-zinc-400 mt-1">
              Save instantly on top gaming passes, rides, and marketplace vouchers.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 rounded-xl">
            <Clock className="w-4 h-4" />
            <span>Updated hourly • Auto-applied at checkout</span>
          </div>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dealCards.map((card) => {
            const minAmount = card.denominations[0];
            const discountedPrice = minAmount * (1 - (card.discountPercentage || 0) / 100);

            return (
              <div
                key={card.id}
                className="rounded-3xl bg-zinc-900/80 border border-zinc-800 p-6 flex flex-col justify-between hover:border-purple-500/50 hover:bg-zinc-900 transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 p-2.5 flex items-center justify-center">
                      <BrandIcon brandId={card.id} size={32} className="w-8 h-8" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#FF5722] text-white font-black text-xs shadow-md">
                      {card.discountPercentage}% OFF
                    </span>
                  </div>

                  <h3 className="font-extrabold text-lg text-white group-hover:text-purple-400 transition-colors">
                    {card.brand}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 mt-1">
                    {card.tagline}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-500 block">
                      From
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-black text-white">
                        {format(discountedPrice)}
                      </span>
                      <span className="text-xs text-zinc-500 line-through">
                        {format(minAmount)}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/cards/${card.slug}`}
                    className="p-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center transition group-hover:scale-105"
                    title={`Claim ${card.brand} discount`}
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
