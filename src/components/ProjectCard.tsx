import React from 'react';
import { Github, ExternalLink, Eye } from 'lucide-react';

interface ProjectCardProps {
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
}

const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export const ProjectCard: React.FC<ProjectCardProps> = ({
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
}) => {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
        <div 
            className="bg-white/5 rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300 transform hover:scale-[1.02]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-center sm:text-left mb-6">
                    <div className="mb-4 sm:mb-0">
                        <h2 className="text-2xl font-bold mb-1">
                            {capitalizeFirstLetter(customLabel || name)}
                        </h2>
                        {customLabel && (
                            <span className="text-sm text-white/60">
                                Dépôt: {capitalizeFirstLetter(name)}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-row gap-3 w-full sm:w-auto justify-center sm:justify-start">
                        {homepage && (
                            <a
                                href={homepage}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-all duration-300 group flex-1 sm:flex-initial justify-center"
                            >
                                <Eye className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                                <span>Voir le projet</span>
                            </a>
                        )}
                        {showCode && (
                            <a
                                href={html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-lg hover:bg-white hover:text-black transition-all duration-300 group flex-1 sm:flex-initial justify-center"
                            >
                                <Github className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                                <span>Code source</span>
                            </a>
                        )}
                    </div>
                </div>
                <p className="text-white/70 mb-6 leading-relaxed">
                    {customDescription || description}
                </p>
                <div className="flex flex-wrap gap-2">
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
                </div>
            </div>
            <div className={`h-1 bg-gradient-to-r from-white/20 to-transparent transition-transform duration-500 ${isHovered ? 'scale-x-100' : 'scale-x-0'}`} />
        </div>
    );
};