/* eslint-disable */
import type * as React from 'react';
import type { JSX } from 'react';

export type MotionStyle = {
  x?: number | string;
  y?: number | string;
  scale?: number;
  rotate?: number | string;
  opacity?: number;
};

export type MotionTransition = {
  duration?: number;
  delay?: number;
  ease?:
    | 'linear'
    | 'easeIn'
    | 'easeOut'
    | 'easeInOut'
    | [number, number, number, number];
};

export type MotionViewport = {
  amount?: number;
  once?: boolean;
};

export class MotionValue<T = any> {
  constructor(initial: T);
  get(): T;
  set(value: T): void;
  onChange(listener: (value: T) => void): () => void;
}

export type MotionComponentProps<Tag extends keyof JSX.IntrinsicElements> =
  Omit<React.ComponentPropsWithoutRef<Tag>, 'style'> & {
    initial?: MotionStyle;
    animate?: MotionStyle;
    whileInView?: MotionStyle;
    whileHover?: MotionStyle;
    whileTap?: MotionStyle;
    transition?: MotionTransition;
    viewport?: MotionViewport;
    style?: any;
  };

export type MotionComponent<Tag extends keyof JSX.IntrinsicElements> =
  React.ForwardRefExoticComponent<
    MotionComponentProps<Tag> & React.RefAttributes<React.ElementRef<Tag>>
  >;

export declare const motion: {
  [Tag in keyof JSX.IntrinsicElements]: MotionComponent<Tag>;
};

export function useMotionValue<T>(initial: T): MotionValue<T>;

export function useTransform(
  value: MotionValue<number>,
  inputRange: number[],
  outputRange: Array<number | string>
): MotionValue<number | string>;

export function useScroll(): {
  scrollY: MotionValue<number>;
  scrollYProgress: MotionValue<number>;
};

export default motion;
