'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { CartDrawer } from '@/components/common/CartDrawer';
import { GiftCardCard } from '@/components/cards/GiftCardCard';
import { GIFT_CARDS, CATEGORIES } from '@/data/giftCards';
import { GiftCardCategory } from '@/types';
import {
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  ArrowUpDown,
  Filter,
  Check,
  Percent,
} from 'lucide-react';

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const initialCategory = (searchParams.get('category') as GiftCardCategory) || 'all';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GiftCardCategory>(initialCategory);
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [onlyDeals, setOnlyDeals] = useState(false);
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'discount' | 'alphabetical'>('popular');
  const [maxPrice, setMaxPrice] = useState<number>(500);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const regions = [
    { id: 'all', label: 'All Regions' },
    { id: 'Global', label: 'Global' },
    { id: 'US', label: 'United States' },
    { id: 'UK', label: 'United Kingdom' },
    { id: 'Africa', label: 'Africa (NG, KE, GH)' },
    { id: 'Europe', label: 'Europe' },
  ];

  const filteredCards = useMemo(() => {
    return GIFT_CARDS.filter((card) => {
      // Category filter
      if (selectedCategory !== 'all' && card.category !== selectedCategory) {
        return false;
      }

      // Region filter
      if (selectedRegion !== 'all') {
        if (selectedRegion === 'Africa') {
          const isAfrican = card.regionsSupported.some((r) => ['NG', 'KE', 'GH', 'ZA'].includes(r));
          if (!isAfrican && card.region !== 'Africa') return false;
        } else if (!card.regionsSupported.includes(selectedRegion) && card.region !== selectedRegion) {
          return false;
        }
      }

      // Only deals filter
      if (onlyDeals && (!card.discountPercentage || card.discountPercentage <= 0)) {
        return false;
      }

      // Max price filter (lowest denomination)
      if (card.denominations[0] > maxPrice) {
        return false;
      }

      // Search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesBrand = card.brand.toLowerCase().includes(query);
        const matchesTagline = card.tagline.toLowerCase().includes(query);
        const matchesDesc = card.description.toLowerCase().includes(query);
        const matchesCategory = card.category.toLowerCase().includes(query);
        if (!matchesBrand && !matchesTagline && !matchesDesc && !matchesCategory) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') {
        return a.denominations[0] - b.denominations[0];
      }
      if (sortBy === 'price-desc') {
        return b.denominations[0] - a.denominations[0];
      }
      if (sortBy === 'discount') {
        return (b.discountPercentage || 0) - (a.discountPercentage || 0);
      }
      if (sortBy === 'alphabetical') {
        return a.brand.localeCompare(b.brand);
      }
      // default 'popular'
      return (b.rating * b.reviewsCount) - (a.rating * a.reviewsCount);
    });
  }, [searchQuery, selectedCategory, selectedRegion, onlyDeals, sortBy, maxPrice]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedRegion('all');
    setOnlyDeals(false);
    setMaxPrice(500);
    setSortBy('popular');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategory !== 'all' ||
    selectedRegion !== 'all' ||
    onlyDeals ||
    maxPrice < 500;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Page Title & Search Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-zinc-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#FF5722] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Verified Digital Vouchers
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-950 tracking-tight">
            Gift Card Marketplace
          </h1>
          <p className="text-zinc-600 text-sm sm:text-base mt-1.5">
            Instant delivery to any inbox or mobile number. 100% genuine codes guaranteed.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80 lg:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search brands (e.g. Spotify, Uber, Steam)..."
            className="w-full pl-10 pr-9 py-3 rounded-2xl bg-white border border-zinc-200 focus:border-purple-600 focus:ring-2 focus:ring-purple-100 text-sm font-medium text-zinc-900 placeholder-zinc-400 transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Categories Bar */}
      <div className="py-6 flex items-center gap-2 overflow-x-auto scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as GiftCardCategory)}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-purple-700 text-white shadow-md shadow-purple-600/20'
                  : 'bg-white text-zinc-700 hover:text-zinc-950 border border-zinc-200/90 hover:border-purple-200 hover:bg-zinc-50'
              }`}
            >
              <span>{cat.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                  isSelected ? 'bg-purple-900/60 text-purple-100' : 'bg-zinc-100 text-zinc-500'
                }`}
              >
                {cat.id === 'all' ? GIFT_CARDS.length : cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Secondary Controls Bar: Region, Deals Toggle, Sort, Price Filter */}
      <div className="bg-white rounded-2xl p-4 border border-zinc-200/90 mb-8 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Region & Deals quick toggle */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Region selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-zinc-500">Region:</span>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-zinc-50 border border-zinc-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-zinc-800 focus:outline-none focus:border-purple-600 cursor-pointer"
            >
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Deals toggle */}
          <button
            type="button"
            onClick={() => setOnlyDeals(!onlyDeals)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold border transition ${
              onlyDeals
                ? 'bg-[#FF5722] text-white border-[#FF5722]'
                : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
            }`}
          >
            <Percent className="w-3.5 h-3.5" />
            <span>Discounted Only</span>
          </button>
        </div>

        {/* Right: Results Count & Sort Dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-zinc-500">
            {filteredCards.length} {filteredCards.length === 1 ? 'card' : 'cards'} found
          </span>

          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-zinc-50 border border-zinc-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-zinc-800 focus:outline-none focus:border-purple-600 cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="discount">Highest Discount</option>
              <option value="price-asc">Starting Price: Low to High</option>
              <option value="price-desc">Starting Price: High to Low</option>
              <option value="alphabetical">Brand Name: A to Z</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-bold text-purple-700 hover:text-purple-900 underline ml-1"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Product Grid */}
      {filteredCards.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCards.map((card) => (
            <GiftCardCard key={card.id} card={card} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-20 text-center bg-white rounded-3xl border border-zinc-200 p-8 max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-extrabold text-zinc-900">No gift cards matched your filters</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Try adjusting your search query, switching categories, or clearing region restrictions.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="px-5 py-2.5 rounded-xl bg-purple-700 text-white font-bold text-xs hover:bg-purple-800 transition"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-zinc-900">
      <Header />
      <CartDrawer />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="max-w-7xl mx-auto px-4 py-20 text-center text-zinc-500 font-bold">
              Loading Gift Card Marketplace...
            </div>
          }
        >
          <MarketplaceContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
