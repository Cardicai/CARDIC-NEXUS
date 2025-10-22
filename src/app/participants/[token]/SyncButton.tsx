'use client';

import { useFormStatus } from 'react-dom';

export function SyncButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type='submit'
      disabled={pending}
      className='inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-70'
    >
      {pending && (
        <span className='h-3 w-3 animate-spin rounded-full border-2 border-white/60 border-t-transparent' />
      )}
      {pending ? 'Syncing…' : 'Sync now'}
    </button>
  );
}
