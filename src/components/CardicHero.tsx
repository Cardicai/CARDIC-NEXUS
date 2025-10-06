'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef } from 'react';

const CATEGORIES = [
  { label: 'Bots', slug: 'bots' },
  { label: 'EAs', slug: 'eas' },
  { label: 'Indicators', slug: 'indicators' },
  { label: 'Code Strategies', slug: 'code-strategies' },
  { label: 'Algo Lab', slug: 'algo-lab' },
] as const;

type Category = (typeof CATEGORIES)[number];

const FEATURE_CARDS: Array<{
  title: string;
  description: string;
  slug: Category['slug'];
}> = [
  {
    title: 'Autonomous Bots',
    description:
      'Deploy self-tuning bots with risk controls that adapt to volatility shifts in real time.',
    slug: 'bots',
  },
  {
    title: 'Elite EAs',
    description:
      'MetaTrader-ready expert advisors engineered for disciplined entries and exits.',
    slug: 'eas',
  },
  {
    title: 'Pro Indicators',
    description:
      'Visualize liquidity, psychology, and momentum with precision overlays.',
    slug: 'indicators',
  },
  {
    title: 'Code Strategies',
    description:
      'Blueprint institutional-grade playbooks and automate bespoke trading logic.',
    slug: 'code-strategies',
  },
  {
    title: 'Algo Lab',
    description:
      'Collaborate inside our research lab to experiment, backtest, and deploy faster.',
    slug: 'algo-lab',
  },
];

const baseChipClasses =
  'flex items-center whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400';

const activeChipClasses =
  'bg-white/10 text-white border-sky-400/40 shadow-[0_0_0_1px_rgba(43,167,255,.35)]';

const inactiveChipClasses = 'text-zinc-200 border-white/10 hover:bg-white/10';

export default function CardicHero(): JSX.Element {
  const pathname = usePathname();
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  const activeIndex = useMemo(() => {
    if (!pathname) return -1;

    return CATEGORIES.findIndex((category) =>
      pathname.startsWith(`/category/${category.slug}`)
    );
  }, [pathname]);

  useEffect(() => {
    if (activeIndex < 0) return;

    const activeNode = itemRefs.current[activeIndex];
    if (!activeNode) return;

    activeNode.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, [activeIndex]);

  return (
    <section className='relative overflow-hidden bg-[#07060A] py-16 sm:py-20'>
      <div className='pointer-events-none absolute inset-0'>
        <div className='absolute -left-32 top-[-120px] h-80 w-80 rounded-full bg-[#6D28D9]/45 blur-[140px]' />
        <div className='absolute bottom-[-160px] right-[-120px] h-96 w-96 rounded-full bg-[#2BA7FF]/35 blur-[160px]' />
      </div>

      <div className='relative mx-auto flex max-w-7xl flex-col gap-12 px-4 sm:px-6 lg:px-8'>
        <header className='flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>
          <div className='flex flex-col gap-4 lg:max-w-3xl'>
            <Link
              href='/'
              className='inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold tracking-[0.28em] text-white/80 uppercase'
            >
              CARDIC NEXUS
            </Link>

            <nav
              aria-label='Trading category switcher'
              role='tablist'
              className='-mx-4 overflow-x-auto px-4 pb-2'
            >
              <div className='flex gap-2'>
                {CATEGORIES.map((category, index) => {
                  const isActive = index === activeIndex;

                  return (
                    <Link
                      key={category.slug}
                      href={`/category/${category.slug}`}
                      role='tab'
                      aria-selected={isActive}
                      ref={(node) => {
                        itemRefs.current[index] = node;
                      }}
                      className={clsx(
                        baseChipClasses,
                        isActive ? activeChipClasses : inactiveChipClasses
                      )}
                    >
                      {category.label}
                    </Link>
                  );
                })}
              </div>
            </nav>
          </div>

          <div className='flex shrink-0 flex-wrap items-center gap-3'>
            <Link
              href='/partners'
              className='rounded-full border border-amber-400/40 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-200 transition hover:bg-amber-500/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200'
            >
              NP (NEXUS PARTNER)
            </Link>
            <Link
              href='/join'
              className='rounded-full bg-[#2BA7FF] px-4 py-2 text-sm font-semibold text-black transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2BA7FF]'
            >
              Join Premium
            </Link>
          </div>
        </header>

        <div className='flex flex-col gap-10 lg:flex-row lg:items-end lg:gap-16'>
          <div className='max-w-3xl space-y-6'>
            <h1 className='text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl'>
              <span className='bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300 bg-clip-text text-transparent'>
                CARDIC
              </span>{' '}
              <span className='bg-gradient-to-r from-[#2BA7FF] via-sky-300 to-cyan-200 bg-clip-text text-transparent'>
                NEXUS
              </span>
            </h1>
            <p className='max-w-2xl text-base text-[#A8AFBF] sm:text-lg'>
              Ultra-focused automation, institutional intelligence, and adaptive
              tooling for traders navigating gold, FX, and crypto. Tap into our
              lab to engineer, deploy, and scale without friction.
            </p>
            <div className='flex flex-wrap gap-3 text-sm text-[#A8AFBF]'>
              <span className='rounded-full border border-white/10 bg-white/5 px-3 py-1'>
                AI-Native Trading Stack
              </span>
              <span className='rounded-full border border-white/10 bg-white/5 px-3 py-1'>
                Institutional Workflows
              </span>
              <span className='rounded-full border border-white/10 bg-white/5 px-3 py-1'>
                Multi-Asset Execution
              </span>
            </div>
          </div>
        </div>

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
          {FEATURE_CARDS.map((card) => (
            <Link
              key={card.slug}
              href={`/category/${card.slug}`}
              className='group relative flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-[#0A0B10]/90 p-6 transition hover:border-sky-400/40 hover:shadow-[0_0_0_1px_rgba(43,167,255,.25)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400'
            >
              <div className='space-y-3'>
                <p className='text-xs font-semibold uppercase tracking-[0.32em] text-white/60'>
                  {card.slug.replace(/-/g, ' ')}
                </p>
                <h3 className='text-xl font-semibold text-[#E6E8EE] transition group-hover:text-white'>
                  {card.title}
                </h3>
                <p className='text-sm text-[#A8AFBF]'>{card.description}</p>
              </div>
              <span className='mt-6 inline-flex items-center text-sm font-semibold text-[#2BA7FF] transition group-hover:translate-x-1'>
                Explore
                <svg
                  aria-hidden='true'
                  className='ml-2 h-4 w-4'
                  fill='none'
                  viewBox='0 0 16 16'
                >
                  <path
                    d='M3.75 8h8.5m0 0L9.5 5.25m2.75 2.75L9.5 10.75'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='1.5'
                  />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
