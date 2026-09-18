'use client';

import React from 'react';
import { NormalizedGiftCard } from '@/lib/reloadly/types';
import { GiftCardCard } from './GiftCardCard';
import { Search, AlertCircle } from 'lucide-react';

interface GiftCardGridProps {
  cards: NormalizedGiftCard[];
  isLoading?: boolean;
  onResetFilters?: () => void;
}

export const GiftCardGrid: React.FC<GiftCardGridProps> = ({
  cards,
  isLoading = false,
  onResetFilters,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="rounded-3xl bg-white border border-zinc-200/80 p-5 space-y-4 animate-pulse"
          >
            <div className="w-full pt-[62%] bg-zinc-200/70 rounded-2xl" />
            <div className="space-y-2">
              <div className="h-4 w-24 bg-zinc-200 rounded" />
              <div className="h-6 w-3/4 bg-zinc-200 rounded" />
              <div className="h-3 w-1/2 bg-zinc-200 rounded" />
            </div>
            <div className="pt-4 border-t border-zinc-100 flex justify-between items-center">
              <div className="h-6 w-20 bg-zinc-200 rounded" />
              <div className="h-8 w-24 bg-zinc-200 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="py-20 text-center bg-white rounded-3xl border border-zinc-200 p-8 max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
          <Search className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-extrabold text-zinc-900">
          No matching gift cards found
        </h3>
        <p className="text-xs text-zinc-500 leading-relaxed">
          Reloadly does not have active inventory matching your current region or keyword filters.
        </p>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="px-5 py-2.5 rounded-xl bg-purple-700 text-white font-bold text-xs hover:bg-purple-800 transition"
          >
            Reset Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {cards.map((card) => (
        <GiftCardCard key={card.id} card={card} />
      ))}
    </div>
  );
};
