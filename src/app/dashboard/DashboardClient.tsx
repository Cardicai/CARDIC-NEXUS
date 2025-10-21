'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

type Countdown = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

const formatNumber = (value: number) => value.toString().padStart(2, '0');

const calculateCountdown = (target: number): Countdown => {
  const now = Date.now();
  const diff = Math.max(target - now, 0);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return {
    days: formatNumber(days),
    hours: formatNumber(hours),
    minutes: formatNumber(minutes),
    seconds: formatNumber(seconds),
  };
};

const metricCards = [
  {
    title: 'ROI PERFORMANCE',
    metric: '+12.8%',
    description:
      'Daily snapshot captured at 22:00 UTC after trade desk reconciliation.',
    chip: 'ROI',
    tone: 'text-emerald-300',
    border: 'border-emerald-400/30',
    glow: 'from-emerald-400/25 via-emerald-500/10 to-transparent',
  },
  {
    title: 'RISK EXPOSURE',
    metric: '4.6%',
    description:
      'Maintain daily drawdown under 5% and total loss under 10% to remain eligible.',
    chip: 'DD',
    tone: 'text-sky-300',
    border: 'border-sky-400/30',
    glow: 'from-sky-500/20 via-cyan-500/10 to-transparent',
  },
  {
    title: 'ACCOUNT STATUS',
    metric: 'ACTIVE',
    description:
      'Compliance verified. Continue submitting journal entries and trade records.',
    chip: 'Status',
    tone: 'text-indigo-200',
    border: 'border-indigo-400/30',
    glow: 'from-indigo-500/20 via-violet-500/10 to-transparent',
  },
];

const leaderboardPreview = [
  {
    rank: 1,
    trader: 'AstraFX',
    roi: '+18.4%',
    drawdown: '3.1%',
    status: 'Safe',
  },
  {
    rank: 2,
    trader: 'LiquidityWolf',
    roi: '+16.7%',
    drawdown: '4.2%',
    status: 'Safe',
  },
  {
    rank: 3,
    trader: 'GoldMaverick',
    roi: '+14.2%',
    drawdown: '2.6%',
    status: 'Safe',
  },
  {
    rank: 4,
    trader: 'PipGuardian',
    roi: '+11.5%',
    drawdown: '5.0%',
    status: 'Watch',
  },
  {
    rank: 5,
    trader: 'CipherFlow',
    roi: '+9.8%',
    drawdown: '4.8%',
    status: 'Watch',
  },
];

const announcements = [
  {
    title: 'Week 1 performance review',
    detail:
      'Top traders locked in early gains. Maintain discipline ahead of the first elimination window.',
  },
  {
    title: 'Next milestone',
    detail:
      'Upload trade journals before Friday 18:00 UTC to stay eligible for spotlight coverage.',
  },
];

