import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

import { SyncButton } from './SyncButton';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type ParticipantStatsRecord = Record<string, unknown> | null | undefined;

type Snapshot = {
  id: string;
  at: string;
  balance: number | null;
  equity: number | null;
  closedPL: number | null;
  floatingPL: number | null;
  totalTrades: number | null;
  wins: number | null;
  losses: number | null;
  winRatePct: number | null;
  profitFactor: number | null;
  maxDrawdownPct: number | null;
  roiPct: number | null;
};

type ParticipantResponse = {
  ok: boolean;
  participant?: {
    token: string;
    displayName: string | null;
    csvUrl: string;
    fxSource: string;
    isActive: boolean;
    stats: ParticipantStatsRecord;
    lastSyncAt: string | null;
    createdAt: string;
    updatedAt: string;
  };
  snapshots?: Snapshot[];
  error?: string;
};

const numberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
});

const integerFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
});

function getNumber(stats: ParticipantStatsRecord, key: string) {
  if (!stats || typeof stats !== 'object') return undefined;
  const value = (stats as Record<string, unknown>)[key];
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function formatNumber(value: number | undefined | null) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return numberFormatter.format(value);
}

function formatInteger(value: number | undefined | null) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return integerFormatter.format(value);
}

function formatPercent(value: number | undefined | null) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return `${percentFormatter.format(value)}%`;
}

async function fetchParticipant(token: string) {
  const baseUrl = resolveBaseUrl();
  const response = await fetch(`${baseUrl}/api/participants/${token}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    if (response.status === 404) {
      notFound();
    }
    const message = await response
      .json()
      .then((body: ParticipantResponse) => body.error)
      .catch(() => undefined);
    throw new Error(message || 'Failed to load participant');
  }

  const json = (await response.json()) as ParticipantResponse;
  if (!json.ok || !json.participant) {
    if (response.status === 404) notFound();
    throw new Error(json.error || 'Participant data unavailable');
  }
  return json;
}

function resolveBaseUrl() {
  const headerList = headers();
  const forwardedProto = headerList.get('x-forwarded-proto');
  const forwardedHost = headerList.get('x-forwarded-host');
  const host = headerList.get('host');
  if (forwardedHost) {
    const proto = forwardedProto || 'https';
    return `${proto}://${forwardedHost}`.replace(/\/$/, '');
  }
  if (host) {
    const proto = forwardedProto || 'https';
    return `${proto}://${host}`.replace(/\/$/, '');
  }
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (siteUrl) {
    return siteUrl.replace(/\/$/, '');
  }
  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    const url = vercelUrl.startsWith('http')
      ? vercelUrl
      : `https://${vercelUrl}`;
    return url.replace(/\/$/, '');
  }
  return 'http://localhost:3000';
}

