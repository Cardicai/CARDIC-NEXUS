import { NextRequest, NextResponse } from 'next/server';

import { sendMail } from '@/lib/mailer';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json().catch(() => null)) as Partial<{
      to: unknown;
      subject: unknown;
      html: unknown;
    }> | null;

    if (!payload || typeof payload !== 'object') {
      return NextResponse.json(
        { ok: false, error: 'Invalid request payload' },
        { status: 400 }
      );
    }

    const { to, subject, html } = payload;

    if (
      typeof to !== 'string' ||
      typeof subject !== 'string' ||
      typeof html !== 'string' ||
      !to.trim() ||
      !subject.trim() ||
      !html.trim()
    ) {
      return NextResponse.json(
        { ok: false, error: 'Missing to, subject, or html' },
        { status: 400 }
      );
    }

    await sendMail({ to: to.trim(), subject: subject.trim(), html });

    return NextResponse.json({ ok: true, message: 'Email sent successfully' });
  } catch (error: unknown) {
    // eslint-disable-next-line no-console
    console.error('Email dispatch failed', error);
    const message =
      error instanceof Error ? error.message : 'Unable to send email';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(
    {
      ok: false,
      error: 'Method not allowed',
    },
    { status: 405 }
  );
}
