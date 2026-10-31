import { getKnowledge } from './knowledge';
import { BotAction, BotContext, BotReply, Knowledge, Lang, ProjectInfo } from './types';

/* ------------------------------------------------------------------ */
/* Normalisation & correspondance                                      */
/* ------------------------------------------------------------------ */

export const normalize = (text: string): string =>
  ` ${text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/c#/g, 'csharp')
    .replace(/[^a-z0-9+#./ ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()} `;

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Mot-clé entier ; un `*` final accepte toute terminaison (ex. `competen*`). */
const has = (msg: string, keyword: string): boolean => {
  const wild = keyword.endsWith('*');
  const kw = normalize(wild ? keyword.slice(0, -1) : keyword).trim();
  if (!kw) return false;
  const pattern = wild ? `\\s${escape(kw)}[a-z0-9]*\\s` : `\\s${escape(kw)}\\s`;
  return new RegExp(pattern).test(msg);
};

/* ------------------------------------------------------------------ */
/* Intentions                                                           */
/* ------------------------------------------------------------------ */

type IntentKey =
  | 'greeting' | 'thanks' | 'goodbye' | 'bot' | 'about' | 'job' | 'experience' | 'education'
  | 'skills' | 'ai' | 'automation' | 'cloud' | 'projects' | 'availability' | 'contact' | 'cv'
  | 'location' | 'languages' | 'interests' | 'synaptia' | 'help';

const INTENTS: Record<IntentKey, string[]> = {
  greeting: ['bonjour', 'salut', 'hello', 'hi', 'hey', 'bonsoir', 'coucou', 'yo', 'allo', 'good morning', 'good evening'],
  thanks: ['merci', 'thanks', 'thank you', 'thx', 'super', 'parfait', 'great', 'cool'],
  goodbye: ['au revoir', 'bye', 'ciao', 'a plus', 'a bientot', 'see you', 'bonne journee', 'bonne soiree'],
  bot: ['tu es un bot', 'es tu un robot', 'es tu une ia', 'are you a bot', 'are you ai', 'qui es tu', 'who are you', 'chatgpt', 'robot'],
  about: ['qui est', 'presente*', 'a propos', 'about', 'profil', 'profile', 'parle moi de', 'tell me about', 'qui est christen', 'christen', 'dijoux', 'resume toi'],
  job: ['travail*', 'poste', 'metier', 'job', 'role', 'emploi', 'actuellement', 'gagnon', 'work*', 'position', 'current*', 'fait quoi', 'what does'],
  experience: ['experience*', 'carriere', 'career', 'parcours', 'background', 'employeur*', 'emplois', 'previous'],
  education: ['formation*', 'etude*', 'diplome*', 'ecole', 'cegep', 'education', 'school', 'degree', 'study', 'studied', 'certificat*'],
  skills: ['competen*', 'stack', 'technolog*', 'langage*', 'outil*', 'skill*', 'tech', 'maitrise*', 'sais faire', 'can do', 'tools', 'expertise'],
  ai: ['ia', 'intelligence artificielle', 'ai', 'agent*', 'llm', 'rag', 'openai', 'langchain', 'machine learning', 'gpt', 'claude'],
  automation: ['automatis*', 'automation', 'automate', 'n8n', 'workflow*', 'power automate', 'process*'],
  cloud: ['cloud', 'devops', 'azure', 'docker', 'deploy*', 'deploie*', 'infra*', 'serveur*', 'server*', 'hosting', 'monitoring', 'observabilite'],
  projects: ['projet*', 'project*', 'portfolio', 'realisation*', 'travaux', 'case stud*', 'exemple*', 'example*', 'site*'],
  availability: ['disponib*', 'available', 'freelance', 'embauche*', 'hire', 'hiring', 'recrut*', 'mission', 'contrat', 'collaborat*', 'opportunit*', 'tarif*', 'prix', 'price', 'pricing', 'devis', 'quote', 'budget', 'travailler avec', 'work with'],
  contact: ['contact*', 'email', 'mail', 'courriel', 'joindre', 'ecrire', 'telephone', 'phone', 'appeler', 'call', 'linkedin', 'github', 'reach'],
  cv: ['cv', 'resume', 'curriculum', 'pdf'],
  location: ['ou habite*', 'ou es tu', 'ou est il', 'localisation', 'ville', 'saguenay', 'quebec', 'canada', 'where', 'located', 'based', 'adresse'],
  languages: ['langue*', 'parle*', 'anglais', 'francais', 'creole', 'espagnol', 'speak*', 'english', 'french', 'bilingue', 'bilingual'],
  interests: ['loisir*', 'hobbie*', 'hobby', 'passion*', 'interet*', 'temps libre', 'free time', 'snowboard', 'sport*'],
  synaptia: ['synaptia', 'agence', 'agency', 'entreprise', 'company', 'studio', 'societe'],
  help: ['aide', 'help', 'que peux tu', 'what can you', 'options', 'menu', 'sujets', 'topics', 'quoi demander'],
};

