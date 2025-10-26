'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';

import PaymentSheet, { type PaymentPlan } from '@/components/PaymentSheet';

type IndicatorStack = {
  title: string;
  description: string;
};

type IndicatorPackage = {
  id: string;
  name: string;
  price: string;
  perks: string[];
};

type IndicatorFaq = {
  question: string;
  answer: string;
};

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
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan | null>(null);
  const [trialOpen, setTrialOpen] = useState(false);
  const [trialSubmitting, setTrialSubmitting] = useState(false);
  const [trialSelection, setTrialSelection] = useState<string[]>([]);
  const [trialError, setTrialError] = useState<string | null>(null);
  const [banner, setBanner] = useState<{
    tone: 'success' | 'info' | 'error';
    message: string;
  } | null>(null);
  const bannerTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (bannerTimer.current) {
        clearTimeout(bannerTimer.current);
      }
    };
  }, []);

  const showBanner = (
    tone: 'success' | 'info' | 'error',
    message: string,
    duration = 5200
  ) => {
    if (bannerTimer.current) {
      clearTimeout(bannerTimer.current);
    }
    setBanner({ tone, message });
    bannerTimer.current = setTimeout(() => {
      setBanner(null);
      bannerTimer.current = null;
    }, duration);
  };

  const bannerToneClasses: Record<'success' | 'info' | 'error', string> = {
    success: 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200',
    info: 'border-sky-400/40 bg-sky-500/10 text-sky-200',
    error: 'border-rose-400/40 bg-rose-500/10 text-rose-200',
  };

  const defaultPlan = useMemo<PaymentPlan | null>(() => {
    if (!packages.length) {
      return null;
    }

    const first = packages[0];
    return {
      id: first.id,
      title: first.name,
      price: first.price,
    };
  }, [packages]);

  const openPayment = (plan?: PaymentPlan | null) => {
    setSelectedPlan(plan ?? defaultPlan);
    setPaymentOpen(true);
  };

  const closePayment = () => {
    setPaymentOpen(false);
  };

  const indicatorOptions = useMemo(
    () => indicatorStacks.map((item) => item.title),
    [indicatorStacks]
  );

  const openTrial = () => {
    setTrialSelection([]);
    setTrialError(null);
    setTrialOpen(true);
  };

  const closeTrial = () => {
    if (trialSubmitting) {
      return;
    }
    setTrialOpen(false);
  };

  const toggleTrialSelection = (value: string) => {
    setTrialSelection((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleTrialSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!trialSelection.length) {
      setTrialError('Select at least one indicator you want to test.');
      return;
    }

    const formData = new FormData(event.currentTarget);
    const name = (formData.get('name') as string)?.trim();
    const tradingview = (formData.get('tradingview') as string)?.trim();
    const email = (formData.get('email') as string)?.trim();

    if (!name || !tradingview || !email) {
      setTrialError('All fields are required.');
      return;
    }

    setTrialError(null);
    setTrialSubmitting(true);

    try {
      const response = await fetch('/api/claim-trial', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          tradingview,
          email,
          indicators: trialSelection,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.success) {
        throw new Error(result?.error || 'Unable to submit your request.');
      }

      (event.currentTarget as HTMLFormElement).reset();
      setTrialSelection([]);
      setTrialOpen(false);
      showBanner(
        'success',
        'CardicNex says: Trial request received. Check your email for confirmation.'
      );
    } catch (error) {
      setTrialError(
        error instanceof Error
          ? error.message
          : 'Unable to submit your request.'
      );
    } finally {
      setTrialSubmitting(false);
    }
  };

  return (
    <div className='relative min-h-screen overflow-hidden bg-[#06040f] text-slate-100'>
      <div className='pointer-events-none absolute inset-0 -z-[1] bg-[radial-gradient(circle_at_12%_15%,rgba(245,199,107,0.22),transparent_55%),radial-gradient(circle_at_88%_18%,rgba(56,189,248,0.3),transparent_58%),radial-gradient(circle_at_50%_90%,rgba(139,92,246,0.22),transparent_60%)]' />
      <main className='mx-auto flex max-w-6xl flex-col gap-16 px-6 pb-24 pt-28 md:gap-20 md:pb-32'>
        {banner ? (
          <div
            role='status'
            aria-live='polite'
            className={`mx-auto w-full max-w-3xl rounded-full border px-4 py-3 text-center text-sm font-semibold tracking-wide shadow-[0_24px_60px_rgba(8,11,20,0.55)] ${
              bannerToneClasses[banner.tone]
            }`}
          >
            {banner.message}
          </div>
        ) : null}
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
              key={indicator.title}
              className='group flex flex-col gap-4 rounded-3xl border border-white/10 bg-black/40 p-6 shadow-[0_32px_90px_rgba(15,23,42,0.55)] transition hover:-translate-y-1 hover:border-white/20'
            >
              <h2 className='text-xl font-semibold text-white'>
                {indicator.title}
              </h2>
              <p className='text-sm leading-relaxed text-slate-300'>
                {indicator.description}
              </p>
              <span className='text-sm font-semibold text-amber-200'>
                TradingView overlays & Exchange API plugins
              </span>
              <button
                type='button'
                onClick={() => openPayment(defaultPlan)}
                className='mt-2 inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-white/40'
              >
                Subscribe
              </button>
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
                <button
                  type='button'
                  onClick={() =>
                    openPayment({
                      id: pkg.id,
                      title: pkg.name,
                      price: pkg.price,
                    })
                  }
                  className='inline-flex items-center justify-center rounded-full bg-amber-300 px-5 py-3 font-semibold text-black transition hover:bg-amber-200'
                >
                  Subscribe
                </button>
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

      {trialOpen ? (
        <div
          className='fixed inset-0 z-[60] flex items-center justify-center px-4 py-8'
          role='dialog'
          aria-modal='true'
          onClick={closeTrial}
        >
          <div className='absolute inset-0 bg-black/70 backdrop-blur-md' />
          <div
            className='relative z-[61] w-full max-w-xl rounded-3xl border border-white/10 bg-[#0d101a]/95 p-6 shadow-[0_40px_120px_rgba(15,23,42,0.65)]'
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type='button'
              onClick={closeTrial}
              className='absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/10 text-lg font-semibold text-white transition hover:bg-white/20 disabled:opacity-50'
              aria-label='Close trial form'
              disabled={trialSubmitting}
            >
              ×
            </button>
            <div className='space-y-2 pb-4 pr-8'>
              <h2 className='text-xl font-semibold text-white'>
                Claim Your Nexus Pulse Trial
              </h2>
              <p className='text-sm text-slate-300'>
                Choose the indicators you want to explore for 7 days and share
                your TradingView details.
              </p>
            </div>
            <form className='space-y-6' onSubmit={handleTrialSubmit}>
              <fieldset className='space-y-3'>
                <legend className='text-xs uppercase tracking-[0.28em] text-amber-200'>
                  Select indicators
                </legend>
                <div className='grid gap-2 sm:grid-cols-2'>
                  {indicatorOptions.map((option) => (
                    <label
                      key={option}
                      className='flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:border-white/20'
                    >
                      <input
                        type='checkbox'
                        name='indicators'
                        value={option}
                        checked={trialSelection.includes(option)}
                        onChange={() => toggleTrialSelection(option)}
                        className='h-4 w-4 rounded border-slate-400/60 bg-transparent text-amber-300 focus:ring-amber-300'
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className='grid gap-3 sm:grid-cols-2'>
                <div className='sm:col-span-2'>
                  <input
                    type='text'
                    name='name'
                    placeholder='Full Name'
                    required
                    className='w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-amber-300 focus:outline-none'
                  />
                </div>
                <div>
                  <input
                    type='text'
                    name='tradingview'
                    placeholder='TradingView Username'
                    required
                    className='w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-amber-300 focus:outline-none'
                  />
                </div>
                <div>
                  <input
                    type='email'
                    name='email'
                    placeholder='Email'
                    required
                    className='w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-amber-300 focus:outline-none'
                  />
                </div>
              </div>

              {trialError ? (
                <p className='rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-200'>
                  {trialError}
                </p>
              ) : null}

              <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                <span className='text-xs uppercase tracking-[0.3em] text-slate-400'>
                  Confirmation sent to you and the admin desk
                </span>
                <button
                  type='submit'
                  disabled={trialSubmitting}
                  className='inline-flex items-center justify-center rounded-full bg-amber-300 px-6 py-3 text-sm font-semibold text-black transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-70'
                >
                  {trialSubmitting ? 'Submitting…' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      <PaymentSheet
        open={paymentOpen}
        onClose={closePayment}
        plan={selectedPlan ?? defaultPlan}
      />
    </div>
  );
}
