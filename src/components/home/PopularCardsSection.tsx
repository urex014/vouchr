'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MOCK_GIFT_CARDS } from '@/lib/giftcards/mock-provider';
import { GiftCardProduct } from '@/components/cards/GiftCardProduct';
import { GiftCardCategory } from '@/lib/giftcards/types';
import { ArrowRight, Flame } from 'lucide-react';

export const PopularCardsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<GiftCardCategory | 'All'>('All');

  const filteredCards = MOCK_GIFT_CARDS.filter((card) => {
    if (activeCategory === 'All') return card.isPopular;
    return card.category === activeCategory;
  }).slice(0, 8);

  const tabs: { label: string; value: GiftCardCategory | 'All' }[] = [
    { label: '🔥 Most Popular', value: 'All' },
    { label: 'Shopping', value: 'Shopping' },
    { label: 'Gaming', value: 'Gaming' },
    { label: 'Entertainment', value: 'Entertainment' },
    { label: 'Food', value: 'Food' },
    { label: 'Travel', value: 'Travel' },
  ];

  return (
    <section className="py-20 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-purple-700 mb-1.5">
              <Flame className="w-3.5 h-3.5 text-[#FF5722] fill-[#FF5722]" />
              Trending Gift Cards
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
              Popular gift cards.
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              Top requested brands delivered digitally within 60 seconds.
            </p>
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

        {/* Product Cards Grid with real gift card artwork */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCards.map((card) => (
            <GiftCardProduct
              key={card.id}
              productId={card.id}
              brand={card.brand}
              brandLogo={card.logoUrl}
              giftCardImage={card.giftCardUrl}
              denominations={card.denominations}
              currency={card.currency}
              currencySymbol={card.currencySymbol}
              country={card.country}
              countryName={card.countryName}
              category={card.category}
              availability={card.availability}
              deliveryMethod={card.deliveryMethod}
              discountPercentage={card.discountPercentage}
            />
          ))}
        </div>

        {/* View All CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/cards"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white hover:bg-zinc-50 text-zinc-900 border-2 border-zinc-200 font-extrabold text-sm shadow-sm hover:border-purple-400 transition-all hover:scale-[1.02]"
          >
            <span>Explore all {MOCK_GIFT_CARDS.length} brands in marketplace</span>
            <ArrowRight className="w-4 h-4 text-purple-700" />
          </Link>
        </div>
      </div>
    </section>
  );
};
