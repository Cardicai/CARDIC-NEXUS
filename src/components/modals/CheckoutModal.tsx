'use client';

import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type CheckoutModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: string;
};

export default function CheckoutModal({
  open,
  onOpenChange,
  plan,
}: CheckoutModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onOpenChange(false);
      }
    };

    window.addEventListener('keydown', handleKey);

    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [open, onOpenChange]);

  if (!mounted || !open) {
    return null;
  }

  const url = `/billing/checkout?plan=${encodeURIComponent(plan)}`;

  return createPortal(
    <div className='fixed inset-0 z-[1000] flex items-center justify-center px-4 py-8'>
      <button
        type='button'
        aria-label='Close checkout'
        className='absolute inset-0 bg-black/60 backdrop-blur-sm'
        onClick={() => onOpenChange(false)}
      />
      <div
        role='dialog'
        aria-modal='true'
        aria-label={`Subscribe — ${plan}`}
        className='relative z-[1001] h-[85vh] w-[min(1100px,95vw)] overflow-hidden rounded-2xl border border-[#1a2230] bg-[#0e131b] shadow-2xl'
      >
        <div className='flex h-12 items-center justify-between border-b border-[#1a2230] px-4'>
          <h2 className='text-sm font-medium text-slate-200'>
            Subscribe — {plan}
          </h2>
          <button
            type='button'
            onClick={() => onOpenChange(false)}
            className='rounded p-2 text-slate-200 transition hover:bg-white/5'
          >
            <X className='h-4 w-4' aria-hidden />
          </button>
        </div>
        <iframe
          title={`Checkout ${plan}`}
          src={url}
          className='h-[calc(85vh-3rem)] w-full'
          loading='lazy'
          sandbox='allow-same-origin allow-scripts allow-forms allow-popups'
        />
      </div>
    </div>,
    document.body
  );
}
