import { writeFileSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_URL = 'https://christendijoux.com';
const CURRENT_DATE = new Date().toISOString().split('T')[0];

// Lire le fichier TypeScript et extraire les projets via regex
const customProjectsPath = join(__dirname, '../src/data/customProjects.ts');
const customProjectsContent = readFileSync(customProjectsPath, 'utf-8');

// Extraire les IDs et images des projets
const projectMatches = [...customProjectsContent.matchAll(/id:\s*['"]([^'"]+)['"]/g)];
const imageMatches = [...customProjectsContent.matchAll(/image:\s*['"]([^'"]+)['"]/g)];
const titleMatches = [...customProjectsContent.matchAll(/title:\s*['"]([^'"]+)['"]/g)];

const projects = projectMatches.map((match, index) => ({
  id: match[1],
  image: imageMatches[index] ? imageMatches[index][1] : null,
  title: titleMatches[index] ? titleMatches[index][1] : ''
}));

const generateSitemap = () => {
  const staticPages = [
    { loc: '/', priority: '1.0', changefreq: 'weekly' },
    { loc: '/projects', priority: '0.9', changefreq: 'weekly' }
  ];

  const projectPages = projects.map(project => ({
    loc: `/project/${project.id}`,
    priority: '0.8',
    changefreq: 'monthly',
    image: project.image && !project.image.startsWith('http') ? `${BASE_URL}${project.image}` : project.image,
    imageCaption: project.title
  }));

  const allPages = [...staticPages, ...projectPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${allPages.map(page => `    <url>
        <loc>${BASE_URL}${page.loc}</loc>
        <lastmod>${CURRENT_DATE}</lastmod>
        <changefreq>${page.changefreq}</changefreq>
        <priority>${page.priority}</priority>${page.image ? `
        <image:image>
            <image:loc>${page.image}</image:loc>
            <image:caption>${page.imageCaption}</image:caption>
        </image:image>` : ''}
    </url>`).join('\n')}
</urlset>`;

  writeFileSync('public/sitemap.xml', sitemap, 'utf-8');
  console.log(`✅ Sitemap généré avec ${allPages.length} URLs (${staticPages.length} pages statiques + ${projectPages.length} projets)`);
};

generateSitemap();
