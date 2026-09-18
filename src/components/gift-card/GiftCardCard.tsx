'use client';

import React from 'react';
import Link from 'next/link';
import { NormalizedGiftCard } from '@/lib/reloadly/types';
import { GiftCardImage } from './GiftCardImage';
import { Zap, ArrowRight, Globe } from 'lucide-react';

interface GiftCardCardProps {
  card: NormalizedGiftCard;
}

export const GiftCardCard: React.FC<GiftCardCardProps> = ({ card }) => {
  const minPrice = card.denominations[0] || card.minAmount || 25;

  const countryDisplay: Record<string, { label: string; flag: string; badge: string }> = {
    US: { label: 'United States', flag: '🇺🇸', badge: 'bg-blue-50 text-blue-800 border-blue-200' },
    GB: { label: 'United Kingdom', flag: '🇬🇧', badge: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
    NG: { label: 'Nigeria', flag: '🇳🇬', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    KE: { label: 'Kenya', flag: '🇰🇪', badge: 'bg-amber-50 text-amber-800 border-amber-200' },
    EU: { label: 'Europe', flag: '🇪🇺', badge: 'bg-sky-50 text-sky-800 border-sky-200' },
    GLOBAL: { label: 'Global', flag: '🌐', badge: 'bg-purple-50 text-purple-800 border-purple-200' },
  };

  const regionInfo = countryDisplay[card.country] || {
    label: card.countryName,
    flag: '🌍',
    badge: 'bg-zinc-100 text-zinc-800 border-zinc-200',
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-3xl border border-zinc-200/90 shadow-sm hover:shadow-xl hover:border-purple-200 transition-all duration-300 overflow-hidden">
      {/* 1. REAL GIFT CARD IMAGE: The Visual Focus */}
      <Link href={`/cards/${card.id}`} className="block relative p-4 bg-[#FAF9F6]">
        {/* Region & Discount Overlays */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10 pointer-events-none">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold border shadow-xs backdrop-blur-xs ${regionInfo.badge}`}
          >
            <span>{regionInfo.flag}</span>
            <span>{card.country}</span>
          </span>

          {card.discountPercentage ? (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-[#FF5722] text-white shadow-xs">
              {card.discountPercentage}% OFF
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 text-zinc-700 border border-zinc-200 shadow-xs">
              <Zap className="w-3 h-3 text-emerald-600 fill-emerald-600" />
              Instant
            </span>
          )}
        </div>

        <GiftCardImage
          src={card.productImage}
          alt={`${card.brandName} official gift card`}
        />
      </Link>

      {/* 2. PRODUCT METADATA */}
      <div className="flex flex-col flex-1 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-700 block mb-0.5">
              {card.category}
            </span>
            <Link href={`/cards/${card.id}`} className="group-hover:text-purple-700 transition">
              <h3 className="font-extrabold text-lg sm:text-xl text-zinc-950 leading-snug">
                {card.brandName}
              </h3>
            </Link>
          </div>

          <div className="w-8 h-8 rounded-xl bg-zinc-50 border border-zinc-200 p-1 shrink-0 flex items-center justify-center overflow-hidden">
            <img
              src={card.brandLogo}
              alt={`${card.brandName} logo`}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Region line */}
        <div className="flex items-center gap-1 text-xs text-zinc-500 font-medium mb-3">
          <Globe className="w-3 h-3 text-zinc-400" />
          <span>Region: {regionInfo.label}</span>
        </div>

        {/* Available Digitally badge */}
        <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Available digitally</span>
        </div>

        {/* Price & Action Row */}
        <div className="mt-auto pt-4 border-t border-zinc-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">
              From
            </span>
            <span className="font-black text-lg text-zinc-950">
              {card.currencySymbol}{minPrice.toLocaleString()} {card.currency}
            </span>
          </div>

          <Link
            href={`/cards/${card.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs shadow-md shadow-purple-600/15 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Buy Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
