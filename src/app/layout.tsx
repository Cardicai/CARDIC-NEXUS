import Head from 'next/head';
import type { ReactNode } from 'react';

import './globals.css';

import NavBar from '@/components/NavBar';

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
      <body className='cnx-app'>
        <div className='cnx-app__backdrop' aria-hidden='true' />
        <NavBar />
        <main className='cnx-app__main'>{children}</main>
      </body>
    </html>
  );
}
