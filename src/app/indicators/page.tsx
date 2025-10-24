import Link from 'next/link';

export const metadata = {
  title: 'Premium Indicators | Cardic Nexus',
  description:
    'Unlock the Nexus Pulse indicator suite with order-flow overlays, liquidity heat, and automated confluence scoring.',
};

const indicatorStacks = [
  {
    title: 'Nexus Pulse Overlay',
    description:
      'Institutional order-flow, volume delta, and liquidity zones visualised directly on MT4/MT5 with adaptive colour mapping.',
  },
  {
    title: 'Liquidity Heat Bands',
    description:
      'Realtime resting liquidity and imbalance detection that highlights smart money footprints before expansion.',
  },
  {
    title: 'Prop Drawdown Guardian',
    description:
      'Account guardrails with soft and hard alerts, lot-size locks, and mandatory break scheduling to protect funding.',
  },
];

const packages = [
  {
    name: 'Pulse Core',
    price: '$97 / month',
    perks: [
      'Nexus Pulse Overlay',
      'Liquidity Heat Bands',
      'Two live mentorship clinics per month',
      'Trading Hub analytics integration',
    ],
  },
  {
    name: 'Pulse Elite',
    price: '$197 / month',
    perks: [
      'Everything in Pulse Core',
      'Prop Drawdown Guardian',
      'Competition fast-pass reviews',
      'Priority automation tuning with the desk',
    ],
  },
  {
    name: 'Pulse Enterprise',
    price: 'Custom',
    perks: [
      'Institutional routing & multi-seat licensing',
      'Dedicated success manager and weekly desk sync',
      'Access to marketing & partner funnels',
      'Private API endpoints for bespoke dashboards',
    ],
  },
];

const faqs = [
  {
    question: 'Do the indicators work on funded accounts?',
    answer:
      'Yes. Nexus Pulse is built for prop firms. Risk layers prevent over-leverage and the Guardian module enforces drawdown compliance.',
  },
  {
    question: 'Can I request custom settings?',
    answer:
      'Every subscription includes a calibration call. Enterprise clients receive bespoke logic and private routing.',
  },
  {
    question: 'How fast is onboarding?',
    answer:
      'Pulse Core and Elite activate within 24 hours. Enterprise deployments are scheduled with the desk to handle complex routing.',
  },
];

