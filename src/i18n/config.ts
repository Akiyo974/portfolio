import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en.json';
import translationFR from './locales/fr.json';

const resources = {
  en: {
    translation: translationEN
  },
  fr: {
    translation: translationFR
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en', // anglais par défaut (public international) ; ?lang=fr ou le sélecteur pour le français
    debug: false,
    interpolation: {
      escapeValue: false
    },
    detection: {
      // ?lang=en|fr force la langue (liens partagés, CV PDF) ; sinon le choix mémorisé, sinon l'anglais
      order: ['querystring', 'localStorage'],
      lookupQuerystring: 'lang',
      caches: ['localStorage']
    }
  });

// Attribut lang du document synchronisé (lecteurs d'écran, césure, SEO)
const syncLang = (lng: string) => document.documentElement.setAttribute('lang', lng.startsWith('fr') ? 'fr' : 'en');
syncLang(i18n.language || 'en');
i18n.on('languageChanged', syncLang);

export default i18n;
