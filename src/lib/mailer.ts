import { Resend } from 'resend';

export type MailPayload = { to: string; subject: string; html: string };

export async function sendMail({ to, subject, html }: MailPayload) {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('Missing RESEND_API_KEY');
  const resend = new Resend(key);
  const from = process.env.MAIL_FROM || 'Cardic Nexus <no-reply@resend.dev>';
  const { error } = await resend.emails.send({ from, to, subject, html });
  if (error) throw new Error(error.message || 'Resend send error');
}
