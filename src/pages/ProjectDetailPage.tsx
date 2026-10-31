import { useEffect, useRef, useState, type FC, type ReactNode } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Seo } from '../components/Seo';
import { breadcrumb } from '../lib/seo';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, ArrowRight, ArrowUpRight, Github } from 'lucide-react';
import { customProjects } from '../data/customProjects';
import { projectKindKey } from '../data/projectKind';
import { Footer } from '../components/Footer';
import { SectionLabel, MetaRow } from '../components/ui/Editorial';
import { PixelImage } from '../components/ui/PixelImage';
import { ScrollWords, SplitText } from '../components/ui/Kinetic';
import { Counter } from '../components/ui/Counter';
import { Expandable, ExpandButton } from '../components/ui/Expandable';
import { firstItems } from '../lib/collapse';
import { caseGallery } from '../data/caseGallery';
import { finishImageTransition, useProjectTransition } from '../lib/projectTransition';
import { useLenis } from '../hooks/useLenis';

gsap.registerPlugin(ScrollTrigger);

// Images de partage 1200×630 (JPG / PNG : les .webp passent mal dans les aperçus LinkedIn)
/** Titre d'onglet et de résultat Google : le plus complet qui tient dans ~60 caractères. */
const caseStudyTitle = (title: string, name: string, caseStudy: string) =>
  [`${title} — ${caseStudy} | Christen Dijoux`, `${title} | Christen Dijoux`, `${name} — ${caseStudy} | Christen Dijoux`].find(
    (candidate) => candidate.length <= 60
  ) ?? `${name} | Christen Dijoux`;

const OG_IMAGES: Record<string, string> = {
  'gagnon-freres': 'jpg',
  akiworkspace: 'jpg',
  'portfolio-watch': 'jpg',
  badger: 'jpg',
  'mona-game': 'jpg',
  ctreq: 'jpg',
  'ctreq-blog-archive': 'jpg',
  'innovations-numeriques-fp': 'jpg',
  akiproject: 'png',
  akimusic: 'png',
};

/** Sur mobile, les longues listes n'affichent que les premiers éléments. */
const MOBILE_LIST = 4;

const ShowAllButton: FC<{ count: number; open: boolean; onClick: () => void; controls: string }> = ({ count, open, onClick, controls }) => {
  const { t } = useTranslation();
  if (count <= MOBILE_LIST) return null;
  return (
    <ExpandButton
      open={open}
      onClick={onClick}
      controls={controls}
      label={`${t('ui.showAll', { defaultValue: 'Voir tout' })} (${count})`}
      openLabel={t('ui.readLess', { defaultValue: 'Réduire' })}
      className="btn-ghost w-full"
    />
  );
};

/** Liste repliée sur mobile après MOBILE_LIST éléments (dévoilement en trame). */
const MobileList: FC<{ id: string; count: number; open: boolean; className?: string; children: ReactNode }> = ({ id, count, open, className = '', children }) =>
  count > MOBILE_LIST ? (
    <Expandable id={id} open={open} collapsed={firstItems(MOBILE_LIST)} className={className}>
      {children}
    </Expandable>
  ) : (
    <div className={className}>{children}</div>
  );

