'use client';

import Lenis from '@studio-freight/lenis';
import { useEffect } from 'react';

/**
 * Mount once at the root (e.g., in page.tsx).
 * Provides smooth, inertial scrolling on mobile/desktop.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 1,
      smoothWheel: true,
      smoothTouch: true,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      const destroy = (lenis as { destroy?: () => void }).destroy;
      if (typeof destroy === 'function') {
        destroy.call(lenis);
      }
    };
  }, []);

  return null;
}
