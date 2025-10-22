import { NextResponse } from 'next/server';

import { sendEmail } from '@/lib/email';
import { plainTextToHtml } from '@/lib/email-extras';

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

    const emailResult = await sendEmail({
      to: adminEmail,
      subject: 'New Redeem Code Submission',
      text: bodyText,
      html: plainTextToHtml(bodyText),
    });

    if (!emailResult.ok) {
      return NextResponse.json(
        { success: false, error: 'Failed to send email' },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Redeem email error', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
