export function parseEmailRecipients(
  input: string | undefined | null
): string[] {
  if (!input) {
    return [];
  }

  return input
    .split(',')
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
}
