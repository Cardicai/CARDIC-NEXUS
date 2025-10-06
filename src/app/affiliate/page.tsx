'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { type FormEvent, useMemo, useState } from 'react';

const AFFILIATE_BASE_URL = 'https://www.cardicnex.us';

type ReferStatus = 'idle' | 'loading' | 'success' | 'error';
type CheckoutStatus = 'idle' | 'loading' | 'success' | 'error';

const initialReferForm = {
  name: '',
  email: '',
};

const initialCheckoutForm = {
  fullName: '',
  email: '',
  product: '',
  amount: '',
  referralCode: '',
};

const products = [
  'CARDIC Heat 2.0',
  'CARDIC Heat 2.1',
  'CARDIC Heat 2.2',
  'CARDIC Oracle 1.0',
  'Premium Signals',
  'All-Access Membership',
];

const steps = [
  'Mint your code',
  'Share it',
  'They subscribe',
  'Admin logs it',
  'You earn 35% forever',
];

function initialsFromName(name: string) {
  if (!name.trim()) return 'AFF';
  return name
    .trim()
    .toUpperCase()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .padEnd(3, 'X')
    .slice(0, 3);
}

function generateReferralCode(name: string) {
  const numeric = Math.floor(1000 + Math.random() * 9000);
  const suffix = initialsFromName(name);
  return `NEX${numeric}-${suffix}`;
}

