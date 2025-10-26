'use client';

import Link from 'next/link';
import { CSSProperties, FormEvent, useMemo, useState } from 'react';

type ReferralResult = {
  code: string;
  link: string;
};

type Toast = {
  id: number;
  message: string;
};

export default function PartnerPage() {
  const [referralLoading, setReferralLoading] = useState(false);
  const [referralError, setReferralError] = useState<string | null>(null);
  const [referralResult, setReferralResult] = useState<ReferralResult | null>(
    null
  );
  const [ibLoading, setIbLoading] = useState(false);
  const [ibError, setIbError] = useState<string | null>(null);
  const [ibSuccess, setIbSuccess] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const celebrationPieces = useMemo(
    () => Array.from({ length: 14 }, (_, index) => index),
    []
  );

  const pushToast = (message: string) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 2400);
  };

  const copy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      pushToast(`${label} copied`);
    } catch (error) {
      pushToast('Copy not available');
    }
  };

  const handleReferralSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (referralLoading) {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get('name') || ''),
      email: String(formData.get('email') || ''),
    };

    setReferralLoading(true);
    setReferralError(null);

    try {
      const response = await fetch('/api/partner/referral', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 429) {
        const data = await response.json().catch(() => null);
        setReferralError(
          data?.message || 'Too many attempts — try again shortly.'
        );
        return;
      }

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setReferralError(
          data?.message || 'Something went wrong. Please try again.'
        );
        return;
      }

      const data = (await response.json()) as ReferralResult;
      setReferralResult(data);
      setReferralError(null);
      form.reset();
      pushToast('Referral code minted');
    } catch (error) {
      setReferralError('Something went wrong. Please try again.');
    } finally {
      setReferralLoading(false);
    }
  };

  const handleIbSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (ibLoading) {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    setIbLoading(true);
    setIbError(null);

    try {
      const response = await fetch('/api/partner/apply', {
        method: 'POST',
        body: formData,
      });

      if (response.status === 429) {
        const data = await response.json().catch(() => null);
        setIbError(data?.message || 'Too many attempts — try again shortly.');
        setIbSuccess(false);
        return;
      }

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setIbError(
          data?.message || 'Unable to submit application. Please try again.'
        );
        setIbSuccess(false);
        return;
      }

      setIbSuccess(true);
      setIbError(null);
      form.reset();
      pushToast('Application submitted');
    } catch (error) {
      setIbError('Unable to submit application. Please try again.');
      setIbSuccess(false);
    } finally {
      setIbLoading(false);
    }
  };

  return (
    <div className='partner-page'>
      <section className='hero'>
        <div className='hero-inner'>
          <p className='eyebrow'>Cardic Nexus Partner Hub</p>
          <h1>
            Mint your referral link. Apply as an NP (NEXUS PARTNER). Earn 35%
            for life.
          </h1>
          <p className='subcopy'>
            Secure a 35% lifetime revenue share on every active subscription you
            introduce. Transparent dashboards, bank-grade tracking, and weekly
            settlements keep your partner business predictable.
          </p>
          <div className='hero-actions'>
            <a href='#referral' className='cta primary'>
              Mint referral code
            </a>
            <a href='#ib' className='cta secondary'>
              Submit NP application
            </a>
          </div>
        </div>
      </section>

      <section className='cards-grid'>
        <article id='referral' className='card referral-card'>
          <header>
            <h2>Mint your referral code</h2>
            <p>
              Generate a unique Cardic Nexus code and link in seconds. Share it
              across your channels and every new subscriber is tracked back to
              you.
            </p>
          </header>

          {referralResult ? (
            <div className='referral-success' role='status' aria-live='polite'>
              <div className='celebration' aria-hidden='true'>
                {celebrationPieces.map((piece) => (
                  <span
                    key={piece}
                    style={
                      {
                        '--offset': piece,
                      } as CSSProperties
                    }
                  />
                ))}
              </div>
              <div className='success-heading'>Here’s your referral code.</div>
              <p className='success-sub'>
                We’ve also sent it to our admin desk.
              </p>
              <div className='code-display'>{referralResult.code}</div>
              <div className='link-display'>{referralResult.link}</div>
              <div className='copy-actions'>
                <button
                  type='button'
                  onClick={() => copy(referralResult.code, 'Code')}
                >
                  Copy code
                </button>
                <button
                  type='button'
                  onClick={() => copy(referralResult.link, 'Link')}
                >
                  Copy link
                </button>
              </div>
              <button
                type='button'
                className='ghost'
                onClick={() => setReferralResult(null)}
              >
                Mint another code
              </button>
            </div>
          ) : (
            <form onSubmit={handleReferralSubmit}>
              <div className='field'>
                <label htmlFor='referral-name'>Full name</label>
                <input
                  id='referral-name'
                  name='name'
                  type='text'
                  placeholder='Ava Cardic'
                  required
                />
              </div>
              <div className='field'>
                <label htmlFor='referral-email'>Email</label>
                <input
                  id='referral-email'
                  name='email'
                  type='email'
                  placeholder='you@brand.com'
                  required
                />
              </div>
              {referralError ? (
                <p className='form-error' role='alert'>
                  {referralError}
                </p>
              ) : null}
              <button
                type='submit'
                className='submit'
                disabled={referralLoading}
              >
                {referralLoading ? 'Minting…' : 'Generate my referral code'}
              </button>
            </form>
          )}
        </article>

        <article id='ib' className='card ib-card'>
          <header>
            <h2>Nexus Partner (NP) Application</h2>
            <p>
              Tell us about your reach and how you’ll represent Cardic Nexus. We
              review every partner manually to protect brand integrity.
            </p>
          </header>

          <form onSubmit={handleIbSubmit} encType='multipart/form-data'>
            <div className='grid'>
              <div className='field'>
                <label htmlFor='ib-legalName'>Legal full name</label>
                <input
                  id='ib-legalName'
                  name='legalName'
                  type='text'
                  required
                  placeholder='Ava Cardic'
                />
              </div>
              <div className='field'>
                <label htmlFor='ib-email'>Email</label>
                <input
                  id='ib-email'
                  name='email'
                  type='email'
                  required
                  placeholder='you@brand.com'
                />
              </div>
              <div className='field'>
                <label htmlFor='ib-country'>Country</label>
                <input
                  id='ib-country'
                  name='country'
                  type='text'
                  required
                  placeholder='United Arab Emirates'
                />
              </div>
              <div className='field'>
                <label htmlFor='ib-messenger'>
                  Telegram / WhatsApp{' '}
                  <span className='optional'>(optional)</span>
                </label>
                <input
                  id='ib-messenger'
                  name='messenger'
                  type='text'
                  placeholder='@cardicnexus'
                />
              </div>
              <div className='field'>
                <label htmlFor='ib-audience'>Audience or niche</label>
                <input
                  id='ib-audience'
                  name='audience'
                  type='text'
                  required
                  placeholder='Crypto traders, LATAM'
                />
              </div>
              <div className='field'>
                <label htmlFor='ib-reach'>Estimated monthly reach</label>
                <select id='ib-reach' name='reach' required defaultValue=''>
                  <option value='' disabled>
                    Select reach
                  </option>
                  <option value='Under 5k'>Under 5k</option>
                  <option value='5k – 25k'>5k – 25k</option>
                  <option value='25k – 100k'>25k – 100k</option>
                  <option value='100k – 500k'>100k – 500k</option>
                  <option value='500k+'>500k+</option>
                </select>
              </div>
              <div className='field'>
                <label htmlFor='ib-payout'>Preferred payout method</label>
                <select id='ib-payout' name='payout' required defaultValue=''>
                  <option value='' disabled>
                    Select method
                  </option>
                  <option value='Bank'>Bank</option>
                  <option value='USDT'>USDT</option>
                  <option value='PayPal'>PayPal</option>
                </select>
              </div>
              <div className='field'>
                <label htmlFor='ib-links'>
                  Links <span className='optional'>(optional)</span>
                </label>
                <input
                  id='ib-links'
                  name='links'
                  type='text'
                  placeholder='https://t.me/yourchannel'
                />
              </div>
            </div>
            <div className='field'>
              <label htmlFor='ib-governmentId'>Government ID upload</label>
              <input
                id='ib-governmentId'
                name='governmentId'
                type='file'
                accept='image/*,application/pdf'
                required
              />
            </div>
            <div className='field'>
              <label htmlFor='ib-proof'>Proof of address upload</label>
              <input
                id='ib-proof'
                name='proofOfAddress'
                type='file'
                accept='image/*,application/pdf'
                required
              />
            </div>
            <div className='field'>
              <label htmlFor='ib-pitch'>
                How will you promote Cardic Nexus?
              </label>
              <textarea
                id='ib-pitch'
                name='pitch'
                rows={4}
                required
                placeholder='Share your plan and promo channels'
              />
            </div>
            <label className='agreement'>
              <input type='checkbox' name='agreement' required />
              <span>I agree to the Partner Terms and compliance rules.</span>
            </label>
            {ibError ? (
              <p className='form-error' role='alert'>
                {ibError}
              </p>
            ) : null}
            {ibSuccess ? (
              <p className='form-success' role='status'>
                Application received. Our partnerships team will contact you.
              </p>
            ) : null}
            <button type='submit' className='submit' disabled={ibLoading}>
              {ibLoading ? 'Submitting…' : 'Submit NP application'}
            </button>
          </form>
        </article>
      </section>

      <section className='highlights'>
        <div className='section-inner'>
          <h2>Program Highlights</h2>
          <ul>
            <li>35% lifetime revenue share on every active subscription.</li>
            <li>
              Clean tracking with code + link attribution inside cardicnex.us.
            </li>
            <li>Weekly payouts in your preferred method.</li>
            <li>Partner promo kit with launch creatives and messaging.</li>
            <li>Priority support from the partnerships desk.</li>
          </ul>
          <Link href='#' className='promo-link'>
            Open promo kit →
          </Link>
        </div>
      </section>

      <section className='how-it-works'>
        <div className='section-inner'>
          <h2>How it works</h2>
          <ol>
            <li>
              <span className='step-title'>Mint code</span>
              <span className='step-copy'>
                Secure your referral code instantly.
              </span>
            </li>
            <li>
              <span className='step-title'>Share link</span>
              <span className='step-copy'>
                Promote the link across your channels.
              </span>
            </li>
            <li>
              <span className='step-title'>They subscribe</span>
              <span className='step-copy'>
                Every plan ties back to your unique tag.
              </span>
            </li>
            <li>
              <span className='step-title'>35% credited weekly</span>
              <span className='step-copy'>
                Tracking is tied to codes and links on cardicnex.us.
              </span>
            </li>
          </ol>
        </div>
      </section>

      <section className='compliance'>
        <div className='section-inner'>
          <h2>Compliance matters</h2>
          <ul>
            <li>No spam or unsolicited outreach.</li>
            <li>No misleading claims or guaranteed returns.</li>
            <li>No self-referrals or coupon abuse.</li>
            <li>Use approved brand assets and current pricing.</li>
            <li>Violations can forfeit commissions.</li>
          </ul>
          <Link href='#' className='promo-link'>
            Referral Terms
          </Link>
        </div>
      </section>

      <section className='footer-cta'>
        <a href='#referral' className='cta primary'>
          Mint my referral code
        </a>
        <a href='#ib' className='cta secondary'>
          Submit NP application
        </a>
        <a
          href='https://t.me/REALCARDIC'
          target='_blank'
          rel='noreferrer'
          className='cta tertiary'
        >
          Talk to partnerships →
        </a>
      </section>

      <div className='toast-stack' aria-live='polite' aria-atomic='true'>
        {toasts.map((toast) => (
          <div key={toast.id} className='toast'>
            {toast.message}
          </div>
        ))}
      </div>

      <style jsx>{`
        .partner-page {
          padding: 64px 16px 96px;
          background: radial-gradient(
              circle at top right,
              rgba(65, 209, 255, 0.12),
              transparent 55%
            ),
            radial-gradient(
              circle at bottom left,
              rgba(245, 199, 107, 0.12),
              transparent 50%
            );
        }

        .hero {
          max-width: 1080px;
          margin: 0 auto 64px;
        }

        .hero-inner {
          background: linear-gradient(
            135deg,
            rgba(16, 19, 26, 0.95),
            rgba(5, 6, 10, 0.92)
          );
          border: 1px solid rgba(65, 209, 255, 0.2);
          border-radius: 28px;
          padding: 48px;
          position: relative;
          overflow: hidden;
        }

        .hero-inner::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(
              circle at 20% 20%,
              rgba(65, 209, 255, 0.24),
              transparent 55%
            ),
            radial-gradient(
              circle at 85% 40%,
              rgba(245, 199, 107, 0.18),
              transparent 55%
            );
          opacity: 0.8;
          pointer-events: none;
        }

        .hero-inner > * {
          position: relative;
          z-index: 2;
        }

        .eyebrow {
          letter-spacing: 0.24em;
          text-transform: uppercase;
          font-size: 12px;
          color: rgba(245, 199, 107, 0.82);
          margin-bottom: 16px;
        }

        .hero h1 {
          font-size: clamp(32px, 4vw, 54px);
          margin: 0 0 20px;
          line-height: 1.08;
        }

        .subcopy {
          max-width: 580px;
          color: #c4c9d6;
          font-size: 18px;
          line-height: 1.6;
          margin: 0 0 32px;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }

        .cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          padding: 14px 24px;
          font-weight: 600;
          text-decoration: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease,
            filter 0.2s ease;
          border: 1px solid transparent;
        }

        .cta.primary {
          background: linear-gradient(135deg, #10a5ff, #41d1ff);
          color: #02111f;
          box-shadow: 0 18px 40px rgba(16, 165, 255, 0.28);
        }

        .cta.secondary {
          border-color: rgba(245, 199, 107, 0.6);
          color: #f5c76b;
          background: rgba(16, 19, 26, 0.4);
        }

        .cta.tertiary {
          border-color: rgba(255, 255, 255, 0.22);
          color: #e7ecf5;
          background: rgba(17, 20, 28, 0.55);
        }

        .cta:hover {
          filter: brightness(1.05);
          transform: translateY(-2px);
        }

        .cards-grid {
          max-width: 1080px;
          margin: 0 auto 72px;
          display: grid;
          gap: 32px;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        }

        .card {
          background: linear-gradient(
            135deg,
            rgba(10, 12, 18, 0.95),
            rgba(4, 5, 9, 0.92)
          );
          border: 1px solid rgba(65, 209, 255, 0.18);
          border-radius: 28px;
          padding: 36px;
          position: relative;
          overflow: hidden;
        }

        .card header h2 {
          margin: 0 0 10px;
          font-size: 26px;
        }

        .card header p {
          margin: 0 0 28px;
          color: #c3c8d5;
          line-height: 1.6;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 18px;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        label {
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: rgba(231, 236, 245, 0.72);
        }

        .optional {
          text-transform: none;
          letter-spacing: normal;
          color: rgba(231, 236, 245, 0.6);
          font-size: 12px;
        }

        input,
        select,
        textarea {
          background: rgba(13, 16, 24, 0.8);
          border: 1px solid rgba(65, 209, 255, 0.18);
          border-radius: 14px;
          padding: 12px 14px;
          color: #fff;
          font-size: 15px;
          transition: border 0.2s ease, box-shadow 0.2s ease;
        }

        input:focus,
        select:focus,
        textarea:focus {
          outline: none;
          border-color: rgba(245, 199, 107, 0.65);
          box-shadow: 0 0 0 3px rgba(245, 199, 107, 0.16);
        }

        textarea {
          resize: vertical;
        }

        .agreement {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          font-size: 14px;
          line-height: 1.6;
          color: #cdd2de;
        }

        .agreement input {
          margin-top: 4px;
        }

        .submit {
          align-self: flex-start;
          background: linear-gradient(135deg, #10a5ff, #2db2ff);
          color: #02111f;
          border-radius: 16px;
          border: none;
          padding: 14px 24px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .submit:disabled {
          opacity: 0.6;
          cursor: wait;
        }

        .submit:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(16, 165, 255, 0.25);
        }

        .form-error {
          color: #ff7b7b;
          font-size: 13px;
        }

        .form-success {
          color: #8fffc6;
          font-size: 13px;
        }

        .referral-success {
          position: relative;
          padding: 24px;
          background: rgba(16, 19, 27, 0.88);
          border-radius: 22px;
          border: 1px solid rgba(245, 199, 107, 0.4);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          gap: 18px;
          align-items: flex-start;
        }

        .celebration {
          position: absolute;
          inset: -10%;
          pointer-events: none;
        }

        .celebration span {
          position: absolute;
          width: 6px;
          height: 16px;
          border-radius: 3px;
          background: linear-gradient(180deg, #41d1ff, #f5c76b);
          left: calc((var(--offset) + 1) * 7%);
          animation: confetti 1.8s linear infinite;
          animation-delay: calc(var(--offset) * -0.12s);
          opacity: 0;
        }

        .celebration span:nth-child(odd) {
          background: linear-gradient(180deg, #ff8a3c, #41d1ff);
        }

        @keyframes confetti {
          0% {
            transform: translateY(-10%) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translateY(140%) rotate(360deg);
            opacity: 0;
          }
        }

        .success-heading {
          font-size: 20px;
          font-weight: 600;
        }

        .success-sub {
          color: rgba(231, 236, 245, 0.75);
          margin: -12px 0 12px;
        }

        .code-display {
          font-size: 32px;
          font-weight: 700;
          letter-spacing: 0.18em;
        }

        .link-display {
          font-family: 'SFMono-Regular', 'Consolas', 'Liberation Mono', 'Menlo',
            monospace;
          background: rgba(9, 12, 18, 0.72);
          border: 1px solid rgba(65, 209, 255, 0.32);
          border-radius: 12px;
          padding: 12px 16px;
          word-break: break-all;
        }

        .copy-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .copy-actions button,
        .ghost {
          border-radius: 14px;
          padding: 10px 18px;
          border: 1px solid rgba(65, 209, 255, 0.4);
          background: rgba(8, 11, 17, 0.8);
          color: #e7ecf5;
          cursor: pointer;
          transition: filter 0.2s ease, transform 0.2s ease;
        }

        .ghost {
          border-color: rgba(245, 199, 107, 0.45);
          margin-top: 8px;
        }

        .copy-actions button:hover,
        .ghost:hover {
          filter: brightness(1.1);
          transform: translateY(-1px);
        }

        .highlights,
        .how-it-works,
        .compliance {
          margin: 0 auto 72px;
          max-width: 960px;
        }

        .section-inner {
          background: linear-gradient(
            135deg,
            rgba(9, 11, 18, 0.9),
            rgba(5, 7, 12, 0.9)
          );
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 28px;
          padding: 40px;
        }

        .section-inner h2 {
          margin: 0 0 20px;
          font-size: 28px;
        }

        .section-inner ul {
          margin: 0 0 28px 16px;
          display: grid;
          gap: 10px;
          color: #d3d7e3;
          line-height: 1.6;
        }

        .promo-link {
          color: #41d1ff;
          text-decoration: none;
          font-weight: 600;
        }

        .promo-link:hover {
          text-decoration: underline;
        }

        .how-it-works ol {
          margin: 0;
          list-style: none;
          display: grid;
          gap: 18px;
          counter-reset: step;
        }

        .how-it-works li {
          background: rgba(12, 15, 22, 0.8);
          border: 1px solid rgba(65, 209, 255, 0.12);
          border-radius: 18px;
          padding: 20px 24px 20px 62px;
          position: relative;
        }

        .how-it-works li::before {
          counter-increment: step;
          content: counter(step);
          position: absolute;
          top: 18px;
          left: 20px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: linear-gradient(135deg, #41d1ff, #f5c76b);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #02111f;
          font-weight: 700;
        }

        .step-title {
          font-weight: 600;
          font-size: 16px;
        }

        .step-copy {
          display: block;
          color: #c3c8d5;
          margin-top: 6px;
          line-height: 1.5;
        }

        .footer-cta {
          max-width: 960px;
          margin: 0 auto;
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          justify-content: center;
          padding: 32px 0 0;
        }

        .toast-stack {
          position: fixed;
          bottom: 32px;
          right: 32px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          z-index: 2000;
        }

        .toast {
          background: rgba(8, 11, 17, 0.88);
          border: 1px solid rgba(65, 209, 255, 0.35);
          border-radius: 12px;
          padding: 12px 18px;
          font-size: 14px;
          color: #e7ecf5;
          box-shadow: 0 10px 28px rgba(4, 9, 18, 0.45);
          animation: fade-in 0.2s ease;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 900px) {
          .hero-inner {
            padding: 36px;
          }

          .card {
            padding: 28px;
          }
        }

        @media (max-width: 640px) {
          .hero-inner {
            padding: 28px;
          }

          .hero-actions {
            flex-direction: column;
            align-items: stretch;
          }

          .cta {
            width: 100%;
          }

          .toast-stack {
            right: 16px;
            left: 16px;
            bottom: 16px;
          }

          .toast {
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}
