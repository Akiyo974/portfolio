import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight } from 'lucide-react';
import { openSourceContributions } from '../../data/openSource';
import { SectionLabel } from '../ui/Editorial';

/** Contributions à des projets d'autres équipes : une ligne par dépôt, vers mes pull requests. */
export const OpenSourceList: React.FC = () => {
  const { t, i18n } = useTranslation();
  const fr = i18n.language?.startsWith('fr');
  const merged = openSourceContributions.reduce((n, c) => n + c.merged, 0);
  // Seuls les compteurs non nuls sont affichés
  const counts = (c: { merged: number; open: number }) =>
    [c.merged && t('projects.prsMerged', { count: c.merged }), c.open && t('projects.prsOpen', { count: c.open })].filter(Boolean) as string[];

  return (
    <section className="px-4 pb-24 sm:px-6 md:px-10" aria-labelledby="open-source-title">
      <SectionLabel index={2} total={2}>{t('projects.openSource')}</SectionLabel>
      <div className="mt-6 flex flex-col justify-between gap-4 border-b border-line pb-6 md:flex-row md:items-end">
        <h2 id="open-source-title" className="display text-[clamp(2.6rem,7vw,6rem)]">{t('projects.openSourceTitle')}</h2>
        <p className="max-w-md text-sm text-paper/60">{t('projects.openSourceIntro', { count: merged })}</p>
      </div>
      <ul>
        {openSourceContributions.map((c) => (
          <li key={c.repo}>
            <a
              href={`https://github.com/${c.repo}/pulls?q=is%3Apr+author%3AAkiyo974`}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="GitHub"
              className="group grid grid-cols-[1fr_1.5rem] items-start gap-4 border-b border-line py-5 transition-colors hover:bg-white/[0.025] md:grid-cols-[1fr_14rem_2rem] md:gap-6"
            >
              <span className="min-w-0">
                <span className="display block text-[clamp(1.8rem,3.6vw,3.2rem)] transition-transform duration-500 ease-out group-hover:translate-x-3">
                  {c.name}
                </span>
                <span className="mt-1 block max-w-2xl text-sm text-paper/55">{fr ? c.about.fr : c.about.en}</span>
                <span className="label mt-2 block text-paper/45 md:hidden">{counts(c).join(' · ')}</span>
              </span>
              <span className="label hidden pt-3 md:block">
                {counts(c).map((line) => (
                  <span key={line} className="block">{line}</span>
                ))}
              </span>
              <ArrowUpRight className="mt-3 h-5 w-5 text-paper/55 transition-all duration-500 group-hover:rotate-45 group-hover:text-paper" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};
