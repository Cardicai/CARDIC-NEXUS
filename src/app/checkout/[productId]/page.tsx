import { redirect } from 'next/navigation';

import { createCheckoutSession } from '@/app/actions/checkout';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function CheckoutPage({ params }: any) {
  const { url } = await createCheckoutSession(params.productId);
  redirect(url);
}
