'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';

import Section from '@/components/Section';
import SmoothScroll from '@/components/SmoothScroll';

export default function Page() {
  // Optional global parallax background effect
  const { scrollYProgress } = useScroll();
  const bgShift = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.05, 0.25]);

  return (
    <div className='relative min-h-[100svh] bg-gradient-to-b from-black to-[#020617] text-white antialiased'>
      <SmoothScroll />

      {/* Parallax background glow */}
      <motion.div
        style={{ y: bgShift }}
        className='pointer-events-none absolute inset-0 -z-10'
      >
        <div className='absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_30%,rgba(56,189,248,0.15),transparent_60%)]' />
        <div className='absolute inset-0 bg-[radial-gradient(50%_40%_at_60%_70%,rgba(250,204,21,0.10),transparent_60%)]' />
      </motion.div>
      <motion.div
        style={{ opacity: overlayOpacity }}
        className='pointer-events-none absolute inset-0 -z-10 bg-black'
      />

      {/* SECTION 1 */}
      <Section className='bg-transparent' delay={0}>
        <h1 className='text-4xl font-extrabold tracking-tight md:text-6xl'>
          Cardic Nexus
        </h1>
        <p className='mt-4 text-lg text-white/80 md:text-2xl'>
          The Future of Trading Intelligence
        </p>
      </Section>

      {/* SECTION 2 */}
      <Section className='bg-transparent' delay={0.1}>
        <motion.div
          initial={{ scale: 0.95 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.4 }}
          className='mx-auto max-w-2xl'
        >
          <h2 className='text-3xl font-bold md:text-5xl'>
            AI. Precision. Speed.
          </h2>
          <p className='mt-4 text-base text-white/75 md:text-xl'>
            Smart signals for the modern trader. Built for momentum, accuracy,
            and clarity.
          </p>
        </motion.div>
      </Section>

      {/* SECTION 3 */}
      <Section className='bg-transparent' delay={0.15}>
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
          <Link
            href='/register'
            target='_blank'
            rel='noopener noreferrer'
            prefetch={false}
            className='inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-3 text-lg font-semibold shadow-lg backdrop-blur-md hover:bg-white/15'
          >
            Register
            <span className='inline-block h-2 w-2 rounded-full bg-white/80' />
          </Link>
        </motion.div>
        <p className='mt-4 text-sm text-white/60'>
          Smooth mobile scroll • GPU-accelerated • No jank
        </p>
      </Section>
    </div>
  );
}
