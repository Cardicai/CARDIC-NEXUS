import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const FALLBACK_FROM = 'onboarding@resend.dev';

type ClaimTrialBody = {
  tradingview?: unknown;
  email?: unknown;
};

type ResendPayload = {
  to: string | string[];
  subject: string;
  text: string;
  html: string;
};

const isGmail = (value: string) => /@gmail\.com$/i.test(value);

const parseRequest = async (request: NextRequest) => {
  let body: ClaimTrialBody;

  try {
    body = await request.json();
  } catch (error) {
    return {
      error: NextResponse.json(
        { error: 'Invalid JSON payload. Please send a JSON body.' },
        { status: 400 }
      ),
    } as const;
  }

  const tradingviewRaw =
    typeof body.tradingview === 'string' ? body.tradingview.trim() : '';
  const emailRaw = typeof body.email === 'string' ? body.email.trim() : '';

  if (!tradingviewRaw) {
    return {
      error: NextResponse.json(
        { error: 'TradingView username is required.' },
        { status: 400 }
      ),
    } as const;
  }

  if (!emailRaw) {
    return {
      error: NextResponse.json(
        { error: 'Gmail address is required.' },
        { status: 400 }
      ),
    } as const;
  }

  if (!isGmail(emailRaw)) {
    return {
      error: NextResponse.json(
        { error: 'Please provide a valid gmail.com address.' },
        { status: 400 }
      ),
    } as const;
  }

  return {
    tradingview: tradingviewRaw,
    email: emailRaw,
  } as const;
};

const sendEmailWithFallback = async (
  payload: ResendPayload,
  apiKey: string,
  fromCandidates: string[]
) => {
  let lastErrorMessage = 'Failed to send email via Resend.';

  for (let index = 0; index < fromCandidates.length; index += 1) {
    const from = fromCandidates[index];
    const response = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from,
        ...payload,
      }),
    });

    if (response.ok) {
      return;
    }

    const errorJson = await response.json().catch(() => null);
    const message =
      (typeof errorJson === 'object' && errorJson && 'message' in errorJson
        ? String((errorJson as { message?: unknown }).message ?? '')
        : '') ||
      (typeof errorJson === 'object' && errorJson && 'error' in errorJson
        ? String((errorJson as { error?: unknown }).error ?? '')
        : '') ||
      (await response.text().catch(() => '')) ||
      'Failed to send email.';

    lastErrorMessage = message;

    const lowerMessage = message.toLowerCase();
    const shouldFallback =
      fromCandidates.length > index + 1 &&
      from !== FALLBACK_FROM &&
      (lowerMessage.includes('domain') ||
        lowerMessage.includes('verify') ||
        lowerMessage.includes('dkim'));

    if (shouldFallback) {
      continue;
    }

    throw new Error(message);
  }

  throw new Error(lastErrorMessage);
};

export async function POST(request: NextRequest) {
  const parsed = await parseRequest(request);

  if ('error' in parsed) {
    return parsed.error;
  }

  const { tradingview, email } = parsed;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'RESEND_API_KEY environment variable is not set.' },
      { status: 500 }
    );
  }

  const adminEmail = process.env.ADMIN_EMAIL?.trim();
  if (!adminEmail) {
    return NextResponse.json(
      { error: 'ADMIN_EMAIL environment variable is not set.' },
      { status: 500 }
    );
  }

  const providedFrom = process.env.FROM_EMAIL?.trim();
  const fromCandidates =
    providedFrom && providedFrom.length > 0
      ? Array.from(new Set([providedFrom, FALLBACK_FROM]))
      : [FALLBACK_FROM];
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME?.trim() || 'CARDIC Nexus';

  const adminPayload: ResendPayload = {
    to: adminEmail,
    subject: `New free trial request – ${siteName}`,
    text: `A new free trial was requested.\n\nTradingView username: ${tradingview}\nEmail: ${email}\n`,
    html: `
      <h1 style="margin:0;font-size:18px;">New free trial request</h1>
      <p style="margin:16px 0 0;font-size:14px;">
        <strong>TradingView username:</strong> ${tradingview}<br />
        <strong>Email:</strong> ${email}
      </p>
    `,
  };

  const userPayload: ResendPayload = {
    to: email,
    subject: `${siteName} Free Trial Request Received`,
    text: `Thanks for reaching out to ${siteName}. We received your free trial request and will be in touch shortly.\n\nTradingView username: ${tradingview}\nEmail: ${email}\n`,
    html: `
      <div style="font-size:15px;line-height:1.6;">
        <p>Hey ${tradingview},</p>
        <p>
          Thanks for requesting a free trial with <strong>${siteName}</strong>. Our team will review your details and send your
          access instructions to this Gmail address shortly.
        </p>
        <p style="margin:16px 0 0;font-size:14px;">
          <strong>TradingView username:</strong> ${tradingview}<br />
          <strong>Email:</strong> ${email}
        </p>
        <p style="margin:24px 0 0;">Stay tuned — we&apos;ll reach out soon!</p>
      </div>
    `,
  };

  try {
    await sendEmailWithFallback(adminPayload, apiKey, fromCandidates);
    await sendEmailWithFallback(userPayload, apiKey, fromCandidates);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'We could not send confirmation emails.';
    return NextResponse.json({ error: message }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
