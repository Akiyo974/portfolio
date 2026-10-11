import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const EASE_OUT = 'expo.out';

/**
 * Instance Lenis unique, synchronisée avec le ticker GSAP / ScrollTrigger.
 */
let lenis: Lenis | null = null;
let users = 0;
const tick = (time: number) => lenis?.raf(time * 1000);

export const acquireLenis = (): Lenis | null => {
  users++;
  if (lenis || typeof window === 'undefined') return lenis;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;

  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.6,
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return lenis;
};

export const releaseLenis = () => {
  users = Math.max(0, users - 1);
  if (users === 0 && lenis) {
    gsap.ticker.remove(tick);
    lenis.destroy();
    lenis = null;
  }
};

export const getLenis = () => lenis;

/** Défile vers un élément (Lenis si dispo, sinon natif). */
export const scrollToTarget = (target: string | HTMLElement, offset = 0) => {
  const el = typeof target === 'string' ? document.getElementById(target) : target;
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset, duration: 1.4 });
  else el.scrollIntoView({ behavior: 'smooth' });
};

/* ---------- Signal "intro terminée" (préchargeur) ---------- */
let introDone = false;
const introListeners = new Set<() => void>();

export const markIntroDone = () => {
  introDone = true;
  introListeners.forEach((fn) => fn());
  introListeners.clear();
};

export const onIntroDone = (fn: () => void) => {
  if (introDone) {
    fn();
    return () => {};
  }
  introListeners.add(fn);
  return () => introListeners.delete(fn);
};

export const isIntroDone = () => introDone;

/** Vitesse de défilement courante (px / frame), 0 sans Lenis. */
export const getScrollVelocity = () => (lenis as unknown as { velocity?: number } | null)?.velocity ?? 0;
