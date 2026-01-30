import * as Sentry from '@sentry/react';

export const initSentry = () => {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  const environment = import.meta.env.VITE_SENTRY_ENVIRONMENT || import.meta.env.MODE;
  
  if (!dsn) {
    console.warn('Sentry DSN not configured. Skipping Sentry initialization.');
    return;
  }

  // Vérifier le consentement des cookies
  const consent = localStorage.getItem('cookie_consent');
  if (consent === 'declined') {
    console.log('Sentry disabled: user declined cookies');
    return;
  }

  Sentry.init({
    dsn,
    environment,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    
    // Performance Monitoring
    tracesSampleRate: environment === 'production' ? 0.1 : 1.0,
    
    // Session Replay
    replaysSessionSampleRate: environment === 'production' ? 0.1 : 1.0,
    replaysOnErrorSampleRate: 1.0,
    
    // Release tracking
    release: __APP_VERSION__,
    
    // Filter errors
    beforeSend(event) {
      // Don't send events in development if explicitly disabled
      if (environment === 'development' && import.meta.env.VITE_SENTRY_DISABLE_DEV === 'true') {
        return null;
      }
      return event;
    },
    
    // Ignore specific errors
    ignoreErrors: [
      'Non-Error promise rejection captured',
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications',
    ],
  });
};

// Declare global for version
declare global {
  const __APP_VERSION__: string;
}
