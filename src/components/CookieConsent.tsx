import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { X, Cookie } from 'lucide-react';

export function CookieConsent() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà donné son consentement
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      // Afficher la bannière après 1 seconde
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'accepted');
    localStorage.setItem('cookie_consent_date', new Date().toISOString());
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie_consent', 'declined');
    localStorage.setItem('cookie_consent_date', new Date().toISOString());
    setIsVisible(false);
    
    // Désactiver Google Analytics si l'utilisateur refuse
    if ((window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        'analytics_storage': 'denied'
      });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[9999] max-w-md animate-slideUp">
      <div className="bg-black/95 backdrop-blur-lg border border-white/10 rounded-xl shadow-2xl">
        <div className="p-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Cookie className="w-5 h-5 text-white flex-shrink-0" />
              <h3 className="text-base font-bold text-white">
                Cookies
              </h3>
            </div>
            <button
              onClick={handleDecline}
              className="p-1.5 hover:bg-white/5 rounded-lg transition-colors flex-shrink-0"
              aria-label="Fermer"
            >
              <X className="w-4 h-4 text-white/60" />
            </button>
          </div>

          <p className="text-sm text-white/70 mb-4 leading-relaxed">
            {t('cookieConsent.description')}{' '}
            <Link 
              to="/privacy-policy" 
              className="text-blue-400 hover:text-blue-300 underline"
            >
              {t('cookieConsent.privacyLink')}
            </Link>
          </p>

          <div className="flex flex-col gap-2">
            <button
              onClick={handleAccept}
              className="w-full px-4 py-2 text-sm bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-all duration-300"
            >
              {t('cookieConsent.accept')}
            </button>
            <button
              onClick={handleDecline}
              className="w-full px-4 py-2 text-sm bg-white/5 text-white font-semibold rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300"
            >
              {t('cookieConsent.decline')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
