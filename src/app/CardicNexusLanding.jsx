'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const navItems = [
  { id: 'welcome', label: 'Welcome' },
  { id: 'highlights', label: 'Highlights' },
  { id: 'rules', label: 'Rules' },
  { id: 'register', label: 'Register' },
];

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

const journeySteps = [
  {
    title: 'Phase 1 • Verification',
    description:
      'Register, submit proof of community engagement, and receive MT4/MT5 credentials once approved.',
    timeline: 'Days 0 — 2',
    accent: 'from-cyan-500 to-sky-500',
  },
  {
    title: 'Phase 2 • Performance Window',
    description:
      'Trade for at least 10 market days and protect capital within the 5% daily / 10% overall drawdown guardrails.',
    timeline: 'Days 3 — 30',
    accent: 'from-amber-400 to-orange-500',
  },
  {
    title: 'Phase 3 • Finals',
    description:
      'Weekly cuts leave the most consistent 50 traders to battle for instant funded accounts and lifetime VIP status.',
    timeline: 'Final Week',
    accent: 'from-purple-500 to-fuchsia-500',
  },
];

const leaderboardPreview = [
  { name: 'Onoriodo Raymond', roi: '+128%', equity: '$12,800' },
  { name: 'Ava Sterling', roi: '+94%', equity: '$11,940' },
  { name: 'Luca Navarro', roi: '+72%', equity: '$11,720' },
];

