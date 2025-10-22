'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

type Phase = 'gate' | 'fetching' | 'ready';
type TabKey = 'stats' | 'leaderboard';

type Participant = {
  id: string;
  name: string;
  email: string;
  status: 'PENDING' | 'ACTIVE';
  createdAt: string;
  fx?: { username?: string };
};

type ResolveResponse = {
  ok: boolean;
  user?: Participant;
  error?: string;
};

const tabs: { key: TabKey; label: string }[] = [
  { key: 'stats', label: 'My Stats' },
  { key: 'leaderboard', label: 'Leaderboard' },
];

export default function DashboardPage() {
  const [token, setToken] = useState('');
  const [phase, setPhase] = useState<Phase>('gate');
  const [error, setError] = useState('');
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('stats');

  const submitToken = useCallback(async (value: string) => {
    if (!value) return;
    setPhase('fetching');
    setError('');
    try {
      const response = await fetch('/api/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: value }),
      });
      const data: ResolveResponse = await response.json();
      if (!data.ok || !data.user)
        throw new Error(data.error || 'Invalid token');
      setParticipant(data.user);
      window.localStorage.setItem('cn_token', value);
      setTimeout(() => setPhase('ready'), 900);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error';
      setError(message);
      setPhase('gate');
      window.localStorage.removeItem('cn_token');
    }
  }, []);

  useEffect(() => {
    const cached = window.localStorage.getItem('cn_token');
    if (cached) {
      setToken(cached);
      void submitToken(cached);
    }
  }, [submitToken]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = token.trim();
    if (!trimmed) {
      setError('Enter a valid token.');
      return;
    }
    submitToken(trimmed);
  };

  const pending = participant?.status === 'PENDING';
  const activated = participant?.status === 'ACTIVE';
  const hasFx = Boolean(participant?.fx?.username);

  const fxUrl = useMemo(() => {
    if (!participant?.fx?.username) return null;
    const username = encodeURIComponent(participant.fx.username);
    return `https://www.fxblue.com/users/${username}`;
  }, [participant?.fx?.username]);

  return (
    <div className='min-h-screen bg-[#05030f] p-6 text-white'>
      <div className='mx-auto max-w-5xl'>
        <div className='mb-6 flex items-center justify-between'>
          <h1 className='text-2xl font-semibold'>Dashboard</h1>
          {phase !== 'gate' && (
            <button
              onClick={() => {
                setParticipant(null);
                setPhase('gate');
                setActiveTab('stats');
                setToken('');
                setError('');
                window.localStorage.removeItem('cn_token');
              }}
              className='text-sm text-slate-300 underline-offset-4 hover:underline'
            >
              Switch token
            </button>
          )}
        </div>

        {phase === 'gate' && (
          <form
            onSubmit={onSubmit}
            className='mx-auto max-w-md rounded-2xl bg-slate-900/70 p-6 ring-1 ring-slate-800'
          >
            <label className='text-sm text-slate-300'>
              Enter your secret token
            </label>
            <input
              value={token}
              onChange={(event) => setToken(event.target.value)}
              placeholder='e.g. alex-cardic-7Q9F2B'
              className='mt-2 w-full rounded-lg bg-slate-800 px-3 py-2 text-sm'
            />
            <button className='mt-4 w-full rounded-lg bg-emerald-600 py-2 font-medium'>
              Unlock
            </button>
            {error && <p className='mt-3 text-xs text-red-400'>{error}</p>}
            <p className='mt-3 text-xs text-slate-400'>
              Don’t have a token?{' '}
              <a href='/signup' className='underline'>
                Sign up
              </a>{' '}
              to request access.
            </p>
          </form>
        )}

        {phase === 'fetching' && (
          <div className='flex h-[45vh] flex-col items-center justify-center gap-4'>
            <div className='h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-emerald-400' />
            <p className='text-sm text-slate-300'>Fetching data…</p>
          </div>
        )}

        {phase === 'ready' && participant && (
          <div className='space-y-6'>
            <div className='rounded-2xl border border-slate-800 bg-slate-900/60 p-5'>
              <p className='text-sm text-slate-300'>
                Welcome,{' '}
                <span className='font-semibold text-white'>
                  {participant.name}
                </span>
                . Status:{' '}
                <span
                  className={`font-semibold ${
                    pending ? 'text-amber-300' : 'text-emerald-300'
                  }`}
                >
                  {participant.status}
                </span>
                {pending && (
                  <span> — wait up to 24h for account activation.</span>
                )}
              </p>
            </div>

            <div className='flex flex-wrap items-center gap-2'>
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                    activeTab === tab.key
                      ? 'bg-emerald-500 text-black'
                      : 'border border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'stats' && (
              <div className='space-y-6'>
                <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                  <StatCard
                    title='ROI %'
                    value={pending ? '—' : hasFx ? 'Live' : 'Link pending'}
                    helper={
                      pending
                        ? "We'll populate this once your desk activates you."
                        : hasFx
                        ? 'Pulled live from FXBlue.'
                        : 'Add an FXBlue username via the admin endpoint to unlock live stats.'
                    }
                  />
                  <StatCard
                    title='Drawdown %'
                    value={pending ? '—' : hasFx ? 'Live' : 'Link pending'}
                    helper={
                      pending
                        ? 'Awaiting funded account provisioning.'
                        : hasFx
                        ? 'Daily and overall drawdown will mirror FXBlue metrics.'
                        : 'Drawdown monitoring begins after FXBlue is connected.'
                    }
                  />
                  <StatCard
                    title='Status'
                    value={participant.status}
                    helper={
                      pending
                        ? 'Credentials arrive via email within 24h.'
                        : 'You are cleared to compete.'
                    }
                  />
                  <StatCard
                    title='Next Elimination'
                    value='04d 10h'
                    helper={
                      activated
                        ? 'Countdown updates automatically.'
                        : 'Timer appears once your slot is confirmed.'
                    }
                  />
                </div>

                {fxUrl && (
                  <div className='space-y-3'>
                    <p className='text-sm text-slate-300'>
                      Linked FXBlue profile:
                    </p>
                    <div className='overflow-hidden rounded-xl border border-slate-800'>
                      <iframe
                        title='FXBlue'
                        src={fxUrl}
                        className='h-[70vh] w-full'
                        sandbox='allow-same-origin allow-scripts allow-forms allow-popups'
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'leaderboard' && (
              <div className='space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-6'>
                <h2 className='text-lg font-semibold text-white'>
                  Leaderboard
                </h2>
                <p className='text-sm text-slate-300'>
                  Leaderboard syncing arrives after provisioning. Once
                  activated, standings update every reconciliation window.
                </p>
                <ul className='space-y-3 text-sm text-slate-300'>
                  <li className='flex justify-between rounded-lg bg-slate-800/60 px-4 py-3'>
                    <span>1. Awaiting activation</span>
                    <span className='text-slate-400'>—</span>
                  </li>
                  <li className='flex justify-between rounded-lg bg-slate-800/40 px-4 py-3'>
                    <span>2. Leaderboard feed</span>
                    <span className='text-slate-400'>Sync pending</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  helper,
}: {
  title: string;
  value: string;
  helper?: string;
}) {
  return (
    <div className='rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-inner shadow-black/30'>
      <p className='text-xs uppercase tracking-[0.3em] text-slate-400'>
        {title}
      </p>
      <p className='mt-3 text-2xl font-semibold text-white'>{value}</p>
      {helper && <p className='mt-2 text-xs text-slate-400'>{helper}</p>}
    </div>
  );
}
