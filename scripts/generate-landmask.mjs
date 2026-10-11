/**
 * Génère un masque terre/mer léger (grille 1° → bitset base64) pour le globe du trajet.
 * Source : Natural Earth 110m (world-atlas). Usage : node scripts/generate-landmask.mjs
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';
import { feature } from 'topojson-client';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const W = 360, H = 180, K = 4; // rendu SVG à 4× puis moyenne

const topo = JSON.parse(await readFile(path.join(ROOT, 'node_modules/world-atlas/land-110m.json'), 'utf8'));
const land = feature(topo, topo.objects.land);

// Anneaux « déroulés » (pas de saut à l'antiméridien), dessinés 3× (−360, 0, +360)
const rings = [];
for (const f of land.features) {
  const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
  for (const poly of polys) for (const ring of poly) {
    let prev = ring[0][0], off = 0;
    rings.push(ring.map(([lon, lat]) => {
      if (lon - prev > 180) off -= 360; else if (prev - lon > 180) off += 360;
      prev = lon;
      return [lon + off, lat];
    }));
  }
}
const toXY = ([lon, lat], dx) => `${((lon + 180 + dx) * K).toFixed(2)},${((90 - lat) * K).toFixed(2)}`;
const d = [-360, 0, 360]
  .flatMap((dx) => rings.map((r) => 'M' + r.map((p) => toXY(p, dx)).join('L') + 'Z'))
  .join('');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W * K}" height="${H * K}"><rect width="100%" height="100%" fill="#000"/><path d="${d}" fill="#fff" fill-rule="nonzero"/></svg>`;

const { data } = await sharp(Buffer.from(svg)).resize(W, H, { kernel: 'cubic' }).toColourspace('b-w').raw().toBuffer({ resolveWithObject: true });
const bits = new Uint8Array(Math.ceil((W * H) / 8));
let count = 0;
for (let i = 0; i < W * H; i++) if (data[i] > 100) { bits[i >> 3] |= 1 << (i & 7); count++; }

const out = `// Généré par scripts/generate-landmask.mjs — Natural Earth 110m, grille 1° (${W}×${H}), ligne 0 = 90°N, colonne 0 = 180°W.
export const LAND_W = ${W};
export const LAND_H = ${H};
export const LAND_MASK = '${Buffer.from(bits).toString('base64')}';
`;
await writeFile(path.join(ROOT, 'src/data/landmask.ts'), out);
console.log(`landmask: ${count} cellules terre (${((count / (W * H)) * 100).toFixed(1)} %), ${out.length} octets`);

// Aperçu de contrôle
await sharp(Buffer.from(data.map((v) => (v > 100 ? 255 : 0))), { raw: { width: W, height: H, channels: 1 } })
  .resize(W * 2, H * 2, { kernel: 'nearest' }).png().toFile(path.join(ROOT, 'banners/_landmask-preview.png'));
