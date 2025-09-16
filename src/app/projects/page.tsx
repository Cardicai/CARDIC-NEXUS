'use client';
import { useEffect } from 'react';

import CardicNexusLanding from '@/app/CardicNexusLanding';

export const metadata = { title: 'Projects — Cardic Nexus' };

export default function ProjectsPage() {
  useEffect(() => {
    document
      .getElementById('projects')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);
  return <CardicNexusLanding />;
}
