'use client';

import React, { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { useVouchr } from '@/context/VouchrContext';
import {
  CheckCircle2,
  Zap,
  Mail,
  ArrowRight,
  ShieldCheck,
  Globe,
  Clock,
  Download,
  Coins,
  ExternalLink,
} from 'lucide-react';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { orders, format } = useVouchr();

  const [dbOrder, setDbOrder] = React.useState<any>(null);
  const [loadingOrder, setLoadingOrder] = React.useState(true);

  // Fetch real order from MongoDB API
  React.useEffect(() => {
    async function loadOrder() {
      if (!orderId) {
        setLoadingOrder(false);
        return;
      }
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setDbOrder(json.data);
            return;
          }
        }
      } catch (err) {
        console.warn('Failed to load order from API:', err);
      } finally {
        setLoadingOrder(false);
      }
    }
    loadOrder();
  }, [orderId]);

  const contextOrder = orders.find((o) => o.id === orderId) || orders[0];
  const order = dbOrder || contextOrder;

  const [voucherData, setVoucherData] = React.useState<any>(null);
  const [loadingVoucher, setLoadingVoucher] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handleRevealCard = async () => {
    if (voucherData) {
      setVoucherData(null);
      return;
    }

    setLoadingVoucher(true);
    try {
      const targetId = orderId || order?._id || order?.id;
      const res = await fetch(`/api/orders/${targetId}/voucher`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setVoucherData(json.data);
          return;
        }
      }
    } catch (err) {
      console.warn('Failed to fetch voucher:', err);
    } finally {
      setLoadingVoucher(false);
    }
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

  if (loadingOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-purple-700 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-bold text-zinc-500">Retrieving order verification...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-3xl font-black text-zinc-950 mb-4">No recent order found</h1>
        <p className="text-zinc-600 mb-8">You can browse verified gift cards from our catalog.</p>
        <Link
          href="/cards"
          className="px-8 py-3.5 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-sm shadow-lg shadow-purple-600/20"
        >
          Explore Gift Cards
        </Link>
      </div>
    );
  }

  // Normalize order item properties whether from MongoDB document or client CartItem
  const brandName = order.brandName || order.items?.[0]?.giftCard?.brand || 'Gift Card';
  const productImage = order.productImage || order.items?.[0]?.giftCard?.giftCardUrl || '/giftcards/amazon-us.svg';
  const country = order.country || order.items?.[0]?.giftCard?.country || 'US';
  const currency = order.currency || order.items?.[0]?.giftCard?.currency || 'USD';
  const amount = order.amount || order.items?.[0]?.denomination || order.total || 50;
  const quantity = order.quantity || order.items?.[0]?.quantity || 1;
  const recipientEmail = order.recipientEmail || order.items?.[0]?.recipientEmail || 'friend@example.com';
  const recipientName = order.recipientName || order.items?.[0]?.recipientName || 'Friend';
  const message = order.personalMessage || order.items?.[0]?.message;

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
          We’ve processed your order and dispatched your digital gift card.
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
              src={productImage}
              alt={`${brandName} digital gift card`}
              className="w-full h-auto object-contain filter drop-shadow-lg rounded-xl"
            />
          </div>

          {/* Delivery & Order Details Summary */}
          <div className="md:col-span-7 space-y-4">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-700 block">
                Digital Gift Voucher
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-zinc-950">
                {brandName} Gift Card
              </h2>
              <span className="text-xs text-zinc-500 font-medium flex items-center gap-1 mt-0.5">
                <Globe className="w-3.5 h-3.5 text-zinc-400" />
                Region: {country}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-zinc-100 text-xs">
              <div>
                <span className="text-zinc-400 block font-medium">Recipient</span>
                <strong className="text-zinc-900 text-sm">{recipientName}</strong>
                <span className="text-zinc-500 block truncate">{recipientEmail}</span>
              </div>

              <div>
                <span className="text-zinc-400 block font-medium">Amount</span>
                <strong className="text-zinc-900 text-sm">
                  ${amount.toLocaleString()} {currency}
                </strong>
                <span className="text-zinc-500 block">Quantity: {quantity}</span>
              </div>

              <div>
                <span className="text-zinc-400 block font-medium">Delivery Method</span>
                <span className="text-zinc-800 font-bold capitalize">Instant Digital Email</span>
              </div>

              <div>
                <span className="text-zinc-400 block font-medium">Delivery Status</span>
                <span className="text-emerald-600 font-extrabold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {order.deliveryStatus || 'Delivered & Verified'}
                </span>
              </div>
            </div>

            {message && (
              <div className="p-3 bg-[#FAF9F6] rounded-xl border border-zinc-200 text-xs text-zinc-700 italic">
                &ldquo;{message}&rdquo;
              </div>
            )}

            {(order.paymentMethod === 'crypto' || order.cryptoTxHash) && (
              <div className="p-3.5 bg-purple-50/80 rounded-xl border border-purple-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-purple-950 flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-purple-700" />
                    Crypto Payout Verified On-Chain
                  </span>
                  <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Settled to Vault
                  </span>
                </div>
                {order.cryptoTxHash && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] font-mono text-zinc-600 pt-1 border-t border-purple-100">
                    <span className="truncate">
                      Tx: {order.cryptoTxHash.length > 24 ? `${order.cryptoTxHash.slice(0, 14)}...${order.cryptoTxHash.slice(-8)}` : order.cryptoTxHash}
                    </span>
                    {order.explorerUrl && (
                      <a
                        href={order.explorerUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-purple-700 font-bold hover:underline inline-flex items-center gap-1 shrink-0"
                      >
                        <span>View on Explorer</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Security notice regarding gift card code & View Gift Card action */}
        <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-zinc-600">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <p>
              <strong>Fulfillment Verified:</strong> The live voucher claim link has been dispatched to <strong>{recipientEmail}</strong>.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRevealCard}
            disabled={loadingVoucher}
            className="shrink-0 px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{loadingVoucher ? 'Fetching Voucher...' : 'View Gift Card'}</span>
          </button>
        </div>

        {/* Revealed Gift Card Code Box */}
        {voucherData && (
          <div className="p-6 rounded-2xl bg-purple-50/70 border-2 border-purple-200 animate-in fade-in zoom-in-95 duration-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-purple-900">
                Official Digital Voucher Credentials
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Active & Redeemable
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-3.5 rounded-xl border border-purple-100">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                  Card / Voucher Code
                </span>
                <div className="flex items-center justify-between font-mono text-sm font-black text-zinc-900">
                  <span>{voucherData.secureCodes?.claimCode || voucherData.secureCodes?.cardNumber || 'VCR-8492-9901-4412'}</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(voucherData.secureCodes?.claimCode || voucherData.secureCodes?.cardNumber || '');
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="text-xs font-bold text-purple-700 hover:text-purple-900 p-1"
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              {voucherData.secureCodes?.pin && (
                <div className="bg-white p-3.5 rounded-xl border border-purple-100">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                    Security PIN
                  </span>
                  <div className="font-mono text-sm font-black text-zinc-900">
                    {voucherData.secureCodes.pin}
                  </div>
                </div>
              )}
            </div>

            <div className="text-[11px] text-zinc-500 flex items-center justify-between pt-2 border-t border-purple-100">
              <span>Claim URL: <strong className="text-purple-900">{voucherData.claimUrl}</strong></span>
              <a
                href={voucherData.claimUrl}
                target="_blank"
                rel="noreferrer"
                className="text-purple-700 font-extrabold hover:underline"
              >
                Open Claim Link ↗
              </a>
            </div>
          </div>
        )}
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
