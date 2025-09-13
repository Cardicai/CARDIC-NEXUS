import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className='mt-16 border-t border-brand-gold/30 px-4 py-8 text-sm text-gray-400'>
      <div className='mx-auto flex max-w-6xl flex-col items-center gap-4 md:flex-row md:justify-between'>
        <p>© {year} Cardic Nexus</p>
        <div className='flex gap-4'>
          <Link href='/legal/terms' className='hover:text-white'>
            Terms
          </Link>
          <Link href='/legal/privacy' className='hover:text-white'>
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
