'use client';

import React, { forwardRef, useEffect, useMemo, useState } from 'react';

type MotionComponentProps = {
  initial?: Record<string, unknown>;
  animate?: Record<string, unknown>;
  exit?: Record<string, unknown>;
  transition?: string | { duration?: number; ease?: string };
  style?: React.CSSProperties;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>;

const DEFAULT_TRANSITION = 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)';

const toStyle = (value?: Record<string, unknown>) => value ?? {};

const resolveTransition = (value?: MotionComponentProps['transition']) => {
  if (!value) return DEFAULT_TRANSITION;
  if (typeof value === 'string') return value;

  const duration = value.duration ?? 0.35;
  const ease = value.ease ?? 'cubic-bezier(0.22, 1, 0.36, 1)';
  return `all ${duration}s ${ease}`;
};

const createFallbackMotion = (tag: string) => {
  return forwardRef<HTMLElement, MotionComponentProps>(
    ({ initial, animate, transition, style, children, ...rest }, ref) => {
      const [currentStyle, setCurrentStyle] = useState<Record<string, unknown>>(
        toStyle(initial)
      );

      const transitionStyle = useMemo(
        () => resolveTransition(transition),
        [transition]
      );

      useEffect(() => {
        const frame = requestAnimationFrame(() => {
          setCurrentStyle(toStyle(animate));
        });
        return () => cancelAnimationFrame(frame);
      }, [animate]);

      return React.createElement(
        tag,
        {
          ...rest,
          ref,
          style: {
            transition: transitionStyle,
            ...currentStyle,
            ...style,
          },
        },
        children
      );
    }
  );
};

const fallbackMotion = new Proxy(
  {},
  {
    get: (_target, key: string) => createFallbackMotion(key),
  }
);

const FallbackAnimatePresence = ({
  children,
}: {
  children: React.ReactNode;
}) => <>{children}</>;

let motionExport = fallbackMotion as typeof fallbackMotion;
let animatePresenceExport =
  FallbackAnimatePresence as typeof FallbackAnimatePresence;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const realMotion = eval('require')('framer-motion');
  if (realMotion?.motion) {
    motionExport = realMotion.motion;
  }
  if (realMotion?.AnimatePresence) {
    animatePresenceExport = realMotion.AnimatePresence;
  }
} catch (error) {
  // Framer Motion is not installed; fall back to light implementation.
}

export const motion = motionExport;
export const AnimatePresence = animatePresenceExport;
