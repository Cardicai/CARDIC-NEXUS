export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { Buffer } from 'node:buffer';
import { Resend } from 'resend';

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;

  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: process.env.FROM_EMAIL || '',
    to: process.env.ADMIN_EMAIL || '',
    subject: 'Payment submission',
    html: '<p>Payment details attached.</p>',
    attachments: file
      ? [
          {
            filename: file.name,
            content: Buffer.from(await file.arrayBuffer()).toString('base64'),
          },
        ]
      : [],
  });

  return NextResponse.json({ success: true });
}
