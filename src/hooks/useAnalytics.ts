import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

let isInitialized = false;

export const initGA = () => {
  const measurementId = import.meta.env.VITE_GA4_MEASUREMENT_ID;
  
  if (!measurementId) {
    console.warn('GA4 Measurement ID not configured. Analytics tracking disabled.');
    return;
  }

  // Vérifier le consentement des cookies
  const consent = localStorage.getItem('cookie_consent');
  if (consent === 'declined') {
    console.log('Analytics disabled: user declined cookies');
    return;
  }

  if (isInitialized) {
    return;
  }

  ReactGA.initialize(measurementId, {
    gaOptions: {
      anonymizeIp: true,
    },
    gtagOptions: {
      send_page_view: false, // We'll send manually
    },
  });

  isInitialized = true;
};

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    if (!isInitialized) return;

    ReactGA.send({
      hitType: 'pageview',
      page: location.pathname + location.search,
      title: document.title,
    });
  }, [location]);
};

export const trackEvent = (category: string, action: string, label?: string, value?: number) => {
  if (!isInitialized) return;

  ReactGA.event({
    category,
    action,
    label,
    value,
  });
};

export const trackOutboundLink = (url: string, label?: string) => {
  trackEvent('Outbound Link', 'click', label || url);
};

export const trackProjectView = (projectId: string, projectName: string) => {
  trackEvent('Project', 'view', `${projectId} - ${projectName}`);
};

export const trackContactSubmit = (success: boolean) => {
  trackEvent('Contact', 'submit', success ? 'success' : 'error');
};

export const trackStarToggle = (location: string, isAdded: boolean) => {
  trackEvent('Interaction', isAdded ? 'star_added' : 'star_removed', location);
};

export const trackLanguageSwitch = (language: string) => {
  trackEvent('Settings', 'language_switch', language);
};
