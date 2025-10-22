import { NextRequest, NextResponse } from 'next/server';

import { findByToken, upsertParticipant } from '@/lib/db';
import { fetchFxBluePublic } from '@/lib/fxblue';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = typeof body?.token === 'string' ? body.token.trim() : '';
    if (!token)
      return NextResponse.json(
        { ok: false, error: 'Missing token' },
        { status: 400 }
      );

    const participant = findByToken(token);
    if (!participant)
      return NextResponse.json(
        { ok: false, error: 'Unknown token' },
        { status: 404 }
      );

    const username = participant.fx?.username;
    if (!username)
      return NextResponse.json(
        { ok: false, error: 'FXBlue username not linked' },
        { status: 409 }
      );

    const statsData = await fetchFxBluePublic(username);
    const stats = {
      ...statsData,
      updatedAt: new Date().toISOString(),
    };

    upsertParticipant({ ...participant, stats });

    return NextResponse.json({ ok: true, stats });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Stats fetch error';
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}
