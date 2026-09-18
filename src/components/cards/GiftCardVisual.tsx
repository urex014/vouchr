'use client';

import React, { useState } from 'react';
import { GiftCard } from '@/types';
import { BrandIcon } from '@/components/common/BrandIcon';
import { useVouchr } from '@/context/VouchrContext';
import { Sparkles, ShieldCheck, QrCode, RotateCw } from 'lucide-react';

interface GiftCardVisualProps {
  card: GiftCard;
  denomination?: number;
  recipientName?: string;
  senderName?: string;
  message?: string;
  skin?: 'classic' | 'warm-coral' | 'electric-neon' | 'midnight-velvet';
  size?: 'sm' | 'md' | 'lg';
  isInteractive?: boolean;
  code?: string;
  isRedeemed?: boolean;
}

export const GiftCardVisual: React.FC<GiftCardVisualProps> = ({
  card,
  denomination,
  recipientName,
  senderName,
  message,
  skin = 'classic',
  size = 'md',
  isInteractive = false,
  code,
  isRedeemed = false,
}) => {
  const { format } = useVouchr();
  const [isFlipped, setIsFlipped] = useState(false);

  const displayAmount = denomination !== undefined ? format(denomination) : format(card.denominations[0]);

  // Skin styles
  const skinStyles = {
    classic: {
      bg: card.cardTheme.bgGradient || 'from-zinc-950 via-zinc-900 to-black',
      accent: card.cardTheme.accentColor || '#7C3AED',
      border: 'border-white/10',
      glow: 'shadow-purple-950/40',
      tagBg: 'bg-white/15 text-white',
    },
    'warm-coral': {
      bg: 'from-orange-950 via-rose-950 to-zinc-950',
      accent: '#FF5722',
      border: 'border-orange-500/20',
      glow: 'shadow-orange-950/40',
      tagBg: 'bg-orange-500/20 text-orange-200',
    },
    'electric-neon': {
      bg: 'from-violet-950 via-purple-900 to-indigo-950',
      accent: '#8B5CF6',
      border: 'border-purple-400/30',
      glow: 'shadow-violet-900/50',
      tagBg: 'bg-purple-500/25 text-purple-200',
    },
    'midnight-velvet': {
      bg: 'from-slate-950 via-zinc-900 to-black',
      accent: '#10B981',
      border: 'border-white/15',
      glow: 'shadow-black/60',
      tagBg: 'bg-emerald-500/20 text-emerald-200',
    },
  }[skin];

  const sizeClasses = {
    sm: 'w-full max-w-[280px] h-[175px] p-4 text-xs rounded-2xl',
    md: 'w-full max-w-[380px] h-[235px] p-5 text-sm rounded-3xl',
    lg: 'w-full max-w-[460px] h-[285px] p-7 text-base rounded-3xl',
  }[size];

  return (
    <div className="relative group perspective-1000 select-none">
      {/* Outer ambient glow */}
      <div
        className={`absolute -inset-1 rounded-3xl bg-gradient-to-r from-purple-600/30 to-orange-500/30 blur-xl opacity-60 transition duration-500 group-hover:opacity-90 group-hover:blur-2xl`}
      />

      {/* Main Card Container with 3D Flip capability */}
      <div
        className={`relative ${sizeClasses} transition-all duration-500 [transform-style:preserve-3d] ${
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        } shadow-2xl ${skinStyles.glow} border ${skinStyles.border} overflow-hidden cursor-pointer`}
        onClick={() => isInteractive && setIsFlipped(!isFlipped)}
      >
        {/* FRONT SIDE */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${skinStyles.bg} p-5 sm:p-6 flex flex-col justify-between [backface-visibility:hidden] text-white`}
        >
          {/* Subtle noise / holographic sheen highlight */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.18),transparent_70%)] pointer-events-none" />
          <div className="absolute top-0 right-0 w-44 h-44 bg-white/5 rounded-full blur-2xl pointer-events-none" />

          {/* Top Bar: Brand Logo & Denomination */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md p-1.5 flex items-center justify-center border border-white/20 shadow-inner">
                <BrandIcon brandId={card.id} size={28} className="w-7 h-7" />
              </div>
              <div>
                <span className="font-extrabold text-base sm:text-lg tracking-tight block text-white leading-tight">
                  {card.brand}
                </span>
                <span className="text-[11px] text-white/60 font-medium tracking-wide uppercase">
                  Digital Voucher
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-sm">
                {displayAmount}
              </div>
              <div className="flex items-center justify-end gap-1 text-[10px] text-emerald-400 font-semibold tracking-wider uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Verified
              </div>
            </div>
          </div>

          {/* Center decorative element: Microchip & Hologram */}
          <div className="relative z-10 my-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Golden metallic smartchip */}
              <div className="w-9 h-7 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-1 border border-amber-300 shadow-sm opacity-90">
                <div className="w-full h-full border border-amber-800/40 rounded-sm grid grid-cols-2 gap-0.5 opacity-60">
                  <div className="border-r border-b border-amber-900/40" />
                  <div className="border-b border-amber-900/40" />
                  <div className="border-r border-amber-900/40" />
                  <div />
                </div>
              </div>
              {/* Contactless symbol */}
              <svg className="w-4 h-4 text-white/40 rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 8a6 6 0 0 1 0 8" />
                <path d="M12 5a10 10 0 0 1 0 14" />
                <path d="M16 2a14 14 0 0 1 0 20" />
              </svg>
            </div>

            {/* Custom message teaser if present */}
            {message && (
              <div className="max-w-[200px] truncate text-xs text-white/80 italic font-normal bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
                &ldquo;{message}&rdquo;
              </div>
            )}
          </div>

          {/* Bottom Bar: Recipient info & Brand Mark */}
          <div className="relative z-10 flex items-end justify-between pt-2 border-t border-white/10">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-white/50">
                {recipientName ? 'Recipient' : 'Cardholder'}
              </div>
              <div className="text-sm font-bold text-white tracking-wide truncate max-w-[190px]">
                {recipientName || 'Gift Recipient'}
              </div>
              {senderName && (
                <div className="text-[10px] text-white/60">
                  From: <span className="font-semibold text-white/80">{senderName}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5 opacity-80">
              <span className="text-[10px] font-mono tracking-widest text-white/70">
                VOUCHR-{card.id.slice(0, 3).toUpperCase()}
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </div>
          </div>

          {/* Red ribbon for redeemed status */}
          {isRedeemed && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-20">
              <div className="px-4 py-1.5 bg-red-600 text-white font-extrabold text-sm uppercase tracking-widest rounded-lg shadow-lg border border-red-400 rotate-[-12deg]">
                Claimed & Redeemed
              </div>
            </div>
          )}
        </div>

        {/* BACK SIDE (Revealed on flip) */}
        <div
          className={`absolute inset-0 bg-zinc-950 p-5 sm:p-6 flex flex-col justify-between [transform:rotateY(180deg)] [backface-visibility:hidden] text-white border border-white/20`}
        >
          {/* Black magnetic stripe */}
          <div className="w-full h-8 bg-zinc-900 border-y border-zinc-800 -mx-6 px-6 flex items-center text-[10px] font-mono text-zinc-500">
            AUTHORIZED DIGITAL SIGNATURE ONLY • NON TRANSFERABLE
          </div>

          {/* Code Bar & CVV */}
          <div className="space-y-2">
            <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
              Digital Voucher Claim Code
            </div>
            <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 font-mono text-sm tracking-widest text-emerald-400 flex items-center justify-between">
              <span>{code || '••••-••••-••••-••••'}</span>
              <QrCode className="w-5 h-5 text-zinc-400" />
            </div>
          </div>

          {/* Redemption Steps Summary */}
          <div className="text-[11px] text-zinc-400 leading-snug">
            <span className="text-white font-semibold block mb-0.5">How to redeem:</span>
            {card.redemptionSteps[0]}
          </div>

          <div className="flex items-center justify-between text-[10px] text-zinc-500 border-t border-zinc-800 pt-2">
            <span>Powered by Vouchr Direct API</span>
            <div className="flex items-center gap-1 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Guaranteed
            </div>
          </div>
        </div>
      </div>

      {/* Interactive flip hint */}
      {isInteractive && (
        <button
          type="button"
          onClick={() => setIsFlipped(!isFlipped)}
          className="mt-3 mx-auto flex items-center gap-1.5 text-xs text-zinc-400 hover:text-purple-600 transition font-medium"
        >
          <RotateCw className="w-3.5 h-3.5" />
          {isFlipped ? 'Flip to front view' : 'Tap card to flip & inspect back'}
        </button>
      )}
    </div>
  );
};
