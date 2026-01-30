import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import * as Sentry from '@sentry/react';
import App from './App';
import './index.css';
import './i18n/config';
import { ErrorBoundary } from './components/ErrorBoundary';
import { initSentry } from './lib/sentry';

// Initialize Sentry
initSentry();

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <Sentry.ErrorBoundary fallback={<div>Une erreur est survenue</div>} showDialog>
        <HelmetProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </HelmetProvider>
      </Sentry.ErrorBoundary>
    </StrictMode>
  );
}
