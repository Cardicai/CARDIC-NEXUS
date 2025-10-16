import Head from 'next/head';
import type { ReactNode } from 'react';

import './globals.css';

import { siteConfig } from '@/constant/config';

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
  void children;
  return (
    <html lang='en'>
      <Head>
        <title>{siteConfig.title}</title>
        <meta name='description' content={siteConfig.description} />
        <meta property='og:title' content={siteConfig.title} />
        <meta property='og:description' content={siteConfig.description} />
        <meta property='og:image' content={siteConfig.ogImage} />
        <meta property='og:url' content={siteConfig.url} />
        <meta property='og:type' content={siteConfig.ogType} />
        <meta name='twitter:card' content={siteConfig.twitterCard} />
      </Head>
      <body
        style={{
          margin: 0,
          background: 'linear-gradient(180deg,#0a0b0d,#0e0f12)',
          color: '#fff',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Arial, Helvetica, sans-serif',
          textAlign: 'center',
          padding: '0 1.5rem',
        }}
      >
        <main>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>
            Under Maintenance
          </h1>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
            We&apos;re sorry for the inconvenience — we&apos;ll be live soon.
            Stay safe 🤠
            <br />
            <span style={{ display: 'inline-block', marginTop: '0.75rem' }}>
              (Cardic Team)
            </span>
          </p>
        </main>
      </body>
    </html>
  );
}
