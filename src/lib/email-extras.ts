import { Resend } from 'resend';

export type EmailAttachment = {
  filename: string;
  content: string;
  contentType?: string;
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case "'":
        return '&#39;';
      default:
        return char;
    }
  });
}

export function plainTextToHtml(text: string) {
  const escaped = escapeHtml(text);
  return `
    <pre style="margin:0;font-family:'SFMono-Regular',Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace;font-size:14px;line-height:1.6;background:#0f172a0d;padding:16px;border-radius:12px;color:#0f172a;white-space:pre-wrap;">${escaped}</pre>
  `;
}

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env: ${name}`);
  return value;
}

export async function sendEmailWithAttachments(opts: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: EmailAttachment[];
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
    attachments: opts.attachments?.map((attachment) => ({
      filename: attachment.filename,
      content: attachment.content,
      type: attachment.contentType,
    })),
  });

  if (error) {
    // eslint-disable-next-line no-console
    console.error('Resend send error:', error);
    return { ok: false as const, error: 'send_failed' as const };
  }

  return { ok: true as const, to: finalTo, warning };
}
