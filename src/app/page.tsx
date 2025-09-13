import Link from 'next/link';

import projects from '@/data/projects.json';

import CardicCard from '@/components/CardicCard';
import Particles from '@/components/Particles';
import ProjectCard from '@/components/ProjectCard';
import Section from '@/components/Section';

export default function HomePage() {
  return (
    <div>
      <section className='relative flex h-[60vh] flex-col items-center justify-center text-center'>
        <Particles />
        <h1 className='mb-4 text-4xl font-bold text-white md:text-6xl'>
          CARDIC NEXUS
        </h1>
        <p className='mb-8 text-lg text-gray-400'>AI. Trading. Innovation.</p>
        <div className='flex gap-4'>
          <Link
            href='/projects'
            className='rounded bg-brand-blue px-4 py-2 text-white hover:shadow-gold'
          >
            Explore Projects
          </Link>
          <Link
            href='/pricing'
            className='rounded border border-brand-gold px-4 py-2 text-brand-gold hover:shadow-gold'
          >
            Join Premium
          </Link>
        </div>
      </section>
      <Section>
        <h2 className='mb-6 text-2xl font-semibold'>Highlights</h2>
        <div className='grid gap-6 md:grid-cols-3'>
          <CardicCard>
            <h3 className='mb-2 font-semibold'>Indicators</h3>
            <p className='text-sm text-gray-400'>
              Cardic Oracle, Heat Zones, Spider Web
            </p>
          </CardicCard>
          <CardicCard>
            <h3 className='mb-2 font-semibold'>EAs/Algos</h3>
            <p className='text-sm text-gray-400'>
              Automation tools for traders.
            </p>
          </CardicCard>
          <CardicCard>
            <h3 className='mb-2 font-semibold'>AI Tools</h3>
            <p className='text-sm text-gray-400'>
              Experimental AI-powered utilities.
            </p>
          </CardicCard>
        </div>
      </Section>
      <Section>
        <h2 className='mb-6 text-2xl font-semibold'>Projects</h2>
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {projects.slice(0, 3).map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </Section>
    </div>
  );
}
