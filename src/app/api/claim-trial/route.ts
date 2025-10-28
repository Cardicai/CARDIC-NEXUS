import { NextRequest, NextResponse } from 'next/server';

import { sendEmail } from '@/lib/email';

export const runtime = 'nodejs';

type ClaimTrialBody = {
  name?: unknown;
  tradingview?: unknown;
  email?: unknown;
  indicators?: unknown;
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

  const nameRaw = typeof body.name === 'string' ? body.name.trim() : '';
  const tradingviewRaw =
    typeof body.tradingview === 'string' ? body.tradingview.trim() : '';
  const emailRaw = typeof body.email === 'string' ? body.email.trim() : '';
  const indicatorsRaw = Array.isArray(body.indicators)
    ? body.indicators
        .map((value) => (typeof value === 'string' ? value.trim() : ''))
        .filter((value) => value.length > 0)
    : [];

  if (!nameRaw) {
    return {
      error: NextResponse.json(
        { error: 'Full name is required.' },
        { status: 400 }
      ),
    } as const;
  }

  if (!tradingviewRaw) {
    return {
      error: NextResponse.json(
        { error: 'TradingView username is required.' },
        { status: 400 }
      ),
    } as const;
  }

  if (!indicatorsRaw.length) {
    return {
      error: NextResponse.json(
        { error: 'Select at least one indicator.' },
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
    name: nameRaw,
    tradingview: tradingviewRaw,
    email: emailRaw,
    indicators: indicatorsRaw,
  } as const;
};

export async function POST(request: NextRequest) {
  const parsed = await parseRequest(request);

  if ('error' in parsed) {
    return parsed.error;
  }

  const { name, tradingview, email, indicators } = parsed;

  const adminEmail = process.env.ADMIN_EMAIL?.trim();
  if (!adminEmail) {
    return NextResponse.json(
      { error: 'ADMIN_EMAIL environment variable is not set.' },
      { status: 500 }
    );
  }

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME?.trim() || 'CARDIC Nexus';

  const adminSubject = `7-day free trial claimed — ${siteName}`;
  const adminText = `A new 7-day free trial was claimed.\n\nName: ${name}\nTradingView username: ${tradingview}\nEmail: ${email}\nIndicators: ${indicators.join(
    ', '
  )}\n`;
  const adminHtml = `
    <h1 style="margin:0;font-size:18px;">New 7-day free trial claim</h1>
    <p style="margin:16px 0 0;font-size:14px;">
      <strong>Name:</strong> ${escapeHtml(name)}<br />
      <strong>TradingView username:</strong> ${escapeHtml(tradingview)}<br />
      <strong>Email:</strong> ${escapeHtml(email)}<br />
      <strong>Indicators:</strong> ${indicators
        .map((indicator) => escapeHtml(indicator))
        .join(', ')}
    </p>
  `;

  const userSubject = `${siteName} 7-day trial confirmed`;
  const userText = `Thanks for reaching out to ${siteName}. Your 7-day free trial claim is locked in — we will send setup details shortly.\n\nName: ${name}\nTradingView username: ${tradingview}\nEmail: ${email}\nIndicators: ${indicators.join(
    ', '
  )}\n`;
  const userHtml = `
    <div style="font-size:15px;line-height:1.6;">
      <p>Hey ${escapeHtml(name)},</p>
      <p>
        Thanks for claiming a 7-day free trial with <strong>${escapeHtml(
          siteName
        )}</strong>. Our team will review your details and send your access instructions to this Gmail address shortly.
      </p>
      <p style="margin:16px 0 0;font-size:14px;">
        <strong>Name:</strong> ${escapeHtml(name)}<br />
        <strong>TradingView username:</strong> ${escapeHtml(tradingview)}<br />
        <strong>Email:</strong> ${escapeHtml(email)}<br />
        <strong>Indicators:</strong> ${indicators
          .map((indicator) => escapeHtml(indicator))
          .join(', ')}
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
