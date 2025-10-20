import { NextResponse } from 'next/server';
import { Buffer } from 'node:buffer';
import path from 'node:path';
import { z } from 'zod';

import { EmailError, sendEmail } from '@/lib/email';
import type { TournamentRegistrationInput } from '@/lib/tournament-registration-store';
import { createTournamentRegistration } from '@/lib/tournament-registration-store';

export const runtime = 'nodejs';

const registrationSchema = z.object({
  name: z.string().min(1, 'Full name is required.'),
  email: z.string().email('A valid email address is required.'),
  contact: z
    .string()
    .min(1, 'Contact information is required (phone or Telegram).'),
  country: z.string().min(1, 'Country is required.'),
});

const MAX_PROOF_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

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

function formatAdminHtml(
  data: TournamentRegistrationInput,
  storedFilename: string,
  fileSize: number
) {
  const readableSize = formatFileSize(fileSize);
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
            <td style="padding:6px 0;">${data.proof.originalName} (${readableSize})<br />Stored as: ${storedFilename}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

function formatAdminText(
  data: TournamentRegistrationInput,
  storedFilename: string,
  fileSize: number
) {
  const readableSize = formatFileSize(fileSize);
  return `New Cardic Nexus Tournament registration\n\nName: ${data.name}\nEmail: ${data.email}\nContact: ${data.contact}\nCountry: ${data.country}\nProof upload: ${data.proof.originalName} (${readableSize}) - stored as ${storedFilename}`;
}

function formatUserHtml(name: string) {
  return `
    <div style="font-family:Inter,Arial,sans-serif;font-size:15px;line-height:1.6;color:#e2e8f0;background:#020617;padding:24px;border-radius:16px;">
      <h1 style="margin:0 0 16px;font-size:22px;color:#38bdf8;">Cardic Nexus Tournament</h1>
      <p style="margin:0 0 12px;color:#f1f5f9;">Hi ${name},</p>
      <p style="margin:0 0 12px;color:#f1f5f9;">Your registration for the Cardic Nexus Tournament has been received.</p>
      <p style="margin:0 0 18px;color:#f1f5f9;">You’ll receive your dashboard link and account credentials soon.</p>
      <p style="margin:0;color:#94a3b8;">— Cardic Nexus Team</p>
    </div>
  `;
}

function formatUserText(name: string) {
  return `Hi ${name}, your registration for the Cardic Nexus Tournament has been received. You’ll receive your dashboard link and account credentials soon.`;
}

export async function POST(request: Request) {
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch (error) {
    return NextResponse.json(
      {
        error:
          'Invalid form submission. Please submit valid registration details.',
      },
      { status: 400 }
    );
  }

  const proof = formData.get('proof');

  if (!(proof instanceof File)) {
    return NextResponse.json(
      { error: 'Proof of social engagement is required.' },
      { status: 400 }
    );
  }

  const payload = {
    name: formData.get('name'),
    email: formData.get('email'),
    contact: formData.get('contact'),
    country: formData.get('country'),
  } satisfies Record<string, unknown>;

  const parsed = registrationSchema.safeParse(payload);

  if (!parsed.success) {
    const firstIssue =
      parsed.error.issues.at(0)?.message ?? 'Invalid registration data.';
    return NextResponse.json({ error: firstIssue }, { status: 400 });
  }

  if (proof.size === 0) {
    return NextResponse.json(
      { error: 'The uploaded proof file is empty.' },
      { status: 400 }
    );
  }

  if (proof.size > MAX_PROOF_SIZE_BYTES) {
    return NextResponse.json(
      {
        error:
          'The proof file is too large. Please upload a file smaller than 10 MB.',
      },
      { status: 400 }
    );
  }

  const proofBuffer = Buffer.from(await proof.arrayBuffer());
  const proofOriginalNameBase =
    sanitize(path.basename(proof.name || 'proof-upload')) || 'proof-upload';
  const proofOriginalName =
    proofOriginalNameBase.length > 160
      ? `${proofOriginalNameBase.slice(0, 120)}${proofOriginalNameBase.slice(
          -20
        )}`
      : proofOriginalNameBase;

  const normalized: TournamentRegistrationInput = {
    name: sanitize(parsed.data.name),
    email: sanitize(parsed.data.email),
    contact: sanitize(parsed.data.contact),
    country: sanitize(parsed.data.country),
    proof: {
      originalName: proofOriginalName,
      mimeType: proof.type || 'application/octet-stream',
      buffer: proofBuffer,
    },
  };

  if (!normalized.name) {
    return NextResponse.json(
      { error: 'Full name is required.' },
      { status: 400 }
    );
  }

  if (!normalized.email) {
    return NextResponse.json(
      { error: 'A valid email address is required.' },
      { status: 400 }
    );
  }

  if (!normalized.contact) {
    return NextResponse.json(
      {
        error: 'Contact information is required (phone or Telegram).',
      },
      { status: 400 }
    );
  }

  if (!normalized.country) {
    return NextResponse.json(
      { error: 'Country is required.' },
      { status: 400 }
    );
  }

  let record;

  try {
    record = await createTournamentRegistration(normalized);
  } catch (error) {
    return NextResponse.json(
      {
        error: 'We could not save your registration. Please try again shortly.',
      },
      { status: 500 }
    );
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const siteEmail = process.env.FROM_EMAIL;

  if (!adminEmail || !siteEmail) {
    return NextResponse.json(
      {
        error:
          'Email configuration is incomplete. Please set both ADMIN_EMAIL and FROM_EMAIL environment variables.',
      },
      { status: 500 }
    );
  }

  const tournamentName = 'Cardic Nexus Tournament';
  const attachmentFilename = path.basename(
    record?.proofOriginalFilename || normalized.proof.originalName
  );

  const adminAttachment = {
    filename: attachmentFilename,
    content: proofBuffer.toString('base64'),
  };

  try {
    await sendEmail({
      to: adminEmail,
      subject: `New ${tournamentName} registration`,
      text: formatAdminText(
        normalized,
        record?.proofStoredFilename ?? attachmentFilename,
        record?.proofFileSize ?? proofBuffer.length
      ),
      html: formatAdminHtml(
        normalized,
        record?.proofStoredFilename ?? attachmentFilename,
        record?.proofFileSize ?? proofBuffer.length
      ),
      attachments: [adminAttachment],
    });

    await sendEmail({
      to: normalized.email,
      subject: `${tournamentName} registration confirmed`,
      text: formatUserText(normalized.name),
      html: formatUserHtml(normalized.name),
    });
  } catch (error) {
    const message =
      error instanceof EmailError
        ? error.message
        : 'We could not send confirmation emails at this time.';
    return NextResponse.json({ error: message }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
