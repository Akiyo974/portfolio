import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { onIntroDone } from '../../lib/motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

type Tag = 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';

/**
 * Découpe un texte en mots > lettres masqués, puis les révèle
 * (à la fin du préchargeur ou à l'entrée dans l'écran).
 */
export const SplitText: React.FC<{
  text: string;
  as?: Tag;
  className?: string;
  charClassName?: string;
  trigger?: 'intro' | 'scroll';
  delay?: number;
  stagger?: number;
}> = ({ text, as = 'span', className = '', charClassName = '', trigger = 'scroll', delay = 0, stagger = 0.022 }) => {
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const Tag = as as React.ElementType;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const chars = el.querySelectorAll<HTMLElement>('.char');
    if (prefersReducedMotion) {
      gsap.set(chars, { yPercent: 0 });
      return;
    }
    gsap.set(chars, { yPercent: 115 });
    const play = () =>
      gsap.to(chars, { yPercent: 0, duration: 1.15, ease: 'expo.out', stagger, delay });

    if (trigger === 'intro') {
      return onIntroDone(play);
    }
    const st = ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: play });
    return () => st?.kill();
  }, [text, trigger, delay, stagger, prefersReducedMotion]);

  const words = text.split(' ');
  return (
    <Tag ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      {words.map((word, wi) => (
        <span key={wi} aria-hidden="true" className="-mt-[0.14em] inline-block overflow-hidden whitespace-nowrap pb-[0.06em] pt-[0.14em] align-top">
          {Array.from(word).map((ch, ci) => (
            <span key={ci} className={`char inline-block will-change-transform ${charClassName}`}>
              {ch}
            </span>
          ))}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </Tag>
  );
};

/**
 * Graisse variable selon la proximité du curseur (police variable requise).
 */
export const useProximityWeight = (
  ref: React.RefObject<HTMLElement>,
  { min = 200, max = 800, radius = 260 }: { min?: number; max?: number; radius?: number } = {}
) => {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion || window.matchMedia('(hover: none)').matches) return;

    const chars = Array.from(el.querySelectorAll<HTMLElement>('.char'));
    let rects: { x: number; y: number }[] = [];
    const weights = chars.map(() => min);
    let mx = -9999;
    let my = -9999;
    let raf = 0;
    let active = false;

    const measure = () => {
      rects = chars.map((c) => {
        const r = c.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      });
    };

    const loop = () => {
      let moving = false;
      chars.forEach((c, i) => {
        const p = rects[i];
        if (!p) return;
        const d = Math.hypot(mx - p.x, my - p.y);
        const k = Math.max(0, 1 - d / radius);
        const target = min + (max - min) * k * k * (3 - 2 * k);
        weights[i] += (target - weights[i]) * 0.18;
        if (Math.abs(target - weights[i]) > 0.5) moving = true;
        c.style.fontVariationSettings = `"wght" ${weights[i].toFixed(0)}`;
      });
      raf = moving || active ? requestAnimationFrame(loop) : 0;
    };

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!raf) {
        measure();
        raf = requestAnimationFrame(loop);
      }
    };
    const onEnter = () => (active = true);
    const onLeave = () => {
      active = false;
      mx = my = -9999;
    };

    const zone = el.parentElement ?? el;
    window.addEventListener('pointermove', onMove, { passive: true });
    zone.addEventListener('pointerenter', onEnter);
    zone.addEventListener('pointerleave', onLeave);
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      zone.removeEventListener('pointerenter', onEnter);
      zone.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, [ref, min, max, radius, prefersReducedMotion]);
};

/**
 * Paragraphe révélé mot à mot au défilement (scrub).
 */
export const ScrollWords: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion) return;
    const words = el.querySelectorAll('.word');
    const tween = gsap.fromTo(
      words,
      { opacity: 0.38 }, // ≥ 3:1 sur fond encre (texte ≥ 24 px) : effet conservé, contraste WCAG respecté
      {
        opacity: 1,
        stagger: 0.1,
        ease: 'none',
        // Texte entièrement révélé tant qu'il est encore bien visible (bas du bloc à 75 % de l'écran)
        scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 75%', scrub: true },
      }
    );
    return () => {
      tween?.scrollTrigger?.kill();
      tween?.kill();
    };
  }, [text, prefersReducedMotion]);

  return (
    <p ref={ref} className={className}>
      {text.split(' ').map((w, i) => (
        <span key={i} className="word">
          {w}{' '}
        </span>
      ))}
    </p>
  );
};
