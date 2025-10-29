'use client';

import Link from 'next/link';
import { FormEvent, ReactNode, useState } from 'react';

type UnlockTokenGateProps = {
  children: ReactNode;
  token?: string;
};

const DEFAULT_TOKEN = 'CARDIC NEXUS';

export default function UnlockTokenGate({
  children,
  token = DEFAULT_TOKEN,
}: UnlockTokenGateProps) {
  const [inputValue, setInputValue] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedInput = inputValue.trim().toLowerCase();
    const normalizedToken = token.trim().toLowerCase();

    if (normalizedInput === normalizedToken) {
      setUnlocked(true);
      setError('');
    } else {
      setError(
        'Invalid unlock token. Join the competition Telegram group to retrieve your access key.'
      );
    }
  };

  return (
    <div className='space-y-8'>
      <div
        className={`relative transition ${
          unlocked ? 'pointer-events-none opacity-20 blur-[2px]' : ''
        }`}
      >
        <div className='rounded-3xl border border-white/10 bg-black/60 p-6 shadow-[0_30px_110px_rgba(15,23,42,0.6)] backdrop-blur'>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <div className='space-y-2'>
              <span className='inline-flex items-center rounded-full border border-amber-300/40 bg-amber-200/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.32em] text-amber-100'>
                Unlock Required
              </span>
              <h2 className='text-2xl font-semibold text-white md:text-3xl'>
                Join the Arena, Grab Your Unlock Token
              </h2>
              <p className='max-w-2xl text-sm leading-relaxed text-slate-300 md:text-base'>
                Access to the tournament form is protected. Join the Cardic
                Nexus competition channel, request your unlock token, then enter
                it below to proceed.
              </p>
            </div>
            <Link
              href='https://t.me/cardicnexusglobal'
              target='_blank'
              rel='noreferrer'
              className='inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-sky-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-sky-100 transition hover:border-sky-300/70 hover:bg-sky-500/20'
            >
              Join Competition Telegram ↗
            </Link>
          </div>

          <form
            onSubmit={handleSubmit}
            className='mt-6 flex flex-col gap-4 md:flex-row'
          >
            <input
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              type='text'
              placeholder='Enter unlock token'
              className='flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/40'
              autoComplete='off'
            />
            <button
              type='submit'
              className='inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 px-6 py-3 text-sm font-semibold text-black shadow-[0_18px_45px_rgba(45,212,191,0.35)] transition hover:scale-[1.01] hover:shadow-[0_22px_55px_rgba(14,165,233,0.38)]'
            >
              Unlock Form
            </button>
          </form>
          {error ? (
            <p className='mt-3 rounded-xl border border-rose-400/40 bg-rose-500/10 px-4 py-2 text-xs text-rose-200'>
              {error}
            </p>
          ) : null}

          <div className='mt-6 flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-slate-400'>
            <span className='rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1'>
              Supported by Trustpilot
            </span>
            <span className='rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1'>
              Verified Competition Desk
            </span>
            <a
              href='https://t.me/REALCARDIC'
              target='_blank'
              rel='noreferrer'
              className='rounded-full border border-white/20 bg-white/10 px-3 py-1 font-semibold tracking-[0.26em] text-white transition hover:border-white/40'
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>

      <div
        className={
          unlocked
            ? 'pointer-events-auto opacity-100 transition'
            : 'pointer-events-none select-none opacity-20 blur-[3px] transition'
        }
      >
        {children}
      </div>
    </div>
  );
}
