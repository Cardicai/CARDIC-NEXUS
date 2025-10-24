import Link from 'next/link';

import CompetitionStatus from '@/components/CompetitionStatus';

import { highlightedPerks } from './competition/data';

const ecosystemStats = [
  { label: 'Active Traders', value: '8K+' },
  { label: 'Countries Connected', value: '35' },
  { label: 'Indicator Deployments', value: '12' },
  { label: 'Funding Distributed', value: '$1.2M' },
];

const coreOfferings = [
  {
    label: 'Indicator Suite',
    title: 'Nexus Pulse Precision',
    description:
      'Institutional order-flow overlays, adaptive liquidity zones, and confluence signals designed to time every execution.',
    href: '#indicator',
    accent: 'from-amber-400/90 via-orange-500/80 to-rose-500/80',
  },
  {
    label: 'IB Collective',
    title: 'Join as a Nexus Partner',
    description:
      'Scale lifetime payouts by representing Cardic Nexus with dedicated conversion funnels, academy resources, and live support.',
    href: '/partner',
    accent: 'from-sky-500/90 via-blue-500/80 to-indigo-500/80',
  },
  {
    label: 'Competition Arena',
    title: 'Seasonal Trading Battles',
    description:
      'Trade $10K funded demo accounts, climb the leaderboard weekly, and secure instant funding with zero entry cost.',
    href: '/competition',
    accent: 'from-violet-500/80 via-purple-500/80 to-cyan-500/80',
  },
];

const indicatorHighlights = [
  'Institutional-grade signals tuned for forex, metals, and crypto volatility.',
  'Liquidity heat-maps, smart money concepts, and automated confluence scoring.',
  'Real-time trade journals and performance analytics delivered inside MT4/MT5.',
];

const ibBenefits = [
  'Layered revenue share with transparent, real-time tracking dashboards.',
  'Pre-built funnels, marketing automation, and creative assets for launches.',
  'Direct mentorship rooms and conversion clinics hosted by senior partners.',
];

