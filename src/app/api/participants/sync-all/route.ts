import fs from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';

import {
  type Participant,
  type ParticipantStats,
  listParticipants,
  upsertParticipant,
} from '@/lib/db';
import { type FxBlueKpis, getKpisFromFxBlueCsv } from '@/lib/fxblue-min';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const CSV_FALLBACK_PATH = '/mnt/data/competition_dashboard_updated.csv';

const FALLBACK_PARTICIPANTS = [
  {
    token: 'onoriodo-raymond-XNYYC8',
    name: 'Onoriodo Raymond',
    csvUrl: 'https://www.fxblue.com/users/cardic/csv',
    username: 'cardic',
  },
  {
    token: 'real-cardic-PSFJ47',
    name: 'Real Cardic',
    csvUrl: 'https://www.fxblue.com/users/cardic/csv',
    username: 'cardic',
  },
] as const;

type ColumnKey =
  | 'token'
  | 'name'
  | 'csvUrl'
  | 'username'
  | 'balance'
  | 'equity'
  | 'roiPct'
  | 'winRatePct'
  | 'drawdownPct'
  | 'trades'
  | 'lastSyncAt';

const COLUMN_TITLES: Record<ColumnKey, string> = {
  token: 'Token',
  name: 'Name',
  csvUrl: 'FxBlueCsv',
  username: 'FxBlueUsername',
  balance: 'Balance',
  equity: 'Equity',
  roiPct: 'ROI_PCT',
  winRatePct: 'WinRate_PCT',
  drawdownPct: 'Drawdown_PCT',
  trades: 'Trades',
  lastSyncAt: 'LastSyncAt',
};

const COLUMN_CANDIDATES: Record<ColumnKey, readonly string[]> = {
  token: ['token', 'participanttoken', 'userid', 'id'],
  name: ['name', 'fullname', 'participant'],
  csvUrl: ['csv', 'csvurl', 'fxbluecsv', 'metricsurl', 'kpiurl', 'statsurl'],
  username: ['username', 'fxblueuser', 'fxblueusername', 'fxusername'],
  balance: ['balance', 'accountbalance', 'currentbalance'],
  equity: ['equity', 'accountequity', 'currentequity'],
  roiPct: ['roipct', 'roipercent', 'roi%', 'roi'],
  winRatePct: ['winratepct', 'winratepercent', 'winrate', 'win%'],
  drawdownPct: ['drawdownpct', 'drawdownpercent', 'drawdown', 'maxdrawdown'],
  trades: ['trades', 'totaltrades', 'tradecount', 'numberoftrades'],
  lastSyncAt: ['lastsyncat', 'lastupdated', 'syncedat', 'updatedat'],
};

type CsvState = {
  filePath: string;
  header: string[];
  headerNormalized: string[];
  rows: string[][];
  columnIndexes: Partial<Record<ColumnKey, number>>;
  dirty: boolean;
};

type ParticipantTarget = {
  token: string;
  name?: string;
  csvUrl: string;
  username?: string;
  participant?: Participant;
  source: 'db' | 'csv' | 'fallback';
  rowIndex?: number;
};

type LoadTargetsResult = {
  targets: ParticipantTarget[];
  csvState?: CsvState;
};

type SyncSummary = {
  token: string;
  balance?: number;
  equity?: number;
  roiPct?: number;
  winRatePct?: number;
  drawdownPct?: number;
  trades?: number;
  lastSyncAt: string;
};

