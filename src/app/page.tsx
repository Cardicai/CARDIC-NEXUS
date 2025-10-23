'use client';

import {
  type Variants,
  motion,
  useAnimation,
  useInView,
  useMotionValueEvent,
  useScroll,
} from 'framer-motion';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import SmoothScroll from './SmoothScroll';

type SectionContent = {
  id: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  cta?: { label: string; href: string };
};

const contentVariants = {
  initial: { opacity: 0, y: 80 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    y: -80,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
} as const;

const textVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  enter: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
      delay: typeof delay === 'number' ? delay : 0,
    },
  }),
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

const Section = ({ eyebrow, title, subtitle, cta }: SectionContent) => {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const inView = useInView(ref, { amount: 0.65, margin: '-10% 0px' });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (inView) {
      hasAnimated.current = true;
      void controls.start('enter');
    } else if (hasAnimated.current) {
      void controls.start('exit');
    }
  }, [controls, inView]);

  return (
    <section className='relative flex h-screen w-full items-center justify-center px-6 py-20 sm:px-10 lg:px-16'>
      <div className='pointer-events-none absolute inset-0 -z-10 overflow-hidden'>
        <div className='absolute left-1/3 top-1/4 h-64 w-64 -translate-x-1/2 rounded-full bg-emerald-400/20 blur-[140px] sm:left-1/4 sm:top-1/3' />
        <div className='absolute right-1/4 top-2/3 h-72 w-72 translate-x-1/2 rounded-full bg-cyan-500/10 blur-[160px]' />
        <div className='absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-white/0 opacity-40' />
      </div>

      <motion.div
        ref={ref}
        className='relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center'
        variants={contentVariants}
        initial='initial'
        animate={controls}
      >
        {eyebrow ? (
          <motion.span
            className='mb-4 text-xs font-semibold uppercase tracking-[0.4em] text-emerald-300/80 sm:text-sm'
            variants={textVariants}
            initial='initial'
            animate={controls}
            custom={0.1}
          >
            {eyebrow}
          </motion.span>
        ) : null}

        <motion.h2
          className='text-3xl font-semibold leading-tight text-white drop-shadow-[0_0_30px_rgba(56,189,248,0.25)] sm:text-4xl md:text-5xl'
          variants={textVariants}
          initial='initial'
          animate={controls}
          custom={0.15}
        >
          {title}
        </motion.h2>

        {subtitle ? (
          <motion.p
            className='mt-6 max-w-2xl text-base text-slate-200/90 sm:text-lg'
            variants={textVariants}
            initial='initial'
            animate={controls}
            custom={0.2}
          >
            {subtitle}
          </motion.p>
        ) : null}

        {cta ? (
          <motion.div
            className='mt-12'
            variants={textVariants}
            initial='initial'
            animate={controls}
            custom={0.25}
          >
            <Link
              href={cta.href}
              className='group relative inline-flex items-center justify-center rounded-full border border-amber-300/50 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 px-8 py-3 text-sm font-semibold uppercase tracking-widest text-black shadow-[0_0_35px_rgba(251,191,36,0.45)] transition-[box-shadow] duration-[800ms] ease-out hover:shadow-[0_0_55px_rgba(251,191,36,0.75)] sm:text-base'
            >
              <span className='absolute inset-0 rounded-full bg-amber-200/40 blur-xl opacity-60 transition-opacity duration-[800ms] ease-out group-hover:opacity-80' />
              <span className='relative'>{cta.label}</span>
            </Link>
          </motion.div>
        ) : null}
      </motion.div>
    </section>
  );
};

const sections: SectionContent[] = [
  {
    id: 'intelligence',
    eyebrow: 'Immersive Intelligence',
    title: 'Cardic Nexus — The Future of Trading Intelligence',
    subtitle:
      'Navigate liquid markets with confidence. Cardic Nexus layers predictive AI with adaptive market structure modeling to surface signals milliseconds ahead of the crowd.',
  },
  {
    id: 'precision',
    eyebrow: 'Engineered Momentum',
    title: 'AI. Precision. Speed.',
    subtitle: 'Smart signals for the modern trader.',
  },
  {
    id: 'revolution',
    eyebrow: 'Stay Ahead',
    title: 'Join The Revolution',
    subtitle:
      'Step into a community of relentless innovators, live telemetry dashboards, and automated execution flows built for uncompromising speed.',
    cta: { label: 'Activate Your Edge', href: '/signup' },
  },
];

const gradientStages = [
  'radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.22), transparent 55%), radial-gradient(circle at 80% 10%, rgba(129, 140, 248, 0.22), transparent 60%), linear-gradient(180deg, #000000 0%, #020617 100%)',
  'radial-gradient(circle at 12% 18%, rgba(16, 185, 129, 0.18), transparent 55%), radial-gradient(circle at 88% 32%, rgba(56, 189, 248, 0.2), transparent 55%), linear-gradient(180deg, #01040f 0%, #0f172a 100%)',
  'radial-gradient(circle at 25% 25%, rgba(251, 191, 36, 0.3), transparent 55%), radial-gradient(circle at 75% 10%, rgba(253, 224, 71, 0.28), transparent 55%), linear-gradient(180deg, #020204 0%, #111827 100%)',
];

const Home = () => {
  const { scrollYProgress } = useScroll();
  const [stage, setStage] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const nextStage = latest < 0.33 ? 0 : latest < 0.66 ? 1 : 2;
    setStage((previous) => (previous === nextStage ? previous : nextStage));
  });

  return (
    <main className='relative min-h-screen overflow-hidden text-white'>
      <SmoothScroll />
      <div className='pointer-events-none absolute inset-0 -z-20 bg-gradient-to-b from-black via-[#020617] to-[#020617]' />
      <div className='pointer-events-none absolute inset-0 -z-10'>
        {gradientStages.map((gradient, index) => (
          <motion.div
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            className='absolute inset-0'
            animate={{ opacity: stage === index ? 1 : 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ background: gradient }}
          />
        ))}
      </div>

      <div className='relative z-10 flex flex-col'>
        {sections.map((section) => (
          <Section key={section.id} {...section} />
        ))}
      </div>

      <div className='pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-black via-black/20 to-transparent blur-3xl' />
      <div className='pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-black via-black/30 to-transparent blur-3xl' />
    </main>
  );
};

export default Home;
