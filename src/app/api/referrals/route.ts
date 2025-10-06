import { NextResponse } from 'next/server';

import {
  generateBaseCode,
  personalizeCode,
  sanitizeEmail,
  sanitizeName,
} from '@/lib/code';
import { prisma } from '@/lib/db';

const parsedRateLimit = Number.parseInt(
  process.env.RATE_LIMIT_REFERRAL_PER_MIN ?? '15',
  10
);

const RATE_LIMIT =
  Number.isFinite(parsedRateLimit) && parsedRateLimit > 0
    ? parsedRateLimit
    : 15;

type RateLimitEntry = {
  count: number;
  expiresAt: number;
};

type RateLimitStore = Map<string, RateLimitEntry>;

const globalRateLimit = (
  globalThis as unknown as {
    __cardicReferralRateLimit?: RateLimitStore;
  }
).__cardicReferralRateLimit;

const rateLimitStore: RateLimitStore =
  globalRateLimit ?? new Map<string, RateLimitEntry>();

if (!globalRateLimit) {
  (
    globalThis as unknown as { __cardicReferralRateLimit: RateLimitStore }
  ).__cardicReferralRateLimit = rateLimitStore;
}

function getClientIdentifier(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() ?? 'anonymous';
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return 'anonymous';
}

function applyRateLimit(identifier: string): boolean {
  const now = Date.now();
  const windowMs = 60_000;
  const entry = rateLimitStore.get(identifier);

  if (!entry || entry.expiresAt <= now) {
    rateLimitStore.set(identifier, {
      count: 1,
      expiresAt: now + windowMs,
    });
    return true;
  }

  if (entry.count >= RATE_LIMIT) {
    return false;
  }

  entry.count += 1;
  rateLimitStore.set(identifier, entry);
  return true;
}

export async function POST(request: Request) {
  try {
    const identifier = getClientIdentifier(request);
    if (!applyRateLimit(identifier)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many requests. Please try again shortly.',
        },
        { status: 429 }
      );
    }

    let payload: unknown;
    try {
      payload = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON body.' },
        { status: 400 }
      );
    }

    const { name: rawName, email: rawEmail } = (payload ?? {}) as {
      name?: unknown;
      email?: unknown;
    };

    if (typeof rawName !== 'string' || typeof rawEmail !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Name and email are required.' },
        { status: 400 }
      );
    }

    const name = sanitizeName(rawName);
    const email = sanitizeEmail(rawEmail);

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Please provide your full name.' },
        { status: 400 }
      );
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const baseCode = generateBaseCode();
    const basePersonalized = personalizeCode(baseCode, name);

    let finalCode = basePersonalized;
    let suffix = 0;
    // safety cap to avoid infinite loops in extreme collision scenarios
    const maxAttempts = 50;

    while (suffix <= maxAttempts) {
      const existing = await prisma.referral.findUnique({
        where: { code: finalCode },
        select: { id: true },
      });

      if (!existing) {
        break;
      }

      suffix += 1;
      finalCode = `${basePersonalized}-${suffix}`;
    }

    if (suffix > maxAttempts) {
      return NextResponse.json(
        {
          success: false,
          error: 'Unable to generate a unique referral code. Please try again.',
        },
        { status: 500 }
      );
    }

    const referral = await prisma.referral.create({
      data: {
        name,
        email,
        baseCode,
        code: finalCode,
      },
      select: {
        id: true,
        code: true,
        name: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        referral,
      },
      { status: 201 }
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[referrals:POST]', error);
    return NextResponse.json(
      { success: false, error: 'Unexpected error creating referral.' },
      { status: 500 }
    );
  }
}
