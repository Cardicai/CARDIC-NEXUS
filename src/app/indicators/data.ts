export type IndicatorStack = {
  id: string;
  title: string;
  description: string;
  price: string;
};

export type IndicatorPackage = {
  id: string;
  name: string;
  price: string;
  perks: string[];
};

export type IndicatorFaq = {
  question: string;
  answer: string;
};

export type PlanSummary = {
  id: string;
  title: string;
  price: string;
};

export const indicatorStacks: IndicatorStack[] = [
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

export const indicatorPackages: IndicatorPackage[] = [
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

export const indicatorFaqs: IndicatorFaq[] = [
  {
    question: 'Which platforms are supported?',
    answer:
      'Nexus Pulse connects to TradingView and the Cardic Trading Hub. Provide your TradingView username when submitting the trial form so the desk can authorise access.',
  },
  {
    question: 'Do I need a Gmail address?',
    answer:
      'Yes. The desk issues activation keys and admin confirmations through Gmail so delivery is instant. Requests without a Gmail address are automatically rejected.',
  },
  {
    question: 'How do I get calibration help?',
    answer:
      'Every subscription includes desk-admin support. Submit tweaks through the payment modal or support card and the admin team will follow up with tailored settings.',
  },
];

const planCatalog: PlanSummary[] = [
  ...indicatorStacks.map((stack) => ({
    id: stack.id,
    title: stack.title,
    price: stack.price,
  })),
  ...indicatorPackages.map((pkg) => ({
    id: pkg.id,
    title: pkg.name,
    price: pkg.price,
  })),
];

export function resolvePlan(planId?: string | null): PlanSummary | null {
  if (!planId) {
    return null;
  }

  return planCatalog.find((plan) => plan.id === planId) ?? null;
}

export const allPlanSummaries = planCatalog;
