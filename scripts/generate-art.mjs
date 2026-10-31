/**
 * Génère les visuels "halftone / dither" du portfolio (style éditorial monochrome).
 *  - Versions tramées des captures de projets  -> public/assets/art/<id>-halftone.png
 *  - Œuvres procédurales (globe, rayons, relief, bruit) -> public/assets/art/*.webp
 *
 * Usage : node scripts/generate-art.mjs
 */
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public', 'assets', 'art');

const INK = '#050505';
const PAPER = '#f2f2ee';

// ---------- utilitaires ----------
const BAYER8 = [
  [0, 32, 8, 40, 2, 34, 10, 42], [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38], [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41], [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37], [63, 31, 55, 23, 61, 29, 53, 21],
];

function mulberry32(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Bruit de valeur 2D lissé + fBm
function makeNoise(seed) {
  const rand = mulberry32(seed);
  const perm = new Uint8Array(512);
  const p = [...Array(256).keys()].sort(() => rand() - 0.5);
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  const vals = Float32Array.from({ length: 256 }, () => rand());
  const fade = (t) => t * t * (3 - 2 * t);
  const v = (x, y) => vals[perm[(perm[x & 255] + y) & 255]];
  const noise = (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = fade(x - xi), yf = fade(y - yi);
    const a = v(xi, yi), b = v(xi + 1, yi), c = v(xi, yi + 1), d = v(xi + 1, yi + 1);
    return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
  };
  return (x, y, oct = 5) => {
    let s = 0, amp = 0.5, f = 1, norm = 0;
    for (let i = 0; i < oct; i++) { s += amp * noise(x * f, y * f); norm += amp; amp *= 0.5; f *= 2; }
    return s / norm;
  };
}

/** Trame ordonnée (Bayer) d'un buffer de luminance -> RGB ink/paper */
function bayerDither(lum, w, h, cell = 2, invert = false, ink = [5, 5, 5], paper = [242, 242, 238]) {
  const out = Buffer.alloc(w * h * 3);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const t = (BAYER8[Math.floor(y / cell) % 8][Math.floor(x / cell) % 8] + 0.5) / 64;
      let l = lum[y * w + x] / 255;
      if (invert) l = 1 - l;
      const on = l > t; // on = clair
      const c = on ? paper : ink;
      const i = (y * w + x) * 3;
      out[i] = c[0]; out[i + 1] = c[1]; out[i + 2] = c[2];
    }
  }
  return out;
}

// Images bicolores : PNG à palette réduite (~4x plus léger que WebP)
async function writeRaw(buf, w, h, file, channels = 3) {
  await sharp(buf, { raw: { width: w, height: h, channels } })
    .png({ palette: true, colors: 4, compressionLevel: 9, effort: 10 })
    .toFile(path.join(OUT, file));
  console.log('  ✓', file);
}

async function svgToImage(svg, file, colors = 8) {
  const img = sharp(Buffer.from(svg));
  if (file.endsWith('.png')) await img.png({ palette: true, colors, compressionLevel: 9, effort: 10 }).toFile(path.join(OUT, file));
  else await img.resize(800).webp({ quality: 72, effort: 6 }).toFile(path.join(OUT, file));
  console.log('  ✓', file);
}

// ---------- 1. Captures de projets tramées ----------
const projectSources = {
  'gagnon-freres': 'public/assets/gagnon-freres.webp',
  akiworkspace: 'public/assets/preview_akiworkspace.png',
  ctreq: 'public/assets/ctreq-879.webp',
  'ctreq-blog-archive': 'public/assets/ctreq-archive-878.webp',
  'innovations-numeriques-fp': 'public/assets/innovations-numeriques-fp-879.webp',
  'portfolio-watch': 'public/assets/portfolio-watch.webp',
  badger: 'public/assets/badger.webp',
  'mona-game': 'public/assets/mona-game.webp',
  webana: 'src/assets/webana.webp',
  akiproject: 'src/assets/AkiProject.webp',
  akimusic: 'src/assets/AkiMusic.webp',
};

