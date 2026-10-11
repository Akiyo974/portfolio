import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from './LanguageSwitcher';

const sections = [
  { id: 'about', key: 'nav.about' },
  { id: 'projects', key: 'nav.projects' },
  { id: 'contact', key: 'nav.contact' },
] as const;

/**
 * En-tête éditorial : navigation mono en majuscules, monogramme centré.
 */
export const SiteHeader: React.FC = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const onHome = pathname === '/';

  const NavLink: React.FC<{ id: string; children: React.ReactNode; className?: string }> = ({ id, children, className = '' }) =>
    onHome ? (
      <a href={`#${id}`} data-scroll-to={id} onClick={() => setOpen(false)} className={className}>
        {children}
      </a>
    ) : (
      <Link to={`/#${id}`} onClick={() => setOpen(false)} className={className}>
        {children}
      </Link>
    );

  const linkClass =
    'font-mono text-[12px] uppercase tracking-[0.12em] text-paper/80 hover:text-paper transition-colors focus:outline-none focus-visible:underline';

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/85 backdrop-blur-md">
      <nav aria-label={t('nav.navigation')} className="mx-auto grid h-14 grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 md:h-16 md:grid-cols-5 md:px-10">
        <Link to="/" className={`${linkClass} justify-self-start`} onClick={() => window.scrollTo(0, 0)}>
          Christen<span className="text-paper/55">.</span>Dijoux
        </Link>

        <NavLink id="about" className={`${linkClass} hidden justify-self-center md:block`}>
          {t('nav.about')}
        </NavLink>

        <Link
          to="/"
          onClick={() => window.scrollTo(0, 0)}
          aria-label={`CD — ${t('nav.home')}`}
          className="justify-self-center border border-paper/70 px-1.5 pb-0.5 pt-1 font-display text-[18px] font-semibold uppercase leading-none tracking-tight text-paper transition-colors hover:bg-paper hover:text-ink md:text-[20px]"
        >
          CD
        </Link>

        <NavLink id="projects" className={`${linkClass} hidden justify-self-center md:block`}>
          {t('nav.projects')}
        </NavLink>

        <div className="flex items-center gap-3 justify-self-end">
          <NavLink id="contact" className={`${linkClass} hidden md:block`}>
            {t('nav.contact')}
          </NavLink>
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="btn-ghost px-3 py-2 md:hidden"
          >
            {open ? '×' : 'Menu'}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-nav" className="border-t border-line md:hidden">
          {sections.map((s, i) => (
            <NavLink key={s.id} id={s.id} className="flex items-center justify-between border-b border-line px-4 py-4 font-display text-3xl uppercase text-paper">
              <span>{t(s.key)}</span>
              <span className="font-mono text-[11px] text-paper/50">0{i + 1}</span>
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
};