export default function CardicNexusLanding() {
  return (
    <div className='relative overflow-hidden bg-[#03040c] text-slate-200'>
      <div className='pointer-events-none absolute inset-0 -z-[1] bg-[radial-gradient(circle_at_10%_10%,rgba(245,199,107,0.18),transparent_60%),_radial-gradient(circle_at_85%_0%,rgba(59,130,246,0.22),transparent_55%),_radial-gradient(circle_at_50%_80%,rgba(56,189,248,0.16),transparent_65%)]' />

      <section className='relative mx-auto flex max-w-6xl flex-col gap-12 px-6 pb-20 pt-24 md:pt-32'>
        <div className='space-y-10 text-center'>
          <div className='mx-auto w-fit rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-semibold uppercase tracking-[0.38em] text-slate-200'>
            Trading • Funding • Community
          </div>
          <h1 className='flex flex-col items-center justify-center gap-2 text-balance text-4xl font-black leading-tight text-white md:text-6xl'>
            <span className='bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(245,199,107,0.35)]'>
              CARDIC
            </span>
            <span className='bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-[0_0_45px_rgba(59,130,246,0.45)]'>
              NEXUS
            </span>
          </h1>
          <p className='mx-auto max-w-3xl text-lg leading-relaxed text-slate-200 md:text-xl'>
            The full Cardic Nexus ecosystem is live again. Deploy advanced
            indicators, join our elite IB collective, and test your discipline
            in the official Cardic Nexus competition — all from one dark,
            future-ready control center.
          </p>
          <div className='flex flex-wrap items-center justify-center gap-4'>
            <Link
              href='/register'
              target='_blank'
              rel='noopener noreferrer'
              prefetch={false}
              className='inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 via-fuchsia-500 to-blue-500 px-8 py-3 text-base font-semibold text-black shadow-[0_18px_50px_rgba(236,72,153,0.3)] transition hover:scale-[1.03] hover:shadow-[0_22px_60px_rgba(59,130,246,0.38)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200'
            >
              Register Free →
            </Link>
            <Link
              href='/competition'
              prefetch={false}
              className='inline-flex items-center justify-center rounded-full border border-sky-400/60 bg-sky-500/10 px-8 py-3 text-base font-semibold text-sky-200 shadow-[0_0_35px_rgba(56,189,248,0.28)] transition hover:bg-sky-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300'
            >
              Enter Competition Hub
            </Link>
            <Link
              href='/partner'
              prefetch={false}
              className='inline-flex items-center justify-center rounded-full border border-amber-400/60 bg-amber-500/10 px-8 py-3 text-base font-semibold text-amber-200 shadow-[0_0_35px_rgba(245,199,107,0.28)] transition hover:bg-amber-400/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300'
            >
              Become an IB
            </Link>
          </div>
        </div>

        <div className='mx-auto grid w-full max-w-5xl gap-3 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur md:grid-cols-4 md:p-8'>
          {ecosystemStats.map((stat) => (
            <div
              key={stat.label}
              className='flex flex-col items-center gap-1 rounded-2xl border border-white/10 bg-black/30 px-4 py-6 shadow-lg shadow-blue-950/20'
            >
              <span className='text-3xl font-bold text-white'>
                {stat.value}
              </span>
              <span className='text-xs uppercase tracking-[0.28em] text-slate-400'>
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        <CompetitionStatus />
      </section>

      <section className='relative mx-auto max-w-6xl px-6 pb-20 md:pb-24'>
        <div className='grid gap-6 md:grid-cols-3 md:gap-8'>
          {coreOfferings.map((offer) => (
            <Link
              key={offer.title}
              href={offer.href}
              prefetch={false}
              className='group relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-8 shadow-[0_40px_120px_rgba(2,6,23,0.55)] transition hover:-translate-y-1 hover:border-white/20'
            >
              <span className='inline-flex items-center rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-slate-200'>
                {offer.label}
              </span>
              <h3 className='mt-6 text-2xl font-semibold text-white'>
                {offer.title}
              </h3>
              <p className='mt-3 text-sm leading-relaxed text-slate-300'>
                {offer.description}
              </p>
              <span className='mt-6 inline-flex items-center text-sm font-semibold text-sky-200'>
                Discover more →
              </span>
              <div
                className={`pointer-events-none absolute inset-0 -z-[1] opacity-0 transition group-hover:opacity-100 bg-gradient-to-br ${offer.accent}`}
              />
            </Link>
          ))}
        </div>
      </section>

      <section className='relative mx-auto max-w-6xl space-y-12 px-6 pb-20 md:pb-24'>
        <div className='grid gap-10 rounded-[40px] border border-white/10 bg-gradient-to-br from-white/5 via-white/0 to-white/5 p-10 shadow-[0_40px_120px_rgba(15,23,42,0.55)] backdrop-blur-lg md:grid-cols-2'>
          <div className='space-y-5'>
            <p className='text-xs uppercase tracking-[0.32em] text-amber-200'>
              Indicator Intelligence
            </p>
            <h2 className='text-3xl font-semibold text-white md:text-4xl'>
              Precision Tools Built for the Night Shift
            </h2>
            <p className='text-sm leading-relaxed text-slate-300 md:text-base'>
              Nexus Pulse combines multi-timeframe momentum, liquidity maps, and
              institutional order-flow with cinematic clarity. Install it once
              and transform MT4/MT5 into a control deck that responds before the
              volatility strikes.
            </p>
            <ul className='space-y-3 text-sm text-slate-200 md:text-base'>
              {indicatorHighlights.map((item) => (
                <li key={item} className='flex items-start gap-3'>
                  <span className='mt-1 h-2.5 w-2.5 rounded-full bg-amber-400 shadow-[0_0_15px_rgba(245,199,107,0.6)]' />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <a
              href='https://t.me/cardicnexus'
              target='_blank'
              rel='noreferrer'
              className='inline-flex w-fit items-center justify-center rounded-full border border-amber-400/70 bg-amber-500/10 px-6 py-3 text-sm font-semibold text-amber-200 shadow-[0_0_35px_rgba(245,199,107,0.25)] transition hover:bg-amber-400/20'
            >
              Request Indicator Access
            </a>
          </div>

          <div className='space-y-5 rounded-[32px] border border-white/10 bg-black/60 p-8 shadow-[0_30px_90px_rgba(14,165,233,0.2)]'>
            <p className='text-xs uppercase tracking-[0.32em] text-sky-200'>
              IB Collective
            </p>
            <h2 className='text-3xl font-semibold text-white md:text-4xl'>
              Partner With a Funding Powerhouse
            </h2>
            <p className='text-sm leading-relaxed text-slate-300 md:text-base'>
              The Nexus Partner (NP) program lets you expand effortlessly.
              Activate ready-to-go funnels, convert traffic with live events,
              and unlock tiered rewards engineered for long-term allies.
            </p>
            <ul className='space-y-3 text-sm text-slate-200 md:text-base'>
              {ibBenefits.map((benefit) => (
                <li key={benefit} className='flex items-start gap-3'>
                  <span className='mt-1 h-2.5 w-2.5 rounded-full bg-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.6)]' />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <Link
              href='/partner'
              prefetch={false}
              className='inline-flex w-fit items-center justify-center rounded-full border border-sky-400/70 bg-sky-500/10 px-6 py-3 text-sm font-semibold text-sky-200 shadow-[0_0_35px_rgba(56,189,248,0.25)] transition hover:bg-sky-500/20'
            >
              Become a Nexus Partner
            </Link>
          </div>
        </div>
      </section>

      <section className='relative mx-auto max-w-6xl px-6 pb-24 md:pb-32'>
        <div className='space-y-10 rounded-[44px] border border-white/10 bg-black/60 p-10 shadow-[0_40px_120px_rgba(2,6,23,0.6)] backdrop-blur-lg'>
          <div className='text-center md:text-left'>
            <p className='text-xs uppercase tracking-[0.32em] text-sky-200'>
              Competition Spotlight
            </p>
            <h2 className='mt-3 text-3xl font-semibold text-white md:text-4xl'>
              Why Traders Line Up for the Nexus Tournament
            </h2>
            <p className='mt-3 max-w-3xl text-sm leading-relaxed text-slate-300 md:text-base'>
              Season One registration is live with zero entry fees. Secure a
              $10K demo account, follow the drawdown code, and race to the top
              of the leaderboard for instant funding.
            </p>
          </div>

          <div className='grid gap-6 md:grid-cols-3'>
            {highlightedPerks.map((perk) => (
              <div
                key={perk.heading}
                className='rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-white/5 p-6 text-left shadow-lg shadow-blue-950/30'
              >
                <h3 className='text-lg font-semibold text-amber-200'>
                  {perk.heading}
                </h3>
                <p className='mt-3 text-sm leading-relaxed text-slate-300'>
                  {perk.description}
                </p>
              </div>
            ))}
          </div>

          <div className='flex flex-col items-center justify-between gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 text-center shadow-inner shadow-blue-950/40 md:flex-row md:text-left'>
            <div>
              <h3 className='text-2xl font-semibold text-white'>
                Ready for the Arena?
              </h3>
              <p className='mt-2 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base'>
                The Nexus dashboard streams live metrics, leaderboards, and
                eliminations. Secure your spot today and get your credentials
                delivered within 24 hours of verification.
              </p>
            </div>
            <div className='flex flex-col gap-3 sm:flex-row'>
              <Link
                href='/competition'
                prefetch={false}
                className='inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-black shadow-[0_20px_45px_rgba(59,130,246,0.3)] transition hover:scale-[1.03]'
              >
                View Competition Playbook
              </Link>
              <Link
                href='/dashboard'
                prefetch={false}
                className='inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/40'
              >
                Dashboard Preview
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
