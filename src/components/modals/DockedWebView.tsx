'use client';

import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type DockedWebViewProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url?: string;
  title?: string;
  className?: string;
};

export default function DockedWebView({
  open,
  onOpenChange,
  url = '/dock',
  title = 'Cardic Mentor (Docked)',
  className,
}: DockedWebViewProps) {
  const [mounted, setMounted] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onOpenChange(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onOpenChange]);

  useEffect(() => {
    if (open) {
      closeButtonRef.current?.focus({ preventScroll: true });
    }
  }, [open]);

  if (!mounted || !open) {
    return null;
  }

  return createPortal(
    <div
      className='fixed inset-0 z-[1000] flex items-center justify-center px-4 py-8'
      role='presentation'
    >
      <button
        type='button'
        aria-label='Close docked web view'
        className='absolute inset-0 bg-black/60 backdrop-blur-sm'
        onClick={() => onOpenChange(false)}
      />
      <div
        role='dialog'
        aria-modal='true'
        aria-label={title}
        className={`relative z-[1001] h-[85vh] w-[min(1100px,95vw)] overflow-hidden rounded-2xl border border-[#1a2230] bg-[#0e131b] shadow-2xl ${
          className ?? ''
        }`}
      >
        <div className='flex h-12 items-center justify-between border-b border-[#1a2230] px-4'>
          <h2 className='text-sm font-medium text-slate-200'>{title}</h2>
          <button
            ref={closeButtonRef}
            type='button'
            onClick={() => onOpenChange(false)}
            className='rounded p-2 text-slate-200 transition hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-200/60'
          >
            <X className='h-4 w-4' aria-hidden />
          </button>
        </div>
        <iframe
          title={title}
          src={url}
          className='h-[calc(85vh-3rem)] w-full'
          loading='lazy'
          referrerPolicy='no-referrer'
          sandbox='allow-same-origin allow-scripts allow-forms allow-popups'
          allow='fullscreen'
        />
      </div>
    </div>,
    document.body
  );
}
