import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const name = String(formData.get('name') || '');
    const email = String(formData.get('email') || '');
    const contact = String(formData.get('contact') || '');
    const productType = String(formData.get('productType') || '');
    const tradingview = String(formData.get('tradingview') || '');
    const notes = String(formData.get('notes') || '');
    const proof = formData.get('proof') as File | null;

    const attachments = [] as Array<{ filename: string; content: string }>;
    if (proof) {
      const buffer = Buffer.from(await proof.arrayBuffer());
      attachments.push({
        filename: proof.name,
        content: buffer.toString('base64'),
      });
    }

    const payload = {
      from: process.env.FROM_EMAIL as string,
      to: process.env.ADMIN_EMAIL as string,
      subject: `Payment Proof from ${name}`,
      reply_to: email,
      text: `Name: ${name}\nEmail: ${email}\nContact: ${contact}\nProduct: ${productType}\nTradingView: ${tradingview}\nNotes: ${notes}`,
      attachments,
    };

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      return NextResponse.json({ success: false }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
