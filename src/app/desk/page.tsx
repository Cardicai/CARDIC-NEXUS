import Link from 'next/link';

export const metadata = {
  title: 'Operations Desk | Cardic Nexus',
  description:
    'Check live service levels, uptime promises, and escalation paths from the Cardic Nexus operations desk.',
};

const nexusEdgeHighlights = [
  {
    title: 'Desk Uptime 24/7',
    description:
      'Operations teams rotate in three shifts to keep the command center, bots, and feeds online without interruption.',
    accent: 'from-emerald-400/40 via-emerald-500/20 to-transparent',
  },
  {
    title: 'Compliance Hardened',
    description:
      'Prop firm rulebooks codified into risk templates so every deployment stays audit-ready.',
    accent: 'from-sky-400/40 via-sky-500/20 to-transparent',
  },
  {
    title: 'Capital Amplified',
    description:
      'Performance council monitors equity curves and allocates instant funding when metrics confirm edge.',
    accent: 'from-amber-400/40 via-amber-500/20 to-transparent',
  },
];

const operationsMetrics = [
  {
    label: 'Signal Accuracy',
    value: '94.3%',
    progress: 94,
    caption:
      'Verified against 2,100 strategy checkpoints across the last 30 days.',
  },
  {
    label: 'Funding Approvals',
    value: '312',
    progress: 86,
    caption:
      'Instant funding packages cleared for the competition roster this quarter.',
  },
  {
    label: 'Response Time',
    value: '42s',
    progress: 72,
    caption:
      'Average live chat pickup speed for premium partners and VIP traders.',
  },
];

const servicePillars = [
  {
    eyebrow: 'Live Ops Signal',
    headline: 'Desk is Online & Monitoring 17 Feeds',
    copy: 'Automation heartbeat refreshed every 60 seconds with redundancy mirrored across global data centers.',
  },
  {
    eyebrow: 'Escalation Speed',
    headline: 'Senior engineer intervention under 3 minutes',
    copy: 'Priority routing for competition traders, automation partners, and premium indicator subscribers.',
  },
  {
    eyebrow: 'Service Windows',
    headline: 'Planned maintenance announced 72 hours ahead',
    copy: 'Expect proactive alerts and contingency routing so your trading sessions stay uninterrupted.',
  },
];

const escalationPaths = [
  {
    title: 'Concierge Support',
    summary:
      'Live chat, Telegram, and email monitored round-the-clock with automated ticket routing to the right specialist.',
    actions: [
      {
        label: 'Open Support Desk',
        href: '/support',
      },
      {
        label: 'Join Community Channel',
        href: 'https://t.me/cardicnexusglobal',
      },
    ],
  },
  {
    title: 'Automation & Bots',
    summary:
      'Direct line to the automation engineers for configuration updates, log reviews, and emergency kill switches.',
    actions: [
      {
        label: 'Automation Intake',
        href: '/bots',
      },
      {
        label: 'Trading Hub Console',
        href: '/trading-hub',
      },
    ],
  },
  {
    title: 'Competition Oversight',
    summary:
      'Leaderboard integrity, account verification, and prize fulfilment handled in partnership with compliance.',
    actions: [
      {
        label: 'Competition HQ',
        href: '/competition',
      },
      {
        label: 'Email Compliance',
        href: 'mailto:support@cardicnexusglobal.com',
      },
    ],
  },
];

