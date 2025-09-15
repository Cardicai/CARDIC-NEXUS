'use client';
import { useEffect } from 'react';

import CardicNexusLanding from '@/app/CardicNexusLanding';

export const metadata = { title: 'Pricing — Cardic Nexus' };

export default function PricingPage() {
  useEffect(() => {
    document
      .getElementById('pricing')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);
  return <CardicNexusLanding />;
}
