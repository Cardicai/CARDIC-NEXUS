import { NextResponse } from 'next/server';

import { sendEmail } from '@/lib/email';

export const runtime = 'nodejs'; // force Node (Edge can break SMTP/TLS)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const to = (body?.to || '').trim();
    const name = (body?.name || '').trim();

    if (!to || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) {
      return NextResponse.json(
        { ok: false, error: 'invalid_to' },
        { status: 400 }
      );
    }

    const subject = 'Cardic Nexus Tournament — Registration Received';
    const html = `
      <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto;">
        <h2>Registration received</h2>
        <p>Hi ${name ? name : 'Trader'},</p>
        <p>Thanks for securing your slot. We’ll review and send credentials within 24 hours of approval.</p>
        <p style="margin-top:16px;color:#888">If you did not request this, you can ignore this email.</p>
      </div>
    `;

    const result = await sendEmail({ to, subject, html });
    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: 502 }
      );
    }
    return NextResponse.json({
      ok: true,
      to: result.to,
      warning: result.warning,
    });
  } catch (error: unknown) {
    // eslint-disable-next-line no-console
    console.error(
      'Email route fatal:',
      error instanceof Error ? error.message : error
    );
    return NextResponse.json(
      { ok: false, error: 'server_error' },
      { status: 500 }
    );
  }
}

// Optional CORS preflight if posting from a different origin
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
