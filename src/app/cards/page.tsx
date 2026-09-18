'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { CartDrawer } from '@/components/common/CartDrawer';
import { GiftCardProduct } from '@/components/cards/GiftCardProduct';
import { GiftCard, GiftCardCategory } from '@/types';
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
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

const CATEGORIES: { id: string; name: string; icon: string }[] = [
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

const COUNTRY_FLAGS: Record<string, string> = {
  ALL: '🌍',
  US: '🇺🇸',
  GB: '🇬🇧',
  UK: '🇬🇧',
  NG: '🇳🇬',
  EU: '🇪🇺',
  KE: '🇰🇪',
  CA: '🇨🇦',
  AU: '🇦🇺',
  GLOBAL: '🌐',
};

function MarketplaceCatalog() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialBrand = searchParams.get('brand') || 'all';

  const [cards, setCards] = useState<GiftCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [selectedBrand, setSelectedBrand] = useState<string>(initialBrand);
  const [activeSection, setActiveSection] = useState<string>('all');
  const [onlyDeals, setOnlyDeals] = useState(false);
  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc' | 'brand_asc'>('popular');

  // Load catalog from server-side data layer
  const fetchCatalog = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/giftcards');
      if (!res.ok) {
        throw new Error(`Catalog service responded with status ${res.status}`);
      }
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setCards(json.data);
      } else {
        setCards([]);
      }
    } catch (err: any) {
      console.error('Failed to load gift cards:', err);
      setError(err.message || 'Failed to load gift card catalog');
      setCards([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  // Derive available brands dynamically from active cards
  const availableBrands = useMemo(() => {
    const map = new Map<string, string>();
    for (const card of cards) {
      if (card.brandSlug && !map.has(card.brandSlug)) {
        map.set(card.brandSlug, card.brandName);
      }
    }
    return Array.from(map.entries())
      .map(([slug, name]) => ({ slug, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [cards]);

  // Derive available regions dynamically from active cards
  const availableRegions = useMemo(() => {
    const set = new Set<string>();
    for (const card of cards) {
      if (card.country) set.add(card.country.toUpperCase());
    }
    const list = Array.from(set).map((code) => ({
      id: code,
      name: code === 'GLOBAL' ? 'Global' : code,
      flag: COUNTRY_FLAGS[code] || '🌍',
    }));
    return [{ id: 'ALL', name: 'All Regions', flag: '🌍' }, ...list];
  }, [cards]);

  // Filtered Cards strictly from catalog response
  const filteredCards = useMemo(() => {
    return cards
      .filter((card) => {
        // Must be in stock and available
        if (!card.available || card.availability === 'out_of_stock') {
          return false;
        }

        // Category filter
        if (selectedCategory !== 'All' && selectedCategory !== 'all') {
          if (card.category?.toLowerCase() !== selectedCategory.toLowerCase()) {
            return false;
          }
        }

        // Region / Country filter
        if (selectedRegion !== 'ALL') {
          const cardCountry = (card.country || '').toUpperCase();
          if (cardCountry !== selectedRegion && cardCountry !== 'GLOBAL') {
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

        // Deals filter
        if (onlyDeals && (!card.discountPercentage || card.discountPercentage <= 0)) {
          return false;
        }

        // Live Search query against active products
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const matchesBrand = card.brandName.toLowerCase().includes(q);
          const matchesCategory = (card.category || '').toLowerCase().includes(q);
          const matchesCountry = (card.countryName || card.country || '').toLowerCase().includes(q);
          const matchesDesc = (card.description || '').toLowerCase().includes(q);
          if (!matchesBrand && !matchesCategory && !matchesCountry && !matchesDesc) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') {
          const aMin = a.denominations?.[0] || 0;
          const bMin = b.denominations?.[0] || 0;
          return aMin - bMin;
        }
        if (sortBy === 'price_desc') {
          const aMin = a.denominations?.[0] || 0;
          const bMin = b.denominations?.[0] || 0;
          return bMin - aMin;
        }
        if (sortBy === 'brand_asc') return a.brandName.localeCompare(b.brandName);
        return 0; // default order
      });
  }, [cards, searchQuery, selectedCategory, selectedRegion, selectedBrand, activeSection, onlyDeals, sortBy]);

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
            Verified Gift Cards
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-950 tracking-tight">
            Digital Gift Card Marketplace
          </h1>
          <p className="text-zinc-600 text-sm sm:text-base mt-1.5">
            Instant digital gift cards from top brands worldwide.
          </p>
        </div>

        {/* Live Search Input */}
        <div className="relative w-full md:w-80 lg:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search brands, regions, categories..."
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
                <option value="all">All Brands ({availableBrands.length})</option>
                {availableBrands.map((b) => (
                  <option key={b.slug} value={b.slug}>
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
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-zinc-800 focus:outline-none focus:border-purple-600 cursor-pointer"
              >
                {availableRegions.map((r) => (
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
          <strong>Region Notice:</strong> Gift card redemption is country-specific. Ensure you choose the correct country (e.g. US cards for US accounts, UK cards for UK accounts).
        </span>
      </div>

      {/* Loading Skeleton State */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="h-80 bg-white rounded-3xl border border-zinc-200 p-6 flex flex-col justify-between">
              <div className="w-full h-40 bg-zinc-100 rounded-2xl" />
              <div className="space-y-2">
                <div className="h-3 w-16 bg-zinc-100 rounded" />
                <div className="h-5 w-32 bg-zinc-100 rounded" />
              </div>
              <div className="h-4 w-24 bg-zinc-100 rounded" />
            </div>
          ))}
        </div>
      ) : filteredCards.length > 0 ? (
        /* Product Cards Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
      ) : cards.length === 0 ? (
        /* Empty Catalog State */
        <div className="py-20 text-center bg-white rounded-3xl border border-zinc-200 p-8 max-w-lg mx-auto space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-extrabold text-zinc-900">No Gift Cards Currently Available</h3>
          <p className="text-xs text-zinc-500 leading-relaxed max-w-md mx-auto">
            Our digital gift card inventory updates dynamically. Please check back shortly or refresh the catalog.
          </p>
          <button
            type="button"
            onClick={fetchCatalog}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-700 text-white font-bold text-xs hover:bg-purple-800 transition shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Catalog</span>
          </button>
        </div>
      ) : (
        /* Filter Empty State */
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
