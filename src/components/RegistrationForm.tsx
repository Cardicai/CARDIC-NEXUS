'use client';

import { ChangeEvent, FormEvent, useRef, useState } from 'react';

import { findInvalidEmail, parseEmailList } from '@/lib/email-address';

import { submitRegistration } from '@/components/useSubmitRegistration';

type RegistrationFormProps = {
  className?: string;
};

type FormState = {
  name: string;
  email: string;
  telegram: string;
  country: string;
  proof: string;
  screenshot: File | null;
  agree: boolean;
};

type SubmissionStatus =
  | { type: 'idle'; message: '' }
  | { type: 'loading' | 'success' | 'error'; message: string };

const createInitialFormState = (): FormState => ({
  name: '',
  email: '',
  telegram: '',
  country: '',
  proof: '',
  screenshot: null,
  agree: false,
});

const countryOptions = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'Andorra',
  'Angola',
  'Antigua and Barbuda',
  'Argentina',
  'Armenia',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bhutan',
  'Bolivia',
  'Bosnia and Herzegovina',
  'Botswana',
  'Brazil',
  'Brunei',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Cape Verde',
  'Central African Republic',
  'Chad',
  'Chile',
  'China',
  'Colombia',
  'Comoros',
  'Congo (Congo-Brazzaville)',
  'Costa Rica',
  'Croatia',
  'Cuba',
  'Cyprus',
  'Czech Republic',
  'Democratic Republic of the Congo',
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican Republic',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Equatorial Guinea',
  'Eritrea',
  'Estonia',
  'Eswatini',
  'Ethiopia',
  'Fiji',
  'Finland',
  'France',
  'Gabon',
  'Gambia',
  'Georgia',
  'Germany',
  'Ghana',
  'Greece',
  'Grenada',
  'Guatemala',
  'Guinea',
  'Guinea-Bissau',
  'Guyana',
  'Haiti',
  'Honduras',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Israel',
  'Italy',
  'Jamaica',
  'Japan',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kiribati',
  'Kuwait',
  'Kyrgyzstan',
  'Laos',
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Marshall Islands',
  'Mauritania',
  'Mauritius',
  'Mexico',
  'Micronesia',
  'Moldova',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Morocco',
  'Mozambique',
  'Myanmar (Burma)',
  'Namibia',
  'Nauru',
  'Nepal',
  'Netherlands',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'North Korea',
  'North Macedonia',
  'Norway',
  'Oman',
  'Pakistan',
  'Palau',
  'Palestine',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Qatar',
  'Romania',
  'Russia',
  'Rwanda',
  'Saint Kitts and Nevis',
  'Saint Lucia',
  'Saint Vincent and the Grenadines',
  'Samoa',
  'San Marino',
  'Sao Tome and Principe',
  'Saudi Arabia',
  'Senegal',
  'Serbia',
  'Seychelles',
  'Sierra Leone',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'Solomon Islands',
  'Somalia',
  'South Africa',
  'South Korea',
  'South Sudan',
  'Spain',
  'Sri Lanka',
  'Sudan',
  'Suriname',
  'Sweden',
  'Switzerland',
  'Syria',
  'Taiwan',
  'Tajikistan',
  'Tanzania',
  'Thailand',
  'Timor-Leste',
  'Togo',
  'Tonga',
  'Trinidad and Tobago',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Tuvalu',
  'Uganda',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
  'Uruguay',
  'Uzbekistan',
  'Vanuatu',
  'Vatican City',
  'Venezuela',
  'Vietnam',
  'Yemen',
  'Zambia',
  'Zimbabwe',
];

const convertFileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        const base64 = result.includes(',') ? result.split(',').pop() : result;
        resolve(base64 || '');
      } else {
        reject(new Error('Unable to process the uploaded file.'));
      }
    };
    reader.onerror = () => {
      reject(new Error('Failed to read the uploaded file.'));
    };
    reader.readAsDataURL(file);
  });

