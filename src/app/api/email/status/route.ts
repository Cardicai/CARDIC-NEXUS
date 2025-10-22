import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  const from = (process.env.EMAIL_FROM || '').trim();
  const verified =
    (process.env.EMAIL_DOMAIN_VERIFIED || '').trim().toLowerCase() === 'true' &&
    from.length > 0;

  return NextResponse.json({ verified, from });
}
