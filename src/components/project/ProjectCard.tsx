import React from 'react';
import { Github, ExternalLink, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface ProjectCardProps {
    id?: number | string;
    name: string;
    description: string;
    html_url: string;
    homepage?: string;
    language: string;
    topics: string[];
    stargazers_count: number;
    customLabel?: string;
    customDescription?: string;
    showCode?: boolean;
    isCustom?: boolean;
    siteType?: 'production' | 'demo';
}

const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export const ProjectCard: React.FC<ProjectCardProps> = ({
    id,
    name,
    description,
    html_url,
    homepage,
    language,
    topics,
    stargazers_count,
    customLabel,
    customDescription,
    showCode = true,
    isCustom = false,
    siteType = 'demo',
}) => {
    const { t } = useTranslation();
    const [isHovered, setIsHovered] = React.useState(false);
    
    // Déterminer le texte du bouton selon le type de site
    const siteButtonText = siteType === 'production' 
        ? t('projects.viewSiteProduction') 
        : t('projects.viewSiteDemo');

    return (
        <div 
            className="bg-white/5 rounded-xl overflow-hidden transition-all duration-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl font-bold">
                                {capitalizeFirstLetter(customLabel || name)}
                            </h2>
                            {isCustom ? (
                                <span className="px-3 py-1 border border-white/30 text-white/80 rounded-full text-xs font-medium">
                                    {t('projects.personalProject')}
                                </span>
                            ) : (
                                <span className="px-3 py-1 border border-white/30 text-white/80 rounded-full text-xs font-medium">
                                    {t('projects.githubProject')}
                                </span>
                            )}
                        </div>
                        {customLabel && (
                            <span className="text-sm text-white/60">
                                {t('projects.repositories')}: {capitalizeFirstLetter(name)}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-row gap-3 w-full sm:w-auto">
                        {isCustom && id && (
                            <Link
                                to={`/project/${id}`}
                                className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-all duration-300 flex-1 sm:flex-initial justify-center font-medium focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                                aria-label={`${t('projects.viewDetails')} - ${customLabel || name}`}
                            >
                                <FileText className="w-4 h-4" aria-hidden="true" />
                                <span>{t('projects.viewDetails')}</span>
                            </Link>
                        )}
                        {homepage && (
                            <motion.a
                                href={homepage}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-all duration-300 flex-1 sm:flex-initial justify-center focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                aria-label={`${siteButtonText} - ${customLabel || name} (s'ouvre dans un nouvel onglet)`}
                            >
                                <ExternalLink className="w-4 h-4" aria-hidden="true" />
                                <span>{siteButtonText}</span>
                            </motion.a>
                        )}
                        {showCode && (
                            <motion.a
                                href={html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-lg hover:bg-white hover:text-black transition-all duration-300 flex-1 sm:flex-initial justify-center focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                aria-label={`${t('projects.code')} - ${customLabel || name} sur GitHub (s'ouvre dans un nouvel onglet)`}
                            >
                                <Github className="w-4 h-4" aria-hidden="true" />
                                <span>{t('projects.code')}</span>
                            </motion.a>
                        )}
                    </div>
                </div>
                <p className="text-white/70 mb-6 leading-relaxed">
                    {customDescription || description}
                </p>
                <motion.div 
                    className="flex flex-wrap gap-2"
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: isHovered ? 1 : 0.8 }}
                >
                    {language && (
                        <span className="px-3 py-1 bg-white/10 rounded-full text-sm font-medium">
                            {capitalizeFirstLetter(language)}
                        </span>
                    )}
                    {topics?.map((topic) => (
                        <span 
                            key={topic} 
                            className="px-3 py-1 border border-white/20 rounded-full text-sm font-medium transition-colors duration-300 hover:bg-white/10"
                        >
                            {capitalizeFirstLetter(topic)}
                        </span>
                    ))}
                    {stargazers_count > 0 && (
                        <span className="px-3 py-1 bg-white/10 rounded-full text-sm font-medium flex items-center gap-1">
                            ★ {stargazers_count}
                        </span>
                    )}
                </motion.div>
            </div>
            <motion.div 
                className="h-1 bg-gradient-to-r from-white/20 to-transparent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
            />
        </div>
    );
};