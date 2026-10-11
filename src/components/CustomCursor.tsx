import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from '../hooks/useReducedMotion';

const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, label';

/**
 * Curseur : point + réticule, libellé contextuel via `data-cursor="Texte"`,
 * effet magnétique via `data-magnetic`.
 */
export const CustomCursor = () => {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [label, setLabel] = useState('');
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(window.matchMedia('(hover: hover) and (pointer: fine)').matches && !prefersReducedMotion);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!enabled) return;
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    document.documentElement.classList.add('has-cursor');
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' });
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.08 });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.08 });
    let magnet: HTMLElement | null = null;

    const onMove = (e: PointerEvent) => {
      ringX(e.clientX);
      ringY(e.clientY);
      dotX(e.clientX);
      dotY(e.clientY);
      if (magnet) {
        const r = magnet.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        gsap.to(magnet, { x: dx * 0.28, y: dy * 0.38, duration: 0.5, ease: 'power3.out' });
      }
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      const labelled = target.closest<HTMLElement>('[data-cursor]');
      const interactive = target.closest(INTERACTIVE);
      setLabel(labelled?.dataset.cursor ?? '');
      ring.dataset.state = labelled ? 'label' : interactive ? 'hover' : '';
      const m = target.closest<HTMLElement>('[data-magnetic]');
      if (m !== magnet) {
        if (magnet) gsap.to(magnet, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
        magnet = m;
      }
    };

    const onDown = () => gsap.to(ring, { scale: 0.8, duration: 0.15 });
    const onUp = () => gsap.to(ring, { scale: 1, duration: 0.3 });
    const onLeaveWindow = () => gsap.to([ring, dot], { opacity: 0, duration: 0.2 });
    const onEnterWindow = () => gsap.to([ring, dot], { opacity: 1, duration: 0.2 });

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    document.documentElement.addEventListener('pointerleave', onLeaveWindow);
    document.documentElement.addEventListener('pointerenter', onEnterWindow);

    return () => {
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.documentElement.removeEventListener('pointerleave', onLeaveWindow);
      document.documentElement.removeEventListener('pointerenter', onEnterWindow);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={ringRef} className="cursor-ring pointer-events-none fixed left-0 top-0 z-[90]" aria-hidden="true">
        <div className="cursor-ring-inner">
          <span className="cursor-label">{label}</span>
        </div>
      </div>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[91] -ml-[3px] -mt-[3px] h-1.5 w-1.5 bg-paper mix-blend-difference"
        aria-hidden="true"
      />
    </>
  );
};
