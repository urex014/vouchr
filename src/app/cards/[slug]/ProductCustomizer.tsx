'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { CartDrawer } from '@/components/common/CartDrawer';
import { GiftCardVisual } from '@/components/cards/GiftCardVisual';
import { GiftCardCard } from '@/components/cards/GiftCardCard';
import { GiftCard, CartItem } from '@/types';
import { useVouchr } from '@/context/VouchrContext';
import { GIFT_CARDS } from '@/data/giftCards';
import {
  Zap,
  ShieldCheck,
  Star,
  Check,
  Calendar,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  HelpCircle,
  Clock,
  Send,
  User,
  Heart,
  ChevronDown,
} from 'lucide-react';

interface ProductCustomizerProps {
  card: GiftCard;
}

export const ProductCustomizer: React.FC<ProductCustomizerProps> = ({ card }) => {
  const router = useRouter();
  const { format, addToCart, setIsCartOpen } = useVouchr();

  // Customizer State
  const [selectedDenomination, setSelectedDenomination] = useState<number>(card.denominations[1] || card.denominations[0]);
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const [customAmountValue, setCustomAmountValue] = useState<string>('');
  
  const [recipientType, setRecipientType] = useState<'other' | 'self'>('other');
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');

  const [deliveryOption, setDeliveryOption] = useState<'instant' | 'scheduled'>('instant');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('09:00');

  const [cardSkin, setCardSkin] = useState<'classic' | 'warm-coral' | 'electric-neon' | 'midnight-velvet'>('classic');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const activeDenomination = isCustomAmount
    ? Number(customAmountValue) || card.denominations[0]
    : selectedDenomination;

  const discount = card.discountPercentage || 0;
  const finalPrice = activeDenomination * (1 - discount / 100);

  const quickTemplates = [
    'Happy Birthday! 🎉 Hope you have an incredible year.',
    'Thank you so much for everything! Really appreciate you.',
    'Congratulations on the big milestone! Super proud of you.',
    'Treat yourself on me! You deserve it.',
  ];

  const skinOptions: { id: 'classic' | 'warm-coral' | 'electric-neon' | 'midnight-velvet'; label: string; color: string }[] = [
    { id: 'classic', label: 'Classic Brand', color: 'bg-zinc-800' },
    { id: 'warm-coral', label: 'Warm Coral', color: 'bg-orange-500' },
    { id: 'electric-neon', label: 'Electric Neon', color: 'bg-purple-600' },
    { id: 'midnight-velvet', label: 'Midnight Velvet', color: 'bg-emerald-700' },
  ];

  const validate = (): boolean => {
    const errs: { [key: string]: string } = {};

    if (isCustomAmount) {
      const amt = Number(customAmountValue);
      const min = card.minCustomAmount || 10;
      const max = card.maxCustomAmount || 500;
      if (!amt || amt < min || amt > max) {
        errs.customAmount = `Please enter an amount between $${min} and $${max}`;
      }
    }

    if (recipientType === 'other') {
      if (!recipientEmail.trim() || !recipientEmail.includes('@')) {
        errs.recipientEmail = 'Please provide a valid recipient email address';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const createCartItemData = (): CartItem => {
    return {
      id: `ci-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      giftCard: card,
      denomination: activeDenomination,
      recipientType,
      recipientName: recipientType === 'other' ? (recipientName || 'Friend') : 'Myself',
      recipientEmail: recipientType === 'other' ? recipientEmail : '',
      recipientPhone: recipientType === 'other' ? recipientPhone : '',
      senderName: senderName || 'A generous friend',
      message: recipientType === 'other' ? message : '',
      deliveryOption,
      scheduledDate: deliveryOption === 'scheduled' ? scheduledDate : undefined,
      scheduledTime: deliveryOption === 'scheduled' ? scheduledTime : undefined,
      cardDesignSkin: cardSkin,
    };
  };

  const handleAddToCart = () => {
    if (!validate()) return;
    const item = createCartItemData();
    addToCart(item);
    setIsCartOpen(true);
  };

  const handleProceedToCheckout = () => {
    if (!validate()) return;
    const item = createCartItemData();
    addToCart(item);
    router.push('/checkout');
  };

  const relatedCards = GIFT_CARDS.filter(
    (c) => c.category === card.category && c.id !== card.id
  ).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-zinc-900">
      <Header />
      <CartDrawer />

      <main className="flex-1 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-8">
            <Link href="/" className="hover:text-zinc-900 transition">Home</Link>
            <span>/</span>
            <Link href="/cards" className="hover:text-zinc-900 transition">Gift Cards</Link>
            <span>/</span>
            <Link href={`/cards?category=${card.category}`} className="capitalize hover:text-zinc-900 transition">
              {card.category}
            </Link>
            <span>/</span>
            <span className="text-zinc-900 font-bold">{card.brand}</span>
          </nav>

          {/* Main 2-Column Customizer Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* LEFT COLUMN: Sticky Dynamic Collectible Card Preview */}
            <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/90 shadow-sm flex flex-col items-center">
                <div className="w-full flex items-center justify-between text-xs text-zinc-400 font-semibold mb-4">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Live Digital Card Preview
                  </span>
                  <span className="text-[11px] uppercase tracking-wider text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-md">
                    Collectible Token
                  </span>
                </div>

                {/* The Collectible Card Visual */}
                <div className="w-full py-2 flex justify-center">
                  <GiftCardVisual
                    card={card}
                    denomination={activeDenomination}
                    recipientName={recipientType === 'other' ? (recipientName || 'Gift Recipient') : 'Myself'}
                    senderName={senderName}
                    message={message}
                    skin={cardSkin}
                    size="md"
                    isInteractive={true}
                  />
                </div>

                {/* Card Skin Theme Picker */}
                <div className="w-full mt-6 pt-5 border-t border-zinc-100">
                  <div className="text-xs font-extrabold text-zinc-800 mb-2.5 flex items-center justify-between">
                    <span>Card Aesthetic Theme:</span>
                    <span className="text-zinc-400 font-normal capitalize">{cardSkin.replace('-', ' ')}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {skinOptions.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setCardSkin(opt.id)}
                        className={`p-2 rounded-xl text-center border text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                          cardSkin === opt.id
                            ? 'border-purple-600 bg-purple-50/70 text-purple-900 shadow-xs'
                            : 'border-zinc-200 hover:border-zinc-300 text-zinc-600 bg-white'
                        }`}
                      >
                        <span className={`w-4 h-4 rounded-full ${opt.color} shadow-xs`} />
                        <span className="text-[10px] leading-tight truncate w-full">{opt.label.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Micro guarantees */}
                <div className="w-full mt-5 pt-4 border-t border-zinc-100 grid grid-cols-2 gap-2 text-[11px] text-zinc-500 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Instant dispatch</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                    <span>100% Brand backed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Customization & Purchase Options */}
            <div className="lg:col-span-7 space-y-8">
              {/* Brand Header */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-100 text-purple-800 uppercase tracking-wider">
                    {card.category}
                  </span>
                  {card.discountPercentage && (
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-[#FF5722] text-white">
                      {card.discountPercentage}% Instant Discount
                    </span>
                  )}
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-zinc-100 text-zinc-600">
                    Region: {card.region}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-950 tracking-tight">
                  {card.brand} Digital Gift Card
                </h1>

                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{card.rating}</span>
                  </div>
                  <span className="text-zinc-300">•</span>
                  <span className="text-zinc-500 text-xs">
                    {card.reviewsCount.toLocaleString()} verified reviews
                  </span>
                  <span className="text-zinc-300">•</span>
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    In stock (Digital)
                  </span>
                </div>

                <p className="text-sm sm:text-base text-zinc-600 leading-relaxed pt-1">
                  {card.description}
                </p>
              </div>

              {/* Step 1: Select Denomination */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-zinc-200/90 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-zinc-900">
                    1. Select Denomination
                  </h3>
                  <span className="text-xs font-semibold text-zinc-400">
                    Currency: USD (Converts automatically)
                  </span>
                </div>

                {/* Preset Denominations */}
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                  {card.denominations.map((amt) => {
                    const isSelected = !isCustomAmount && selectedDenomination === amt;
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setIsCustomAmount(false);
                          setSelectedDenomination(amt);
                        }}
                        className={`py-3 px-3 rounded-2xl font-black text-base transition-all border ${
                          isSelected
                            ? 'bg-purple-700 text-white border-purple-700 shadow-md shadow-purple-600/20 scale-[1.02]'
                            : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-800 border-zinc-200 hover:border-purple-200'
                        }`}
                      >
                        {format(amt)}
                      </button>
                    );
                  })}

                  {/* Custom Amount Button */}
                  <button
                    type="button"
                    onClick={() => setIsCustomAmount(true)}
                    className={`py-3 px-3 rounded-2xl font-extrabold text-xs transition-all border ${
                      isCustomAmount
                        ? 'bg-purple-700 text-white border-purple-700 shadow-md scale-[1.02]'
                        : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border-zinc-200'
                    }`}
                  >
                    Custom
                  </button>
                </div>

                {/* Custom Amount Input Field */}
                {isCustomAmount && (
                  <div className="pt-2 animate-in fade-in duration-150">
                    <label className="text-xs font-bold text-zinc-700 block mb-1.5">
                      Enter amount ($ {card.minCustomAmount || 10} - ${card.maxCustomAmount || 500}):
                    </label>
                    <div className="relative max-w-xs">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-zinc-500 text-sm">
                        $
                      </span>
                      <input
                        type="number"
                        min={card.minCustomAmount || 10}
                        max={card.maxCustomAmount || 500}
                        value={customAmountValue}
                        onChange={(e) => setCustomAmountValue(e.target.value)}
                        placeholder="e.g. 75"
                        className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-zinc-300 font-extrabold text-sm focus:outline-none focus:border-purple-600"
                      />
                    </div>
                    {errors.customAmount && (
                      <p className="text-xs text-red-500 font-semibold mt-1">
                        {errors.customAmount}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Step 2: Who is this for? */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-zinc-200/90 shadow-sm space-y-5">
                <h3 className="font-extrabold text-base text-zinc-900">
                  2. Who is this gift for?
                </h3>

                {/* Recipient Toggle: Friend vs Myself */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRecipientType('other')}
                    className={`p-3.5 rounded-2xl border font-extrabold text-sm flex items-center justify-center gap-2 transition ${
                      recipientType === 'other'
                        ? 'bg-purple-50 text-purple-900 border-purple-600'
                        : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                    }`}
                  >
                    <Send className="w-4 h-4 text-[#FF5722]" />
                    <span>Send to someone else</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRecipientType('self')}
                    className={`p-3.5 rounded-2xl border font-extrabold text-sm flex items-center justify-center gap-2 transition ${
                      recipientType === 'self'
                        ? 'bg-purple-50 text-purple-900 border-purple-600'
                        : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                    }`}
                  >
                    <User className="w-4 h-4 text-purple-600" />
                    <span>Buy for myself</span>
                  </button>
                </div>

                {/* Recipient Details (if other) */}
                {recipientType === 'other' ? (
                  <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-zinc-700 block mb-1">
                          Recipient’s Name
                        </label>
                        <input
                          type="text"
                          value={recipientName}
                          onChange={(e) => setRecipientName(e.target.value)}
                          placeholder="e.g. Sarah Chen"
                          className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm font-medium focus:border-purple-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-zinc-700 block mb-1">
                          Recipient’s Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={recipientEmail}
                          onChange={(e) => setRecipientEmail(e.target.value)}
                          placeholder="e.g. sarah@example.com"
                          className={`w-full px-4 py-3 rounded-xl border text-sm font-medium focus:outline-none ${
                            errors.recipientEmail
                              ? 'border-red-500 focus:border-red-500'
                              : 'border-zinc-200 focus:border-purple-600'
                          }`}
                        />
                        {errors.recipientEmail && (
                          <p className="text-xs text-red-500 font-semibold mt-1">
                            {errors.recipientEmail}
                          </p>
                        )}
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
                          placeholder="e.g. Alex"
                          className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm font-medium focus:border-purple-600 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-zinc-700 block mb-1">
                          Recipient’s Phone (Optional for SMS alert)
                        </label>
                        <input
                          type="tel"
                          value={recipientPhone}
                          onChange={(e) => setRecipientPhone(e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm font-medium focus:border-purple-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Personal Message */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-zinc-700">
                          Personal Message
                        </label>
                        <span className="text-[11px] text-zinc-400">
                          {message.length} / 200 chars
                        </span>
                      </div>
                      <textarea
                        rows={3}
                        maxLength={200}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Add a heartfelt note to appear on the digital voucher..."
                        className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm font-medium focus:border-purple-600 focus:outline-none resize-none"
                      />

                      {/* Quick message chips */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {quickTemplates.map((tmpl, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setMessage(tmpl)}
                            className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-purple-100 hover:text-purple-800 text-zinc-600 transition"
                          >
                            {tmpl.slice(0, 22)}...
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 leading-relaxed">
                    ✨ Your voucher claim code and digital receipt will be sent directly to your account email right after checkout.
                  </div>
                )}
              </div>

              {/* Step 3: Delivery Timing */}
              {recipientType === 'other' && (
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-zinc-200/90 shadow-sm space-y-4">
                  <h3 className="font-extrabold text-base text-zinc-900">
                    3. Delivery Timing
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDeliveryOption('instant')}
                      className={`p-4 rounded-2xl border text-left transition ${
                        deliveryOption === 'instant'
                          ? 'bg-purple-50 border-purple-600 text-purple-900'
                          : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-extrabold text-sm mb-1">
                        <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                        <span>Send Instantly</span>
                      </div>
                      <p className="text-xs text-zinc-500">
                        Dispatched in ~30-60 seconds after payment
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryOption('scheduled')}
                      className={`p-4 rounded-2xl border text-left transition ${
                        deliveryOption === 'scheduled'
                          ? 'bg-purple-50 border-purple-600 text-purple-900'
                          : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-extrabold text-sm mb-1">
                        <Calendar className="w-4 h-4 text-purple-600" />
                        <span>Schedule for Later</span>
                      </div>
                      <p className="text-xs text-zinc-500">
                        Pick exact birthday, anniversary or holiday date
                      </p>
                    </button>
                  </div>

                  {deliveryOption === 'scheduled' && (
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="text-xs font-bold text-zinc-700 block mb-1">
                          Delivery Date
                        </label>
                        <input
                          type="date"
                          value={scheduledDate}
                          onChange={(e) => setScheduledDate(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-zinc-700 block mb-1">
                          Delivery Time
                        </label>
                        <input
                          type="time"
                          value={scheduledTime}
                          onChange={(e) => setScheduledTime(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-zinc-300 text-xs font-medium"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Purchase Summary & CTAs */}
              <div className="bg-zinc-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-zinc-400 block">Total Due</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-white">
                        {format(finalPrice)}
                      </span>
                      {card.discountPercentage && (
                        <span className="text-sm text-zinc-400 line-through">
                          {format(activeDenomination)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] font-bold text-emerald-400 block">
                      Fee: $0.00 (Zero markup)
                    </span>
                    <span className="text-xs text-zinc-400">
                      Voucher face value: {format(activeDenomination)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <button
                    type="button"
                    onClick={handleProceedToCheckout}
                    className="w-full py-4 rounded-2xl bg-[#FF5722] hover:bg-[#F4511E] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02]"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="w-full py-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 border border-zinc-700 transition"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Gift Bag</span>
                  </button>
                </div>

                <div className="flex items-center justify-center gap-6 text-xs text-zinc-400 pt-1">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    256-Bit Bank Encryption
                  </span>
                  <span>•</span>
                  <span>Instant Code Validity Guaranteed</span>
                </div>
              </div>

              {/* Redemption Instructions & Official Terms */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/90 shadow-sm space-y-6">
                <div>
                  <h3 className="font-extrabold text-lg text-zinc-900 mb-3 flex items-center gap-2">
                    <span>How to Redeem this {card.brand} Voucher</span>
                  </h3>
                  <ol className="space-y-2.5 text-sm text-zinc-600">
                    {card.redemptionSteps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="pt-6 border-t border-zinc-100">
                  <h4 className="font-bold text-sm text-zinc-900 mb-2">Terms & Conditions</h4>
                  <ul className="space-y-1.5 text-xs text-zinc-500 list-disc pl-4">
                    {card.termsAndConditions.map((term, idx) => (
                      <li key={idx}>{term}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Related Cards Section */}
          {relatedCards.length > 0 && (
            <div className="mt-20 pt-12 border-t border-zinc-200">
              <h2 className="text-2xl font-black text-zinc-950 mb-6">
                You might also like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedCards.map((rc) => (
                  <GiftCardCard key={rc.id} card={rc} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};
