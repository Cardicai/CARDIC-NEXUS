import Link from 'next/link';

import Badge from './Badge';
import CardicCard from './CardicCard';

type Project = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  status: string;
  tags: string[];
  price: number;
};

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <CardicCard>
      <div className='mb-2 flex items-center justify-between'>
        <h3 className='font-semibold text-white'>{project.title}</h3>
        <Badge text={project.status} />
      </div>
      <p className='mb-4 text-sm text-gray-400'>{project.summary}</p>
      <div className='flex flex-wrap gap-2 text-xs text-brand-gold'>
        {project.tags.map((t) => (
          <span key={t}>#{t}</span>
        ))}
      </div>
      <div className='mt-4 flex items-center justify-between'>
        <span className='text-brand-blue'>${project.price}</span>
        <Link
          href={`/projects/${project.slug}`}
          className='text-brand-blue hover:underline'
        >
          Details
        </Link>
      </div>
    </CardicCard>
  );
}
