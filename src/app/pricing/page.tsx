'use client';

import { useEffect } from 'react';

import CardicNexusLanding from '@/app/CardicNexusLanding';
export default function PricingPage() {
  useEffect(
    () =>
      document
        .getElementById('pricing')
        ?.scrollIntoView({ behavior: 'smooth' }),
    []
  );
  return <CardicNexusLanding />;
}
