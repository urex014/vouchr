'use client';

import React, { useState } from 'react';
import { Gift, ImageOff } from 'lucide-react';

interface GiftCardImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: 'standard' | 'square' | 'wide';
  priority?: boolean;
}

/**
 * Robust Gift Card Image component that handles:
 * - Missing or broken image URLs
 * - Slow loading states with subtle shimmer skeleton
 * - Variable aspect ratios without stretching or distortion (object-fit: contain)
 * - Clean elevated breathing room
 */
export const GiftCardImage: React.FC<GiftCardImageProps> = ({
  src,
  alt,
  className = '',
  aspectRatio = 'standard',
  priority = false,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const ratioClass = {
    standard: 'pt-[62%]', // 1.61:1 golden card ratio
    square: 'pt-[100%]',
    wide: 'pt-[50%]',
  }[aspectRatio];

  return (
    <div
      className={`relative w-full ${ratioClass} bg-[#F4F3EE] rounded-2xl overflow-hidden select-none ${className}`}
    >
      {/* Loading Skeleton Shimmer */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-200/50 via-zinc-100 to-zinc-200/50 animate-pulse" />
      )}

      {/* Main Image Container */}
      {!hasError ? (
        <div className="absolute inset-3 sm:inset-4 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
          <img
            src={src}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
            className={`w-full h-full object-contain filter drop-shadow-md rounded-xl transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
          />
        </div>
      ) : (
        /* Fallback for broken or missing image URL */
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-zinc-400 bg-zinc-100">
          <Gift className="w-8 h-8 mb-1 text-zinc-300" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            Digital Gift Card
          </span>
        </div>
      )}
    </div>
  );
};
