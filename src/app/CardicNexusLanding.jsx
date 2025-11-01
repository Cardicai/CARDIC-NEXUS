'use client';

import Link from 'next/link';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import BrandLogo from '@/components/BrandLogo';
const welcomeMessages = [
  'Welcome back to the Nexus. Your execution room is live.',
  'Precision trading never sleeps — see what the desk prepared for you.',
  'Every session counts. Let Cardic Nexus sharpen your next move.',
  'Automate, monitor, and scale. The Nexus team is standing by.',
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
    symbol: 'XRP/USDT',
    price: 0.62,
    decimals: 4,
    volatility: 18,
    delta: 0,
    direction: 'up',
    coingeckoId: 'ripple',
  },
  {
    symbol: 'BNB/USDT',
    price: 512.78,
    decimals: 2,
    volatility: 9,
    delta: 0,
    direction: 'up',
    coingeckoId: 'binancecoin',
  },
  {
    symbol: 'ADA/USDT',
    price: 0.48,
    decimals: 4,
    volatility: 14,
    delta: 0,
    direction: 'up',
    coingeckoId: 'cardano',
  },
];

const ecosystemStats = [
  { label: 'Active Traders', value: '8K+' },
  { label: 'Countries Connected', value: '35' },
  { label: 'Indicator Deployments', value: '12' },
  { label: 'Funding Distributed', value: '$1.2M' },
];

