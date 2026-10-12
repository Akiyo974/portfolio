import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

/**
 * Expérience : un mot échantillonné en points. Chaque point est une particule
 * rappelée à sa place par un ressort ; le curseur la repousse, un clic fait tout exploser.
 */
export const ParticleType: React.FC<{ className?: string; initial?: string }> = ({ className = '', initial = 'LAB' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [word, setWord] = useState(initial);
  const wordRef = useRef(word);
  const rebuildRef = useRef<() => void>(() => {});
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    wordRef.current = word;
    rebuildRef.current();
  }, [word]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, gap = 6;
    // x, y, vx, vy, cible x, cible y
    let P = new Float32Array(0);
    let n = 0;
    const mouse = { x: -1e4, y: -1e4 };

    const build = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      gap = w < 500 ? 4 : 6;

      // Le mot est rendu hors écran puis échantillonné sur une grille
      const off = document.createElement('canvas');
      off.width = Math.round(w);
      off.height = Math.round(h);
      const o = off.getContext('2d');
      if (!o) return;
      const text = (wordRef.current || ' ').toUpperCase();
      let size = h * 0.62;
      o.font = `800 ${size}px "Big Shoulders Display", "Geist", sans-serif`;
      const tw = o.measureText(text).width;
      if (tw > w * 0.86) size *= (w * 0.86) / tw;
      o.font = `800 ${size}px "Big Shoulders Display", "Geist", sans-serif`;
      o.textAlign = 'center';
      o.textBaseline = 'middle';
      o.fillStyle = '#fff';
      o.fillText(text, w / 2, h / 2 + size * 0.04);
      const img = o.getImageData(0, 0, off.width, off.height).data;

      const targets: number[] = [];
      for (let y = 0; y < off.height; y += gap) {
        for (let x = 0; x < off.width; x += gap) {
          if (img[(y * off.width + x) * 4] > 128) targets.push(x, y);
        }
      }
      const old = P;
      const oldN = n;
      n = targets.length / 2;
      P = new Float32Array(n * 6);
      for (let i = 0; i < n; i++) {
        const j = i * 6;
        // Les particules existantes migrent vers les nouvelles cibles, les nouvelles naissent au hasard
        if (i < oldN) {
          P[j] = old[i * 6];
          P[j + 1] = old[i * 6 + 1];
        } else {
          P[j] = Math.random() * w;
          P[j + 1] = Math.random() * h;
        }
        P[j + 4] = targets[i * 2];
        P[j + 5] = targets[i * 2 + 1];
        if (prefersReducedMotion) {
          P[j] = P[j + 4];
          P[j + 1] = P[j + 5];
        }
      }
    };

    const draw = () => {
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#f2f2ee';
      const s = gap * 0.62;
      for (let i = 0; i < n; i++) {
        const j = i * 6;
        ctx.fillRect(P[j] - s / 2, P[j + 1] - s / 2, s, s);
      }
    };

    const update = () => {
      const R = Math.max(70, w * 0.12);
      for (let i = 0; i < n; i++) {
        const j = i * 6;
        const dx = P[j] - mouse.x;
        const dy = P[j + 1] - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < R * R) {
          const d = Math.sqrt(d2) || 1;
          const f = (1 - d / R) * 3.2;
          P[j + 2] += (dx / d) * f;
          P[j + 3] += (dy / d) * f;
        }
        P[j + 2] += (P[j + 4] - P[j]) * 0.045;
        P[j + 3] += (P[j + 5] - P[j + 1]) * 0.045;
        P[j + 2] *= 0.86;
        P[j + 3] *= 0.86;
        P[j] += P[j + 2];
        P[j + 1] += P[j + 3];
      }
    };

    const explode = () => {
      for (let i = 0; i < n; i++) {
        const j = i * 6;
        const a = Math.random() * Math.PI * 2;
        const v = 8 + Math.random() * 26;
        P[j + 2] += Math.cos(a) * v;
        P[j + 3] += Math.sin(a) * v;
      }
    };

    const rebuild = () => {
      build();
      draw();
    };
    rebuildRef.current = rebuild;
    void document.fonts?.load('800 100px "Big Shoulders Display"').then(rebuild);
    rebuild();

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = mouse.y = -1e4;
    };
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerleave', onLeave);
    canvas.addEventListener('click', explode);

    const ro = new ResizeObserver(rebuild);
    ro.observe(canvas);
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    let raf = 0;
    if (!prefersReducedMotion) {
      const loop = () => {
        raf = requestAnimationFrame(loop);
        if (!visible) return;
        update();
        draw();
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('click', explode);
      rebuildRef.current = () => {};
    };
  }, [prefersReducedMotion]);

  return (
    <div className={`relative h-full w-full ${className}`}>
      <canvas ref={canvasRef} className="block h-full w-full" data-cursor="Boom" aria-label={word} role="img" />
      <label className="absolute bottom-3 left-3 flex items-center gap-2 border border-line bg-ink/80 px-2.5 py-1 backdrop-blur-sm">
        <span className="label">Word</span>
        <input
          value={word}
          onChange={(e) => setWord(e.target.value.replace(/[^\p{L}\p{N} .!?&-]/gu, '').slice(0, 10))}
          className="w-28 bg-transparent font-mono text-[12px] uppercase tracking-[0.08em] text-paper outline-none"
          aria-label="Word"
          spellCheck={false}
        />
      </label>
    </div>
  );
};

export default ParticleType;
