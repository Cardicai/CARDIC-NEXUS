import { NextResponse } from 'next/server';

import { EmailError, sendEmail } from '@/lib/email';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const tradingview = String(formData.get('tradingview') || '').trim();
    const gmail = String(formData.get('gmail') || '').trim();

    if (!tradingview) {
      return NextResponse.json(
        { success: false, message: 'TradingView username is required.' },
        { status: 400 }
      );
    }

    if (!gmail) {
      return NextResponse.json(
        { success: false, message: 'Gmail is required.' },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@gmail\.com$/i.test(gmail)) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid Gmail address.' },
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
      `Gmail: ${gmail}`,
      `Submitted: ${submittedAt} (UTC)`,
    ].join('\n');

    await sendEmail({
      to: process.env.ADMIN_EMAIL || 'realcardic1@gmail.com',
      subject: 'Free Trial Request',
      text,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to submit trial request', error);

    if (error instanceof EmailError) {
      if (error.status === 429) {
        return NextResponse.json(
          { success: false, message: 'Too many requests. Try again later.' },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: error.message.includes('Email service not configured')
            ? 'Email service is not configured. Please contact support.'
            : 'Failed to send request.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Failed to send request.' },
      { status: 500 }
    );
  }
}
