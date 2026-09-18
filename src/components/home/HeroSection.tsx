'use client';

import React from 'react';
import Link from 'next/link';
import { GiftCardVisual } from '@/components/cards/GiftCardVisual';
import { GIFT_CARDS } from '@/data/giftCards';
import { Sparkles, ArrowRight, Zap, ShieldCheck, Heart, Users } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const heroCard1 = GIFT_CARDS.find((c) => c.id === 'apple') || GIFT_CARDS[1];
  const heroCard2 = GIFT_CARDS.find((c) => c.id === 'spotify') || GIFT_CARDS[0];
  const heroCard3 = GIFT_CARDS.find((c) => c.id === 'playstation') || GIFT_CARDS[2];

  const popularBrands = [
    { name: 'Spotify', slug: 'spotify-premium' },
    { name: 'Apple', slug: 'apple-gift-card' },
    { name: 'PlayStation', slug: 'playstation-store' },
    { name: 'Uber', slug: 'uber-and-ubereats' },
    { name: 'Amazon', slug: 'amazon-gift-card' },
    { name: 'Steam', slug: 'steam-wallet' },
    { name: 'Airbnb', slug: 'airbnb-stay-experience' },
    { name: 'Jumia', slug: 'jumia-africa-shopping' },
  ];

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
                {/* Hand-drawn style decorative underline */}
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
              Pick a card. Write your message. Sent straight to their phone and inbox in 60 seconds. No plastic, zero markups, zero guessing games.
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

              <Link
                href="/cards/spotify-premium"
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-zinc-50 text-zinc-900 border-2 border-zinc-200/90 font-extrabold text-base flex items-center justify-center gap-2 transition hover:border-purple-300"
              >
                <Heart className="w-4 h-4 text-[#FF5722]" />
                <span>Send a Gift Now</span>
              </Link>
            </div>

            {/* Popular quick-chips directly below hero */}
            <div className="pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2.5">
                Popular right now:
              </div>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5">
                {popularBrands.map((brand) => (
                  <Link
                    key={brand.slug}
                    href={`/cards/${brand.slug}`}
                    className="text-xs font-bold px-3 py-1.5 rounded-full bg-white hover:bg-purple-50 text-zinc-700 hover:text-purple-700 border border-zinc-200 hover:border-purple-300 shadow-xs transition"
                  >
                    {brand.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Micro Social Proof */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-4 text-xs text-zinc-500 font-medium">
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-[10px] ring-2 ring-white">
                  AB
                </div>
                <div className="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-[10px] ring-2 ring-white">
                  NK
                </div>
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px] ring-2 ring-white">
                  MV
                </div>
              </div>
              <span>
                <strong className="text-zinc-900 font-bold">42,000+</strong> gifts sent • 4.9★ rating
              </span>
            </div>
          </div>

          {/* Right Column: Dynamic Layered Collectible Card Showcase */}
          <div className="lg:col-span-6 relative flex items-center justify-center py-6">
            {/* Background layered angled cards */}
            <div className="relative w-full max-w-md h-[340px] sm:h-[400px] flex items-center justify-center">
              {/* Back Card (PlayStation) - angled left */}
              <div className="absolute -top-4 -left-4 sm:left-0 rotate-[-10deg] scale-90 opacity-75 transition-all duration-500 hover:rotate-[-6deg] hover:opacity-90">
                <GiftCardVisual
                  card={heroCard3}
                  denomination={50}
                  recipientName="Sarah"
                  skin="classic"
                  size="sm"
                />
              </div>

              {/* Middle Card (Spotify) - angled right */}
              <div className="absolute -bottom-2 -right-4 sm:right-2 rotate-[9deg] scale-90 opacity-85 transition-all duration-500 hover:rotate-[5deg] hover:opacity-95">
                <GiftCardVisual
                  card={heroCard2}
                  denomination={30}
                  recipientName="Marcus"
                  skin="midnight-velvet"
                  size="sm"
                />
              </div>

              {/* Front Hero Card (Apple) - prominent center */}
              <div className="relative z-20 scale-100 sm:scale-105 transition-transform duration-300 hover:scale-110">
                <GiftCardVisual
                  card={heroCard1}
                  denomination={100}
                  recipientName="Alex Mercer"
                  senderName="Elena"
                  message="Happy 25th Birthday Alex!"
                  skin="electric-neon"
                  size="md"
                  isInteractive={true}
                />
              </div>

              {/* Floating Pill: Instant Delivery 12s */}
              <div className="absolute -top-3 sm:top-2 right-2 sm:right-8 z-30 px-3.5 py-2 rounded-2xl bg-white shadow-xl border border-zinc-100 flex items-center gap-2 animate-bounce duration-1000">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-zinc-400 uppercase">Speed</div>
                  <div className="text-xs font-black text-zinc-900">Delivered in 12s</div>
                </div>
              </div>

              {/* Floating Pill: Zero Fees */}
              <div className="absolute -bottom-4 sm:bottom-0 left-2 sm:left-6 z-30 px-3.5 py-2 rounded-2xl bg-white shadow-xl border border-zinc-100 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-zinc-400 uppercase">Trust</div>
                  <div className="text-xs font-black text-zinc-900">0% Hidden Fees</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
