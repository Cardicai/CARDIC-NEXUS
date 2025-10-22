const RESEND_ENDPOINT = 'https://api.resend.com/emails';

type SendArgs = {
  from: string;
  to: string | string[];
  subject: string;
  html: string;
};

type SendResult = { data?: unknown; error?: { message?: string } | null };

async function postEmail(
  apiKey: string,
  payload: SendArgs
): Promise<SendResult> {
  const res = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const message = await res.text().catch(() => undefined);
    return { error: { message: message || res.statusText } };
  }

  const data = await res.json().catch(() => undefined);
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
