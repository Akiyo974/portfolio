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

// Sections de l'accueil (ancres) + pages (routes) : deux liens de chaque côté du monogramme
type NavItem = { key: string; id?: string; to?: string };
const sections: NavItem[] = [
  { id: 'about', key: 'nav.about' },
  { id: 'projects', key: 'nav.projects' },
  { to: '/lab', key: 'nav.lab' },
  { id: 'contact', key: 'nav.contact' },
];

/**
 * En-tête éditorial : navigation mono en majuscules, monogramme centré.
 */
export const SiteHeader: React.FC = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const onHome = pathname === '/';
  const [inView, setInView] = useState<string | null>(null);

  // Accueil : la section visible au centre de l'écran est marquée active dans le menu
  useEffect(() => {
    setInView(null);
    if (!onHome) return;
    // #lab : sommaire du Lab sur l'accueil (le lien du menu mène à la page /lab)
    const els = ['about', 'projects', 'lab', 'contact'].map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setInView(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    );
    els.forEach((el) => io.observe(el));
    const onTop = () => window.scrollY < 200 && setInView(null);
    window.addEventListener('scroll', onTop, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onTop);
    };
  }, [onHome]);

  const isActive = (item: NavItem) =>
    item.to
      ? pathname.startsWith(item.to) || (onHome && inView === item.to.slice(1))
      : item.id === 'projects'
        ? pathname.startsWith('/project') || inView === 'projects'
        : inView === item.id;

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
    id.startsWith('/') ? (
      <Link to={id} onClick={() => setOpen(false)} className={className}>
        {children}
      </Link>
    ) : onHome ? (
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

  const NavGroup: React.FC<{ items: NavItem[]; offset: number; className?: string; compact?: boolean }> = ({
    items,
    offset,
    className = '',
    compact = false,
  }) => (
    <ul className={`hidden items-center lg:flex ${compact ? 'gap-5' : 'gap-8 xl:gap-12'} ${className}`}>
      {items.map((item, i) => {
        const active = isActive(item);
        return (
          <li key={item.key}>
            <NavLink
              id={item.to ?? item.id!}
              className={`${linkClass} group relative flex items-baseline gap-1.5 ${active ? '!text-paper' : ''}`}
            >
              {!compact && (
                <span className={`text-[9px] tabular-nums transition-colors ${active ? 'text-paper' : 'text-paper/35 group-hover:text-paper/70'}`}>
                  0{offset + i + 1}
                </span>
              )}
              <span>{t(item.key)}</span>
              <span
                aria-hidden="true"
                className={`absolute -bottom-1.5 left-0 h-px bg-paper transition-all duration-300 ${active ? 'w-full' : 'w-0 group-hover:w-full'}`}
              />
              {active && <span className="sr-only">(current)</span>}
            </NavLink>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-line bg-ink/85 backdrop-blur-md">
        <nav
          aria-label={t('nav.navigation')}
          className="mx-auto grid h-14 grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 md:h-16 md:px-10 lg:grid-cols-[1fr_auto_auto_auto_1fr]"
        >
          <Link to="/" className={`${linkClass} justify-self-start`} onClick={() => window.scrollTo(0, 0)}>
            Christen<span className="text-paper/55">.</span>Dijoux
          </Link>

          {/* Grand écran : 01 · 02 | CD | 03 · 04, resserrés autour du monogramme */}
          <NavGroup items={sections.slice(0, 2)} offset={0} className="justify-self-end pr-10 xl:pr-14" />

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

          <NavGroup items={sections.slice(2)} offset={2} className="justify-self-start pl-10 xl:pl-14" />

          <div className="flex items-center gap-3 justify-self-end">
            {/* Tablette : liens à droite, le centre reste au monogramme */}
            <NavGroup items={sections} offset={0} className="hidden md:flex lg:!hidden" compact />
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
                  key={s.key}
                  initial={{ y: 28, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.18 + i * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <NavLink
                    id={s.to ?? s.id!}
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
