'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import './cardic-nexus.css';

import FreeTrialModal from '@/components/FreeTrialModal';
import PaymentSheet from '@/components/PaymentSheet';
import RedeemSheet from '@/components/RedeemSheet';

const stats = [
  { label: 'Active traders', value: '12k+' },
  { label: 'Markets covered', value: '24' },
  { label: 'Signal accuracy', value: '87%' },
  { label: 'Avg. response', value: '< 2m' },
];

const quickLinks = [
  {
    title: 'Algo Bots',
    description: 'Autonomous executions engineered for disciplined risk.',
    href: '/partner',
    accent: 'bots',
    soon: true,
  },
  {
    title: 'Indicators',
    description: 'Signature overlays defining market structure in real time.',
    href: '#projects',
    accent: 'indicators',
  },
  {
    title: 'Cardic Heat',
    description: 'Liquidity intelligence, volatility sensing, adaptive alerts.',
    href: '#heat',
    accent: 'heat',
  },
  {
    title: 'Expert Advisors',
    description: 'Institutional logic delivered to MT4 / MT5.',
    href: '/partner',
    accent: 'eas',
    soon: true,
  },
];

const solutionPillars = [
  {
    title: 'AI Market Intelligence',
    copy: 'Adaptive neural models compressing macro, orderflow, and liquidity data into decisive trading narratives.',
    bullets: [
      'Institutional feeds distilled for retail',
      'Auto-learned thresholds per symbol',
      'Risk overlays with confidence scoring',
    ],
  },
  {
    title: 'Execution Toolkit',
    copy: 'From premium signals to premium-grade automation, everything is calibrated to protect capital first.',
    bullets: [
      'Scenario-based signal notes',
      'Position sizing frameworks',
      'Automation with guard rails',
    ],
  },
  {
    title: 'Investor Experience',
    copy: 'Concierge onboarding, rapid response support, and transparent performance dashboards for every member.',
    bullets: [
      '2-minute median response time',
      'Global community rooms',
      'Priority partner success team',
    ],
  },
];

const heatVersions = [
  {
    version: 'CARDIC Heat 2.0',
    price: '$25',
    badge: 'Live',
    term: '2 months access',
    plan: {
      id: 'heat-20',
      title: 'CARDIC Heat 2.0',
      price: '$25 / 2 months',
    },
    description:
      'Signature liquidity zones with adaptive heat-mapping and execution prompts.',
  },
  {
    version: 'CARDIC Heat 2.1',
    price: '$35',
    badge: 'Live',
    term: '2 months access',
    plan: {
      id: 'heat-21',
      title: 'CARDIC Heat 2.1',
      price: '$35 / 2 months',
    },
    description:
      'Enhanced volatility detection plus bias calibration for gold, FX, and crypto.',
  },
  {
    version: 'CARDIC Heat 2.3',
    price: '$50',
    badge: 'Early Access',
    term: '1 month access',
    plan: {
      id: 'heat-23',
      title: 'CARDIC Heat 2.3',
      price: '$50 / month',
    },
    description:
      'Early AI copilot that forecasts order block battles before they trigger.',
  },
];

const pipeline = [
  {
    title: 'CARDIC Oracle™ 1.0',
    type: 'Indicator',
    status: 'In Validation',
    summary:
      'Predictive zones aligning liquidity sweeps with AI derived sentiment scoring.',
    tags: ['AI', 'Liquidity', 'Sentiment'],
    plan: {
      id: 'oracle-1-0',
      title: 'CARDIC Oracle 1.0',
      price: 'Coming Soon',
    },
  },
  {
    title: 'Cardic Heat Zones™',
    type: 'Indicator',
    status: 'Live',
    summary:
      'Smart money liquidity grids with streaming alerts and execution insights.',
    tags: ['SMC', 'Zones', 'Alerts'],
    plan: {
      id: 'heat-zones',
      title: 'CARDIC Heat Zones™',
      price: 'From $99',
    },
  },
  {
    title: 'Cardic Spider Web™',
    type: 'Indicator',
    status: 'Prototype',
    summary:
      'Dynamic SR lattice merging Fibonacci, volume profile, and fair value mapping.',
    tags: ['Fibonacci', 'Volume', 'Order Blocks'],
    plan: {
      id: 'spider-web',
      title: 'Cardic Spider Web™',
      price: 'From $129',
    },
  },
  {
    title: 'Premium Signals',
    type: 'Membership',
    status: 'Live',
    summary:
      'Daily multi-asset signals backed by institutional risk commentary.',
    tags: ['Forex', 'Metals', 'Crypto'],
    plan: {
      id: 'premium-signals',
      title: 'Premium Signals',
      price: '$49/mo',
    },
  },
];