type SyncError = {
  token: string;
  error: string;
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

function matchesCandidate(header: string, candidates: readonly string[]) {
  return candidates.some((candidate) => {
    const key = normaliseKey(candidate);
    return header === key || header.endsWith(key);
  });
}

function getColumnIndex(state: CsvState, key: ColumnKey, ensure?: boolean) {
  const cached = state.columnIndexes[key];
  if (typeof cached === 'number') return cached;

  for (let i = 0; i < state.headerNormalized.length; i += 1) {
    const header = state.headerNormalized[i];
    if (!header) continue;
    if (matchesCandidate(header, COLUMN_CANDIDATES[key])) {
      state.columnIndexes[key] = i;
      return i;
    }
  }

  if (!ensure) return undefined;

  const title = COLUMN_TITLES[key];
  state.header.push(title);
  state.headerNormalized.push(normaliseKey(title));
  for (const row of state.rows) row.push('');
  const index = state.header.length - 1;
  state.columnIndexes[key] = index;
  state.dirty = true;
  return index;
}

function formatValue(value: string | number | undefined) {
  if (value === undefined || value === null) return '';
  if (typeof value === 'number') {
    return Number.isInteger(value) ? value.toString() : value.toFixed(2);
  }
  return value;
}

function setCsvValue(
  state: CsvState,
  rowIndex: number,
  key: ColumnKey,
  value: string | number | undefined
) {
  const index = getColumnIndex(state, key, true);
  if (index === undefined) return;
  const row = state.rows[rowIndex];
  if (!row) return;
  const formatted = formatValue(value);
  if (row[index] === formatted) return;
  row[index] = formatted;
  state.dirty = true;
}

function ensureCsvRow(state: CsvState, target: ParticipantTarget) {
  if (target.rowIndex !== undefined) return target.rowIndex;
  const row: string[] = new Array(state.header.length).fill('');
  state.rows.push(row);
  target.rowIndex = state.rows.length - 1;
  state.dirty = true;
  return target.rowIndex;
}

function serializeRow(row: string[]) {
  return row
    .map((cell) => {
      const value = cell ?? '';
      if (/[",\n\r]/.test(value)) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    })
    .join(',');
}

async function writeCsvState(state: CsvState) {
  const allRows = [state.header, ...state.rows];
  const contents = `${allRows.map(serializeRow).join('\n')}\n`;
  await fs.writeFile(state.filePath, contents, 'utf8');
}

async function loadCsvState(): Promise<CsvState | undefined> {
  try {
    const text = await fs.readFile(CSV_FALLBACK_PATH, 'utf8');
    const table = parseCsv(text);
    if (!table.length) return undefined;
    const header = table[0].map((cell) => cell.trim());
    const headerNormalized = header.map((cell) => normaliseKey(cell));
    const width = header.length;
    const rows = table
      .slice(1)
      .map((row) => {
        const clone = row.map((cell) => cell.trim());
        while (clone.length < width) clone.push('');
        if (clone.length > width) clone.length = width;
        return clone;
      })
      .filter((row) => row.some((cell) => cell.length > 0));

    return {
      filePath: CSV_FALLBACK_PATH,
      header,
      headerNormalized,
      rows,
      columnIndexes: {},
      dirty: false,
    };
  } catch {
    return undefined;
  }
}

function buildCsvUrlFromUsername(username?: string) {
  if (!username) return '';
  const trimmed = username.trim();
  if (!trimmed) return '';
  return `https://www.fxblue.com/users/${encodeURIComponent(trimmed)}/csv`;
}

function extractUsernameFromUrl(url: string) {
  const match = url.match(/users\/([^/]+)(?:\/csv)?/i);
  if (!match) return undefined;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

function guessNameFromToken(token: string) {
  const parts = token.split('-').filter(Boolean);
  if (!parts.length) return token;
  const last = parts[parts.length - 1];
  if (/^[A-Z0-9]{5,}$/.test(last)) parts.pop();
  return parts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

async function loadTargets(): Promise<LoadTargetsResult> {
  const participants = listParticipants();
  const map = new Map<string, ParticipantTarget>();

  for (const participant of participants) {
    if (participant.status !== 'ACTIVE') continue;
    const csvUrl =
      participant.fx?.csvUrl ||
      buildCsvUrlFromUsername(participant.fx?.username);
    if (!csvUrl) continue;
    map.set(participant.id, {
      token: participant.id,
      name: participant.name,
      csvUrl,
      username:
        participant.fx?.username || extractUsernameFromUrl(csvUrl) || undefined,
      participant,
      source: 'db',
    });
  }

  const csvState = await loadCsvState();
  if (csvState) {
    const tokenIndex = getColumnIndex(csvState, 'token');
    if (tokenIndex !== undefined) {
      const csvIndex = getColumnIndex(csvState, 'csvUrl');
      const usernameIndex = getColumnIndex(csvState, 'username');
      const nameIndex = getColumnIndex(csvState, 'name');

      csvState.rows.forEach((row, idx) => {
        const token = (row[tokenIndex] || '').trim();
        if (!token) return;
        const csvUrl = (csvIndex !== undefined ? row[csvIndex] : '').trim();
        const username = (
          usernameIndex !== undefined ? row[usernameIndex] : ''
        ).trim();
        const name = (nameIndex !== undefined ? row[nameIndex] : '').trim();
        const resolvedCsv = csvUrl || buildCsvUrlFromUsername(username);
        if (!resolvedCsv) return;

        const existing = map.get(token);
        const derivedUsername =
          username || extractUsernameFromUrl(resolvedCsv) || undefined;
        if (existing) {
          if (existing.rowIndex === undefined) existing.rowIndex = idx;
          if (!existing.username && derivedUsername)
            existing.username = derivedUsername;
          if (!existing.name && name) existing.name = name;
          if (!existing.csvUrl) existing.csvUrl = resolvedCsv;
        } else {
          map.set(token, {
            token,
            name: name || undefined,
            csvUrl: resolvedCsv,
            username: derivedUsername,
            source: 'csv',
            rowIndex: idx,
          });
        }
      });
    }
  }

  for (const fallback of FALLBACK_PARTICIPANTS) {
    if (map.has(fallback.token)) continue;
    const csvUrl = fallback.csvUrl;
    const username = fallback.username || extractUsernameFromUrl(csvUrl);
    map.set(fallback.token, {
      token: fallback.token,
      name: fallback.name,
      csvUrl,
      username: username || undefined,
      source: 'fallback',
    });
  }

  return { targets: Array.from(map.values()), csvState };
}

function mergeStats(
  participant: Participant | undefined,
  kpis: FxBlueKpis,
  timestamp: string
): ParticipantStats {
  const nextStats: ParticipantStats = { ...(participant?.stats || {}) };
  if (kpis.balance !== undefined) nextStats.balance = kpis.balance;
  if (kpis.equity !== undefined) nextStats.equity = kpis.equity;
  if (kpis.roiPct !== undefined) {
    nextStats.roiPct = kpis.roiPct;
    nextStats.roi = kpis.roiPct;
  }
  if (kpis.winRatePct !== undefined) nextStats.winRatePct = kpis.winRatePct;
  if (kpis.drawdownPct !== undefined) {
    nextStats.drawdownPct = kpis.drawdownPct;
    nextStats.drawdown = kpis.drawdownPct;
  }
  if (kpis.trades !== undefined) nextStats.trades = kpis.trades;
  nextStats.updatedAt = timestamp;
  nextStats.lastSyncAt = timestamp;
  return nextStats;
}

function ensureParticipant(
  target: ParticipantTarget,
  stats: ParticipantStats,
  timestamp: string
) {
  if (target.participant) {
    const username =
      target.username ||
      target.participant.fx?.username ||
      extractUsernameFromUrl(target.csvUrl);
    upsertParticipant({
      ...target.participant,
      fx: {
        ...(target.participant.fx || {}),
        csvUrl: target.csvUrl,
        ...(username ? { username } : {}),
      },
      stats,
    });
    return;
  }

  const createdAt = timestamp;
  const username = target.username || extractUsernameFromUrl(target.csvUrl);
  const name = target.name || guessNameFromToken(target.token);
  upsertParticipant({
    id: target.token,
    name,
    email: '',
    status: 'ACTIVE',
    createdAt,
    fx: {
      ...(username ? { username } : {}),
      csvUrl: target.csvUrl,
    },
    stats,
  });
}

export async function POST(_request: NextRequest) {
  const { targets, csvState } = await loadTargets();
  if (!targets.length) {
    return NextResponse.json(
      {
        ok: false,
        updated: [],
        errors: [{ token: 'all', error: 'no_participants' }],
      },
      { status: 404 }
    );
  }

  const updated: SyncSummary[] = [];
  const errors: SyncError[] = [];
  const timestamp = new Date().toISOString();

  for (const target of targets) {
    try {
      const kpis = await getKpisFromFxBlueCsv(target.csvUrl);
      const stats = mergeStats(target.participant, kpis, timestamp);
      ensureParticipant(target, stats, timestamp);

      if (csvState) {
        const rowIndex = ensureCsvRow(csvState, target);
        if (kpis.balance !== undefined)
          setCsvValue(csvState, rowIndex, 'balance', kpis.balance);
        if (kpis.equity !== undefined)
          setCsvValue(csvState, rowIndex, 'equity', kpis.equity);
        if (kpis.roiPct !== undefined)
          setCsvValue(csvState, rowIndex, 'roiPct', kpis.roiPct);
        if (kpis.winRatePct !== undefined)
          setCsvValue(csvState, rowIndex, 'winRatePct', kpis.winRatePct);
        if (kpis.drawdownPct !== undefined)
          setCsvValue(csvState, rowIndex, 'drawdownPct', kpis.drawdownPct);
        if (kpis.trades !== undefined)
          setCsvValue(csvState, rowIndex, 'trades', kpis.trades);
        setCsvValue(csvState, rowIndex, 'lastSyncAt', timestamp);
        setCsvValue(csvState, rowIndex, 'csvUrl', target.csvUrl);
        const username =
          target.username || extractUsernameFromUrl(target.csvUrl);
        if (username) setCsvValue(csvState, rowIndex, 'username', username);
        if (target.name) setCsvValue(csvState, rowIndex, 'name', target.name);
        setCsvValue(csvState, rowIndex, 'token', target.token);
      }

      updated.push({
        token: target.token,
        balance: kpis.balance,
        equity: kpis.equity,
        roiPct: kpis.roiPct,
        winRatePct: kpis.winRatePct,
        drawdownPct: kpis.drawdownPct,
        trades: kpis.trades,
        lastSyncAt: timestamp,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to fetch FXBlue KPIs';
      errors.push({ token: target.token, error: message });
    }
  }

  if (csvState?.dirty) {
    try {
      await writeCsvState(csvState);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to write CSV';
      errors.push({ token: 'csv', error: message });
    }
  }

  return NextResponse.json({ ok: errors.length === 0, updated, errors });
}
