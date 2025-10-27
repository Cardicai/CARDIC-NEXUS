'use client';

import { X } from 'lucide-react';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type TrialFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

type TrialFormState = {
  name: string;
  email: string;
  tv: string;
};

const defaultState: TrialFormState = {
  name: '',
  email: '',
  tv: '',
};

export default function TrialFormModal({
  open,
  onOpenChange,
  onSuccess,
}: TrialFormModalProps) {
  const [form, setForm] = useState<TrialFormState>(defaultState);
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      setForm(defaultState);
      setOk(false);
      setLoading(false);
      return undefined;
    }

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onOpenChange(false);
      }
    };

    window.addEventListener('keydown', handleKey);

    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [open, onOpenChange]);

  const updateField =
    (key: keyof TrialFormState) => (event: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [key]: event.target.value }));
    };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name || !form.email || !form.tv) {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/trial/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      if (response.ok) {
        setOk(true);
        onSuccess?.();
      }
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || !open) {
    return null;
  }

  return createPortal(
    <div className='fixed inset-0 z-[1000] flex items-center justify-center px-4 py-8'>
      <button
        type='button'
        className='absolute inset-0 bg-black/60 backdrop-blur-sm'
        aria-label='Close trial form'
        onClick={() => onOpenChange(false)}
      />
      <div
        role='dialog'
        aria-modal='true'
        aria-label='Claim 7-Day Free Trial'
        className='relative z-[1001] w-[min(560px,95vw)] rounded-2xl border border-[#1a2230] bg-[#0e131b] p-5 shadow-2xl'
      >
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-lg font-semibold text-white'>
            Claim 7-Day Free Trial
          </h2>
          <button
            type='button'
            onClick={() => onOpenChange(false)}
            className='rounded p-2 text-slate-200 transition hover:bg-white/5'
          >
            <X className='h-4 w-4' aria-hidden />
          </button>
        </div>
        {!ok ? (
          <form onSubmit={submit} className='space-y-4'>
            <div>
              <label className='text-sm text-slate-300' htmlFor='trial-name'>
                Full name
              </label>
              <input
                id='trial-name'
                name='name'
                value={form.name}
                onChange={updateField('name')}
                className='mt-1 w-full rounded-lg border border-[#1a2230] bg-[#0a0d13] px-3 py-2 text-sm text-slate-100 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-500'
                placeholder='Ada Lovelace'
                required
              />
            </div>
            <div>
              <label className='text-sm text-slate-300' htmlFor='trial-email'>
                Email
              </label>
              <input
                id='trial-email'
                type='email'
                name='email'
                value={form.email}
                onChange={updateField('email')}
                className='mt-1 w-full rounded-lg border border-[#1a2230] bg-[#0a0d13] px-3 py-2 text-sm text-slate-100 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-500'
                placeholder='you@gmail.com'
                required
              />
            </div>
            <div>
              <label className='text-sm text-slate-300' htmlFor='trial-tv'>
                TradingView username
              </label>
              <input
                id='trial-tv'
                name='tv'
                value={form.tv}
                onChange={updateField('tv')}
                className='mt-1 w-full rounded-lg border border-[#1a2230] bg-[#0a0d13] px-3 py-2 text-sm text-slate-100 outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-500'
                placeholder='@cardictrader'
                required
              />
            </div>
            <button
              type='submit'
              disabled={loading}
              className='w-full rounded-xl border border-violet-400/70 px-4 py-3 text-sm font-semibold text-violet-100 transition hover:border-violet-300 hover:text-white disabled:cursor-not-allowed disabled:opacity-70'
            >
              {loading ? 'Submitting…' : 'Start Free Trial'}
            </button>
          </form>
        ) : (
          <div className='space-y-3 text-slate-200'>
            <p>
              You’re in! We’ll activate your trial and send setup details by
              email.
            </p>
            <button
              type='button'
              onClick={() => onOpenChange(false)}
              className='rounded-xl border border-[#1a2230] px-4 py-2 text-sm text-slate-200 transition hover:border-violet-300'
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
