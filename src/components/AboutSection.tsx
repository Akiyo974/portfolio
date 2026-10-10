import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

// Compétences organisées par catégories
const skillCategories = {
  development: {
    title: 'Développement',
    titleEn: 'Development',
    skills: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'Python', 'Node.js', 'PHP', 'C#',
             'SQL', 'MySQL', 'PostgreSQL', 'GraphQL', 'REST API']
  },
  aiData: {
    title: 'IA & Data',
    titleEn: 'AI & Data',
    skills: ['OpenAI API', 'LangChain', 'RAG', 'Vector Databases', 'Machine Learning',
             'Prompt Engineering', 'AI Agents', 'Data Analysis', 'Embeddings', 'LLM Integration']
  },
  erpEnterprise: {
    title: 'ERP & Systèmes d\'entreprise',
    titleEn: 'ERP & Enterprise Systems',
    skills: ['Microsoft Dynamics NAV', 'Power Apps', 'Power Automate', 'Power BI',
         'ERP Integration', 'Data Synchronization', 'Business Process Automation',
             'Microsoft 365', 'SharePoint']
  },
  cloudDevops: {
    title: 'Cloud & DevOps',
    titleEn: 'Cloud & DevOps',
    skills: ['Microsoft Azure', 'Azure App Services', 'Azure Functions', 'Azure Storage',
         'Azure AI Services', 'DigitalOcean', 'Linux Administration', 'Nginx', 'Docker',
             'CI/CD', 'GitHub Actions', 'Cloudflare', 'DNS Management', 'SSL/TLS']
  },
  observability: {
    title: 'Observabilité',
    titleEn: 'Observability',
    skills: ['New Relic', 'Synthetic Monitoring', 'APM', 'Alerting', 'Performance Monitoring', 'Log Analysis']
  },
  automation: {
    title: 'Automatisation',
    titleEn: 'Automation',
    skills: ['n8n', 'Python Automation', 'API Integration', 'Workflow Automation', 'ETL Pipelines', 'Scripting']
  }
};

