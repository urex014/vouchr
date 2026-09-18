'use client';

import React from 'react';

interface BrandIconProps {
  brandId: string;
  className?: string;
  size?: number;
}

export const BrandIcon: React.FC<BrandIconProps> = ({ brandId, className = 'w-8 h-8', size = 32 }) => {
  switch (brandId.toLowerCase()) {
    case 'spotify':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10" fill="#1DB954" />
          <path
            d="M17.5 15.5c-.2 0-.4-.1-.5-.2-2.3-1.4-5.2-1.7-8.6-.9-.4.1-.7-.1-.8-.5-.1-.4.1-.7.5-.8 3.8-.9 7-.5 9.6 1.1.3.2.4.6.2.9-.1.3-.2.4-.4.4zm1.1-2.4c-.2 0-.5-.1-.6-.2-2.8-1.7-7-2.2-10.3-1.2-.4.1-.9-.1-1-.6-.1-.4.1-.9.6-1 3.8-1.1 8.5-.6 11.7 1.4.4.2.5.7.3 1.1-.2.3-.4.5-.7.5zm.1-2.5c-.3 0-.5-.1-.7-.2-3.3-2-8.8-2.2-12-1.2-.5.2-1.1-.1-1.2-.7-.2-.5.1-1.1.7-1.2 3.8-1.2 9.9-.9 13.7 1.4.5.3.6.9.3 1.4-.2.3-.5.5-.8.5z"
            fill="#000000"
          />
        </svg>
      );
    case 'apple':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.77 1.06-1.85.94-2.92-.91.04-2.02.61-2.67 1.38-.58.67-1.09 1.76-.95 2.81 1.02.08 2.05-.51 2.68-1.27z" />
        </svg>
      );
    case 'playstation':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path
            fill="#00439C"
            d="M8.5 4.5l6.5 2.4v10.6l-6.5-2.4V4.5zm0 0"
          />
          <path
            fill="#0070D1"
            d="M6.2 16.5c-2.4-.7-3.7-2.1-3.7-3.8 0-2.3 2.4-3.8 5.8-3.8v2.4c-2 0-3.3.8-3.3 1.5 0 .8 1 1.4 2.7 1.8l-1.5 1.9zm8.6-1.3c2.4.7 3.7 2.1 3.7 3.8 0 2.3-2.4 3.8-5.8 3.8v-2.4c2 0 3.3-.8 3.3-1.5 0-.8-1-1.4-2.7-1.8l1.5-1.9z"
          />
        </svg>
      );
    case 'steam':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2a10 10 0 0 0-10 10c0 4.8 3.4 8.8 8 9.8l2.5-3.6a3.5 3.5 0 0 1-.5-1.7l-4.1-1.7a2.5 2.5 0 1 1 1.2-2.3c0 .2 0 .4-.1.6l4 1.7a3.5 3.5 0 0 1 5-2.8 3.5 3.5 0 1 1-3.5 3.5c0-.4.1-.8.2-1.1L12.5 16A10 10 0 0 0 12 2zm0 3a7 7 0 1 1 0 14 7 7 0 0 1 0-14z" />
        </svg>
      );
    case 'netflix':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M5.5 2h3.5v20H5.5V2zm9.5 0h3.5v20H15V2z" fill="#B81D24" />
          <path d="M5.5 2h3.5l6 20h-3.5L5.5 2z" fill="#E50914" />
        </svg>
      );
    case 'uber':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <rect width="24" height="24" rx="5" fill="#000000" />
          <path
            d="M7 8v5a4 4 0 0 0 8 0V8h-2.5v5a1.5 1.5 0 0 1-3 0V8H7zm9.5 0h2v8h-2V8z"
            fill="#FFFFFF"
          />
        </svg>
      );
    case 'amazon':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M14.5 11.2c-.1-.7-.4-1.2-1-1.6-.6-.4-1.3-.6-2.1-.6-.9 0-1.8.3-2.5.9-.6.5-.9 1.3-.9 2.1 0 .9.3 1.5.9 2 .6.4 1.4.7 2.2.7.9 0 1.7-.2 2.4-.7.7-.5 1-1.2 1-2.1v-.7zm2.5-3.3v7.6c0 1.2.3 2.1.8 2.7.6.6 1.4.9 2.5.9.4 0 .8 0 1.2-.1v2.1c-.6.2-1.3.3-2.1.3-1.6 0-2.8-.5-3.7-1.4-.6-.6-.9-1.5-1-2.6-.7 1.1-1.5 1.9-2.5 2.5-1 .6-2.2.9-3.6.9-1.6 0-2.9-.5-4-1.4C3.6 18.5 3 17.2 3 15.6c0-1.7.7-3.1 2-4.1 1.4-1 3.2-1.5 5.5-1.5h3.6V9.4c0-1-.3-1.8-.8-2.3-.5-.6-1.3-.8-2.4-.8-1 0-1.8.2-2.4.6-.6.4-.9 1-1 1.7H5.2c.2-1.4.8-2.4 2-3.2 1.1-.8 2.6-1.2 4.4-1.2 2 0 3.5.5 4.6 1.6 1.1 1.1 1.6 2.6 1.6 4.6v-2.8z" fill="#FF9900" />
          <path d="M4 20.5c5.5 2.5 12 1.5 16-1.5.3-.2.6.2.3.5-3.8 3.5-10.5 4.2-16.7 1.4-.4-.2-.1-.7.4-.4z" fill="#FF9900" />
        </svg>
      );
    case 'airbnb':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M12 2C9.5 2 7.7 3.5 6.9 5.8c-.8 2.3-.4 5.2.9 8.2 1.3 2.9 3.2 5.5 4.2 7 .3.4.9.4 1.2 0 1-1.5 2.9-4.1 4.2-7 1.3-3 1.7-5.9.9-8.2C17.5 3.5 14.5 2 12 2zm0 15.2c-1.8 0-3.2-1.4-3.2-3.2 0-1.8 1.4-3.2 3.2-3.2s3.2 1.4 3.2 3.2c0 1.8-1.4 3.2-3.2 3.2z"
            fill="#FF385C"
          />
        </svg>
      );
    case 'jumia':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10" fill="#F68B1E" />
          <path
            d="M12 6.5l1.6 3.5 3.9.5-2.8 2.8.7 3.9L12 15.3l-3.4 1.9.7-3.9-2.8-2.8 3.9-.5L12 6.5z"
            fill="#FFFFFF"
          />
        </svg>
      );
    case 'bolt':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10" fill="#34D186" />
          <path
            d="M13 5L8 13h4l-1 6 6-9h-4l1-5z"
            fill="#FFFFFF"
          />
        </svg>
      );
    case 'nike':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M21.7 6.4c-6.8 5.6-11.7 9.8-15.1 11.2-1.9.8-3.4.6-4.2-.3-.8-.9-.6-2.3.6-3.8 2-2.5 5.5-5.5 10.4-8.8-3.8 1.3-7.2 3.1-9.7 5.2-1.7 1.4-2.8 2.9-2.6 4.3.2 1.7 1.8 2.7 4.2 2 4.4-1.3 9.8-5.3 16.4-9.8z"
            fill="currentColor"
          />
        </svg>
      );
    case 'xbox':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10" fill="#107C10" />
          <path
            d="M6.2 6.3c1.4-1.3 3.4-1.8 5.8-1.8 2.4 0 4.4.5 5.8 1.8-1.5 2-4 4.8-5.8 7-1.8-2.2-4.3-5-5.8-7zm-1.7 3c-.5 1.5-.5 3.2 0 4.8 1.2 2.7 3.5 5.4 6.5 7.5-2.2-2.8-4.8-7.5-6.5-12.3zm15 0c-1.7 4.8-4.3 9.5-6.5 12.3 3-2.1 5.3-4.8 6.5-7.5.5-1.6.5-3.3 0-4.8z"
            fill="#FFFFFF"
          />
        </svg>
      );
    case 'starbucks':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10" fill="#00704A" />
          <circle cx="12" cy="12" r="7.5" fill="none" stroke="#FFFFFF" strokeWidth="1.2" />
          <path
            d="M12 7l1.2 2.6 2.8.4-2 2 .5 2.8-2.5-1.4-2.5 1.4.5-2.8-2-2 2.8-.4L12 7z"
            fill="#FFFFFF"
          />
        </svg>
      );
    case 'roblox':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M5.4 3.2L3.2 18.6l15.4 2.2 2.2-15.4L5.4 3.2zm8.4 10.3l-3.3-.5.5-3.3 3.3.5-.5 3.3z"
            fill="currentColor"
          />
        </svg>
      );
    case 'sephora':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M12 2C8 6 6 10 7 14c.7 2.8 3 5 5 7 2-2 4.3-4.2 5-7 1-4-1-8-5-12z"
            fill="currentColor"
          />
        </svg>
      );
    case 'doordash':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M21.5 9.2c-.8-1.5-2.2-2.2-4.1-2.2H5.2c-.6 0-1.2.4-1.2 1s.6 1 1.2 1h12.2c.9 0 1.5.3 1.8.8.4.6.3 1.3-.1 2-1.2 1.8-3.7 2.2-5.7 2.2H6.2c-.6 0-1.2.4-1.2 1s.6 1 1.2 1h7.2c2.8 0 6.3-.7 8.1-3.5 1-1.4 1-2.4 0-3.3z"
            fill="#FF3008"
          />
        </svg>
      );
    case 'audible':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M12 3a9 9 0 0 0-9 9c0 3.3 1.8 6.2 4.5 7.7.4.2.8.1.9-.3.2-.4.1-.8-.3-.9C5.8 17.2 4.2 14.8 4.2 12a7.8 7.8 0 1 1 15.6 0c0 2.8-1.6 5.2-3.9 6.5-.4.2-.5.6-.3.9.1.4.5.5.9.3 2.7-1.5 4.5-4.4 4.5-7.7a9 9 0 0 0-9-9zm0 4a5 5 0 0 0-5 5c0 1.9 1 3.5 2.6 4.3.4.2.7.1.9-.2.2-.4.1-.7-.2-.9-1.2-.6-2.1-1.9-2.1-3.2a3.8 3.8 0 1 1 7.6 0c0 1.3-.9 2.6-2.1 3.2-.3.2-.4.5-.2.9.2.3.5.4.9.2A4.9 4.9 0 0 0 17 12a5 5 0 0 0-5-5zm0 3a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"
            fill="#F8991C"
          />
        </svg>
      );
    case 'googleplay':
      return (
        <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
          <path d="M4.5 3.5v17L14 12 4.5 3.5z" fill="#00A0FF" />
          <path d="M4.5 20.5l9.5-8.5 3 3-9.5 6.5c-1.3.8-3 .1-3-1z" fill="#FF3A44" />
          <path d="M17 9.5L14 12l3 3 2.5-1.5c1-.6 1-1.4 0-2L17 9.5z" fill="#FFC800" />
          <path d="M4.5 3.5c0-1.1 1.7-1.8 3-1l9.5 6.5-3 3-9.5-8.5z" fill="#00E676" />
        </svg>
      );
    default:
      return (
        <div className={`rounded-xl bg-violet-600 flex items-center justify-center font-bold text-white shadow-sm ${className}`}>
          {brandId.slice(0, 2).toUpperCase()}
        </div>
      );
  }
};
