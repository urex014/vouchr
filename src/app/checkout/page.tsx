'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { useVouchr } from '@/context/VouchrContext';
import { CartItem } from '@/types';
import {
  ShieldCheck,
  Lock,
  CreditCard,
  Zap,
  CheckCircle2,
  ArrowRight,
  Globe,
  Smartphone,
  Coins,
  ChevronRight,
  User,
  Mail,
  Gift,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotalUSD, currency, format, createOrder } = useVouchr();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-zinc-900">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 mb-6">
            <Gift className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-zinc-950 mb-3">Your gift bag is empty</h1>
          <p className="text-zinc-600 max-w-md mb-8">
            Choose a digital gift card from our marketplace to proceed to checkout.
          </p>
          <Link
            href="/cards"
            className="px-8 py-4 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-sm shadow-xl shadow-purple-600/20 transition-all hover:scale-[1.02]"
          >
            Explore Gift Cards
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const checkoutItems: CartItem[] = cart;
  const primaryItem = checkoutItems[0];

  // Steps state (1: Gift card, 2: Recipient, 3: Payment, 4: Confirmation)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(3);

  // Recipient details state
  const [recipientEmail, setRecipientEmail] = useState(primaryItem.recipientEmail || '');
  const [recipientName, setRecipientName] = useState(primaryItem.recipientName || '');
  const [senderName, setSenderName] = useState(primaryItem.senderName || '');
  const [personalMessage, setPersonalMessage] = useState(primaryItem.message || 'Enjoy your gift!');

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'mobile_money' | 'crypto'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  // Processing & error states
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const totalUSD = cartTotalUSD;

  const handlePayAndSend = async () => {
    if (!recipientEmail || !recipientEmail.includes('@')) {
      setCurrentStep(2);
      setErrorMessage('Please provide a valid recipient email address.');
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);
    setProcessingStage('Verifying payment on secure server...');

    try {
      const payload = {
        paymentMethod,
        cardDetails: paymentMethod === 'card' ? {
          cardNumber,
          cardExpiry,
          cardCvc,
        } : undefined,
        reloadlyProductId: primaryItem.giftCard.numericId || Number(primaryItem.giftCard.id) || 101,
        amount: primaryItem.denomination,
        currency: primaryItem.giftCard.currency,
        quantity: primaryItem.quantity,
        customerEmail: 'alex.mercer@example.com',
        recipientEmail,
        recipientName: recipientName || 'Friend',
        senderName: senderName || 'Alex Mercer',
        personalMessage,
      };

      setProcessingStage('Executing Reloadly Gift Card purchase...');

      const res = await fetch('/api/checkout/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Checkout transaction failed. Please check payment details.');
      }

      setProcessingStage('Dispatching digital code to recipient...');

      const newOrder = createOrder({
        items: checkoutItems.map((item) => ({
          ...item,
          recipientEmail,
          recipientName,
          senderName,
          message: personalMessage,
        })),
        totalUSD,
        currency,
        totalInCurrency: totalUSD,
        paymentMethod,
        paymentStatus: 'completed',
        deliveryStatus: 'delivered',
        deliveryTimestamp: new Date().toISOString(),
      });

      const orderTargetId = data.orderId || newOrder.id;
      router.push(`/order-success?orderId=${orderTargetId}`);
    } catch (err: any) {
      console.error('Checkout error:', err);
      setErrorMessage(err.message || 'Payment or order processing failed. Please verify your details.');
      setIsProcessing(false);
      setProcessingStage('');
    }
  };

  const stepsList = [
    { num: 1, label: 'Gift Card' },
    { num: 2, label: 'Recipient' },
    { num: 3, label: 'Payment' },
    { num: 4, label: 'Confirmation' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-zinc-900">
      <Header />

      <main className="flex-1 py-10 sm:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header & 4-Step Progress Indicator */}
          <div className="pb-8 mb-8 border-b border-zinc-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-[#FF5722]">
                  Secure Checkout
                </span>
                <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
                  Checkout
                </h1>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-2xl">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>256-Bit SSL Encrypted • Zero Extra Fees</span>
              </div>
            </div>

            {/* 4 Steps Visual Indicator */}
            <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-2xl">
              {stepsList.map((step) => {
                const isCurrent = currentStep === step.num;
                const isPassed = currentStep > step.num;

                return (
                  <button
                    key={step.num}
                    type="button"
                    onClick={() => setCurrentStep(step.num as any)}
                    className={`flex flex-col items-center sm:items-start p-2.5 rounded-xl border text-left transition ${
                      isCurrent
                        ? 'border-purple-600 bg-purple-50/60'
                        : isPassed
                        ? 'border-emerald-200 bg-emerald-50/50'
                        : 'border-zinc-200 bg-white opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-extrabold mb-0.5">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                          isPassed
                            ? 'bg-emerald-600 text-white'
                            : isCurrent
                            ? 'bg-purple-700 text-white'
                            : 'bg-zinc-200 text-zinc-700'
                        }`}
                      >
                        {isPassed ? '✓' : step.num}
                      </span>
                      <span className="hidden sm:inline text-zinc-900">{step.label}</span>
                    </div>
                    <span className="text-[10px] text-zinc-500 hidden sm:inline">
                      {step.num === 1 ? 'Artwork review' : step.num === 2 ? 'Delivery email' : step.num === 3 ? 'Choose method' : 'Final review'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* LEFT COLUMN: The 4 Steps Container */}
            <div className="lg:col-span-7 space-y-6">
              {/* STEP 1: GIFT CARD (Shows actual gift-card artwork) */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-zinc-200/90 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 text-xs font-black flex items-center justify-center">
                      1
                    </span>
                    <h3 className="font-extrabold text-base text-zinc-900">
                      Step 1: Gift Card
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" />
                    Verified Digital Card
                  </span>
                </div>

                {/* Actual gift-card artwork card */}
                {checkoutItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-[#F5F4F0] border border-zinc-200 flex flex-col sm:flex-row items-center gap-5"
                  >
                    {/* Actual artwork */}
                    <div className="w-44 h-28 shrink-0 bg-white rounded-xl p-2 border border-zinc-200 shadow-xs flex items-center justify-center overflow-hidden">
                      <img
                        src={item.giftCard.giftCardUrl}
                        alt={`${item.giftCard.brand} gift card`}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <h4 className="font-black text-lg text-zinc-950 truncate">
                          {item.giftCard.brand}
                        </h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-zinc-700 border border-zinc-200">
                          {item.giftCard.country}
                        </span>
                      </div>

                      <p className="text-xs text-zinc-500">
                        Region: <strong className="text-zinc-800">{item.giftCard.countryName}</strong>
                      </p>

                      <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                        <span className="text-xs font-extrabold px-2.5 py-1 rounded-md bg-purple-100 text-purple-800">
                          {item.giftCard.currencySymbol}{item.denomination.toLocaleString()}
                        </span>
                        <span className="text-xs text-zinc-500 font-medium">
                          Qty: {item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* STEP 2: RECIPIENT */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-zinc-200/90 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 text-xs font-black flex items-center justify-center">
                      2
                    </span>
                    <h3 className="font-extrabold text-base text-zinc-900">
                      Step 2: Recipient
                    </h3>
                  </div>
                  <span className="text-xs text-zinc-400">Where the digital card goes</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-700 block mb-1">
                      Recipient Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm font-medium focus:border-purple-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-700 block mb-1">
                      Recipient Name
                    </label>
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm font-medium focus:border-purple-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-700 block mb-1">
                      Your Name (Sender)
                    </label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm font-medium focus:border-purple-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-700 block mb-1">
                      Personal Message
                    </label>
                    <input
                      type="text"
                      value={personalMessage}
                      onChange={(e) => setPersonalMessage(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm font-medium focus:border-purple-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* STEP 3: PAYMENT */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-zinc-200/90 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 text-xs font-black flex items-center justify-center">
                      3
                    </span>
                    <h3 className="font-extrabold text-base text-zinc-900">
                      Step 3: Payment
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-emerald-600">Zero Payment Fees</span>
                </div>

                {/* Methods */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-2xl border text-xs font-extrabold flex flex-col items-center gap-1.5 transition ${
                      paymentMethod === 'card'
                        ? 'border-purple-600 bg-purple-50 text-purple-900 shadow-xs'
                        : 'border-zinc-200 text-zinc-700 bg-zinc-50'
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
                        : 'border-zinc-200 text-zinc-700 bg-zinc-50'
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
                        : 'border-zinc-200 text-zinc-700 bg-zinc-50'
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
                        : 'border-zinc-200 text-zinc-700 bg-zinc-50'
                    }`}
                  >
                    <Coins className="w-5 h-5 text-indigo-600" />
                    <span>USDC / Crypto</span>
                  </button>
                </div>

                {paymentMethod === 'card' && (
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="text-xs font-bold text-zinc-700 block mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 font-mono text-sm focus:border-purple-600 focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-zinc-700 block mb-1">
                          Expiry
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-zinc-200 font-mono text-sm focus:border-purple-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-zinc-700 block mb-1">
                          CVC
                        </label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-zinc-200 font-mono text-sm focus:border-purple-600 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

                {/* STEP 4: CONFIRMATION SUMMARY */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-zinc-200/90 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 text-xs font-black flex items-center justify-center">
                    4
                  </span>
                  <h3 className="font-extrabold text-base text-zinc-900">
                    Step 4: Confirmation
                  </h3>
                </div>

                {/* Actual gift card artwork preview in step 4 */}
                <div className="p-3.5 rounded-2xl bg-[#F5F4F0] border border-zinc-200 flex items-center gap-4">
                  <div className="w-20 h-14 bg-white rounded-xl p-1 border border-zinc-200 shadow-xs shrink-0 flex items-center justify-center overflow-hidden">
                    <img
                      src={primaryItem.giftCard.giftCardUrl || primaryItem.giftCard.productImage}
                      alt={primaryItem.giftCard.brand}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-zinc-900">{primaryItem.giftCard.brand} Gift Card</h4>
                    <span className="text-xs text-purple-700 font-black">{primaryItem.giftCard.currencySymbol}{primaryItem.denomination.toLocaleString()} {primaryItem.giftCard.currency}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Destination:</span>
                    <strong className="text-zinc-900">{recipientEmail || 'Pending delivery email in step 2'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Delivery Time:</span>
                    <strong className="text-emerald-700 font-bold">Instant (Within ~30 seconds)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Region Disclaimer:</span>
                    <span className="text-zinc-700 font-semibold">{primaryItem.giftCard.countryName} redemption</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Order Summary & Pay Button with Card Visual */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-zinc-200/90 shadow-sm space-y-6">
                <h3 className="font-extrabold text-lg text-zinc-900 pb-3 border-b border-zinc-100">
                  Order Summary
                </h3>

                {/* Actual gift card image showcase in summary */}
                <div className="p-4 rounded-2xl bg-[#F5F4F0] border border-zinc-200 flex items-center gap-4">
                  <div className="w-24 h-16 bg-white rounded-xl p-1.5 border border-zinc-200 shadow-xs shrink-0 flex items-center justify-center overflow-hidden">
                    <img
                      src={primaryItem.giftCard.giftCardUrl}
                      alt={primaryItem.giftCard.brand}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-base text-zinc-900 truncate">
                      {primaryItem.giftCard.brand}
                    </h4>
                    <span className="text-xs text-zinc-500 block">
                      {primaryItem.giftCard.currencySymbol}{primaryItem.denomination.toLocaleString()} • Qty: {primaryItem.quantity}
                    </span>
                    <span className="text-[11px] font-bold text-purple-700 block">
                      Region: {primaryItem.giftCard.countryName}
                    </span>
                  </div>
                </div>

                {/* Pricing Breakdown */}
                <div className="space-y-2 pt-2 border-t border-zinc-100 text-xs">
                  <div className="flex justify-between text-zinc-600">
                    <span>Card Face Value</span>
                    <span className="font-semibold text-zinc-900">
                      {primaryItem.giftCard.currencySymbol}{(primaryItem.denomination * primaryItem.quantity).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-zinc-600">
                    <span>Digital Issuance</span>
                    <span className="font-bold text-emerald-600">FREE ($0.00)</span>
                  </div>

                  <div className="flex justify-between text-zinc-600">
                    <span>Delivery Fee</span>
                    <span className="font-bold text-emerald-600">FREE ($0.00)</span>
                  </div>

                  <div className="flex justify-between text-base font-extrabold text-zinc-950 pt-3 border-t border-zinc-100">
                    <span>Total Due</span>
                    <span className="text-2xl text-purple-700 font-black">
                      {format(totalUSD)}
                    </span>
                  </div>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-2">
                    <span className="text-red-500 font-bold">⚠️</span>
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Final Pay & Send CTA */}
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
                      <span>Pay & Send Gift Card</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <div className="text-center text-[11px] text-zinc-400 space-y-1">
                  <p>Guaranteed authentic digital code issued straight from the brand.</p>
                  <p>Backed by Vouchr 100% money-back guarantee.</p>
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
