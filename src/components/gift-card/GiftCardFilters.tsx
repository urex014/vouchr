'use client';

import React from 'react';
import { Search, X, ArrowUpDown, Percent } from 'lucide-react';

export interface FilterState {
  search: string;
  category: string;
  country: string;
  brand: string;
  sortBy: string;
  onlyDiscounts: boolean;
}

interface GiftCardFiltersProps {
  filters: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  availableBrands: { id: string; name: string }[];
  availableCountries: { isoName: string; name: string; flag: string }[];
  categories: string[];
  totalResults: number;
  onReset: () => void;
}

export const GiftCardFilters: React.FC<GiftCardFiltersProps> = ({
  filters,
  onFilterChange,
  availableBrands,
  availableCountries,
  categories,
  totalResults,
  onReset,
}) => {
  const hasActiveFilters =
    filters.search !== '' ||
    filters.category !== 'All' ||
    filters.country !== 'ALL' ||
    filters.brand !== 'all' ||
    filters.onlyDiscounts;

  return (
    <div className="space-y-4 mb-8">
      {/* Search and Top Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Search Amazon, Apple, Steam, Spotify..."
            className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-white border border-zinc-200 text-sm font-medium focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-100 shadow-xs"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onFilterChange({ search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results Counter & Sort */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          <span className="text-xs font-bold text-zinc-500">
            {totalResults} {totalResults === 1 ? 'gift card' : 'gift cards'}
          </span>

          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value })}
              className="bg-white border border-zinc-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-zinc-800 focus:outline-none focus:border-purple-600 cursor-pointer shadow-xs"
            >
              <option value="popular">Popular</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="brand_asc">Brand: A to Z</option>
              <option value="discount">Discounts</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills Rail */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
        {categories.map((cat) => {
          const isSelected = filters.category === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onFilterChange({ category: cat })}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                isSelected
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'bg-white text-zinc-700 hover:text-zinc-950 border border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Dropdown Filters Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-zinc-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Brand Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-zinc-500">Brand:</span>
            <select
              value={filters.brand}
              onChange={(e) => onFilterChange({ brand: e.target.value })}
              className="bg-zinc-50 border border-zinc-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-zinc-800 focus:outline-none focus:border-purple-600 cursor-pointer"
            >
              <option value="all">All Brands ({availableBrands.length})</option>
              {availableBrands.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Region / Country Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-zinc-500">Region:</span>
            <select
              value={filters.country}
              onChange={(e) => onFilterChange({ country: e.target.value })}
              className="bg-zinc-50 border border-zinc-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-zinc-800 focus:outline-none focus:border-purple-600 cursor-pointer"
            >
              <option value="ALL">All Countries / Regions</option>
              {availableCountries.map((c) => (
                <option key={c.isoName} value={c.isoName}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Discounts Only Toggle */}
          <button
            type="button"
            onClick={() => onFilterChange({ onlyDiscounts: !filters.onlyDiscounts })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold border transition ${
              filters.onlyDiscounts
                ? 'bg-[#FF5722] text-white border-[#FF5722]'
                : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
            }`}
          >
            <Percent className="w-3.5 h-3.5" />
            <span>Discounts</span>
          </button>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-bold text-purple-700 hover:text-purple-900 underline"
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
};
