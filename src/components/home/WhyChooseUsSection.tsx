'use client';

import React from 'react';
import { WHY_CHOOSE_US } from '@/data/giftCards';
import { Zap, ShieldCheck, BadgeCheck, RefreshCw } from 'lucide-react';

export const WhyChooseUsSection: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap':
        return <Zap className="w-6 h-6 text-purple-600" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-[#FF5722]" />;
      case 'BadgeCheck':
        return <BadgeCheck className="w-6 h-6 text-emerald-600" />;
      case 'RefreshCw':
        return <RefreshCw className="w-6 h-6 text-indigo-600" />;
      default:
        return <ShieldCheck className="w-6 h-6 text-purple-600" />;
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="text-xs font-black uppercase tracking-widest text-purple-700">
            Trust & Performance
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
            Built for peace of mind.
          </h2>
          <p className="text-base text-zinc-600">
            Digital gift cards shouldn’t feel complicated or risky. Here is why over 42,000 shoppers rely on Vouchr every month.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {WHY_CHOOSE_US.map((item) => (
            <div
              key={item.title}
              className="p-6 rounded-2xl bg-[#FAF9F6] border border-zinc-200/80 hover:border-purple-300 hover:shadow-md transition-all space-y-3"
            >
              <div className="w-12 h-12 rounded-xl bg-white shadow-xs border border-zinc-200/70 flex items-center justify-center">
                {getIcon(item.icon)}
              </div>
              <h3 className="font-extrabold text-lg text-zinc-900 leading-snug">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
