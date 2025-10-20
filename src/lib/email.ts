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
};

export type SendEmailOptions = {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  attachments?: EmailAttachment[];
};

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new EmailError('Missing RESEND_API_KEY environment variable');
  }
  return new Resend(apiKey);
}

export async function sendEmail({
  to,
  subject,
  text,
  html,
  attachments,
}: SendEmailOptions) {
  const from = process.env.FROM_EMAIL;
  if (!from) {
    throw new EmailError('Missing FROM_EMAIL environment variable');
  }

  const resend = getResendClient();

  const response = await resend.emails.send({
    from,
    to,
    subject,
    text,
    ...(html ? { html } : {}),
    ...(attachments?.length ? { attachments } : {}),
  });

  if ('error' in response && response.error) {
    throw new EmailError(response.error.message, response.error.statusCode);
  }
}
