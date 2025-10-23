export type LenisOptions = {
  duration?: number;
  smoothWheel?: boolean;
  smoothTouch?: boolean;
  touchMultiplier?: number;
  gestureDirection?: 'vertical' | 'horizontal';
};

type Listener = (event: Event) => void;

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(value, max));

class Lenis {
  private readonly options: Required<LenisOptions>;

  private readonly isBrowser: boolean;

  private target: number;

  private current: number;

  private lastTime: number | null;

  private internalScroll = false;

  private touchStartY = 0;

  private readonly wheelListener: Listener;

  private readonly touchStartListener: Listener;

  private readonly touchMoveListener: Listener;

  private readonly scrollListener: Listener;

  constructor(options: LenisOptions = {}) {
    this.isBrowser = typeof window !== 'undefined';

    this.options = {
      duration: options.duration ?? 1.2,
      smoothWheel: options.smoothWheel ?? true,
      smoothTouch: options.smoothTouch ?? true,
      touchMultiplier: options.touchMultiplier ?? 1.25,
      gestureDirection: options.gestureDirection ?? 'vertical',
    };

    this.target = 0;
    this.current = 0;
    this.lastTime = null;

    this.wheelListener = (event) => this.handleWheel(event as WheelEvent);
    this.touchStartListener = (event) =>
      this.handleTouchStart(event as TouchEvent);
    this.touchMoveListener = (event) =>
      this.handleTouchMove(event as TouchEvent);
    this.scrollListener = () => this.handleNativeScroll();

    if (!this.isBrowser) {
      return;
    }

    this.target = window.scrollY;
    this.current = window.scrollY;

    if (this.options.smoothWheel) {
      window.addEventListener('wheel', this.wheelListener, { passive: false });
    }

    if (this.options.smoothTouch) {
      window.addEventListener('touchstart', this.touchStartListener, {
        passive: false,
      });
      window.addEventListener('touchmove', this.touchMoveListener, {
        passive: false,
      });
    }

    window.addEventListener('scroll', this.scrollListener, { passive: true });
  }

  raf(time: number) {
    if (!this.isBrowser) {
      return;
    }

    if (this.lastTime === null) {
      this.lastTime = time;
      return;
    }

    const deltaTime = (time - this.lastTime) / 1000;
    this.lastTime = time;

    const delta = this.target - this.current;

    if (Math.abs(delta) < 0.1) {
      this.current = this.target;
      return;
    }

    const duration =
      this.options.duration <= 0 ? 0.0001 : this.options.duration;
    const smoothing = 1 - Math.pow(0.001, deltaTime / duration);

    this.current += delta * smoothing;
    this.internalScroll = true;
    window.scrollTo({ top: this.current, behavior: 'auto' });
  }

  destroy() {
    if (!this.isBrowser) {
      return;
    }

    if (this.options.smoothWheel) {
      window.removeEventListener('wheel', this.wheelListener as EventListener);
    }

    if (this.options.smoothTouch) {
      window.removeEventListener(
        'touchstart',
        this.touchStartListener as EventListener
      );
      window.removeEventListener(
        'touchmove',
        this.touchMoveListener as EventListener
      );
    }

    window.removeEventListener('scroll', this.scrollListener as EventListener);
  }

  private handleWheel(event: WheelEvent) {
    if (!this.isBrowser) {
      return;
    }

    if (this.options.gestureDirection !== 'vertical') {
      return;
    }

    event.preventDefault();
    this.target = this.clampTarget(this.target + event.deltaY);
  }

  private handleTouchStart(event: TouchEvent) {
    if (!this.isBrowser) {
      return;
    }

    const touch = event.touches[0];
    if (!touch) {
      return;
    }

    this.touchStartY = touch.clientY;
    this.target = window.scrollY;
  }

  private handleTouchMove(event: TouchEvent) {
    if (!this.isBrowser) {
      return;
    }

    const touch = event.touches[0];
    if (!touch) {
      return;
    }

    const delta =
      (this.touchStartY - touch.clientY) * this.options.touchMultiplier;
    this.touchStartY = touch.clientY;

    if (Math.abs(delta) < 0.1) {
      return;
    }

    event.preventDefault();
    this.target = this.clampTarget(this.target + delta);
  }

  private handleNativeScroll() {
    if (!this.isBrowser || this.internalScroll) {
      this.internalScroll = false;
      return;
    }

    this.target = window.scrollY;
    this.current = window.scrollY;
  }

  private clampTarget(value: number) {
    return clamp(value, 0, this.getMaxScroll());
  }

  private getMaxScroll() {
    if (!this.isBrowser) {
      return 0;
    }

    const { scrollHeight } = document.documentElement;
    const viewport = window.innerHeight;
    return Math.max(0, scrollHeight - viewport);
  }
}

export default Lenis;
