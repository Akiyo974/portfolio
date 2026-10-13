import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LAND_H, LAND_MASK, LAND_W } from '../data/landmask';

gsap.registerPlugin(ScrollTrigger);

const RAD = Math.PI / 180;
const FROM = { lat: -21.11, lon: 55.53 }; // Saint-Denis, La Réunion
const TO = { lat: 48.43, lon: -71.07 }; // Saguenay, QC
type V3 = [number, number, number];

const toVec = (lat: number, lon: number): V3 => [Math.cos(lat * RAD) * Math.cos(lon * RAD), Math.cos(lat * RAD) * Math.sin(lon * RAD), Math.sin(lat * RAD)];
const toLatLon = ([x, y, z]: V3) => ({ lat: Math.asin(Math.max(-1, Math.min(1, z))) / RAD, lon: Math.atan2(y, x) / RAD });
const A = toVec(FROM.lat, FROM.lon);
const B = toVec(TO.lat, TO.lon);
const OMEGA = Math.acos(A[0] * B[0] + A[1] * B[1] + A[2] * B[2]);
export const JOURNEY_KM = Math.round(6371 * OMEGA);

/** Point sur le grand cercle Réunion → Saguenay (t ∈ [0, 1]). */
const slerp = (t: number): V3 => {
  const s = Math.sin(OMEGA), a = Math.sin((1 - t) * OMEGA) / s, b = Math.sin(t * OMEGA) / s;
  return [A[0] * a + B[0] * b, A[1] * a + B[1] * b, A[2] * a + B[2] * b];
};

/** Points de la sphère (terre / mer) : grille ~équi-aire décodée du masque 1°. */
const buildDots = (step: number) => {
  const bits = Uint8Array.from(atob(LAND_MASK), (c) => c.charCodeAt(0));
  const isLand = (lat: number, lon: number) => {
    const r = Math.min(LAND_H - 1, Math.floor(90 - lat)), c = Math.min(LAND_W - 1, Math.floor(((lon + 180) % 360 + 360) % 360));
    const i = r * LAND_W + c;
    return (bits[i >> 3] >> (i & 7)) & 1;
  };
  const out: number[] = []; // [cosφ, sinφ, λ(rad), land] à plat
  for (let lat = -88; lat <= 88; lat += step) {
    const n = Math.max(1, Math.round((360 * Math.cos(lat * RAD)) / step));
    for (let k = 0; k < n; k++) {
      const lon = -180 + (k + 0.5) * (360 / n);
      out.push(Math.cos(lat * RAD), Math.sin(lat * RAD), lon * RAD, isLand(lat, lon));
    }
  }
  return new Float32Array(out);
};

