import React, { useEffect, useRef, lazy, Suspense, useState } from 'react';
import { gsap } from 'gsap';
import { useTranslation } from 'react-i18next';
import { ArrowDown, ArrowRight, Star } from 'lucide-react';
import { useLocalTime } from '../hooks/useLocalTime';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useStar } from '../contexts/StarContext';
import { onIntroDone } from '../lib/motion';
import { SplitText, useProximityWeight } from './ui/Kinetic';

const DitherHero = lazy(() => import('./webgl/DitherHero'));

export const HeroSection: React.FC = () => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const localTime = useLocalTime();
  const [hours, minutes] = localTime.split(':');
  const { stars, toggleStar } = useStar();
  const prefersReducedMotion = useReducedMotion();
  const [introDone, setIntroDone] = useState(false);
  const year = new Date().getFullYear();

  useProximityWeight(titleRef, { min: 250, max: 800, radius: 300 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const elements = container.querySelectorAll('.animate-in');
    gsap.set(elements, { opacity: 0, y: prefersReducedMotion ? 0 : 18 });

    return onIntroDone(() => {
      setIntroDone(true);
      gsap.to(elements, {
        opacity: 1,
        y: 0,
        duration: prefersReducedMotion ? 0.3 : 1.1,
        stagger: prefersReducedMotion ? 0 : 0.05,
        delay: 0.35,
        ease: 'expo.out',
      });
    });
  }, [prefersReducedMotion]);

  const handleStarClick = () => {
    toggleStar('hero');
    if (!prefersReducedMotion) {
      const starElement = document.querySelector('.star-icon');
      if (starElement) gsap.from(starElement, { scale: 0.5, duration: 0.3, ease: 'back.out(1.7)' });
    }
  };

  return (
    <section ref={containerRef} className="grain relative flex min-h-[calc(100svh-3.5rem)] w-full flex-col overflow-hidden lg:h-[calc(100svh-4rem)] lg:min-h-[620px]">
      <Suspense fallback={null}>
        <DitherHero intro={introDone} />
      </Suspense>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/30 lg:to-ink/70" aria-hidden="true" />
      {/* Mobile / tablette : voile sous le texte (moitié basse), la sphère reste nette au-dessus */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-ink from-55% via-ink/80 to-transparent lg:hidden" aria-hidden="true" />
      {/* Voile latéral pour la lisibilité du titre : grand écran seulement (en portrait la sphère est au-dessus du texte) */}
      <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[62%] bg-gradient-to-r from-ink via-ink/70 to-transparent lg:block" aria-hidden="true" />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col px-4 pb-5 pt-5 sm:px-6 md:px-10 lg:pb-[2.2vh] lg:pt-[2.2vh]">
        {/* Bandeau d'annonce */}
        <a
          href="#contact"
          data-scroll-to="contact"
          className="animate-in group mx-auto hidden md:flex [@media(min-width:1024px)_and_(max-height:820px)]:hidden w-full max-w-2xl items-center gap-3 border border-line bg-ink/70 px-3 py-2 backdrop-blur-sm transition-colors hover:border-paper/50 md:gap-4"
        >
          <span className="border border-paper/60 px-1 font-display text-[13px] font-semibold leading-tight">CD</span>
          <span className="flex-1 truncate font-mono text-[11px] uppercase tracking-[0.08em] text-paper/80 md:text-[12px]">
            {t('ui.announce')}
          </span>
          <span className="hidden font-mono text-[10px] uppercase text-paper/55 sm:inline">{t('ui.announceCta')}</span>
          <ArrowRight className="h-3.5 w-3.5 text-paper/70 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </a>

        {/* Étoile cachée (mobile : la ligne méta est masquée pour laisser la place à la sphère) */}
        <button
          onClick={handleStarClick}
          className="absolute right-3 top-3 z-10 p-1 md:hidden focus:outline-none focus-visible:ring-1 focus-visible:ring-paper"
          aria-label={stars.hero ? t('game.starFound', { defaultValue: 'Étoile trouvée' }) : t('game.hiddenStar', { defaultValue: 'Étoile cachée' })}
          aria-pressed={stars.hero}
        >
          <Star className={`h-5 w-5 text-paper ${stars.hero ? 'fill-paper' : 'fill-transparent'}`} />
        </button>

        {/* Ligne méta (tablette et plus) */}
        <div className="-mx-4 mt-0 hidden md:grid md:mt-6 shrink-0 grid-cols-2 gap-y-4 border-y border-line bg-ink/90 px-4 py-4 lg:py-[1.6vh] backdrop-blur-md sm:-mx-6 sm:px-6 md:-mx-10 md:mt-8 lg:mt-[2.4vh] md:grid-cols-4 md:px-10">
          <div className="animate-in">
            <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-paper">Christen</p>
            <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-paper/55">Dijoux</p>
          </div>
          <div className="animate-in text-right md:text-left">
            <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-paper">{t('hero.location')}</p>
            <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-paper/55">{t('hero.region')}</p>
          </div>
          <div className="animate-in hidden md:block">
            <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-paper">{t('hero.role')}</p>
            <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-paper/55">{t('hero.roleDetail')}</p>
          </div>
          <div className="animate-in hidden items-start justify-end gap-6 md:flex">
            <div className="md:text-right">
              <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-paper/55">{t('ui.localTime')}</p>
              <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-paper">
                <span>{hours}</span>
                <span className="animate-blink">:</span>
                <span>{minutes}</span>
              </p>
            </div>
            <button
              onClick={handleStarClick}
              data-magnetic
              className="-mt-1 p-1 transition-transform duration-300 hover:scale-110 focus:outline-none focus-visible:ring-1 focus-visible:ring-paper"
              aria-label={stars.hero ? t('game.starFound', { defaultValue: 'Étoile trouvée' }) : t('game.hiddenStar', { defaultValue: 'Étoile cachée' })}
              aria-pressed={stars.hero}
            >
              <Star className={`star-icon h-6 w-6 text-paper transition-colors duration-300 ${stars.hero ? 'fill-paper' : 'fill-transparent'}`} />
            </button>
          </div>
        </div>

        {/* Titre */}
        <div className="flex min-h-0 flex-1 flex-col justify-end gap-6 py-6 md:gap-8 md:py-8 lg:flex-row lg:items-end lg:justify-between lg:gap-10 lg:py-[3vh]">
          <div ref={titleRef} className="relative" data-sphere-bottom>
            <div className="animate-in label mb-5 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-paper opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-paper" />
              </span>
              <span>[ 00 ] · {t('ui.openToWork')}</span>
            </div>
            {/* Graisse fine (250) avec la souris ; plus lisible (420) sur mobile et écrans tactiles où elle ne réagit pas */}
            <h1 className="display text-[clamp(3rem,min(8.5vw,9.5vh),11rem)] [font-variation-settings:'wght'_250] max-lg:[font-variation-settings:'wght'_420] [@media(hover:none)]:[font-variation-settings:'wght'_420]">
              <SplitText as="span" trigger="intro" text={t('ui.heroTitle1')} className="block" delay={0.1} />
              <SplitText as="span" trigger="intro" text={t('ui.heroTitle2')} className="block text-outline-strong" delay={0.2} />
              <SplitText as="span" trigger="intro" text={t('ui.heroTitle3')} className="block" delay={0.3} />
            </h1>
          </div>

          <div className="animate-in w-full max-w-sm shrink-0 md:border md:border-line md:bg-ink/95 md:p-5 lg:p-[2vh] backdrop-blur-md lg:mb-3">
            <p className="text-[15px] leading-relaxed lg:text-[clamp(13px,1.7vh,16px)] text-paper/80">{t('ui.heroLead')}</p>
            <div className="mt-5 flex flex-wrap gap-2 sm:gap-3 lg:mt-[2vh] [&_a]:max-sm:px-3.5">
              <a href="#projects" data-scroll-to="projects" data-magnetic className="btn-ghost backdrop-blur-sm">
                {t('ui.ctaProjects')}
              </a>
              <a href="#contact" data-scroll-to="contact" data-magnetic className="btn-solid">
                {t('ui.ctaContact')} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        {/* Signature */}
        <div className="animate-in shrink-0">
          <div className="mb-4 flex items-stretch gap-6 lg:mb-[1.8vh]">
            {/* Largeur = min(100 %, hauteur max × ratio du logo 1364/129) : jamais déformé */}
            <picture className="block w-full min-w-0 shrink lg:w-[min(100%,calc(20vh*10.574))]">
              <source
                srcSet="/assets/logo-400.webp 400w, /assets/logo-800.webp 800w, /assets/logo.webp 1364w"
                sizes="(max-width: 768px) 400px, (max-width: 1024px) 800px, 100vw"
                type="image/webp"
              />
              <img
                src="/assets/logo-800.webp"
                alt="Logo Christen Dijoux"
                width="1364"
                height="129"
                loading="eager"
                decoding="async"
                className="block h-auto w-full mix-blend-difference"
              />
            </picture>

            {/* Écrans larges et peu hauts : le logo est limité en hauteur, on occupe l'espace libre */}
            <nav
              aria-label={t('ui.indexTitle')}
              className="hidden min-w-[200px] flex-1 flex-col justify-between border-l border-line pl-5 min-[1024px]:[@media(min-aspect-ratio:23/10)]:flex"
            >
              <p className="label flex justify-between">
                <span>Index</span>
                <span>48.43°N · 71.07°W</span>
              </p>
              <ul className="space-y-1">
                {[
                  { id: 'about', label: t('nav.about') },
                  { id: 'projects', label: t('nav.projects') },
                  { id: 'contact', label: t('nav.contact') },
                ].map((item, i) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      data-scroll-to={item.id}
                      className="group flex items-baseline justify-between gap-3 font-mono text-[12px] uppercase tracking-[0.1em] text-paper/70 transition-colors hover:text-paper"
                    >
                      <span className="truncate">
                        <span className="mr-2 text-paper/55">0{i + 1}</span>
                        {item.label}
                      </span>
                      <ArrowRight className="h-3 w-3 shrink-0 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="flex items-center justify-between border-t border-line pt-3 lg:pt-[1.4vh]">
            <p className="label text-paper/80">
              {t('hero.tagline')} — {year}
            </p>
            <a href="#about" data-scroll-to="about" className="label flex items-center gap-2 hover:text-paper">
              {t('ui.scroll')} <ArrowDown className="h-3 w-3 animate-bounce" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
