import Link from 'next/link';

export const metadata = {
  title: 'Automation Bots | Cardic Nexus',
  description:
    'Deploy Cardic Nexus automation bots with institution-grade risk routing and 24/5 oversight from the desk.',
};

const botPrograms = [
  {
    name: 'Sentinel Scalper',
    focus:
      'Session-based precision scalping tuned for London and New York volatility with liquidity sweep detection.',
    delivery:
      'Targets 1.2R average returns with latency-balanced execution under 40ms.',
  },
  {
    name: 'Nebula Swing Suite',
    focus:
      'Swing automation blending smart money concepts, Fibonacci clusters, and momentum filters for multi-day trades.',
    delivery:
      'Auto journals every trade to the Nexus vault with equity guardrails locked in.',
  },
  {
    name: 'Flux Arbitrage Radar',
    focus:
      'Cross-asset arbitrage detection piping premium alerts into manual or automated workflows.',
    delivery:
      'Monitors 12+ markets with spread protection and prop-firm safe risk throttles.',
  },
];

const safeguards = [
  'Daily and weekly drawdown governors aligned with top prop firm rulebooks.',
  'Circuit-breaker kill switches activated from the Nexus desk or your Trading Hub console.',
  'Telemetry mirroring so the support team can audit fills and equity curves in real time.',
  'Granular role permissions so multiple traders can collaborate without compromising accounts.',
];

const deploymentSteps = [
  {
    title: 'Book an Automation Call',
    copy: 'Submit your account type, goals, and preferred assets so the desk can prescribe the right bot stack.',
  },
  {
    title: 'Configure Risk & Routing',
    copy: 'We install the bot on your VPS, lock your lot sizing, and sync reporting into the Trading Hub.',
  },
  {
    title: 'Monitor & Optimise',
    copy: 'Track live analytics, request tweaks, and layer in manual trade filters as you scale.',
  },
];

const supportLinks = [
  {
    label: 'Explore the Trading Hub',
    href: '/trading-hub',
    description:
      'See where automation analytics, trade journaling, and squad calls live.',
  },
  {
    label: 'Join the Competition',
    href: '/competition',
    description:
      'Prove your edge in the arena once your automation is locked in.',
  },
  {
    label: 'Talk to Support',
    href: '/support',
    description: 'Request onboarding assistance or a live desk walkthrough.',
  },
];

export default function BotsPage() {
  return (
    <div className='relative min-h-screen overflow-hidden bg-[#03040c] text-slate-100'>
      <div className='pointer-events-none absolute inset-0 -z-[1] bg-[radial-gradient(circle_at_8%_12%,rgba(59,130,246,0.25),transparent_55%),radial-gradient(circle_at_88%_20%,rgba(245,199,107,0.25),transparent_58%),radial-gradient(circle_at_50%_85%,rgba(15,118,110,0.22),transparent_60%)]' />
      <main className='mx-auto flex max-w-6xl flex-col gap-16 px-6 pb-24 pt-28 md:gap-20 md:pb-32'>
        <header className='space-y-6 text-center md:text-left'>
          <span className='inline-flex items-center justify-center rounded-full border border-white/10 bg-white/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.38em] text-amber-200'>
            Automation Desk
          </span>
          <h1 className='text-4xl font-black leading-tight text-white md:text-5xl'>
            Deploy Cardic Nexus Bots with Prop-Firm Discipline
          </h1>
          <p className='mx-auto max-w-3xl text-base leading-relaxed text-slate-300 md:mx-0 md:text-lg'>
            Every automation suite is engineered by the Nexus desk to respect
            funding rules while capturing the highest-probability setups.
            Activate our bots on your accounts or let us manage the full stack
            for you.
          </p>
          <div className='flex flex-col gap-3 sm:flex-row'>
            <Link
              href='/support'
              prefetch={false}
              className='inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 via-fuchsia-500 to-blue-500 px-6 py-3 text-sm font-semibold text-black shadow-[0_16px_60px_rgba(59,130,246,0.35)] transition hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200'
            >
              Book Automation Call
            </Link>
            <Link
              href='/trading-hub'
              prefetch={false}
              className='inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/40'
            >
              View Trading Hub
            </Link>
          </div>
        </header>

        <section className='grid gap-6 md:grid-cols-3'>
          {botPrograms.map((program) => (
            <div
              key={program.name}
              className='group flex flex-col gap-4 rounded-3xl border border-white/10 bg-black/40 p-6 shadow-[0_30px_90px_rgba(14,23,42,0.55)] transition hover:-translate-y-1 hover:border-white/20'
            >
              <div className='inline-flex w-fit items-center rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.32em] text-sky-200'>
                {program.name}
              </div>
              <p className='text-sm leading-relaxed text-slate-300'>
                {program.focus}
              </p>
              <p className='text-xs uppercase tracking-[0.32em] text-amber-200'>
                Delivery
              </p>
              <p className='text-sm text-slate-200'>{program.delivery}</p>
            </div>
          ))}
        </section>

        <section className='grid gap-10 rounded-[44px] border border-white/10 bg-gradient-to-br from-white/5 via-black/20 to-white/5 p-10 shadow-[0_40px_120px_rgba(8,47,73,0.55)] md:grid-cols-[1.1fr_0.9fr]'>
          <div className='space-y-5'>
            <p className='text-xs uppercase tracking-[0.32em] text-slate-200'>
              Safety Systems
            </p>
            <h2 className='text-3xl font-semibold text-white md:text-4xl'>
              Compliance-Ready Automation from Day One
            </h2>
            <p className='text-sm leading-relaxed text-slate-300'>
              We install every bot with redundant controls so you stay inside
              funding rules. The Nexus desk supervises execution and can
              intervene at any time.
            </p>
            <ul className='space-y-3 text-sm text-slate-200'>
              {safeguards.map((item) => (
                <li key={item} className='flex items-start gap-3'>
                  <span className='mt-1 inline-flex h-2 w-2 flex-none rounded-full bg-amber-300' />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className='space-y-5 rounded-3xl border border-white/10 bg-black/40 p-6'>
            <p className='text-xs uppercase tracking-[0.32em] text-amber-200'>
              How It Works
            </p>
            <ul className='space-y-5 text-sm text-slate-200'>
              {deploymentSteps.map((step) => (
                <li
                  key={step.title}
                  className='rounded-2xl border border-white/10 bg-white/5 p-4'
                >
                  <h3 className='text-base font-semibold text-white'>
                    {step.title}
                  </h3>
                  <p className='mt-2 text-sm text-slate-300'>{step.copy}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className='grid gap-4 rounded-[44px] border border-white/10 bg-black/50 p-8 shadow-[0_45px_140px_rgba(12,74,110,0.55)] md:grid-cols-3'>
          {supportLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              prefetch={false}
              className='group flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 text-left transition hover:-translate-y-1 hover:border-white/25'
            >
              <span className='text-xs uppercase tracking-[0.32em] text-sky-200'>
                {link.label}
              </span>
              <p className='text-sm leading-relaxed text-slate-200'>
                {link.description}
              </p>
              <span className='text-sm font-semibold text-amber-200 group-hover:text-amber-100'>
                Go to page →
              </span>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
