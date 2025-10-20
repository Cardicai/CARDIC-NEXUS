const RESEND_ENDPOINT = 'https://api.resend.com/emails';

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
};

export type SendEmailOptions = {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  attachments?: EmailAttachment[];
};

export async function sendEmail({
  to,
  subject,
  text,
  html,
  attachments,
}: SendEmailOptions) {
  const from = process.env.FROM_EMAIL;
  const apiKey = process.env.RESEND_API_KEY;
  if (!from) {
    throw new EmailError('Missing FROM_EMAIL environment variable');
  }

  if (!apiKey) {
    throw new EmailError('Missing RESEND_API_KEY environment variable');
  }

  const res = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      text,
      ...(html ? { html } : {}),
      ...(attachments?.length ? { attachments } : {}),
    }),
  });

  if (res.status === 429) {
    throw new EmailError('Rate limited', 429);
  }

  if (!res.ok) {
    const message = await res.text().catch(() => 'Failed to send email');
    throw new EmailError(message || 'Failed to send email', res.status);
  }
}
