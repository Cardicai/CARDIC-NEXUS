import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_LEADERBOARD_SIZE = 100;

type StatsRecord = Record<string, unknown> | null;

function getNumber(stats: StatsRecord, key: string): number | undefined {
  if (!stats || typeof stats !== 'object') return undefined;
  const value = (stats as Record<string, unknown>)[key];
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

export async function GET(_request: NextRequest) {
  try {
    const participants = await prisma.participant.findMany({
      where: { isActive: true },
      select: {
        token: true,
        displayName: true,
        stats: true,
      },
    });

    const leaderboard = participants
      .map((participant) => {
        const stats = participant.stats as StatsRecord;
        const roiPct = getNumber(stats, 'roiPct');
        const winRatePct = getNumber(stats, 'winRatePct');
        const profitFactor = getNumber(stats, 'profitFactor');
        const totalTrades = getNumber(stats, 'totalTrades');
        const equity = getNumber(stats, 'equity');
        return {
          token: participant.token,
          displayName: participant.displayName,
          roiPct,
          winRatePct,
          profitFactor,
          totalTrades,
          equity,
        };
      })
      .sort((a, b) => (b.roiPct ?? -Infinity) - (a.roiPct ?? -Infinity))
      .slice(0, MAX_LEADERBOARD_SIZE);

    return NextResponse.json({ ok: true, participants: leaderboard });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to load leaderboard';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
