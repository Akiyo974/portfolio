import type { CustomProject } from './customProjects';

/** Clé i18n du type de projet (projet personnel, mandat client ou expérience en entreprise). */
export const projectKindKey = (project: Pick<CustomProject, 'kind'>) =>
  project.kind === 'professional' ? 'professionalProject' : project.kind === 'client' ? 'clientProject' : 'personalProject';
