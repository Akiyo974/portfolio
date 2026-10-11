import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ArrowUpRight, Star } from 'lucide-react';
import { customProjects } from '../../data/customProjects';

interface IndexItem {
  id: number | string;
  name: string;
  description: string;
  html_url: string;
  homepage?: string;
  language: string;
  stargazers_count: number;
  customLabel?: string;
  isCustom?: boolean;
}

/**
 * Index éditorial des projets : une ligne par projet,
 * aperçu tramé qui suit le curseur au survol (pointeur fin uniquement).
 */
export const ProjectIndex: React.FC<{ projects: IndexItem[] }> = ({ projects }) => {
  const { t } = useTranslation();
  const previewRef = useRef<HTMLDivElement>(null);
  const [preview, setPreview] = useState<{ src: string; label: string } | null>(null);
  const [finePointer, setFinePointer] = useState(false);

  useEffect(() => {
    setFinePointer(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
  }, []);

  useEffect(() => {
    const el = previewRef.current;
    if (!el || !finePointer || typeof gsap.quickTo !== 'function') return;
    const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
    const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
    // Aperçu (300 × ~260 px) gardé dans l'écran, sous l'en-tête, et basculé à gauche près du bord droit
    const onMove = (e: PointerEvent) => {
      x(e.clientX + 356 > window.innerWidth ? e.clientX - 356 : e.clientX + 56);
      y(Math.min(Math.max(e.clientY - 150, 72), window.innerHeight - 276));
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [finePointer]);

  if (projects.length === 0) {
    return (
      <div className="border-y border-line py-16 text-center">
        <p className="display text-5xl">{t('ui.noResults')}</p>
        <p className="label mt-3">{t('ui.noResultsHint')}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="label hidden grid-cols-[4rem_1fr_10rem_6rem_2rem] gap-6 border-b border-line pb-3 md:grid">
        <span>N°</span>
        <span>{t('ui.colProject')}</span>
        <span>{t('ui.colStack')}</span>
        <span>{t('ui.colYear')}</span>
        <span />
      </div>

      <ul onPointerLeave={() => setPreview(null)}>
        {projects.map((p, i) => {
          const custom = p.isCustom ? customProjects.find((c) => c.id === p.id) : undefined;
          const title = (custom ? t(`customProjects.${custom.id}.title`, { defaultValue: custom.title }) : p.customLabel || p.name).split(' - ')[0];
          const description = custom ? t(`customProjects.${custom.id}.description`, { defaultValue: custom.description }) : p.description;
          const src = custom ? `/assets/art/${custom.id}-halftone.png` : '/assets/art/noise-square.png';
          const meta = custom?.year ?? (p.stargazers_count > 0 ? `★ ${p.stargazers_count}` : 'GitHub');

          const row = (
            <>
              <span className="label pt-2 text-paper/55 transition-colors group-hover:text-paper">{String(i + 1).padStart(2, '0')}</span>
              <span className="min-w-0">
                <span className="display block truncate text-[clamp(2rem,4.6vw,4.4rem)] transition-transform duration-500 ease-out group-hover:translate-x-3">
                  {title}
                </span>
                <span className="mt-1 line-clamp-1 max-w-2xl text-sm text-paper/50 md:hidden">{description}</span>
              </span>
              <span className="label hidden pt-3 md:block">{p.language || '—'}</span>
              <span className="label hidden items-center gap-1 pt-3 md:flex">
                {!custom && p.stargazers_count > 0 && <Star className="h-3 w-3" aria-hidden="true" />}
                {custom?.year ?? (p.stargazers_count > 0 ? p.stargazers_count : 'GitHub')}
              </span>
              <ArrowUpRight className="mt-3 h-5 w-5 text-paper/55 transition-all duration-500 group-hover:rotate-45 group-hover:text-paper" aria-hidden="true" />
            </>
          );

          const className =
            'group grid grid-cols-[2.5rem_1fr_1.5rem] items-start gap-4 border-b border-line py-5 transition-colors hover:bg-white/[0.025] md:grid-cols-[4rem_1fr_10rem_6rem_2rem] md:gap-6 md:py-6';
          const onEnter = () => setPreview({ src, label: `${p.language || 'Code'} · ${meta}` });

          return (
            <li key={p.id} onPointerEnter={onEnter}>
              {custom ? (
                <Link to={`/project/${custom.id}`} className={className} data-cursor={t('ui.cursorView')}>
                  {row}
                </Link>
              ) : (
                <a href={p.homepage || p.html_url} target="_blank" rel="noopener noreferrer" className={className} data-cursor="GitHub">
                  {row}
                </a>
              )}
            </li>
          );
        })}
      </ul>

      {finePointer && (
        <div
          ref={previewRef}
          className={`pointer-events-none fixed left-0 top-0 z-40 w-[300px] transition-opacity duration-300 ${
            preview ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden="true"
        >
          {preview && (
            <div className="border border-line bg-ink p-1.5">
              <img src={preview.src} alt="" className="aspect-[4/3] w-full object-cover object-top" />
              <p className="label mt-1.5 px-1">{preview.label}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
