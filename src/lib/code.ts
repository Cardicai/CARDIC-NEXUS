export function sanitizeName(name: string): string {
  return name.replace(/\s+/g, ' ').trim().slice(0, 80);
}

export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function toAlpha3(name: string): string {
  const cleaned = name.replace(/[^a-zA-Z]/g, '').toUpperCase();
  return (cleaned + 'XXX').slice(0, 3);
}

export function generateBaseCode(): string {
  const digits = Math.floor(Math.random() * 10_000)
    .toString()
    .padStart(4, '0');
  return `NEX${digits}`;
}

export function personalizeCode(base: string, name: string): string {
  return `${base}-${toAlpha3(name)}`;
}

export function isValidReferralFormat(code: string): boolean {
  return /^NEX\d{4}-[A-Z]{3}$/.test(code);
}
