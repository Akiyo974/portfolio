import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Mail, MapPin, Phone, Github, Linkedin } from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface SkillGroup {
  title: string;
  items: string[];
}

interface Experience {
  title: string;
  company: string;
  period: string;
  bullets: string[];
}

interface Education {
  title: string;
  school: string;
  period: string;
  description: string;
}

const skillGroups: SkillGroup[] = [
  {
    title: 'Développement Front-End',
    items: ['HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React', 'jQuery', 'Bootstrap', 'SASS', 'GSAP'],
  },
  {
    title: 'Back-End et Données',
    items: ['PHP', 'MySQL', 'API REST', 'CodeIgniter', 'Node.js', 'PostgreSQL', 'GraphQL'],
  },
  {
    title: 'Cloud, Outils et Observabilité',
    items: ['Azure', 'Power Platform', 'Git', 'GitHub', 'VSCode', 'Postman', 'New Relic', 'Cloudflare'],
  },
  {
    title: 'Design et Produit',
    items: ['WordPress', 'Responsive Design', 'Accessibilité web', 'UX/UI', 'Photoshop', 'Illustrator', 'After Effects'],
  },
];

const experiences: Experience[] = [
  {
    title: 'Spécialiste en Innovation Numérique',
    company: 'Gagnon Frères',
    period: 'Fév. 2026 - Present',
    bullets: [
      'Conception d\'applications internes et automatisation de flux métiers (catalogues, fournisseurs, opérations).',
      'Intégration de solutions IA et assistants intelligents pour la recherche et l\'aide à la décision.',
      'Mise en place de monitoring, alerting et observabilité pour améliorer la fiabilité des systèmes.',
    ],
  },
  {
    title: 'Co-fondateur et Développeur Web',
    company: 'Synaptia Web',
    period: 'Avr. 2025 - Present',
    bullets: [
      'Création de sites vitrines et boutiques en ligne performantes, axées UX, SEO et conversion.',
      'Accompagnement technique d\'entreprises sur leurs projets web et intégrations numériques.',
    ],
  },
  {
    title: 'Développeur Full-Stack et DevOps',
    company: 'CTREQ',
    period: 'Mars 2025 - Août 2025',
    bullets: [
      'Refonte complète d\'une plateforme WordPress headless vers Next.js (front, back, infra).',
      'Migration de contenus, optimisation des performances et transfert de compétences à l\'équipe.',
    ],
  },
  {
    title: 'Chargé de Communication',
    company: 'CHU de La Réunion',
    period: '2020',
    bullets: [
      'Gestion de contenu WordPress, création de supports graphiques et communication institutionnelle.',
    ],
  },
  {
    title: 'Assistant Direction',
    company: 'Station ENGEN',
    period: '2019',
    bullets: [
      'Gestion des stocks, relation client et suivi des commandes avec support Excel.',
    ],
  },
  {
    title: 'Animateur Apprentissage',
    company: 'Communauté de communes CIVIS',
    period: '2018',
    bullets: [
      'Initiation des jeunes aux technologies de l\'information avec approche pédagogique adaptée.',
    ],
  },
];

const education: Education[] = [
  {
    title: 'Techniques d\'Intégration Multimédia',
    school: 'Cégep de Jonquière',
    period: '2021 - 2025',
    description:
      'Concentration sur le développement front-end, l\'expérience utilisateur et la conception d\'interfaces immersives.',
  },
  {
    title: 'Formation en Développement Front-End (React)',
    school: 'edX en partenariat avec IBM',
    period: '2024',
    description:
      'Renforcement des compétences en React.js, JSX, ES6, Redux et hooks, dans un contexte technique anglophone.',
  },
  {
    title: 'Certificat en Design de Jeux Vidéo',
    school: 'Cégep de Jonquière',
    period: '2023',
    description: 'Acquisition de compétences en level design et création d\'expériences interactives.',
  },
];

const highlights = [
  'Automatisation de processus internes à fort impact opérationnel.',
  'Mise en production de solutions IA (agents, workflows, assistance métier).',
  'Architecture web moderne orientée performance, accessibilité et fiabilité.',
];

const highlightsEn = [
  'Business process automation with measurable operational impact.',
  'Production deployment of AI solutions (agents, workflows, decision support).',
  'Modern web architecture focused on performance, accessibility and reliability.',
];

const interestsFr = [
  'Nouvelles technologies',
  'Réalité virtuelle',
  'Snowboard',
  'Randonnées',
  'Vélo',
  'Voyages',
  'Nature et plein air',
];

const interestsEn = [
  'Emerging technologies',
  'Virtual reality',
  'Snowboarding',
  'Hiking',
  'Cycling',
  'Travel',
  'Outdoors and nature',
];

