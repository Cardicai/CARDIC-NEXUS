import { NextResponse } from 'next/server';

import { EmailError, plainTextToHtml, sendEmail } from '@/lib/email';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const code = String(formData.get('code') ?? '').trim();
    const tradingview = String(formData.get('tradingview') ?? '').trim();

    if (!code || !tradingview) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'realcardic1@gmail.com';
    const bodyText = `Redeem code submission\n\nCode: ${code}\nTradingView: ${tradingview}`;

    await sendEmail({
      to: adminEmail,
      subject: 'New Redeem Code Submission',
      text: bodyText,
      html: plainTextToHtml(bodyText),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof EmailError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.status ?? 502 }
      );
    }

    return NextResponse.json({ success: false }, { status: 500 });
  }
}
