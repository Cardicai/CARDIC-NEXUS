'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import CompetitionStatus from '@/components/CompetitionStatus';

const welcomeMessages = [
  'Welcome back to the Nexus. Your execution room is live.',
  'Precision trading never sleeps — see what the desk prepared for you.',
  'Every session counts. Let Cardic Nexus sharpen your next move.',
  'Compete, automate, and scale. The Nexus team is standing by.',
];

const assetSeeds = [
  {
    symbol: 'BTC/USDT',
    price: 64125.32,
    decimals: 2,
    volatility: 85,
    delta: 0,
    direction: 'up',
  },
  {
    symbol: 'ETH/USDT',
    price: 3251.48,
    decimals: 2,
    volatility: 12,
    delta: 0,
    direction: 'up',
  },
  {
    symbol: 'XAU/USD',
    price: 2365.9,
    decimals: 1,
    volatility: 1.4,
    delta: 0,
    direction: 'down',
  },
  {
    symbol: 'US30',
    price: 38952,
    decimals: 0,
    volatility: 18,
    delta: 0,
    direction: 'up',
  },
  {
    symbol: 'GBP/JPY',
    price: 192.48,
    decimals: 2,
    volatility: 0.22,
    delta: 0,
    direction: 'down',
  },
];

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
  {
    label: 'Trading Hub',
    title: 'Access the Nexus Command Center',
    description:
      'Sync bots, analytics, and private lounges that power the community-grade trading experience day and night.',
    href: '#trading-hub',
    accent: 'from-emerald-400/80 via-teal-500/80 to-blue-500/80',
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

const competitionHighlights = [
  {
    heading: 'Simulated $10,000 Accounts',
    description:
      'Trade on MT4/MT5 with real-time liquidity to prove your edge without risking capital while you climb the rankings.',
  },
  {
    heading: 'Weekly Eliminations',
    description:
      'Hold discipline through every cut. ROI and drawdown compliance decide who survives into the Top 50 finale.',
  },
  {
    heading: 'Instant Funded Accounts',
    description:
      'Secure $30K in instant funding across the podium placements plus lifetime VIP utility for the Top 10.',
  },
  {
    heading: 'Live Analytics Dashboard',
    description:
      'Monitor leaderboards, violations, and verification status in a single HQ synced across desktop and mobile.',
  },
];

const automationStacks = [
  {
    name: 'Sentinel Scalper',
    focus:
      'Adaptive London & New York session scalping with volatility throttles and liquidity sweeps baked in.',
    metric: 'Average execution latency under 40ms mirrored from Nexus servers.',
  },
  {
    name: 'Nebula Swing Bot',
    focus:
      'AI-assisted swing logic blending SMC, Fibonacci clusters, and macro sentiment reads.',
    metric:
      'Targets a 1.5R risk profile with auto journaling to the Trading Hub vault.',
  },
  {
    name: 'Flux Arbitrage Radar',
    focus:
      'Cross-asset imbalance detection piping premium alerts into manual or automated entries.',
    metric:
      'Covers 12+ markets with spread protection and compliance failsafes.',
  },
];

const automationPromises = [
  'One-click MT4/MT5 deployment with remote oversight from the Nexus desk.',
  'Risk parameters locked with daily kill-switches to stay inside prop rules.',
  'Continuous telemetry piped into the Trading Hub vault for review.',
];

const tradingHubHighlights = [
  {
    title: 'Signal War Room',
    description:
      'Livestreamed heat maps, execution checklists, and squad-based trade calls synced with the Nexus calendar.',
  },
  {
    title: 'Social Ladder',
    description:
      'Rank-gated lounges, accountability pods, and performance spotlights that celebrate each milestone.',
  },
  {
    title: 'Performance Vault',
    description:
      'Automatic journaling, payout planners, and prop firm trackers — all in one dark-mode analytics cockpit.',
  },
];

const testimonialQuotes = [
  {
    quote:
      'The Nexus bots and indicator stack cut my prep time in half. Execution feels cinematic and controlled.',
    author: 'Amelia K.',
    role: 'Funded FX Trader',
  },
  {
    quote:
      'Competition nights inside the Trading Hub are electric. Support is instant and the analytics are next level.',
    author: 'Leon M.',
    role: 'Top 20 Leaderboard Finalist',
  },
  {
    quote:
      'Our IB revenues tripled after aligning with Nexus funnels. The brand presence alone is a conversion machine.',
    author: 'Sasha R.',
    role: 'Nexus Partner',
  },
];

export default function CardicNexusLanding() {
  const [assetStream, setAssetStream] = useState(assetSeeds);
  const [welcomeIndex, setWelcomeIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setAssetStream((prev) =>
        prev.map((asset) => {
          const drift = (Math.random() - 0.48) * asset.volatility;
          const rawNext = asset.price + drift;
          const minFloor = asset.decimals === 0 ? 10 : 0.1;
          const next = Math.max(rawNext, minFloor);
          const formatted = Number(next.toFixed(asset.decimals));
          const delta = Number(
            (formatted - asset.price).toFixed(asset.decimals)
          );
          return {
            ...asset,
            price: formatted,
            delta,
            direction: delta >= 0 ? 'up' : 'down',
          };
        })
      );
    }, 2400);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setWelcomeIndex((index) => (index + 1) % welcomeMessages.length);
    }, 4600);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const feedbackTicker = useMemo(() => {
    const baseQuotes = testimonialQuotes.map(
      (item) => `“${item.quote}” — ${item.author}, ${item.role}`
    );
    return [
      ...baseQuotes,
      '“Cardic Nexus signals helped me pass Phase 2 in 11 days.” — Priya N., Funded Trader',
      '“Our desk automation stays compliant because the Nexus team hard-codes the risk.” — Marco D., Prop Desk Lead',
      '“Weekly competition calls rebuilt my confidence after a losing quarter.” — Isabelle F., Futures Trader',
    ];
  }, []);

  const marqueeAssets = useMemo(
    () => [...assetStream, ...assetStream],
    [assetStream]
  );
  const marqueeFeedback = useMemo(
    () => [...feedbackTicker, ...feedbackTicker],
    [feedbackTicker]
  );

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

        <div className='mx-auto flex w-full max-w-5xl flex-col gap-5'>
          <div className='rounded-3xl border border-white/10 bg-black/40 p-6 text-center shadow-[0_24px_80px_rgba(14,23,42,0.45)] backdrop-blur'>
            <span className='text-[10px] uppercase tracking-[0.38em] text-amber-100'>
              Welcome Broadcast
            </span>
            <p
              key={welcomeIndex}
              className='welcomePhrase mt-3 text-base font-medium text-slate-100 md:text-lg'
            >
              {welcomeMessages[welcomeIndex]}
            </p>
          </div>

          <div className='rounded-3xl border border-sky-500/20 bg-sky-500/10 p-5 shadow-[0_30px_90px_rgba(14,23,42,0.45)] backdrop-blur'>
            <div className='mb-3 flex flex-wrap items-center justify-between gap-3 text-[10px] uppercase tracking-[0.32em] text-sky-100/80'>
              <span>Live Trading Board</span>
              <span>BTC • ETH • XAU • US30 • FX</span>
            </div>
            <div
              className='marketTicker'
              role='marquee'
              aria-label='Live market prices for key assets'
            >
              <div className='marketTickerTrack'>
                {marqueeAssets.map((asset, index) => {
                  const formattedPrice = asset.price.toLocaleString(undefined, {
                    minimumFractionDigits: asset.decimals,
                    maximumFractionDigits: asset.decimals,
                  });
                  const deltaValue = Math.abs(asset.delta).toFixed(
                    asset.decimals
                  );
                  return (
                    <div
                      className='marketTickerItem'
                      key={`${asset.symbol}-${index}`}
                    >
                      <span className='marketTickerSymbol'>{asset.symbol}</span>
                      <span className='marketTickerPrice'>
                        ${formattedPrice}
                      </span>
                      <span
                        className={`marketTickerChange ${
                          asset.direction === 'up'
                            ? 'up'
                            : asset.direction === 'down'
                            ? 'down'
                            : ''
                        }`}
                      >
                        {asset.direction === 'up'
                          ? '▲'
                          : asset.direction === 'down'
                          ? '▼'
                          : '•'}{' '}
                        {deltaValue}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className='rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_30px_90px_rgba(14,23,42,0.45)] backdrop-blur'>
            <div className='mb-3 flex flex-wrap items-center justify-between gap-3 text-[10px] uppercase tracking-[0.32em] text-amber-100/80'>
              <span>Community Voices</span>
              <span>Real Nexus Wins</span>
            </div>
            <div
              className='feedbackTicker'
              role='marquee'
              aria-label='Trader feedback from Cardic Nexus members'
            >
              <div className='feedbackTickerTrack'>
                {marqueeFeedback.map((quote, index) => (
                  <span
                    key={`feedback-${index}`}
                    className='feedbackTickerItem'
                  >
                    {quote}
                  </span>
                ))}
              </div>
            </div>
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
        <div className='grid gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-4'>
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

      <section
        id='indicator'
        className='relative mx-auto max-w-6xl space-y-12 px-6 pb-20 md:pb-24'
      >
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

      <section
        id='bots'
        className='relative mx-auto max-w-6xl px-6 pb-20 md:pb-24'
      >
        <div className='grid gap-10 rounded-[40px] border border-white/10 bg-gradient-to-br from-white/5 via-black/50 to-black/70 p-10 shadow-[0_45px_140px_rgba(2,6,23,0.65)] backdrop-blur-lg md:grid-cols-[1fr_1.1fr]'>
          <div className='space-y-6'>
            <p className='text-xs uppercase tracking-[0.32em] text-emerald-200'>
              Automation Arsenal
            </p>
            <h2 className='text-3xl font-semibold text-white md:text-4xl'>
              Deploy Bots With Nexus Oversight
            </h2>
            <p className='text-sm leading-relaxed text-slate-300 md:text-base'>
              The Nexus automation desk curates algorithmic suites that respect
              prop firm parameters while keeping execution razor sharp. Blend
              them with your discretionary flow or let them feed the Trading Hub
              analytics in real time.
            </p>
            <ul className='space-y-3 text-sm text-slate-200 md:text-base'>
              {automationPromises.map((promise) => (
                <li key={promise} className='flex items-start gap-3'>
                  <span className='mt-1 h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.6)]' />
                  <span>{promise}</span>
                </li>
              ))}
            </ul>
            <a
              href='https://t.me/cardicnexus'
              target='_blank'
              rel='noreferrer'
              className='inline-flex w-fit items-center justify-center rounded-full border border-emerald-400/70 bg-emerald-500/10 px-6 py-3 text-sm font-semibold text-emerald-200 shadow-[0_0_35px_rgba(16,185,129,0.25)] transition hover:bg-emerald-500/20'
            >
              Request Bot Onboarding
            </a>
          </div>

          <div className='grid gap-4'>
            {automationStacks.map((bot) => (
              <div
                key={bot.name}
                className='relative overflow-hidden rounded-3xl border border-white/10 bg-black/60 p-6 shadow-[0_30px_110px_rgba(15,23,42,0.55)]'
              >
                <div className='flex items-center justify-between gap-4'>
                  <h3 className='text-xl font-semibold text-white'>
                    {bot.name}
                  </h3>
                  <span className='rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-slate-300'>
                    Bot
                  </span>
                </div>
                <p className='mt-3 text-sm leading-relaxed text-slate-300'>
                  {bot.focus}
                </p>
                <p className='mt-4 text-xs uppercase tracking-[0.28em] text-emerald-200'>
                  {bot.metric}
                </p>
                <div className='pointer-events-none absolute inset-0 -z-[1] opacity-0 transition duration-300 hover:opacity-100 bg-[radial-gradient(circle_at_20%_-10%,rgba(16,185,129,0.25),transparent_55%),radial-gradient(circle_at_80%_120%,rgba(59,130,246,0.2),transparent_60%)]' />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id='trading-hub'
        className='relative mx-auto max-w-6xl px-6 pb-20 md:pb-24'
      >
        <div className='space-y-10 rounded-[44px] border border-white/10 bg-black/60 p-10 shadow-[0_45px_140px_rgba(2,6,23,0.65)] backdrop-blur'>
          <div className='text-center md:text-left'>
            <p className='text-xs uppercase tracking-[0.32em] text-sky-200'>
              Nexus Trading Hub
            </p>
            <h2 className='mt-3 text-3xl font-semibold text-white md:text-4xl'>
              Your Always-On Command Center
            </h2>
            <p className='mt-3 max-w-3xl text-sm leading-relaxed text-slate-300 md:text-base'>
              Step into the dark-mode lounge where signals, bots, and community
              strategies merge. The Trading Hub keeps every team member aligned
              with synchronized calendars, automated journaling, and curated
              mentorship.
            </p>
          </div>

          <div className='grid gap-6 md:grid-cols-3'>
            {tradingHubHighlights.map((item) => (
              <div
                key={item.title}
                className='rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-white/5 p-6 text-left shadow-lg shadow-blue-950/30'
              >
                <h3 className='text-lg font-semibold text-sky-200'>
                  {item.title}
                </h3>
                <p className='mt-3 text-sm leading-relaxed text-slate-300'>
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className='flex flex-col items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-center shadow-inner shadow-blue-950/40 md:flex-row md:text-left'>
            <div>
              <h3 className='text-2xl font-semibold text-white'>
                Join the Trading Hub
              </h3>
              <p className='mt-2 max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base'>
                Early members receive premium indicator unlocks, bot credits,
                and direct access to the Nexus mentors.
              </p>
            </div>
            <div className='flex flex-col gap-3 sm:flex-row'>
              <Link
                href='/register'
                prefetch={false}
                className='inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-400 via-teal-500 to-blue-500 px-6 py-3 text-sm font-semibold text-black shadow-[0_20px_45px_rgba(13,148,136,0.28)] transition hover:scale-[1.03]'
              >
                Join the Waitlist
              </Link>
              <a
                href='https://t.me/cardicnexus'
                target='_blank'
                rel='noreferrer'
                className='inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/40'
              >
                View Community Feed
              </a>
            </div>
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

          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
            {competitionHighlights.map((perk) => (
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

      <section className='relative mx-auto max-w-6xl px-6 pb-20 md:pb-28'>
        <div className='space-y-10 rounded-[44px] border border-white/10 bg-gradient-to-br from-white/5 via-black/40 to-black/70 p-10 shadow-[0_45px_140px_rgba(15,23,42,0.65)] backdrop-blur'>
          <div className='text-center md:text-left'>
            <p className='text-xs uppercase tracking-[0.32em] text-amber-200'>
              Voices from the Nexus
            </p>
            <h2 className='mt-3 text-3xl font-semibold text-white md:text-4xl'>
              Community Proof & Momentum
            </h2>
            <p className='mt-3 max-w-3xl text-sm leading-relaxed text-slate-300 md:text-base'>
              Traders, partners, and builders continue to rally around the Nexus
              ecosystem. Here’s what they say after plugging into the dark-mode
              HQ.
            </p>
          </div>

          <div className='grid gap-6 md:grid-cols-3'>
            {testimonialQuotes.map((quote) => (
              <div
                key={quote.author}
                className='flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-black/60 p-6 shadow-[0_30px_100px_rgba(2,6,23,0.6)]'
              >
                <p className='text-sm leading-relaxed text-slate-200 md:text-base'>
                  “{quote.quote}”
                </p>
                <div className='mt-6 space-y-1 text-sm'>
                  <span className='block font-semibold text-white'>
                    {quote.author}
                  </span>
                  <span className='block text-xs uppercase tracking-[0.28em] text-slate-400'>
                    {quote.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='relative mx-auto max-w-5xl px-6 pb-24 md:pb-32'>
        <div className='relative overflow-hidden rounded-[46px] border border-white/10 bg-gradient-to-br from-amber-400/20 via-transparent to-blue-500/20 p-10 text-center shadow-[0_45px_140px_rgba(14,165,233,0.45)] md:text-left'>
          <div className='pointer-events-none absolute inset-0 -z-[1] bg-[radial-gradient(circle_at_10%_20%,rgba(245,199,107,0.25),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.28),transparent_65%)]' />
          <div className='flex flex-col gap-6 md:flex-row md:items-center md:justify-between'>
            <div className='space-y-4'>
              <p className='text-xs uppercase tracking-[0.32em] text-slate-200'>
                Reignite Your Trading Empire
              </p>
              <h2 className='text-3xl font-semibold text-white md:text-4xl'>
                CARDIC NEXUS is fully back online
              </h2>
              <p className='max-w-2xl text-sm leading-relaxed text-slate-200 md:text-base'>
                Claim your seat, sync the bots, and march toward funded status
                with a community engineered for relentless improvement.
              </p>
            </div>
            <div className='flex flex-col gap-3 sm:flex-row'>
              <Link
                href='/register'
                target='_blank'
                rel='noopener noreferrer'
                prefetch={false}
                className='inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 via-fuchsia-500 to-blue-500 px-6 py-3 text-sm font-semibold text-black shadow-[0_22px_60px_rgba(236,72,153,0.3)] transition hover:scale-[1.03]'
              >
                Secure My Access
              </Link>
              <Link
                href='/competition'
                prefetch={false}
                className='inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/40'
              >
                Review Competition Rules
              </Link>
            </div>
          </div>
        </div>
      </section>
      <style jsx>{`
        .marketTicker {
          position: relative;
          overflow: hidden;
        }
        .marketTickerTrack {
          display: inline-flex;
          align-items: center;
          gap: 24px;
          animation: tickerScroll 26s linear infinite;
          min-width: 100%;
          white-space: nowrap;
        }
        .marketTicker:hover .marketTickerTrack {
          animation-play-state: paused;
        }
        .marketTickerItem {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          padding: 0 18px;
          border-radius: 999px;
          background: rgba(3, 7, 18, 0.45);
          border: 1px solid rgba(59, 130, 246, 0.22);
          backdrop-filter: blur(8px);
        }
        .marketTickerSymbol {
          font-size: 12px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(186, 230, 253, 0.9);
        }
        .marketTickerPrice {
          font-size: 16px;
          font-weight: 700;
          color: #f8fafc;
        }
        .marketTickerChange {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.08em;
        }
        .marketTickerChange.up {
          color: #4ade80;
        }
        .marketTickerChange.down {
          color: #f87171;
        }
        .feedbackTicker {
          position: relative;
          overflow: hidden;
        }
        .feedbackTickerTrack {
          display: inline-flex;
          gap: 32px;
          white-space: nowrap;
          animation: tickerScroll 40s linear infinite;
          min-width: 100%;
        }
        .feedbackTicker:hover .feedbackTickerTrack {
          animation-play-state: paused;
        }
        .feedbackTickerItem {
          font-size: 14px;
          color: rgba(226, 232, 240, 0.88);
        }
        .welcomePhrase {
          animation: welcomeFade 0.6s ease;
        }
        @keyframes tickerScroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        @keyframes welcomeFade {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (max-width: 768px) {
          .marketTickerTrack {
            gap: 16px;
          }
          .marketTickerItem {
            padding: 0 14px;
          }
          .feedbackTickerTrack {
            gap: 22px;
          }
        }
      `}</style>
    </div>
  );
}
