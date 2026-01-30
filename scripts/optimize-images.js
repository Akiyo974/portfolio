/**
 * Script d'optimisation des images pour performances Lighthouse
 * Génère des versions responsive et WebP des images critiques
 */

import sharp from 'sharp';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const IMAGES_TO_OPTIMIZE = [
  {
    input: 'public/assets/logo.png',
    outputs: [
      { width: 1364, suffix: '', format: 'png' },
      { width: 800, suffix: '-800', format: 'png' },
      { width: 400, suffix: '-400', format: 'png' },
      { width: 1364, suffix: '', format: 'webp' },
      { width: 800, suffix: '-800', format: 'webp' },
      { width: 400, suffix: '-400', format: 'webp' }
    ]
  },
  {
    input: 'public/assets/ctreq.webp',
    outputs: [
      { width: 1320, suffix: '', format: 'webp' },
      { width: 879, suffix: '-879', format: 'webp' },
      { width: 640, suffix: '-640', format: 'webp' }
    ]
  },
  {
    input: 'public/assets/innovations-numeriques-fp.webp',
    outputs: [
      { width: 1321, suffix: '', format: 'webp' },
      { width: 879, suffix: '-879', format: 'webp' },
      { width: 640, suffix: '-640', format: 'webp' }
    ]
  },
  {
    input: 'public/assets/ctreq-archive.webp',
    outputs: [
      { width: 1320, suffix: '', format: 'webp' },
      { width: 878, suffix: '-878', format: 'webp' },
      { width: 640, suffix: '-640', format: 'webp' }
    ]
  }
];

async function optimizeImages() {
  console.log('🖼️  Optimisation des images en cours...\n');

  for (const imageConfig of IMAGES_TO_OPTIMIZE) {
    const inputPath = join(projectRoot, imageConfig.input);
    
    try {
      await fs.access(inputPath);
    } catch {
      console.log(`⚠️  Fichier non trouvé : ${imageConfig.input}`);
      continue;
    }

    console.log(`📦 Traitement de ${imageConfig.input}`);

    for (const output of imageConfig.outputs) {
      const baseName = imageConfig.input.split('/').pop().replace(/\.[^.]+$/, '');
      const outputName = `${baseName}${output.suffix}.${output.format}`;
      const outputPath = join(projectRoot, 'public/assets', outputName);

      try {
        await sharp(inputPath)
          .resize(output.width, null, {
            withoutEnlargement: true,
            fit: 'inside'
          })
          [output.format]({
            quality: output.format === 'webp' ? 85 : 90,
            progressive: true
          })
          .toFile(outputPath);

        const stats = await fs.stat(outputPath);
        const sizeKB = (stats.size / 1024).toFixed(2);
        console.log(`  ✅ ${outputName} - ${output.width}px - ${sizeKB} KB`);
      } catch (error) {
        console.error(`  ❌ Erreur lors de la création de ${outputName}:`, error.message);
      }
    }

    console.log('');
  }

  console.log('✨ Optimisation terminée !');
}

optimizeImages().catch(console.error);
