'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/common/Logo';
import { ShieldCheck, Zap, Heart, RefreshCw, Mail, ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-950 text-white border-t border-zinc-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Trust Banner */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-14 border-b border-zinc-800/80">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-zinc-100">60-Second Delivery</h4>
              <p className="text-xs text-zinc-400">Delivered digitally via email & SMS</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-zinc-100">Zero Hidden Fees</h4>
              <p className="text-xs text-zinc-400">Pay exact face value with total clarity</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-zinc-100">Swap Guarantee</h4>
              <p className="text-xs text-zinc-400">Recipients can exchange cards for free</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-zinc-100">Personalized Gifting</h4>
              <p className="text-xs text-zinc-400">Custom message and digital reveal</p>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 py-12">
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-4">
            <Logo variant="white" size="lg" />
            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
              The easiest and most enjoyable place to buy a gift card online. Pick any brand, write your note, and send in 60 seconds.
            </p>
            <div className="pt-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                Stay updated on secret card drops
              </div>
              <form onSubmit={(e) => e.preventDefault()} className="flex max-w-sm gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 flex-1"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition shrink-0"
                >
                  Join
                </button>
              </form>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Shop</h5>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><Link href="/cards" className="hover:text-white transition">All Gift Cards</Link></li>
              <li><Link href="/cards?category=gaming" className="hover:text-white transition">Gaming Passes</Link></li>
              <li><Link href="/cards?category=entertainment" className="hover:text-white transition">Entertainment</Link></li>
              <li><Link href="/cards?category=shopping" className="hover:text-white transition">Shopping Vouchers</Link></li>
              <li><Link href="/cards?category=food" className="hover:text-white transition">Food & Dining</Link></li>
              <li><Link href="/cards?category=travel" className="hover:text-white transition">Travel & Stays</Link></li>
            </ul>
          </div>

          {/* Platform */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Platform</h5>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><Link href="/#how-it-works" className="hover:text-white transition">How It Works</Link></li>
              <li><Link href="/#deals" className="hover:text-white transition">Deals & Cashback</Link></li>
              <li><Link href="/account" className="hover:text-white transition">Customer Dashboard</Link></li>
              <li><Link href="/support" className="hover:text-white transition">Help Center & FAQ</Link></li>
              <li><Link href="/support#contact" className="hover:text-white transition">Contact Support</Link></li>
              <li><span className="text-zinc-600 text-xs cursor-not-allowed">Corporate & Bulk Orders (Coming Soon)</span></li>
            </ul>
          </div>

          {/* Trust & Guarantee */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-widest text-zinc-400">The Vouchr Promise</h5>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Every digital code issued by Vouchr is generated straight from authorized brand partners. If your recipient experiences any redemption issue, our concierge resolves it or issues a 100% refund.
            </p>
            <div className="pt-2 text-xs font-mono text-zinc-500">
              <div>Region: Global / Multi-Currency</div>
              <div>System Status: All APIs 100% Operational</div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            © {new Date().getFullYear()} Vouchr Inc. Good gifts start here.
          </div>
          <div className="flex items-center gap-5">
            <Link href="/support" className="hover:text-zinc-300 transition">Privacy Policy</Link>
            <Link href="/support" className="hover:text-zinc-300 transition">Terms of Service</Link>
            <Link href="/support" className="hover:text-zinc-300 transition">Security Disclosure</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
