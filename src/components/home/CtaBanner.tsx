'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Gift } from 'lucide-react';

export const CtaBanner: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-950 p-10 sm:p-16 text-center text-white overflow-hidden shadow-2xl shadow-purple-900/30">
          {/* Ambient decorative glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Good gifts start here.</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
              Ready to make someone’s day in seconds?
            </h2>

            <p className="text-base sm:text-lg text-purple-100 max-w-xl mx-auto font-normal">
              No wrapping paper. No shipping delays. Choose from over 100 global brands and send joy directly to their pocket.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/cards"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-zinc-950 hover:bg-zinc-100 font-extrabold text-base flex items-center justify-center gap-2.5 shadow-xl transition-all hover:scale-[1.03] active:scale-[0.98]"
              >
                <span>Shop Gift Cards</span>
                <ArrowRight className="w-5 h-5 text-purple-700" />
              </Link>

              <Link
                href="/cards/apple-gift-card"
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-[#FF5722] hover:bg-[#F4511E] text-white font-extrabold text-base flex items-center justify-center gap-2 transition shadow-lg shadow-orange-500/25"
              >
                <Gift className="w-4 h-4" />
                <span>Send Apple Gift Card</span>
              </Link>
            </div>

            <div className="pt-4 text-xs text-purple-200/80 font-medium">
              ⚡ Instant email & SMS delivery • 🔒 100% money-back guarantee • 🎁 Zero markups
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
