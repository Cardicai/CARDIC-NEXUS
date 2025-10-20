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
    title: 'Week 1 complete',
    detail:
      'Top traders locked in early gains. Maintain discipline ahead of the first elimination.',
  },
  {
    title: 'Next milestone',
    detail:
      'Upload trade journals before Friday 18:00 UTC to stay eligible for spotlight features.',
  },
];

export default function DashboardPage() {
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
    <div className='relative min-h-screen overflow-hidden px-6 pb-24 pt-20 text-white md:pt-28'>
      <div className='pointer-events-none absolute inset-0 -z-[1] bg-[radial-gradient(circle_at_20%_20%,rgba(14,165,233,0.25),transparent_55%),_radial-gradient(circle_at_75%_10%,rgba(129,140,248,0.3),transparent_55%),_radial-gradient(circle_at_50%_80%,rgba(250,204,21,0.22),transparent_55%)]' />
      <div className='mx-auto flex max-w-6xl flex-col gap-12'>
        <header className='space-y-6 text-center md:text-left'>
          <p className='inline-flex w-fit items-center justify-center rounded-full border border-cyan-400/50 bg-cyan-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-100'>
            Dashboard Preview
          </p>
          <h1 className='text-balance text-4xl font-black tracking-tight text-white drop-shadow-[0_0_40px_rgba(59,130,246,0.35)] md:text-5xl'>
            Welcome to the Cardic Nexus Tournament Dashboard
          </h1>
          <p className='mx-auto max-w-3xl text-lg leading-relaxed text-slate-200 md:mx-0 md:text-xl'>
            Monitor your metrics, track leaderboard momentum, and stay on top of
            critical announcements. This space keeps every competitor aligned
            with the rules, rewards, and schedule.
          </p>
          <div className='flex flex-wrap justify-center gap-4 md:justify-start'>
            <Link
              href='/'
              className='inline-flex items-center justify-center rounded-full border border-amber-400/70 bg-amber-500/10 px-6 py-2 text-sm font-semibold text-amber-200 transition hover:bg-amber-400/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200'
            >
              ← Back to Landing Page
            </Link>
            <a
              href='mailto:support@cardicnexusglobal.com'
              className='inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500 px-6 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(56,189,248,0.35)] transition hover:scale-105 hover:shadow-[0_14px_45px_rgba(129,140,248,0.4)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-200'
            >
              Contact Support
            </a>
          </div>
        </header>

        <section className='grid gap-6 md:grid-cols-2 xl:grid-cols-4'>
          <article className='rounded-3xl border border-amber-400/50 bg-amber-500/10 p-6 shadow-lg shadow-amber-900/30 backdrop-blur'>
            <h2 className='text-sm font-semibold uppercase tracking-wide text-amber-200'>
              ROI %
            </h2>
            <p className='mt-4 text-4xl font-black text-amber-100'>+12.8%</p>
            <p className='mt-3 text-sm text-amber-100/80'>
              Update after each trading session closes.
            </p>
          </article>
          <article className='rounded-3xl border border-sky-400/50 bg-sky-500/10 p-6 shadow-lg shadow-sky-900/40 backdrop-blur'>
            <h2 className='text-sm font-semibold uppercase tracking-wide text-sky-200'>
              Drawdown %
            </h2>
            <p className='mt-4 text-4xl font-black text-sky-100'>4.6%</p>
            <p className='mt-3 text-sm text-sky-100/80'>
              Stay below 5% daily and 10% overall to remain safe.
            </p>
          </article>
          <article className='rounded-3xl border border-purple-400/50 bg-purple-500/10 p-6 shadow-lg shadow-purple-900/40 backdrop-blur'>
            <h2 className='text-sm font-semibold uppercase tracking-wide text-purple-200'>
              Status
            </h2>
            <p className='mt-4 text-4xl font-black text-purple-100'>ACTIVE</p>
            <p className='mt-3 text-sm text-purple-100/80'>
              Keep trading with discipline to defend your slot.
            </p>
          </article>
          <article className='rounded-3xl border border-cyan-400/60 bg-cyan-500/10 p-6 shadow-lg shadow-cyan-900/40 backdrop-blur'>
            <h2 className='text-sm font-semibold uppercase tracking-wide text-cyan-200'>
              Next Elimination
            </h2>
            <div className='mt-4 flex items-center gap-4 text-cyan-100'>
              {(['days', 'hours', 'minutes', 'seconds'] as const).map(
                (unit) => (
                  <div
                    key={unit}
                    className='flex flex-col items-center rounded-2xl bg-black/40 px-4 py-3 shadow-inner shadow-black/40'
                  >
                    <span className='text-3xl font-bold'>
                      {countdown[unit]}
                    </span>
                    <span className='text-[10px] font-semibold uppercase tracking-widest text-cyan-200/70'>
                      {unit}
                    </span>
                  </div>
                )
              )}
            </div>
            <p className='mt-3 text-sm text-cyan-100/80'>
              Countdown auto-refreshes every second.
            </p>
          </article>
        </section>

        <section className='grid gap-8 lg:grid-cols-[1.1fr_0.9fr]'>
          <div className='rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-blue-950/40 backdrop-blur'>
            <div className='flex items-center justify-between gap-4'>
              <h2 className='text-2xl font-semibold text-white'>
                Leaderboard Preview
              </h2>
              <span className='rounded-full border border-white/20 bg-black/30 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200'>
                Top 5
              </span>
            </div>
            <div className='mt-6 overflow-hidden rounded-2xl border border-white/10'>
              <table className='min-w-full divide-y divide-white/5 text-left text-sm text-slate-200'>
                <thead className='bg-white/5 text-xs uppercase tracking-widest text-slate-200/80'>
                  <tr>
                    <th scope='col' className='px-4 py-3'>
                      Rank
                    </th>
                    <th scope='col' className='px-4 py-3'>
                      Trader
                    </th>
                    <th scope='col' className='px-4 py-3'>
                      ROI
                    </th>
                    <th scope='col' className='px-4 py-3'>
                      Drawdown
                    </th>
                    <th scope='col' className='px-4 py-3'>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-white/5 bg-black/30'>
                  {leaderboardPreview.map((entry) => (
                    <tr
                      key={entry.rank}
                      className='transition hover:bg-cyan-500/10'
                    >
                      <td className='px-4 py-3 font-semibold text-slate-100'>
                        {entry.rank}
                      </td>
                      <td className='px-4 py-3 font-medium text-white'>
                        {entry.trader}
                      </td>
                      <td className='px-4 py-3 text-emerald-300'>
                        {entry.roi}
                      </td>
                      <td className='px-4 py-3 text-rose-300'>
                        {entry.drawdown}
                      </td>
                      <td className='px-4 py-3'>
                        <span
                          className={
                            entry.status === 'Safe'
                              ? 'rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-200'
                              : 'rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-200'
                          }
                        >
                          {entry.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className='mt-4 text-sm text-slate-200/80'>
              Final rankings are determined by ROI while respecting all risk
              parameters. Eliminations strike every week — stay ahead of the
              curve.
            </p>
          </div>

          <div className='space-y-8'>
            <article className='rounded-3xl border border-purple-400/40 bg-purple-500/10 p-8 shadow-xl shadow-purple-950/40 backdrop-blur'>
              <h2 className='text-2xl font-semibold text-white'>
                Rules Refresher
              </h2>
              <ul className='mt-4 space-y-3 text-sm text-slate-200'>
                <li>⚖️ Maximum daily drawdown: 5% • Overall drawdown: 10%</li>
                <li>📈 Minimum trading days: 10 within the month</li>
                <li>
                  🤖 EAs allowed — only if verified by the Cardic Nexus team
                </li>
                <li>
                  🚫 No copy trading, martingale, grid, or arbitrage systems
                </li>
                <li>✅ Every trade must be placed with a stop-loss</li>
              </ul>
            </article>

            <article className='rounded-3xl border border-cyan-400/40 bg-cyan-500/10 p-8 shadow-xl shadow-cyan-950/40 backdrop-blur'>
              <h2 className='text-2xl font-semibold text-white'>
                Announcements
              </h2>
              <div className='mt-4 space-y-4'>
                {announcements.map((announcement) => (
                  <div
                    key={announcement.title}
                    className='rounded-2xl border border-white/10 bg-black/30 p-4'
                  >
                    <h3 className='text-lg font-semibold text-cyan-100'>
                      {announcement.title}
                    </h3>
                    <p className='mt-2 text-sm text-slate-200'>
                      {announcement.detail}
                    </p>
                  </div>
                ))}
              </div>
              <p className='mt-4 text-xs uppercase tracking-wide text-cyan-100/70'>
                Stay tuned via email and Telegram for real-time alerts.
              </p>
            </article>
          </div>
        </section>
      </div>
    </div>
  );
}
