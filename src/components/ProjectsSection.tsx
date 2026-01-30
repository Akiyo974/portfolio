import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, ExternalLink, ArrowRight, FileText } from 'lucide-react';
import { customProjects } from '../data/customProjects';

gsap.registerPlugin(ScrollTrigger);

export const ProjectsSection = () => {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const projectRefs = useRef<(HTMLDivElement | null)[]>([]);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      projectRefs.current.forEach((project, index) => {
        if (project) {
          gsap.fromTo(project,
            {
              y: 100,
              opacity: 0,
              scale: 0.95
            },
            {
              scrollTrigger: {
                trigger: project,
                start: "top bottom-=100",
                end: "top center",
                scrub: 1,
                markers: false,
              },
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 1,
              ease: "power4.out",
            }
          );
        }
      });

      if (buttonRef.current) {
        gsap.fromTo(buttonRef.current,
          {
            y: 30,
            opacity: 0
          },
          {
            scrollTrigger: {
              trigger: buttonRef.current,
              start: "top bottom-=50",
              end: "top center",
              scrub: 1,
              markers: false,
            },
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="min-h-screen w-full bg-black text-white py-24 px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-16 border-b border-white/20 pb-4">{t('projects.title')}</h2>
        <div className="grid grid-cols-1 gap-16">
          {customProjects.slice(0, 3).map((project, index) => (
            <div
              key={project.id}
              ref={(el) => (projectRefs.current[index] = el)}
              className="group relative bg-white/5 rounded-lg overflow-hidden h-full"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                <div className="relative aspect-[4/3] lg:aspect-auto overflow-hidden bg-white/10">
                  <img
                    src={project.image}
                    alt={`Aperçu du projet ${project.title}`}
                    width="800"
                    height="600"
                    className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="p-8 flex flex-col justify-between min-h-[500px]">
                  <div className="flex-1">
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                      <span className="inline-block px-3 py-1 border border-white/30 text-white/80 rounded-full text-xs font-medium">
                        {t('projects.personalProject')}
                      </span>
                    </div>
                    <p className="text-white/70 mb-6 leading-relaxed line-clamp-4">
                      {project.description}
                    </p>

                    <div className="mb-8">
                      <h4 className="text-sm uppercase tracking-wider text-white/50 mb-3">{t('projects.technologies')}</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.languages.slice(0, 5).map((lang) => (
                          <span
                            key={lang}
                            className="px-3 py-1 text-sm border border-white/20 rounded-full 
                                     hover:bg-white hover:text-black transition-colors duration-300"
                          >
                            {lang}
                          </span>
                        ))}
                        {project.languages.length > 5 && (
                          <span className="px-3 py-1 text-sm text-white/50">
                            +{project.languages.length - 5}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                    <Link
                      to={`/project/${project.id}`}
                      className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors duration-300 font-medium"
                    >
                      <FileText className="w-4 h-4" />
                      <span>{t('projects.viewDetails')}</span>
                    </Link>

                    {project.siteUrl && (
                      <a
                        href={project.siteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors duration-300"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>
                          {project.siteType === 'production' 
                            ? t('projects.viewSiteProduction') 
                            : t('projects.viewSiteDemo')}
                        </span>
                      </a>
                    )}

                    {project.codeUrl && (
                      <a
                        href={project.codeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-lg hover:bg-white hover:text-black transition-colors duration-300"
                      >
                        <Github className="w-4 h-4" />
                        <span>{t('projects.code')}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <Link
            to="/projects"
            ref={buttonRef}
            className="inline-flex items-center gap-3 px-8 py-4 text-lg font-medium 
                     border-2 border-white rounded-lg hover:bg-white hover:text-black 
                     transition-colors duration-300 group"
          >
            {t('projects.viewAll')}
            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
};