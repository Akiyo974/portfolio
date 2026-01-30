import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const skills = [
  // Front-end
  'React', 'Next.js', 'TypeScript', 'TailwindCSS', 'GSAP', 'Framer Motion', 'Three.js',
  'UI/UX', 'Responsive Design', 'Accessibilité (WCAG)',
  
  // Back-end
  'WordPress Headless', 'ACF', 'WPGraphQL', 'WP All Import',
  'Node.js', 'Strapi', 'PHP', 'MySQL', 'REST API', 'GraphQL',
  
  // Automatisation & IA
  'API OpenAI', 'LangChain', 'Scripts automatisés', 'Workflows intelligents',
  
  // DevOps
  'cPanel', 'DigitalOcean', 'Git/GitHub', 'Optimisation de performance', 'Déploiements headless',
  
  // Autres
  'jQuery', 'Bootstrap', 'SCSS', 'SEO', 'Architecture de contenu'
];

export const AboutSection = () => {
  const { t } = useTranslation();
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
    <section ref={sectionRef} id="about" className="min-h-screen w-full bg-black text-white py-24 px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-16 border-b border-white/20 pb-4">{t('about.title')}</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <p ref={el => textRefs.current[0] = el} className="text-lg leading-relaxed text-white">
              {t('about.intro')}
            </p>

            <p ref={el => textRefs.current[1] = el} className="text-lg leading-relaxed text-white">
              {t('about.experience')}
            </p>

            <p ref={el => textRefs.current[2] = el} className="text-lg leading-relaxed text-white">
              {t('about.passion')}
            </p>

            {/* Boutons pour afficher et télécharger le CV */}
            <div className="mt-8 flex gap-4">
              <a
                href="https://akiyo974.github.io/portfolio/assets/Dij_Ch_Cv.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                {t('about.viewCV')}
              </a>
              <a
                href="https://akiyo974.github.io/portfolio/assets/DIJ_CH_Cv.pdf"
                download
                className="px-6 py-3 text-sm border border-white/20 rounded-lg font-semibold
                    hover:bg-white hover:text-black transition-colors duration-300"
              >
                {t('about.downloadCV')}
              </a>
            </div>
          </div>

          <div className="space-y-16">
            <div>
              <h3 className="text-2xl font-semibold mb-6">{t('about.education')}</h3>
              <div ref={experienceRef} className="space-y-8">
                {formations.map((exp, index) => (
                  <div key={index} className="border-l-2 border-white/20 pl-6">
                    <h4 className="text-xl font-medium text-white">{exp.title}</h4>
                    <p className="text-white mt-1">{exp.place}</p>
                    <p className="text-white">{exp.role}</p>
                    <p className="text-sm text-white/60 mt-2">{exp.period}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Compétences - Pleine largeur en dessous */}
        <div className="mt-16">
          <h3 className="text-2xl font-semibold mb-6">{t('about.skills')}</h3>
          <div ref={skillsRef} className="flex flex-wrap gap-3">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-4 py-2 text-sm border border-white/20 rounded-full 
                          hover:bg-white hover:text-black transition-colors duration-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
