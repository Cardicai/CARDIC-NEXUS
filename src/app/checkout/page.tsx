import CheckoutPageClient from './CheckoutPageClient';
import { resolvePlan } from '../indicators/data';

export const metadata = {
  title: 'Checkout | Cardic Nexus',
  description:
    'Complete your Cardic Nexus premium indicator subscription with crypto, PayPal, bank transfer, or Apple Pay.',
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const rawPlan = resolvedSearchParams?.plan;
  const planId = Array.isArray(rawPlan) ? rawPlan[0] : rawPlan;
  const planSummary = resolvePlan(planId);

  return <CheckoutPageClient plan={planSummary ? { ...planSummary } : null} />;
}
