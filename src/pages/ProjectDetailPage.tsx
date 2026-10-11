import { useEffect, useRef, useState, type FC } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, ArrowRight, ArrowUpRight, Github } from 'lucide-react';
import { customProjects } from '../data/customProjects';
import { Footer } from '../components/Footer';
import { SectionLabel, MetaRow } from '../components/ui/Editorial';
import { PixelImage } from '../components/ui/PixelImage';
import { ScrollWords, SplitText } from '../components/ui/Kinetic';
import { Counter } from '../components/ui/Counter';
import { caseGallery } from '../data/caseGallery';
import { finishImageTransition, useProjectTransition } from '../lib/projectTransition';
import { useLenis } from '../hooks/useLenis';

gsap.registerPlugin(ScrollTrigger);

/** Sur mobile, les longues listes n'affichent que les premiers éléments. */
const MOBILE_LIST = 4;

const ShowAllButton: FC<{ count: number; open: boolean; onClick: () => void }> = ({ count, open, onClick }) => {
  const { t } = useTranslation();
  if (count <= MOBILE_LIST) return null;
  return (
    <button type="button" onClick={onClick} aria-expanded={open} className="btn-ghost w-full justify-between md:hidden">
      {open ? t('ui.readLess', { defaultValue: 'Réduire' }) : `${t('ui.showAll', { defaultValue: 'Voir tout' })} (${count})`}
      <span aria-hidden="true">{open ? '−' : '+'}</span>
    </button>
  );
};

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
        <Helmet>
          <title>404 - {t('projectDetail.notFound')} | Christen Dijoux</title>
          <meta name="robots" content="noindex" />
        </Helmet>
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
      <Helmet>
        <title>{`${translatedTitle} — ${t('ui.caseStudy')} | Christen Dijoux`}</title>
        <meta name="description" content={translatedDescription} />
        <meta name="keywords" content={`${project.languages.join(', ')}, ${project.topics.join(', ')}, web development, portfolio`} />

        {/* Open Graph */}
        <meta property="og:title" content={`${translatedTitle} - Projet Personnel`} />
        <meta property="og:description" content={translatedDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://christendijoux.com/project/${project.id}`} />
        {project.image && (
          <>
            <meta property="og:image" content={`https://christendijoux.com${project.image}`} />
            <meta property="og:image:width" content="879" />
            <meta property="og:image:height" content="495" />
            <meta property="og:image:alt" content={translatedTitle} />
          </>
        )}
        <meta property="article:published_time" content={`${project.year}-01-01`} />
        <meta property="article:modified_time" content="2025-11-20" />
        <meta property="article:author" content="Christen Dijoux" />
        <meta property="article:tag" content={project.topics.join(', ')} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${translatedTitle} - Projet Personnel`} />
        <meta name="twitter:description" content={translatedDescription} />
        {project.image && (
          <>
            <meta name="twitter:image" content={`https://christendijoux.com${project.image}`} />
            <meta name="twitter:image:alt" content={translatedTitle} />
          </>
        )}
        <meta name="twitter:creator" content="@ChristenDijoux" />

        {/* Canonical */}
        <link rel="canonical" href={`https://christendijoux.com/project/${project.id}`} />

        {/* Breadcrumb JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://christendijoux.com/" },
              { "@type": "ListItem", "position": 2, "name": "Projets", "item": "https://christendijoux.com/projects" },
              { "@type": "ListItem", "position": 3, "name": translatedTitle, "item": `https://christendijoux.com/project/${project.id}` }
            ]
          })}
        </script>
      </Helmet>

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
            <MetaRow k={t('ui.typeLabel')} v={t('projectDetail.personalProject')} />
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
            <p className="label hidden md:block">{t('ui.galleryHint')}</p>
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
            <ol className="grid grid-cols-1 border-l border-t border-line md:grid-cols-2 lg:col-span-9">
              {features.map((f, i) => (
                <li
                  key={i}
                  className={`reveal group flex gap-5 border-b border-r border-line p-5 transition-colors hover:bg-white/[0.03] md:p-6 ${
                    !showAll.features && i >= MOBILE_LIST ? 'max-md:hidden' : ''
                  }`}
                >
                  <span className="label shrink-0 pt-1 text-paper/55 group-hover:text-paper">{String(i + 1).padStart(2, '0')}</span>
                  <span className="leading-relaxed text-paper/80">{f}</span>
                </li>
              ))}
            </ol>
            <ShowAllButton count={features.length} open={showAll.features} onClick={() => setShowAll((v) => ({ ...v, features: !v.features }))} />
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
            <ol className="border-t border-line lg:col-span-9">
              {challenges.map((c, i) => (
                <li
                  key={i}
                  className={`reveal grid grid-cols-[3.5rem_1fr] items-baseline gap-4 border-b border-line py-6 md:grid-cols-[6rem_1fr] md:py-8 ${
                    !showAll.challenges && i >= MOBILE_LIST ? 'max-md:hidden' : ''
                  }`}
                >
                  <span className="display text-4xl text-paper/40 md:text-6xl">{String(i + 1).padStart(2, '0')}</span>
                  <p className="text-lg leading-relaxed text-paper/85 md:text-xl">{c}</p>
                </li>
              ))}
            </ol>
            <ShowAllButton count={challenges.length} open={showAll.challenges} onClick={() => setShowAll((v) => ({ ...v, challenges: !v.challenges }))} />
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
