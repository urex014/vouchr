const fs = require('fs');
const path = require('path');

const giftCardsDir = path.join(process.cwd(), 'public', 'giftcards');
const brandsDir = path.join(process.cwd(), 'public', 'brands');

if (!fs.existsSync(giftCardsDir)) fs.mkdirSync(giftCardsDir, { recursive: true });
if (!fs.existsSync(brandsDir)) fs.mkdirSync(brandsDir, { recursive: true });

const cards = {
  'amazon-us': {
    brand: 'Amazon',
    card: `<svg width="400" height="250" viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="250" rx="16" fill="#131921"/>
      <rect x="1" y="1" width="398" height="248" rx="15" stroke="rgba(255,255,255,0.08)" stroke-width="2"/>
      <g transform="translate(60, 80)">
        <path d="M72 15c-1.2-8.5-6-13-14-13-10 0-16 6-16 15 0 9 6 15 16 15 4 0 8-1 11-4v14c-4 2-9 3-15 3-17 0-29-11-29-28 0-18 12-28 29-28 17 0 28 10 28 26v41h-10V45z" fill="#FFFFFF"/>
        <path d="M96 15h11v43H96V15zm0-18h11v11H96V-3z" fill="#FFFFFF"/>
        <path d="M124 15h11v7c3-5 8-8 15-8 12 0 19 8 19 22v22h-11V37c0-8-4-12-11-12s-13 4-13 12v21h-11V15z" fill="#FFFFFF"/>
        <path d="M213 36c0 14-10 23-24 23s-24-9-24-23 10-23 24-23 24 9 24 23zm-11 0c0-9-5-14-13-14s-13 5-13 14 5 14 13 14 13-5 13-14z" fill="#FFFFFF"/>
        <path d="M233 15h11v7c3-5 8-8 15-8 12 0 19 8 19 22v22h-11V37c0-8-4-12-11-12s-13 4-13 12v21h-11V15z" fill="#FFFFFF"/>
        <!-- Amazon Smile -->
        <path d="M20 62c60 28 180 28 240-5 3-1.5 5 1.5 2 3.5-65 37-185 37-244-1.5-2.5-1.5-.5-4 2-2z" fill="#FF9900"/>
        <path d="M256 50c3 3.5 9 10 13 13.5 1 .8.5 2-1 2-5 .2-15-1.5-20-3.5-1.5-.6-1.5-2 0-2.2 4-.8 6.5-4 8-9.8z" fill="#FF9900"/>
      </g>
      <text x="360" y="42" text-anchor="end" fill="#999" font-family="-apple-system, sans-serif" font-size="12" font-weight="700" letter-spacing="1">GIFT CARD</text>
      <text x="360" y="222" text-anchor="end" fill="#FF9900" font-family="-apple-system, sans-serif" font-size="14" font-weight="800">US REGION</text>
      <circle cx="44" cy="40" r="14" fill="#232F3E"/>
      <text x="44" y="45" text-anchor="middle" fill="#FF9900" font-family="-apple-system, sans-serif" font-size="13" font-weight="900">$</text>
    </svg>`,
    logo: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="10" fill="#131921"/>
      <path d="M12 28c12 6 30 6 36-1 .5-.3.8.3.3.7-10 6-30 6-37 0-.4-.3-.1-.7.4-.4z" fill="#FF9900"/>
      <path d="M37 25c1 1 2 2.5 3 3.5.2.2.1.5-.2.5-1 0-3-.3-4-.7-.3-.1-.3-.4 0-.5.8-.2 1.3-.9 1.6-2.3z" fill="#FF9900"/>
      <text x="24" y="20" text-anchor="middle" fill="#FFF" font-family="-apple-system, sans-serif" font-size="11" font-weight="800">amazon</text>
    </svg>`
  },
  'apple-us': {
    brand: 'Apple',
    card: `<svg width="400" height="250" viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="250" rx="16" fill="#FBFBFD"/>
      <rect x="1" y="1" width="398" height="248" rx="15" stroke="#E5E5EA" stroke-width="2"/>
      <defs>
        <linearGradient id="appleGrad" x1="160" y1="50" x2="240" y2="170" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0071E3"/>
          <stop offset="35%" stopColor="#862299"/>
          <stop offset="70%" stopColor="#E03C31"/>
          <stop offset="100%" stopColor="#F98200"/>
        </linearGradient>
      </defs>
      <g transform="translate(160, 45) scale(1.6)">
        <path d="M37.5 39c-1.7 2.5-3.4 4.9-6.1 4.9-2.7 0-3.5-1.6-6.6-1.6-3.1 0-4 .1.5-6.5 1.6-2.6 0-4.6-2.6-6.3-5.1C8.5 34 5.9 24.9 9.4 18.8c1.7-3 4.9-5 8.2-5 2.6 0 5 1.7 6.6 1.7 1.6 0 4.5-2.1 7.6-1.8 1.3.1 4.9.5 7.3 4-6.2 3.6-5.2 12.8 1.9 16.3-1.4 3.4-3.5 7.7-6 11.2M32 12.7c1.3-1.5 2.1-3.7 1.9-5.8-1.8.1-4 1.2-5.3 2.8-1.2 1.3-2.2 3.5-1.9 5.6 2 .2 4.1-1.1 5.3-2.6z" fill="url(#appleGrad)"/>
      </g>
      <text x="200" y="180" text-anchor="middle" fill="#1D1D1F" font-family="-apple-system, sans-serif" font-size="14" font-weight="700" letter-spacing="0.5">Apple Gift Card</text>
      <text x="200" y="200" text-anchor="middle" fill="#86868B" font-family="-apple-system, sans-serif" font-size="11" font-weight="500">For everything Apple</text>
      <text x="360" y="38" text-anchor="end" fill="#86868B" font-family="-apple-system, sans-serif" font-size="12" font-weight="700">USA</text>
    </svg>`,
    logo: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="10" fill="#000"/>
      <path d="M28.7 27.5c-.8 1.2-1.7 2.4-3 2.5-1.3 0-1.8-.8-3.3-.8-1.5 0-2 .8-3.3.8-1.3 0-2.3-1.3-3.1-2.5-1.7-2.5-3-7-1.3-10.1.9-1.5 2.4-2.5 4.1-2.5 1.3 0 2.5.9 3.3.9.8 0 2.3-1.1 3.8-.9.7 0 2.5.3 3.6 2-2.2 1.3-1.8 4.7.7 5.7-.7 1.7-1.8 3.8-2.8 4.9M26 14.4c.6-.8 1.1-1.9.9-2.9-.9 0-2 .6-2.7 1.4-.6.7-1.1 1.8-.9 2.8 1 .1 2.1-.5 2.7-1.3z" fill="#FFF"/>
    </svg>`
  },
  'spotify-global': {
    brand: 'Spotify',
    card: `<svg width="400" height="250" viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="250" rx="16" fill="#121212"/>
      <rect x="1" y="1" width="398" height="248" rx="15" stroke="rgba(255,255,255,0.08)" stroke-width="2"/>
      <circle cx="200" cy="110" r="48" fill="#1DB954"/>
      <path d="M222 123.5c-.7 0-1.4-.4-1.8-.9-7.5-4.6-17-5.5-28.1-3-1.3.3-2.6-.5-2.9-1.8-.3-1.3.5-2.6 1.8-2.9 12.5-2.8 23.2-1.8 31.8 3.5 1.1.7 1.5 2.2.8 3.3-.4.6-1 .8-1.6.8zm3.6-7.8c-.8 0-1.7-.5-2.1-1.2-9-5.5-22.7-7.1-33.4-3.9-1.5.4-3.1-.4-3.5-1.9-.4-1.5.4-3.1 1.9-3.5 12.3-3.7 27.5-1.9 37.9 4.5 1.3.8 1.7 2.5.9 3.8-.5.8-1.3 1.2-2.1 1.2zm.4-8.2c-1 0-1.9-.6-2.3-1.5-10.7-6.5-28.5-7.1-38.9-3.9-1.8.5-3.7-.5-4.2-2.3-.5-1.8.5-3.7 2.3-4.2 12.3-3.7 32-3 44.4 4.5 1.6 1 2.1 3 1.1 4.6-.6 1.1-1.6 1.7-2.6 1.7z" fill="#000000"/>
      <text x="200" y="195" text-anchor="middle" fill="#FFFFFF" font-family="-apple-system, sans-serif" font-size="20" font-weight="900" letter-spacing="-0.5">Spotify Premium</text>
      <text x="360" y="38" text-anchor="end" fill="#1DB954" font-family="-apple-system, sans-serif" font-size="11" font-weight="800">GLOBAL</text>
      <text x="40" y="38" text-anchor="start" fill="#999" font-family="-apple-system, sans-serif" font-size="11" font-weight="700">DIGITAL PASS</text>
    </svg>`,
    logo: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="10" fill="#121212"/>
      <circle cx="24" cy="24" r="14" fill="#1DB954"/>
      <path d="M30 28c-4-2.5-9-3-15-1.5-.7.2-1.3-.2-1.5-.8s.2-1.3.8-1.5c7-1.5 13-1 18 2 .6.4.8 1.2.4 1.8-.3.3-.7.5-1 .5zm2-4c-5-3-12-3.8-18-2-.8.2-1.6-.2-1.8-1s.2-1.6 1-1.8c7-2 15-1 21 2.5.7.4.9 1.4.5 2.1-.3.4-.8.6-1.2.6zm.2-4.5c-6-3.6-16-4-22-2-1 .3-2-.3-2.3-1.3-.3-1 .3-2 1.3-2.3 7-2 18-1.6 25 2.5.9.5 1.2 1.7.7 2.6-.4.6-1 .8-1.6.8z" fill="#000"/>
    </svg>`
  },
  'playstation-us': {
    brand: 'PlayStation',
    card: `<svg width="400" height="250" viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="250" rx="16" fill="#003791"/>
      <rect x="1" y="1" width="398" height="248" rx="15" stroke="rgba(255,255,255,0.12)" stroke-width="2"/>
      <g opacity="0.15" transform="translate(20, 20)">
        <polygon points="40,20 55,50 25,50" stroke="#FFF" stroke-width="3" fill="none"/>
        <circle cx="110" cy="35" r="15" stroke="#FFF" stroke-width="3" fill="none"/>
        <line x1="165" y1="20" x2="195" y2="50" stroke="#FFF" stroke-width="3"/>
        <line x1="195" y1="20" x2="165" y2="50" stroke="#FFF" stroke-width="3"/>
        <rect x="235" y="20" width="30" height="30" stroke="#FFF" stroke-width="3" fill="none"/>
      </g>
      <g transform="translate(170, 75) scale(1.4)">
        <path fill="#FFFFFF" d="M16 2.5l14 5.2v23.2l-14-5.2V2.5z"/>
        <path fill="#0070D1" d="M11 29c-5.2-1.5-8-4.6-8-8.3 0-5 5.2-8.3 12.6-8.3v5.2c-4.4 0-7.2 1.7-7.2 3.3 0 1.7 2.2 3 5.9 3.9l-3.3 4.2zm18.8-2.8c5.2 1.5 8 4.6 8 8.3 0 5-5.2 8.3-12.6 8.3v-5.2c4.4 0 7.2-1.7 7.2-3.3 0-1.7-2.2-3-5.9-3.9l3.3-4.2z"/>
      </g>
      <text x="200" y="175" text-anchor="middle" fill="#FFFFFF" font-family="-apple-system, sans-serif" font-size="18" font-weight="900" letter-spacing="1">PlayStation Store</text>
      <text x="360" y="222" text-anchor="end" fill="#00A2FF" font-family="-apple-system, sans-serif" font-size="12" font-weight="800">UNITED STATES</text>
      <text x="40" y="222" text-anchor="start" fill="#FFF" opacity="0.7" font-family="-apple-system, sans-serif" font-size="11" font-weight="600">WALLET TOP-UP</text>
    </svg>`,
    logo: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="10" fill="#003791"/>
      <path fill="#FFF" d="M21 11l9 3.3v15l-9-3.3V11z"/>
      <path fill="#00A2FF" d="M17.5 28.5c-3.5-1-5.5-3-5.5-5.5 0-3.3 3.5-5.5 8.5-5.5v3.5c-3 0-5 1.1-5 2.2 0 1.1 1.5 2 4 2.6l-2 2.7zm12.5-1.9c3.5 1 5.5 3 5.5 5.5 0 3.3-3.5 5.5-8.5 5.5v-3.5c3 0 5-1.1 5-2.2 0-1.1-1.5-2-4-2.6l2-2.7z"/>
    </svg>`
  },
  'steam-global': {
    brand: 'Steam',
    card: `<svg width="400" height="250" viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="steamGrad" x1="0" y1="0" x2="400" y2="250" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1B2838"/>
          <stop offset="100%" stopColor="#171A21"/>
        </linearGradient>
      </defs>
      <rect width="400" height="250" rx="16" fill="url(#steamGrad)"/>
      <rect x="1" y="1" width="398" height="248" rx="15" stroke="rgba(255,255,255,0.08)" stroke-width="2"/>
      <circle cx="200" cy="100" r="46" fill="#171A21" stroke="#66C0F4" stroke-width="2" opacity="0.3"/>
      <g transform="translate(165, 65) scale(1.5)" fill="#66C0F4">
        <path d="M24 4A20 20 0 0 0 4 24c0 9.6 6.8 17.6 16 19.6l5-7.2a7 7 0 0 1-1-3.4l-8.2-3.4a5 5 0 1 1 2.4-4.6c0 .4-.1.8-.2 1.2l8 3.4a7 7 0 0 1 10-5.6 7 7 0 1 1-7 7c0-.8.2-1.6.4-2.2L25 32A20 20 0 0 0 24 4z"/>
      </g>
      <text x="200" y="180" text-anchor="middle" fill="#FFFFFF" font-family="-apple-system, sans-serif" font-size="22" font-weight="900" letter-spacing="4">STEAM</text>
      <text x="200" y="202" text-anchor="middle" fill="#66C0F4" font-family="-apple-system, sans-serif" font-size="11" font-weight="700">WALLET CARD • GLOBAL</text>
    </svg>`,
    logo: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="10" fill="#171A21"/>
      <circle cx="24" cy="24" r="14" fill="#66C0F4" opacity="0.2"/>
      <path d="M24 10a14 14 0 0 0-14 14c0 6.7 4.8 12.3 11.2 13.7l3.5-5a5 5 0 0 1-.7-2.4l-5.7-2.4a3.5 3.5 0 1 1 1.7-3.2l5.6 2.4a5 5 0 0 1 7-4 5 5 0 1 1-5 5l-2.6 3.7A14 14 0 0 0 24 10z" fill="#66C0F4"/>
    </svg>`
  },
  'netflix-us': {
    brand: 'Netflix',
    card: `<svg width="400" height="250" viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="250" rx="16" fill="#141414"/>
      <rect x="1" y="1" width="398" height="248" rx="15" stroke="rgba(229,9,20,0.3)" stroke-width="2"/>
      <rect x="0" y="244" width="400" height="6" fill="#E50914"/>
      <g transform="translate(170, 55) scale(1.6)">
        <path d="M7 2h8v50H7V2zm22 0h8v50h-8V2z" fill="#B81D24"/>
        <path d="M7 2h8l15 50h-8L7 2z" fill="#E50914"/>
      </g>
      <text x="200" y="185" text-anchor="middle" fill="#FFFFFF" font-family="-apple-system, sans-serif" font-size="16" font-weight="900" letter-spacing="1">NETFLIX</text>
      <text x="200" y="208" text-anchor="middle" fill="#888" font-family="-apple-system, sans-serif" font-size="11" font-weight="600">Prepaid Subscription Card • US</text>
      <text x="360" y="40" text-anchor="end" fill="#E50914" font-family="-apple-system, sans-serif" font-size="11" font-weight="800">STREAMING</text>
    </svg>`,
    logo: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="10" fill="#000"/>
      <path d="M17 10h4v28h-4V10zm10 0h4v28h-4V10z" fill="#B81D24"/>
      <path d="M17 10h4l10 28h-4L17 10z" fill="#E50914"/>
    </svg>`
  },
  'uber-us': {
    brand: 'Uber',
    card: `<svg width="400" height="250" viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="250" rx="16" fill="#000000"/>
      <rect x="1" y="1" width="398" height="248" rx="15" stroke="rgba(255,255,255,0.1)" stroke-width="2"/>
      <text x="50" y="125" fill="#FFFFFF" font-family="-apple-system, sans-serif" font-size="44" font-weight="900" letter-spacing="-1">Uber</text>
      <text x="50" y="155" fill="#AAAAAA" font-family="-apple-system, sans-serif" font-size="13" font-weight="500">Rides and Uber Eats in one card</text>
      <text x="360" y="45" text-anchor="end" fill="#06C167" font-family="-apple-system, sans-serif" font-size="12" font-weight="800">USA</text>
      <circle cx="340" cy="130" r="28" fill="#111" stroke="#333" stroke-width="2"/>
      <path d="M335 120l12 10-12 10" stroke="#06C167" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`,
    logo: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="10" fill="#000"/>
      <text x="24" y="29" text-anchor="middle" fill="#FFF" font-family="-apple-system, sans-serif" font-size="15" font-weight="900">Uber</text>
    </svg>`
  },
  'nike-us': {
    brand: 'Nike',
    card: `<svg width="400" height="250" viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="250" rx="16" fill="#111111"/>
      <rect x="1" y="1" width="398" height="248" rx="15" stroke="rgba(255,255,255,0.1)" stroke-width="2"/>
      <path d="M330 75C240 145 180 195 135 212c-25 10-44 7-55-4-10-11-8-29 7-48 26-32 72-70 135-112-50 16-94 39-126 66-22 18-36 37-34 55 3 22 23 35 55 25 57-17 127-68 213-119z" fill="#FFFFFF"/>
      <text x="50" y="55" fill="#FFF" font-family="-apple-system, sans-serif" font-size="16" font-weight="900" letter-spacing="1">NIKE GIFT CARD</text>
      <text x="360" y="220" text-anchor="end" fill="#999" font-family="-apple-system, sans-serif" font-size="12" font-weight="700">US STORES & ONLINE</text>
    </svg>`,
    logo: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="10" fill="#111"/>
      <path d="M39 16c-11 9-19 16-24 18-3 1-5 1-7-.5-1-1-1-3.6.9-6 3.2-4 9-8.8 17-14-6.3 2-11.8 5-15.8 8.4-2.8 2.3-4.5 4.7-4.2 7 .3 2.8 2.9 4.4 7 3.2 7.2-2.1 16-8.6 26.8-15z" fill="#FFF"/>
    </svg>`
  },
  'jumia-ng': {
    brand: 'Jumia',
    card: `<svg width="400" height="250" viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="250" rx="16" fill="#282828"/>
      <rect x="1" y="1" width="398" height="248" rx="15" stroke="rgba(246,139,30,0.3)" stroke-width="2"/>
      <circle cx="200" cy="105" r="44" fill="#F68B1E"/>
      <path d="M200 80l6 14 15 2-11 11 3 15-13-7-13 7 3-15-11-11 15-2 6-14z" fill="#FFFFFF"/>
      <text x="200" y="180" text-anchor="middle" fill="#FFFFFF" font-family="-apple-system, sans-serif" font-size="24" font-weight="900" letter-spacing="-0.5">JUMIA</text>
      <text x="200" y="205" text-anchor="middle" fill="#F68B1E" font-family="-apple-system, sans-serif" font-size="12" font-weight="800">SHOPPING VOUCHER • NIGERIA (NG)</text>
      <text x="40" y="45" fill="#888" font-family="-apple-system, sans-serif" font-size="12" font-weight="700">₦ NAIRA REDEEMABLE</text>
    </svg>`,
    logo: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="10" fill="#282828"/>
      <circle cx="24" cy="24" r="14" fill="#F68B1E"/>
      <path d="M24 16l2.3 5 5.7.7-4 4 1 5.6-5-2.7-5 2.7 1-5.6-4-4 5.7-.7 2.3-5z" fill="#FFF"/>
    </svg>`
  },
  'bolt-ng': {
    brand: 'Bolt',
    card: `<svg width="400" height="250" viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="250" rx="16" fill="#F4FAF7"/>
      <rect x="1" y="1" width="398" height="248" rx="15" stroke="#34D186" stroke-width="2"/>
      <circle cx="200" cy="100" r="42" fill="#34D186"/>
      <path d="M204 76l-14 22h11l-3 18 16-25h-11l3-15z" fill="#FFFFFF"/>
      <text x="200" y="175" text-anchor="middle" fill="#222" font-family="-apple-system, sans-serif" font-size="28" font-weight="900">Bolt</text>
      <text x="200" y="200" text-anchor="middle" fill="#34D186" font-family="-apple-system, sans-serif" font-size="12" font-weight="800">RIDES & FOOD VOUCHER • NIGERIA</text>
      <text x="360" y="42" text-anchor="end" fill="#222" font-family="-apple-system, sans-serif" font-size="11" font-weight="700">NG REGION</text>
    </svg>`,
    logo: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="10" fill="#34D186"/>
      <path d="M26 13l-10 16h8l-2 13 12-18h-8l2-11z" fill="#FFF"/>
    </svg>`
  },
  'airbnb-global': {
    brand: 'Airbnb',
    card: `<svg width="400" height="250" viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="250" rx="16" fill="#FFFFFF"/>
      <rect x="1" y="1" width="398" height="248" rx="15" stroke="#F7F7F7" stroke-width="2"/>
      <g transform="translate(175, 55) scale(2)">
        <path d="M12 2C9.5 2 7.7 3.5 6.9 5.8c-.8 2.3-.4 5.2.9 8.2 1.3 2.9 3.2 5.5 4.2 7 .3.4.9.4 1.2 0 1-1.5 2.9-4.1 4.2-7 1.3-3 1.7-5.9.9-8.2C17.5 3.5 14.5 2 12 2zm0 15.2c-1.8 0-3.2-1.4-3.2-3.2 0-1.8 1.4-3.2 3.2-3.2s3.2 1.4 3.2 3.2c0 1.8-1.4 3.2-3.2 3.2z" fill="#FF385C"/>
      </g>
      <text x="200" y="180" text-anchor="middle" fill="#222222" font-family="-apple-system, sans-serif" font-size="22" font-weight="900">airbnb</text>
      <text x="200" y="205" text-anchor="middle" fill="#717171" font-family="-apple-system, sans-serif" font-size="12" font-weight="600">Gift Card for stays & experiences worldwide</text>
      <text x="360" y="42" text-anchor="end" fill="#FF385C" font-family="-apple-system, sans-serif" font-size="11" font-weight="800">GLOBAL</text>
    </svg>`,
    logo: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="10" fill="#FFF" stroke="#EAEAEA"/>
      <path d="M24 10c-3.6 0-6.2 2.2-7.3 5.5-1.2 3.3-.6 7.4 1.3 11.7 1.8 4.2 4.6 7.9 6 10 .4.6 1.3.6 1.7 0 1.4-2.1 4.1-5.8 6-10 1.9-4.3 2.4-8.4 1.3-11.7C31.8 12.2 29.2 10 24 10zm0 21.7c-2.6 0-4.6-2-4.6-4.6s2-4.6 4.6-4.6 4.6 2 4.6 4.6-2 4.6-4.6 4.6z" fill="#FF385C"/>
    </svg>`
  },
  'xbox-us': {
    brand: 'Xbox',
    card: `<svg width="400" height="250" viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="250" rx="16" fill="#107C10"/>
      <rect x="1" y="1" width="398" height="248" rx="15" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
      <circle cx="200" cy="100" r="44" fill="#0E6B0E" stroke="#FFF" stroke-width="3"/>
      <path d="M185 85c3.5-3.3 8.5-4.5 15-4.5s11.5 1.2 15 4.5c-3.8 5-10 12-15 17.5-5-5.5-11.2-12.5-15-17.5zm-4.3 7.5c-1.3 3.8-1.3 8 0 12 3 6.8 8.8 13.5 16.3 18.8-5.5-7-12-18.8-16.3-30.8zm38.6 0c-4.3 12-10.8 23.8-16.3 30.8 7.5-5.3 13.3-12 16.3-18.8 1.3-4 1.3-8.2 0-12z" fill="#FFF"/>
      <text x="200" y="180" text-anchor="middle" fill="#FFFFFF" font-family="-apple-system, sans-serif" font-size="22" font-weight="900" letter-spacing="1">XBOX</text>
      <text x="200" y="204" text-anchor="middle" fill="#D4FFD4" font-family="-apple-system, sans-serif" font-size="12" font-weight="700">DIGITAL CODE • US STORE</text>
    </svg>`,
    logo: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="10" fill="#107C10"/>
      <circle cx="24" cy="24" r="14" fill="#0E6B0E" stroke="#FFF" stroke-width="1.5"/>
      <path d="M19 19c1.2-1.1 2.8-1.5 5-1.5s3.8.4 5 1.5c-1.3 1.7-3.3 4-5 5.8-1.7-1.8-3.7-4.1-5-5.8zm-1.4 2.5c-.4 1.3-.4 2.7 0 4 1 2.3 2.9 4.5 5.4 6.3-1.8-2.3-4-6.3-5.4-10.3zm12.8 0c-1.4 4-3.6 8-5.4 10.3 2.5-1.8 4.4-4 5.4-6.3.4-1.3.4-2.7 0-4z" fill="#FFF"/>
    </svg>`
  },
  'googleplay-us': {
    brand: 'Google Play',
    card: `<svg width="400" height="250" viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="250" rx="16" fill="#FFFFFF"/>
      <rect x="1" y="1" width="398" height="248" rx="15" stroke="#E0E0E0" stroke-width="2"/>
      <g transform="translate(170, 50) scale(3)">
        <path d="M3.5 2.5v15l8-7.5-8-7.5z" fill="#00A0FF"/>
        <path d="M3.5 17.5l7.5-7 2.5 2.5-7.5 5c-1 .6-2.5 0-2.5-.5z" fill="#FF3A44"/>
        <path d="M13.5 10.5l-2-2 2-2 2 1c.8.5.8 1.5 0 2l-2 1z" fill="#FFC800"/>
        <path d="M3.5 2.5c0-.5 1.5-1.1 2.5-.5l7.5 5-2.5 2.5-7.5-7z" fill="#00E676"/>
      </g>
      <text x="200" y="175" text-anchor="middle" fill="#3C4043" font-family="-apple-system, sans-serif" font-size="20" font-weight="800">Google Play</text>
      <text x="200" y="200" text-anchor="middle" fill="#70757A" font-family="-apple-system, sans-serif" font-size="12" font-weight="600">Gift code for apps, games, & subscriptions • US</text>
    </svg>`,
    logo: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="10" fill="#FFF" stroke="#E0E0E0"/>
      <g transform="translate(14, 12) scale(1.1)">
        <path d="M3.5 2.5v15l8-7.5-8-7.5z" fill="#00A0FF"/>
        <path d="M3.5 17.5l7.5-7 2.5 2.5-7.5 5c-1 .6-2.5 0-2.5-.5z" fill="#FF3A44"/>
        <path d="M13.5 10.5l-2-2 2-2 2 1c.8.5.8 1.5 0 2l-2 1z" fill="#FFC800"/>
        <path d="M3.5 2.5c0-.5 1.5-1.1 2.5-.5l7.5 5-2.5 2.5-7.5-7z" fill="#00E676"/>
      </g>
    </svg>`
  },
  'starbucks-us': {
    brand: 'Starbucks',
    card: `<svg width="400" height="250" viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="250" rx="16" fill="#006241"/>
      <rect x="1" y="1" width="398" height="248" rx="15" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
      <circle cx="200" cy="105" r="46" fill="#00704A" stroke="#FFFFFF" stroke-width="2"/>
      <circle cx="200" cy="105" r="38" fill="none" stroke="#FFFFFF" stroke-width="1.5"/>
      <path d="M200 90l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6z" fill="#FFFFFF"/>
      <text x="200" y="185" text-anchor="middle" fill="#FFFFFF" font-family="-apple-system, sans-serif" font-size="20" font-weight="900" letter-spacing="1">STARBUCKS</text>
      <text x="200" y="208" text-anchor="middle" fill="#B3D7CA" font-family="-apple-system, sans-serif" font-size="11" font-weight="600">Digital Coffee Card • United States</text>
    </svg>`,
    logo: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="10" fill="#006241"/>
      <circle cx="24" cy="24" r="14" fill="#00704A" stroke="#FFF" stroke-width="1"/>
      <path d="M24 18l1.5 3.5 4 .5-3 3 .7 4-3.2-1.7-3.2 1.7.7-4-3-3 4-.5L24 18z" fill="#FFF"/>
    </svg>`
  },
  'doordash-us': {
    brand: 'DoorDash',
    card: `<svg width="400" height="250" viewBox="0 0 400 250" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="400" height="250" rx="16" fill="#FFFFFF"/>
      <rect x="1" y="1" width="398" height="248" rx="15" stroke="#EAEAEA" stroke-width="2"/>
      <path d="M275 100c-2.5-4.5-6.5-6.5-12.5-6.5h-50c-2 0-3.5 1.5-3.5 3s1.5 3 3.5 3h37c2.5 0 4.5 1 5.5 2.5 1.2 1.8.8 4-.2 6-3.8 5.5-11.2 6.5-17.2 6.5h-28.6c-2 0-3.5 1.5-3.5 3s1.5 3 3.5 3h22c8.5 0 19-2 24.5-10.5 3-4.2 3-7.2 0-10z" fill="#FF3008" transform="translate(-10, 0) scale(1.3)"/>
      <text x="200" y="170" text-anchor="middle" fill="#191919" font-family="-apple-system, sans-serif" font-size="22" font-weight="900" letter-spacing="-0.5">DOORDASH</text>
      <text x="200" y="195" text-anchor="middle" fill="#767676" font-family="-apple-system, sans-serif" font-size="12" font-weight="600">Restaurant & Grocery Delivery • US</text>
    </svg>`,
    logo: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="10" fill="#FFF" stroke="#EAEAEA"/>
      <path d="M33 22c-.6-1-1.5-1.5-2.8-1.5h-11c-.5 0-.8.3-.8.7s.3.7.8.7h8.2c.6 0 1 .2 1.2.5.3.4.2.9 0 1.3-.8 1.2-2.5 1.5-3.8 1.5h-6.4c-.5 0-.8.3-.8.7s.3.7.8.7h5c1.9 0 4.2-.4 5.4-2.3.7-.9.7-1.6 0-2.3z" fill="#FF3008"/>
    </svg>`
  }
};

for (const [id, data] of Object.entries(cards)) {
  fs.writeFileSync(path.join(giftCardsDir, `${id}.svg`), data.card);
  const brandSlug = data.brand.toLowerCase().replace(/\s+/g, '-');
  fs.writeFileSync(path.join(brandsDir, `${brandSlug}.svg`), data.logo);
}

console.log(`Generated ${Object.keys(cards).length} authentic gift card artwork and brand assets.`);
