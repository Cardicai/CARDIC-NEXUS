'use client';

import Link from 'next/link';
import { type MouseEvent as ReactMouseEvent, useState } from 'react';

import BrandLogo from './BrandLogo';

const navDestinations = [
  {
    label: 'Automation Bots',
    description:
      'Deploy Nexus-managed bots with disciplined risk routing and oversight.',
    href: '/bots',
  },
  {
    label: 'Trading Hub',
    description:
      'Enter the live lounges, accountability pods, and analytics vault.',
    href: '/trading-hub',
  },
  {
    label: 'Premium Indicators',
    description:
      'Unlock Nexus Pulse signals, order-flow heat, and proprietary overlays.',
    href: '/indicators',
  },
  {
    label: 'Operations Desk',
    description:
      'Check live desk status, service metrics, and precision commitments.',
    href: '/desk',
  },
  {
    label: 'Support Desk',
    description:
      'Talk with the Nexus team, verify accounts, or request onboarding help.',
    href: '/support',
  },
];

const primaryLinks = [
  { label: 'Trading Hub', href: '/trading-hub' },
  { label: 'Premium Indicators', href: '/indicators' },
  { label: 'Support', href: '/support' },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);

  const onNavClick = (e: ReactMouseEvent<HTMLAnchorElement>) => {
    const href = (e.currentTarget.getAttribute('href') || '').trim();
    if (href.startsWith('#')) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const onMobileNavClick = (e: ReactMouseEvent<HTMLAnchorElement>) => {
    onNavClick(e);
    setOpen(false);
  };

  return (
    <header className='cnx-nav fixed inset-x-0 top-0 z-50 h-16 border-b border-[#1a2230] bg-[#0a0d13]/80 backdrop-blur md:h-20'>
      <div className='cnx-nav-inner'>
        <div className='cnx-nav-left'>
          <button
            type='button'
            className='quickLaunch hidden sm:inline-flex'
            aria-label='Open quick access menu'
            aria-expanded={quickOpen}
            onClick={() => {
              setQuickOpen(true);
            }}
          >
            <span />
            <span />
            <span />
          </button>
          <Link href='/' className='brand' aria-label='Cardic Nexus – Home'>
            <BrandLogo size='md' />
          </Link>
        </div>

        <div className='cnx-nav-center' aria-hidden='true'>
          <span className='cnx-nav-title'>
            <span>CARD</span>
            <span>NEXUS</span>
          </span>
        </div>

        <div className='cnx-nav-right'>
          <nav className='cnx-links'>
            {primaryLinks.map((item) => (
              <Link key={item.href} href={item.href} prefetch={false}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className='cnx-nav-actions'>
            <Link
              href='/indicators'
              className='cnx-btn cnx-btn-amber hidden sm:inline-flex'
            >
              View Indicators
            </Link>
            <a
              href='#pay'
              onClick={onNavClick}
              className='cnx-btn cnx-btn-blue hidden sm:inline-flex'
            >
              Join Premium
            </a>
            <button
              className='burger'
              aria-label='Open menu'
              onClick={() => {
                setOpen(true);
              }}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
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
            Launch bots, enter the trading hub, explore premium indicators, or
            reach the support desk without leaving this page.
          </p>
          <nav className='quickTrayLinks'>
            {navDestinations.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                prefetch={false}
                onClick={() => {
                  setQuickOpen(false);
                }}
                className='quickLink'
              >
                <span className='quickLinkLabel'>{item.label}</span>
                <span className='quickLinkDesc'>{item.description}</span>
              </Link>
            ))}
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
          {primaryLinks.map((item) => (
            <Link
              key={`sheet-primary-${item.href}`}
              href={item.href}
              prefetch={false}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href='/indicators'
            className='cnx-btn cnx-btn-amber'
            onClick={() => setOpen(false)}
          >
            View Indicators
          </Link>
          <a
            href='#pay'
            onClick={onMobileNavClick}
            className='cnx-btn cnx-btn-blue'
          >
            Join Premium
          </a>
          <div className='sheetDivider' />
          {navDestinations.map((item) => (
            <Link
              key={`sheet-${item.label}`}
              href={item.href}
              prefetch={false}
              onClick={() => setOpen(false)}
              className='sheetQuickLink'
            >
              <span>{item.label}</span>
              <span>{item.description}</span>
            </Link>
          ))}
        </nav>
      </div>

      <style jsx>{`
        .cnx-nav {
          width: 100%;
          box-shadow: 0 30px 70px rgba(2, 6, 18, 0.55);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
        }

        .cnx-nav-inner {
          width: 100%;
          margin: 0;
          padding: 0 clamp(18px, 5vw, 40px);
          height: 100%;
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          align-items: center;
          gap: clamp(12px, 3vw, 32px);
        }
        .cnx-nav-left {
          display: inline-flex;
          align-items: center;
          gap: 14px;
        }
        .brand {
          display: inline-flex;
          align-items: center;
        }
        .cnx-nav-center {
          display: flex;
          justify-content: center;
        }
        .cnx-nav-title {
          display: inline-flex;
          align-items: center;
          gap: clamp(18px, 4vw, 42px);
          padding: clamp(10px, 2vw, 16px) clamp(26px, 6vw, 64px);
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(10, 12, 24, 0.32);
          box-shadow: inset 0 0 0 1px rgba(59, 130, 246, 0.08);
          text-transform: uppercase;
          letter-spacing: 0.58em;
          font-weight: 700;
          font-size: clamp(0.75rem, 0.9vw + 0.65rem, 1.1rem);
          color: transparent;
          background-image: linear-gradient(
            90deg,
            rgba(245, 199, 107, 0.9),
            rgba(59, 130, 246, 0.9),
            rgba(56, 189, 248, 0.85),
            rgba(245, 199, 107, 0.9)
          );
          background-size: 300% 100%;
          background-clip: text;
          -webkit-background-clip: text;
          animation: navTitleShift 10s ease infinite;
        }
        .cnx-nav-title span {
          display: inline-flex;
          align-items: center;
        }
        .cnx-nav-right {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: clamp(12px, 2vw, 26px);
        }
        @keyframes navTitleShift {
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
        .cnx-links {
          display: flex;
          gap: clamp(12px, 2vw, 24px);
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
          display: inline-flex;
          flex-wrap: wrap;
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
        .cnx-btn.cnx-btn-outline {
          background: rgba(7, 10, 22, 0.72);
          border-color: rgba(59, 130, 246, 0.45);
          color: #d7e9ff;
          font-weight: 700;
          box-shadow: 0 0 26px rgba(59, 130, 246, 0.35);
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
        .cnx-btn.cnx-btn-outline:hover {
          filter: brightness(1.05);
          box-shadow: 0 0 32px rgba(59, 130, 246, 0.45);
        }

        .menuToggle {
          display: none;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 36px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(2, 6, 18, 0.92);
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          transition: transform 0.18s ease, border-color 0.18s ease;
        }
        .menuToggle span {
          display: block;
          width: 16px;
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
          background: rgba(231, 236, 245, 0.9);
        }
        .menuToggle:focus-visible {
          outline: 2px solid rgba(59, 130, 246, 0.6);
          outline-offset: 2px;
        }
        .menuToggle:hover {
          transform: translateY(-1px);
          border-color: rgba(245, 199, 107, 0.4);
        }

        @media (max-width: 900px) {
          .cnx-nav-inner {
            grid-template-columns: auto auto;
          }
          .cnx-nav-center {
            display: none;
          }
          .cnx-links {
            display: none;
          }
          .burger {
            display: block;
          }
          .cnx-nav-right {
            gap: 0;
          }
        }

        @media (max-width: 640px) {
          .cnx-nav-inner {
            grid-template-columns: 1fr auto;
            padding: 0 clamp(14px, 6vw, 18px);
          }
          .cnx-nav-left {
            gap: 10px;
          }
          .cnx-nav-right {
            gap: 10px;
          }
          .cnx-nav-actions {
            gap: 8px;
            flex-wrap: nowrap;
          }
          .cnx-btn {
            padding: 8px 12px;
            font-size: 13px;
            border-radius: 12px;
          }
          .cnx-btn.cnx-btn-blue {
            font-weight: 700;
            box-shadow: 0 14px 38px rgba(16, 165, 255, 0.28);
          }
          .burger {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 38px;
            height: 36px;
            background: rgba(255, 255, 255, 0.08);
          }
          .burger span {
            margin: 4px 8px;
          }
        }

        /* Mobile sheet */
        .sheet {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(2, 6, 14, 1);
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
          top: calc(var(--nav-h) + 12px);
          left: 50%;
          transform: translateX(-50%);
          width: 86%;
          max-width: 440px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          background: rgba(4, 6, 12, 1);
          border: 1px solid rgba(255, 255, 255, 0.16);
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
        .sheetDivider {
          margin: 8px 0 2px;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(148, 163, 184, 0.35),
            transparent
          );
        }
        .sheetQuickLink {
          align-items: flex-start;
          text-align: left;
          gap: 6px;
        }
        .sheetQuickLink span:first-child {
          font-weight: 600;
          color: #f8fafc;
        }
        .sheetQuickLink span:last-child {
          font-size: 12px;
          color: rgba(148, 163, 184, 0.78);
        }
        .sheetNav a:active {
          transform: scale(0.98);
          background: rgba(16, 165, 255, 0.12);
          border-color: rgba(16, 165, 255, 0.35);
        }

        :global(section[id]) {
          scroll-margin-top: calc(var(--nav-h) + 20px);
        }
      `}</style>
    </header>
  );
}
