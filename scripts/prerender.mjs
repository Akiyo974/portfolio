// Pré-rendu SEO après `vite build` : chaque route reçoit son propre HTML statique, en anglais et en français, avec
// ses vraies balises (titre, description, canonical, hreflang, Open Graph, JSON-LD) et son texte.
// Utile pour les robots qui n'exécutent pas le JavaScript (aperçus LinkedIn / X / Slack, robots d'IA)
// et pour que Google voie la bonne canonical dès le HTML brut. React remplace ensuite ce contenu.
// Les pages françaises vont dans dist/fr/ : .htaccess les sert pour les adresses en ?lang=fr.
//   node scripts/prerender.mjs   (lancé automatiquement par `npm run build`)
import { preview } from 'vite';
import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { brotliCompressSync, gzipSync } from 'node:zlib';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const PORT = 4179;

const chrome = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
].find((p) => p && existsSync(p));
if (!chrome) throw new Error('Pré-rendu impossible : Chrome introuvable (définir CHROME_PATH)');

const projectIds = [...readFileSync(path.join(ROOT, 'src/data/customProjects.ts'), 'utf8').matchAll(/^\s+id:\s*'([^']+)'/gm)].map((m) => m[1]);
const routes = ['/', '/projects', '/lab', '/cv', '/privacy-policy', '/legal-notice', '/generateur-lettre', ...projectIds.map((id) => `/project/${id}`)];

const template = readFileSync(path.join(DIST, 'index.html'), 'utf8');
// Gabarit neutre : balises gérées par Helmet (data-rh) et <title> retirés, balise par balise
// (une expression trop gourmande avait emporté tout le <head> jusqu'au </script> suivant)
const shell = template
  .replace(/[ \t]*<(?:meta|link)\b[^>]*\bdata-rh="true"[^>]*>\r?\n?/g, '')
  .replace(/[ \t]*<script\b[^>]*\bdata-rh="true"[^>]*>[\s\S]*?<\/script>\r?\n?/g, '')
  .replace(/<title>[\s\S]*?<\/title>/, '');

// Garde-fou : ces éléments du gabarit doivent survivre au nettoyage, sinon le build échoue
const MUST_KEEP = ['fonts.googleapis.com/css2', 'rel="icon"', 'apple-touch-icon', 'rel="manifest"', 'theme-color', 'application/ld+json', 'id="shell"', 'type="module"'];
const lost = MUST_KEEP.filter((k) => template.includes(k) && !shell.includes(k));
if (lost.length) throw new Error(`Pré-rendu : éléments perdus du <head> : ${lost.join(', ')}`);

// Écrit le HTML et ses versions précompressées (celles du build ne correspondraient plus)
const writeHtml = (file, html) => {
  const out = path.join(DIST, file);
  mkdirSync(path.dirname(out), { recursive: true });
  writeFileSync(out, html);
  writeFileSync(`${out}.br`, brotliCompressSync(html));
  writeFileSync(`${out}.gz`, gzipSync(html, { level: 9 }));
};

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const server = await preview({ root: ROOT, preview: { port: PORT, strictPort: true }, logLevel: 'error' });
const launch = () => puppeteer.launch({ executablePath: chrome, headless: true, args: ['--no-sandbox'] });
let browser = await launch();
const results = [];
try {
  for (const lang of ['en', 'fr']) for (const route of routes) {
    // Un Chrome neuf toutes les 8 pages : au-delà, les pages WebGL finissent par le faire tomber
    if (results.length && results.length % 8 === 0) {
      await browser.close();
      browser = await launch();
    }
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.evaluateOnNewDocument((lng) => {
      try {
        localStorage.setItem('i18nextLng', lng);
        sessionStorage.setItem('cd-intro-seen', '1');
      } catch {}
    }, lang);
    await page.goto(`http://localhost:${PORT}${route}${lang === 'fr' ? '?lang=fr' : ''}`, { waitUntil: 'networkidle0', timeout: 30000 }).catch(() => {});
    await page.waitForFunction(() => document.querySelector('link[rel="canonical"][data-rh]') || document.querySelector('meta[name="robots"][content*="noindex"]'), { timeout: 15000 });
    await new Promise((r) => setTimeout(r, 800));

    const data = await page.evaluate(() => {
      const head = [...document.head.querySelectorAll('[data-rh]')].map((el) => el.outerHTML);
      const title = document.title;
      // Texte de la page, dans l'ordre : titres, paragraphes, éléments de liste (version lisible des textes animés)
      const main = document.querySelector('#main-content') ?? document.body;
      const blocks = [];
      const seen = new Set();
      main.querySelectorAll('h1, h2, h3, h4, p, li, dt, dd').forEach((el) => {
        if (el.closest('[aria-hidden="true"], nav, footer, .sr-only')) return;
        if (el.parentElement?.closest('p, li, dd')) return;
        const sr = el.querySelector(':scope > .sr-only, :scope > * > .sr-only');
        const text = (sr?.textContent ?? el.textContent ?? '').replace(/\s+/g, ' ').trim();
        if (!text || text.length < 2 || seen.has(text)) return;
        seen.add(text);
        blocks.push([/^H[1-4]$/.test(el.tagName) ? el.tagName.toLowerCase() : 'p', text]);
      });
      const links = [...new Map(
        [...document.querySelectorAll('a[href^="/"]')]
          .map((a) => [a.getAttribute('href').split('#')[0] || '/', (a.textContent ?? '').replace(/\s+/g, ' ').trim()])
          .filter(([href, text]) => text && !href.startsWith('/assets') && !href.startsWith('/api'))
      ).entries()];
      return { head, title, blocks, links };
    });
    await page.close();

    const body = [
      '<div class="prerender">',
      ...data.blocks.map(([tag, text]) => `<${tag}>${esc(text)}</${tag}>`),
      `<nav>${data.links.map(([href, text]) => `<a href="${esc(href)}">${esc(text)}</a>`).join(' ')}</nav>`,
      '</div>',
    ].join('\n');
    const html = shell
      .replace('<html lang="en">', `<html lang="${lang}">`)
      .replace('</head>', `    <title>${esc(data.title)}</title>\n    ${data.head.join('\n    ')}\n  </head>`)
      // Sous l'écran de démarrage (position fixe) : invisible pour le visiteur, lisible par les robots ; React le remplace
      .replace(/(<div id="root">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>)/, `$1\n      ${body}`);

    const file = (lang === 'fr' ? 'fr/' : '') + (route === '/' ? 'index.html' : `${route.slice(1)}.html`);
    writeHtml(file, html);
    results.push(`${lang} ${route} → ${file} (${data.blocks.length} blocs, ${data.head.length} balises)`);
  }
  // Page d'erreur : coquille neutre, non indexable (servie avec le statut 404 par .htaccess)
  writeHtml(
    '404.html',
    shell.replace('</head>', '    <title>404 | Christen Dijoux</title>\n    <meta name="robots" content="noindex" />\n  </head>')
  );
} finally {
  await browser.close();
  await new Promise((r) => server.httpServer.close(r));
}
console.log(results.map((r) => `✓ ${r}`).join('\n'));
