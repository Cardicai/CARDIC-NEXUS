import { NextResponse } from 'next/server';

import { EmailAttachment, EmailError, sendEmail } from '@/lib/email';

export const runtime = 'nodejs';

function isValidEmail(value: string) {
  return /\S+@\S+\.\S+/.test(value);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const legalName = String(formData.get('legalName') || '').trim();
    const email = String(formData.get('email') || '')
      .trim()
      .toLowerCase();
    const country = String(formData.get('country') || '').trim();
    const messenger = String(formData.get('messenger') || '').trim();
    const audience = String(formData.get('audience') || '').trim();
    const reach = String(formData.get('reach') || '').trim();
    const payout = String(formData.get('payout') || '').trim();
    const links = String(formData.get('links') || '').trim();
    const pitch = String(formData.get('pitch') || '').trim();
    const agreed = String(formData.get('agreement') || '').trim() === 'on';

    const governmentId = formData.get('governmentId') as File | null;
    const proofOfAddress = formData.get('proofOfAddress') as File | null;

    if (
      !legalName ||
      !email ||
      !country ||
      !audience ||
      !reach ||
      !payout ||
      !pitch
    ) {
      return NextResponse.json(
        { message: 'Please fill in all required fields.' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { message: 'Enter a valid email address.' },
        { status: 400 }
      );
    }

    if (!agreed) {
      return NextResponse.json(
        { message: 'You must agree to the Partner Terms.' },
        { status: 400 }
      );
    }

    const attachments: EmailAttachment[] = [];

    const fileDetails: string[] = [];

    if (governmentId) {
      const buffer = Buffer.from(await governmentId.arrayBuffer());
      attachments.push({
        filename: governmentId.name,
        content: buffer.toString('base64'),
      });
      fileDetails.push(
        `Government ID: ${governmentId.name} (${governmentId.type || 'file'})`
      );
    } else {
      fileDetails.push('Government ID: not provided');
    }

    if (proofOfAddress) {
      const buffer = Buffer.from(await proofOfAddress.arrayBuffer());
      attachments.push({
        filename: proofOfAddress.name,
        content: buffer.toString('base64'),
      });
      fileDetails.push(
        `Proof of address: ${proofOfAddress.name} (${
          proofOfAddress.type || 'file'
        })`
      );
    } else {
      fileDetails.push('Proof of address: not provided');
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      throw new EmailError('Missing ADMIN_EMAIL environment variable');
    }

    const adminSubject = `New NP application — ${legalName}`;
    const adminText = [
      'A new Nexus Partner (NP) application has been submitted.',
      `Legal name: ${legalName}`,
      `Email: ${email}`,
      `Country: ${country}`,
      `Telegram/WhatsApp: ${messenger || 'Not provided'}`,
      `Audience or niche: ${audience}`,
      `Estimated monthly reach: ${reach}`,
      `Preferred payout method: ${payout}`,
      `Links: ${links || 'Not provided'}`,
      '',
      'Pitch:',
      pitch,
      '',
      'Files:',
      ...fileDetails,
    ].join('\n');

    await sendEmail({
      to: adminEmail,
      subject: adminSubject,
      text: adminText,
      attachments: attachments.length ? attachments : undefined,
    });

    const userSubject = 'We received your Cardic Nexus NP application';
    const userText = [
      `Hi ${legalName},`,
      '',
      'Thanks for applying to become a Nexus Partner (NP) with Cardic Nexus.',
      'Our partnerships team is reviewing your submission and will follow up shortly.',
      '',
      'What we received:',
      `• Country: ${country}`,
      `• Audience or niche: ${audience}`,
      `• Estimated monthly reach: ${reach}`,
      `• Preferred payout method: ${payout}`,
      '',
      'We will reach out if we need any additional details. You can reply to this email any time for updates.',
      '',
      '— Cardic Nexus Partnerships',
    ].join('\n');

    await sendEmail({
      to: email,
      subject: userSubject,
      text: userText,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof EmailError && error.status === 429) {
      return NextResponse.json(
        { message: 'Too many attempts — try again shortly.' },
        { status: 429 }
      );
    }

    if (error instanceof EmailError) {
      return NextResponse.json(
        { message: 'Failed to send emails.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Unexpected error.' }, { status: 500 });
  }
}
