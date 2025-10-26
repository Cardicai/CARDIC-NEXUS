import Link from 'next/link';

export const metadata = {
  title: 'Trading Hub | Cardic Nexus',
  description:
    'Step inside the Cardic Nexus Trading Hub for live analytics, accountability pods, and community-driven execution support.',
};

const loungeHighlights = [
  {
    title: 'Signal War Room',
    description:
      'Live liquidity heat maps, execution checklists, and squad calls for London, New York, and Asia sessions.',
  },
  {
    title: 'Accountability Pods',
    description:
      'Rank-based chat pods with daily scorecards, milestone tracking, and coach-led reviews.',
  },
  {
    title: 'Performance Vault',
    description:
      'Auto-journal every trade, tag your emotions, and export analytics for prop firm submissions.',
  },
];

export default function TradingHubPage() {
  return (
    <div className='relative min-h-screen overflow-hidden bg-[#050712] text-slate-100'>
      <div className='pointer-events-none absolute inset-0 -z-[1] bg-[radial-gradient(circle_at_5%_10%,rgba(245,199,107,0.24),transparent_55%),radial-gradient(circle_at_95%_20%,rgba(59,130,246,0.28),transparent_58%),radial-gradient(circle_at_50%_90%,rgba(99,102,241,0.18),transparent_60%)]' />
      <main className='mx-auto flex max-w-6xl flex-col gap-16 px-6 pb-24 pt-28 md:gap-20 md:pb-32'>
        <header className='space-y-6 text-center md:text-left'>
          <span className='inline-flex items-center justify-center rounded-full border border-white/10 bg-white/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.38em] text-sky-200'>
            Trading Hub
          </span>
          <h1 className='text-4xl font-black leading-tight text-white md:text-5xl'>
            Your Always-On Nexus Control Room
          </h1>
          <p className='mx-auto max-w-3xl text-base leading-relaxed text-slate-300 md:mx-0 md:text-lg'>
            Coordinate automation, competition prep, and human performance from
            one dark-mode cockpit. The Trading Hub keeps you synced to the
            community and every funded milestone.
          </p>
          <div className='flex flex-col gap-3 sm:flex-row'>
            <Link
              href='/register'
              prefetch={false}
              className='inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 via-fuchsia-500 to-blue-500 px-6 py-3 text-sm font-semibold text-black shadow-[0_16px_60px_rgba(236,72,153,0.35)] transition hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200'
            >
              Activate My Seat
            </Link>
            <Link
              href='/competition'
              prefetch={false}
              className='inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/40'
            >
              Review Competition Hub
            </Link>
          </div>
        </header>

        <section className='grid gap-6 md:grid-cols-3'>
          {loungeHighlights.map((item) => (
            <div
              key={item.title}
              className='group flex flex-col gap-4 rounded-3xl border border-white/10 bg-black/40 p-6 shadow-[0_32px_90px_rgba(8,47,73,0.55)] transition hover:-translate-y-1 hover:border-white/20'
            >
              <h2 className='text-xl font-semibold text-white'>{item.title}</h2>
              <p className='text-sm leading-relaxed text-slate-300'>
                {item.description}
              </p>
              <span className='text-sm font-semibold text-amber-200'>
                Live & archived replays included
              </span>
            </div>
          ))}
        </section>

        <section className='grid gap-4 rounded-[44px] border border-white/10 bg-black/50 p-8 shadow-[0_45px_140px_rgba(45,212,191,0.45)] md:grid-cols-3'>
          <Link
            href='/bots'
            prefetch={false}
            className='group flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 text-left transition hover:-translate-y-1 hover:border-white/25'
          >
            <span className='text-xs uppercase tracking-[0.32em] text-amber-200'>
              Automation
            </span>
            <p className='text-sm leading-relaxed text-slate-200'>
              Plug bots straight into the hub and control risk centrally.
            </p>
            <span className='text-sm font-semibold text-amber-100 group-hover:text-amber-50'>
              Visit bots desk →
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
              Grow with the Nexus brand and unlock residual revenue streams.
            </p>
            <span className='text-sm font-semibold text-amber-100 group-hover:text-amber-50'>
              Explore partner hub →
            </span>
          </Link>
          <Link
            href='/support'
            prefetch={false}
            className='group flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 text-left transition hover:-translate-y-1 hover:border-white/25'
          >
            <span className='text-xs uppercase tracking-[0.32em] text-amber-200'>
              Support Desk
            </span>
            <p className='text-sm leading-relaxed text-slate-200'>
              Message the Nexus desk for onboarding, verification, or
              escalations.
            </p>
            <span className='text-sm font-semibold text-amber-100 group-hover:text-amber-50'>
              Contact support →
            </span>
          </Link>
        </section>
      </main>
    </div>
  );
}
