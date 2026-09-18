'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { GiftCardVisual } from '@/components/cards/GiftCardVisual';
import { useVouchr } from '@/context/VouchrContext';
import { GIFT_CARDS } from '@/data/giftCards';
import {
  CheckCircle2,
  Copy,
  Check,
  Zap,
  Mail,
  Share2,
  Download,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { orders, format } = useVouchr();

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [codeRevealed, setCodeRevealed] = useState(false);

  // Find order or fallback to most recent order
  const order = orders.find((o) => o.id === orderId) || orders[0];
  const primaryItem = order?.items[0] || {
    id: 'sample-item',
    giftCard: GIFT_CARDS[0],
    denomination: 30,
    recipientType: 'other' as const,
    recipientName: 'Sarah Chen',
    recipientEmail: 'sarah.chen@example.com',
    senderName: 'Alex Mercer',
    message: 'Enjoy uninterrupted music all year!',
    deliveryOption: 'instant' as const,
    cardDesignSkin: 'classic' as const,
  };

  useEffect(() => {
    // Launch celebratory confetti burst
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7C3AED', '#FF5722', '#10B981', '#F59E0B'],
      });
    } catch (_) {}
  }, []);

  const claimUrl = order?.claimUrl || `https://vouchr.com/claim/${order?.orderNumber || 'VCR-99214'}`;
  const rawCode = order?.voucherCode || 'SPOT-8842-9912-4410';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(claimUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(rawCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Celebratory Banner */}
      <div className="text-center space-y-4 mb-12">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
          <Zap className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
          <span>Delivered in 12 seconds</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-zinc-950 tracking-tight">
          Gift sent.
        </h1>

        <p className="text-zinc-600 text-base max-w-md mx-auto">
          We’ve dispatched the digital gift card to{' '}
          <strong className="text-zinc-900 font-bold">{primaryItem.recipientEmail || 'your email'}</strong>{' '}
          with your custom message.
        </p>

        <div className="text-xs font-mono text-zinc-400">
          Order Reference: <span className="font-bold text-zinc-700">{order?.orderNumber || 'VCR-99214'}</span>
        </div>
      </div>

      {/* Collectible Card Showcase */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/90 shadow-lg mb-8 flex flex-col items-center">
        <div className="w-full flex items-center justify-between text-xs text-zinc-400 font-semibold mb-6">
          <span>Digital Voucher Preview</span>
          <span className="text-emerald-600 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Active & Ready for Redemption
          </span>
        </div>

        <div className="py-2">
          <GiftCardVisual
            card={primaryItem.giftCard}
            denomination={primaryItem.denomination}
            recipientName={primaryItem.recipientName}
            senderName={primaryItem.senderName}
            message={primaryItem.message}
            skin={primaryItem.cardDesignSkin}
            size="md"
            code={codeRevealed ? rawCode : '••••-••••-••••-••••'}
            isInteractive={true}
          />
        </div>

        {/* Voucher Code Reveal Bar */}
        <div className="w-full max-w-md mt-8 p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-zinc-700 uppercase tracking-wider">
              Claim Code
            </span>
            <button
              type="button"
              onClick={() => setCodeRevealed(!codeRevealed)}
              className="text-purple-700 hover:text-purple-900 font-bold flex items-center gap-1"
            >
              {codeRevealed ? (
                <>
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Mask</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Reveal Code</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between gap-2 p-3 bg-white rounded-xl border border-zinc-200 font-mono text-sm font-bold text-zinc-900">
            <span>{codeRevealed ? rawCode : '••••-••••-••••-••••'}</span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-purple-700 hover:bg-purple-50 transition"
              title="Copy code"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Sharing & Receipt Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {/* Share direct claim link */}
        <div className="p-6 rounded-3xl bg-white border border-zinc-200/90 shadow-sm space-y-3">
          <div className="flex items-center gap-2 font-extrabold text-sm text-zinc-900">
            <Share2 className="w-4 h-4 text-purple-700" />
            <span>Share Direct Claim Link</span>
          </div>
          <p className="text-xs text-zinc-500">
            Want to send it directly over WhatsApp, iMessage, or Slack? Copy the personalized link:
          </p>
          <button
            type="button"
            onClick={handleCopyLink}
            className="w-full py-2.5 px-4 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-xs flex items-center justify-center gap-2 border border-purple-200 transition"
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Shareable Link</span>
              </>
            )}
          </button>
        </div>

        {/* Email & Receipt info */}
        <div className="p-6 rounded-3xl bg-white border border-zinc-200/90 shadow-sm space-y-3">
          <div className="flex items-center gap-2 font-extrabold text-sm text-zinc-900">
            <Mail className="w-4 h-4 text-[#FF5722]" />
            <span>Receipt Sent</span>
          </div>
          <p className="text-xs text-zinc-500">
            Your official tax invoice and PDF confirmation have been dispatched to your email address.
          </p>
          <button
            type="button"
            onClick={() => alert('Downloading official receipt PDF...')}
            className="w-full py-2.5 px-4 rounded-xl bg-zinc-50 hover:bg-zinc-100 text-zinc-800 font-bold text-xs flex items-center justify-center gap-2 border border-zinc-200 transition"
          >
            <Download className="w-4 h-4 text-zinc-500" />
            <span>Download PDF Receipt</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Actions */}
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
