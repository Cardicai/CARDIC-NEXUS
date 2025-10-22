import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
export async function GET() {
  const verified =
    process.env.EMAIL_DOMAIN_VERIFIED === 'true' && !!process.env.EMAIL_FROM;
  return NextResponse.json({ verified, from: process.env.EMAIL_FROM || '' });
}
