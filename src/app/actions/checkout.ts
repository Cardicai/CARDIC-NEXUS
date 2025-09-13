'use server';

const priceMap: Record<string, string> = {
  'oracle-1': '/success',
  'heat-zones': '/success',
  'spider-web': '/success',
  premium: '/success',
};

export async function createCheckoutSession(productId: string) {
  return { url: priceMap[productId] || '/cancel' };
}
