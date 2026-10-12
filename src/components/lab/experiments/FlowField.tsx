import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../../hooks/useReducedMotion';

/**
 * Expérience : des milliers de particules suivent un champ de directions qui ondule.
 * Elles laissent une trace qui s'efface ; le curseur crée un tourbillon.
 */
export const FlowField: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const lowPower = window.matchMedia('(max-width: 767px), (hover: none)').matches;
    const N = lowPower ? 900 : 2600;
    let w = 0, h = 0;
    const px = new Float32Array(N);
    const py = new Float32Array(N);
    const life = new Float32Array(N);
    const mouse = { x: -1e4, y: -1e4, on: 0 };

    const spawn = (i: number) => {
      px[i] = Math.random() * w;
      py[i] = Math.random() * h;
      life[i] = 60 + Math.random() * 240;
    };
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < N; i++) spawn(i);
    };

    // Champ de directions : somme d'ondes qui dérivent dans le temps (pas de bibliothèque de bruit)
    const angle = (x: number, y: number, t: number) => {
      const s = 0.0042;
      return (
        Math.sin(x * s + t * 0.31) * 1.7 +
        Math.cos(y * s * 1.3 - t * 0.23) * 1.5 +
        Math.sin((x + y) * s * 0.7 + t * 0.17) * 1.1
      );
    };

    const frame = (t: number) => {
      // Effacement partiel : les traces s'estompent
      ctx.fillStyle = 'rgba(5,5,5,0.07)';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(242,242,238,0.85)';
      const R = Math.max(90, w * 0.16);
      for (let i = 0; i < N; i++) {
        let a = angle(px[i], py[i], t);
        let speed = 1.25;
        if (mouse.on) {
          const dx = px[i] - mouse.x;
          const dy = py[i] - mouse.y;
          const d = Math.hypot(dx, dy);
          if (d < R) {
            // Tourbillon : direction tangente au cercle autour du curseur
            const k = 1 - d / R;
            const tang = Math.atan2(dy, dx) + Math.PI / 2;
            a = a * (1 - k) + tang * k;
            speed += k * 3;
          }
        }
        px[i] += Math.cos(a) * speed;
        py[i] += Math.sin(a) * speed;
        if (--life[i] < 0 || px[i] < 0 || px[i] > w || py[i] < 0 || py[i] > h) spawn(i);
        else ctx.fillRect(px[i], py[i], 1.2, 1.2);
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.on = 1;
    };
    const onLeave = () => (mouse.on = 0);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerleave', onLeave);

    let raf = 0;
    if (prefersReducedMotion) {
      // Image fixe : on laisse les traces se former hors écran
      for (let k = 0; k < 160; k++) frame(k / 60);
    } else {
      const start = performance.now();
      const loop = (now: number) => {
        raf = requestAnimationFrame(loop);
        if (visible) frame((now - start) / 1000);
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
    };
  }, [prefersReducedMotion]);

  return <canvas ref={canvasRef} className={`block h-full w-full ${className}`} aria-hidden="true" />;
};

export default FlowField;
