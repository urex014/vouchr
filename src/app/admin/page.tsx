'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import {
  ShieldCheck,
  TrendingUp,
  ShoppingBag,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Coins,
  Users,
  Search,
  Filter,
  RefreshCw,
  Eye,
  RotateCcw,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Lock,
  ArrowRight,
  Sparkles,
  Calendar,
  Globe,
  Tag,
  Copy,
  Check,
  FileText,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();

  // Auth & Admin State
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'customers' | 'products' | 'audit'>('overview');

  // Stats State
  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Orders State
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersTotalPages, setOrdersTotalPages] = useState(1);
  const [ordersTotal, setOrdersTotal] = useState(0);

  // Order Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('ALL');
  const [filterPurchaseStatus, setFilterPurchaseStatus] = useState('ALL');
  const [filterDeliveryStatus, setFilterDeliveryStatus] = useState('ALL');
  const [filterCountry, setFilterCountry] = useState('ALL');

  // Customers State
  const [customers, setCustomers] = useState<any[]>([]);
  const [customersLoading, setCustomersLoading] = useState(false);

  // Products State
  const [products, setProducts] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [isSyncingProducts, setIsSyncingProducts] = useState(false);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [auditLogsLoading, setAuditLogsLoading] = useState(false);

  // Selected Order Detail Modal
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<any | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [isRetryingOrder, setIsRetryingOrder] = useState(false);
  const [retryMessage, setRetryMessage] = useState<string | null>(null);

  // Sensitive Revealed Gift Card in Detail Modal
  const [revealedCard, setRevealedCard] = useState<any | null>(null);
  const [loadingRevealedCard, setLoadingRevealedCard] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Live Auto-Refresh State (20s interval)
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date>(new Date());
  const [isRefreshingManual, setIsRefreshingManual] = useState(false);

  // 1. Verify Admin Session on Mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          setIsAdmin(false);
          setAuthChecking(false);
          return;
        }
        const data = await res.json();
        if (data.success && data.data?.user?.role === 'ADMIN') {
          setIsAdmin(true);
          setAdminUser(data.data.user);
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        setIsAdmin(false);
      } finally {
        setAuthChecking(false);
      }
    }
    checkAuth();
  }, []);

  // 2. Fetch Stats
  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        }
      }
    } catch (err) {
      console.error('Failed to fetch admin stats:', err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // 3. Fetch Orders with Server-side Filters & Pagination
  const fetchOrders = useCallback(async () => {
    try {
      setOrdersLoading(true);
      const params = new URLSearchParams();
      params.set('page', String(ordersPage));
      params.set('limit', '15');
      if (searchQuery.trim()) params.set('search', searchQuery.trim());
      if (filterPaymentStatus !== 'ALL') params.set('paymentStatus', filterPaymentStatus);
      if (filterPurchaseStatus !== 'ALL') params.set('purchaseStatus', filterPurchaseStatus);
      if (filterDeliveryStatus !== 'ALL') params.set('deliveryStatus', filterDeliveryStatus);
      if (filterCountry !== 'ALL') params.set('country', filterCountry);

      const res = await fetch(`/api/admin/orders?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setOrders(data.data || []);
          setOrdersTotalPages(data.pagination?.totalPages || 1);
          setOrdersTotal(data.pagination?.total || 0);
        }
      }
    } catch (err) {
      console.error('Failed to fetch admin orders:', err);
    } finally {
      setOrdersLoading(false);
      setLastRefreshedAt(new Date());
    }
  }, [ordersPage, searchQuery, filterPaymentStatus, filterPurchaseStatus, filterDeliveryStatus, filterCountry]);

  // 4. Fetch Customers
  const fetchCustomers = useCallback(async () => {
    try {
      setCustomersLoading(true);
      const res = await fetch('/api/admin/customers?limit=25');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setCustomers(data.data || []);
        }
      }
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    } finally {
      setCustomersLoading(false);
    }
  }, []);

  // 5. Fetch Products
  const fetchProducts = useCallback(async () => {
    try {
      setProductsLoading(true);
      const res = await fetch('/api/admin/products?limit=50');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setProducts(data.data || []);
        }
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  // 6. Fetch Audit Logs
  const fetchAuditLogs = useCallback(async () => {
    try {
      setAuditLogsLoading(true);
      const res = await fetch('/api/admin/audit-logs?limit=30');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setAuditLogs(data.data || []);
        }
      }
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
    } finally {
      setAuditLogsLoading(false);
    }
  }, []);

  // Initial load when admin verified
  useEffect(() => {
    if (isAdmin) {
      fetchStats();
      fetchOrders();
    }
  }, [isAdmin, fetchStats, fetchOrders]);

  // Load active tab data
  useEffect(() => {
    if (!isAdmin) return;
    if (activeTab === 'customers') fetchCustomers();
    if (activeTab === 'products') fetchProducts();
    if (activeTab === 'audit') fetchAuditLogs();
  }, [activeTab, isAdmin, fetchCustomers, fetchProducts, fetchAuditLogs]);

  // 7. Live Real-Time Polling: Refresh data automatically every 20 seconds
  useEffect(() => {
    if (!isAdmin) return;
    const interval = setInterval(() => {
      fetchStats();
      fetchOrders();
      if (activeTab === 'customers') fetchCustomers();
      if (activeTab === 'audit') fetchAuditLogs();
    }, 20000);
    return () => clearInterval(interval);
  }, [isAdmin, fetchStats, fetchOrders, activeTab, fetchCustomers, fetchAuditLogs]);

  // Manual Refresh Handler
  const handleManualRefresh = async () => {
    setIsRefreshingManual(true);
    await Promise.all([fetchStats(), fetchOrders()]);
    if (activeTab === 'customers') await fetchCustomers();
    if (activeTab === 'products') await fetchProducts();
    if (activeTab === 'audit') await fetchAuditLogs();
    setIsRefreshingManual(false);
  };

  // Inspect Order Detail Handler
  const handleInspectOrder = async (order: any) => {
    setSelectedOrder(order);
    setSelectedOrderDetail(null);
    setRevealedCard(null);
    setRetryMessage(null);
    setLoadingDetail(true);

    try {
      const res = await fetch(`/api/admin/orders/${order._id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setSelectedOrderDetail(data.data);
        }
      }
    } catch (err) {
      console.error('Failed to load order details:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  // Explicit Action: Reveal Sensitive Gift Card Code & PIN (Writes Audit Log)
  const handleRevealGiftCard = async (orderId: string) => {
    setLoadingRevealedCard(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/gift-card`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setRevealedCard(data.data);
          fetchAuditLogs(); // Refresh audit logs to show GIFT_CARD_VIEWED
        }
      }
    } catch (err) {
      console.error('Failed to reveal card code:', err);
    } finally {
      setLoadingRevealedCard(false);
    }
  };

  // Admin Action: Retry Failed Reloadly Purchase Idempotently
  const handleRetryOrder = async (orderId: string) => {
    setIsRetryingOrder(true);
    setRetryMessage(null);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/retry`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setRetryMessage(`Retry failed: ${data.error || 'Provider rejected request'}`);
      } else {
        setRetryMessage(`Success: Reloadly fulfillment triggered. Status: ${data.data?.purchaseStatus}`);
        fetchOrders();
        fetchStats();
        if (selectedOrder) {
          handleInspectOrder({ ...selectedOrder, purchaseStatus: data.data?.purchaseStatus });
        }
      }
    } catch (err: any) {
      setRetryMessage(`Retry error: ${err.message}`);
    } finally {
      setIsRetryingOrder(false);
    }
  };

  // Admin Action: Toggle Product Active Status
  const handleToggleProduct = async (productId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (res.ok) {
        fetchProducts();
      }
    } catch (err) {
      console.error('Failed to toggle product status:', err);
    }
  };

  // Admin Action: Sync Products from Reloadly
  const handleSyncReloadly = async () => {
    setIsSyncingProducts(true);
    try {
      const res = await fetch('/api/products', { method: 'POST' });
      if (res.ok) {
        fetchProducts();
      }
    } catch (err) {
      console.error('Sync failed:', err);
    } finally {
      setIsSyncingProducts(false);
    }
  };

  // -------------------------------------------------------------
  // GUARD: Non-Admin / Unauthorized Access View
  // -------------------------------------------------------------
  if (authChecking) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-zinc-900">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20 text-center">
          <div className="space-y-3">
            <div className="w-12 h-12 border-4 border-purple-700 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-bold text-zinc-600">Verifying administrator credentials...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-zinc-900">
        <Header />
        <main className="flex-1 max-w-xl mx-auto px-4 py-24 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-6">
            <Lock className="w-8 h-8" />
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-red-600 mb-2">
            Access Restricted (HTTP 403)
          </span>
          <h1 className="text-3xl font-black text-zinc-950 mb-3">Administrator Authorization Required</h1>
          <p className="text-zinc-600 text-sm mb-6">
            This management console is restricted to authenticated server administrators. Please log in with authorized executive credentials.
          </p>
          <div className="p-4 rounded-2xl bg-zinc-100 border border-zinc-200 text-xs text-zinc-700 text-left w-full mb-6 space-y-1">
            <p className="font-bold text-zinc-900">Default Seed Administrator Account:</p>
            <p>Email: <code className="font-mono text-purple-700 font-bold">admin@vouchr.com</code></p>
            <p>Password: <code className="font-mono text-purple-700 font-bold">VouchrAdmin2026!</code></p>
          </div>
          <button
            type="button"
            onClick={async () => {
              await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: 'admin@vouchr.com', password: 'VouchrAdmin2026!' }),
              });
              window.location.reload();
            }}
            className="w-full py-3.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-sm shadow-md transition"
          >
            Authenticate as Administrator
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-zinc-900">
      <Header />

      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Top Bar: Title, Live Polling Indicator, and Manual Refresh */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-purple-700">
                  Vouchr Operations Console
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-900 border border-purple-200">
                  Live MongoDB
                </span>
              </div>
              <h1 className="text-3xl font-black text-zinc-950 tracking-tight">
                Executive Administration
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {/* Live Polling Indicator */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Auto-syncing every 20s</span>
              </div>

              {/* Manual Refresh CTA */}
              <button
                type="button"
                onClick={handleManualRefresh}
                disabled={isRefreshingManual}
                className="px-4 py-2 rounded-xl bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-800 text-xs font-extrabold flex items-center gap-1.5 shadow-xs transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingManual ? 'animate-spin text-purple-700' : ''}`} />
                <span>{isRefreshingManual ? 'Refreshing...' : 'Refresh'}</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-zinc-200/80">
            {[
              { id: 'overview', label: 'Overview & Metrics', icon: TrendingUp },
              { id: 'orders', label: `Orders (${ordersTotal})`, icon: ShoppingBag },
              { id: 'customers', label: 'Customers', icon: Users },
              { id: 'products', label: 'Gift Card Catalog', icon: Tag },
              { id: 'audit', label: 'Security Audit Logs', icon: FileText },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition whitespace-nowrap ${
                    isActive
                      ? 'bg-purple-700 text-white shadow-sm shadow-purple-700/20'
                      : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* ------------------------------------------------------------- */}
          {/* TAB 1: OVERVIEW & REAL MONGODB STATISTICS */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {statsLoading ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-28 bg-white rounded-2xl animate-pulse border border-zinc-200" />
                  ))}
                </div>
              ) : stats ? (
                <>
                  {/* Primary 4 Metric Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs space-y-2">
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
                        Total Revenue
                      </span>
                      <div className="text-2xl sm:text-3xl font-black text-zinc-950">
                        ${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                      <span className="text-[11px] font-bold text-emerald-600 block">
                        Settled &amp; Verified in MongoDB
                      </span>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs space-y-2">
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
                        Total Orders
                      </span>
                      <div className="text-2xl sm:text-3xl font-black text-zinc-950">
                        {stats.totalOrders}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-bold">
                        <span className="text-emerald-600">{stats.successfulOrders} fulfilled</span>
                        <span className="text-zinc-300">•</span>
                        <span className={stats.failedOrders > 0 ? 'text-red-600' : 'text-zinc-500'}>
                          {stats.failedOrders} failed
                        </span>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs space-y-2">
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
                        Gift Cards Sold
                      </span>
                      <div className="text-2xl sm:text-3xl font-black text-purple-700">
                        {stats.giftCardsSold}
                      </div>
                      <span className="text-[11px] font-bold text-zinc-500 block">
                        Reloadly Vouchers Issued
                      </span>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs space-y-2">
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
                        Total Customers
                      </span>
                      <div className="text-2xl sm:text-3xl font-black text-zinc-950">
                        {stats.numberOfCustomers}
                      </div>
                      <span className="text-[11px] font-bold text-zinc-500 block">
                        Active Gift Buyers
                      </span>
                    </div>
                  </div>

                  {/* Periodic Sales Breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50/50 rounded-2xl p-5 border border-purple-100 shadow-xs">
                      <span className="text-xs font-black uppercase tracking-wider text-purple-900 block mb-1">
                        Today&apos;s Sales
                      </span>
                      <div className="text-2xl font-black text-purple-950">
                        ${stats.todaySales.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                      <span className="text-[11px] font-medium text-purple-700 mt-1 block">
                        Current calendar day volume
                      </span>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                        This Week (7 Days)
                      </span>
                      <div className="text-2xl font-black text-zinc-950">
                        ${stats.thisWeekSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                      <span className="text-[11px] font-medium text-zinc-500 mt-1 block">
                        Trailing 7 days turnover
                      </span>
                    </div>

                    <div className="bg-white rounded-2xl p-5 border border-zinc-200 shadow-xs">
                      <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                        This Month (30 Days)
                      </span>
                      <div className="text-2xl font-black text-zinc-950">
                        ${stats.thisMonthSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                      <span className="text-[11px] font-medium text-zinc-500 mt-1 block">
                        Monthly aggregated sales
                      </span>
                    </div>
                  </div>

                  {/* Attention Required Banner (if any orders failed) */}
                  {stats.failedOrders > 0 && (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                        <div>
                          <strong className="font-extrabold text-amber-950 block">
                            {stats.failedOrders} Order(s) Require Administrative Attention
                          </strong>
                          <span className="text-amber-800">
                            Payments were captured, but Reloadly voucher delivery failed. Open the Orders tab to review or retry.
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFilterPurchaseStatus('FAILED');
                          setActiveTab('orders');
                        }}
                        className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shrink-0 transition"
                      >
                        View Failed Orders
                      </button>
                    </div>
                  )}
                </>
              ) : null}
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* TAB 2: LIVE ORDERS TABLE BACKED BY MONGODB */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'orders' && (
            <div className="space-y-5">
              {/* Filter & Search Toolbar */}
              <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-xs space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  {/* Search */}
                  <div className="sm:col-span-4 relative">
                    <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setOrdersPage(1);
                      }}
                      placeholder="Search order #, customer, recipient, txId..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-zinc-200 text-xs font-medium focus:border-purple-600 focus:outline-none"
                    />
                  </div>

                  {/* Payment Status */}
                  <div className="sm:col-span-2">
                    <select
                      value={filterPaymentStatus}
                      onChange={(e) => {
                        setFilterPaymentStatus(e.target.value);
                        setOrdersPage(1);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs font-semibold focus:border-purple-600 focus:outline-none bg-white"
                    >
                      <option value="ALL">Payment: All</option>
                      <option value="SUCCESS">Paid / Verified</option>
                      <option value="PENDING">Pending</option>
                      <option value="FAILED">Failed</option>
                    </select>
                  </div>

                  {/* Purchase Status */}
                  <div className="sm:col-span-2">
                    <select
                      value={filterPurchaseStatus}
                      onChange={(e) => {
                        setFilterPurchaseStatus(e.target.value);
                        setOrdersPage(1);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs font-semibold focus:border-purple-600 focus:outline-none bg-white"
                    >
                      <option value="ALL">Fulfillment: All</option>
                      <option value="SUCCESS">Purchased</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="FAILED">Failed</option>
                      <option value="PENDING">Pending</option>
                    </select>
                  </div>

                  {/* Delivery Status */}
                  <div className="sm:col-span-2">
                    <select
                      value={filterDeliveryStatus}
                      onChange={(e) => {
                        setFilterDeliveryStatus(e.target.value);
                        setOrdersPage(1);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs font-semibold focus:border-purple-600 focus:outline-none bg-white"
                    >
                      <option value="ALL">Delivery: All</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="PENDING">Pending</option>
                      <option value="FAILED">Failed</option>
                    </select>
                  </div>

                  {/* Country Filter */}
                  <div className="sm:col-span-2">
                    <select
                      value={filterCountry}
                      onChange={(e) => {
                        setFilterCountry(e.target.value);
                        setOrdersPage(1);
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs font-semibold focus:border-purple-600 focus:outline-none bg-white"
                    >
                      <option value="ALL">Region: All</option>
                      <option value="US">United States</option>
                      <option value="GLOBAL">Global</option>
                      <option value="GB">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="NG">Nigeria</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Real Orders Table */}
              <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-50/80 border-b border-zinc-200 text-zinc-500 font-extrabold uppercase tracking-wider">
                      <tr>
                        <th className="py-3.5 px-4">Order</th>
                        <th className="py-3.5 px-4">Customer</th>
                        <th className="py-3.5 px-4">Gift Card</th>
                        <th className="py-3.5 px-4">Amount</th>
                        <th className="py-3.5 px-4">Payment</th>
                        <th className="py-3.5 px-4">Fulfillment</th>
                        <th className="py-3.5 px-4">Delivery</th>
                        <th className="py-3.5 px-4">Date</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 font-medium">
                      {ordersLoading ? (
                        <tr>
                          <td colSpan={9} className="py-12 text-center text-zinc-400 font-bold">
                            Querying MongoDB order repository...
                          </td>
                        </tr>
                      ) : orders.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="py-12 text-center text-zinc-400 font-bold">
                            No orders found matching the selected filters.
                          </td>
                        </tr>
                      ) : (
                        orders.map((o) => (
                          <tr key={o._id} className="hover:bg-zinc-50/60 transition">
                            {/* Order Number */}
                            <td className="py-3.5 px-4 font-mono font-black text-purple-900">
                              {o.orderNumber}
                            </td>

                            {/* Customer */}
                            <td className="py-3.5 px-4">
                              <div className="font-extrabold text-zinc-900">{o.customerName || 'Customer'}</div>
                              <span className="text-[11px] text-zinc-500 truncate block max-w-[140px]">
                                {o.customerEmail}
                              </span>
                            </td>

                            {/* Gift Card */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2">
                                {o.productImage && (
                                  <img
                                    src={o.productImage}
                                    alt={o.brandName}
                                    className="w-7 h-5 rounded object-contain bg-zinc-50 border border-zinc-200"
                                  />
                                )}
                                <div>
                                  <span className="font-bold text-zinc-900 block">{o.brandName}</span>
                                  <span className="text-[10px] text-zinc-400">{o.country}</span>
                                </div>
                              </div>
                            </td>

                            {/* Amount */}
                            <td className="py-3.5 px-4 font-black text-zinc-900">
                              ${o.total.toFixed(2)}
                            </td>

                            {/* Payment Status */}
                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                                  o.paymentStatus === 'SUCCESS'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : o.paymentStatus === 'FAILED'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {o.paymentStatus}
                              </span>
                            </td>

                            {/* Purchase Status */}
                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                                  o.purchaseStatus === 'SUCCESS'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : o.purchaseStatus === 'FAILED'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-indigo-100 text-indigo-800'
                                }`}
                              >
                                {o.purchaseStatus}
                              </span>
                            </td>

                            {/* Delivery Status */}
                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                                  o.deliveryStatus === 'DELIVERED'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : o.deliveryStatus === 'FAILED'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-zinc-100 text-zinc-700'
                                }`}
                              >
                                {o.deliveryStatus}
                              </span>
                            </td>

                            {/* Date */}
                            <td className="py-3.5 px-4 text-[11px] text-zinc-500 whitespace-nowrap">
                              {new Date(o.createdAt).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                              {o.purchaseStatus === 'FAILED' && (
                                <button
                                  type="button"
                                  onClick={() => handleRetryOrder(o._id)}
                                  className="px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-extrabold text-[11px] inline-flex items-center gap-1 transition"
                                >
                                  <RotateCcw className="w-3 h-3" />
                                  <span>Retry</span>
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => handleInspectOrder(o)}
                                className="px-2.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-extrabold text-[11px] inline-flex items-center gap-1 transition"
                              >
                                <Eye className="w-3 h-3" />
                                <span>Inspect</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Server-Side Pagination Bar */}
                <div className="p-4 bg-zinc-50/70 border-t border-zinc-200 flex items-center justify-between text-xs text-zinc-600">
                  <span>
                    Showing Page <strong className="text-zinc-900">{ordersPage}</strong> of{' '}
                    <strong className="text-zinc-900">{ordersTotalPages}</strong> ({ordersTotal} total orders)
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={ordersPage <= 1}
                      onClick={() => setOrdersPage((p) => Math.max(1, p - 1))}
                      className="px-3 py-1.5 rounded-lg bg-white border border-zinc-200 hover:bg-zinc-50 disabled:opacity-40 font-extrabold text-xs flex items-center gap-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Previous</span>
                    </button>
                    <button
                      type="button"
                      disabled={ordersPage >= ordersTotalPages}
                      onClick={() => setOrdersPage((p) => Math.min(ordersTotalPages, p + 1))}
                      className="px-3 py-1.5 rounded-lg bg-white border border-zinc-200 hover:bg-zinc-50 disabled:opacity-40 font-extrabold text-xs flex items-center gap-1"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* TAB 3: REAL CUSTOMERS DIRECTORY */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'customers' && (
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-zinc-200 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-zinc-900">Registered Gift Buyers &amp; Customers</h3>
                  <span className="text-xs text-zinc-500">Aggregated directly from MongoDB order records</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 text-zinc-500 font-extrabold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Total Orders</th>
                      <th className="py-3 px-4">Total Spent</th>
                      <th className="py-3 px-4">Last Purchase</th>
                      <th className="py-3 px-4">Account Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 font-medium">
                    {customersLoading ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-zinc-400 font-bold">
                          Loading customer records...
                        </td>
                      </tr>
                    ) : customers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-zinc-400 font-bold">
                          No customer purchase records recorded yet.
                        </td>
                      </tr>
                    ) : (
                      customers.map((c) => (
                        <tr key={c.email} className="hover:bg-zinc-50/50">
                          <td className="py-3 px-4 font-extrabold text-zinc-900">{c.name}</td>
                          <td className="py-3 px-4 font-mono text-zinc-600">{c.email}</td>
                          <td className="py-3 px-4 font-bold text-zinc-900">{c.totalOrders}</td>
                          <td className="py-3 px-4 font-black text-purple-700">${c.totalSpent.toFixed(2)}</td>
                          <td className="py-3 px-4 text-zinc-500">
                            {c.lastPurchaseDate ? new Date(c.lastPurchaseDate).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              Active
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                setSearchQuery(c.email);
                                setActiveTab('orders');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-xs"
                            >
                              View Orders →
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* TAB 4: GIFT CARD CATALOG (Cached Reloadly Products) */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-extrabold text-sm text-zinc-900">Catalog Inventory (Cached Reloadly Products)</h3>
                  <span className="text-xs text-zinc-500">Admins can enable or disable brands without altering provider source pricing</span>
                </div>
                <button
                  type="button"
                  onClick={handleSyncReloadly}
                  disabled={isSyncingProducts}
                  className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs flex items-center gap-1.5 shrink-0 shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingProducts ? 'animate-spin' : ''}`} />
                  <span>{isSyncingProducts ? 'Syncing...' : 'Sync from Reloadly'}</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 text-zinc-500 font-extrabold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Brand &amp; Product</th>
                      <th className="py-3 px-4">Reloadly ID</th>
                      <th className="py-3 px-4">Region</th>
                      <th className="py-3 px-4">Currency</th>
                      <th className="py-3 px-4">Allowed Denominations</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 font-medium">
                    {productsLoading ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-zinc-400 font-bold">
                          Loading products from MongoDB...
                        </td>
                      </tr>
                    ) : products.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-zinc-400 font-bold">
                          No products found in MongoDB. Click &quot;Sync from Reloadly&quot; to populate.
                        </td>
                      </tr>
                    ) : (
                      products.map((p) => (
                        <tr key={p._id} className="hover:bg-zinc-50/50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              {p.productImage && (
                                <img
                                  src={p.productImage}
                                  alt={p.brandName}
                                  className="w-8 h-6 rounded object-contain bg-zinc-50 border border-zinc-200"
                                />
                              )}
                              <div>
                                <span className="font-extrabold text-zinc-900 block">{p.brandName}</span>
                                <span className="text-[10px] text-zinc-400">{p.productName}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-mono text-zinc-500">{p.reloadlyProductId}</td>
                          <td className="py-3 px-4 font-bold text-zinc-800">{p.country}</td>
                          <td className="py-3 px-4 font-mono font-bold text-zinc-700">{p.currency}</td>
                          <td className="py-3 px-4 text-zinc-600">
                            {p.denominationType === 'FIXED'
                              ? p.fixedAmounts?.join(', ')
                              : `${p.minAmount} - ${p.maxAmount}`}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                                p.isActive
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-zinc-200 text-zinc-600'
                              }`}
                            >
                              {p.isActive ? 'Active' : 'Disabled'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => handleToggleProduct(p._id, p.isActive)}
                              className={`px-3 py-1 rounded-lg font-bold text-xs transition ${
                                p.isActive
                                  ? 'bg-red-50 hover:bg-red-100 text-red-700'
                                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                              }`}
                            >
                              {p.isActive ? 'Disable' : 'Enable'}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* TAB 5: SECURITY AUDIT LOGS */}
          {/* ------------------------------------------------------------- */}
          {activeTab === 'audit' && (
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-zinc-200">
                <h3 className="font-extrabold text-sm text-zinc-900">Administrative Security Audit Trail</h3>
                <span className="text-xs text-zinc-500">Every sensitive action (viewing vouchers, retrying orders, toggling products) is chronologically recorded</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 text-zinc-500 font-extrabold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">Admin</th>
                      <th className="py-3 px-4">Action</th>
                      <th className="py-3 px-4">Target / Order</th>
                      <th className="py-3 px-4">Metadata</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 font-medium">
                    {auditLogsLoading ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-zinc-400 font-bold">
                          Loading audit trail...
                        </td>
                      </tr>
                    ) : auditLogs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-zinc-400 font-bold">
                          No audit log entries recorded yet.
                        </td>
                      </tr>
                    ) : (
                      auditLogs.map((log) => (
                        <tr key={log._id} className="hover:bg-zinc-50/50">
                          <td className="py-3 px-4 font-mono text-[11px] text-zinc-500 whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-purple-900">{log.adminEmail}</td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-black bg-zinc-100 text-zinc-800 border border-zinc-200">
                              {log.action}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-bold text-zinc-800">{log.orderId || log.target || 'System'}</td>
                          <td className="py-3 px-4 font-mono text-[10px] text-zinc-500 truncate max-w-xs">
                            {JSON.stringify(log.metadata || {})}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ------------------------------------------------------------- */}
      {/* ORDER INSPECTION MODAL / DRAWER */}
      {/* ------------------------------------------------------------- */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-zinc-200 shadow-2xl p-6 sm:p-8 space-y-6 my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-purple-700 block">
                  Order Inspector
                </span>
                <h3 className="text-xl font-black text-zinc-950 font-mono">
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {loadingDetail ? (
              <div className="py-12 text-center text-zinc-500 font-bold">
                Loading order details from MongoDB...
              </div>
            ) : (
              <>
                {/* Failure Banner if order failed */}
                {selectedOrder.purchaseStatus === 'FAILED' && (
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs space-y-2">
                    <div className="flex items-center gap-2 text-red-900 font-black">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span>Fulfillment Failure Recorded</span>
                    </div>
                    <p className="text-red-800">
                      Reason: {selectedOrder.failureReason || 'Reloadly provider fulfillment failed'}
                    </p>
                    <button
                      type="button"
                      disabled={isRetryingOrder}
                      onClick={() => handleRetryOrder(selectedOrder._id)}
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs flex items-center gap-1.5 transition"
                    >
                      <RotateCcw className={`w-3.5 h-3.5 ${isRetryingOrder ? 'animate-spin' : ''}`} />
                      <span>{isRetryingOrder ? 'Retrying with Reloadly...' : 'Retry Gift Card Purchase'}</span>
                    </button>
                  </div>
                )}

                {retryMessage && (
                  <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900 font-semibold">
                    {retryMessage}
                  </div>
                )}

                {/* Product Showcase */}
                <div className="p-4 rounded-2xl bg-[#F5F4F0] border border-zinc-200 flex items-center gap-4">
                  {selectedOrder.productImage && (
                    <img
                      src={selectedOrder.productImage}
                      alt={selectedOrder.brandName}
                      className="w-20 h-14 object-contain bg-white rounded-xl p-1 border border-zinc-200"
                    />
                  )}
                  <div>
                    <h4 className="font-extrabold text-base text-zinc-950">{selectedOrder.brandName}</h4>
                    <span className="text-xs text-zinc-500 block">{selectedOrder.productName} • {selectedOrder.country}</span>
                    <span className="text-xs font-black text-purple-700 block mt-0.5">
                      ${selectedOrder.amount} {selectedOrder.currency} × {selectedOrder.quantity || 1} = ${selectedOrder.total}
                    </span>
                  </div>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-200 space-y-1">
                    <span className="text-zinc-400 block font-bold uppercase text-[10px]">Customer</span>
                    <strong className="text-zinc-900 block">{selectedOrder.customerName || 'Vouchr Customer'}</strong>
                    <span className="text-zinc-500 font-mono text-[11px]">{selectedOrder.customerEmail}</span>
                  </div>

                  <div className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-200 space-y-1">
                    <span className="text-zinc-400 block font-bold uppercase text-[10px]">Recipient</span>
                    <strong className="text-zinc-900 block">{selectedOrder.recipientName || 'Friend'}</strong>
                    <span className="text-zinc-500 font-mono text-[11px]">{selectedOrder.recipientEmail}</span>
                  </div>

                  <div className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-200 space-y-1">
                    <span className="text-zinc-400 block font-bold uppercase text-[10px]">Payment Settlement</span>
                    <div className="font-extrabold text-zinc-900 flex items-center gap-1.5">
                      <span>Status: {selectedOrder.paymentStatus}</span>
                    </div>
                    {selectedOrderDetail?.payment?.providerReference && (
                      <span className="text-[10px] font-mono text-zinc-500 block truncate">
                        Ref: {selectedOrderDetail.payment.providerReference}
                      </span>
                    )}
                  </div>

                  <div className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-200 space-y-1">
                    <span className="text-zinc-400 block font-bold uppercase text-[10px]">Reloadly Fulfillment</span>
                    <strong className="text-zinc-900 block">Status: {selectedOrder.purchaseStatus}</strong>
                    {selectedOrder.reloadlyTransactionId && (
                      <span className="text-[10px] font-mono text-purple-700 block">
                        TxId: {selectedOrder.reloadlyTransactionId}
                      </span>
                    )}
                  </div>
                </div>

                {/* Explicit Action: Reveal Gift Card Credentials */}
                <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-extrabold text-xs text-purple-950 block">
                        Sensitive Gift Card Codes
                      </span>
                      <span className="text-[11px] text-zinc-600">
                        Codes are never shown in tables. Viewing triggers an audit log.
                      </span>
                    </div>

                    {!revealedCard && (
                      <button
                        type="button"
                        onClick={() => handleRevealGiftCard(selectedOrder._id)}
                        disabled={loadingRevealedCard}
                        className="px-3.5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs flex items-center gap-1.5 transition shadow-xs"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>{loadingRevealedCard ? 'Decrypting...' : 'View Gift Card'}</span>
                      </button>
                    )}
                  </div>

                  {revealedCard && (
                    <div className="p-3.5 bg-white rounded-xl border border-purple-200 space-y-2 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase">Card Voucher Code</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(revealedCard.code || '');
                            setCopiedCode(true);
                            setTimeout(() => setCopiedCode(false), 2000);
                          }}
                          className="text-[11px] font-bold text-purple-700 hover:underline"
                        >
                          {copiedCode ? 'Copied!' : 'Copy Code'}
                        </button>
                      </div>
                      <div className="font-mono text-sm font-black text-zinc-950 select-all">
                        {revealedCard.code || 'Pending code retrieval'}
                      </div>
                      {revealedCard.pin && (
                        <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
                          <span className="text-zinc-500">PIN:</span>
                          <span className="font-mono font-black text-zinc-900">{revealedCard.pin}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-extrabold text-xs transition"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