// Petits bonus pour départager (une question sur l'IA prime sur un simple "bonjour")
const WEIGHT: Partial<Record<IntentKey, number>> = { greeting: 0.6, thanks: 0.6, about: 0.8, projects: 1.1, availability: 1.2, cv: 1.3 };

export const detectIntent = (msg: string): IntentKey | null => {
  let best: IntentKey | null = null;
  let bestScore = 0;
  (Object.keys(INTENTS) as IntentKey[]).forEach((key) => {
    const hits = INTENTS[key].filter((kw) => has(msg, kw)).length;
    const score = hits * (WEIGHT[key] ?? 1);
    if (score > bestScore) {
      bestScore = score;
      best = key;
    }
  });
  return best;
};

/* ------------------------------------------------------------------ */
/* Entités                                                              */
/* ------------------------------------------------------------------ */

const findProject = (msg: string, k: Knowledge): ProjectInfo | undefined => {
  // Les alias les plus longs d'abord ("ctreq archive" avant "ctreq")
  const candidates = k.projects
    .flatMap((p) => p.aliases.map((a) => ({ p, a: normalize(a).trim() })))
    .sort((x, y) => y.a.length - x.a.length);
  return candidates.find(({ a }) => msg.includes(` ${a} `))?.p;
};

const TECH_ALIASES: Record<string, string> = {
  next: 'Next.js', nextjs: 'Next.js', react: 'React', reactjs: 'React', ts: 'TypeScript', typescript: 'TypeScript',
  js: 'JavaScript', javascript: 'JavaScript', node: 'Node.js', nodejs: 'Node.js', python: 'Python', php: 'PHP',
  csharp: 'C#', sql: 'SQL', mysql: 'MySQL', postgres: 'PostgreSQL', postgresql: 'PostgreSQL', graphql: 'GraphQL',
  wordpress: 'WordPress', wp: 'WordPress', tailwind: 'Tailwind', prisma: 'Prisma', azure: 'Microsoft Azure',
  docker: 'Docker', nginx: 'Nginx', cloudflare: 'Cloudflare', n8n: 'n8n', langchain: 'LangChain', openai: 'OpenAI API',
  'power bi': 'Power BI', 'power apps': 'Power Apps', 'power automate': 'Power Automate', 'dynamics nav': 'Microsoft Dynamics NAV',
  'new relic': 'New Relic', shopify: 'Shopify', jquery: 'jQuery', gsap: 'GSAP', 'three.js': 'Three.js', threejs: 'Three.js',
  sharepoint: 'SharePoint', rag: 'RAG', 'github actions': 'GitHub Actions', 'digitalocean': 'DigitalOcean', linux: 'Linux Administration',
};

const findTech = (msg: string): string | undefined => {
  const keys = Object.keys(TECH_ALIASES).sort((a, b) => b.length - a.length);
  // 'next.js' -> 'nextjs' pour tolérer les deux écritures
  const compact = msg.replace(/\.(?=[a-z])/g, '');
  const hit = keys.find((key) => msg.includes(` ${key} `) || compact.includes(` ${key.replace(/\./g, '')} `));
  return hit ? TECH_ALIASES[hit] : undefined;
};

const techMatches = (item: string, tech: string) => {
  const a = item.toLowerCase();
  const b = tech.toLowerCase();
  return a === b || a.startsWith(`${b} `) || a.includes(b);
};

/* ------------------------------------------------------------------ */
/* Réponses                                                             */
/* ------------------------------------------------------------------ */

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const list = (items: string[], lang: Lang) => {
  if (items.length <= 1) return items.join('');
  const last = items[items.length - 1];
  return `${items.slice(0, -1).join(', ')} ${lang === 'fr' ? 'et' : 'and'} ${last}`;
};

