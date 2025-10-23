'use client';

export async function submitRegistration(data: {
  emails: string[];
  name?: string;
}) {
  const recipients = data.emails.filter((email) => email);
  if (recipients.length === 0) {
    return { ok: false as const, error: 'missing_recipients' };
  }
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 15000);
  try {
    const res = await fetch('/api/email/registration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: recipients.length === 1 ? recipients[0] : recipients,
        name: data.name,
      }),
      signal: ctrl.signal,
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json?.ok)
      throw new Error(json?.error || `http_${res.status}`);
    return { ok: true as const, warning: json.warning as string | undefined };
  } catch (error: unknown) {
    const message =
      error instanceof Error && error.message ? error.message : 'network_error';
    return { ok: false as const, error: message };
  } finally {
    clearTimeout(t);
  }
}
