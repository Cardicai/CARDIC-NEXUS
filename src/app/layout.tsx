import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import './globals.css';

import NavBar from '@/components/NavBar';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.cardicnex.us'),
  title: {
    default: 'CARDIC NEXUS — AI • Trading',
    template: '%s | CARDIC NEXUS',
  },
  description:
    'AI • Trading • Innovation for retail traders. Precision indicators, EAs, and premium signals.',
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'CARDIC NEXUS',
    title: 'CARDIC NEXUS — AI • Trading',
    description:
      'AI • Trading • Innovation for retail traders. Precision indicators, EAs, and premium signals.',
    images: [
      {
        url: '/images/og.jpg',
        width: 1200,
        height: 630,
        alt: 'CARDIC NEXUS gold/blue logo',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CARDIC NEXUS — AI • Trading',
    description:
      'AI • Trading • Innovation for retail traders. Precision indicators, EAs, and premium signals.',
    images: ['/images/og.jpg'],
    site: '@CARDICNEXUS',
    creator: '@CARDICNEXUS',
  },
  alternates: {
    canonical: 'https://www.cardicnex.us',
  },
  icons: {
    icon: '/favicon/favicon.png',
    shortcut: '/favicon/favicon.png',
    apple: '/favicon/favicon.png',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en'>
      <body
        style={{
          margin: 0,
          background: 'linear-gradient(180deg,#0a0b0d,#0e0f12)',
          color: '#fff',
        }}
      >
        <NavBar />
        <main style={{ minHeight: '100vh' }}>{children}</main>
      </body>
    </html>
  );
}
