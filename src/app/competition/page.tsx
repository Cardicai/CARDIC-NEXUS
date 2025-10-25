import Link from 'next/link';

import CompetitionStatus from '@/components/CompetitionStatus';

const highlightedPerks = [
  {
    heading: 'Simulated $10,000 Accounts',
    description:
      'Trade on MT4/MT5 with real market conditions — demonstrate discipline without risking capital.',
  },
  {
    heading: 'Weekly Eliminations',
    description:
      'Hold the line. ROI decides who advances after each cut until the Top 50 showdown.',
  },
  {
    heading: 'Instant Funded Accounts',
    description:
      'Top 3 winners secure $30,000 in instant funding and VIP recognition from the Cardic Nexus team.',
  },
];

const ruleSections = [
  {
    title: '1️⃣ Overview',
    body: `Welcome to the Cardic Nexus Trading Tournament, an exclusive competition designed to identify the most disciplined and skilled traders in our community. All participants will compete on simulated $10,000 USD demo accounts with real market conditions on MT4/MT5. Your goal: Achieve the highest ROI within the competition period — without violating the drawdown limits.`,
  },
  {
    title: '2️⃣ Registration & Eligibility',
    body: `✅ Entry is 100% FREE.\n✅ To qualify, each participant must register on the Cardic Nexus competition portal, provide full KYC details, confirm two official Cardic Nexus social follows, and verify their email. Only verified and complete entries will be accepted.`,
  },
  {
    title: '3️⃣ Competition Details',
    body: `Start Date: To be announced. Duration: 1 month. Platform: MT4/MT5 (Exness Demo). Starting Balance: $10,000. Leverage: 1:200. Trading Allowed: All forex, gold, and crypto pairs. EA usage permitted when verified by the Cardic Nexus team.`,
  },
  {
    title: '4️⃣ Trading Rules',
    body: `Maximum daily drawdown: 5%. Maximum overall drawdown: 10%. Minimum trading days: 10 within the month. Stop-loss required on every trade. No copy trading, martingale, grid, or arbitrage systems. Violation of any rule results in disqualification.`,
  },
  {
    title: '5️⃣ Leaderboard & Eliminations',
    body: `Leaderboard updates automatically on the dashboard with ROI ranking. Week 2 onwards the lowest performers are cut each week until the Top 50 finale.`,
  },
  {
    title: '6️⃣ Prizes',
    body: `🏅 1st Place: $15,000 Instant Funded Account. 🥈 2nd Place: $10,000 Instant Funded Account. 🥉 3rd Place: $5,000 Instant Funded Account. 🎖 Top 10 earn lifetime Cardic Nexus VIP access plus a spotlight feature.`,
  },
  {
    title: '7️⃣ Disqualification Terms',
    body: `Breaking drawdown limits, using multiple accounts, submitting fake or incomplete info, manipulating data, or skipping the minimum trading days triggers removal.`,
  },
  {
    title: '8️⃣ Communication & Support',
    body: `Official updates, leaderboard links, and account details arrive via email. Join the Cardic Nexus Telegram group for live updates and contact support@cardicnexusglobal.com or @cardicnexus on Telegram for assistance.`,
  },
  {
    title: '9️⃣ Legal Disclaimer',
    body: `Cardic Nexus may modify, pause, or terminate the competition at any time. The tournament runs on demo accounts purely for educational purposes and results do not represent real profits or losses.`,
  },
  {
    title: '🔟 Agreement',
    body: `Participation confirms you agree to the rules, uphold trading discipline, and respect fellow traders throughout the tournament.`,
  },
];

