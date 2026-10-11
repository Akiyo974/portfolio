import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const RAMP = ' .·:-=+*#%@';

/**
 * Champ ASCII animé : une sphère en rotation rendue en caractères.
 * Rendu canvas, pausé hors écran et figé si "réduire les animations".
 */
export const AsciiField: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let visible = true;
    let cols = 0;
    let rows = 0;
    const cell = 11;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.floor(width / (cell * 0.62));
      rows = Math.floor(height / cell);
      ctx.font = `${cell}px "Geist Mono", ui-monospace, monospace`;
      ctx.textBaseline = 'top';
    };

    const draw = (t: number) => {
      const { width, height } = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, width, height);
      const cw = width / cols;
      const R = Math.min(cols * cw, rows * cell) * 0.42;
      const cx = width / 2;
      const cy = height / 2;
      const rot = t * 0.00025;
      const lx = Math.cos(rot * 0.7) * 0.6;
      const ly = -0.5;
      const lz = 0.62;

      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const x = (i * cw + cw / 2 - cx) / R;
          const y = (j * cell + cell / 2 - cy) / R;
          const d2 = x * x + y * y;
          let b = 0;
          if (d2 < 1) {
            const z = Math.sqrt(1 - d2);
            // coordonnées sphériques tournantes -> bandes de latitude/longitude
            const lon = Math.atan2(x, z) + rot * 4;
            const lat = Math.asin(y);
            const grid = Math.abs(Math.sin(lon * 6)) < 0.12 || Math.abs(Math.sin(lat * 8)) < 0.1 ? 0.35 : 0;
            const lam = Math.max(0, x * lx + y * ly + z * lz);
            b = Math.min(1, lam * 0.85 + grid);
          } else if (d2 < 1.6) {
            // anneau
            const ring = Math.abs(Math.sqrt(d2) - 1.22 - Math.sin(Math.atan2(y, x) * 3 + rot * 6) * 0.02);
            if (ring < 0.025) b = 0.45;
          }
          if (b > 0.04) {
            const c = RAMP[Math.min(RAMP.length - 1, Math.floor(b * RAMP.length))];
            ctx.fillStyle = `rgba(242,242,238,${0.25 + b * 0.75})`;
            ctx.fillText(c, i * cw, j * cell);
          }
        }
      }
    };

    const loop = (t: number) => {
      if (visible) draw(t);
      raf = requestAnimationFrame(loop);
    };

    resize();
    if (prefersReducedMotion) {
      draw(0);
    } else {
      raf = requestAnimationFrame(loop);
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(canvas);
    const onResize = () => {
      resize();
      if (prefersReducedMotion) draw(0);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, [prefersReducedMotion]);

  return <canvas ref={canvasRef} className={`block h-full w-full ${className}`} aria-hidden="true" />;
};