const S = (lang: Lang) => ({
  projects: lang === 'fr' ? 'Ses projets' : 'His projects',
  stack: lang === 'fr' ? 'Sa stack technique' : 'His tech stack',
  experience: lang === 'fr' ? 'Son expérience' : 'His experience',
  availability: lang === 'fr' ? 'Est-il disponible ?' : 'Is he available?',
  contact: lang === 'fr' ? 'Le contacter' : 'Contact him',
  ai: lang === 'fr' ? 'IA & agents' : 'AI & agents',
  projectStack: lang === 'fr' ? 'Quelle stack ?' : 'Which stack?',
  projectChallenges: lang === 'fr' ? 'Les défis techniques ?' : 'Technical challenges?',
  nextProject: lang === 'fr' ? 'Projet suivant' : 'Next project',
  cv: lang === 'fr' ? 'Voir le CV' : 'See the resume',
});

const defaultSuggestions = (lang: Lang) => {
  const s = S(lang);
  return [s.projects, s.stack, s.experience, s.availability, s.contact];
};

const contactActions = (k: Knowledge, lang: Lang): BotAction[] => [
  { label: lang === 'fr' ? 'Écrire un email' : 'Send an email', href: `mailto:${k.contact.email}` },
  { label: lang === 'fr' ? 'Formulaire' : 'Contact form', scrollTo: 'contact' },
  { label: 'LinkedIn', href: k.contact.linkedin },
];

const projectReply = (p: ProjectInfo, lang: Lang): BotReply => {
  const meta = [p.year, p.status].filter(Boolean).join(' · ');
  const actions: BotAction[] = [{ label: lang === 'fr' ? "Lire l'étude de cas" : 'Read the case study', to: `/project/${p.id}` }];
  if (p.siteUrl) actions.push({ label: lang === 'fr' ? 'Voir le site' : 'Visit the site', href: p.siteUrl });
  const s = S(lang);
  return {
    text: `${p.title}${meta ? ` (${meta})` : ''} — ${p.description}${
      p.stack.length ? `\n\n${lang === 'fr' ? 'Stack principale' : 'Main stack'} : ${p.stack.slice(0, 6).join(', ')}.` : ''
    }`,
    actions,
    suggestions: [s.projectStack, s.projectChallenges, s.nextProject],
  };
};

const fallback = (lang: Lang): BotReply => ({
  text:
    lang === 'fr'
      ? "Je n'ai pas bien saisi. Je peux vous parler de son profil, de ses projets, de sa stack, de son expérience, de sa disponibilité ou vous aider à le contacter."
      : "I didn't quite get that. I can tell you about his profile, projects, tech stack, experience, availability, or help you get in touch.",
  suggestions: defaultSuggestions(lang),
});