const pricing = [
  {
    title: 'Premium Signals',
    price: '$49/mo',
    description: 'Gold, FX, and crypto entries with detailed trade management.',
    perks: [
      'Intraday + swing trade feeds',
      'Risk notes & market context',
      'Private Telegram access',
    ],
    cta: {
      label: 'Subscribe',
      action: {
        id: 'premium-signals',
        title: 'Premium Signals',
        price: '$49/mo',
      },
    },
  },
  {
    title: 'Indicator Suite',
    price: 'From $99',
    description: 'Cardic Heat suite, Heat Zones™, and upcoming Oracle roadmap.',
    perks: [
      'Plug-and-trade templates',
      'Lifetime updates on purchased tiers',
      'Priority release previews',
    ],
    href: '#projects',
    cta: {
      label: 'View Indicators',
    },
  },
  {
    title: 'All-Access',
    price: '$179/mo',
    description:
      'Everything Cardic builds, plus private desk guidance and automation.',
    perks: [
      'All indicators + premium signals',
      'Quarterly strategy labs',
      'Priority concierge desk',
    ],
    action: {
      id: 'all-access',
      title: 'All-Access',
      price: '$179/mo',
    },
    cta: {
      label: 'Join Premium',
      accent: 'blue',
    },
  },
];

const partners = [
  'TradersCove',
  'MetaQuant Alliance',
  'FXPulse Labs',
  'Blockwave Group',
  'Aurora Desk',
];

