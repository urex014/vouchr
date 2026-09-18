'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { BrandIcon } from '@/components/common/BrandIcon';
import { useVouchr } from '@/context/VouchrContext';
import { GIFT_CARDS } from '@/data/giftCards';
import { CartItem } from '@/types';
import {
  ShieldCheck,
  Lock,
  CreditCard,
  Zap,
  CheckCircle2,
  ArrowRight,
  Clock,
  Sparkles,
  Smartphone,
  Coins,
  ChevronRight,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotalUSD, currency, format, createOrder, addToCart } = useVouchr();

  // If cart is empty, provide a fallback Spotify card so user can test checkout seamlessly
  const checkoutItems: CartItem[] = cart.length > 0 ? cart : [
    {
      id: 'fallback-ci',
      giftCard: GIFT_CARDS[0],
      denomination: 30,
      recipientType: 'other',
      recipientName: 'Taylor Morgan',
      recipientEmail: 'taylor.m@example.com',
      senderName: 'Alex Mercer',
      message: 'Happy Birthday Taylor! Enjoy the music.',
      deliveryOption: 'instant',
      cardDesignSkin: 'classic',
    }
  ];

  const primaryItem = checkoutItems[0];

  // Checkout form state
  const [senderName, setSenderName] = useState(primaryItem.senderName || 'Alex Mercer');
  const [senderEmail, setSenderEmail] = useState('alex.mercer@example.com');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'mobile_money' | 'crypto'>('card');
  
  // Card input fields
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<string>('');

  const totalPayableUSD = cart.length > 0
    ? cartTotalUSD
    : primaryItem.denomination * (1 - (primaryItem.giftCard.discountPercentage || 0) / 100);

  const handlePayAndSend = () => {
    setIsProcessing(true);
    setProcessingStage('Encrypting and securing transaction...');

    setTimeout(() => {
      setProcessingStage('Connecting to brand authorized provider...');
    }, 900);

    setTimeout(() => {
      setProcessingStage('Generating digital voucher security token...');
    }, 1800);

    setTimeout(() => {
      setProcessingStage('Finalizing instant dispatch to recipient...');
    }, 2600);

    setTimeout(() => {
      // Create order
      const newOrder = createOrder({
        items: checkoutItems,
        totalUSD: totalPayableUSD,
        currency,
        totalInCurrency: totalPayableUSD,
        paymentMethod: paymentMethod === 'card' ? 'card' : paymentMethod === 'apple_pay' ? 'apple_pay' : paymentMethod === 'mobile_money' ? 'mobile_money' : 'crypto',
        paymentStatus: 'completed',
        deliveryStatus: 'delivered',
        deliveryTimestamp: new Date().toISOString(),
      });

      router.push(`/order-success?orderId=${newOrder.id}`);
    }, 3400);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-zinc-900">
      <Header />

      <main className="flex-1 py-10 sm:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header & Trust Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-zinc-200">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#FF5722]">
                Instant Dispatch
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
                Secure Checkout
              </h1>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-2xl">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>256-Bit SSL Encrypted & Verified</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* LEFT COLUMN: Minimal Checkout Fields */}
            <div className="lg:col-span-7 space-y-6">
              {/* 1. Sender Information (For Receipt) */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-zinc-200/90 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-zinc-900">
                    1. Sender Information
                  </h3>
                  <span className="text-xs text-zinc-400">Where we send your receipt</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-700 block mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="Alex Mercer"
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm font-medium focus:border-purple-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-700 block mb-1">
                      Your Email (Receipt & Tracking)
                    </label>
                    <input
                      type="email"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      placeholder="alex.mercer@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm font-medium focus:border-purple-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Payment Method */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-zinc-200/90 shadow-sm space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-zinc-900">
                    2. Payment Method
                  </h3>
                  <span className="text-xs font-bold text-emerald-600">Zero Payment Fees</span>
                </div>

                {/* Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-2xl border text-xs font-extrabold flex flex-col items-center gap-1.5 transition ${
                      paymentMethod === 'card'
                        ? 'border-purple-600 bg-purple-50 text-purple-900 shadow-xs'
                        : 'border-zinc-200 hover:border-zinc-300 text-zinc-700 bg-zinc-50'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Credit Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('apple_pay')}
                    className={`p-3 rounded-2xl border text-xs font-extrabold flex flex-col items-center gap-1.5 transition ${
                      paymentMethod === 'apple_pay'
                        ? 'border-purple-600 bg-purple-50 text-purple-900 shadow-xs'
                        : 'border-zinc-200 hover:border-zinc-300 text-zinc-700 bg-zinc-50'
                    }`}
                  >
                    <Zap className="w-5 h-5 text-amber-500" />
                    <span>Apple / Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mobile_money')}
                    className={`p-3 rounded-2xl border text-xs font-extrabold flex flex-col items-center gap-1.5 transition ${
                      paymentMethod === 'mobile_money'
                        ? 'border-purple-600 bg-purple-50 text-purple-900 shadow-xs'
                        : 'border-zinc-200 hover:border-zinc-300 text-zinc-700 bg-zinc-50'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-emerald-600" />
                    <span>Mobile Money</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('crypto')}
                    className={`p-3 rounded-2xl border text-xs font-extrabold flex flex-col items-center gap-1.5 transition ${
                      paymentMethod === 'crypto'
                        ? 'border-purple-600 bg-purple-50 text-purple-900 shadow-xs'
                        : 'border-zinc-200 hover:border-zinc-300 text-zinc-700 bg-zinc-50'
                    }`}
                  >
                    <Coins className="w-5 h-5 text-indigo-600" />
                    <span>USDC / Crypto</span>
                  </button>
                </div>

                {/* Card Fields */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="text-xs font-bold text-zinc-700 block mb-1">
                        Card Number
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 font-mono text-sm focus:border-purple-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-zinc-700 block mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/YY"
                          className="w-full px-4 py-3 rounded-xl border border-zinc-200 font-mono text-sm focus:border-purple-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-zinc-700 block mb-1">
                          CVC / CVV
                        </label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          placeholder="123"
                          className="w-full px-4 py-3 rounded-xl border border-zinc-200 font-mono text-sm focus:border-purple-600 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'apple_pay' && (
                  <div className="p-5 rounded-2xl bg-zinc-950 text-white text-center space-y-2">
                    <p className="text-xs text-zinc-400">
                      Instant biometric authorization will be requested on confirmation.
                    </p>
                    <div className="text-sm font-extrabold flex items-center justify-center gap-1">
                      <span>Ready with Face ID / Touch ID</span>
                    </div>
                  </div>
                )}

                {paymentMethod === 'mobile_money' && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2 text-xs text-emerald-900">
                    <p className="font-bold">Instant African Mobile Settlement:</p>
                    <p>Supports M-Pesa (Kenya), Paystack/Flutterwave Bank Transfer (Nigeria), and MTN Mobile Money (Ghana). Instant prompt will be pushed to your phone.</p>
                  </div>
                )}

                {paymentMethod === 'crypto' && (
                  <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2 text-xs text-purple-950">
                    <p className="font-bold">Zero-slippage Stablecoin Settlement:</p>
                    <p>Accepts USDC & USDT on Solana, Polygon, and Base. Zero gas fees charged to you.</p>
                  </div>
                )}
              </div>

              {/* Secure guarantee callout */}
              <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-zinc-200 flex items-center gap-4 text-xs text-zinc-600">
                <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="font-extrabold text-zinc-900">Vouchr 100% Delivery Guarantee</h4>
                  <p className="mt-0.5">If your recipient does not receive the code or encounters any redemption error, we refund or re-issue instantly.</p>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Order Summary & Pay Button */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-zinc-200/90 shadow-sm space-y-6">
                <h3 className="font-extrabold text-lg text-zinc-900 pb-3 border-b border-zinc-100">
                  Order Summary ({checkoutItems.length} {checkoutItems.length === 1 ? 'card' : 'cards'})
                </h3>

                {/* Items preview list */}
                <div className="space-y-4">
                  {checkoutItems.map((item) => {
                    const discount = item.giftCard.discountPercentage || 0;
                    const finalItemPrice = item.denomination * (1 - discount / 100);

                    return (
                      <div
                        key={item.id}
                        className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex items-start gap-3.5"
                      >
                        <div className="w-12 h-12 rounded-xl bg-zinc-950 flex items-center justify-center shrink-0 p-2">
                          <BrandIcon brandId={item.giftCard.id} size={28} className="w-7 h-7" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-extrabold text-sm text-zinc-900 truncate">
                              {item.giftCard.brand}
                            </h4>
                            <span className="font-black text-sm text-zinc-900">
                              {format(finalItemPrice)}
                            </span>
                          </div>

                          <div className="text-xs text-zinc-500 mt-0.5">
                            Card Value: <strong className="text-zinc-800">{format(item.denomination)}</strong>
                          </div>

                          <div className="text-xs text-zinc-500">
                            Recipient:{' '}
                            <span className="text-zinc-800 font-semibold">
                              {item.recipientName || 'Gift Recipient'} ({item.recipientEmail || 'Immediate email'})
                            </span>
                          </div>

                          {item.message && (
                            <div className="mt-2 text-[11px] text-zinc-500 italic bg-white p-2 rounded-lg border border-zinc-200 truncate">
                              &ldquo;{item.message}&rdquo;
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 pt-4 border-t border-zinc-100 text-xs">
                  <div className="flex justify-between text-zinc-600">
                    <span>Card Face Value</span>
                    <span className="font-semibold text-zinc-900">
                      {format(checkoutItems.reduce((acc, i) => acc + i.denomination, 0))}
                    </span>
                  </div>

                  <div className="flex justify-between text-zinc-600">
                    <span>Digital Issuance & Delivery</span>
                    <span className="font-bold text-emerald-600">FREE ($0.00)</span>
                  </div>

                  <div className="flex justify-between text-zinc-600">
                    <span>Vouchr Service Fee</span>
                    <span className="font-bold text-emerald-600">FREE ($0.00)</span>
                  </div>

                  <div className="flex justify-between text-base font-extrabold text-zinc-950 pt-3 border-t border-zinc-100">
                    <span>Total Due Now</span>
                    <span className="text-2xl text-purple-700 font-black">
                      {format(totalPayableUSD)}
                    </span>
                  </div>
                </div>

                {/* Pay & Send Button */}
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handlePayAndSend}
                  className="w-full py-4 rounded-2xl bg-purple-700 hover:bg-purple-800 disabled:bg-purple-400 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-xl shadow-purple-600/25 transition-all hover:scale-[1.01] active:scale-[0.98]"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>{processingStage}</span>
                    </div>
                  ) : (
                    <>
                      <span>Pay & Send Instantly</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <div className="text-center text-[11px] text-zinc-400 space-y-1">
                  <p>By completing this payment, your gift card will be dispatched immediately.</p>
                  <p>Guaranteed genuine code backed by Vouchr partner agreement.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
