import { NextRequest, NextResponse } from 'next/server';

import { EmailError, sendEmail } from '@/lib/email';

export const runtime = 'nodejs';

const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60_000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const rateStore = new Map<string, { count: number; expiresAt: number }>();
const DASHBOARD_URL = 'https://cardicnex.us/dashboard';

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[
        char
      ] || char)
  );

const sanitize = (value: string, limit: number) =>
  escapeHtml(value.trim()).slice(0, limit);

const getClientIdentifier = (request: NextRequest) => {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded && forwarded.length > 0) {
    return forwarded.split(',')[0]?.trim() || 'unknown';
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp && realIp.length > 0) return realIp.trim();

  return 'unknown';
};

const takeRateLimitToken = (key: string) => {
  const now = Date.now();
  const existing = rateStore.get(key);

  if (existing && existing.expiresAt > now) {
    if (existing.count >= RATE_LIMIT_MAX) {
      return false;
    }

    existing.count += 1;
    return true;
  }

  rateStore.set(key, { count: 1, expiresAt: now + RATE_LIMIT_WINDOW_MS });
  return true;
};

const createEmailContent = (name: string, token: string) => {
  const greeting = name ? `Hi ${name},` : 'Hi there,';
  const tokenLine = token ? `Your token: ${token}` : '';

  const textLines = [
    greeting,
    '',
    'Your registration for the Cardic Nexus Tournament is confirmed.',
    `Dashboard: ${DASHBOARD_URL}`,
    "We'll review your submission and email credentials within 24 hours of approval.",
    '',
    tokenLine,
    tokenLine ? '' : undefined,
    'Stay sharp — Cardic Nexus Team',
  ].filter((line): line is string => typeof line === 'string');

  const text = textLines.join('\n');

  const html = `
    <div style="font-family:'Inter','Segoe UI',sans-serif;font-size:15px;line-height:1.7;color:#0f172a;">
      <p style="margin:0 0 16px;">${escapeHtml(greeting)}</p>
      <p style="margin:0 0 16px;">Your registration for the <strong>Cardic Nexus Tournament</strong> is confirmed.</p>
      <p style="margin:0 0 16px;">
        Dashboard: <a href="${DASHBOARD_URL}" style="color:#38bdf8;">${DASHBOARD_URL}</a>
      </p>
      <p style="margin:0 0 16px;">We'll review your submission and email credentials within 24 hours of approval.</p>
      ${
        token
          ? `<p style="margin:0 0 16px;background:#0f172a0d;border-radius:12px;padding:12px 16px;font-weight:600;letter-spacing:0.04em;">Token: ${escapeHtml(
              token
            )}</p>`
          : ''
      }
      <p style="margin:24px 0 0;">Stay sharp,</p>
      <p style="margin:4px 0 0;">Cardic Nexus Team</p>
    </div>
  `;

  return { text, html };
};

type RequestBody = {
  to?: unknown;
  name?: unknown;
  token?: unknown;
};

export async function POST(request: NextRequest) {
  const identifier = getClientIdentifier(request);
  if (!takeRateLimitToken(identifier)) {
    return NextResponse.json(
      { ok: false, error: 'Too many requests. Try again in a minute.' },
      { status: 429 }
    );
  }

  let body: RequestBody;

  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON payload.' },
      { status: 400 }
    );
  }

  const rawEmail = typeof body.to === 'string' ? body.to.trim() : '';

  if (!rawEmail) {
    return NextResponse.json(
      { ok: false, error: 'Recipient email is required.' },
      { status: 400 }
    );
  }

  if (!EMAIL_REGEX.test(rawEmail)) {
    return NextResponse.json(
      { ok: false, error: 'Please provide a valid email address.' },
      { status: 400 }
    );
  }

  const name = typeof body.name === 'string' ? sanitize(body.name, 120) : '';
  const token = typeof body.token === 'string' ? sanitize(body.token, 160) : '';

  const { text, html } = createEmailContent(name, token);

  try {
    const result = await sendEmail({
      to: rawEmail,
      subject: 'Cardic Nexus Tournament — Registration Received',
      html,
      text,
    });

    const responsePayload: Record<string, unknown> = {
      ok: true,
      to: result.to,
    };

    if (result['x-warning']) {
      responsePayload.xWarning = result['x-warning'];
    }

    return NextResponse.json(responsePayload);
  } catch (error) {
    if (error instanceof EmailError) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: error.status ?? 500 }
      );
    }

    return NextResponse.json(
      { ok: false, error: 'Unable to send email.' },
      { status: 500 }
    );
  }
}
