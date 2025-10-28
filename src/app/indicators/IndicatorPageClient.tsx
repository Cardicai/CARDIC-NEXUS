'use client';

import Link from 'next/link';
import { useState } from 'react';

import TrialFormModal from '@/components/modals/TrialFormModal';

import {
  type IndicatorFaq,
  type IndicatorPackage,
  type IndicatorStack,
} from './data';

type IndicatorPageClientProps = {
  indicatorStacks: IndicatorStack[];
  packages: IndicatorPackage[];
  faqs: IndicatorFaq[];
};

export default function IndicatorPageClient({
  indicatorStacks,
  packages,
  faqs,
}: IndicatorPageClientProps) {
  const [trialOpen, setTrialOpen] = useState(false);
  const trialIndicators = indicatorStacks.map((indicator) => indicator.title);
  const checkoutBaseUrl = '/checkout';

  const openTrial = () => {
    setTrialOpen(true);
  };

  return (
    <div className='relative min-h-screen overflow-hidden bg-[#06040f] text-slate-100'>
      <div className='pointer-events-none absolute inset-0 -z-[1] bg-[radial-gradient(circle_at_12%_15%,rgba(245,199,107,0.22),transparent_55%),radial-gradient(circle_at_88%_18%,rgba(56,189,248,0.3),transparent_58%),radial-gradient(circle_at_50%_90%,rgba(139,92,246,0.22),transparent_60%)]' />
      <main className='mx-auto flex max-w-6xl flex-col gap-16 px-6 pb-24 pt-28 md:gap-20 md:pb-32'>
        <header className='space-y-6 text-center md:text-left'>
          <span className='inline-flex items-center justify-center rounded-full border border-white/10 bg-white/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.38em] text-amber-200'>
            Premium Indicators
          </span>
          <h1 className='text-4xl font-black leading-tight text-white md:text-5xl'>
            Nexus Pulse — Institutional Clarity for Every Session
          </h1>
          <p className='mx-auto max-w-3xl text-base leading-relaxed text-slate-300 md:mx-0 md:text-lg'>
            Overlay CardicHeat intelligence, liquidity maps, and institutional
            guardrails onto your charts. Nexus Pulse is the stack built by the
            same desk powering our automation and competition winners.
          </p>
          <div className='flex flex-col gap-3 sm:flex-row sm:justify-start sm:text-left'>
            <button
              type='button'
              onClick={openTrial}
              className='inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 via-fuchsia-500 to-blue-500 px-6 py-3 text-sm font-semibold text-black shadow-[0_16px_60px_rgba(139,92,246,0.35)] transition hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200'
            >
              Claim 7-Day Free Trial
            </button>
            <Link
              href='/support'
              prefetch={false}
              className='inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-white/40'
            >
              Talk to the Desk
            </Link>
          </div>
        </header>

        <section className='grid gap-6 md:grid-cols-3'>
          {indicatorStacks.map((indicator) => (
            <div
              key={indicator.id}
              className='group flex flex-col gap-4 rounded-3xl border border-white/10 bg-black/40 p-6 shadow-[0_32px_90px_rgba(15,23,42,0.55)] transition hover:-translate-y-1 hover:border-white/20'
            >
              <h2 className='text-xl font-semibold text-white'>
                {indicator.title}
              </h2>
              <p className='text-sm leading-relaxed text-slate-300'>
                {indicator.description}
              </p>
              <span className='text-lg font-semibold text-white'>
                {indicator.price}
              </span>
              <span className='text-sm font-semibold text-amber-200'>
                TradingView overlays & Exchange API plugins
              </span>
              <Link
                href={`${checkoutBaseUrl}?plan=${encodeURIComponent(
                  indicator.id
                )}`}
                target='_blank'
                rel='noopener noreferrer'
                prefetch={false}
                className='mt-2 inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-white/40'
              >
                Subscribe
              </Link>
            </div>
          ))}
        </section>

        <section className='grid gap-6 md:grid-cols-3'>
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className='flex flex-col gap-5 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-black/30 to-white/5 p-8 text-center shadow-[0_36px_120px_rgba(15,23,42,0.55)]'
            >
              <span className='text-xs uppercase tracking-[0.32em] text-sky-200'>
                {pkg.name}
              </span>
              <span className='text-3xl font-semibold text-white'>
                {pkg.price}
              </span>
              <ul className='flex flex-1 flex-col gap-3 text-sm text-slate-200'>
                {pkg.perks.map((perk) => (
                  <li key={perk} className='flex items-start gap-2 text-left'>
                    <span className='mt-[6px] inline-flex h-2 w-2 flex-none rounded-full bg-amber-300' />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
              <div className='flex flex-col gap-2 text-sm'>
                <Link
                  href={`${checkoutBaseUrl}?plan=${encodeURIComponent(pkg.id)}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  prefetch={false}
                  className='inline-flex items-center justify-center rounded-full bg-amber-300 px-5 py-3 font-semibold text-black transition hover:bg-amber-200'
                >
                  Subscribe
                </Link>
                <Link
                  href='/support'
                  prefetch={false}
                  className='inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-3 font-semibold text-slate-200 transition hover:border-white/40'
                >
                  Talk to the Desk
                </Link>
              </div>
            </div>
          ))}
        </section>

        <section className='grid gap-6 rounded-[46px] border border-white/10 bg-black/45 p-10 shadow-[0_45px_140px_rgba(59,130,246,0.45)] md:grid-cols-[1.1fr_0.9fr]'>
          <div className='space-y-5'>
            <p className='text-xs uppercase tracking-[0.32em] text-slate-200'>
              Why traders choose Cardic indicators
            </p>
            <h2 className='text-3xl font-semibold text-white md:text-4xl'>
              Built by traders, for traders
            </h2>
            <ul className='space-y-4 text-sm text-slate-200'>
              <li className='flex items-start gap-3'>
                <span className='mt-1 inline-flex h-2 w-2 flex-none rounded-full bg-sky-300' />
                <span>
                  Seamless Trading Hub integration keeps independent and desk
                  traders aligned across journaling, accountability, and
                  automation triggers.
                </span>
              </li>
              <li className='flex items-start gap-3'>
                <span className='mt-1 inline-flex h-2 w-2 flex-none rounded-full bg-sky-300' />
                <span>
                  Weekly indicator labs with Nexus analysts sharpen execution
                  plans for discretionary and systematic approaches alike.
                </span>
              </li>
              <li className='flex items-start gap-3'>
                <span className='mt-1 inline-flex h-2 w-2 flex-none rounded-full bg-sky-300' />
                <span>
                  Instant alerts inside Telegram and the Trading Hub flag
                  liquidity shifts the moment your playbook needs attention.
                </span>
              </li>
            </ul>
          </div>
          <div className='space-y-4'>
            <p className='text-xs uppercase tracking-[0.32em] text-amber-200'>
              Common questions
            </p>
            <div className='space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6'>
              {faqs.map((faq) => (
                <div key={faq.question} className='space-y-2'>
                  <h3 className='text-base font-semibold text-white'>
                    {faq.question}
                  </h3>
                  <p className='text-sm leading-relaxed text-slate-300'>
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className='grid gap-4 rounded-[44px] border border-white/10 bg-black/50 p-8 shadow-[0_45px_140px_rgba(245,199,107,0.45)] md:grid-cols-3'>
          <Link
            href='/trading-hub'
            prefetch={false}
            className='group flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 text-left transition hover:-translate-y-1 hover:border-white/25'
          >
            <span className='text-xs uppercase tracking-[0.32em] text-amber-200'>
              Trading Hub
            </span>
            <p className='text-sm leading-relaxed text-slate-200'>
              See how Pulse insights feed directly into accountability pods.
            </p>
            <span className='text-sm font-semibold text-amber-100 group-hover:text-amber-50'>
              Visit the hub →
            </span>
          </Link>
          <Link
            href='/competition'
            prefetch={false}
            className='group flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 text-left transition hover:-translate-y-1 hover:border-white/25'
          >
            <span className='text-xs uppercase tracking-[0.32em] text-amber-200'>
              Competition HQ
            </span>
            <p className='text-sm leading-relaxed text-slate-200'>
              Use Pulse to maintain discipline and climb the weekly
              leaderboards.
            </p>
            <span className='text-sm font-semibold text-amber-100 group-hover:text-amber-50'>
              Enter the arena →
            </span>
          </Link>
          <Link
            href='/partner'
            prefetch={false}
            className='group flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 text-left transition hover:-translate-y-1 hover:border-white/25'
          >
            <span className='text-xs uppercase tracking-[0.32em] text-amber-200'>
              Partnership
            </span>
            <p className='text-sm leading-relaxed text-slate-200'>
              Share Pulse with your audience and unlock Nexus partner
              commissions.
            </p>
            <span className='text-sm font-semibold text-amber-100 group-hover:text-amber-50'>
              Discover partner perks →
            </span>
          </Link>
        </section>
      </main>

      <TrialFormModal
        open={trialOpen}
        onOpenChange={setTrialOpen}
        indicators={trialIndicators}
      />
    </div>
  );
}
