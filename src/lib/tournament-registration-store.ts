import { randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

export type TournamentRegistrationInput = {
  name: string;
  email: string;
  telegram: string;
  broker: string;
  accountId: string;
  investorPassword: string;
};

export type TournamentRegistrationRecord = TournamentRegistrationInput & {
  id: string;
  createdAt: string;
};

type DatabaseSnapshot = {
  registrations: TournamentRegistrationRecord[];
};

const dataDirectory = path.join(process.cwd(), 'data');
const databaseFilePath = path.join(
  dataDirectory,
  'cardic-nexus-tournament-registrations.json'
);

const emptySnapshot: DatabaseSnapshot = { registrations: [] };

let writeQueue: Promise<void> = Promise.resolve();

async function ensureDatabaseFile() {
  await mkdir(dataDirectory, { recursive: true });

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
    await ensureDatabaseFile();
    const snapshot = await readSnapshot();

    record = {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      ...input,
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
