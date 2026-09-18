'use client';

import React from 'react';
import Link from 'next/link';
import { Search, Gift, Send, Zap, CheckCircle2, ArrowRight } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Pick their brand',
      description: 'Choose from 100+ verified digital brands across gaming, music, streaming, dining, rides, and fashion.',
      icon: <Search className="w-6 h-6 text-purple-600" />,
      tag: 'Global & Regional',
    },
    {
      num: '02',
      title: 'Personalize & write a note',
      description: 'Choose any amount, pick a collectible card skin, and type your personal message. Watch your card preview live.',
      icon: <Gift className="w-6 h-6 text-[#FF5722]" />,
      tag: 'Custom Greetings',
    },
    {
      num: '03',
      title: 'Delivered in seconds',
      description: 'Dispatched via email and SMS within 60 seconds with an interactive reveal experience. Or schedule for their exact birthday.',
      icon: <Send className="w-6 h-6 text-emerald-600" />,
      tag: '60s Guaranteed',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white border-y border-zinc-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-black uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 fill-purple-600 text-purple-600" />
            Effortless Gifting
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-950 tracking-tight">
            Pick a card. Send the gift. Done.
          </h2>
          <p className="text-base text-zinc-600">
            No shopping mall trips, no waiting 5 days for plastic mailers, and zero awkward returns.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-[18%] right-[18%] h-0.5 bg-dashed bg-gradient-to-r from-purple-200 via-orange-200 to-emerald-200 -translate-y-8 z-0" />

          {steps.map((step) => (
            <div
              key={step.num}
              className="relative z-10 p-8 rounded-3xl bg-[#FAF9F6] border border-zinc-200/80 hover:border-purple-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-zinc-200 flex items-center justify-center">
                  {step.icon}
                </div>
                <span className="font-mono text-3xl font-black text-zinc-300">
                  {step.num}
                </span>
              </div>

              <div className="space-y-2">
                <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-100/60 px-2.5 py-0.5 rounded-full">
                  {step.tag}
                </span>
                <h3 className="text-xl font-extrabold text-zinc-900 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-200/60 flex items-center gap-2 text-xs font-semibold text-zinc-500">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero hassle checkout</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <Link
            href="/cards"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-base shadow-lg shadow-purple-600/20 transition-all hover:scale-[1.02]"
          >
            <span>Start Gifting in 60s</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
