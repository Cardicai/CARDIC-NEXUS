'use client';

import { FormEvent, useEffect, useState } from 'react';

type FreeTrialModalProps = {
  open: boolean;
  onClose: () => void;
};

const RESEND_ROUTE = '/api/claim-trial';

export default function FreeTrialModal({ open, onClose }: FreeTrialModalProps) {
  const [tradingview, setTradingview] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    setTradingview('');
    setEmail('');
    setError(null);
    setLoading(false);
    setSuccess(false);

    const { overflow } = document.body.style;
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeydown);

    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [open, onClose]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTradingview = tradingview.trim();
    const trimmedEmail = email.trim();

    if (!trimmedTradingview) {
      setError('Please provide your TradingView username.');
      return;
    }

    if (!trimmedEmail) {
      setError('Please provide your Gmail address.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(RESEND_ROUTE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tradingview: trimmedTradingview,
          email: trimmedEmail,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          data?.error || 'We could not submit your request. Please try again.';
        setError(message);
        return;
      }

      setSuccess(true);
    } catch (submissionError) {
      setError(
        'Unexpected error submitting your request. Please retry in a moment.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div
      className='fixed inset-0 z-[1200] flex items-center justify-center bg-slate-950/80 px-4 py-8 backdrop-blur-sm'
      role='dialog'
      aria-modal='true'
      aria-labelledby='free-trial-heading'
      onClick={onClose}
    >
      <div
        className='relative w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-[0_35px_120px_-30px_rgba(34,211,238,0.65)] ring-1 ring-cyan-400/25'
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type='button'
          className='absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300'
          onClick={onClose}
          aria-label='Close free trial modal'
        >
          ×
        </button>

        {success ? (
          <div className='flex flex-col items-center gap-4 text-center text-slate-100'>
            <div className='flex h-20 w-20 items-center justify-center rounded-full bg-cyan-500/20'>
              <svg
                className='h-12 w-12 text-cyan-300'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='3'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path className='checkmark-path' d='M5 13.5 9.5 18 19 7' />
              </svg>
            </div>
            <div className='space-y-2'>
              <p className='text-lg font-semibold text-white'>Sent!</p>
              <p className='text-sm text-slate-300'>
                Please check your email for more details.
              </p>
            </div>
            <button
              type='button'
              className='inline-flex items-center justify-center rounded-xl border border-cyan-400/40 bg-cyan-500/20 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70'
              onClick={onClose}
            >
              Close
            </button>
          </div>
        ) : (
          <form className='space-y-5 text-slate-100' onSubmit={handleSubmit}>
            <div className='space-y-2'>
              <h2
                id='free-trial-heading'
                className='text-xl font-semibold text-white'
              >
                Claim Your Free Trial
              </h2>
              <p className='text-sm text-slate-300'>
                Share your TradingView handle and Gmail so our team can unlock
                your access.
              </p>
            </div>
            <label className='block space-y-2 text-sm'>
              <span className='text-slate-300'>TradingView Username</span>
              <input
                type='text'
                name='tradingview'
                value={tradingview}
                onChange={(event) => setTradingview(event.target.value)}
                placeholder='@yourhandle'
                required
                className='w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50'
              />
            </label>
            <label className='block space-y-2 text-sm'>
              <span className='text-slate-300'>Gmail</span>
              <input
                type='email'
                name='email'
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder='you@gmail.com'
                required
                className='w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50'
              />
            </label>
            {error ? (
              <p className='text-sm text-red-400' role='alert'>
                {error}
              </p>
            ) : null}
            <button
              type='submit'
              disabled={loading}
              className='inline-flex w-full items-center justify-center rounded-xl border border-cyan-400/60 bg-cyan-500/80 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-slate-900 shadow-[0_0_25px_rgba(34,211,238,0.55)] transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70'
            >
              {loading ? 'Sending…' : 'Send Request'}
            </button>
          </form>
        )}
      </div>

      <style jsx>{`
        .checkmark-path {
          stroke-dasharray: 26;
          stroke-dashoffset: 26;
          animation: draw-check 0.6s ease forwards;
        }

        @keyframes draw-check {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
}
