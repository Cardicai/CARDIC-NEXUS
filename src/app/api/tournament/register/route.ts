import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const FALLBACK_FROM = 'onboarding@resend.dev';

type RegisterBody = {
  name?: unknown;
  email?: unknown;
  telegram?: unknown;
  proof?: unknown;
};

type ResendPayload = {
  to: string | string[];
  subject: string;
  text: string;
  html: string;
};

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const parseRequest = async (request: NextRequest) => {
  let body: RegisterBody;

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

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const telegram =
    typeof body.telegram === 'string' ? body.telegram.trim() : '';
  const proof = typeof body.proof === 'string' ? body.proof.trim() : '';

  if (!name) {
    return {
      error: NextResponse.json(
        { error: 'Full name is required.' },
        { status: 400 }
      ),
    } as const;
  }

  if (!email) {
    return {
      error: NextResponse.json(
        { error: 'Email address is required.' },
        { status: 400 }
      ),
    } as const;
  }

  if (!isValidEmail(email)) {
    return {
      error: NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      ),
    } as const;
  }

  if (!telegram) {
    return {
      error: NextResponse.json(
        { error: 'Telegram handle is required.' },
        { status: 400 }
      ),
    } as const;
  }

  if (!proof) {
    return {
      error: NextResponse.json(
        {
          error:
            'Proof of following at least two Cardic Nexus social pages is required.',
        },
        { status: 400 }
      ),
    } as const;
  }

  return { name, email, telegram, proof } as const;
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

  const { name, email, telegram, proof } = parsed;

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

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME?.trim() || 'Cardic Nexus';
  const dashboardUrl = 'https://cardicnex.us/dashboard';

  const adminPayload: ResendPayload = {
    to: adminEmail,
    subject: `New tournament registration — ${siteName}`,
    text: `A new tournament registration has been submitted.\n\nName: ${name}\nEmail: ${email}\nTelegram: ${telegram}\nProof: ${proof}\n`,
    html: `
      <h1 style="margin:0;font-size:18px;">New tournament registration</h1>
      <p style="margin:16px 0 0;font-size:14px;">
        <strong>Name:</strong> ${name}<br />
        <strong>Email:</strong> <a href="mailto:${email}">${email}</a><br />
        <strong>Telegram:</strong> ${telegram}<br />
        <strong>Proof:</strong> ${proof}
      </p>
    `,
  };

  const userPayload: ResendPayload = {
    to: email,
    subject: 'Cardic Nexus Tournament Registration Confirmed',
    text: `Hi ${name}, your registration for the Cardic Nexus Tournament is confirmed.\n\nLogin dashboard: ${dashboardUrl}\n\nYour credentials will arrive in a separate mail within 24 hours.`,
    html: `
      <div style="font-size:15px;line-height:1.7;">
        <p>Hi ${name},</p>
        <p>Your registration for the <strong>Cardic Nexus Tournament</strong> is confirmed.</p>
        <p>
          Login dashboard: <a href="${dashboardUrl}" style="color:#38bdf8;">${dashboardUrl}</a>
        </p>
        <p>Your credentials will arrive in a separate mail within 24 hours.</p>
        <p style="margin-top:24px;">Stay sharp — we&apos;ll see you on the leaderboard.</p>
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
