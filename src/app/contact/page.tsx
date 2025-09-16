'use client';

import { useEffect } from 'react';

import CardicNexusLanding from '@/app/CardicNexusLanding';
export default function ContactPage() {
  useEffect(
    () =>
      document
        .getElementById('contact')
        ?.scrollIntoView({ behavior: 'smooth' }),
    []
  );
  return <CardicNexusLanding />;
}
