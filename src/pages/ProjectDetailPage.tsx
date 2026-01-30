import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Github, Calendar, CheckCircle2, AlertCircle, Archive } from 'lucide-react';
import { customProjects } from '../data/customProjects';
import { Footer } from '../components/Footer';

export const ProjectDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const project = customProjects.find(p => p.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!project) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Helmet>
          <title>404 - {t('projectDetail.notFound')} | Christen Dijoux</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">{t('projectDetail.notFound')}</h1>
          <Link to="/projects" className="text-white/60 hover:text-white transition-colors">
            {t('projectDetail.backToProjects')}
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = {
    completed: { icon: CheckCircle2, label: t('projectDetail.status.completed'), color: 'text-green-400' },
    'in-progress': { icon: AlertCircle, label: t('projectDetail.status.inProgress'), color: 'text-yellow-400' },
    archived: { icon: Archive, label: t('projectDetail.status.archived'), color: 'text-gray-400' }
  };

  const StatusIcon = project.status ? statusConfig[project.status].icon : CheckCircle2;
  const statusLabel = project.status ? statusConfig[project.status].label : 'Terminé';
  const statusColor = project.status ? statusConfig[project.status].color : 'text-green-400';

  // Récupérer les traductions i18n pour le SEO
  const translatedTitle = t(`customProjects.${project.id}.title`, { defaultValue: project.title });
  const translatedDescription = t(`customProjects.${project.id}.description`, { defaultValue: project.description });
  const translatedLongDescription = t(`customProjects.${project.id}.longDescription`, { defaultValue: project.longDescription || project.description });

  return (
    <motion.main
      className="min-h-screen bg-black text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Helmet>
        <title>{translatedTitle} - Projet | Christen Dijoux</title>
        <meta name="description" content={translatedDescription} />
        <meta name="keywords" content={`${project.languages.join(', ')}, ${project.topics.join(', ')}, web development, portfolio`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={`${translatedTitle} - Projet Personnel`} />
        <meta property="og:description" content={translatedDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://christendijoux.com/project/${project.id}`} />
        {project.image && (
          <>
            <meta property="og:image" content={`https://christendijoux.com${project.image}`} />
            <meta property="og:image:width" content="879" />
            <meta property="og:image:height" content="495" />
            <meta property="og:image:alt" content={translatedTitle} />
          </>
        )}
        <meta property="article:published_time" content={`${project.year}-01-01`} />
        <meta property="article:modified_time" content="2025-11-20" />
        <meta property="article:author" content="Christen Dijoux" />
        <meta property="article:tag" content={project.topics.join(', ')} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${translatedTitle} - Projet Personnel`} />
        <meta name="twitter:description" content={translatedDescription} />
        {project.image && (
          <>
            <meta name="twitter:image" content={`https://christendijoux.com${project.image}`} />
            <meta name="twitter:image:alt" content={translatedTitle} />
          </>
        )}
        <meta name="twitter:creator" content="@ChristenDijoux" />
        
        {/* Canonical */}
        <link rel="canonical" href={`https://christendijoux.com/project/${project.id}`} />

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
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": translatedTitle,
                "item": `https://christendijoux.com/project/${project.id}`
              }
            ]
          })}
        </script>
      </Helmet>
      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group mb-8"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>{t('projectDetail.back')}</span>
          </button>

          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl md:text-5xl font-bold">{translatedTitle}</h1>
              <span className="px-3 py-1 border border-white/30 text-white/80 rounded-full text-sm font-medium">
                {t('projectDetail.personalProject')}
              </span>
            </div>
            {project.year && (
              <div className="flex items-center gap-2 text-white/60 mt-2">
                <Calendar className="w-4 h-4" />
                <span>{project.year}</span>
                {project.status && (
                  <>
                    <span className="mx-2">•</span>
                    <StatusIcon className={`w-4 h-4 ${statusColor}`} />
                    <span className={statusColor}>{statusLabel}</span>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            {project.siteUrl && (
              <a
                href={project.siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg hover:bg-white/90 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>
                  {project.siteType === 'production' 
                    ? t('projectDetail.viewSite') 
                    : t('projectDetail.viewDemo')}
                </span>
              </a>
            )}
            {project.codeUrl && (
              <a
                href={project.codeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 border border-white/20 rounded-lg hover:bg-white hover:text-black transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>{t('projectDetail.sourceCode')}</span>
              </a>
            )}
          </div>
        </motion.div>

        {/* Image principale */}
        <motion.div
          className="relative aspect-video rounded-xl overflow-hidden mb-12 bg-white/5"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <img
            src={project.image}
            alt={`Capture d'écran du projet ${translatedTitle}`}
            width="1200"
            height="675"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenu principal */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* Description */}
            <section className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-colors">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-white rounded-full"></span>
                {t('projectDetail.about')}
              </h2>
              <p className="text-white/80 leading-relaxed">
                {translatedLongDescription}
              </p>
            </section>

            {/* Fonctionnalités */}
            {project.features && project.features.length > 0 && (
              <section className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-colors">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 bg-green-400 rounded-full"></span>
                  {t('projectDetail.features')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {project.features.map((feature, index) => {
                    const translatedFeature = t(`customProjects.${project.id}.features.${index}`, { defaultValue: feature });
                    return (
                      <div 
                        key={index} 
                        className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-white/80 text-sm leading-relaxed">{translatedFeature}</span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Défis */}
            {project.challenges && project.challenges.length > 0 && (
              <section className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-colors">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <span className="w-1 h-6 bg-yellow-400 rounded-full"></span>
                  {t('projectDetail.challenges')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {project.challenges.map((challenge, index) => {
                    const translatedChallenge = t(`customProjects.${project.id}.challenges.${index}`, { defaultValue: challenge });
                    return (
                      <div 
                        key={index} 
                        className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <span className="text-white/80 text-sm leading-relaxed">{translatedChallenge}</span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.aside
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {/* Langages */}
            <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-white/20 transition-colors">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-white rounded-full"></span>
                {t('projectDetail.languages')}
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.languages.map((lang) => (
                  <span
                    key={lang}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white hover:text-black rounded-lg text-sm font-medium transition-colors"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            {/* Technologies */}
            {project.technologies && (
              <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-white/20 transition-colors">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="w-1 h-5 bg-white rounded-full"></span>
                  {t('projectDetail.technologies')}
                </h3>
                <div className="space-y-4">
                  {project.technologies.frontend && (
                    <div>
                      <h4 className="text-xs uppercase tracking-wider text-white/50 mb-2 font-semibold">
                        {t('projectDetail.frontend')}
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {project.technologies.frontend.map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-1 border border-white/20 hover:border-white hover:bg-white hover:text-black rounded-md text-xs transition-colors"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {project.technologies.backend && (
                    <div>
                      <h4 className="text-xs uppercase tracking-wider text-white/50 mb-2 font-semibold">
                        {t('projectDetail.backend')}
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {project.technologies.backend.map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-1 border border-white/20 hover:border-white hover:bg-white hover:text-black rounded-md text-xs transition-colors"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {project.technologies.tools && (
                    <div>
                      <h4 className="text-xs uppercase tracking-wider text-white/50 mb-2 font-semibold">
                        {t('projectDetail.tools')}
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {project.technologies.tools.map((tool) => (
                          <span
                            key={tool}
                            className="px-2.5 py-1 border border-white/20 hover:border-white hover:bg-white hover:text-black rounded-md text-xs transition-colors"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tags */}
            {project.topics && project.topics.length > 0 && (
              <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-white/20 transition-colors">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <span className="w-1 h-5 bg-white rounded-full"></span>
                  {t('projectDetail.tags')}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.topics.map((topic) => (
                    <span
                      key={topic}
                      className="px-3 py-1.5 border border-white/20 hover:border-white rounded-lg text-sm hover:bg-white hover:text-black transition-colors cursor-default"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.aside>
        </div>

        {/* Projets en lien */}
        {project.relatedProjects && project.relatedProjects.length > 0 && (
          <motion.section
            className="mt-12 bg-white/5 rounded-xl p-6 border border-white/10 hover:border-white/20 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-blue-400 rounded-full"></span>
              {t('projectDetail.relatedProjects')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.relatedProjects.map((relatedId) => {
                const relatedProject = customProjects.find(p => p.id === relatedId);
                if (!relatedProject) return null;
                
                const translatedTitle = t(`customProjects.${relatedProject.id}.title`, { defaultValue: relatedProject.title });
                const translatedDescription = t(`customProjects.${relatedProject.id}.description`, { defaultValue: relatedProject.description });
                
                return (
                  <Link
                    key={relatedId}
                    to={`/project/${relatedId}`}
                    className="group bg-white/5 rounded-lg p-4 border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all"
                  >
                    <div className="aspect-video rounded-lg overflow-hidden mb-3 bg-white/5">
                      <img
                        src={relatedProject.image}
                        alt={`Aperçu du projet ${translatedTitle}`}
                        width="400"
                        height="225"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-white/90 transition-colors">
                      {translatedTitle}
                    </h3>
                    <p className="text-white/60 text-sm line-clamp-2">
                      {translatedDescription}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {relatedProject.languages.slice(0, 3).map((lang) => (
                        <span
                          key={lang}
                          className="px-2 py-0.5 bg-white/10 rounded text-xs"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* Navigation vers autres projets */}
        <motion.div
          className="mt-16 pt-8 border-t border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>{t('projectDetail.allProjects')}</span>
          </Link>
        </motion.div>
      </div>
      <Footer variant="minimal" />
    </motion.main>
  );
};
