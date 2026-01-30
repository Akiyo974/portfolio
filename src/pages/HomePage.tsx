import React, { useEffect, lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { HeroSection } from '../components/HeroSection';
import { Footer } from '../components/Footer';
import { useLenis } from '../hooks/useLenis';

const AboutSection = lazy(() => import('../components/AboutSection').then(m => ({ default: m.AboutSection })));
const ProjectsSection = lazy(() => import('../components/ProjectsSection').then(m => ({ default: m.ProjectsSection })));
const ContactSection = lazy(() => import('../components/ContactSection').then(m => ({ default: m.ContactSection })));
const Chatbot = lazy(() => import('../components/Chatbot/Chatbot').then(module => ({ default: module.Chatbot })));

export const HomePage = () => {
  const { t } = useTranslation();
  useLenis();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="bg-black">
      <Helmet>
        <title>{t('home.title', { defaultValue: 'Christen Dijoux | Développeur Full-stack & Créatif' })}</title>
        <meta name="description" content={t('home.description', { defaultValue: 'Portfolio de Christen Dijoux - Développeur Full-stack spécialisé en React, Node.js, TypeScript et WordPress Headless. Découvrez mes projets créatifs et mes compétences en développement web moderne.' })} />
        <link rel="canonical" href="https://christendijoux.com/" />
      </Helmet>
      <HeroSection />
      <Suspense fallback={<div className="min-h-screen bg-black" />}>
        <AboutSection />
        <ProjectsSection />
        <ContactSection />
      </Suspense>
      <Footer />
      <Suspense fallback={null}>
        <Chatbot
          botName="Assistant"
          welcomeMessage="👋 Bonjour ! Comment puis-je vous aider aujourd'hui ?"
          position="bottom-right"
        />
      </Suspense>
    </main>
  );
};