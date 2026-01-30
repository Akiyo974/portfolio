import webanaImage from '../assets/webana.webp';
import akiProjectImage from '../assets/AkiProject.webp';
import akiMusicImage from '../assets/AkiMusic.webp';

export interface CustomProject {
  id: string;
  name: string;
  title: string;
  description: string;
  longDescription?: string;
  languages: string[];
  topics: string[];
  image: string;
  siteUrl?: string;
  codeUrl?: string;
  siteType?: 'production' | 'demo'; // production = site réel en ligne, demo = projet de démonstration
  features?: string[];
  challenges?: string[];
  technologies?: {
    frontend?: string[];
    backend?: string[];
    tools?: string[];
  };
  year?: string;
  status?: 'completed' | 'in-progress' | 'archived';
  relatedProjects?: string[]; // IDs des projets liés
  isCustom: true; // Toujours true pour différencier des projets GitHub
}

export const customProjects: CustomProject[] = [
  {
    id: 'ctreq',
    name: 'CTREQ',
    title: 'CTREQ - Plateforme Éducative du Québec',
    description: "Refonte complète et fusion de deux sites WordPress (CTREQ + RIRE) en plateforme headless Next.js 13. Migration structurée de +10 types de contenus, architecture cache triple (~50ms), SEO avancé et plan de transfert de compétences pour l'équipe cliente.",
    longDescription: "Projet d'envergure institutionnelle pour le Centre de Transfert pour la Réussite Éducative du Québec : fusion complète de deux plateformes WordPress historiques (CTREQ + RIRE) en un système unifié moderne. Migration structurée de +10 types de contenus personnalisés avec reconstruction complète de l'architecture (CPT + ACF + taxonomies), harmonisation des schémas de données et validation croisée des relations. Architecture headless Next.js 13 App Router avec performances exceptionnelles (<100ms) grâce à une stratégie de cache triple sophistiquée (mémoire + ISR + SWR). Collaboration directe avec la direction du CTREQ sur 6 mois en autonomie complète, incluant analyse des besoins métier, priorisation des demandes, validation continue des livrables avec Caroline B. et Pape-Moussa D. Production du plan de transfert officiel avec documentation technique complète, formation des éditeurs WordPress et procédures de maintenance. Déploiement Next.js standalone sur cPanel avec configuration Passenger, monitoring des logs et tests Lighthouse CI automatisés.",
    languages: ['TypeScript', 'Next.js', 'React', 'GraphQL', 'WordPress'],
    topics: ['nextjs', 'typescript', 'wordpress', 'graphql', 'headless-cms', 'migration', 'devops', 'seo', 'performance', 'accessibility'],
    image: '/assets/ctreq-879.webp',
    siteUrl: 'https://www.ctreq.qc.ca/',
    codeUrl: undefined,
    siteType: 'production',
    features: [
      'Fusion complète de deux sites WordPress historiques (CTREQ + RIRE) en système unifié',
      'Migration structurée de +10 types de contenus : reprise CPT, taxonomies et champs ACF depuis ancien plugin',
      'Reconstruction propre de l\'architecture WordPress avec harmonisation des schémas ACF',
      'Export/Import contrôlé via WP All Export/Import avec validation croisée des données et relations',
      'Plan complet de redirections 301 entre les deux écosystèmes pour préserver le SEO',
      'Architecture headless CMS avec Next.js 13 App Router et React Server Components',
      'Agrégation unifiée de 3 sources WordPress (RIRE, Dossiers thématiques, Ressources) via WPGraphQL',
      'Système de cache triple sophistiqué : mémoire (~50ms) + ISR Next.js + Stale-While-Revalidate',
      'Webhook WordPress pour invalidation automatique du cache en temps réel',
      'SEO avancé : Structured Data JSON-LD (Organization, WebSite, WebPage), sitemaps XML dynamiques',
      'Géolocalisation ciblée Québec (fr-CA) avec métadonnées enrichies et canonical URLs',
      'Interface accessible WCAG AA avec 30+ composants Radix UI (Accordion, Dialog, Select, etc.)',
      'Design system shadcn/ui avec thème Tailwind personnalisé et variables CSS (dark mode ready)',
      'Filtres avancés multi-critères : thèmes éducatifs, types de ressources, niveaux scolaires',
      'Formulaires robustes avec React Hook Form + validation Zod',
      'Content Security Policy stricte et headers de sécurité renforcés (HSTS, X-Frame-Options)',
      'Gestion RGPD complète : consentement cookies, politique de confidentialité',
      'Google Analytics 4 avec tracking d\'événements personnalisés',
      'Déploiement Next.js standalone sur cPanel : Node.js 18 + Passenger + .htaccess optimisé',
      'Scripts de déploiement automatisés avec support des fichiers statiques /_next/',
      'Monitoring & logs structurés : logs serveur Next.js/Express, debugging production cPanel',
      'Tests Lighthouse CI automatisés et logging des webhooks pour intégrité',
      'Production du Plan de transfert officiel : documentation technique complète Next.js/WPGraphQL',
      'Formation des éditeurs WordPress avec procédures d\'ajout de contenu et guide architecture',
      'Breadcrumbs dynamiques, scroll progress indicator et loading states élégants'
    ],
    challenges: [
      'Fusion de deux plateformes WordPress avec historiques différents et détection d\'incohérences',
      'Migration massive : +10 types de contenus, standardisation des données, relations complexes',
      'Reconstruction complète de l\'architecture WordPress (CPT + ACF + taxonomies) sans perte de données',
      'Validation croisée des exports/imports : fichiers médias, taxonomies dynamiques, champs relationnels',
      'Plan de redirections 301 complet pour préserver le référencement des deux sites',
      'Unification de 3 sources WordPress hétérogènes via modèle d\'API GraphQL unifié',
      'Architecture de cache intelligent multicouche avec stratégie SWR pour zéro downtime',
      'Invalidation sélective du cache via webhooks sans impact sur performances globales',
      'SEO multi-environnement avec détection automatique staging/production (X-Robots-Tag)',
      'Performance extrême : First Contentful Paint < 1s, Time to Interactive < 2s, CLS < 0.1',
      'TypeScript strict mode sur 100% de la codebase avec génération automatique des types GraphQL',
      'Gestion complexité GraphQL : résolution du N+1 problem, overfetching via fragments et caching',
      'Déploiement cPanel avec contraintes : Node.js standalone, paths absolus, réécriture Apache',
      'Debug en production : Node.js, rewrite rules, gestion des assets _next/',
      'Collaboration client : échanges réguliers avec direction, analyse besoins métier, priorisation',
      'Autonomie complète sur 6 mois : conception, développement, migration, DevOps, documentation',
      'Production documentation technique pour transfert de compétences à l\'équipe CTREQ',
      'Formation utilisateurs et support post-livraison'
    ],
    technologies: {
      frontend: [
        'Next.js 13.5.1 (App Router)',
        'React 18.2',
        'TypeScript 5.2.2',
        'Tailwind CSS 3.3.3',
        'Framer Motion 11.0',
        'Radix UI (30+ packages)',
        'shadcn/ui',
        'React Hook Form 7.45',
        'Zod 3.22',
        'Embla Carousel 8.0',
        'Lucide React 0.263',
        'next-themes 0.2'
      ],
      backend: [
        'WordPress 6.x',
        'WPGraphQL 1.14',
        'ACF (Advanced Custom Fields)',
        'WP All Export/Import',
        'Node.js 18+',
        'Custom Express Server',
        'GraphQL Code Generator',
        'Apache (Passenger + .htaccess)'
      ],
      tools: [
        'Sharp (image optimization)',
        'Bundle Analyzer',
        'Lighthouse CI',
        'Web Vitals',
        'Google Analytics 4',
        'ESLint + Prettier',
        'Git + GitHub',
        'cPanel + Node.js',
        'PowerShell/Bash scripts',
        'Structured Logging'
      ]
    },
    year: '2025',
    status: 'in-progress',
    relatedProjects: ['ctreq-blog-archive', 'innovations-numeriques-fp'],
    isCustom: true,
  },
  {
    id: 'ctreq-blog-archive',
    name: 'CTREQ Blog/Archive',
    title: 'CTREQ Blog/Archive - Section d\'Archivage Institutionnel',
    description: "Section secondaire du site CTREQ dédiée à l'archivage des anciens projets institutionnels et articles RIRE (3-5 ans). Architecture headless React + WPGraphQL avec filtrage automatique par ancienneté et design minimaliste pour préserver la hiérarchie des contenus.",
    longDescription: "Le Blog / Archive CTREQ est une section secondaire du site du CTREQ conçue pour conserver l'historique des projets institutionnels ainsi que les articles RIRE plus anciens. Lors de la refonte complète du site principal, la direction du CTREQ a souhaité que seuls les contenus récents et stratégiques soient mis en avant. Les anciens projets et les articles de plus de trois ans (jusqu'à cinq ans) devaient être accessibles, mais dans un espace volontairement minimaliste pour ne pas détourner l'attention du site principal. J'ai donc développé une page d'archives headless, intégrée au même WordPress que le site principal, avec une logique avancée de filtrage par ancienneté (CTREQ + RIRE). L'esthétique est volontairement sobre et neutre afin de refléter son rôle : une archive institutionnelle, non un produit phare. Le tout repose sur une architecture moderne en React et WPGraphQL, avec un traitement optimisé des contenus issus de plusieurs sources.",
    languages: ['TypeScript', 'JavaScript', 'React', 'GraphQL', 'WordPress'],
    topics: ['react', 'typescript', 'wordpress', 'headless-cms', 'graphql', 'archive', 'performance', 'minimal-design', 'frontend', 'backend', 'devops', 'wpgraphql', 'ui-ux'],
    image: '/assets/ctreq-archive-878.webp',
    siteUrl: 'https://blog.ctreq.qc.ca/',
    codeUrl: undefined,
    siteType: 'production',
    features: [
      'Affichage des anciens projets CTREQ non visibles sur le site principal',
      'Affichage des articles RIRE anciens (entre 3 et 5 ans d\'ancienneté)',
      'Filtrage automatique par date pour distinguer contenus récents (site principal) et anciens (archive)',
      'Architecture headless unifiée : même WordPress, deux comportements front-end',
      'Endpoint WPGraphQL unique pour les projets CTREQ',
      'Second endpoint WPGraphQL pour les articles RIRE',
      'Fusion de données multi-sources dans React',
      'Interface minimaliste (UX volontairement épurée)',
      'SEO volontairement réduit pour ne pas concurrencer le site principal',
      'Pagination simple et rapide',
      'Pages article / projet dédiées (détails + contenu complet)'
    ],
    challenges: [
      'Unifier deux sources WordPress hétérogènes (CTREQ + RIRE) dans une seule archive',
      'Gérer deux logiques temporelles distinctes : CTREQ (projets actifs vs archivés) et RIRE (3 ans vs 5 ans)',
      'Normalisation des contenus : formats, champs, métadonnées',
      'Design neutre & performance optimisée sans impacter le site principal',
      'Limiter volontairement le SEO de cette section sans bloquer l\'indexation',
      'Gestion automatique du tri par ancienneté (date-based filtering)',
      'Fusion GraphQL multi-endpoints côté front-end',
      'Stabilité du rendu malgré la disparité des schémas WP'
    ],
    technologies: {
      frontend: [
        'React 18',
        'TypeScript',
        'Tailwind CSS',
        'React Router',
        'shadcn/ui',
        'Lucide React',
        'SWR'
      ],
      backend: [
        'WordPress 6.x',
        'WPGraphQL',
        'ACF (Advanced Custom Fields)',
        'WP All Export/Import',
        'Node.js 18',
        'Apache (Passenger + cPanel)',
        'Webhooks WordPress'
      ],
      tools: [
        'ESLint + Prettier',
        'Git + GitHub',
        'Sharp (image optimization)',
        'cPanel + Node.js',
        'Structured Logging',
        'Postman',
        'Lighthouse CI'
      ]
    },
    year: '2025',
    status: 'completed',
    isCustom: true
  },
  {
    id: 'innovations-numeriques-fp',
    name: 'Innovations Numériques FP',
    title: 'Innovations Numériques en Formation Professionnelle',
    description: "Application web interactive développée pour ECOBES (Cégep de Jonquière) en collaboration avec le CTREQ, valorisant les innovations numériques de +40 enseignants en formation professionnelle au Québec. Interface semi-privée avec exploration par secteur, recherche avancée et carte Mapbox interactive.",
    longDescription: "Application web interactive développée pour ECOBES, centre de recherche et de transfert du Cégep de Jonquière, en collaboration avec le CTREQ, le Laboratoire en Innovation Ouverte et l'UQAR, avec le soutien financier du Gouvernement du Québec. L'objectif du projet était de mettre en valeur les innovations numériques réalisées par plus de 40 enseignantes et enseignants en formation professionnelle partout au Québec. Certaines innovations étant sensibles ou internes à des centres de formation, l'application est accessible uniquement via un lien privé (non indexée, non publique). L'outil permet d'explorer ces innovations par secteur de formation, via des fiches descriptives détaillées, ou à travers une carte Mapbox interactive montrant leur distribution géographique à travers la province. L'application possède un mode sombre et un mode clair, offrant une expérience cohérente, moderne et adaptée à différents contextes d'utilisation.",
    languages: ['TypeScript', 'JavaScript', 'React', 'HTML5', 'CSS3'],
    topics: ['react', 'vite', 'mapbox', 'education', 'geolocation', 'dark-mode', 'tailwindcss', 'accessibility', 'interactive-map', 'research'],
    image: '/assets/innovations-numeriques-fp-879.webp',
    siteUrl: undefined, // Application semi-privée, non indexée
    codeUrl: undefined,
    siteType: 'production',
    features: [
      'Exploration par 20 secteurs de formation professionnelle avec icônes illustrées et couleurs thématiques',
      'Recherche intelligente par mots-clés, région, centre de formation ou type d\'apprentissage',
      'Fiches descriptives détaillées : description, objectifs pédagogiques, technologies, impacts',
      'Carte interactive Mapbox avec géolocalisation des innovations à travers le Québec',
      'Markers interactifs avec clustering automatique pour améliorer la lisibilité',
      'Synchronisation zoom/hover entre la liste des innovations et la carte',
      'Mode sombre + mode clair avec transitions fluides (CSS Variables)',
      'Design moderne basé sur palette sombre immersive ou version claire accessible',
      'UX responsive optimisée pour mobile, tablette et desktop',
      'Application semi-privée accessible uniquement via URL directe (non indexée)',
      'Navigation fluide avec React Router 6',
      'Animations élégantes avec Framer Motion',
      'Icônes professionnelles Lucide Icons',
      'Performance optimale avec build Vite ultra rapide',
      'Accessibilité WCAG : contraste, focus states, lecteur d\'écran, navigation clavier',
      'Hébergement Apache (cPanel) avec configuration optimisée',
      'Tracking Google Analytics 4 pour analyse d\'usage'
    ],
    challenges: [
      'Nettoyage et structuration des données fournies en formats variés (Word, PDF, textes, emails)',
      'Normalisation des contenus + catégorisation par secteur + géolocalisation précise',
      'Implémentation avancée Mapbox GL : clustering dynamique, markers custom',
      'Synchronisation bidirectionnelle liste ↔ carte en temps réel',
      'Optimisation des performances sur grande surface géographique (Québec entier)',
      'Architecture front-end performante avec routing React Router et build Vite',
      'Gestion des variables CSS pour mode sombre/clair avec transitions élégantes',
      'Design UX cohérent entre les deux thèmes (sombre immersif, clair accessible)',
      'Accessibilité complète : contraste suffisant, états de focus, compatibilité lecteurs d\'écran',
      'Navigation clavier intuitive pour tous les composants interactifs',
      'Application semi-privée : configuration pour éviter indexation (robots.txt, meta noindex)',
      'Déploiement Apache/cPanel avec configuration .htaccess pour SPA React',
      'Intégration Google Analytics 4 pour suivi d\'usage sans compromettre la confidentialité',
      'Collaboration multi-partenaires : ECOBES, CTREQ, Labo Innovation Ouverte, UQAR',
      'Respect des contraintes de confidentialité pour innovations sensibles'
    ],
    technologies: {
      frontend: [
        'React 18',
        'TypeScript',
        'Vite',
        'React Router 6',
        'Tailwind CSS 3',
        'Framer Motion',
        'Lucide Icons',
        'Mapbox GL JS',
        'CSS Variables (theming)'
      ],
      backend: [
        'Données JSON structurées',
        'Apache (cPanel)',
        'Mapbox API (tiles, geocoding)',
        'Configuration .htaccess'
      ],
      tools: [
        'Google Analytics 4',
        'GitHub',
        'VS Code',
        'Wappalyzer',
        'Figma',
        'Photoshop',
        'ESLint + Prettier'
      ]
    },
    year: '2024',
    status: 'completed',
    relatedProjects: ['ctreq'],
    isCustom: true,
  },
  {
    id: 'webana',
    name: 'Webana',
    title: "Webana - L'Art du Katana",
    description: "Site e-commerce démonstratif conçu avec React et TailwindCSS. Il présente l'histoire des katanas et simule leur vente avec des filtres dynamiques, un panier, et un mode clair/sombre.",
    longDescription: "Webana est un projet de site e-commerce dédié à l'univers des katanas japonais. Ce site présente une interface moderne et élégante permettant aux utilisateurs de découvrir l'histoire fascinante des katanas tout en explorant une sélection de produits. Le projet intègre des fonctionnalités avancées comme un système de filtres dynamiques, un panier d'achat fonctionnel, et un thème personnalisable.",
    languages: ['React', 'TypeScript', 'TailwindCSS'],
    topics: ['e-commerce', 'react', 'tailwindcss', 'typescript', 'responsive-design'],
    image: webanaImage,
    siteUrl: 'https://akiyo974.github.io/webana/',
    codeUrl: 'https://github.com/Akiyo974/webana',
    siteType: 'demo',
    features: [
      'Interface e-commerce complète avec catalogue de produits',
      'Système de filtres dynamiques par catégorie et prix',
      'Panier d\'achat avec calcul automatique des totaux',
      'Mode clair/sombre avec persistance des préférences',
      'Design responsive pour mobile, tablette et desktop',
      'Animations fluides et transitions élégantes'
    ],
    challenges: [
      'Gestion d\'état complexe avec React hooks',
      'Optimisation des performances pour le rendu des produits',
      'Création d\'un design unique inspiré de l\'esthétique japonaise'
    ],
    technologies: {
      frontend: ['React 18', 'TypeScript', 'TailwindCSS', 'React Router'],
      tools: ['Vite', 'Git', 'GitHub Pages']
    },
    year: '2024',
    status: 'completed',
    relatedProjects: ['ctreq'],
    isCustom: true,
  },
  {
    id: 'akiproject',
    name: 'AkiProject',
    title: 'AkiProject - Gestionnaire de Tâches',
    description: "Gestionnaire de tâches et messagerie en temps réel développés avec Bootstrap, jQuery, et PHP. Conçu pour démontrer les compétences en communication asynchrone et gestion de tâches dans un contexte académique.",
    longDescription: "AkiProject est une application web complète de gestion de projets et de communication. Elle combine un gestionnaire de tâches intuitif avec un système de messagerie en temps réel, permettant aux équipes de collaborer efficacement. Le projet démontre la maîtrise des technologies web traditionnelles et des concepts de programmation asynchrone.",
    languages: ['PHP', 'JavaScript', 'MySQL'],
    topics: ['task-management', 'php', 'mysql', 'bootstrap', 'jquery', 'ajax'],
    image: akiProjectImage,
    siteUrl: 'https://christenalexisdijoux.techniquesmedia.com/cms1/wr/Workspace/index.php',
    codeUrl: 'https://github.com/Akiyo974/akiproject',
    siteType: 'demo',
    features: [
      'Système d\'authentification sécurisé',
      'Gestion de tâches avec statuts et priorités',
      'Messagerie en temps réel avec AJAX',
      'Tableau de bord avec statistiques',
      'Attribution de tâches aux membres de l\'équipe',
      'Notifications en temps réel'
    ],
    challenges: [
      'Implémentation de la communication asynchrone avec AJAX',
      'Sécurisation de l\'application contre les injections SQL',
      'Gestion des sessions utilisateurs'
    ],
    technologies: {
      frontend: ['Bootstrap', 'jQuery', 'HTML5', 'CSS3'],
      backend: ['PHP 7', 'MySQL'],
      tools: ['phpMyAdmin', 'Git']
    },
    year: '2023',
    status: 'completed',
    isCustom: true
  },
  {
    id: 'akimusic',
    name: 'AkiMusic',
    title: 'AkiMusic - Plateforme de Streaming',
    description: "Projet de démonstration pour une plateforme de streaming musical, conçu pour simuler des fonctionnalités telles que les abonnements et la gestion de playlists. Interface utilisateur complète pour un service de musique en ligne.",
    longDescription: "AkiMusic est un prototype de plateforme de streaming musical créé à des fins éducatives. Bien qu'il ne diffuse pas réellement de musique, le projet illustre parfaitement les concepts d'interface utilisateur pour un service de streaming, incluant la navigation, la gestion de playlists, et un système d'abonnement simulé.",
    languages: ['PHP', 'JavaScript', 'Bootstrap'],
    topics: ['streaming', 'php', 'bootstrap', 'jquery', 'ui-design'],
    image: akiMusicImage,
    siteUrl: 'https://christenalexisdijoux.techniquesmedia.com/AkiMusic/index.php#',
    siteType: 'demo',
    features: [
      'Interface utilisateur inspirée des plateformes de streaming modernes',
      'Système de playlists personnalisées',
      'Simulation d\'abonnements et de plans tarifaires',
      'Navigation intuitive entre artistes, albums et chansons',
      'Design responsive adapté aux appareils mobiles'
    ],
    challenges: [
      'Conception d\'une UX/UI similaire aux grandes plateformes',
      'Organisation de la structure de données pour les médias',
      'Création d\'une interface responsive complexe'
    ],
    technologies: {
      frontend: ['Bootstrap', 'jQuery', 'HTML5', 'CSS3'],
      backend: ['PHP'],
      tools: ['Git']
    },
    year: '2023',
    status: 'archived',
    isCustom: true
  },
  {
    id: 'akiworkspace',
    name: 'AkiWorkspace',
    title: 'AkiWorkspace - Workspace Personnel Sécurisé',
    description: "Application privée de gestion d'idées, notes, tâches et projets avec architecture full-stack moderne, sécurité renforcée et système de partage granulaire. SaaS personnel inspiré de Notion/Linear.",
    longDescription: "Conception et développement complet d'une application web type workspace personnel sécurisé, permettant de centraliser notes, idées, tâches et projets dans une interface moderne. Architecture server-first basée sur Next.js App Router + Server Actions, avec logique métier entièrement côté serveur, validation stricte TypeScript + Zod et base de données Prisma. Le projet met l'accent sur la sécurité par défaut (private-first), la performance (React Server Components, streaming, cache intelligent), la DX moderne (Type-safe, Prisma, hot reload, migrations) et un système de permissions avancé avec partage public/secret/groupé. Développé comme produit SaaS personnel, avec authentification complète, rôles admin, onboarding utilisateur, documentation technique et guide utilisateur.",
    languages: ['TypeScript', 'JavaScript', 'SQL'],
    topics: ['saas', 'nextjs', 'prisma', 'security', 'full-stack', 'server-actions', 'authentication', 'workspace', 'productivity'],
    image: '/assets/akiworkspace.webp',
    siteUrl: undefined,
    codeUrl: undefined,
    siteType: undefined,
    features: [
      'Authentification obligatoire avec NextAuth v5 (JWT sécurisés)',
      'Vérification d\'email à l\'inscription',
      'Dashboard privé avec CRUD complet (notes, idées, tâches, projets)',
      'Multi-catégories & multi-tags (relations many-to-many Prisma)',
      'Éditeur Markdown riche',
      'Priorités P1/P2/P3 + épinglage',
      'Visibilité granulaire : PRIVATE, PUBLIC, UNLISTED (lien secret), SHARED (groupes)',
      'Partage d\'items individuels ou collections complètes via slug public',
      'Multi-sélection + actions groupées',
      'Modal public optimisé lecture + mode "article"',
      'Panel admin (gestion utilisateurs + rôles)',
      'Tutoriel d\'onboarding interactif',
      'Déconnexion automatique pour sécurité',
      'Design system custom (Tailwind + composants UI réutilisables)',
      'React Server Components (SSR par défaut)',
      'Server Actions (logique métier server-side uniquement)',
      'Streaming + Suspense',
      'Speed Insights (Core Web Vitals)'
    ],
    challenges: [
      'Architecture full Server Actions sans API REST',
      'Validation type-safe client/serveur partagée',
      'Système de permissions fin (owner, shared, public, unlisted)',
      'Partage public sécurisé sans indexation SEO',
      'Protection XSS/CSRF complète',
      'Design system scalable',
      'Gestion état serveur + revalidation RSC',
      'Structure Prisma many-to-many performante',
      'Déploiement production PostgreSQL',
      'Hash bcrypt (cost 12)',
      'Sessions JWT httpOnly + secure',
      'Sanitization DOMPurify contre XSS',
      'Content Security Policy',
      'Validation Zod côté serveur uniquement',
      'Rate limiting (inscription / admin)',
      'Ownership checks sur chaque action',
      'Headers sécurité (HSTS, X-Frame-Options, nosniff)',
      'Blocage protocoles dangereux (javascript:, data:, file:)'
    ],
    technologies: {
      frontend: ['Next.js 14', 'React', 'TypeScript', 'TailwindCSS', 'Framer Motion'],
      backend: ['Prisma ORM', 'PostgreSQL', 'SQLite', 'NextAuth v5', 'Zod', 'Node.js'],
      tools: ['Server Actions', 'React Server Components', 'DOMPurify', 'bcrypt']
    },
    year: '2026',
    status: 'in-progress',
    isCustom: true
  }
];
