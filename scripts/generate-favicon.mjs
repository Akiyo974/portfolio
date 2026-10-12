// Favicon : monogramme « CD » en pixel art sur une grille 16×16 (cadre fin + deux lettres de 4×8),
// dans les deux couleurs du site. Généré en SVG (net à toutes les tailles), puis en PNG et ICO.
//   node scripts/generate-favicon.mjs
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';

const OUT = new URL('../public/assets/', import.meta.url);
const INK = '#050505';
const PAPER = '#F2F2EE';

// 1 = pixel allumé. Cadre en ligne/colonne 1 et 14, lettres en lignes 4 à 11.
const C = ['.###', '#...', '#...', '#...', '#...', '#...', '#...', '.###'];
const D = ['###.', '#..#', '#..#', '#..#', '#..#', '#..#', '#..#', '###.'];
const pixels = [];
for (let i = 1; i <= 14; i++) pixels.push([i, 1], [i, 14], [1, i], [14, i]);
const glyph = (rows, x0, y0) => rows.forEach((row, y) => [...row].forEach((c, x) => c === '#' && pixels.push([x0 + x, y0 + y])));
glyph(C, 3, 4);
glyph(D, 9, 4);
const unique = [...new Map(pixels.map((p) => [p.join(','), p])).values()];

/** SVG de `size` px ; la grille 16×16 occupe `scale` de l'image (marge pour les icônes maskable). */
const svg = (size, scale = 1) => {
  const unit = (size * scale) / 16;
  const off = (size - unit * 16) / 2;
  const rects = unique.map(([x, y]) => `<rect x="${off + x * unit}" y="${off + y * unit}" width="${unit}" height="${unit}"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges"><rect width="${size}" height="${size}" fill="${INK}"/><g fill="${PAPER}">${rects}</g></svg>`;
};

const png = (size, scale) => sharp(Buffer.from(svg(size, scale))).png({ compressionLevel: 9 }).toBuffer();

writeFileSync(new URL('favicon.svg', OUT), svg(16));
writeFileSync(new URL('favicon-96x96.png', OUT), await png(96));
writeFileSync(new URL('apple-touch-icon.png', OUT), await png(180, 160 / 180));
// Maskable : le contenu doit tenir dans le cercle central (80 % du diamètre)
writeFileSync(new URL('web-app-manifest-192x192.png', OUT), await png(192, 0.56));
writeFileSync(new URL('web-app-manifest-512x512.png', OUT), await png(512, 0.56));

// ICO multi-tailles (PNG embarqués) : 16, 32, 48
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map((s) => png(s)));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((s, i) => {
  const e = 6 + i * 16;
  header.writeUInt8(s, e);
  header.writeUInt8(s, e + 1);
  header.writeUInt16LE(1, e + 4);
  header.writeUInt16LE(32, e + 6);
  header.writeUInt32LE(images[i].length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += images[i].length;
});
writeFileSync(new URL('favicon.ico', OUT), Buffer.concat([header, ...images]));
console.log('✓ favicons générés');
