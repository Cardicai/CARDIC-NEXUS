const NEWLINE_CHARS = new Set(['\n', '\r']);

function normalizeInput(input: string): string {
  if (input.startsWith('\ufeff')) {
    return input.slice(1);
  }
  return input;
}

export function parseCsv(input: string): string[][] {
  const text = normalizeInput(input);
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentValue = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        const nextChar = text[i + 1];
        if (nextChar === '"') {
          currentValue += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        currentValue += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      continue;
    }

    if (char === ',') {
      currentRow.push(currentValue);
      currentValue = '';
      continue;
    }

    if (NEWLINE_CHARS.has(char)) {
      const nextChar = text[i + 1];
      if (char === '\r' && nextChar === '\n') {
        i += 1;
      }
      currentRow.push(currentValue);
      rows.push(currentRow);
      currentRow = [];
      currentValue = '';
      continue;
    }

    currentValue += char;
  }

  currentRow.push(currentValue);
  const isTrailingEmptyRow =
    currentRow.length === 1 && currentRow[0].trim().length === 0;

  if (!isTrailingEmptyRow || rows.length === 0) {
    rows.push(currentRow);
  }

  return rows.filter((row) => row.some((value) => value.trim().length > 0));
}

export type CsvRow = string[];
