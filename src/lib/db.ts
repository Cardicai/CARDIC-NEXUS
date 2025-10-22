import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'participants.json');

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
  };
};

type DB = { participants: Participant[] };

function readDB(): DB {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch {
    return { participants: [] };
  }
}
function writeDB(db: DB) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
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
export function updateFxUsername(token: string, username: string) {
  const db = readDB();
  const p = db.participants.find((x) => x.id === token);
  if (!p) return;
  p.fx = { username };
  p.status = 'ACTIVE';
  writeDB(db);
}
export function listParticipants() {
  return readDB().participants;
}
