import { sendEmail } from '@/lib/email';

export type MailPayload = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendMail({ to, subject, html, text }: MailPayload) {
  await sendEmail({ to, subject, html, text });
}
