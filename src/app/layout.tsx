import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { VouchrProvider } from '@/context/VouchrContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Vouchr — Give them something they actually want.',
  description: 'The easiest and most enjoyable place to buy and send digital gift cards online. Delivered in 60 seconds. Zero markups, 100+ global brands.',
  keywords: ['gift cards', 'digital vouchers', 'send gift cards', 'instant gifts', 'vouchr', 'ecommerce'],
  openGraph: {
    title: 'Vouchr — Buy & Send Digital Gift Cards',
    description: 'Pick a card. Write your note. Delivered digitally in 60 seconds.',
    url: 'https://vouchr.com',
    siteName: 'Vouchr',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#FAF9F6] text-zinc-900">
        <VouchrProvider>{children}</VouchrProvider>
      </body>
    </html>
  );
}
