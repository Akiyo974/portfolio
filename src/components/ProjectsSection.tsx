import React, { useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, ArrowUpRight, ArrowRight } from 'lucide-react';
import { customProjects } from '../data/customProjects';
import { SectionLabel } from './ui/Editorial';
import { PixelImage } from './ui/PixelImage';
import { useProjectTransition } from '../lib/projectTransition';
import { SplitText } from './ui/Kinetic';

gsap.registerPlugin(ScrollTrigger);

/**
 * Projets : galerie horizontale épinglée sur grand écran, pile verticale sur mobile.
 */
// Projets mis en avant sur l'accueil, dans cet ordre (les autres restent dans l'index /projects)
const FEATURED = ['badger', 'ctreq', 'akiworkspace', 'portfolio-watch'];

export const ProjectsSection = () => {
  const { t } = useTranslation();
  const openProject = useProjectTransition();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const featured = FEATURED.map((id) => customProjects.find((p) => p.id === id)).filter((p) => p !== undefined);
  const total = String(featured.length).padStart(2, '0');

  // useLayoutEffect : le pin GSAP est retiré avant que React ne supprime le DOM
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track || typeof gsap.matchMedia !== 'function') return;

    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const distance = () => track.scrollWidth - window.innerWidth;
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressRef.current) progressRef.current.style.transform = `scaleX(${self.progress})`;
          },
        },
      });

      // léger parallaxe des visuels pendant le défilement horizontal
      track.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
        gsap.fromTo(
          el,
          { xPercent: 6 },
          {
            xPercent: -6,
            ease: 'none',
            scrollTrigger: { trigger: el, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
          }
        );
      });
    });

    return () => mm.revert();
  }, []);

  return (
    // Conteneur stable : GSAP y insère son pin-spacer sans perturber React
    <div>
    <section
      ref={sectionRef}
      id="projects"
      className="relative w-full scroll-mt-16 overflow-hidden border-t border-line bg-ink text-paper lg:h-screen"
    >
      <div
        ref={trackRef}
        className="flex flex-col gap-16 px-4 py-20 sm:px-6 md:px-10 lg:h-full lg:w-max lg:flex-row lg:items-stretch lg:gap-0 lg:p-0"
      >
        {/* Panneau d'ouverture */}
        <div className="flex flex-col justify-between lg:h-full lg:w-[44vw] lg:border-r lg:border-line lg:px-10 lg:pb-14 lg:pt-24">
          <div>
            <SectionLabel index={2} total={4}>{t('ui.projectsKicker')}</SectionLabel>
            <SplitText as="h2" text={t('projects.title')} className="display mt-6 block text-[clamp(3.2rem,8vw,9rem)]" />
          </div>
          <div className="mt-8 flex items-end justify-between gap-6">
            <p className="max-w-xs text-paper/60">{t('ui.projectsLead')}</p>
            <p className="label hidden lg:block">{t('ui.dragHint')} →</p>
          </div>
        </div>

        {featured.map((project, index) => (
          <article
            key={project.id}
            className="group flex flex-col lg:h-full lg:w-[62vw] lg:border-r lg:border-line lg:px-10 lg:pb-14 lg:pt-24 xl:w-[56vw]"
          >
            <div className="label mb-5 flex items-baseline justify-between">
              <span>
                <span className="text-paper">{String(index + 1).padStart(2, '0')}</span> / {total}
              </span>
              <span>
                {t('projects.personalProject')}
                {project.year ? ` · ${project.year}` : ''}
              </span>
            </div>

            <Link
              to={`/project/${project.id}`}
              onClick={(e) => openProject(e, project.id, e.currentTarget.querySelector<HTMLElement>('[role="img"]'))}
              data-cursor={t('ui.cursorView')}
              aria-label={`${t('projects.viewDetails')} — ${t(`customProjects.${project.id}.title`, { defaultValue: project.title })}`}
              className="relative block overflow-hidden lg:min-h-0 lg:flex-1"
            >
              <div data-parallax className="h-full w-full lg:absolute lg:inset-y-0 lg:-left-[6%] lg:w-[112%]">
                <PixelImage
                  src={`/assets/art/${project.id}-halftone.png`}
                  original={project.image}
                  alt={`Aperçu du projet ${t(`customProjects.${project.id}.title`, { defaultValue: project.title })}`}
                  position="top"
                  className="aspect-[4/3] h-full w-full lg:aspect-auto"
                />
              </div>
            </Link>

            <div className="mt-6 grid gap-5 lg:grid-cols-12 lg:gap-8">
              <h3 className="heading text-[clamp(2rem,3.2vw,3.4rem)] lg:col-span-6">{t(`customProjects.${project.id}.title`, { defaultValue: project.title })}</h3>
              <div className="lg:col-span-6">
                <p className="line-clamp-2 leading-relaxed text-paper/65 md:line-clamp-3">{t(`customProjects.${project.id}.description`, { defaultValue: project.description })}</p>
                <div className="mt-4 flex flex-wrap gap-1.5 max-md:hidden">
                  <h4 className="sr-only">{t('projects.technologies')}</h4>
                  {project.languages.slice(0, 5).map((lang) => (
                    <span key={lang} className="chip">{lang}</span>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link
                    to={`/project/${project.id}`}
                    onClick={(e) => openProject(e, project.id, e.currentTarget.closest('article')?.querySelector<HTMLElement>('[role="img"]'))}
                    className="btn-solid"
                    data-magnetic
                  >
                    {t('projects.viewDetails')}
                  </Link>
                  {project.siteUrl && (
                    <a href={project.siteUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost" data-magnetic>
                      {project.siteType === 'production' ? t('projects.viewSiteProduction') : t('projects.viewSiteDemo')}
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  )}
                  {project.codeUrl && (
                    <a href={project.codeUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost" data-magnetic>
                      <Github className="h-3.5 w-3.5" aria-hidden="true" />
                      {t('projects.code')}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}

        {/* Panneau de clôture */}
        <Link
          to="/projects"
          data-cursor={t('ui.cursorOpen')}
          className="group flex flex-col justify-between border border-line p-6 transition-colors duration-500 hover:bg-paper hover:text-ink lg:h-full lg:w-[38vw] lg:border-0 lg:px-10 lg:pb-14 lg:pt-24"
        >
          <span className="label group-hover:text-ink/60">
            {t('projects.allProjects')} · {customProjects.length}
          </span>
          <span className="display mt-10 flex items-end justify-between gap-4 text-[clamp(3rem,6vw,7rem)]">
            {t('projects.viewAll')}
            <ArrowRight className="mb-3 h-10 w-10 shrink-0 transition-transform duration-500 group-hover:-rotate-45" aria-hidden="true" />
          </span>
        </Link>
      </div>

      {/* Progression */}
      <div className="pointer-events-none absolute inset-x-10 bottom-6 hidden h-px bg-line lg:block" aria-hidden="true">
        <div ref={progressRef} className="h-px origin-left scale-x-0 bg-paper" />
      </div>
    </section>
    </div>
  );
};
