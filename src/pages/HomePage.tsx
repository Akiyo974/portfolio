import React, { lazy, Suspense, useEffect } from 'react';
import { Seo } from '../components/Seo';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { HeroSection } from '../components/HeroSection';
import { ManifestoBand } from '../components/ManifestoBand';
import { AboutSection } from '../components/AboutSection';
import { ProjectsSection } from '../components/ProjectsSection';
import { LabTeaser } from '../components/LabTeaser';
import { ContactSection } from '../components/ContactSection';

import { Footer } from '../components/Footer';
import { useLenis } from '../hooks/useLenis';
import { scrollToTarget } from '../lib/motion';

// Assistant chargé après le contenu principal
const Chatbot = lazy(() => import('../components/Chatbot/Chatbot').then((m) => ({ default: m.Chatbot })));

export const HomePage = () => {
  const { t } = useTranslation();
  const { hash } = useLocation();
  useLenis();

  useEffect(() => {
    // Arrivée depuis une autre page via /#section
    const target = hash ? document.getElementById(hash.slice(1)) : null;
    if (target) {
      const timeout = setTimeout(() => scrollToTarget(target), 150);
      return () => clearTimeout(timeout);
    }
    window.scrollTo(0, 0);
  }, [hash]);

  return (
    <main className="bg-ink">
      <Seo
        path="/"
        type="profile"
        title={t('home.title', { defaultValue: 'Christen Dijoux — Développeur Full-stack & IA | Saguenay' })}
        description={t('home.description', { defaultValue: 'Portfolio de Christen Dijoux - Développeur Full-stack spécialisé en React, Node.js, TypeScript et WordPress Headless.' })}
      />
      <HeroSection />
      <ManifestoBand />
      <AboutSection />
      <ProjectsSection />
      <LabTeaser />
      <ContactSection />
      <Footer />
      <Suspense fallback={null}>
        <Chatbot botName="Assistant" position="bottom-right" />
      </Suspense>
    </main>
  );
};
