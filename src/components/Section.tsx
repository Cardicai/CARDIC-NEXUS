'use client';

import { motion } from 'framer-motion';
import { type ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export default function Section({
  children,
  className = '',
  delay = 0,
}: Props) {
  return (
    <section
      className={`h-[100svh] flex items-center justify-center ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay }}
        viewport={{ once: true, amount: 0.4 }}
        className='px-6 text-center'
      >
        {children}
      </motion.div>
    </section>
  );
}
