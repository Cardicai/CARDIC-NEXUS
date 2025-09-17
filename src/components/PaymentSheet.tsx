'use client';

import Image from 'next/image';
import { FormEvent, useEffect } from 'react';

export type PaymentPlan = {
  id: string;
  title: string;
  price: string;
};

interface PaymentSheetProps {
  open: boolean;
  onClose: () => void;
  plan: PaymentPlan | null;
}

const USDT_ADDRESS = '0x713598879a14D07013d3154b225D2fa838bb0a54';
const ETH_ADDRESS = '0x713598879a14D07013d3154b225D2fa838bb0a54';
const BTC_ADDRESS = 'bc1qm034jk98v7yzdy5yedyvwave96ujqjgnqyytm3';

export default function PaymentSheet({
  open,
  onClose,
  plan,
}: PaymentSheetProps) {
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

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied');
    } catch {
      /* ignore */
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (plan?.id) {
      formData.set('planId', plan.id);
      formData.set('planTitle', plan.title);
      formData.set('planPrice', plan.price);
    }

    try {
      const res = await fetch('/api/submit-payment', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        alert('Success!');
        event.currentTarget.reset();
        onClose();
      } else {
        alert('Error submitting form');
      }
    } catch (error) {
      alert('Error submitting form');
    }
  };

  if (!open) {
    return null;
  }

  return (
    <div className='cnx-sheet' onClick={onClose}>
      <div className='cnx-sheet-backdrop' />
      <div
        className='cnx-sheet-dialog'
        role='dialog'
        aria-modal='true'
        aria-labelledby='payment-sheet-title'
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type='button'
          className='cnx-sheet-close'
          onClick={onClose}
          aria-label='Close payment sheet'
        >
          ×
        </button>

        <div className='cnx-pay-panel'>
          <div className='cnx-sheet-heading'>
            <div>
              <h2 id='payment-sheet-title'>{plan?.title ?? 'Join Premium'}</h2>
              <div className='cnx-sheet-price'>
                {plan?.price ?? 'Select a plan to continue'}
              </div>
            </div>
            <p className='cnx-sheet-description'>
              Crypto payments (USDT / ETH / BTC). Pick any address, make
              payment, then submit your details + proof.
            </p>
          </div>

          <div className='cnx-pay-grid'>
            <div className='cnx-pay-card'>
              <h3>USDT (ERC-20)</h3>
              <div className='cnx-address-row'>
                <span className='cnx-address'>{USDT_ADDRESS}</span>
                <button
                  className='cnx-copy'
                  type='button'
                  onClick={() => copy(USDT_ADDRESS)}
                >
                  Copy
                </button>
              </div>
              <div className='cnx-note'>Network: ERC-20 only.</div>
              <div className='cnx-qr'>
                <Image
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${USDT_ADDRESS}`}
                  width={120}
                  height={120}
                  alt='USDT QR code'
                  unoptimized
                />
              </div>
            </div>

            <div className='cnx-pay-card'>
              <h3>ETH (ERC-20)</h3>
              <div className='cnx-address-row'>
                <span className='cnx-address'>{ETH_ADDRESS}</span>
                <button
                  className='cnx-copy'
                  type='button'
                  onClick={() => copy(ETH_ADDRESS)}
                >
                  Copy
                </button>
              </div>
              <div className='cnx-note'>Network: ERC-20 only.</div>
              <div className='cnx-qr'>
                <Image
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${ETH_ADDRESS}`}
                  width={120}
                  height={120}
                  alt='ETH QR code'
                  unoptimized
                />
              </div>
            </div>

            <div className='cnx-pay-card'>
              <h3>BTC</h3>
              <div className='cnx-address-row'>
                <span className='cnx-address'>{BTC_ADDRESS}</span>
                <button
                  className='cnx-copy'
                  type='button'
                  onClick={() => copy(BTC_ADDRESS)}
                >
                  Copy
                </button>
              </div>
              <div className='cnx-note'>Network: BTC (SegWit).</div>
              <div className='cnx-qr'>
                <Image
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${BTC_ADDRESS}`}
                  width={120}
                  height={120}
                  alt='BTC QR code'
                  unoptimized
                />
              </div>
            </div>
          </div>

          <form className='cnx-form' onSubmit={handleSubmit}>
            <h3 className='cnx-pay-form-title'>Submit Payment Proof</h3>
            {plan?.id ? (
              <input type='hidden' name='planId' value={plan.id} />
            ) : null}
            {plan?.title ? (
              <input type='hidden' name='planTitle' value={plan.title} />
            ) : null}
            {plan?.price ? (
              <input type='hidden' name='planPrice' value={plan.price} />
            ) : null}
            <input type='text' name='name' placeholder='Full Name' required />
            <input type='email' name='email' placeholder='Email' required />
            <input
              type='text'
              name='tradingview'
              placeholder='TradingView Username'
              required
            />
            <input
              type='text'
              name='contact'
              placeholder='Contact (Telegram @ or WhatsApp)'
            />
            <input
              type='text'
              name='txHash'
              placeholder='Transaction Hash/ID (optional)'
            />
            <textarea name='notes' placeholder='Notes (optional)' rows={3} />
            <input
              type='file'
              name='proof'
              accept='image/*,application/pdf'
              required
            />
            <button type='submit'>Submit</button>
          </form>
        </div>
      </div>

      <style jsx>{`
        .cnx-sheet {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .cnx-sheet-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(10, 12, 16, 0.78);
          backdrop-filter: blur(8px);
        }
        .cnx-sheet-dialog {
          position: relative;
          width: min(720px, 100%);
          max-height: 90vh;
          overflow-y: auto;
          border-radius: 24px;
          box-shadow: 0 18px 60px rgba(2, 8, 20, 0.4);
        }
        .cnx-sheet-close {
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
        .cnx-sheet-close:hover {
          background: rgba(255, 255, 255, 0.16);
        }
        .cnx-pay-panel {
          background: rgba(16, 18, 24, 0.96);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 22px;
          padding: 28px;
          box-shadow: 0 0 0 1px rgba(245, 199, 107, 0.25),
            0 0 28px rgba(16, 165, 255, 0.12);
          color: #fff;
        }
        .cnx-sheet-heading {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 20px;
        }
        .cnx-sheet-price {
          font-size: 16px;
          color: var(--blue, #10a5ff);
          font-weight: 700;
        }
        .cnx-sheet-description {
          margin: 0;
          color: #cfd3dc;
          font-size: 14px;
        }
        .cnx-pay-grid {
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          margin-bottom: 24px;
        }
        .cnx-pay-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 16px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .cnx-pay-card h3 {
          margin: 0;
        }
        .cnx-address-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          gap: 8px;
        }
        .cnx-address {
          word-break: break-all;
          font-family: monospace;
          color: #f3f5ff;
        }
        .cnx-copy {
          background: rgba(16, 165, 255, 0.15);
          color: #fff;
          border: 1px solid rgba(16, 165, 255, 0.4);
          padding: 4px 10px;
          border-radius: 8px;
          cursor: pointer;
          transition: 0.2s;
        }
        .cnx-copy:hover {
          background: rgba(16, 165, 255, 0.28);
        }
        .cnx-qr {
          margin-top: 4px;
          display: flex;
          justify-content: center;
        }
        .cnx-pay-form-title {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
        }
        .cnx-form {
          display: grid;
          gap: 12px;
        }
        .cnx-form input,
        .cnx-form textarea {
          width: 100%;
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
          padding: 10px;
          border-radius: 12px;
          font-family: inherit;
        }
        .cnx-form input::placeholder,
        .cnx-form textarea::placeholder {
          color: rgba(255, 255, 255, 0.55);
        }
        .cnx-form textarea {
          resize: vertical;
          min-height: 120px;
        }
        .cnx-form button {
          background: var(--blue, #10a5ff);
          color: #000;
          border: none;
          padding: 12px;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.2s;
        }
        .cnx-form button:hover {
          filter: brightness(1.08);
        }
        @media (max-width: 640px) {
          .cnx-sheet {
            padding: 12px;
          }
          .cnx-sheet-dialog {
            max-height: 95vh;
          }
          .cnx-pay-panel {
            padding: 22px 18px;
          }
          .cnx-sheet-description {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
}
