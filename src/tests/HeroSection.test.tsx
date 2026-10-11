import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HeroSection } from '../components/HeroSection';
import { StarProvider } from '../contexts/StarContext';

// Mock des hooks et composants
vi.mock('../hooks/useLocalTime', () => ({
  useLocalTime: () => '14:30'
}));

vi.mock('../hooks/useReducedMotion', () => ({
  useReducedMotion: () => false
}));

vi.mock('../hooks/useIntersectionObserver', () => ({
  useIntersectionObserver: () => true
}));

vi.mock('../components/ThreeScene', () => ({
  default: () => <div data-testid="three-scene">ThreeScene</div>
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, opts?: { defaultValue?: string }) => {
      const translations: Record<string, string> = {
        'hero.location': 'Montréal, QC',
        'hero.region': 'Canada',
        'hero.role': 'Développeur',
        'hero.roleDetail': 'Full-stack',
        'hero.tagline': 'Portfolio créatif'
      };
      return translations[key] || opts?.defaultValue || key;
    }
  })
}));

describe('HeroSection', () => {
  const renderHeroSection = () => {
    return render(
      <BrowserRouter>
        <StarProvider>
          <HeroSection />
        </StarProvider>
      </BrowserRouter>
    );
  };

  it('devrait afficher le nom correctement', () => {
    renderHeroSection();
    expect(screen.getByText('Christen')).toBeInTheDocument();
    expect(screen.getByText('Dijoux')).toBeInTheDocument();
  });

  it('devrait afficher la localisation', () => {
    renderHeroSection();
    expect(screen.getByText('Montréal, QC')).toBeInTheDocument();
    expect(screen.getByText('Canada')).toBeInTheDocument();
  });

  it('devrait afficher le rôle', () => {
    renderHeroSection();
    expect(screen.getByText('Développeur')).toBeInTheDocument();
    expect(screen.getByText('Full-stack')).toBeInTheDocument();
  });

  it('devrait afficher l\'heure locale', () => {
    renderHeroSection();
    expect(screen.getAllByText('14')).toHaveLength(1);
    expect(screen.getAllByText('30')).toHaveLength(1);
  });

  it('devrait afficher l\'année courante dans le tagline', () => {
    renderHeroSection();
    const currentYear = new Date().getFullYear();
    expect(screen.getAllByText(new RegExp(currentYear.toString()))).toHaveLength(1);
  });

  it('devrait afficher le bouton étoile', () => {
    renderHeroSection();
    // une étoile pour mobile, une pour ordinateur (une seule affichée à la fois)
    const starButton = screen.getAllByRole('button', { name: /étoile/i })[0];
    expect(starButton).toBeInTheDocument();
  });
});
