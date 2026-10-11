import { useEffect, useState, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Github } from 'lucide-react';
import { customProjects } from '../data/customProjects';
import { Footer } from '../components/Footer';
import { ProjectFilter } from '../components/project/ProjectFilter';
import { ProjectIndex } from '../components/project/ProjectIndex';
import { SectionLabel } from '../components/ui/Editorial';
import { SplitText } from '../components/ui/Kinetic';
import { Counter } from '../components/ui/Counter';
import { useLenis } from '../hooks/useLenis';

const Chatbot = lazy(() => import('../components/Chatbot/Chatbot').then(module => ({ default: module.Chatbot })));

interface Repository {
  id: number | string;
  name: string;
  description: string;
  html_url: string;
  topics: string[];
  language: string;
  stargazers_count: number;
  homepage?: string;
  isCustom?: boolean;
  customLabel?: string;
  customDescription?: string;
  showCode?: boolean;
}

// Dépôts masqués de l'index : profil, exercices d'école et tests (on garde les projets représentatifs)
const EXCLUDED_REPOS = [
  'Akiyo974',
  'repo-a-cacher-2',
  'AkiSpotify',
  'AkiSupport',
  'cas-pratique-scss',
  'form-multi-etape',
  'react-animated-service-selector',
  'Gsap_Project_Test',
  'FireCrawlDemo',
  'UP---Appli-sur-cellulaire',
];

const CUSTOM_REPO_INFO: Record<string, {
  label?: string;
  description?: string;
  showCode?: boolean;
}> = {
  'webana': {
    label: 'Webana - L\'Art du Katana',
    description: 'Site e-commerce démonstratif conçu avec React et TailwindCSS. Il présente l\'histoire des katanas et simule leur vente avec des filtres dynamiques, un panier, et un mode clair/sombre.'
  },
  'akiproject': {
    label: 'AkiProject',
    description: 'Gestionnaire de tâches et messagerie en temps réel développés avec Bootstrap, jQuery, et PHP. Conçu pour démontrer les compétences en communication asynchrone et gestion de tâches dans un contexte académique.'
  },
  'portfolio': {
    label: 'Portfolio',
    description: 'Portfolio personnel développé avec React, TypeScript et TailwindCSS. Présente mes projets et compétences avec des animations GSAP et Three.js.'
  }
};