export default function DeskPage() {
  return (
    <div className='relative min-h-screen overflow-hidden bg-[#03040c] text-slate-100'>
      <div className='pointer-events-none absolute inset-0 -z-[1] bg-[radial-gradient(circle_at_12%_12%,rgba(245,199,107,0.25),transparent_55%),radial-gradient(circle_at_88%_20%,rgba(59,130,246,0.25),transparent_55%),radial-gradient(circle_at_50%_85%,rgba(16,185,129,0.22),transparent_60%)]' />

      <main className='mx-auto flex max-w-6xl flex-col gap-16 px-6 pb-28 pt-28 md:gap-20 md:pb-36'>
        <header className='space-y-6 text-center md:text-left'>
          <span className='inline-flex items-center justify-center rounded-full border border-white/10 bg-white/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.38em] text-amber-200'>
            Operations Desk
          </span>
          <h1 className='text-4xl font-black leading-tight text-white md:text-5xl'>
            Reliability, Transparency, and Instant Escalations
          </h1>
          <p className='mx-auto max-w-3xl text-base leading-relaxed text-slate-300 md:mx-0 md:text-lg'>
            The Cardic Nexus desk coordinates every feed, automation stack, and
            trader touchpoint. Review the live commitments, service-level
            promises, and escalation paths that keep the ecosystem sharp.
          </p>
          <div className='flex flex-col gap-3 sm:flex-row'>
            <Link
              href='/support'
              prefetch={false}
              className='inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 via-fuchsia-500 to-blue-500 px-6 py-3 text-sm font-semibold text-black shadow-[0_16px_60px_rgba(59,130,246,0.35)] transition hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200'
            >
              Contact the Desk
            </Link>
            <a
              href='https://t.me/cardicnexusglobal'
              target='_blank'
              rel='noreferrer'
              className='inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/40'
            >
              Join Community Broadcasts
            </a>
          </div>
        </header>

        <section className='space-y-8 rounded-[44px] border border-white/10 bg-black/60 p-10 shadow-[0_45px_140px_rgba(2,6,23,0.6)] backdrop-blur'>
          <div className='grid gap-6 md:grid-cols-3'>
            {servicePillars.map((pillar) => (
              <div
                key={pillar.headline}
                className='flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-6 text-left shadow-lg shadow-blue-950/30'
              >
                <span className='text-[10px] uppercase tracking-[0.32em] text-emerald-200'>
                  {pillar.eyebrow}
                </span>
                <h2 className='text-lg font-semibold text-white'>
                  {pillar.headline}
                </h2>
                <p className='text-sm leading-relaxed text-slate-300'>
                  {pillar.copy}
                </p>
              </div>
            ))}
          </div>

          <div className='grid gap-6 md:grid-cols-3'>
            {nexusEdgeHighlights.map((highlight) => (
              <div
                key={highlight.title}
                className='relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 text-left shadow-lg shadow-blue-950/30'
              >
                <div
                  className={`pointer-events-none absolute inset-0 -z-[1] bg-gradient-to-br ${highlight.accent}`}
                />
                <h3 className='text-lg font-semibold text-white'>
                  {highlight.title}
                </h3>
                <p className='mt-3 text-sm leading-relaxed text-slate-300'>
                  {highlight.description}
                </p>
              </div>
            ))}
          </div>

          <div className='grid gap-4 md:grid-cols-3'>
            {operationsMetrics.map((metric) => (
              <div
                key={metric.label}
                className='rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-black/50 to-white/5 p-5 text-left shadow-[0_28px_90px_rgba(15,23,42,0.55)]'
              >
                <div className='flex flex-wrap items-center justify-between gap-2 text-[10px] uppercase tracking-[0.28em] text-slate-200'>
                  <span>{metric.label}</span>
                  <span className='text-lg font-semibold text-white'>
                    {metric.value}
                  </span>
                </div>
                <div className='mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10'>
                  <div
                    className='h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-sky-500'
                    style={{ width: `${metric.progress}%` }}
                  />
                </div>
                <p className='mt-3 text-xs leading-relaxed text-slate-300'>
                  {metric.caption}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className='space-y-10 rounded-[44px] border border-white/10 bg-gradient-to-br from-white/5 via-black/40 to-black/70 p-10 shadow-[0_45px_140px_rgba(15,23,42,0.65)] backdrop-blur'>
          <div className='text-center md:text-left'>
            <p className='text-xs uppercase tracking-[0.32em] text-sky-200'>
              Escalation Map
            </p>
            <h2 className='mt-3 text-3xl font-semibold text-white md:text-4xl'>
              Connect with the Right Nexus Specialist
            </h2>
            <p className='mt-3 max-w-3xl text-sm leading-relaxed text-slate-300 md:text-base'>
              Whether you are competing for instant funding, tuning automation
              bots, or onboarding as a partner, the operations desk routes you
              to the fastest solution.
            </p>
          </div>

          <div className='grid gap-6 md:grid-cols-3'>
            {escalationPaths.map((path) => (
              <div
                key={path.title}
                className='flex h-full flex-col gap-4 rounded-3xl border border-white/10 bg-black/60 p-6 shadow-[0_30px_110px_rgba(15,23,42,0.55)]'
              >
                <div>
                  <h3 className='text-xl font-semibold text-white'>
                    {path.title}
                  </h3>
                  <p className='mt-3 text-sm leading-relaxed text-slate-300'>
                    {path.summary}
                  </p>
                </div>
                <div className='mt-auto flex flex-wrap gap-3'>
                  {path.actions.map((action) =>
                    action.href.startsWith('http') ||
                    action.href.startsWith('mailto:') ? (
                      <a
                        key={`${path.title}-${action.label}`}
                        href={action.href}
                        target={
                          action.href.startsWith('http') ? '_blank' : undefined
                        }
                        rel={
                          action.href.startsWith('http')
                            ? 'noreferrer'
                            : undefined
                        }
                        className='inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-white/40'
                      >
                        {action.label}
                      </a>
                    ) : (
                      <Link
                        key={`${path.title}-${action.label}`}
                        href={action.href}
                        prefetch={false}
                        className='inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-white/40'
                      >
                        {action.label}
                      </Link>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className='space-y-6 rounded-[44px] border border-white/10 bg-white/5 p-10 text-center shadow-[0_35px_120px_rgba(2,6,23,0.55)] md:text-left'>
          <div className='flex flex-col gap-6 md:flex-row md:items-center md:justify-between'>
            <div className='space-y-3'>
              <p className='text-xs uppercase tracking-[0.32em] text-amber-200'>
                Stay Ahead
              </p>
              <h2 className='text-3xl font-semibold text-white md:text-4xl'>
                Subscribe to Desk Broadcasts
              </h2>
              <p className='text-sm leading-relaxed text-slate-300 md:max-w-2xl md:text-base'>
                Get notified about maintenance windows, new indicator pushes,
                and competition milestones directly from the desk.
              </p>
            </div>
            <a
              href='https://t.me/cardicnexusglobal'
              target='_blank'
              rel='noreferrer'
              className='inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 via-sky-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-black shadow-[0_20px_45px_rgba(59,130,246,0.3)] transition hover:scale-[1.03]'
            >
              Join Telegram Updates
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
