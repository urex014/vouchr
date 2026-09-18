'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { CartDrawer } from '@/components/common/CartDrawer';
import { GiftCardProduct } from '@/components/cards/GiftCardProduct';
import { MOCK_GIFT_CARDS, MOCK_BRANDS } from '@/lib/giftcards/mock-provider';
import { GiftCardCategory, CountryCode } from '@/lib/giftcards/types';
import {
  Search,
  Globe,
  SlidersHorizontal,
  X,
  Sparkles,
  Flame,
  ArrowUpDown,
  Tag,
  Check,
  Percent,
} from 'lucide-react';

const CATEGORIES: { id: GiftCardCategory | 'All'; name: string; icon: string }[] = [
  { id: 'All', name: 'All Cards', icon: 'Sparkles' },
  { id: 'Shopping', name: 'Shopping', icon: 'ShoppingBag' },
  { id: 'Gaming', name: 'Gaming', icon: 'Gamepad2' },
  { id: 'Entertainment', name: 'Entertainment', icon: 'Film' },
  { id: 'Food', name: 'Food & Dining', icon: 'Utensils' },
  { id: 'Travel', name: 'Travel & Rides', icon: 'Plane' },
  { id: 'Subscriptions', name: 'Subscriptions', icon: 'CreditCard' },
  { id: 'Lifestyle', name: 'Lifestyle', icon: 'Heart' },
  { id: 'Digital Services', name: 'Digital Services', icon: 'Zap' },
];

const SECTIONS = [
  { id: 'all', label: 'All Catalog' },
  { id: 'popular', label: '🔥 Popular Gift Cards' },
  { id: 'trending', label: '⚡ Trending' },
  { id: 'bestsellers', label: '⭐ Best Sellers' },
  { id: 'gaming', label: '🎮 Gaming' },
  { id: 'shopping', label: '🛍️ Shopping' },
  { id: 'entertainment', label: '🎬 Entertainment' },
  { id: 'recently_added', label: '✨ Recently Added' },
];

