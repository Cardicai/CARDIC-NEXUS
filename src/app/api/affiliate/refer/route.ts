import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body?.name ?? '').trim();
    const email = String(body?.email ?? '').trim();
    const code = String(body?.code ?? '').trim();
    const shareLink = String(body?.shareLink ?? '').trim();
    const timestamp = new Date().toISOString();

    if (!name || !email || !code) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // eslint-disable-next-line no-console
    console.log('Affiliate referral minted', {
      name,
      email,
      code,
      shareLink,
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

    const emailBody = `New affiliate referral minted\n\nName: ${name}\nEmail: ${email}\nReferral Code: ${code}\nShare Link: ${
      shareLink || 'N/A'
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
        subject: 'New Affiliate Referral Code Minted',
        text: emailBody,
      }),
    });

    if (!res.ok) {
      throw new Error('Failed to send email');
    }

    return NextResponse.json({ success: true, timestamp });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Affiliate referral error', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
