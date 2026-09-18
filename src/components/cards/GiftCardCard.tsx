'use client';

import React from 'react';
import Link from 'next/link';
import { GiftCard } from '@/types';
import { BrandIcon } from '@/components/common/BrandIcon';
import { useVouchr } from '@/context/VouchrContext';
import { Zap, Star, ArrowRight } from 'lucide-react';

interface GiftCardCardProps {
  card: GiftCard;
}

export const GiftCardCard: React.FC<GiftCardCardProps> = ({ card }) => {
  const { format } = useVouchr();

  const lowestPriceUSD = card.denominations[0];
  const lowestPriceDiscounted = card.discountPercentage
    ? lowestPriceUSD * (1 - card.discountPercentage / 100)
    : lowestPriceUSD;

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-zinc-200/90 shadow-sm hover:shadow-xl hover:border-purple-300 transition-all duration-300 overflow-hidden">
      {/* Top Banner / Card Artwork Preview */}
      <Link href={`/cards/${card.slug}`} className="block relative h-48 w-full overflow-hidden bg-zinc-950">
        {/* Subtle background glow from card theme */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${card.cardTheme.bgGradient} opacity-95 transition-transform duration-500 group-hover:scale-105`}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_70%)]" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/20 backdrop-blur-md text-white border border-white/20">
            <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />
            Instant
          </span>

          <div className="flex items-center gap-1.5">
            {card.discountPercentage && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-[#FF5722] text-white shadow-sm">
                {card.discountPercentage}% OFF
              </span>
            )}
            <span className="px-2 py-1 rounded-full text-[10px] font-semibold bg-black/40 backdrop-blur-md text-zinc-300 border border-white/10">
              {card.region}
            </span>
          </div>
        </div>

        {/* Center: Brand Logo Artwork */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md p-3 flex items-center justify-center border border-white/20 shadow-lg group-hover:scale-110 transition-transform duration-300">
            <BrandIcon brandId={card.id} size={42} className="w-11 h-11" />
          </div>
        </div>

        {/* Bottom card micro info */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white/80 text-xs z-10">
          <span className="font-semibold tracking-wide truncate">{card.brand}</span>
          <span className="text-[11px] opacity-70">
            {card.denominations.length} amounts
          </span>
        </div>
      </Link>

      {/* Content Body */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <Link href={`/cards/${card.slug}`} className="hover:text-purple-700 transition">
            <h3 className="font-extrabold text-lg text-zinc-900 leading-snug group-hover:text-purple-700 transition-colors">
              {card.brand}
            </h3>
          </Link>

          <div className="flex items-center gap-1 text-amber-500 text-xs font-bold shrink-0 mt-0.5">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{card.rating}</span>
          </div>
        </div>

        <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed mb-4">
          {card.tagline}
        </p>

        {/* Denomination quick preview chips */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {card.denominations.slice(0, 4).map((amt) => (
            <span
              key={amt}
              className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-700 border border-zinc-200"
            >
              {format(amt)}
            </span>
          ))}
          {card.denominations.length > 4 && (
            <span className="text-[11px] font-semibold px-1.5 py-0.5 text-zinc-400">
              +{card.denominations.length - 4} more
            </span>
          )}
        </div>

        {/* Price & Action Footer */}
        <div className="mt-auto pt-3 border-t border-zinc-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-zinc-400 block font-medium">Starting from</span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-base text-zinc-900">
                {format(lowestPriceDiscounted)}
              </span>
              {card.discountPercentage && (
                <span className="text-xs text-zinc-400 line-through">
                  {format(lowestPriceUSD)}
                </span>
              )}
            </div>
          </div>

          <Link
            href={`/cards/${card.slug}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-600 hover:text-white font-bold text-xs transition-all duration-200 group-hover:bg-purple-600 group-hover:text-white"
          >
            <span>Buy now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
