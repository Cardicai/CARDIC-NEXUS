const RESEND_ENDPOINT = 'https://api.resend.com/emails';

type EmailAddress = string | string[];

type Attachment = {
  filename: string;
  content: string;
  contentType?: string;
  mimeType?: string;
};

type SendArgs = {
  from: string;
  to: EmailAddress;
  subject: string;
  html?: string;
  text?: string;
  reply_to?: EmailAddress;
  cc?: EmailAddress;
  bcc?: EmailAddress;
  headers?: Record<string, string>;
  attachments?: Attachment[];
};

type SendResult = {
  data?: unknown;
  error?: { message?: string } | null;
};

const pruneUndefined = <T extends Record<string, unknown>>(input: T): T => {
  const entries = Object.entries(input).filter(([, value]) =>
    Array.isArray(value)
      ? value.length > 0
      : value !== undefined && value !== null && value !== ''
  );

  return Object.fromEntries(entries) as T;
};

async function postEmail(
  apiKey: string,
  payload: SendArgs
): Promise<SendResult> {
  const filteredPayload = pruneUndefined({
    ...payload,
    attachments: payload.attachments?.map((attachment) =>
      pruneUndefined({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType ?? attachment.mimeType,
      })
    ),
  });

  const response = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(filteredPayload),
  });

  if (!response.ok) {
    let message: string | undefined;

    try {
      const json = (await response.json()) as
        | { message?: unknown; error?: unknown }
        | undefined
        | null;
      if (json) {
        if (typeof json.message === 'string' && json.message.length > 0) {
          message = json.message;
        } else if (typeof json.error === 'string' && json.error.length > 0) {
          message = json.error;
        }
      }
    } catch {
      // ignore JSON parse issues and fallback to text
    }

    if (!message) {
      message = await response.text().catch(() => undefined);
    }

    return {
      error: {
        message: message || response.statusText,
      },
    };
  }

  const data = await response.json().catch(() => undefined);
  return { data };
}

export class Resend {
  private readonly apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey) throw new Error('Missing RESEND_API_KEY');
    this.apiKey = apiKey;
  }

  emails = {
    send: (payload: SendArgs) => postEmail(this.apiKey, payload),
  };
}

export type ResendEmailPayload = SendArgs;
export type ResendSendResult = SendResult;
