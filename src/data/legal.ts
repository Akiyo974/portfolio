/**
 * Contenu des pages légales (FR / EN), rédigé d'après ce que fait réellement le site :
 * services chargés, stockage local, données du formulaire et du jeu. À tenir à jour à chaque
 * ajout de service tiers. Cadre : Loi 25 (Québec), LPRPDE (Canada) et RGPD (visiteurs de l'UE).
 */
export type Lang = 'fr' | 'en';
export type T = string | Record<Lang, string>;
export type Block =
  | { p: T }
  | { list: T[] }
  | { table: { head: T[]; rows: T[][] } }
  | { note: T };
export type LegalSection = { id: string; title: T; blocks: Block[] };
export type LegalDoc = {
  title: T;
  kicker: T;
  updated: string; // AAAA-MM-JJ
  summary: { title: T; items: T[] };
  sections: LegalSection[];
};

export const tr = (lang: Lang, t: T) => (typeof t === 'string' ? t : t[lang]);

const EMAIL = 'christen.dijoux@gmail.com';

/* -------------------------------------------------------------------------- */
/*                         Politique de confidentialité                        */
/* -------------------------------------------------------------------------- */

export const privacy: LegalDoc = {
  title: { fr: 'Confidentialité', en: 'Privacy' },
  kicker: { fr: 'Politique de confidentialité', en: 'Privacy policy' },
  updated: '2026-10-12',
  summary: {
    title: { fr: 'En bref', en: 'In short' },
    items: [
      { fr: "Aucune publicité, aucune revente de données, aucun cookie propre au site.", en: 'No advertising, no data resale, no first-party cookies.' },
      { fr: "Les statistiques (Google Analytics) et le suivi des erreurs (Sentry) ne se chargent qu'après votre accord explicite. Vous pouvez le retirer à tout moment.", en: 'Analytics (Google Analytics) and error tracking (Sentry) only load after your explicit consent, which you can withdraw at any time.' },
      { fr: "Le formulaire de contact ne sert qu'à vous répondre.", en: 'The contact form is only used to reply to you.' },
      { fr: "L'assistant du site fonctionne entièrement dans votre navigateur : rien n'est envoyé.", en: 'The site assistant runs entirely in your browser: nothing is sent.' },
    ],
  },
  sections: [
    {
      id: 'responsable',
      title: { fr: 'Responsable', en: 'Who is responsible' },
      blocks: [
        { p: { fr: "Ce site est édité par Christen Dijoux, à titre personnel, à Saguenay (Québec, Canada). Christen Dijoux est la personne responsable de la protection des renseignements personnels au sens de la Loi 25.", en: 'This site is published by Christen Dijoux, as an individual, in Saguenay (Québec, Canada). Christen Dijoux is the person in charge of the protection of personal information within the meaning of Québec’s Law 25.' } },
        { p: { fr: `Pour toute question ou demande : ${EMAIL}`, en: `For any question or request: ${EMAIL}` } },
      ],
    },
    {
      id: 'donnees',
      title: { fr: 'Données collectées et finalités', en: 'What is collected and why' },
      blocks: [
        { p: { fr: 'Formulaire de contact', en: 'Contact form' } },
        { list: [
          { fr: 'Données : nom, adresse courriel et message, saisis par vous.', en: 'Data: name, email address and message, entered by you.' },
          { fr: "Finalité : vous répondre. Le message est transmis par EmailJS jusqu'à ma boîte Gmail. Il n'est utilisé à aucune autre fin.", en: 'Purpose: replying to you. The message is relayed by EmailJS to my Gmail inbox and is not used for anything else.' },
        ] },
        { p: { fr: "Statistiques de visite (avec votre accord)", en: 'Visit statistics (with your consent)' } },
        { list: [
          { fr: 'Outil : Google Analytics 4, avec anonymisation de l’adresse IP.', en: 'Tool: Google Analytics 4, with IP anonymisation.' },
          { fr: 'Données : pages vues, durée, type d’appareil et de navigateur, localisation approximative (pays, ville).', en: 'Data: pages viewed, duration, device and browser type, approximate location (country, city).' },
          { fr: 'Finalité : comprendre quelles pages sont utiles et améliorer le site.', en: 'Purpose: understanding which pages are useful and improving the site.' },
        ] },
        { p: { fr: "Suivi des erreurs (avec votre accord)", en: 'Error tracking (with your consent)' } },
        { list: [
          { fr: 'Outil : Sentry. Il enregistre les erreurs techniques (message, navigateur, système, actions ayant précédé l’erreur).', en: 'Tool: Sentry. It records technical errors (message, browser, OS, actions that led to the error).' },
          { fr: "Il enregistre aussi une relecture de session : environ 10 % des visites, et toutes celles où une erreur survient. Les champs de formulaire y sont toujours masqués.", en: 'It also records a session replay of about 10 % of visits and of every visit where an error occurs. Form fields are always masked.' },
          { fr: 'Finalité : corriger les bugs et garder le site stable.', en: 'Purpose: fixing bugs and keeping the site stable.' },
        ] },
        { p: { fr: 'Jeu des étoiles', en: 'Star game' } },
        { list: [
          { fr: "Données : les 3 lettres de votre choix, votre score et la date, conservés dans le classement sur l'hébergement du site.", en: 'Data: the 3 letters you choose, your score and the date, kept in the leaderboard on the site’s hosting.' },
          { fr: "Pour limiter la triche, une empreinte chiffrée et irréversible de votre adresse IP est conservée 10 minutes. L'adresse elle-même n'est jamais enregistrée.", en: 'To limit cheating, an encrypted, irreversible fingerprint of your IP address is kept for 10 minutes; the address itself is never stored.' },
        ] },
        { p: { fr: 'Journaux techniques', en: 'Technical logs' } },
        { list: [
          { fr: "Comme tout site, l'hébergeur (o2switch) et le réseau de diffusion (Cloudflare) traitent votre adresse IP et les informations de requête. C'est nécessaire pour afficher le site et le protéger des attaques.", en: 'As with any website, the host (o2switch) and the delivery network (Cloudflare) process your IP address and request data to serve the site and protect it from attacks.' },
        ] },
      ],
    },
    {
      id: 'tiers',
      title: { fr: 'Services tiers', en: 'Third-party services' },
      blocks: [
        { p: { fr: "Voici les services externes qui reçoivent des données lorsque vous utilisez le site, et à quel moment.", en: 'External services that receive data when you use the site, and when.' } },
        { table: {
          head: [{ fr: 'Service', en: 'Service' }, { fr: 'Rôle', en: 'Role' }, { fr: 'Quand', en: 'When' }, { fr: 'Pays', en: 'Country' }],
          rows: [
            ['o2switch', { fr: 'Hébergement du site et du classement', en: 'Site and leaderboard hosting' }, { fr: 'Toujours', en: 'Always' }, 'France'],
            ['Cloudflare', { fr: 'Diffusion, cache, protection', en: 'Delivery, cache, protection' }, { fr: 'Toujours', en: 'Always' }, { fr: 'Réseau mondial (siège : États-Unis)', en: 'Global network (HQ: USA)' }],
            ['Google Fonts', { fr: 'Polices de caractères', en: 'Typefaces' }, { fr: 'Toujours (votre IP est vue par Google)', en: 'Always (your IP is seen by Google)' }, { fr: 'États-Unis', en: 'USA' }],
            ['GitHub', { fr: 'Liste des dépôts sur la page Projets', en: 'Repository list on the Projects page' }, { fr: 'En ouvrant /projects', en: 'When opening /projects' }, { fr: 'États-Unis', en: 'USA' }],
            ['EmailJS', { fr: 'Envoi du formulaire de contact', en: 'Contact form delivery' }, { fr: 'Quand vous envoyez un message', en: 'When you send a message' }, { fr: 'International', en: 'International' }],
            ['Google Analytics', { fr: 'Statistiques', en: 'Analytics' }, { fr: 'Seulement après accord', en: 'Only after consent' }, { fr: 'États-Unis', en: 'USA' }],
            ['Sentry', { fr: 'Erreurs et relecture de session', en: 'Errors and session replay' }, { fr: 'Seulement après accord', en: 'Only after consent' }, { fr: 'Allemagne (UE)', en: 'Germany (EU)' }],
          ],
        } },
        { note: { fr: "Certains de ces services sont situés hors du Québec : des renseignements peuvent donc y être communiqués. Chaque service applique sa propre politique de confidentialité et ses propres garanties de protection.", en: 'Some of these services are located outside Québec, so information may be communicated there. Each service applies its own privacy policy and protection safeguards.' } },
      ],
    },
    {
      id: 'stockage',
      title: { fr: 'Cookies et stockage local', en: 'Cookies and local storage' },
      blocks: [
        { p: { fr: "Le site ne dépose aucun cookie qui lui soit propre. Il garde seulement quelques préférences dans le stockage de votre navigateur. Elles ne quittent jamais votre appareil.", en: 'The site sets no first-party cookies. It only keeps a few preferences in your browser’s storage, which never leave your device.' } },
        { table: {
          head: [{ fr: 'Clé', en: 'Key' }, { fr: 'Rôle', en: 'Purpose' }, { fr: 'Durée', en: 'Duration' }],
          rows: [
            ['cookie_consent', { fr: 'Mémoriser votre choix de consentement et sa date', en: 'Remember your consent choice and its date' }, { fr: "Jusqu'à ce que vous l'effaciez", en: 'Until you clear it' }],
            ['i18nextLng', { fr: 'Langue choisie (FR / EN)', en: 'Chosen language (FR / EN)' }, { fr: "Jusqu'à ce que vous l'effaciez", en: 'Until you clear it' }],
            ['cd-stars, cd-star-best', { fr: 'Progression de la chasse aux étoiles, meilleur score', en: 'Star hunt progress, best score' }, { fr: "Jusqu'à ce que vous l'effaciez", en: 'Until you clear it' }],
            ['github_repos_cache', { fr: 'Cache de la liste des dépôts GitHub', en: 'GitHub repository list cache' }, '5 min'],
            ['cd-intro-seen, cd-chat-v2', { fr: "Intro déjà vue, conversation avec l'assistant", en: 'Intro already seen, assistant conversation' }, { fr: "Fermeture de l'onglet", en: 'Until the tab closes' }],
          ],
        } },
        { p: { fr: "Si vous acceptez les statistiques, Google Analytics dépose ses propres cookies (_ga, _ga_*), valables 2 ans au plus.", en: 'If you accept analytics, Google Analytics sets its own cookies (_ga, _ga_*), valid for up to 2 years.' } },
      ],
    },
    {
      id: 'consentement',
      title: { fr: 'Consentement', en: 'Consent' },
      blocks: [
        { p: { fr: "À votre première visite, un bandeau vous demande votre accord pour les statistiques et le suivi des erreurs. Rien n'est chargé avant que vous cliquiez sur « Accepter ». Refuser n'empêche pas d'utiliser le site.", en: 'On your first visit, a banner asks for your consent to analytics and error tracking. Nothing loads before you click “Accept”, and declining does not limit the site.' } },
        { p: { fr: "Vous pouvez changer d'avis à tout moment avec le lien « Gérer les cookies », en bas de chaque page.", en: 'You can change your mind at any time with the “Manage cookies” link at the bottom of every page.' } },
      ],
    },
    {
      id: 'conservation',
      title: { fr: 'Durées de conservation', en: 'Retention' },
      blocks: [
        { list: [
          { fr: 'Messages de contact : 6 mois au plus après le dernier échange.', en: 'Contact messages: no more than 6 months after the last exchange.' },
          { fr: 'Statistiques Google Analytics : selon le réglage de conservation de Google Analytics, de 2 à 14 mois.', en: 'Google Analytics data: per Google Analytics’ retention setting, 2 to 14 months.' },
          { fr: 'Erreurs et relectures Sentry : 90 jours au plus.', en: 'Sentry errors and replays: up to 90 days.' },
          { fr: 'Classement du jeu : les 100 meilleurs scores. Empreinte IP : 10 minutes.', en: 'Game leaderboard: the 100 best scores. IP fingerprint: 10 minutes.' },
        ] },
      ],
    },
    {
      id: 'securite',
      title: { fr: 'Sécurité', en: 'Security' },
      blocks: [
        { p: { fr: "Le site est servi uniquement en HTTPS, avec des en-têtes de sécurité stricts (HSTS, politique de sécurité du contenu). Il collecte le minimum de données. Les données du classement et sa clé de signature sont stockées hors de l'espace public du serveur. Pour signaler une faille : /.well-known/security.txt.", en: 'The site is served over HTTPS only with strict security headers (HSTS, content security policy). Data collection is minimal; leaderboard data and its signing key are stored outside the public web root. To report a vulnerability: /.well-known/security.txt.' } },
      ],
    },
    {
      id: 'droits',
      title: { fr: 'Vos droits', en: 'Your rights' },
      blocks: [
        { p: { fr: 'Vous pouvez à tout moment :', en: 'At any time, you can:' } },
        { list: [
          { fr: 'accéder aux renseignements vous concernant et en obtenir une copie, y compris dans un format technologique structuré (portabilité) ;', en: 'access the information about you and obtain a copy, including in a structured technological format (portability);' },
          { fr: 'les faire rectifier ou supprimer ;', en: 'have it corrected or deleted;' },
          { fr: 'retirer votre consentement ;', en: 'withdraw your consent;' },
          { fr: "vous opposer à un traitement ou en demander la limitation (RGPD) ;", en: 'object to or restrict processing (GDPR);' },
          { fr: "demander la cessation de diffusion d'un renseignement, ou la désindexation d'un lien qui y mène (Loi 25).", en: 'ask for information to stop being disseminated, or for a link to it to be de-indexed (Law 25).' },
        ] },
        { p: { fr: `Écrivez-moi à ${EMAIL}. Je réponds dans un délai de 30 jours.`, en: `Write to ${EMAIL}; I reply within 30 days.` } },
        { p: { fr: "Si ma réponse ne vous satisfait pas, vous pouvez vous adresser à la Commission d'accès à l'information du Québec (cai.gouv.qc.ca). Au Canada, l'autorité compétente est le Commissariat à la protection de la vie privée. Dans l'Union européenne, c'est l'autorité de protection des données de votre pays.", en: 'If my answer does not satisfy you, you can contact the Commission d’accès à l’information du Québec (cai.gouv.qc.ca), the Office of the Privacy Commissioner of Canada, or, in the European Union, your country’s data protection authority.' } },
      ],
    },
    {
      id: 'mineurs',
      title: { fr: 'Mineurs', en: 'Minors' },
      blocks: [
        { p: { fr: "Ce site s'adresse à un public professionnel. Il ne collecte pas sciemment de renseignements concernant des personnes de moins de 14 ans.", en: 'This site is aimed at a professional audience and does not knowingly collect information about people under 14.' } },
      ],
    },
    {
      id: 'modifications',
      title: { fr: 'Modifications', en: 'Changes' },
      blocks: [
        { p: { fr: "Cette politique peut évoluer, notamment si un nouveau service est ajouté au site. La date de dernière mise à jour est indiquée en haut de la page.", en: 'This policy may change, in particular when a new service is added. The date of the last update is shown at the top of the page.' } },
      ],
    },
  ],
};

