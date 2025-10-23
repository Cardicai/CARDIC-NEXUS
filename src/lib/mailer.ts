import { sendEmail } from '@/lib/email';

export type MailPayload = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
};

export async function sendMail({ to, subject, html, text }: MailPayload) {
  const result = await sendEmail({ to, subject, html, text });
  if (!result.ok) {
    throw new Error(result.error || 'send_failed');
  }
  return result;
}
