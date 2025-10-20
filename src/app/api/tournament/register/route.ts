/* eslint-disable no-console */
import { NextResponse } from 'next/server';
import path from 'node:path';
import { z } from 'zod';

import { EmailError, sendEmail } from '@/lib/email';
import type { TournamentRegistrationInput } from '@/lib/tournament-registration-store';
import { createTournamentRegistration } from '@/lib/tournament-registration-store';

export const runtime = 'nodejs';
export const maxDuration = 60;
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

const registrationSchema = z.object({
  name: z.string().min(1, 'Full name is required.'),
  email: z.string().email('A valid email address is required.'),
  contact: z
    .string()
    .min(1, 'Contact information is required (phone or Telegram).'),
  country: z.string().min(1, 'Country is required.'),
});

const MAX_PROOF_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const TOURNAMENT_NAME = 'Cardic Nexus Tournament';

const blobApiEndpoint = 'https://blob.vercel-storage.com';

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
  proofUrl: string,
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
            <td style="padding:6px 0;">
              ${data.proof.originalName} (${readableSize})<br />
              <a href="${proofUrl}" style="color:#0284c7;">View uploaded proof</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

function formatAdminText(
  data: TournamentRegistrationInput,
  proofUrl: string,
  fileSize: number
) {
  const readableSize = formatFileSize(fileSize);
  return `New Cardic Nexus Tournament registration\n\nName: ${data.name}\nEmail: ${data.email}\nContact: ${data.contact}\nCountry: ${data.country}\nProof upload: ${data.proof.originalName} (${readableSize})\nProof URL: ${proofUrl}`;
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

  const proofOriginalNameBase =
    sanitize(path.basename(proof.name || 'proof-upload')) || 'proof-upload';
  const proofOriginalName =
    proofOriginalNameBase.length > 160
      ? `${proofOriginalNameBase.slice(0, 120)}${proofOriginalNameBase.slice(
          -20
        )}`
      : proofOriginalNameBase;

  const normalizedName = sanitize(parsed.data.name);
  const normalizedEmail = sanitize(parsed.data.email);
  const normalizedContact = sanitize(parsed.data.contact);
  const normalizedCountry = sanitize(parsed.data.country);

  if (!normalizedName) {
    return NextResponse.json(
      { error: 'Full name is required.' },
      { status: 400 }
    );
  }

  if (!normalizedEmail) {
    return NextResponse.json(
      { error: 'A valid email address is required.' },
      { status: 400 }
    );
  }

  if (!normalizedContact) {
    return NextResponse.json(
      {
        error: 'Contact information is required (phone or Telegram).',
      },
      { status: 400 }
    );
  }

  if (!normalizedCountry) {
    return NextResponse.json(
      { error: 'Country is required.' },
      { status: 400 }
    );
  }

  const proofMimeType = proof.type || 'application/octet-stream';

  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;
  if (!blobToken) {
    console.error('Missing BLOB_READ_WRITE_TOKEN environment variable.');
    return NextResponse.json(
      {
        error: 'Storage configuration is incomplete. Please try again later.',
      },
      { status: 500 }
    );
  }

  const storageSafeName = proofOriginalName
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, '-');
  const storageKey = `tournament-proofs/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}-${storageSafeName}`;

  let proofUrl: string | undefined;
  try {
    const uploadResponse = await fetch(`${blobApiEndpoint}/${storageKey}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${blobToken}`,
        'Content-Type': proofMimeType,
        'x-vercel-blob-version': '4',
        'x-vercel-blob-cache-control': 'max-age=31536000',
      },
      body: proof,
    });

    if (!uploadResponse.ok) {
      const errorPayload = await uploadResponse
        .json()
        .catch(() => ({ error: uploadResponse.statusText }));
      console.error('Failed to upload proof to Vercel Blob', {
        status: uploadResponse.status,
        error: errorPayload,
      });
      return NextResponse.json(
        {
          error:
            'We could not upload your proof file. Please try again shortly.',
        },
        { status: 502 }
      );
    }

    const uploadData = (await uploadResponse.json()) as {
      url?: string;
    };

    if (!uploadData?.url) {
      console.error('Blob upload response missing URL', uploadData);
      return NextResponse.json(
        {
          error:
            'We could not upload your proof file. Please try again shortly.',
        },
        { status: 502 }
      );
    }

    proofUrl = uploadData.url;
  } catch (error) {
    console.error('Unexpected error uploading proof to Vercel Blob', error);
    return NextResponse.json(
      {
        error:
          'We could not upload your proof file. Please try again in a moment.',
      },
      { status: 502 }
    );
  }

  if (!proofUrl) {
    return NextResponse.json(
      {
        error: 'We could not upload your proof file. Please try again shortly.',
      },
      { status: 502 }
    );
  }

  const normalized: TournamentRegistrationInput = {
    name: normalizedName,
    email: normalizedEmail,
    contact: normalizedContact,
    country: normalizedCountry,
    proof: {
      originalName: proofOriginalName,
      mimeType: proofMimeType,
      fileSize: proof.size,
      url: proofUrl,
      storageKey,
    },
  };
  try {
    await createTournamentRegistration(normalized);
  } catch (error) {
    console.error('Failed to save tournament registration', error);
    return NextResponse.json(
      {
        error: 'We could not save your registration. Please try again shortly.',
      },
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
      {
        error: 'Email configuration is incomplete. Please try again shortly.',
      },
      { status: 500 }
    );
  }

  try {
    await sendEmail({
      to: adminEmail,
      subject: `New ${TOURNAMENT_NAME} registration`,
      text: formatAdminText(
        normalized,
        normalized.proof.url,
        normalized.proof.fileSize
      ),
      html: formatAdminHtml(
        normalized,
        normalized.proof.url,
        normalized.proof.fileSize
      ),
    });

    await sendEmail({
      to: normalized.email,
      subject: `${TOURNAMENT_NAME} registration confirmed`,
      text: formatUserText(normalized.name),
      html: formatUserHtml(normalized.name),
    });
  } catch (error) {
    const message =
      error instanceof EmailError
        ? error.message
        : 'We could not send confirmation emails at this time.';
    console.error('Failed to dispatch tournament emails', error);
    return NextResponse.json({ error: message }, { status: 502 });
  }

  return NextResponse.json({
    ok: true,
    message:
      '🎉 YOU’RE IN! Check your email for confirmation and your dashboard link.',
  });
}
