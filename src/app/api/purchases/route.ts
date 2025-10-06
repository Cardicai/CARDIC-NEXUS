import { NextResponse } from 'next/server';

import { isValidReferralFormat, sanitizeEmail, sanitizeName } from '@/lib/code';
import { prisma } from '@/lib/db';

function normalizeReferralCode(code: string): string {
  return code.trim().toUpperCase();
}

export async function POST(request: Request) {
  try {
    let payload: unknown;
    try {
      payload = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON body.' },
        { status: 400 }
      );
    }

    const {
      customerName: rawCustomerName,
      customerEmail: rawCustomerEmail,
      product: rawProduct,
      amountCents,
      referralCode: rawReferralCode,
    } = (payload ?? {}) as {
      customerName?: unknown;
      customerEmail?: unknown;
      product?: unknown;
      amountCents?: unknown;
      referralCode?: unknown;
    };

    if (
      typeof rawCustomerName !== 'string' ||
      typeof rawCustomerEmail !== 'string' ||
      typeof rawProduct !== 'string'
    ) {
      return NextResponse.json(
        { success: false, error: 'Missing required purchase fields.' },
        { status: 400 }
      );
    }

    if (typeof amountCents !== 'number' || !Number.isInteger(amountCents)) {
      return NextResponse.json(
        { success: false, error: 'Amount must be an integer in cents.' },
        { status: 400 }
      );
    }

    if (amountCents <= 0) {
      return NextResponse.json(
        { success: false, error: 'Amount must be greater than zero.' },
        { status: 400 }
      );
    }

    const customerName = sanitizeName(rawCustomerName);
    const customerEmail = sanitizeEmail(rawCustomerEmail);
    const product = rawProduct.trim();

    if (!customerName) {
      return NextResponse.json(
        { success: false, error: 'Customer name is required.' },
        { status: 400 }
      );
    }

    if (!customerEmail || !customerEmail.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Customer email is invalid.' },
        { status: 400 }
      );
    }

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product name is required.' },
        { status: 400 }
      );
    }

    let referralId: string | undefined;
    let referralCode: string | undefined;

    if (typeof rawReferralCode === 'string' && rawReferralCode.trim()) {
      const normalizedCode = normalizeReferralCode(rawReferralCode);
      const [basePart, alphaPart, ...suffixParts] = normalizedCode.split('-');
      const canonicalCode = `${basePart ?? ''}-${alphaPart ?? ''}`;

      if (!basePart || !alphaPart || !isValidReferralFormat(canonicalCode)) {
        return NextResponse.json(
          { success: false, error: 'Referral code format is invalid.' },
          { status: 400 }
        );
      }

      const referral = await prisma.referral.findUnique({
        where: { code: normalizedCode },
        select: { id: true },
      });

      if (!referral) {
        return NextResponse.json(
          { success: false, error: 'Referral code not found.' },
          { status: 404 }
        );
      }

      if (
        suffixParts.length > 0 &&
        !suffixParts.every((part) => /^\d+$/.test(part))
      ) {
        return NextResponse.json(
          { success: false, error: 'Referral code suffix is invalid.' },
          { status: 400 }
        );
      }

      referralId = referral.id;
      referralCode = normalizedCode;
    }

    const purchaseData: Parameters<typeof prisma.purchase.create>[0]['data'] = {
      customerName,
      customerEmail,
      product,
      amountCents,
      ...(referralCode ? { referralCode } : {}),
      ...(referralId ? { referralId } : {}),
    };

    if (referralId && referralCode) {
      const [createdPurchase] = await prisma.$transaction([
        prisma.purchase.create({
          data: purchaseData,
          select: { id: true },
        }),
        prisma.referral.update({
          where: { id: referralId },
          data: { conversions: { increment: 1 } },
        }),
      ]);

      return NextResponse.json(
        { success: true, purchaseId: createdPurchase.id },
        { status: 201 }
      );
    }

    const purchase = await prisma.purchase.create({
      data: purchaseData,
      select: { id: true },
    });

    return NextResponse.json(
      { success: true, purchaseId: purchase.id },
      { status: 201 }
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[purchases:POST]', error);
    return NextResponse.json(
      { success: false, error: 'Unexpected error creating purchase.' },
      { status: 500 }
    );
  }
}