const timelineMilestones = [
  {
    phase: 'Phase 01',
    title: 'Registration Window',
    description:
      'Secure your complimentary slot and verify two official Cardic Nexus socials. Credentials arrive within 24 hours after manual approval.',
  },
  {
    phase: 'Phase 02',
    title: 'Live Trading Month',
    description:
      'Trade the $10K MT4/MT5 demo account with a 1:200 leverage cap. Stay inside the 5% daily and 10% overall drawdown code.',
  },
  {
    phase: 'Phase 03',
    title: 'Leaderboard Eliminations',
    description:
      'Rankings update in real-time. Weekly cuts trim the field until 50 traders remain, setting up the final showdown.',
  },
  {
    phase: 'Phase 04',
    title: 'Final Reckoning',
    description:
      'Top performers are reviewed by the Nexus risk desk. Instant funded accounts plus VIP access are awarded to the champions.',
  },
];

const prizeTiers = [
  {
    place: '🥇 1st Place',
    reward: '$15,000 Instant Funded Account',
    detail:
      'Unlocks immediate deployment plus a feature spotlight across the Nexus ecosystem.',
  },
  {
    place: '🥈 2nd Place',
    reward: '$10,000 Instant Funded Account',
    detail:
      'Engineered for traders ready to scale. Includes private desk mentorship for the following quarter.',
  },
  {
    place: '🥉 3rd Place',
    reward: '$5,000 Instant Funded Account',
    detail:
      'Launchpad capital along with access to advanced automation playbooks.',
  },
  {
    place: '🎖 Top 10',
    reward: 'Lifetime Cardic Nexus VIP',
    detail:
      'Permanent access to premium indicators, closed-door AMAs, and future airdrops.',
  },
];

const supportLinks = [
  {
    label: 'Telegram Channel',
    href: 'https://t.me/cardicnexusglobal',
    description: 'Daily heat, leaderboard alerts, and surprise vault drops.',
  },
  {
    label: 'Direct Support',
    href: 'https://t.me/realcardic1',
    description:
      'Talk to the team for verification assistance and trade clarifications.',
  },
  {
    label: 'Email Desk',
    href: 'mailto:support@cardicnexusglobal.com',
    description: 'Send documents, escalate reviews, or request manual help.',
  },
];

