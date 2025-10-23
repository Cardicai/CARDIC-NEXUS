/* eslint-disable */
'use client';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

class MotionValue {
  constructor(initial) {
    this._value = initial;
    this._listeners = new Set();
  }
  get() {
    return this._value;
  }
  set(value) {
    if (value === this._value) return;
    this._value = value;
    this._listeners.forEach((listener) => listener(value));
  }
  onChange(listener) {
    this._listeners.add(listener);
    return () => {
      this._listeners.delete(listener);
    };
  }
}

const TRANSFORM_KEYS = new Set(['x', 'y', 'scale', 'rotate']);

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function toUnit(value) {
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return '0px';
    return `${value}px`;
  }
  if (typeof value === 'string') {
    return value;
  }
  return '0px';
}

function mergeDefinitions(...defs) {
  const result = {};
  for (const def of defs) {
    if (!def) continue;
    for (const [key, val] of Object.entries(def)) {
      if (val === undefined || val === null) continue;
      result[key] = val;
    }
  }
  return result;
}

function definitionToCss(definition) {
  if (!definition) return {};
  const transformParts = [];
  if (definition.x !== undefined) {
    transformParts.push(`translateX(${toUnit(definition.x)})`);
  }
  if (definition.y !== undefined) {
    transformParts.push(`translateY(${toUnit(definition.y)})`);
  }
  if (definition.scale !== undefined) {
    transformParts.push(`scale(${definition.scale})`);
  }
  if (definition.rotate !== undefined) {
    transformParts.push(
      `rotate(${
        typeof definition.rotate === 'number'
          ? `${definition.rotate}deg`
          : definition.rotate
      })`
    );
  }
  const transform = transformParts.join(' ').trim();
  const css = {};
  if (transform) {
    css.transform = transform;
  }
  if (definition.opacity !== undefined) {
    css.opacity = definition.opacity;
  }
  return css;
}

function mapEase(ease) {
  if (Array.isArray(ease) && ease.length === 4) {
    return `cubic-bezier(${ease.join(',')})`;
  }
  switch (ease) {
    case 'linear':
      return 'linear';
    case 'easeIn':
      return 'cubic-bezier(0.48, 0.04, 1, 1)';
    case 'easeInOut':
      return 'cubic-bezier(0.4, 0, 0.2, 1)';
    case 'easeOut':
    default:
      return 'cubic-bezier(0, 0, 0.2, 1)';
  }
}

function buildTransition(transition) {
  const duration =
    typeof transition?.duration === 'number' ? transition.duration : 0.3;
  const delay = typeof transition?.delay === 'number' ? transition.delay : 0;
  const easing = mapEase(transition?.ease);
  const dur = `${duration}s`;
  const del = `${delay}s`;
  return `transform ${dur} ${easing} ${del}, opacity ${dur} ${easing} ${del}`;
}

function decomposeValue(value) {
  if (typeof value === 'number') {
    return { number: value, suffix: '' };
  }
  if (typeof value === 'string') {
    const match = value.match(/^-?\d*\.?\d+(.*)$/);
    if (match) {
      const number = parseFloat(value);
      const suffix = match[1] ?? '';
      return { number, suffix };
    }
    const parsed = parseFloat(value);
    if (!Number.isNaN(parsed)) {
      return { number: parsed, suffix: value.replace(String(parsed), '') };
    }
  }
  return { number: 0, suffix: '' };
}

function mix(from, to, progress) {
  return from + (to - from) * progress;
}

function interpolate(value, inputRange, outputRange) {
  if (
    !Array.isArray(inputRange) ||
    !Array.isArray(outputRange) ||
    inputRange.length !== outputRange.length
  ) {
    throw new Error(
      'useTransform requires input and output ranges of equal length.'
    );
  }
  const lastIndex = inputRange.length - 1;
  if (lastIndex < 0) return outputRange[0];
  if (value <= inputRange[0]) return outputRange[0];
  if (value >= inputRange[lastIndex]) return outputRange[lastIndex];
  let idx = 0;
  for (let i = 0; i < lastIndex; i += 1) {
    if (value >= inputRange[i] && value <= inputRange[i + 1]) {
      idx = i;
      break;
    }
  }
  const start = inputRange[idx];
  const end = inputRange[idx + 1];
  const progress = end - start === 0 ? 0 : (value - start) / (end - start);
  const from = outputRange[idx];
  const to = outputRange[idx + 1];
  if (typeof from === 'number' && typeof to === 'number') {
    return mix(from, to, progress);
  }
  const fromDecomposed = decomposeValue(from);
  const toDecomposed = decomposeValue(to);
  const mixed = mix(fromDecomposed.number, toDecomposed.number, progress);
  return `${mixed}${toDecomposed.suffix || fromDecomposed.suffix}`;
}

