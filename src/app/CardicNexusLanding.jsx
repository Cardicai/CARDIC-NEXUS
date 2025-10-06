'use client';

import { useState } from 'react';

import NexusHero from '@/components/NexusHero';
import PaymentSheet from '@/components/PaymentSheet';
import RedeemSheet from '@/components/RedeemSheet';

export default function CardicNexusLanding() {
  const [payOpen, setPayOpen] = useState(false);
  const [plan, setPlan] = useState(null);
  const [redeemOpen, setRedeemOpen] = useState(false);
  const openPay = (p) => {
    setPlan(p);
    setPayOpen(true);
  };

  const projects = [
    {
      title: 'CARDIC Oracle 1.0',
      type: 'Indicator',
      status: 'Soon',
      text: 'Real-time psychology, liquidity battles, predictive zones.',
      tags: ['Psychology', 'Liquidity', 'AI'],
      plan: {
        id: 'oracle-1-0',
        title: 'CARDIC Oracle 1.0',
        price: 'Coming Soon',
      },
    },
    {
      title: 'Cardic Heat Zones™',
      type: 'Indicator',
      status: 'Live',
      text: 'Smart money zones with alerts.',
      tags: ['SMC', 'Zones', 'Alerts'],
      plan: {
        id: 'heat-zones',
        title: 'CARDIC Heat Zones™',
        price: 'From $99',
      },
    },
    {
      title: 'Cardic Spider Web™',
      type: 'Indicator',
      status: 'In Dev',
      text: 'Dynamic SR + Fibonacci + Order Blocks.',
      tags: ['Fib', 'OB', 'Grid'],
      plan: {
        id: 'spider-web',
        title: 'Cardic Spider Web™',
        price: 'From $129',
      },
    },
    {
      title: 'Premium Signals',
      type: 'Membership',
      status: 'Live',
      text: 'Daily gold/FX/crypto signals with risk notes.',
      tags: ['Gold', 'Forex', 'Crypto'],
      plan: {
        id: 'premium-signals',
        title: 'Premium Signals',
        price: '$49/mo',
      },
    },
  ];

  return (
    <div className='cnx-root'>
      {/* Galaxy background layers */}
      <div className='cnx-stars' />
      <div className='cnx-glow cnx-glow-gold' />
      <div className='cnx-glow cnx-glow-blue' />

      <NexusHero
        exploreHref='#projects'
        onRedeemClick={() => setRedeemOpen(true)}
        onJoinClick={() =>
          openPay({
            id: 'all-access',
            title: 'All-Access',
            price: '$179/mo',
          })
        }
      />

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
                <button
                  type='button'
                  className='cnx-btn cnx-btn-ghost'
                  onClick={() => openPay(p.plan)}
                >
                  Buy
                </button>
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
              <button
                type='button'
                className='cnx-btn cnx-btn-blue'
                onClick={() =>
                  openPay({
                    id: 'heat-20',
                    title: 'CARDIC Heat 2.0',
                    price: '$25 / 2 months',
                  })
                }
              >
                Get 2.0
              </button>
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
              <button
                type='button'
                className='cnx-btn cnx-btn-blue'
                onClick={() =>
                  openPay({
                    id: 'heat-21',
                    title: 'CARDIC Heat 2.1',
                    price: '$35 / 2 months',
                  })
                }
              >
                Get 2.1
              </button>
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
              <button
                type='button'
                className='cnx-btn cnx-btn-blue'
                onClick={() =>
                  openPay({
                    id: 'heat-23',
                    title: 'CARDIC Heat 2.3',
                    price: '$50 / month',
                  })
                }
              >
                Get 2.3
              </button>
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
            <button
              type='button'
              className='cnx-btn cnx-btn-ghost'
              onClick={() =>
                openPay({
                  id: 'premium-signals',
                  title: 'Premium Signals',
                  price: '$49/mo',
                })
              }
            >
              Subscribe
            </button>
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
            <button
              type='button'
              className='cnx-btn cnx-btn-blue'
              onClick={() =>
                openPay({
                  id: 'all-access',
                  title: 'All-Access',
                  price: '$179/mo',
                })
              }
            >
              Join
            </button>
          </article>
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

      <RedeemSheet open={redeemOpen} onClose={() => setRedeemOpen(false)} />

      <PaymentSheet
        open={payOpen}
        onClose={() => setPayOpen(false)}
        plan={plan}
      />

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

        .cnx-row{display:flex; gap:12px; justify-content:center; flex-wrap:wrap}
        .cnx-note{color:#cfe0ff; font-size:14px; margin-top:12px; font-weight:700; letter-spacing:.02em}

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


      `}</style>
    </div>
  );
}
