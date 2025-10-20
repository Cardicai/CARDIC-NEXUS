/* eslint-disable no-console */
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { EmailError, sendEmail } from '@/lib/email';
import type { TournamentRegistrationInput } from '@/lib/tournament-registration-store';
import { createTournamentRegistration } from '@/lib/tournament-registration-store';

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
  proofKey: z.string().min(1, 'Proof upload key is missing.'),
  proofOriginalName: z.string().min(1, 'Proof filename is missing.'),
  proofMimeType: z.string().min(1, 'Proof file type is missing.'),
  proofFileSize: z
    .number({ invalid_type_error: 'Proof file size is missing.' })
    .int()
    .positive('Proof file size must be greater than zero.'),
});

function sanitize(value: string) {
  return value.trim();
}

function formatFileSize(bytes: number) {
  if (Number.isNaN(bytes) || bytes < 0) return 'Unknown size';
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
  if (bytes >= 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${bytes} B`;
}

function formatAdminHtml(data: TournamentRegistrationInput) {
  const readableSize = formatFileSize(data.proof.fileSize);
  return `
    <div style="font-family:Inter,Arial,sans-serif;font-size:15px;line-height:1.6;color:#0f172a;">
      <h1 style="margin:0 0 12px;font-size:20px;color:#0f172a;">New Cardic Nexus Tournament registration</h1>
      <p style="margin:0 0 16px;">A new participant has submitted the tournament form while the site is under maintenance.</p>
      <table style="width:100%;border-collapse:collapse;margin:0;">
        <tbody>
          <tr>
            <td style="padding:6px 0;font-weight:600;width:160px;">Name</td>
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
            <td style="padding:6px 0;font-weight:600;">Proof upload</td>
            <td style="padding:6px 0;">
              ${data.proof.originalName} (${readableSize})<br />
              <a href="${data.proof.url}" style="color:#0284c7;">View uploaded proof</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

function formatAdminText(data: TournamentRegistrationInput) {
  const readableSize = formatFileSize(data.proof.fileSize);
  return `New Cardic Nexus Tournament registration\n\nName: ${data.name}\nEmail: ${data.email}\nContact: ${data.contact}\nCountry: ${data.country}\nProof upload: ${data.proof.originalName} (${readableSize})\nProof URL: ${data.proof.url}`;
}

function formatUserHtml(name: string) {
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

function formatUserText(name: string) {
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

  const normalizedName = sanitize(parsed.data.name);
  const normalizedEmail = sanitize(parsed.data.email);
  const normalizedContact = sanitize(parsed.data.contact);
  const normalizedCountry = sanitize(parsed.data.country);

  if (
    !normalizedName ||
    !normalizedEmail ||
    !normalizedContact ||
    !normalizedCountry
  ) {
    return NextResponse.json(
      {
        error:
          'All fields are required. Please complete the form before submitting.',
      },
      { status: 400 }
    );
  }

  const registration: TournamentRegistrationInput = {
    name: normalizedName,
    email: normalizedEmail,
    contact: normalizedContact,
    country: normalizedCountry,
    proof: {
      url: parsed.data.proofUrl,
      originalName: parsed.data.proofOriginalName,
      mimeType: parsed.data.proofMimeType,
      fileSize: parsed.data.proofFileSize,
      storageKey: parsed.data.proofKey,
    },
  };

  try {
    await createTournamentRegistration(registration);
  } catch (error) {
    console.error('Failed to save tournament registration', error);
    return NextResponse.json(
      { error: 'Could not save your registration. Please try again shortly.' },
      { status: 500 }
    );
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const siteEmail = process.env.FROM_EMAIL;
  const resendKey = process.env.RESEND_API_KEY;

  if (!adminEmail || !siteEmail || !resendKey) {
    console.error('Email configuration incomplete', {
      hasAdminEmail: Boolean(adminEmail),
      hasFromEmail: Boolean(siteEmail),
      hasResendKey: Boolean(resendKey),
    });
    return NextResponse.json(
      { error: 'Email configuration is incomplete. Please try again shortly.' },
      { status: 500 }
    );
  }

  try {
    await sendEmail({
      to: adminEmail,
      subject: `New ${TOURNAMENT_NAME} registration`,
      text: formatAdminText(registration),
      html: formatAdminHtml(registration),
    });

    await sendEmail({
      to: registration.email,
      subject: `${TOURNAMENT_NAME} registration confirmed`,
      text: formatUserText(registration.name),
      html: formatUserHtml(registration.name),
    });
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
