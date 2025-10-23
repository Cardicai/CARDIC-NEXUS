import { NextRequest, NextResponse } from 'next/server';

import {
  type ParticipantStats,
  findByToken,
  upsertParticipant,
} from '@/lib/db';
import { getKpisFromFxBlueCsv } from '@/lib/fxblue-min';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

export async function POST(
  _request: NextRequest,
  context: { params: { token: string } }
) {
  const token = context.params?.token?.trim();
  if (!token) {
    return NextResponse.json(
      { ok: false, error: 'invalid_token' },
      { status: 400 }
    );
  }

  const participant = findByToken(token);
  if (!participant) {
    return NextResponse.json(
      { ok: false, error: 'unknown_token' },
      { status: 404 }
    );
  }

  const csvUrl =
    participant.fx?.csvUrl || buildCsvUrlFromUsername(participant.fx?.username);
  if (!csvUrl) {
    return NextResponse.json(
      { ok: false, error: 'missing_fxblue_csv' },
      { status: 409 }
    );
  }

  try {
    const kpis = await getKpisFromFxBlueCsv(csvUrl);
    const timestamp = new Date().toISOString();
    const stats: ParticipantStats = {
      ...(participant.stats || {}),
      updatedAt: timestamp,
      lastSyncAt: timestamp,
    };

    if (kpis.balance !== undefined) stats.balance = kpis.balance;
    if (kpis.equity !== undefined) stats.equity = kpis.equity;
    if (kpis.roiPct !== undefined) {
      stats.roiPct = kpis.roiPct;
      stats.roi = kpis.roiPct;
    }
    if (kpis.winRatePct !== undefined) stats.winRatePct = kpis.winRatePct;
    if (kpis.drawdownPct !== undefined) {
      stats.drawdownPct = kpis.drawdownPct;
      stats.drawdown = kpis.drawdownPct;
    }
    if (kpis.trades !== undefined) stats.trades = kpis.trades;

    const username =
      participant.fx?.username || extractUsernameFromUrl(csvUrl) || undefined;

    upsertParticipant({
      ...participant,
      fx: {
        ...(participant.fx || {}),
        csvUrl,
        ...(username ? { username } : {}),
      },
      stats,
    });

    return NextResponse.json({
      ok: true,
      token,
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
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}
