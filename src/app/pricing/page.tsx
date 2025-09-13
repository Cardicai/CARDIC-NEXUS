import PriceCard from '@/components/PriceCard';
import Section from '@/components/Section';

const plans = [
  {
    id: 'premium',
    title: 'Premium Signals',
    price: 49,
    features: ['Daily updates', 'Risk mgmt notes', 'Telegram access'],
  },
  {
    id: 'heat-zones',
    title: 'Indicators',
    price: 99,
    features: ['Heat Zones', 'Spider Web (coming soon)'],
  },
  {
    id: 'all-access',
    title: 'All-Access Membership',
    price: 199,
    features: ['All indicators', 'Premium signals'],
  },
];

export default function PricingPage() {
  return (
    <Section>
      <h1 className='mb-8 text-3xl font-bold'>Pricing</h1>
      <div className='grid gap-6 md:grid-cols-3'>
        {plans.map((plan) => (
          <PriceCard key={plan.id} plan={plan} />
        ))}
      </div>
    </Section>
  );
}
