export type PricingCTA = {
  label: string;
  href: string;
};

export type FeaturedPlan = {
  title: string;
  price: string;
  bullets: string[];
  cta: PricingCTA;
};

export type StandalonePlan = {
  title: string;
  price: string;
  desc: string;
  cta: PricingCTA;
};

export type UpcomingPlan = {
  title: string;
  status: string;
};

export type PricingPlans = {
  featured: FeaturedPlan;
  standalone: StandalonePlan[];
  upcoming: UpcomingPlan[];
};

export const plans: PricingPlans = {
  featured: {
    title: 'All-Access Membership',
    price: '$179/mo',
    bullets: [
      'All Cardic Indicators',
      'Premium Trade Signals',
      'Priority 24/7 Support',
    ],
    cta: { label: 'Join Premium', href: '/join' },
  },
  standalone: [
    {
      title: 'CARDIC Heat 2.0',
      price: '$25 / 2 months',
      desc: 'Core detection of liquidity zones.',
      cta: { label: 'Get 2.0', href: '/buy/2.0' },
    },
    {
      title: 'CARDIC Heat 2.1',
      price: '$35 / 2 months',
      desc: 'Sharper filtering for cleaner entries.',
      cta: { label: 'Get 2.1', href: '/buy/2.1' },
    },
    {
      title: 'CARDIC Heat 2.3 (Early Access)',
      price: '$50 / 1 month',
      desc: 'Dynamic, cutting-edge signals.',
      cta: { label: 'Get 2.3', href: '/buy/2.3' },
    },
  ],
  upcoming: [
    { title: 'Cardic Oracle 1.0', status: 'Coming Soon' },
    { title: 'Heat Zones™', status: 'Live' },
  ],
};
