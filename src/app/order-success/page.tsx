'use client';

import React, { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { useVouchr } from '@/context/VouchrContext';
import { MOCK_GIFT_CARDS } from '@/lib/giftcards/mock-provider';
import {
  CheckCircle2,
  Zap,
  Mail,
  ArrowRight,
  ShieldCheck,
  Globe,
  Clock,
  Download,
} from 'lucide-react';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { orders, format } = useVouchr();

  const order = orders.find((o) => o.id === orderId) || orders[0];
  const primaryItem = order?.items[0] || {
    id: 'sample-item',
    giftCard: MOCK_GIFT_CARDS[0],
    denomination: 50,
    quantity: 1,
    recipientType: 'other' as const,
    recipientName: 'Sarah Chen',
    recipientEmail: 'sarah.chen@example.com',
    senderName: 'Alex Mercer',
    message: 'Enjoy your gift!',
    deliveryOption: 'instant' as const,
  };

  useEffect(() => {
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7C3AED', '#FF5722', '#10B981', '#3B82F6'],
      });
    } catch (_) {}
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Success Celebration Header */}
      <div className="text-center space-y-4 mb-12">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
          <Zap className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
          <span>Delivered in 15 seconds</span>
        </div>

        {/* Requested headline */}
        <h1 className="text-4xl sm:text-5xl font-black text-zinc-950 tracking-tight">
          Your gift is on its way.
        </h1>

        <p className="text-zinc-600 text-base max-w-md mx-auto">
          We’ve processed your order through the official provider gateway and dispatched the digital gift card.
        </p>

        <div className="text-xs font-mono text-zinc-400">
          Order Reference: <strong className="text-zinc-700">{order?.orderNumber || 'VCR-US-99214'}</strong>
        </div>
      </div>

      {/* Actual Gift Card Artwork Showcase & Order Metadata */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-zinc-200/90 shadow-lg mb-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Actual gift card image */}
          <div className="md:col-span-5 bg-[#F5F4F0] rounded-2xl p-6 flex items-center justify-center border border-zinc-200 shadow-inner">
            <img
              src={primaryItem.giftCard.giftCardUrl}
              alt={`${primaryItem.giftCard.brand} digital gift card`}
              className="w-full h-auto object-contain filter drop-shadow-lg rounded-xl"
            />
          </div>

          {/* Delivery & Order Details Summary */}
          <div className="md:col-span-7 space-y-4">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-700 block">
                {primaryItem.giftCard.category}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-950">
                {primaryItem.giftCard.brand} Gift Card
              </h2>
              <span className="text-xs text-zinc-500 font-medium flex items-center gap-1 mt-0.5">
                <Globe className="w-3.5 h-3.5 text-zinc-400" />
                Region: {primaryItem.giftCard.countryName} ({primaryItem.giftCard.country})
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-zinc-100 text-xs">
              <div>
                <span className="text-zinc-400 block font-medium">Recipient</span>
                <strong className="text-zinc-900 text-sm">{primaryItem.recipientName || 'Friend'}</strong>
                <span className="text-zinc-500 block truncate">{primaryItem.recipientEmail}</span>
              </div>

              <div>
                <span className="text-zinc-400 block font-medium">Amount</span>
                <strong className="text-zinc-900 text-sm">
                  {primaryItem.giftCard.currencySymbol}{primaryItem.denomination.toLocaleString()} {primaryItem.giftCard.currency}
                </strong>
                <span className="text-zinc-500 block">Quantity: {primaryItem.quantity}</span>
              </div>

              <div>
                <span className="text-zinc-400 block font-medium">Delivery Method</span>
                <span className="text-zinc-800 font-bold capitalize">Instant Digital Email</span>
              </div>

              <div>
                <span className="text-zinc-400 block font-medium">Delivery Status</span>
                <span className="text-emerald-600 font-extrabold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Delivered & Verified
                </span>
              </div>
            </div>

            {primaryItem.message && (
              <div className="p-3 bg-[#FAF9F6] rounded-xl border border-zinc-200 text-xs text-zinc-700 italic">
                &ldquo;{primaryItem.message}&rdquo;
              </div>
            )}
          </div>
        </div>

        {/* Security notice regarding gift card code */}
        <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center gap-3 text-xs text-zinc-600">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <p>
            <strong>Security Protection:</strong> To prevent unauthorized interception, the live voucher claim link has been delivered exclusively to <strong>{primaryItem.recipientEmail}</strong>. You can also monitor delivery status from your customer dashboard.
          </p>
        </div>
      </div>

      {/* Navigation CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/cards"
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20 transition-all hover:scale-[1.02]"
        >
          <span>Send Another Gift</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <Link
          href="/account"
          className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white hover:bg-zinc-50 text-zinc-900 border border-zinc-200 font-extrabold text-sm flex items-center justify-center gap-2 transition hover:border-zinc-300"
        >
          <span>View in Customer Dashboard</span>
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-zinc-900">
      <Header />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="max-w-4xl mx-auto px-4 py-20 text-center text-zinc-500 font-bold">
              Finalizing celebration...
            </div>
          }
        >
          <OrderSuccessContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
