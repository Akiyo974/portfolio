import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Star, ArrowUpRight } from 'lucide-react';
import { useStar } from '../contexts/StarContext';
import { customProjects } from '../data/customProjects';

interface FooterProps {
  variant?: 'default' | 'minimal';
}

export const Footer: React.FC<FooterProps> = ({ variant = 'default' }) => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const { stars, toggleStar } = useStar();

  const handleStarClick = () => {
    toggleStar('footer');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-black text-white border-t border-white/10" role="contentinfo">
      <div className="max-w-6xl mx-auto px-8 py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand section */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={handleStarClick}
                className="p-1 hover:scale-110 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded"
                aria-label={stars.footer ? "Retirer l'étoile" : "Ajouter l'étoile"}
              >
                <Star 
                  className={`w-5 h-5 text-white transition-colors duration-300 ${
                    stars.footer ? 'fill-white' : 'fill-transparent'
                  }`}
                />
              </button>
              <span className="font-bold text-xl">Christen Dijoux</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          {/* Navigation or Projects */}
          {variant === 'default' && (
            <nav className="flex flex-col" aria-label="Projets">
              <h3 className="font-semibold mb-4">{t('nav.projects')}</h3>
              <ul className="space-y-2.5">
                {customProjects.slice(0, 5).map((project) => (
                  <li key={project.id}>
                    <Link
                      to={`/project/${project.id}`}
                      className="text-white/60 hover:text-white transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded"
                    >
                      {project.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {variant === 'minimal' && (
            <nav className="flex flex-col" aria-label="Navigation principale">
              <h3 className="font-semibold mb-4">{t('nav.navigation')}</h3>
              <ul className="space-y-2.5">
                <li>
                  <Link 
                    to="/"
                    onClick={() => window.scrollTo(0, 0)}
                    className="text-white/60 hover:text-white transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded"
                  >
                    {t('nav.home')}
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/projects"
                    onClick={() => window.scrollTo(0, 0)}
                    className="text-white/60 hover:text-white transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded"
                  >
                    {t('nav.projects')}
                  </Link>
                </li>
              </ul>
            </nav>
          )}

          {/* Legal */}
          <nav className="flex flex-col" aria-label="Informations légales">
            <h3 className="font-semibold mb-4">Légal</h3>
            <ul className="space-y-2.5">
              <li>
                <Link 
                  to="/privacy-policy"
                  onClick={() => window.scrollTo(0, 0)}
                  className="text-white/60 hover:text-white transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded"
                >
                  {t('privacy.title')}
                </Link>
              </li>
              <li>
                <Link 
                  to="/legal-notice"
                  onClick={() => window.scrollTo(0, 0)}
                  className="text-white/60 hover:text-white transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded"
                >
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
                  className="text-white/60 hover:text-white transition-colors text-sm text-left focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded"
                  aria-label={t('footer.manageCookies')}
                >
                  {t('footer.manageCookies')}
                </button>
              </li>
            </ul>
          </nav>

          {/* Location */}
          <div className="flex flex-col">
            <h3 className="font-semibold mb-4">{t('footer.location')}</h3>
            <p className="text-white/60 text-sm">{t('hero.location')}</p>
            <p className="text-white/60 text-sm">{t('hero.region')}</p>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mt-6 group focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded"
              aria-label={t('footer.backToTop')}
            >
              <span className="text-sm">{t('footer.backToTop')}</span>
              <ArrowUpRight className="w-4 h-4 transform group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10">
          <p className="text-white/70 text-sm text-center">
            © {currentYear} Christen Dijoux. {t('footer.allRightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;