// Sitemap : toutes les pages indexables, leurs versions FR/EN (hreflang), leur image de partage
// et une date de dernière modification réelle (dernier commit Git des fichiers sources de la page).
//   node scripts/generate-sitemap.js   (lancé automatiquement avant `npm run build`)
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE_URL = 'https://christendijoux.com';
const TODAY = new Date().toISOString().split('T')[0];

/** Date du dernier commit touchant ces fichiers (aujourd'hui s'ils ont des modifications non commitées). */
const lastmod = (...files) => {
  try {
    const dirty = execFileSync('git', ['status', '--porcelain', '--', ...files], { cwd: ROOT, encoding: 'utf8' }).trim();
    if (dirty) return TODAY;
    return execFileSync('git', ['log', '-1', '--format=%cs', '--', ...files], { cwd: ROOT, encoding: 'utf8' }).trim() || TODAY;
  } catch {
    return TODAY;
  }
};

const en = JSON.parse(readFileSync(join(ROOT, 'src/i18n/locales/en.json'), 'utf8'));
const ids = [...readFileSync(join(ROOT, 'src/data/customProjects.ts'), 'utf8').matchAll(/^\s+id:\s*'([^']+)'/gm)].map((m) => m[1]);
const LOCALES = ['src/i18n/locales/en.json', 'src/i18n/locales/fr.json'];

const pages = [
  { path: '/', priority: '1.0', changefreq: 'weekly', image: '/assets/art/og-cover.png', caption: 'Christen Dijoux — Full-stack & AI Developer', src: ['src/pages/HomePage.tsx', 'src/components', ...LOCALES] },
  { path: '/projects', priority: '0.9', changefreq: 'weekly', src: ['src/pages/ProjectsPage.tsx', 'src/data/customProjects.ts'] },
  { path: '/lab', priority: '0.8', changefreq: 'monthly', image: '/assets/art/og-lab.jpg', caption: 'Lab — every component of the site dissected live', src: ['src/pages/LabPage.tsx', 'src/data/lab.ts', 'src/components/lab'] },
  { path: '/cv', priority: '0.8', changefreq: 'monthly', src: ['src/pages/CVPage.tsx', ...LOCALES] },
  ...ids.map((id) => ({
    path: `/project/${id}`,
    priority: '0.8',
    changefreq: 'monthly',
    image: existsSync(join(ROOT, `public/assets/og/${id}.jpg`)) ? `/assets/og/${id}.jpg` : undefined,
    caption: en.customProjects?.[id]?.title ?? id,
    src: ['src/data/customProjects.ts', 'src/data/caseGallery.ts', ...LOCALES],
  })),
  { path: '/privacy-policy', priority: '0.3', changefreq: 'yearly', src: ['src/pages/PrivacyPolicyPage.tsx'] },
  { path: '/legal-notice', priority: '0.3', changefreq: 'yearly', src: ['src/pages/LegalNoticePage.tsx'] },
];

const xml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${pages
  .map((p) => {
    const url = `${BASE_URL}${p.path}`;
    return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod(...p.src)}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
    <xhtml:link rel="alternate" hreflang="en" href="${url}"/>
    <xhtml:link rel="alternate" hreflang="fr" href="${url}?lang=fr"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${url}"/>${
      p.image
        ? `
    <image:image>
      <image:loc>${BASE_URL}${p.image}</image:loc>
      <image:caption>${xml(p.caption)}</image:caption>
    </image:image>`
        : ''
    }
  </url>`;
  })
  .join('\n')}
</urlset>
`;

writeFileSync(join(ROOT, 'public/sitemap.xml'), sitemap, 'utf-8');
console.log(`✅ Sitemap généré : ${pages.length} pages`);