export default function CardicNexusLanding() {
  const [payOpen, setPayOpen] = useState(false);
  const [plan, setPlan] = useState(null);
  const [redeemOpen, setRedeemOpen] = useState(false);
  const [comingSoon, setComingSoon] = useState(null);
  const [trialOpen, setTrialOpen] = useState(false);
  const soonTimer = useRef(null);

  const openPay = (selectedPlan) => {
    setPlan(selectedPlan);
    setPayOpen(true);
  };

  const openAssistance = (version) => {
    const baseUrl = 'https://t.me/DeuceForex';
    const message = `Hey Cardic team, I need help understanding CARDIC Heat ${version}.`;
    const target = `${baseUrl}?text=${encodeURIComponent(message)}`;
    const win = window.open(target, '_blank', 'noopener,noreferrer');
    if (win) {
      win.focus();
    }
  };

  const triggerComingSoon = (label) => {
    setComingSoon(label);
    if (soonTimer.current) window.clearTimeout(soonTimer.current);
    soonTimer.current = window.setTimeout(() => setComingSoon(null), 2200);
  };

  useEffect(
    () => () => {
      if (soonTimer.current) window.clearTimeout(soonTimer.current);
    },
    []
  );

  const handlePricingCTA = (config) => {
    if (config?.href) {
      const anchor = document.querySelector(config.href);
      if (anchor) {
        anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }
    if (config?.action) {
      openPay(config.action);
    }
  };

  return (
    <div className='cnx-landing'>
      <div className='cnx-landing__mesh' aria-hidden='true' />
      <div className='cnx-landing__aura' aria-hidden='true' />

      <section className='cnx-hero'>
        <div className='cnx-hero__eyebrow'>AI • Trading • Innovation</div>
        <h1 className='cnx-hero__title'>
          The precision operating system for modern retail traders.
        </h1>
        <p className='cnx-hero__subtitle'>
          CARDIC NEXUS merges institutional intelligence, adaptive automation,
          and white-glove service so you can trade with conviction even in
          turbulent markets.
        </p>
        <div className='cnx-hero__actions'>
          <button
            type='button'
            className='cnx-btn cnx-btn--light'
            onClick={() => setTrialOpen(true)}
          >
            Claim free trial
          </button>
          <button
            type='button'
            className='cnx-btn cnx-btn--dark'
            onClick={() => setRedeemOpen(true)}
          >
            Redeem access code
          </button>
          <button
            type='button'
            className='cnx-btn cnx-btn--primary'
            onClick={() =>
              openPay({
                id: 'all-access',
                title: 'All-Access',
                price: '$179/mo',
              })
            }
          >
            Join premium desk
          </button>
        </div>
        <dl className='cnx-hero__stats'>
          {stats.map((stat) => (
            <div key={stat.label} className='cnx-hero__stat'>
              <dt>{stat.label}</dt>
              <dd>{stat.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section
        className='cnx-section cnx-section--grid'
        aria-label='Solution shortcuts'
      >
        <header className='cnx-section__head'>
          <span className='cnx-section__eyebrow'>Launchpad</span>
          <h2>Navigate the suite</h2>
          <p>
            Precision tooling across AI-powered indicators, expert advisors, and
            live market intelligence — curated for traders who demand more.
          </p>
        </header>
        <div className='cnx-grid cnx-grid--quicklinks'>
          {quickLinks.map((item) => {
            const content = (
              <>
                <div className='cnx-quicklink__label'>{item.title}</div>
                <p className='cnx-quicklink__copy'>{item.description}</p>
                <span className='cnx-quicklink__icon' aria-hidden='true'>
                  ↗
                </span>
              </>
            );

            if (item.soon) {
              return (
                <button
                  key={item.title}
                  type='button'
                  className={`cnx-card cnx-quicklink cnx-quicklink--${item.accent}`}
                  onClick={() => triggerComingSoon(item.title)}
                >
                  {content}
                  <span className='cnx-quicklink__status'>Coming soon</span>
                </button>
              );
            }

            return (
              <Link
                key={item.title}
                href={item.href}
                prefetch={false}
                className={`cnx-card cnx-quicklink cnx-quicklink--${item.accent}`}
              >
                {content}
                <span className='cnx-quicklink__status'>Explore</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className='cnx-section cnx-section--pillars'>
        <header className='cnx-section__head'>
          <span className='cnx-section__eyebrow'>Operating Model</span>
          <h2>Built like a trading desk. Delivered for you.</h2>
        </header>
        <div className='cnx-grid cnx-grid--pillars'>
          {solutionPillars.map((pillar) => (
            <article key={pillar.title} className='cnx-card cnx-pillar'>
              <h3>{pillar.title}</h3>
              <p>{pillar.copy}</p>
              <ul>
                {pillar.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section id='heat' className='cnx-section cnx-section--feature'>
        <header className='cnx-section__head'>
          <span className='cnx-section__eyebrow'>Flagship</span>
          <h2>CARDIC Heat™ Intelligence</h2>
          <p>
            Three evolutionary versions tuned to decode liquidity wars before
            price action confirms. Pick your tier, or tap our desk for guidance.
          </p>
        </header>
        <div className='cnx-grid cnx-grid--heat'>
          {heatVersions.map((entry) => (
            <article key={entry.version} className='cnx-card cnx-heat'>
              <div className='cnx-chip'>{entry.badge}</div>
              <h3>{entry.version}</h3>
              <p>{entry.description}</p>
              <div className='cnx-heat__meta'>
                <span className='cnx-heat__price'>{entry.price}</span>
                <span className='cnx-heat__term'>{entry.term}</span>
              </div>
              <div className='cnx-heat__actions'>
                <button
                  type='button'
                  className='cnx-btn cnx-btn--primary'
                  onClick={() => openPay(entry.plan)}
                >
                  Secure access
                </button>
                <button
                  type='button'
                  className='cnx-btn cnx-btn--ghost'
                  onClick={() => openAssistance(entry.version)}
                >
                  Need assistance?
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id='projects' className='cnx-section cnx-section--projects'>
        <header className='cnx-section__head'>
          <span className='cnx-section__eyebrow'>Product Roadmap</span>
          <h2>Experience the Nexus suite</h2>
          <p>
            Every product is orchestrated to give retail traders institutional
            precision without the bureaucracy.
          </p>
        </header>
        <div className='cnx-grid cnx-grid--projects'>
          {pipeline.map((product) => (
            <article key={product.title} className='cnx-card cnx-project'>
              <div className='cnx-project__meta'>
                <span>{product.type}</span>
                <span className='cnx-chip'>{product.status}</span>
              </div>
              <h3>{product.title}</h3>
              <p>{product.summary}</p>
              <div className='cnx-project__tags'>
                {product.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <div className='cnx-project__actions'>
                <button
                  type='button'
                  className='cnx-btn cnx-btn--ghost'
                  onClick={() => openPay(product.plan)}
                >
                  View offer
                </button>
                <a className='cnx-btn cnx-btn--light' href='#contact'>
                  Talk to us
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id='pay' className='cnx-section cnx-section--pricing'>
        <header className='cnx-section__head'>
          <span className='cnx-section__eyebrow'>Plans</span>
          <h2>Choose your trading advantage</h2>
          <p>
            Simple, transparent options that keep you locked in with the desk —
            no hidden upsells, just outcomes.
          </p>
        </header>
        <div className='cnx-grid cnx-grid--pricing'>
          {pricing.map((tier) => (
            <article key={tier.title} className='cnx-card cnx-price'>
              <h3>{tier.title}</h3>
              <p className='cnx-price__lead'>{tier.description}</p>
              <div className='cnx-price__value'>{tier.price}</div>
              <ul>
                {tier.perks.map((perk) => (
                  <li key={perk}>{perk}</li>
                ))}
              </ul>
              <button
                type='button'
                className={`cnx-btn ${
                  tier.cta?.accent === 'blue'
                    ? 'cnx-btn--primary'
                    : 'cnx-btn--light'
                }`}
                onClick={() =>
                  handlePricingCTA({
                    href: tier.href,
                    action: tier.action ?? tier.cta?.action,
                  })
                }
              >
                {tier.cta?.label ?? 'Learn more'}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section
        className='cnx-section cnx-section--partners'
        aria-label='Partners and alliances'
      >
        <header className='cnx-section__head'>
          <span className='cnx-section__eyebrow'>Alliances</span>
          <h2>Trusted by desks pushing the edge</h2>
        </header>
        <ul className='cnx-partners'>
          {partners.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </section>

      <section id='contact' className='cnx-section cnx-section--contact'>
        <header className='cnx-section__head'>
          <span className='cnx-section__eyebrow'>Connect</span>
          <h2>Stay close to the pulse</h2>
          <p>
            Drop into the community, follow the drops, or DM the desk — the team
            is live and responsive.
          </p>
        </header>
        <div className='cnx-contact__grid'>
          <a
            className='cnx-btn cnx-btn--primary'
            href='https://www.tiktok.com/@cardicnexus?_t=ZT-8zDvH2iUl01&_r=1'
            target='_blank'
            rel='noreferrer'
          >
            TikTok (Global)
          </a>
          <a
            className='cnx-btn cnx-btn--light'
            href='https://www.instagram.com/cardicnexus?igsh=MXh3NGhxZXdpdDR0OQ=='
            target='_blank'
            rel='noreferrer'
          >
            Instagram
          </a>
          <a
            className='cnx-btn cnx-btn--light'
            href='https://x.com/CARDICNEXUS?t=xpUNONAmekVrQBRXiQp36A&s=09'
            target='_blank'
            rel='noreferrer'
          >
            X (Twitter)
          </a>
          <a
            className='cnx-btn cnx-btn--light'
            href='https://t.me/REALCARDIC'
            target='_blank'
            rel='noreferrer'
          >
            Telegram (DM)
          </a>
          <a
            className='cnx-btn cnx-btn--light'
            href='https://t.me/cardicnewsupdates'
            target='_blank'
            rel='noreferrer'
          >
            Telegram (News)
          </a>
        </div>
        <p className='cnx-contact__tagline'>
          We build, we iterate, and we keep traders winning. ♾️
        </p>
      </section>

      <footer className='cnx-footer'>
        <div className='cnx-footer__divider' />
        <div className='cnx-footer__meta'>
          <span>
            © {new Date().getFullYear()} Cardic Nexus. All rights reserved.
          </span>
          <span>Crafted for traders who refuse ordinary.</span>
        </div>
      </footer>

      <FreeTrialModal open={trialOpen} onClose={() => setTrialOpen(false)} />
      <RedeemSheet open={redeemOpen} onClose={() => setRedeemOpen(false)} />
      <PaymentSheet
        open={payOpen}
        onClose={() => setPayOpen(false)}
        plan={plan}
      />

      {comingSoon && (
        <div className='cnx-soon' role='status' aria-live='polite'>
          <div className='cnx-soon__inner'>
            <span className='cnx-soon__label'>Coming soon</span>
            <h3 className='cnx-soon__title'>{comingSoon}</h3>
            <p className='cnx-soon__copy'>
              Stay close — launch alerts drop inside the community first.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