export default function DashboardClient() {
  const eliminationTimestamp = useMemo(() => {
    const fallback = new Date();
    fallback.setDate(fallback.getDate() + 4);
    fallback.setHours(18, 0, 0, 0);
    return fallback.getTime();
  }, []);

  const [countdown, setCountdown] = useState<Countdown>(() =>
    calculateCountdown(eliminationTimestamp)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(calculateCountdown(eliminationTimestamp));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [eliminationTimestamp]);

  return (
    <div className='relative min-h-screen overflow-hidden bg-slate-950 px-6 pb-24 pt-20 text-slate-100 md:pt-28'>
      <div className='pointer-events-none absolute inset-0 -z-[2] bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.15),transparent_60%),_radial-gradient(circle_at_80%_15%,rgba(129,140,248,0.2),transparent_60%),_radial-gradient(circle_at_50%_85%,rgba(217,119,6,0.18),transparent_55%)]' />
      <div className='pointer-events-none absolute inset-0 -z-[1] bg-gradient-to-b from-slate-950 via-slate-950/95 to-slate-950' />
      <div className='mx-auto flex max-w-6xl flex-col gap-14'>
        <header className='grid gap-12 lg:grid-cols-[minmax(0,3fr),minmax(0,2fr)] lg:items-center'>
          <div className='space-y-8 text-center lg:text-left'>
            <p className='mx-auto inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-slate-300/80 lg:mx-0'>
              Dashboard Preview
            </p>
            <div className='space-y-5'>
              <h1 className='text-balance text-4xl font-semibold tracking-tight text-white md:text-5xl'>
                Welcome to the Cardic Nexus Tournament Command Center
              </h1>
              <p className='mx-auto max-w-2xl text-lg leading-relaxed text-slate-300 md:mx-0 md:text-xl'>
                Monitor live trading health, leaderboard velocity, and official
                communications from a single, disciplined workspace designed for
                funded-trader readiness.
              </p>
            </div>
            <div className='flex flex-wrap justify-center gap-4 lg:justify-start'>
              <Link
                href='/'
                className='inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-2 text-sm font-semibold text-slate-100 transition hover:border-white/20 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200'
              >
                ← Back to Landing Page
              </Link>
              <a
                href='https://t.me/JOKESTERFX'
                target='_blank'
                rel='noreferrer'
                className='inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 px-6 py-2 text-sm font-semibold text-white shadow-[0_20px_45px_rgba(56,189,248,0.35)] transition hover:scale-[1.02] hover:shadow-[0_26px_65px_rgba(129,140,248,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-200'
              >
                Contact Support
              </a>
            </div>
          </div>
          <div className='space-y-5 rounded-3xl border border-white/10 bg-white/5 p-6 text-left shadow-[0_25px_60px_rgba(2,6,23,0.45)] backdrop-blur'>
            <p className='text-xs font-semibold uppercase tracking-[0.35em] text-slate-300/80'>
              Operational snapshot
            </p>
            <div className='space-y-4 text-sm leading-relaxed text-slate-300'>
              <p>
                Participants track ROI, drawdown, and elimination windows here
                before results sync to the official leaderboard.
              </p>
              <p className='flex items-center gap-3 text-slate-200'>
                <span className='inline-flex h-9 w-9 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200'>
                  Live
                </span>
                The desk reconciles new fills hourly, keeping standings and
                alerts consistent across the tournament.
              </p>
              <p className='text-slate-400'>
                Stay subscribed to announcements for rule updates and drawdown
                policy reminders.
              </p>
            </div>
          </div>
        </header>

        <section className='grid gap-6 md:grid-cols-2 xl:grid-cols-4'>
          {metricCards.map((card) => (
            <article
              key={card.title}
              className={`group relative overflow-hidden rounded-3xl border ${card.border} bg-slate-900/60 p-6 shadow-[0_20px_45px_rgba(2,6,23,0.55)] backdrop-blur`}
            >
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.glow} opacity-0 transition group-hover:opacity-100`}
                aria-hidden
              />
              <div className='relative flex h-full flex-col justify-between gap-6'>
                <div>
                  <div className='flex items-center justify-between gap-3'>
                    <p className='text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-slate-300/80'>
                      {card.title}
                    </p>
                    <span className='inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-slate-200'>
                      {card.chip}
                    </span>
                  </div>
                  <p
                    className={`mt-6 text-4xl font-semibold tracking-tight ${card.tone}`}
                  >
                    {card.metric}
                  </p>
                </div>
                <p className='text-sm leading-relaxed text-slate-300/80'>
                  {card.description}
                </p>
              </div>
            </article>
          ))}
          <article className='relative overflow-hidden rounded-3xl border border-sky-400/35 bg-slate-900/60 p-6 shadow-[0_20px_45px_rgba(2,6,23,0.55)] backdrop-blur'>
            <div
              className='pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-500/25 via-indigo-500/10 to-transparent opacity-80'
              aria-hidden
            />
            <div className='relative flex h-full flex-col gap-6'>
              <div className='flex items-center justify-between gap-3'>
                <p className='text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-slate-300/80'>
                  Next elimination
                </p>
                <span className='inline-flex items-center justify-center rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-sky-100'>
                  Live
                </span>
              </div>
              <div className='grid grid-cols-4 gap-3 text-center text-sky-100'>
                <div className='rounded-2xl border border-white/10 bg-white/5 p-3'>
                  <p className='text-2xl font-semibold'>{countdown.days}</p>
                  <p className='mt-1 text-[0.6rem] uppercase tracking-[0.3em] text-slate-300/80'>
                    Days
                  </p>
                </div>
                <div className='rounded-2xl border border-white/10 bg-white/5 p-3'>
                  <p className='text-2xl font-semibold'>{countdown.hours}</p>
                  <p className='mt-1 text-[0.6rem] uppercase tracking-[0.3em] text-slate-300/80'>
                    Hours
                  </p>
                </div>
                <div className='rounded-2xl border border-white/10 bg-white/5 p-3'>
                  <p className='text-2xl font-semibold'>{countdown.minutes}</p>
                  <p className='mt-1 text-[0.6rem] uppercase tracking-[0.3em] text-slate-300/80'>
                    Mins
                  </p>
                </div>
                <div className='rounded-2xl border border-white/10 bg-white/5 p-3'>
                  <p className='text-2xl font-semibold'>{countdown.seconds}</p>
                  <p className='mt-1 text-[0.6rem] uppercase tracking-[0.3em] text-slate-300/80'>
                    Secs
                  </p>
                </div>
              </div>
              <p className='text-sm leading-relaxed text-slate-300/80'>
                Traders with drawdown breaches at this checkpoint transition to
                elimination review.
              </p>
            </div>
          </article>
        </section>

        <section className='grid gap-6 lg:grid-cols-[2fr,1fr]'>
          <article className='rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-[0_24px_60px_rgba(2,6,23,0.5)] backdrop-blur'>
            <div className='flex flex-wrap items-center justify-between gap-4'>
              <h2 className='text-2xl font-semibold text-white'>
                Leaderboard Preview
              </h2>
              <p className='text-sm text-slate-400'>Refreshed hourly</p>
            </div>
            <div className='mt-6 overflow-hidden rounded-2xl border border-white/10'>
              <table className='min-w-full divide-y divide-white/10 text-left text-sm text-slate-100/90'>
                <thead className='bg-white/5 text-[0.65rem] uppercase tracking-[0.3em] text-slate-300/80'>
                  <tr>
                    <th className='px-4 py-3 font-semibold'>Rank</th>
                    <th className='px-4 py-3 font-semibold'>Trader</th>
                    <th className='px-4 py-3 font-semibold'>ROI</th>
                    <th className='px-4 py-3 font-semibold'>Drawdown</th>
                    <th className='px-4 py-3 font-semibold'>Status</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-white/5'>
                  {leaderboardPreview.map((entry) => (
                    <tr
                      key={entry.rank}
                      className='bg-white/5 transition hover:bg-white/10'
                    >
                      <td className='px-4 py-3 font-semibold text-amber-200'>
                        {entry.rank}
                      </td>
                      <td className='px-4 py-3 font-semibold text-white'>
                        {entry.trader}
                      </td>
                      <td className='px-4 py-3 text-emerald-300'>
                        {entry.roi}
                      </td>
                      <td className='px-4 py-3 text-sky-200'>
                        {entry.drawdown}
                      </td>
                      <td className='px-4 py-3 text-purple-200'>
                        {entry.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className='mt-4 text-sm text-slate-400'>
              Full leaderboard analytics unlock once your registration is
              verified and trading credentials are issued.
            </p>
          </article>

          <aside className='grid gap-6'>
            <article className='rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-[0_24px_60px_rgba(2,6,23,0.5)] backdrop-blur'>
              <h2 className='text-xl font-semibold text-white'>
                Rules &amp; Announcements
              </h2>
              <div className='mt-4 space-y-4'>
                {announcements.map((item) => (
                  <div
                    key={item.title}
                    className='rounded-2xl border border-white/10 bg-white/5 p-4'
                  >
                    <h3 className='text-sm font-semibold text-amber-200'>
                      {item.title}
                    </h3>
                    <p className='mt-2 text-sm text-slate-300/80'>
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
              <Link
                href='/#rules'
                className='mt-6 inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-slate-200 transition hover:border-white/30 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200'
              >
                View Full Rulebook
              </Link>
            </article>

            <article className='rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-[0_24px_60px_rgba(2,6,23,0.5)] backdrop-blur'>
              <h2 className='text-xl font-semibold text-white'>Support</h2>
              <p className='mt-3 text-sm text-slate-300/80'>
                Need assistance with submissions or account access? Our desk
                responds within one business day.
              </p>
              <div className='mt-4 space-y-2 text-sm text-slate-200'>
                <p>
                  <span className='font-semibold text-white'>Email:</span>{' '}
                  support@cardicnexusglobal.com
                </p>
                <p>
                  <span className='font-semibold text-white'>Telegram:</span>{' '}
                  <a
                    href='https://t.me/JOKESTERFX'
                    target='_blank'
                    rel='noreferrer'
                    className='text-sky-200 underline-offset-4 transition hover:text-sky-100 hover:underline'
                  >
                    @JOKESTERFX
                  </a>
                </p>
              </div>
            </article>
          </aside>
        </section>
      </div>
    </div>
  );
}
