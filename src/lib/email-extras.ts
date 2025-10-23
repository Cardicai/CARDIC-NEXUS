import { Resend } from 'resend';

import {
  getEmailFallback,
  getFromEmail,
  getResendKey,
  isEmailDomainVerified,
} from '@/lib/env';

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

export async function sendEmailWithAttachments(opts: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  attachments?: EmailAttachment[];
}) {
  const resend = new Resend(getResendKey());
  const from = getFromEmail();
  const verified = isEmailDomainVerified();
  const fallback = getEmailFallback();
  const replyTo = process.env.EMAIL_REPLY_TO || undefined;

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
    reply_to: replyTo,
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