const intentReply = (intent: IntentKey, k: Knowledge, lang: Lang, ctx: BotContext): BotReply => {
  const fr = lang === 'fr';
  const s = S(lang);
  const current = k.experiences[0];

  switch (intent) {
    case 'greeting':
      return {
        text: pick(
          fr
            ? [`Bonjour ! Je suis l'assistant de ${k.name}. Que voulez-vous savoir ?`, `Salut ! Posez-moi vos questions sur ${k.name} : projets, stack, parcours…`]
            : [`Hi! I'm ${k.name}'s assistant. What would you like to know?`, `Hello! Ask me anything about ${k.name}: projects, stack, background…`]
        ),
        suggestions: defaultSuggestions(lang),
      };
    case 'thanks':
      return { text: fr ? 'Avec plaisir ! Autre chose ?' : 'My pleasure! Anything else?', suggestions: defaultSuggestions(lang) };
    case 'goodbye':
      return {
        text: fr ? 'À bientôt ! Et si vous avez un projet en tête, Christen répond vite.' : 'See you soon! And if you have a project in mind, Christen replies fast.',
        actions: contactActions(k, lang).slice(0, 1),
      };
    case 'bot':
      return {
        text: fr
          ? "Je suis un petit assistant local intégré au portfolio : je réponds à partir du contenu du site, sans envoyer vos messages à un service externe."
          : "I'm a small local assistant built into the portfolio: I answer from the site's content, without sending your messages to any external service.",
        suggestions: defaultSuggestions(lang),
      };
    case 'about':
      return {
        text: `${k.intro}`,
        actions: [{ label: fr ? 'Section À propos' : 'About section', scrollTo: 'about' }, { label: s.cv, to: '/cv' }],
        suggestions: [s.experience, s.stack, s.projects],
      };
    case 'job':
      return {
        text: fr
          ? `Il est actuellement ${current.title} chez ${current.company} (${current.period}). ${current.description}`
          : `He is currently ${current.title} at ${current.company} (${current.period}). ${current.description}`,
        suggestions: [s.experience, s.ai, s.projects],
      };
    case 'experience':
      return {
        text: `${fr ? 'Parcours récent' : 'Recent experience'} :\n${k.experiences.map((e) => `— ${e.title}, ${e.company} (${e.period})`).join('\n')}`,
        actions: [{ label: s.cv, to: '/cv' }],
        suggestions: [s.projects, s.stack, s.availability],
      };
    case 'education':
      return {
        text: `${fr ? 'Formations' : 'Education'} :\n${k.education.map((e) => `— ${e.title}, ${e.school} (${e.period})`).join('\n')}`,
        suggestions: [s.experience, s.stack],
      };
    case 'skills':
      if (ctx.lastProjectId && ctx.lastIntent === 'project') {
        const p = k.projects.find((x) => x.id === ctx.lastProjectId);
        if (p) return { text: `${fr ? 'Stack de' : 'Stack for'} ${p.name} : ${p.stack.join(', ')}.`, actions: [{ label: fr ? "Étude de cas" : 'Case study', to: `/project/${p.id}` }], suggestions: [s.projectChallenges, s.nextProject] };
      }
      return {
        text: `${fr ? 'Ses domaines techniques' : 'His technical areas'} :\n${k.skills.map((c) => `— ${c.title} : ${c.items.slice(0, 5).join(', ')}`).join('\n')}`,
        actions: [{ label: fr ? 'Toutes les compétences' : 'All skills', scrollTo: 'about' }],
        suggestions: [s.ai, s.projects, 'React ?', 'Python ?'],
      };
    case 'ai': {
      const ai = k.skills[1];
      return {
        text: fr
          ? `L'IA appliquée est au cœur de son travail : agents, RAG et intégrations LLM mis en production chez ${current.company}. Outils : ${ai.items.slice(0, 6).join(', ')}.`
          : `Applied AI is central to his work: agents, RAG and LLM integrations shipped to production at ${current.company}. Tools: ${ai.items.slice(0, 6).join(', ')}.`,
        suggestions: [s.projects, s.availability, s.contact],
      };
    }
    case 'automation': {
      const auto = k.skills.find((c) => /automat/i.test(c.title));
      return {
        text: fr
          ? `Il automatise les processus métiers (catalogues, fournisseurs, rapports) avec ${auto?.items.slice(0, 4).join(', ')} et Power Automate — moins de tâches manuelles, plus de fiabilité.`
          : `He automates business processes (catalogs, suppliers, reports) with ${auto?.items.slice(0, 4).join(', ')} and Power Automate — fewer manual tasks, more reliability.`,
        suggestions: [s.ai, s.experience, s.contact],
      };
    }
    case 'cloud': {
      const cloud = k.skills.find((c) => /cloud/i.test(c.title));
      return {
        text: fr
          ? `Côté cloud & DevOps : ${cloud?.items.slice(0, 7).join(', ')}, avec du monitoring New Relic pour l'observabilité.`
          : `Cloud & DevOps: ${cloud?.items.slice(0, 7).join(', ')}, with New Relic monitoring for observability.`,
        suggestions: [s.projects, s.stack],
      };
    }
    case 'projects':
      return {
        text: `${fr ? `${k.projects.length} études de cas, entre autres` : `${k.projects.length} case studies, including`} :\n${k.projects
          .slice(0, 5)
          .map((p) => `— ${p.name}${p.year ? ` (${p.year})` : ''}`)
          .join('\n')}\n\n${fr ? 'Lequel vous intéresse ?' : 'Which one interests you?'}`,
        actions: [{ label: fr ? 'Tous les projets' : 'All projects', to: '/projects' }],
        suggestions: k.projects.slice(0, 4).map((p) => p.name),
      };
    case 'availability':
      return {
        text: fr
          ? `Il est spécialiste en innovation numérique chez Gagnon Frères, à temps plein. Pour un site ou une intégration sur mesure, il travaille aussi avec Synaptia Web, son studio. Le plus simple : lui écrire en décrivant votre besoin.`
          : `He works full time as a digital innovation specialist at Gagnon Frères. For a custom website or integration, he also works through Synaptia Web, his studio. Easiest is to email him with a short description of your needs.`,
        actions: contactActions(k, lang),
      };
    case 'contact':
      return {
        text: fr
          ? `Email : ${k.contact.email}\nTéléphone : ${k.contact.phone}\nIl répond généralement rapidement.`
          : `Email: ${k.contact.email}\nPhone: ${k.contact.phone}\nHe usually replies quickly.`,
        actions: [...contactActions(k, lang), { label: 'GitHub', href: k.contact.github }],
      };
    case 'cv':
      return {
        text: fr ? 'Voici son CV, en ligne ou en PDF.' : 'Here is his resume, online or as a PDF.',
        actions: [
          { label: fr ? 'CV en ligne' : 'Online resume', to: '/cv' },
          { label: fr ? 'Télécharger le PDF' : 'Download PDF', href: k.contact.cv, download: true },
        ],
      };
    case 'location':
      return { text: fr ? `Il est basé à ${k.location}, et travaille aussi à distance.` : `He is based in ${k.location}, and also works remotely.`, suggestions: [s.availability, s.contact] };
    case 'languages':
      return { text: `${fr ? 'Langues parlées' : 'Spoken languages'} : ${list(k.spokenLanguages, lang)}.`, suggestions: [s.experience, s.contact] };
    case 'interests':
      return { text: fr ? `En dehors du code : ${list(k.interests, lang)}.` : `Outside of code: ${list(k.interests, lang)}.`, suggestions: defaultSuggestions(lang) };
    case 'synaptia': {
      const syn = k.experiences.find((e) => /synaptia/i.test(e.company));
      return {
        text: syn ? `${syn.company} — ${syn.title} (${syn.period}). ${syn.description}` : 'Synaptia Web.',
        actions: contactActions(k, lang).slice(0, 1),
        suggestions: [s.availability, s.projects],
      };
    }
    case 'help':
    default:
      return fallback(lang);
  }
};

