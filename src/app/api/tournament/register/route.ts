import { NextResponse } from 'next/server';
import { z } from 'zod';

import { EmailError, sendEmail } from '@/lib/email';
import {
  type TournamentRegistrationInput,
  createTournamentRegistration,
} from '@/lib/tournament-registration-store';

export const runtime = 'nodejs';

const registrationSchema = z.object({
  name: z.string().min(1, 'Full name is required.'),
  email: z.string().email('A valid email address is required.'),
  telegram: z.string().min(1, 'Telegram username is required.'),
  broker: z.string().min(1, 'Broker name is required.'),
  accountId: z.string().min(1, 'Trading account ID is required.'),
  investorPassword: z
    .string()
    .min(1, 'Investor password is required.')
    .max(128, 'Investor password is too long.'),
});

function sanitize(value: string) {
  return value.trim();
}

function formatAdminHtml(data: TournamentRegistrationInput) {
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
            <td style="padding:6px 0;font-weight:600;">Telegram</td>
            <td style="padding:6px 0;">${data.telegram}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;font-weight:600;">Broker</td>
            <td style="padding:6px 0;">${data.broker}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;font-weight:600;">Account ID</td>
            <td style="padding:6px 0;">${data.accountId}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;font-weight:600;">Investor password</td>
            <td style="padding:6px 0;">${data.investorPassword}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

function formatAdminText(data: TournamentRegistrationInput) {
  return `New Cardic Nexus Tournament registration\n\nName: ${data.name}\nEmail: ${data.email}\nTelegram: ${data.telegram}\nBroker: ${data.broker}\nAccount ID: ${data.accountId}\nInvestor password: ${data.investorPassword}`;
}

function formatUserHtml(name: string) {
  return `
    <div style="font-family:Inter,Arial,sans-serif;font-size:15px;line-height:1.6;color:#e2e8f0;background:#020617;padding:24px;border-radius:16px;">
      <h1 style="margin:0 0 16px;font-size:22px;color:#38bdf8;">Cardic Nexus Tournament</h1>
      <p style="margin:0 0 12px;color:#f1f5f9;">Hi ${name},</p>
      <p style="margin:0 0 12px;color:#f1f5f9;">Your registration for the Cardic Nexus Tournament is confirmed.</p>
      <p style="margin:0 0 18px;color:#f1f5f9;">You’ll receive your dashboard login credentials soon.</p>
      <p style="margin:0;color:#94a3b8;">— Cardic Nexus Team</p>
    </div>
  `;
}

function formatUserText(name: string) {
  return `Hi ${name}, your registration for the Cardic Nexus Tournament is confirmed. You’ll receive your dashboard login credentials soon.`;
}

export async function POST(request: Request) {
  let json: unknown;

  try {
    json = await request.json();
  } catch (error) {
    return NextResponse.json(
      {
        error:
          'Invalid JSON payload. Please submit valid registration details.',
      },
      { status: 400 }
    );
  }

  const parsed = registrationSchema.safeParse(json);

  if (!parsed.success) {
    const firstIssue =
      parsed.error.issues.at(0)?.message ?? 'Invalid registration data.';
    return NextResponse.json({ error: firstIssue }, { status: 400 });
  }

  const normalized: TournamentRegistrationInput = {
    name: sanitize(parsed.data.name),
    email: sanitize(parsed.data.email),
    telegram: sanitize(parsed.data.telegram),
    broker: sanitize(parsed.data.broker),
    accountId: sanitize(parsed.data.accountId),
    investorPassword: sanitize(parsed.data.investorPassword),
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

  if (!normalized.telegram) {
    return NextResponse.json(
      { error: 'Telegram username is required.' },
      { status: 400 }
    );
  }

  if (!normalized.broker) {
    return NextResponse.json(
      { error: 'Broker name is required.' },
      { status: 400 }
    );
  }

  if (!normalized.accountId) {
    return NextResponse.json(
      { error: 'Trading account ID is required.' },
      { status: 400 }
    );
  }

  if (!normalized.investorPassword) {
    return NextResponse.json(
      { error: 'Investor password is required.' },
      { status: 400 }
    );
  }

  try {
    await createTournamentRegistration(normalized);
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

  try {
    await sendEmail({
      to: adminEmail,
      subject: `New ${tournamentName} registration`,
      text: formatAdminText(normalized),
      html: formatAdminHtml(normalized),
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
