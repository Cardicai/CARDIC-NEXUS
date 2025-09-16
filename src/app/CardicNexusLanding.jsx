'use client';
import Image from 'next/image';

import BrandLogo from '@/components/BrandLogo';

export default function CardicNexusLanding() {
  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Copied');
    } catch {
      /* ignore */
    }
  };
  const scrollToPay = (e) => {
    e.preventDefault();
    const el = document.querySelector('#pay');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      const res = await fetch('/api/submit-payment', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        alert('Success!');
        e.target.reset();
      } else {
        alert('Error submitting form');
      }
    } catch (err) {
      alert('Error submitting form');
    }
  };

  const projects = [
    {
      title: 'CARDIC Oracle 1.0',
      type: 'Indicator',
      status: 'Soon',
      text: 'Real-time psychology, liquidity battles, predictive zones.',
      tags: ['Psychology', 'Liquidity', 'AI'],
    },
    {
      title: 'Cardic Heat Zones™',
      type: 'Indicator',
      status: 'Live',
      text: 'Smart money zones with alerts.',
      tags: ['SMC', 'Zones', 'Alerts'],
    },
    {
      title: 'Cardic Spider Web™',
      type: 'Indicator',
      status: 'In Dev',
      text: 'Dynamic SR + Fibonacci + Order Blocks.',
      tags: ['Fib', 'OB', 'Grid'],
    },
    {
      title: 'Premium Signals',
      type: 'Membership',
      status: 'Live',
      text: 'Daily gold/FX/crypto signals with risk notes.',
      tags: ['Gold', 'Forex', 'Crypto'],
    },
  ];

  const usdt = '0x713598879a14D07013d3154b225D2fa838bb0a54';
  const eth = '0x713598879a14D07013d3154b225D2fa838bb0a54';
  const btc = 'bc1qm034jk98v7yzdy5yedyvwave96ujqjgnqyytm3';

  return (
    <div className='cnx-root'>
      {/* Galaxy background layers */}
      <div className='cnx-stars' />
      <div className='cnx-glow cnx-glow-gold' />
      <div className='cnx-glow cnx-glow-blue' />

      {/* HERO */}
      <section className='cnx-hero'>
        <div
          style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}
        >
          <BrandLogo size='lg' />
        </div>
        <p className='cnx-tag'>
          AI • Trading • Innovation — for retail traders.
        </p>
        <div className='cnx-row'>
          <a className='cnx-btn cnx-btn-ghost' href='#projects'>
            Explore Projects
          </a>
          <a className='cnx-btn cnx-btn-blue' href='#pay' onClick={scrollToPay}>
            Join Premium
          </a>
        </div>
        <div className='cnx-note'>
          ✨ Wishing You a Great Weekend — stay golden and disciplined.
        </div>
      </section>

      {/* PROJECTS */}
      <section id='projects' className='cnx-section'>
        <h2>Projects</h2>
        <div className='cnx-grid'>
          {projects.map((p) => (
            <article key={p.title} className='cnx-card'>
              <div className='cnx-meta'>
                <span className='cnx-type'>{p.type}</span>
                <span className='cnx-badge'>{p.status}</span>
              </div>
              <h3 className='cnx-card-title'>{p.title}</h3>
              <p className='cnx-text'>{p.text}</p>
              <div className='cnx-tags'>
                {p.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <div className='cnx-card-actions'>
                <a
                  className='cnx-btn cnx-btn-ghost'
                  href='#pay'
                  onClick={scrollToPay}
                >
                  Buy
                </a>
                <a className='cnx-btn cnx-btn-blue' href='#contact'>
                  Details
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CARDIC HEAT — spotlight */}
      <section id='heat' className='cnx-section'>
        <h2>Cardic Heat 🔥</h2>
        <p className='cnx-text'>
          A next-generation indicator that tracks liquidity zones, market
          sentiment, and trade signals in real time.
        </p>

        <p className='cnx-text' style={{ marginTop: 6 }}>
          ✨ There are <b>3 evolving versions</b>, each one sharper and more
          precise than the last:
        </p>

        <div className='cnx-grid' style={{ marginTop: 10 }}>
          {/* 2.0 */}
          <article className='cnx-card'>
            <div className='cnx-meta'>
              <span className='cnx-type'>Indicator</span>
              <span className='cnx-badge'>Live</span>
            </div>
            <h3 className='cnx-card-title'>CARDIC Heat 2.0</h3>
            <div className='cnx-amount'>$25</div>
            <div className='cnx-note'>2 months</div>
            <div className='cnx-card-actions' style={{ marginTop: 12 }}>
              <a
                className='cnx-btn cnx-btn-blue'
                href='#pay'
                onClick={scrollToPay}
              >
                Get 2.0
              </a>
            </div>
          </article>

          {/* 2.1 */}
          <article className='cnx-card'>
            <div className='cnx-meta'>
              <span className='cnx-type'>Indicator</span>
              <span className='cnx-badge'>Live</span>
            </div>
            <h3 className='cnx-card-title'>CARDIC Heat 2.1</h3>
            <div className='cnx-amount'>$35</div>
            <div className='cnx-note'>2 months</div>
            <div className='cnx-card-actions' style={{ marginTop: 12 }}>
              <a
                className='cnx-btn cnx-btn-blue'
                href='#pay'
                onClick={scrollToPay}
              >
                Get 2.1
              </a>
            </div>
          </article>

          {/* 2.3 Early Access */}
          <article className='cnx-card'>
            <div className='cnx-meta'>
              <span className='cnx-type'>Indicator</span>
              <span className='cnx-badge'>Early</span>
            </div>
            <h3 className='cnx-card-title'>CARDIC Heat 2.3</h3>
            <div className='cnx-amount'>$50</div>
            <div className='cnx-note'>Early Access — 1 month</div>
            <div className='cnx-card-actions' style={{ marginTop: 12 }}>
              <a
                className='cnx-btn cnx-btn-blue'
                href='#pay'
                onClick={scrollToPay}
              >
                Get 2.3
              </a>
            </div>
          </article>
        </div>

        <p className='cnx-text' style={{ marginTop: 12 }}>
          📈 The higher the version, the more acute, dynamic, and powerful the
          signal detection becomes.
        </p>
      </section>

      {/* PRICING */}
      <section id='pricing' className='cnx-section'>
        <h2>Pricing</h2>
        <div className='cnx-grid'>
          <article className='cnx-price'>
            <h3>Premium Signals</h3>
            <div className='cnx-amount'>$49/mo</div>
            <ul>
              <li>Daily gold/FX/crypto signals</li>
              <li>Risk management notes</li>
              <li>Telegram access</li>
            </ul>
            <a
              className='cnx-btn cnx-btn-ghost'
              href='#pay'
              onClick={scrollToPay}
            >
              Subscribe
            </a>
          </article>
          <article className='cnx-price'>
            <h3>Indicators</h3>
            <div className='cnx-amount'>From $99</div>
            <ul>
              <li>Heat Zones™</li>
              <li>Spider Web™</li>
              <li>Oracle 1.0 (Soon)</li>
            </ul>
            <a className='cnx-btn cnx-btn-ghost' href='#projects'>
              Browse
            </a>
          </article>
          <article className='cnx-price'>
            <h3>All-Access</h3>
            <div className='cnx-amount'>$179/mo</div>
            <ul>
              <li>All indicators</li>
              <li>Premium signals</li>
              <li>Priority support</li>
            </ul>
            <a
              className='cnx-btn cnx-btn-blue'
              href='#pay'
              onClick={scrollToPay}
            >
              Join
            </a>
          </article>
        </div>
      </section>

      {/* PAYMENT DETAILS */}
      <section id='pay' className='cnx-section'>
        <div className='cnx-pay-panel'>
          <h2>Join Premium</h2>
          <p className='cnx-text'>
            Crypto payments (USDT / ETH / BTC). Pick any address, make payment,
            then submit your details + proof.
          </p>

          <div className='cnx-pay-grid'>
            <div className='cnx-pay-card'>
              <h3>USDT (ERC-20)</h3>
              <div className='cnx-address-row'>
                <span className='cnx-address'>{usdt}</span>
                <button
                  className='cnx-copy'
                  type='button'
                  onClick={() => copy(usdt)}
                >
                  Copy
                </button>
              </div>
              <div className='cnx-note'>Network: ERC-20 only.</div>
              <div className='cnx-qr'>
                <Image
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${usdt}`}
                  width={120}
                  height={120}
                  alt='usdt'
                  unoptimized
                />
              </div>
            </div>
            <div className='cnx-pay-card'>
              <h3>ETH (ERC-20)</h3>
              <div className='cnx-address-row'>
                <span className='cnx-address'>{eth}</span>
                <button
                  className='cnx-copy'
                  type='button'
                  onClick={() => copy(eth)}
                >
                  Copy
                </button>
              </div>
              <div className='cnx-note'>Network: ERC-20 only.</div>
              <div className='cnx-qr'>
                <Image
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${eth}`}
                  width={120}
                  height={120}
                  alt='eth'
                  unoptimized
                />
              </div>
            </div>
            <div className='cnx-pay-card'>
              <h3>BTC</h3>
              <div className='cnx-address-row'>
                <span className='cnx-address'>{btc}</span>
                <button
                  className='cnx-copy'
                  type='button'
                  onClick={() => copy(btc)}
                >
                  Copy
                </button>
              </div>
              <div className='cnx-note'>Network: BTC (SegWit).</div>
              <div className='cnx-qr'>
                <Image
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${btc}`}
                  width={120}
                  height={120}
                  alt='btc'
                  unoptimized
                />
              </div>
            </div>
          </div>

          <form className='cnx-form' onSubmit={handleSubmit}>
            <h3 className='cnx-pay-form-title'>Submit Payment Proof</h3>
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
      </section>

      {/* CONTACT & SOCIALS */}
      <section id='contact' className='cnx-section'>
        <h2>Contact & Socials</h2>
        <div className='cnx-row' style={{ flexWrap: 'wrap' }}>
          <a
            className='cnx-btn cnx-btn-blue'
            href='https://www.tiktok.com/@cardicnexus?_t=ZT-8zDvH2iUl01&_r=1'
            target='_blank'
            rel='noreferrer'
          >
            TikTok (Global)
          </a>
          <a
            className='cnx-btn cnx-btn-ghost'
            href='https://www.instagram.com/cardicnexus?igsh=MXh3NGhxZXdpdDR0OQ=='
            target='_blank'
            rel='noreferrer'
          >
            Instagram
          </a>
          <a
            className='cnx-btn cnx-btn-ghost'
            href='https://x.com/CARDICNEXUS?t=xpUNONAmekVrQBRXiQp36A&s=09'
            target='_blank'
            rel='noreferrer'
          >
            X (Twitter)
          </a>
          <a
            className='cnx-btn cnx-btn-ghost'
            href='https://t.me/REALCARDIC'
            target='_blank'
            rel='noreferrer'
          >
            Telegram (DM)
          </a>
          <a
            className='cnx-btn cnx-btn-ghost'
            href='https://t.me/cardicnewsupdates'
            target='_blank'
            rel='noreferrer'
          >
            Telegram (News/Community)
          </a>
        </div>
        <p className='cnx-tagline'>
          We don’t chase — we build. From vision to results. ♾️
        </p>
      </section>

      {/* FOOTER */}
      <footer className='cnx-footer'>
        <div className='cnx-line' />© {new Date().getFullYear()} Cardic Nexus.
        All rights reserved.
      </footer>

      {/* Scoped CSS (no Tailwind) */}
      <style>{`
        :root{
          --ink:#0a0b0d; --ink2:#0e0f12;
          --blue:#10A5FF; --gold:#F5C76B;
          --text:#fff; --muted:#cfd3dc;
        }
        *{box-sizing:border-box} html,body,#root{height:100%}
        body{margin:0}

        .cnx-root{
          min-height:100vh; color:var(--text);
          background:
            radial-gradient(60% 50% at 50% -10%, #191417 0%, transparent 60%),
            linear-gradient(180deg, var(--ink), var(--ink2));
          position:relative; overflow-x:hidden;
          font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica, Arial;
        }

        .cnx-stars{
          position:fixed; inset:0; z-index:-1; pointer-events:none;
          background-image:
            radial-gradient(2px 2px at 20% 30%, rgba(255,255,255,.9) 99%, transparent 100%),
            radial-gradient(1.5px 1.5px at 80% 70%, rgba(255,255,255,.7) 99%, transparent 100%),
            radial-gradient(1.2px 1.2px at 40% 60%, rgba(255,255,255,.6) 99%, transparent 100%),
            radial-gradient(1.2px 1.2px at 60% 20%, rgba(255,255,255,.6) 99%, transparent 100%);
          animation: twinkle 9s linear infinite;
          opacity:.75;
        }
        .cnx-glow{position:fixed; z-index:-1; filter:blur(60px); opacity:.22}
        .cnx-glow-gold{top:-120px; left:-120px; width:300px; height:300px; background: radial-gradient(circle, var(--gold), transparent 60%)}
        .cnx-glow-blue{bottom:-120px; right:-120px; width:300px; height:300px; background: radial-gradient(circle, var(--blue), transparent 60%)}
        @keyframes twinkle { 0%,100%{opacity:.65} 50%{opacity:1} }

        .cnx-btn{display:inline-block; padding:10px 14px; border-radius:14px; text-decoration:none; transition:.2s; border:1px solid rgba(245,199,107,.45); color:#fff}
        .cnx-btn-ghost:hover{background:rgba(255,255,255,.08)}
        .cnx-btn-blue{background:var(--blue); color:#000; font-weight:800; border-color:transparent; box-shadow:0 0 24px rgba(16,165,255,.35)}
        .cnx-btn-blue:hover{filter:brightness(1.08)}

        .cnx-hero{max-width:1100px; margin:0 auto; padding:64px 16px 32px; text-align:center}
        .cnx-tag{color:#b6beca; margin:12px 0 18px}
        .cnx-row{display:flex; gap:12px; justify-content:center; flex-wrap:wrap}
        .cnx-note{color:#aeb7c6; font-size:14px; margin-top:12px}

        .cnx-section{max-width:1100px; margin:0 auto; padding:34px 16px}
        .cnx-section h2{margin:0 0 14px; font-size:24px}
        .cnx-grid{display:grid; grid-template-columns:repeat(auto-fit, minmax(250px, 1fr)); gap:14px}
        .cnx-card, .cnx-price{
          background:rgba(255,255,255,.05);
          border:1px solid rgba(255,255,255,.12);
          border-radius:18px; padding:16px;
          box-shadow:0 0 0 1px rgba(245,199,107,.35), 0 0 24px rgba(245,199,107,.15);
          transition:.2s;
        }
        .cnx-card:hover, .cnx-price:hover{ border-color: rgba(245,199,107,.55); }
        .cnx-meta{display:flex; justify-content:space-between; align-items:center; color:#cfd3dc; font-size:12px}
        .cnx-badge{border:1px solid rgba(255,255,255,.15); padding:3px 8px; border-radius:999px}
        .cnx-card-title{margin:6px 0 8px}
        .cnx-text{color:#cfd3dc}
        .cnx-tags{display:flex; flex-wrap:wrap; gap:8px; margin-top:10px}
        .cnx-tags span{font-size:12px; color:#d5dbe6; border:1px solid rgba(255,255,255,.12); padding:4px 8px; border-radius:999px}
        .cnx-card-actions{display:flex; gap:10px; margin-top:12px}

        .cnx-price h3{margin:6px 0}
        .cnx-amount{font-size:22px; color:var(--blue); font-weight:800}
        .cnx-price ul{margin:10px 0 14px; padding-left:18px; color:#cfd3dc}

        .cnx-footer{max-width:1100px; margin:24px auto 40px; text-align:center; color:#a9b4c2; font-size:12px}
        .cnx-line{height:1px; background:linear-gradient(90deg, transparent, rgba(255,255,255,.15), transparent); margin:18px 0}

        .cnx-tagline{color:var(--muted); margin-top:12px; text-align:center}

        .cnx-pay-panel{
          background:rgba(255,255,255,.04);
          border:1px solid rgba(255,255,255,.12);
          border-radius:22px;
          padding:24px;
          box-shadow:0 0 0 1px rgba(245,199,107,.25), 0 0 28px rgba(16,165,255,.12);
        }
        .cnx-pay-panel h2{margin:0 0 10px}
        .cnx-pay-panel .cnx-text{margin:0 0 20px}
        .cnx-pay-grid{
          display:grid;
          gap:16px;
          grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));
          margin-bottom:24px;
        }
        .cnx-pay-card{
          background:rgba(255,255,255,.05);
          border:1px solid rgba(255,255,255,.14);
          border-radius:16px;
          padding:16px;
          display:flex;
          flex-direction:column;
          gap:10px;
        }
        .cnx-pay-card h3{margin:0}
        .cnx-address-row{
          display:flex;
          justify-content:space-between;
          align-items:center;
          font-size:13px;
          gap:8px;
        }
        .cnx-address{word-break:break-all; font-family:monospace; color:#f3f5ff}
        .cnx-copy{
          background:rgba(16,165,255,.15);
          color:#fff;
          border:1px solid rgba(16,165,255,.4);
          padding:4px 10px;
          border-radius:8px;
          cursor:pointer;
          transition:.2s;
        }
        .cnx-copy:hover{background:rgba(16,165,255,.28)}
        .cnx-qr{margin-top:4px; display:flex; justify-content:center}
        .cnx-pay-form-title{margin:0; font-size:18px; font-weight:700}
        .cnx-form{display:grid; gap:12px}
        .cnx-form input, .cnx-form textarea{
          width:100%;
          border:1px solid rgba(255,255,255,.18);
          background:rgba(255,255,255,.05);
          color:#fff;
          padding:10px;
          border-radius:12px;
          font-family:inherit;
        }
        .cnx-form input::placeholder, .cnx-form textarea::placeholder{color:rgba(255,255,255,.55)}
        .cnx-form textarea{resize:vertical; min-height:120px}
        .cnx-form button{
          background:var(--blue);
          color:#000;
          border:none;
          padding:12px;
          border-radius:12px;
          font-weight:700;
          cursor:pointer;
          transition:.2s;
        }
        .cnx-form button:hover{filter:brightness(1.08)}

      `}</style>
    </div>
  );
}
