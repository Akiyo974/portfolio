import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Star, ArrowUp } from 'lucide-react';
import { useStar } from '../contexts/StarContext';
import { customProjects } from '../data/customProjects';
import { useProximityWeight } from './ui/Kinetic';

interface FooterProps {
  variant?: 'default' | 'minimal';
}

const linkClass =
  'font-mono text-[12px] uppercase tracking-[0.08em] text-paper/60 hover:text-paper transition-colors focus:outline-none focus-visible:underline';

const Column: React.FC<{ title: string; label: string; children: React.ReactNode }> = ({ title, label, children }) => (
  <nav className="flex flex-col" aria-label={label}>
    <p className="label mb-2">{label}</p>
    <h3 className="heading mb-5 text-3xl">{title}</h3>
    <ul className="space-y-3">{children}</ul>
  </nav>
);

/** Signature géante : la graisse de chaque lettre suit le curseur. */
const FooterSignature: React.FC = () => {
  const ref = useRef<HTMLParagraphElement>(null);
  useProximityWeight(ref, { min: 120, max: 900, radius: 340 });
  return (
    <p
      ref={ref}
      className="display absolute inset-x-0 bottom-0 translate-y-[10%] select-none whitespace-nowrap px-2 text-center text-[16vw]"
      style={{ fontVariationSettings: '"wght" 120' }}
      aria-hidden="true"
    >
      {Array.from('Christen Dijoux').map((ch, i) => (
        <span key={i} className="char inline-block">
          {ch === ' ' ? '\u00a0' : ch}
        </span>
      ))}
    </p>
  );
};

export const Footer: React.FC<FooterProps> = ({ variant = 'default' }) => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const { stars, toggleStar, collectedStars, totalStars, openGame } = useStar();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full border-t border-line bg-ink text-paper" role="contentinfo">
      {/* Bandeau image + signature géante */}
      <div className="relative h-[46vw] max-h-[560px] min-h-[260px] overflow-hidden">
        <img
          src="/assets/art/ridge-lines.png"
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/30 to-ink" aria-hidden="true" />
        <FooterSignature />
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-10 px-4 py-14 sm:gap-12 sm:px-6 md:px-10 lg:grid-cols-12">
        {/* Marque */}
        <div className="col-span-2 lg:col-span-4">
          <div className="flex items-center gap-3">
            <span className="border border-paper/70 px-1.5 pb-0.5 pt-1 font-display text-2xl font-semibold leading-none">CD</span>
            <button
              onClick={() => toggleStar('footer')}
              className="p-1 transition-transform duration-300 hover:scale-110 focus:outline-none focus-visible:ring-1 focus-visible:ring-paper"
              aria-label={stars.footer ? t('game.starFound', { defaultValue: 'Étoile trouvée' }) : t('game.hiddenStar', { defaultValue: 'Étoile cachée' })}
              aria-pressed={stars.footer}
            >
              <Star className={`h-5 w-5 text-paper transition-colors duration-300 ${stars.footer ? 'fill-paper' : 'fill-transparent'}`} />
            </button>
          </div>
          <p className="mt-5 font-mono text-[12px] uppercase tracking-[0.08em] text-paper">{t('ui.footerTagline')}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-paper/55">{t('footer.description')}</p>
        </div>

        <div className="lg:col-span-2">
          {variant === 'default' ? (
            <Column title={t('nav.projects')} label={t('nav.projects')}>
              {customProjects.slice(0, 5).map((project) => (
                <li key={project.id}>
                  <Link to={`/project/${project.id}`} className={linkClass}>
                    {project.name}
                  </Link>
                </li>
              ))}
            </Column>
          ) : (
            <Column title={t('nav.navigation')} label={t('nav.navigation')}>
              <li>
                <Link to="/" onClick={() => window.scrollTo(0, 0)} className={linkClass}>
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/projects" onClick={() => window.scrollTo(0, 0)} className={linkClass}>
                  {t('nav.projects')}
                </Link>
              </li>
            </Column>
          )}
        </div>

        <div className="lg:col-span-2">
          <Column title={t('ui.footerSocial')} label={t('ui.footerSocial')}>
            <li><a href="https://github.com/Akiyo974" target="_blank" rel="noopener noreferrer" className={linkClass}>GitHub ↗</a></li>
            <li><a href="https://www.linkedin.com/in/christen-dijoux" target="_blank" rel="noopener noreferrer" className={linkClass}>LinkedIn ↗</a></li>
            <li><a href="mailto:christen.dijoux@gmail.com" className={linkClass}>Email ↗</a></li>
          </Column>
        </div>

        <div className="lg:col-span-2">
          <Column title="Légal" label="Informations légales">
            <li>
              <Link to="/privacy-policy" onClick={() => window.scrollTo(0, 0)} className={linkClass}>
                {t('privacy.title')}
              </Link>
            </li>
            <li>
              <Link to="/legal-notice" onClick={() => window.scrollTo(0, 0)} className={linkClass}>
                {t('legal.title')}
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  localStorage.removeItem('cookie_consent');
                  localStorage.removeItem('cookie_consent_date');
                  window.location.reload();
                }}
                className={`${linkClass} text-left`}
                aria-label={t('footer.manageCookies')}
              >
                {t('footer.manageCookies')}
              </button>
            </li>
          </Column>
        </div>

        <div className="lg:col-span-2">
          <div className="flex flex-col">
            <p className="label mb-2">{t('footer.location')}</p>
            <h3 className="heading mb-5 text-3xl">{t('hero.location')}</h3>
            <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-paper/60">{t('hero.region')}</p>
            <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-paper/55">48.43°N · 71.07°W</p>
          </div>
        </div>
      </div>

      {/* Barre du bas */}
      <div className="flex flex-col items-start justify-between gap-4 border-t border-line px-4 py-6 sm:flex-row sm:items-center sm:px-6 md:px-10">
        <div className="space-y-1">
          <p className="label">
            © {currentYear} Christen Dijoux. {t('footer.allRightsReserved')}
          </p>
          {/* Crédits */}
          <p className="label text-paper/55">
            {t('ui.credits', { defaultValue: 'Design & code' })} — Christen Dijoux · Big Shoulders Display, Geist · React, GSAP, Three.js
          </p>
        </div>
        {/* Chasse aux étoiles : progression, puis accès au jeu */}
        {collectedStars === totalStars ? (
          <button
            type="button"
            onClick={openGame}
            data-magnetic
            className="label flex items-center gap-2 border border-line px-3 py-1.5 text-paper transition-colors hover:bg-paper hover:text-ink focus:outline-none focus-visible:ring-1 focus-visible:ring-paper"
          >
            ✦ {t('game.play', { defaultValue: 'Jouer au jeu des étoiles' })}
          </button>
        ) : (
          <p className="label flex items-center gap-2" title={t('game.huntHint', { defaultValue: 'Des étoiles sont cachées sur le site…' })}>
            <span aria-hidden="true">✦</span>
            {collectedStars} / {totalStars} {t('game.starsFound', { defaultValue: 'étoiles trouvées' })}
          </p>
        )}
        <button
          onClick={scrollToTop}
          className="label group flex items-center gap-2 hover:text-paper focus:outline-none focus-visible:underline"
          aria-label={t('footer.backToTop')}
        >
          {t('footer.backToTop')}
          <ArrowUp className="h-3 w-3 transition-transform group-hover:-translate-y-0.5" />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
