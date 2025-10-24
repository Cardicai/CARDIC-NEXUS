'use client';

import Link from 'next/link';
import { type MouseEvent, useEffect, useRef, useState } from 'react';

import BrandLogo from './BrandLogo';

const TELEGRAM_CHANNEL = 'https://t.me/cardicnexus';
const TELEGRAM_DM = 'https://t.me/realcardic1';

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const [welcomeVisible, setWelcomeVisible] = useState(false);
  const welcomeUrl = useRef<string | null>(null);
  const welcomeWin = useRef<Window | null>(null);
  const welcomeTimer = useRef<number | null>(null);

  const quickLinks = [
    {
      label: 'Add Bots',
      description: 'Sync automation suites with prop-safe risk controls.',
      href: '#bots',
      type: 'anchor' as const,
    },
    {
      label: 'Competition HQ',
      description: 'Timeline, rules, and live status in one command center.',
      href: '/competition',
      type: 'link' as const,
    },
    {
      label: 'Join Trading Hub',
      description: 'Enter the social terminals and accountability pods.',
      href: '#trading-hub',
      type: 'anchor' as const,
    },
    {
      label: 'Premium Indicators',
      description: 'Request Nexus Pulse access and upgrade your charts.',
      href: '#indicator',
      type: 'anchor' as const,
    },
    {
      label: 'Partnership Program',
      description: 'Scale revenue by representing Cardic Nexus globally.',
      href: '/partner',
      type: 'link' as const,
    },
    {
      label: 'Contact Support',
      description: 'Direct line to the Nexus desk for verification & help.',
      href: TELEGRAM_DM,
      type: 'external' as const,
    },
  ];

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

  const onQuickAnchorClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onNavClick(e);
    setQuickOpen(false);
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
        <div className='cnx-nav-left'>
          <button
            type='button'
            className='quickLaunch'
            aria-label='Open quick access menu'
            aria-expanded={quickOpen}
            onClick={() => setQuickOpen(true)}
          >
            <span className='quickLaunchBar' />
            <span className='quickLaunchBar' />
            <span className='quickLaunchDot' />
          </button>
          <Link href='/' className='brand' aria-label='Cardic Nexus – Home'>
            <BrandLogo size='md' />
          </Link>
        </div>

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

      <div
        className={`quickPanel ${quickOpen ? 'open' : ''}`}
        role='dialog'
        aria-modal='true'
        aria-label='Cardic Nexus quick access menu'
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            setQuickOpen(false);
          }
        }}
      >
        <aside className='quickTray'>
          <div className='quickTrayHeader'>
            <div>
              <span className='quickTrayEyebrow'>Navigate Fast</span>
              <h2 className='quickTrayTitle'>Nexus Shortcuts</h2>
            </div>
            <button
              type='button'
              className='quickTrayClose'
              onClick={() => setQuickOpen(false)}
              aria-label='Close quick access menu'
            >
              Close
            </button>
          </div>
          <p className='quickTrayCopy'>
            Jump directly to bots, competitions, trading lounges, and premium
            support without leaving your current page.
          </p>
          <nav className='quickTrayLinks'>
            {quickLinks.map((item) => {
              const content = (
                <>
                  <span className='quickLinkLabel'>{item.label}</span>
                  <span className='quickLinkDesc'>{item.description}</span>
                </>
              );

              if (item.type === 'anchor') {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={onQuickAnchorClick}
                    className='quickLink'
                  >
                    {content}
                  </a>
                );
              }

              if (item.type === 'external') {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target='_blank'
                    rel='noreferrer'
                    onClick={() => setQuickOpen(false)}
                    className='quickLink'
                  >
                    {content}
                  </a>
                );
              }

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  prefetch={false}
                  onClick={() => setQuickOpen(false)}
                  className='quickLink'
                >
                  {content}
                </Link>
              );
            })}
          </nav>
        </aside>
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
        .cnx-nav-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .quickLaunch {
          position: relative;
          display: inline-flex;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 42px;
          height: 42px;
          border-radius: 14px;
          border: 1px solid rgba(245, 199, 107, 0.35);
          background: rgba(10, 12, 22, 0.72);
          box-shadow: 0 18px 50px rgba(59, 130, 246, 0.25);
          cursor: pointer;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }
        .quickLaunch:hover {
          transform: translateY(-1px);
          box-shadow: 0 22px 60px rgba(59, 130, 246, 0.35);
        }
        .quickLaunch:focus-visible {
          outline: 2px solid rgba(59, 130, 246, 0.6);
          outline-offset: 2px;
        }
        .quickLaunchBar {
          display: block;
          height: 3px;
          width: 18px;
          margin-left: 12px;
          border-radius: 999px;
          background: linear-gradient(
            90deg,
            rgba(245, 199, 107, 0.9),
            rgba(59, 130, 246, 0.8)
          );
        }
        .quickLaunchDot {
          display: block;
          width: 10px;
          height: 10px;
          margin-left: 26px;
          border-radius: 999px;
          background: rgba(59, 130, 246, 0.8);
          box-shadow: 0 0 12px rgba(59, 130, 246, 0.55);
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

        .quickPanel {
          position: fixed;
          inset: 0;
          z-index: 80;
          display: flex;
          justify-content: flex-start;
          background: rgba(3, 5, 12, 0.78);
          backdrop-filter: blur(22px);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease;
        }
        .quickPanel.open {
          opacity: 1;
          pointer-events: auto;
        }
        .quickTray {
          width: min(420px, 86vw);
          background: linear-gradient(
            160deg,
            rgba(12, 14, 24, 0.95),
            rgba(7, 6, 16, 0.92)
          );
          border-right: 1px solid rgba(245, 199, 107, 0.2);
          padding: 28px 28px 32px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          box-shadow: 0 45px 140px rgba(15, 23, 42, 0.45);
        }
        .quickTrayHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
        }
        .quickTrayEyebrow {
          display: block;
          font-size: 11px;
          letter-spacing: 0.38em;
          text-transform: uppercase;
          color: rgba(245, 199, 107, 0.75);
        }
        .quickTrayTitle {
          margin-top: 6px;
          font-size: 26px;
          font-weight: 800;
          letter-spacing: 0.16em;
          color: #f8fafc;
        }
        .quickTrayClose {
          background: rgba(59, 130, 246, 0.12);
          color: #e2e8f0;
          border: 1px solid rgba(59, 130, 246, 0.32);
          border-radius: 999px;
          padding: 8px 16px;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.24em;
          cursor: pointer;
          transition: background 0.2s ease, color 0.2s ease;
        }
        .quickTrayClose:hover {
          background: rgba(59, 130, 246, 0.22);
          color: #fff;
        }
        .quickTrayClose:focus-visible {
          outline: 2px solid rgba(245, 199, 107, 0.6);
          outline-offset: 2px;
        }
        .quickTrayCopy {
          font-size: 13px;
          line-height: 1.6;
          color: rgba(203, 213, 225, 0.85);
        }
        .quickTrayLinks {
          display: grid;
          gap: 14px;
        }
        .quickLink {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 16px 18px;
          border-radius: 20px;
          text-decoration: none;
          background: rgba(15, 18, 32, 0.82);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #e2e8f0;
          transition: border-color 0.2s ease, transform 0.2s ease,
            background 0.2s ease;
        }
        .quickLink:hover {
          transform: translateY(-2px);
          border-color: rgba(245, 199, 107, 0.45);
          background: rgba(10, 12, 22, 0.92);
        }
        .quickLinkLabel {
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .quickLinkDesc {
          font-size: 13px;
          color: rgba(148, 163, 184, 0.9);
        }

        @media (max-width: 900px) {
          .cnx-links {
            display: none;
          }
          .burger {
            display: block;
          }
          .quickTray {
            width: min(360px, 90vw);
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
