'use client';
import { useState } from 'react';

import projects from '@/data/projects.json';

import ProjectCard from '@/components/ProjectCard';
import Section from '@/components/Section';

export default function ProjectsPage() {
  const [query, setQuery] = useState('');
  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.type.toLowerCase().includes(query.toLowerCase())
  );
  return (
    <Section>
      <h1 className='mb-4 text-3xl font-bold'>Projects</h1>
      <input
        className='mb-6 w-full rounded bg-black/20 p-2'
        placeholder='Search'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {filtered.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </Section>
  );
}
