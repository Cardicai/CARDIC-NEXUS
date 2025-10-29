import { indicatorFaqs, indicatorPackages, indicatorStacks } from './data';
import IndicatorPageClient from './IndicatorPageClient';

export default function IndicatorsPage() {
  return (
    <IndicatorPageClient
      indicatorStacks={indicatorStacks}
      packages={indicatorPackages}
      faqs={indicatorFaqs}
    />
  );
}
