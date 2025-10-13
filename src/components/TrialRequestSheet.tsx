'use client';

import { FormEvent, useEffect, useState } from 'react';

interface TrialRequestSheetProps {
  open: boolean;
  onClose: () => void;
}

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export default function TrialRequestSheet({
  open,
  onClose,
}: TrialRequestSheetProps) {
  const [state, setState] = useState<FormState>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) {
      return;
    }

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

  useEffect(() => {
    if (!open) {
      setState('idle');
      setError('');
    }
  }, [open]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState('submitting');
    setError('');

    const formData = new FormData(event.currentTarget);

    try {
      const res = await fetch('/api/trial-request', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setState('success');
        event.currentTarget.reset();
        return;
      }

      const data = (await res.json().catch(() => null)) as {
        message?: string;
      } | null;
      setError(data?.message || 'Unable to send request. Please try again.');
      setState('error');
    } catch (err) {
      setError('Unable to send request. Please try again.');
      setState('error');
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className='cnx-trial-sheet' onClick={onClose}>
      <div className='cnx-trial-backdrop' />
      <div
        className='cnx-trial-dialog'
        role='dialog'
        aria-modal='true'
        aria-labelledby='trial-sheet-title'
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type='button'
          className='cnx-trial-close'
          onClick={onClose}
          aria-label='Close free trial form'
        >
          ×
        </button>

        {state === 'success' ? (
          <div className='cnx-trial-success' role='status'>
            <h2 id='trial-sheet-title'>Request Received</h2>
            <p>
              Thank you! Our team has your TradingView details and will reach
              out via email soon.
            </p>
            <button
              type='button'
              className='cnx-btn cnx-btn-blue'
              onClick={onClose}
            >
              Close
            </button>
          </div>
        ) : (
          <form className='cnx-trial-form' onSubmit={handleSubmit}>
            <h2 id='trial-sheet-title'>Claim Your Free Trial</h2>
            <p>
              Drop your TradingView username and gaming tag so we can activate
              your access.
            </p>

            <label className='cnx-trial-field' htmlFor='trial-tradingview'>
              TradingView Username
              <input
                id='trial-tradingview'
                name='tradingview'
                placeholder='@YourHandle'
                required
                autoComplete='off'
              />
            </label>

            <label className='cnx-trial-field' htmlFor='trial-gaming-tag'>
              Gaming Tag
              <input
                id='trial-gaming-tag'
                name='gamingTag'
                placeholder='Your gaming ID or alias'
                autoComplete='off'
              />
            </label>

            {state === 'error' ? (
              <p role='alert' className='cnx-trial-error'>
                {error}
              </p>
            ) : null}

            <button
              type='submit'
              className='cnx-btn cnx-btn-blue'
              disabled={state === 'submitting'}
            >
              {state === 'submitting' ? 'Sending…' : 'Submit'}
            </button>
          </form>
        )}
      </div>

      <style>{`
        .cnx-trial-sheet {
          position: fixed;
          inset: 0;
          z-index: 90;
          display: grid;
          place-items: center;
        }
        .cnx-trial-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(4, 3, 20, 0.78);
          backdrop-filter: blur(12px);
        }
        .cnx-trial-dialog {
          position: relative;
          width: min(420px, calc(100% - 32px));
          border-radius: 24px;
          padding: 32px 28px 30px;
          background: linear-gradient(145deg, rgba(19, 16, 42, 0.94), rgba(15, 10, 32, 0.92));
          border: 1px solid rgba(79, 205, 255, 0.32);
          box-shadow: 0 30px 90px rgba(9, 10, 32, 0.65);
          color: #f7f5ff;
          overflow: hidden;
        }
        .cnx-trial-dialog::before {
          content: '';
          position: absolute;
          inset: -40%;
          background: radial-gradient(circle at 30% 20%, rgba(79, 205, 255, 0.35), transparent 65%),
            radial-gradient(circle at 80% 10%, rgba(139, 93, 255, 0.25), transparent 60%);
          opacity: 0.8;
          z-index: -1;
          filter: blur(40px);
        }
        .cnx-trial-close {
          position: absolute;
          top: 10px;
          right: 12px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: none;
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
          font-size: 20px;
          cursor: pointer;
          transition: transform 0.2s ease, background 0.2s ease;
        }
        .cnx-trial-close:hover {
          transform: scale(1.05);
          background: rgba(255, 255, 255, 0.16);
        }
        .cnx-trial-form,
        .cnx-trial-success {
          display: flex;
          flex-direction: column;
          gap: 18px;
          text-align: left;
        }
        .cnx-trial-form h2,
        .cnx-trial-success h2 {
          margin: 0;
          font-size: 26px;
          font-weight: 800;
        }
        .cnx-trial-form p,
        .cnx-trial-success p {
          margin: 0;
          font-size: 15px;
          line-height: 1.55;
          color: rgba(226, 223, 245, 0.85);
        }
        .cnx-trial-field {
          display: flex;
          flex-direction: column;
          font-size: 14px;
          font-weight: 600;
          color: rgba(240, 237, 255, 0.92);
          gap: 8px;
        }
        .cnx-trial-field input {
          padding: 12px 14px;
          border-radius: 14px;
          border: 1px solid rgba(124, 120, 198, 0.45);
          background: rgba(14, 12, 32, 0.85);
          color: #fdfdff;
          font-size: 15px;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .cnx-trial-field input:focus {
          border-color: rgba(79, 205, 255, 0.75);
          box-shadow: 0 0 0 3px rgba(79, 205, 255, 0.2);
        }
        .cnx-trial-field input::placeholder {
          color: rgba(200, 198, 221, 0.6);
        }
        .cnx-trial-error {
          margin: -6px 0 0;
          color: #ff8c94;
          font-size: 14px;
          font-weight: 600;
        }
        .cnx-trial-success {
          align-items: flex-start;
        }
        .cnx-trial-success button {
          align-self: flex-start;
        }
        @media (max-width: 520px) {
          .cnx-trial-dialog {
            padding: 26px 22px 24px;
          }
          .cnx-trial-form h2,
          .cnx-trial-success h2 {
            font-size: 22px;
          }
        }
      `}</style>
    </div>
  );
}
