'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { CartDrawer } from '@/components/common/CartDrawer';
import { GiftCardProduct } from '@/components/cards/GiftCardProduct';
import { ProviderGiftCard } from '@/types';
import { useVouchr } from '@/context/VouchrContext';
import {
  Zap,
  ShieldCheck,
  Globe,
  Star,
  Check,
  ShoppingBag,
  ArrowRight,
  AlertTriangle,
  Minus,
  Plus,
  Mail,
  User,
  Heart,
  Calendar,
  Clock,
} from 'lucide-react';

interface ProductCustomizerProps {
  card: ProviderGiftCard;
}

export const ProductCustomizer: React.FC<ProductCustomizerProps> = ({ card }) => {
  const router = useRouter();
  const { format, addToCart, setIsCartOpen } = useVouchr();

  const denominations = card.denominations && card.denominations.length > 0 ? card.denominations : [25, 50, 100];
  const isAvailable = card.available && card.availability !== 'out_of_stock';

  // State
  const [selectedDenomination, setSelectedDenomination] = useState<number>(
    denominations[1] || denominations[0] || 25
  );
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const [customAmountValue, setCustomAmountValue] = useState('');
  const [quantity, setQuantity] = useState(1);

  const [recipientType, setRecipientType] = useState<'other' | 'self'>('other');
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [senderName, setSenderName] = useState('');
  const [message, setMessage] = useState('');

  const [deliveryOption, setDeliveryOption] = useState<'instant' | 'scheduled'>('instant');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('09:00');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [relatedCards, setRelatedCards] = useState<ProviderGiftCard[]>([]);

  useEffect(() => {
    let active = true;
    async function fetchRelated() {
      try {
        const query = card.category ? `?category=${encodeURIComponent(card.category)}` : '';
        const res = await fetch(`/api/giftcards${query}`);
        if (res.ok) {
          const json = await res.json();
          if (active && Array.isArray(json.data)) {
            const filtered = json.data
              .filter((c: ProviderGiftCard) => c.id !== card.id && c.available)
              .slice(0, 4);
            setRelatedCards(filtered);
          }
        }
      } catch (err) {
        console.warn('Failed to load related cards', err);
      }
    }
    fetchRelated();
    return () => {
      active = false;
    };
  }, [card.id, card.category]);

  const activeDenomination = isCustomAmount
    ? Number(customAmountValue) || denominations[0]
    : selectedDenomination;

  const discount = card.discountPercentage ? card.discountPercentage / 100 : 0;
  const unitPrice = activeDenomination * (1 - discount);
  const totalPrice = unitPrice * quantity;

  const quickMessages = [
    'Enjoy your gift! 🎉',
    'Happy Birthday! Hope you have an incredible day.',
    'Thank you for everything! Really appreciate you.',
    'Treat yourself on me! You deserve it.',
  ];

  const validate = (): boolean => {
    const errs: { [key: string]: string } = {};

    if (isCustomAmount) {
      const amt = Number(customAmountValue);
      const min = card.minCustomAmount || (card.denominationType === 'RANGE' ? card.minAmount : 10);
      const max = card.maxCustomAmount || (card.denominationType === 'RANGE' ? card.maxAmount : 1000);
      if (!amt || amt < min || amt > max) {
        errs.customAmount = `Please specify an amount between ${card.currencySymbol}${min} and ${card.currencySymbol}${max}`;
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

  const createItemData = () => {
    return {
      id: `ci-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      giftCard: card,
      denomination: activeDenomination,
      quantity,
      recipientType,
      recipientName: recipientType === 'other' ? (recipientName || 'Gift Recipient') : 'Myself',
      recipientEmail: recipientType === 'other' ? recipientEmail : '',
      recipientPhone: recipientType === 'other' ? recipientPhone : '',
      senderName: senderName || 'A thoughtful friend',
      message: recipientType === 'other' ? message : '',
      deliveryOption,
      scheduledDate: deliveryOption === 'scheduled' ? scheduledDate : undefined,
      scheduledTime: deliveryOption === 'scheduled' ? scheduledTime : undefined,
    };
  };

  const [imageError, setImageError] = useState(false);

  const handleBuyNow = () => {
    if (!isAvailable) return;
    if (!validate()) return;
    const item = createItemData();
    addToCart(item);
    router.push('/checkout');
  };

  const handleAddToBag = () => {
    if (!isAvailable) return;
    if (!validate()) return;
    const item = createItemData();
    addToCart(item);
    setIsCartOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-zinc-900">
      <Header />
      <CartDrawer />

      <main className="flex-1 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-8">
            <Link href="/" className="hover:text-zinc-900 transition">Home</Link>
            <span>/</span>
            <Link href="/cards" className="hover:text-zinc-900 transition">Gift Cards</Link>
            <span>/</span>
            <Link href={`/cards?category=${card.category}`} className="hover:text-zinc-900 transition">
              {card.category}
            </Link>
            <span>/</span>
            <span className="text-zinc-900 font-bold">{card.brand}</span>
          </nav>

          {/* 2-Column Product Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* LEFT COLUMN: Large Official Gift-Card Image & Regional Guarantees */}
            <div className="lg:col-span-6 lg:sticky lg:top-28 space-y-6">
              {/* Product Artwork Container with Breathing Room & Object-Contain */}
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-zinc-200/90 shadow-sm flex flex-col items-center">
                <div className="w-full flex items-center justify-between text-xs text-zinc-400 font-semibold mb-6">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Official Brand Artwork
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700">
                    ID: {card.id}
                  </span>
                </div>

                {/* Large Gift Card Display */}
                <div className="relative w-full pt-[62%] bg-[#F5F4F0] rounded-2xl overflow-hidden p-6 sm:p-8 flex items-center justify-center shadow-inner">
                  <div className="absolute inset-4 sm:inset-6 flex items-center justify-center">
                    {card.giftCardUrl && !imageError ? (
                      <img
                        src={card.giftCardUrl}
                        alt={`${card.brand} official digital gift card`}
                        className="w-full h-full object-contain filter drop-shadow-xl rounded-xl"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <div className="w-full h-full rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-950 p-6 flex flex-col justify-between text-white shadow-xl">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/20 text-white">
                            {card.country || 'GLOBAL'}
                          </span>
                          <span className="text-sm font-extrabold text-purple-300">{card.currency || 'USD'}</span>
                        </div>
                        <div>
                          <h4 className="text-2xl font-black tracking-tight">{card.brand}</h4>
                          <p className="text-xs text-zinc-400">Digital Gift Card</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Regional Compatibility Callout */}
                <div className="w-full mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Important Region Notice</span>
                  </div>
                  <p className="text-xs leading-relaxed text-amber-800">
                    {card.regionDisclaimer || `Official digital voucher valid in ${card.countryName || card.country}. Redeemable directly in ${card.currency}.`}
                  </p>
                </div>

                {/* Speed & Direct Fulfillment Guarantees */}
                <div className="w-full mt-5 pt-5 border-t border-zinc-100 grid grid-cols-2 gap-4 text-xs text-zinc-600">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Instant digital code dispatch</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>100% Genuine & verified</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Product Details & Purchase Form */}
            <div className="lg:col-span-6 space-y-8">
              {/* Product Header */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-50 border border-zinc-200 p-2 shrink-0 flex items-center justify-center">
                    <img
                      src={card.logoUrl}
                      alt={`${card.brand} logo`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider text-purple-700">
                        {card.category}
                      </span>
                      <span className="text-zinc-300">•</span>
                      <span className="text-xs font-bold text-zinc-500 flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5 text-zinc-400" />
                        Region: {card.countryName} ({card.country})
                      </span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight leading-tight">
                      {card.brand} Gift Card
                    </h1>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-zinc-600 leading-relaxed pt-1">
                  {card.description}
                </p>
              </div>

              {/* Step 1: Choose Denomination */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-zinc-200/90 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-zinc-900">
                    1. Choose Amount
                  </h3>
                  <span className="text-xs text-zinc-500 font-semibold">
                    Currency: {card.currency} ({card.currencySymbol})
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                  {denominations.map((amt) => {
                    const isSelected = !isCustomAmount && selectedDenomination === amt;
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => {
                          setIsCustomAmount(false);
                          setSelectedDenomination(amt);
                        }}
                        className={`py-3.5 px-3 rounded-2xl font-black text-base transition-all border ${
                          isSelected
                            ? 'bg-purple-700 text-white border-purple-700 shadow-md shadow-purple-600/20 scale-[1.02]'
                            : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-800 border-zinc-200'
                        }`}
                      >
                        {card.currencySymbol}{amt.toLocaleString()}
                      </button>
                    );
                  })}

                  {(card.denominationType === 'RANGE' || card.minCustomAmount) && (
                    <button
                      type="button"
                      onClick={() => setIsCustomAmount(true)}
                      className={`py-3.5 px-3 rounded-2xl font-bold text-xs transition-all border ${
                        isCustomAmount
                          ? 'bg-purple-700 text-white border-purple-700 shadow-md'
                          : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border-zinc-200'
                      }`}
                    >
                      Custom
                    </button>
                  )}
                </div>

                {isCustomAmount && (
                  <div className="pt-2 animate-in fade-in duration-150">
                    <label className="text-xs font-bold text-zinc-700 block mb-1">
                      Enter amount ({card.currencySymbol}{card.minCustomAmount || card.minAmount} - {card.currencySymbol}{card.maxCustomAmount || card.maxAmount}):
                    </label>
                    <div className="relative max-w-xs">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-zinc-500 text-sm">
                        {card.currencySymbol}
                      </span>
                      <input
                        type="number"
                        min={card.minCustomAmount || card.minAmount}
                        max={card.maxCustomAmount || card.maxAmount}
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

              {/* Step 2: Quantity & Recipient Details */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-zinc-200/90 shadow-sm space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-zinc-900">
                    2. Send Details
                  </h3>

                  {/* Quantity Counter */}
                  <div className="flex items-center gap-2 bg-zinc-100 p-1 rounded-xl border border-zinc-200">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-zinc-700 hover:bg-zinc-50 disabled:opacity-40"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-extrabold px-2 text-zinc-900">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(10, quantity + 1))}
                      className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-zinc-700 hover:bg-zinc-50"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Recipient Option Toggle */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRecipientType('other')}
                    className={`p-3.5 rounded-2xl border font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition ${
                      recipientType === 'other'
                        ? 'bg-purple-50 text-purple-900 border-purple-600'
                        : 'bg-zinc-50 text-zinc-600 border-zinc-200'
                    }`}
                  >
                    <Mail className="w-4 h-4 text-[#FF5722]" />
                    <span>Send to someone</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRecipientType('self')}
                    className={`p-3.5 rounded-2xl border font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition ${
                      recipientType === 'self'
                        ? 'bg-purple-50 text-purple-900 border-purple-600'
                        : 'bg-zinc-50 text-zinc-600 border-zinc-200'
                    }`}
                  >
                    <User className="w-4 h-4 text-purple-600" />
                    <span>Buy for myself</span>
                  </button>
                </div>

                {/* Recipient Form Fields */}
                {recipientType === 'other' ? (
                  <div className="space-y-4 pt-1">
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
                          placeholder="recipient@example.com"
                          className={`w-full px-4 py-3 rounded-xl border text-sm font-medium focus:outline-none ${
                            errors.recipientEmail
                              ? 'border-red-500'
                              : 'border-zinc-200 focus:border-purple-600'
                          }`}
                        />
                        {errors.recipientEmail && (
                          <p className="text-xs text-red-500 font-semibold mt-1">
                            {errors.recipientEmail}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="text-xs font-bold text-zinc-700 block mb-1">
                          Recipient Name
                        </label>
                        <input
                          type="text"
                          value={recipientName}
                          onChange={(e) => setRecipientName(e.target.value)}
                          placeholder="e.g. Alex"
                          className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm font-medium focus:border-purple-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-zinc-700">
                          Personal Message
                        </label>
                        <span className="text-[11px] text-zinc-400">{message.length}/200</span>
                      </div>
                      <textarea
                        rows={2}
                        maxLength={200}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Add your heartfelt message to appear with the gift..."
                        className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-sm font-medium focus:border-purple-600 focus:outline-none resize-none"
                      />

                      {/* Quick chips */}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {quickMessages.map((m, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setMessage(m)}
                            className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-purple-50 text-zinc-600 hover:text-purple-700 transition"
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-600">
                    The gift card claim link and confirmation will be delivered directly to your account email right after checkout.
                  </div>
                )}
              </div>

              {/* Purchase Card & CTAs */}
              <div className="bg-zinc-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-zinc-400 block">Total Due</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-white">
                        {card.currencySymbol}{totalPrice.toLocaleString()} {card.currency}
                      </span>
                      {card.discountPercentage && (
                        <span className="text-sm text-zinc-400 line-through">
                          {card.currencySymbol}{(activeDenomination * quantity).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-400 block">
                      Delivery: FREE
                    </span>
                    <span className="text-xs text-zinc-400">
                      {quantity}x {card.currencySymbol}{activeDenomination.toLocaleString()} card
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <button
                    type="button"
                    disabled={!isAvailable}
                    onClick={handleBuyNow}
                    className={`w-full py-4 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                      isAvailable
                        ? 'bg-[#FF5722] hover:bg-[#F4511E] text-white shadow-orange-500/25 hover:scale-[1.02]'
                        : 'bg-zinc-200 text-zinc-400 cursor-not-allowed shadow-none'
                    }`}
                  >
                    <span>{isAvailable ? 'Buy Gift Card' : 'Currently Unavailable'}</span>
                    {isAvailable && <ArrowRight className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    disabled={!isAvailable}
                    onClick={handleAddToBag}
                    className={`w-full py-4 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 border transition ${
                      isAvailable
                        ? 'bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-700'
                        : 'bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </button>
                </div>
              </div>

              {/* Redemption & Terms Section */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/90 shadow-sm space-y-6">
                <div>
                  <h3 className="font-extrabold text-lg text-zinc-900 mb-3">
                    How to Redeem your {card.brand} Gift Card
                  </h3>
                  <ol className="space-y-2.5 text-sm text-zinc-600">
                    {(card.redemptionInstructionsList || [card.redemptionInstructions || 'Redeem online at merchant checkout or official website.']).map((instruction: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="pt-6 border-t border-zinc-100">
                  <h4 className="font-bold text-sm text-zinc-900 mb-2">Terms & Conditions</h4>
                  <ul className="space-y-1 text-xs text-zinc-500 list-disc pl-4">
                    {(card.termsAndConditions || ['Valid for designated country and currency only.', 'Non-refundable and not redeemable for cash.']).map((term, idx) => (
                      <li key={idx}>{term}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Related Cards Grid */}
          {relatedCards.length > 0 && (
            <div className="mt-20 pt-12 border-t border-zinc-200">
              <h2 className="text-2xl font-black text-zinc-950 mb-6">
                Related {card.category} Gift Cards
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedCards.map((rc) => (
                  <GiftCardProduct
                    key={rc.id}
                    productId={rc.id}
                    brand={rc.brand}
                    brandLogo={rc.logoUrl}
                    giftCardImage={rc.giftCardUrl}
                    denominations={rc.denominations || [25, 50, 100]}
                    currency={rc.currency || 'USD'}
                    currencySymbol={rc.currencySymbol || '$'}
                    country={rc.country || 'GLOBAL'}
                    countryName={rc.countryName}
                    category={(rc.category as any) || 'Other'}
                    availability={rc.availability || 'in_stock'}
                    deliveryMethod={(rc.deliveryMethod as any) || 'digital'}
                    discountPercentage={rc.discountPercentage}
                  />
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
