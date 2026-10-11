/**
 * Régénère les CV PDF (FR + EN) à partir de la page /cv, via Chrome headless.
 * Prérequis : serveur lancé (npm run dev). Usage : node scripts/generate-cv-pdf.mjs [http://localhost:5173]
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const base = process.argv[2] ?? 'http://localhost:5173';
const chrome = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
].find((p) => p && existsSync(p));
if (!chrome) throw new Error('Chrome introuvable : définir CHROME_PATH');

for (const lang of ['fr', 'en']) {
  const out = path.join(ROOT, `public/assets/cv-christen-dijoux-${lang}.pdf`);
  execFileSync(chrome, [
    '--headless=new',
    `--user-data-dir=${mkdtempSync(path.join(tmpdir(), 'cv-pdf-'))}`,
    '--disable-gpu',
    '--no-pdf-header-footer',
    '--virtual-time-budget=12000',
    `--print-to-pdf=${out}`,
    `${base}/cv?lang=${lang}`,
  ], { stdio: 'ignore' });
  console.log('✓', path.relative(ROOT, out));
}
