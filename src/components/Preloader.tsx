import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { getLenis, markIntroDone } from '../lib/motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

const STORAGE_KEY = 'cd-intro-seen';
const LOG = ['init renderer', 'load typefaces', 'compile dither shader', 'sync scroll engine', 'ready'];

const seen = () => {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
};

/**
 * Préchargeur : compteur 000 → 100, journal de démarrage, puis rideau.
 * Joué une fois par session.
 */
export const Preloader: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const [show] = useState(() => !seen() && !prefersReducedMotion);
  const [done, setDone] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!show) {
      markIntroDone();
      return;
    }
    const root = rootRef.current;
    if (!root) return;

    document.documentElement.style.overflow = 'hidden';
    getLenis()?.stop();

    // reprend là où l'écran statique d'index.html s'est arrêté
    const counter = { v: Math.round((window as unknown as { __plCount?: number }).__plCount ?? 0) };
    if (countRef.current) countRef.current.textContent = String(counter.v).padStart(3, '0');
    if (barRef.current) barRef.current.style.transform = `scaleX(${counter.v / 100})`;
    const fontsReady = (document.fonts?.ready ?? Promise.resolve()).then(() => undefined);
    const minTime = new Promise<void>((r) => setTimeout(r, 900));

    const tl = gsap.timeline();
    tl.to(counter, {
      v: 86,
      duration: 0.9,
      ease: 'power2.inOut',
      onUpdate: () => {
        const v = Math.round(counter.v);
        if (countRef.current) countRef.current.textContent = String(v).padStart(3, '0');
        if (barRef.current) barRef.current.style.transform = `scaleX(${v / 100})`;
        setStep(Math.min(LOG.length - 2, Math.floor((v / 86) * (LOG.length - 1))));
      },
    });

    let cancelled = false;
    Promise.all([fontsReady, minTime]).then(() => {
      if (cancelled) return;
      gsap
        .timeline({
          onComplete: () => {
            document.documentElement.style.overflow = '';
            getLenis()?.start();
            try {
              sessionStorage.setItem(STORAGE_KEY, '1');
            } catch {
              /* stockage indisponible */
            }
            setDone(true);
          },
        })
        .to(counter, {
          v: 100,
          duration: 0.5,
          ease: 'power3.out',
          onUpdate: () => {
            const v = Math.round(counter.v);
            if (countRef.current) countRef.current.textContent = String(v).padStart(3, '0');
            if (barRef.current) barRef.current.style.transform = `scaleX(${v / 100})`;
          },
          onComplete: () => setStep(LOG.length - 1),
        })
        .to(root.querySelectorAll('.pl-fade'), { yPercent: -120, opacity: 0, duration: 0.6, ease: 'expo.in', stagger: 0.04 }, '+=0.15')
        .add(() => markIntroDone(), '-=0.1')
        .to(root, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.1, ease: 'expo.inOut' }, '-=0.2');
    });

    return () => {
      cancelled = true;
      tl.kill();
      document.documentElement.style.overflow = '';
    };
  }, [show]);

  if (!show || done) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-ink px-4 py-5 text-paper sm:px-6 md:px-10 md:py-8"
      style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      role="status"
      aria-label="Chargement"
    >
      <div className="pl-fade flex items-start justify-between label">
        <span>Christen Dijoux — Portfolio</span>
        <span>©{new Date().getFullYear()}</span>
      </div>

      <div className="pl-fade mx-auto w-full max-w-md font-mono text-[12px] leading-6 text-paper/60">
        {LOG.slice(0, step + 1).map((line, i) => (
          <div key={line} className="flex justify-between">
            <span>
              <span className="text-paper/40">{'>'}</span> {line}
            </span>
            <span className={i === step && i < LOG.length - 1 ? 'animate-blink' : 'text-paper'}>
              {i === step && i < LOG.length - 1 ? '_' : 'ok'}
            </span>
          </div>
        ))}
      </div>

      <div>
        <div className="pl-fade flex items-end justify-between">
          <span ref={countRef} className="display text-[clamp(7rem,26vw,24rem)] leading-[0.78]">
            000
          </span>
          <span className="label mb-4 hidden md:block">Saguenay, QC — 48.43°N</span>
        </div>
        <div className="pl-fade mt-4 h-px w-full bg-line">
          <div ref={barRef} className="h-px w-full origin-left scale-x-0 bg-paper" />
        </div>
      </div>
    </div>
  );
};