export default function CompetitionPage() {
  return (
    <div className='relative overflow-hidden bg-[#02030a] text-slate-200'>
      <div className='pointer-events-none absolute inset-0 -z-[1] bg-[radial-gradient(circle_at_0%_0%,rgba(245,199,107,0.18),transparent_55%),_radial-gradient(circle_at_90%_10%,rgba(56,189,248,0.22),transparent_60%),_radial-gradient(circle_at_50%_85%,rgba(129,140,248,0.16),transparent_65%)]' />

      <section className='relative mx-auto flex max-w-5xl flex-col gap-10 px-6 pb-16 pt-24 md:pt-32'>
        <div className='space-y-6 text-center'>
          <span className='inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.38em] text-slate-200'>
            Season 1 • Official Hub
          </span>
          <h1 className='text-balance text-4xl font-black leading-tight text-white md:text-6xl'>
            <span className='bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(245,199,107,0.35)]'>
              CARDIC
            </span>{' '}
            <span className='bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-[0_0_45px_rgba(59,130,246,0.45)]'>
              NEXUS COMPETITION
            </span>
          </h1>
          <p className='mx-auto max-w-3xl text-lg leading-relaxed text-slate-200 md:text-xl'>
            This is your battlefield briefing. Study the rules, lock in the
            dates, and prepare to trade the $10K Nexus accounts with zero entry
            fee. Discipline wins. Drawdown violations end the campaign.
          </p>
          <div className='flex flex-wrap items-center justify-center gap-4'>
            <Link
              href='/register'
              target='_blank'
              rel='noopener noreferrer'
              prefetch={false}
              className='inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 px-8 py-3 text-base font-semibold text-black shadow-[0_20px_50px_rgba(59,130,246,0.32)] transition hover:scale-[1.03] hover:shadow-[0_25px_65px_rgba(79,70,229,0.38)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300'
            >
              Register & Verify →
            </Link>
            <Link
              href='/dashboard'
              prefetch={false}
              className='inline-flex items-center justify-center rounded-full border border-amber-400/60 bg-amber-500/10 px-8 py-3 text-base font-semibold text-amber-200 shadow-[0_0_35px_rgba(245,199,107,0.28)] transition hover:bg-amber-400/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300'
            >
              View Leaderboard Preview
            </Link>
          </div>
        </div>

        <CompetitionStatus />
      </section>

      <section className='relative mx-auto max-w-6xl px-6 pb-20 md:pb-24'>
        <div className='grid gap-6 md:grid-cols-3'>
          {highlightedPerks.map((perk) => (
            <div
              key={perk.heading}
              className='rounded-3xl border border-white/10 bg-black/50 p-6 shadow-[0_35px_110px_rgba(15,23,42,0.55)] backdrop-blur'
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
      </section>

      <section className='relative mx-auto max-w-6xl px-6 pb-20 md:pb-24'>
        <div className='rounded-[40px] border border-white/10 bg-gradient-to-br from-white/5 via-black/40 to-black/60 p-10 shadow-[0_45px_140px_rgba(2,6,23,0.6)] backdrop-blur-lg'>
          <div className='space-y-8'>
            <div className='text-center md:text-left'>
              <p className='text-xs uppercase tracking-[0.32em] text-sky-200'>
                Timeline
              </p>
              <h2 className='mt-3 text-3xl font-semibold text-white md:text-4xl'>
                How the Season Unfolds
              </h2>
              <p className='mt-3 max-w-3xl text-sm leading-relaxed text-slate-300 md:text-base'>
                Each phase is precision-engineered to surface the most
                consistent traders. Lock down verification early so you do not
                miss the opening bell.
              </p>
            </div>
            <div className='grid gap-6 md:grid-cols-2'>
              {timelineMilestones.map((milestone) => (
                <div
                  key={milestone.title}
                  className='rounded-3xl border border-white/10 bg-black/50 p-6 shadow-inner shadow-blue-950/30'
                >
                  <span className='text-xs font-semibold uppercase tracking-[0.28em] text-slate-400'>
                    {milestone.phase}
                  </span>
                  <h3 className='mt-4 text-xl font-semibold text-white'>
                    {milestone.title}
                  </h3>
                  <p className='mt-3 text-sm leading-relaxed text-slate-300'>
                    {milestone.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className='relative mx-auto max-w-6xl px-6 pb-20 md:pb-24'>
        <div className='grid gap-6 md:grid-cols-2'>
          <div className='space-y-6 rounded-[36px] border border-white/10 bg-black/60 p-8 shadow-[0_35px_120px_rgba(2,6,23,0.6)]'>
            <p className='text-xs uppercase tracking-[0.32em] text-amber-200'>
              Rules at a Glance
            </p>
            <h2 className='text-3xl font-semibold text-white md:text-4xl'>
              Respect the Nexus Code
            </h2>
            <div className='space-y-4 text-sm leading-relaxed text-slate-300 md:text-base'>
              {ruleSections.slice(0, 4).map((section) => (
                <div key={section.title}>
                  <h3 className='text-sm font-semibold uppercase tracking-[0.2em] text-slate-200'>
                    {section.title}
                  </h3>
                  {section.body.split('\n').map((line) => (
                    <p
                      key={line}
                      className='mt-2 text-sm text-slate-300 md:text-base'
                    >
                      {line}
                    </p>
                  ))}
                </div>
              ))}
            </div>
            <Link
              href='#full-rules'
              className='inline-flex w-fit items-center justify-center rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/40'
            >
              Read Full Terms ↓
            </Link>
          </div>

          <div className='space-y-6 rounded-[36px] border border-white/10 bg-gradient-to-br from-indigo-500/10 via-sky-500/10 to-amber-400/10 p-8 shadow-[0_35px_120px_rgba(79,70,229,0.35)]'>
            <p className='text-xs uppercase tracking-[0.32em] text-sky-200'>
              Rewards
            </p>
            <h2 className='text-3xl font-semibold text-white md:text-4xl'>
              Instant Funding Awaits
            </h2>
            <div className='space-y-4'>
              {prizeTiers.map((tier) => (
                <div
                  key={tier.place}
                  className='rounded-2xl border border-white/10 bg-black/40 p-5 shadow-inner shadow-blue-950/30'
                >
                  <h3 className='text-base font-semibold text-amber-200'>
                    {tier.place}
                  </h3>
                  <p className='mt-1 text-sm font-semibold text-white'>
                    {tier.reward}
                  </p>
                  <p className='mt-2 text-sm text-slate-300'>{tier.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id='full-rules'
        className='relative mx-auto max-w-6xl px-6 pb-20 md:pb-24'
      >
        <div className='space-y-8 rounded-[44px] border border-white/10 bg-black/70 p-10 shadow-[0_45px_140px_rgba(2,6,23,0.65)] backdrop-blur'>
          <div className='text-center md:text-left'>
            <p className='text-xs uppercase tracking-[0.32em] text-slate-200'>
              Full Playbook
            </p>
            <h2 className='mt-3 text-3xl font-semibold text-white md:text-4xl'>
              Tournament Rules & Terms
            </h2>
            <p className='mt-3 max-w-3xl text-sm leading-relaxed text-slate-300 md:text-base'>
              Internalize every line before execution. Violations trigger
              instant removal — no resets, no second chances.
            </p>
          </div>

          <div className='grid gap-5 md:grid-cols-2'>
            {ruleSections.map((section) => (
              <div
                key={section.title}
                className='rounded-3xl border border-white/10 bg-black/50 p-6 shadow-inner shadow-blue-950/30'
              >
                <h3 className='text-lg font-semibold text-amber-200'>
                  {section.title}
                </h3>
                <div className='mt-3 space-y-3 text-sm leading-relaxed text-slate-300 md:text-base'>
                  {section.body.split('\n').map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='relative mx-auto max-w-5xl px-6 pb-24 md:pb-32'>
        <div className='grid gap-8 rounded-[40px] border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-white/5 p-10 shadow-[0_40px_120px_rgba(15,23,42,0.55)] backdrop-blur md:grid-cols-[1.1fr_0.9fr]'>
          <div className='space-y-6'>
            <p className='text-xs uppercase tracking-[0.32em] text-sky-200'>
              Need Backup?
            </p>
            <h2 className='text-3xl font-semibold text-white md:text-4xl'>
              The Nexus Support Deck
            </h2>
            <p className='text-sm leading-relaxed text-slate-300 md:text-base'>
              Stay connected to the mothership. We keep the comms open so you
              can focus on trading with clarity.
            </p>
            <div className='space-y-4'>
              {supportLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                  className='flex flex-col gap-1 rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-left transition hover:border-white/20'
                >
                  <span className='text-sm font-semibold text-white'>
                    {link.label}
                  </span>
                  <span className='text-xs uppercase tracking-[0.24em] text-slate-400'>
                    Stay linked
                  </span>
                  <span className='text-sm text-slate-300'>
                    {link.description}
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className='flex flex-col justify-between space-y-6 rounded-[32px] border border-white/10 bg-black/60 p-8 shadow-[0_35px_120px_rgba(2,6,23,0.6)]'>
            <div className='space-y-3'>
              <p className='text-xs uppercase tracking-[0.32em] text-amber-200'>
                Final Check
              </p>
              <h3 className='text-2xl font-semibold text-white'>
                Ready to Deploy?
              </h3>
              <p className='text-sm leading-relaxed text-slate-300 md:text-base'>
                Double-check your verification, prepare your trading plan, and
                step into the arena with intent.
              </p>
            </div>
            <div className='flex flex-col gap-3'>
              <Link
                href='/register'
                target='_blank'
                rel='noopener noreferrer'
                prefetch={false}
                className='inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 via-fuchsia-500 to-blue-500 px-6 py-3 text-sm font-semibold text-black shadow-[0_22px_60px_rgba(236,72,153,0.3)] transition hover:scale-[1.03]'
              >
                Secure My Spot
              </Link>
              <Link
                href='/'
                prefetch={false}
                className='inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/40'
              >
                Back to Nexus HQ
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
