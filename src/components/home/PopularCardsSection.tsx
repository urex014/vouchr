'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GIFT_CARDS } from '@/data/giftCards';
import { GiftCardCard } from '@/components/cards/GiftCardCard';
import { GiftCardCategory } from '@/types';
import { ArrowRight, Flame } from 'lucide-react';

export const PopularCardsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<GiftCardCategory>('all');

  const filteredCards = GIFT_CARDS.filter((card) => {
    if (activeCategory === 'all') return card.isPopular;
    return card.category === activeCategory;
  }).slice(0, 8);

  const tabs: { label: string; value: GiftCardCategory }[] = [
    { label: '🔥 Most Popular', value: 'all' },
    { label: 'Entertainment', value: 'entertainment' },
    { label: 'Gaming', value: 'gaming' },
    { label: 'Shopping', value: 'shopping' },
    { label: 'Food', value: 'food' },
  ];

  return (
    <section className="py-20 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-purple-700 mb-1.5">
              <Flame className="w-3.5 h-3.5 text-[#FF5722] fill-[#FF5722]" />
              Trending Digital Vouchers
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
              Popular gift cards.
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveCategory(tab.value)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                  activeCategory === tab.value
                    ? 'bg-purple-700 text-white shadow-md shadow-purple-600/20'
                    : 'bg-white text-zinc-600 hover:text-zinc-950 border border-zinc-200/80 hover:bg-zinc-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCards.map((card) => (
            <GiftCardCard key={card.id} card={card} />
          ))}
        </div>

        {/* View All CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/cards"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white hover:bg-zinc-50 text-zinc-900 border-2 border-zinc-200 font-extrabold text-sm shadow-sm hover:border-purple-400 transition-all hover:scale-[1.02]"
          >
            <span>Explore all {GIFT_CARDS.length} brands</span>
            <ArrowRight className="w-4 h-4 text-purple-700" />
          </Link>
        </div>
      </div>
    </section>
  );
};
