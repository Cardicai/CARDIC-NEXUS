import { NextRequest, NextResponse } from 'next/server';

import { findByToken } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const token = typeof body?.token === 'string' ? body.token.trim() : '';
  const p = token && findByToken(token);
  if (!p)
    return NextResponse.json(
      { ok: false, error: 'Invalid token' },
      { status: 401 }
    );
  return NextResponse.json({ ok: true, user: p });
}
