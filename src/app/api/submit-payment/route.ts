import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const token = String(formData.get('g-recaptcha-response') || '');
    if (!token) {
      return new NextResponse('Captcha missing.', { status: 400 });
    }

    const verify = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${encodeURIComponent(
          process.env.RECAPTCHA_SECRET || ''
        )}&response=${encodeURIComponent(token)}`,
      }
    );
    const result = await verify.json();
    if (!result.success) {
      return new NextResponse('Captcha failed.', { status: 400 });
    }

    const name = String(formData.get('name') || '');
    const email = String(formData.get('email') || '');
    const tradingview = String(formData.get('tradingview') || '');
    const contact = String(formData.get('contact') || '');
    const productType = String(formData.get('productType') || '');
    const notes = String(formData.get('notes') || '');
    const file = formData.get('proof') as File | null;

    const fieldsText = `Name: ${name}\nEmail: ${email}\nTradingView: ${tradingview}\nContact: ${contact}\nProduct Type: ${productType}\nNotes: ${notes}`;

    const attachments: { filename: string; content: string }[] = [];
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      attachments.push({
        filename: file.name,
        content: buffer.toString('base64'),
      });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: process.env.FROM_EMAIL,
        to: process.env.ADMIN_EMAIL || 'realcardic1@gmail.com',
        subject: 'Crypto Payment Submission',
        text: fieldsText,
        attachments,
      }),
    });

    if (!res.ok) {
      throw new Error('Failed to send email');
    }

    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Server error';
    return new NextResponse(message, { status: 500 });
  }
}
