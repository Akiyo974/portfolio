import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { ArrowDownToLine, ArrowRight } from 'lucide-react';
import { MetaRow, SectionLabel } from './ui/Editorial';
import { PixelImage } from './ui/PixelImage';
import { ScrollWords, SplitText } from './ui/Kinetic';
import { Expandable, ExpandButton } from './ui/Expandable';
import { firstLines } from '../lib/collapse';
import { skillCategories } from '../data/skills';
import { JourneySection } from './JourneySection';

gsap.registerPlugin(ScrollTrigger);

type Experience = { title: string; company: string; period: string; description: string; highlights?: string[] };

// Mobile : listes en carrousel horizontal (moins de défilement vertical)
const CAROUSEL = 'max-md:flex max-md:snap-x max-md:snap-mandatory max-md:gap-3 max-md:overflow-x-auto max-md:scroll-px-4 max-md:border-0 max-md:px-4 max-md:pb-2 no-scrollbar';
const SLIDE = 'max-md:w-[82vw] max-md:shrink-0 max-md:snap-start max-md:border';

export const AboutSection = () => {
  const [showMore, setShowMore] = useState(false);
  const [openExp, setOpenExp] = useState<Record<number, boolean>>({});
  const { t, i18n } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const isFr = i18n.language?.startsWith('fr');

  const formations = [
    {
      title: t('education.tim.title'),
      place: t('education.tim.school'),
      role: t('education.tim.role'),
      period: t('education.tim.period')
    },
    {
      title: t('education.react.title'),
      place: t('education.react.school'),
      role: t('education.react.role'),
      period: t('education.react.period')
    },
    {
      title: t('education.gameDesign.title'),
      place: t('education.gameDesign.school'),
      role: t('education.gameDesign.role'),
      period: t('education.gameDesign.period')
    }
  ];

  const pillars = [
    { img: '/assets/art/ray-burst-800.webp', title: t('ui.aboutAI'), text: t('ui.aboutAIText'), tag: 'IA' },
    { img: '/assets/art/ridge-lines.png', title: t('ui.aboutOps'), text: t('ui.aboutOpsText'), tag: 'OPS' },
    { img: '/assets/art/globe-halftone.png', title: t('ui.aboutCloud'), text: t('ui.aboutCloudText'), tag: 'CLOUD' },
  ];

  const experiences = t('about.experienceList', { returnObjects: true }) as Experience[];
  const impacts = t('about.impactList', { returnObjects: true }) as string[];
  const interests = t('about.interestsList', { returnObjects: true }) as string[];

  useEffect(() => {
    const ctx = gsap.context(() => {
      sectionRef.current?.querySelectorAll<HTMLElement>('.reveal').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power4.out',
            scrollTrigger: { trigger: el, start: 'top bottom-=80' },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="w-full scroll-mt-16 bg-ink text-paper">
      {/* En-tête */}
      <div className="px-4 pt-20 sm:px-6 md:px-10 md:pt-28">
        <SectionLabel index={1} total={4}>{t('about.title')}</SectionLabel>
        <SplitText as="h2" text={t('ui.aboutTitle')} className="display mt-6 block text-[clamp(3rem,8vw,8rem)]" />
      </div>

      {/* Intro */}
      <div className="grid grid-cols-1 gap-10 border-b border-line px-4 py-12 sm:px-6 md:px-10 md:py-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <ScrollWords text={t('about.intro')} className="heading text-[clamp(1.6rem,2.6vw,2.6rem)] leading-[1.12] text-paper" />
          {/* Mobile : on laisse entrevoir le début du paragraphe suivant, tramé */}
          <Expandable id="about-more" open={showMore} collapsed={firstLines(2)}>
            <div className="space-y-6 pt-6">
              <p className="reveal leading-relaxed text-paper/70">{t('about.expertise')}</p>
              <p className="reveal leading-relaxed text-paper/70">{t('about.passion')}</p>
            </div>
          </Expandable>
          <ExpandButton
            open={showMore}
            onClick={() => setShowMore((v) => !v)}
            controls="about-more"
            label={t('ui.readMore', { defaultValue: 'Lire la suite' })}
            openLabel={t('ui.readLess', { defaultValue: 'Réduire' })}
            className="mt-5"
          />
        </div>
        <aside className="reveal lg:col-span-4 lg:col-start-9">
          <div className="crosshair border border-line p-5">
            <p className="label mb-3">{t('ui.aboutKicker')}</p>
            <MetaRow k={isFr ? 'Basé à' : 'Based in'} v={`${t('hero.location')}, QC`} />
            <MetaRow k={isFr ? 'Rôle' : 'Role'} v={experiences[0]?.title ?? '—'} />
            <MetaRow k={isFr ? 'Chez' : 'At'} v={experiences[0]?.company ?? '—'} />
            <MetaRow k="Studio" v="Synaptia Web" />
            <MetaRow k={isFr ? 'Récemment' : 'Lately'} v="GitHub Universe '26 · San Francisco" />
            <MetaRow k="Focus" v={t('hero.roleDetail')} />
            {/* Boutons empilés tant que la colonne est étroite : jamais de libellé sur deux lignes */}
            <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1 2xl:grid-cols-2 [&>a]:whitespace-nowrap">
              <Link to="/cv" className="btn-solid justify-between">
                {t('about.viewCV')} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
              <a
                href={isFr ? '/assets/cv-christen-dijoux-fr.pdf' : '/assets/cv-christen-dijoux-en.pdf'}
                download={isFr ? 'Christen-Dijoux-CV.pdf' : 'Christen-Dijoux-Resume.pdf'}
                className="btn-ghost justify-between"
              >
                {t('about.downloadCV')} <span className="flex items-center gap-2 text-paper/55">PDF <ArrowDownToLine className="h-3.5 w-3.5" aria-hidden="true" /></span>
              </a>
            </div>
          </div>
        </aside>
      </div>

      {/* Trajet La Réunion → Saguenay */}
      <JourneySection />

      {/* Piliers en alternance */}
      <div className={`px-4 sm:px-6 md:px-10 max-md:py-10 ${CAROUSEL}`}>
        {pillars.map((p, i) => (
          <article
            key={p.tag}
            className={`reveal grid grid-cols-1 items-center gap-8 border-b border-line py-12 md:grid-cols-2 md:gap-16 md:py-16 ${SLIDE} max-md:gap-5 max-md:border-line max-md:p-4 ${
              i % 2 ? 'md:[&>*:first-child]:order-2' : ''
            }`}
          >
            <PixelImage src={p.img} alt={p.title} className="aspect-[4/3]" />
            <div>
              <p className="label mb-4">#{String(i + 1).padStart(2, '0')} · {p.tag}</p>
              <h3 className="heading text-[clamp(2.4rem,4.5vw,4.25rem)]">{p.title}</h3>
              <p className="mt-5 max-w-md leading-relaxed text-paper/70">{p.text}</p>
            </div>
          </article>
        ))}
      </div>

      {/* Stack */}
      <div className="px-4 py-16 sm:px-6 md:px-10 md:py-24">
        <div className="mb-10 flex items-end justify-between gap-6">
          <SplitText as="h3" text={t('about.skills')} className="heading block text-[clamp(2.4rem,5vw,4.5rem)] uppercase" />
          <p className="label hidden md:block">{t('ui.stackKicker')} · {Object.values(skillCategories).reduce((n, c) => n + c.skills.length, 0)}</p>
        </div>
        <div className={`grid grid-cols-1 border-l border-t border-line md:grid-cols-2 lg:grid-cols-3 max-md:-mx-4 ${CAROUSEL}`}>
          {Object.entries(skillCategories).map(([key, category], i) => (
            <div key={key} className={`reveal crosshair border-b border-r border-line p-5 md:p-6 ${SLIDE}`}>
              <div className="mb-4 flex items-center justify-between">
                <h4 className="font-mono text-[12px] uppercase tracking-[0.12em] text-paper">
                  {isFr ? category.title : category.titleEn}
                </h4>
                <span className="label">0{i + 1}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {category.skills.map((skill) => (
                  <span key={skill} className="chip">{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <p className="label mb-4">{t('about.interests')}</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {interests.map((interest) => (
              <li key={interest} className="font-display text-2xl text-paper/80 max-md:w-full max-md:border-b max-md:border-line max-md:pb-2 md:text-3xl">
                {interest}<span className="ml-6 text-paper/25 max-md:hidden" aria-hidden="true">/</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Parcours */}
      <div className="border-t border-line px-4 py-16 sm:px-6 md:px-10 md:py-24">
        <div className="mb-10 flex items-end justify-between">
          <SplitText as="h3" text={t('about.experience')} className="heading block text-[clamp(2.4rem,5vw,4.5rem)] uppercase" />
          <p className="label hidden md:block">{t('ui.pathKicker')}</p>
        </div>

        <ol className="border-t border-line">
          {experiences.map((exp, i) => (
            <li key={exp.company} className="reveal group grid grid-cols-1 gap-4 border-b border-line py-8 transition-colors hover:bg-white/[0.025] md:grid-cols-12 md:gap-8">
              <div className="label md:col-span-2">
                <span className="text-paper">#{i + 1}</span> · {exp.period}
              </div>
              <div className="md:col-span-4">
                <h4 className="heading text-3xl md:text-4xl">{exp.title}</h4>
                <p className="mt-1 font-mono text-[12px] uppercase tracking-[0.1em] text-paper/60">{exp.company}</p>
              </div>
              <div className="md:col-span-6">
                <Expandable id={`exp-${i}`} open={!!openExp[i]} collapsed={firstLines(5)}>
                  <p className="leading-relaxed text-paper/70">{exp.description}</p>
                  {exp.highlights && (
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {exp.highlights.map((h) => (
                        <li key={h} className="chip normal-case tracking-normal">{h}</li>
                      ))}
                    </ul>
                  )}
                </Expandable>
                <ExpandButton
                  open={!!openExp[i]}
                  onClick={() => setOpenExp((o) => ({ ...o, [i]: !o[i] }))}
                  controls={`exp-${i}`}
                  label={t('ui.readMore', { defaultValue: 'Lire la suite' })}
                  openLabel={t('ui.readLess', { defaultValue: 'Réduire' })}
                  className="mt-4"
                />
              </div>
            </li>
          ))}
        </ol>

        <h4 className="label mb-4 mt-14">{t('about.education')}</h4>
        <ul className="grid grid-cols-1 border-l border-t border-line md:grid-cols-3">
          {formations.map((f) => (
            <li key={f.title} className="reveal border-b border-r border-line p-5">
              <p className="label">{f.period}</p>
              <p className="heading mt-3 text-2xl">{f.title}</p>
              <p className="mt-2 text-sm text-paper/70">{f.place}</p>
              <p className="text-sm text-paper/50">{f.role}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Impact */}
      <div className="border-t border-line px-4 py-16 sm:px-6 md:px-10 md:py-24">
        <div className="mb-10 flex items-end justify-between">
          <SplitText as="h3" text={t('about.impact')} className="heading block text-[clamp(2.4rem,5vw,4.5rem)] uppercase" />
          <p className="label hidden md:block">{t('ui.impactKicker')}</p>
        </div>
        <div className={`grid grid-cols-1 border-l border-t border-line md:grid-cols-2 lg:grid-cols-3 max-md:-mx-4 ${CAROUSEL}`}>
          {impacts.map((impact, i) => (
            <div key={impact} className={`reveal group border-b border-r border-line p-6 transition-colors hover:bg-paper hover:text-ink ${SLIDE}`}>
              <p className="font-display text-6xl font-light text-paper/40 transition-colors group-hover:text-ink/40">
                {String(i + 1).padStart(2, '0')}
              </p>
              <p className="mt-6 leading-relaxed">{impact}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
