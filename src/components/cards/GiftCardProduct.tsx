'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Zap, ShieldCheck, ArrowRight, Globe, AlertCircle } from 'lucide-react';
import { CountryCode, GiftCardCategory } from '@/lib/giftcards/types';

export interface GiftCardProductProps {
  brand: string;
  brandLogo: string;
  giftCardImage: string;
  denominations: number[];
  currency: string;
  currencySymbol?: string;
  country: CountryCode;
  countryName?: string;
  category: GiftCardCategory;
  productId: string;
  availability: 'in_stock' | 'low_stock' | 'out_of_stock';
  deliveryMethod: 'digital' | 'scheduled';
  discountPercentage?: number;
}

export const GiftCardProduct: React.FC<GiftCardProductProps> = ({
  brand,
  brandLogo,
  giftCardImage,
  denominations,
  currency,
  currencySymbol = '$',
  country,
  countryName,
  category,
  productId,
  availability,
  deliveryMethod,
  discountPercentage,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const minPrice = denominations[0] || 25;
  const isOutOfStock = availability === 'out_of_stock';

  // Country Flag / Badge styling
  const countryBadge = {
    US: { label: 'United States', flag: '🇺🇸', color: 'bg-blue-50 text-blue-800 border-blue-200' },
    UK: { label: 'United Kingdom', flag: '🇬🇧', color: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
    NG: { label: 'Nigeria', flag: '🇳🇬', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    EU: { label: 'Europe', flag: '🇪🇺', color: 'bg-sky-50 text-sky-800 border-sky-200' },
    KE: { label: 'Kenya', flag: '🇰🇪', color: 'bg-amber-50 text-amber-800 border-amber-200' },
    GLOBAL: { label: 'Global', flag: '🌐', color: 'bg-purple-50 text-purple-800 border-purple-200' },
  }[country] || { label: country, flag: '🌐', color: 'bg-zinc-100 text-zinc-800 border-zinc-200' };

  return (
    <div className="group relative flex flex-col bg-white rounded-3xl border border-zinc-200/90 shadow-sm hover:shadow-xl hover:border-purple-200 transition-all duration-300 overflow-hidden">
      {/* 1. GIFT CARD ARTWORK WRAPPER: Responsive container with object-contain & breathing room */}
      <Link
        href={`/cards/${productId}`}
        className="relative w-full pt-[62%] bg-[#F5F4F0] overflow-hidden flex items-center justify-center p-6 select-none"
      >
        {/* Subtle breathing room padding inside the wrapper */}
        <div className="absolute inset-4 sm:inset-5 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
          <img
            src={giftCardImage}
            alt={`${brand} official digital gift card artwork`}
            className="w-full h-full object-contain filter drop-shadow-md rounded-xl"
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
          />
        </div>

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10 pointer-events-none">
          {/* Region Badge */}
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold border shadow-xs backdrop-blur-xs ${countryBadge.color}`}
          >
            <span>{countryBadge.flag}</span>
            <span>{country}</span>
          </span>

          {/* Discount or Availability Badge */}
          {discountPercentage ? (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-[#FF5722] text-white shadow-xs">
              {discountPercentage}% OFF
            </span>
          ) : isOutOfStock ? (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-zinc-800 text-white">
              Out of stock
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 text-zinc-700 border border-zinc-200 shadow-xs">
              <Zap className="w-3 h-3 text-emerald-600 fill-emerald-600" />
              Digital
            </span>
          )}
        </div>
      </Link>

      {/* 2. PRODUCT METADATA */}
      <div className="flex flex-col flex-1 p-5 sm:p-6">
        {/* Category & Brand row */}
        <div className="flex items-start justify-between gap-3 mb-1">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-700 block mb-0.5">
              {category}
            </span>
            <Link href={`/cards/${productId}`} className="group-hover:text-purple-700 transition">
              <h3 className="font-extrabold text-lg sm:text-xl text-zinc-950 leading-snug">
                {brand}
              </h3>
            </Link>
          </div>

          {/* Brand Logo thumbnail */}
          <div className="w-9 h-9 rounded-xl bg-zinc-50 border border-zinc-200 p-1.5 shrink-0 flex items-center justify-center overflow-hidden">
            <img
              src={brandLogo}
              alt={`${brand} logo`}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Region Clarity Line */}
        <div className="flex items-center gap-1 text-xs text-zinc-500 font-medium mb-3">
          <Globe className="w-3 h-3 text-zinc-400" />
          <span>Region: {countryName || countryBadge.label}</span>
        </div>

        {/* Delivery Method status */}
        <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Available digitally (instant delivery)</span>
        </div>

        {/* Denominations Pill Preview */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {denominations.slice(0, 4).map((d) => (
            <span
              key={d}
              className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-[#FAF9F6] text-zinc-700 border border-zinc-200"
            >
              {currencySymbol}{d.toLocaleString()}
            </span>
          ))}
          {denominations.length > 4 && (
            <span className="text-[11px] font-semibold text-zinc-400 px-1 py-0.5">
              +{denominations.length - 4} more
            </span>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="mt-auto pt-4 border-t border-zinc-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">
              From
            </span>
            <span className="font-black text-lg text-zinc-950">
              {currencySymbol}{minPrice.toLocaleString()} {currency}
            </span>
          </div>

          <Link
            href={`/cards/${productId}`}
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