function useMotionStyle(styleProp) {
  const staticParts = useMemo(() => {
    const rest = {};
    let transform;
    if (!styleProp) return { rest, transform };
    for (const [key, value] of Object.entries(styleProp)) {
      if (value instanceof MotionValue) continue;
      if (key === 'transform') {
        transform = value;
      } else {
        rest[key] = value;
      }
    }
    return { rest, transform };
  }, [styleProp]);

  const [dynamicValues, setDynamicValues] = useState(() => {
    if (!styleProp) return {};
    const initial = {};
    for (const [key, value] of Object.entries(styleProp)) {
      if (value instanceof MotionValue) {
        initial[key] = value.get();
      }
    }
    return initial;
  });

  useEffect(() => {
    if (!styleProp) {
      setDynamicValues({});
      return undefined;
    }
    const unsubscribers = [];
    const initial = {};
    for (const [key, value] of Object.entries(styleProp)) {
      if (value instanceof MotionValue) {
        initial[key] = value.get();
        unsubscribers.push(
          value.onChange((next) => {
            setDynamicValues((prev) => {
              if (prev[key] === next) return prev;
              return { ...prev, [key]: next };
            });
          })
        );
      }
    }
    setDynamicValues(initial);
    return () => {
      unsubscribers.forEach((fn) => fn());
    };
  }, [styleProp]);

  const dynamicDefinition = useMemo(() => {
    const def = {};
    for (const [key, value] of Object.entries(dynamicValues)) {
      if (TRANSFORM_KEYS.has(key) || key === 'opacity') {
        def[key] = value;
      }
    }
    return def;
  }, [dynamicValues]);

  const dynamicStyle = useMemo(() => {
    const style = {};
    for (const [key, value] of Object.entries(dynamicValues)) {
      if (!TRANSFORM_KEYS.has(key) && key !== 'opacity') {
        style[key] = value;
      }
    }
    return style;
  }, [dynamicValues]);

  return {
    staticStyle: staticParts.rest,
    staticTransform: staticParts.transform,
    dynamicDefinition,
    dynamicStyle,
  };
}