export default async function ParticipantPage({
  params,
}: {
  params: { token: string };
}) {
  const token = params.token;
  const data = await fetchParticipant(token);
  const participant = data.participant;
  const stats = participant.stats;

  const roiPct = getNumber(stats, 'roiPct');
  const maxDrawdownPct = getNumber(stats, 'maxDrawdownPct');
  const winRatePct = getNumber(stats, 'winRatePct');
  const profitFactor = getNumber(stats, 'profitFactor');
  const totalTrades = getNumber(stats, 'totalTrades');
  const equity = getNumber(stats, 'equity');
  const balance = getNumber(stats, 'balance');
  const lastSyncAt = participant.lastSyncAt
    ? new Date(participant.lastSyncAt)
    : null;

  async function triggerSync() {
    'use server';

    const adminToken = process.env.ADMIN_TOKEN?.trim();
    if (!adminToken) {
      return;
    }

    const baseUrl = resolveBaseUrl();
    const targetUrl = `${baseUrl}/api/participants/${token}/sync`;

    try {
      const response = await fetch(targetUrl, {
        method: 'POST',
        cache: 'no-store',
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      if (!response.ok) {
        await response.json().catch(() => null);
      }
    } catch {
      /* swallow network errors */
    }

    revalidatePath(`/participants/${token}`);
  }

  return (
    <div className='min-h-screen bg-[#050815] px-6 py-10 text-slate-100'>
      <div className='mx-auto flex w-full max-w-5xl flex-col gap-8'>
        <header className='flex flex-col gap-4 rounded-3xl bg-slate-900/60 p-6 ring-1 ring-slate-800/80 md:flex-row md:items-center md:justify-between'>
          <div>
            <p className='text-xs uppercase tracking-[0.2em] text-emerald-300/70'>
              Participant
            </p>
            <h1 className='mt-2 text-2xl font-semibold text-slate-100 md:text-3xl'>
              {participant.displayName || participant.token}
            </h1>
            <p className='mt-1 text-sm text-slate-400'>
              Token: {participant.token}
            </p>
            {lastSyncAt ? (
              <p className='mt-2 text-xs text-slate-400'>
                Last synced:{' '}
                <time dateTime={lastSyncAt.toISOString()}>
                  {lastSyncAt.toLocaleString()}
                </time>
              </p>
            ) : (
              <p className='mt-2 text-xs text-slate-500'>No sync yet</p>
            )}
          </div>
          <form action={triggerSync} className='flex items-center justify-end'>
            <SyncButton />
          </form>
        </header>

        <section className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          <MetricCard
            label='ROI %'
            value={formatPercent(roiPct)}
            tone='emerald'
          />
          <MetricCard
            label='Max Drawdown %'
            value={formatPercent(maxDrawdownPct)}
            tone='rose'
          />
          <MetricCard
            label='Win Rate %'
            value={formatPercent(winRatePct)}
            tone='sky'
          />
          <MetricCard
            label='Profit Factor'
            value={formatNumber(profitFactor)}
            tone='violet'
          />
          <MetricCard
            label='Total Trades'
            value={formatInteger(totalTrades)}
            tone='amber'
          />
          <MetricCard
            label='Equity'
            value={formatNumber(equity ?? balance)}
            tone='cyan'
          />
        </section>

        {data.snapshots && data.snapshots.length > 0 && (
          <section className='rounded-3xl border border-slate-800/80 bg-slate-900/50 p-6 shadow-inner shadow-slate-900/30'>
            <h2 className='text-lg font-semibold text-slate-100'>
              Recent snapshots
            </h2>
            <p className='mt-1 text-xs text-slate-400'>
              Last {data.snapshots.length} sync points
            </p>
            <div className='mt-4 overflow-x-auto'>
              <table className='min-w-full divide-y divide-slate-800 text-left text-sm'>
                <thead className='text-xs uppercase tracking-wide text-slate-400'>
                  <tr>
                    <th className='px-3 py-2 font-medium'>Timestamp</th>
                    <th className='px-3 py-2 font-medium text-right'>Equity</th>
                    <th className='px-3 py-2 font-medium text-right'>
                      Balance
                    </th>
                    <th className='px-3 py-2 font-medium text-right'>ROI %</th>
                    <th className='px-3 py-2 font-medium text-right'>Win %</th>
                    <th className='px-3 py-2 font-medium text-right'>Trades</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-slate-800 text-slate-300'>
                  {data.snapshots.map((snapshot) => {
                    const rowEquity = snapshot.equity ?? undefined;
                    const rowBalance = snapshot.balance ?? undefined;
                    const rowRoi = snapshot.roiPct ?? undefined;
                    const rowWin = snapshot.winRatePct ?? undefined;
                    const rowTrades = snapshot.totalTrades ?? undefined;
                    return (
                      <tr key={snapshot.id} className='hover:bg-slate-800/40'>
                        <td className='px-3 py-2 text-xs text-slate-400'>
                          <time dateTime={snapshot.at}>
                            {new Date(snapshot.at).toLocaleString()}
                          </time>
                        </td>
                        <td className='px-3 py-2 text-right'>
                          {formatNumber(rowEquity)}
                        </td>
                        <td className='px-3 py-2 text-right'>
                          {formatNumber(rowBalance)}
                        </td>
                        <td className='px-3 py-2 text-right'>
                          {formatPercent(rowRoi)}
                        </td>
                        <td className='px-3 py-2 text-right'>
                          {formatPercent(rowWin)}
                        </td>
                        <td className='px-3 py-2 text-right'>
                          {formatInteger(rowTrades)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

type MetricCardProps = {
  label: string;
  value: string;
  tone: 'emerald' | 'rose' | 'sky' | 'violet' | 'amber' | 'cyan';
};

function MetricCard({ label, value, tone }: MetricCardProps) {
  const toneClasses: Record<MetricCardProps['tone'], string> = {
    emerald: 'from-emerald-500/10 to-emerald-400/5 border-emerald-500/30',
    rose: 'from-rose-500/10 to-rose-400/5 border-rose-500/30',
    sky: 'from-sky-500/10 to-sky-400/5 border-sky-500/30',
    violet: 'from-violet-500/10 to-violet-400/5 border-violet-500/30',
    amber: 'from-amber-500/10 to-amber-400/5 border-amber-500/30',
    cyan: 'from-cyan-500/10 to-cyan-400/5 border-cyan-500/30',
  };

  return (
    <div
      className={`rounded-2xl border bg-gradient-to-br p-5 shadow-inner shadow-black/30 ${toneClasses[tone]}`}
    >
      <p className='text-xs uppercase tracking-[0.18em] text-slate-400'>
        {label}
      </p>
      <p className='mt-2 text-2xl font-semibold text-slate-100'>{value}</p>
    </div>
  );
}
