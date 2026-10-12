/**
 * Sommaire du Lab pour l'accueil : quelques octets au lieu des fiches complètes (data/lab.ts),
 * qui restent dans le chunk de la page Lab. La parité des deux listes est vérifiée par un test.
 */
export type LabIndexEntry = { id: string; name: string; tag: string; score?: 1 | 2 | 3 };

export const labIndexComponents: LabIndexEntry[] = [
  { id: 'dither-hero', name: 'DitherHero', tag: 'WebGL', score: 3 },
  { id: 'kinetic', name: 'SplitText · useProximityWeight', tag: 'GSAP', score: 3 },
  { id: 'scroll-words', name: 'ScrollWords', tag: 'ScrollTrigger', score: 2 },
  { id: 'pixel-image', name: 'PixelImage', tag: 'Canvas 2D', score: 3 },
  { id: 'manifesto', name: 'ManifestoBand', tag: 'GSAP ticker', score: 2 },
  { id: 'cursor', name: 'CustomCursor', tag: 'GSAP quickTo', score: 2 },
  { id: 'negative', name: 'NegativeMode', tag: 'View Transitions', score: 3 },
  { id: 'counter', name: 'Counter', tag: 'rAF', score: 1 },
  { id: 'journey', name: 'JourneySection', tag: 'Canvas 2D', score: 2 },
  { id: 'stars', name: 'Star hunt · StarGame', tag: 'React Context', score: 2 },
  { id: 'chatbot', name: 'Chatbot', tag: 'TypeScript', score: 2 },
];

export const labIndexExperiments: LabIndexEntry[] = [
  { id: 'reaction-diffusion', name: 'Gray-Scott', tag: 'WebGL2' },
  { id: 'particle-type', name: 'Type as matter', tag: 'Canvas 2D' },
  { id: 'flow-field', name: 'Flow field', tag: 'Canvas 2D' },
  { id: 'ascii', name: 'ASCII globe', tag: 'Canvas 2D' },
];