/* ------------------------------------------------------------------ */
/* Point d'entrée                                                       */
/* ------------------------------------------------------------------ */

const FOLLOW_UPS = {
  stack: ['stack', 'techno*', 'langage*', 'outil*', 'built with', 'tech'],
  challenges: ['defi*', 'challenge*', 'difficult*', 'probleme*', 'problem*'],
  features: ['fonctionnalit*', 'feature*', 'fait quoi', 'what does it'],
  link: ['lien', 'link', 'url', 'voir', 'demo', 'site', 'visit*'],
  next: ['suivant', 'next', 'autre', 'another', 'other'],
};

// Typographie : espace avant les deux-points en français uniquement
const typo = (r: { reply: BotReply; context: BotContext }, lang: Lang) =>
  lang === 'en' ? { ...r, reply: { ...r.reply, text: r.reply.text.replace(/ :(\s|$)/g, ':$1') } } : r;

export const respond = (message: string, lang: Lang, ctx: BotContext = {}): { reply: BotReply; context: BotContext } =>
  typo(answer(message, lang, ctx), lang);

const answer = (message: string, lang: Lang, ctx: BotContext = {}): { reply: BotReply; context: BotContext } => {
  const k = getKnowledge(lang);
  const msg = normalize(message);
  const fr = lang === 'fr';
  const s = S(lang);

  // 1. Projet mentionné explicitement
  const project = findProject(msg, k);
  const intent = detectIntent(msg);
  if (project && intent !== 'contact' && intent !== 'availability') {
    if (FOLLOW_UPS.challenges.some((kw) => has(msg, kw)) && project.challenges.length) {
      return {
        reply: { text: `${fr ? 'Défis sur' : 'Challenges on'} ${project.name} :\n${project.challenges.slice(0, 3).map((c) => `— ${c}`).join('\n')}`, actions: [{ label: fr ? 'Étude de cas' : 'Case study', to: `/project/${project.id}` }], suggestions: [s.projectStack, s.nextProject] },
        context: { lastProjectId: project.id, lastIntent: 'project' },
      };
    }
    return { reply: projectReply(project, lang), context: { lastProjectId: project.id, lastIntent: 'project' } };
  }

  // 2. Questions de suivi sur le dernier projet évoqué
  const last = ctx.lastProjectId ? k.projects.find((p) => p.id === ctx.lastProjectId) : undefined;
  if (last && (!intent || intent === 'projects') && FOLLOW_UPS.next.some((kw) => has(msg, kw))) {
    const next = k.projects[(k.projects.indexOf(last) + 1) % k.projects.length];
    return { reply: projectReply(next, lang), context: { lastProjectId: next.id, lastIntent: 'project' } };
  }
  if (last && !intent) {
    if (FOLLOW_UPS.challenges.some((kw) => has(msg, kw))) {
      return {
        reply: last.challenges.length
          ? { text: `${fr ? 'Défis sur' : 'Challenges on'} ${last.name} :\n${last.challenges.slice(0, 3).map((c) => `— ${c}`).join('\n')}`, suggestions: [s.projectStack, s.nextProject] }
          : { text: fr ? `Pas de défis documentés pour ${last.name}.` : `No documented challenges for ${last.name}.`, suggestions: [s.nextProject] },
        context: ctx,
      };
    }
    if (FOLLOW_UPS.features.some((kw) => has(msg, kw)) && last.features.length) {
      return { reply: { text: `${fr ? 'Fonctionnalités clés' : 'Key features'} :\n${last.features.slice(0, 4).map((f) => `— ${f}`).join('\n')}`, actions: [{ label: fr ? 'Étude de cas' : 'Case study', to: `/project/${last.id}` }], suggestions: [s.projectChallenges, s.nextProject] }, context: ctx };
    }
    if (FOLLOW_UPS.link.some((kw) => has(msg, kw))) {
      const actions: BotAction[] = [{ label: fr ? 'Étude de cas' : 'Case study', to: `/project/${last.id}` }];
      if (last.siteUrl) actions.push({ label: fr ? 'Site en ligne' : 'Live site', href: last.siteUrl });
      return { reply: { text: fr ? `Les liens pour ${last.name} :` : `Links for ${last.name}:`, actions }, context: ctx };
    }
  }
  const aboutPerson = ['sa', 'ses', 'son', 'his', 'christen'].some((w) => has(msg, w));
  if (last && intent === 'skills' && !aboutPerson && FOLLOW_UPS.stack.some((kw) => has(msg, kw)) && msg.trim().split(' ').length <= 4) {
    return { reply: intentReply('skills', k, lang, { ...ctx, lastIntent: 'project' }), context: ctx };
  }

  // 3. Technologie précise
  const tech = findTech(msg);
  if (tech && (!intent || intent === 'skills' || intent === 'projects')) {
    const category = k.skills.find((c) => c.items.some((i) => techMatches(i, tech)));
    const used = k.projects.filter((p) => p.stack.some((i) => techMatches(i, tech)));
    const parts: string[] = [];
    if (category || used.length) parts.push(fr ? `Oui, ${tech} fait partie de sa boîte à outils${category ? ` (${category.title})` : ''}.` : `Yes, ${tech} is part of his toolkit${category ? ` (${category.title})` : ''}.`);
    else parts.push(fr ? `${tech} n'apparaît pas dans ses projets publiés, mais il apprend vite — demandez-lui directement.` : `${tech} doesn't appear in his published projects, but he learns fast — just ask him.`);
    if (used.length) parts.push(`${fr ? 'Utilisé dans' : 'Used in'} : ${list(used.map((p) => p.name), lang)}.`);
    return {
      reply: { text: parts.join(' '), actions: used.slice(0, 2).map((p) => ({ label: p.name, to: `/project/${p.id}` })), suggestions: used.length ? used.slice(0, 3).map((p) => p.name) : defaultSuggestions(lang) },
      context: { lastIntent: 'tech', lastProjectId: used[0]?.id ?? ctx.lastProjectId },
    };
  }

  // 4. Intention générale
  if (intent) return { reply: intentReply(intent, k, lang, ctx), context: { lastIntent: intent, lastProjectId: ctx.lastProjectId } };

  return { reply: fallback(lang), context: ctx };
};

export const welcome = (lang: Lang): BotReply => ({
  text:
    lang === 'fr'
      ? "Bonjour ! Je suis l'assistant de Christen. Posez-moi une question sur ses projets, sa stack ou sa disponibilité."
      : "Hi! I'm Christen's assistant. Ask me about his projects, stack or availability.",
  suggestions: defaultSuggestions(lang),
});
