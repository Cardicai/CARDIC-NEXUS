/* eslint-disable no-console */
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { EmailError, sendEmail } from '@/lib/email';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';
export const maxDuration = 60;

const TOURNAMENT_NAME = 'Cardic Nexus Tournament';
const SUCCESS_MESSAGE = "🎉 YOU'RE IN! 🥳 Check your email for more details.";

const registrationSchema = z.object({
  name: z.string().min(1, 'Full name is required.'),
  email: z.string().email('A valid email address is required.'),
  contact: z
    .string()
    .min(1, 'Contact information is required (phone or Telegram).'),
  country: z.string().min(1, 'Country is required.'),
  proofUrl: z.string().url('Proof upload is missing a URL.'),
});

function sanitize(value: string) {
  return value.trim();
}

function buildAdminHtml(data: z.infer<typeof registrationSchema>) {
  return `
    <div style="font-family:Inter,Arial,sans-serif;font-size:15px;line-height:1.6;color:#0f172a;">
      <h1 style="margin:0 0 12px;font-size:20px;color:#0f172a;">New Cardic Nexus Tournament registration</h1>
      <p style="margin:0 0 16px;">A new participant has submitted their details and proof of eligibility.</p>
      <table style="width:100%;border-collapse:collapse;margin:0;">
        <tbody>
          <tr>
            <td style="padding:6px 0;font-weight:600;width:140px;">Name</td>
            <td style="padding:6px 0;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;font-weight:600;">Email</td>
            <td style="padding:6px 0;">${data.email}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;font-weight:600;">Contact</td>
            <td style="padding:6px 0;">${data.contact}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;font-weight:600;">Country</td>
            <td style="padding:6px 0;">${data.country}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;font-weight:600;">Proof link</td>
            <td style="padding:6px 0;"><a href="${data.proofUrl}" style="color:#0284c7;">View uploaded proof</a></td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

function buildAdminText(data: z.infer<typeof registrationSchema>) {
  return `New Cardic Nexus Tournament registration\n\nName: ${data.name}\nEmail: ${data.email}\nContact: ${data.contact}\nCountry: ${data.country}\nProof: ${data.proofUrl}`;
}

function buildUserHtml(name: string) {
  return `
    <div style="font-family:Inter,Arial,sans-serif;font-size:15px;line-height:1.6;color:#e2e8f0;background:#020617;padding:24px;border-radius:16px;">
      <h1 style="margin:0 0 16px;font-size:22px;color:#38bdf8;">${TOURNAMENT_NAME}</h1>
      <p style="margin:0 0 12px;color:#f1f5f9;">Hi ${name},</p>
      <p style="margin:0 0 12px;color:#f1f5f9;">🎉 YOU’RE IN! Your registration for the Cardic Nexus Tournament has been received.</p>
      <p style="margin:0 0 12px;color:#f1f5f9;">You’ll receive your dashboard link and account credentials soon. In the meantime, you can bookmark your dashboard:</p>
      <p style="margin:0 0 18px;"><a href="https://cardicnex.us/dashboard" style="color:#38bdf8;">Cardic Tournament Dashboard</a></p>
      <p style="margin:0;color:#94a3b8;">— Cardic Nexus Team</p>
    </div>
  `;
}

function buildUserText(name: string) {
  return `Hi ${name}, YOU’RE IN! Your registration for the Cardic Nexus Tournament has been received. You’ll receive your dashboard link and account credentials soon. Access the dashboard at https://cardicnex.us/dashboard when it becomes available.`;
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch (error) {
    console.error('Failed to parse registration JSON', error);
    return NextResponse.json(
      { error: 'Invalid registration payload. Please submit the form again.' },
      { status: 400 }
    );
  }

  const parsed = registrationSchema.safeParse(payload);
  if (!parsed.success) {
    const firstIssue =
      parsed.error.issues.at(0)?.message ?? 'Invalid registration payload.';
    return NextResponse.json({ error: firstIssue }, { status: 400 });
  }

  const data = {
    name: sanitize(parsed.data.name),
    email: sanitize(parsed.data.email),
    contact: sanitize(parsed.data.contact),
    country: sanitize(parsed.data.country),
    proofUrl: parsed.data.proofUrl,
  };

  if (!data.name || !data.email || !data.contact || !data.country) {
    return NextResponse.json(
      {
        error:
          'All fields are required. Please complete the form before submitting.',
      },
      { status: 400 }
    );
  }

  try {
    await prisma.registration.create({
      data,
    });
  } catch (error) {
    console.error('Failed to save tournament registration', error);
    return NextResponse.json(
      { error: 'Could not save your registration. Please try again shortly.' },
      { status: 500 }
    );
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const fromEmail = process.env.FROM_EMAIL;
  const resendKey = process.env.RESEND_API_KEY;

  if (!adminEmail || !fromEmail || !resendKey) {
    console.error('Email configuration incomplete', {
      hasAdminEmail: Boolean(adminEmail),
      hasFromEmail: Boolean(fromEmail),
      hasResendKey: Boolean(resendKey),
    });
    return NextResponse.json(
      { error: 'Email configuration is incomplete. Please try again shortly.' },
      { status: 500 }
    );
  }

  try {
    await Promise.all([
      sendEmail({
        to: adminEmail,
        subject: `New ${TOURNAMENT_NAME} registration`,
        text: buildAdminText(data),
        html: buildAdminHtml(data),
      }),
      sendEmail({
        to: data.email,
        subject: `${TOURNAMENT_NAME} registration confirmed`,
        text: buildUserText(data.name),
        html: buildUserHtml(data.name),
      }),
    ]);
  } catch (error) {
    const message =
      error instanceof EmailError
        ? error.message
        : 'We could not send confirmation emails at this time.';
    console.error('Failed to dispatch tournament emails', error);
    return NextResponse.json({ error: message }, { status: 502 });
  }

  return NextResponse.json({ ok: true, message: SUCCESS_MESSAGE });
}
