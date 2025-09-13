// components/NavBar.tsx
import Link from 'next/link';

import Logo from './Logo';

export default function NavBar() {
  return (
    <header className='sticky top-0 z-40 backdrop-blur bg-black/30 border-b border-[rgba(245,199,107,.18)]'>
      <div className='mx-auto max-w-7xl px-4 py-3 flex items-center justify-between'>
        <Link href='/'>
          <Logo />
        </Link>
        <nav className='hidden md:flex items-center gap-6 text-sm text-gray-300'>
          <Link className='hover:text-white' href='/projects'>
            Projects
          </Link>
          <Link className='hover:text-white' href='/pricing'>
            Pricing
          </Link>
          <Link className='hover:text-white' href='/about'>
            About
          </Link>
          <Link className='hover:text-white' href='/contact'>
            Contact
          </Link>
        </nav>
        <Link
          href='/pricing'
          className='rounded-xl px-4 py-2 text-sm font-semibold bg-brand-blue text-black drop-shadow-blue'
        >
          Join Premium
        </Link>
      </div>
    </header>
  );
}
