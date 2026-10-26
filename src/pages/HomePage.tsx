import React, { lazy, Suspense, useEffect, useState } from 'react';
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

// Sections sous le hero, montées une à une pendant les temps libres du navigateur :
// le premier rendu ne construit que le hero (au lieu d'une longue tâche qui bloque le téléphone).
const BELOW_FOLD = [ManifestoBand, AboutSection, ProjectsSection, LabTeaser, ContactSection, Footer];
const idle = (fn: () => void) =>
  typeof window.requestIdleCallback === 'function'
    ? window.requestIdleCallback(fn, { timeout: 250 })
    : window.setTimeout(fn, 16);
const cancelIdle = (id: number) =>
  typeof window.cancelIdleCallback === 'function' ? window.cancelIdleCallback(id) : window.clearTimeout(id);

// Assistant chargé après le contenu principal
const Chatbot = lazy(() => import('../components/Chatbot/Chatbot').then((m) => ({ default: m.Chatbot })));

export const HomePage = () => {
  const { t } = useTranslation();
  const { hash } = useLocation();
  // Arrivée sur une ancre (/#contact) : toutes les sections tout de suite, sinon une par une
  const [mounted, setMounted] = useState(() => (hash ? BELOW_FOLD.length : 0));
  useLenis();

  useEffect(() => {
    if (mounted >= BELOW_FOLD.length) return;
    const id = idle(() => setMounted((n) => n + 1));
    return () => cancelIdle(id);
  }, [mounted]);

  useEffect(() => {
    // Arrivée depuis une autre page via /#section : on attend que la section existe
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    setMounted(BELOW_FOLD.length);
    let tries = 0;
    let timeout = 0;
    const go = () => {
      const target = document.getElementById(hash.slice(1));
      if (target) scrollToTarget(target);
      else if (tries++ < 30) timeout = window.setTimeout(go, 100);
    };
    timeout = window.setTimeout(go, 150);
    return () => clearTimeout(timeout);
  }, [hash]);

  return (
    <main className="bg-ink">
      <Seo
        path="/"
        type="profile"
        title={t('home.title', { defaultValue: 'Christen Dijoux — Développeur full-stack & IA | Saguenay' })}
        description={t('home.description', { defaultValue: 'Portfolio de Christen Dijoux - Développeur Full-stack spécialisé en React, Node.js, TypeScript et WordPress Headless.' })}
      />
      <HeroSection />
      {BELOW_FOLD.slice(0, mounted).map((Section, i) => (
        <Section key={i} />
      ))}
      <Suspense fallback={null}>
        <Chatbot botName="Assistant" position="bottom-right" />
      </Suspense>
    </main>
  );
};
