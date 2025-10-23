/* eslint-disable */
'use client';

const DEFAULT_OPTIONS = {
  lerp: 0.1,
  wheelMultiplier: 1,
  smoothWheel: true,
  smoothTouch: true,
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getElementOffset(element) {
  const rect = element.getBoundingClientRect();
  return rect.top + (window.scrollY || window.pageYOffset || 0);
}

class Lenis {
  constructor(options = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this._target = 0;
    this._current = 0;
    this._touchY = null;
    this._destroyed = false;
    this._isInternalScroll = false;
    this._prevScrollBehavior = undefined;
    this._handleWheel = this._handleWheel.bind(this);
    this._handleTouchStart = this._handleTouchStart.bind(this);
    this._handleTouchMove = this._handleTouchMove.bind(this);
    this._handleResize = this._handleResize.bind(this);
    this._handleNativeScroll = this._handleNativeScroll.bind(this);

    if (typeof window === 'undefined') {
      return;
    }

    this._target = window.scrollY || window.pageYOffset || 0;
    this._current = this._target;
    const docEl = document.documentElement;
    this._prevScrollBehavior = docEl.style.scrollBehavior;
    docEl.style.scrollBehavior = 'auto';

    window.addEventListener('resize', this._handleResize, { passive: true });
    window.addEventListener('scroll', this._handleNativeScroll, {
      passive: true,
    });

    if (this.options.smoothWheel) {
      window.addEventListener('wheel', this._handleWheel, { passive: false });
    }
    if (this.options.smoothTouch) {
      window.addEventListener('touchstart', this._handleTouchStart, {
        passive: false,
      });
      window.addEventListener('touchmove', this._handleTouchMove, {
        passive: false,
      });
    }
  }

  _computeMaxScroll() {
    if (typeof window === 'undefined') return 0;
    return Math.max(
      document.documentElement.scrollHeight - window.innerHeight,
      0
    );
  }

  _handleResize() {
    this._target = clamp(this._target, 0, this._computeMaxScroll());
  }

  _handleNativeScroll() {
    if (this._destroyed) return;
    const position = window.scrollY || window.pageYOffset || 0;
    if (this._isInternalScroll) {
      this._current = position;
      this._isInternalScroll = false;
      return;
    }
    this._current = position;
    this._target = position;
  }

  _updateTargetByDelta(delta) {
    this._target = clamp(this._target + delta, 0, this._computeMaxScroll());
  }

  _handleWheel(event) {
    if (!this.options.smoothWheel) return;
    if (event.ctrlKey) return;
    event.preventDefault();
    const multiplier =
      typeof this.options.wheelMultiplier === 'number'
        ? this.options.wheelMultiplier
        : 1;
    this._updateTargetByDelta(event.deltaY * multiplier);
  }

  _handleTouchStart(event) {
    if (!this.options.smoothTouch) return;
    if (event.touches.length !== 1) return;
    this._touchY = event.touches[0]?.clientY ?? null;
  }

  _handleTouchMove(event) {
    if (!this.options.smoothTouch) return;
    if (event.touches.length !== 1) return;
    if (this._touchY == null) {
      this._touchY = event.touches[0]?.clientY ?? null;
      return;
    }
    const currentY = event.touches[0]?.clientY ?? this._touchY;
    const delta = this._touchY - currentY;
    if (Math.abs(delta) < 0.5) return;
    event.preventDefault();
    this._touchY = currentY;
    this._updateTargetByDelta(delta);
  }

  raf() {
    if (typeof window === 'undefined' || this._destroyed) return;
    const max = this._computeMaxScroll();
    this._target = clamp(this._target, 0, max);
    const diff = this._target - this._current;
    if (Math.abs(diff) < 0.1) {
      if (this._current !== this._target) {
        this._current = this._target;
        this._isInternalScroll = true;
        window.scrollTo(0, this._current);
      }
      return;
    }
    this._current +=
      diff *
      (typeof this.options.lerp === 'number'
        ? this.options.lerp
        : DEFAULT_OPTIONS.lerp);
    this._isInternalScroll = true;
    window.scrollTo(0, this._current);
  }

  scrollTo(target, options = {}) {
    if (typeof window === 'undefined') return;
    let destination = 0;
    if (typeof target === 'number') {
      destination = target;
    } else if (target instanceof HTMLElement) {
      destination = getElementOffset(target);
    }
    if (typeof options.offset === 'number') {
      destination += options.offset;
    }
    destination = clamp(destination, 0, this._computeMaxScroll());
    this._target = destination;
    if (options.immediate) {
      this._current = destination;
      this._isInternalScroll = true;
      window.scrollTo(0, destination);
    }
  }

  destroy() {
    if (this._destroyed) return;
    this._destroyed = true;
    if (typeof window === 'undefined') return;
    window.removeEventListener('resize', this._handleResize);
    window.removeEventListener('scroll', this._handleNativeScroll);
    if (this.options.smoothWheel) {
      window.removeEventListener('wheel', this._handleWheel);
    }
    if (this.options.smoothTouch) {
      window.removeEventListener('touchstart', this._handleTouchStart);
      window.removeEventListener('touchmove', this._handleTouchMove);
    }
    const docEl = document.documentElement;
    if (docEl && this._prevScrollBehavior !== undefined) {
      docEl.style.scrollBehavior = this._prevScrollBehavior;
    }
  }
}

export default Lenis;
