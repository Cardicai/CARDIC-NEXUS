import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

import { computeKpis, fetchCsv, parseFxBlueCsv } from '@/utils/fxblue';

import { ensureAdminAuthorized } from '../../_shared';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function sanitizeNumber(value: number | undefined | null) {
  if (value === null || value === undefined) return null;
  if (Number.isFinite(value)) return value;
  return null;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { token?: string } }
) {
  const authError = ensureAdminAuthorized(request);
  if (authError) return authError;

  const token = params.token?.trim();
  if (!token) {
    return NextResponse.json(
      { ok: false, error: 'Missing participant token' },
      { status: 400 }
    );
  }

  try {
    const participant = await prisma.participant.findUnique({
      where: { token },
    });

    if (!participant) {
      return NextResponse.json(
        { ok: false, error: 'Participant not found' },
        { status: 404 }
      );
    }

    if (!participant.csvUrl) {
      return NextResponse.json(
        { ok: false, error: 'Participant is not linked to an FXBlue CSV feed' },
        { status: 400 }
      );
    }

    const csv = await fetchCsv(participant.csvUrl);
    const parsed = parseFxBlueCsv(csv);
    if (parsed.rows.length === 0) {
      return NextResponse.json(
        { ok: false, reason: 'empty_csv' },
        { status: 422 }
      );
    }

    const kpis = computeKpis(parsed.rows);
    const now = new Date();

    const snapshotData = {
      participantId: participant.id,
      balance: sanitizeNumber(kpis.balance ?? null),
      equity: sanitizeNumber(kpis.equity ?? null),
      closedPL: sanitizeNumber(kpis.closedPL ?? null),
      floatingPL: sanitizeNumber(kpis.floatingPL ?? null),
      totalTrades:
        typeof kpis.totalTrades === 'number' &&
        Number.isFinite(kpis.totalTrades)
          ? Math.round(kpis.totalTrades)
          : null,
      wins:
        typeof kpis.wins === 'number' && Number.isFinite(kpis.wins)
          ? Math.round(kpis.wins)
          : null,
      losses:
        typeof kpis.losses === 'number' && Number.isFinite(kpis.losses)
          ? Math.round(kpis.losses)
          : null,
      winRatePct: sanitizeNumber(kpis.winRatePct ?? null),
      profitFactor: sanitizeNumber(kpis.profitFactor ?? null),
      maxDrawdownPct: sanitizeNumber(kpis.maxDrawdownPct ?? null),
      roiPct: sanitizeNumber(kpis.roiPct ?? null),
      raw: {
        rowCount: parsed.rows.length,
        lastRows: parsed.rows.slice(-20),
      },
    };

    const statsPayload: Record<string, unknown> = {
      balance: sanitizeNumber(kpis.balance ?? null) ?? undefined,
      equity: sanitizeNumber(kpis.equity ?? null) ?? undefined,
      closedPL: sanitizeNumber(kpis.closedPL ?? null) ?? undefined,
      floatingPL: sanitizeNumber(kpis.floatingPL ?? null) ?? undefined,
      totalTrades:
        typeof kpis.totalTrades === 'number' &&
        Number.isFinite(kpis.totalTrades)
          ? Math.round(kpis.totalTrades)
          : undefined,
      wins:
        typeof kpis.wins === 'number' && Number.isFinite(kpis.wins)
          ? Math.round(kpis.wins)
          : undefined,
      losses:
        typeof kpis.losses === 'number' && Number.isFinite(kpis.losses)
          ? Math.round(kpis.losses)
          : undefined,
      winRatePct: sanitizeNumber(kpis.winRatePct ?? null) ?? undefined,
      profitFactor: sanitizeNumber(kpis.profitFactor ?? null) ?? undefined,
      maxDrawdownPct: sanitizeNumber(kpis.maxDrawdownPct ?? null) ?? undefined,
      roiPct: sanitizeNumber(kpis.roiPct ?? null) ?? undefined,
      rowCount: parsed.rows.length,
      syncedAt: now.toISOString(),
      source: 'fxblue-csv',
    };

    await prisma.$transaction([
      prisma.snapshot.create({ data: snapshotData }),
      prisma.participant.update({
        where: { id: participant.id },
        data: {
          stats: statsPayload,
          lastSyncAt: now,
        },
      }),
    ]);

    return NextResponse.json({
      ok: true,
      token,
      kpis,
      rowCount: parsed.rows.length,
      lastSyncAt: now.toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to sync';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
