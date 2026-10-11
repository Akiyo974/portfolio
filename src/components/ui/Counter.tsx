import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Nombre qui s'incrémente quand il entre à l'écran.
 */
export const Counter: React.FC<{ value: number; pad?: number; className?: string; duration?: number }> = ({
  value,
  pad = 2,
  className = '',
  duration = 1400,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const format = (n: number) => String(Math.round(n)).padStart(pad, '0');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion) {
      el.textContent = format(value);
      return;
    }
    el.textContent = format(0);
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - p, 4);
          el.textContent = format(value * eased);
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, prefersReducedMotion, duration]);

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
};
