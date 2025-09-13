'use client';
import { useRouter } from 'next/navigation';

import { createCheckoutSession } from '@/app/actions/checkout';

export default function BuyButton({
  productId,
  children,
}: {
  productId: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        const { url } = await createCheckoutSession(productId);
        router.push(url);
      }}
      className='rounded bg-brand-blue px-4 py-2 text-white hover:shadow-gold'
    >
      {children}
    </button>
  );
}
