import { NextRequest, NextResponse } from 'next/server';

import { upsertParticipant } from '@/lib/db';
import { sendMail } from '@/lib/mailer';
import { makeToken } from '@/lib/util';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || '';
    const body = await req.json();
    const {
      name: rawName,
      email: rawEmail,
      platform: rawPlatform,
      broker: rawBroker,
      server: rawServer,
      leverage: rawLeverage,
      accountSize: rawAccountSize,
    } = body || {};

    const name = typeof rawName === 'string' ? rawName.trim() : '';
    const email = typeof rawEmail === 'string' ? rawEmail.trim() : '';
    const platformInput =
      typeof rawPlatform === 'string' ? rawPlatform.trim().toUpperCase() : '';
    const platform =
      platformInput === 'MT4' || platformInput === 'MT5'
        ? (platformInput as 'MT4' | 'MT5')
        : undefined;
    const broker = typeof rawBroker === 'string' ? rawBroker.trim() : undefined;
    const server = typeof rawServer === 'string' ? rawServer.trim() : undefined;
    const leverage =
      typeof rawLeverage === 'string' ? rawLeverage.trim() : undefined;
    const accountSize =
      typeof rawAccountSize === 'string' ? rawAccountSize.trim() : undefined;

    if (!name || !email)
      return NextResponse.json(
        { ok: false, error: 'Missing name or email' },
        { status: 400 }
      );

    const token = makeToken(name);
    const now = new Date().toISOString();
    upsertParticipant({
      id: token,
      name,
      email,
      status: 'PENDING',
      createdAt: now,
      meta: { platform, broker, server, leverage, accountSize },
    });

    const userHtml = `
      <div style="background:#0a0f1c;padding:24px;font-family:Inter,Arial;color:#cbd5e1">
        <div style="max-width:560px;margin:auto;background:#0f172a;border:1px solid #1e293b;border-radius:14px;padding:24px">
          <div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#94a3b8">Cardic Nexus</div>
          <h2 style="margin:12px 0;color:#e2e8f0">Your Secret Token</h2>
          <p>Welcome, <b style="color:#e2e8f0">${name}</b>. Keep this safe:</p>
          <div style="padding:14px 16px;border-radius:10px;background:#052e2b;color:#a7f3d0;font-size:18px;font-weight:700;letter-spacing:.06em">${token}</div>
          <p style="margin-top:16px">Status: <b>PENDING</b>. We’ll create your MT4/MT5 account and link FXBlue. This may take up to 24 hours.</p>
          <ol style="margin:10px 0 0 18px">
            <li>Open the Dashboard and paste your token.</li>
            <li>Watch for your login credentials via email.</li>
            <li>Stats & leaderboard appear after activation.</li>
          </ol>
        </div>
      </div>`;

    const adminHtml = `
      <div>
        <h3>New Competition Signup</h3>
        <p><b>Name:</b> ${name}<br/><b>Email:</b> ${email}<br/><b>Token:</b> ${token}</p>
        <p><b>Platform:</b> ${platform || '-'} | <b>Broker:</b> ${
      broker || '-'
    } | <b>Server:</b> ${server || '-'} |
           <b>Leverage:</b> ${leverage || '-'} | <b>Account Size:</b> ${
      accountSize || '-'
    }</p>
        <p>Action for desk: Create MT4/MT5 account, link FXBlue, then POST /api/admin/activate.</p>
      </div>`;

    await Promise.all([
      sendMail({
        to: email,
        subject: 'Your Cardic Nexus Secret Token',
        html: userHtml,
      }),
      ADMIN_EMAIL
        ? sendMail({
            to: ADMIN_EMAIL,
            subject: 'New Competition Signup (Pending)',
            html: adminHtml,
          })
        : Promise.resolve(),
    ]);

    return NextResponse.json({ ok: true, token, status: 'PENDING' });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Signup error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
