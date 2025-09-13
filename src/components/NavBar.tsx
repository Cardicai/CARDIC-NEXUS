import Link from 'next/link';

import Logo from './Logo';

const links = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function NavBar() {
  return (
    <nav className='flex items-center justify-between px-4 py-4 md:px-8'>
      <Logo />
      <ul className='hidden gap-6 md:flex'>
        {links.map((l) => (
          <li key={l.href}>
            <Link className='hover:text-brand-blue' href={l.href}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
      <div>
        <Link
          href='/pricing'
          className='rounded-full bg-brand-blue px-4 py-2 text-sm font-semibold text-white hover:shadow-gold'
        >
          Join Premium
        </Link>
      </div>
    </nav>
  );
}
