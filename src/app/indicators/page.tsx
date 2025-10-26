export const metadata = {
  title: 'Premium Indicators | Cardic Nexus',
  description:
    'Unlock the Nexus Pulse indicator suite with order-flow overlays, liquidity heat, and automated confluence scoring.',
};

const indicatorStacks = [
  {
    title: 'CardicHeat 2.1',
    description:
      'Adaptive range breaks that map premium and discount zones before the session open so you can stalk precision reversals.',
  },
  {
    title: 'CardicHeat 2.2',
    description:
      'Enhanced volume and delta overlays that pulse when institutions accumulate or distribute inside hidden liquidity pockets.',
  },
  {
    title: 'CardicHeat 2.3',
    description:
      'Session-based smart trails with bias confirmation so you can scale partials while the model updates in realtime.',
  },
  {
    title: 'Liquidity Maps',
    description:
      'Build daily liquidity ladders that reveal stop hunts, imbalance magnets, and premium trap zones before price sweeps them.',
  },
  {
    title: 'Whale Radar',
    description:
      'Track the biggest block orders and dark pool footprints across FX, crypto, and metals with automated alerting.',
  },
  {
    title: 'Pro RSI Architect',
    description:
      'Institutional RSI with smart smoothing, liquidity deviation alerts, and confluence scoring baked into every timeframe.',
  },
  {
    title: 'Spider Web Matrix',
    description:
      'Multi-layer market structure netting that visualises where order-flow converges or snaps for high-confidence entries.',
  },
];

const packages = [
  {
    id: 'pulse-core',
    name: 'Pulse Core',
    price: '$97 / month',
    perks: [
      'CardicHeat 2.1 + Liquidity Maps bundle',
      'Live trade room overlays twice a week',
      'Trading Hub analytics integration',
      'Telegram alert routing with @REALCARDIC',
    ],
  },
  {
    id: 'pulse-elite',
    name: 'Pulse Elite',
    price: '$197 / month',
    perks: [
      'Everything in Pulse Core',
      'CardicHeat 2.3 trend guardian',
      'Whale Radar + Pro RSI Architect',
      'Priority automation tuning with the desk',
    ],
  },
  {
    id: 'pulse-enterprise',
    name: 'Pulse Enterprise',
    price: 'Custom',
    perks: [
      'Institutional routing & multi-seat licensing',
      'Dedicated success manager and weekly desk sync',
      'Private API endpoints for bespoke dashboards',
      'Spider Web Matrix strategy labs',
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
