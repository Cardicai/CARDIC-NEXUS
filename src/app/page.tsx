import React from 'react';

export default function CardicNexusLanding() {
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

  return (
    <div className='cnx-root'>
      {/* Galaxy background layers */}
      <div className='cnx-stars' />
      <div className='cnx-glow cnx-glow-gold' />
      <div className='cnx-glow cnx-glow-blue' />

      {/* NAV */}
      <header className='cnx-nav'>
        <div className='cnx-nav-inner'>
          <div className='cnx-logo'>
            <span className='cnx-text-gold'>CARDIC</span>{' '}
            <span className='cnx-text-blue'>NEXUS</span>
            <div className='cnx-sub'>AI • TRADING</div>
          </div>
          <nav className='cnx-links'>
            <a href='#projects'>Projects</a>
            <a href='#heat'>CARDIC Heat</a>
            <a href='#pricing'>Pricing</a>
            <a href='#contact'>Contact</a>
          </nav>
          <a href='#pricing' className='cnx-btn cnx-btn-blue'>
            Join Premium
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className='cnx-hero'>
        <h1>
          <span className='cnx-text-gold'>CARDIC</span>{' '}
          <span className='cnx-text-blue'>NEXUS</span>
        </h1>
        <p className='cnx-tag'>
          AI • Trading • Innovation — for retail traders.
        </p>
        <div className='cnx-row'>
          <a className='cnx-btn cnx-btn-ghost' href='#projects'>
            Explore Projects
          </a>
          <a className='cnx-btn cnx-btn-blue' href='#pricing'>
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
                <a className='cnx-btn cnx-btn-ghost' href='#pricing'>
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
            <div className='cnx-note'>2 months access</div>
            <div className='cnx-card-actions' style={{ marginTop: 12 }}>
              <a className='cnx-btn cnx-btn-blue' href='#contact'>
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
            <div className='cnx-note'>2 months access</div>
            <div className='cnx-card-actions' style={{ marginTop: 12 }}>
              <a className='cnx-btn cnx-btn-blue' href='#contact'>
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
            <div className='cnx-note'>Early access — 1 month</div>
            <div className='cnx-card-actions' style={{ marginTop: 12 }}>
              <a className='cnx-btn cnx-btn-blue' href='#contact'>
                Get 2.3 Early
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
            <a className='cnx-btn cnx-btn-ghost' href='#contact'>
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
            <a className='cnx-btn cnx-btn-blue' href='#contact'>
              Join
            </a>
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
            href='mailto:realcardic1@gmail.com'
          >
            Email
          </a>
        </div>
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

        /* Galaxy stars */
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

        /* Nav */
        .cnx-nav{position:sticky; top:0; backdrop-filter: blur(8px); border-bottom:1px solid rgba(245,199,107,.18); background:rgba(0,0,0,.35)}
        .cnx-nav-inner{max-width:1100px; margin:0 auto; padding:12px 16px; display:flex; align-items:center; justify-content:space-between}
        .cnx-logo{font-weight:800; letter-spacing:.6px; line-height:1}
        .cnx-sub{font-size:10px; color:#9ea6b3; margin-top:2px}
        .cnx-links a{color:#cfd3dc; margin:0 10px; font-size:14px}
        .cnx-links a:hover{color:#fff}

        .cnx-text-gold{
          background: linear-gradient(180deg,#FFD27A 0%, #F5C76B 45%, #C98E3A 70%, #B77A2B 100%);
          -webkit-background-clip: text; background-clip: text; color: transparent;
          text-shadow: 0 0 18px rgba(245,199,107,.35);
        }
        .cnx-text-blue{
          color: var(--blue);
          text-transform: uppercase;
          letter-spacing: .22em;
          text-shadow: 0 0 10px rgba(16,165,255,.55), 0 0 22px rgba(16,165,255,.35);
        }

        .cnx-btn{display:inline-block; padding:10px 14px; border-radius:14px; text-decoration:none; transition:.2s; border:1px solid rgba(245,199,107,.45); color:#fff}
        .cnx-btn-ghost:hover{background:rgba(255,255,255,.08)}
        .cnx-btn-blue{background:var(--blue); color:#000; font-weight:800; border-color:transparent; box-shadow:0 0 24px rgba(16,165,255,.35)}
        .cnx-btn-blue:hover{filter:brightness(1.08)}

        /* Hero */
        .cnx-hero{max-width:1100px; margin:0 auto; padding:64px 16px 32px; text-align:center}
        .cnx-hero h1{font-family:Poppins, Inter, sans-serif; font-size:56px; line-height:1.05; margin:0}
        .cnx-tag{color:#b6beca; margin:12px 0 18px}
        .cnx-row{display:flex; gap:12px; justify-content:center; flex-wrap:wrap}
        .cnx-note{color:#aeb7c6; font-size:14px; margin-top:12px}

        /* Sections & cards */
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

        /* Pricing */
        .cnx-price h3{margin:6px 0}
        .cnx-amount{font-size:22px; color:var(--blue); font-weight:800}
        .cnx-price ul{margin:10px 0 14px; padding-left:18px; color:#cfd3dc}

        /* Footer */
        .cnx-footer{max-width:1100px; margin:24px auto 40px; text-align:center; color:#a9b4c2; font-size:12px}
        .cnx-line{height:1px; background:linear-gradient(90deg, transparent, rgba(255,255,255,.15), transparent); margin:18px 0}

        @media (max-width:480px){ .cnx-hero h1{font-size:40px} }
      `}</style>
    </div>
  );
}
