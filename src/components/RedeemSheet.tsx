'use client';

import { FormEvent, useEffect, useState } from 'react';

interface RedeemSheetProps {
  open: boolean;
  onClose: () => void;
}

export default function RedeemSheet({ open, onClose }: RedeemSheetProps) {
  const [mode, setMode] = useState<'form' | 'success'>('form');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    setMode('form');
    setSubmitting(false);
    setError(null);

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);

    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [open, onClose]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/redeem', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Request failed');
      }

      form.reset();
      setMode('success');
    } catch (err) {
      setError('We could not submit your redemption. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className='cnx-redeem-sheet' onClick={onClose}>
      <div className='cnx-redeem-backdrop' />
      <div
        className='cnx-redeem-dialog'
        role='dialog'
        aria-modal='true'
        aria-labelledby='redeem-sheet-title'
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type='button'
          className='cnx-redeem-close'
          onClick={onClose}
          aria-label='Close redeem sheet'
        >
          ×
        </button>

        {mode === 'form' ? (
          <form className='cnx-redeem-form' onSubmit={handleSubmit}>
            <h2 id='redeem-sheet-title'>Redeem Access</h2>
            <p className='cnx-redeem-copy'>
              Enter your redeem code and TradingView username so we can unlock
              your access.
            </p>
            <label className='cnx-redeem-field'>
              <span>Redeem Code</span>
              <input
                type='text'
                name='code'
                placeholder='Enter redeem code'
                required
              />
            </label>
            <label className='cnx-redeem-field'>
              <span>TradingView Username</span>
              <input
                type='text'
                name='tradingview'
                placeholder='@username'
                required
              />
            </label>
            {error ? (
              <p role='alert' className='cnx-redeem-error'>
                {error}
              </p>
            ) : null}
            <button
              type='submit'
              className='cnx-redeem-submit'
              disabled={submitting}
            >
              {submitting ? 'Sending…' : 'Redeem'}
            </button>
          </form>
        ) : (
          <div className='cnx-redeem-success' role='status'>
            <div className='cnx-redeem-celebrate'>
              <div className='cnx-redeem-check' />
            </div>
            <h2>Success!</h2>
            <p>
              Your code was submitted. Our team will activate your TradingView
              access shortly.
            </p>
            <button
              type='button'
              className='cnx-redeem-submit'
              onClick={onClose}
            >
              Close
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .cnx-redeem-sheet {
          position: fixed;
          inset: 0;
          z-index: 1100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .cnx-redeem-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(10, 12, 16, 0.78);
          backdrop-filter: blur(8px);
        }
        .cnx-redeem-dialog {
          position: relative;
          width: min(420px, 100%);
          border-radius: 24px;
          padding: 32px 28px;
          background: rgba(16, 18, 24, 0.96);
          border: 1px solid rgba(255, 255, 255, 0.14);
          box-shadow: 0 18px 60px rgba(2, 8, 20, 0.4);
          color: #fff;
          display: grid;
        }
        .cnx-redeem-close {
          position: absolute;
          top: 14px;
          right: 14px;
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.25);
          width: 34px;
          height: 34px;
          border-radius: 50%;
          font-size: 20px;
          line-height: 1;
          cursor: pointer;
          display: grid;
          place-items: center;
          transition: 0.2s;
        }
        .cnx-redeem-close:hover {
          background: rgba(255, 255, 255, 0.16);
        }
        .cnx-redeem-form {
          display: grid;
          gap: 16px;
        }
        .cnx-redeem-form h2,
        .cnx-redeem-success h2 {
          margin: 0;
          font-size: 24px;
          font-weight: 800;
          color: var(--gold, #f5c76b);
        }
        .cnx-redeem-copy {
          margin: 0;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.72);
          line-height: 1.5;
        }
        .cnx-redeem-field {
          display: grid;
          gap: 8px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.82);
        }
        .cnx-redeem-field input {
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
          padding: 10px 12px;
          border-radius: 12px;
          font-size: 15px;
          font-family: inherit;
        }
        .cnx-redeem-field input::placeholder {
          color: rgba(255, 255, 255, 0.55);
        }
        .cnx-redeem-error {
          margin: 0;
          font-size: 13px;
          color: #ffb4b4;
          background: rgba(255, 80, 80, 0.16);
          border: 1px solid rgba(255, 80, 80, 0.35);
          padding: 8px 10px;
          border-radius: 10px;
        }
        .cnx-redeem-submit {
          background: var(--blue, #10a5ff);
          color: #000;
          border: none;
          padding: 12px;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.2s;
        }
        .cnx-redeem-submit:hover {
          filter: brightness(1.08);
        }
        .cnx-redeem-submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          filter: none;
        }
        .cnx-redeem-success {
          display: grid;
          gap: 18px;
          justify-items: center;
          text-align: center;
        }
        .cnx-redeem-success p {
          margin: 0;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.75);
          line-height: 1.6;
        }
        .cnx-redeem-celebrate {
          position: relative;
          width: 96px;
          height: 96px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: radial-gradient(
            circle,
            rgba(16, 165, 255, 0.25),
            rgba(16, 165, 255, 0)
          );
          animation: cnx-redeem-pulse 1.8s ease-in-out infinite;
        }
        .cnx-redeem-check {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: var(--gold, #f5c76b);
          position: relative;
          overflow: hidden;
        }
        .cnx-redeem-check::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 28%;
          width: 18px;
          height: 36px;
          border-right: 4px solid #0a0b0d;
          border-bottom: 4px solid #0a0b0d;
          transform: translate(-50%, -60%) rotate(45deg);
          transform-origin: center;
          animation: cnx-redeem-check 0.5s ease forwards 0.2s;
          opacity: 0;
        }
        @keyframes cnx-redeem-pulse {
          0%,
          100% {
            transform: scale(0.95);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.05);
            opacity: 1;
          }
        }
        @keyframes cnx-redeem-check {
          0% {
            opacity: 0;
            transform: translate(-50%, -60%) rotate(45deg) scale(0.8);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -60%) rotate(45deg) scale(1);
          }
        }
        @media (max-width: 640px) {
          .cnx-redeem-sheet {
            padding: 12px;
          }
          .cnx-redeem-dialog {
            padding: 28px 20px;
            max-height: 95vh;
          }
        }
      `}</style>
    </div>
  );
}
