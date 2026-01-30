import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { customProjects } from '../data/customProjects';

export const Breadcrumbs = () => {
  const location = useLocation();
  const { t } = useTranslation();
  
  // Ne pas afficher sur la page d'accueil
  if (location.pathname === '/') {
    return null;
  }

  const pathnames = location.pathname.split('/').filter((x) => x);
  
  // Fonction pour obtenir le label traduit d'un segment
  const getSegmentLabel = (segment: string, index: number) => {
    // Si c'est un ID de projet
    if (pathnames[index - 1] === 'project') {
      const project = customProjects.find(p => p.id === segment);
      if (project) {
        return t(`customProjects.${project.id}.title`, { defaultValue: project.title });
      }
      return segment;
    }
    
    // Segments standards
    const labels: Record<string, string> = {
      'projects': t('breadcrumbs.projects', { defaultValue: 'Projets' }),
      'project': t('breadcrumbs.projects', { defaultValue: 'Projets' }),
    };
    
    return labels[segment] || segment;
  };

  return (
    <nav aria-label="Breadcrumb" className="bg-black border-b border-white/10">
      <div className="max-w-6xl mx-auto px-8 py-4">
        <ol className="flex items-center gap-2 text-sm">
          {/* Home */}
          <li>
            <Link
              to="/"
              className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors"
              aria-label={t('breadcrumbs.home', { defaultValue: 'Accueil' })}
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">{t('breadcrumbs.home', { defaultValue: 'Accueil' })}</span>
            </Link>
          </li>

          {/* Segments du path */}
          {pathnames.map((segment, index) => {
            const isLast = index === pathnames.length - 1;
            // Rediriger 'project' vers 'projects'
            const routeTo = segment === 'project' && !isLast 
              ? '/projects' 
              : `/${pathnames.slice(0, index + 1).join('/')}`;
            const label = getSegmentLabel(segment, index);

            return (
              <li key={routeTo} className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-white/30" />
                {isLast ? (
                  <span className="text-white font-medium" aria-current="page">
                    {label}
                  </span>
                ) : (
                  <Link
                    to={routeTo}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
};
