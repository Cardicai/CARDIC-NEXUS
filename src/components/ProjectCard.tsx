// components/ProjectCard.tsx
interface ProjectCardProps {
  title: string;
  price?: number;
  status: string;
}

export default function ProjectCard({
  title,
  price,
  status,
}: ProjectCardProps) {
  return (
    <div className='rounded-xl bg-white/5 border border-white/10 shadow-goldThin p-4'>
      <div className='flex items-center justify-between mb-2'>
        <h3 className='font-semibold'>
          <span className='text-gold-metallic'>{title}</span>
        </h3>
        <div className='text-brand-blue font-bold'>
          {price ? `$${price}` : ''}
        </div>
      </div>
      <span className='text-[10px] px-2 py-0.5 rounded-full border border-white/15 text-white/70'>
        {status}
      </span>
    </div>
  );
}
