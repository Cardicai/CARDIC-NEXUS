'use client';

import { useEffect } from 'react';

import CardicNexusLanding from '@/app/CardicNexusLanding';
export default function ProjectsPage() {
  useEffect(
    () =>
      document
        .getElementById('projects')
        ?.scrollIntoView({ behavior: 'smooth' }),
    []
  );
  return <CardicNexusLanding />;
}