async function ditherProjects() {
  console.log('Captures de projets');
  for (const [id, rel] of Object.entries(projectSources)) {
    const src = path.join(ROOT, rel);
    try { await fs.access(src); } catch { console.warn('  ! introuvable', rel); continue; }
    const W = 1200, H = 900;
    const { data, info } = await sharp(src)
      .resize(W, H, { fit: 'cover', position: 'top' })
      .toColourspace('b-w')
      .normalise()
      .raw()
      .toBuffer({ resolveWithObject: true });
    // Captures claires -> inversées pour garder un fond noir
    const mean = data.reduce((s, v) => s + v, 0) / data.length;
    const rgb = bayerDither(data, info.width, info.height, 2, mean > 128);
    await writeRaw(rgb, info.width, info.height, `${id}-halftone.png`);
  }
}

// ---------- 2. Globe halftone ----------
async function halftoneGlobe() {
  const S = 1200, N = 110, cell = S / N, R = S * 0.4;
  const cx = S / 2, cy = S / 2;
  const light = (() => { const v = [-0.55, -0.6, 0.6]; const m = Math.hypot(...v); return v.map((a) => a / m); })();
  const noise = makeNoise(7);
  let dots = '';
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      const x = (i + 0.5) * cell, y = (j + 0.5) * cell;
      const dx = (x - cx) / R, dy = (y - cy) / R;
      const d2 = dx * dx + dy * dy;
      let b;
      if (d2 <= 1) {
        const dz = Math.sqrt(1 - d2);
        const lam = Math.max(0, dx * light[0] + dy * light[1] + dz * light[2]);
        // "continents" via bruit sur la sphère
        const u = Math.atan2(dx, dz) * 1.6, v = Math.asin(dy) * 1.6;
        const land = noise(u * 1.4 + 3, v * 1.4 + 3) > 0.52 ? 1 : 0.55;
        b = Math.pow(lam, 0.9) * land;
      } else {
        // halo + étoiles éparses
        const r = Math.sqrt(d2);
        b = Math.max(0, 0.35 - (r - 1) * 1.2) * 0.5;
        if (noise(i * 0.9, j * 0.9, 2) > 0.8) b = Math.max(b, 0.25);
      }
      const rad = (cell / 2) * Math.min(1, b * 1.15);
      if (rad > 0.35) dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rad.toFixed(2)}"/>`;
    }
  }
  // orbites
  const orbits = [0.62, 0.78].map((k, n) =>
    `<ellipse cx="${cx}" cy="${cy}" rx="${R * (1.25 + n * 0.12)}" ry="${R * k * 0.45}" transform="rotate(${-18 + n * 9} ${cx} ${cy})" fill="none" stroke="${PAPER}" stroke-width="1.2" stroke-dasharray="2 7" opacity="0.6"/>`
  ).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
  <rect width="100%" height="100%" fill="${INK}"/>${orbits}<g fill="${PAPER}">${dots}</g></svg>`;
  await svgToImage(svg, 'globe-halftone.png');
}

// ---------- 3. Éclat de rayons (façon gravure) ----------
async function rayBurst() {
  const W = 1200, H = 1200, cx = W / 2, cy = H / 2;
  const rand = mulberry32(42);
  let lines = '';
  for (let k = 0; k < 520; k++) {
    const a = rand() * Math.PI * 2;
    const r0 = 60 + rand() * 120;
    const r1 = 260 + Math.pow(rand(), 0.6) * 520;
    const w = 0.4 + rand() * 1.4;
    lines += `<line x1="${(cx + Math.cos(a) * r0).toFixed(1)}" y1="${(cy + Math.sin(a) * r0).toFixed(1)}" x2="${(cx + Math.cos(a) * r1).toFixed(1)}" y2="${(cy + Math.sin(a) * r1).toFixed(1)}" stroke-width="${w.toFixed(2)}" opacity="${(0.35 + rand() * 0.65).toFixed(2)}"/>`;
  }
  let rings = '';
  for (let k = 1; k <= 14; k++) rings += `<circle cx="${cx}" cy="${cy}" r="${k * 38}" fill="none" stroke-width="0.6" opacity="${(0.5 - k * 0.03).toFixed(2)}"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="100%" height="100%" fill="${INK}"/>
  <g stroke="${PAPER}">${rings}${lines}</g>
  <circle cx="${cx}" cy="${cy}" r="54" fill="${PAPER}"/>
  <circle cx="${cx}" cy="${cy}" r="30" fill="${INK}"/>
  <rect x="80" y="80" width="${W - 160}" height="${H - 160}" fill="none" stroke="${PAPER}" stroke-width="1" opacity="0.35"/></svg>`;
  await svgToImage(svg, 'ray-burst-800.webp');
}

// ---------- 4. Relief en lignes (ridgeline) ----------
async function ridgeLines() {
  const W = 1600, H = 1000, rows = 64, noise = makeNoise(11);
  let paths = '';
  for (let r = 0; r < rows; r++) {
    const baseY = 140 + r * ((H - 200) / rows);
    let d = '';
    for (let x = 0; x <= W; x += 8) {
      const cxd = Math.abs(x - W / 2) / (W / 2);
      const env = Math.pow(Math.max(0, 1 - cxd * 1.25), 2);
      const n = noise(x * 0.006, r * 0.18);
      const y = baseY - env * Math.pow(n, 2.2) * 260;
      d += (x === 0 ? 'M' : 'L') + x + ' ' + y.toFixed(1);
    }
    paths += `<path d="${d} L${W} ${H} L0 ${H} Z" fill="${INK}" stroke="${PAPER}" stroke-width="1.3"/>`;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="100%" height="100%" fill="${INK}"/>${paths}</svg>`;
  await svgToImage(svg, 'ridge-lines.png');
}

