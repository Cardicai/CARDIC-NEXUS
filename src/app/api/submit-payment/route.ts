import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const name = String(form.get('name') || '');
    const email = String(form.get('email') || '');
    const contact = String(form.get('contact') || '');
    const currency = String(form.get('currency') || '');
    const productType = String(form.get('productType') || '');
    const tradingview = String(form.get('tradingview') || '');
    const notes = String(form.get('notes') || '');
    const adminEmail = String(
      form.get('adminEmail') ||
        process.env.ADMIN_EMAIL ||
        'realcardic1@gmail.com'
    );
    const file = form.get('proof') as File | null;

    const subject = `Payment Proof – ${productType || 'Product'} – ${email}`;
    const text = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Contact: ${contact}`,
      `Currency: ${currency}`,
      `Product: ${productType}`,
      `TradingView: ${tradingview}`,
      `Notes: ${notes}`,
    ].join('\n');

    const attachments: { filename: string; content: Buffer }[] = [];
    if (file && typeof file.arrayBuffer === 'function') {
      const buf = Buffer.from(await file.arrayBuffer());
      attachments.push({ filename: file.name || 'proof', content: buf });
    }

    const r = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'Cardic Nexus <no-reply@example.com>',
      to: [adminEmail],
      subject,
      text,
      attachments,
    });

    const errorResp = r as { error?: { message: string } };
    if (errorResp.error)
      return new NextResponse(`Email error: ${errorResp.error.message}`, {
        status: 500,
      });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Server error';
    return new NextResponse(message, { status: 500 });
  }
}