export default function AffiliatePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [referForm, setReferForm] = useState(initialReferForm);
  const [referStatus, setReferStatus] = useState<ReferStatus>('idle');
  const [referError, setReferError] = useState('');
  const [mintedCode, setMintedCode] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [copiedField, setCopiedField] = useState<'code' | 'link' | null>(null);

  const [checkoutForm, setCheckoutForm] = useState(initialCheckoutForm);
  const [checkoutStatus, setCheckoutStatus] = useState<CheckoutStatus>('idle');
  const [checkoutError, setCheckoutError] = useState('');

  const modalTitle = useMemo(() => {
    if (referStatus === 'success') {
      return 'Referral code minted';
    }
    return 'Mint your referral code';
  }, [referStatus]);

  const handleCopy = async (value: string, field: 'code' | 'link') => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2500);
    } catch (error) {
      setCopiedField(null);
    }
  };

  const handleReferSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setReferStatus('loading');
    setReferError('');

    const code = generateReferralCode(referForm.name);
    const link = `${AFFILIATE_BASE_URL}/?ref=${encodeURIComponent(code)}`;

    try {
      const response = await fetch('/api/affiliate/refer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: referForm.name,
          email: referForm.email,
          code,
          shareLink: link,
        }),
      });

      if (!response.ok) {
        throw new Error('Unable to submit referral details');
      }

      setMintedCode(code);
      setShareLink(link);
      setReferForm(initialReferForm);
      setReferStatus('success');
    } catch (error) {
      setReferError(
        'We were unable to mint your code. Please try again or reach out to the admin desk.'
      );
      setReferStatus('error');
    }
  };

  const handleCheckoutSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCheckoutStatus('loading');
    setCheckoutError('');

    try {
      const response = await fetch('/api/affiliate/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutForm),
      });

      if (!response.ok) {
        throw new Error('Unable to log checkout');
      }

      setCheckoutStatus('success');
      setCheckoutForm(initialCheckoutForm);
    } catch (error) {
      setCheckoutError(
        'We were unable to log your order. Please retry or contact the admin desk.'
      );
      setCheckoutStatus('error');
    }
  };

  return (
    <div className='min-h-screen bg-slate-950 text-slate-100'>
      <section className='relative isolate overflow-hidden border-b border-white/10 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-24'>
        <div className='mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 text-center'>
          <span className='rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-amber-200'>
            Partner with Cardic Nexus
          </span>
          <h1 className='text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl'>
            EARN 35% FOREVER
          </h1>
          <p className='max-w-2xl text-lg text-slate-300'>
            Share the Cardic Nexus edge and collect elite residuals.
          </p>
          <p className='max-w-3xl text-base text-slate-400 md:text-lg'>
            Invite traders, creators, and fintech communities to Cardic Nexus.
            Every person who subscribes with your code earns you a 35% lifetime
            commission.
          </p>
          <div className='flex flex-col gap-3 sm:flex-row'>
            <button
              type='button'
              onClick={() => {
                setIsModalOpen(true);
                if (referStatus === 'error') {
                  setReferStatus('idle');
                  setReferError('');
                }
                setCopiedField(null);
              }}
              className='inline-flex items-center justify-center rounded-xl border border-amber-400/70 bg-amber-400 px-6 py-3 text-base font-semibold text-slate-900 shadow-[0_0_35px_rgba(245,197,107,0.35)] transition hover:brightness-110'
            >
              Mint my referral code
            </button>
            <a
              href='mailto:partnerships@cardicnex.us'
              className='inline-flex items-center justify-center rounded-xl border border-slate-700 px-6 py-3 text-base font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white'
            >
              Talk to partnerships →
            </a>
          </div>
        </div>
      </section>

      <section className='mx-auto grid max-w-5xl gap-10 px-6 py-20 md:grid-cols-[1.1fr_1fr]'>
        <div className='rounded-3xl border border-white/10 bg-slate-900/60 p-8 shadow-2xl shadow-amber-500/10 backdrop-blur'>
          <h2 className='text-2xl font-semibold text-white'>Secure Checkout</h2>
          <p className='mt-2 text-sm text-slate-300'>
            Complete your subscription and, if you have a referral code, enter
            it below. The referring partner automatically receives 35% credited
            to their account.
          </p>
          <form className='mt-8 space-y-6' onSubmit={handleCheckoutSubmit}>
            <div className='space-y-2'>
              <label
                className='text-sm font-medium text-slate-200'
                htmlFor='fullName'
              >
                Full Name
              </label>
              <input
                id='fullName'
                name='fullName'
                required
                value={checkoutForm.fullName}
                onChange={(event) =>
                  setCheckoutForm((prev) => ({
                    ...prev,
                    fullName: event.target.value,
                  }))
                }
                className='w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white shadow-inner focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/60'
              />
            </div>
            <div className='space-y-2'>
              <label
                className='text-sm font-medium text-slate-200'
                htmlFor='checkout-email'
              >
                Email
              </label>
              <input
                id='checkout-email'
                name='email'
                type='email'
                required
                value={checkoutForm.email}
                onChange={(event) =>
                  setCheckoutForm((prev) => ({
                    ...prev,
                    email: event.target.value,
                  }))
                }
                className='w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white shadow-inner focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/60'
              />
            </div>
            <div className='space-y-2'>
              <label
                className='text-sm font-medium text-slate-200'
                htmlFor='product'
              >
                Product
              </label>
              <select
                id='product'
                name='product'
                required
                value={checkoutForm.product}
                onChange={(event) =>
                  setCheckoutForm((prev) => ({
                    ...prev,
                    product: event.target.value,
                  }))
                }
                className='w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/60'
              >
                <option value='' disabled>
                  Select a product
                </option>
                {products.map((product) => (
                  <option key={product} value={product}>
                    {product}
                  </option>
                ))}
              </select>
            </div>
            <div className='space-y-2'>
              <label
                className='text-sm font-medium text-slate-200'
                htmlFor='amount'
              >
                Amount
              </label>
              <input
                id='amount'
                name='amount'
                required
                value={checkoutForm.amount}
                onChange={(event) =>
                  setCheckoutForm((prev) => ({
                    ...prev,
                    amount: event.target.value,
                  }))
                }
                className='w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white shadow-inner focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/60'
              />
            </div>
            <div className='space-y-2'>
              <div className='flex items-center justify-between gap-3'>
                <label
                  className='text-sm font-medium text-slate-200'
                  htmlFor='referralCode'
                >
                  Referral Code (optional)
                </label>
                {checkoutForm.referralCode && (
                  <button
                    type='button'
                    onClick={() =>
                      handleCopy(checkoutForm.referralCode, 'code')
                    }
                    className='text-xs font-semibold text-amber-300 hover:text-amber-100'
                  >
                    Copy
                  </button>
                )}
              </div>
              <input
                id='referralCode'
                name='referralCode'
                placeholder='Enter partner code if provided'
                value={checkoutForm.referralCode}
                onChange={(event) =>
                  setCheckoutForm((prev) => ({
                    ...prev,
                    referralCode: event.target.value,
                  }))
                }
                className='w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white shadow-inner focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/60'
              />
            </div>
            {checkoutStatus === 'success' && (
              <div className='rounded-2xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200'>
                Order received. The admin desk has been notified for
                verification.
              </div>
            )}
            {checkoutStatus === 'error' && checkoutError && (
              <div className='rounded-2xl border border-rose-400/40 bg-rose-400/10 px-4 py-3 text-sm text-rose-200'>
                {checkoutError}
              </div>
            )}
            <button
              type='submit'
              disabled={checkoutStatus === 'loading'}
              className='inline-flex w-full items-center justify-center rounded-xl border border-amber-400/60 bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-900 shadow-[0_0_35px_rgba(245,197,107,0.3)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70'
            >
              {checkoutStatus === 'loading' ? 'Submitting…' : 'Submit order'}
            </button>
          </form>
        </div>

        <div className='flex flex-col justify-between gap-10'>
          <div className='rounded-3xl border border-white/10 bg-slate-900/40 p-8 shadow-xl shadow-blue-500/10 backdrop-blur'>
            <h3 className='text-xl font-semibold text-white'>
              Program Snapshot
            </h3>
            <ul className='mt-6 space-y-4 text-sm text-slate-300'>
              <li>
                • 35% lifetime revenue share on every verified subscription.
              </li>
              <li>• Weekly payouts processed by the admin desk.</li>
              <li>• Manual fraud checks keep the program elite.</li>
              <li>• Dedicated support for pro trading communities.</li>
            </ul>
            <Link
              href='/'
              className='mt-8 inline-flex items-center gap-2 text-sm font-semibold text-amber-300 hover:text-amber-100'
            >
              View platform overview ↗
            </Link>
          </div>

          <div className='rounded-3xl border border-white/5 bg-slate-900/40 p-6 text-sm text-slate-300 shadow-lg shadow-purple-500/10 backdrop-blur'>
            <h4 className='text-lg font-semibold text-white'>How it works</h4>
            <p className='mt-3'>
              Every referral is tracked and routed to our admin desk. Once a
              subscription is verified, your residual payout is queued for the
              weekly cycle.
            </p>
          </div>
        </div>
      </section>

      <section className='bg-slate-900/50 py-12'>
        <div className='mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-4 px-6 text-center text-sm font-semibold uppercase tracking-[0.3em] text-amber-200'>
          {steps.map((step, index) => (
            <div key={step} className='flex items-center gap-4'>
              <span>{step}</span>
              {index !== steps.length - 1 && (
                <span className='text-amber-400/60'>→</span>
              )}
            </div>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              className='mx-4 w-full max-w-lg rounded-3xl border border-white/10 bg-slate-950 p-8 text-left shadow-2xl shadow-amber-500/10'
              onClick={(event) => event.stopPropagation()}
            >
              <div className='flex items-start justify-between gap-4'>
                <div>
                  <h2 className='text-2xl font-semibold text-white'>
                    {modalTitle}
                  </h2>
                  <p className='mt-2 text-sm text-slate-300'>
                    Share your details to mint a personal referral code. Our
                    admin desk receives every submission instantly.
                  </p>
                </div>
                <button
                  type='button'
                  onClick={() => setIsModalOpen(false)}
                  className='rounded-full border border-white/10 p-2 text-slate-400 transition hover:text-white'
                  aria-label='Close modal'
                >
                  ×
                </button>
              </div>

              {referStatus !== 'success' && (
                <form className='mt-8 space-y-6' onSubmit={handleReferSubmit}>
                  <div className='space-y-2'>
                    <label
                      className='text-sm font-medium text-slate-200'
                      htmlFor='refer-name'
                    >
                      Name
                    </label>
                    <input
                      id='refer-name'
                      name='name'
                      required
                      value={referForm.name}
                      onChange={(event) =>
                        setReferForm((prev) => ({
                          ...prev,
                          name: event.target.value,
                        }))
                      }
                      className='w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white shadow-inner focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/60'
                    />
                  </div>
                  <div className='space-y-2'>
                    <label
                      className='text-sm font-medium text-slate-200'
                      htmlFor='refer-email'
                    >
                      Email
                    </label>
                    <input
                      id='refer-email'
                      name='email'
                      type='email'
                      required
                      value={referForm.email}
                      onChange={(event) =>
                        setReferForm((prev) => ({
                          ...prev,
                          email: event.target.value,
                        }))
                      }
                      className='w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white shadow-inner focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/60'
                    />
                  </div>
                  {referStatus === 'error' && referError && (
                    <div className='rounded-2xl border border-rose-400/40 bg-rose-400/10 px-4 py-3 text-sm text-rose-200'>
                      {referError}
                    </div>
                  )}
                  <button
                    type='submit'
                    disabled={referStatus === 'loading'}
                    className='inline-flex w-full items-center justify-center rounded-xl border border-amber-400/60 bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-900 shadow-[0_0_35px_rgba(245,197,107,0.3)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70'
                  >
                    {referStatus === 'loading'
                      ? 'Minting…'
                      : 'Mint referral code'}
                  </button>
                </form>
              )}

              {referStatus === 'success' && (
                <div className='mt-8 space-y-6'>
                  <div className='rounded-2xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200'>
                    Your referral code has been sent to our admin desk.
                  </div>
                  <div>
                    <p className='text-xs uppercase tracking-[0.3em] text-slate-400'>
                      Referral code
                    </p>
                    <div className='mt-2 flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-lg font-semibold text-white'>
                      <span>{mintedCode}</span>
                      <button
                        type='button'
                        onClick={() => handleCopy(mintedCode, 'code')}
                        className='text-xs font-semibold text-amber-300 hover:text-amber-100'
                      >
                        {copiedField === 'code' ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className='text-xs uppercase tracking-[0.3em] text-slate-400'>
                      Share link
                    </p>
                    <div className='mt-2 flex flex-col gap-3 rounded-2xl border border-slate-700 bg-slate-900 p-4 text-sm text-slate-200'>
                      <code className='break-all text-amber-200'>
                        {shareLink}
                      </code>
                      <button
                        type='button'
                        onClick={() => handleCopy(shareLink, 'link')}
                        className='self-start rounded-full border border-amber-400/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-amber-200 transition hover:bg-amber-400/10'
                      >
                        {copiedField === 'link' ? 'Link copied' : 'Copy link'}
                      </button>
                    </div>
                  </div>
                  <p className='text-sm text-slate-400'>
                    Share this link with your community. Every checkout tagged
                    with your code routes 35% to your affiliate ledger.
                  </p>
                  <button
                    type='button'
                    onClick={() => {
                      setReferStatus('idle');
                      setReferForm(initialReferForm);
                      setMintedCode('');
                      setShareLink('');
                    }}
                    className='inline-flex items-center justify-center rounded-full border border-slate-700 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-slate-200 transition hover:border-amber-400 hover:text-white'
                  >
                    Mint another code
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
