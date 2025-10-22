import { NextRequest, NextResponse } from 'next/server';

import { findByToken, upsertParticipant } from '@/lib/db';
import { sendMail } from '@/lib/mailer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey)
    return NextResponse.json(
      { ok: false, error: 'ADMIN_API_KEY not configured' },
      { status: 500 }
    );

  const providedKey = req.headers.get('x-admin-key')?.trim();
  if (providedKey !== adminKey)
    return NextResponse.json(
      { ok: false, error: 'Unauthorized' },
      { status: 401 }
    );

  const body = await req.json();
  const token = typeof body?.token === 'string' ? body.token.trim() : '';
  const fxblueUsername =
    typeof body?.fxblueUsername === 'string' ? body.fxblueUsername.trim() : '';

  if (!token || !fxblueUsername)
    return NextResponse.json(
      { ok: false, error: 'Missing token or fxblueUsername' },
      { status: 400 }
    );

  const participant = findByToken(token);
  if (!participant)
    return NextResponse.json(
      { ok: false, error: 'Unknown token' },
      { status: 404 }
    );

  const updated = {
    ...participant,
    status: 'ACTIVE' as const,
    fx: { ...(participant.fx || {}), username: fxblueUsername },
  };

  upsertParticipant(updated);

  if (participant.email) {
    try {
      await sendMail({
        to: participant.email,
        subject: 'Your Cardic Nexus account is active',
        html: `
          <div style="background:#0a0f1c;padding:24px;font-family:Inter,Arial;color:#cbd5e1">
            <div style="max-width:560px;margin:auto;background:#0f172a;border:1px solid #1e293b;border-radius:14px;padding:24px">
              <div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#94a3b8">Cardic Nexus</div>
              <h2 style="margin:12px 0;color:#e2e8f0">Competition Access Activated</h2>
              <p>Hi <b style="color:#e2e8f0">${participant.name}</b>, your competition slot is now active.</p>
              <p>Your FXBlue profile is linked as <b style="color:#a7f3d0">${fxblueUsername}</b>. Refresh the dashboard to pull your latest metrics.</p>
            </div>
          </div>
        `,
      });
    } catch (_error) {
      // Ignore mail delivery failures to avoid blocking activation.
    }
  }

  return NextResponse.json({
    ok: true,
    status: updated.status,
    fxblueUsername: updated.fx.username,
  });
}
