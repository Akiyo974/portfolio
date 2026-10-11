import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { getScrollVelocity } from '../lib/motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * Bande pleine largeur : mots-clés géants qui défilent,
 * accélérés et inclinés par la vitesse de défilement.
 */
export const ManifestoBand: React.FC = () => {
  const { t } = useTranslation();
  const words = t('ui.manifesto', { returnObjects: true }) as string[];
  const row = Array.isArray(words) ? words : [];
  const trackRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const track = trackRef.current;
    if (!track || prefersReducedMotion || !gsap.ticker) return;

    let x = 0;
    let skew = 0;
    let direction = -1;
    const update = () => {
      const half = track.scrollWidth / 2;
      const v = getScrollVelocity();
      if (v !== 0) direction = v > 0 ? -1 : 1;
      x += direction * (0.6 + Math.min(Math.abs(v) * 0.5, 18));
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      skew += (Math.max(-12, Math.min(12, v * 0.6)) - skew) * 0.12;
      track.style.transform = `translate3d(${x}px,0,0) skewX(${skew}deg)`;
    };
    gsap.ticker.add(update);
    return () => gsap.ticker.remove(update);
  }, [prefersReducedMotion]);

  return (
    <section aria-label={row.join(', ')} className="relative overflow-hidden border-y border-line">
      <img
        src="/assets/art/noise-band.png"
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover opacity-35"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/40 to-ink" aria-hidden="true" />

      <div className="relative py-10 md:py-16">
        <div ref={trackRef} className="flex w-max will-change-transform" aria-hidden="true">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center">
              {[...row, ...row].map((w, i) => (
                <span key={`${k}-${i}`} className="display flex items-center text-[clamp(4rem,13vw,13rem)]">
                  <span className={i % 2 ? 'text-outline' : ''}>{w}</span>
                  <span className="mx-6 font-mono text-[0.18em] text-paper/50 md:mx-10">✳</span>
                </span>
              ))}
            </div>
          ))}
        </div>
        <p className="label mx-auto mt-6 max-w-md px-4 text-center text-paper/70">{t('ui.manifestoSub')}</p>
      </div>
    </section>
  );
};
