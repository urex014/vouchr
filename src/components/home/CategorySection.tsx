'use client';

import React from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/data/giftCards';
import {
  Gamepad2,
  Film,
  ShoppingBag,
  Utensils,
  Plane,
  Heart,
  CreditCard,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const CategorySection: React.FC = () => {
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Gamepad2':
        return <Gamepad2 className="w-6 h-6" />;
      case 'Film':
        return <Film className="w-6 h-6" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-6 h-6" />;
      case 'Utensils':
        return <Utensils className="w-6 h-6" />;
      case 'Plane':
        return <Plane className="w-6 h-6" />;
      case 'Heart':
        return <Heart className="w-6 h-6" />;
      case 'CreditCard':
        return <CreditCard className="w-6 h-6" />;
      default:
        return <Sparkles className="w-6 h-6" />;
    }
  };

  return (
    <section id="categories" className="py-16 bg-white border-b border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-[#FF5722] mb-1">
              Curated Collections
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 tracking-tight">
              Browse by category.
            </h2>
          </div>

          <Link
            href="/cards"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-purple-700 hover:text-purple-900 transition"
          >
            <span>View all 100+ cards</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Categories Grid / Horizontal Scroll for Mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
            <Link
              key={cat.id}
              href={`/cards?category=${cat.id}`}
              className="group p-5 rounded-2xl bg-zinc-50 hover:bg-white border border-zinc-200/80 hover:border-purple-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between h-36 relative overflow-hidden"
            >
              {/* Subtle gradient flash on hover */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-100/50 to-orange-100/50 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

              <div className="flex items-center justify-between z-10">
                <div className="w-12 h-12 rounded-xl bg-white border border-zinc-200 shadow-xs flex items-center justify-center text-purple-700 group-hover:bg-purple-700 group-hover:text-white group-hover:border-purple-700 transition-colors">
                  {getCategoryIcon(cat.icon)}
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-zinc-200/60 text-zinc-600">
                  {cat.count} cards
                </span>
              </div>

              <div className="z-10">
                <h3 className="font-extrabold text-base text-zinc-900 group-hover:text-purple-700 transition-colors">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-zinc-500 font-medium group-hover:text-zinc-700 transition">
                  Explore vouchers →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
