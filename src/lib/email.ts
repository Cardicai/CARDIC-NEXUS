import { Resend } from 'resend';

import {
  getEmailFallback,
  getFromEmail,
  getResendKey,
  isEmailDomainVerified,
} from '@/lib/env';

export async function sendEmail(opts: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
}) {
  const resend = new Resend(getResendKey());
  const from = getFromEmail();
  const verified = isEmailDomainVerified();
  const fallback = getEmailFallback();

  let finalTo: string | string[] = opts.to;
  let warning: string | undefined;
  if (!verified && fallback) {
    finalTo = fallback;
    warning = 'Domain not verified; sent to fallback inbox.';
  }

  const { error } = await resend.emails.send({
    from,
    to: finalTo,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
    reply_to: process.env.EMAIL_REPLY_TO || undefined,
  });

  if (error) {
    // Make error obvious in logs; upstream will return JSON not throw opaque network error
    // eslint-disable-next-line no-console
    console.error('Resend send error:', error);
    return { ok: false as const, error: 'send_failed' as const };
  }

  return { ok: true as const, to: finalTo, warning };
}
