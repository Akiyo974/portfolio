import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { Footer } from './Footer';
import { SplitText } from './ui/Kinetic';
import { useLenis } from '../hooks/useLenis';
import { scrollToTarget } from '../lib/motion';
import { tr, type Block, type Lang, type LegalDoc, type T } from '../data/legal';

const linkClass = 'text-paper underline decoration-paper/30 underline-offset-4 transition-colors hover:decoration-paper';

/** Rend courriels, URL et chemins internes (/privacy-policy…) cliquables dans un texte. */
const Rich: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split(/(\S+@\S+\.\w+|https?:\/\/[^\s,)]+|\b[a-z0-9-]+\.(?:gouv\.qc\.ca|fr|com)\b|\/\.?[a-z][\w./-]*[a-z])/gi);
  return (
    <>
      {parts.map((part, i) => {
        if (!part) return null;
        if (/^\S+@\S+\.\w+$/.test(part)) return <a key={i} href={`mailto:${part}`} className={linkClass}>{part}</a>;
        if (/^https?:\/\//.test(part)) return <a key={i} href={part} target="_blank" rel="noopener noreferrer" className={linkClass}>{part.replace(/^https?:\/\//, '')}</a>;
        if (/^[a-z0-9-]+\.(gouv\.qc\.ca|fr|com)$/i.test(part)) return <a key={i} href={`https://${part}`} target="_blank" rel="noopener noreferrer" className={linkClass}>{part}</a>;
        if (/^\/\.?[a-z]/i.test(part)) {
          return part.startsWith('/.well-known') ? (
            <a key={i} href={part} className={linkClass}>{part}</a>
          ) : (
            <Link key={i} to={part} className={linkClass}>{part}</Link>
          );
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </>
  );
};

const BlockView: React.FC<{ block: Block; lang: Lang }> = ({ block, lang }) => {
  const t = (x: T) => tr(lang, x);
  if ('p' in block) {
    return <p className="leading-relaxed text-paper/75"><Rich text={t(block.p)} /></p>;
  }
  if ('note' in block) {
    return <p className="border-l border-paper/40 pl-4 text-sm leading-relaxed text-paper/60"><Rich text={t(block.note)} /></p>;
  }
  if ('list' in block) {
    return (
      <ul className="space-y-2">
        {block.list.map((item, i) => (
          <li key={i} className="grid grid-cols-[1.25rem_1fr] leading-relaxed text-paper/75">
            <span aria-hidden="true" className="font-mono text-paper/60">—</span>
            <span><Rich text={t(item)} /></span>
          </li>
        ))}
      </ul>
    );
  }
  // Tableau : en cartes empilées sur mobile, en grille sur grand écran
  const { head, rows } = block.table;
  const grid = { '--cols': head.length } as React.CSSProperties;
  const gridClass = 'md:grid md:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))]';
  return (
    <div className="border-t border-line" role="table">
      <div role="row" className={`hidden border-b border-line ${gridClass}`} style={grid}>
        {head.map((h, i) => (
          <span key={i} role="columnheader" className="label py-3 pr-4">{t(h)}</span>
        ))}
      </div>
      {rows.map((row, r) => (
        <div key={r} role="row" className={`space-y-1 border-b border-line py-4 md:space-y-0 md:py-3 ${gridClass}`} style={grid}>
          {row.map((cell, c) => (
            <div key={c} role="cell" className={`pr-4 text-[15px] leading-relaxed ${c === 0 ? 'font-medium text-paper' : 'text-paper/70'}`}>
              {c > 0 && <span className="label mr-2 md:hidden">{t(head[c])} ·</span>}
              <Rich text={t(cell)} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

/**
 * Gabarit éditorial des pages légales : en-tête, encadré « En bref », sommaire numéroté
 * (collant sur grand écran) et sections numérotées.
 */
export const LegalLayout: React.FC<{ doc: LegalDoc; other: { to: string; label: T } }> = ({ doc, other }) => {
  const { i18n } = useTranslation();
  const lang: Lang = i18n.language?.startsWith('fr') ? 'fr' : 'en';
  const t = (x: T) => tr(lang, x);
  useLenis();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const updated = new Date(`${doc.updated}T12:00:00`).toLocaleDateString(lang === 'fr' ? 'fr-CA' : 'en-CA', { year: 'numeric', month: 'long', day: 'numeric' });
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <main className="min-h-screen bg-ink text-paper">
      <header className="px-4 pb-12 pt-8 sm:px-6 md:px-10 md:pb-16 md:pt-12">
        <Link to="/" className="label group -my-1 flex w-fit items-center gap-2 py-1 hover:text-paper">
          <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
          {lang === 'fr' ? 'Accueil' : 'Home'}
        </Link>
        <div className="mt-10 md:mt-14">
          <p className="label flex items-center gap-3">
            <span className="h-3 w-px bg-paper" aria-hidden="true" />
            <span>[ <span className="text-paper">LEGAL</span> ] · {t(doc.kicker)}</span>
          </p>
          <SplitText as="h1" trigger="intro" text={t(doc.title)} className="display mt-6 block text-[clamp(3.4rem,11vw,11rem)]" />
          <p className="label mt-6">
            {lang === 'fr' ? 'Dernière mise à jour' : 'Last updated'} · <time dateTime={doc.updated} className="text-paper">{updated}</time>
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-12 border-t border-line px-4 py-12 sm:px-6 md:px-10 md:py-16 lg:grid-cols-12 lg:gap-10">
        <aside className="lg:col-span-4">
          <div className="space-y-8 lg:sticky lg:top-24">
            <div className="crosshair border border-line p-5">
              <p className="label mb-4 text-paper">{t(doc.summary.title)}</p>
              <ul className="space-y-3">
                {doc.summary.items.map((item, i) => (
                  <li key={i} className="grid grid-cols-[1.25rem_1fr] text-[15px] leading-relaxed text-paper/80">
                    <span aria-hidden="true" className="font-mono text-paper/60">✳</span>
                    <span>{t(item)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <nav aria-label={lang === 'fr' ? 'Sommaire' : 'Contents'} className="hidden lg:block">
              <p className="label mb-3">{lang === 'fr' ? 'Sommaire' : 'Contents'}</p>
              <ol className="border-t border-line">
                {doc.sections.map((s, i) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToTarget(s.id, -80);
                      }}
                      className="group flex items-baseline gap-3 border-b border-line py-2 font-mono text-[12px] uppercase tracking-[0.08em] text-paper/65 transition-colors hover:bg-paper hover:text-ink"
                    >
                      <span className="w-6 pl-1 text-paper/60 group-hover:text-ink/70">{pad(i + 1)}</span>
                      <span className="normal-case tracking-normal">{t(s.title)}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </aside>

        <div className="max-w-3xl space-y-14 lg:col-span-8">
          {doc.sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-24">
              <h2 className="heading flex items-baseline gap-4 border-t border-line pt-6 text-[clamp(1.8rem,3vw,2.6rem)] text-paper">
                <span className="font-mono text-[12px] tracking-[0.1em] text-paper/60">{pad(i + 1)}</span>{' '}
                {t(s.title)}
              </h2>
              <div className="mt-6 space-y-5">
                {s.blocks.map((b, j) => {
                  // Un paragraphe suivi d'une liste fait office de sous-titre
                  const next = s.blocks[j + 1];
                  if ('p' in b && next && 'list' in next && !/[.:]$/.test(tr(lang, b.p))) {
                    return <h3 key={j} className="label pt-2 text-paper">{tr(lang, b.p)}</h3>;
                  }
                  return <BlockView key={j} block={b} lang={lang} />;
                })}
              </div>
            </section>
          ))}

          <p className="border-t border-line pt-6 text-sm text-paper/60">
            {lang === 'fr' ? 'Voir aussi' : 'See also'} : <Link to={other.to} className={linkClass}>{t(other.label)}</Link>
          </p>
        </div>
      </div>

      <Footer variant="minimal" />
    </main>
  );
};

export default LegalLayout;
