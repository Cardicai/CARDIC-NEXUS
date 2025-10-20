'use client';

import Link from 'next/link';
import type { ChangeEvent, FocusEvent, FormEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { COUNTRIES } from '@/data/countries';

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

type FieldKey = keyof TournamentFormState | 'proof';

const MAX_PROOF_SIZE_BYTES = 10 * 1024 * 1024;
const SUCCESS_TOAST_TEXT =
  '🎉 YOU’RE IN! 🥳 Check your email for more details.';

const normalizeCountryName = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

export default function CardicNexusLanding() {
  const [form, setForm] = useState<TournamentFormState>(INITIAL_FORM);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<SubmitState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>(
    {}
  );
  const [successMessage, setSuccessMessage] = useState(SUCCESS_TOAST_TEXT);

  const countryNames = useMemo(
    () => new Set(COUNTRIES.map(({ name }) => normalizeCountryName(name))),
    []
  );

  const setFieldError = (field: FieldKey, message?: string) => {
    setErrors((prev) => {
      if (message) {
        return { ...prev, [field]: message };
      }
      if (prev[field]) {
        const { [field]: _removed, ...rest } = prev;
        return rest;
      }
      return prev;
    });
  };

  const validateFieldValue = (
    field: FieldKey,
    value: string | File | null
  ): string | undefined => {
    if (field === 'proof') {
      if (!value || !(value instanceof File)) {
        return 'Upload proof that you follow at least two official channels.';
      }
      if (value.size > MAX_PROOF_SIZE_BYTES) {
        return 'Proof file must be 10 MB or smaller.';
      }
      return undefined;
    }

    const textValue = typeof value === 'string' ? value.trim() : '';

    switch (field) {
      case 'name':
        return textValue ? undefined : 'Full name is required.';
      case 'email': {
        if (!textValue) {
          return 'Email address is required.';
        }
        const emailPattern = /[^\s@]+@[^\s@]+\.[^\s@]+/;
        return emailPattern.test(textValue)
          ? undefined
          : 'Enter a valid email address.';
      }
      case 'contact':
        return textValue
          ? undefined
          : 'Contact info (phone or Telegram) is required.';
      case 'country':
        if (!textValue) {
          return 'Country is required.';
        }
        return countryNames.has(normalizeCountryName(textValue))
          ? undefined
          : 'Please select a country from the list.';
      default:
        return undefined;
    }
  };

  const hasClientErrors = useMemo(
    () => Object.values(errors).some((message) => Boolean(message)),
    [errors]
  );

  const isSubmitDisabled = useMemo(
    () =>
      status === 'loading' ||
      !form.name.trim() ||
      !form.email.trim() ||
      !form.contact.trim() ||
      !form.country.trim() ||
      !proofFile ||
      hasClientErrors,
    [form, proofFile, status, hasClientErrors]
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
      const value = event.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
      if (status !== 'idle') {
        setStatus('idle');
        setErrorMessage('');
      }

      if (touched[field] || errors[field]) {
        const validationMessage = validateFieldValue(field, value);
        setFieldError(field, validationMessage);
      }
    };

  const handleBlur =
    (field: keyof TournamentFormState) =>
    (event: FocusEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setTouched((prev) => ({ ...prev, [field]: true }));
      const validationMessage = validateFieldValue(field, value);
      setFieldError(field, validationMessage);
    };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    if (status !== 'idle') {
      setStatus('idle');
      setErrorMessage('');
    }

    setTouched((prev) => ({ ...prev, proof: true }));

    if (file && file.size > MAX_PROOF_SIZE_BYTES) {
      setProofFile(null);
      setFieldError('proof', 'Proof file must be 10 MB or smaller.');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setProofFile(file);
    const validationMessage = validateFieldValue('proof', file);
    setFieldError('proof', validationMessage);
  };

  const handleProofBlur = () => {
    setTouched((prev) => ({ ...prev, proof: true }));
    const validationMessage = validateFieldValue('proof', proofFile);
    setFieldError('proof', validationMessage);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: Partial<Record<FieldKey, string>> = {};

    (Object.keys(form) as (keyof TournamentFormState)[]).forEach((field) => {
      const validationMessage = validateFieldValue(field, form[field]);
      if (validationMessage) {
        nextErrors[field] = validationMessage;
      }
    });

    const proofValidation = validateFieldValue('proof', proofFile);
    if (proofValidation) {
      nextErrors.proof = proofValidation;
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setTouched({
        name: true,
        email: true,
        contact: true,
        country: true,
        proof: true,
      });
      setErrorMessage('Please fix the highlighted fields before submitting.');
      setStatus('error');
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

      const json = (await response.json().catch(() => null)) as {
        ok?: boolean;
        message?: string;
        error?: string;
      } | null;

      if (!response.ok || !json?.ok) {
        const message =
          json?.error || 'We could not complete your registration.';
        throw new Error(message);
      }

      setSuccessMessage(json?.message || SUCCESS_TOAST_TEXT);
      setStatus('success');
      setForm(INITIAL_FORM);
      setProofFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setErrors({});
      setTouched({});
      setErrorMessage('');
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
      {status === 'success' ? (
        <div className='pointer-events-none fixed inset-x-0 top-6 z-50 flex justify-center px-4'>
          <div
            className='flex max-w-xl items-center gap-3 rounded-2xl border border-emerald-400/40 bg-emerald-500/15 px-6 py-4 text-sm font-semibold text-emerald-100 shadow-[0_20px_45px_rgba(16,185,129,0.35)] backdrop-blur'
            role='status'
            aria-live='assertive'
            style={{ animation: 'success-pop 0.4s ease-out forwards' }}
          >
            <span className='text-xl'>🎉</span>
            <span>{successMessage}</span>
          </div>
        </div>
      ) : null}
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
                  onBlur={handleBlur('name')}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={
                    errors.name ? 'tournament-name-error' : undefined
                  }
                  className='mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/60'
                />
                {errors.name ? (
                  <p
                    id='tournament-name-error'
                    className='mt-2 text-xs text-rose-300'
                  >
                    {errors.name}
                  </p>
                ) : null}
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
                  onBlur={handleBlur('email')}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={
                    errors.email ? 'tournament-email-error' : undefined
                  }
                  className='mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/60'
                />
                {errors.email ? (
                  <p
                    id='tournament-email-error'
                    className='mt-2 text-xs text-rose-300'
                  >
                    {errors.email}
                  </p>
                ) : null}
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
                  onBlur={handleBlur('contact')}
                  aria-invalid={Boolean(errors.contact)}
                  aria-describedby={
                    errors.contact ? 'tournament-contact-error' : undefined
                  }
                  className='mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/60'
                />
                {errors.contact ? (
                  <p
                    id='tournament-contact-error'
                    className='mt-2 text-xs text-rose-300'
                  >
                    {errors.contact}
                  </p>
                ) : null}
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
                  list='tournament-country-options'
                  placeholder='Select your country'
                  autoComplete='country-name'
                  required
                  value={form.country}
                  onChange={handleChange('country')}
                  onBlur={handleBlur('country')}
                  aria-invalid={Boolean(errors.country)}
                  aria-describedby={
                    errors.country ? 'tournament-country-error' : undefined
                  }
                  className='mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/60'
                />
                {errors.country ? (
                  <p
                    id='tournament-country-error'
                    className='mt-2 text-xs text-rose-300'
                  >
                    {errors.country}
                  </p>
                ) : null}
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
                    onBlur={handleProofBlur}
                    aria-invalid={Boolean(errors.proof)}
                    aria-describedby={
                      errors.proof ? 'tournament-proof-error' : undefined
                    }
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
                  {errors.proof ? (
                    <p
                      id='tournament-proof-error'
                      className='mt-2 text-xs text-rose-300'
                    >
                      {errors.proof}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

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
              {status === 'loading' ? 'Uploading…' : 'Submit registration'}
            </button>
            <datalist id='tournament-country-options'>
              {COUNTRIES.map((country) => (
                <option key={country.code} value={country.name} />
              ))}
            </datalist>
          </form>
        </div>
      </div>
    </div>
  );
}
