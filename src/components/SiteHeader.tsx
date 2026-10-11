import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { LanguageSwitcher } from './LanguageSwitcher';
import { getLenis } from '../lib/motion';
import { NEGATIVE_EVENT } from './NegativeMode';

// 5 tapotements rapides sur le monogramme : mode « négatif » (easter egg)
let taps: number[] = [];
const countLogoTap = () => {
  const now = Date.now();
  taps = [...taps.filter((tt) => now - tt < 2500), now];
  if (taps.length >= 5) {
    taps = [];
    window.dispatchEvent(new Event(NEGATIVE_EVENT));
  }
};

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

  // Menu mobile plein écran : défilement bloqué, fermeture sur Échap et au changement de page
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const lenis = getLenis();
    lenis?.stop();
    document.documentElement.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

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
    <>
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
            onClick={() => {
              window.scrollTo(0, 0);
              countLogoTap();
            }}
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

      </header>

      {/* Hors du <header> : son backdrop-filter ferait du panneau fixe un enfant de 56 px de haut */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-x-0 bottom-0 top-14 z-[60] flex flex-col justify-between overflow-y-auto border-t border-line bg-ink md:hidden"
          >
            <ul>
              {sections.map((s, i) => (
                <motion.li
                  key={s.id}
                  initial={{ y: 28, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.18 + i * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <NavLink
                    id={s.id}
                    className="flex items-baseline justify-between border-b border-line px-4 py-5 font-display text-[clamp(3rem,15vw,5rem)] uppercase leading-[0.9] text-paper"
                  >
                    <span>{t(s.key)}</span>
                    <span className="font-mono text-[11px] tracking-[0.12em] text-paper/50">0{i + 1}</span>
                  </NavLink>
                </motion.li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="space-y-5 px-4 pb-8 pt-10"
            >
              <div className="flex flex-wrap gap-2">
                <Link to="/projects" className="btn-ghost">{t('projects.allProjects')}</Link>
                <Link to="/cv" className="btn-ghost">{t('about.viewCV')}</Link>
              </div>
              <a href="mailto:christen.dijoux@gmail.com" className="block font-display text-3xl text-paper underline decoration-paper/30 underline-offset-4">
                christen.dijoux@gmail.com
              </a>
              <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.12em] text-paper/60">
                <span>Saguenay, QC · 48.43°N</span>
                <span className="flex gap-4">
                  <a href="https://github.com/Akiyo974" target="_blank" rel="noopener noreferrer" className="hover:text-paper">GitHub ↗</a>
                  <a href="https://www.linkedin.com/in/christen-dijoux" target="_blank" rel="noopener noreferrer" className="hover:text-paper">LinkedIn ↗</a>
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
