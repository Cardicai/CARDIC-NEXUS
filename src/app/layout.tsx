import type { ReactNode } from 'react';
import { siteConfig } from '@/constant/config';
import Head from 'next/head';

import './globals.css';

import NavBar from '@/components/NavBar';

export const metadata = {
  metadataBase: new URL('https://www.cardicnex.us'),
  title: 'CARDIC NEXUS — AI • Trading',
  description:
    'AI • Trading • Innovation for retail traders. Precision indicators, EAs, and premium signals.',
  openGraph: {
    type: 'website',
    title: 'CARDIC NEXUS — AI • Trading',
    description:
      'AI • Trading • Innovation for retail traders. Precision indicators, EAs, and premium signals.',
    url: 'https://www.cardicnex.us',
    images: [
      {
        url: '/og-cardic.png',
        width: 1200,
        height: 630,
        alt: 'CARDIC NEXUS',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CARDIC NEXUS — AI • Trading',
    description:
      'AI • Trading • Innovation for retail traders. Precision indicators, EAs, and premium signals.',
    images: ['/og-cardic.png'],
    creator: '@CARDICNEXUS',
  },
  alternates: {
    canonical: 'https://www.cardicnex.us',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en'>
    <Head>
        <title>{siteConfig.title}</title>
        <meta name="description" content={siteConfig.description} />
        <meta property="og:title" content={siteConfig.title} />
        <meta property="og:description" content={siteConfig.description} />
        <meta property="og:image" content={siteConfig.ogImage} />
        <meta property="og:url" content={siteConfig.url} />
        <meta property="og:type" content={siteConfig.ogType} />
        <meta name="twitter:card" content={siteConfig.twitterCard} />
      </Head>
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
