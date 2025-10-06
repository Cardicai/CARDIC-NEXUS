'use client';

import { Copy, Share2, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import { AnimatePresence, motion } from '@/lib/safe-motion';

const highlights = [
  {
    title: 'Live referral tracking',
    description:
      'Generate on-chain ready referral codes in seconds and watch every signup post in real time.',
  },
  {
    title: 'Automatic admin logging',
    description:
      'Every referral instantly emails the Cardic Nexus admin desk for transparent auditing.',
  },
  {
    title: 'Weekly payouts',
    description:
      'Review transparent payout logs and share codes instantly with your community every week.',
  },
];

const terms = [
  'Weekly payouts via bank, PayPal, or USDT',
  '35% applies to net receipts after refunds',
  'Fraud or self-referrals void',
  'All activity auto-emailed to Cardic Nexus admin address',
];

const steps = [
  'Mint your code',
  'Share it',
  'They subscribe',
  'Admin desk logs it',
  'You get 35% forever',
];

const REFERRAL_CODE = 'NEX3267-ALE';

const initialCheckout = {
  name: '',
  email: '',
  product: '',
  amount: '',
  referralCode: '',
};

const initialRefer = {
  name: '',
  email: '',
};

export default function CardicNexusLanding() {
  const [isReferOpen, setIsReferOpen] = useState(false);
  const [referForm, setReferForm] = useState(initialRefer);
  const [referSubmitted, setReferSubmitted] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState(initialCheckout);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const shareLink = useMemo(
    () => `https://cardicnexus.com/?ref=${REFERRAL_CODE}`,
    []
  );

  const openReferModal = () => {
    setReferForm(initialRefer);
    setReferSubmitted(false);
    setIsReferOpen(true);
  };

  const closeReferModal = () => {
    setIsReferOpen(false);
  };

  const handleReferChange = (field) => (event) => {
    setReferForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleReferSubmit = (event) => {
    event.preventDefault();
    setReferSubmitted(true);
  };

  const handleCheckoutChange = (field) => (event) => {
    setCheckoutForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleCheckoutSubmit = (event) => {
    event.preventDefault();
    setCheckoutSuccess(true);
    setCheckoutForm(initialCheckout);
  };

  const copyToClipboard = async (value) => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Clipboard might be unavailable; fail silently.
    }
  };

  return (
    <div className='relative min-h-screen overflow-hidden bg-slate-950 text-slate-100'>
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.22),_transparent_55%)]' />
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(250,204,21,0.12),_transparent_55%)]' />

      <header className='relative z-10 border-b border-white/10 bg-slate-950/60 backdrop-blur'>
        <div className='mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-6'>
          <div className='flex items-center gap-3'>
            <div className='flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-sky-500 text-base font-semibold text-slate-900 shadow-lg shadow-sky-500/20'>
              CN
            </div>
            <div>
              <p className='text-xs uppercase tracking-[0.3em] text-slate-400'>
                Cardic Nexus
              </p>
              <p className='text-base font-semibold text-slate-100'>
                Affiliate Command
              </p>
            </div>
          </div>

          <nav className='flex items-center gap-4 text-sm text-slate-300'>
            <a
              className='hidden rounded-full border border-white/10 px-4 py-2 hover:border-slate-300 hover:text-white sm:block'
              href='#checkout'
            >
              Checkout
            </a>
            <button
              type='button'
              onClick={openReferModal}
              className='rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:from-sky-400 hover:to-indigo-400'
            >
              Refer & Earn
            </button>
          </nav>
        </div>
      </header>

      <main className='relative z-10 pb-24'>
        <section className='mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-16 pt-16 lg:flex-row lg:items-center lg:gap-16'>
          <div className='flex-1 text-center lg:text-left'>
            <p className='mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-sky-400'>
              Earn 35% forever
            </p>
            <h1 className='text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl'>
              EARN 35% FOREVER
            </h1>
            <p className='mt-6 text-lg text-slate-300 sm:text-xl'>
              Share the Cardic Nexus edge and collect elite residuals.
            </p>
            <p className='mt-4 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base lg:max-w-xl'>
              Unlock a premium partner lane built for creators, traders, and
              fintech communities. Every person you refer who subscribes unlocks
              a 35% commission for life — and every signup is instantly logged
              and sent to our admin team for verification.
            </p>
            <div className='mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start'>
              <button
                type='button'
                onClick={openReferModal}
                className='inline-flex items-center justify-center rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:from-sky-400 hover:via-indigo-400 hover:to-purple-400'
              >
                Mint my referral code
              </button>
              <a
                className='inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-100 hover:text-white'
                href='https://cardicnexus.com/partnerships'
              >
                Talk to partnerships →
              </a>
            </div>
          </div>

          <div className='flex flex-1 items-center justify-center'>
            <div className='relative w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 text-left shadow-2xl shadow-sky-900/30 backdrop-blur'>
              <div className='absolute -top-10 right-6 hidden h-20 w-20 rounded-full bg-gradient-to-br from-sky-500/30 to-transparent blur-xl lg:block' />
              <p className='text-sm font-semibold uppercase tracking-[0.3em] text-slate-400'>
                Affiliate Pulse
              </p>
              <p className='mt-3 text-3xl font-semibold text-white'>
                35% lifetime residuals
              </p>
              <p className='mt-4 text-sm leading-relaxed text-slate-300'>
                Tap in with your fintech, trading, or creator collective. Every
                referral is auto-notified to HQ and locked for weekly payouts.
              </p>
              <div className='mt-6 space-y-4 text-sm text-slate-300'>
                <div className='flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3'>
                  <span>Live referrals</span>
                  <span className='text-right font-semibold text-sky-400'>
                    Synced
                  </span>
                </div>
                <div className='flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3'>
                  <span>Admin confirmations</span>
                  <span className='text-right font-semibold text-emerald-400'>
                    Instant
                  </span>
                </div>
                <div className='flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3'>
                  <span>Commission cycle</span>
                  <span className='text-right font-semibold text-amber-300'>
                    Weekly
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className='mx-auto max-w-6xl px-6 py-12'
          aria-label='Affiliate highlights'
        >
          <div className='grid gap-6 md:grid-cols-3'>
            {highlights.map((highlight) => (
              <div
                key={highlight.title}
                className='group rounded-3xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-slate-900/20 transition hover:border-sky-400/60 hover:shadow-sky-900/30'
              >
                <h3 className='text-lg font-semibold text-white'>
                  {highlight.title}
                </h3>
                <p className='mt-3 text-sm leading-relaxed text-slate-300'>
                  {highlight.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className='mx-auto max-w-6xl px-6 py-12'>
          <h2 className='text-center text-2xl font-semibold text-white sm:text-3xl'>
            Secure Checkout
          </h2>
          <p className='mx-auto mt-4 max-w-3xl text-center text-sm leading-relaxed text-slate-300 sm:text-base'>
            Complete your subscription and, if you have a referral code, add it
            below. Your purchase will be logged, and the referring partner will
            automatically receive 35% credited to their account.
          </p>

          <form
            id='checkout'
            onSubmit={handleCheckoutSubmit}
            className='mx-auto mt-10 max-w-2xl space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-slate-900/30 backdrop-blur'
          >
            <div className='grid gap-6 sm:grid-cols-2'>
              <label className='flex flex-col text-sm text-slate-200'>
                Full name
                <input
                  required
                  value={checkoutForm.name}
                  onChange={handleCheckoutChange('name')}
                  className='mt-2 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/30'
                  placeholder='Alex Mercer'
                />
              </label>
              <label className='flex flex-col text-sm text-slate-200'>
                Email
                <input
                  required
                  type='email'
                  value={checkoutForm.email}
                  onChange={handleCheckoutChange('email')}
                  className='mt-2 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/30'
                  placeholder='you@collective.xyz'
                />
              </label>
              <label className='flex flex-col text-sm text-slate-200'>
                Product
                <input
                  required
                  value={checkoutForm.product}
                  onChange={handleCheckoutChange('product')}
                  className='mt-2 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/30'
                  placeholder='CARDIC Heat 3.0'
                />
              </label>
              <label className='flex flex-col text-sm text-slate-200'>
                Amount
                <input
                  required
                  value={checkoutForm.amount}
                  onChange={handleCheckoutChange('amount')}
                  className='mt-2 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/30'
                  placeholder='$179.00'
                />
              </label>
            </div>
            <label className='flex flex-col text-sm text-slate-200'>
              Referral code (optional)
              <input
                value={checkoutForm.referralCode}
                onChange={handleCheckoutChange('referralCode')}
                className='mt-2 rounded-2xl border border-dashed border-white/20 bg-slate-900/60 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/30'
                placeholder='Enter code if provided'
              />
            </label>
            <button
              type='submit'
              className='w-full rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:from-sky-400 hover:via-indigo-400 hover:to-purple-400'
            >
              Complete checkout
            </button>

            <AnimatePresence>
              {checkoutSuccess && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className='rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200'
                >
                  Your order + referral info has been sent to our admin email
                  for processing.
                </motion.p>
              )}
            </AnimatePresence>
          </form>
        </section>

        <section className='mx-auto max-w-6xl px-6 py-12'>
          <div className='flex flex-wrap items-center justify-center gap-4 rounded-full border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold text-slate-200 shadow-lg shadow-slate-900/20'>
            {steps.map((step, index) => (
              <div key={step} className='flex items-center gap-3 text-center'>
                <span>{step}</span>
                {index < steps.length - 1 && (
                  <span className='hidden text-sky-400 sm:inline'>→</span>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className='mx-auto max-w-4xl px-6 pb-6 pt-4'>
          <h2 className='text-center text-2xl font-semibold text-white sm:text-3xl'>
            Terms
          </h2>
          <ul className='mt-6 space-y-3 text-sm leading-relaxed text-slate-300 sm:text-base'>
            {terms.map((term) => (
              <li
                key={term}
                className='flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow shadow-slate-900/10'
              >
                <span className='mt-1 h-2 w-2 rounded-full bg-sky-400' />
                <span>{term}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <AnimatePresence>
        {isReferOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-6 py-12 backdrop-blur'
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ type: 'spring', stiffness: 120, damping: 18 }}
              className='relative w-full max-w-lg rounded-3xl border border-white/10 bg-slate-950 px-8 py-10 shadow-2xl shadow-sky-900/40'
            >
              <button
                type='button'
                onClick={closeReferModal}
                className='absolute right-4 top-4 rounded-full border border-white/10 p-2 text-slate-400 transition hover:border-slate-300 hover:text-white'
              >
                <X className='h-4 w-4' />
              </button>
              <div className='mb-6 flex items-center gap-3'>
                <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 text-lg font-semibold text-white shadow-lg shadow-sky-500/40'>
                  35%
                </div>
                <div>
                  <p className='text-xs uppercase tracking-[0.3em] text-slate-400'>
                    Affiliate Access
                  </p>
                  <h2 className='text-xl font-semibold text-white'>
                    Refer &amp; Earn — 35% lifetime
                  </h2>
                </div>
              </div>

              {!referSubmitted ? (
                <form className='space-y-5' onSubmit={handleReferSubmit}>
                  <label className='flex flex-col text-sm text-slate-200'>
                    Your name
                    <input
                      required
                      value={referForm.name}
                      onChange={handleReferChange('name')}
                      className='mt-2 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/30'
                      placeholder='Jordan Rivers'
                    />
                  </label>
                  <label className='flex flex-col text-sm text-slate-200'>
                    Your email
                    <input
                      required
                      type='email'
                      value={referForm.email}
                      onChange={handleReferChange('email')}
                      className='mt-2 rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/30'
                      placeholder='you@collective.xyz'
                    />
                  </label>
                  <button
                    type='submit'
                    className='w-full rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:from-sky-400 hover:via-indigo-400 hover:to-purple-400'
                  >
                    Get my referral code
                  </button>
                </form>
              ) : (
                <div className='space-y-6'>
                  <div className='rounded-3xl border border-white/10 bg-white/5 p-6 text-center text-slate-100 shadow shadow-sky-900/30'>
                    <p className='text-base font-semibold text-white'>
                      🎉 Here’s your referral code
                    </p>
                    <code className='mt-4 block rounded-2xl border border-white/10 bg-slate-900/80 px-6 py-4 text-2xl font-mono tracking-[0.3em] text-amber-300'>
                      {REFERRAL_CODE}
                    </code>
                    <p className='mt-4 text-sm text-slate-300'>
                      Your referral code has been sent to our admin desk.
                    </p>
                  </div>
                  <div className='flex flex-col gap-3 sm:flex-row'>
                    <button
                      type='button'
                      onClick={() => copyToClipboard(REFERRAL_CODE)}
                      className='flex flex-1 items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-slate-100 hover:text-slate-50'
                    >
                      <Copy className='h-4 w-4' />
                      Copy code
                    </button>
                    <button
                      type='button'
                      onClick={() => copyToClipboard(shareLink)}
                      className='flex flex-1 items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-slate-100 hover:text-slate-50'
                    >
                      <Share2 className='h-4 w-4' />
                      Share link
                    </button>
                  </div>
                  <a
                    className='block text-center text-sm text-sky-400 underline-offset-4 hover:underline'
                    href={shareLink}
                    target='_blank'
                    rel='noreferrer'
                  >
                    {shareLink}
                  </a>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
