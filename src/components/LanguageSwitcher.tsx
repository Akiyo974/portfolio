import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Language switcher component for toggling between French and English
 */
export const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();
  const isFr = i18n.language?.startsWith('fr');

  const toggleLanguage = () => {
    i18n.changeLanguage(isFr ? 'en' : 'fr');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center border border-line font-mono text-[11px] uppercase tracking-[0.1em] focus:outline-none focus-visible:ring-1 focus-visible:ring-paper"
      aria-label={`FR EN — ${t('a11y.toggleLanguage', { lang: isFr ? 'English' : 'Français' })}`}
    >

      <span className={`px-2 py-1.5 transition-colors ${isFr ? 'bg-paper text-ink' : 'text-paper/50'}`}>FR</span>{' '}
      <span className={`px-2 py-1.5 transition-colors ${!isFr ? 'bg-paper text-ink' : 'text-paper/50'}`}>EN</span>
    </button>
  );
};
