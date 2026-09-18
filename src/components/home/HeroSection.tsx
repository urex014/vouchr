'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { GiftCard } from '@/types';
import { Sparkles, ArrowRight, Zap, ShieldCheck, Heart, Globe, Gift } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const [cards, setCards] = useState<GiftCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadHeroCards() {
      try {
        const res = await fetch('/api/giftcards');
        if (res.ok) {
          const json = await res.json();
          if (active && Array.isArray(json.data)) {
            setCards(json.data.filter((c: GiftCard) => c.available));
          }
        }
      } catch (err) {
        console.warn('Hero section could not fetch cards:', err);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadHeroCards();
    return () => {
      active = false;
    };
  }, []);

  const heroCard1 = cards[0];
  const heroCard2 = cards[1];
  const heroCard3 = cards[2];

  const popularBrands = cards.slice(0, 6).map((c) => ({
    name: c.brandName,
    id: c.id,
  }));

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF9F6] via-white to-[#FAF9F6] pt-12 pb-20 lg:pt-16 lg:pb-28">
      {/* Decorative ambient background orbs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none -z-10">
        <div className="absolute top-0 right-10 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl" />
        <div className="absolute top-12 left-10 w-80 h-80 bg-orange-200/35 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline, Copy, CTAs */}
          <div className="lg:col-span-6 space-y-7 text-center lg:text-left">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100/80 border border-purple-200 text-purple-900 text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>The modern way to buy & send digital gift cards</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5722]" />
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-zinc-950 tracking-tight leading-[1.08]">
              Give them a gift they’ll{' '}
              <span className="relative whitespace-nowrap">
                <span className="text-purple-700">actually use.</span>
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-[#FF5722]"
                  viewBox="0 0 250 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 9C60 3 190 3 247 9"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Supporting Subtext */}
            <p className="text-base sm:text-lg text-zinc-600 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
              Pick a card. Write your message. Sent straight to their phone and inbox in 60 seconds. Official brand cards, verified digital codes, zero markups.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-1">
              <Link
                href="/cards"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-base flex items-center justify-center gap-2.5 shadow-xl shadow-purple-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Shop Gift Cards</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              {heroCard1 ? (
                <Link
                  href={`/cards/${heroCard1.id}`}
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-zinc-50 text-zinc-900 border-2 border-zinc-200/90 font-extrabold text-base flex items-center justify-center gap-2 transition hover:border-purple-300"
                >
                  <Heart className="w-4 h-4 text-[#FF5722]" />
                  <span>Send {heroCard1.brandName} Card</span>
                </Link>
              ) : (
                <Link
                  href="/cards"
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-zinc-50 text-zinc-900 border-2 border-zinc-200/90 font-extrabold text-base flex items-center justify-center gap-2 transition hover:border-purple-300"
                >
                  <Gift className="w-4 h-4 text-purple-600" />
                  <span>Browse Catalog</span>
                </Link>
              )}
            </div>

            {/* Popular Brand Chips */}
            {popularBrands.length > 0 && (
              <div className="pt-2">
                <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2.5">
                  Popular Brands:
                </div>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5">
                  {popularBrands.map((brand) => (
                    <Link
                      key={brand.id}
                      href={`/cards/${brand.id}`}
                      className="text-xs font-bold px-3 py-1.5 rounded-full bg-white hover:bg-purple-50 text-zinc-700 hover:text-purple-700 border border-zinc-200 hover:border-purple-300 shadow-xs transition"
                    >
                      {brand.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Micro Social Proof */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-4 text-xs text-zinc-500 font-medium">
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-[10px] ring-2 ring-white">
                  AM
                </div>
                <div className="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-[10px] ring-2 ring-white">
                  SC
                </div>
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] ring-2 ring-white">
                  KM
                </div>
              </div>
              <span>
                <strong className="text-zinc-900 font-bold">100% Genuine</strong> digital codes • Instant email delivery
              </span>
            </div>
          </div>

          {/* Right Column: Actual Gift Card Artwork Showcase */}
          <div className="lg:col-span-6 relative flex items-center justify-center py-6">
            <div className="relative w-full max-w-md h-[340px] sm:h-[400px] flex items-center justify-center">
              {heroCard3 && (
                /* Back Left Card */
                <div className="absolute -top-3 -left-4 sm:left-2 rotate-[-9deg] scale-90 opacity-80 transition-all duration-300 hover:rotate-[-5deg] hover:opacity-100 hover:scale-95 shadow-xl rounded-2xl bg-zinc-900 p-2 border border-zinc-800">
                  <div className="w-64 sm:w-72 aspect-[1.6] bg-black rounded-xl overflow-hidden flex items-center justify-center p-3">
                    {heroCard3.giftCardUrl ? (
                      <img
                        src={heroCard3.giftCardUrl}
                        alt={heroCard3.brandName}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-center text-white">
                        <p className="font-black text-lg">{heroCard3.brandName}</p>
                        <p className="text-xs text-purple-300">{heroCard3.currency}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {heroCard2 && (
                /* Back Right Card */
                <div className="absolute -bottom-2 -right-4 sm:right-2 rotate-[8deg] scale-90 opacity-85 transition-all duration-300 hover:rotate-[4deg] hover:opacity-100 hover:scale-95 shadow-xl rounded-2xl bg-white p-2 border border-zinc-200">
                  <div className="w-64 sm:w-72 aspect-[1.6] bg-zinc-50 rounded-xl overflow-hidden flex items-center justify-center p-3">
                    {heroCard2.giftCardUrl ? (
                      <img
                        src={heroCard2.giftCardUrl}
                        alt={heroCard2.brandName}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-center text-zinc-900">
                        <p className="font-black text-lg">{heroCard2.brandName}</p>
                        <p className="text-xs text-purple-600">{heroCard2.currency}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Center Hero Card */}
              {heroCard1 ? (
                <div className="relative z-20 scale-100 sm:scale-105 transition-transform duration-300 hover:scale-110 shadow-2xl rounded-3xl bg-zinc-950 p-2.5 border border-zinc-800">
                  <div className="w-72 sm:w-80 aspect-[1.6] bg-[#131921] rounded-2xl overflow-hidden flex items-center justify-center p-4">
                    {heroCard1.giftCardUrl ? (
                      <img
                        src={heroCard1.giftCardUrl}
                        alt={heroCard1.brandName}
                        className="w-full h-full object-contain filter drop-shadow-lg"
                      />
                    ) : (
                      <div className="text-center text-white">
                        <p className="font-black text-2xl">{heroCard1.brandName}</p>
                        <p className="text-sm text-purple-400 font-bold">{heroCard1.country} • {heroCard1.currency}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Sleek Default Gift Card Placeholder */
                <div className="relative z-20 scale-100 sm:scale-105 shadow-2xl rounded-3xl bg-gradient-to-br from-purple-900 via-zinc-900 to-black p-6 border border-zinc-800 text-white w-72 sm:w-80 aspect-[1.6] flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
                      Instant Digital
                    </span>
                    <Sparkles className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-black text-2xl tracking-tight">Digital Gift Card</h3>
                    <p className="text-xs text-zinc-400 mt-1">Instant delivery to phone & email</p>
                  </div>
                </div>
              )}

              {/* Floating Speed Pill */}
              <div className="absolute -top-3 sm:top-2 right-2 sm:right-6 z-30 px-3.5 py-2 rounded-2xl bg-white shadow-xl border border-zinc-100 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-zinc-400 uppercase">Speed</div>
                  <div className="text-xs font-black text-zinc-900">Delivered in 15s</div>
                </div>
              </div>

              {/* Floating Trust Pill */}
              <div className="absolute -bottom-4 sm:bottom-0 left-2 sm:left-4 z-30 px-3.5 py-2 rounded-2xl bg-white shadow-xl border border-zinc-100 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-zinc-400 uppercase">Verified Safe</div>
                  <div className="text-xs font-black text-zinc-900">100% Genuine Codes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
