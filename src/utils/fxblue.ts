import { parseCsv } from './csv';

type Primitive = string | number | null;

export type FxBlueRow = Record<string, Primitive> & {
  __meta?: {
    raw?: Record<string, Primitive>;
  };
};

export type FxBlueParseResult = {
  headers: string[];
  rows: FxBlueRow[];
};

export type FxBlueKpis = {
  balance?: number;
  equity?: number;
  closedPL?: number;
  floatingPL?: number;
  totalTrades?: number;
  wins?: number;
  losses?: number;
  winRatePct?: number;
  profitFactor?: number;
  maxDrawdownPct?: number;
  roiPct?: number;
};

const BALANCE_KEYS = [
  'balance',
  'account_balance',
  'closed_balance',
  'ending_balance',
  'current_balance',
  'balance_after',
];

const EQUITY_KEYS = [
  'equity',
  'account_equity',
  'ending_equity',
  'current_equity',
  'equity_after',
];

const CLOSED_PL_KEYS = [
  'closed_pl',
  'profit',
  'net_profit',
  'profit_loss',
  'trade_profit',
  'gross_profit',
  'p_l',
  'pl',
  'net_pl',
  'netp_l',
];

const FLOATING_PL_KEYS = [
  'floating_pl',
  'floating_profit',
  'open_pl',
  'floating_p_l',
  'unrealized_pl',
  'floatingloss',
];

const TRADE_IDENTIFIER_KEYS = [
  'ticket',
  'order',
  'deal',
  'trade_id',
  'position',
  'id',
];

const DATE_KEYS = [
  'close_time',
  'closed_time',
  'time',
  'date',
  'timestamp',
  'open_time',
  'entry_time',
];

function normalizeHeader(
  header: string,
  index: number,
  seen: Map<string, number>
) {
  const base =
    header
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .replace(/_{2,}/g, '_') || `column_${index}`;

  const count = seen.get(base) ?? 0;
  seen.set(base, count + 1);
  if (count === 0) return base;
  return `${base}_${count + 1}`;
}

function coerceNumber(value: string): number | undefined {
  const cleaned = value
    .replace(/[^0-9+\-.,%]/g, '')
    .replace(/,(?=\d{3}(?:\D|$))/g, '')
    .replace(/,/g, '');

  if (!cleaned) return undefined;
  const normalized = cleaned.endsWith('%')
    ? cleaned.slice(0, -1).trim()
    : cleaned;

  if (!normalized) return undefined;
  const parsed = Number.parseFloat(normalized);
  if (!Number.isFinite(parsed)) return undefined;
  return parsed;
}

function coerceValue(value: string): Primitive {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const numeric = coerceNumber(trimmed);
  if (numeric !== undefined) return numeric;
  return trimmed;
}

export async function fetchCsv(url: string): Promise<string> {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`FXBlue CSV fetch failed with status ${response.status}`);
  }

  if (!response.body) {
    return response.text();
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let result = '';
  let done = false;

  while (!done) {
    const read = await reader.read();
    done = Boolean(read.done);
    if (read.value) {
      result += decoder.decode(read.value, { stream: !done });
    }
  }

  result += decoder.decode();
  return result;
}

export function parseFxBlueCsv(csv: string): FxBlueParseResult {
  const rows = parseCsv(csv);
  if (rows.length === 0) return { headers: [], rows: [] };

  const headerRow = rows[0];
  const seen = new Map<string, number>();
  const headers = headerRow.map((header, index) =>
    normalizeHeader(header, index, seen)
  );

  const records: FxBlueRow[] = [];

  for (let i = 1; i < rows.length; i += 1) {
    const row = rows[i];
    if (row.length === 0) continue;
    const record: FxBlueRow = {};
    for (let j = 0; j < headers.length; j += 1) {
      const key = headers[j];
      const raw = row[j] ?? '';
      const value = coerceValue(String(raw ?? ''));
      if (value !== null && value !== '') {
        record[key] = value;
      } else {
        record[key] = value;
      }
    }
    records.push(record);
  }

  return { headers, rows: records };
}

function getAllKeys(rows: FxBlueRow[]): string[] {
  const set = new Set<string>();
  for (const row of rows) {
    for (const key of Object.keys(row)) {
      if (key !== '__meta') set.add(key);
    }
  }
  return Array.from(set);
}

function findKey(rows: FxBlueRow[], candidates: string[], numericOnly = true) {
  const availableKeys = getAllKeys(rows);
  for (const candidate of candidates) {
    const exact = availableKeys.find((key) => key === candidate);
    if (exact && hasValidValues(rows, exact, numericOnly)) return exact;
  }
  for (const candidate of candidates) {
    const match = availableKeys.find(
      (key) =>
        key.includes(candidate) ||
        key.replace(/_/g, '').includes(candidate.replace(/_/g, ''))
    );
    if (match && hasValidValues(rows, match, numericOnly)) return match;
  }
  return undefined;
}

function hasValidValues(rows: FxBlueRow[], key: string, numericOnly: boolean) {
  return rows.some((row) => {
    const value = row[key];
    if (value == null) return false;
    if (!numericOnly) return true;
    return typeof value === 'number' && Number.isFinite(value);
  });
}

function getNumber(value: Primitive): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = coerceNumber(value);
    return parsed;
  }
  return undefined;
}

