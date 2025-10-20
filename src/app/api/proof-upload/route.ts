/* eslint-disable no-console */
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import path from 'node:path';

export const runtime = 'nodejs';
export const maxDuration = 60;
export const config = {
  api: {
    bodyParser: false,
    sizeLimit: '10mb',
  },
};

const MAX_PROOF_SIZE_BYTES = 10 * 1024 * 1024;

function sanitize(value: string) {
  return value.trim();
}

function buildStorageKey(originalName: string) {
  const safeName = originalName.toLowerCase().replace(/[^a-z0-9.]+/g, '-');
  return `tournament-proofs/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}-${safeName}`;
}

export async function POST(request: Request) {
  const blobToken =
    process.env.BLOB_READ_WRITE_TOKEN || process.env.VERCEL_BLOB_RW_TOKEN;

  if (!blobToken) {
    console.error('Missing BLOB_READ_WRITE_TOKEN environment variable.');
    return NextResponse.json(
      { error: 'Storage configuration is incomplete. Please try again later.' },
      { status: 500 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch (error) {
    console.error('Failed to parse proof upload form data', error);
    return NextResponse.json(
      { error: 'Invalid upload payload. Please try again.' },
      { status: 400 }
    );
  }

  const file = formData.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: 'No file provided. Please attach proof of eligibility.' },
      { status: 400 }
    );
  }

  if (file.size === 0) {
    return NextResponse.json(
      { error: 'The uploaded file is empty.' },
      { status: 400 }
    );
  }

  if (file.size > MAX_PROOF_SIZE_BYTES) {
    return NextResponse.json(
      { error: 'File too large. Maximum size is 10 MB.' },
      { status: 400 }
    );
  }

  const rawName = sanitize(path.basename(file.name || 'proof-upload'));
  const originalName = rawName.length ? rawName : 'proof-upload';
  const finalName =
    originalName.length > 160
      ? `${originalName.slice(0, 120)}${originalName.slice(-20)}`
      : originalName;

  const storageKey = buildStorageKey(finalName);
  const mimeType = file.type || 'application/octet-stream';

  try {
    const blob = await put(storageKey, file, {
      access: 'public',
      token: blobToken,
      contentType: mimeType,
    });

    if (!blob?.url) {
      console.error('Blob upload response missing URL', blob);
      return NextResponse.json(
        { error: 'Upload failed. Please try again shortly.' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      url: blob.url,
      key: blob.pathname ?? storageKey,
      originalName: finalName,
      mimeType,
      size: file.size,
    });
  } catch (error) {
    console.error('Unexpected error uploading proof to Vercel Blob', error);
    return NextResponse.json(
      { error: 'Upload failed. Please try again shortly.' },
      { status: 502 }
    );
  }
}
