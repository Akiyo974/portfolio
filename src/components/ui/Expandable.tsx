import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const MOBILE = '(max-width: 767px)';
const PIXEL = 2; // taille d'un pixel de texte (px CSS)
const FLIGHT = 520; // durée de la chute d'un pixel jusqu'à sa place (ms)
const MAX_PIXELS = 9000;

const useActive = (mobileOnly: boolean) => {
  const [active, setActive] = useState(
    () => !mobileOnly || (typeof window !== 'undefined' && !!window.matchMedia?.(MOBILE).matches)
  );
  useEffect(() => {
    if (!mobileOnly || !window.matchMedia) return;
    const mq = window.matchMedia(MOBILE);
    const on = () => setActive(mq.matches);
    on();
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, [mobileOnly]);
  return active;
};

// Les hauteurs changent après la création des ScrollTrigger (révélations au défilement) :
// on leur fait recalculer leurs positions, une seule fois par image même avec plusieurs blocs.
let refreshFrame = 0;
const refreshScroll = () => {
  if (typeof requestAnimationFrame !== 'function') return;
  cancelAnimationFrame(refreshFrame);
  refreshFrame = requestAnimationFrame(() => {
    try {
      ScrollTrigger.refresh();
    } catch {
      /* environnement sans ScrollTrigger (tests) */
    }
  });
};

/** Bord replié : simple fondu sur la dernière ligne visible. */
const foldMask = (h: number) => `linear-gradient(#000 ${Math.max(0, h - 26)}px, transparent ${h}px)`;
/** Pendant l'animation : rien n'est visible sous `h` (ce sont les pixels qui dessinent le texte). */
const cutMask = (h: number) => `linear-gradient(#000 ${h}px, transparent ${h}px)`;

const setMask = (el: HTMLElement, mask: string) => {
  el.style.setProperty('-webkit-mask-image', mask);
  el.style.setProperty('mask-image', mask);
};

type Word = { top: number; bottom: number; line: number; pts: number[] };

/**
 * Les mots situés sous `from`, dans l'ordre de lecture : chacun est redessiné hors écran
 * à l'endroit exact où le navigateur l'a mis en page, puis découpé en pixels.
 */
const sampleWords = (el: HTMLElement, from: number, width: number, height: number) => {
  const off = document.createElement('canvas');
  off.width = Math.ceil(width);
  off.height = Math.ceil(height);
  const ctx = off.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  const box = el.getBoundingClientRect();
  ctx.fillStyle = '#fff';
  ctx.textBaseline = 'top';

  const rects: { l: number; t: number; r: number; b: number }[] = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  let color = '';
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const parent = node.parentElement;
    if (!parent || parent.closest('[aria-hidden="true"], .sr-only')) continue;
    const cs = getComputedStyle(parent);
    if (!color) color = cs.color;
    const fs = parseFloat(cs.fontSize);
    ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const text = node.textContent ?? '';
    for (const m of text.matchAll(/\S+/g)) {
      range.setStart(node, m.index ?? 0);
      range.setEnd(node, (m.index ?? 0) + m[0].length);
      const word = cs.textTransform === 'uppercase' ? m[0].toUpperCase() : m[0];
      for (const r of Array.from(range.getClientRects())) {
        const t = r.top - box.top;
        if (t + r.height < from - 2) continue;
        const l = r.left - box.left;
        ctx.fillText(word, l, t + (r.height - fs) / 2, r.width + 1);
        rects.push({ l, t, r: l + r.width, b: t + r.height });
      }
    }
  }
  if (!rects.length) return null;

  const data = ctx.getImageData(0, 0, off.width, off.height).data;
  const build = (step: number) => {
    let count = 0;
    let line = -1;
    let lineTop = -1e9;
    const words: Word[] = rects.map((r) => {
      if (Math.abs(r.t - lineTop) > 4) {
        line++;
        lineTop = r.t;
      }
      const pts: number[] = [];
      const x0 = Math.max(0, Math.floor(r.l / step) * step);
      const y0 = Math.max(0, Math.floor(r.t / step) * step);
      for (let y = y0; y < Math.min(off.height, r.b + 2); y += step) {
        for (let x = x0; x < Math.min(off.width, r.r + 2); x += step) {
          if (data[(y * off.width + x) * 4 + 3] > 110) pts.push(x, y);
        }
      }
      count += pts.length / 2;
      return { top: r.t, bottom: r.b, line, pts };
    });
    return { words, count };
  };
  let step = PIXEL;
  let res = build(step);
  while (res.count > MAX_PIXELS && step < 5) res = build(++step);
  return { words: res.words, step, firstTop: Math.min(from, rects[0].t), color: color || 'rgb(242,242,238)' };
};

