import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { SectionLabel } from './ui/Editorial';
import { SplitText } from './ui/Kinetic';
import { labIndexComponents, labIndexExperiments } from '../data/labIndex';

// Préchargement du chunk de la page Lab au premier survol / focus : rien n'est téléchargé avant
let prefetched = false;
const prefetchLab = () => {
  if (prefetched) return;
  prefetched = true;
  void import('../pages/LabPage');
};

// Trois pièces fortes en vitrine ; le détail (et les verdicts) reste dans le Lab
const highlights = [
  { href: '/lab#c-dither-hero', name: 'DitherHero', tag: 'WebGL' },
  { href: '/lab#e-reaction-diffusion', name: 'Gray-Scott', tag: 'WebGL2' },
  { href: '/lab#c-negative', name: 'NegativeMode', tagKey: 'lab.easterEgg' },
] as const;

/**
 * Accueil : bande courte vers le Lab. Texte et CSS uniquement, aucune démo chargée ici.
 */
export const LabTeaser: React.FC = () => {
  const { t } = useTranslation();
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <section
      id="lab"
      className="relative scroll-mt-16 border-t border-line px-4 py-14 sm:px-6 md:px-10 md:py-20"
      onPointerEnter={prefetchLab}
      onFocusCapture={prefetchLab}
    >
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="relative">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionLabel index={3} total={4}>{t('lab.kicker')}</SectionLabel>
            <SplitText as="h2" text={t('lab.title')} className="display mt-5 block text-[clamp(2.8rem,6.5vw,6rem)]" />
            <p className="label mt-4 text-paper/70">
              <span className="text-paper">{pad(labIndexComponents.length)}</span> {t('lab.components')} ·{' '}
              <span className="text-paper">{pad(labIndexExperiments.length)}</span> {t('lab.experiments')}
            </p>
          </div>
          <Link to="/lab" data-magnetic className="btn-solid shrink-0 self-start md:self-auto">
            {t('lab.cta')} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        <ul className="mt-10 grid grid-cols-1 border-t border-line md:grid-cols-3 md:gap-8 md:border-t-0">
          {highlights.map((h) => (
            <li key={h.href}>
              <Link
                to={h.href}
                className="group flex items-baseline gap-3 border-b border-line px-1 py-3 transition-colors duration-200 hover:bg-paper hover:text-ink focus:outline-none focus-visible:bg-paper focus-visible:text-ink md:border-t"
              >
                <span className="font-display text-[19px] text-paper transition-colors group-hover:text-ink">{h.name}</span>
                {/* Points de conduite, comme dans une table des matières */}
                <span aria-hidden="true" className="min-w-6 flex-1 translate-y-[-3px] border-b border-dotted border-paper/25 group-hover:border-ink/40" />
                <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-paper/60 transition-colors group-hover:text-ink">
                  {'tagKey' in h ? t(h.tagKey) : h.tag}
                </span>
                <span aria-hidden="true" className="w-3 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default LabTeaser;