const REGIONS: { id: CountryCode | 'ALL'; name: string; flag: string }[] = [
  { id: 'ALL', name: 'All Regions', flag: '🌍' },
  { id: 'US', name: 'United States', flag: '🇺🇸' },
  { id: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
  { id: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { id: 'EU', name: 'Europe', flag: '🇪🇺' },
  { id: 'GLOBAL', name: 'Global / Worldwide', flag: '🌐' },
];

function MarketplaceCatalog() {
  const searchParams = useSearchParams();
  const initialCategory = (searchParams.get('category') as GiftCardCategory) || 'All';
  const initialBrand = searchParams.get('brand') || 'all';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GiftCardCategory | 'All'>(initialCategory);
  const [selectedRegion, setSelectedRegion] = useState<CountryCode | 'ALL'>('ALL');
  const [selectedBrand, setSelectedBrand] = useState<string>(initialBrand);
  const [activeSection, setActiveSection] = useState<string>('all');
  const [onlyDeals, setOnlyDeals] = useState(false);
  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc' | 'brand_asc'>('popular');

  // Filtered Cards
  const filteredCards = useMemo(() => {
    return MOCK_GIFT_CARDS.filter((card) => {
      // Category
      if (selectedCategory !== 'All' && card.category !== selectedCategory) {
        return false;
      }

      // Region / Country
      if (selectedRegion !== 'ALL') {
        if (card.country !== selectedRegion && card.country !== 'GLOBAL') {
          return false;
        }
      }

      // Brand filter
      if (selectedBrand !== 'all') {
        if (card.brandSlug.toLowerCase() !== selectedBrand.toLowerCase()) {
          return false;
        }
      }

      // Section tag filter
      if (activeSection !== 'all') {
        if (activeSection === 'popular' && !card.isPopular) return false;
        if (activeSection === 'trending' && !card.isTrending) return false;
        if (activeSection === 'bestsellers' && !card.isBestSeller) return false;
        if (activeSection === 'gaming' && card.category !== 'Gaming') return false;
        if (activeSection === 'shopping' && card.category !== 'Shopping') return false;
        if (activeSection === 'entertainment' && card.category !== 'Entertainment') return false;
        if (activeSection === 'recently_added' && !card.isRecentlyAdded) return false;
      }

      // Deals
      if (onlyDeals && (!card.discountPercentage || card.discountPercentage <= 0)) {
        return false;
      }

      // Search Query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesBrand = card.brand.toLowerCase().includes(q);
        const matchesCategory = card.category.toLowerCase().includes(q);
        const matchesCountry = card.countryName.toLowerCase().includes(q);
        const matchesDesc = card.description.toLowerCase().includes(q);
        if (!matchesBrand && !matchesCategory && !matchesCountry && !matchesDesc) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.denominations[0] - b.denominations[0];
      if (sortBy === 'price_desc') return b.denominations[0] - a.denominations[0];
      if (sortBy === 'brand_asc') return a.brand.localeCompare(b.brand);
      return 0; // default order
    });
  }, [searchQuery, selectedCategory, selectedRegion, selectedBrand, activeSection, onlyDeals, sortBy]);

  const resetAll = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedRegion('ALL');
    setSelectedBrand('all');
    setActiveSection('all');
    setOnlyDeals(false);
    setSortBy('popular');
  };

  const hasFilters =
    searchQuery !== '' ||
    selectedCategory !== 'All' ||
    selectedRegion !== 'ALL' ||
    selectedBrand !== 'all' ||
    activeSection !== 'all' ||
    onlyDeals;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-zinc-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-[#FF5722] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Official Brand Catalog
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-950 tracking-tight">
            Digital Gift Card Marketplace
          </h1>
          <p className="text-zinc-600 text-sm sm:text-base mt-1.5">
            Authentic digital gift cards from authorized provider networks. Real artwork, instant delivery.
          </p>
        </div>

        {/* Live Search Input */}
        <div className="relative w-full md:w-80 lg:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Amazon, Apple, Netflix, Steam..."
            className="w-full pl-10 pr-9 py-3 rounded-2xl bg-white border border-zinc-200 text-sm font-medium focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-100 shadow-xs"
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

      {/* Curated Sections Rail */}
      <div className="py-6 flex items-center gap-2 overflow-x-auto scrollbar-none border-b border-zinc-200/60">
        {SECTIONS.map((sec) => (
          <button
            key={sec.id}
            type="button"
            onClick={() => setActiveSection(sec.id)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
              activeSection === sec.id
                ? 'bg-purple-700 text-white shadow-md shadow-purple-600/20'
                : 'bg-white text-zinc-700 hover:text-zinc-950 border border-zinc-200 hover:bg-zinc-50'
            }`}
          >
            {sec.label}
          </button>
        ))}
      </div>

      {/* Filter Toolbar: Brand Selector, Region Selector, Category Pills, Deals, Sort */}
      <div className="py-6 space-y-4">
        {/* Row 1: Category filter pills */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === cat.id
                  ? 'bg-zinc-900 text-white'
                  : 'bg-white text-zinc-600 hover:text-zinc-900 border border-zinc-200 hover:border-zinc-300'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Row 2: Secondary Dropdown Filters (Brand, Region, Sort, Deals) */}
        <div className="bg-white rounded-2xl p-4 border border-zinc-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Searchable Brand Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-zinc-500">Brand:</span>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-zinc-800 focus:outline-none focus:border-purple-600 cursor-pointer"
              >
                <option value="all">All Brands ({MOCK_BRANDS.length})</option>
                {MOCK_BRANDS.map((b) => (
                  <option key={b.id} value={b.slug}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Region / Country Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-zinc-500">Region:</span>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value as any)}
                className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-zinc-800 focus:outline-none focus:border-purple-600 cursor-pointer"
              >
                {REGIONS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.flag} {r.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Discounted Only Toggle */}
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
              <span>Discounts Only</span>
            </button>
          </div>

          {/* Right: Results Count & Sort */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-zinc-500">
              {filteredCards.length} {filteredCards.length === 1 ? 'gift card' : 'gift cards'}
            </span>

            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-zinc-800 focus:outline-none focus:border-purple-600 cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="brand_asc">Brand: A to Z</option>
              </select>
            </div>

            {hasFilters && (
              <button
                type="button"
                onClick={resetAll}
                className="text-xs font-bold text-purple-700 hover:text-purple-900 underline ml-1"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Region Compatibility Notice */}
      <div className="mb-8 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
        <Globe className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          <strong>Region Notice:</strong> Gift card redemption is region-locked by each brand. Ensure you choose the correct country (e.g. US cards for US accounts, Nigeria cards for Nigerian accounts).
        </span>
      </div>

      {/* Product Cards Grid using the reusable GiftCardProduct component */}
      {filteredCards.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
      ) : (
        /* Empty State */
        <div className="py-20 text-center bg-white rounded-3xl border border-zinc-200 p-8 max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-extrabold text-zinc-900">No gift cards matched your criteria</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Try adjusting your brand selector, clearing region filters, or resetting search keywords.
          </p>
          <button
            type="button"
            onClick={resetAll}
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
          <MarketplaceCatalog />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