export const JourneySection: React.FC = () => {
  const { t } = useTranslation();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const kmRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const target = useRef(0);

  // Progression pilotée par le défilement (épinglé sur grand écran)
  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || typeof gsap.matchMedia !== 'function') return;
    const mm = gsap.matchMedia();
    const update = (self: ScrollTrigger) => { target.current = self.progress; };
    mm.add('(prefers-reduced-motion: reduce)', () => { target.current = 1; });
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const st = ScrollTrigger.create({ trigger: wrap, start: 'top top', end: '+=110%', pin: true, scrub: true, onUpdate: update });
      return () => st.kill();
    });
    mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
      const st = ScrollTrigger.create({ trigger: canvasRef.current ?? wrap, start: 'top 85%', end: 'bottom 35%', onUpdate: update });
      return () => st.kill();
    });
    return () => mm.revert();
  }, []);

  // Rendu canvas : globe tramé + arc de trajet
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const lowPower = window.matchMedia('(max-width: 767px), (hover: none)').matches;
    const dots = buildDots(lowPower ? 2.2 : 1.6);
    const mono = getComputedStyle(document.documentElement).getPropertyValue('--font-mono') || '"Geist Mono", monospace';
    let size = 0, dpr = 1, raf = 0, visible = false, shown = -1, last = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = canvas.clientWidth;
      canvas.width = canvas.height = Math.round(size * dpr);
      shown = -1;
    };

    const draw = (p: number, time: number) => {
      const W = size, R = W * 0.42, cx = W / 2, cy = W / 2;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, W);

      // Centre de vue : suit la tête de l'arc, légèrement en retrait vers le haut
      const head = slerp(p);
      const view = toLatLon(slerp(Math.max(0, p - 0.08)));
      const φ0 = (view.lat + 8) * RAD, λ0 = view.lon * RAD;
      const s0 = Math.sin(φ0), c0 = Math.cos(φ0);
      const L: V3 = [-0.5, 0.55, 0.67]; // lumière haut-gauche

      const project = (cosφ: number, sinφ: number, λ: number, h = 1) => {
        const dλ = λ - λ0, cd = Math.cos(dλ);
        const z = s0 * sinφ + c0 * cosφ * cd;
        const x = cosφ * Math.sin(dλ), y = c0 * sinφ - s0 * cosφ * cd;
        return { x: cx + x * R * h, y: cy - y * R * h, z, nx: x, ny: y };
      };

      // Halo
      const g = ctx.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.25);
      g.addColorStop(0, 'rgba(242,242,238,0.07)');
      g.addColorStop(1, 'rgba(242,242,238,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, W);

      const cell = Math.max(1.4, R / 95);
      ctx.fillStyle = '#f2f2ee';
      for (let i = 0; i < dots.length; i += 4) {
        const q = project(dots[i], dots[i + 1], dots[i + 2]);
        if (q.z <= 0.02) continue;
        const lam = Math.max(0, q.nx * L[0] + q.ny * L[1] + q.z * L[2]);
        const b = dots[i + 3] ? 0.35 + 0.65 * lam : 0.12 + 0.12 * lam;
        const s = cell * (dots[i + 3] ? 0.55 + 0.55 * b : 0.5);
        ctx.globalAlpha = dots[i + 3] ? 0.35 + 0.65 * b : b;
        ctx.fillRect(q.x - s / 2, q.y - s / 2, s, s);
      }
      ctx.globalAlpha = 1;

      // Arc (pointillés surélevés) jusqu'à la tête
      const steps = 120, upto = Math.floor(steps * p);
      ctx.strokeStyle = '#f2f2ee';
      ctx.lineWidth = 1.4;
      ctx.setLineDash([3, 5]);
      ctx.lineDashOffset = -time * 0.02;
      ctx.beginPath();
      let pen = false;
      for (let k = 0; k <= upto; k++) {
        const v = slerp(k / steps), ll = toLatLon(v);
        const q = project(Math.cos(ll.lat * RAD), Math.sin(ll.lat * RAD), ll.lon * RAD, 1 + 0.16 * Math.sin((Math.PI * k) / steps));
        // Point surélevé : caché seulement s'il est derrière le disque du globe
        const h = 1 + 0.16 * Math.sin((Math.PI * k) / steps);
        if (q.z < 0 && (q.nx * q.nx + q.ny * q.ny) * h * h < 1) { pen = false; continue; }
        if (pen) ctx.lineTo(q.x, q.y); else ctx.moveTo(q.x, q.y);
        pen = true;
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Repères
      const marker = (lat: number, lon: number, label: string, on: boolean, dy: number) => {
        const q = project(Math.cos(lat * RAD), Math.sin(lat * RAD), lon * RAD);
        if (q.z <= 0) return;
        const pulse = on ? 4 + ((time / 120) % 10) : 0;
        ctx.strokeStyle = 'rgba(242,242,238,0.9)';
        ctx.lineWidth = 1;
        ctx.strokeRect(q.x - 5, q.y - 5, 10, 10);
        if (on) {
          ctx.globalAlpha = 1 - pulse / 14;
          ctx.strokeRect(q.x - 5 - pulse, q.y - 5 - pulse, 10 + pulse * 2, 10 + pulse * 2);
          ctx.globalAlpha = 1;
        }
        ctx.fillStyle = '#f2f2ee';
        ctx.fillRect(q.x - 2, q.y - 2, 4, 4);
        ctx.font = `500 ${Math.max(10, W / 52)}px ${mono}`;
        // Étiquette retournée vers l'intérieur près du bord droit
        const flip = q.x > W * 0.6;
        ctx.textAlign = flip ? 'right' : 'left';
        ctx.fillText(label, q.x + (flip ? -12 : 12), q.y + dy);
        ctx.textAlign = 'left';
      };
      marker(FROM.lat, FROM.lon, 'RUN · 21.11°S', p < 0.98, 4);
      if (p > 0.6) marker(TO.lat, TO.lon, 'SAG · 48.43°N', p >= 0.98, -12);

      // Tête de l'arc
      if (p > 0.01 && p < 0.99) {
        const ll = toLatLon(head);
        const q = project(Math.cos(ll.lat * RAD), Math.sin(ll.lat * RAD), ll.lon * RAD, 1 + 0.16 * Math.sin(Math.PI * p));
        ctx.fillStyle = '#f2f2ee';
        ctx.fillRect(q.x - 3, q.y - 3, 6, 6);
      }
    };

    const tick = (time: number) => {
      raf = requestAnimationFrame(tick);
      if (lowPower && time - last < 33) return;
      last = time;
      // Lissage vers la cible ; on redessine en continu (pointillés, pulsation) tant que visible
      let p = shown < 0 ? target.current : shown + (target.current - shown) * 0.14;
      if (Math.abs(target.current - p) < 0.0008) p = target.current;
      shown = p;
      draw(p, time);
      const km = Math.round(JOURNEY_KM * p);
      if (kmRef.current) kmRef.current.textContent = km.toLocaleString('fr-CA').replace(/\u202f|\u00a0/g, ' ');
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
    };

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !visible) { visible = true; raf = requestAnimationFrame(tick); }
      else if (!e.isIntersecting && visible) { visible = false; cancelAnimationFrame(raf); }
    });
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    io.observe(canvas);
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); };
  }, []);

  return (
    // Conteneur stable : GSAP y insère son pin-spacer sans perturber React
    <div>
      <div ref={wrapRef} className="relative overflow-hidden border-b border-line bg-ink lg:h-screen">
        <div className="grid h-full grid-cols-1 items-center gap-8 px-4 py-14 sm:px-6 md:px-10 lg:grid-cols-12 lg:py-0">
          <div className="lg:col-span-5">
            <p className="label mb-4">{t('ui.journeyKicker')}</p>
            <p className="display text-[clamp(3.4rem,9vw,8.5rem)] leading-[0.85] tabular-nums" aria-hidden="true">
              <span ref={kmRef}>0</span>
              <span className="ml-2 text-outline-strong">KM</span>
            </p>
            <p className="sr-only">{t('ui.journeySr', { km: JOURNEY_KM.toLocaleString() })}</p>
            <div className="mt-6 h-px w-full bg-line">
              <div ref={barRef} className="h-px origin-left scale-x-0 bg-paper" />
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-4 font-mono text-[12px] uppercase tracking-[0.1em]">
              <div>
                <dt className="text-paper/55">{t('ui.journeyFrom')}</dt>
                <dd className="text-paper">La Réunion</dd>
                <dd className="text-paper/55">21.11°S · 55.53°E</dd>
              </div>
              <div className="text-right">
                <dt className="text-paper/55">{t('ui.journeyTo')}</dt>
                <dd className="text-paper">Saguenay, QC</dd>
                <dd className="text-paper/55">48.43°N · 71.07°W</dd>
              </div>
            </dl>
            <p className="mt-8 max-w-md leading-relaxed text-paper/70">{t('ui.journeyText')}</p>
          </div>
          <div className="lg:col-span-7">
            <canvas
              ref={canvasRef}
              className="mx-auto block aspect-square w-full max-w-[min(640px,80vh)] max-lg:max-w-[420px]"
              role="img"
              aria-label={t('ui.journeySr', { km: JOURNEY_KM.toLocaleString() })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JourneySection;
