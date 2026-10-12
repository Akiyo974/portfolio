/**
 * Contenu du Lab : catalogue des composants du site + expériences libres.
 * Textes bilingues ici plutôt que dans les JSON i18n : ce sont des fiches longues, propres à cette page.
 */

export type Lang = 'fr' | 'en';
type Text = Record<Lang, string>;

export type DemoId =
  | 'dither-hero'
  | 'kinetic'
  | 'scroll-words'
  | 'pixel-image'
  | 'manifesto'
  | 'cursor'
  | 'negative'
  | 'counter'
  | 'expandable';

export type LabComponent = {
  id: string;
  name: string;
  file: string;
  demo?: DemoId;
  /** Lien vers l'endroit du site où le composant vit (si pas de démo isolée) */
  seeOn?: string;
  role: Text;
  why: Text;
  how: Text;
  /** Pertinence sur 3 */
  score: 1 | 2 | 3;
  verdict: Text;
  cost: Text;
  stack: string[];
};

export const labComponents: LabComponent[] = [
  {
    id: 'dither-hero',
    name: 'DitherHero',
    file: 'components/webgl/DitherHero.tsx',
    demo: 'dither-hero',
    role: {
      fr: 'La sphère organique tramée en fond du hero. Elle respire, suit la souris comme une loupe et se dissout au défilement.',
      en: 'The dithered organic sphere behind the hero. It breathes, follows the cursor like a loupe and dissolves on scroll.',
    },
    why: {
      fr: "Je voulais une identité visuelle sans aucune image : deux couleurs, un algorithme. Une photo ou une vidéo aurait pesé plusieurs Mo, le shader en pèse 6 Ko.",
      en: 'I wanted a visual identity with no image at all: two colours, one algorithm. A photo or video would weigh several MB; the shader weighs 6 KB.',
    },
    how: {
      fr: "WebGL brut (sans three.js), un seul triangle plein écran. Sphère raymarchée déformée par un bruit simplex 3D, éclairage par la normale, puis tramage ordonné Bayer 8×8. Compilation lancée pendant que le navigateur est libre (KHR_parallel_shader_compile) pour ne jamais bloquer l'affichage.",
      en: 'Raw WebGL (no three.js), a single full-screen triangle. A raymarched sphere warped by 3D simplex noise, lit from its normal, then 8×8 Bayer ordered dithering. Compiled while the browser is idle (KHR_parallel_shader_compile) so it never blocks the first paint.',
    },
    score: 3,
    verdict: {
      fr: "La pièce maîtresse : c'est elle qui donne son identité au site. Ce que je referais : un mode basse consommation automatique selon le GPU, plutôt que selon la taille d'écran.",
      en: "The centrepiece: it gives the site its identity. What I'd redo: an automatic low-power mode based on the GPU rather than on screen size.",
    },
    cost: {
      fr: 'Moyen. Sur mobile, un point de trame = 1 pixel calculé (≈ 25× moins de travail), 30 i/s, pause hors écran.',
      en: 'Medium. On mobile, one dither dot = one computed pixel (≈ 25× less work), 30 fps, paused off-screen.',
    },
    stack: ['WebGL', 'GLSL', 'Raymarching', 'Bayer 8×8'],
  },
  {
    id: 'kinetic',
    name: 'SplitText · useProximityWeight',
    file: 'components/ui/Kinetic.tsx',
    demo: 'kinetic',
    role: {
      fr: "Les titres se révèlent lettre par lettre, et leur graisse s'épaissit à l'approche du curseur.",
      en: 'Headings reveal letter by letter, and their weight thickens as the cursor gets closer.',
    },
    why: {
      fr: "Donner du relief à la typographie sans vidéo ni image : le texte devient l'élément interactif principal.",
      en: 'Give the typography depth without video or images: text becomes the main interactive element.',
    },
    how: {
      fr: "Découpe en mots puis en lettres masquées, animées avec GSAP. Pour la graisse : une police variable, et la distance au curseur pilote l'axe « wght » de chaque lettre, avec un lissage. La boucle s'arrête dès que tout est immobile.",
      en: "Split into words, then masked letters, animated with GSAP. For the weight: a variable font, where the distance to the cursor drives each letter's 'wght' axis, smoothed. The loop stops as soon as everything is still.",
    },
    score: 3,
    verdict: {
      fr: "Très bon rapport effet / coût, et accessible : le texte complet reste lisible par les lecteurs d'écran (sr-only). Désactivé sur tactile, où il n'aurait aucun sens.",
      en: 'Great effect-to-cost ratio, and accessible: the full text stays available to screen readers (sr-only). Disabled on touch screens, where it would make no sense.',
    },
    cost: { fr: 'Faible. Aucune boucle quand rien ne bouge.', en: 'Low. No loop runs when nothing moves.' },
    stack: ['GSAP', 'Variable fonts', 'requestAnimationFrame'],
  },
  {
    id: 'scroll-words',
    name: 'ScrollWords',
    file: 'components/ui/Kinetic.tsx',
    demo: 'scroll-words',
    role: {
      fr: 'Un paragraphe qui s’allume mot à mot, au rythme du défilement.',
      en: 'A paragraph that lights up word by word, in step with scrolling.',
    },
    why: {
      fr: 'Ralentir la lecture des textes importants : on lit au rythme où ils apparaissent.',
      en: 'Slow down the reading of key texts: you read at the pace they appear.',
    },
    how: {
      fr: "ScrollTrigger en mode « scrub » : l'opacité de chaque mot est liée à la position de défilement. Opacité minimale à 0,38 pour garder un contraste WCAG suffisant.",
      en: "ScrollTrigger in scrub mode: each word's opacity is tied to the scroll position. Minimum opacity of 0.38 to keep WCAG contrast.",
    },
    score: 2,
    verdict: {
      fr: 'Efficace mais très répandu sur les sites primés. À utiliser avec parcimonie, une ou deux fois par page.',
      en: 'Effective but very common on award sites. Use sparingly, once or twice per page.',
    },
    cost: { fr: 'Très faible.', en: 'Very low.' },
    stack: ['GSAP', 'ScrollTrigger'],
  },
  {
    id: 'pixel-image',
    name: 'PixelImage',
    file: 'components/ui/PixelImage.tsx',
    demo: 'pixel-image',
    role: {
      fr: "Les images se « résolvent » de gros pixels vers la pleine définition. Au survol, l'original en couleur se dévoile en cercle depuis le curseur.",
      en: 'Images "resolve" from big pixels to full definition. On hover, the colour original is revealed in a circle from the cursor.',
    },
    why: {
      fr: "Toutes les images du site passent en noir et blanc tramé pour rester dans l'identité ; ce composant permet quand même de voir le vrai visuel.",
      en: 'Every image on the site is dithered black and white to stay on brand; this component still lets you see the real visual.',
    },
    how: {
      fr: 'Canvas 2D : l’image est réduite puis agrandie sans lissage, en 7 étapes (64 → 1 px). Le dévoilement est un clip-path circulaire en CSS, positionné par des variables.',
      en: 'Canvas 2D: the image is shrunk then enlarged without smoothing, in 7 steps (64 → 1 px). The reveal is a CSS circular clip-path positioned through variables.',
    },
    score: 3,
    verdict: {
      fr: 'Résout un vrai problème (identité vs lisibilité des projets). Sur tactile, l’original se dévoile seul après l’animation.',
      en: 'Solves a real problem (brand vs readable projects). On touch screens, the original reveals itself after the animation.',
    },
    cost: { fr: 'Faible. 7 dessins, puis plus rien.', en: 'Low. 7 draws, then nothing.' },
    stack: ['Canvas 2D', 'clip-path', 'IntersectionObserver'],
  },
  {
    id: 'manifesto',
    name: 'ManifestoBand',
    file: 'components/ManifestoBand.tsx',
    demo: 'manifesto',
    role: {
      fr: "La bande de mots géants qui défile. Elle accélère, s'incline et change de sens selon le défilement.",
      en: 'The band of giant scrolling words. It speeds up, skews and reverses with scrolling.',
    },
    why: {
      fr: 'Une respiration entre le hero et la section À propos, et une façon de dire en trois mots ce que je fais.',
      en: 'A breather between the hero and the About section, and a way to say what I do in three words.',
    },
    how: {
      fr: "La vitesse de défilement (Lenis) est lue à chaque image par le ticker GSAP : elle pilote la translation et l'inclinaison (skewX). Le contenu est dupliqué pour boucler sans couture.",
      en: 'Scroll velocity (Lenis) is read every frame by the GSAP ticker: it drives translation and skewX. The content is duplicated to loop seamlessly.',
    },
    score: 2,
    verdict: {
      fr: "Joli, mais c'est un classique du genre. Défilez la page pour le voir réagir.",
      en: "Nice, but a genre classic. Scroll the page to see it react.",
    },
    cost: { fr: 'Faible. Uniquement des transformations CSS.', en: 'Low. CSS transforms only.' },
    stack: ['GSAP ticker', 'Lenis', 'CSS transforms'],
  },
  {
    id: 'cursor',
    name: 'CustomCursor',
    file: 'components/CustomCursor.tsx',
    demo: 'cursor',
    role: {
      fr: 'Un point et un réticule qui remplacent le curseur. Libellés contextuels et boutons magnétiques.',
      en: 'A dot and a reticle replacing the cursor. Contextual labels and magnetic buttons.',
    },
    why: {
      fr: "Rendre la navigation plus tactile et donner des indices (« Voir », « Ouvrir ») sans ajouter de texte à l'interface.",
      en: 'Make navigation feel more tactile and give hints ("View", "Open") without adding text to the UI.',
    },
    how: {
      fr: "Deux éléments suivis avec gsap.quickTo à des vitesses différentes (le réticule traîne). N'importe quel élément peut s'abonner avec data-cursor=\"Texte\" ou data-magnetic, sans toucher au composant.",
      en: 'Two elements tracked with gsap.quickTo at different speeds (the reticle lags). Any element opts in with data-cursor="Text" or data-magnetic, without touching the component.',
    },
    score: 2,
    verdict: {
      fr: "Bonne API par attributs. Désactivé sur tactile et quand l'utilisateur demande moins d'animations : le curseur système revient.",
      en: 'Nice attribute-based API. Disabled on touch and when the user prefers reduced motion: the system cursor comes back.',
    },
    cost: { fr: 'Très faible.', en: 'Very low.' },
    stack: ['GSAP quickTo', 'Data attributes'],
  },
  {
    id: 'negative',
    name: 'NegativeMode',
    file: 'components/NegativeMode.tsx',
    demo: 'negative',
    role: {
      fr: "Un easter egg : tout le site s'inverse en négatif, avec un dévoilement circulaire.",
      en: 'An easter egg: the whole site flips to negative, with a circular reveal.',
    },
    why: {
      fr: 'Récompenser les curieux. Le secret : le Konami code (↑ ↑ ↓ ↓ ← → ← → B A), ou 5 tapotements sur le logo « CD » sur mobile.',
      en: 'Reward the curious. The secret: the Konami code (↑ ↑ ↓ ↓ ← → ← → B A), or 5 taps on the "CD" logo on mobile.',
    },
    how: {
      fr: "Une classe sur <html> inverse les couleurs ; la View Transitions API anime le passage d'un état à l'autre. Repli instantané sur les navigateurs qui ne la gèrent pas.",
      en: 'A class on <html> inverts colours; the View Transitions API animates the switch. Instant fallback in browsers without it.',
    },
    score: 3,
    verdict: {
      fr: "Original et quasiment gratuit en code. C'est le genre de détail dont les visiteurs parlent.",
      en: 'Original and almost free in code. The kind of detail visitors talk about.',
    },
    cost: { fr: 'Nul au repos.', en: 'Zero at rest.' },
    stack: ['View Transitions API', 'CSS'],
  },
  {
    id: 'expandable',
    name: 'Expandable · pixel type',
    file: 'components/ui/Expandable.tsx',
    demo: 'expandable',
    role: {
      fr: "Le « Lire la suite » du site sur mobile. À l'ouverture, des pixels partent du bord replié et viennent former les mots cachés, ligne après ligne en descendant, puis le vrai texte prend le relais. À la fermeture, le texte se défait en pixels qui remontent.",
      en: 'The site’s mobile "Read more". On opening, pixels leave the folded edge and assemble the hidden words, line after line going down, then the real text takes over. On closing, the text breaks back into pixels that fly up.',
    },
    why: {
      fr: "Sur mobile, les expériences et les listes des études de cas étaient tronquées sans moyen de tout lire. Il fallait un dépliage, et je voulais qu'il reste dans le thème du site : des pixels, deux couleurs.",
      en: 'On mobile, experience entries and case-study lists were truncated with no way to read everything. They needed to expand, and I wanted it to stay on theme: pixels, two colours.',
    },
    how: {
      fr: "Chaque mot caché est mesuré là où le navigateur l'a mis en page (Range.getClientRects), redessiné hors écran sur un canvas, puis échantillonné en pixels de 2 px. Chaque pixel vole du bord replié vers sa place avec un délai proportionnel à sa hauteur. Pendant ce temps, un masque CSS cache le vrai texte, qui apparaît en fondu à la fin. Le libellé du bouton se décode, et son « + » de 5 pixels se réorganise en « − ».",
      en: 'Each hidden word is measured where the browser laid it out (Range.getClientRects), redrawn off-screen on a canvas, then sampled into 2 px pixels. Each pixel flies from the folded edge to its spot, with a delay proportional to its height. Meanwhile a CSS mask hides the real text, which fades in at the end. The button label decodes itself and its 5-pixel "+" rearranges into "−".',
    },
    score: 3,
    verdict: {
      fr: "Un détail utile ET signature : il résout un vrai problème de lecture sur mobile. Respecte « réduire les animations » (ouverture instantanée). Sur ordinateur, le texte est simplement affiché en entier.",
      en: 'A useful detail AND a signature: it fixes a real mobile reading problem. Honours reduced motion (instant opening). On desktop the full text is simply shown.',
    },
    cost: {
      fr: "Faible et ponctuel : un canvas le temps de l'animation (≈ 1,5 s, 7 000 pixels maximum), puis plus rien.",
      en: 'Low and short-lived: one canvas for the length of the animation (≈ 1.5 s, 7,000 pixels max), then nothing.',
    },
    stack: ['Canvas 2D', 'Range API', 'CSS mask', 'Web Animations API'],
  },
  {
    id: 'counter',
    name: 'Counter',
    file: 'components/ui/Counter.tsx',
    demo: 'counter',
    role: {
      fr: "Les chiffres qui défilent jusqu'à leur valeur (nombre de projets, de dépôts…).",
      en: 'Numbers that roll up to their value (number of projects, repositories…).',
    },
    why: {
      fr: 'Donner du poids aux chiffres clés et un rythme aux en-têtes de page.',
      en: 'Give weight to key numbers and rhythm to page headers.',
    },
    how: {
      fr: 'Une boucle requestAnimationFrame avec easing, déclenchée une seule fois à l’entrée dans l’écran. Zéros de tête pour que la largeur ne bouge pas.',
      en: 'A requestAnimationFrame loop with easing, triggered once on entering the viewport. Leading zeros so the width never shifts.',
    },
    score: 1,
    verdict: {
      fr: 'Utile mais banal. Il a sa place, pas plus.',
      en: 'Useful but ordinary. It earns its place, nothing more.',
    },
    cost: { fr: 'Très faible.', en: 'Very low.' },
    stack: ['requestAnimationFrame', 'IntersectionObserver'],
  },
  {
    id: 'journey',
    name: 'JourneySection',
    file: 'components/JourneySection.tsx',
    seeOn: '/#about',
    role: {
      fr: 'Le trajet La Réunion → Saguenay sur un globe tramé, avec le compteur de kilomètres.',
      en: 'The Réunion → Saguenay journey on a dithered globe, with a kilometre counter.',
    },
    why: {
      fr: 'Raconter mon parcours visuellement plutôt que par une phrase.',
      en: 'Tell my story visually rather than with a sentence.',
    },
    how: {
      fr: "Globe en points calculés à partir d'un masque des terres, arc de grand cercle (formule de la distance orthodromique), progression liée au défilement avec un épinglage sur grand écran.",
      en: 'A dot globe built from a land mask, a great-circle arc, progress tied to scrolling with pinning on large screens.',
    },
    score: 2,
    verdict: {
      fr: "Plus personnel que technique, mais c'est ce qui rend la page À propos mémorable. Pas de démo isolée ici : il a besoin du défilement de la page.",
      en: "More personal than technical, but it makes the About page memorable. No isolated demo here: it needs the page scroll.",
    },
    cost: { fr: 'Moyen pendant le défilement, nul ensuite.', en: 'Medium while scrolling, zero afterwards.' },
    stack: ['Canvas 2D', 'ScrollTrigger', 'Géodésie'],
  },
  {
    id: 'stars',
    name: 'Star hunt · StarGame',
    file: 'contexts/StarContext.tsx',
    seeOn: '/',
    role: {
      fr: "Des étoiles cachées dans tout le site. Les trouver toutes débloque un mini-jeu.",
      en: 'Stars hidden all over the site. Finding them all unlocks a mini-game.',
    },
    why: {
      fr: "Faire explorer le site en entier au lieu de survoler l'accueil.",
      en: 'Get people to explore the whole site instead of skimming the home page.',
    },
    how: {
      fr: 'Un contexte React garde la progression (sauvegardée localement), une notification donne un indice pour la suivante. Le jeu est chargé seulement une fois débloqué.',
      en: 'A React context keeps progress (saved locally), a notification hints at the next one. The game only loads once unlocked.',
    },
    score: 2,
    verdict: {
      fr: 'Bonne idée pour l’engagement. Je ne dis pas où elles sont.',
      en: "Good for engagement. I won't say where they are.",
    },
    cost: { fr: 'Nul tant que le jeu n’est pas lancé.', en: 'Zero until the game launches.' },
    stack: ['React Context', 'localStorage', 'Lazy loading'],
  },
  {
    id: 'chatbot',
    name: 'Chatbot',
    file: 'components/Chatbot/',
    seeOn: '/',
    role: {
      fr: "L'assistant en bas à droite qui répond aux questions sur mon parcours.",
      en: 'The assistant in the bottom right that answers questions about my background.',
    },
    why: {
      fr: 'Répondre aux recruteurs à toute heure, sans API payante ni données envoyées à un tiers.',
      en: 'Answer recruiters at any hour, with no paid API and no data sent to a third party.',
    },
    how: {
      fr: 'Moteur local : normalisation du texte, détection d’intentions par mots-clés pondérés, base de connaissances bilingue. Chargé après le contenu principal.',
      en: 'Local engine: text normalisation, intent detection with weighted keywords, a bilingual knowledge base. Loaded after the main content.',
    },
    score: 2,
    verdict: {
      fr: "Intéressant côté logique, moins côté visuel. Il ne remplace pas un vrai modèle de langage, mais il ne coûte rien et ne fuit rien.",
      en: "Interesting logic-wise, less so visually. It won't replace a real language model, but it costs nothing and leaks nothing.",
    },
    cost: { fr: 'Faible, chargé à la demande.', en: 'Low, lazy-loaded.' },
    stack: ['TypeScript', 'NLP maison', 'Lazy loading'],
  },
];

