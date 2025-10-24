import Link from 'next/link';

export const metadata = {
  title: 'Support Desk | Cardic Nexus',
  description:
    'Reach the Cardic Nexus support desk for onboarding, verification, partnerships, or automation assistance.',
};

const contactChannels = [
  {
    label: 'Telegram Desk',
    value: '@realcardic1',
    href: 'https://t.me/realcardic1',
    description:
      'Direct message for verification, competition questions, or premium access.',
  },
  {
    label: 'Telegram Broadcast',
    value: '@cardicnexus',
    href: 'https://t.me/cardicnexus',
    description:
      'Stay updated with announcements, drops, and community spotlights.',
  },
  {
    label: 'Email',
    value: 'support@cardicnexus.com',
    href: 'mailto:support@cardicnexus.com',
    description: 'Send documentation, invoices, or longer-form requests.',
  },
];

const serviceLanes = [
  {
    title: 'Competition & Funding',
    description:
      'Leaderboard discrepancies, rule clarifications, or payout escalations. Attach MT4/MT5 IDs for faster verification.',
  },
  {
    title: 'Automation & Indicators',
    description:
      'Bot installations, VPS audits, indicator calibration, and risk reviews handled by the desk.',
  },
  {
    title: 'Partnership & Media',
    description:
      'IB onboarding, co-branded campaigns, and social media coordination.',
  },
];

const turnaround = [
  'Live chat hours: Monday – Friday, 9:00 to 22:00 GMT+1.',
  'Weekend monitoring for competition emergencies and indicator outages.',
  'Average first response time under 30 minutes during market hours.',
];

