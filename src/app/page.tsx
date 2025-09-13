// app/page.tsx
import Link from 'next/link';

import CardicCard from '@/components/CardicCard';
import Logo from '@/components/Logo';

export default function HomePage() {
  return (
    <main>
      {/* HERO */}
      <section className='mx-auto max-w-7xl px-4 pt-14 pb-16 text-center'>
        <Logo center />
        <p className='mt-3 text-sm text-white/60'>
          AI • Trading • Innovation — for retail traders.
        </p>
        <div className='mt-6 flex justify-center gap-3'>
          <Link
            href='/projects'
            className='rounded-xl px-4 py-2 border border-[rgba(245,199,107,.45)] text-white/90 hover:bg-white/10'
          >
            Explore Projects
          </Link>
          <Link
            href='/pricing'
            className='rounded-xl px-4 py-2 font-semibold text-black bg-brand-blue drop-shadow-blue'
          >
            Join Premium
          </Link>
        </div>
        <div className='mt-4 text-sm text-white/70'>
          ✨ Wishing You a Great Weekend — stay golden and disciplined.
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className='mx-auto max-w-7xl px-4 pb-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        <CardicCard>
          <h3 className='text-gold-metallic font-semibold'>Indicators</h3>
          <p className='text-white/70 mt-1'>
            Oracle 1.0, Heat Zones, Spider Web.
          </p>
        </CardicCard>
        <CardicCard>
          <h3 className='text-gold-metallic font-semibold'>EAs & Algos</h3>
          <p className='text-white/70 mt-1'>Automate MetaTrader strategies.</p>
        </CardicCard>
        <CardicCard>
          <h3 className='text-gold-metallic font-semibold'>AI Tools</h3>
          <p className='text-white/70 mt-1'>
            Predictive helpers and analytics.
          </p>
        </CardicCard>
      </section>
    </main>
  );
}