/* -------------------------------------------------------------------------- */
/*                               Mentions légales                              */
/* -------------------------------------------------------------------------- */

export const legal: LegalDoc = {
  title: { fr: 'Mentions légales', en: 'Legal notice' },
  kicker: { fr: 'Mentions légales', en: 'Legal notice' },
  updated: '2026-10-12',
  summary: {
    title: { fr: 'En bref', en: 'In short' },
    items: [
      { fr: 'Site personnel de Christen Dijoux, sans activité commerciale en ligne.', en: 'Personal site of Christen Dijoux, with no online commercial activity.' },
      { fr: 'Hébergé par o2switch (France) et diffusé par Cloudflare.', en: 'Hosted by o2switch (France), delivered by Cloudflare.' },
      { fr: 'Contenus, design et code : tous droits réservés.', en: 'Content, design and code: all rights reserved.' },
    ],
  },
  sections: [
    {
      id: 'editeur',
      title: { fr: 'Éditeur', en: 'Publisher' },
      blocks: [
        { table: {
          head: [{ fr: 'Information', en: 'Item' }, { fr: 'Détail', en: 'Detail' }],
          rows: [
            [{ fr: 'Éditeur et directeur de la publication', en: 'Publisher and editor-in-chief' }, 'Christen Dijoux'],
            [{ fr: 'Statut', en: 'Status' }, { fr: 'Personne physique, site personnel (portfolio)', en: 'Individual, personal site (portfolio)' }],
            [{ fr: 'Localisation', en: 'Location' }, 'Saguenay, Québec, Canada'],
            [{ fr: 'Courriel', en: 'Email' }, EMAIL],
            [{ fr: 'Site', en: 'Website' }, 'https://christendijoux.com'],
          ],
        } },
      ],
    },
    {
      id: 'hebergement',
      title: { fr: 'Hébergement et diffusion', en: 'Hosting and delivery' },
      blocks: [
        { table: {
          head: [{ fr: 'Rôle', en: 'Role' }, { fr: 'Prestataire', en: 'Provider' }],
          rows: [
            [{ fr: 'Hébergeur', en: 'Host' }, 'o2switch — Chemin des Pardiaux, 63000 Clermont-Ferrand, France — +33 4 44 44 60 40 — o2switch.fr'],
            [{ fr: 'Réseau de diffusion et sécurité', en: 'Delivery network and security' }, 'Cloudflare, Inc. — 101 Townsend St., San Francisco, CA 94107, USA — cloudflare.com'],
          ],
        } },
      ],
    },
    {
      id: 'propriete',
      title: { fr: 'Propriété intellectuelle', en: 'Intellectual property' },
      blocks: [
        { p: { fr: "Les textes, visuels, animations, le design et le code de ce site sont la propriété de Christen Dijoux, sauf mention contraire. Toute reproduction, adaptation ou réutilisation, totale ou partielle, demande une autorisation écrite préalable.", en: 'The text, visuals, animations, design and code of this site belong to Christen Dijoux unless stated otherwise. Any reproduction, adaptation or reuse, in whole or in part, requires prior written permission.' } },
        { p: { fr: "Le code source est consultable publiquement sur GitHub à titre de vitrine. Sa publication n'accorde aucune licence d'utilisation (voir le fichier LICENSE du dépôt).", en: 'The source code is publicly viewable on GitHub as a showcase; publishing it grants no licence to use it (see the repository’s LICENSE file).' } },
        { p: { fr: "Les noms, logos et captures des projets clients (CTREQ, ECOBES, etc.) appartiennent à leurs titulaires. Ils sont présentés comme références professionnelles.", en: 'Names, logos and screenshots of client projects (CTREQ, ECOBES, etc.) belong to their respective owners and are shown as professional references.' } },
      ],
    },
    {
      id: 'credits',
      title: { fr: 'Crédits', en: 'Credits' },
      blocks: [
        { list: [
          { fr: 'Design et développement : Christen Dijoux.', en: 'Design and development: Christen Dijoux.' },
          { fr: 'Polices : Big Shoulders Display, Geist et Geist Mono, sous licence SIL Open Font License.', en: 'Typefaces: Big Shoulders Display, Geist and Geist Mono, under the SIL Open Font License.' },
          { fr: 'Données cartographiques du globe : Natural Earth (domaine public).', en: 'Globe map data: Natural Earth (public domain).' },
          { fr: 'Tous les visuels tramés sont générés par le code du site. Aucune image de banque.', en: 'All dithered visuals are generated by the site’s code; no stock imagery.' },
        ] },
      ],
    },
    {
      id: 'responsabilite',
      title: { fr: 'Responsabilité', en: 'Liability' },
      blocks: [
        { p: { fr: "Les informations de ce site sont fournies à titre indicatif et peuvent être modifiées sans préavis. Je m'efforce de les tenir exactes et à jour, sans pouvoir le garantir. Je ne peux pas non plus garantir que le site soit accessible sans interruption.", en: 'Information on this site is provided for guidance and may change without notice. I strive to keep it accurate and up to date but cannot guarantee it, nor uninterrupted availability.' } },
        { p: { fr: "Les liens vers d'autres sites sont fournis pour votre commodité. Je n'ai aucun contrôle sur leur contenu et je décline toute responsabilité à leur égard.", en: 'Links to other sites are provided for convenience; I have no control over their content and accept no responsibility for it.' } },
      ],
    },
    {
      id: 'donnees',
      title: { fr: 'Données personnelles', en: 'Personal data' },
      blocks: [
        { p: { fr: 'La collecte et le traitement des renseignements personnels sont décrits dans la politique de confidentialité : /privacy-policy.', en: 'The collection and processing of personal information is described in the privacy policy: /privacy-policy.' } },
      ],
    },
    {
      id: 'droit',
      title: { fr: 'Droit applicable', en: 'Governing law' },
      blocks: [
        { p: { fr: "Ce site et les présentes mentions sont régis par les lois du Québec et du Canada. Tout litige relève des tribunaux compétents du Québec, sous réserve des règles impératives applicables au consommateur.", en: 'This site and this notice are governed by the laws of Québec and Canada. Any dispute falls under the competent courts of Québec, subject to mandatory consumer rules.' } },
      ],
    },
  ],
};
