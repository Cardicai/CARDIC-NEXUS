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

const pricingPlans = [
  {
    id: 'essential',
    name: 'Essential',
    badge: 'Start here',
    tagline:
      'Kickstart your discipline with daily analytics and guided missions.',
    monthly: {
      price: 16.95,
      billed: 'Billed monthly',
      savings: null,
    },
    annual: {
      price: 12.95,
      billed: 'Billed annually',
      savings: 'Save $24 a year',
    },
    features: [
      'Live market-synced demo account provisioning',
      'Automated equity and drawdown tracking',
      'Weekend access to community war-room calls',
    ],
  },
  {
    id: 'plus',
    name: 'Plus',
    badge: 'Growth',
    tagline: 'Accelerate your performance with upgraded tooling and support.',
    monthly: {
      price: 34.95,
      billed: 'Billed monthly',
      savings: 'Save $18 a year',
    },
    annual: {
      price: 28.29,
      billed: 'Billed annually',
      savings: 'Save $48 a year',
    },
    features: [
      'Everything in Essential plus MT4 + MT5 dual access',
      'Advanced performance journal templates',
      'Priority support channel with 4h response',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    badge: 'Most popular',
    featured: true,
    tagline: 'Battle-tested insights for traders chasing the leaderboard.',
    monthly: {
      price: 68.95,
      billed: 'Billed monthly',
      savings: 'Save $96 a year',
    },
    annual: {
      price: 56.49,
      billed: 'Billed annually',
      savings: 'Save $138 a year',
    },
    features: [
      'Dedicated performance strategist sessions',
      'Intraday playbook drops with instant alerts',
      'Extended drawdown and risk analytics suite',
      'Instant tournament registration tokens',
    ],
  },
  {
    id: 'ultimate',
    name: 'Ultimate',
    badge: 'Pro',
    tagline: 'All-access funding support for elite trading squads.',
    monthly: {
      price: 249.95,
      billed: 'Billed monthly',
      savings: 'Save $600 a year',
    },
    annual: {
      price: 199.95,
      billed: 'Billed annually',
      savings: 'Save $480 a year',
    },
    features: [
      'Guaranteed seat in every tournament season',
      'Direct line to Cardic Nexus partner desks',
      'White-glove strategy and funding reviews',
      'Exclusive broker rebates and performance perks',
    ],
  },
];

const CheckIcon = (props) => (
  <svg
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    aria-hidden='true'
    {...props}
  >
    <path d='M5 12.5 9.5 17 19 7.5' />
  </svg>
);

const SearchIcon = (props) => (
  <svg
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    aria-hidden='true'
    {...props}
  >
    <circle cx='11' cy='11' r='7' />
    <path d='m20 20-3.5-3.5' />
  </svg>
);

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
  const [billingCycle, setBillingCycle] = useState('annual');
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
    <div className='relative min-h-screen overflow-hidden bg-gradient-to-b from-[#050811] via-[#08031c] to-black text-white'>
      <div className='aurora-field'>
        <div className='aurora-layer aurora-layer-1' />
        <div className='aurora-layer aurora-layer-2' />
        <div className='aurora-layer aurora-layer-3' />
      </div>

      <div className='relative z-10 flex min-h-screen flex-col'>
        <header className='border-b border-white/10 bg-black/30 backdrop-blur'>
          <div className='mx-auto flex w-full max-w-6xl items-center gap-6 px-6 py-4'>
            <Link href='/' className='flex items-center gap-3 text-white'>
              <span className='grid h-9 w-9 place-items-center rounded-full bg-white text-base font-bold text-slate-900 shadow-[0_12px_45px_rgba(255,255,255,0.45)]'>
                CN
              </span>
              <span className='hidden text-lg font-semibold tracking-wide sm:inline'>
                Cardic Nexus
              </span>
            </Link>
            <nav className='hidden items-center gap-6 text-sm font-semibold text-slate-200 md:flex'>
              <Link href='#plans' className='transition hover:text-white'>
                Products
              </Link>
              <Link href='#perks' className='transition hover:text-white'>
                Community
              </Link>
              <Link
                href='/dashboard'
                prefetch={false}
                className='transition hover:text-white'
              >
                Markets
              </Link>
              <Link href='#register' className='transition hover:text-white'>
                Brokers
              </Link>
            </nav>
            <div className='ml-auto flex items-center gap-3'>
              <div className='relative hidden flex-1 lg:block'>
                <SearchIcon className='pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400' />
                <input
                  type='search'
                  placeholder='Search (Ctrl+K)'
                  className='w-full rounded-full border border-white/10 bg-white/5 py-2 pl-11 pr-4 text-sm text-white outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/40'
                />
              </div>
              <button
                type='button'
                className='grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 text-slate-100 transition hover:border-cyan-300/50 hover:text-white lg:hidden'
                aria-label='Search'
              >
                <SearchIcon className='h-5 w-5' />
              </button>
              <Link
                href='/signup'
                className='hidden text-sm font-semibold text-slate-200 transition hover:text-white sm:inline-flex'
              >
                Sign in
              </Link>
              <a
                href={ctaHref}
                className='hidden rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_20px_60px_rgba(59,130,246,0.45)] transition hover:scale-[1.02] hover:shadow-[0_28px_80px_rgba(59,130,246,0.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 md:inline-flex'
              >
                Get started
              </a>
              <span className='grid h-10 w-10 place-items-center rounded-full border border-emerald-400/60 bg-emerald-500/10 text-sm font-semibold text-emerald-200 shadow-[0_0_45px_rgba(16,185,129,0.3)]'>
                0
              </span>
            </div>
          </div>
        </header>

        <main className='flex-1'>
          <section
            id='plans'
            className='relative mx-auto max-w-6xl px-6 pb-16 pt-16 md:pb-24 md:pt-24'
          >
            <div className='mx-auto max-w-3xl text-center'>
              <span className='inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-slate-100'>
                Aurora Live
              </span>
              <h1 className='mt-6 text-balance text-4xl font-black leading-tight text-white drop-shadow-[0_0_45px_rgba(59,130,246,0.4)] md:text-6xl'>
                Plans for every level of ambition
              </h1>
              <p className='mt-4 text-lg leading-relaxed text-slate-200 md:text-xl'>
                Pick the Cardic Nexus membership that matches your trading
                velocity. Every tier keeps the tournament lobby open and your
                analytics illuminated.
              </p>
              <div className='mt-8 flex flex-wrap items-center justify-center gap-3'>
                <div className='inline-flex items-center rounded-full bg-white/10 p-1 text-sm font-semibold text-slate-200 shadow-[0_25px_70px_rgba(14,165,233,0.35)]'>
                  <button
                    type='button'
                    onClick={() => setBillingCycle('monthly')}
                    aria-pressed={billingCycle === 'monthly'}
                    className={`rounded-full px-5 py-2 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                      billingCycle === 'monthly'
                        ? 'bg-white text-slate-900 shadow-[0_12px_35px_rgba(255,255,255,0.35)]'
                        : 'text-slate-200 hover:text-white'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    type='button'
                    onClick={() => setBillingCycle('annual')}
                    aria-pressed={billingCycle === 'annual'}
                    className={`rounded-full px-5 py-2 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                      billingCycle === 'annual'
                        ? 'bg-white text-slate-900 shadow-[0_12px_35px_rgba(255,255,255,0.35)]'
                        : 'text-slate-200 hover:text-white'
                    }`}
                  >
                    <span className='mr-2'>Annually</span>
                    <span className='hidden text-xs font-semibold text-emerald-200 md:inline'>
                      Save up to 17%
                    </span>
                  </button>
                </div>
                <a
                  href={ctaHref}
                  className='inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-cyan-300 hover:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300'
                >
                  Secure your slot
                </a>
              </div>
            </div>

            <div className='mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4'>
              {pricingPlans.map((plan) => {
                const planPricing =
                  billingCycle === 'annual' ? plan.annual : plan.monthly;
                const cardClassName = plan.featured
                  ? 'relative flex h-full flex-col overflow-hidden rounded-3xl border border-cyan-300/80 bg-gradient-to-b from-cyan-500/15 via-indigo-500/15 to-purple-500/15 p-8 shadow-[0_40px_100px_rgba(34,211,238,0.45)] backdrop-blur transition hover:-translate-y-2 hover:border-cyan-200'
                  : plan.id === 'ultimate'
                  ? 'relative flex h-full flex-col overflow-hidden rounded-3xl border border-fuchsia-400/60 bg-white/5 p-8 shadow-[0_30px_90px_rgba(217,70,239,0.35)] backdrop-blur transition hover:-translate-y-2 hover:border-fuchsia-300/70'
                  : 'relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.55)] backdrop-blur-sm transition hover:-translate-y-2 hover:border-cyan-200/60';
                return (
                  <div key={plan.id} className={cardClassName}>
                    {plan.badge ? (
                      <span className='absolute right-6 top-6 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-100'>
                        {plan.badge}
                      </span>
                    ) : null}
                    <div className='space-y-4'>
                      <div>
                        <h3 className='text-xl font-semibold text-white'>
                          {plan.name}
                        </h3>
                        <p className='mt-1 text-sm text-slate-200'>
                          {plan.tagline}
                        </p>
                      </div>
                      <div className='flex items-end gap-2 text-white'>
                        <span className='text-4xl font-bold tracking-tight'>
                          ${planPricing.price.toFixed(2)}
                        </span>
                        <span className='pb-1 text-sm font-semibold text-slate-300'>
                          /mo
                        </span>
                      </div>
                      <p className='text-sm text-slate-200'>
                        {planPricing.billed}
                      </p>
                      {planPricing.savings ? (
                        <p className='text-sm font-semibold text-emerald-200'>
                          {planPricing.savings}
                        </p>
                      ) : null}
                    </div>
                    <ul className='mt-8 flex flex-1 flex-col gap-4 text-sm text-slate-200'>
                      {plan.features.map((feature) => (
                        <li key={feature} className='flex items-start gap-3'>
                          <span className='mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-500/10 text-emerald-200'>
                            <CheckIcon className='h-4 w-4' />
                          </span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <a
                      href={ctaHref}
                      className={
                        plan.featured
                          ? 'mt-10 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_60px_rgba(34,211,238,0.45)] transition hover:scale-[1.02] hover:shadow-[0_26px_80px_rgba(79,70,229,0.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200'
                          : 'mt-10 inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-cyan-300 hover:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200'
                      }
                    >
                      {plan.featured ? 'Start your 7-day trial' : 'Choose plan'}
                    </a>
                  </div>
                );
              })}
            </div>

            <p className='mt-10 text-center text-sm text-slate-400'>
              All memberships unlock live analytics, tournament registration,
              and our global community support desk.
            </p>
          </section>

          <section
            id='perks'
            className='relative mx-auto max-w-6xl px-6 pb-24 text-center md:pb-28'
          >
            <div className='mx-auto max-w-3xl'>
              <h2 className='text-3xl font-bold text-white md:text-4xl'>
                Why traders stay with Cardic Nexus
              </h2>
              <p className='mt-4 text-lg leading-relaxed text-slate-200 md:text-xl'>
                Whether you are stepping into your first season or defending a
                leaderboard spot, our toolkit keeps the arena ready and
                responsive.
              </p>
            </div>

            <div className='mt-10 flex flex-wrap items-center justify-center gap-4'>
              <a
                href={ctaHref}
                className='inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_20px_60px_rgba(59,130,246,0.45)] transition hover:scale-[1.02] hover:shadow-[0_26px_80px_rgba(99,102,241,0.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300'
              >
                Claim your pass
              </a>
              <Link
                href='/dashboard'
                prefetch={false}
                className='inline-flex items-center justify-center rounded-full border border-amber-400/60 bg-amber-500/10 px-6 py-3 text-sm font-semibold text-amber-200 shadow-[0_0_35px_rgba(250,204,21,0.28)] transition hover:border-amber-300 hover:text-amber-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200'
              >
                View Dashboard Preview
              </Link>
            </div>

            <div className='mt-12 grid gap-6 text-left md:grid-cols-3 md:gap-8'>
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
                  Provide the details below so we can confirm your spot. Email
                  is required and will be tied to your tournament access.
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
                  I agree to the Cardic Nexus Trading Tournament Official Rules
                  & Terms and confirm that the information provided is accurate.
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
                Confirmation email arrives immediately. Credentials follow
                within 24 hours of approval.
              </p>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
}
