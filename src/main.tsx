import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import './index.css';
import './i18n/config';
import { ErrorBoundary } from './components/ErrorBoundary';
import { initSentry } from './lib/sentry';

// Sentry : uniquement si les cookies ont déjà été acceptés (chargé à la demande)
void initSentry();

if (import.meta.env.DEV && typeof window !== 'undefined') {
  // Avoid stale SW/cached chunks in local dev causing mixed React runtime chunks.
  window.addEventListener('load', () => {
    if ('serviceWorker' in navigator) {
      void navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          void registration.unregister();
        });
      });
    }

    if ('caches' in window) {
      void caches.keys().then((keys) => {
        keys.forEach((key) => {
          void caches.delete(key);
        });
      });
    }
  });
}

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <HelmetProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </HelmetProvider>
      </ErrorBoundary>
    </StrictMode>
  );
}
