import { NextResponse } from 'next/server';

import { EmailError, sendEmail } from '@/lib/email';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const tradingview = String(formData.get('tradingview') || '').trim();
    const gamingTag = String(formData.get('gamingTag') || '').trim();

    if (!tradingview) {
      return NextResponse.json(
        { success: false, message: 'TradingView username is required.' },
        { status: 400 }
      );
    }

    const submittedAt = new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'UTC',
    }).format(new Date());

    const text = [
      'New free trial request',
      `TradingView Username: ${tradingview}`,
      `Gaming Tag: ${gamingTag || 'Not provided'}`,
      `Submitted: ${submittedAt} (UTC)`,
    ].join('\n');

    await sendEmail({
      to: process.env.ADMIN_EMAIL || 'realcardic1@gmail.com',
      subject: 'Free Trial Request',
      text,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof EmailError && error.status === 429) {
      return NextResponse.json(
        { success: false, message: 'Too many requests. Try again later.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Failed to send request.' },
      { status: 500 }
    );
  }
}
