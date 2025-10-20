import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import './globals.css';

import { siteConfig } from '@/constant/config';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.title,
  description: siteConfig.description,
  openGraph: {
    type: 'website',
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: siteConfig.twitterCard,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@CARDICNEXUS',
  },
  alternates: {
    canonical: siteConfig.url,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang='en' className='bg-slate-950'>
      <body className='min-h-screen bg-slate-950 text-slate-100 antialiased'>
        {children}
      </body>
    </html>
  );
}
