'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef } from 'react';

import { CATEGORIES } from '@/data/navigation';

const featureCards = [
  {
    title: 'Autonomous Bots',
    description:
      'Deploy adaptive automation that mirrors institutional flow across sessions.',
    links: [{ label: 'Explore Bots', href: '/category/bots' }],
  },
  {
    title: 'Expert Advisors',
    description:
      'Precision-tuned EAs engineered for MT platforms with disciplined risk logic.',
    links: [{ label: 'View EAs', href: '/category/eas' }],
  },
  {
    title: 'Signal Indicators',
    description:
      'Real-time structure, liquidity and momentum overlays to clarify every move.',
    links: [{ label: 'Browse Indicators', href: '/category/indicators' }],
  },
  {
    title: 'Strategy & Lab',
    description:
      'Ship proprietary code, iterate in Algo Lab, and align executions with your playbook.',
    links: [
      { label: 'Code Strategies', href: '/category/code-strategies' },
      { label: 'Enter Algo Lab', href: '/category/algo-lab' },
    ],
  },
] as const;

export default function CardicHero() {
  const pathname = usePathname();
  const chipRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const activeIndex = useMemo(() => {
    if (!pathname || pathname === '/') {
      return -1;
    }

    return CATEGORIES.findIndex((category) =>
      pathname.startsWith(`/category/${category.slug}`)
    );
  }, [pathname]);

  useEffect(() => {
    if (activeIndex < 0) {
      return;
    }

    const node = chipRefs.current[activeIndex];

    node?.scrollIntoView({
      inline: 'center',
      block: 'nearest',
      behavior: 'smooth',
    });
  }, [activeIndex]);

  return (
    <section className='relative overflow-hidden bg-[#07060A] py-16 text-[#E6E8EE] sm:py-24'>
      <div className='pointer-events-none absolute inset-0 -z-10'>
        <div className='absolute -left-24 -top-32 h-72 w-72 rounded-full bg-gradient-to-br from-[#6D28D9]/60 via-[#6D28D9]/20 to-transparent blur-3xl' />
        <div className='absolute bottom-[-6rem] right-[-4rem] h-80 w-80 rounded-full bg-gradient-to-tr from-[#2BA7FF]/70 via-[#2BA7FF]/10 to-transparent blur-3xl' />
      </div>
      <div className='mx-auto flex w-full max-w-screen-xl flex-col gap-12 px-4 sm:px-6 lg:px-8'>
        <header className='flex flex-col gap-6 md:flex-row md:items-center md:justify-between'>
          <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-4'>
              <div className='rounded-full border border-[rgba(214,164,68,.18)] bg-[#0A0B10]/80 px-3 py-1 text-xs font-medium tracking-[0.4em] text-[#D6A444]'>
                CARDIC
              </div>
              <span className='text-sm text-[#A8AFBF]'>Nexus Intelligence</span>
            </div>
            <nav
              aria-label='Product categories'
              role='tablist'
              className='max-w-full overflow-x-auto rounded-2xl border border-white/10 bg-white/5 p-1 backdrop-blur md:max-w-xl'
            >
              <div className='flex min-w-max gap-1'>
                {CATEGORIES.map((category, index) => {
                  const isActive = index === activeIndex && activeIndex >= 0;

                  return (
                    <Link
                      key={category.slug}
                      href={`/category/${category.slug}`}
                      ref={(node) => {
                        chipRefs.current[index] = node;
                      }}
                      role='tab'
                      aria-selected={isActive}
                      className={[
                        'whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2BA7FF]/40',
                        isActive
                          ? 'border border-sky-400/40 bg-white/10 text-white shadow-[0_0_0_1px_rgba(43,167,255,.35)]'
                          : 'border border-white/10 text-[#E6E8EE] hover:bg-white/10',
                      ].join(' ')}
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
              className='rounded-xl border border-amber-400/40 bg-amber-500/10 px-5 py-2.5 text-sm font-semibold text-amber-200 transition-colors duration-150 hover:bg-amber-500/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/40'
            >
              NP (NEXUS PARTNER)
            </Link>
            <Link
              href='/join'
              className='rounded-xl bg-[#2BA7FF] px-5 py-2.5 text-sm font-semibold text-black transition-transform duration-150 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2BA7FF]/40'
            >
              Join Premium
            </Link>
          </div>
        </header>

        <div className='max-w-3xl space-y-6'>
          <p className='text-sm uppercase tracking-[0.4em] text-[#A8AFBF]'>
            Welcome to
          </p>
          <h1 className='text-4xl font-black tracking-tight sm:text-5xl'>
            <span className='bg-gradient-to-r from-[#D6A444] via-[#f1d189] to-[#D6A444] bg-clip-text text-transparent'>
              CARDIC
            </span>{' '}
            <span className='bg-gradient-to-r from-[#2BA7FF] via-[#4dcfff] to-[#6D28D9] bg-clip-text text-transparent'>
              NEXUS
            </span>
          </h1>
          <p className='max-w-2xl text-base text-[#A8AFBF] sm:text-lg'>
            Institutional-grade automation, liquidity intelligence, and bespoke
            code infrastructure for traders who demand the fastest path to
            conviction.
          </p>
        </div>

        <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
          {featureCards.map((card) => (
            <div
              key={card.title}
              className='group relative flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-[#0A0B10]/80 p-5 transition-shadow duration-200 hover:shadow-[0_0_0_1px_rgba(43,167,255,.35),0_14px_60px_rgba(45,64,101,0.28)]'
            >
              <div className='space-y-3'>
                <h3 className='text-lg font-semibold text-[#E6E8EE]'>
                  {card.title}
                </h3>
                <p className='text-sm text-[#A8AFBF]'>{card.description}</p>
              </div>
              <div className='mt-6 flex flex-wrap gap-2'>
                {card.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className='rounded-full border border-[#2BA7FF]/40 px-3 py-1.5 text-xs font-medium text-[#E6E8EE] transition-colors duration-150 hover:bg-[#2BA7FF]/10'
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
