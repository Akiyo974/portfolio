import React from 'react';
import { ProjectCard } from './ProjectCard';
import { motion } from 'framer-motion';

interface ProjectsListProps {
    projects: Array<{
        id: number | string;
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
    }>;
}

export const ProjectsList: React.FC<ProjectsListProps> = ({ projects }) => {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1]
            }
        }
    };

    return (
        <motion.div
            className="grid grid-cols-1 gap-8"
            variants={container}
            initial="hidden"
            animate="show"
        >
            {projects.length > 0 ? (
                projects.map((project) => (
                    <motion.div 
                        key={project.id} 
                        variants={item}
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ProjectCard {...project} />
                    </motion.div>
                ))
            ) : (
                <motion.div 
                    variants={item}
                    className="text-center py-16 bg-white/5 rounded-xl"
                >
                    <h3 className="text-xl font-semibold mb-2">Aucun projet trouvé</h3>
                    <p className="text-white/60">
                        Essayez de modifier vos critères de recherche
                    </p>
                </motion.div>
            )}
        </motion.div>
    );
};