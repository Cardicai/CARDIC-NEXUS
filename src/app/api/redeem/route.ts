import { NextResponse } from 'next/server';

import { parseEmailRecipients } from '@/lib/emailRecipients';

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

    const adminRecipients = parseEmailRecipients(process.env.ADMIN_EMAIL);
    const fromEmail = process.env.FROM_EMAIL;
    const apiKey = process.env.RESEND_API_KEY;

    if (!fromEmail || !apiKey || adminRecipients.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Email service not configured' },
        { status: 500 }
      );
    }

    const text = `Redeem code submission\n\nCode: ${code}\nTradingView: ${tradingview}`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: adminRecipients.length === 1 ? adminRecipients[0] : adminRecipients,
        subject: 'New Redeem Code Submission',
        text,
      }),
    });

    if (!res.ok) {
      throw new Error('Failed to send email');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
