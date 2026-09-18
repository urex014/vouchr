'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { CartDrawer } from '@/components/common/CartDrawer';
import { useVouchr } from '@/context/VouchrContext';
import { SavedRecipient } from '@/types';
import {
  Gift,
  ShoppingBag,
  CreditCard,
  Users,
  Settings,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  Plus,
  Mail,
  Phone,
  Calendar,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

export default function AccountPage() {
  const { savedRecipients, addSavedRecipient, format } = useVouchr();

  const [activeTab, setActiveTab] = useState<
    'gift_cards' | 'orders' | 'transactions' | 'recipients' | 'account' | 'support'
  >('gift_cards');

  // Real user and orders state from MongoDB
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  // Recipient form modal state
  const [isAddRecipientOpen, setIsAddRecipientOpen] = useState(false);
  const [newRecName, setNewRecName] = useState('');
  const [newRecEmail, setNewRecEmail] = useState('');
  const [newRecPhone, setNewRecPhone] = useState('');
  const [newRecRelation, setNewRecRelation] = useState('Friend');
  const [newRecOccasion, setNewRecOccasion] = useState('Birthday');
  const [newRecDate, setNewRecDate] = useState('');

  // Fetch authenticated user profile & real orders from MongoDB
  const loadUserData = useCallback(async () => {
    try {
      setOrdersLoading(true);
      setOrdersError(null);

      // 1. Fetch user session
      const userRes = await fetch('/api/auth/me');
      let userEmail = 'alex.mercer@example.com';
      if (userRes.ok) {
        const userData = await userRes.json();
        if (userData.success && userData.data?.user) {
          setCurrentUser(userData.data.user);
          userEmail = userData.data.user.email;
        }
      }

      // 2. Fetch orders from MongoDB
      const ordersRes = await fetch(`/api/orders?email=${encodeURIComponent(userEmail)}`);
      if (!ordersRes.ok) {
        throw new Error('Unable to load your orders from database.');
      }
      const ordersData = await ordersRes.json();
      if (ordersData.success) {
        setUserOrders(ordersData.data || []);
      }
    } catch (err: any) {
      console.error('Account load error:', err);
      setOrdersError(err.message || 'Failed to connect to order records.');
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

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
    { id: 'gift_cards', label: `My Gift Cards (${userOrders.length})`, icon: <Gift className="w-4 h-4" /> },
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
                {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'AM'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-black text-zinc-950">
                    {currentUser?.name || 'Alex Mercer'}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
                    {currentUser?.role === 'ADMIN' ? 'Executive Admin' : 'Verified Customer'}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {currentUser?.email || 'alex.mercer@example.com'} • MongoDB Source of Truth
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {currentUser?.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition"
                >
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <span>Admin Console</span>
                </Link>
              )}

              <Link
                href="/cards"
                className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Browse Catalog</span>
              </Link>
            </div>
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

          {/* Error State */}
          {ordersError && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span>{ordersError}</span>
              </div>
              <button
                type="button"
                onClick={loadUserData}
                className="px-3 py-1 rounded-lg bg-red-600 text-white font-bold"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading State */}
          {ordersLoading && (
            <div className="py-20 text-center space-y-3">
              <div className="w-10 h-10 border-4 border-purple-700 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-bold text-zinc-500">Retrieving order records from MongoDB...</p>
            </div>
          )}

          {/* TAB 1: MY GIFT CARDS */}
          {!ordersLoading && activeTab === 'gift_cards' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-zinc-950">My Gift Cards</h2>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Your active and delivered digital vouchers from Reloadly.
                  </p>
                </div>
                <span className="text-xs font-bold text-zinc-500">
                  {userOrders.length} vouchers recorded
                </span>
              </div>

              {userOrders.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 border border-zinc-200 text-center max-w-md mx-auto space-y-4">
                  <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mx-auto">
                    <Gift className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-black text-zinc-950">No gift cards yet</h3>
                  <p className="text-xs text-zinc-500">
                    You haven&apos;t purchased any digital gift cards yet. Explore our marketplace to send your first gift.
                  </p>
                  <Link
                    href="/cards"
                    className="inline-flex px-6 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-extrabold shadow-sm transition"
                  >
                    Explore Gift Cards
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userOrders.map((order) => (
                    <div
                      key={order._id}
                      className="bg-white rounded-3xl p-6 border border-zinc-200/90 shadow-sm flex flex-col justify-between hover:border-purple-200 hover:shadow-md transition"
                    >
                      {/* Actual Artwork */}
                      <div className="relative w-full pt-[60%] bg-[#F5F4F0] rounded-2xl overflow-hidden p-4 mb-4 border border-zinc-200 flex items-center justify-center">
                        <div className="absolute inset-3 flex items-center justify-center">
                          <img
                            src={order.productImage || '/giftcards/amazon-us.svg'}
                            alt={`${order.brandName} card`}
                            className="w-full h-full object-contain filter drop-shadow-md rounded-lg"
                          />
                        </div>
                        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-black bg-white/90 text-zinc-800 border border-zinc-200">
                          {order.country}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-extrabold text-base text-zinc-900 truncate">
                            {order.brandName}
                          </h3>
                          <span className="font-black text-base text-purple-700 shrink-0">
                            ${order.amount} {order.currency}
                          </span>
                        </div>

                        <div className="text-xs text-zinc-500 space-y-0.5">
                          <div>
                            Recipient: <strong className="text-zinc-800">{order.recipientName || 'Friend'}</strong>
                          </div>
                          <div>
                            Email: <span className="text-zinc-700 truncate">{order.recipientEmail}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] pt-3 border-t border-zinc-100">
                          <span className="text-emerald-600 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {order.deliveryStatus || 'Delivered'}
                          </span>
                          <span className="font-mono text-zinc-400">{order.orderNumber}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                        <Link
                          href={`/order-success?orderId=${order._id}`}
                          className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
                        >
                          <span>View delivery receipt</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ORDERS */}
          {!ordersLoading && activeTab === 'orders' && (
            <div className="space-y-4">
              <h2 className="text-xl font-black text-zinc-950 mb-2">Order History</h2>
              <div className="bg-white rounded-3xl border border-zinc-200/90 overflow-hidden shadow-sm">
                {userOrders.length === 0 ? (
                  <div className="p-12 text-center text-zinc-400 font-bold text-xs">
                    No orders recorded yet.
                  </div>
                ) : (
                  <div className="divide-y divide-zinc-100">
                    {userOrders.map((order) => (
                      <div key={order._id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-11 bg-zinc-100 rounded-xl p-1 border border-zinc-200 shrink-0 flex items-center justify-center overflow-hidden">
                            <img
                              src={order.productImage || '/giftcards/amazon-us.svg'}
                              alt={order.brandName}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-extrabold text-sm text-zinc-900">{order.brandName} Gift Card</h4>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {order.purchaseStatus === 'SUCCESS' ? 'Fulfilled' : order.purchaseStatus}
                              </span>
                            </div>
                            <span className="text-xs text-zinc-400">
                              {order.orderNumber} • {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-6">
                          <span className="font-black text-sm text-zinc-900">
                            ${order.total?.toFixed(2)}
                          </span>
                          <Link
                            href={`/order-success?orderId=${order._id}`}
                            className="text-xs font-bold px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition"
                          >
                            Receipt
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: TRANSACTIONS */}
          {!ordersLoading && activeTab === 'transactions' && (
            <div className="space-y-4">
              <h2 className="text-xl font-black text-zinc-950 mb-2">Transaction Records</h2>
              <div className="bg-white rounded-3xl border border-zinc-200/90 overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 border-b border-zinc-100 text-zinc-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Order Reference</th>
                      <th className="p-4">Brand</th>
                      <th className="p-4">Date</th>
                      <th className="p-4 text-right">Amount</th>
                      <th className="p-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {userOrders.map((o) => (
                      <tr key={o._id} className="hover:bg-zinc-50/50">
                        <td className="p-4 font-mono font-bold text-zinc-900">{o.orderNumber}</td>
                        <td className="p-4 font-bold text-zinc-800">{o.brandName}</td>
                        <td className="p-4 text-zinc-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                        <td className="p-4 text-right font-black text-zinc-900">${o.total?.toFixed(2)}</td>
                        <td className="p-4 text-center">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                            {o.paymentStatus}
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
                  <h2 className="text-xl font-black text-zinc-950">Saved Gift Recipients</h2>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Manage family and friends for quick gifting and automated reminders.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddRecipientOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Recipient</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedRecipients.map((rec) => (
                  <div
                    key={rec.id}
                    className="bg-white rounded-3xl p-6 border border-zinc-200/90 shadow-sm space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 font-black text-lg flex items-center justify-center">
                        {rec.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold text-[10px]">
                        {rec.relationship}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-black text-base text-zinc-900">{rec.name}</h3>
                      <div className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3.5 h-3.5 text-zinc-400" />
                        <span className="truncate">{rec.email}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: ACCOUNT */}
          {activeTab === 'account' && (
            <div className="max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-6">
              <h2 className="text-xl font-black text-zinc-950">Account Profile &amp; Preferences</h2>
              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    disabled
                    value={currentUser?.name || 'Alex Mercer'}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={currentUser?.email || 'alex.mercer@example.com'}
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-zinc-700 block mb-1">Account Role</label>
                  <span className="px-3 py-1 rounded-lg bg-purple-100 text-purple-900 font-extrabold inline-block">
                    {currentUser?.role || 'USER'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SUPPORT */}
          {activeTab === 'support' && (
            <div className="max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-4">
              <h2 className="text-xl font-black text-zinc-950">Customer Concierge &amp; Help</h2>
              <p className="text-xs text-zinc-600">
                Need assistance with a digital card redemption or blockchain transaction? Our concierge is on standby 24/7.
              </p>
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 text-xs text-purple-900 font-semibold space-y-1">
                <p>Email: support@vouchr.com</p>
                <p>Response Time: Under 15 minutes</p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
