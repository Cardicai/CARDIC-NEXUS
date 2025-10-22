import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = String(formData.get('name') || '');
    const email = String(formData.get('email') || '');
    const tradingview = String(formData.get('tradingview') || '');
    const contact = String(formData.get('contact') || '');
    const txHash = String(formData.get('txHash') || '');
    const notes = String(formData.get('notes') || '');
    const file = formData.get('proof') as File | null;

    const fieldsText = `Name: ${name}\nEmail: ${email}\nTradingView: ${tradingview}\nContact: ${contact}\nTxHash: ${txHash}\nNotes: ${notes}`;

    const attachments: { filename: string; content: string }[] = [];
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      attachments.push({
        filename: file.name,
        content: buffer.toString('base64'),
      });
    }

    const adminEnv =
      process.env.ADMIN_EMAIL?.split(',')
        .map((email) => email.trim())
        .filter(Boolean) ?? [];
    if (adminEnv.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'ADMIN_EMAIL environment variable is not set.',
        },
        { status: 500 }
      );
    }

    const recipients = adminEnv.length === 1 ? adminEnv[0] : adminEnv;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: process.env.FROM_EMAIL,
        to: recipients,
        subject: 'Crypto Payment Submission',
        text: fieldsText,
        attachments,
      }),
    });

    if (!res.ok) {
      throw new Error('Failed to send email');
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
