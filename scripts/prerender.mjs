// Pré-rendu SEO après `vite build` : chaque route reçoit son propre HTML statique avec
// ses vraies balises (titre, description, canonical, hreflang, Open Graph, JSON-LD) et son texte.
// Utile pour les robots qui n'exécutent pas le JavaScript (aperçus LinkedIn / X / Slack, robots d'IA)
// et pour que Google voie la bonne canonical dès le HTML brut. React remplace ensuite ce contenu.
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
// Gabarit neutre : balises gérées par Helmet (data-rh) et <title> retirés
const shell = template.replace(/\s*<(meta|link|script)\b[^>]*\bdata-rh="true"[^>]*>(?:[\s\S]*?<\/script>)?/g, '').replace(/<title>[\s\S]*?<\/title>/, '');

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
const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ['--no-sandbox'] });
const results = [];
try {
  for (const route of routes) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.evaluateOnNewDocument(() => {
      try {
        localStorage.setItem('i18nextLng', 'en');
        sessionStorage.setItem('cd-intro-seen', '1');
      } catch {}
    });
    await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle0', timeout: 30000 }).catch(() => {});
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
      .replace('</head>', `    <title>${esc(data.title)}</title>\n    ${data.head.join('\n    ')}\n  </head>`)
      // Sous l'écran de démarrage (position fixe) : invisible pour le visiteur, lisible par les robots ; React le remplace
      .replace(/(<div id="root">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>)/, `$1\n      ${body}`);

    const file = route === '/' ? 'index.html' : `${route.slice(1)}.html`;
    writeHtml(file, html);
    results.push(`${route} → ${file} (${data.blocks.length} blocs, ${data.head.length} balises)`);
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
