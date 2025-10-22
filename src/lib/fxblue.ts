const ROI_REGEX = /ROI[^0-9+-]*([+-]?\d+(?:\.\d+)?)\s*%/i;
const DRAWDOWN_REGEX = /Drawdown[^0-9+-]*([+-]?\d+(?:\.\d+)?)\s*%/i;
const BALANCE_REGEX = /Balance[^0-9]*([\d,]+(?:\.\d+)?)/i;
const EQUITY_REGEX = /Equity[^0-9]*([\d,]+(?:\.\d+)?)/i;

const JSON_KEYS = {
  roi: ['roi', 'roipercent', 'performance', 'returnoninvestment'],
  drawdown: ['drawdown', 'maxdrawdown', 'riskdrawdown'],
  balance: ['balance', 'accountbalance', 'currentbalance'],
  equity: ['equity', 'accountequity', 'currentequity'],
} as const;

function normaliseKey(input: string) {
  return input.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function matchesCandidate(key: string, candidate: string) {
  return (
    key === candidate || key.endsWith(candidate) || key.includes(candidate)
  );
}

function extractValue(value: unknown): unknown {
  if (value == null) return undefined;
  if (typeof value === 'string' || typeof value === 'number') return value;
  if (typeof value !== 'object') return undefined;
  const obj = value as Record<string, unknown>;
  for (const prop of ['value', 'amount', 'current', 'latest', 'percent']) {
    if (prop in obj) return obj[prop];
  }
  return undefined;
}

function findNumericValue(source: unknown, keys: readonly string[]) {
  if (source == null) return undefined;
  const queue: unknown[] = [source];
  const visited = new Set<unknown>();
  const candidates = keys.map((key) => normaliseKey(key));

  while (queue.length) {
    const current = queue.shift();
    if (!current || typeof current !== 'object') continue;
    if (visited.has(current)) continue;
    visited.add(current);

    if (Array.isArray(current)) {
      for (const item of current) queue.push(item);
      continue;
    }

    for (const [rawKey, rawValue] of Object.entries(current)) {
      const key = normaliseKey(rawKey);
      if (candidates.some((candidate) => matchesCandidate(key, candidate))) {
        const candidateValue = extractValue(rawValue) ?? rawValue;
        const num = toNum(candidateValue);
        if (typeof num === 'number') return num;
      }
      if (rawValue && typeof rawValue === 'object') {
        queue.push(rawValue);
      }
    }
  }

  return undefined;
}

function buildJsonUrl(template: string, username: string) {
  const encoded = encodeURIComponent(username);
  if (template.includes('{username}')) {
    return template.replace(/\{username\}/g, encoded);
  }
  return template.endsWith('/')
    ? `${template}${encoded}`
    : `${template}/${encoded}`;
}

export function toNum(value: unknown): number | undefined {
  if (value == null) return undefined;
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined;
  }
  if (typeof value !== 'string') return undefined;
  const cleaned = value.replace(/[^0-9+.,-]/g, '');
  if (!cleaned) return undefined;
  const normalized = cleaned.replace(/,/g, '');
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
}

async function fetchJsonStats(username: string) {
  const template = process.env.FXBLUE_JSON_URL_TEMPLATE;
  if (!template) return undefined;
  const response = await fetch(buildJsonUrl(template, username), {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error(`FXBlue JSON fetch failed with status ${response.status}`);
  }
  const data = await response.json();
  return {
    roi: findNumericValue(data, JSON_KEYS.roi),
    drawdown: findNumericValue(data, JSON_KEYS.drawdown),
    balance: findNumericValue(data, JSON_KEYS.balance),
    equity: findNumericValue(data, JSON_KEYS.equity),
  };
}

async function fetchHtmlStats(username: string) {
  const url = `https://www.fxblue.com/users/${encodeURIComponent(username)}`;
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`FXBlue HTML fetch failed with status ${response.status}`);
  }
  const html = await response.text();
  const roi = ROI_REGEX.exec(html)?.[1];
  const drawdown = DRAWDOWN_REGEX.exec(html)?.[1];
  const balance = BALANCE_REGEX.exec(html)?.[1];
  const equity = EQUITY_REGEX.exec(html)?.[1];
  return {
    roi: toNum(roi),
    drawdown: toNum(drawdown),
    balance: toNum(balance),
    equity: toNum(equity),
  };
}

export async function fetchFxBluePublic(username: string): Promise<{
  roi?: number;
  drawdown?: number;
  balance?: number;
  equity?: number;
}> {
  if (!username) return {};
  try {
    const statsFromJson = await fetchJsonStats(username);
    if (statsFromJson) return statsFromJson;
  } catch (_error) {
    // Ignore JSON fetch failures and fall back to HTML scraping.
  }
  return fetchHtmlStats(username);
}