export const ProjectDetailPage = () => {
  const { t, i18n } = useTranslation();
  const openProject = useProjectTransition();
  const [showAll, setShowAll] = useState({ features: false, challenges: false });
  const { id } = useParams<{ id: string }>();

  // Arrivée par la transition « image partagée » : l'image se retire une fois la page peinte
  useEffect(() => {
    const raf = requestAnimationFrame(() => requestAnimationFrame(finishImageTransition));
    return () => cancelAnimationFrame(raf);
  }, [id]);
  const navigate = useNavigate();
  const pageRef = useRef<HTMLElement>(null);
  const nextFillRef = useRef<HTMLDivElement>(null);
  const index = customProjects.findIndex((p) => p.id === id);
  const project = index >= 0 ? customProjects[index] : undefined;
  useLenis();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Révélations au défilement + jauge du projet suivant
  useEffect(() => {
    const page = pageRef.current;
    if (!page || !project) return;
    const triggers: ScrollTrigger[] = [];
    page.querySelectorAll<HTMLElement>('.reveal').forEach((el) => {
      const tween = gsap.fromTo(
        el,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top bottom-=60' } }
      );
      if (tween?.scrollTrigger) triggers.push(tween.scrollTrigger);
    });
    if (nextFillRef.current) {
      const tween = gsap.fromTo(
        nextFillRef.current,
        { scaleX: 0 },
        { scaleX: 1, ease: 'none', scrollTrigger: { trigger: nextFillRef.current, start: 'top bottom', end: 'top 35%', scrub: true } }
      );
      if (tween?.scrollTrigger) triggers.push(tween.scrollTrigger);
    }
    return () => triggers.forEach((st) => st.kill());
  }, [project]);

  if (!project) {
    return (
      <main className="flex min-h-[80vh] flex-col items-center justify-center bg-ink px-4 text-center text-paper">
        <Seo noindex path={`/project/${id ?? ''}`} title={`404 — ${t('projectDetail.notFound')} | Christen Dijoux`} description={t('projectDetail.notFound')} />
        <p className="label">Error · 404</p>
        <h1 className="display mt-4 text-[clamp(3rem,10vw,9rem)]">{t('projectDetail.notFound')}</h1>
        <Link to="/projects" className="btn-ghost mt-8">
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> {t('projectDetail.backToProjects')}
        </Link>
      </main>
    );
  }

  const statusLabels = {
    completed: t('projectDetail.status.completed'),
    'in-progress': t('projectDetail.status.inProgress'),
    archived: t('projectDetail.status.archived'),
  };
  const statusLabel = project.status ? statusLabels[project.status] : statusLabels.completed;

  // Récupérer les traductions i18n pour le SEO
  const translatedTitle = t(`customProjects.${project.id}.title`, { defaultValue: project.title });
  const translatedDescription = t(`customProjects.${project.id}.description`, { defaultValue: project.description });
  const translatedLongDescription = t(`customProjects.${project.id}.longDescription`, { defaultValue: project.longDescription || project.description });
  const [titleMain, ...titleRest] = translatedTitle.split(' - ');
  const subtitle = titleRest.join(' - ');

  const features = (project.features ?? []).map((f, i) => t(`customProjects.${project.id}.features.${i}`, { defaultValue: f }));
  const challenges = (project.challenges ?? []).map((c, i) => t(`customProjects.${project.id}.challenges.${i}`, { defaultValue: c }));
  const techGroups = [
    { key: 'frontend', label: t('projectDetail.frontend'), items: project.technologies?.frontend ?? [] },
    { key: 'backend', label: t('projectDetail.backend'), items: project.technologies?.backend ?? [] },
    { key: 'tools', label: t('projectDetail.tools'), items: project.technologies?.tools ?? [] },
  ].filter((g) => g.items.length > 0);
  const techCount = techGroups.reduce((n, g) => n + g.items.length, 0) || project.languages.length;

  const stats = [
    { label: t('projectDetail.features'), value: features.length },
    { label: t('projectDetail.challenges'), value: challenges.length },
    { label: t('projectDetail.technologies'), value: techCount },
    { label: t('ui.statYear'), value: Number(project.year) || 0, pad: 4, fixed: true },
  ].filter((s) => s.value > 0);

  const total = customProjects.length;
  const next = customProjects[(index + 1) % total];
  const nextTitle = t(`customProjects.${next.id}.title`, { defaultValue: next.title }).split(' - ')[0];
  const gallery = caseGallery[project.id] ?? [];
  const lang = i18n.language?.startsWith('fr') ? 'fr' : 'en';
  let section = 0;
  const sectionCount = 1 + (gallery.length ? 1 : 0) + (features.length ? 1 : 0) + (challenges.length ? 1 : 0) + 1;

  return (
    <main ref={pageRef} className="min-h-screen bg-ink text-paper">
      <Seo
        path={`/project/${project.id}`}
        type="article"
        title={caseStudyTitle(translatedTitle, project.name, t('ui.caseStudy'))}
        description={translatedDescription}
        image={OG_IMAGES[project.id] ? `/assets/og/${project.id}.${OG_IMAGES[project.id]}` : undefined}
        imageAlt={translatedTitle}
      >
        <meta property="article:author" content="Christen Dijoux" />
        {project.topics.map((tag) => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
        {breadcrumb([
          { name: t('nav.home'), path: '/' },
          { name: t('nav.projects'), path: '/projects' },
          { name: translatedTitle, path: `/project/${project.id}` },
        ])}
      </Seo>

      {/* En-tête */}
      <header className="px-4 pb-10 pt-8 sm:px-6 md:px-10 md:pb-14 md:pt-12">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="label group flex items-center gap-2 hover:text-paper">
            <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
            {t('projectDetail.back')}
          </button>
          <p className="label">
            {t('ui.caseStudy')} · <span className="text-paper">{String(index + 1).padStart(2, '0')}</span> / {String(total).padStart(2, '0')}
          </p>
        </div>

        <SplitText as="h1" trigger="intro" text={titleMain} className="display mt-10 block text-[clamp(3.4rem,11vw,12rem)] md:mt-14" />
        {subtitle && <p className="heading mt-3 max-w-3xl text-[clamp(1.5rem,3vw,2.75rem)] text-paper/60">{subtitle}</p>}

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <MetaRow k={t('ui.statYear')} v={project.year ?? '—'} />
            <MetaRow k={t('ui.statusLabel')} v={statusLabel} />
            <MetaRow k={t('ui.typeLabel')} v={t(`projectDetail.${projectKindKey(project)}`)} />
            <MetaRow k={t('projectDetail.languages')} v={project.languages.join(' · ')} />
          </div>
          <div className="flex flex-wrap items-end gap-2 lg:col-span-6 lg:col-start-7 lg:justify-end">
            {project.siteUrl && (
              <a href={project.siteUrl} target="_blank" rel="noopener noreferrer" className="btn-solid" data-magnetic>
                {project.siteType === 'production' ? t('projectDetail.viewSite') : t('projectDetail.viewDemo')}
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            )}
            {project.codeUrl && (
              <a href={project.codeUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost" data-magnetic>
                <Github className="h-3.5 w-3.5" aria-hidden="true" />
                {t('projectDetail.sourceCode')}
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Visuel principal */}
      <div className="px-4 sm:px-6 md:px-10">
        <PixelImage
          src={`/assets/art/${project.id}-halftone.png`}
          original={project.image}
          alt={`Capture d'écran du projet ${translatedTitle}`}
          position="top"
          className="aspect-[4/3] w-full md:aspect-[21/9]"
        />
        <p className="label mt-3 flex justify-between">
          <span>Fig. 01 — {titleMain}</span>
          <span className="hidden sm:inline">{t('ui.hoverReveal')}</span>
        </p>
      </div>

      {/* Aperçu */}
      <section className="grid grid-cols-1 gap-10 border-b border-line px-4 py-20 sm:px-6 md:px-10 md:py-28 lg:grid-cols-12">
        <div className="lg:sticky lg:top-24 lg:col-span-3 lg:self-start">
          <SectionLabel index={++section} total={sectionCount}>{t('projectDetail.about')}</SectionLabel>
        </div>
        <div className="lg:col-span-9">
          <ScrollWords text={translatedDescription} className="heading text-[clamp(1.8rem,3.4vw,3.4rem)] leading-[1.08]" />
          <p className="reveal mt-10 max-w-3xl leading-relaxed text-paper/70 md:text-lg">{translatedLongDescription}</p>
        </div>
      </section>

      {/* Chiffres */}
      {stats.length > 0 && (
        <section aria-label={t('ui.caseStats')} className="grid grid-cols-2 border-b border-line md:grid-cols-4">
          {stats.map((s, i) => (
            <div key={s.label} className={`reveal border-line p-6 md:p-10 ${i % 2 === 0 ? 'border-r' : ''} ${i < 2 ? 'border-b md:border-b-0' : ''} md:border-r md:last:border-r-0`}>
              {/* L'année reste fixe (un compteur 0 → 2025 n'a pas de sens) */}
              {'fixed' in s && s.fixed ? (
                <span className="display block text-[clamp(3.5rem,8vw,8rem)]">{s.value}</span>
              ) : (
                <Counter value={s.value} pad={s.pad ?? 2} className="display block text-[clamp(3.5rem,8vw,8rem)]" />
              )}
              <p className="label mt-2">{s.label}</p>
            </div>
          ))}
        </section>
      )}

      {/* Galerie : captures du projet en ligne (noir et blanc, couleur au survol) */}
      {gallery.length > 0 && (
        <section className="border-b border-line px-4 py-20 sm:px-6 md:px-10 md:py-28">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <SectionLabel index={++section} total={sectionCount}>{t('ui.gallery')}</SectionLabel>
              <SplitText as="h2" text={t('ui.galleryTitle')} className="heading mt-6 block text-[clamp(2.4rem,4vw,4rem)] uppercase" />
            </div>
            <p className="label hidden md:block">{t(project.kind === 'professional' ? 'ui.galleryHintDiagrams' : 'ui.galleryHint')}</p>
          </div>
          {/* Première image en pleine largeur, les suivantes sur deux colonnes (la dernière s'étire si impaire) */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            {gallery.map((g, i) => (
              <figure
                key={g.file}
                className={`reveal group overflow-hidden border border-line ${i === 0 || (i === gallery.length - 1 && gallery.length % 2 === 0) ? 'md:col-span-2' : ''}`}
              >
                <img
                  src={`/assets/cases/${g.file}.webp`}
                  alt={g.alt[lang]}
                  width={1600}
                  height={1000}
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full grayscale transition-[filter,transform] duration-700 ease-out group-hover:scale-[1.015] group-hover:grayscale-0"
                />
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* Fonctionnalités */}
      {features.length > 0 && (
        <section className="border-b border-line px-4 py-20 sm:px-6 md:px-10 md:py-28">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:sticky lg:top-24 lg:col-span-3 lg:self-start">
              <SectionLabel index={++section} total={sectionCount}>{t('projectDetail.features')}</SectionLabel>
              <SplitText as="h2" text={t('ui.whatItDoes')} className="heading mt-6 block text-[clamp(2.4rem,4vw,4rem)] uppercase" />
            </div>
            <MobileList id="features-list" count={features.length} open={showAll.features} className="lg:col-span-9">
            <ol className="grid grid-cols-1 border-l border-t border-line md:grid-cols-2">
              {features.map((f, i) => (
                <li
                  key={i}
                  className="reveal group flex gap-5 border-b border-r border-line p-5 transition-colors hover:bg-white/[0.03] md:p-6"
                >
                  <span className="label shrink-0 pt-1 text-paper/55 group-hover:text-paper">{String(i + 1).padStart(2, '0')}</span>
                  <span className="leading-relaxed text-paper/80">{f}</span>
                </li>
              ))}
            </ol>
            </MobileList>
            <ShowAllButton controls="features-list" count={features.length} open={showAll.features} onClick={() => setShowAll((v) => ({ ...v, features: !v.features }))} />
          </div>
        </section>
      )}

      {/* Défis */}
      {challenges.length > 0 && (
        <section className="border-b border-line px-4 py-20 sm:px-6 md:px-10 md:py-28">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:sticky lg:top-24 lg:col-span-3 lg:self-start">
              <SectionLabel index={++section} total={sectionCount}>{t('projectDetail.challenges')}</SectionLabel>
              <SplitText as="h2" text={t('ui.howItWasSolved')} className="heading mt-6 block text-[clamp(2.4rem,4vw,4rem)] uppercase" />
            </div>
            <MobileList id="challenges-list" count={challenges.length} open={showAll.challenges} className="lg:col-span-9">
            <ol className="border-t border-line">
              {challenges.map((c, i) => (
                <li
                  key={i}
                  className="reveal grid grid-cols-[3.5rem_1fr] items-baseline gap-4 border-b border-line py-6 md:grid-cols-[6rem_1fr] md:py-8"
                >
                  <span className="display text-4xl text-paper/40 md:text-6xl">{String(i + 1).padStart(2, '0')}</span>
                  <p className="text-lg leading-relaxed text-paper/85 md:text-xl">{c}</p>
                </li>
              ))}
            </ol>
            </MobileList>
            <ShowAllButton controls="challenges-list" count={challenges.length} open={showAll.challenges} onClick={() => setShowAll((v) => ({ ...v, challenges: !v.challenges }))} />
          </div>
        </section>
      )}

      {/* Stack */}
      <section className="px-4 py-20 sm:px-6 md:px-10 md:py-28">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:sticky lg:top-24 lg:col-span-3 lg:self-start">
            <SectionLabel index={++section} total={sectionCount}>{t('projectDetail.technologies')}</SectionLabel>
            <SplitText as="h2" text="Stack" className="heading mt-6 block text-[clamp(2.4rem,4vw,4rem)] uppercase" />
          </div>
          <div className="border-t border-line lg:col-span-9">
            {(techGroups.length ? techGroups : [{ key: 'lang', label: t('projectDetail.languages'), items: project.languages }]).map((g) => (
              <div key={g.key} className="reveal grid grid-cols-1 gap-3 border-b border-line py-5 md:grid-cols-[12rem_1fr]">
                <p className="label pt-1">{g.label}</p>
                <div className="flex flex-wrap gap-1.5">
                  {g.items.map((item) => (
                    <span key={item} className="chip">{item}</span>
                  ))}
                </div>
              </div>
            ))}
            {project.topics.length > 0 && (
              <div className="reveal grid grid-cols-1 gap-3 py-5 md:grid-cols-[12rem_1fr]">
                <p className="label pt-1">{t('projectDetail.tags')}</p>
                <p className="font-mono text-[12px] uppercase tracking-[0.06em] text-paper/50">
                  {project.topics.map((topic) => `#${topic}`).join('  ')}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Projet suivant */}
      <Link
        to={`/project/${next.id}`}
        onClick={(e) => openProject(e, next.id, e.currentTarget.querySelector<HTMLElement>('[data-next-image]'))}
        data-cursor={t('ui.cursorOpen')}
        className="group relative block overflow-hidden border-t border-line px-4 pb-12 pt-10 sm:px-6 md:px-10 md:pb-16"
      >
        <div className="mb-8 h-px w-full bg-line">
          <div ref={nextFillRef} className="h-px w-full origin-left bg-paper" />
        </div>
        <div className="flex items-baseline justify-between">
          <p className="label">{t('ui.nextProject')}</p>
          <p className="label">{String(((index + 1) % total) + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</p>
        </div>
        <div className="mt-6 grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
          <p className="display text-[clamp(3.5rem,11vw,12rem)] transition-transform duration-700 ease-out group-hover:translate-x-4 lg:col-span-8">
            {nextTitle}
          </p>
          <div data-next-image className="relative aspect-[4/3] overflow-hidden lg:col-span-4">
            <img
              src={`/assets/art/${next.id}-halftone.png`}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            <span className="pointer-events-none absolute inset-0 border border-line" aria-hidden="true" />
          </div>
        </div>
        <span className="label mt-6 inline-flex items-center gap-2 group-hover:text-paper">
          {t('ui.readCase')} <ArrowRight className="h-3 w-3" aria-hidden="true" />
        </span>
      </Link>

      <Footer variant="minimal" />
    </main>
  );
};
