import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AboutSection } from '../components/AboutSection';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: { language: 'fr' },
    t: (key: string) => {
      if (key === 'about.interestsList') {
        return ['IA', 'Cloud', 'DevOps'];
      }

      if (key === 'about.experienceList') {
        return [
          {
            title: 'Titre',
            company: 'Entreprise',
            period: '2026',
            description: 'Description',
            highlights: ['Point 1']
          }
        ];
      }

      if (key === 'about.impactList') {
        return ['Impact 1', 'Impact 2'];
      }

      const translations: Record<string, string> = {
        'about.title': 'À propos',
        'about.intro': 'Introduction',
        'about.description': 'Je suis un développeur passionné...',
        'about.skills.title': 'Compétences',
        'about.experience.title': 'Expérience'
      };
      return translations[key] || key;
    }
  })
}));

vi.mock('gsap', () => ({
  gsap: {
    registerPlugin: vi.fn(),
    context: vi.fn((cb: () => void) => {
      cb();
      return { revert: vi.fn() };
    }),
    fromTo: vi.fn(),
    set: vi.fn()
  }
}));

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    create: vi.fn()
  }
}));

describe('AboutSection', () => {
  const renderAboutSection = () => {
    return render(
      <BrowserRouter>
        <AboutSection />
      </BrowserRouter>
    );
  };

  it('devrait afficher le titre de la section', () => {
    renderAboutSection();
    expect(screen.getByText('À propos')).toBeInTheDocument();
  });

  it('devrait être dans le DOM', () => {
    const { container } = renderAboutSection();
    expect(container.querySelector('section')).toBeInTheDocument();
  });
});
