export type FxBlueKpis = {
  balance?: number;
  equity?: number;
  roiPct?: number;
  winRatePct?: number;
  drawdownPct?: number;
  trades?: number;
};

const KPI_KEYWORDS: Record<keyof FxBlueKpis, readonly string[]> = {
  balance: ['balance', 'accountbalance', 'currentbalance'],
  equity: ['equity', 'accountequity', 'currentequity'],
  roiPct: ['roipct', 'roi%', 'returnoninvestment', 'roi'],
  winRatePct: ['winratepct', 'winrate%', 'winrate', 'win%'],
  drawdownPct: ['drawdownpct', 'drawdown%', 'maxdrawdown'],
  trades: ['trades', 'tradecount', 'numberoftrades', 'totaltrades'],
};

function normaliseKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          currentField += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        currentField += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      continue;
    }

    if (char === ',') {
      currentRow.push(currentField.trim());
      currentField = '';
      continue;
    }

    if (char === '\r') continue;

    if (char === '\n') {
      currentRow.push(currentField.trim());
      rows.push(currentRow);
      currentRow = [];
      currentField = '';
      continue;
    }

    currentField += char;
  }

  currentRow.push(currentField.trim());
  rows.push(currentRow);

  return rows.filter((row) => row.some((cell) => cell.length > 0));
}

function parseNumber(raw?: string): number | undefined {
  if (!raw) return undefined;
  let value = raw.trim();
  if (!value) return undefined;
  if (value.startsWith('(') && value.endsWith(')')) {
    value = `-${value.slice(1, -1)}`;
  }
  const cleaned = value
    .replace(/%/g, '')
    .replace(/,/g, '')
    .replace(/[^0-9+\-.]/g, '');
  if (!cleaned) return undefined;
  const parsed = Number.parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function extractKpis(table: string[][]): FxBlueKpis {
  const kpis: FxBlueKpis = {};
  if (!table.length) return kpis;

  for (const row of table) {
    if (!row.length) continue;
    const [rawKey, ...rest] = row;
    if (!rawKey || !rest.length) continue;
    const key = normaliseKey(rawKey);
    const value = rest.join(',').trim();
    for (const [metric, candidates] of Object.entries(KPI_KEYWORDS) as [
      keyof FxBlueKpis,
      readonly string[]
    ][]) {
      if (!candidates.some((candidate) => key.includes(candidate))) continue;

      let parsedValue: number | undefined;
      if (metric === 'trades') {
        const digits = value.replace(/[^0-9+-]/g, '');
        if (digits) {
          const parsed = Number.parseInt(digits, 10);
          if (Number.isFinite(parsed)) parsedValue = parsed;
        }
      } else {
        parsedValue = parseNumber(value);
      }

      if (parsedValue !== undefined && !Number.isNaN(parsedValue)) {
        kpis[metric] = parsedValue;
      }
      break;
    }
  }

  return kpis;
}

export async function getKpisFromFxBlueCsv(url: string): Promise<FxBlueKpis> {
  if (!url) throw new Error('Missing FXBlue CSV URL');
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`FXBlue CSV fetch failed with status ${response.status}`);
  }
  const text = await response.text();
  const table = parseCsv(text);
  return extractKpis(table);
}
