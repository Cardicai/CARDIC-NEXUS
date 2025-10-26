'use client';

import Image from 'next/image';
import { FormEvent, useEffect, useRef, useState } from 'react';

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

const methodTabs = [
  {
    id: 'crypto' as const,
    label: 'Crypto Desk',
    subtitle: 'BTC • ETH • USDT',
    badges: [
      { label: 'BTC', bg: '#f7931a', fg: '#0f172a' },
      { label: 'ETH', bg: '#627eea', fg: '#f8fafc' },
      { label: 'USDT', bg: '#26a17b', fg: '#0f172a' },
    ],
  },
  {
    id: 'paypal' as const,
    label: 'PayPal',
    subtitle: 'Secure invoice or direct transfer',
    badges: [{ label: 'PayPal', bg: '#003087', fg: '#f8fafc' }],
  },
  {
    id: 'bank' as const,
    label: 'Local Bank Transfer',
    subtitle: 'Nigeria • UK • EU • UAE',
    badges: [{ label: 'Wire', bg: '#0f172a', fg: '#e2e8f0' }],
  },
  {
    id: 'apple-pay' as const,
    label: 'Apple Pay',
    subtitle: 'Tap-to-pay invoice',
    badges: [{ label: ' Pay', bg: '#0a0a0a', fg: '#f8fafc' }],
  },
];

type PaymentMethodId = (typeof methodTabs)[number]['id'];
type PaymentLinkMethod = Exclude<PaymentMethodId, 'crypto'>;

