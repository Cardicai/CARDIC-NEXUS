import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';

import { ensureAdminAuthorized } from '../_shared';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const FXBLUE_PREFIX = 'https://www.fxblue.com/users/';

const linkSchema = z.object({
  token: z.string().min(1),
  csvUrl: z.string().url(),
  displayName: z.string().trim().min(1).max(160).optional(),
});

function isValidCsvUrl(url: string) {
  if (!url.startsWith(FXBLUE_PREFIX)) return false;
  const [base] = url.split('?');
  return base.endsWith('/csv');
}

export async function POST(request: NextRequest) {
  const authError = ensureAdminAuthorized(request);
  if (authError) return authError;

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  const parsed = linkSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'Invalid payload', issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const token = parsed.data.token.trim();
  const csvUrl = parsed.data.csvUrl.trim();
  const displayName = parsed.data.displayName?.trim();

  if (!isValidCsvUrl(csvUrl)) {
    return NextResponse.json(
      {
        ok: false,
        error:
          'csvUrl must start with https://www.fxblue.com/users/ and end with /csv',
      },
      { status: 400 }
    );
  }

  try {
    const participant = await prisma.participant.upsert({
      where: { token },
      update: {
        csvUrl,
        displayName: displayName ?? null,
        fxSource: 'fxblue-csv',
        isActive: true,
      },
      create: {
        token,
        csvUrl,
        displayName: displayName ?? null,
      },
    });

    return NextResponse.json({ ok: true, participant });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to link participant';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
