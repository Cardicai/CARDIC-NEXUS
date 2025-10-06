'use client';

import {
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  forwardRef,
  useEffect,
  useMemo,
  useState,
} from 'react';

type Transition = {
  duration?: number;
};

type MotionStyle = CSSProperties | undefined;

type MotionProps = HTMLAttributes<HTMLDivElement> & {
  animate?: MotionStyle;
  initial?: MotionStyle;
  transition?: Transition;
};

const mergeStyles = (
  base: CSSProperties,
  addition?: MotionStyle
): CSSProperties => ({
  ...base,
  ...(addition ?? {}),
});

const MotionDiv = forwardRef<HTMLDivElement, MotionProps>((props, ref) => {
  const { animate, initial, transition, style, children, ...rest } = props;

  const [appliedStyle, setAppliedStyle] = useState<CSSProperties>(
    mergeStyles({}, initial)
  );

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setAppliedStyle((prev) => mergeStyles(prev, animate));
    });
    return () => cancelAnimationFrame(frame);
  }, [animate]);

  const transitionStyle = useMemo(() => {
    const duration = transition?.duration ?? 0.25;
    return `${duration}s ease`;
  }, [transition?.duration]);

  const combinedStyle = useMemo(
    () => ({
      transition: `all ${transitionStyle}`,
      ...(style ?? {}),
      ...appliedStyle,
    }),
    [appliedStyle, style, transitionStyle]
  );

  return (
    <div ref={ref} style={combinedStyle} {...rest}>
      {children}
    </div>
  );
});

MotionDiv.displayName = 'MotionDiv';

export const motion = { div: MotionDiv } as const;

type AnimatePresenceProps = {
  children: ReactNode;
};

export function AnimatePresence({ children }: AnimatePresenceProps) {
  return <>{children}</>;
}

export default motion;