export default function PaymentSheet({
  open,
  onClose,
  plan,
}: PaymentSheetProps) {
  const [activeMethod, setActiveMethod] = useState<PaymentMethodId>('crypto');
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    tone: 'success' | 'info' | 'error';
    message: string;
  } | null>(null);
  const toastTimer = useRef<NodeJS.Timeout | null>(null);
  const copyTimer = useRef<NodeJS.Timeout | null>(null);
  const [linkFeedback, setLinkFeedback] = useState<PaymentLinkMethod | null>(
    null
  );
  const linkTimer = useRef<NodeJS.Timeout | null>(null);

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
    if (open) {
      setToast(null);
      setLinkFeedback(null);
      return;
    }

    setCopiedAddress(null);
    if (copyTimer.current) {
      clearTimeout(copyTimer.current);
      copyTimer.current = null;
    }
    if (linkTimer.current) {
      clearTimeout(linkTimer.current);
      linkTimer.current = null;
    }
    setLinkFeedback(null);
  }, [open]);

  useEffect(() => {
    return () => {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }
      if (copyTimer.current) {
        clearTimeout(copyTimer.current);
      }
      if (linkTimer.current) {
        clearTimeout(linkTimer.current);
      }
    };
  }, []);

  const showToast = (
    tone: 'success' | 'info' | 'error',
    message: string,
    duration = 4200
  ) => {
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }
    setToast({ tone, message });
    toastTimer.current = setTimeout(() => {
      setToast(null);
      toastTimer.current = null;
    }, duration);
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAddress(text);
      showToast('success', 'CardicNex says: Address copied to clipboard.');
      if (copyTimer.current) {
        clearTimeout(copyTimer.current);
      }
      copyTimer.current = setTimeout(() => {
        setCopiedAddress((current) => (current === text ? null : current));
        copyTimer.current = null;
      }, 2800);
    } catch {
      showToast('error', 'CardicNex says: Unable to copy right now.');
    }
  };

  const handleLinkRequest = (method: PaymentLinkMethod) => {
    setLinkFeedback(method);
    if (linkTimer.current) {
      clearTimeout(linkTimer.current);
    }
    linkTimer.current = setTimeout(() => {
      setLinkFeedback((current) => (current === method ? null : current));
      linkTimer.current = null;
    }, 3200);
    showToast('info', 'CardicNex says: No link available for now.');
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
        showToast(
          'success',
          'CardicNex says: Payment request received. Watch your inbox.'
        );
        event.currentTarget.reset();
        onClose();
      } else {
        showToast(
          'error',
          'CardicNex says: We could not submit that form. Try again.'
        );
      }
    } catch (error) {
      showToast(
        'error',
        'CardicNex says: We could not submit that form. Try again.'
      );
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
              Choose your preferred payment rail, confirm the transaction, then
              submit the receipt for instant desk review.
            </p>
            <a
              className='cnx-support-chip'
              href='https://t.me/REALCARDIC'
              target='_blank'
              rel='noreferrer'
            >
              Need help? DM @REALCARDIC ↗
            </a>
          </div>

          <div className='cnx-method-tabs'>
            {methodTabs.map((tab) => (
              <button
                key={tab.id}
                type='button'
                className={`cnx-method-tab ${
                  activeMethod === tab.id ? 'active' : ''
                }`}
                onClick={() => setActiveMethod(tab.id)}
              >
                <span className='cnx-method-top'>
                  {tab.badges.map((badge) => (
                    <span
                      key={badge.label}
                      className='cnx-method-badge'
                      style={{ backgroundColor: badge.bg, color: badge.fg }}
                    >
                      {badge.label}
                    </span>
                  ))}
                </span>
                <span className='cnx-method-label'>{tab.label}</span>
                <span className='cnx-method-subtitle'>{tab.subtitle}</span>
              </button>
            ))}
          </div>

          <div className='cnx-method-panel'>
            {activeMethod === 'crypto' && (
              <div className='cnx-pay-grid'>
                <div className='cnx-pay-card'>
                  <h3>
                    <span aria-hidden='true'>₮</span> USDT (ERC-20)
                  </h3>
                  <div className='cnx-address-row'>
                    <span className='cnx-address'>{USDT_ADDRESS}</span>
                    <button
                      className='cnx-copy'
                      type='button'
                      onClick={() => copy(USDT_ADDRESS)}
                    >
                      {copiedAddress === USDT_ADDRESS ? 'Copied' : 'Copy'}
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
                  <h3>
                    <span aria-hidden='true'>Ξ</span> ETH (ERC-20)
                  </h3>
                  <div className='cnx-address-row'>
                    <span className='cnx-address'>{ETH_ADDRESS}</span>
                    <button
                      className='cnx-copy'
                      type='button'
                      onClick={() => copy(ETH_ADDRESS)}
                    >
                      {copiedAddress === ETH_ADDRESS ? 'Copied' : 'Copy'}
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
                  <h3>
                    <span aria-hidden='true'>₿</span> BTC (SegWit)
                  </h3>
                  <div className='cnx-address-row'>
                    <span className='cnx-address'>{BTC_ADDRESS}</span>
                    <button
                      className='cnx-copy'
                      type='button'
                      onClick={() => copy(BTC_ADDRESS)}
                    >
                      {copiedAddress === BTC_ADDRESS ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <div className='cnx-note'>Network: BTC SegWit.</div>
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
            )}

            {activeMethod === 'paypal' && (
              <div className='cnx-method-info'>
                <div className='cnx-method-hero paypal'>
                  <span className='paypal-icon' aria-hidden='true'>
                    P
                  </span>
                  <span>PayPal Merchant Checkout</span>
                </div>
                <p className='cnx-method-copy'>
                  Request a secure PayPal link and we&apos;ll notify you once
                  it&apos;s live.
                </p>
                <button
                  type='button'
                  className='cnx-method-link'
                  onClick={() => handleLinkRequest('paypal')}
                >
                  {linkFeedback === 'paypal'
                    ? 'CardicNex says: Check back soon'
                    : 'Request link'}
                </button>
              </div>
            )}

            {activeMethod === 'bank' && (
              <div className='cnx-method-info'>
                <div className='cnx-method-hero bank'>
                  <span aria-hidden='true'>🏦</span>
                  <span>Local Bank Transfer Desk</span>
                </div>
                <p className='cnx-method-copy'>
                  Tap below to request regional banking details when they become
                  available.
                </p>
                <button
                  type='button'
                  className='cnx-method-link'
                  onClick={() => handleLinkRequest('bank')}
                >
                  {linkFeedback === 'bank'
                    ? 'CardicNex says: Check back soon'
                    : 'Request link'}
                </button>
              </div>
            )}

            {activeMethod === 'apple-pay' && (
              <div className='cnx-method-info'>
                <div className='cnx-method-hero apple'>
                  <span aria-hidden='true'></span>
                  <span>Apple Pay Secure Link</span>
                </div>
                <p className='cnx-method-copy'>
                  We&apos;ll alert you when Apple Pay tap-to-pay links are
                  online.
                </p>
                <button
                  type='button'
                  className='cnx-method-link'
                  onClick={() => handleLinkRequest('apple-pay')}
                >
                  {linkFeedback === 'apple-pay'
                    ? 'CardicNex says: Check back soon'
                    : 'Request link'}
                </button>
              </div>
            )}
          </div>

          <div className='cnx-trust-row'>
            <span className='cnx-trust-badge'>Supported by Trustpilot</span>
            <span className='cnx-trust-score'>4.9 ★ community rating</span>
          </div>

          {activeMethod === 'crypto' ? (
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
          ) : null}
        </div>
      </div>

      {toast ? (
        <div
          className={`cnx-toast ${toast.tone}`}
          role='status'
          aria-live='polite'
        >
          {toast.message}
        </div>
      ) : null}

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
        .cnx-support-chip {
          align-self: flex-start;
          margin-top: 8px;
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          background: rgba(56, 189, 248, 0.18);
          color: #bae6fd;
          border: 1px solid rgba(56, 189, 248, 0.35);
          text-decoration: none;
        }
        .cnx-support-chip:hover {
          background: rgba(56, 189, 248, 0.28);
        }
        .cnx-method-tabs {
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          margin-bottom: 20px;
        }
        .cnx-method-tab {
          position: relative;
          padding: 14px;
          border-radius: 16px;
          border: 1px solid rgba(59, 130, 246, 0.2);
          background: rgba(15, 23, 42, 0.6);
          color: #e2e8f0;
          text-align: left;
          transition: border-color 0.2s, transform 0.2s;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .cnx-method-tab:hover {
          transform: translateY(-2px);
        }
        .cnx-method-tab.active {
          border-color: rgba(245, 199, 107, 0.6);
          box-shadow: 0 0 0 1px rgba(245, 199, 107, 0.25);
        }
        .cnx-method-top {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .cnx-method-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 4px 8px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
        }
        .cnx-method-label {
          font-weight: 700;
          font-size: 15px;
        }
        .cnx-method-subtitle {
          font-size: 12px;
          color: rgba(148, 163, 184, 0.95);
        }
        .cnx-method-panel {
          margin-bottom: 24px;
        }
        .cnx-toast {
          position: fixed;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%);
          padding: 14px 20px;
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.25);
          background: rgba(15, 23, 42, 0.92);
          color: #e2e8f0;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.04em;
          box-shadow: 0 22px 55px rgba(2, 8, 23, 0.5);
          z-index: 1100;
        }
        .cnx-toast.success {
          border-color: rgba(34, 197, 94, 0.45);
          color: #bbf7d0;
        }
        .cnx-toast.info {
          border-color: rgba(56, 189, 248, 0.45);
          color: #bae6fd;
        }
        .cnx-toast.error {
          border-color: rgba(248, 113, 113, 0.45);
          color: #fecdd3;
        }
        .cnx-pay-grid {
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
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
          display: flex;
          align-items: center;
          gap: 8px;
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
        .cnx-method-info {
          background: rgba(15, 23, 42, 0.75);
          border: 1px solid rgba(148, 163, 184, 0.25);
          border-radius: 20px;
          padding: 20px;
          display: grid;
          gap: 12px;
        }
        .cnx-method-copy {
          margin: 0;
          color: #e2e8f0;
          font-size: 14px;
          line-height: 1.6;
        }
        .cnx-method-hero {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-weight: 700;
          font-size: 16px;
          padding: 10px 14px;
          border-radius: 14px;
        }
        .cnx-method-hero.paypal {
          background: rgba(0, 48, 135, 0.16);
          color: #e2f1ff;
        }
        .paypal-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 26px;
          height: 26px;
          border-radius: 8px;
          background: linear-gradient(135deg, #0070e0, #003087);
          color: #fff;
          font-weight: 700;
          font-size: 18px;
        }
        .cnx-method-hero.bank {
          background: rgba(15, 23, 42, 0.7);
          color: #cbd5f5;
        }
        .cnx-method-hero.apple {
          background: rgba(10, 10, 10, 0.85);
          color: #f8fafc;
        }
        .cnx-method-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 600;
          color: #0f172a;
          background: rgba(56, 189, 248, 0.25);
          border: 1px solid rgba(56, 189, 248, 0.45);
          border-radius: 999px;
          padding: 8px 18px;
          cursor: pointer;
        }
        .cnx-method-link:hover {
          background: rgba(56, 189, 248, 0.35);
        }
        .cnx-method-link:focus-visible {
          outline: 2px solid rgba(56, 189, 248, 0.8);
          outline-offset: 2px;
        }
        .cnx-trust-row {
          margin: 18px 0 0;
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(226, 232, 240, 0.75);
        }
        .cnx-trust-badge {
          padding: 4px 10px;
          border-radius: 999px;
          background: rgba(34, 197, 94, 0.18);
          border: 1px solid rgba(34, 197, 94, 0.4);
        }
        .cnx-trust-score {
          padding: 4px 10px;
          border-radius: 999px;
          background: rgba(59, 130, 246, 0.12);
          border: 1px solid rgba(59, 130, 246, 0.35);
        }
        .cnx-pay-form-title {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
        }
        .cnx-form {
          display: grid;
          gap: 12px;
          margin-top: 18px;
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
          .cnx-method-tabs {
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          }
        }
      `}</style>
    </div>
  );
}
