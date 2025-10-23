import { NextRequest, NextResponse } from 'next/server';

import { sendEmail } from '@/lib/email';

export const runtime = 'nodejs';

type ClaimTrialBody = {
  tradingview?: unknown;
  email?: unknown;
};

const isGmail = (value: string) => /@gmail\.com$/i.test(value);

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[
        char
      ] || char)
  );

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

export async function POST(request: NextRequest) {
  const parsed = await parseRequest(request);

  if ('error' in parsed) {
    return parsed.error;
  }

  const { tradingview, email } = parsed;

  const adminEmail = process.env.ADMIN_EMAIL?.trim();
  if (!adminEmail) {
    return NextResponse.json(
      { error: 'ADMIN_EMAIL environment variable is not set.' },
      { status: 500 }
    );
  }

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME?.trim() || 'CARDIC Nexus';

  const adminSubject = `New free trial request – ${siteName}`;
  const adminText = `A new free trial was requested.\n\nTradingView username: ${tradingview}\nEmail: ${email}\n`;
  const adminHtml = `
    <h1 style="margin:0;font-size:18px;">New free trial request</h1>
    <p style="margin:16px 0 0;font-size:14px;">
      <strong>TradingView username:</strong> ${escapeHtml(tradingview)}<br />
      <strong>Email:</strong> ${escapeHtml(email)}
    </p>
  `;

  const userSubject = `${siteName} Free Trial Request Received`;
  const userText = `Thanks for reaching out to ${siteName}. We received your free trial request and will be in touch shortly.\n\nTradingView username: ${tradingview}\nEmail: ${email}\n`;
  const userHtml = `
    <div style="font-size:15px;line-height:1.6;">
      <p>Hey ${escapeHtml(tradingview)},</p>
      <p>
        Thanks for requesting a free trial with <strong>${escapeHtml(
          siteName
        )}</strong>. Our team will review your details and send your access instructions to this Gmail address shortly.
      </p>
      <p style="margin:16px 0 0;font-size:14px;">
        <strong>TradingView username:</strong> ${escapeHtml(tradingview)}<br />
        <strong>Email:</strong> ${escapeHtml(email)}
      </p>
      <p style="margin:24px 0 0;">Stay tuned — we&apos;ll reach out soon!</p>
    </div>
  `;

  try {
    const adminResult = await sendEmail({
      to: adminEmail,
      subject: adminSubject,
      text: adminText,
      html: adminHtml,
    });
    if (!adminResult.ok) {
      return NextResponse.json(
        { error: 'We could not send confirmation emails.' },
        { status: 502 }
      );
    }

    const userResult = await sendEmail({
      to: email,
      subject: userSubject,
      text: userText,
      html: userHtml,
    });
    if (!userResult.ok) {
      return NextResponse.json(
        { error: 'We could not send confirmation emails.' },
        { status: 502 }
      );
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Claim trial email error', error);
    return NextResponse.json(
      { error: 'We could not send confirmation emails.' },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true });
}
