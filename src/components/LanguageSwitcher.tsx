import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

/**
 * Language switcher component for toggling between French and English
 */
export const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'fr' ? 'en' : 'fr';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
      aria-label={t('a11y.toggleLanguage', { lang: i18n.language === 'en' ? 'Français' : 'English' })}
    >
      <Globe className="w-5 h-5 text-white" aria-hidden="true" />
      <span className="text-white font-medium uppercase">
        <span className="sr-only">{t('a11y.currentLanguage')}: </span>
        {i18n.language === 'fr' ? 'EN' : 'FR'}
      </span>
    </button>
  );
};