const impactStats = [
  {
    label: 'Instant Funding Pool',
    value: '$30K',
    subtext: 'Distributed across the top 3 finalists',
  },
  {
    label: 'Active Seats',
    value: '500',
    subtext: 'First-come, first-served for verified traders',
  },
  {
    label: 'Risk Parameters',
    value: '5% / 10%',
    subtext: 'Daily and overall drawdown guardrails',
  },
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
    title: '10️⃣ Agreement',
    body: (
      <p className='text-sm leading-relaxed text-slate-200 md:text-base'>
        By joining the Cardic Nexus Trading Tournament, you agree to abide by
        these rules, uphold trading discipline, and respect other participants.
      </p>
    ),
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
  const [isSlideMode, setIsSlideMode] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const fileInputRef = useRef(null);
  const containerRef = useRef(null);
  const sectionRefs = useRef(new Array(navItems.length).fill(null));
  const activeSectionRef = useRef(0);
  const scrollTimeoutRef = useRef(null);

  const isSubmitting = status.type === 'loading';
  const ctaHref = '#register';

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

  const goToSection = (index) => {
    const clampedIndex = Math.max(0, Math.min(navItems.length - 1, index));
    const target = sectionRefs.current[clampedIndex];
    if (!target) {
      return;
    }

    activeSectionRef.current = clampedIndex;
    setActiveSection(clampedIndex);
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCtaClick = (event) => {
    if (isSlideMode) {
      event.preventDefault();
      const registerIndex = navItems.findIndex(
        (item) => item.id === 'register'
      );
      if (registerIndex !== -1) {
        goToSection(registerIndex);
      }
    }
  };

  const handleNavClick = (index) => {
    goToSection(index);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateForm(formState);
    if (validationError) {
      setStatus({ type: 'error', message: validationError });
      return;
    }

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
          name: formState.name.trim(),
          email: formState.email.trim(),
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
    } catch (error) {
      setStatus({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'Something went wrong while submitting the form. Please try again.',
      });
    }
  };

  useEffect(() => {
    const updateSlideMode = () => {
      setIsSlideMode(window.innerWidth >= 1024);
    };

    updateSlideMode();
    window.addEventListener('resize', updateSlideMode);
    return () => window.removeEventListener('resize', updateSlideMode);
  }, []);

  useEffect(() => {
    if (!isSlideMode) {
      return undefined;
    }

    const container = containerRef.current;
    if (!container) {
      return undefined;
    }

    let isAnimating = false;

    const handleWheel = (event) => {
      if (Math.abs(event.deltaY) < 32) {
        return;
      }

      event.preventDefault();
      if (isAnimating) {
        return;
      }

      const direction = event.deltaY > 0 ? 1 : -1;
      const nextIndex = Math.max(
        0,
        Math.min(navItems.length - 1, activeSectionRef.current + direction)
      );
      if (nextIndex === activeSectionRef.current) {
        return;
      }

      isAnimating = true;
      activeSectionRef.current = nextIndex;
      setActiveSection(nextIndex);
      sectionRefs.current[nextIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });

      window.clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = window.setTimeout(() => {
        isAnimating = false;
      }, 900);
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      window.clearTimeout(scrollTimeoutRef.current);
    };
  }, [isSlideMode]);

  useEffect(() => {
    const root = isSlideMode ? containerRef.current : null;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.findIndex(
              (section) => section === entry.target
            );
            if (index !== -1) {
              activeSectionRef.current = index;
              setActiveSection(index);
            }
          }
        });
      },
      {
        root,
        threshold: isSlideMode ? 0.6 : 0.35,
      }
    );

    sectionRefs.current.forEach((section) => {
      if (section) {
        observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, [isSlideMode]);

  const setSectionRef = (index) => (element) => {
    sectionRefs.current[index] = element;
  };

  const firstColumn = ruleSections.slice(0, Math.ceil(ruleSections.length / 2));
  const secondColumn = ruleSections.slice(Math.ceil(ruleSections.length / 2));

  return (
    <div className='relative min-h-screen overflow-hidden bg-slate-950 text-white'>
      <div className='pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_15%,rgba(56,189,248,0.25),transparent_55%),_radial-gradient(circle_at_90%_0%,rgba(168,85,247,0.22),transparent_50%),_radial-gradient(circle_at_30%_80%,rgba(251,191,36,0.2),transparent_60%)]' />

      <main
        ref={containerRef}
        className={clsx(
          'relative flex w-full flex-col scroll-smooth',
          isSlideMode
            ? 'h-screen overflow-y-auto snap-y snap-mandatory'
            : 'min-h-screen'
        )}
      >
        <section
          id='welcome'
          ref={setSectionRef(0)}
          className={clsx(
            'relative isolate grid w-full items-center gap-12 px-6 py-20 sm:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:px-20',
            isSlideMode ? 'min-h-screen snap-start' : 'min-h-[85vh]'
          )}
        >
          <div className='relative space-y-10'>
            <div className='inline-flex items-center gap-3 rounded-full border border-cyan-400/40 bg-cyan-500/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-100 shadow-[0_0_45px_rgba(6,182,212,0.35)]'>
              Season 1 • Live Registration
            </div>
            <div className='space-y-6'>
              <h1 className='text-balance text-4xl font-black leading-tight text-white drop-shadow-[0_0_55px_rgba(34,211,238,0.35)] md:text-6xl lg:text-7xl'>
                The Cardic Nexus Trading Tournament
              </h1>
              <p className='max-w-2xl text-lg leading-relaxed text-slate-200 md:text-xl'>
                Compete alongside the sharpest strategists in the community.
                Deliver disciplined performance on a $10,000 demo account, stay
                within the risk limits, and climb a live leaderboard synced
                directly from FX Blue snapshots.
              </p>
            </div>
            <div className='flex flex-wrap items-center gap-4'>
              <a
                href={ctaHref}
                onClick={handleCtaClick}
                className='inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 px-8 py-3 text-base font-semibold text-white shadow-[0_18px_55px_rgba(59,130,246,0.35)] transition hover:scale-105 hover:shadow-[0_22px_75px_rgba(79,70,229,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200'
              >
                Reserve Your Seat →
              </a>
              <Link
                href='/dashboard'
                prefetch={false}
                className='inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 py-3 text-base font-semibold text-white/90 backdrop-blur transition hover:border-white/40 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70'
              >
                Explore the Dashboard Preview
              </Link>
            </div>
            <div className='grid gap-4 sm:grid-cols-3'>
              {impactStats.map((stat) => (
                <div
                  key={stat.label}
                  className='rounded-3xl border border-white/10 bg-white/5 px-6 py-5 shadow-[0_35px_140px_rgba(12,74,110,0.35)] backdrop-blur transition hover:-translate-y-1 hover:border-cyan-300/60'
                >
                  <p className='text-xs font-semibold uppercase tracking-[0.25em] text-slate-300'>
                    {stat.label}
                  </p>
                  <p className='mt-3 text-3xl font-semibold text-white md:text-4xl'>
                    {stat.value}
                  </p>
                  <p className='mt-1 text-sm text-slate-300'>{stat.subtext}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className='relative'>
            <div className='absolute inset-0 rounded-[32px] bg-gradient-to-br from-cyan-500/20 via-indigo-500/10 to-purple-500/20 blur-3xl' />
            <div className='relative overflow-hidden rounded-[32px] border border-white/10 bg-slate-900/60 p-8 shadow-[0_35px_180px_rgba(12,74,110,0.45)] backdrop-blur'>
              <div className='flex items-center justify-between'>
                <p className='text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200'>
                  Live Leaderboard
                </p>
                <span className='text-xs text-slate-400'>Auto synced</span>
              </div>
              <div className='mt-6 space-y-4'>
                {leaderboardPreview.map((entry, index) => (
                  <div
                    key={entry.name}
                    className='flex items-center justify-between gap-6 rounded-2xl border border-white/10 bg-slate-950/40 px-5 py-4 shadow-inner shadow-black/20'
                  >
                    <div>
                      <p className='text-sm font-semibold text-white'>{`${
                        index + 1
                      }. ${entry.name}`}</p>
                      <p className='text-xs text-slate-400'>
                        Equity {entry.equity}
                      </p>
                    </div>
                    <span
                      className={clsx(
                        'text-lg font-semibold',
                        entry.roi.startsWith('-')
                          ? 'text-rose-400'
                          : 'text-emerald-400'
                      )}
                    >
                      {entry.roi}
                    </span>
                  </div>
                ))}
              </div>
              <div className='mt-6 flex items-center justify-between text-xs text-slate-400'>
                <span>Powered by FX Blue CSV snapshots</span>
                <Link
                  href='/participants/onoriodo-raymond-XNYYC8'
                  className='rounded-full border border-cyan-400/40 px-3 py-1 font-semibold text-cyan-200 transition hover:border-cyan-300 hover:text-cyan-100'
                >
                  View sample stats
                </Link>
              </div>
            </div>
          </aside>
        </section>

        <section
          id='highlights'
          ref={setSectionRef(1)}
          className={clsx(
            'relative flex w-full flex-col justify-center gap-16 px-6 py-20 sm:py-24 lg:px-20',
            isSlideMode ? 'min-h-screen snap-start' : 'min-h-[85vh]'
          )}
        >
          <div className='mx-auto max-w-4xl text-center'>
            <p className='text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200'>
              Why traders choose Cardic Nexus
            </p>
            <h2 className='mt-4 text-balance text-4xl font-bold text-white md:text-5xl'>
              Built for precision, discipline, and growth
            </h2>
            <p className='mt-4 text-lg text-slate-200 md:text-xl'>
              Every scroll reveals a new lens on the tournament: the promise,
              the journey, and the discipline expected from every participant.
              Glide through the sections to understand what makes this season
              the most matured version of Cardic Nexus yet.
            </p>
          </div>

          <div className='grid gap-6 lg:grid-cols-3'>
            {highlightedPerks.map((perk) => (
              <div
                key={perk.heading}
                className='group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-white/0 to-white/10 p-8 shadow-[0_40px_160px_rgba(15,23,42,0.5)] backdrop-blur transition hover:-translate-y-2 hover:border-cyan-300/60'
              >
                <div className='pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100'>
                  <div className='absolute -left-10 top-10 h-32 w-32 rounded-full bg-cyan-500/20 blur-3xl' />
                  <div className='absolute -bottom-16 -right-12 h-36 w-36 rounded-full bg-purple-500/20 blur-3xl' />
                </div>
                <h3 className='text-lg font-semibold text-white md:text-xl'>
                  {perk.heading}
                </h3>
                <p className='mt-3 text-sm leading-relaxed text-slate-200 md:text-base'>
                  {perk.description}
                </p>
              </div>
            ))}
          </div>

          <div className='grid gap-8 lg:grid-cols-[0.9fr_1.1fr]'>
            <div className='rounded-[32px] border border-cyan-400/30 bg-cyan-500/10 p-8 shadow-[0_35px_140px_rgba(6,182,212,0.25)]'>
              <p className='text-xs font-semibold uppercase tracking-[0.3em] text-cyan-100'>
                What changed?
              </p>
              <h3 className='mt-4 text-3xl font-bold text-white md:text-4xl'>
                Smoother flow, matured presentation
              </h3>
              <p className='mt-4 text-base leading-relaxed text-cyan-50/90'>
                The landing experience now behaves like a guided slideshow on
                desktop. Each wheel action gracefully transitions to the next
                pillar of information, making it effortless to focus on a single
                story at a time.
              </p>
              <ul className='mt-6 space-y-3 text-sm text-cyan-50/80 md:text-base'>
                <li>
                  • Slide snapping activates automatically on wider screens.
                </li>
                <li>
                  • Intersection-aware navigation dots keep readers oriented.
                </li>
                <li>
                  • Refreshed gradients, typography, and spacing deliver a
                  matured feel.
                </li>
              </ul>
            </div>
            <div className='rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-[0_40px_160px_rgba(12,74,110,0.35)] backdrop-blur'>
              <p className='text-xs font-semibold uppercase tracking-[0.3em] text-amber-200'>
                Competition phases
              </p>
              <div className='mt-6 space-y-6'>
                {journeySteps.map((step) => (
                  <div
                    key={step.title}
                    className='relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-6'
                  >
                    <div
                      className={clsx(
                        'absolute inset-0 -z-10 opacity-70 blur-3xl',
                        'bg-gradient-to-br',
                        step.accent
                      )}
                    />
                    <div className='flex items-start justify-between gap-4'>
                      <h4 className='text-lg font-semibold text-white'>
                        {step.title}
                      </h4>
                      <span className='rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/80'>
                        {step.timeline}
                      </span>
                    </div>
                    <p className='mt-3 text-sm leading-relaxed text-slate-200 md:text-base'>
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id='rules'
          ref={setSectionRef(2)}
          className={clsx(
            'relative grid w-full gap-12 px-6 py-20 sm:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:px-20',
            isSlideMode ? 'min-h-screen snap-start' : 'min-h-[85vh]'
          )}
        >
          <div className='space-y-6'>
            <p className='text-sm font-semibold uppercase tracking-[0.3em] text-amber-300'>
              Official rulebook
            </p>
            <h2 className='text-4xl font-bold text-white md:text-5xl'>
              Know the guardrails before you trade
            </h2>
            <p className='text-base leading-relaxed text-slate-200 md:text-lg'>
              We kept the core of the tournament intact while smoothing the
              onboarding experience. Every verified email is eligible to join —
              no more manual filters — and the rule blocks below keep you
              accountable while you chase ROI.
            </p>
            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='rounded-2xl border border-emerald-400/40 bg-emerald-500/10 p-5 text-sm text-emerald-100 shadow-[0_25px_90px_rgba(16,185,129,0.25)]'>
                ✅ Verified email approvals happen instantly after submission.
              </div>
              <div className='rounded-2xl border border-sky-400/40 bg-sky-500/10 p-5 text-sm text-sky-100 shadow-[0_25px_90px_rgba(56,189,248,0.25)]'>
                🛡 Drawdown guardrails and minimum trading days remain unchanged.
              </div>
            </div>
            <div className='rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-200 shadow-[0_30px_120px_rgba(15,23,42,0.4)]'>
              Need help? Reach us at{' '}
              <a
                className='font-semibold text-cyan-200'
                href='mailto:support@cardicnexusglobal.com'
              >
                support@cardicnexusglobal.com
              </a>{' '}
              or @cardicnexus on Telegram for real-time assistance.
            </div>
          </div>
          <div className='grid gap-6 md:grid-cols-2'>
            {[firstColumn, secondColumn].map((column, columnIndex) => (
              <div key={columnIndex} className='space-y-4'>
                {column.map((section) => (
                  <article
                    key={section.title}
                    className='rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-[0_25px_110px_rgba(15,23,42,0.35)] backdrop-blur'
                  >
                    <h3 className='text-lg font-semibold text-cyan-200 md:text-xl'>
                      {section.title}
                    </h3>
                    <div className='mt-3 text-sm leading-relaxed text-slate-200 md:text-base'>
                      {section.body}
                    </div>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </section>

        <section
          id='register'
          ref={setSectionRef(3)}
          className={clsx(
            'relative grid w-full gap-12 px-6 py-20 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:px-20',
            isSlideMode ? 'min-h-screen snap-start' : 'min-h-[85vh]'
          )}
        >
          <div className='space-y-8'>
            <p className='text-sm font-semibold uppercase tracking-[0.3em] text-purple-300'>
              Secure your tournament slot
            </p>
            <h2 className='text-4xl font-bold text-white md:text-5xl'>
              Registration is open — approvals are instant
            </h2>
            <p className='text-base leading-relaxed text-slate-200 md:text-lg'>
              Submit the form and we will approve all verified email addresses
              automatically. You will get confirmation immediately and receive
              platform credentials within 24 hours of manual validation by the
              Cardic Nexus team.
            </p>
            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='rounded-2xl border border-amber-400/40 bg-amber-500/10 p-5 text-sm text-amber-100 shadow-[0_25px_90px_rgba(245,158,11,0.25)]'>
                ⚡️ Instant confirmation email with your submission summary.
              </div>
              <div className='rounded-2xl border border-indigo-400/40 bg-indigo-500/10 p-5 text-sm text-indigo-100 shadow-[0_25px_90px_rgba(99,102,241,0.25)]'>
                📦 Credentials delivered inside 24 hours after verification.
              </div>
              <div className='rounded-2xl border border-teal-400/40 bg-teal-500/10 p-5 text-sm text-teal-100 shadow-[0_25px_90px_rgba(20,184,166,0.25)]'>
                📸 Proof of following any two Cardic Nexus socials is required.
              </div>
              <div className='rounded-2xl border border-rose-400/40 bg-rose-500/10 p-5 text-sm text-rose-100 shadow-[0_25px_90px_rgba(244,63,94,0.25)]'>
                🔐 Your Telegram handle keeps you in the support loop.
              </div>
            </div>
            <div className='rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-slate-200 shadow-[0_30px_120px_rgba(15,23,42,0.4)]'>
              Trading kicks off soon — complete the form now to be ready when
              credentials arrive. Remember to use real details; incomplete or
              fabricated entries are filtered out automatically.
            </div>
          </div>
          <form
            onSubmit={handleSubmit}
            className='flex flex-col gap-6 rounded-3xl border border-white/10 bg-black/40 p-8 shadow-[0_40px_140px_rgba(14,165,233,0.2)] backdrop-blur'
          >
            <div className='space-y-2'>
              <h3 className='text-3xl font-semibold text-white'>
                2️⃣ Registration Form
              </h3>
              <p className='text-sm leading-relaxed text-slate-200 md:text-base'>
                Provide the details below so we can confirm your spot. Email is
                required and will be tied to your tournament access.
              </p>
            </div>

            <label className='space-y-2 text-left'>
              <span className='text-sm font-semibold uppercase tracking-wide text-slate-100'>
                Full Name
              </span>
              <input
                className='w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40'
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
                className='w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40'
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
                className='w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/40'
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
                className='w-full appearance-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/40'
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
                className='min-h-[120px] w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-300/40'
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
                className='block w-full cursor-pointer rounded-2xl border border-dashed border-white/20 bg-white/5 px-4 py-3 text-sm text-slate-200 file:mr-4 file:rounded-lg file:border-0 file:bg-gradient-to-r file:from-cyan-500 file:to-purple-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:border-cyan-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40'
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
                role='status'
                className={
                  status.type === 'success'
                    ? 'rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200'
                    : status.type === 'error'
                    ? 'rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200'
                    : 'rounded-2xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-100'
                }
              >
                {status.message}
              </div>
            )}

            <button
              type='submit'
              className='mt-2 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 via-fuchsia-500 to-blue-500 px-6 py-3 text-base font-semibold text-white shadow-[0_15px_45px_rgba(251,191,36,0.3)] transition hover:scale-[1.02] hover:shadow-[0_18px_60px_rgba(168,85,247,0.4)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-200 disabled:cursor-not-allowed disabled:opacity-60'
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting…' : 'Submit Registration'}
            </button>
            <p className='text-center text-xs text-slate-400'>
              Confirmation email arrives immediately. Credentials follow within
              24 hours of approval.
            </p>
          </form>
        </section>

        {isSlideMode && (
          <aside className='pointer-events-none fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-end gap-4 lg:flex'>
            {navItems.map((item, index) => (
              <button
                key={item.id}
                type='button'
                onClick={() => handleNavClick(index)}
                className={clsx(
                  'group relative flex h-3 w-3 items-center justify-center rounded-full border transition pointer-events-auto',
                  activeSection === index
                    ? 'scale-125 border-cyan-300 bg-cyan-300 shadow-[0_0_25px_rgba(34,211,238,0.75)]'
                    : 'border-white/30 bg-white/20 hover:bg-white/40'
                )}
              >
                <span className='sr-only'>{`Go to ${item.label}`}</span>
                <span className='pointer-events-none absolute right-full mr-3 hidden min-w-[120px] rounded-full bg-slate-900/90 px-3 py-1 text-xs font-medium text-white opacity-0 transition group-hover:inline-flex group-hover:opacity-100'>
                  {item.label}
                </span>
              </button>
            ))}
          </aside>
        )}
      </main>
    </div>
  );
}
