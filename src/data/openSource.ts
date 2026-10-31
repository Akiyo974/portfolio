// Contributions à des projets open source d'autres équipes (pull requests ; nombres au 31 octobre 2026)
export interface OpenSourceContribution {
  repo: string;
  name: string;
  about: { fr: string; en: string };
  merged: number;
  open: number;
}

export const openSourceContributions: OpenSourceContribution[] = [
  {
    repo: 'dev-null-sh/dev-null.sh',
    name: 'dev-null.sh',
    about: {
      fr: 'Le réseau social pour développeurs (PHP, Tempest) : réactions, mise en sourdine, direct et messages',
      en: 'The social network for developers (PHP, Tempest): reactions, timeouts, live and messages',
    },
    merged: 6,
    open: 13,
  },
  {
    repo: 'tempestphp/highlight',
    name: 'Tempest Highlight',
    about: {
      fr: 'Coloration de code côté serveur en PHP : rendu des marqueurs et des langages imbriqués',
      en: 'Server-side code highlighting in PHP: rendering of markers and embedded languages',
    },
    merged: 5,
    open: 0,
  },
  {
    repo: 'tempestphp/markdown',
    name: 'Tempest Markdown',
    about: {
      fr: 'Parseur Markdown en PHP : alignement des colonnes de tableau',
      en: 'Markdown parser in PHP: table column alignment',
    },
    merged: 0,
    open: 1,
  },
  {
    repo: 'tempestphp/tempest-framework',
    name: 'Tempest Framework',
    about: {
      fr: "Le framework PHP Tempest : réorganisation du module d'idempotence",
      en: 'The Tempest PHP framework: idempotency module restructuring',
    },
    merged: 0,
    open: 1,
  },
];
