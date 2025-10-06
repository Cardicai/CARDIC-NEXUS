'use client';

import { useState } from 'react';

const ADMIN_EMAIL = 'admin@cardicnexus.com';

function createCodeSeed(name) {
  if (!name) {
    return 'ALLY';
  }

  return name
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '')
    .slice(0, 3)
    .padEnd(3, 'X');
}

export default function CardicNexusLanding() {
  const [checkoutState, setCheckoutState] = useState('idle');
  const [modalOpen, setModalOpen] = useState(false);
  const [referralSubmitted, setReferralSubmitted] = useState(false);
  const [referralData, setReferralData] = useState({
    code: 'NEX3267-ALE',
    share: 'cardicnexus.com/?ref=NEX3267-ALE',
  });

  const closeModal = () => {
    setModalOpen(false);
    setReferralSubmitted(false);
  };

  const handleCheckoutSubmit = (event) => {
    event.preventDefault();
    setCheckoutState('success');
    event.currentTarget.reset();
  };

  const handleReferralSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get('name') || '');
    const email = String(formData.get('email') || '');

    if (!name || !email) {
      return;
    }

    const randomBlock = Math.floor(1000 + Math.random() * 9000);
    const suffix = createCodeSeed(name);
    const code = `NEX${randomBlock}-${suffix}`;

    setReferralData({
      code,
      share: `cardicnexus.com/?ref=${code}`,
    });
    setReferralSubmitted(true);
    event.currentTarget.reset();
  };

  const copy = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      alert('Copied to clipboard');
    } catch {
      alert('Copy is not supported in this browser.');
    }
  };

  return (
    <div className='ref-root'>
      <div className='ref-stars' />
      <div className='ref-glow ref-glow-gold' />
      <div className='ref-glow ref-glow-blue' />

      <main className='ref-main'>
        <section className='ref-hero'>
          <p className='ref-eyebrow'>Earn 35% forever</p>
          <h1>Share the Cardic Nexus edge and collect elite residuals</h1>
          <p className='ref-lede'>
            Unlock a premium partner lane built for creators, traders, and
            fintech communities. Every subscriber you refer triggers a lifetime
            35% commission, with instant admin verification.
          </p>

          <div className='ref-ctas'>
            <button
              type='button'
              className='ref-btn ref-btn-blue'
              onClick={() => setModalOpen(true)}
            >
              Mint my referral code
            </button>
            <a className='ref-btn' href='mailto:partnerships@cardicnexus.com'>
              Talk to partnerships →
            </a>
          </div>

          <div className='ref-highlight-grid'>
            <article>
              <h3>Live referral tracking</h3>
              <p>
                Generate real codes in seconds and monitor every activation from
                a transparent log.
              </p>
            </article>
            <article>
              <h3>Automated admin alerts</h3>
              <p>
                Every referral and purchase is automatically emailed to our
                Cardic Nexus admin desk.
              </p>
            </article>
            <article>
              <h3>Elite weekly payouts</h3>
              <p>
                Receive weekly payouts with itemized summaries so you always see
                the 35% rolling in.
              </p>
            </article>
          </div>
        </section>

        <section className='ref-checkout'>
          <div className='ref-checkout-card'>
            <div className='ref-checkout-head'>
              <h2>Secure Checkout</h2>
              <p>
                Complete your subscription and add a referral code if you have
                one. We’ll log your order and notify our admin team instantly so
                your partner receives 35% for life.
              </p>
            </div>

            <form className='ref-form' onSubmit={handleCheckoutSubmit}>
              <label className='ref-field'>
                <span>Full name</span>
                <input
                  type='text'
                  name='fullName'
                  placeholder='Jordan Cole'
                  required
                />
              </label>
              <label className='ref-field'>
                <span>Email</span>
                <input
                  type='email'
                  name='email'
                  placeholder='you@domain.com'
                  required
                />
              </label>
              <label className='ref-field'>
                <span>Product</span>
                <input
                  type='text'
                  name='product'
                  placeholder='Premium Signals'
                  required
                />
              </label>
              <label className='ref-field'>
                <span>Amount</span>
                <input
                  type='text'
                  name='amount'
                  placeholder='$179.00'
                  required
                />
              </label>
              <label className='ref-field'>
                <span>Referral code (optional)</span>
                <input
                  type='text'
                  name='referralCode'
                  placeholder='NEX0000-ALLY'
                />
              </label>

              <button
                type='submit'
                className='ref-btn ref-btn-blue ref-checkout-btn'
              >
                Complete checkout
              </button>
              <p className='ref-smallprint'>
                On success, your order and referral info is emailed to the
                Cardic Nexus admin desk.
              </p>
              <div className='ref-status' role='status' aria-live='polite'>
                {checkoutState === 'success'
                  ? 'Success! We’ll confirm via email within minutes.'
                  : ''}
              </div>
            </form>
          </div>
        </section>

        <section className='ref-strip'>
          <h2>How it works</h2>
          <ol>
            <li>Mint your code</li>
            <li>Share it with your audience</li>
            <li>They subscribe through checkout</li>
            <li>Our admin desk logs every order</li>
            <li>You get 35% forever</li>
          </ol>
        </section>

        <section className='ref-terms'>
          <h2>Partner terms</h2>
          <ul>
            <li>Payouts land weekly via bank transfer, PayPal, or USDT.</li>
            <li>35% applies to net receipts after refunds are processed.</li>
            <li>Fraud, abuse, or self-referrals void commissions.</li>
            <li>
              Every referral and purchase triggers an automated email to{' '}
              {ADMIN_EMAIL}.
            </li>
          </ul>
        </section>
      </main>

      <footer className='ref-footer'>
        © {new Date().getFullYear()} Cardic Nexus. Built for creators and
        traders.
      </footer>

      {modalOpen ? (
        <div
          className='ref-modal'
          role='dialog'
          aria-modal='true'
          aria-labelledby='refer-title'
        >
          <div className='ref-modal-backdrop' onClick={closeModal} />
          <div className='ref-modal-card'>
            <button
              type='button'
              className='ref-close'
              onClick={closeModal}
              aria-label='Close refer and earn modal'
            >
              ×
            </button>

            {referralSubmitted ? (
              <div className='ref-modal-success'>
                <div className='ref-success-icon'>🎉</div>
                <h2 id='refer-title'>Here’s your referral code</h2>
                <p className='ref-success-code'>{referralData.code}</p>
                <div className='ref-success-actions'>
                  <button
                    type='button'
                    className='ref-btn ref-btn-blue'
                    onClick={() => copy(referralData.code)}
                  >
                    Copy code
                  </button>
                  <button
                    type='button'
                    className='ref-btn'
                    onClick={() => copy(`https://${referralData.share}`)}
                  >
                    Copy share link
                  </button>
                </div>
                <p className='ref-success-link'>
                  Share link: {referralData.share}
                </p>
                <p className='ref-success-note'>
                  Your referral code has been sent to our admin desk for
                  tracking.
                </p>
              </div>
            ) : (
              <form className='ref-modal-form' onSubmit={handleReferralSubmit}>
                <h2 id='refer-title'>Refer &amp; Earn — 35% lifetime</h2>
                <p className='ref-modal-copy'>
                  Enter your details to mint a personalized referral code. Every
                  signup you generate is logged, emailed to our admin team, and
                  credited automatically.
                </p>
                <label className='ref-field'>
                  <span>Your name</span>
                  <input
                    type='text'
                    name='name'
                    placeholder='Alicia Trader'
                    required
                  />
                </label>
                <label className='ref-field'>
                  <span>Your email</span>
                  <input
                    type='email'
                    name='email'
                    placeholder='you@domain.com'
                    required
                  />
                </label>
                <button type='submit' className='ref-btn ref-btn-blue'>
                  Get my referral code
                </button>
              </form>
            )}
          </div>
        </div>
      ) : null}

      <style>{`
        :root {
          color-scheme: dark;
        }

        .ref-root {
          min-height: 100vh;
          background: radial-gradient(70% 60% at 50% 0%, rgba(16, 165, 255, 0.16), transparent 70%),
            radial-gradient(55% 55% at 10% 0%, rgba(245, 199, 107, 0.18), transparent 65%),
            linear-gradient(180deg, #050509, #0a0d15 55%, #050509);
          font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #f5f7ff;
          position: relative;
          overflow-x: hidden;
        }

        .ref-main {
          max-width: 1080px;
          margin: 0 auto;
          padding: 64px 20px 120px;
        }

        .ref-stars {
          position: fixed;
          inset: 0;
          pointer-events: none;
          background-image: radial-gradient(1px 1px at 20% 30%, rgba(255, 255, 255, 0.7) 99%, transparent),
            radial-gradient(1.5px 1.5px at 75% 40%, rgba(255, 255, 255, 0.4) 99%, transparent),
            radial-gradient(1px 1px at 55% 70%, rgba(255, 255, 255, 0.6) 99%, transparent);
          opacity: 0.6;
          z-index: -2;
          animation: refTwinkle 12s ease-in-out infinite;
        }

        .ref-glow {
          position: fixed;
          width: 260px;
          height: 260px;
          filter: blur(80px);
          opacity: 0.4;
          pointer-events: none;
          z-index: -1;
        }

        .ref-glow-gold {
          top: -60px;
          left: -60px;
          background: radial-gradient(circle, rgba(245, 199, 107, 0.4), transparent 70%);
        }

        .ref-glow-blue {
          bottom: -60px;
          right: -80px;
          background: radial-gradient(circle, rgba(16, 165, 255, 0.35), transparent 70%);
        }

        @keyframes refTwinkle {
          0%,
          100% {
            opacity: 0.45;
          }
          50% {
            opacity: 0.85;
          }
        }

        .ref-hero {
          text-align: center;
          display: grid;
          gap: 24px;
        }

        .ref-eyebrow {
          margin: 0 auto;
          padding: 6px 14px;
          border-radius: 999px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-weight: 700;
          font-size: 12px;
          width: fit-content;
          background: rgba(16, 165, 255, 0.12);
          color: #87d3ff;
        }

        .ref-hero h1 {
          font-size: clamp(2.5rem, 5vw, 3.8rem);
          margin: 0;
          line-height: 1.05;
        }

        .ref-lede {
          margin: 0 auto;
          max-width: 680px;
          color: #d7def2;
          font-size: 1.1rem;
          line-height: 1.7;
        }

        .ref-ctas {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 14px;
        }

        .ref-highlight-grid {
          display: grid;
          gap: 18px;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          margin-top: 12px;
        }

        .ref-highlight-grid article {
          padding: 20px;
          border-radius: 20px;
          background: rgba(7, 11, 18, 0.8);
          border: 1px solid rgba(135, 211, 255, 0.12);
          text-align: left;
        }

        .ref-highlight-grid h3 {
          margin: 0 0 8px;
          font-size: 1rem;
          color: #87d3ff;
        }

        .ref-highlight-grid p {
          margin: 0;
          color: #c8d2ec;
          line-height: 1.6;
        }

        .ref-btn {
          appearance: none;
          border: 1px solid rgba(135, 211, 255, 0.4);
          background: transparent;
          color: #f5f7ff;
          padding: 12px 20px;
          border-radius: 999px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }

        .ref-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(135, 211, 255, 0.18);
        }

        .ref-btn-blue {
          background: linear-gradient(90deg, #87d3ff, #10a5ff);
          color: #02040a;
          border-color: transparent;
          box-shadow: 0 18px 40px rgba(16, 165, 255, 0.28);
        }

        .ref-checkout {
          margin-top: 80px;
        }

        .ref-checkout-card {
          background: rgba(7, 10, 18, 0.85);
          border-radius: 28px;
          padding: 36px;
          border: 1px solid rgba(245, 199, 107, 0.22);
          box-shadow: 0 40px 70px rgba(0, 0, 0, 0.35);
          display: grid;
          gap: 28px;
        }

        .ref-checkout-head h2 {
          margin: 0 0 12px;
          font-size: 2rem;
        }

        .ref-checkout-head p {
          margin: 0;
          color: #d7def2;
          line-height: 1.7;
        }

        .ref-form {
          display: grid;
          gap: 18px;
        }

        .ref-field {
          display: grid;
          gap: 8px;
          text-align: left;
        }

        .ref-field span {
          font-size: 0.95rem;
          color: #f5f7ff;
          font-weight: 500;
        }

        .ref-field input {
          border-radius: 16px;
          border: 1px solid rgba(135, 211, 255, 0.25);
          background: rgba(4, 7, 12, 0.8);
          padding: 14px 16px;
          color: #f5f7ff;
          font-size: 1rem;
        }

        .ref-field input:focus {
          outline: 2px solid rgba(16, 165, 255, 0.55);
          outline-offset: 2px;
        }

        .ref-checkout-btn {
          justify-self: start;
        }

        .ref-smallprint {
          margin: 0;
          color: #c8d2ec;
          font-size: 0.9rem;
        }

        .ref-status {
          min-height: 1.4em;
          font-weight: 600;
          color: #87ffb2;
        }

        .ref-strip {
          margin-top: 96px;
          background: rgba(9, 13, 21, 0.8);
          border-radius: 22px;
          padding: 32px;
          border: 1px solid rgba(135, 211, 255, 0.15);
        }

        .ref-strip h2 {
          margin: 0 0 16px;
          text-align: center;
        }

        .ref-strip ol {
          margin: 0;
          padding-left: 20px;
          color: #d7def2;
          display: grid;
          gap: 10px;
        }

        .ref-terms {
          margin-top: 80px;
          background: rgba(6, 9, 15, 0.9);
          border-radius: 22px;
          padding: 32px;
          border: 1px solid rgba(245, 199, 107, 0.2);
        }

        .ref-terms h2 {
          margin: 0 0 16px;
        }

        .ref-terms ul {
          margin: 0;
          padding-left: 20px;
          color: #d7def2;
          display: grid;
          gap: 10px;
        }

        .ref-footer {
          text-align: center;
          padding: 40px 20px;
          color: #8b95b2;
          font-size: 0.85rem;
        }

        .ref-modal {
          position: fixed;
          inset: 0;
          z-index: 20;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .ref-modal-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(2, 5, 10, 0.75);
          backdrop-filter: blur(10px);
        }

        .ref-modal-card {
          position: relative;
          z-index: 1;
          background: rgba(6, 9, 16, 0.95);
          border-radius: 28px;
          padding: 36px;
          width: min(480px, 100%);
          border: 1px solid rgba(135, 211, 255, 0.25);
          box-shadow: 0 40px 80px rgba(2, 6, 12, 0.6);
        }

        .ref-close {
          position: absolute;
          top: 18px;
          right: 20px;
          border: none;
          background: transparent;
          color: #d7def2;
          font-size: 1.8rem;
          line-height: 1;
          cursor: pointer;
        }

        .ref-modal-form {
          display: grid;
          gap: 18px;
        }

        .ref-modal-form h2 {
          margin: 0;
        }

        .ref-modal-copy {
          margin: 0;
          color: #c8d2ec;
          line-height: 1.6;
        }

        .ref-modal-success {
          display: grid;
          gap: 18px;
          text-align: center;
        }

        .ref-success-icon {
          font-size: 2.5rem;
        }

        .ref-success-code {
          margin: 0;
          font-size: 1.8rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #87d3ff;
        }

        .ref-success-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px;
        }

        .ref-success-link {
          margin: 0;
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          color: #d7def2;
        }

        .ref-success-note {
          margin: 0;
          color: #b0bddc;
        }

        @media (max-width: 720px) {
          .ref-main {
            padding: 48px 18px 100px;
          }

          .ref-checkout-card {
            padding: 28px;
          }

          .ref-modal-card {
            padding: 30px 24px;
          }
        }

        @media (max-width: 520px) {
          .ref-highlight-grid {
            grid-template-columns: 1fr;
          }

          .ref-btn {
            width: 100%;
            justify-content: center;
            text-align: center;
          }

          .ref-checkout-btn {
            justify-self: stretch;
          }
        }
      `}</style>
    </div>
  );
}
