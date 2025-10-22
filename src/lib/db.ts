import fs from 'fs';
import path from 'path';

const ROOT_DB_FILE = path.join(process.cwd(), 'participants.json');
const TMP_DB_FILE = path.join(
  process.env.TMPDIR || '/tmp',
  'participants.json'
);

export type ParticipantStats = {
  roi?: number;
  drawdown?: number;
  balance?: number;
  equity?: number;
  updatedAt?: string;
};

export type Participant = {
  id: string;
  name: string;
  email: string;
  fx?: { username?: string };
  status: 'PENDING' | 'ACTIVE';
  createdAt: string;
  meta?: {
    platform?: 'MT4' | 'MT5';
    broker?: string;
    server?: string;
    leverage?: string;
    accountSize?: string;
    country?: string;
  };
  stats?: ParticipantStats;
};

type DB = { participants: Participant[] };

function ensureFallbackSeeded() {
  try {
    if (fs.existsSync(TMP_DB_FILE)) return;
    if (fs.existsSync(ROOT_DB_FILE)) {
      fs.copyFileSync(ROOT_DB_FILE, TMP_DB_FILE);
      return;
    }
    const empty: DB = { participants: [] };
    fs.writeFileSync(TMP_DB_FILE, JSON.stringify(empty, null, 2), 'utf8');
  } catch {
    /* no-op */
  }
}

function getReadableFile(): string {
  if (fs.existsSync(TMP_DB_FILE)) return TMP_DB_FILE;
  return ROOT_DB_FILE;
}

function getWritableFile(): string {
  try {
    fs.accessSync(ROOT_DB_FILE, fs.constants.W_OK);
    return ROOT_DB_FILE;
  } catch {
    ensureFallbackSeeded();
    return TMP_DB_FILE;
  }
}

function readDB(): DB {
  try {
    const file = getReadableFile();
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return { participants: [] };
  }
}
function writeDB(db: DB) {
  const file = getWritableFile();
  fs.writeFileSync(file, JSON.stringify(db, null, 2), 'utf8');
}

export function upsertParticipant(p: Participant) {
  const db = readDB();
  const i = db.participants.findIndex((x) => x.id === p.id);
  if (i >= 0) db.participants[i] = p;
  else db.participants.push(p);
  writeDB(db);
}
export function findByToken(token: string) {
  return readDB().participants.find((p) => p.id === token);
}
export function activateParticipant(token: string, username?: string) {
  const db = readDB();
  const p = db.participants.find((x) => x.id === token);
  if (!p) return;
  p.status = 'ACTIVE';
  if (username) {
    p.fx = { username };
  }
  writeDB(db);
}
export function listParticipants() {
  return readDB().participants;
}
