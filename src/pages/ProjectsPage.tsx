import { useEffect, useState, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Github } from 'lucide-react';
import { customProjects } from '../data/customProjects';
import { Footer } from '../components/Footer';
import { ProjectFilter } from '../components/project/ProjectFilter';
import { ProjectsList } from '../components/project/ProjectsList';
import { motion } from 'framer-motion';

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

const EXCLUDED_REPOS = ['Akiyo974', 'repo-a-cacher-2'];

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

          const allRepos = [...customRepos, ...filteredRepos];

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

        const allRepos = [...customRepos, ...filteredRepos];

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

  return (
    <motion.main
      className="min-h-screen bg-black text-white pt-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Helmet>
        <title>{t('projects.title')} - Christen Dijoux</title>
        <meta name="description" content={t('projects.description')} />
        
        {/* Breadcrumb JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Accueil",
                "item": "https://christendijoux.com/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Projets",
                "item": "https://christendijoux.com/projects"
              }
            ]
          })}
        </script>
      </Helmet>
      <div className="max-w-6xl mx-auto px-8 py-12">
        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link 
            to="/" 
            className="flex items-center gap-2 text-white hover:text-white/80 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>{t('projects.backHome')}</span>
          </Link>
          <div className="flex items-center gap-6">
            <h1 className="text-4xl font-bold">{t('projects.allProjects')}</h1>
            <a
              href="https://github.com/Akiyo974"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors group"
            >
              <Github className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span>{repoCount} {t('projects.repositories')}</span>
            </a>
          </div>
        </motion.div>

        <ProjectFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          availableLanguages={availableLanguages}
        />

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : error ? (
          <motion.div 
            className="text-center py-16 bg-red-500/10 rounded-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-xl font-semibold mb-2">Erreur</h3>
            <p className="text-white/60">{error}</p>
          </motion.div>
        ) : (
          <ProjectsList projects={filteredRepos} />
        )}
      </div>
      <Footer variant="minimal" />
      <Suspense fallback={null}>
        <Chatbot
          botName="Assistant"
          welcomeMessage="👋 Bonjour ! Comment puis-je vous aider aujourd'hui ?"
          position="bottom-right"
        />
      </Suspense>
    </motion.main>
  );
};