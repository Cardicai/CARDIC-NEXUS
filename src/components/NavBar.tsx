'use client';

import Link from 'next/link';
import { type MouseEvent, useEffect, useRef, useState } from 'react';

import BrandLogo from './BrandLogo';

const TELEGRAM_CHANNEL = 'https://t.me/cardicnexus';
const TELEGRAM_DM = 'https://t.me/realcardic1';

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [welcomeVisible, setWelcomeVisible] = useState(false);
  const welcomeUrl = useRef<string | null>(null);
  const welcomeWin = useRef<Window | null>(null);
  const welcomeTimer = useRef<number | null>(null);

  const onNavClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const href = (e.currentTarget.getAttribute('href') || '').trim();
    if (href.startsWith('#')) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const onMobileNavClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onNavClick(e);
    setOpen(false);
  };

  const onWebLinkClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    if (!href || welcomeVisible) {
      return;
    }

    welcomeUrl.current = href;
    try {
      welcomeWin.current = window.open('', '_blank');
    } catch (err) {
      welcomeWin.current = null;
    }
    setWelcomeVisible(true);
  };

  useEffect(() => {
    if (welcomeVisible && welcomeUrl.current) {
      if (welcomeTimer.current) {
        window.clearTimeout(welcomeTimer.current);
      }
      welcomeTimer.current = window.setTimeout(() => {
        const target = welcomeUrl.current;
        if (!target) {
          welcomeUrl.current = null;
          if (welcomeWin.current) {
            try {
              welcomeWin.current.close();
            } catch (err) {
              // no-op
            }
          }
          welcomeWin.current = null;
          setWelcomeVisible(false);
          return;
        }
        const nextWindow = welcomeWin.current;
        if (nextWindow) {
          nextWindow.location.href = target;
        } else {
          window.open(target, '_blank', 'noopener,noreferrer');
        }
        welcomeUrl.current = null;
        welcomeWin.current = null;
        setWelcomeVisible(false);
      }, 1600);
    }

    return () => {
      if (welcomeTimer.current) {
        window.clearTimeout(welcomeTimer.current);
        welcomeTimer.current = null;
      }
    };
  }, [welcomeVisible]);

  useEffect(() => {
    return () => {
      if (welcomeTimer.current) {
        window.clearTimeout(welcomeTimer.current);
      }
      if (welcomeWin.current && !welcomeUrl.current) {
        try {
          welcomeWin.current.close();
        } catch (err) {
          // no-op
        }
      }
    };
  }, []);

  return (
    <header className='cnx-nav'>
      <div className='cnx-nav-inner'>
        <Link href='/' className='brand' aria-label='Cardic Nexus – Home'>
          <BrandLogo size='md' />
        </Link>

        <nav className='cnx-links'>
          <a
            href={TELEGRAM_CHANNEL}
            target='_blank'
            rel='noreferrer'
            onClick={onWebLinkClick}
          >
            Projects
          </a>
          <a href='#heat' onClick={onNavClick}>
            CARDIC Heat
          </a>
          <a href='#pricing' onClick={onNavClick}>
            Pricing
          </a>
          <Link href='/competition' prefetch={false}>
            Competition
          </Link>
          <a href={TELEGRAM_DM} target='_blank' rel='noreferrer'>
            Contact
          </a>
        </nav>

        <div className='cnx-nav-actions'>
          <Link href='/partner' className='cnx-btn cnx-btn-amber'>
            NP (NEXUS PARTNER)
          </Link>
          <a href='#pay' onClick={onNavClick} className='cnx-btn cnx-btn-blue'>
            Join Premium
          </a>
          <button
            className='burger'
            aria-label='Open menu'
            onClick={() => setOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Mobile sheet */}
      <div
        className={`sheet ${open ? 'open' : ''}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
      >
        <nav className='sheetNav'>
          <a
            href={TELEGRAM_CHANNEL}
            target='_blank'
            rel='noreferrer'
            onClick={(e) => {
              onWebLinkClick(e);
              setOpen(false);
            }}
          >
            Projects
          </a>
          <a href='#heat' onClick={onMobileNavClick}>
            CARDIC Heat
          </a>
          <a href='#pricing' onClick={onMobileNavClick}>
            Pricing
          </a>
          <Link
            href='/competition'
            prefetch={false}
            onClick={() => setOpen(false)}
          >
            Competition
          </Link>
          <a
            href={TELEGRAM_DM}
            target='_blank'
            rel='noreferrer'
            onClick={() => setOpen(false)}
          >
            Contact
          </a>
          <Link
            href='/partner'
            className='cnx-btn cnx-btn-amber'
            onClick={() => setOpen(false)}
          >
            NP (NEXUS PARTNER)
          </Link>
          <a
            href='#pay'
            onClick={onMobileNavClick}
            className='cnx-btn cnx-btn-blue'
          >
            Join Premium
          </a>
        </nav>
      </div>

      {welcomeVisible && (
        <div className='welcomeOverlay' role='status' aria-live='assertive'>
          <div className='welcomeInner'>
            <span className='welcomeLabel'>Welcome</span>
            <span className='welcomeTitle'>NEXERS</span>
            <span className='welcomeHint'>Preparing your gateway...</span>
          </div>
        </div>
      )}

      <style jsx>{`
        .cnx-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          backdrop-filter: blur(8px);
          background: rgba(0, 0, 0, 0.35);
          border-bottom: 1px solid rgba(245, 199, 107, 0.18);
        }

        .welcomeOverlay {
          position: fixed;
          inset: 0;
          z-index: 200;
          background: rgba(5, 4, 14, 0.78);
          backdrop-filter: blur(18px);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.25s ease;
        }
        .welcomeInner {
          padding: 48px 72px;
          border-radius: 32px;
          border: 1px solid rgba(245, 199, 107, 0.32);
          box-shadow: 0 40px 120px rgba(16, 165, 255, 0.28);
          background: linear-gradient(
            160deg,
            rgba(28, 16, 52, 0.92),
            rgba(8, 6, 20, 0.94)
          );
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .welcomeInner::after {
          content: '';
          position: absolute;
          inset: -12%;
          background: radial-gradient(
              circle at 30% -20%,
              rgba(245, 199, 107, 0.22),
              transparent 60%
            ),
            radial-gradient(
              circle at 80% 120%,
              rgba(16, 165, 255, 0.18),
              transparent 65%
            );
          opacity: 0.8;
          mix-blend-mode: screen;
          animation: aurora 4s ease-in-out infinite;
        }
        .welcomeLabel {
          display: block;
          font-size: 14px;
          letter-spacing: 0.36em;
          text-transform: uppercase;
          color: rgba(245, 199, 107, 0.82);
          margin-bottom: 18px;
        }
        .welcomeTitle {
          display: block;
          font-size: 54px;
          font-weight: 900;
          letter-spacing: 0.38em;
          text-transform: uppercase;
          color: transparent;
          background: linear-gradient(
            90deg,
            #f5c76b,
            #9c4dff,
            #10a5ff,
            #f5c76b
          );
          background-size: 250%;
          -webkit-background-clip: text;
          animation: shimmer 3.2s linear infinite;
        }
        .welcomeHint {
          display: block;
          margin-top: 20px;
          font-size: 13px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(202, 210, 255, 0.78);
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes shimmer {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        @keyframes aurora {
          0%,
          100% {
            transform: translate3d(-4%, 0, 0) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translate3d(6%, -2%, 0) scale(1.05);
            opacity: 1;
          }
        }
        .cnx-nav-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .cnx-links {
          display: flex;
          gap: 16px;
          align-items: center;
        }
        .cnx-links a {
          color: #cfd3dc;
          text-decoration: none;
          font-size: 14px;
        }
        .cnx-links a:hover {
          color: #fff;
        }

        .cnx-nav-actions {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .cnx-btn {
          display: inline-block;
          padding: 10px 14px;
          border-radius: 14px;
          border: 1px solid rgba(245, 199, 107, 0.45);
          color: #fff;
          text-decoration: none;
        }
        .cnx-btn.cnx-btn-blue {
          background: #10a5ff;
          color: #000;
          font-weight: 800;
          border-color: transparent;
          box-shadow: 0 0 24px rgba(16, 165, 255, 0.35);
        }
        .cnx-btn.cnx-btn-amber {
          background: linear-gradient(135deg, #f5c76b, #ff8a3c);
          color: #0f1014;
          font-weight: 700;
          border-color: rgba(245, 199, 107, 0.55);
          box-shadow: 0 0 22px rgba(245, 199, 107, 0.35);
        }
        .cnx-btn.cnx-btn-amber:hover {
          filter: brightness(1.05);
        }
        .cnx-btn.cnx-btn-blue:hover {
          filter: brightness(1.08);
        }

        .burger {
          display: none;
          width: 38px;
          height: 34px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: rgba(255, 255, 255, 0.06);
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }
        .burger span {
          display: block;
          height: 2px;
          margin: 6px 8px;
          background: #e7ecf5;
        }

        @media (max-width: 900px) {
          .cnx-links {
            display: none;
          }
          .burger {
            display: block;
          }
        }

        /* Mobile sheet */
        .sheet {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(0, 0, 0, 0.55);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease;
        }
        .sheet.open {
          opacity: 1;
          pointer-events: auto;
        }
        .sheetNav {
          position: absolute;
          top: 76px;
          left: 50%;
          transform: translateX(-50%);
          width: 86%;
          max-width: 440px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          background: rgba(15, 15, 19, 0.92);
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 20px;
          padding: 14px;
        }
        .sheetNav a {
          text-align: center;
          padding: 14px 16px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.12);
          text-decoration: none;
          color: #e7ecf5;
        }
        .sheetNav a:active {
          transform: scale(0.98);
          background: rgba(16, 165, 255, 0.12);
          border-color: rgba(16, 165, 255, 0.35);
        }

        :global(section[id]) {
          scroll-margin-top: 84px;
        }
      `}</style>
    </header>
  );
}
