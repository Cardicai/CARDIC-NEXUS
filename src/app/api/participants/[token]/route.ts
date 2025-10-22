import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SNAPSHOT_LIMIT = 20;

export async function GET(
  _request: NextRequest,
  { params }: { params: { token: string } }
) {
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
      include: {
        snapshots: {
          orderBy: { at: 'desc' },
          take: SNAPSHOT_LIMIT,
        },
      },
    });

    if (!participant) {
      return NextResponse.json(
        { ok: false, error: 'Participant not found' },
        { status: 404 }
      );
    }

    const snapshots = participant.snapshots.map((snapshot) => ({
      id: snapshot.id,
      at: snapshot.at.toISOString(),
      balance: snapshot.balance,
      equity: snapshot.equity,
      closedPL: snapshot.closedPL,
      floatingPL: snapshot.floatingPL,
      totalTrades: snapshot.totalTrades,
      wins: snapshot.wins,
      losses: snapshot.losses,
      winRatePct: snapshot.winRatePct,
      profitFactor: snapshot.profitFactor,
      maxDrawdownPct: snapshot.maxDrawdownPct,
      roiPct: snapshot.roiPct,
    }));

    return NextResponse.json({
      ok: true,
      participant: {
        token: participant.token,
        displayName: participant.displayName,
        csvUrl: participant.csvUrl,
        fxSource: participant.fxSource,
        isActive: participant.isActive,
        stats: participant.stats,
        lastSyncAt: participant.lastSyncAt?.toISOString() ?? null,
        createdAt: participant.createdAt.toISOString(),
        updatedAt: participant.updatedAt.toISOString(),
      },
      snapshots,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to load participant';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