export default function SupportPage() {
  return (
    <div className='relative min-h-screen overflow-hidden bg-[#04040c] text-slate-100'>
      <div className='pointer-events-none absolute inset-0 -z-[1] bg-[radial-gradient(circle_at_5%_12%,rgba(59,130,246,0.24),transparent_55%),radial-gradient(circle_at_90%_10%,rgba(245,199,107,0.28),transparent_58%),radial-gradient(circle_at_50%_88%,rgba(236,72,153,0.22),transparent_60%)]' />
      <main className='mx-auto flex max-w-5xl flex-col gap-16 px-6 pb-24 pt-28 md:gap-20 md:pb-32'>
        <header className='space-y-6 text-center md:text-left'>
          <span className='inline-flex items-center justify-center rounded-full border border-white/10 bg-white/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.38em] text-amber-200'>
            Support Desk
          </span>
          <h1 className='text-4xl font-black leading-tight text-white md:text-5xl'>
            The Nexus Team Is One Message Away
          </h1>
          <p className='mx-auto max-w-3xl text-base leading-relaxed text-slate-300 md:mx-0 md:text-lg'>
            Whether you need onboarding, funding verification, automation
            tweaks, or partnership support, the Cardic Nexus desk responds
            faster than traditional prop help desks.
          </p>
          <div className='flex flex-col gap-3 sm:flex-row'>
            <a
              href='https://t.me/realcardic1'
              target='_blank'
              rel='noreferrer'
              className='inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 via-fuchsia-500 to-blue-500 px-6 py-3 text-sm font-semibold text-black shadow-[0_16px_60px_rgba(236,72,153,0.35)] transition hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200'
            >
              Message on Telegram
            </a>
            <Link
              href='/partner'
              prefetch={false}
              className='inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/40'
            >
              Explore partnership desk
            </Link>
          </div>
        </header>

        <section className='grid gap-6 rounded-[44px] border border-white/10 bg-black/45 p-8 shadow-[0_40px_120px_rgba(59,130,246,0.45)] md:grid-cols-3'>
          {contactChannels.map((channel) => (
            <a
              key={channel.label}
              href={channel.href}
              target={channel.href.startsWith('http') ? '_blank' : undefined}
              rel={channel.href.startsWith('http') ? 'noreferrer' : undefined}
              className='group flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 text-left transition hover:-translate-y-1 hover:border-white/25'
            >
              <span className='text-xs uppercase tracking-[0.32em] text-amber-200'>
                {channel.label}
              </span>
              <span className='text-lg font-semibold text-white'>
                {channel.value}
              </span>
              <p className='text-sm leading-relaxed text-slate-200'>
                {channel.description}
              </p>
              <span className='text-sm font-semibold text-sky-200 group-hover:text-sky-100'>
                Reach out →
              </span>
            </a>
          ))}
        </section>

        <section className='grid gap-6 rounded-[44px] border border-white/10 bg-gradient-to-br from-white/5 via-black/20 to-white/5 p-8 shadow-[0_45px_140px_rgba(14,23,42,0.55)] md:grid-cols-[1.1fr_0.9fr]'>
          <div className='space-y-5'>
            <p className='text-xs uppercase tracking-[0.32em] text-slate-200'>
              Service lanes
            </p>
            <h2 className='text-3xl font-semibold text-white md:text-4xl'>
              One Desk for All Things Nexus
            </h2>
            <div className='space-y-4'>
              {serviceLanes.map((lane) => (
                <div
                  key={lane.title}
                  className='rounded-3xl border border-white/10 bg-white/5 p-5'
                >
                  <h3 className='text-base font-semibold text-white'>
                    {lane.title}
                  </h3>
                  <p className='mt-2 text-sm leading-relaxed text-slate-300'>
                    {lane.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className='space-y-5 rounded-3xl border border-white/10 bg-black/40 p-6'>
            <p className='text-xs uppercase tracking-[0.32em] text-amber-200'>
              Response times
            </p>
            <ul className='space-y-3 text-sm text-slate-200'>
              {turnaround.map((item) => (
                <li key={item} className='flex items-start gap-3'>
                  <span className='mt-1 inline-flex h-2 w-2 flex-none rounded-full bg-amber-300' />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href='/competition'
              prefetch={false}
              className='inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/40'
            >
              Competition support →
            </Link>
            <Link
              href='/indicators'
              prefetch={false}
              className='inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/40'
            >
              Indicator help →
            </Link>
          </div>
        </section>

        <section className='grid gap-4 rounded-[44px] border border-white/10 bg-black/50 p-8 shadow-[0_45px_140px_rgba(236,72,153,0.45)] md:grid-cols-3'>
          <Link
            href='/bots'
            prefetch={false}
            className='group flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 text-left transition hover:-translate-y-1 hover:border-white/25'
          >
            <span className='text-xs uppercase tracking-[0.32em] text-amber-200'>
              Automation Desk
            </span>
            <p className='text-sm leading-relaxed text-slate-200'>
              Schedule a bot audit or onboarding call with the automation team.
            </p>
            <span className='text-sm font-semibold text-amber-100 group-hover:text-amber-50'>
              Visit bots page →
            </span>
          </Link>
          <Link
            href='/trading-hub'
            prefetch={false}
            className='group flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 text-left transition hover:-translate-y-1 hover:border-white/25'
          >
            <span className='text-xs uppercase tracking-[0.32em] text-amber-200'>
              Trading Hub
            </span>
            <p className='text-sm leading-relaxed text-slate-200'>
              Check your accountability pods, schedules, and resource vault.
            </p>
            <span className='text-sm font-semibold text-amber-100 group-hover:text-amber-50'>
              Go to the hub →
            </span>
          </Link>
          <Link
            href='/partner'
            prefetch={false}
            className='group flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 text-left transition hover:-translate-y-1 hover:border-white/25'
          >
            <span className='text-xs uppercase tracking-[0.32em] text-amber-200'>
              Partnership
            </span>
            <p className='text-sm leading-relaxed text-slate-200'>
              Submit marketing plans or request co-branded campaigns.
            </p>
            <span className='text-sm font-semibold text-amber-100 group-hover:text-amber-50'>
              Partner support →
            </span>
          </Link>
        </section>
      </main>
    </div>
  );
}
