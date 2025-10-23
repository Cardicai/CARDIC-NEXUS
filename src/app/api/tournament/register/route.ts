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
  proof?: unknown;
  screenshot?: unknown;
};

type ParsedScreenshot = {
  name: string;
  type: string;
  base64: string;
  size: number;
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
  const proof = typeof body.proof === 'string' ? body.proof.trim() : '';
  const screenshotRaw = body.screenshot;

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

  const parsedScreenshot = parseScreenshot(screenshotRaw);
  if ('error' in parsedScreenshot) {
    return parsedScreenshot;
  }

  return {
    name,
    emails,
    telegram,
    country,
    proof,
    screenshot: parsedScreenshot.screenshot,
  } as const;
};

const MAX_SCREENSHOT_SIZE = 5 * 1024 * 1024; // 5MB
const BASE64_REGEX = /^[A-Za-z0-9+/=]+$/;
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/heic',
  'image/heif',
  'image/svg+xml',
]);

const parseScreenshot = (
  screenshot: unknown
): { screenshot: ParsedScreenshot } | { error: NextResponse } => {
  if (!screenshot || typeof screenshot !== 'object') {
    return {
      error: NextResponse.json(
        {
          error:
            'Screenshot proof is required. Please upload an image that demonstrates the social follow.',
        },
        { status: 400 }
      ),
    };
  }

  const maybeRecord = screenshot as Record<string, unknown>;
  const name =
    typeof maybeRecord.name === 'string' ? maybeRecord.name.trim() : '';
  const type =
    typeof maybeRecord.type === 'string' ? maybeRecord.type.trim() : '';
  const sizeValue = maybeRecord.size;
  const size =
    typeof sizeValue === 'number' && Number.isFinite(sizeValue)
      ? sizeValue
      : typeof sizeValue === 'string'
      ? Number.parseInt(sizeValue, 10)
      : 0;
  const base64 =
    typeof maybeRecord.base64 === 'string' ? maybeRecord.base64.trim() : '';

  if (!name || !base64) {
    return {
      error: NextResponse.json(
        {
          error:
            'Screenshot proof is required. Include the image file when submitting the form.',
        },
        { status: 400 }
      ),
    };
  }

  if (size <= 0 || size > MAX_SCREENSHOT_SIZE) {
    return {
      error: NextResponse.json(
        {
          error: 'Screenshot proof must be 5MB or smaller.',
        },
        { status: 400 }
      ),
    };
  }

  if (type && !ALLOWED_MIME_TYPES.has(type)) {
    return {
      error: NextResponse.json(
        {
          error:
            'Unsupported screenshot format. Please upload a JPG, PNG, WEBP, GIF, HEIC, HEIF, or SVG file.',
        },
        { status: 400 }
      ),
    };
  }

  if (!BASE64_REGEX.test(base64)) {
    return {
      error: NextResponse.json(
        {
          error:
            'Screenshot proof is invalid. Please try uploading the file again.',
        },
        { status: 400 }
      ),
    };
  }

  const parsed: ParsedScreenshot = {
    name,
    type: type || 'application/octet-stream',
    base64,
    size,
  };

  return { screenshot: parsed };
};

export async function POST(request: NextRequest) {
  const parsed = await parseRequest(request);

  if ('error' in parsed) {
    return parsed.error;
  }

  const { name, emails, telegram, country, proof, screenshot } = parsed;
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

  const adminAttachments: EmailAttachment[] = [
    {
      filename: screenshot.name,
      content: screenshot.base64,
      contentType: screenshot.type,
    },
  ];

  const adminText = `A new tournament registration has been submitted.\n\nName: ${name}\nEmail(s): ${emailDisplay}\nTelegram: ${telegram}\nCountry: ${country}\nProof (links/details): ${proof}\nScreenshot: ${screenshot.name}\n`;
  const emailAnchors = emails
    .map((value) => `<a href="mailto:${value}">${value}</a>`)
    .join(', ');
  const adminHtml = `
    <h1 style="margin:0;font-size:18px;">New tournament registration</h1>
    <p style="margin:16px 0 0;font-size:14px;">
      <strong>Name:</strong> ${name}<br />
      <strong>Email(s):</strong> ${emailAnchors}<br />
      <strong>Telegram:</strong> ${telegram}<br />
      <strong>Country:</strong> ${country}<br />
      <strong>Proof (links/details):</strong> ${proof}<br />
      <strong>Screenshot:</strong> ${screenshot.name}
    </p>
  `;

  try {
    const adminResult = await sendEmailWithAttachments({
      to: adminEmails.length === 1 ? adminEmails[0] : adminEmails,
      subject: `New tournament registration — ${siteName}`,
      text: adminText,
      html: adminHtml,
      attachments: adminAttachments,
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
