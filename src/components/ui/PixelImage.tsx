import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const STEPS = [64, 32, 16, 8, 4, 2, 1];

/**
 * Image qui se "résout" de gros pixels vers la pleine définition à l'entrée à l'écran.
 * Au survol, l'original en couleur se dévoile en cercle depuis le curseur.
 */
export const PixelImage: React.FC<{
  src: string;
  original?: string;
  alt: string;
  className?: string;
  position?: 'top' | 'center';
}> = ({ src, original, alt, className = '', position = 'center' }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const revealRef = useRef<HTMLImageElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.decoding = 'async';
    img.src = src;
    const small = document.createElement('canvas');
    const sctx = small.getContext('2d');
    let step = prefersReducedMotion ? STEPS.length - 1 : 0;
    let timer = 0;
    let loaded = false;
    let played = false;

    const draw = () => {
      if (!loaded || !sctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(wrap.clientWidth * dpr));
      const h = Math.max(1, Math.round(wrap.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      // object-fit: cover
      const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const sw = w / scale;
      const sh = h / scale;
      const sx = (img.naturalWidth - sw) / 2;
      const sy = position === 'top' ? 0 : (img.naturalHeight - sh) / 2;
      const ps = STEPS[step] * dpr;

      if (ps <= dpr) {
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
        return;
      }
      const lw = Math.max(1, Math.ceil(w / ps));
      const lh = Math.max(1, Math.ceil(h / ps));
      small.width = lw;
      small.height = lh;
      sctx.imageSmoothingEnabled = true;
      sctx.drawImage(img, sx, sy, sw, sh, 0, 0, lw, lh);
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(small, 0, 0, lw, lh, 0, 0, lw * ps, lh * ps);
    };

    const play = () => {
      if (played) return;
      played = true;
      const next = () => {
        draw();
        if (step < STEPS.length - 1) {
          step++;
          timer = window.setTimeout(next, 85);
        }
      };
      next();
    };

    img.onload = () => {
      loaded = true;
      draw();
      if (inView) play();
    };

    let inView = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView && loaded) play();
      },
      { threshold: 0.25 }
    );
    io.observe(wrap);
    const ro = new ResizeObserver(draw);
    ro.observe(wrap);

    return () => {
      clearTimeout(timer);
      io.disconnect();
      ro.disconnect();
    };
  }, [src, position, prefersReducedMotion]);

  const setOrigin = (e: React.PointerEvent) => {
    const r = wrapRef.current?.getBoundingClientRect();
    if (!r || !revealRef.current) return;
    revealRef.current.style.setProperty('--rx', `${e.clientX - r.left}px`);
    revealRef.current.style.setProperty('--ry', `${e.clientY - r.top}px`);
  };

  return (
    <div
      ref={wrapRef}
      role="img"
      aria-label={alt}
      onPointerEnter={setOrigin}
      onPointerMove={setOrigin}
      className={`group/pixel relative overflow-hidden bg-ink ${className}`}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
      {original && (
        <img
          ref={revealRef}
          src={original}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className={`pixel-reveal absolute inset-0 h-full w-full object-cover ${position === 'top' ? 'object-top' : ''}`}
        />
      )}
      <span className="pointer-events-none absolute inset-0 border border-line" aria-hidden="true" />
    </div>
  );
};
