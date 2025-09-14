import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const tradingview = formData.get('tradingview') as string;
    const contact = formData.get('contact') as string | null;
    const notes = formData.get('notes') as string | null;
    const txHash = formData.get('txHash') as string | null;
    const proof = formData.get('proof') as File | null;

    if (!fullName || !email || !tradingview || !proof) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const arrayBuffer = await proof.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    const html = `
      <p><strong>Full Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>TradingView Username:</strong> ${tradingview}</p>
      <p><strong>Contact:</strong> ${contact || ''}</p>
      <p><strong>Notes:</strong> ${notes || ''}</p>
      <p><strong>Transaction Hash/ID:</strong> ${txHash || ''}</p>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.FROM_EMAIL,
        to: process.env.ADMIN_EMAIL,
        subject: 'New Crypto Payment Submission',
        html,
        attachments: [
          {
            filename: proof.name,
            content: base64,
          },
        ],
      }),
    });

    if (!res.ok) {
      await res.text();
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