const quickLaunchLinks = [
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
    label: 'Indicator Docs',
    description: 'Review strategy briefs and setup guides curated by the desk.',
    href: '/docs/indicators',
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

const mentorDocSections = [
  {
    heading: 'AI Mentor Overview',
    copy: 'The Nexus Mentor overlays your TradingView layouts with calibrated execution prompts, alerting you when liquidity shifts or order-flow momentum demands attention.',
  },
  {
    heading: 'Session Workflow',
    copy: '1. Prep with the indicator stack. 2. Follow the Mentor checklist for bias confirmation. 3. Log outcomes in the Trading Hub so the desk can refine your playbook.',
  },
  {
    heading: 'Desk Notes',
    copy: 'Mentor access is provisioned after verification. Keep your Gmail inbox monitored — the desk sends activation keys and admin confirmations immediately after submission.',
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
  // Injected to fix undefined state/handler
  const [mentorDocOpen, setMentorDocOpen] = useState(false);
  const closeMentorDoc = useCallback(() => setMentorDocOpen(false), []);
  const [assetStream, setAssetStream] = useState(assetSeeds);
  const [welcomeIndex, setWelcomeIndex] = useState(0);

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
      '“The Nexus broadcast keeps my team aligned before every major session.” — David S., Desk Manager',
      '“Cardic Nexus coaching finally connected mindset to execution for me.” — Lola E., FX Specialist',
      '“Funding payouts hit quicker once I leaned on the Nexus compliance checklist.” — Ethan R., Prop Trader',
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

  const halloweenEmbers = useMemo(
    () =>
      Array.from({ length: 14 }, (_, index) => ({
        id: index,
        left: Math.random() * 100,
        delay: Math.random() * 4,
        duration: 12 + Math.random() * 10,
      })),
    []
  );

  return (
    <div className='relative overflow-hidden bg-[#03040c] text-slate-200'>
      <div className='pointer-events-none absolute inset-0 -z-[1] bg-[radial-gradient(circle_at_10%_10%,rgba(245,199,107,0.18),transparent_60%),_radial-gradient(circle_at_85%_0%,rgba(59,130,246,0.22),transparent_55%),_radial-gradient(circle_at_50%_80%,rgba(56,189,248,0.16),transparent_65%)]' />

      <div className='heroCornerLogo'>
        <BrandLogo size='lg' />
      </div>

      <section className='relative mx-auto flex min-h-[calc(100vh-var(--nav-h))] max-w-6xl flex-col gap-10 px-6 pb-20 pt-[max(env(safe-area-inset-top),1rem)] md:gap-12 md:pt-6 lg:pt-8'>
        <div className='halloweenGate'>
          <div className='halloweenGlow' />
          <div className='halloweenPumpkins' aria-hidden='true'>
            {halloweenEmbers.map((ember) => (
              <span
                key={ember.id}
                className='halloweenEmber'
                style={{
                  left: `${ember.left}%`,
                  animationDelay: `${ember.delay}s`,
                  animationDuration: `${ember.duration}s`,
                }}
              />
            ))}
          </div>
          <div className='halloweenCopy'>
            <span className='halloweenBadge'>Limited Halloween Broadcast</span>
            <h2 className='halloweenTitle'>
              Happy Halloween from <strong>Cardic Nexus</strong>
            </h2>
            <p className='halloweenSubtitle'>
              The desk dressed the command center in pumpkin neon so you can
              plan the next session with a little seasonal mischief. Enjoy a
              glowing walkthrough and unlock a spectral batch of automation
              templates.
            </p>
            <div className='halloweenCtas'>
              <Link
                href='/register'
                className='halloweenPrimary'
                prefetch={false}
              >
                Claim the Halloween Playbook
              </Link>
              <Link
                href='/trading-hub'
                className='halloweenSecondary'
                prefetch={false}
              >
                Visit the Haunted Hub →
              </Link>
            </div>
          </div>
          <div
            className='halloweenDancer'
            role='img'
            aria-label='Animated stick figure dancing and saying Happy Halloween'
          >
            <div className='stickFigure'>
              <span className='stickHead' />
              <span className='stickBody' />
              <span className='stickArm left' />
              <span className='stickArm right' />
              <span className='stickLeg left' />
              <span className='stickLeg right' />
            </div>
            <div className='stickSpeech'>
              <span className='speechText'>Happy Halloween!</span>
            </div>
            <span className='srOnly'>
              Happy Halloween from the Cardic Nexus stick dancer.
            </span>
          </div>
        </div>

        <div className='space-y-8 text-center md:space-y-10'>
          <div className='mx-auto w-fit rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-semibold uppercase tracking-[0.38em] text-slate-200'>
            Trading • Funding • Community
          </div>
          <div className='heroHeading'>
            <h1 className='heroTitle'>
              <span className='heroBrandName'>Cardic Nexus</span>
              <span className='heroTitleSecondary'>
                Where disciplined traders scale with precision.
              </span>
            </h1>
          </div>
          <div className='heroRailWrap'>
            <div className='heroTopRail'>
              {quickLaunchLinks.map((link) => (
                <Link
                  key={`rail-${link.href}`}
                  href={link.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  prefetch={false}
                  className='heroRailLink'
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className='heroBroadcastWrap'>
            <div className='heroBroadcast rounded-3xl border border-white/10 bg-black/40 p-6 text-center shadow-[0_24px_80px_rgba(14,23,42,0.45)] backdrop-blur'>
              <span className='text-[10px] uppercase tracking-[0.38em] text-amber-100'>
                News Update
              </span>
              <p
                key={welcomeIndex}
                className='welcomePhrase mt-3 text-base font-medium text-slate-100 md:text-lg'
              >
                {welcomeMessages[welcomeIndex]}
              </p>
            </div>
          </div>
          <p className='heroIntro'>
            The full Cardic Nexus ecosystem is live again. Deploy advanced
            indicators, collaborate directly with the desk, and execute with
            institutional precision every session.
          </p>
          <div className='flex flex-wrap items-center justify-center gap-4'>
            <Link
              href='/register'
              target='_blank'
              rel='noopener noreferrer'
              prefetch={false}
              className='ctaBuzz inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 via-fuchsia-500 to-blue-500 px-8 py-3 text-base font-semibold text-black shadow-[0_18px_50px_rgba(236,72,153,0.3)] transition hover:scale-[1.03] hover:shadow-[0_22px_60px_rgba(59,130,246,0.38)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200'
            >
              Register Free →
            </Link>
            <Link
              href='https://cardicworld.vercel.app/'
              target='_blank'
              rel='noopener noreferrer'
              prefetch={false}
              className='ctaBuzz inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 via-fuchsia-500 to-purple-600 px-8 py-3 text-sm font-medium text-white transition hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-400'
            >
              Open Mentor →
            </Link>
            <Link
              href='/indicators'
              prefetch={false}
              className='inline-flex items-center justify-center rounded-full border border-sky-400/60 bg-sky-500/10 px-8 py-3 text-base font-semibold text-sky-200 shadow-[0_0_35px_rgba(56,189,248,0.28)] transition hover:bg-sky-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300'
            >
              Explore Indicators
            </Link>
            <Link
              href='/support'
              prefetch={false}
              className='hidden items-center justify-center rounded-full border border-amber-400/60 bg-amber-500/10 px-8 py-3 text-base font-semibold text-amber-200 shadow-[0_0_35px_rgba(245,199,107,0.28)] transition hover:bg-amber-400/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300 sm:inline-flex'
            >
              Talk to Support
            </Link>
            <Link
              href='/desk'
              prefetch={false}
              className='hidden items-center justify-center rounded-full border border-emerald-400/60 bg-emerald-500/10 px-8 py-3 text-base font-semibold text-emerald-200 shadow-[0_0_35px_rgba(16,185,129,0.28)] transition hover:bg-emerald-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 md:inline-flex'
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
                  Enter hub →
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className='heroMatrix'>
          <div className='marketBoard rounded-3xl border border-sky-500/20 bg-sky-500/10 p-5 shadow-[0_30px_90px_rgba(14,23,42,0.45)] backdrop-blur'>
            <div className='mb-3 flex flex-wrap items-center justify-between gap-3 text-[10px] uppercase tracking-[0.32em] text-sky-100/80'>
              <span>Live Trading Board</span>
              <span>BTC • ETH • SOL • XRP • BNB • ADA</span>
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

          <div className='feedbackCard rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_30px_90px_rgba(14,23,42,0.45)] backdrop-blur'>
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
      </section>

      {mentorDocOpen ? (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center px-4 py-8'
          role='dialog'
          aria-modal='true'
          aria-label='AI mentor playbook'
          onClick={closeMentorDoc}
        >
          <div className='absolute inset-0 bg-black/70 backdrop-blur-md' />
          <article
            className='relative z-10 w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-[#0c0f1a]/95 shadow-[0_40px_140px_rgba(8,12,24,0.75)]'
            onClick={(event) => event.stopPropagation()}
          >
            <header className='flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5'>
              <div className='space-y-1'>
                <p className='text-xs uppercase tracking-[0.32em] text-amber-200'>
                  Nexus Mentor Document
                </p>
                <h2 className='text-2xl font-semibold text-white'>
                  Trade with the world’s first AI mentor
                </h2>
              </div>
              <button
                type='button'
                onClick={closeMentorDoc}
                className='inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/10 text-lg font-semibold text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200'
                aria-label='Close mentor document'
              >
                ×
              </button>
            </header>
            <div className='max-h-[70vh] space-y-6 overflow-y-auto px-6 py-6 text-left'>
              {mentorDocSections.map((section) => (
                <section
                  key={section.heading}
                  className='space-y-3 rounded-2xl border border-white/5 bg-white/5 p-5'
                >
                  <h3 className='text-lg font-semibold text-white'>
                    {section.heading}
                  </h3>
                  <p className='text-sm leading-relaxed text-slate-300'>
                    {section.copy}
                  </p>
                </section>
              ))}
              <p className='rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-amber-100'>
                Admin desk receives a copy of every mentor request.
              </p>
            </div>
          </article>
        </div>
      ) : null}

      <style jsx>{`
        .halloweenGate {
          position: relative;
          overflow: hidden;
          border-radius: 34px;
          padding: clamp(28px, 5vw, 48px);
          background: linear-gradient(
              160deg,
              rgba(112, 26, 117, 0.82),
              rgba(30, 64, 175, 0.75)
            ),
            radial-gradient(
              circle at 20% 20%,
              rgba(255, 128, 0, 0.45),
              transparent 60%
            );
          border: 1px solid rgba(251, 191, 36, 0.32);
          box-shadow: 0 28px 90px rgba(59, 7, 24, 0.55);
          text-align: center;
        }
        .halloweenGlow {
          position: absolute;
          inset: -40%;
          background: radial-gradient(
            circle at 50% 50%,
            rgba(252, 211, 77, 0.65),
            rgba(30, 27, 75, 0.05)
          );
          filter: blur(42px);
          opacity: 0.55;
        }
        .halloweenPumpkins {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .halloweenEmber {
          position: absolute;
          bottom: -18%;
          width: 16px;
          height: 16px;
          border-radius: 999px;
          background: radial-gradient(circle at 30% 30%, #f97316, #9a3412 72%);
          box-shadow: 0 0 18px rgba(251, 146, 60, 0.65),
            0 0 34px rgba(249, 115, 22, 0.4);
          animation-name: emberFloat;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in;
        }
        .halloweenCopy {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 18px;
          align-items: center;
          text-align: center;
        }
        .halloweenDancer {
          position: absolute;
          right: clamp(12px, 6vw, 48px);
          bottom: clamp(12px, 4vw, 46px);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          pointer-events: none;
          mix-blend-mode: screen;
        }
        .stickFigure {
          position: relative;
          width: 72px;
          height: 110px;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          animation: stickDance 2.8s ease-in-out infinite;
        }
        .stickHead {
          position: absolute;
          top: 0;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 3px solid rgba(253, 224, 71, 0.9);
          background: radial-gradient(circle at 30% 30%, #facc15, #f97316 85%);
          box-shadow: 0 0 18px rgba(253, 224, 71, 0.65),
            0 0 34px rgba(251, 146, 60, 0.55);
        }
        .stickBody {
          position: absolute;
          top: 32px;
          width: 6px;
          height: 46px;
          border-radius: 999px;
          background: linear-gradient(180deg, #fcd34d, rgba(251, 191, 36, 0.6));
          box-shadow: 0 0 12px rgba(249, 115, 22, 0.45);
        }
        .stickArm {
          position: absolute;
          top: 46px;
          width: 46px;
          height: 5px;
          border-radius: 999px;
          background: linear-gradient(
            90deg,
            rgba(253, 224, 71, 0.85),
            rgba(249, 115, 22, 0.7)
          );
          box-shadow: 0 0 12px rgba(251, 191, 36, 0.45);
        }
        .stickArm.left {
          left: -36px;
          transform-origin: 90% 50%;
          animation: stickArmWaveLeft 1.8s ease-in-out infinite;
        }
        .stickArm.right {
          right: -36px;
          transform-origin: 10% 50%;
          animation: stickArmWaveRight 1.8s ease-in-out infinite;
        }
        .stickLeg {
          position: absolute;
          top: 72px;
          width: 44px;
          height: 6px;
          border-radius: 999px;
          background: linear-gradient(
            90deg,
            rgba(14, 165, 233, 0.9),
            rgba(59, 130, 246, 0.8)
          );
          box-shadow: 0 0 14px rgba(96, 165, 250, 0.5);
        }
        .stickLeg.left {
          left: -26px;
          transform-origin: 95% 50%;
          animation: stickLegGrooveLeft 2.2s ease-in-out infinite;
        }
        .stickLeg.right {
          right: -26px;
          transform-origin: 5% 50%;
          animation: stickLegGrooveRight 2.2s ease-in-out infinite;
        }
        .stickSpeech {
          position: relative;
          padding: 8px 16px;
          border-radius: 999px;
          background: rgba(15, 23, 42, 0.65);
          border: 1px solid rgba(191, 219, 254, 0.4);
          box-shadow: 0 0 30px rgba(59, 130, 246, 0.35);
          animation: speechGlow 3.2s ease-in-out infinite;
        }
        .speechText {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(191, 219, 254, 0.95);
          text-shadow: 0 0 12px rgba(96, 165, 250, 0.65);
          white-space: nowrap;
        }
        .srOnly {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        .halloweenBadge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 18px;
          border-radius: 999px;
          font-size: 12px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          font-weight: 600;
          background: rgba(30, 27, 75, 0.65);
          color: rgba(254, 249, 195, 0.92);
          border: 1px solid rgba(254, 215, 170, 0.4);
          box-shadow: 0 12px 32px rgba(79, 70, 229, 0.45);
        }
        @keyframes stickDance {
          0%,
          100% {
            transform: translateY(0) rotate(-4deg);
          }
          50% {
            transform: translateY(-10px) rotate(6deg);
          }
        }
        @keyframes stickArmWaveLeft {
          0%,
          100% {
            transform: rotate(16deg);
          }
          50% {
            transform: rotate(-26deg);
          }
        }
        @keyframes stickArmWaveRight {
          0%,
          100% {
            transform: rotate(-10deg);
          }
          50% {
            transform: rotate(28deg);
          }
        }
        @keyframes stickLegGrooveLeft {
          0%,
          100% {
            transform: rotate(-12deg) translateY(0);
          }
          50% {
            transform: rotate(14deg) translateY(6px);
          }
        }
        @keyframes stickLegGrooveRight {
          0%,
          100% {
            transform: rotate(12deg) translateY(0);
          }
          50% {
            transform: rotate(-18deg) translateY(6px);
          }
        }
        @keyframes speechGlow {
          0%,
          100% {
            box-shadow: 0 0 30px rgba(59, 130, 246, 0.35);
            transform: translateY(0);
          }
          50% {
            box-shadow: 0 0 40px rgba(96, 165, 250, 0.55);
            transform: translateY(-4px);
          }
        }
        @media (max-width: 768px) {
          .halloweenDancer {
            position: relative;
            right: auto;
            bottom: auto;
            margin-top: 28px;
            mix-blend-mode: normal;
          }
        }
        .halloweenTitle {
          margin: 0;
          font-size: clamp(2rem, 4vw, 2.8rem);
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #f8fafc;
          text-shadow: 0 0 28px rgba(248, 250, 252, 0.35);
        }
        .halloweenTitle strong {
          color: #fbbf24;
          text-shadow: 0 0 18px rgba(249, 115, 22, 0.65),
            0 0 40px rgba(249, 115, 22, 0.35);
        }
        .halloweenSubtitle {
          max-width: 720px;
          margin: 0 auto;
          font-size: 16px;
          line-height: 1.75;
          color: rgba(226, 232, 240, 0.88);
        }
        .halloweenCtas {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 14px;
        }
        .halloweenPrimary,
        .halloweenSecondary {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 12px 24px;
          border-radius: 999px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          transition: transform 0.2s ease, box-shadow 0.2s ease,
            background 0.2s ease;
          white-space: nowrap;
        }
        .halloweenPrimary {
          background: linear-gradient(120deg, #f59e0b, #fb7185, #f97316);
          box-shadow: 0 18px 45px rgba(248, 113, 113, 0.35),
            0 0 45px rgba(245, 158, 11, 0.42);
          color: #0f172a;
        }
        .halloweenPrimary:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 20px 55px rgba(248, 113, 113, 0.45),
            0 0 55px rgba(251, 191, 36, 0.48);
        }
        .halloweenSecondary {
          background: rgba(30, 64, 175, 0.55);
          color: rgba(226, 232, 240, 0.95);
          border: 1px solid rgba(191, 219, 254, 0.35);
          box-shadow: 0 16px 45px rgba(30, 64, 175, 0.35);
        }
        .halloweenSecondary:hover {
          transform: translateY(-3px);
          background: rgba(59, 130, 246, 0.65);
        }
        .heroCornerLogo {
          position: absolute;
          top: clamp(16px, 4vw, 48px);
          right: clamp(18px, 5vw, 64px);
          display: inline-flex;
          padding: 10px 14px;
          border-radius: 18px;
          border: 1px solid rgba(245, 199, 107, 0.45);
          background: rgba(15, 16, 24, 0.78);
          box-shadow: 0 18px 55px rgba(8, 12, 24, 0.6);
        }
        .heroCornerLogo :global(svg) {
          height: clamp(42px, 8vw, 64px);
          width: auto;
        }
        .heroRailWrap {
          display: flex;
          justify-content: center;
        }
        .heroRailWrap .heroTopRail {
          margin-top: 0;
          width: min(100%, 960px);
        }
        .heroTopRail {
          display: flex;
          align-items: center;
          gap: 12px;
          overflow-x: auto;
          padding: 10px 14px;
          border-radius: 18px;
          border: 1px solid rgba(59, 130, 246, 0.28);
          background: rgba(8, 12, 24, 0.72);
          box-shadow: 0 14px 45px rgba(14, 23, 42, 0.45);
        }
        .heroTopRail::-webkit-scrollbar {
          display: none;
        }
        .heroRailLink {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 10px 18px;
          border-radius: 14px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(224, 242, 254, 0.92);
          background: rgba(4, 12, 26, 0.55);
          border: 1px solid transparent;
          transition: transform 0.18s ease, border-color 0.18s ease,
            background 0.18s ease;
          white-space: nowrap;
        }
        .heroRailLink:hover {
          transform: translateY(-2px);
          border-color: rgba(245, 199, 107, 0.7);
          background: rgba(19, 32, 56, 0.75);
        }
        .heroBroadcastWrap {
          display: flex;
          justify-content: center;
        }
        .heroBroadcastWrap .heroBroadcast {
          width: min(100%, 620px);
        }
        .heroHeading {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          text-align: center;
        }
        .heroTitle {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin: 0;
        }
        .heroBrandName {
          font-size: clamp(2.8rem, 4.6vw, 3.6rem);
          font-weight: 800;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          background: linear-gradient(
            120deg,
            #f5c76b,
            #60a5fa,
            #22d3ee,
            #f5c76b
          );
          background-size: 280% 280%;
          -webkit-background-clip: text;
          color: transparent;
          animation: heroBrandShift 9s ease-in-out infinite;
        }
        .heroTitleSecondary {
          font-size: clamp(1.2rem, 2.8vw, 1.6rem);
          font-weight: 500;
          color: rgba(226, 232, 240, 0.82);
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .heroIntro {
          margin: 0 auto;
          max-width: 720px;
          font-size: 18px;
          line-height: 1.7;
          color: rgba(226, 232, 240, 0.92);
        }
        .ctaBuzz {
          position: relative;
          animation: ctaBuzz 2.8s ease-in-out infinite;
        }
        @keyframes ctaBuzz {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        .heroBroadcast,
        .marketBoard,
        .feedbackCard {
          transition: transform 0.25s ease;
        }
        .heroMatrix {
          display: grid;
          width: 100%;
          max-width: 960px;
          margin: 0 auto;
          gap: 20px;
        }
        .heroBroadcast:hover,
        .marketBoard:hover,
        .feedbackCard:hover {
          transform: translateY(-4px);
        }
        .marketBoard .marketTicker {
          margin-top: 16px;
        }
        .marketBoard .marketTickerItem {
          background: rgba(3, 7, 18, 0.55);
        }
        .feedbackCard .feedbackTicker {
          margin-top: 6px;
        }
        .marketBoard,
        .heroBroadcast,
        .feedbackCard {
          min-height: 180px;
        }
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
        @keyframes emberFloat {
          0% {
            transform: translateY(0) scale(0.8);
            opacity: 0;
          }
          25% {
            opacity: 0.75;
          }
          60% {
            opacity: 0.85;
          }
          100% {
            transform: translateY(-160%) scale(1.1);
            opacity: 0;
          }
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
        @keyframes heroBrandShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .halloweenEmber,
          .halloweenPrimary,
          .halloweenSecondary,
          .heroRailLink,
          .heroBroadcast,
          .marketBoard,
          .feedbackCard,
          .ctaBuzz {
            animation: none !important;
            transition: none !important;
          }
          .heroBrandName {
            animation: none;
            background-position: 50% 50%;
          }
        }
        @media (min-width: 768px) {
          .heroMatrix {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (min-width: 1280px) {
          .heroMatrix {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 900px) {
          .heroCornerLogo {
            position: static;
            margin: 24px auto 0;
          }
        }
        @media (max-width: 768px) {
          .halloweenGate {
            padding: clamp(24px, 8vw, 38px);
          }
          .halloweenSubtitle {
            font-size: 15px;
          }
          .heroIntro {
            font-size: 16px;
          }
          .heroBroadcast,
          .marketBoard,
          .feedbackCard {
            text-align: left;
            padding: 22px;
            min-height: auto;
          }
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
        @media (max-width: 640px) {
          .halloweenGate {
            border-radius: 28px;
          }
          .halloweenTitle {
            font-size: clamp(1.8rem, 6vw, 2.3rem);
          }
          .halloweenCtas {
            gap: 10px;
          }
          .halloweenPrimary,
          .halloweenSecondary {
            width: 100%;
            text-align: center;
          }
          .heroCornerLogo {
            display: none;
          }
          .heroHeading {
            gap: 12px;
          }
          .heroTopRail {
            padding: 8px 10px;
            gap: 10px;
          }
          .heroBroadcastWrap .heroBroadcast {
            padding: 18px;
          }
          .heroIntro {
            font-size: 15px;
            line-height: 1.65;
          }
        }
        @media (max-width: 560px) {
          .heroBrandName {
            font-size: 2.4rem;
            letter-spacing: 0.32em;
          }
          .heroTitleSecondary {
            font-size: 1.05rem;
            letter-spacing: 0.2em;
          }
          .heroTopRail {
            padding: 10px 12px;
          }
          .heroRailLink {
            font-size: 11px;
            padding: 8px 14px;
          }
        }
      `}</style>
    </div>
  );
}
