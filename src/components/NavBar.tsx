'use client';

import Link from 'next/link';
import {
  type MouseEvent as ReactMouseEvent,
  useEffect,
  useRef,
  useState,
} from 'react';

import BrandLogo from './BrandLogo';

const navDestinations = [
  {
    label: 'Automation Bots',
    description:
      'Deploy Nexus-managed bots with disciplined risk routing and oversight.',
    href: '/bots',
  },
  {
    label: 'Competition HQ',
    description:
      'Review schedules, prize pools, and verification status in one arena.',
    href: '/competition',
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
    label: 'Partnership Program',
    description:
      'Scale revenue by representing Cardic Nexus with full media support.',
    href: '/partner',
  },
  {
    label: 'Support Desk',
    description:
      'Talk with the Nexus team, verify accounts, or request onboarding help.',
    href: '/support',
  },
];

const primaryLinks = [
  { label: 'Competition', href: '/competition' },
  { label: 'Trading Hub', href: '/trading-hub' },
  { label: 'Support', href: '/support' },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const [hubOpen, setHubOpen] = useState(false);
  const hubButtonRef = useRef<HTMLButtonElement | null>(null);
  const hubPanelRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    if (!hubOpen) {
      return;
    }

    const onDocumentClick = (event: globalThis.MouseEvent) => {
      const target = event.target as Node;
      if (
        hubPanelRef.current?.contains(target) ||
        hubButtonRef.current?.contains(target)
      ) {
        return;
      }
      setHubOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setHubOpen(false);
      }
    };

    document.addEventListener('mousedown', onDocumentClick);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('mousedown', onDocumentClick);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [hubOpen]);

  return (
    <header className='cnx-nav'>
      <div className='cnx-nav-inner'>
        <div className='cnx-nav-left'>
          <button
            type='button'
            className='quickLaunch'
            aria-label='Open quick access menu'
            aria-expanded={quickOpen}
            onClick={() => {
              setQuickOpen(true);
              setHubOpen(false);
            }}
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
          {primaryLinks.map((item) => (
            <Link key={item.href} href={item.href} prefetch={false}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className='cnx-nav-actions'>
          <button
            ref={hubButtonRef}
            type='button'
            className={`navigator ${hubOpen ? 'active' : ''}`}
            onClick={() => {
              setHubOpen((value) => !value);
              setQuickOpen(false);
              setOpen(false);
            }}
          >
            Navigator
          </button>
          <Link href='/partner' className='cnx-btn cnx-btn-amber'>
            NP (NEXUS PARTNER)
          </Link>
          <a href='#pay' onClick={onNavClick} className='cnx-btn cnx-btn-blue'>
            Join Premium
          </a>
          <button
            className='burger'
            aria-label='Open menu'
            onClick={() => {
              setOpen(true);
              setHubOpen(false);
            }}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div
        ref={hubPanelRef}
        className={`navHubPanel ${hubOpen ? 'open' : ''}`}
        role='dialog'
        aria-modal='false'
        aria-label='Nexus navigation map'
      >
        <div className='navHubHeader'>
          <div>
            <span className='navHubEyebrow'>Cardic Nexus</span>
            <h2 className='navHubTitle'>Navigator Control Room</h2>
          </div>
          <button
            type='button'
            className='navHubClose'
            onClick={() => setHubOpen(false)}
          >
            Close
          </button>
        </div>
        <p className='navHubCopy'>
          Jump straight into automation bots, competition intel, trading hubs,
          premium indicators, partner desks, or support when you need it.
        </p>
        <nav className='navHubLinks'>
          {navDestinations.map((item) => (
            <Link
              key={`nav-map-${item.label}`}
              href={item.href}
              prefetch={false}
              className='navHubLink'
              onClick={() => setHubOpen(false)}
            >
              <span className='navHubLinkLabel'>{item.label}</span>
              <span className='navHubLinkDesc'>{item.description}</span>
            </Link>
          ))}
        </nav>
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
            Launch bots, review competition intel, enter the trading hub, or
            reach partnership and support desks without leaving this page.
          </p>
          <nav className='quickTrayLinks'>
            {navDestinations.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                prefetch={false}
                onClick={() => {
                  setQuickOpen(false);
                  setHubOpen(false);
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
          <button
            type='button'
            className='sheetNavigator'
            onClick={() => {
              setHubOpen(true);
              setOpen(false);
            }}
          >
            Open Navigator
          </button>
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
          position: sticky;
          top: 0;
          z-index: 50;
          backdrop-filter: blur(8px);
          background: rgba(0, 0, 0, 0.35);
          border-bottom: 1px solid rgba(245, 199, 107, 0.18);
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
        .navigator {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 10px 14px;
          border-radius: 12px;
          border: 1px solid rgba(148, 163, 184, 0.35);
          background: rgba(15, 23, 42, 0.65);
          color: #e2e8f0;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          cursor: pointer;
          transition: border-color 0.2s ease, background 0.2s ease,
            transform 0.2s ease, color 0.2s ease;
        }
        .navigator:hover,
        .navigator:focus-visible,
        .navigator.active {
          border-color: rgba(245, 199, 107, 0.65);
          background: rgba(30, 41, 59, 0.85);
          color: #f5c76b;
          transform: translateY(-1px);
          outline: none;
        }
        .navigator:focus-visible {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.35);
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
        .navHubPanel {
          position: fixed;
          top: 80px;
          right: 24px;
          width: min(420px, calc(100vw - 32px));
          border-radius: 28px;
          border: 1px solid rgba(245, 199, 107, 0.22);
          background: linear-gradient(
            160deg,
            rgba(10, 12, 24, 0.92),
            rgba(2, 6, 18, 0.94)
          );
          box-shadow: 0 36px 120px rgba(15, 23, 42, 0.5);
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          opacity: 0;
          pointer-events: none;
          transform: translateY(-12px);
          transition: opacity 0.2s ease, transform 0.2s ease;
          z-index: 90;
        }
        .navHubPanel.open {
          opacity: 1;
          pointer-events: auto;
          transform: translateY(0);
        }
        .navHubHeader {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
        }
        .navHubEyebrow {
          display: block;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.42em;
          color: rgba(245, 199, 107, 0.7);
          margin-bottom: 6px;
        }
        .navHubTitle {
          font-size: 20px;
          font-weight: 700;
          color: #f8fafc;
        }
        .navHubClose {
          background: rgba(59, 130, 246, 0.14);
          border: 1px solid rgba(59, 130, 246, 0.4);
          color: #dbeafe;
          border-radius: 999px;
          padding: 6px 14px;
          cursor: pointer;
          transition: background 0.18s ease;
        }
        .navHubClose:hover {
          background: rgba(59, 130, 246, 0.22);
        }
        .navHubCopy {
          font-size: 13px;
          color: rgba(203, 213, 225, 0.85);
          line-height: 1.6;
        }
        .navHubLinks {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .navHubLink {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 14px 16px;
          border-radius: 18px;
          border: 1px solid rgba(59, 130, 246, 0.18);
          background: rgba(3, 7, 18, 0.72);
          text-decoration: none;
          transition: border-color 0.18s ease, transform 0.18s ease,
            background 0.18s ease;
        }
        .navHubLink:hover {
          border-color: rgba(245, 199, 107, 0.4);
          background: rgba(10, 15, 28, 0.9);
          transform: translateY(-1px);
        }
        .navHubLinkLabel {
          font-size: 15px;
          font-weight: 600;
          color: #e2e8f0;
        }
        .navHubLinkDesc {
          font-size: 13px;
          color: rgba(148, 163, 184, 0.9);
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
          .navigator {
            display: none;
          }
          .burger {
            display: block;
          }
          .quickTray {
            width: min(360px, 90vw);
          }
          .navHubPanel {
            right: 16px;
            top: 72px;
            width: min(360px, calc(100vw - 24px));
          }
        }

        @media (max-width: 720px) {
          .navHubPanel {
            width: min(320px, calc(100vw - 20px));
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
        .sheetNavigator {
          text-transform: uppercase;
          letter-spacing: 0.14em;
          font-weight: 600;
          padding: 14px 16px;
          border-radius: 14px;
          border: 1px solid rgba(148, 163, 184, 0.38);
          background: rgba(17, 24, 39, 0.85);
          color: #f8fafc;
        }
        .sheetNavigator:active {
          transform: scale(0.98);
          background: rgba(59, 130, 246, 0.18);
          border-color: rgba(59, 130, 246, 0.35);
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
          scroll-margin-top: 84px;
        }
      `}</style>
    </header>
  );
}
