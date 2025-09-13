export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  const body = await request.json();

  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: process.env.FROM_EMAIL ?? 'no-reply@example.com',
    to: process.env.ADMIN_EMAIL ?? '',
    subject: 'Payment submitted',
    text: JSON.stringify(body),
  });

  return NextResponse.json({ message: 'Email sent' });
}