/**
 * Contenu repliable. À l'ouverture, les mots cachés se construisent un par un, dans l'ordre
 * de lecture : leurs pixels tombent et se posent sur la forme des lettres, et chaque ligne
 * terminée laisse la place au vrai texte. À la fermeture, les mots se défont en remontant.
 * Par défaut sur mobile seulement.
 */
export const Expandable: React.FC<{
  open: boolean;
  collapsed: (el: HTMLElement) => number;
  id?: string;
  className?: string;
  mobileOnly?: boolean;
  children: React.ReactNode;
}> = ({ open, collapsed, id, className = '', mobileOnly = true, children }) => {
  const ref = useRef<HTMLDivElement>(null); // porte la hauteur
  const innerRef = useRef<HTMLDivElement>(null); // porte le masque (le canvas reste hors masque)
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const active = useActive(mobileOnly);
  const reduce = useReducedMotion();
  const first = useRef(true);
  const measureRef = useRef(collapsed);
  measureRef.current = collapsed;
  const openRef = useRef(open);
  openRef.current = open;
  const stopRef = useRef<() => void>(() => {});

  // État replié (remesuré quand la mise en page change)
  useLayoutEffect(() => {
    const el = ref.current;
    const inner = innerRef.current;
    if (!el || !inner) return;
    if (!active) {
      stopRef.current();
      el.style.height = '';
      setMask(inner, '');
      refreshScroll();
      return;
    }
    const applyClosed = () => {
      if (openRef.current) return;
      const h = measureRef.current(inner);
      el.style.height = `${h}px`;
      setMask(inner, foldMask(h));
      refreshScroll();
    };
    applyClosed();
    window.addEventListener('resize', applyClosed);
    void document.fonts?.ready.then(applyClosed);
    return () => window.removeEventListener('resize', applyClosed);
  }, [active]);

  // Ouverture / fermeture
  useLayoutEffect(() => {
    const el = ref.current;
    const inner = innerRef.current;
    const canvas = canvasRef.current;
    if (first.current) {
      first.current = false;
      return;
    }
    if (!el || !inner || !canvas || !active) return;
    stopRef.current();

    const full = inner.scrollHeight;
    const shut = measureRef.current(inner);
    const width = inner.clientWidth;
    const finish = () => {
      canvas.style.display = 'none';
      if (openRef.current) {
        el.style.height = 'auto';
        setMask(inner, '');
      } else {
        el.style.height = `${shut}px`;
        setMask(inner, foldMask(shut));
      }
      refreshScroll();
    };

    const sample = !reduce && typeof el.animate === 'function' ? sampleWords(inner, shut, width, full) : null;
    const ctx = sample ? canvas.getContext('2d') : null;
    if (!sample || !ctx) {
      finish();
      return;
    }

    // Toile de la taille du contenu déplié, par-dessus le texte
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.ceil(width * dpr);
    canvas.height = Math.ceil(full * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${full}px`;
    canvas.style.display = 'block';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = sample.color;

    const { words } = sample;
    const W = words.length;
    // Un mot démarre toutes les `gap` ms (ordre de lecture) ; ses pixels arrivent en léger désordre
    const gap = Math.min(70, Math.max(9, 2400 / W)) * (open ? 1 : 0.45);
    const jitter = gap * 1.8 + 90;
    const size = sample.step * 0.9;
    const wordStart = words.map((_, k) => (open ? k : W - 1 - k) * gap);
    const wordEnd = wordStart.map((s) => s + jitter + FLIGHT);
    const delays = words.map((w, k) => Float32Array.from({ length: w.pts.length / 2 }, () => wordStart[k] + Math.random() * jitter));
    const drops = words.map((w) => Float32Array.from({ length: w.pts.length / 2 }, () => 18 + Math.random() * 34));
    const drift = words.map((w) => Float32Array.from({ length: w.pts.length / 2 }, () => (Math.random() - 0.5) * 22));
    // Fin de chaque ligne (ouverture) : la ligne est alors rendue au vrai texte
    const lines = words[W - 1].line + 1;
    const lineEnd = new Float32Array(lines);
    const lineBottom = new Float32Array(lines);
    words.forEach((w, k) => {
      lineEnd[w.line] = Math.max(lineEnd[w.line], wordEnd[k]);
      lineBottom[w.line] = Math.max(lineBottom[w.line], w.bottom);
    });
    const total = Math.max(...wordEnd);

    setMask(inner, cutMask(sample.firstTop));
    const from = el.offsetHeight;
    el.style.height = `${full}px`;
    if (open) {
      el.animate([{ height: `${from}px` }, { height: `${full}px` }], {
        duration: Math.min(1100, Math.max(500, total * 0.45)),
        easing: 'cubic-bezier(0.33, 1, 0.68, 1)',
      });
    }

    let raf = 0;
    let shownLines = 0; // lignes déjà rendues au vrai texte
    const start = performance.now();
    const ease = (k: number) => 1 - Math.pow(1 - k, 3);
    const frame = (now: number) => {
      const t = now - start;
      if (open) {
        let done = shownLines;
        while (done < lines && t >= lineEnd[done]) done++;
        if (done !== shownLines) {
          shownLines = done;
          setMask(inner, cutMask(done < lines ? Math.max(sample.firstTop, lineBottom[done - 1] + 1) : full));
        }
      }
      ctx.clearRect(0, 0, width, full);
      for (let k = 0; k < W; k++) {
        const w = words[k];
        if (open && w.line < shownLines) continue; // ligne déjà en vrai texte
        if (open ? t < wordStart[k] : t > wordEnd[k]) continue;
        const d = delays[k];
        const dy = drops[k];
        const dx = drift[k];
        const pts = w.pts;
        for (let i = 0; i < d.length; i++) {
          const p = Math.min(1, Math.max(0, (t - d[i]) / FLIGHT));
          if (open && p <= 0) continue;
          // Ouverture : chute depuis un peu au-dessus ; fermeture : envol vers le haut
          const e = open ? ease(p) : 1 - ease(p);
          if (e <= 0) continue;
          ctx.globalAlpha = e;
          ctx.fillRect(pts[i * 2] + dx[i] * (1 - e), pts[i * 2 + 1] - dy[i] * (1 - e), size, size);
        }
      }
      ctx.globalAlpha = 1;
      if (t < total) {
        raf = requestAnimationFrame(frame);
        return;
      }
      if (!open) {
        // Tous les mots sont défaits : le bloc se replie
        el.animate([{ height: `${full}px` }, { height: `${shut}px` }], { duration: 420, easing: 'cubic-bezier(0.65, 0, 0.35, 1)' });
      }
      finish();
    };
    raf = requestAnimationFrame(frame);

    stopRef.current = () => {
      cancelAnimationFrame(raf);
      canvas.style.display = 'none';
    };
    return () => stopRef.current();
  }, [open, active, reduce]);

  return (
    <div ref={ref} id={id} className={`relative ${active ? 'overflow-hidden' : ''} ${className}`}>
      <div ref={innerRef} className="relative">
        {children}
      </div>
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute left-0 top-0 hidden" />
    </div>
  );
};

const GLYPHS = '#%*+=/\\|<>01';

/** Libellé qui se « décode » caractère par caractère quand il change. */
const Scramble: React.FC<{ text: string }> = ({ text }) => {
  const [shown, setShown] = useState(text);
  const reduce = useReducedMotion();
  const prev = useRef(text);

  useEffect(() => {
    if (prev.current === text) return;
    prev.current = text;
    if (reduce) {
      setShown(text);
      return;
    }
    const start = performance.now();
    const dur = 520;
    let raf = 0;
    const tick = (now: number) => {
      const k = Math.min(1, (now - start) / dur);
      const solid = Math.floor(k * text.length);
      setShown(
        Array.from(text, (c, i) => (i < solid || c === ' ' ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)])).join('')
      );
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, reduce]);

  return <span aria-hidden="true">{shown}</span>;
};

// « + » fait de 5 pixels ; à l'ouverture, les pixels haut et bas glissent aux extrémités pour former « − »
const PIXELS: { closed: [number, number]; open: [number, number] }[] = [
  { closed: [2, 2], open: [2, 2] },
  { closed: [1, 2], open: [1, 2] },
  { closed: [3, 2], open: [3, 2] },
  { closed: [2, 1], open: [0, 2] },
  { closed: [2, 3], open: [4, 2] },
];

const PixelPlus: React.FC<{ open: boolean }> = ({ open }) => (
  <span aria-hidden="true" className="relative inline-block h-[15px] w-[15px] shrink-0">
    {PIXELS.map((p, i) => {
      const [x, y] = open ? p.open : p.closed;
      return (
        <span
          key={i}
          className="absolute left-0 top-0 h-[3px] w-[3px] bg-current transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none"
          style={{ transform: `translate(${x * 3}px, ${y * 3}px)`, transitionDelay: `${i > 2 ? 80 : 0}ms` }}
        />
      );
    })}
  </span>
);

/** Bouton « Lire la suite » assorti : libellé décodé + pixels qui se réorganisent. */
export const ExpandButton: React.FC<{
  open: boolean;
  onClick: () => void;
  controls?: string;
  label: string;
  openLabel: string;
  className?: string;
  mobileOnly?: boolean;
}> = ({ open, onClick, controls, label, openLabel, className = '', mobileOnly = true }) => {
  const text = open ? openLabel : label;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-controls={controls}
      className={`label group inline-flex items-center gap-2.5 text-paper ${mobileOnly ? 'md:hidden' : ''} ${className}`}
    >
      <PixelPlus open={open} />
      <span className="sr-only">{text}</span>
      <Scramble text={text} />
    </button>
  );
};
