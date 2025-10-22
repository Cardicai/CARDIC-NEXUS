import { NextRequest, NextResponse } from 'next/server';

import { findByToken, upsertParticipant } from '@/lib/db';
import { sendMail } from '@/lib/mailer';

export async function adminActivateGET() {
  return NextResponse.json({
    ok: true,
    hint: 'Use POST with x-admin-key and JSON body',
  });
}

export async function adminActivatePOST(req: NextRequest) {
  try {
    const adminKey = process.env.ADMIN_API_KEY?.trim();
    if (!adminKey) {
      return NextResponse.json(
        { ok: false, error: 'ADMIN_API_KEY not configured' },
        { status: 500 }
      );
    }

    const providedKey = req.headers.get('x-admin-key')?.trim();
    if (providedKey !== adminKey) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch (error) {
      return NextResponse.json(
        { ok: false, error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const payload =
      body && typeof body === 'object' ? (body as Record<string, unknown>) : {};
    const token =
      typeof payload.token === 'string' ? (payload.token as string).trim() : '';
    const fxblueUsername =
      typeof payload.fxblueUsername === 'string'
        ? (payload.fxblueUsername as string).trim()
        : '';

    if (!token || !fxblueUsername) {
      return NextResponse.json(
        { ok: false, error: 'Missing token or fxblueUsername' },
        { status: 400 }
      );
    }

    const participant = findByToken(token);
    if (!participant) {
      return NextResponse.json(
        { ok: false, error: 'Token not found' },
        { status: 404 }
      );
    }

    const updatedParticipant = {
      ...participant,
      status: 'ACTIVE' as const,
      fx: { ...(participant.fx ?? {}), username: fxblueUsername },
    };

    upsertParticipant(updatedParticipant);

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
      } catch (error) {
        // Non-blocking: ignore mail delivery issues.
      }
    }

    return NextResponse.json({ ok: true, message: 'Activated' });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
