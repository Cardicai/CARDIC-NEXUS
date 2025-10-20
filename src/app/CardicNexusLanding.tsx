'use client';

import Link from 'next/link';
import type { ChangeEvent, FormEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';

type TournamentFormState = {
  name: string;
  email: string;
  contact: string;
  country: string;
};

const INITIAL_FORM: TournamentFormState = {
  name: '',
  email: '',
  contact: '',
  country: '',
};

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

export default function CardicNexusLanding() {
  const [form, setForm] = useState<TournamentFormState>(INITIAL_FORM);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<SubmitState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const isSubmitDisabled = useMemo(
    () =>
      status === 'loading' ||
      !form.name.trim() ||
      !form.email.trim() ||
      !form.contact.trim() ||
      !form.country.trim() ||
      !proofFile,
    [form, proofFile, status]
  );

  useEffect(() => {
    if (status !== 'success') {
      return;
    }

    const timeout = setTimeout(() => {
      setStatus('idle');
    }, 4000);

    return () => clearTimeout(timeout);
  }, [status]);

  const handleChange =
    (field: keyof TournamentFormState) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
      if (status !== 'idle') {
        setStatus('idle');
        setErrorMessage('');
      }
    };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setProofFile(file);
    if (status !== 'idle') {
      setStatus('idle');
      setErrorMessage('');
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!event.currentTarget.checkValidity()) {
      event.currentTarget.reportValidity();
      return;
    }

    if (isSubmitDisabled || !proofFile) return;

    setStatus('loading');
    setErrorMessage('');

    const formData = new FormData();
    formData.append('name', form.name.trim());
    formData.append('email', form.email.trim());
    formData.append('contact', form.contact.trim());
    formData.append('country', form.country.trim());
    formData.append('proof', proofFile);

    try {
      const response = await fetch('/api/tournament/register', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const json = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        const message =
          json?.error || 'We could not complete your registration.';
        throw new Error(message);
      }

      setStatus('success');
      setForm(INITIAL_FORM);
      setProofFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'We could not complete your registration.';
      setErrorMessage(message);
      setStatus('error');
    }
  };

  return (
    <div className='relative min-h-screen overflow-hidden bg-slate-950 text-slate-100'>
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,#1f293b_0%,rgba(15,23,42,0.65)_45%,rgba(10,12,16,0.95)_100%)]' />
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.18),transparent_55%)]' />
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,184,0,0.18),transparent_60%)]' />

      <div className='relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center px-4 py-16 sm:px-8 lg:px-12'>
        <header className='mb-12 text-center'>
          <span className='inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200/80 backdrop-blur-sm'>
            Cardic Nexus Tournament
          </span>
          <h1 className='mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl'>
            Eligibility update — compete while the main platform is under
            maintenance
          </h1>
          <p className='mx-auto mt-4 max-w-2xl text-base text-slate-300 sm:text-lg'>
            Secure your slot in the Cardic Nexus Tournament by meeting the
            latest social eligibility requirements. Register below and
            you&apos;ll receive confirmation straight to your inbox.
          </p>
        </header>

        <div className='grid w-full gap-10 lg:grid-cols-[minmax(0,0.95fr),minmax(0,1.05fr)]'>
          <section className='rounded-3xl border border-white/10 bg-white/5 p-8 text-left shadow-xl backdrop-blur lg:p-10'>
            <h2 className='text-2xl font-semibold text-white sm:text-3xl'>
              What to expect
            </h2>
            <ul className='mt-6 space-y-4 text-sm text-slate-300 sm:text-base'>
              <li>
                <span className='font-semibold text-cyan-200'>
                  Instant acknowledgement:
                </span>{' '}
                Submit your tournament details and we&apos;ll confirm via email.
              </li>
              <li>
                <span className='font-semibold text-amber-200'>
                  Eligibility check:
                </span>{' '}
                Upload proof that you follow at least two official Cardic Nexus
                social channels to qualify for the tournament round.
              </li>
              <li>
                <span className='font-semibold text-slate-100'>
                  Dashboard access:
                </span>{' '}
                Keep an eye on your inbox for the link to the performance
                dashboard as soon as we enable accounts.
              </li>
            </ul>

            <div className='mt-8 rounded-2xl border border-white/10 bg-black/40 p-6 text-sm text-slate-300 shadow-inner'>
              <p>
                Already registered? Visit the{' '}
                <Link
                  href='/dashboard'
                  className='font-semibold text-cyan-200 transition hover:text-cyan-100'
                >
                  Cardic Tournament Dashboard
                </Link>{' '}
                to check for updates.
              </p>
            </div>
          </section>

          <form
            onSubmit={handleSubmit}
            className='relative overflow-hidden rounded-3xl border border-cyan-300/20 bg-slate-900/70 p-8 shadow-[0_25px_60px_rgba(8,47,73,0.35)] backdrop-blur-xl lg:p-10'
          >
            <div className='absolute -top-6 right-8 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.4em] text-cyan-100/80'>
              <span
                className='h-2 w-2 animate-ping rounded-full bg-cyan-200'
                aria-hidden='true'
              />
              Live
            </div>
            <h2 className='text-2xl font-semibold text-white sm:text-3xl'>
              Register now
            </h2>
            <p className='mt-2 text-sm text-slate-300 sm:text-base'>
              Complete every field and include your proof of following our
              channels. We&apos;ll send a confirmation with next steps.
            </p>

            <div className='mt-8 space-y-6'>
              <div>
                <label
                  htmlFor='tournament-name'
                  className='text-sm font-medium text-slate-200'
                >
                  Full name
                </label>
                <input
                  id='tournament-name'
                  name='name'
                  type='text'
                  autoComplete='name'
                  required
                  value={form.name}
                  onChange={handleChange('name')}
                  className='mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/60'
                />
              </div>

              <div>
                <label
                  htmlFor='tournament-email'
                  className='text-sm font-medium text-slate-200'
                >
                  Email address
                </label>
                <input
                  id='tournament-email'
                  name='email'
                  type='email'
                  autoComplete='email'
                  required
                  value={form.email}
                  onChange={handleChange('email')}
                  className='mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/60'
                />
              </div>

              <div>
                <label
                  htmlFor='tournament-contact'
                  className='text-sm font-medium text-slate-200'
                >
                  Contact info (phone or Telegram)
                </label>
                <input
                  id='tournament-contact'
                  name='contact'
                  type='text'
                  required
                  value={form.contact}
                  onChange={handleChange('contact')}
                  className='mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/60'
                />
              </div>

              <div>
                <label
                  htmlFor='tournament-country'
                  className='text-sm font-medium text-slate-200'
                >
                  Country
                </label>
                <input
                  id='tournament-country'
                  name='country'
                  type='text'
                  required
                  value={form.country}
                  onChange={handleChange('country')}
                  className='mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/60'
                />
              </div>

              <div>
                <label
                  htmlFor='tournament-proof'
                  className='text-sm font-medium text-slate-200'
                >
                  Proof of following (upload image or screenshot)
                </label>
                <div className='mt-2 rounded-2xl border border-dashed border-cyan-400/40 bg-slate-950/50 p-4 text-sm shadow-inner transition hover:border-cyan-300/70 hover:bg-slate-900/60'>
                  <input
                    ref={fileInputRef}
                    id='tournament-proof'
                    name='proof'
                    type='file'
                    accept='image/*,application/pdf'
                    required
                    onChange={handleFileChange}
                    className='block w-full cursor-pointer text-sm text-slate-300 file:mr-4 file:rounded-full file:border-0 file:bg-cyan-500/20 file:px-4 file:py-2 file:text-sm file:font-semibold file:uppercase file:tracking-wide file:text-cyan-100 hover:file:bg-cyan-500/30'
                  />
                  <p className='mt-2 text-xs text-slate-400'>
                    Attach proof that you follow at least two official Cardic
                    Nexus social media accounts. Maximum size: 10&nbsp;MB.
                  </p>
                  {proofFile ? (
                    <p className='mt-2 text-xs text-cyan-200'>
                      Selected: {proofFile.name}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            {status === 'success' ? (
              <div
                className='absolute inset-0 flex items-center justify-center bg-slate-950/80 px-6 backdrop-blur-md transition-all duration-500 ease-out'
                aria-live='polite'
                role='status'
              >
                <div
                  className='w-full max-w-sm rounded-3xl border border-emerald-400/40 bg-emerald-500/10 px-6 py-8 text-center shadow-[0_20px_50px_rgba(16,185,129,0.35)]'
                  style={{ animation: 'success-pop 0.45s ease-out forwards' }}
                >
                  <p className='text-2xl font-bold text-emerald-200 sm:text-3xl'>
                    🎉 YOU&apos;RE IN!
                  </p>
                  <p className='mt-3 text-base font-medium text-emerald-100'>
                    🥳 Check your email for more details.
                  </p>
                </div>
              </div>
            ) : null}

            {status === 'error' && errorMessage ? (
              <div
                className='mt-6 rounded-2xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-200'
                role='alert'
              >
                {errorMessage}
              </div>
            ) : null}

            <button
              type='submit'
              disabled={isSubmitDisabled}
              className='relative mt-8 inline-flex w-full items-center justify-center rounded-2xl border border-cyan-200/60 bg-gradient-to-r from-cyan-500/80 via-sky-500/90 to-cyan-400/80 px-6 py-3 text-base font-semibold uppercase tracking-wide text-white shadow-[0_16px_40px_rgba(8,145,178,0.45)] transition-transform duration-300 hover:-translate-y-0.5 hover:from-cyan-400/80 hover:via-sky-400/90 hover:to-cyan-300/80 hover:shadow-[0_22px_55px_rgba(8,145,178,0.55)] disabled:translate-y-0 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/10 disabled:text-slate-400 disabled:shadow-none'
            >
              {status === 'loading' ? 'Submitting…' : 'Submit registration'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
