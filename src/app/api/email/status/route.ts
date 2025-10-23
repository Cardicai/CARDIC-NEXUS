import { NextResponse } from 'next/server';

import { getEnv, isEmailDomainVerified } from '@/lib/env';

export const runtime = 'nodejs';

export async function GET() {
  const from =
    getEnv('EMAIL_FROM') ?? getEnv('MAIL_FROM') ?? getEnv('FROM_EMAIL') ?? '';
  const verified = isEmailDomainVerified() && from.length > 0;
  return NextResponse.json({ verified, from });
}
