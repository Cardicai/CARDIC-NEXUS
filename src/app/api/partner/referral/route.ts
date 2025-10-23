import { NextResponse } from 'next/server';

import { sendEmail } from '@/lib/email';
import { plainTextToHtml } from '@/lib/email-extras';

export const runtime = 'nodejs';

type ReferralRequest = {
  name?: string;
  email?: string;
};

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function generateReferralCode() {
  const randomDigits = Array.from({ length: 4 }, () =>
    Math.floor(Math.random() * 10)
  ).join('');
  const randomLetters = Array.from(
    { length: 3 },
    () => LETTERS[Math.floor(Math.random() * LETTERS.length)]
  ).join('');
  return `NEX${randomDigits}-${randomLetters}`;
}

function isValidEmail(value: string) {
  return /\S+@\S+\.\S+/.test(value);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ReferralRequest;
    const name = (body.name || '').trim();
    const email = (body.email || '').trim().toLowerCase();

    if (!name || !email) {
      return NextResponse.json(
        { message: 'Name and email are required.' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { message: 'Enter a valid email address.' },
        { status: 400 }
      );
    }

    const code = generateReferralCode();
    const siteUrl = (
      process.env.SITE_URL || 'https://www.cardicnex.us'
    ).replace(/\/$/, '');
    const link = `${siteUrl}/?ref=${code}`;

    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      return NextResponse.json(
        { message: 'Missing ADMIN_EMAIL environment variable' },
        { status: 500 }
      );
    }

    const adminSubject = `New referral minted — ${name}`;
    const adminText = [
      'A new referral code has been minted.',
      `Name: ${name}`,
      `Email: ${email}`,
      `Referral Code: ${code}`,
      `Referral Link: ${link}`,
      '',
      'Please log the referral and ensure tracking is active.',
    ].join('\n');

    const adminResult = await sendEmail({
      to: adminEmail,
      subject: adminSubject,
      text: adminText,
      html: plainTextToHtml(adminText),
    });

    if (!adminResult.ok) {
      return NextResponse.json(
        { message: 'Failed to send admin email.' },
        { status: 502 }
      );
    }

    const userSubject = 'Your Cardic Nexus referral code';
    const userText = [
      `Hi ${name},`,
      '',
      'Welcome to the Cardic Nexus referral desk. Here are your details:',
      `Referral code: ${code}`,
      `Referral link: ${link}`,
      '',
      'Share the link and code across your channels. Each active subscription tagged to you earns a 35% lifetime share.',
      '',
      'Need anything? Reply to this email and the partnerships desk will help.',
      '',
      '— Cardic Nexus Partnerships',
    ].join('\n');

    const userResult = await sendEmail({
      to: email,
      subject: userSubject,
      text: userText,
      html: plainTextToHtml(userText),
    });

    if (!userResult.ok) {
      return NextResponse.json(
        { message: 'Failed to send confirmation email.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ code, link });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Partner referral email error', error);
    return NextResponse.json({ message: 'Unexpected error.' }, { status: 500 });
  }
}