export default function CVPage() {
  const { i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');

  useEffect(() => {
    document.body.classList.add('cv-print-mode');
    return () => {
      document.body.classList.remove('cv-print-mode');
    };
  }, []);

  const handleExportPdf = () => {
    window.print();
  };

  return (
    <main className="cv-page min-h-screen bg-black text-white pt-24 pb-16 px-6 md:px-10">
      <Helmet>
        <title>{isEn ? 'Resume | Christen Dijoux' : 'CV | Christen Dijoux'}</title>
        <meta
          name="description"
          content={
            isEn
              ? 'Resume of Christen Dijoux - Digital Innovation Specialist and Full-Stack Developer.'
              : 'CV de Christen Dijoux - Spécialiste en Innovation Numérique et Développeur Full-Stack.'
          }
        />
        <link rel="canonical" href="https://christendijoux.com/cv" />
      </Helmet>

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 print:hidden">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 border border-white/20 rounded-lg hover:bg-white hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {isEn ? 'Back to website' : 'Retour au site'}
          </Link>

          <button
            onClick={handleExportPdf}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors"
          >
            <Download className="w-4 h-4" />
            {isEn ? 'Export PDF' : 'Exporter PDF'}
          </button>
        </div>

        <section id="cv-export-root" className="cv-paper border border-white/15 rounded-2xl bg-white/[0.03] backdrop-blur-sm p-6 md:p-10">
          <header className="cv-header pb-8 border-b border-white/15">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">CHRISTEN DIJOUX</h1>
            <p className="text-white/70 mt-2 text-lg">
              {isEn
                ? 'Digital Innovation Specialist | Full-Stack Developer'
                : 'Spécialiste en Innovation Numérique | Développeur Full-Stack'}
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
              <a href="tel:+14183762612" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                <Phone className="w-4 h-4" />
                (418) 376-2612
              </a>
              <a
                href="mailto:christen.dijoux@gmail.com"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
                christen.dijoux@gmail.com
              </a>
              <span className="inline-flex items-center gap-2 text-white/80">
                <MapPin className="w-4 h-4" />
                {isEn ? 'Saguenay, Quebec, Canada' : 'Saguenay, Québec, Canada'}
              </span>
              <div className="inline-flex items-center gap-3">
                <a
                  href="https://github.com/Akiyo974"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-white/80 hover:text-white transition-colors"
                >
                  <Github className="w-4 h-4" /> GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/christen-dijoux"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-white/80 hover:text-white transition-colors"
                >
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </a>
              </div>
            </div>
          </header>

          <div className="cv-layout grid grid-cols-1 lg:grid-cols-3 gap-10 mt-10">
            <div className="lg:col-span-2 space-y-10">
              <section className="cv-section cv-section-breakable">
                <h2 className="text-2xl font-semibold mb-4 border-b border-white/10 pb-2">
                  {isEn ? 'Profile' : 'Objectif'}
                </h2>
                <p className="text-white/80 leading-relaxed">
                  {isEn
                    ? 'Developer focused on building useful digital products and modern user experiences. I design robust web solutions combining frontend engineering, process automation and practical AI integration to deliver measurable business value.'
                    : 'Développeur passionné par la création d\'interfaces innovantes et de solutions numériques utiles, je conçois des expériences web performantes alliant front-end moderne, automatisation et intelligence artificielle. Mon objectif est de contribuer à des projets à forte valeur métier, visibles et impactants.'}
                </p>
              </section>

              <section className="cv-section cv-section-breakable">
                <h2 className="text-2xl font-semibold mb-4 border-b border-white/10 pb-2">
                  {isEn ? 'Professional Experience' : 'Expérience Professionnelle'}
                </h2>
                <div className="space-y-6">
                  {experiences.map((experience) => (
                    <article key={`${experience.title}-${experience.period}`} className="cv-card p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {isEn
                              ? experience.title
                                  .replace('Spécialiste en Innovation Numérique', 'Digital Innovation Specialist')
                                  .replace('Co-fondateur et Développeur Web', 'Co-founder and Web Developer')
                                  .replace('Développeur Full-Stack et DevOps', 'Full-Stack and DevOps Developer')
                                  .replace('Chargé de Communication', 'Communications Officer')
                                  .replace('Assistant Direction', 'Assistant Manager')
                                  .replace('Animateur Apprentissage', 'Digital Learning Facilitator')
                              : experience.title}
                          </h3>
                          <p className="text-white/70">{experience.company}</p>
                        </div>
                        <span className="text-sm text-white/60">{experience.period}</span>
                      </div>
                      <ul className="mt-3 space-y-2 text-white/80 text-sm">
                        {experience.bullets.map((bullet) => (
                          <li key={bullet} className="leading-relaxed">
                            • {isEn
                              ? bullet
                                  .replace('Conception d\'applications internes et automatisation de flux métiers (catalogues, fournisseurs, opérations).', 'Design of internal applications and automation of business workflows (catalogs, suppliers, operations).')
                                  .replace('Intégration de solutions IA et assistants intelligents pour la recherche et l\'aide à la décision.', 'Integration of AI solutions and intelligent assistants for search and decision support.')
                                  .replace('Mise en place de monitoring, alerting et observabilité pour améliorer la fiabilité des systèmes.', 'Implementation of monitoring, alerting and observability to improve system reliability.')
                                  .replace('Création de sites vitrines et boutiques en ligne performantes, axées UX, SEO et conversion.', 'Creation of high-performance showcase websites and online stores focused on UX, SEO and conversion.')
                                  .replace('Accompagnement technique d\'entreprises sur leurs projets web et intégrations numériques.', 'Technical guidance for companies on web projects and digital integrations.')
                                  .replace('Refonte complète d\'une plateforme WordPress headless vers Next.js (front, back, infra).', 'Full rebuild of a headless WordPress platform to Next.js (frontend, backend, infrastructure).')
                                  .replace('Migration de contenus, optimisation des performances et transfert de compétences à l\'équipe.', 'Content migration, performance optimization and knowledge transfer to internal teams.')
                                  .replace('Gestion de contenu WordPress, création de supports graphiques et communication institutionnelle.', 'WordPress content management, graphic support creation and institutional communication.')
                                  .replace('Gestion des stocks, relation client et suivi des commandes avec support Excel.', 'Inventory management, customer relationship and order tracking with Excel support.')
                                  .replace('Initiation des jeunes aux technologies de l\'information avec approche pédagogique adaptée.', 'Introduction of young learners to information technologies with an adapted pedagogical approach.')
                              : bullet}
                          </li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              </section>

              <section className="cv-section">
                <h2 className="text-2xl font-semibold mb-4 border-b border-white/10 pb-2">
                  {isEn ? 'Education' : 'Formations'}
                </h2>
                <div className="space-y-5">
                  {education.map((item) => (
                    <article key={`${item.title}-${item.period}`} className="cv-card p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {isEn
                              ? item.title
                                  .replace('Techniques d\'Intégration Multimédia', 'Multimedia Integration Techniques')
                                  .replace('Formation en Développement Front-End (React)', 'Front-End Application Development Training (React)')
                                  .replace('Certificat en Design de Jeux Vidéo', 'Video Game Design Certificate')
                              : item.title}
                          </h3>
                          <p className="text-white/70">
                            {isEn ? item.school.replace('Cégep', 'College') : item.school}
                          </p>
                        </div>
                        <span className="text-sm text-white/60">{item.period}</span>
                      </div>
                      <p className="mt-2 text-white/80 text-sm leading-relaxed">
                        {isEn
                          ? item.description
                              .replace('Concentration sur le développement front-end, l\'expérience utilisateur et la conception d\'interfaces immersives.', 'Focus on front-end development, user experience optimization and immersive interface design for multimedia projects.')
                              .replace('Renforcement des compétences en React.js, JSX, ES6, Redux et hooks, dans un contexte technique anglophone.', 'Strengthened skills in React.js, JSX, ES6, Redux and hooks in an English technical environment.')
                              .replace('Acquisition de compétences en level design et création d\'expériences interactives.', 'Acquired skills in level design and interactive experience creation.')
                          : item.description}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            </div>

            <aside className="cv-aside space-y-10">
              <section className="cv-section">
                <h2 className="text-2xl font-semibold mb-4 border-b border-white/10 pb-2">
                  {isEn ? 'Skills' : 'Compétences'}
                </h2>
                <div className="space-y-5">
                  {skillGroups.map((group) => (
                    <div key={group.title}>
                      <h3 className="text-sm uppercase tracking-wider text-white/60 mb-2">
                        {isEn
                          ? group.title
                              .replace('Développement Front-End', 'Front-End Development')
                              .replace('Back-End et Données', 'Back-End and Data')
                              .replace('Cloud, Outils et Observabilité', 'Cloud, Tooling and Observability')
                              .replace('Design et Produit', 'Design and Product')
                          : group.title}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {group.items.map((item) => (
                          <span
                            key={item}
                            className="px-2.5 py-1 text-xs border border-white/20 rounded-full text-white/80 hover:border-white/40 transition-colors"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="cv-section">
                <h2 className="text-2xl font-semibold mb-4 border-b border-white/10 pb-2">
                  {isEn ? 'Key Strengths' : 'Points Forts'}
                </h2>
                <ul className="space-y-3 text-sm text-white/80">
                  {(isEn ? highlightsEn : highlights).map((item) => (
                    <li key={item} className="leading-relaxed">• {item}</li>
                  ))}
                </ul>
              </section>

              <section className="cv-section">
                <h2 className="text-2xl font-semibold mb-4 border-b border-white/10 pb-2">
                  {isEn ? 'Interests' : 'Intérêts'}
                </h2>
                <div className="flex flex-wrap gap-2 text-sm text-white/80">
                  {(isEn ? interestsEn : interestsFr).map((interest) => (
                    <span key={interest} className="px-3 py-1 rounded-full border border-white/20">
                      {interest}
                    </span>
                  ))}
                </div>
              </section>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
