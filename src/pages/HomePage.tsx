import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { HeroSection } from '../components/HeroSection';
import { AboutSection } from '../components/AboutSection';
import { ProjectsSection } from '../components/ProjectsSection';
import { ContactSection } from '../components/ContactSection';
import { Chatbot } from '../components/Chatbot/Chatbot';
import { Footer } from '../components/Footer';
import { useLenis } from '../hooks/useLenis';

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
      <AboutSection />
      <ProjectsSection />
      <ContactSection />
      <Footer />
      <Chatbot
        botName="Assistant"
        welcomeMessage="👋 Bonjour ! Comment puis-je vous aider aujourd'hui ?"
        position="bottom-right"
      />
    </main>
  );
};