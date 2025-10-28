import { indicatorFaqs, indicatorPackages, indicatorStacks } from './data';
import IndicatorPageClient from './IndicatorPageClient';

export const metadata = {
  title: 'Premium Indicators | Cardic Nexus',
  description:
    'Unlock the Nexus Pulse indicator suite with order-flow overlays, liquidity heat, and automated confluence scoring.',
};

export default function IndicatorsPage() {
  return (
    <IndicatorPageClient
      indicatorStacks={indicatorStacks}
      packages={indicatorPackages}
      faqs={indicatorFaqs}
    />
  );
}
