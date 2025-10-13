'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import FreeTrialModal from '@/components/FreeTrialModal';
import PaymentSheet from '@/components/PaymentSheet';
import RedeemSheet from '@/components/RedeemSheet';
import TrialRequestSheet from '@/components/TrialRequestSheet';

export default function CardicNexusLanding() {
  const [payOpen, setPayOpen] = useState(false);
  const [plan, setPlan] = useState(null);
  const [redeemOpen, setRedeemOpen] = useState(false);
  const [trialOpen, setTrialOpen] = useState(false);
  const [comingSoon, setComingSoon] = useState(null);
  const [trialOpen, setTrialOpen] = useState(false);
  const soonTimer = useRef(null);
  const quickLinks = [
    {
      title: 'Algo Bots',
      description: 'Automations engineered for relentless precision.',
      href: '/partner',
      accent: 'bots',
      soon: true,
    },
    {
      title: 'Indicators',
      description: 'Signature overlays that frame the market narrative.',
      href: '#projects',
      accent: 'indicators',
    },
    {
      title: 'Cardic Heat',
      description: 'Live liquidity intelligence. Always-on market radar.',
      href: '#heat',
      accent: 'heat',
    },
    {
      title: 'EAs',
      description: 'Expert advisors tuned for disciplined execution.',
      href: '/partner',
      accent: 'eas',
      soon: true,
    },
  ];
  const openPay = (p) => {
    setPlan(p);
    setPayOpen(true);
  };

  const openAssistance = (version) => {
    const baseUrl = 'https://t.me/DeuceForex';
    const message = `hey I need help understanding the cardic heat ${version}`;
    const target = `${baseUrl}?text=${encodeURIComponent(message)}`;
    const win = window.open(target, '_blank', 'noopener,noreferrer');
    if (win) {
      win.focus();
    }
  };

  const triggerComingSoon = (label) => {
    setComingSoon(label);
    if (soonTimer.current) clearTimeout(soonTimer.current);
    soonTimer.current = setTimeout(() => setComingSoon(null), 2200);
  };

  useEffect(() => {
    return () => {
      if (soonTimer.current) clearTimeout(soonTimer.current);
    };
  }, []);

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
      <div className='cnx-glow cnx-glow-purple' />

      {/* HERO */}
      <section className='cnx-hero'>
        <h1 className='heroTitle'>
          <span className='heroGold'>CARDIC</span>{' '}
          <span className='heroBlue'>NEXUS</span>
        </h1>
        <p className='cnx-tag'>
          AI • Trading • Innovation — for retail traders.
        </p>
        <div className='cnx-row'>
          <button
            type='button'
            className='cnx-btn cnx-btn-trial'
            onClick={() => setTrialOpen(true)}
          >
            CLAIM FREE TRIAL
          </button>
          <a className='cnx-btn cnx-btn-ghost' href='#projects'>
            Explore Projects
          </a>
          <button
            type='button'
            className='cnx-btn cnx-btn-ghost'
            onClick={() => setRedeemOpen(true)}
          >
            Redeem
          </button>
          <button
            type='button'
            className='group relative inline-flex items-center justify-center rounded-full border border-cyan-400/60 bg-cyan-500/10 px-5 py-2 text-sm font-semibold uppercase tracking-wide text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,0.38)] transition hover:shadow-[0_0_45px_rgba(34,211,238,0.55)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950'
            onClick={() => setTrialOpen(true)}
          >
            CLAIM FREE TRIAL
          </button>
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
            Join Premium
          </button>
        </div>
        <div className='cnx-note'>
          💙 GOODLUCK ON YOUR TRADING JOURNEY — WE WANT TO SEE YOU WIN
        </div>
        <div className='cnx-cta-grid'>
          {quickLinks.map((item) => {
            const content = (
              <>
                <div className='cnx-cta-content'>
                  <span className='cnx-cta-label'>{item.title}</span>
                  <span className='cnx-cta-desc'>{item.description}</span>
                </div>
                <span className='cnx-cta-arrow'>↗</span>
              </>
            );

            if (item.soon) {
              return (
                <button
                  key={item.title}
                  type='button'
                  className={`cnx-cta cnx-cta-${item.accent}`}
                  onClick={() => triggerComingSoon(item.title)}
                >
                  {content}
                </button>
              );
            }

            return (
              <Link
                key={item.title}
                href={item.href}
                className={`cnx-cta cnx-cta-${item.accent}`}
                prefetch={false}
              >
                {content}
              </Link>
            );
          })}
        </div>
      </section>

      <FreeTrialModal open={trialOpen} onClose={() => setTrialOpen(false)} />

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
              <button
                type='button'
                className='cnx-btn cnx-btn-ghost cnx-assist-btn'
                onClick={() => openAssistance('2.0')}
              >
                Need Assistance?
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
              <button
                type='button'
                className='cnx-btn cnx-btn-ghost cnx-assist-btn'
                onClick={() => openAssistance('2.1')}
              >
                Need Assistance?
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
              <button
                type='button'
                className='cnx-btn cnx-btn-ghost cnx-assist-btn'
                onClick={() => openAssistance('2.3')}
              >
                Need Assistance?
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

      <TrialRequestSheet open={trialOpen} onClose={() => setTrialOpen(false)} />

      <PaymentSheet
        open={payOpen}
        onClose={() => setPayOpen(false)}
        plan={plan}
      />

      {comingSoon && (
        <div className='cnx-soon' role='status' aria-live='polite'>
          <div className='cnx-soon-inner'>
            <span className='cnx-soon-prompt'>{comingSoon}</span>
            <span className='cnx-soon-title'>Coming Soon</span>
            <span className='cnx-soon-ribbon'>
              Stay locked in — drops imminent.
            </span>
          </div>
        </div>
      )}

      {/* Scoped CSS (no Tailwind) */}
      <style>{`
        :root{
          --ink:#040309; --ink2:#070510;
          --night:#0b0518; --night2:#120a24;
          --purple:#6124c7;
          --blue:#10A5FF; --gold:#F5C76B;
          --text:#f7f5ff; --muted:#c9c3d7;
        }
        *{box-sizing:border-box} html,body,#root{height:100%}
        body{margin:0}

        .cnx-root{
          min-height:100vh; color:var(--text);
          background:
            radial-gradient(60% 45% at 20% -10%, rgba(97,36,199,.32) 0%, transparent 55%),
            radial-gradient(40% 35% at 80% 10%, rgba(16,165,255,.18) 0%, transparent 60%),
            linear-gradient(160deg, var(--ink) 0%, var(--night) 45%, var(--night2) 100%);
          position:relative; overflow-x:hidden;
          font-family: 'Space Grotesk', Inter, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica, Arial;
          letter-spacing:.01em;
        }

        .cnx-root::before{
          content:''; position:fixed; inset:0; z-index:-2;
          background:radial-gradient(circle at 50% 120%, rgba(245,199,107,.12) 0%, transparent 55%);
          opacity:.9;
          pointer-events:none;
        }

        .cnx-stars{
          position:fixed; inset:0; z-index:-1; pointer-events:none;
          background-image:
            radial-gradient(2px 2px at 20% 30%, rgba(255,255,255,.9) 99%, transparent 100%),
            radial-gradient(1.5px 1.5px at 80% 70%, rgba(137,128,255,.6) 99%, transparent 100%),
            radial-gradient(1.2px 1.2px at 40% 60%, rgba(245,199,107,.7) 99%, transparent 100%),
            radial-gradient(1.2px 1.2px at 60% 20%, rgba(123,76,255,.5) 99%, transparent 100%);
          animation: twinkle 9s linear infinite;
          opacity:.75;
        }
        .cnx-glow{position:fixed; z-index:-1; filter:blur(90px); opacity:.3}
        .cnx-glow-gold{top:-120px; left:-140px; width:360px; height:360px; background: radial-gradient(circle, rgba(245,199,107,.85), transparent 65%)}
        .cnx-glow-blue{bottom:-120px; right:-140px; width:340px; height:340px; background: radial-gradient(circle, rgba(16,165,255,.65), transparent 65%)}
        .cnx-glow-purple{top:40%; left:50%; width:480px; height:480px; transform:translate(-50%, -50%); background: radial-gradient(circle, rgba(97,36,199,.55), transparent 70%)}
        @keyframes twinkle { 0%,100%{opacity:.65} 50%{opacity:1} }

        .cnx-btn{display:inline-flex; align-items:center; justify-content:center; padding:12px 20px; border-radius:18px; text-decoration:none; transition:.2s ease; border:1px solid rgba(245,199,107,.35); color:#fff; font-weight:600; letter-spacing:.02em; backdrop-filter:blur(6px); background:rgba(16,12,32,.28)}
        .cnx-btn-trial{position:relative; z-index:0; overflow:hidden; padding:14px 28px; border-radius:24px; letter-spacing:.18em; font-weight:800; text-transform:uppercase; background:linear-gradient(120deg, rgba(79,205,255,1) 0%, rgba(0,255,224,.92) 48%, rgba(139,93,255,.92) 100%); color:#04031a; border:1px solid rgba(79,205,255,.6); box-shadow:0 0 18px rgba(79,205,255,.45), 0 0 36px rgba(139,93,255,.35); animation:cnxTrialPulse 2.8s ease-in-out infinite; backdrop-filter:blur(8px)}
        .cnx-btn-trial::after{content:''; position:absolute; inset:-45%; background:conic-gradient(from 0deg, rgba(255,255,255,.25), rgba(79,205,255,.75), rgba(139,93,255,.55), rgba(255,255,255,.25)); filter:blur(28px); opacity:.8; z-index:-1; animation:cnxTrialAurora 6s linear infinite}
        .cnx-btn-trial:hover{transform:translateY(-2px) scale(1.01); box-shadow:0 0 22px rgba(79,205,255,.6), 0 0 48px rgba(139,93,255,.45)}
        .cnx-btn-trial:focus-visible{outline:2px solid rgba(255,255,255,.8); outline-offset:3px}
        .cnx-btn-trial:active{transform:scale(.98); box-shadow:0 0 16px rgba(79,205,255,.5)}
        .cnx-btn-ghost:hover{background:rgba(245,199,107,.1); border-color:rgba(245,199,107,.55)}
        .cnx-btn-blue{background:linear-gradient(135deg, #1b98ff 0%, #4dc8ff 70%); color:#031224; font-weight:800; border-color:transparent; box-shadow:0 12px 32px rgba(16,165,255,.28)}
        .cnx-btn-blue:hover{transform:translateY(-1px); filter:brightness(1.05)}
        @keyframes cnxTrialPulse{0%,100%{box-shadow:0 0 16px rgba(79,205,255,.45), 0 0 34px rgba(139,93,255,.35)}50%{box-shadow:0 0 26px rgba(79,205,255,.65), 0 0 52px rgba(139,93,255,.5)}}
        @keyframes cnxTrialAurora{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}
        @media (prefers-reduced-motion:reduce){.cnx-btn-trial{animation:none}.cnx-btn-trial::after{animation:none}}

        .cnx-hero{max-width:1120px; margin:0 auto; padding:90px 18px 48px; text-align:center; position:relative}
        .cnx-hero::after{
          content:''; position:absolute; inset:auto 10% -40px; height:1px;
          background:linear-gradient(90deg, transparent, rgba(245,199,107,.28), transparent);
          opacity:.7;
        }
        .cnx-tag{color:rgba(193,197,214,.85); margin:16px 0 24px; font-size:18px; letter-spacing:.12em; text-transform:uppercase}
        .cnx-row{display:flex; gap:12px; justify-content:center; flex-wrap:wrap}
        .cnx-note{color:#d9d3ff; font-size:13px; margin-top:18px; font-weight:700; letter-spacing:.14em; text-transform:uppercase}
        .cnx-cta-grid{
          display:grid; grid-template-columns:repeat(auto-fit, minmax(210px, 1fr));
          gap:14px; margin-top:32px;
        }
        .cnx-cta{
          position:relative; padding:18px 20px; border-radius:20px; border:1px solid rgba(255,255,255,.12);
          background:linear-gradient(140deg, rgba(18,12,34,.92), rgba(9,6,22,.9));
          color:inherit; display:flex; gap:12px; align-items:flex-start; justify-content:space-between;
          text-decoration:none; transition:.25s ease; overflow:hidden; cursor:pointer; font:inherit;
        }
        .cnx-cta:focus-visible{outline:2px solid rgba(245,199,107,.65); outline-offset:4px}
        .cnx-cta::after{
          content:''; position:absolute; inset:1px; border-radius:18px; opacity:.4;
          background:radial-gradient(circle at top right, rgba(255,255,255,.12), transparent 65%);
          transition:opacity .25s ease;
        }
        .cnx-cta:hover{transform:translateY(-4px); border-color:rgba(245,199,107,.55)}
        .cnx-cta:hover::after{opacity:.6}
        .cnx-cta-content{position:relative; z-index:1; display:flex; flex-direction:column; gap:6px}
        .cnx-cta-label{font-size:18px; font-weight:700; letter-spacing:.04em}
        .cnx-cta-desc{font-size:13px; line-height:1.4; color:rgba(211,210,232,.78)}
        .cnx-cta-arrow{position:relative; z-index:1; align-self:flex-end; font-size:20px; opacity:.7; transition:transform .25s ease, opacity .25s ease}
        .cnx-cta:hover .cnx-cta-arrow{transform:translate(4px, -4px); opacity:1}
        .cnx-cta-bots{box-shadow:0 0 32px rgba(97,36,199,.25)}
        .cnx-cta-bots::before{content:''; position:absolute; inset:-40% 55% auto -40%; height:140%; border-radius:50%; background:radial-gradient(circle, rgba(97,36,199,.35), transparent 70%); z-index:0}
        .cnx-cta-indicators::before{content:''; position:absolute; inset:-50% -30% auto 40%; height:150%; border-radius:50%; background:radial-gradient(circle, rgba(245,199,107,.35), transparent 72%); z-index:0}
        .cnx-cta-heat::before{content:''; position:absolute; inset:-30% -20% auto 20%; height:120%; border-radius:50%; background:radial-gradient(circle, rgba(255,93,93,.35), transparent 70%); z-index:0}
        .cnx-cta-eas::before{content:''; position:absolute; inset:-45% 30% auto -25%; height:130%; border-radius:50%; background:radial-gradient(circle, rgba(16,165,255,.32), transparent 70%); z-index:0}

        .cnx-section{max-width:1120px; margin:0 auto; padding:48px 18px}
        .cnx-section h2{margin:0 0 18px; font-size:26px; text-transform:uppercase; letter-spacing:.24em; color:#e9e6ff}
        .cnx-section h2::after{
          content:''; display:block; width:64px; height:2px; margin-top:10px;
          background:linear-gradient(90deg, rgba(245,199,107,.8), rgba(16,165,255,.6));
        }
        .cnx-grid{display:grid; grid-template-columns:repeat(auto-fit, minmax(250px, 1fr)); gap:18px}
        .cnx-card, .cnx-price{
          background:linear-gradient(145deg, rgba(24,16,42,.92), rgba(13,9,26,.88));
          border:1px solid rgba(255,255,255,.08);
          border-radius:22px; padding:20px;
          box-shadow:0 18px 44px rgba(8,4,18,.6);
          transition:.3s ease;
        }
        .cnx-card:hover, .cnx-price:hover{ border-color: rgba(245,199,107,.55); transform:translateY(-6px); box-shadow:0 28px 50px rgba(9,5,20,.65); }
        .cnx-meta{display:flex; justify-content:space-between; align-items:center; color:#cfd3dc; font-size:12px; text-transform:uppercase; letter-spacing:.18em}
        .cnx-badge{border:1px solid rgba(255,255,255,.18); padding:4px 10px; border-radius:999px; background:rgba(255,255,255,.06); font-size:11px; letter-spacing:.18em}
        .cnx-card-title{margin:10px 0 12px; font-size:20px; letter-spacing:.02em}
        .cnx-text{color:#d8d4e8; line-height:1.6}
        .cnx-tags{display:flex; flex-wrap:wrap; gap:8px; margin-top:10px}
        .cnx-tags span{font-size:12px; color:#dad4ff; border:1px solid rgba(120,112,255,.45); padding:5px 10px; border-radius:999px; background:rgba(52,38,92,.4)}
        .cnx-card-actions{display:flex; gap:10px; margin-top:18px}
        .cnx-assist-btn{border-color:rgba(16,165,255,.35); background:rgba(16,12,32,.35); color:rgba(198,208,255,.92)}
        .cnx-assist-btn:hover{border-color:rgba(16,165,255,.65); background:rgba(16,165,255,.12); color:#fff}

        .cnx-price h3{margin:8px 0; font-size:20px}
        .cnx-amount{font-size:26px; color:var(--gold); font-weight:800; letter-spacing:.04em}
        .cnx-price ul{margin:14px 0 18px; padding-left:18px; color:#d0cee2; line-height:1.6}

        .cnx-footer{max-width:1120px; margin:48px auto 60px; text-align:center; color:#9189b1; font-size:12px; letter-spacing:.14em; text-transform:uppercase}
        .cnx-line{height:1px; background:linear-gradient(90deg, transparent, rgba(255,255,255,.18), transparent); margin:22px 0}

        .cnx-tagline{color:var(--muted); margin-top:12px; text-align:center}

        .cnx-soon{position:fixed; inset:0; z-index:99; display:flex; align-items:center; justify-content:center; padding:18px; background:rgba(4,3,12,.76); backdrop-filter:blur(14px); animation:soonFade .25s ease}
        .cnx-soon-inner{position:relative; padding:42px 64px; border-radius:32px; text-align:center; background:linear-gradient(160deg, rgba(27,16,52,.88), rgba(8,6,20,.92)); border:1px solid rgba(245,199,107,.28); box-shadow:0 40px 120px rgba(16,165,255,.22)}
        .cnx-soon-inner::after{content:''; position:absolute; inset:-2px; border-radius:34px; border:1px solid rgba(255,255,255,.08); opacity:.5; mix-blend-mode:screen; animation:pulseHalo 2.4s ease-in-out infinite}
        .cnx-soon-prompt{display:block; font-size:16px; letter-spacing:.28em; text-transform:uppercase; color:rgba(245,199,107,.85); margin-bottom:18px}
        .cnx-soon-title{display:block; font-size:44px; font-weight:800; letter-spacing:.24em; text-transform:uppercase; background:linear-gradient(90deg, #f5c76b, #9c4dff, #10a5ff, #f5c76b); background-size:300%; color:transparent; -webkit-background-clip:text; animation:soonGlow 3.5s linear infinite}
        .cnx-soon-ribbon{display:inline-block; margin-top:18px; padding:8px 18px; border-radius:999px; font-size:13px; letter-spacing:.22em; text-transform:uppercase; color:rgba(198,208,255,.88); background:rgba(52,36,88,.72); box-shadow:0 10px 32px rgba(76,58,128,.3); animation:ribbonPulse 1.9s ease-in-out infinite}

        @keyframes soonGlow {0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes ribbonPulse {0%,100%{transform:translateY(0); opacity:.8}50%{transform:translateY(-4px); opacity:1}}
        @keyframes soonFade {from{opacity:0} to{opacity:1}}
        @keyframes pulseHalo {0%,100%{opacity:.3}50%{opacity:.7}}


        @media (max-width: 720px){
          .cnx-tag{font-size:13px; letter-spacing:.18em}
          .cnx-cta-grid{margin-top:26px}
          .cnx-cta{padding:16px 18px}
          .cnx-cta-label{font-size:16px}
        }

        @media (max-width: 520px){
          .cnx-hero{padding-top:72px}
          .cnx-tag{letter-spacing:.14em}
          .cnx-note{letter-spacing:.08em}
          .cnx-section h2{letter-spacing:.16em}
          .cnx-soon-inner{padding:32px 30px}
          .cnx-soon-title{font-size:32px}
          .cnx-soon-prompt{letter-spacing:.18em}
        }


      `}</style>
    </div>
  );
}
