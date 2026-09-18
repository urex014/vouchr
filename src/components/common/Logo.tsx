'use client';

import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'symbol' | 'white';
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
}) => {
  const symbolSizes = {
    sm: 26,
    md: 34,
    lg: 44,
  };

  const textSizes = {
    sm: 'text-xl tracking-tight',
    md: 'text-2xl tracking-tighter',
    lg: 'text-3xl tracking-tighter',
  };

  const s = symbolSizes[size];

  // Modern geometric voucher fold forming a dynamic 'V' with a digital delivery notch
  const SymbolSvg = (
    <svg
      width={s}
      height={s}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-200 group-hover:scale-105"
    >
      <defs>
        <linearGradient id="vouchr-grad-purple" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#5B21B6" />
        </linearGradient>
        <linearGradient id="vouchr-grad-coral" x1="16" y1="12" x2="38" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF7A59" />
          <stop offset="100%" stopColor="#FF5722" />
        </linearGradient>
      </defs>

      {/* Main voucher card base with digital notch */}
      <path
        d="M6 8C6 5.79086 7.79086 4 10 4H26C28.2091 4 30 5.79086 30 8V16C28.3431 16 27 17.3431 27 19C27 20.6569 28.3431 22 30 22V32C30 34.2091 28.2091 36 26 36H10C7.79086 36 6 34.2091 6 32V8Z"
        fill="url(#vouchr-grad-purple)"
      />

      {/* Folded gift lightning ribbon forming the dynamic V */}
      <path
        d="M12 11L18.5 24.5L25 11H29.5L20.8 28.2C20.1 29.5 18.2 29.8 17.1 28.7L11.5 23L12 11Z"
        fill="#FFFFFF"
        opacity="0.95"
      />

      {/* Warm coral celebration spark / ticket tab */}
      <circle cx="28" cy="19" r="2.5" fill="#FAF9F6" />
      <path
        d="M26 6L33.5 13.5H27C26.4477 13.5 26 13.0523 26 12.5V6Z"
        fill="url(#vouchr-grad-coral)"
      />
    </svg>
  );

  if (variant === 'symbol') {
    return (
      <Link href="/" className={`inline-flex items-center group ${className}`}>
        {SymbolSvg}
      </Link>
    );
  }

  const isWhite = variant === 'white';

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 font-black group select-none ${className}`}
      aria-label="Vouchr Homepage"
    >
      {SymbolSvg}
      <span className={`font-extrabold ${textSizes[size]} ${isWhite ? 'text-white' : 'text-zinc-950'}`}>
        vouchr
        <span className="text-[#FF5722] font-black">.</span>
      </span>
    </Link>
  );
};
