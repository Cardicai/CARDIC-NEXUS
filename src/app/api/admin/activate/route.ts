import { NextRequest, NextResponse } from 'next/server';

import { activateParticipant, findByToken } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const token = typeof body?.token === 'string' ? body.token.trim() : '';
  const fxblueUsername =
    typeof body?.fxblueUsername === 'string' ? body.fxblueUsername.trim() : '';
  if (!token)
    return NextResponse.json(
      { ok: false, error: 'Missing token' },
      { status: 400 }
    );
  const p = findByToken(token);
  if (!p)
    return NextResponse.json(
      { ok: false, error: 'Unknown token' },
      { status: 404 }
    );
  activateParticipant(token, fxblueUsername || undefined);
  const updated = findByToken(token);
  return NextResponse.json({
    ok: true,
    status: updated?.status ?? 'ACTIVE',
    fxblueUsername: updated?.fx?.username || null,
  });
}
