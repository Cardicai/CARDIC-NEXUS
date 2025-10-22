'use client';

import clsx from 'clsx';
import { useEffect, useState } from 'react';

type EmailStatus = {
  verified: boolean;
  from: string;
};

type EmailWarningProps = {
  className?: string;
};

export default function EmailWarning({ className }: EmailWarningProps) {
  const [checked, setChecked] = useState(false);
  const [verified, setVerified] = useState(false);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/email/status', {
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch email status');
        }

        const data = (await response.json()) as EmailStatus;
        if (cancelled) return;
        setVerified(Boolean(data?.verified));
        setErrored(false);
      } catch {
        if (cancelled) return;
        setVerified(false);
        setErrored(true);
      } finally {
        if (!cancelled) {
          setChecked(true);
        }
      }
    };

    void fetchStatus();

    return () => {
      cancelled = true;
    };
  }, []);

  if (checked && verified) {
    return null;
  }

  return (
    <div
      className={clsx(
        'rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100 shadow-[0_0_32px_rgba(251,191,36,0.25)]',
        className
      )}
    >
      <p className='font-semibold tracking-wide'>Email sending limited</p>
      <p className='mt-1 text-xs text-amber-100/80'>
        You can only send test emails to your inbox until domain verification is
        complete.
      </p>
      {errored ? (
        <p className='mt-2 text-[11px] uppercase tracking-wide text-amber-200/70'>
          Unable to confirm status. Using safe fallback.
        </p>
      ) : null}
    </div>
  );
}
