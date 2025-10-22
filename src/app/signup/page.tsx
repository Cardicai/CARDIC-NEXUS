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
  country: string;
};

export default function SignupPage() {
  const [mintState, setMintState] = useState<'idle' | 'minting' | 'minted'>(
    'idle'
  );
  const [token, setToken] = useState<string | null>(null);
  const [err, setErr] = useState('');
  const [copied, setCopied] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr('');
    setMintState('minting');
    setToken(null);
    setCopied(false);
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries()) as Partial<FormFields>;
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const j: SignupResponse = await response.json();
      setMintState(j.ok && j.token ? 'minted' : 'idle');
      if (!j.ok || !j.token) {
        setErr(j.error || 'Failed');
        return;
      }
      setToken(j.token);
    } catch {
      setMintState('idle');
      setErr('Unable to mint token. Please retry.');
    }
  }

  return (
    <div className='min-h-screen bg-[#0a0f1c] p-6 text-white'>
      <div className='mx-auto max-w-xl rounded-2xl bg-slate-900/60 p-6 ring-1 ring-slate-800'>
        <h1 className='mb-4 text-xl font-semibold'>Join the Tournament</h1>
        {!token ? (
          <form onSubmit={submit} className='grid gap-4'>
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
            <input
              name='country'
              placeholder='Country'
              required
              className='rounded bg-slate-800 px-3 py-2'
            />
            <button
              disabled={mintState === 'minting'}
              className='rounded bg-emerald-600 py-2 font-medium transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-80'
            >
              {mintState === 'minting' ? (
                <span className='flex items-center justify-center gap-2 text-sm font-medium'>
                  <span className='h-4 w-4 animate-spin rounded-full border-2 border-emerald-200 border-t-transparent' />
                  Minting token…
                </span>
              ) : (
                'Mint Token'
              )}
            </button>
            {mintState === 'minting' && (
              <div className='space-y-1 text-xs text-emerald-200'>
                <p className='flex items-center gap-2'>
                  <span className='h-2 w-2 animate-ping rounded-full bg-emerald-300' />
                  Generating your secure access key…
                </p>
                <p className='flex items-center gap-2 text-emerald-200/80'>
                  <span className='h-2 w-2 animate-pulse rounded-full bg-emerald-200/80' />
                  Sending email via Cardic Nexus mail server…
                </p>
              </div>
            )}
            {err && <p className='text-sm text-red-400'>{err}</p>}
            <p className='text-xs text-slate-400'>
              After minting, we’ll email your secret token and notify the admin
              desk. Account provisioning may take up to 24h.
            </p>
          </form>
        ) : (
          <div className='space-y-4'>
            <div className='rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5 shadow-lg shadow-emerald-900/30'>
              <p className='text-sm font-medium text-emerald-100'>
                Token minted successfully.
              </p>
              <div className='mt-3 flex items-center justify-between gap-3 rounded-xl bg-[#052e2b] px-4 py-3 text-lg font-semibold tracking-widest text-emerald-200 md:text-xl'>
                <span className='truncate'>{token}</span>
                <button
                  type='button'
                  onClick={async () => {
                    if (!token) return;
                    try {
                      await navigator.clipboard.writeText(token);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    } catch {
                      setCopied(false);
                    }
                  }}
                  className='rounded-md border border-emerald-400/40 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-100 transition hover:bg-emerald-400/10'
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p className='mt-3 text-xs text-emerald-100/80'>
                A copy is on its way to your inbox — keep it safe.
              </p>
            </div>
            <p className='text-sm text-slate-300'>
              Open the{' '}
              <a
                className='text-emerald-300 underline-offset-4 hover:underline'
                href='/dashboard'
              >
                Dashboard
              </a>{' '}
              and paste this token to track your status.
            </p>
            <button
              type='button'
              onClick={() => {
                setToken(null);
                setMintState('idle');
                setCopied(false);
              }}
              className='text-xs text-slate-400 underline-offset-4 hover:underline'
            >
              Mint another token
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
