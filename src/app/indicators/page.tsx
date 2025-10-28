import { indicatorFaqs, indicatorPackages, indicatorStacks } from './data';
import IndicatorsPageClient from './IndicatorPageClient';

export const metadata = {
  title: 'Premium Indicators | Cardic Nexus',
  description:
    'Unlock the Nexus Pulse indicator suite with order-flow overlays, liquidity heat, and automated confluence scoring.',
};

export default function IndicatorsPage() {
  return (
    <IndicatorsPageClient
      indicatorStacks={indicatorStacks}
      packages={indicatorPackages}
      faqs={indicatorFaqs}
    />
  );
}
