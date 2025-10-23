export type LenisOptions = {
  lerp?: number;
  wheelMultiplier?: number;
  smoothWheel?: boolean;
  smoothTouch?: boolean;
};

export type LenisScrollToOptions = {
  offset?: number;
  immediate?: boolean;
};

export default class Lenis {
  constructor(options?: LenisOptions);
  raf(time: number): void;
  scrollTo(target: number | HTMLElement, options?: LenisScrollToOptions): void;
  destroy(): void;
}