// ---------- 4b. Construction de design (nombre d'or, Bézier, grille) ----------
async function designConstruction() {
  const W = 1600, H = 1200, PHI = (1 + Math.sqrt(5)) / 2;
  // Grille de mise en page : 12 colonnes, gouttières
  let grid = '';
  for (let c = 0; c <= 12; c++) {
    const x = 80 + c * ((W - 160) / 12);
    grid += `<line x1="${x.toFixed(1)}" y1="60" x2="${x.toFixed(1)}" y2="${H - 60}" stroke-width="0.6" opacity="0.12"/>`;
  }
  for (let r = 0; r <= 8; r++) {
    const y = 80 + r * ((H - 160) / 8);
    grid += `<line x1="60" y1="${y.toFixed(1)}" x2="${W - 60}" y2="${y.toFixed(1)}" stroke-width="0.6" opacity="0.12"/>`;
  }
  // Rectangle d'or découpé en carrés, avec la spirale
  let x = 230, w = 1140, h = w / PHI, y = (H - h) / 2;
  let squares = `<rect x="${x}" y="${y.toFixed(1)}" width="${w}" height="${h.toFixed(1)}" fill="none" stroke-width="1.4" opacity="0.7"/>`;
  let spiral = '';
  for (let i = 0; i < 10; i++) {
    let sx, sy, s, from, to;
    if (i % 4 === 0) { s = h; sx = x; sy = y; from = [x, y + h]; to = [x + h, y]; x += h; w -= h; }
    else if (i % 4 === 1) { s = w; sx = x; sy = y; from = [x, y]; to = [x + w, y + w]; y += w; h -= w; }
    else if (i % 4 === 2) { s = h; sx = x + w - h; sy = y; from = [x + w, y]; to = [x + w - h, y + h]; w -= h; }
    else { s = w; sx = x; sy = y + h - w; from = [x + w, y + h]; to = [x, y + h - w]; h -= w; }
    squares += `<rect x="${sx.toFixed(1)}" y="${sy.toFixed(1)}" width="${s.toFixed(1)}" height="${s.toFixed(1)}" fill="none" stroke-width="0.9" opacity="${(0.55 - i * 0.03).toFixed(2)}"/>`;
    spiral += `${i === 0 ? `M${from[0].toFixed(1)} ${from[1].toFixed(1)}` : ''} A${s.toFixed(1)} ${s.toFixed(1)} 0 0 1 ${to[0].toFixed(1)} ${to[1].toFixed(1)}`;
  }
  // Courbe de Bézier et ses poignées
  const A = [150, 980], C1 = [520, 260], C2 = [1060, 1080], B = [1450, 300];
  const handle = (p, c) => `<line x1="${p[0]}" y1="${p[1]}" x2="${c[0]}" y2="${c[1]}" stroke-width="1" opacity="0.6" stroke-dasharray="5 6"/>`
    + `<circle cx="${c[0]}" cy="${c[1]}" r="9" fill="${INK}" stroke-width="1.5"/>`;
  const anchor = (p) => `<rect x="${p[0] - 10}" y="${p[1] - 10}" width="20" height="20" fill="${PAPER}"/>`;
  const bezier = `<path d="M${A} C${C1} ${C2} ${B}" fill="none" stroke-width="3.2"/>`
    + handle(A, C1) + handle(B, C2) + anchor(A) + anchor(B);
  // Cercles de construction et repères
  const circles = [[x + w / 2, y + h / 2, 300], [x + w / 2, y + h / 2, 185]]
    .map(([cx, cy, r]) => `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r}" fill="none" stroke-width="0.8" opacity="0.3"/>`).join('');
  const crop = [[60, 60, 1, 1], [W - 60, 60, -1, 1], [60, H - 60, 1, -1], [W - 60, H - 60, -1, -1]]
    .map(([cx, cy, dx, dy]) => `<path d="M${cx} ${cy + dy * 28} V${cy} H${cx + dx * 28}" fill="none" stroke-width="1.4" opacity="0.6"/>`).join('');
  const label = (lx, ly, t) => `<text x="${lx}" y="${ly}" font-family="Consolas, monospace" font-size="18" letter-spacing="3" fill="${PAPER}" fill-opacity="0.55">${t}</text>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="100%" height="100%" fill="${INK}"/>
  <g stroke="${PAPER}">${grid}${squares}${circles}
  <path d="${spiral}" fill="none" stroke-width="2" opacity="0.9"/>${bezier}${crop}</g>
  ${label(96, 120, 'φ = 1.618')}${label(W - 290, H - 100, 'GRID 12 · 8')}${label(A[0] + 24, A[1] + 44, 'P0')}${label(B[0] - 40, B[1] - 26, 'P3')}</svg>`;
  await svgToImage(svg, 'design-construction.png');
}

