import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getConsent, setConsent } from '../lib/consent';
import { initGA, trackPageview } from '../hooks/useAnalytics';
import { initSentry } from '../lib/sentry';

/**
 * Bandeau de consentement (opt-in) : Analytics et Sentry ne démarrent qu'après « Accepter ».
 */
export function CookieConsent() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (getConsent()) return;
    // Laisse le préchargeur et l'intro se terminer avant d'afficher le bandeau
    const timer = setTimeout(() => setIsVisible(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleAccept = () => {
    setConsent('accepted');
    setIsVisible(false);
    initGA();
    trackPageview();
    void initSentry();
  };

  const handleDecline = () => {
    setConsent('declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-title"
      className="animate-slideUp fixed inset-x-2 bottom-2 z-[75] sm:inset-x-auto sm:bottom-4 sm:left-4 sm:max-w-sm"
    >
      <div className="crosshair border border-line bg-ink/95 p-4 text-paper backdrop-blur-md">
        <p id="cookie-title" className="label text-paper">
          ✦ {t('cookieConsent.title', { defaultValue: 'Cookies' }).replace(/🍪\s*/, '')}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-paper/75">
          {t('cookieConsent.description')}{' '}
          <Link to="/privacy-policy" className="text-paper underline decoration-paper/30 underline-offset-4 hover:decoration-paper">
            {t('cookieConsent.privacyLink')}
          </Link>
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button type="button" onClick={handleDecline} className="btn-ghost px-3">
            {t('cookieConsent.declineShort', { defaultValue: 'Refuser' })}
          </button>
          <button type="button" onClick={handleAccept} className="btn-solid px-3">
            {t('cookieConsent.acceptShort', { defaultValue: 'Accepter' })}
          </button>
        </div>
      </div>
    </div>
  );
}
