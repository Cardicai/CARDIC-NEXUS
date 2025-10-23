export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SPLIT_REGEX = /[\s,;]+/g;

function toArray(input: unknown): string[] {
  if (typeof input === 'string') {
    return [input];
  }
  if (Array.isArray(input)) {
    return input.filter((value): value is string => typeof value === 'string');
  }
  return [];
}

export function parseEmailList(input: unknown): string[] {
  const rawValues = toArray(input);
  if (rawValues.length === 0) {
    return [];
  }

  const normalized = rawValues
    .map((value) => value.replace(SPLIT_REGEX, ','))
    .join(',')
    .split(',')
    .map((segment) => segment.trim())
    .filter(Boolean);

  const unique: string[] = [];
  const seen = new Set<string>();
  for (const email of normalized) {
    const key = email.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(email);
    }
  }

  return unique;
}

export function findInvalidEmail(emails: string[]): string | undefined {
  return emails.find((email) => !EMAIL_PATTERN.test(email));
}

export function formatEmailList(emails: string[]): string {
  return emails.join(', ');
}
