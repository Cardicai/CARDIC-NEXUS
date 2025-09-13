import projects from '@/data/projects.json';

import Badge from '@/components/Badge';
import BuyButton from '@/components/BuyButton';
import MarkdownRender from '@/components/MarkdownRender';
import Section from '@/components/Section';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProjectPage({ params }: any) {
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) {
    return <Section>Project not found.</Section>;
  }
  return (
    <Section>
      <h1 className='mb-2 text-3xl font-bold'>{project.title}</h1>
      <Badge text={project.status} />
      <p className='mt-4 text-gray-400'>{project.summary}</p>
      {project.features && (
        <ul className='my-6 list-disc pl-5'>
          {project.features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      )}
      <BuyButton productId={project.id}>Buy</BuyButton>
      {project.changelog && (
        <div className='mt-8'>
          <h2 className='mb-2 text-xl font-semibold'>Changelog</h2>
          {project.changelog.map((c) => (
            <MarkdownRender key={c.v} content={`Version ${c.v}: ${c.text}`} />
          ))}
        </div>
      )}
    </Section>
  );
}
