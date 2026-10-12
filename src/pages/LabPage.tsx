import React, { lazy, Suspense, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { Footer } from '../components/Footer';
import { SectionLabel, MetaRow } from '../components/ui/Editorial';
import { SplitText } from '../components/ui/Kinetic';
import { Counter } from '../components/ui/Counter';
import { AsciiField } from '../components/ui/AsciiField';
import { LabDemo, LazyMount } from '../components/lab/LabDemos';
import { FlowField } from '../components/lab/experiments/FlowField';
import { ParticleType } from '../components/lab/experiments/ParticleType';
import { ReactionDiffusion } from '../components/lab/experiments/ReactionDiffusion';
import { labComponents, labExperiments, labRetired, type ExperimentId, type Lang, type LabComponent } from '../data/lab';
import { useLenis } from '../hooks/useLenis';
import { scrollToTarget } from '../lib/motion';

const Chatbot = lazy(() => import('../components/Chatbot/Chatbot').then((m) => ({ default: m.Chatbot })));

const copy = {
  fr: {
    title: 'Lab — Christen Dijoux',
    description: "Le laboratoire : chaque composant du site disséqué (rôle, raison d'être, technique, verdict), puis des expériences libres en WebGL et canvas.",
    back: 'Accueil',
    kicker: 'Laboratoire',
    lead: "Ici, je démonte le site pièce par pièce. Chaque composant est présenté en direct, avec ce qu'il fait, pourquoi il existe, comment il marche et ce que j'en pense vraiment. Plus bas, des expériences libres, sans cahier des charges.",
    components: 'Composants',
    experiments: 'Expériences',
    componentsLead: 'Tout ce qui fait le site, un par un. Démos en direct, code dans le dépôt.',
    experimentsLead: "Pas de client, pas de contrainte. Des idées testées pour le plaisir, certaines finiront sur le site, d'autres non.",
    role: 'Rôle',
    why: 'Pourquoi',
    how: 'Comment',
    verdict: 'Verdict',
    relevance: 'Pertinence',
    cost: 'Coût',
    seeOn: 'Voir sur le site',
    retired: 'Retirés du site',
    status: 'Statut',
  },
  en: {
    title: 'Lab — Christen Dijoux',
    description: 'The lab: every component of the site taken apart (role, purpose, technique, verdict), then free experiments in WebGL and canvas.',
    back: 'Home',
    kicker: 'Laboratory',
    lead: "Here I take the site apart piece by piece. Each component is shown live, with what it does, why it exists, how it works and what I honestly think of it. Further down, free experiments with no brief.",
    components: 'Components',
    experiments: 'Experiments',
    componentsLead: 'Everything the site is made of, one by one. Live demos, code in the repository.',
    experimentsLead: "No client, no constraints. Ideas tried for fun — some will end up on the site, others won't.",
    role: 'Role',
    why: 'Why',
    how: 'How',
    verdict: 'Verdict',
    relevance: 'Relevance',
    cost: 'Cost',
    seeOn: 'See it on the site',
    retired: 'Retired from the site',
    status: 'Status',
  },
} as const;

const Experiment: React.FC<{ id: ExperimentId }> = ({ id }) => {
  switch (id) {
    case 'reaction-diffusion':
      return <ReactionDiffusion />;
    case 'particle-type':
      return <ParticleType />;
    case 'flow-field':
      return <FlowField />;
    case 'ascii':
      return <AsciiField />;
  }
};

const Stars: React.FC<{ n: number }> = ({ n }) => (
  <span aria-label={`${n}/3`}>
    {'★'.repeat(n)}
    <span className="text-paper/25">{'★'.repeat(3 - n)}</span>
  </span>
);

const ComponentEntry: React.FC<{ c: LabComponent; i: number; lang: Lang }> = ({ c, i, lang }) => {
  const t = copy[lang];
  return (
    <article id={`c-${c.id}`} className="grid scroll-mt-20 grid-cols-1 gap-8 border-t border-line py-12 md:py-16 lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-5">
        <p className="label">
          <span className="text-paper">C—{String(i + 1).padStart(2, '0')}</span> · {c.file}
        </p>
        <h3 className="heading mt-4 break-words text-[clamp(2.2rem,4.2vw,3.6rem)] uppercase">{c.name}</h3>
        <p className="mt-4 text-lg leading-relaxed text-paper/85">{c.role[lang]}</p>

        <dl className="mt-8 space-y-5">
          {([['why', c.why], ['how', c.how]] as const).map(([k, v]) => (
            <div key={k} className="grid grid-cols-[5.5rem_1fr] gap-4">
              <dt className="label pt-0.5">{t[k]}</dt>
              <dd className="text-[15px] leading-relaxed text-paper/70">{v[lang]}</dd>
            </div>
          ))}
        </dl>

        <ul className="mt-6 flex flex-wrap gap-1.5">
          {c.stack.map((s) => (
            <li key={s} className="chip normal-case tracking-normal">{s}</li>
          ))}
        </ul>

        <div className="mt-8 border border-line p-5">
          <MetaRow k={t.relevance} v={<Stars n={c.score} />} />
          <MetaRow k={t.cost} v={c.cost[lang]} />
          <p className="mt-4 text-[15px] leading-relaxed text-paper/80">
            <span className="label mr-2 text-paper">{t.verdict} —</span>
            {c.verdict[lang]}
          </p>
        </div>
      </div>

      <div className="order-first lg:order-none lg:col-span-7">
        <div className="crosshair relative aspect-[4/3] w-full overflow-hidden border border-line bg-ink lg:sticky lg:top-24">
          {c.demo ? (
            <LazyMount className="absolute inset-0">
              <LabDemo id={c.demo} lang={lang} />
            </LazyMount>
          ) : (
            <div className="bg-dots absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
              <p className="display text-[clamp(3rem,8vw,6rem)] text-outline">{c.name.split(' ')[0]}</p>
              {c.seeOn && (
                <Link to={c.seeOn} className="btn-ghost" data-magnetic>
                  {t.seeOn} <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              )}
            </div>
          )}
          {c.demo && <span className="label pointer-events-none absolute left-3 top-3 bg-ink/80 px-1.5">● live</span>}
        </div>
      </div>
    </article>
  );
};

export const LabPage: React.FC = () => {
  const { i18n } = useTranslation();
  const lang: Lang = i18n.language?.startsWith('fr') ? 'fr' : 'en';
  const t = copy[lang];
  const { hash } = useLocation();
  useLenis();

  useEffect(() => {
    // Arrivée depuis le sommaire de l'accueil : /lab#c-dither-hero
    const target = hash ? document.getElementById(hash.slice(1)) : null;
    if (target) {
      const timeout = setTimeout(() => scrollToTarget(target), 150);
      return () => clearTimeout(timeout);
    }
    window.scrollTo(0, 0);
  }, [hash]);

  return (
    <main className="min-h-screen bg-ink text-paper">
      <Helmet>
        <title>{t.title}</title>
        <meta name="description" content={t.description} />
        <link rel="canonical" href="https://christendijoux.com/lab" />
      </Helmet>

      <header className="px-4 pb-12 pt-8 sm:px-6 md:px-10 md:pb-20 md:pt-12">
        <Link to="/" className="label group flex w-fit items-center gap-2 hover:text-paper">
          <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
          {t.back}
        </Link>

        <div className="mt-10 grid grid-cols-1 gap-10 md:mt-14 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <SectionLabel index={0} total={2}>{t.kicker}</SectionLabel>
            <SplitText as="h1" trigger="intro" text="Lab" className="display mt-6 block text-[clamp(6rem,24vw,22rem)]" />
          </div>
          <div className="lg:col-span-5">
            <p className="text-lg leading-relaxed text-paper/80">{t.lead}</p>
            <nav className="mt-8 grid grid-cols-2 border-l border-t border-line" aria-label={t.kicker}>
              {[
                ['components', labComponents.length, t.components, '01'],
                ['experiments', labExperiments.length, t.experiments, '02'],
              ].map(([id, n, label, idx]) => (
                <a key={id as string} href={`#${id}`} data-scroll-to={id as string} className="group border-b border-r border-line p-5 transition-colors hover:bg-paper hover:text-ink">
                  <Counter value={n as number} className="display block text-6xl" />
                  <span className="label mt-2 block group-hover:text-ink">
                    {idx} · {label}
                  </span>
                </a>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* 01 — Catalogue des composants */}
      <section id="components" className="scroll-mt-16 border-t border-line px-4 pt-16 sm:px-6 md:px-10 md:pt-24">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionLabel index={1} total={2}>{t.components}</SectionLabel>
            <SplitText as="h2" text={t.components} className="display mt-6 block text-[clamp(3.4rem,10vw,9rem)]" />
          </div>
          <p className="max-w-sm text-paper/70 md:mb-4">{t.componentsLead}</p>
        </div>

        <div className="mt-12">
          {labComponents.map((c, i) => (
            <ComponentEntry key={c.id} c={c} i={i} lang={lang} />
          ))}
        </div>

        <div className="border-t border-line py-12 md:py-16">
          <h3 className="label mb-6">{t.retired}</h3>
          <ul className="grid grid-cols-1 border-l border-t border-line md:grid-cols-2">
            {labRetired.map((r) => (
              <li key={r.name} className="border-b border-r border-line p-5">
                <p className="heading text-2xl line-through decoration-paper/40">{r.name}</p>
                <p className="mt-2 text-sm leading-relaxed text-paper/65">{r.note[lang]}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 02 — Expériences libres */}
      <section id="experiments" className="relative scroll-mt-16 border-t border-line px-4 py-16 sm:px-6 md:px-10 md:py-24">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="relative">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <SectionLabel index={2} total={2}>{t.experiments}</SectionLabel>
              <SplitText as="h2" text={t.experiments} className="display mt-6 block text-[clamp(3.4rem,10vw,9rem)] text-outline" />
            </div>
            <p className="max-w-sm text-paper/70 md:mb-4">{t.experimentsLead}</p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2">
            {labExperiments.map((e, i) => (
              <article key={e.id} id={`e-${e.id}`} className={`scroll-mt-20 ${i % 2 ? 'md:mt-24' : ''}`}>
                <div className="crosshair relative aspect-square w-full overflow-hidden border border-line bg-ink">
                  <LazyMount className="absolute inset-0">
                    <Experiment id={e.id} />
                  </LazyMount>
                  <span className="label pointer-events-none absolute left-3 top-3 bg-ink/80 px-1.5">{e.hint[lang]}</span>
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-4">
                  <p className="label">
                    <span className="text-paper">E—{String(i + 1).padStart(2, '0')}</span> · {e.date}
                  </p>
                  <p className="label">
                    {t.status} : <span className="text-paper">{e.status[lang]}</span>
                  </p>
                </div>
                <h3 className="display mt-3 text-[clamp(2.6rem,5vw,4.5rem)]">{e.title}</h3>
                <p className="mt-3 max-w-lg leading-relaxed text-paper/70">{e.note[lang]}</p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {e.stack.map((s) => (
                    <li key={s} className="chip normal-case tracking-normal">{s}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer variant="minimal" />
      <Suspense fallback={null}>
        <Chatbot botName="Assistant" position="bottom-right" />
      </Suspense>
    </main>
  );
};

export default LabPage;
