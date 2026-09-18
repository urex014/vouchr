'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { GiftCard } from '@/types';
import { GiftCardProduct } from '@/components/cards/GiftCardProduct';
import { ArrowRight, Flame, Sparkles } from 'lucide-react';

export const PopularCardsSection: React.FC = () => {
  const [cards, setCards] = useState<GiftCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    let active = true;
    async function loadCards() {
      try {
        const res = await fetch('/api/giftcards');
        if (res.ok) {
          const json = await res.json();
          if (active && Array.isArray(json.data)) {
            setCards(json.data.filter((c: GiftCard) => c.available));
          }
        }
      } catch (err) {
        console.warn('Failed to load popular cards:', err);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadCards();
    return () => {
      active = false;
    };
  }, []);

  const filteredCards = cards
    .filter((card) => {
      if (activeCategory === 'All') return true;
      return card.category?.toLowerCase() === activeCategory.toLowerCase();
    })
    .slice(0, 8);

  const tabs: { label: string; value: string }[] = [
    { label: '🔥 All Cards', value: 'All' },
    { label: 'Shopping', value: 'Shopping' },
    { label: 'Gaming', value: 'Gaming' },
    { label: 'Entertainment', value: 'Entertainment' },
    { label: 'Food', value: 'Food' },
    { label: 'Travel', value: 'Travel' },
  ];

  // If loading and no cards, or if no cards available
  if (!loading && cards.length === 0) {
    return null;
  }

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
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 bg-white rounded-3xl border border-zinc-200 p-6" />
            ))}
          </div>
        ) : filteredCards.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCards.map((card) => (
              <GiftCardProduct
                key={card.id}
                productId={card.id}
                brand={card.brand}
                brandLogo={card.logoUrl}
                giftCardImage={card.giftCardUrl}
                denominations={card.denominations || [25, 50, 100]}
                currency={card.currency || 'USD'}
                currencySymbol={card.currencySymbol || '$'}
                country={card.country || 'GLOBAL'}
                countryName={card.countryName}
                category={card.category as any}
                availability={card.availability}
                deliveryMethod={card.deliveryMethod as any}
                discountPercentage={card.discountPercentage}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center bg-white rounded-3xl border border-zinc-200 p-8 max-w-md mx-auto space-y-3">
            <Sparkles className="w-8 h-8 text-purple-600 mx-auto" />
            <h3 className="font-extrabold text-lg text-zinc-900">No cards in this category yet</h3>
            <p className="text-xs text-zinc-500">Explore all other categories in our marketplace.</p>
          </div>
        )}

        {/* View All CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/cards"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white hover:bg-zinc-50 text-zinc-900 border-2 border-zinc-200 font-extrabold text-sm shadow-sm hover:border-purple-400 transition-all hover:scale-[1.02]"
          >
            <span>Explore all {cards.length > 0 ? `${cards.length} brands` : 'gift cards'} in marketplace</span>
            <ArrowRight className="w-4 h-4 text-purple-700" />
          </Link>
        </div>
      </div>
    </section>
  );
};
