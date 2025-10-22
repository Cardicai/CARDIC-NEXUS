import { Resend } from 'resend';

export class EmailError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'EmailError';
    this.status = status;
  }
}

export type EmailAttachment = {
  filename: string;
  content: string;
  contentType?: string;
  mimeType?: string;
};

type NormalizedAddress = {
  formatted: string;
  email: string;
};

export type SendEmailOptions = {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  attachments?: EmailAttachment[];
  replyTo?: string | string[];
  headers?: Record<string, string>;
};

export type SendEmailResult = {
  to: string | string[];
  data: unknown;
  'x-warning'?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const HTML_ESCAPE_LOOKUP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => HTML_ESCAPE_LOOKUP[char]);

const parseAddress = (value: string): NormalizedAddress => {
  const trimmed = value.trim();
  const match = trimmed.match(/<([^<>]+)>$/);
  const email = (match ? match[1] : trimmed).trim();

  return {
    formatted: trimmed,
    email,
  };
};

const normalizeAddresses = (value?: string | string[]): NormalizedAddress[] => {
  if (!value) return [];

  const list = Array.isArray(value) ? value : [value];
  const deduped = new Map<string, NormalizedAddress>();

  for (const candidate of list) {
    if (!candidate) continue;
    const parsed = parseAddress(candidate);
    if (!parsed.email) continue;

    const lower = parsed.email.toLowerCase();
    if (!deduped.has(lower)) {
      deduped.set(lower, parsed);
    }
  }

  return Array.from(deduped.values());
};

const isValidEmail = (value: string) => EMAIL_REGEX.test(value);

let cachedClient: Resend | null = null;
let cachedKey = '';

const getClient = (apiKey: string) => {
  if (!cachedClient || cachedKey !== apiKey) {
    cachedClient = new Resend(apiKey);
    cachedKey = apiKey;
  }

  return cachedClient;
};

const getFromAddress = (): {
  formatted: string;
  email: string;
  domain: string;
} => {
  const rawFrom = process.env.EMAIL_FROM?.trim();

  if (!rawFrom) {
    throw new EmailError('EMAIL_FROM environment variable is not set.');
  }

  const parsed = parseAddress(rawFrom);

  if (!parsed.email || !isValidEmail(parsed.email)) {
    throw new EmailError('EMAIL_FROM must contain a valid email address.');
  }

  const domain = parsed.email.split('@')[1]?.toLowerCase();

  if (!domain) {
    throw new EmailError('EMAIL_FROM is missing an email domain.');
  }

  return { formatted: parsed.formatted, email: parsed.email, domain };
};

const getFallbackAddress = (): NormalizedAddress | null => {
  const fallbackRaw = process.env.EMAIL_FALLBACK?.trim();
  if (!fallbackRaw) return null;

  const parsed = parseAddress(fallbackRaw);

  if (!parsed.email || !isValidEmail(parsed.email)) {
    throw new EmailError('EMAIL_FALLBACK must contain a valid email address.');
  }

  return parsed;
};

const isDomainVerified = () =>
  (process.env.EMAIL_DOMAIN_VERIFIED || '').trim().toLowerCase() === 'true';

const normalizeReplyTo = (
  value: string | string[] | undefined,
  fromDomain: string
): string | string[] | undefined => {
  const addresses = normalizeAddresses(value);
  if (!addresses.length) return undefined;

  for (const address of addresses) {
    if (!isValidEmail(address.email)) {
      throw new EmailError(`Invalid reply-to email: ${address.email}`);
    }

    const replyDomain = address.email.split('@')[1]?.toLowerCase();
    if (replyDomain !== fromDomain) {
      throw new EmailError(
        'EMAIL_REPLY_TO must use the same domain as EMAIL_FROM.'
      );
    }
  }

  return addresses.length === 1
    ? addresses[0].formatted
    : addresses.map((item) => item.formatted);
};

export function plainTextToHtml(text: string): string {
  const escaped = escapeHtml(text);
  return `
    <pre style="margin:0;font-family:'SFMono-Regular',Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace;font-size:14px;line-height:1.6;background:#0f172a0d;padding:16px;border-radius:12px;color:#0f172a;white-space:pre-wrap;">
${escaped}
    </pre>
  `;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  attachments,
  replyTo,
  headers,
}: SendEmailOptions): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    throw new EmailError('RESEND_API_KEY environment variable is not set.');
  }

  const from = getFromAddress();
  const recipients = normalizeAddresses(to);

  if (!recipients.length) {
    throw new EmailError('No recipient email addresses provided.');
  }

  for (const recipient of recipients) {
    if (!isValidEmail(recipient.email)) {
      throw new EmailError(`Invalid recipient email: ${recipient.email}`);
    }
  }

  const fallback = getFallbackAddress();
  const domainVerified = isDomainVerified();
  let finalRecipients = recipients;
  let warning: string | undefined;

  if (!domainVerified) {
    if (!fallback) {
      throw new EmailError(
        'Email domain not verified. Configure EMAIL_FALLBACK or set EMAIL_DOMAIN_VERIFIED to true.'
      );
    }

    const fallbackLower = fallback.email.toLowerCase();
    const requiresRedirect =
      recipients.length !== 1 ||
      recipients[0].email.toLowerCase() !== fallbackLower;

    if (requiresRedirect) {
      finalRecipients = [fallback];
      warning = `Domain not verified. Email redirected to fallback ${fallback.email}.`;
    } else {
      finalRecipients = [fallback];
    }
  }

  const replyToValue = normalizeReplyTo(
    replyTo ?? process.env.EMAIL_REPLY_TO,
    from.domain
  );

  const htmlContent = html ?? (text ? plainTextToHtml(text) : undefined);

  if (!htmlContent) {
    throw new EmailError('Email HTML content is required.');
  }

  const resend = getClient(apiKey);

  const { data, error } = await resend.emails.send({
    from: from.formatted,
    to:
      finalRecipients.length === 1
        ? finalRecipients[0].formatted
        : finalRecipients.map((item) => item.formatted),
    subject,
    html: htmlContent,
    ...(text ? { text } : {}),
    ...(replyToValue ? { reply_to: replyToValue } : {}),
    ...(headers ? { headers } : {}),
    ...(attachments && attachments.length
      ? {
          attachments: attachments.map((attachment) => ({
            filename: attachment.filename,
            content: attachment.content,
            contentType: attachment.contentType ?? attachment.mimeType,
          })),
        }
      : {}),
  });

  if (error) {
    throw new EmailError(
      error.message || 'Failed to send email via Resend.',
      error.message?.toLowerCase().includes('rate') ? 429 : undefined
    );
  }

  const response: SendEmailResult = {
    data: data ?? null,
    to:
      finalRecipients.length === 1
        ? finalRecipients[0].formatted
        : finalRecipients.map((item) => item.formatted),
  };

  if (warning) {
    response['x-warning'] = warning;
  }

  return response;
}
