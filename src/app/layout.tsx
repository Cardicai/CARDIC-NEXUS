import Head from 'next/head';
import type { ReactNode } from 'react';

import './globals.css';

import NavBar from '@/components/NavBar';

import { siteConfig } from '@/constant/config';

export const metadata = {
  metadataBase: new URL('https://www.cardicnex.us'),
  title: 'Cardic Nexus Tournament Portal',
  description:
    'Register for the official Cardic Nexus Tournament and access the competition dashboard.',
  openGraph: {
    type: 'website',
    title: 'Cardic Nexus Tournament Portal',
    description:
      'Register for the official Cardic Nexus Tournament and access the competition dashboard.',
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
    title: 'Cardic Nexus Tournament Portal',
    description:
      'Register for the official Cardic Nexus Tournament and access the competition dashboard.',
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
      <body className='min-h-screen bg-[#05030f] bg-[radial-gradient(circle_at_20%_20%,rgba(76,29,149,0.55),transparent_55%),_radial-gradient(circle_at_80%_0%,rgba(14,116,175,0.45),transparent_55%),_linear-gradient(180deg,#05030f,#090b1b)] text-white antialiased'>
        <NavBar />
        {/* Reserve space below fixed navbar */}
        <div className='h-16 md:h-20' aria-hidden />
        <div className='min-h-[calc(100vh-var(--nav-h))] bg-white/5 backdrop-blur-md'>
          <main className='relative z-[1]'>{children}</main>
        </div>
      </body>
    </html>
  );
}