const validateForm = (formState: FormState): string | null => {
  if (!formState.name.trim()) {
    return 'Full name is required.';
  }
  const emailList = parseEmailList(formState.email);
  if (emailList.length === 0) {
    return 'Email address is required.';
  }
  const invalidEmail = findInvalidEmail(emailList);
  if (invalidEmail) {
    return `“${invalidEmail}” is not a valid email address.`;
  }
  if (!formState.telegram.trim()) {
    return 'Your Telegram handle is required.';
  }
  if (!formState.country.trim()) {
    return 'Please select your country.';
  }
  if (!formState.proof.trim()) {
    return 'Please provide proof that you followed at least 2 Cardic Nexus social pages.';
  }
  if (!formState.screenshot) {
    return 'Please upload a screenshot showing you follow the required Cardic Nexus social pages.';
  }
  if (!formState.agree) {
    return 'You must agree to the official rules and terms.';
  }

  return null;
};

export default function RegistrationForm({
  className = '',
}: RegistrationFormProps) {
  const [formState, setFormState] = useState<FormState>(() =>
    createInitialFormState()
  );
  const [status, setStatus] = useState<SubmissionStatus>({
    type: 'idle',
    message: '',
  });
  const [fallbackNotice, setFallbackNotice] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isSubmitting = status.type === 'loading';

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const target = event.target;
    const fieldName = target.name as keyof FormState;

    if (target instanceof HTMLInputElement && target.type === 'checkbox') {
      setFormState((previous) => ({
        ...previous,
        [fieldName]: target.checked,
      }));
      return;
    }

    setFormState((previous) => ({
      ...previous,
      [fieldName]: target.value,
    }));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    if (file && file.size > 5 * 1024 * 1024) {
      setStatus({
        type: 'error',
        message:
          'Screenshot must be 5MB or smaller. Please compress the image and try again.',
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setFormState((previous) => ({ ...previous, screenshot: null }));
      return;
    }

    setFormState((previous) => ({ ...previous, screenshot: file }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFallbackNotice('');

    const validationError = validateForm(formState);
    if (validationError) {
      setStatus({ type: 'error', message: validationError });
      return;
    }

    const trimmedName = formState.name.trim();
    const emailList = parseEmailList(formState.email);

    try {
      setStatus({ type: 'loading', message: 'Submitting your registration…' });
      const screenshotFile = formState.screenshot;
      const screenshotBase64 = screenshotFile
        ? await convertFileToBase64(screenshotFile)
        : '';

      const response = await fetch('/api/tournament/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmedName,
          emails: emailList,
          email: emailList[0] ?? '',
          telegram: formState.telegram.trim(),
          country: formState.country.trim(),
          proof: formState.proof.trim(),
          screenshot: screenshotFile
            ? {
                name: screenshotFile.name,
                type: screenshotFile.type,
                size: screenshotFile.size,
                base64: screenshotBase64,
              }
            : null,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          typeof data.error === 'string' && data.error.length > 0
            ? data.error
            : 'We could not process your registration. Please try again.'
        );
      }

      setStatus({
        type: 'success',
        message:
          'Registration received! Check your inbox for confirmation and look out for your credentials within 24 hours.',
      });
      setFormState(createInitialFormState());
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      let noticeMessage = '';

      if (emailList.length > 0) {
        const confirmationResult = await submitRegistration({
          emails: emailList,
          name: trimmedName,
        });

        if (!confirmationResult.ok) {
          const errorCode = confirmationResult.error || 'unknown_error';
          noticeMessage = `Confirmation email failed (${errorCode}). We will retry manually.`;
        } else if (confirmationResult.warning) {
          noticeMessage =
            'Sent to fallback (testing inbox) because domain not verified.';
        }
      }

      setFallbackNotice(noticeMessage);
    } catch (error) {
      setStatus({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Something went wrong while submitting the form. Please try again.',
      });
      setFallbackNotice('');
    }
  };

  const baseClassName =
    'flex flex-col gap-6 rounded-3xl border border-white/10 bg-black/40 p-8 shadow-[0_40px_120px_rgba(14,165,233,0.18)] backdrop-blur';
  const formClassName = className
    ? `${baseClassName} ${className}`
    : baseClassName;

  return (
    <form onSubmit={handleSubmit} className={formClassName}>
      <div>
        <h2 className='text-3xl font-semibold text-white'>
          2️⃣ Registration Form
        </h2>
        <p className='mt-2 text-sm leading-relaxed text-slate-200 md:text-base'>
          Provide the details below so we can confirm your spot. Email is
          required and will be tied to your tournament access.
        </p>
      </div>

      <label className='space-y-2 text-left'>
        <span className='text-sm font-semibold uppercase tracking-wide text-slate-100'>
          Full Name
        </span>
        <input
          className='w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40'
          name='name'
          value={formState.name}
          onChange={handleChange}
          placeholder='Your full name'
          autoComplete='name'
        />
      </label>

      <label className='space-y-2 text-left'>
        <span className='text-sm font-semibold uppercase tracking-wide text-slate-100'>
          Email
        </span>
        <input
          className='w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40'
          name='email'
          type='email'
          multiple
          required
          value={formState.email}
          onChange={handleChange}
          placeholder='name@example.com, teammate@example.com'
          autoComplete='email'
        />
        <p className='text-xs text-slate-400'>
          Separate multiple emails with commas, spaces, or new lines.
        </p>
      </label>

      <label className='space-y-2 text-left'>
        <span className='text-sm font-semibold uppercase tracking-wide text-slate-100'>
          Telegram @handle
        </span>
        <input
          className='w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40'
          name='telegram'
          value={formState.telegram}
          onChange={handleChange}
          placeholder='@yourhandle'
          autoComplete='off'
        />
      </label>

      <label className='space-y-2 text-left'>
        <span className='text-sm font-semibold uppercase tracking-wide text-slate-100'>
          Country
        </span>
        <select
          className='w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40'
          name='country'
          value={formState.country}
          onChange={handleChange}
        >
          <option value='' disabled hidden>
            Select your country
          </option>
          {countryOptions.map((country) => (
            <option
              key={country}
              value={country}
              className='bg-slate-900 text-white'
            >
              {country}
            </option>
          ))}
        </select>
      </label>

      <label className='space-y-2 text-left'>
        <span className='text-sm font-semibold uppercase tracking-wide text-slate-100'>
          Proof of 2 social follows
        </span>
        <textarea
          className='min-h-[120px] w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-300/40'
          name='proof'
          value={formState.proof}
          onChange={handleChange}
          placeholder='Paste screenshot links or profile URLs showing you follow at least 2 Cardic Nexus pages.'
        />
      </label>

      <label className='space-y-2 text-left'>
        <span className='text-sm font-semibold uppercase tracking-wide text-slate-100'>
          Upload screenshot proof
        </span>
        <input
          ref={fileInputRef}
          className='block w-full cursor-pointer rounded-xl border border-dashed border-white/20 bg-white/5 px-4 py-3 text-sm text-slate-200 file:mr-4 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-cyan-500 file:to-purple-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:border-cyan-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40'
          type='file'
          accept='image/*'
          onChange={handleFileChange}
        />
        <p className='text-xs text-slate-400'>
          {formState.screenshot
            ? `Selected file: ${formState.screenshot.name}`
            : 'Accepted formats: JPG, PNG, WEBP (max 5MB).'}
        </p>
      </label>

      <label className='flex items-start gap-3 text-left'>
        <input
          type='checkbox'
          name='agree'
          checked={formState.agree}
          onChange={handleChange}
          className='mt-1 h-5 w-5 rounded border border-white/20 bg-black/40 text-cyan-400 focus:ring-cyan-400'
        />
        <span className='text-sm leading-relaxed text-slate-200'>
          I agree to the Cardic Nexus Trading Tournament Official Rules & Terms
          and confirm that the information provided is accurate.
        </span>
      </label>

      {status.type !== 'idle' && (
        <div
          className={
            status.type === 'success'
              ? 'rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200'
              : status.type === 'error'
              ? 'rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200'
              : 'rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-100'
          }
        >
          {status.message}
        </div>
      )}

      {fallbackNotice && (
        <p className='rounded-xl border border-amber-400/40 bg-amber-500/10 px-4 py-2 text-xs text-amber-100'>
          {fallbackNotice}
        </p>
      )}

      <button
        type='submit'
        className='mt-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 via-fuchsia-500 to-blue-500 px-6 py-3 text-base font-semibold text-white shadow-[0_15px_45px_rgba(251,191,36,0.3)] transition hover:scale-[1.02] hover:shadow-[0_18px_60px_rgba(168,85,247,0.4)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200 disabled:cursor-not-allowed disabled:opacity-60'
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting…' : 'Submit Registration'}
      </button>
      <p className='text-center text-xs text-slate-400'>
        Confirmation email arrives immediately. Credentials follow within 24
        hours of approval.
      </p>
    </form>
  );
}