function computeSeries(
  rows: FxBlueRow[],
  key?: string,
  orderedRows?: FxBlueRow[]
) {
  if (!key) return [];
  const source = orderedRows ?? rows;
  const result: number[] = [];
  for (const row of source) {
    const value = getNumber(row[key] ?? null);
    if (value !== undefined) {
      result.push(value);
    }
  }
  return result;
}

function toTimestamp(value: Primitive): number | null {
  if (value == null) return null;
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return null;
    if (value > 1_000_000_000_000) return value;
    return value * 1000;
  }
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function orderRowsChronologically(rows: FxBlueRow[], dateKey?: string) {
  if (!dateKey) return rows;
  const rowsWithDate = rows
    .map((row, index) => ({
      row,
      timestamp: toTimestamp(row[dateKey] ?? null),
      index,
    }))
    .filter((item) => item.timestamp !== null) as Array<{
    row: FxBlueRow;
    timestamp: number;
    index: number;
  }>;

  if (rowsWithDate.length === 0) return rows;

  return rowsWithDate
    .sort((a, b) => a.timestamp - b.timestamp || a.index - b.index)
    .map((item) => item.row);
}

function safeAverage(numerator: number, denominator: number) {
  if (denominator === 0) return undefined;
  const value = numerator / denominator;
  return Number.isFinite(value) ? value : undefined;
}

function safePercent(part: number, total: number) {
  const value = safeAverage(part, total);
  if (value === undefined) return undefined;
  return value * 100;
}

function computeDrawdownPct(series: number[]) {
  if (series.length === 0) return undefined;
  let peak = series[0];
  let maxDrawdown = 0;

  for (const value of series) {
    if (!Number.isFinite(value)) continue;
    if (value > peak) {
      peak = value;
      continue;
    }
    if (peak <= 0) continue;
    const drawdown = (peak - value) / peak;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }

  return maxDrawdown > 0 ? maxDrawdown * 100 : undefined;
}

function firstValid(series: number[]) {
  for (const value of series) {
    if (Number.isFinite(value)) return value;
  }
  return undefined;
}

function lastValid(series: number[]) {
  for (let i = series.length - 1; i >= 0; i -= 1) {
    const value = series[i];
    if (Number.isFinite(value)) return value;
  }
  return undefined;
}

export function computeKpis(rows: FxBlueRow[]): FxBlueKpis {
  if (rows.length === 0) return {};

  const dateKey = findKey(rows, DATE_KEYS, false);
  const ordered = orderRowsChronologically(rows, dateKey);

  const balanceKey = findKey(rows, BALANCE_KEYS);
  const equityKey = findKey(rows, EQUITY_KEYS);
  const profitKey = findKey(rows, CLOSED_PL_KEYS);
  const floatingKey = findKey(rows, FLOATING_PL_KEYS);
  const tradeIdentifierKey = findKey(rows, TRADE_IDENTIFIER_KEYS, false);

  const profits = computeSeries(rows, profitKey);
  const floatingSeries = computeSeries(ordered, floatingKey, ordered);
  const balanceSeries = computeSeries(ordered, balanceKey, ordered);
  const equitySeries = computeSeries(ordered, equityKey, ordered);

  const wins = profits.filter((value) => value > 0).length;
  const losses = profits.filter((value) => value < 0).length;
  const totalTrades =
    profits.length ||
    (tradeIdentifierKey
      ? rows.filter((row) => {
          const identifier = row[tradeIdentifierKey];
          if (identifier == null) return false;
          if (typeof identifier === 'number')
            return Number.isFinite(identifier);
          if (typeof identifier === 'string')
            return identifier.trim().length > 0;
          return false;
        }).length
      : rows.length);

  const sumProfits = profits.reduce(
    (sum, value) => (value > 0 ? sum + value : sum),
    0
  );
  const sumLosses = profits.reduce(
    (sum, value) => (value < 0 ? sum + value : sum),
    0
  );
  const profitFactor =
    sumLosses < 0 && Number.isFinite(sumProfits)
      ? sumProfits / Math.abs(sumLosses)
      : undefined;

  const closedPL = profits.reduce((sum, value) => sum + value, 0);
  const floatingPL = lastValid(floatingSeries);

  const primarySeries = equitySeries.length > 0 ? equitySeries : balanceSeries;
  const roiPct = (() => {
    const first = firstValid(primarySeries);
    const last = lastValid(primarySeries);
    if (first === undefined || last === undefined) return undefined;
    if (first === 0) return undefined;
    const roi = ((last - first) / Math.abs(first)) * 100;
    return Number.isFinite(roi) ? roi : undefined;
  })();

  const maxDrawdownPct = computeDrawdownPct(primarySeries);
  const winRatePct = safePercent(wins, wins + losses);

  const balance = lastValid(balanceSeries);
  const equity = lastValid(equitySeries);

  const sanitize = (value: number | undefined) =>
    value !== undefined && Number.isFinite(value) ? value : undefined;

  return {
    balance: sanitize(balance),
    equity: sanitize(equity),
    closedPL: sanitize(closedPL),
    floatingPL: sanitize(floatingPL),
    totalTrades: Number.isFinite(totalTrades) ? totalTrades : undefined,
    wins: Number.isFinite(wins) ? wins : undefined,
    losses: Number.isFinite(losses) ? losses : undefined,
    winRatePct: sanitize(winRatePct),
    profitFactor:
      profitFactor !== undefined && Number.isFinite(profitFactor)
        ? profitFactor
        : undefined,
    maxDrawdownPct: sanitize(maxDrawdownPct),
    roiPct: sanitize(roiPct),
  };
}
