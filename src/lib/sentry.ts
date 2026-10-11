import { hasConsent } from './consent';

let sentryStarted = false;
// Module Sentry chargé à la demande (~250 Ko gzip) : jamais téléchargé sans consentement
let sentryModule: typeof import('@sentry/react') | null = null;

/** Remonte une erreur à Sentry s'il est actif (sinon ne fait rien). */
export const reportError = (error: unknown) => {
  sentryModule?.captureException(error);
};

export const initSentry = async () => {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  const environment = import.meta.env.VITE_SENTRY_ENVIRONMENT || import.meta.env.MODE;
  
  if (!dsn) {
    console.warn('Sentry DSN not configured. Skipping Sentry initialization.');
    return;
  }

  // Consentement explicite requis (opt-in) : suivi d'erreurs et replay de session
  if (!hasConsent() || sentryStarted) {
    return;
  }
  sentryStarted = true;
  const Sentry = await import('@sentry/react');
  sentryModule = Sentry;

  Sentry.init({
    dsn,
    environment,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        maskAllInputs: true, // les champs du formulaire de contact ne sont jamais enregistrés
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
