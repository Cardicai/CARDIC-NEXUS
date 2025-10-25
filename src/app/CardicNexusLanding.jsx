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
    coingeckoId: 'bitcoin',
  },
  {
    symbol: 'ETH/USDT',
    price: 3251.48,
    decimals: 2,
    volatility: 12,
    delta: 0,
    direction: 'up',
    coingeckoId: 'ethereum',
  },
  {
    symbol: 'SOL/USDT',
    price: 182.36,
    decimals: 2,
    volatility: 22,
    delta: 0,
    direction: 'up',
    coingeckoId: 'solana',
  },
  {
    symbol: 'XAU/USD',
    price: 2365.9,
    decimals: 1,
    volatility: 1.4,
    delta: 0,
    direction: 'down',
    cryptoCompareSymbol: 'XAU',
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

const alphaBulletins = [
  {
    title: 'London Session Surge',
    detail:
      'GBP pairs flag elevated momentum while liquidity maps flash amber. Watch for premium retests before the drive.',
    tag: 'FX Pulse',
    cadence: 'High Impact',
  },
  {
    title: 'Wall Street Open Playbook',
    detail:
      'Index bots primed for opening range imbalance. Nebula swing logic aligning with bullish flow on US30.',
    tag: 'Index Flow',
    cadence: 'Medium Impact',
  },
  {
    title: 'Crypto Dominance Reversal',
    detail:
      'BTC and ETH liquidity zones converging — Sentinel scalper ready for mean-reversion spikes on lower timeframes.',
    tag: 'Digital Assets',
    cadence: 'Priority Watch',
  },
  {
    title: 'Metals Risk Radar',
    detail:
      'Gold reacting to macro news. Flux arbitrage radar signalling moderated exposure around the daily key levels.',
    tag: 'Metals Desk',
    cadence: 'Low Impact',
  },
];

const quickLaunchLinks = [
  {
    label: 'Join the Competition',
    description: 'Battle for instant funding and leaderboard glory.',
    href: '/competition',
  },
  {
    label: 'Automation Bots',
    description: 'Deploy Sentinel, Nebula, and Hydra to live markets.',
    href: '/bots',
  },
  {
    label: 'Trading Hub',
    description: 'Command center for analytics, journaling, and lounges.',
    href: '/trading-hub',
  },
  {
    label: 'Premium Indicators',
    description: 'Unlock liquidity maps and institutional-grade signals.',
    href: '/indicators',
  },
  {
    label: 'Priority Support',
    description: 'Get concierge assistance from the Nexus desk.',
    href: '/support',
  },
  {
    label: 'Operations Desk',
    description: 'Review live status metrics and precision commitments.',
    href: '/desk',
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
  const [alphaIndex, setAlphaIndex] = useState(0);
  const bulletinCount = alphaBulletins.length;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setAssetStream((prev) =>
        prev.map((asset) => {
          if (asset.coingeckoId) {
            return asset;
          }

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
            direction: delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat',
          };
        })
      );
    }, 2400);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const cryptoAssets = assetSeeds.filter((asset) => asset.coingeckoId);
    if (cryptoAssets.length === 0) {
      return undefined;
    }

    let active = true;

    const loadPrices = async () => {
      try {
        const ids = cryptoAssets
          .map((asset) => asset.coingeckoId)
          .filter(Boolean)
          .join(',');
        if (!ids) {
          return;
        }

        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`,
          { cache: 'no-store' }
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch market data: ${response.status}`);
        }
        const payload = await response.json();

        if (!active) {
          return;
        }

        setAssetStream((prev) =>
          prev.map((asset) => {
            if (!asset.coingeckoId) {
              return asset;
            }
            const info = payload[asset.coingeckoId];
            if (!info || typeof info.usd !== 'number') {
              return asset;
            }
            const nextPrice = Number(info.usd.toFixed(asset.decimals));
            const delta = asset.price
              ? Number((nextPrice - asset.price).toFixed(asset.decimals))
              : 0;
            return {
              ...asset,
              price: nextPrice,
              delta,
              direction: delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat',
            };
          })
        );
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error('Cardic Nexus market feed error:', error);
        }
      }
    };

    loadPrices();
    const interval = window.setInterval(loadPrices, 60000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const metalAssets = assetSeeds.filter((asset) => asset.cryptoCompareSymbol);
    if (metalAssets.length === 0) {
      return undefined;
    }

    let active = true;

    const loadMetals = async () => {
      try {
        const symbols = metalAssets
          .map((asset) => asset.cryptoCompareSymbol)
          .filter(Boolean)
          .join(',');
        if (!symbols) {
          return;
        }

        const response = await fetch(
          `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${symbols}&tsyms=USD`,
          { cache: 'no-store' }
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch metals data: ${response.status}`);
        }

        const payload = await response.json();
        if (!active) {
          return;
        }

        setAssetStream((prev) =>
          prev.map((asset) => {
            if (!asset.cryptoCompareSymbol) {
              return asset;
            }

            const info = payload[asset.cryptoCompareSymbol];
            if (!info || typeof info.USD !== 'number') {
              return asset;
            }

            const nextPrice = Number(info.USD.toFixed(asset.decimals));
            const delta = asset.price
              ? Number((nextPrice - asset.price).toFixed(asset.decimals))
              : 0;

            return {
              ...asset,
              price: nextPrice,
              delta,
              direction: delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat',
            };
          })
        );
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          // eslint-disable-next-line no-console
          console.error('Cardic Nexus metals feed error:', error);
        }
      }
    };

    loadMetals();
    const interval = window.setInterval(loadMetals, 60000);

    return () => {
      active = false;
      window.clearInterval(interval);
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

  useEffect(() => {
    if (bulletinCount <= 1) {
      return undefined;
    }

    const ticker = window.setInterval(() => {
      setAlphaIndex((index) => (index + 1) % bulletinCount);
    }, 6200);

    return () => {
      window.clearInterval(ticker);
    };
  }, [bulletinCount]);

  const activeBulletin = bulletinCount
    ? alphaBulletins[alphaIndex % bulletinCount]
    : null;
  const nextBulletin = bulletinCount
    ? alphaBulletins[(alphaIndex + 1) % bulletinCount]
    : null;
  const rotationProgress = bulletinCount
    ? Math.round(((alphaIndex + 1) / bulletinCount) * 100)
    : 0;
  const supportingBulletins = useMemo(() => {
    if (bulletinCount <= 1) {
      return [];
    }
    return alphaBulletins
      .map((bulletin, index) => ({ bulletin, index }))
      .filter((item) => item.index !== alphaIndex % bulletinCount)
      .slice(0, 2)
      .map((item) => item.bulletin);
  }, [alphaIndex, bulletinCount]);

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
            <Link
              href='/desk'
              prefetch={false}
              className='inline-flex items-center justify-center rounded-full border border-emerald-400/60 bg-emerald-500/10 px-8 py-3 text-base font-semibold text-emerald-200 shadow-[0_0_35px_rgba(16,185,129,0.28)] transition hover:bg-emerald-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300'
            >
              Visit Operations Desk
            </Link>
          </div>
          <div className='mx-auto mt-6 grid w-full max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {quickLaunchLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                target='_blank'
                rel='noopener noreferrer'
                prefetch={false}
                className='group flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-5 text-left shadow-[0_18px_60px_rgba(14,23,42,0.55)] transition hover:-translate-y-1 hover:border-amber-300/60 hover:bg-amber-200/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200'
              >
                <span className='text-sm font-semibold uppercase tracking-[0.28em] text-amber-200/80 group-hover:text-amber-100'>
                  {link.label}
                </span>
                <span className='text-sm text-slate-200/90 group-hover:text-white'>
                  {link.description}
                </span>
                <span className='text-xs font-semibold text-sky-200 group-hover:text-sky-100'>
                  Open in new tab →
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className='mx-auto grid w-full max-w-5xl gap-5 md:grid-cols-2 xl:grid-cols-4'>
          <div className='rounded-3xl border border-white/10 bg-black/40 p-6 text-center shadow-[0_24px_80px_rgba(14,23,42,0.45)] backdrop-blur md:col-span-2 xl:col-span-2'>
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

          <div className='rounded-3xl border border-sky-500/20 bg-sky-500/10 p-5 shadow-[0_30px_90px_rgba(14,23,42,0.45)] backdrop-blur md:col-span-2 xl:col-span-2'>
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

          <div className='rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_30px_90px_rgba(14,23,42,0.45)] backdrop-blur md:col-span-2 xl:col-span-2'>
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

          {activeBulletin ? (
            <div className='relative overflow-hidden rounded-3xl border border-fuchsia-500/30 bg-gradient-to-br from-fuchsia-500/10 via-black/40 to-sky-500/10 p-6 shadow-[0_34px_100px_rgba(88,28,135,0.45)] backdrop-blur md:col-span-2 xl:col-span-2'>
              <div className='pointer-events-none absolute inset-0 -z-[1] bg-[radial-gradient(circle_at_15%_20%,rgba(217,70,239,0.25),transparent_55%),radial-gradient(circle_at_85%_80%,rgba(56,189,248,0.22),transparent_60%)]' />
              <div className='flex flex-col gap-4'>
                <div className='flex flex-wrap items-center justify-between gap-3 text-[10px] uppercase tracking-[0.32em] text-fuchsia-100/80'>
                  <span>Alpha Pulse</span>
                  <span>{activeBulletin.tag}</span>
                </div>
                <div className='space-y-2 text-left'>
                  <h3 className='text-xl font-semibold text-white md:text-2xl'>
                    {activeBulletin.title}
                  </h3>
                  <p className='text-sm leading-relaxed text-slate-200 md:text-base'>
                    {activeBulletin.detail}
                  </p>
                </div>
                <div className='rounded-2xl border border-white/10 bg-black/40 p-4 shadow-inner shadow-fuchsia-900/20'>
                  <div className='flex flex-wrap items-center justify-between gap-2 text-[10px] uppercase tracking-[0.28em] text-slate-200'>
                    <span>Next Up</span>
                    <span className='text-right text-xs font-semibold text-white'>
                      {nextBulletin?.title}
                    </span>
                  </div>
                  <div className='mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10'>
                    <div
                      className='h-full rounded-full bg-gradient-to-r from-amber-400 via-fuchsia-500 to-sky-500 transition-all duration-500'
                      style={{ width: `${rotationProgress}%` }}
                    />
                  </div>
                  <p className='mt-3 text-[10px] uppercase tracking-[0.28em] text-fuchsia-100/80'>
                    {activeBulletin.cadence}
                  </p>
                </div>
                {supportingBulletins.length > 0 ? (
                  <div className='grid gap-3 sm:grid-cols-2'>
                    {supportingBulletins.map((bulletin) => (
                      <div
                        key={bulletin.title}
                        className='rounded-2xl border border-white/10 bg-white/5 p-3 text-left shadow-lg shadow-fuchsia-950/20'
                      >
                        <p className='text-xs uppercase tracking-[0.24em] text-slate-300'>
                          {bulletin.tag}
                        </p>
                        <p className='mt-2 text-sm font-semibold text-white'>
                          {bulletin.title}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
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
