'use client';

import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';

import { submitRegistration } from '@/components/useSubmitRegistration';

const createInitialFormState = () => ({
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

const convertFileToBase64 = (file) =>
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

const ruleSections = [
  {
    title: '1️⃣ Overview',
    body: (
      <p className='text-sm leading-relaxed text-slate-200 md:text-base'>
        Welcome to the Cardic Nexus Trading Tournament, an exclusive competition
        designed to identify the most disciplined and skilled traders in our
        community. All participants will compete on simulated $10,000 USD demo
        accounts with real market conditions on MT4/MT5. Your goal: Achieve the
        highest ROI within the competition period — without violating the
        drawdown limits.
      </p>
    ),
  },
  {
    title: '2️⃣ Registration & Eligibility',
    body: (
      <div className='space-y-3 text-sm leading-relaxed text-slate-200 md:text-base'>
        <p>✅ Entry is 100% FREE.</p>
        <p>✅ To qualify, each participant must:</p>
        <ul className='list-disc space-y-1 pl-5 text-left text-sm text-slate-200 marker:text-amber-400 md:text-base'>
          <li>Register via the official Cardic Nexus competition portal.</li>
          <li>
            Provide Full Name, Email, Contact info, Country, and Broker details
            (Exness).
          </li>
          <li>
            Upload proof of following at least 2 official Cardic Nexus social
            accounts.
          </li>
          <li>Verify their email (confirmation link sent automatically).</li>
        </ul>
        <p>Only verified and complete entries will be accepted.</p>
      </div>
    ),
  },
  {
    title: '3️⃣ Competition Details',
    body: (
      <ul className='grid gap-2 text-left text-sm text-slate-200 md:text-base'>
        <li>
          <span className='font-semibold text-amber-300'>Start Date:</span> [To
          be announced]
        </li>
        <li>
          <span className='font-semibold text-amber-300'>Duration:</span> 1
          Month
        </li>
        <li>
          <span className='font-semibold text-amber-300'>Platform:</span> MT4 /
          MT5 (Exness Demo)
        </li>
        <li>
          <span className='font-semibold text-amber-300'>
            Starting Balance:
          </span>{' '}
          $10,000 USD
        </li>
        <li>
          <span className='font-semibold text-amber-300'>Leverage:</span> 1:200
        </li>
        <li>
          <span className='font-semibold text-amber-300'>Trading Allowed:</span>{' '}
          All forex, gold, and crypto pairs
        </li>
        <li>
          <span className='font-semibold text-amber-300'>EA usage:</span>{' '}
          Allowed (if verified by Cardic Nexus team)
        </li>
      </ul>
    ),
  },
  {
    title: '4️⃣ Trading Rules',
    body: (
      <ul className='list-disc space-y-1 pl-5 text-left text-sm text-slate-200 marker:text-purple-400 md:text-base'>
        <li>Maximum Daily Drawdown: 5%</li>
        <li>Maximum Overall Drawdown: 10%</li>
        <li>Minimum Trading Days: 10 days within the month</li>
        <li>No Copy Trading from another participant’s account</li>
        <li>No Martingale / grid / arbitrage systems</li>
        <li>Stop-loss must be used on every trade</li>
        <li>No insider trades or manipulation attempts</li>
        <li>Violation of any rule = instant disqualification.</li>
      </ul>
    ),
  },
  {
    title: '5️⃣ Leaderboard & Eliminations',
    body: (
      <div className='space-y-2 text-sm leading-relaxed text-slate-200 md:text-base'>
        <p>The leaderboard updates automatically on the dashboard.</p>
        <p>ROI (Return on Investment) determines rankings.</p>
        <p>
          At the end of Week 2, the lowest 20 participants by ROI are
          eliminated.
        </p>
        <p>Elimination continues weekly until Top 50 traders remain.</p>
        <p>Final top 50 battle it out till the end of the month.</p>
      </div>
    ),
  },
  {
    title: '6️⃣ Prizes',
    body: (
      <ul className='space-y-2 text-left text-sm text-slate-200 md:text-base'>
        <li>🏅 1st Place: $15,000 Instant Funded Account</li>
        <li>🥈 2nd Place: $10,000 Instant Funded Account</li>
        <li>🥉 3rd Place: $5,000 Instant Funded Account</li>
        <li>🎖 Top 10 get lifetime Cardic Nexus VIP access.</li>
        <li>🎖 Spotlight interview and feature on our socials.</li>
      </ul>
    ),
  },
  {
    title: '7️⃣ Disqualification Terms',
    body: (
      <ul className='list-disc space-y-1 pl-5 text-left text-sm text-slate-200 marker:text-cyan-300 md:text-base'>
        <li>
          Participants will be disqualified if they exceed drawdown limits.
        </li>
        <li>Use multiple accounts.</li>
        <li>Submit fake or incomplete registration info.</li>
        <li>Attempt to manipulate trade data or leaderboard.</li>
        <li>Fail to trade for at least 10 active days.</li>
      </ul>
    ),
  },
  {
    title: '8️⃣ Communication & Support',
    body: (
      <div className='space-y-2 text-sm leading-relaxed text-slate-200 md:text-base'>
        <p>
          All official updates, leaderboard links, and account details will be
          sent via email.
        </p>
        <p>
          Traders are encouraged to join the Cardic Nexus Telegram group for
          live updates and support.
        </p>
        <p>
          Support Contact:
          <br />
          📧 support@cardicnexusglobal.com
          <br />
          💬 Telegram: @cardicnexus
        </p>
      </div>
    ),
  },
  {
    title: '9️⃣ Legal Disclaimer',
    body: (
      <p className='text-sm leading-relaxed text-slate-200 md:text-base'>
        This competition is purely for educational and entertainment purposes.
        Cardic Nexus reserves the right to modify, pause, or terminate the
        competition at any time. All participants agree to fair use of demo
        accounts and acknowledge that results do not represent real profits or
        losses.
      </p>
    ),
  },
  {
    title: '🔟 Agreement',
    body: (
      <p className='text-sm leading-relaxed text-slate-200 md:text-base'>
        By joining the Cardic Nexus Trading Tournament, you agree to abide by
        these rules, uphold trading discipline, and respect other participants.
      </p>
    ),
  },
];

const highlightedPerks = [
  {
    heading: 'Simulated $10,000 Accounts',
    description:
      'Trade on MT4/MT5 with real market conditions — demonstrate discipline without risking capital.',
  },
  {
    heading: 'Weekly Eliminations',
    description:
      'Hold the line. ROI decides who advances after each cut until the Top 50 showdown.',
  },
  {
    heading: 'Instant Funded Accounts',
    description:
      'Top 3 winners secure $30,000 in instant funding and VIP recognition from the Cardic Nexus team.',
  },
];

const validateForm = (formState) => {
  if (!formState.name.trim()) {
    return 'Full name is required.';
  }
  if (!formState.email.trim()) {
    return 'Email address is required.';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email.trim())) {
    return 'Please provide a valid email address.';
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

export default function CardicNexusLanding() {
  const [formState, setFormState] = useState(() => createInitialFormState());
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [fallbackNotice, setFallbackNotice] = useState('');
  const fileInputRef = useRef(null);

  const isSubmitting = status.type === 'loading';

  const ctaHref = useMemo(() => '#register', []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormState((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] ?? null;

    if (file && file.size > 5 * 1024 * 1024) {
      setStatus({
        type: 'error',
        message:
          'Screenshot must be 5MB or smaller. Please compress the image and try again.',
      });
      event.target.value = '';
      setFormState((previous) => ({ ...previous, screenshot: null }));
      return;
    }

    setFormState((previous) => ({ ...previous, screenshot: file }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFallbackNotice('');

    const validationError = validateForm(formState);
    if (validationError) {
      setStatus({ type: 'error', message: validationError });
      return;
    }

    const trimmedName = formState.name.trim();
    const trimmedEmail = formState.email.trim();

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
          email: trimmedEmail,
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

      if (trimmedEmail) {
        const confirmationResult = await submitRegistration({
          email: trimmedEmail,
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

  return (
    <div className='relative overflow-hidden'>
      <div className='pointer-events-none absolute inset-0 -z-[1] bg-[radial-gradient(circle_at_10%_10%,rgba(56,189,248,0.25),transparent_60%),_radial-gradient(circle_at_90%_0%,rgba(168,85,247,0.25),transparent_55%),_radial-gradient(circle_at_50%_80%,rgba(250,204,21,0.18),transparent_55%)]' />

      <section className='relative mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-20 pt-24 text-center md:pt-28'>
        <div className='mx-auto w-fit rounded-full border border-cyan-500/40 bg-cyan-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-100 shadow-[0_0_40px_rgba(6,182,212,0.35)]'>
          Season 1 • Live Registration
        </div>
        <h1 className='text-balance text-4xl font-black leading-tight text-white drop-shadow-[0_0_45px_rgba(16,185,255,0.35)] md:text-6xl'>
          🚀 Cardic Nexus Tournament – Season 1 Now Live
        </h1>
        <p className='mx-auto max-w-2xl text-lg leading-relaxed text-slate-200 md:text-xl'>
          The rest of Cardic Nexus is undergoing upgrades — but the battlefield
          stays open. Register below to join the official competition.
        </p>
        <div className='flex flex-wrap items-center justify-center gap-4'>
          <a
            href={ctaHref}
            className='inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 px-8 py-3 text-base font-semibold text-white shadow-[0_12px_40px_rgba(59,130,246,0.35)] transition hover:scale-105 hover:shadow-[0_16px_60px_rgba(107,33,168,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300'
          >
            Register Free →
          </a>
          <Link
            href='/dashboard'
            prefetch={false}
            className='inline-flex items-center justify-center rounded-full border border-amber-400/60 bg-amber-500/10 px-8 py-3 text-base font-semibold text-amber-200 shadow-[0_0_35px_rgba(250,204,21,0.28)] transition hover:bg-amber-400/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300'
          >
            View Dashboard Preview
          </Link>
        </div>
        <div className='grid gap-6 text-left md:grid-cols-3 md:gap-8'>
          {highlightedPerks.map((perk) => (
            <div
              key={perk.heading}
              className='rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-blue-950/40 backdrop-blur-sm transition hover:-translate-y-1 hover:border-cyan-300/40'
            >
              <h3 className='text-lg font-semibold text-amber-200'>
                {perk.heading}
              </h3>
              <p className='mt-3 text-sm leading-relaxed text-slate-200 md:text-base'>
                {perk.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id='register'
        className='relative mx-auto max-w-6xl gap-12 px-6 pb-24 md:grid md:grid-cols-[1.1fr_0.9fr] md:pb-32'
      >
        <div className='space-y-8'>
          <div className='rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-amber-400/10 p-8 shadow-2xl shadow-indigo-950/40 backdrop-blur'>
            <h2 className='text-3xl font-bold text-white md:text-4xl'>
              Secure Your Slot
            </h2>
            <p className='mt-3 text-base leading-relaxed text-slate-200 md:text-lg'>
              Submit the registration form to alert the Cardic Nexus team.
              We&apos;ll deliver a confirmation instantly and send your
              credentials within 24 hours of verification.
            </p>
            <ul className='mt-6 grid gap-4 text-sm text-slate-200 md:grid-cols-2 md:text-base'>
              <li className='rounded-2xl border border-cyan-400/40 bg-cyan-500/10 px-4 py-3 font-medium shadow-[0_0_35px_rgba(6,182,212,0.25)]'>
                Instant email confirmation
              </li>
              <li className='rounded-2xl border border-purple-400/40 bg-purple-500/10 px-4 py-3 font-medium shadow-[0_0_35px_rgba(168,85,247,0.25)]'>
                Credentials sent separately within 24h
              </li>
              <li className='rounded-2xl border border-amber-400/50 bg-amber-500/10 px-4 py-3 font-medium shadow-[0_0_35px_rgba(250,204,21,0.25)]'>
                Proof of two social follows required
              </li>
              <li className='rounded-2xl border border-sky-400/40 bg-sky-500/10 px-4 py-3 font-medium shadow-[0_0_35px_rgba(56,189,248,0.25)]'>
                Telegram handle keeps you in the loop
              </li>
            </ul>
          </div>
          <div className='rounded-3xl border border-white/10 bg-white/5 p-8 shadow-xl shadow-blue-950/40 backdrop-blur'>
            <h3 className='text-2xl font-semibold text-white md:text-3xl'>
              CARDIC NEXUS TRADING TOURNAMENT — OFFICIAL RULES & TERMS
            </h3>
            <div className='mt-6 grid gap-6'>
              {ruleSections.map((section) => (
                <div
                  key={section.title}
                  className='rounded-2xl border border-white/5 bg-black/20 p-5 shadow-inner shadow-black/40'
                >
                  <h4 className='text-lg font-semibold text-cyan-200 md:text-xl'>
                    {section.title}
                  </h4>
                  <div className='mt-3'>{section.body}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className='mt-12 flex flex-col gap-6 rounded-3xl border border-white/10 bg-black/40 p-8 shadow-[0_40px_120px_rgba(14,165,233,0.18)] backdrop-blur md:mt-0'
        >
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
              required
              value={formState.email}
              onChange={handleChange}
              placeholder='name@example.com'
              autoComplete='email'
            />
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
              I agree to the Cardic Nexus Trading Tournament Official Rules &
              Terms and confirm that the information provided is accurate.
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
      </section>
    </div>
  );
}
