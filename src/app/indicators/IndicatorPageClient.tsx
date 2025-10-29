'use client';
import Link from 'next/link';
import React from 'react';

type Stack = {
  id: string;
  title: string;
  description?: string;
  price?: string;
};
type Pkg = { id: string; name: string; price?: string; perks?: string[] };
type Faq = { question: string; answer: string };

const gradientButtonClass =
  'inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 via-sky-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-black shadow-[0_18px_40px_rgba(56,189,248,0.35)] transition hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400';

export default function IndicatorPageClient(props: {
  indicatorStacks?: Stack[];
  packages?: Pkg[];
  faqs?: Faq[];
}) {
  const { indicatorStacks = [], packages = [], faqs = [] } = props;
  const heroHighlights = [
    {
      title: 'Realtime Tape Bias',
      description:
        'Desk-synced bias matrix with liquidity sweeps, footprint deltas, and structure tapes refreshed every session.',
    },
    {
      title: 'Execution Layer Ready',
      description:
        'Automation-ready alert streams wired for TradingView, webhooks, and proprietary desk routing with failover.',
    },
    {
      title: 'Capital Scaling Access',
      description:
        'Direct escalation into Cardic Nexus capital programmes with verified stats and bespoke scaling ladders.',
    },
  ];

  return (
    <div className='relative overflow-hidden bg-[#02030a] text-slate-200'>
      <div className='pointer-events-none absolute inset-0 -z-[1] bg-[radial-gradient(circle_at_5%_5%,rgba(245,199,107,0.18),transparent_55%),_radial-gradient(circle_at_95%_10%,rgba(56,189,248,0.22),transparent_60%),_radial-gradient(circle_at_50%_85%,rgba(129,140,248,0.16),transparent_65%)]' />

      <div className='relative mx-auto flex max-w-6xl flex-col gap-16 px-6 pb-24 pt-20'>
        <header className='space-y-6 text-center md:text-left'>
          <span className='inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.38em] text-slate-200'>
            Premium Indicator Vault
          </span>
          <div className='space-y-4'>
            <h1 className='text-balance text-4xl font-black leading-tight text-white md:text-5xl'>
              Harness Cardic Nexus institutional-grade intelligence
            </h1>
            <p className='mx-auto max-w-3xl text-base leading-relaxed text-slate-300 md:mx-0 md:text-lg'>
              Blend liquidity heatmaps, bias confirmation, and automation-ready
              overlays crafted by the desk. Activate your stack and unlock
              calibrated precision inside the Trading Hub.
            </p>
          </div>
          <div className='grid gap-4 rounded-[28px] border border-white/10 bg-white/[0.04] p-6 text-left shadow-[0_20px_70px_rgba(14,23,42,0.45)] sm:grid-cols-3'>
            {heroHighlights.map((highlight) => (
              <div key={highlight.title} className='space-y-2'>
                <p className='text-xs font-semibold uppercase tracking-[0.28em] text-amber-200'>
                  {highlight.title}
                </p>
                <p className='text-sm leading-relaxed text-slate-200/90'>
                  {highlight.description}
                </p>
              </div>
            ))}
          </div>
        </header>

        <section className='space-y-8'>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <h2 className='text-2xl font-semibold text-white md:text-3xl'>
              Indicator stacks
            </h2>
            <p className='text-sm text-slate-300 md:max-w-md md:text-right'>
              Select the stack that matches your flow. Each subscription unlocks
              direct desk support plus TradingView provisioning.
            </p>
          </div>
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {indicatorStacks.map((stack) => (
              <div
                key={stack.id}
                className='group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05] p-6 shadow-[0_25px_80px_rgba(15,23,42,0.45)] transition duration-300 hover:border-white/30 hover:bg-white/[0.08]'
              >
                <div className='space-y-3'>
                  <h3 className='text-lg font-semibold text-white'>
                    {stack.title}
                  </h3>
                  {stack.description && (
                    <p className='text-sm leading-relaxed text-slate-300'>
                      {stack.description}
                    </p>
                  )}
                </div>
                <div className='mt-8 space-y-3'>
                  {stack.price && (
                    <span className='inline-flex items-center rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-amber-200'>
                      {stack.price}
                    </span>
                  )}
                  <Link
                    href={`/checkout?plan=${encodeURIComponent(stack.id)}`}
                    prefetch={false}
                    className={`${gradientButtonClass} w-full`}
                  >
                    Subscribe
                  </Link>
                </div>
              </div>
            ))}
            {indicatorStacks.length === 0 && (
              <p className='rounded-3xl border border-dashed border-white/20 p-6 text-sm text-slate-300'>
                No indicator stacks are available right now. Check back soon.
              </p>
            )}
          </div>
        </section>

        <section className='space-y-8'>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <h2 className='text-2xl font-semibold text-white md:text-3xl'>
              Curated packages
            </h2>
            <p className='text-sm text-slate-300 md:max-w-md md:text-right'>
              Bundle advanced overlays and guidance into a single pipeline.
              Packages include staged rollouts and Telegram escalations.
            </p>
          </div>
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className='relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.08] via-white/[0.04] to-white/[0.02] p-6 shadow-[0_30px_90px_rgba(14,18,32,0.55)] transition duration-300 hover:border-white/30 hover:shadow-[0_35px_110px_rgba(14,18,32,0.65)]'
              >
                <div className='space-y-3'>
                  <h3 className='text-lg font-semibold text-white'>
                    {pkg.name}
                  </h3>
                  {pkg.price && (
                    <span className='inline-flex items-center rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-200'>
                      {pkg.price}
                    </span>
                  )}
                  {Array.isArray(pkg.perks) && pkg.perks.length > 0 && (
                    <ul className='space-y-2 text-sm leading-relaxed text-slate-200/90'>
                      {pkg.perks.map((perk, index) => (
                        <li key={index} className='flex gap-2'>
                          <span className='mt-[0.4em] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-300' />
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className='mt-8'>
                  <Link
                    href={`/checkout?plan=${encodeURIComponent(pkg.id)}`}
                    prefetch={false}
                    className={`${gradientButtonClass} w-full`}
                  >
                    Subscribe
                  </Link>
                </div>
              </div>
            ))}
            {packages.length === 0 && (
              <p className='rounded-3xl border border-dashed border-white/20 p-6 text-sm text-slate-300'>
                No curated packages are available. Contact the desk for bespoke
                access.
              </p>
            )}
          </div>
        </section>

        <section className='space-y-6'>
          <h2 className='text-2xl font-semibold text-white md:text-3xl'>
            FAQs
          </h2>
          <div className='space-y-4'>
            {faqs.map((faq, index) => (
              <details
                key={`${faq.question}-${index}`}
                className='group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-white/25'
              >
                <summary className='cursor-pointer text-base font-semibold text-white marker:text-amber-300'>
                  {faq.question}
                </summary>
                <p className='mt-3 text-sm leading-relaxed text-slate-300'>
                  {faq.answer}
                </p>
              </details>
            ))}
            {faqs.length === 0 && (
              <p className='rounded-3xl border border-dashed border-white/20 p-6 text-sm text-slate-300'>
                No FAQs yet. Reach out to the desk for personalised guidance.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
