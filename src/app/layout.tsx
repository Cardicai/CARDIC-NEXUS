import { Metadata } from 'next';

import '@/styles/globals.css';

import Footer from '@/components/Footer';
import NavBar from '@/components/NavBar';

export const metadata: Metadata = {
  title: {
    default: 'Cardic Nexus',
    template: '%s | Cardic Nexus',
  },
  description: 'AI. Trading. Innovation.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>
        <NavBar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
