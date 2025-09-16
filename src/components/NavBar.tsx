'use client';

import Link from 'next/link';
import { useState } from 'react';

import BrandLogo from './BrandLogo';

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <header className='cnx-nav'>
      <div className='inner'>
        <Link href='/' className='logo' aria-label='Cardic Nexus home'>
          <BrandLogo size='md' />
        </Link>

        <nav className='links'>
          <Link href='/projects'>Projects</Link>
          <Link href='/projects/heat'>CARDIC Heat</Link>
          <Link href='/pricing'>Pricing</Link>
          <Link href='/contact'>Contact</Link>
        </nav>

        <div className='actions'>
          <Link href='/pricing' className='btn blue'>
            Join Premium
          </Link>
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
          <Link href='/projects' onClick={() => setOpen(false)}>
            Projects
          </Link>
          <Link href='/projects/heat' onClick={() => setOpen(false)}>
            CARDIC Heat
          </Link>
          <Link href='/pricing' onClick={() => setOpen(false)}>
            Pricing
          </Link>
          <Link href='/contact' onClick={() => setOpen(false)}>
            Contact
          </Link>
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
        .inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .links {
          display: flex;
          gap: 16px;
          align-items: center;
        }
        .links a {
          color: #cfd3dc;
          text-decoration: none;
          font-size: 14px;
        }
        .links a:hover {
          color: #fff;
        }

        .actions {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .btn {
          display: inline-block;
          padding: 10px 14px;
          border-radius: 14px;
          border: 1px solid rgba(245, 199, 107, 0.45);
          color: #fff;
          text-decoration: none;
        }
        .btn.blue {
          background: #10a5ff;
          color: #000;
          font-weight: 800;
          border-color: transparent;
          box-shadow: 0 0 24px rgba(16, 165, 255, 0.35);
        }
        .btn.blue:hover {
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
          .links {
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
      `}</style>
    </header>
  );
}