/** Composants retirés du site : gardés ici pour l'historique, c'est aussi ça un lab. */
export const labRetired: { name: string; note: Text }[] = [
  {
    name: 'ThreeScene',
    note: {
      fr: "Grille three.js en fond, première version du site. Remplacée par DitherHero : ~600 Ko de bibliothèque pour une grille, c'était trop.",
      en: 'A three.js background grid, the first version of the site. Replaced by DitherHero: ~600 KB of library for a grid was too much.',
    },
  },
  {
    name: 'ProjectCard',
    note: {
      fr: "Cartes de projets classiques. Remplacées par un index en liste (ProjectIndex), plus éditorial et plus rapide à parcourir.",
      en: 'Classic project cards. Replaced by a list index (ProjectIndex), more editorial and quicker to scan.',
    },
  },
];

export type ExperimentId = 'flow-field' | 'particle-type' | 'reaction-diffusion' | 'ascii';

export type LabExperiment = {
  id: ExperimentId;
  title: string;
  date: string;
  status: Text;
  note: Text;
  hint: Text;
  stack: string[];
};

export const labExperiments: LabExperiment[] = [
  {
    id: 'reaction-diffusion',
    title: 'Gray-Scott',
    date: '2026.10',
    status: { fr: 'En cours', en: 'Ongoing' },
    note: {
      fr: 'Deux substances chimiques simulées qui se nourrissent et se détruisent. Des motifs vivants (coraux, cellules, labyrinthes) émergent de deux équations, sur le GPU, tramés en deux couleurs.',
      en: 'Two simulated chemicals feeding on and destroying each other. Living patterns (coral, cells, mazes) emerge from two equations, on the GPU, dithered in two colours.',
    },
    hint: { fr: 'Cliquez et glissez pour semer', en: 'Click and drag to seed' },
    stack: ['WebGL2', 'Ping-pong FBO', 'Gray-Scott'],
  },
  {
    id: 'particle-type',
    title: 'Type as matter',
    date: '2026.10',
    status: { fr: 'Stable', en: 'Stable' },
    note: {
      fr: 'Un mot échantillonné en points, chaque point est une particule avec un ressort qui la ramène à sa place. Le curseur souffle dessus. Tapez votre propre mot.',
      en: 'A word sampled into dots, each dot a particle on a spring pulling it home. The cursor blows them away. Type your own word.',
    },
    hint: { fr: 'Survolez · cliquez pour exploser', en: 'Hover · click to explode' },
    stack: ['Canvas 2D', 'Physique de ressorts'],
  },
  {
    id: 'flow-field',
    title: 'Flow field',
    date: '2026.10',
    status: { fr: 'Stable', en: 'Stable' },
    note: {
      fr: 'Des milliers de particules suivent un champ de directions qui ondule dans le temps. Elles laissent une trace d’encre qui s’efface lentement. Le curseur crée un tourbillon.',
      en: 'Thousands of particles follow a direction field that ripples over time. They leave a slowly fading ink trail. The cursor creates a vortex.',
    },
    hint: { fr: 'Bougez la souris dans le cadre', en: 'Move the mouse inside the frame' },
    stack: ['Canvas 2D', 'Champs vectoriels'],
  },
  {
    id: 'ascii',
    title: 'ASCII globe',
    date: '2026.10',
    status: { fr: 'Archivée', en: 'Archived' },
    note: {
      fr: 'Une sphère en rotation rendue en caractères. Prévue pour le hero, abandonnée au profit de la version WebGL tramée, mais trop jolie pour être supprimée.',
      en: 'A rotating sphere rendered in characters. Meant for the hero, dropped for the dithered WebGL version, but too pretty to delete.',
    },
    hint: { fr: 'Rien à faire, regardez', en: 'Nothing to do, just watch' },
    stack: ['Canvas 2D', 'ASCII'],
  },
];
