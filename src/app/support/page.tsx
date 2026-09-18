'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { CartDrawer } from '@/components/common/CartDrawer';
import { GENERAL_FAQS } from '@/data/giftCards';
import {
  Search,
  HelpCircle,
  Zap,
  ShieldCheck,
  CreditCard,
  Mail,
  Send,
  MessageSquare,
  Clock,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('Delivery Issue');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const topicTiles = [
    {
      id: 'delivery',
      title: 'Delivery & Tracking',
      desc: 'Instant delivery status, resending claim emails & SMS',
      icon: <Zap className="w-5 h-5 text-emerald-600" />,
      color: 'bg-emerald-50 border-emerald-200',
    },
    {
      id: 'redemption',
      title: 'Gift Card Issues',
      desc: 'How to apply codes, brand errors, swap guarantee',
      icon: <RefreshCw className="w-5 h-5 text-purple-600" />,
      color: 'bg-purple-50 border-purple-200',
    },
    {
      id: 'payments',
      title: 'Payment & Billing',
      desc: 'Supported cards, Apple Pay, Mobile Money, VAT & receipts',
      icon: <CreditCard className="w-5 h-5 text-blue-600" />,
      color: 'bg-blue-50 border-blue-200',
    },
    {
      id: 'security',
      title: 'Trust & Safety',
      desc: 'Direct partner authorization, fraud prevention, refunds',
      icon: <ShieldCheck className="w-5 h-5 text-[#FF5722]" />,
      color: 'bg-orange-50 border-orange-200',
    },
  ];

  const extendedFaqs = [
    ...GENERAL_FAQS,
    {
      question: 'My recipient has not received their delivery email. What should I do?',
      answer: 'First, check spam or promotions folders. You can also view the direct claim link at any time in your Vouchr Account dashboard and send it over WhatsApp, iMessage, or SMS.',
      category: 'delivery',
    },
    {
      question: 'Can I cancel or refund a gift card after purchasing?',
      answer: 'Because digital codes are issued instantly via brand APIs, orders cannot be directly refunded once the code has been viewed. However, through our Vouchr Guarantee, the recipient can exchange unredeemed codes for any other brand in our store for free.',
      category: 'payments',
    },
    {
      question: 'What if a brand site says the code is invalid?',
      answer: 'All our codes are verified directly through official brand distribution networks. Double check that you are typing the code without spaces, and verify that your brand account region matches the card region. If the issue persists, message us below and we will replace it immediately.',
      category: 'redemption',
    },
    {
      question: 'How do I obtain a business VAT invoice?',
      answer: 'Every purchase confirmation email includes a downloadable PDF receipt complete with transaction reference and breakdown. For corporate bulk purchases, contact our enterprise desk.',
      category: 'payments',
    },
  ];

  const filteredFaqs = extendedFaqs.filter((faq) => {
    if (activeCategory !== 'all' && faq.category !== activeCategory) {
      return false;
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q);
    }
    return true;
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-zinc-900">
      <Header />
      <CartDrawer />

      <main className="flex-1 py-12 sm:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header & Search Hero */}
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Vouchr Help Center</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-zinc-950 tracking-tight">
              How can we help today?
            </h1>

            <p className="text-zinc-600 text-sm sm:text-base">
              Instant answers for gift card redemption, delivery tracking, and payment questions.
            </p>

            {/* Search Input */}
            <div className="relative max-w-xl mx-auto pt-2">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search common questions (e.g. 'swap brand', 'resend email', 'refund')..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-zinc-200 text-sm font-medium shadow-sm focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-zinc-400">
              <Clock className="w-3.5 h-3.5 text-purple-600" />
              <span>Average concierge response time: <strong>4 minutes</strong></span>
            </div>
          </div>

          {/* 4 Topic Quick Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
            {topicTiles.map((tile) => (
              <button
                key={tile.id}
                type="button"
                onClick={() => {
                  setActiveCategory(activeCategory === tile.id ? 'all' : tile.id);
                  setSearchQuery('');
                }}
                className={`p-5 rounded-2xl border text-left transition-all ${
                  activeCategory === tile.id
                    ? 'bg-purple-700 text-white border-purple-700 shadow-md scale-[1.02]'
                    : 'bg-white hover:bg-zinc-50 border-zinc-200/90 hover:border-purple-200'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                    activeCategory === tile.id ? 'bg-white/20 text-white' : tile.color
                  }`}
                >
                  {tile.icon}
                </div>
                <h3
                  className={`font-extrabold text-sm mb-1 ${
                    activeCategory === tile.id ? 'text-white' : 'text-zinc-900'
                  }`}
                >
                  {tile.title}
                </h3>
                <p
                  className={`text-xs line-clamp-2 ${
                    activeCategory === tile.id ? 'text-purple-100' : 'text-zinc-500'
                  }`}
                >
                  {tile.desc}
                </p>
              </button>
            ))}
          </div>

          {/* FAQs Accordion */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200/90 shadow-sm mb-14 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h2 className="font-black text-xl text-zinc-950">
                Frequently Asked Questions ({filteredFaqs.length})
              </h2>
              {activeCategory !== 'all' && (
                <button
                  type="button"
                  onClick={() => setActiveCategory('all')}
                  className="text-xs font-bold text-purple-700 hover:text-purple-900"
                >
                  View all categories
                </button>
              )}
            </div>

            <div className="space-y-3 pt-2">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-2xl border border-zinc-200/80 bg-[#FAF9F6] overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-extrabold text-sm sm:text-base text-zinc-900 hover:text-purple-700 transition"
                      >
                        <span>{faq.question}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform ${
                            isOpen ? 'rotate-180 text-purple-700' : ''
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-zinc-600 leading-relaxed border-t border-zinc-200/60 pt-3 animate-in fade-in duration-150">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-zinc-500 text-sm">
                  No matching questions found for &ldquo;{searchQuery}&rdquo;. Feel free to message our concierge below!
                </div>
              )}
            </div>
          </div>

          {/* Contact Support Form Section */}
          <div id="contact" className="bg-white rounded-3xl p-6 sm:p-10 border border-zinc-200/90 shadow-sm">
            <div className="max-w-2xl mx-auto">
              <div className="text-center space-y-2 mb-8">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-black uppercase tracking-wider">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Direct Concierge Desk</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-zinc-950">
                  Still need assistance?
                </h2>
                <p className="text-zinc-600 text-xs sm:text-sm">
                  Send a message directly to our support agents. We resolve 92% of queries on first contact.
                </p>
              </div>

              {isSubmitted ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-in fade-in zoom-in-95">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-black text-emerald-950">Message Dispatched!</h3>
                  <p className="text-xs text-emerald-800 max-w-sm mx-auto">
                    We have assigned ticket <strong>#VCR-{Math.floor(10000 + Math.random() * 90000)}</strong>. A support specialist will respond to {contactEmail} within 5 minutes.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setContactMessage('');
                    }}
                    className="mt-2 text-xs font-bold text-emerald-900 underline"
                  >
                    Send another query
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-zinc-700 block mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Alex Mercer"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-medium focus:border-purple-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-zinc-700 block mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="alex@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-medium focus:border-purple-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-700 block mb-1">
                      Topic / Category
                    </label>
                    <select
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-semibold focus:border-purple-600 focus:outline-none"
                    >
                      <option value="Delivery Issue">Delivery Issue (Recipient did not get code)</option>
                      <option value="Redemption Issue">Redemption Issue (Brand code error)</option>
                      <option value="Swap Brand">Swap Brand Guarantee Request</option>
                      <option value="Payment Inquiry">Payment & Billing Inquiry</option>
                      <option value="Corporate / Bulk">Corporate & Bulk Orders</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-700 block mb-1">
                      How can we help?
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Include order reference number (e.g. VCR-99214) if applicable..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-medium focus:border-purple-600 focus:outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-purple-600/20 transition"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
