import { randomUUID } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';

export type TournamentRegistrationInput = {
  name: string;
  email: string;
  contact: string;
  country: string;
  proof: {
    url: string;
    originalName: string;
    mimeType: string;
    fileSize: number;
    storageKey: string;
  };
};

export type TournamentRegistrationRecord = {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  contact: string;
  country: string;
  proofUrl: string;
  proofOriginalFilename: string;
  proofMimeType: string;
  proofFileSize: number;
  proofStorageKey: string;
};

type RegistrationRow = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  contact: string;
  country: string;
  proof_url: string;
  proof_original_name: string;
  proof_mime_type: string;
  proof_file_size: number;
  proof_storage_key: string;
};

declare global {
  // eslint-disable-next-line no-var
  var __cardicTournamentDb: DatabaseSync | undefined;
}

function resolveDatabasePath() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('Missing DATABASE_URL environment variable.');
  }

  if (url === ':memory:') {
    return url;
  }

  if (url.startsWith('file:')) {
    return fileURLToPath(url);
  }

  if (url.startsWith('sqlite:')) {
    const trimmed = url.replace(/^sqlite:/, '');
    if (trimmed.startsWith('//')) {
      return trimmed.slice(2);
    }
    return trimmed;
  }

  if (url.includes('://')) {
    let protocol: string | undefined;
    try {
      const parsed = new URL(url);
      protocol = parsed.protocol.replace(/:$/, '');
    } catch (error) {
      protocol = undefined;
    }
    throw new Error(
      `Unsupported database protocol for tournament registrations: ${
        protocol || 'unknown'
      }`
    );
  }

  // Allow plain filesystem paths as a fallback.
  return url;
}

function getDatabase() {
  if (!globalThis.__cardicTournamentDb) {
    const dbPath = resolveDatabasePath();
    if (dbPath !== ':memory:') {
      mkdirSync(dirname(dbPath), { recursive: true });
    }
    const database = new DatabaseSync(dbPath);
    database.exec(`
      CREATE TABLE IF NOT EXISTS tournament_registrations (
        id TEXT PRIMARY KEY,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        contact TEXT NOT NULL,
        country TEXT NOT NULL,
        proof_url TEXT NOT NULL,
        proof_original_name TEXT NOT NULL,
        proof_mime_type TEXT NOT NULL,
        proof_file_size INTEGER NOT NULL,
        proof_storage_key TEXT NOT NULL
      )
    `);
    globalThis.__cardicTournamentDb = database;
  }

  return globalThis.__cardicTournamentDb;
}

export async function createTournamentRegistration(
  input: TournamentRegistrationInput
): Promise<TournamentRegistrationRecord> {
  const db = getDatabase();
  const id = randomUUID();
  const createdAt = new Date().toISOString();

  const insert = db.prepare(`
    INSERT INTO tournament_registrations (
      id,
      created_at,
      name,
      email,
      contact,
      country,
      proof_url,
      proof_original_name,
      proof_mime_type,
      proof_file_size,
      proof_storage_key
    )
    VALUES (
      $id,
      $created_at,
      $name,
      $email,
      $contact,
      $country,
      $proof_url,
      $proof_original_name,
      $proof_mime_type,
      $proof_file_size,
      $proof_storage_key
    )
  `);

  insert.run({
    $id: id,
    $created_at: createdAt,
    $name: input.name,
    $email: input.email,
    $contact: input.contact,
    $country: input.country,
    $proof_url: input.proof.url,
    $proof_original_name: input.proof.originalName,
    $proof_mime_type: input.proof.mimeType,
    $proof_file_size: input.proof.fileSize,
    $proof_storage_key: input.proof.storageKey,
  });

  const rowStatement = db.prepare(
    `
      SELECT
        id,
        created_at,
        name,
        email,
        contact,
        country,
        proof_url,
        proof_original_name,
        proof_mime_type,
        proof_file_size,
        proof_storage_key
      FROM tournament_registrations
      WHERE id = $id
    `
  );

  const row = rowStatement.get({ $id: id }) as RegistrationRow | undefined;

  if (!row) {
    throw new Error('Failed to persist registration.');
  }

  return {
    id: row.id,
    createdAt: row.created_at || createdAt,
    name: row.name,
    email: row.email,
    contact: row.contact,
    country: row.country,
    proofUrl: row.proof_url,
    proofOriginalFilename: row.proof_original_name,
    proofMimeType: row.proof_mime_type,
    proofFileSize: row.proof_file_size,
    proofStorageKey: row.proof_storage_key,
  } satisfies TournamentRegistrationRecord;
}