export default function IndicatorsPage() {
  return (
    <div className='relative min-h-screen overflow-hidden bg-[#06040f] text-slate-100'>
      <div className='pointer-events-none absolute inset-0 -z-[1] bg-[radial-gradient(circle_at_12%_15%,rgba(245,199,107,0.22),transparent_55%),radial-gradient(circle_at_88%_18%,rgba(56,189,248,0.3),transparent_58%),radial-gradient(circle_at_50%_90%,rgba(139,92,246,0.22),transparent_60%)]' />
      <main className='mx-auto flex max-w-6xl flex-col gap-16 px-6 pb-24 pt-28 md:gap-20 md:pb-32'>
        <header className='space-y-6 text-center md:text-left'>
          <span className='inline-flex items-center justify-center rounded-full border border-white/10 bg-white/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.38em] text-amber-200'>
            Premium Indicators
          </span>
          <h1 className='text-4xl font-black leading-tight text-white md:text-5xl'>
            Nexus Pulse — Institutional Clarity for Every Session
          </h1>
          <p className='mx-auto max-w-3xl text-base leading-relaxed text-slate-300 md:mx-0 md:text-lg'>
            Overlay order-flow intelligence, liquidity heat, and risk guardrails
            onto your charts. Nexus Pulse is the indicator stack built by the
            same desk powering our automation and competition winners.
          </p>
          <div className='flex flex-col gap-3 sm:flex-row'>
            <Link
              href='/support'
              prefetch={false}
              className='inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 via-fuchsia-500 to-blue-500 px-6 py-3 text-sm font-semibold text-black shadow-[0_16px_60px_rgba(139,92,246,0.35)] transition hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200'
            >
              Request Access Call
            </Link>
            <Link
              href='/bots'
              prefetch={false}
              className='inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/40'
            >
              See Automation Pairings
            </Link>
          </div>
        </header>

        <section className='grid gap-6 md:grid-cols-3'>
          {indicatorStacks.map((indicator) => (
            <div
              key={indicator.title}
              className='group flex flex-col gap-4 rounded-3xl border border-white/10 bg-black/40 p-6 shadow-[0_32px_90px_rgba(15,23,42,0.55)] transition hover:-translate-y-1 hover:border-white/20'
            >
              <h2 className='text-xl font-semibold text-white'>
                {indicator.title}
              </h2>
              <p className='text-sm leading-relaxed text-slate-300'>
                {indicator.description}
              </p>
              <span className='text-sm font-semibold text-amber-200'>
                MT4 • MT5 • cTrader compatible
              </span>
            </div>
          ))}
        </section>

        <section className='grid gap-6 md:grid-cols-3'>
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className='flex flex-col gap-5 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-black/30 to-white/5 p-8 text-center shadow-[0_36px_120px_rgba(15,23,42,0.55)]'
            >
              <span className='text-xs uppercase tracking-[0.32em] text-sky-200'>
                {pkg.name}
              </span>
              <span className='text-3xl font-semibold text-white'>
                {pkg.price}
              </span>
              <ul className='flex flex-1 flex-col gap-3 text-sm text-slate-200'>
                {pkg.perks.map((perk) => (
                  <li key={perk} className='flex items-start gap-2 text-left'>
                    <span className='mt-[6px] inline-flex h-2 w-2 flex-none rounded-full bg-amber-300' />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
              <Link
                href='/support'
                prefetch={false}
                className='inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/40'
              >
                Talk to the desk →
              </Link>
            </div>
          ))}
        </section>

        <section className='grid gap-6 rounded-[46px] border border-white/10 bg-black/45 p-10 shadow-[0_45px_140px_rgba(59,130,246,0.45)] md:grid-cols-[1.1fr_0.9fr]'>
          <div className='space-y-5'>
            <p className='text-xs uppercase tracking-[0.32em] text-slate-200'>
              Why traders choose Pulse
            </p>
            <h2 className='text-3xl font-semibold text-white md:text-4xl'>
              Built with Prop Desks, for Prop Desks
            </h2>
            <ul className='space-y-4 text-sm text-slate-200'>
              <li className='flex items-start gap-3'>
                <span className='mt-1 inline-flex h-2 w-2 flex-none rounded-full bg-sky-300' />
                <span>
                  Seamless Trading Hub integration for journaling,
                  accountability, and automation triggers.
                </span>
              </li>
              <li className='flex items-start gap-3'>
                <span className='mt-1 inline-flex h-2 w-2 flex-none rounded-full bg-sky-300' />
                <span>
                  Weekly indicator labs with the Nexus analysts to refine your
                  execution edge.
                </span>
              </li>
              <li className='flex items-start gap-3'>
                <span className='mt-1 inline-flex h-2 w-2 flex-none rounded-full bg-sky-300' />
                <span>
                  Instant alerts inside Telegram and Trading Hub when liquidity
                  shifts or violations trigger.
                </span>
              </li>
            </ul>
          </div>
          <div className='space-y-4'>
            <p className='text-xs uppercase tracking-[0.32em] text-amber-200'>
              Common questions
            </p>
            <div className='space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6'>
              {faqs.map((faq) => (
                <div key={faq.question} className='space-y-2'>
                  <h3 className='text-base font-semibold text-white'>
                    {faq.question}
                  </h3>
                  <p className='text-sm leading-relaxed text-slate-300'>
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className='grid gap-4 rounded-[44px] border border-white/10 bg-black/50 p-8 shadow-[0_45px_140px_rgba(245,199,107,0.45)] md:grid-cols-3'>
          <Link
            href='/trading-hub'
            prefetch={false}
            className='group flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 text-left transition hover:-translate-y-1 hover:border-white/25'
          >
            <span className='text-xs uppercase tracking-[0.32em] text-amber-200'>
              Trading Hub
            </span>
            <p className='text-sm leading-relaxed text-slate-200'>
              See how Pulse insights feed directly into accountability pods.
            </p>
            <span className='text-sm font-semibold text-amber-100 group-hover:text-amber-50'>
              Visit the hub →
            </span>
          </Link>
          <Link
            href='/competition'
            prefetch={false}
            className='group flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 text-left transition hover:-translate-y-1 hover:border-white/25'
          >
            <span className='text-xs uppercase tracking-[0.32em] text-amber-200'>
              Competition HQ
            </span>
            <p className='text-sm leading-relaxed text-slate-200'>
              Use Pulse to maintain discipline and climb the weekly
              leaderboards.
            </p>
            <span className='text-sm font-semibold text-amber-100 group-hover:text-amber-50'>
              Enter the arena →
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
              Share Pulse with your audience and unlock Nexus partner
              commissions.
            </p>
            <span className='text-sm font-semibold text-amber-100 group-hover:text-amber-50'>
              Discover partner perks →
            </span>
          </Link>
        </section>
      </main>
    </div>
  );
}
