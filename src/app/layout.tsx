import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import './globals.css';

import NavBar from '@/components/NavBar';

export const metadata: Metadata = {
  title: 'Cardic Nexus',
  description: 'AI • Trading • Innovation — for retail traders.',
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
