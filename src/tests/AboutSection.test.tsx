import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AboutSection } from '../components/AboutSection';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
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