export const ProjectsPage = () => {
  const { t } = useTranslation();
  const [repos, setRepos] = useState<Repository[]>([]);
  const [repoCount, setRepoCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  useLenis();

  // Cache pour les repos GitHub
  const CACHE_KEY = 'github_repos_cache';
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  const getCachedRepos = (): { data: Repository[], timestamp: number } | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        const now = Date.now();
        if (now - parsed.timestamp < CACHE_DURATION) {
          return parsed;
        }
      }
    } catch (error) {
      console.error('Error reading cache:', error);
    }
    return null;
  };

  const setCachedRepos = (data: Repository[]) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Error setting cache:', error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        // Vérifier le cache d'abord
        const cached = getCachedRepos();
        if (cached) {
          const filteredRepos = cached.data.filter((repo) =>
            !EXCLUDED_REPOS.includes(repo.name)
          ).map(repo => ({
            ...repo,
            ...(CUSTOM_REPO_INFO[repo.name.toLowerCase()] || {})
          }));

          // Ajouter les projets personnalisés
          const customRepos = customProjects.map(project => ({
            id: project.id,
            name: project.name,
            description: project.description,
            html_url: project.codeUrl || '#',
            topics: project.topics,
            language: project.languages[0] || 'Custom',
            stargazers_count: 0,
            homepage: project.siteUrl,
            isCustom: true,
            customLabel: project.title,
            customDescription: project.description,
            showCode: !!project.codeUrl
          }));

          const customIds = new Set(customProjects.map((c) => c.id.toLowerCase()));
          const allRepos = [...customRepos, ...filteredRepos.filter((r) => !customIds.has(r.name.toLowerCase()))];

          const languages = Array.from(new Set(allRepos
            .map(repo => repo.language)
            .filter((lang): lang is string => Boolean(lang))));
            
          setAvailableLanguages(languages);
          setRepos(allRepos);
          setRepoCount(allRepos.length);
          setLoading(false);
          return;
        }

        // Si pas de cache, fetch depuis GitHub
        const response = await fetch('https://api.github.com/users/Akiyo974/repos');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des dépôts');
        }
        const data: Repository[] = await response.json();

        // Mettre en cache
        setCachedRepos(data);

        const filteredRepos = data.filter((repo) =>
          !EXCLUDED_REPOS.includes(repo.name)
        ).map(repo => ({
          ...repo,
          ...(CUSTOM_REPO_INFO[repo.name.toLowerCase()] || {})
        }));

        // Ajouter les projets personnalisés
        const customRepos = customProjects.map(project => ({
          id: project.id,
          name: project.name,
          description: project.description,
          html_url: project.codeUrl || '#',
          topics: project.topics,
          language: project.languages[0] || 'Custom',
          stargazers_count: 0,
          homepage: project.siteUrl,
          isCustom: true,
          customLabel: project.title,
          customDescription: project.description,
          showCode: !!project.codeUrl
        }));

        const customIds = new Set(customProjects.map((c) => c.id.toLowerCase()));
          const allRepos = [...customRepos, ...filteredRepos.filter((r) => !customIds.has(r.name.toLowerCase()))];

        const languages = Array.from(new Set(allRepos
          .map(repo => repo.language)
          .filter((lang): lang is string => Boolean(lang))));
          
        setAvailableLanguages(languages);
        setRepos(allRepos);
        setRepoCount(allRepos.length);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  const filteredRepos = repos.filter((repo) =>
    (!selectedLanguage || repo.language === selectedLanguage) &&
    (repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     repo.description?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const customCount = repos.filter((r) => r.isCustom).length;

  return (
    <main className="min-h-screen bg-ink text-paper">
      <Helmet>
        <title>{t('projects.title')} - Christen Dijoux</title>
        <meta name="description" content={t('projects.description')} />

        {/* Breadcrumb JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Accueil", "item": "https://christendijoux.com/" },
              { "@type": "ListItem", "position": 2, "name": "Projets", "item": "https://christendijoux.com/projects" }
            ]
          })}
        </script>
      </Helmet>

      <header className="px-4 pb-12 pt-8 sm:px-6 md:px-10 md:pb-16 md:pt-12">
        <div className="flex items-center justify-between">
          <Link to="/" className="label group flex items-center gap-2 hover:text-paper">
            <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
            {t('projects.backHome')}
          </Link>
          <a
            href="https://github.com/Akiyo974"
            target="_blank"
            rel="noopener noreferrer"
            className="label group flex items-center gap-2 hover:text-paper"
          >
            <Github className="h-3.5 w-3.5" aria-hidden="true" />
            {repoCount} {t('projects.repositories')}
          </a>
        </div>

        <div className="mt-10 flex flex-col justify-between gap-6 md:mt-14 md:flex-row md:items-end">
          <div>
            <SectionLabel index={1} total={1}>{t('projects.allProjects')}</SectionLabel>
            <SplitText as="h1" trigger="intro" text={t('ui.indexTitle')} className="display mt-6 block text-[clamp(3.6rem,13vw,14rem)]" />
          </div>
          <div className="grid grid-cols-2 gap-8 md:mb-4">
            <div>
              <Counter value={customCount} className="display block text-6xl" />
              <p className="label mt-1">{t('ui.caseStudies')}</p>
            </div>
            <div>
              <Counter value={repoCount} className="display block text-6xl" />
              <p className="label mt-1">{t('ui.totalEntries')}</p>
            </div>
          </div>
        </div>
      </header>

      <section className="px-4 pb-24 sm:px-6 md:px-10">
        <ProjectFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          availableLanguages={availableLanguages}
        />

        {loading ? (
          <div className="border-y border-line py-16 font-mono text-[12px] text-paper/60">
            <span className="text-paper/40">{'>'}</span> fetching github.com/Akiyo974 <span className="animate-blink">_</span>
          </div>
        ) : error ? (
          <div className="border border-line p-8">
            <p className="label">× Error</p>
            <p className="mt-3 text-paper/70">{error}</p>
          </div>
        ) : (
          <ProjectIndex projects={filteredRepos} />
        )}
      </section>

      <Footer variant="minimal" />
      <Suspense fallback={null}>
        <Chatbot
          botName="Assistant"
          position="bottom-right"
        />
      </Suspense>
    </main>
  );
};
