import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProjectsSection } from '../components/ProjectsSection';

// Mock du module customProjects
vi.mock('../data/customProjects', () => ({
  customProjects: [
    {
      id: 'test-project-1',
      name: 'Test Project 1',
      title: 'Test Project 1',
      description: 'Description du projet test 1',
      languages: ['React', 'TypeScript'],
      topics: ['frontend', 'testing'],
      image: '/test-image-1.webp',
      isCustom: true
    },
    {
      id: 'test-project-2',
      name: 'Test Project 2',
      title: 'Test Project 2',
      description: 'Description du projet test 2',
      languages: ['Node.js', 'Express'],
      topics: ['backend', 'api'],
      image: '/test-image-2.webp',
      isCustom: true
    }
  ]
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'projects.title': 'Projets',
        'projects.description': 'Découvrez mes réalisations'
      };
      return translations[key] || key;
    }
  })
}));

// Mock de GSAP
vi.mock('gsap', () => ({
  gsap: {
    fromTo: vi.fn(),
    set: vi.fn()
  }
}));

describe('ProjectsSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderProjectsSection = () => {
    return render(
      <BrowserRouter>
        <ProjectsSection />
      </BrowserRouter>
    );
  };

  it('devrait afficher le titre de la section', async () => {
    renderProjectsSection();
    await waitFor(() => {
      expect(screen.getByText('Projets')).toBeInTheDocument();
    });
  });

  it('devrait afficher la liste des projets', async () => {
    renderProjectsSection();
    await waitFor(() => {
      expect(screen.getByText('Test Project 1')).toBeInTheDocument();
      expect(screen.getByText('Test Project 2')).toBeInTheDocument();
    });
  });

  it('devrait afficher les descriptions des projets', async () => {
    renderProjectsSection();
    await waitFor(() => {
      expect(screen.getByText(/Description du projet test 1/)).toBeInTheDocument();
      expect(screen.getByText(/Description du projet test 2/)).toBeInTheDocument();
    });
  });

  it('devrait afficher les technologies utilisées', async () => {
    renderProjectsSection();
    await waitFor(() => {
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('TypeScript')).toBeInTheDocument();
      expect(screen.getByText('Node.js')).toBeInTheDocument();
    });
  });
});