function createMotionComponent(tag) {
  const MotionComponent = forwardRef((props, forwardedRef) => {
    const {
      initial,
      animate,
      whileInView,
      whileHover,
      whileTap,
      transition,
      viewport,
      style: styleProp,
      onMouseEnter: userMouseEnter,
      onMouseLeave: userMouseLeave,
      onPointerDown: userPointerDown,
      onPointerUp: userPointerUp,
      onPointerCancel: userPointerCancel,
      ...domProps
    } = props;

    const localRef = useRef(null);
    const setRef = useCallback(
      (node) => {
        localRef.current = node;
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef && typeof forwardedRef === 'object') {
          forwardedRef.current = node;
        }
      },
      [forwardedRef]
    );

    const [inView, setInView] = useState(false);
    const [hasEntered, setHasEntered] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [pressed, setPressed] = useState(false);

    useEffect(() => {
      if (typeof window === 'undefined') return undefined;
      const element = localRef.current;
      if (!element) return undefined;
      if (!('IntersectionObserver' in window)) {
        setInView(true);
        setHasEntered(true);
        return undefined;
      }
      const thresholdValue =
        typeof viewport?.amount === 'number'
          ? clamp(viewport.amount, 0, 1)
          : 0.25;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.target !== element) return;
            if (
              entry.isIntersecting ||
              entry.intersectionRatio >= thresholdValue
            ) {
              setInView(true);
              setHasEntered(true);
              if (viewport?.once !== false) {
                observer.unobserve(element);
              }
            } else if (!viewport?.once) {
              setInView(false);
            }
          });
        },
        { threshold: thresholdValue }
      );
      observer.observe(element);
      return () => observer.disconnect();
    }, [viewport?.amount, viewport?.once]);

    const { staticStyle, staticTransform, dynamicDefinition, dynamicStyle } =
      useMotionStyle(styleProp);

    const baseDefinition = useMemo(() => {
      const defs = [];
      if (initial) defs.push(initial);
      if ((hasEntered || inView) && whileInView) defs.push(whileInView);
      if (animate) defs.push(animate);
      if (hovered && whileHover) defs.push(whileHover);
      if (pressed && whileTap) defs.push(whileTap);
      return mergeDefinitions(...defs);
    }, [
      initial,
      animate,
      whileInView,
      whileHover,
      whileTap,
      hasEntered,
      inView,
      hovered,
      pressed,
    ]);

    const combinedDefinition = useMemo(
      () => mergeDefinitions(baseDefinition, dynamicDefinition),
      [baseDefinition, dynamicDefinition]
    );

    const cssFromDefinition = useMemo(
      () => definitionToCss(combinedDefinition),
      [combinedDefinition]
    );

    const shouldAnimate = Boolean(transition || initial || whileInView);
    const transitionValue = useMemo(
      () => (shouldAnimate ? buildTransition(transition) : undefined),
      [transition, shouldAnimate]
    );

    const finalStyle = useMemo(() => {
      const style = { ...staticStyle, ...dynamicStyle };
      if (cssFromDefinition.opacity !== undefined) {
        style.opacity = cssFromDefinition.opacity;
      }
      const transforms = [];
      if (cssFromDefinition.transform)
        transforms.push(cssFromDefinition.transform);
      if (staticTransform) transforms.push(staticTransform);
      if (transforms.length > 0) {
        style.transform = transforms.join(' ');
      }
      if (shouldAnimate && transitionValue) {
        if (style.transition == null) {
          style.transition = transitionValue;
        }
        if (style.willChange == null) {
          style.willChange = 'transform, opacity';
        }
      }
      return style;
    }, [
      staticStyle,
      dynamicStyle,
      cssFromDefinition,
      staticTransform,
      shouldAnimate,
      transitionValue,
    ]);

    const handleMouseEnter = useCallback(
      (event) => {
        setHovered(true);
        if (userMouseEnter) userMouseEnter(event);
      },
      [userMouseEnter]
    );

    const handleMouseLeave = useCallback(
      (event) => {
        setHovered(false);
        setPressed(false);
        if (userMouseLeave) userMouseLeave(event);
      },
      [userMouseLeave]
    );

    const handlePointerDown = useCallback(
      (event) => {
        setPressed(true);
        if (userPointerDown) userPointerDown(event);
      },
      [userPointerDown]
    );

    const handlePointerUp = useCallback(
      (event) => {
        setPressed(false);
        if (userPointerUp) userPointerUp(event);
      },
      [userPointerUp]
    );

    const handlePointerCancel = useCallback(
      (event) => {
        setPressed(false);
        if (userPointerCancel) userPointerCancel(event);
      },
      [userPointerCancel]
    );

    const handlers = {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onPointerDown: handlePointerDown,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerCancel,
    };

    return React.createElement(tag, {
      ...domProps,
      ...handlers,
      ref: setRef,
      style: finalStyle,
    });
  });

  MotionComponent.displayName = `motion.${String(tag)}`;
  return MotionComponent;
}

const motionCache = new Map();

const motion = new Proxy(
  {},
  {
    get(_, tag) {
      if (!motionCache.has(tag)) {
        motionCache.set(tag, createMotionComponent(tag));
      }
      return motionCache.get(tag);
    },
  }
);

function useMotionValue(initial) {
  return useMemo(() => new MotionValue(initial), [initial]);
}

function useTransform(value, inputRange, outputRange) {
  const motionValue = useMemo(
    () => new MotionValue(outputRange[0]),
    [outputRange]
  );

  useEffect(() => {
    if (!(value instanceof MotionValue)) return undefined;
    const update = (latest) => {
      try {
        motionValue.set(interpolate(latest, inputRange, outputRange));
      } catch (error) {
        // ignore malformed ranges
      }
    };
    update(value.get());
    const unsubscribe = value.onChange(update);
    return () => {
      unsubscribe?.();
    };
  }, [value, inputRange, outputRange, motionValue]);

  return motionValue;
}

function useScroll() {
  const scrollY = useMemo(() => new MotionValue(0), []);
  const scrollYProgress = useMemo(() => new MotionValue(0), []);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const update = () => {
      const max = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      const current = window.scrollY || window.pageYOffset || 0;
      scrollY.set(current);
      scrollYProgress.set(clamp(current / max, 0, 1));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [scrollY, scrollYProgress]);

  return { scrollY, scrollYProgress };
}

export { motion, MotionValue, useMotionValue, useTransform, useScroll };
export default motion;
