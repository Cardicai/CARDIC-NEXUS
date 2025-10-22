export function getEnv(name: string, alt?: string) {
  const value = process.env[name];
  if (value !== undefined) return value;
  if (alt) {
    const altValue = process.env[alt];
    if (altValue !== undefined) return altValue;
  }
  return undefined;
}

export function requireEnv(name: string, alt?: string) {
  const value = getEnv(name, alt);
  if (!value) {
    throw new Error(`Missing env: ${name}${alt ? ` (or ${alt})` : ''}`);
  }
  return value;
}

export function getFromEmail() {
  const from = getEnv('EMAIL_FROM', 'MAIL_FROM');
  if (from) return from;
  const fallback = getEnv('FROM_EMAIL');
  if (fallback) return fallback;
  throw new Error('Missing env: EMAIL_FROM (or MAIL_FROM or FROM_EMAIL)');
}

export function getResendKey() {
  return requireEnv('RESEND_API_KEY', 'RESEND_KEY');
}

export function isEmailDomainVerified() {
  return process.env.EMAIL_DOMAIN_VERIFIED === 'true';
}

export function getEmailFallback() {
  return process.env.EMAIL_FALLBACK || '';
}