export const AboutSection = () => {
  const { t, i18n } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const textRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const skillsRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);

  const formations = [
    {
      title: t('education.tim.title'),
      place: t('education.tim.school'),
      role: t('education.tim.role'),
      period: t('education.tim.period')
    },
    {
      title: t('education.react.title'),
      place: t('education.react.school'),
      role: t('education.react.role'),
      period: t('education.react.period')
    },
    {
      title: t('education.gameDesign.title'),
      place: t('education.gameDesign.school'),
      role: t('education.gameDesign.role'),
      period: t('education.gameDesign.period')
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animation des paragraphes de texte
      textRefs.current.forEach((text, index) => {
        if (text) {
          gsap.fromTo(text,
            { y: 50, opacity: 0 },
            {
              scrollTrigger: {
                trigger: text,
                start: "top bottom-=100",
                end: "top center",
                scrub: false,
                markers: false,
              },
              y: 0,
              opacity: 1,
              duration: 1,
              ease: "power4.out"
            }
          );
        }
      });

      // Animation des compétences
      if (skillsRef.current) {
        gsap.fromTo(skillsRef.current.children,
          { scale: 0.8, opacity: 0 },
          {
            scrollTrigger: {
              trigger: skillsRef.current,
              start: "top bottom-=100",
              end: "top center",
              scrub: false,
              markers: false,
            },
            scale: 1,
            opacity: 1,
            duration: 0.6,
            stagger: 0.05,
            ease: "power2.out"
          }
        );
      }

      // Animation des éléments de formation
      if (experienceRef.current) {
        gsap.fromTo(experienceRef.current.children,
          { x: -50, opacity: 0 },
          {
            scrollTrigger: {
              trigger: experienceRef.current,
              start: "top bottom-=100",
              end: "top center",
              scrub: false,
              markers: false,
            },
            x: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out"
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="min-h-screen w-full bg-black text-white py-14 sm:py-18 md:py-24 px-4 sm:px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-10 md:mb-16 border-b border-white/20 pb-3 md:pb-4">{t('about.title')}</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
          <div className="space-y-6 md:space-y-8">
            <p ref={el => textRefs.current[0] = el} className="text-base md:text-lg leading-relaxed text-white">
              {t('about.intro')}
            </p>

            <p ref={el => textRefs.current[1] = el} className="text-base md:text-lg leading-relaxed text-white">
              {t('about.experience')}
            </p>

            <p ref={el => textRefs.current[2] = el} className="text-base md:text-lg leading-relaxed text-white">
              {t('about.passion')}
            </p>

            {/* Boutons pour afficher et télécharger le CV */}
            <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                to="/cv"
                className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                {t('about.viewCV')}
              </Link>
              <a
                href="/assets/Dij_Ch_Cv.pdf"
                download
                className="px-6 py-3 text-sm border border-white/20 rounded-lg font-semibold
                    hover:bg-white hover:text-black transition-colors duration-300"
              >
                {t('about.downloadCV')}
              </a>
            </div>
          </div>

          <div className="space-y-10 md:space-y-16">
            <div>
              <h3 className="text-xl md:text-2xl font-semibold mb-5 md:mb-6">{t('about.education')}</h3>
              <div ref={experienceRef} className="space-y-6 md:space-y-8">
                {formations.map((exp, index) => (
                  <div key={index} className="group border-l-2 border-white/20 hover:border-white/40 pl-4 md:pl-6 transition-colors duration-200">
                    <h4 className="text-lg md:text-xl font-medium text-white">{exp.title}</h4>
                    <p className="text-white mt-1">{exp.place}</p>
                    <p className="text-white">{exp.role}</p>
                    <p className="text-sm text-white/60 mt-2">{exp.period}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Compétences - Par catégories */}
        <div className="mt-10 md:mt-16">
          <h3 className="text-xl md:text-2xl font-semibold mb-6 md:mb-8">{t('about.skills')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {Object.entries(skillCategories).map(([key, category]) => (
              <div key={key} className="space-y-4">
                <h4 className="text-lg font-medium text-white/80 border-b border-white/10 pb-2">
                  {i18n.language === 'fr' ? category.title : category.titleEn}
                </h4>
                <div ref={skillsRef} className="flex flex-wrap gap-1.5 md:gap-2">
                  {category.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 text-xs border border-white/15 rounded-full
                                text-white/70 hover:text-white hover:border-white/40
                                transition-all duration-200 cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Domaines d'expertise */}
        <div className="mt-10 md:mt-16">
          <h3 className="text-xl md:text-2xl font-semibold mb-5 md:mb-6">{t('about.interests')}</h3>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {(t('about.interestsList', { returnObjects: true }) as string[]).map((interest, index) => (
              <span
                key={index}
                className="px-4 py-2 text-sm bg-white/[0.03] border border-white/10 rounded-lg
                          hover:border-white/25 text-white/70 hover:text-white/90
                          transition-all duration-200"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>

        {/* Expérience Professionnelle */}
        <div className="mt-10 md:mt-16">
          <h3 className="text-xl md:text-2xl font-semibold mb-6 md:mb-8">{t('about.experience')}</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {(t('about.experienceList', { returnObjects: true }) as Array<{title: string, company: string, period: string, description: string, highlights?: string[]}>).map((exp, index) => (
              <div
                key={index}
                className="group p-4 md:p-6 bg-white/5 border border-white/10 rounded-xl
                          hover:bg-white/[0.08] hover:border-white/20 hover:-translate-y-1
                          transition-all duration-300 ease-out flex flex-col"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-base md:text-lg font-semibold text-white group-hover:text-white/90">{exp.title}</h4>
                </div>
                <p className="text-white/80 font-medium">{exp.company}</p>
                <span className="text-xs text-white/50 mb-3">{exp.period}</span>
                <p className="text-sm text-white/60 leading-relaxed mb-4">{exp.description}</p>
                {exp.highlights && (
                  <ul className="mt-auto space-y-1.5">
                    {exp.highlights.map((highlight, hIndex) => (
                      <li key={hIndex} className="text-xs text-white/50 flex items-start gap-2">
                        <span className="text-white/40 mt-0.5">—</span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Impact & Résultats */}
        <div className="mt-10 md:mt-16">
          <h3 className="text-xl md:text-2xl font-semibold mb-6 md:mb-8">{t('about.impact')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {(t('about.impactList', { returnObjects: true }) as string[]).map((impact, index) => (
              <div
                key={index}
                className="group p-4 bg-white/[0.03] border border-white/10 rounded-lg
                          hover:bg-white/[0.06] hover:border-white/20
                          transition-all duration-200 flex items-start gap-3"
              >
                <span className="text-white/60 group-hover:text-white/80 transition-colors text-sm">→</span>
                <p className="text-sm text-white/70 group-hover:text-white/85 leading-relaxed transition-colors">{impact}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
