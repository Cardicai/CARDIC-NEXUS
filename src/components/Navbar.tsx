'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';

import { REFERRAL_MODAL_EVENT } from '@/lib/events';

import ReferralModal from '@/components/ReferralModal';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener(REFERRAL_MODAL_EVENT, handler);
    return () => {
      window.removeEventListener(REFERRAL_MODAL_EVENT, handler);
    };
  }, []);

  return (
    <>
      <header className='sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur'>
        <div className='mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6'>
          <Link href='/' className='font-semibold tracking-widest text-white'>
            <span className='bg-gradient-to-r from-slate-200 via-white to-slate-200 bg-clip-text text-lg text-transparent'>
              CARDIC NEXUS
            </span>
          </Link>
          <nav className='hidden items-center gap-8 text-sm font-medium text-slate-200 md:flex'>
            <Link
              href='/'
              className='transition hover:text-white hover:drop-shadow-[0_0_6px_rgba(20,190,255,0.6)]'
            >
              Home
            </Link>
            <Link
              href='/refer'
              className='transition hover:text-white hover:drop-shadow-[0_0_6px_rgba(20,190,255,0.6)]'
            >
              Referral Program
            </Link>
            <Link
              href='/#solutions'
              className='transition hover:text-white hover:drop-shadow-[0_0_6px_rgba(20,190,255,0.6)]'
            >
              Solutions
            </Link>
          </nav>
          <button
            type='button'
            onClick={openModal}
            className='rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-violet-500 px-5 py-2 text-sm font-semibold text-black shadow-lg shadow-indigo-500/30 transition hover:scale-105 hover:shadow-indigo-500/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400'
          >
            Refer & Earn
          </button>
        </div>
      </header>
      <ReferralModal open={open} onClose={closeModal} />
    </>
  );
}
