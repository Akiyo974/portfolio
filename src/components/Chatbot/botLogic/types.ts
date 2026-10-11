export type Lang = 'fr' | 'en';

/** Action proposée sous une réponse (lien interne, externe, défilement, téléchargement). */
export interface BotAction {
  label: string;
  /** Route interne (react-router) */
  to?: string;
  /** Lien externe ou mailto/tel */
  href?: string;
  /** Id de section à atteindre sur l'accueil */
  scrollTo?: string;
  download?: boolean;
}

export interface BotReply {
  text: string;
  actions?: BotAction[];
  suggestions?: string[];
}

/** Mémoire courte de la conversation (pour les questions de suivi). */
export interface BotContext {
  lastProjectId?: string;
  lastIntent?: string;
}

export interface ProjectInfo {
  id: string;
  name: string;
  title: string;
  description: string;
  year?: string;
  status?: string;
  siteUrl?: string;
  stack: string[];
  features: string[];
  challenges: string[];
  aliases: string[];
}

export interface Knowledge {
  name: string;
  role: string;
  focus: string;
  intro: string;
  location: string;
  availability: string;
  experiences: Array<{ title: string; company: string; period: string; description: string }>;
  education: Array<{ title: string; school: string; period: string }>;
  skills: Array<{ title: string; items: string[] }>;
  projects: ProjectInfo[];
  spokenLanguages: string[];
  interests: string[];
  contact: { email: string; phone: string; linkedin: string; github: string; cv: string };
}
