import Link from 'next/link';

import { SOCIALS } from '@/data/navigation';

export default function SocialRow() {
  return (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <p className='text-sm uppercase tracking-[0.3em] text-[#A8AFBF]'>
          Contact &amp; Socials
        </p>
        <h2 className='text-lg font-semibold text-[#E6E8EE]'>
          Let&apos;s connect
        </h2>
      </div>
      <div className='flex flex-wrap gap-3'>
        {SOCIALS.map((social) => (
          <Link
            key={social.label}
            href={social.href}
            target='_blank'
            rel='noopener noreferrer'
            className='rounded-2xl border border-white/12 bg-white/5 px-4 py-2 text-sm text-[#E6E8EE] transition-colors duration-150 hover:bg-white/10'
          >
            {social.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
