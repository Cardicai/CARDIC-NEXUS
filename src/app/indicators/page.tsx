export const metadata = {
  title: 'Premium Indicators | Cardic Nexus',
  description:
    'Unlock the Nexus Pulse indicator suite with order-flow overlays, liquidity heat, and automated confluence scoring.',
};

const indicatorStacks = [
  {
    id: 'cardicheat-21',
    title: 'CardicHeat 2.1',
    description:
      'Adaptive range breaks that map premium and discount zones before the session open so you can stalk precision reversals.',
    price: '$25 / month',
  },
  {
    id: 'cardicheat-22',
    title: 'CardicHeat 2.2',
    description:
      'Enhanced volume and delta overlays that pulse when institutions accumulate or distribute inside hidden liquidity pockets.',
    price: '$33 / month',
  },
  {
    id: 'cardicheat-23',
    title: 'CardicHeat 2.3',
    description:
      'Session-based smart trails with bias confirmation so you can scale partials while the model updates in realtime.',
    price: '$40 / month',
  },
  {
    id: 'liquidity-maps',
    title: 'Liquidity Maps',
    description:
      'Build daily liquidity ladders that reveal stop hunts, imbalance magnets, and premium trap zones before price sweeps them.',
    price: '$18 / month',
  },
  {
    id: 'whale-radar',
    title: 'Whale Radar',
    description:
      'Track the biggest block orders and dark pool footprints across crypto with automated alerting.',
    price: '$22 / month',
  },
  {
    id: 'pro-rsi-architect',
    title: 'Pro RSI Architect',
    description:
      'Institutional RSI with smart smoothing, liquidity deviation alerts, and confluence scoring baked into every timeframe.',
    price: '$28 / month',
  },
  {
    id: 'spider-web-matrix',
    title: 'Spider Web Matrix',
    description:
      'Multi-layer market structure netting that visualises where order-flow converges or snaps for high-confidence entries.',
    price: '$30 / month',
  },
];

const packages = [
  {
    id: 'cardicheat-21-plan',
    name: 'CardicHeat 2.1 Access',
    price: '$25 / month',
    perks: [
      'Precision prep zones refreshed daily',
      'Liquidity Maps bundle access',
      'Trading Hub analytics integration',
      'Telegram alert routing with @REALCARDIC',
    ],
  },
  {
    id: 'cardicheat-22-plan',
    name: 'CardicHeat 2.2 Access',
    price: '$33 / month',
    perks: [
      'Everything in CardicHeat 2.1 Access',
      'Delta and absorption overlays in realtime',
      'Whale Radar monitoring channel',
      'Priority desk calibration call',
    ],
  },
  {
    id: 'cardicheat-23-plan',
    name: 'CardicHeat 2.3 Apex',
    price: '$40 / month',
    perks: [
      'All 2.1 and 2.2 features included',
      'Session bias guardian with live tuning',
      'Pro RSI Architect + Spider Web Matrix',
      'Direct escalation path to the desk',
    ],
  },
];

const faqs = [
  {
    question: 'Do the indicators work on funded accounts?',
    answer:
      'Yes. Nexus Pulse is built for prop firms. Risk layers prevent over-leverage and the Guardian module enforces drawdown compliance.',
  },
  {
    question: 'Can I request custom settings?',
    answer:
      'Every subscription includes a calibration call. Enterprise clients receive bespoke logic and private routing.',
  },
  {
    question: 'How fast is onboarding?',
    answer:
      'Pulse Core and Elite activate within 24 hours. Enterprise deployments are scheduled with the desk to handle complex routing.',
  },
];

import IndicatorPageClient from './IndicatorPageClient';

export default function IndicatorsPage() {
  return (
    <IndicatorPageClient
      indicatorStacks={indicatorStacks}
      packages={packages}
      faqs={faqs}
    />
  );
}