// ---------- 5. Champ de bruit tramé (texture / bannière) ----------
async function noiseField(file, seed, W, H, scale) {
  const noise = makeNoise(seed);
  const lum = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const n = noise(x * scale, y * scale, 6);
      const warp = noise(x * scale * 0.5 + n * 2, y * scale * 0.5 - n * 2, 4);
      lum[y * W + x] = Math.max(0, Math.min(255, (warp - 0.3) * 2.2 * 255));
    }
  }
  const rgb = bayerDither(lum, W, H, 2, false);
  await writeRaw(rgb, W, H, file);
}

// ---------- 6. Image Open Graph ----------
async function ogImage() {
  const W = 1200, H = 630;
  const globe = await sharp(path.join(OUT, 'globe-halftone.png')).resize(560, 560).toBuffer();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect width="100%" height="100%" fill="${INK}"/>
  <rect x="16" y="16" width="${W - 32}" height="${H - 32}" fill="none" stroke="${PAPER}" stroke-opacity="0.25"/>
  <text x="60" y="90" font-family="Consolas, monospace" font-size="20" fill="${PAPER}" fill-opacity="0.6" letter-spacing="3">[ 01 ] · PORTFOLIO — 2026</text>
  <text x="56" y="330" font-family="Arial Narrow, Arial, sans-serif" font-stretch="condensed" font-size="150" fill="${PAPER}" letter-spacing="-4">CHRISTEN</text>
  <text x="56" y="460" font-family="Arial Narrow, Arial, sans-serif" font-stretch="condensed" font-size="150" fill="${PAPER}" letter-spacing="-4">DIJOUX</text>
  <text x="60" y="560" font-family="Consolas, monospace" font-size="20" fill="${PAPER}" letter-spacing="2">FULL-STACK · IA · AUTOMATISATION · CLOUD</text></svg>`;
  await sharp(Buffer.from(svg))
    .composite([{ input: globe, left: W - 560 - 20, top: 35, blend: 'screen' }])
    .png()
    .toFile(path.join(OUT, 'og-cover.png'));
  console.log('  ✓ og-cover.png');
}

// --only=projects : régénère uniquement les captures tramées
const onlyProjects = process.argv.includes('--only=projects');

await fs.mkdir(OUT, { recursive: true });
await ditherProjects();
if (!onlyProjects) {
  console.log('Œuvres procédurales');
  await halftoneGlobe();
  await rayBurst();
  await ridgeLines();
  await designConstruction();
  await noiseField('noise-band.png', 3, 1600, 500, 0.004);
  await noiseField('noise-square.png', 21, 900, 900, 0.006);
  await ogImage();
}
console.log('Terminé →', path.relative(ROOT, OUT));
