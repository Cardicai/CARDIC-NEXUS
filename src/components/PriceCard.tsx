import Link from 'next/link';

import CardicCard from './CardicCard';

type Plan = {
  id: string;
  title: string;
  price: number;
  features: string[];
};

export default function PriceCard({ plan }: { plan: Plan }) {
  return (
    <CardicCard>
      <h3 className='mb-2 text-xl font-semibold text-white'>{plan.title}</h3>
      <p className='mb-4 text-3xl text-brand-blue'>${plan.price}</p>
      <ul className='mb-4 list-disc space-y-1 pl-5 text-sm text-gray-400'>
        {plan.features.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      <Link
        href={`/checkout/${plan.id}`}
        className='rounded-full bg-brand-blue px-4 py-2 text-white hover:shadow-gold'
      >
        Buy with Stripe
      </Link>
    </CardicCard>
  );
}
