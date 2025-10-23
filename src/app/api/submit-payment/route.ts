import { NextResponse } from 'next/server';

import {
  EmailAttachment,
  plainTextToHtml,
  sendEmailWithAttachments,
} from '@/lib/email-extras';

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

    const attachments: EmailAttachment[] = [];
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      attachments.push({
        filename: file.name,
        content: buffer.toString('base64'),
        contentType: file.type || undefined,
      });
    }

    const adminResult = await sendEmailWithAttachments({
      to: process.env.ADMIN_EMAIL?.trim() || 'realcardic1@gmail.com',
      subject: 'Crypto Payment Submission',
      text: fieldsText,
      html: plainTextToHtml(fieldsText),
      attachments: attachments.length ? attachments : undefined,
    });

    if (!adminResult.ok) {
      return NextResponse.json(
        { success: false, error: 'Failed to send email' },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Submit payment email error', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
