import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const fullName = String(body?.fullName ?? '').trim();
    const email = String(body?.email ?? '').trim();
    const product = String(body?.product ?? '').trim();
    const amount = String(body?.amount ?? '').trim();
    const referralCode = String(body?.referralCode ?? '').trim();
    const timestamp = new Date().toISOString();

    if (!fullName || !email || !product || !amount) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // eslint-disable-next-line no-console
    console.log('Affiliate checkout submission', {
      fullName,
      email,
      product,
      amount,
      referralCode,
      timestamp,
    });

    const adminEmail = process.env.ADMIN_EMAIL || 'realcardic1@gmail.com';
    const fromEmail = process.env.FROM_EMAIL;
    const apiKey = process.env.RESEND_API_KEY;

    if (!fromEmail || !apiKey) {
      return NextResponse.json(
        { success: false, error: 'Email service not configured' },
        { status: 500 }
      );
    }

    const emailBody = `Affiliate checkout submission\n\nName: ${fullName}\nEmail: ${email}\nProduct: ${product}\nAmount: ${amount}\nReferral Code: ${
      referralCode || 'N/A'
    }\nTimestamp: ${timestamp}`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: adminEmail,
        subject: 'Affiliate Checkout Logged',
        text: emailBody,
      }),
    });

    if (!res.ok) {
      throw new Error('Failed to send email');
    }

    return NextResponse.json({ success: true, timestamp });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Affiliate checkout error', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
