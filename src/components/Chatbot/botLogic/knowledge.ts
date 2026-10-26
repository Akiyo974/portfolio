import fr from '../../../i18n/locales/fr.json';
import en from '../../../i18n/locales/en.json';
import { customProjects } from '../../../data/customProjects';
import { skillCategories } from '../../../data/skills';
import { Knowledge, Lang, ProjectInfo } from './types';

/**
 * Base de connaissances de l'assistant, construite à partir des données réelles du site
 * (traductions, projets, compétences) pour ne jamais diverger du contenu affiché.
 */

type Locale = typeof fr;
type ProjectTranslations = Record<string, { title?: string; description?: string; features?: string[]; challenges?: string[] }>;

const locales: Record<Lang, Locale> = { fr, en: en as unknown as Locale };

const statusLabels: Record<Lang, Record<string, string>> = {
  fr: { completed: 'terminé', 'in-progress': 'en cours', archived: 'archivé' },
  en: { completed: 'completed', 'in-progress': 'in progress', archived: 'archived' },
};

// Alias supplémentaires pour reconnaître les projets dans une question
const extraAliases: Record<string, string[]> = {
  akiworkspace: ['aki workspace', 'workspace'],
  'portfolio-watch': ['portfolio watch', 'galaxy watch', 'wear os', 'montre', 'watch', 'smartwatch'],
  ctreq: ['ctreq'],
  'ctreq-blog-archive': ['ctreq blog', 'ctreq archive', 'archive', 'blog archive'],
  'innovations-numeriques-fp': ['innovations numeriques', 'formation professionnelle', 'innovations'],
  webana: ['webana', 'katana'],
  akiproject: ['akiproject', 'aki project'],
  akimusic: ['akimusic', 'aki music'],
};

const buildProjects = (lang: Lang): ProjectInfo[] => {
  const tr = ((locales[lang] as unknown as { customProjects?: ProjectTranslations }).customProjects ?? {}) as ProjectTranslations;
  return customProjects.map((p) => {
    const t = tr[p.id] ?? {};
    const all = Array.from(
      new Set([
        ...p.languages,
        ...(p.technologies?.frontend ?? []),
        ...(p.technologies?.backend ?? []),
        ...(p.technologies?.tools ?? []),
      ])
    );
    // « Kotlin » est inutile à côté de « Kotlin 2.1 » : on garde seulement la mention la plus précise
    const stack = all.filter((tech) => !all.some((other) => other !== tech && other.toLowerCase().startsWith(`${tech.toLowerCase()} `)));
    return {
      id: p.id,
      name: p.name,
      title: t.title ?? p.title,
      description: t.description ?? p.description,
      year: p.year,
      status: p.status ? statusLabels[lang][p.status] : undefined,
      siteUrl: p.siteUrl,
      stack,
      features: t.features ?? p.features ?? [],
      challenges: t.challenges ?? p.challenges ?? [],
      aliases: [p.id.replace(/-/g, ' '), p.name.toLowerCase(), ...(extraAliases[p.id] ?? [])],
    };
  });
};

const cache: Partial<Record<Lang, Knowledge>> = {};

export const getKnowledge = (lang: Lang): Knowledge => {
  if (cache[lang]) return cache[lang]!;
  const L = locales[lang];
  const edu = L.education as unknown as Record<string, { title: string; school: string; period: string }>;

  const k: Knowledge = {
    name: 'Christen Dijoux',
    role: L.hero.role,
    focus: L.hero.roleDetail,
    intro: L.about.intro,
    location: `${L.hero.location}, ${L.hero.region}`,
    availability: L.ui.announce,
    experiences: (L.about.experienceList as Array<{ title: string; company: string; period: string; description: string }>).map((e) => ({
      title: e.title,
      company: e.company,
      period: e.period,
      description: e.description,
    })),
    education: ['tim', 'react', 'gameDesign'].filter((key) => edu[key]).map((key) => ({
      title: edu[key].title,
      school: edu[key].school,
      period: edu[key].period,
    })),
    skills: Object.values(skillCategories).map((c) => ({ title: lang === 'fr' ? c.title : c.titleEn, items: c.skills })),
    projects: buildProjects(lang),
    spokenLanguages:
      lang === 'fr'
        ? ['Français', 'Anglais', 'Créole réunionnais', 'Espagnol (niveau élémentaire)']
        : ['French', 'English', 'Réunion Creole', 'Spanish (basic)'],
    interests:
      lang === 'fr'
        ? ['nouvelles technologies', 'réalité virtuelle', 'snowboard', 'randonnée', 'vélo', 'voyages', 'plein air']
        : ['emerging technologies', 'virtual reality', 'snowboarding', 'hiking', 'cycling', 'travel', 'the outdoors'],
    contact: {
      email: 'christen.dijoux@gmail.com',
      phone: '+1 (418) 376-2612',
      linkedin: 'https://www.linkedin.com/in/christen-dijoux',
      github: 'https://github.com/Akiyo974',
      cv: lang === 'en' ? '/assets/cv-christen-dijoux-en.pdf' : '/assets/cv-christen-dijoux-fr.pdf',
    },
  };
  cache[lang] = k;
  return k;
};
