import { Resend } from 'resend';

function requireEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  const RESEND_API_KEY = requireEnv('RESEND_API_KEY');
  const EMAIL_FROM = requireEnv('EMAIL_FROM');
  const EMAIL_DOMAIN_VERIFIED = process.env.EMAIL_DOMAIN_VERIFIED === 'true';
  const EMAIL_FALLBACK = process.env.EMAIL_FALLBACK || '';
  const EMAIL_REPLY_TO = process.env.EMAIL_REPLY_TO || undefined;

  const resend = new Resend(RESEND_API_KEY);

  let finalTo = opts.to;
  let warning: string | undefined;
  if (!EMAIL_DOMAIN_VERIFIED && EMAIL_FALLBACK) {
    finalTo = EMAIL_FALLBACK;
    warning = 'Domain not verified; sent to fallback inbox.';
  }

  const { error } = await resend.emails.send({
    from: EMAIL_FROM,
    to: finalTo,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
    reply_to: EMAIL_REPLY_TO,
  });

  if (error) {
    // Make error obvious in logs; upstream will return JSON not throw opaque network error
    // eslint-disable-next-line no-console
    console.error('Resend send error:', error);
    return { ok: false as const, error: 'send_failed' as const };
  }

  return { ok: true as const, to: finalTo, warning };
}
