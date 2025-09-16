'use client';
import React from 'react';

type Plan = { id: string; title: string; price: string; features?: string[] };
type Props = { open: boolean; onClose: () => void; plan?: Plan | null };

export default function PaymentSheet({ open, onClose, plan }: Props) {
  if (!open) return null;
  return (
    <div
      aria-modal
      role='dialog'
      className='cnx-pay-overlay'
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className='cnx-pay-sheet'>
        <button className='cnx-pay-close' onClick={onClose} aria-label='Close'>
          ×
        </button>
        <h3 className='cnx-pay-title'>{plan?.title ?? 'Complete Purchase'}</h3>
        {plan?.price && <div className='cnx-pay-price'>{plan.price}</div>}

        <div className='cnx-pay-box'>
          <h4>Crypto Payment (USDT-ERC20)</h4>
          <p>Send the amount for your plan, then upload proof below.</p>
          <div className='cnx-pay-row'>
            <span>Wallet:</span>
            <code id='cnx-wallet'>0xYOURWALLETADDRESS</code>
            <button
              className='cnx-copy'
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText('0xYOURWALLETADDRESS');
                  alert('Wallet copied');
                } catch {
                  /* ignore */
                }
              }}
            >
              Copy
            </button>
          </div>
        </div>

        <form
          className='cnx-form'
          onSubmit={async (e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            const res = await fetch('/api/submit-payment', {
              method: 'POST',
              body: data,
            });
            if (res.ok) {
              alert('Submitted! We’ll email you shortly.');
              onClose();
              e.currentTarget.reset();
            } else {
              alert('Something went wrong. Please try again.');
            }
          }}
        >
          <input name='plan' defaultValue={plan?.id ?? ''} hidden />
          <label>
            Full name
            <input name='name' required />
          </label>
          <label>
            Email
            <input name='email' type='email' required />
          </label>
          <label>
            TradingView username
            <input name='tradingview' required />
          </label>
          <label>
            Proof of payment
            <input
              name='proof'
              type='file'
              accept='image/*,application/pdf'
              required
            />
          </label>
          <button className='cnx-btn cnx-btn-blue' type='submit'>
            Submit
          </button>
        </form>
      </div>

      <style jsx>{`
        .cnx-pay-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 80;
        }
        .cnx-pay-sheet {
          width: min(560px, 92vw);
          background: #0f1115;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 16px;
          padding: 18px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
          position: relative;
        }
        .cnx-pay-close {
          position: absolute;
          right: 12px;
          top: 8px;
          background: transparent;
          border: 0;
          color: #fff;
          font-size: 24px;
          cursor: pointer;
        }
        .cnx-pay-title {
          margin: 6px 0 4px;
          font-size: 20px;
        }
        .cnx-pay-price {
          color: #10a5ff;
          font-weight: 800;
          margin-bottom: 8px;
        }
        .cnx-pay-box {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          padding: 12px;
          margin: 10px 0;
        }
        .cnx-pay-row {
          display: flex;
          gap: 8px;
          align-items: center;
          flex-wrap: wrap;
        }
        .cnx-copy {
          padding: 6px 10px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          background: transparent;
          color: #fff;
        }
        .cnx-form {
          display: grid;
          gap: 10px;
          margin-top: 10px;
        }
        .cnx-form label {
          display: grid;
          gap: 6px;
          font-size: 14px;
          color: #cfd3dc;
        }
        .cnx-form input {
          background: #0b0d11;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 10px;
          padding: 10px;
          color: #fff;
        }
      `}</style>
    </div>
  );
}
