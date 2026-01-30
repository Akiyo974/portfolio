import { Suspense, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { NotFoundPage } from './pages/NotFoundPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import LegalNoticePage from './pages/LegalNoticePage';
import { CustomCursor } from './components/CustomCursor';
import { StarProvider } from './contexts/StarContext';
import { Achievement } from './components/Achievement';
import { StarGame } from './components/StarGame/index';
import { LoadingScreen } from './components/LoadingScreen';
import { ScrollToTop } from './components/ScrollToTop';
import { PageTransition } from './components/PageTransition';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { Breadcrumbs } from './components/Breadcrumbs';
import { CookieConsent } from './components/CookieConsent';
import { SkipToContent } from './components/SkipToContent';
import { AnimatePresence } from 'framer-motion';
import { usePWA } from './hooks/usePWA';
import { initGA, usePageTracking } from './hooks/useAnalytics';

function App() {
  // Initialize PWA
  usePWA();

  // Initialize Google Analytics
  useEffect(() => {
    initGA();
  }, []);

  // Track page views
  usePageTracking();

  return (
    <StarProvider>
      <div className="min-h-screen bg-background text-white">
        <SkipToContent />
        <CustomCursor />
        <LanguageSwitcher />
        <Breadcrumbs />
        <Achievement />
        <StarGame />
        <ScrollToTop />
        <CookieConsent />
        <Suspense fallback={<LoadingScreen />}>
          <AnimatePresence mode="wait">
            <PageTransition>
              <main id="main-content" tabIndex={-1} className="focus:outline-none">
                <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/project/:id" element={<ProjectDetailPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/legal-notice" element={<LegalNoticePage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
              </main>
            </PageTransition>
          </AnimatePresence>
        </Suspense>
      </div>
    </StarProvider>
  );
}

export default App;