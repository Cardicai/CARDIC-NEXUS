'use client';

import { type ReactNode, useCallback } from 'react';

import { dispatchReferralModalOpen } from '@/lib/events';

type ReferCTAButtonProps = {
  className?: string;
  children: ReactNode;
};

export default function ReferCTAButton({
  className,
  children,
}: ReferCTAButtonProps) {
  const handleClick = useCallback(() => {
    dispatchReferralModalOpen();
  }, []);

  return (
    <button
      type='button'
      onClick={handleClick}
      className={
        className ??
        'rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 px-6 py-3 text-sm font-semibold text-black shadow-lg shadow-indigo-500/40 transition hover:scale-[1.03]'
      }
    >
      {children}
    </button>
  );
}
