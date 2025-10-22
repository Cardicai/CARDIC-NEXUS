'use client';

import { useState } from 'react';

type SignupResponse = {
  ok: boolean;
  token?: string;
  error?: string;
};

type FormFields = {
  name: string;
  email: string;
  platform?: string;
  broker?: string;
  server?: string;
  leverage?: string;
  accountSize?: string;
};

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [err, setErr] = useState('');

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries()) as Partial<FormFields>;
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const j: SignupResponse = await response.json();
    setLoading(false);
    if (!j.ok || !j.token) {
      setErr(j.error || 'Failed');
      return;
    }
    setToken(j.token);
  }

  return (
    <div className='min-h-screen bg-[#0a0f1c] p-6 text-white'>
      <div className='mx-auto max-w-xl rounded-2xl bg-slate-900/60 p-6 ring-1 ring-slate-800'>
        <h1 className='mb-4 text-xl font-semibold'>Join the Tournament</h1>
        {!token ? (
          <form onSubmit={submit} className='grid gap-3'>
            <input
              name='name'
              placeholder='Full name'
              required
              className='rounded bg-slate-800 px-3 py-2'
            />
            <input
              name='email'
              placeholder='Email'
              type='email'
              required
              className='rounded bg-slate-800 px-3 py-2'
            />
            <select name='platform' className='rounded bg-slate-800 px-3 py-2'>
              <option value=''>Platform (optional)</option>
              <option value='MT5'>MT5</option>
              <option value='MT4'>MT4</option>
            </select>
            <input
              name='broker'
              placeholder='Broker (optional)'
              className='rounded bg-slate-800 px-3 py-2'
            />
            <input
              name='server'
              placeholder='Server (optional)'
              className='rounded bg-slate-800 px-3 py-2'
            />
            <input
              name='leverage'
              placeholder='Leverage (optional)'
              className='rounded bg-slate-800 px-3 py-2'
            />
            <input
              name='accountSize'
              placeholder='Account size (optional)'
              className='rounded bg-slate-800 px-3 py-2'
            />
            <button
              disabled={loading}
              className='rounded bg-emerald-600 py-2 font-medium'
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
            {err && <p className='text-sm text-red-400'>{err}</p>}
            <p className='text-xs text-slate-400'>
              After submitting, we’ll email your secret token. Provisioning may
              take up to 24h.
            </p>
          </form>
        ) : (
          <div>
            <p className='text-sm text-slate-300'>Your token (also emailed):</p>
            <div className='mt-2 text-2xl font-semibold text-emerald-300'>
              {token}
            </div>
            <p className='mt-4 text-sm text-slate-400'>
              Open the Dashboard and paste this token.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
