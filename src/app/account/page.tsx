'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { CartDrawer } from '@/components/common/CartDrawer';
import { useVouchr } from '@/context/VouchrContext';
import { Order, SavedRecipient } from '@/types';
import {
  Gift,
  ShoppingBag,
  CreditCard,
  Users,
  User,
  Settings,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  Globe,
  Plus,
  Mail,
  Phone,
  Calendar,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';

export default function AccountPage() {
  const { orders, savedRecipients, addSavedRecipient, format, currency, setCurrency } = useVouchr();

  const [activeTab, setActiveTab] = useState<
    'gift_cards' | 'orders' | 'transactions' | 'recipients' | 'account' | 'support'
  >('gift_cards');

  const DEMO_RELOADLY_ORDERS: Order[] = [
    {
      id: 'ord-849201',
      orderNumber: 'VCR-US-99214',
      createdAt: '2026-09-15T14:22:00Z',
      items: [
        {
          id: 'ci-demo-1',
          giftCard: {
            id: '101',
            numericId: 101,
            brandName: 'Amazon',
            brand: 'Amazon',
            brandSlug: 'amazon',
            productName: 'Amazon US',
            brandLogo: '/brands/amazon.svg',
            logoUrl: '/brands/amazon.svg',
            productImage: '/giftcards/amazon-us.svg',
            giftCardImage: '/giftcards/amazon-us.svg',
            giftCardUrl: '/giftcards/amazon-us.svg',
            category: 'Shopping',
            country: 'US',
            countryName: 'United States',
            currency: 'USD',
            currencySymbol: '$',
            denominations: [25, 50, 100, 200, 500],
            minAmount: 25,
            maxAmount: 500,
            fixedAmounts: [25, 50, 100, 200, 500],
            denominationType: 'FIXED',
            deliveryMethod: 'digital',
            description: 'Official Amazon digital gift card.',
            redemptionInstructions: 'Redeem at amazon.com/redeem',
            terms: 'Valid only in US.',
            isAvailable: true,
            available: true,
            availability: 'in_stock',
            global: false,
          },
          denomination: 50,
          quantity: 1,
          recipientType: 'other',
          recipientName: 'Sarah Chen',
          recipientEmail: 'sarah.chen@example.com',
          senderName: 'Alex Mercer',
          deliveryOption: 'instant',
        },
      ],
      totalUSD: 50,
      currency: 'USD',
      totalInCurrency: 50,
      paymentMethod: 'card',
      paymentStatus: 'completed',
      deliveryStatus: 'delivered',
      deliveryTimestamp: '2026-09-15T14:22:18Z',
      voucherCode: 'AMZN-8921-4412-9901',
      pinCode: '4491',
      claimUrl: 'https://vouchr.com/claim/vcr-us-99214',
    },
    {
      id: 'ord-849202',
      orderNumber: 'VCR-GLOBAL-99182',
      createdAt: '2026-09-08T09:10:00Z',
      items: [
        {
          id: 'ci-demo-2',
          giftCard: {
            id: '103',
            numericId: 103,
            brandName: 'Spotify',
            brand: 'Spotify',
            brandSlug: 'spotify',
            productName: 'Spotify Premium Global',
            brandLogo: '/brands/spotify.svg',
            logoUrl: '/brands/spotify.svg',
            productImage: '/giftcards/spotify-global.svg',
            giftCardImage: '/giftcards/spotify-global.svg',
            giftCardUrl: '/giftcards/spotify-global.svg',
            category: 'Entertainment',
            country: 'GLOBAL',
            countryName: 'Global',
            currency: 'USD',
            currencySymbol: '$',
            denominations: [10, 30, 60, 100],
            minAmount: 10,
            maxAmount: 100,
            fixedAmounts: [10, 30, 60, 100],
            denominationType: 'FIXED',
            deliveryMethod: 'digital',
            description: 'Official Spotify digital gift card.',
            redemptionInstructions: 'Redeem at spotify.com/redeem',
            terms: 'Valid globally.',
            isAvailable: true,
            available: true,
            availability: 'in_stock',
            global: true,
          },
          denomination: 30,
          quantity: 1,
          recipientType: 'other',
          recipientName: 'Kofi Mensah',
          recipientEmail: 'kofi.mensah@example.com',
          senderName: 'Alex Mercer',
          deliveryOption: 'instant',
        },
      ],
      totalUSD: 30,
      currency: 'USD',
      totalInCurrency: 30,
      paymentMethod: 'card',
      paymentStatus: 'completed',
      deliveryStatus: 'delivered',
      deliveryTimestamp: '2026-09-08T09:10:14Z',
      voucherCode: 'SPOT-3391-7721-0021',
      pinCode: '7721',
      claimUrl: 'https://vouchr.com/claim/vcr-global-99182',
    },
  ];

  const displayOrders = orders.length > 0 ? orders : DEMO_RELOADLY_ORDERS;

  const [isAddRecipientOpen, setIsAddRecipientOpen] = useState(false);
  const [newRecName, setNewRecName] = useState('');
  const [newRecEmail, setNewRecEmail] = useState('');
  const [newRecPhone, setNewRecPhone] = useState('');
  const [newRecRelation, setNewRecRelation] = useState('Friend');
  const [newRecOccasion, setNewRecOccasion] = useState('Birthday');
  const [newRecDate, setNewRecDate] = useState('');

  const handleCreateRecipient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecName || !newRecEmail) return;

    const newRec: SavedRecipient = {
      id: `rec-${Date.now()}`,
      name: newRecName,
      email: newRecEmail,
      phone: newRecPhone || undefined,
      relationship: newRecRelation,
      occasion: newRecOccasion,
      occasionDate: newRecDate || undefined,
      favoriteBrands: ['Amazon', 'Spotify'],
      totalGiftsSent: 0,
    };

    addSavedRecipient(newRec);
    setIsAddRecipientOpen(false);
    setNewRecName('');
    setNewRecEmail('');
    setNewRecPhone('');
    setNewRecDate('');
  };

  const tabs = [
    { id: 'gift_cards', label: 'My Gift Cards', icon: <Gift className="w-4 h-4" /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'transactions', label: 'Transactions', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'recipients', label: 'Recipients', icon: <Users className="w-4 h-4" /> },
    { id: 'account', label: 'Account', icon: <Settings className="w-4 h-4" /> },
    { id: 'support', label: 'Support', icon: <HelpCircle className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-zinc-900">
      <Header />
      <CartDrawer />

      <main className="flex-1 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top User Overview */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/90 shadow-sm mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-700 text-white font-black text-2xl flex items-center justify-center shadow-md shadow-purple-600/20">
                AM
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-zinc-950">Alex Mercer</h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
                    Active Gifter
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">
                  alex.mercer@example.com • Verified Customer
                </p>
              </div>
            </div>

            <Link
              href="/cards"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Browse Catalog</span>
            </Link>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="flex items-center gap-2 mb-8 border-b border-zinc-200 pb-3 overflow-x-auto scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? 'bg-purple-700 text-white shadow-md shadow-purple-600/20'
                    : 'text-zinc-600 hover:text-zinc-950 hover:bg-white'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* TAB 1: MY GIFT CARDS (Displays actual gift-card artwork) */}
          {activeTab === 'gift_cards' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-zinc-950">My Gift Cards</h2>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Your active and delivered digital gift cards displaying official artwork.
                  </p>
                </div>
                <span className="text-xs font-bold text-zinc-500">
                  {displayOrders.length} digital vouchers
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayOrders.map((order) => {
                  const item = order.items[0];
                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-3xl p-6 border border-zinc-200/90 shadow-sm flex flex-col justify-between hover:border-purple-200 hover:shadow-md transition"
                    >
                      {/* Actual Gift Card Artwork Presentation */}
                      <div className="relative w-full pt-[60%] bg-[#F5F4F0] rounded-2xl overflow-hidden p-4 mb-4 border border-zinc-200 flex items-center justify-center">
                        <div className="absolute inset-3 flex items-center justify-center">
                          <img
                            src={item.giftCard.giftCardUrl}
                            alt={`${item.giftCard.brand} card`}
                            className="w-full h-full object-contain filter drop-shadow-md rounded-lg"
                          />
                        </div>
                        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-black bg-white/90 text-zinc-800 border border-zinc-200">
                          {item.giftCard.country}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-extrabold text-base text-zinc-900 truncate">
                            {item.giftCard.brand}
                          </h3>
                          <span className="font-black text-base text-purple-700 shrink-0">
                            {item.giftCard.currencySymbol}{item.denomination.toLocaleString()}
                          </span>
                        </div>

                        <div className="text-xs text-zinc-500 space-y-0.5">
                          <div>
                            Recipient: <strong className="text-zinc-800">{item.recipientName || 'Myself'}</strong>
                          </div>
                          <div>
                            Email: <span className="text-zinc-700 truncate">{item.recipientEmail}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] pt-3 border-t border-zinc-100">
                          <span className="text-emerald-600 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Delivered
                          </span>
                          <span className="font-mono text-zinc-400">{order.orderNumber}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                        <Link
                          href={`/order-success?orderId=${order.id}`}
                          className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
                        >
                          <span>View delivery receipt</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h2 className="text-xl font-black text-zinc-950 mb-2">Order History</h2>
              <div className="bg-white rounded-3xl border border-zinc-200/90 overflow-hidden shadow-sm">
                <div className="divide-y divide-zinc-100">
                  {displayOrders.map((order) => {
                    const item = order.items[0];
                    return (
                      <div key={order.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-11 bg-zinc-100 rounded-xl p-1 border border-zinc-200 shrink-0 flex items-center justify-center overflow-hidden">
                            <img
                              src={item.giftCard.giftCardUrl}
                              alt={item.giftCard.brand}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-extrabold text-sm text-zinc-900">{item.giftCard.brand} Gift Card</h4>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Delivered
                              </span>
                            </div>
                            <span className="text-xs text-zinc-400">
                              {order.orderNumber} • {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-6">
                          <span className="font-black text-sm text-zinc-900">
                            {format(order.totalUSD)}
                          </span>
                          <Link
                            href={`/order-success?orderId=${order.id}`}
                            className="text-xs font-bold px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition"
                          >
                            Receipt
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TRANSACTIONS */}
          {activeTab === 'transactions' && (
            <div className="space-y-4">
              <h2 className="text-xl font-black text-zinc-950 mb-2">Transaction Records</h2>
              <div className="bg-white rounded-3xl border border-zinc-200/90 overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 border-b border-zinc-100 text-zinc-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Transaction ID</th>
                      <th className="p-4">Brand</th>
                      <th className="p-4">Method</th>
                      <th className="p-4">Date</th>
                      <th className="p-4 text-right">Amount</th>
                      <th className="p-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {displayOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-zinc-50/50">
                        <td className="p-4 font-mono font-bold text-zinc-900">{o.orderNumber}</td>
                        <td className="p-4 font-semibold text-zinc-800">{o.items[0]?.giftCard.brand}</td>
                        <td className="p-4 uppercase text-zinc-500">{o.paymentMethod.replace('_', ' ')}</td>
                        <td className="p-4 text-zinc-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                        <td className="p-4 font-black text-right text-zinc-900">{format(o.totalUSD)}</td>
                        <td className="p-4 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Completed
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: RECIPIENTS */}
          {activeTab === 'recipients' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-zinc-950">Saved Recipients</h2>
                  <p className="text-xs text-zinc-500">Store friends and upcoming birthdays for quick gifting.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddRecipientOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm hover:bg-purple-800 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Recipient</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {savedRecipients.map((rec) => (
                  <div key={rec.id} className="bg-white rounded-3xl p-6 border border-zinc-200/90 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 font-extrabold text-sm flex items-center justify-center">
                          {rec.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-[11px] font-bold text-zinc-500 bg-zinc-100 px-2.5 py-0.5 rounded-full">
                          {rec.relationship}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-base text-zinc-900">{rec.name}</h3>
                      <div className="text-xs text-zinc-500 mt-1 space-y-1">
                        <div className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-zinc-400" />
                          <span>{rec.email}</span>
                        </div>
                      </div>
                      {rec.occasion && (
                        <div className="mt-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>{rec.occasion} reminder active</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between">
                      <span className="text-xs text-zinc-400">{rec.totalGiftsSent} gifts sent</span>
                      <Link
                        href="/cards"
                        className="px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold flex items-center gap-1 transition"
                      >
                        <span>Send Gift</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: ACCOUNT SETTINGS */}
          {activeTab === 'account' && (
            <div className="max-w-xl bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/90 shadow-sm space-y-6">
              <h2 className="text-xl font-black text-zinc-900">Account Preferences</h2>
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Display Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm font-semibold focus:border-purple-600 focus:outline-none"
                >
                  <option value="USD">USD ($) - United States Dollar</option>
                  <option value="EUR">EUR (€) - Euro</option>
                  <option value="GBP">GBP (£) - British Pound</option>
                  <option value="NGN">NGN (₦) - Nigerian Naira</option>
                  <option value="KES">KES (KSh) - Kenyan Shilling</option>
                </select>
              </div>

              <div className="pt-4 border-t border-zinc-100 space-y-2">
                <h4 className="text-sm font-bold text-zinc-900">Delivery Notifications</h4>
                <label className="flex items-center gap-2 text-xs text-zinc-600">
                  <input type="checkbox" defaultChecked className="rounded text-purple-600" />
                  <span>Notify me when recipient receives their card</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-zinc-600">
                  <input type="checkbox" defaultChecked className="rounded text-purple-600" />
                  <span>Send birthday alerts for saved recipients</span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 6: SUPPORT */}
          {activeTab === 'support' && (
            <div className="max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/90 shadow-sm space-y-4">
              <h2 className="text-xl font-black text-zinc-900">Concierge Help</h2>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Need help with a delivered card or have a question about redeeming your gift card?
              </p>
              <div className="pt-2 flex items-center gap-3">
                <Link
                  href="/support"
                  className="px-5 py-2.5 rounded-xl bg-purple-700 text-white font-bold text-xs hover:bg-purple-800 transition"
                >
                  Visit Help Center
                </Link>
                <Link
                  href="/support#contact"
                  className="px-5 py-2.5 rounded-xl border border-zinc-200 text-zinc-700 font-bold text-xs hover:bg-zinc-50 transition"
                >
                  Contact Concierge
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Add Recipient Modal */}
      {isAddRecipientOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-zinc-200 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h3 className="font-extrabold text-lg text-zinc-900">Add New Recipient</h3>
              <button
                type="button"
                onClick={() => setIsAddRecipientOpen(false)}
                className="text-zinc-400 hover:text-zinc-700 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRecipient} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newRecName}
                  onChange={(e) => setNewRecName(e.target.value)}
                  placeholder="e.g. David Adeyemi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-medium focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newRecEmail}
                  onChange={(e) => setNewRecEmail(e.target.value)}
                  placeholder="e.g. david@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-medium focus:border-purple-600 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddRecipientOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-600 hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs shadow-sm"
                >
                  Save Recipient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
