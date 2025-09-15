'use client';
import { useEffect } from 'react';

import CardicNexusLanding from '@/app/CardicNexusLanding';

export const metadata = { title: 'Contact — Cardic Nexus' };

export default function ContactPage() {
  useEffect(() => {
    document
      .getElementById('contact')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);
  return <CardicNexusLanding />;
}
