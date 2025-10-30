import Link from 'next/link';

const SOCIALS = [
  { label: 'TikTok (Global)', href: 'https://tiktok.com/@cardicnexus' },
  { label: 'Instagram', href: 'https://instagram.com/cardicnexus' },
  { label: 'X (Twitter)', href: 'https://x.com/cardicnexus' },
  { label: 'Telegram (DM)', href: 'https://t.me/cardicnexus' },
  { label: 'Telegram (News/Community)', href: 'https://t.me/cardicnexusnews' },
] as const;

export default function SocialRow(): JSX.Element {
  return (
    <div className='mx-auto max-w-6xl'>
      <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <p className='text-sm font-semibold uppercase tracking-[0.3em] text-white/70'>
            Contact &amp; Socials
          </p>
          <p className='text-sm text-[#A8AFBF]'>Let&apos;s connect</p>
        </div>
      </div>

      <div className='mt-6 flex flex-wrap gap-3'>
        {SOCIALS.map((social) => (
          <Link
            key={social.href}
            href={social.href}
            target='_blank'
            rel='noopener noreferrer'
            className='rounded-2xl border border-white/12 bg-white/5 px-4 py-2 text-sm text-zinc-200 transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2BA7FF]'
          >
            {social.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
