'use client';

import Link from 'next/link';
import { type MouseEvent, useState } from 'react';

import BrandLogo from './BrandLogo';

const TELEGRAM_CHANNEL = 'https://t.me/cardicnexus';
const TELEGRAM_DM = 'https://t.me/realcardic1';

export default function NavBar() {
  const [open, setOpen] = useState(false);

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

  return (
    <header className='cnx-nav'>
      <div className='cnx-nav-inner'>
        <Link href='/' className='brand' aria-label='Cardic Nexus – Home'>
          <BrandLogo size='sm' />
        </Link>

        <nav className='cnx-links'>
          <a href={TELEGRAM_CHANNEL} target='_blank' rel='noreferrer'>
            Projects
          </a>
          <a href='#heat' onClick={onNavClick}>
            CARDIC Heat
          </a>
          <a href='#pricing' onClick={onNavClick}>
            Pricing
          </a>
          <a href={TELEGRAM_DM} target='_blank' rel='noreferrer'>
            Contact
          </a>
        </nav>

        <div className='cnx-nav-actions'>
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
            onClick={() => setOpen(false)}
          >
            Projects
          </a>
          <a href='#heat' onClick={onMobileNavClick}>
            CARDIC Heat
          </a>
          <a href='#pricing' onClick={onMobileNavClick}>
            Pricing
          </a>
          <a
            href={TELEGRAM_DM}
            target='_blank'
            rel='noreferrer'
            onClick={() => setOpen(false)}
          >
            Contact
          </a>
          <a
            href='#pay'
            onClick={onMobileNavClick}
            className='cnx-btn cnx-btn-blue'
          >
            Join Premium
          </a>
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
