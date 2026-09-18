'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { CartDrawer } from '@/components/common/CartDrawer';
import { BrandIcon } from '@/components/common/BrandIcon';
import { useVouchr } from '@/context/VouchrContext';
import { Order, SavedRecipient } from '@/types';
import {
  Gift,
  Users,
  User,
  Heart,
  Calendar,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  Zap,
  ArrowRight,
  Plus,
  Mail,
  Phone,
  Settings,
  HelpCircle,
} from 'lucide-react';

export default function AccountPage() {
  const { orders, savedRecipients, addSavedRecipient, format, currency, setCurrency } = useVouchr();

  const [activeTab, setActiveTab] = useState<'orders' | 'recipients' | 'settings'>('orders');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // New recipient modal
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
      favoriteBrands: ['Spotify', 'Uber'],
      totalGiftsSent: 0,
    };

    addSavedRecipient(newRec);
    setIsAddRecipientOpen(false);
    setNewRecName('');
    setNewRecEmail('');
    setNewRecPhone('');
    setNewRecDate('');
  };

  const copyText = (text: string, type: 'code' | 'link') => {
    navigator.clipboard.writeText(text);
    if (type === 'code') {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-zinc-900">
      <Header />
      <CartDrawer />

      <main className="flex-1 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* User Profile Overview Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/90 shadow-sm mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-700 text-white font-black text-2xl flex items-center justify-center shadow-md shadow-purple-600/20">
                AM
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-zinc-950">Alex Mercer</h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
                    Pro Gifter
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">
                  alex.mercer@example.com • Member since 2025
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link
                href="/cards"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Send a New Gift</span>
              </Link>

              <Link
                href="/support"
                className="px-4 py-2.5 rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-bold text-xs flex items-center gap-1.5 transition"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Help</span>
              </Link>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mb-8 border-b border-zinc-200 pb-3">
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
                activeTab === 'orders'
                  ? 'bg-purple-700 text-white shadow-md shadow-purple-600/20'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-white'
              }`}
            >
              <Gift className="w-4 h-4" />
              <span>Gifts Sent ({orders.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('recipients')}
              className={`px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
                activeTab === 'recipients'
                  ? 'bg-purple-700 text-white shadow-md shadow-purple-600/20'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Saved Recipients ({savedRecipients.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
                activeTab === 'settings'
                  ? 'bg-purple-700 text-white shadow-md shadow-purple-600/20'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-white'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>

          {/* TAB 1: ORDERS & GIFTS SENT */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-zinc-900">Your Gift Card Orders</h2>
                <span className="text-xs text-zinc-500">
                  {orders.length} digital vouchers issued
                </span>
              </div>

              <div className="space-y-4">
                {orders.map((order) => {
                  const item = order.items[0];
                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-3xl p-6 border border-zinc-200/90 shadow-sm hover:border-purple-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-zinc-950 flex items-center justify-center shrink-0 p-2.5 shadow-sm">
                          <BrandIcon brandId={item.giftCard.id} size={32} className="w-8 h-8" />
                        </div>

                        <div>
                          <div className="flex items-center gap-2.5">
                            <h3 className="font-extrabold text-base text-zinc-900">
                              {item.giftCard.brand} Gift Card
                            </h3>
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              {order.deliveryStatus.toUpperCase()}
                            </span>
                          </div>

                          <div className="text-xs text-zinc-500 mt-1">
                            Sent to:{' '}
                            <strong className="text-zinc-800">
                              {item.recipientName || 'Myself'}
                            </strong>{' '}
                            ({item.recipientEmail || 'Immediate access'})
                          </div>

                          <div className="text-xs text-zinc-400 mt-1 flex items-center gap-3">
                            <span>Ref: {order.orderNumber}</span>
                            <span>•</span>
                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-6 pt-4 md:pt-0 border-t md:border-t-0 border-zinc-100">
                        <div className="text-left md:text-right">
                          <span className="text-xs text-zinc-400 block font-medium">Face Value</span>
                          <span className="text-lg font-black text-zinc-950">
                            {format(order.totalUSD)}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-extrabold text-xs transition"
                        >
                          View Voucher Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: SAVED RECIPIENTS */}
          {activeTab === 'recipients' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-zinc-900">Saved Friends & Family</h2>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Never forget a birthday or milestone. Send gifts with a single click.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddRecipientOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Recipient</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedRecipients.map((rec) => (
                  <div
                    key={rec.id}
                    className="bg-white rounded-3xl p-6 border border-zinc-200/90 shadow-sm flex flex-col justify-between hover:border-purple-200 transition"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 font-extrabold text-sm flex items-center justify-center">
                          {rec.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <span className="text-[11px] font-bold text-zinc-500 bg-zinc-100 px-2.5 py-0.5 rounded-full">
                          {rec.relationship}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-base text-zinc-900">{rec.name}</h3>
                      <div className="text-xs text-zinc-500 space-y-1 mt-1.5">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-zinc-400" />
                          <span>{rec.email}</span>
                        </div>
                        {rec.phone && (
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-zinc-400" />
                            <span>{rec.phone}</span>
                          </div>
                        )}
                      </div>

                      {rec.occasion && (
                        <div className="mt-4 p-3 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                          <div>
                            <span className="font-bold">{rec.occasion}:</span>{' '}
                            {rec.occasionDate ? new Date(rec.occasionDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Soon'}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between">
                      <span className="text-xs text-zinc-400">
                        {rec.totalGiftsSent} gifts sent
                      </span>
                      <Link
                        href="/cards"
                        className="px-3.5 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold flex items-center gap-1 transition"
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

          {/* TAB 3: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/90 shadow-sm space-y-6">
              <h2 className="text-xl font-black text-zinc-900">Gifting Preferences</h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">
                    Preferred Currency
                  </label>
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

                <div className="pt-4 border-t border-zinc-100">
                  <h4 className="font-extrabold text-sm text-zinc-900 mb-2">Notification Alerts</h4>
                  <div className="space-y-2 text-xs text-zinc-600">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded text-purple-600 focus:ring-purple-500" />
                      <span>Email notification when recipient opens or claims voucher</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded text-purple-600 focus:ring-purple-500" />
                      <span>Upcoming birthday reminders 7 days in advance</span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" defaultChecked className="rounded text-purple-600 focus:ring-purple-500" />
                      <span>Exclusive brand discounts and cashback promos</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-zinc-200 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center p-2">
                  <BrandIcon brandId={selectedOrder.items[0].giftCard.id} size={24} className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-zinc-900">
                    {selectedOrder.items[0].giftCard.brand} Gift Card
                  </h3>
                  <span className="text-xs text-zinc-400">
                    Ref: {selectedOrder.orderNumber}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="text-zinc-400 hover:text-zinc-700 p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
                <div className="text-zinc-400 uppercase font-bold text-[10px]">Digital Claim Code</div>
                <div className="flex items-center justify-between font-mono text-base font-black text-purple-700">
                  <span>{selectedOrder.voucherCode}</span>
                  <button
                    type="button"
                    onClick={() => copyText(selectedOrder.voucherCode, 'code')}
                    className="text-xs font-sans px-2.5 py-1 rounded-lg bg-purple-100 text-purple-800 font-bold hover:bg-purple-200 transition"
                  >
                    {copiedCode ? 'Copied!' : 'Copy Code'}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-zinc-600">
                  <span>Recipient:</span>
                  <span className="font-bold text-zinc-900">{selectedOrder.items[0].recipientName || 'Myself'}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Email:</span>
                  <span className="font-bold text-zinc-900">{selectedOrder.items[0].recipientEmail || 'Account email'}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Face Value:</span>
                  <span className="font-bold text-zinc-900">{format(selectedOrder.totalUSD)}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Delivery Status:</span>
                  <span className="font-bold text-emerald-600 capitalize">{selectedOrder.deliveryStatus}</span>
                </div>
              </div>

              {selectedOrder.items[0].message && (
                <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 text-purple-900 italic">
                  &ldquo;{selectedOrder.items[0].message}&rdquo;
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => copyText(selectedOrder.claimUrl, 'link')}
                className="flex-1 py-3 rounded-xl bg-purple-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 hover:bg-purple-800 transition"
              >
                {copiedLink ? 'Link Copied!' : 'Copy Claim Link'}
              </button>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-3 rounded-xl border border-zinc-200 text-zinc-700 font-bold text-xs hover:bg-zinc-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Relationship</label>
                <select
                  value={newRecRelation}
                  onChange={(e) => setNewRecRelation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-semibold focus:border-purple-600 focus:outline-none"
                >
                  <option value="Best Friend">Best Friend</option>
                  <option value="Family">Family</option>
                  <option value="Partner">Partner</option>
                  <option value="Colleague">Colleague</option>
                  <option value="Client">Client</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Occasion</label>
                  <input
                    type="text"
                    value={newRecOccasion}
                    onChange={(e) => setNewRecOccasion(e.target.value)}
                    placeholder="Birthday"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-medium focus:border-purple-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Occasion Date</label>
                  <input
                    type="date"
                    value={newRecDate}
                    onChange={(e) => setNewRecDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-medium focus:border-purple-600 focus:outline-none"
                  />
                </div>
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
