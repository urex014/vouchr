'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/common/Logo';
import { useVouchr } from '@/context/VouchrContext';
import { CURRENCIES } from '@/data/currencies';
import { CurrencyCode } from '@/types';
import {
  ShoppingBag,
  Menu,
  X,
  Sparkles,
  User,
  HelpCircle,
  Percent,
  Layers,
  ChevronDown,
} from 'lucide-react';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { currency, setCurrency, cart, setIsCartOpen } = useVouchr();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Gift Cards', href: '/cards' },
    { label: 'Categories', href: '/cards#categories' },
    { label: 'Deals', href: '/#deals' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Support', href: '/support' },
    { label: 'Account', href: '/account' },
    { label: 'Admin', href: '/admin' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-zinc-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Logo size="md" />

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? 'text-purple-700 bg-purple-50'
                    : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/70'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls: Currency, Cart, Primary CTA */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Currency Switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-zinc-200/80 hover:border-zinc-300 text-xs font-bold text-zinc-700 hover:bg-zinc-50 transition"
              aria-label="Select Currency"
            >
              <span>{CURRENCIES[currency]?.flag}</span>
              <span>{currency}</span>
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </button>

            {currencyDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-zinc-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                onMouseLeave={() => setCurrencyDropdownOpen(false)}
              >
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                  Select Currency
                </div>
                {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => {
                  const curr = CURRENCIES[code];
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => {
                        setCurrency(code);
                        setCurrencyDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-xs flex items-center justify-between font-semibold transition ${
                        currency === code ? 'bg-purple-50 text-purple-700' : 'text-zinc-700 hover:bg-zinc-50'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{curr.flag}</span>
                        <span>{curr.label}</span>
                      </span>
                      {currency === code && <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Cart Bag Icon Button */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-xl border border-zinc-200/80 text-zinc-700 hover:text-purple-700 hover:border-purple-200 hover:bg-purple-50/50 transition"
            aria-label="Open Cart Bag"
          >
            <ShoppingBag className="w-5 h-5" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#FF5722] text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                {cart.length}
              </span>
            )}
          </button>

          {/* Primary CTA: "Buy a Gift Card" */}
          <Link
            href="/cards"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm shadow-md shadow-purple-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Buy a Gift Card</span>
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl lg:hidden text-zinc-700 hover:bg-zinc-100 transition"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-20 bottom-0 bg-white z-40 border-t border-zinc-200 p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-top-4 duration-200">
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-3">
              Explore Vouchr
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 hover:bg-purple-50 text-zinc-800 hover:text-purple-700 font-extrabold text-base transition"
              >
                <span>{link.label}</span>
                <span className="text-zinc-400 text-xs">→</span>
              </Link>
            ))}
          </div>

          <div className="mt-8 space-y-4 pt-6 border-t border-zinc-100">
            <Link
              href="/cards"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-4 rounded-2xl bg-purple-700 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25"
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>Buy a Gift Card</span>
            </Link>

            <div className="flex items-center justify-center gap-6 text-xs text-zinc-500 font-medium">
              <span>⚡ 60s Digital Delivery</span>
              <span>•</span>
              <span>🔒 100% Guaranteed</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
