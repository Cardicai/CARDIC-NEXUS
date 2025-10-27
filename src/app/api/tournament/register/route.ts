import { NextRequest, NextResponse } from 'next/server';

import {
  findInvalidEmail,
  formatEmailList,
  parseEmailList,
} from '@/lib/email-address';
import { EmailAttachment, sendEmailWithAttachments } from '@/lib/email-extras';

export const runtime = 'nodejs';

type RegisterBody = {
  name?: unknown;
  email?: unknown;
  emails?: unknown;
  telegram?: unknown;
  country?: unknown;
};

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
  const emailInput = body.emails ?? body.email;
  const emails = parseEmailList(emailInput);
  const telegram =
    typeof body.telegram === 'string' ? body.telegram.trim() : '';
  const country = typeof body.country === 'string' ? body.country.trim() : '';

  if (!name) {
    return {
      error: NextResponse.json(
        { error: 'Full name is required.' },
        { status: 400 }
      ),
    } as const;
  }

  if (emails.length === 0) {
    return {
      error: NextResponse.json(
        { error: 'Email address is required.' },
        { status: 400 }
      ),
    } as const;
  }

  const invalidEmail = findInvalidEmail(emails);
  if (invalidEmail) {
    return {
      error: NextResponse.json(
        {
          error: `Please provide valid email addresses. “${invalidEmail}” is invalid.`,
        },
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

  if (!country) {
    return {
      error: NextResponse.json(
        { error: 'Country is required.' },
        { status: 400 }
      ),
    } as const;
  }

  return {
    name,
    emails,
    telegram,
    country,
  } as const;
};

export async function POST(request: NextRequest) {
  const parsed = await parseRequest(request);

  if ('error' in parsed) {
    return parsed.error;
  }

  const { name, emails, telegram, country } = parsed;
  const emailDisplay = formatEmailList(emails);

  const adminEmailInput = process.env.ADMIN_EMAIL;
  const adminEmails = parseEmailList(adminEmailInput);
  if (adminEmails.length === 0) {
    return NextResponse.json(
      { error: 'ADMIN_EMAIL environment variable is not set.' },
      { status: 500 }
    );
  }

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME?.trim() || 'Cardic Nexus';

  const adminText = `A new tournament registration has been submitted.\n\nName: ${name}\nEmail(s): ${emailDisplay}\nTelegram: ${telegram}\nCountry: ${country}\n`;
  const emailAnchors = emails
    .map((value) => `<a href="mailto:${value}">${value}</a>`)
    .join(', ');
  const adminHtml = `
    <h1 style="margin:0;font-size:18px;">New tournament registration</h1>
    <p style="margin:16px 0 0;font-size:14px;">
      <strong>Name:</strong> ${name}<br />
      <strong>Email(s):</strong> ${emailAnchors}<br />
      <strong>Telegram:</strong> ${telegram}<br />
      <strong>Country:</strong> ${country}
    </p>
  `;

  try {
    const adminResult = await sendEmailWithAttachments({
      to: adminEmails.length === 1 ? adminEmails[0] : adminEmails,
      subject: `New tournament registration — ${siteName}`,
      text: adminText,
      html: adminHtml,
      attachments: [] as EmailAttachment[],
    });

    if (!adminResult.ok) {
      return NextResponse.json(
        { error: 'We could not send confirmation emails.' },
        { status: 502 }
      );
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Tournament registration email error', error);
    return NextResponse.json(
      { error: 'We could not send confirmation emails.' },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true });
}
