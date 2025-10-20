import type { Buffer } from 'node:buffer';
import { randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

export type TournamentRegistrationInput = {
  name: string;
  email: string;
  contact: string;
  country: string;
  proof: {
    originalName: string;
    mimeType: string;
    buffer: Buffer;
  };
};

export type TournamentRegistrationRecord = {
  name: string;
  email: string;
  contact: string;
  country: string;
  id: string;
  createdAt: string;
  proofOriginalFilename: string;
  proofStoredFilename: string;
  proofMimeType: string;
  proofFileSize: number;
};

type DatabaseSnapshot = {
  registrations: TournamentRegistrationRecord[];
};

const dataDirectory = path.join(process.cwd(), 'data');
const databaseFilePath = path.join(
  dataDirectory,
  'cardic-nexus-tournament-registrations.json'
);
const proofsDirectory = path.join(dataDirectory, 'proofs');

const emptySnapshot: DatabaseSnapshot = { registrations: [] };

let writeQueue: Promise<void> = Promise.resolve();

async function ensureDirectories() {
  await mkdir(dataDirectory, { recursive: true });
  await mkdir(proofsDirectory, { recursive: true });

  try {
    await readFile(databaseFilePath, 'utf8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      await writeFile(
        databaseFilePath,
        JSON.stringify(emptySnapshot, null, 2),
        'utf8'
      );
      return;
    }

    throw error;
  }
}

async function readSnapshot(): Promise<DatabaseSnapshot> {
  try {
    const contents = await readFile(databaseFilePath, 'utf8');
    const parsed = JSON.parse(contents) as DatabaseSnapshot;

    if (!Array.isArray(parsed.registrations)) {
      return emptySnapshot;
    }

    return parsed;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return emptySnapshot;
    }

    throw error;
  }
}

async function writeSnapshot(snapshot: DatabaseSnapshot) {
  await writeFile(databaseFilePath, JSON.stringify(snapshot, null, 2), 'utf8');
}

export async function createTournamentRegistration(
  input: TournamentRegistrationInput
): Promise<TournamentRegistrationRecord> {
  let record: TournamentRegistrationRecord | undefined;

  writeQueue = writeQueue.then(async () => {
    await ensureDirectories();
    const snapshot = await readSnapshot();

    const id = randomUUID();
    const createdAt = new Date().toISOString();
    const extension = path.extname(input.proof.originalName).slice(0, 16);
    const sanitizedExtension = extension.match(/^\.[a-zA-Z0-9]+$/)
      ? extension
      : '';
    const storedFilename = `${id}${sanitizedExtension || '.dat'}`;
    const proofFilePath = path.join(proofsDirectory, storedFilename);

    await writeFile(proofFilePath, input.proof.buffer);

    record = {
      id,
      createdAt,
      name: input.name,
      email: input.email,
      contact: input.contact,
      country: input.country,
      proofOriginalFilename: input.proof.originalName,
      proofStoredFilename: storedFilename,
      proofMimeType: input.proof.mimeType,
      proofFileSize: input.proof.buffer.length,
    } satisfies TournamentRegistrationRecord;

    snapshot.registrations.push(record);
    await writeSnapshot(snapshot);
  });

  await writeQueue;

  if (!record) {
    throw new Error('Failed to persist registration.');
  }

  return record;
}
