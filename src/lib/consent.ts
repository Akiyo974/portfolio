/** Consentement aux cookies : rien n'est chargé (Analytics, Sentry) avant un « Accepter » explicite. */
const KEY = 'cookie_consent';

export const getConsent = (): 'accepted' | 'declined' | null => {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'accepted' || v === 'declined' ? v : null;
  } catch {
    return null;
  }
};

export const hasConsent = () => getConsent() === 'accepted';

export const setConsent = (value: 'accepted' | 'declined') => {
  try {
    localStorage.setItem(KEY, value);
    localStorage.setItem(`${KEY}_date`, new Date().toISOString());
  } catch {
    /* stockage indisponible */
  }
};
