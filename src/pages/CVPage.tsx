import { Seo } from '../components/Seo';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
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
    period: 'Fév. 2026 – Présent',
    bullets: [
      'Conception d\'applications internes et automatisation de flux métiers (catalogues, fournisseurs, opérations).',
      'Intégration de solutions IA et assistants intelligents pour la recherche et l\'aide à la décision.',
      'Mise en place de monitoring, alerting et observabilité pour améliorer la fiabilité des systèmes.',
    ],
  },
  {
    title: 'Co-fondateur et Développeur Web',
    company: 'Synaptia Web',
    period: 'Avr. 2025 – Présent',
    bullets: [
      'Création de sites vitrines et boutiques en ligne performantes, axées UX, SEO et conversion.',
      'Accompagnement technique d\'entreprises sur leurs projets web et intégrations numériques.',
    ],
  },
  {
    title: 'Développeur Full-Stack et DevOps',
    company: 'CTREQ',
    period: 'Mars 2025 – Août 2025',
    bullets: [
      'Refonte complète d\'une plateforme WordPress headless vers Next.js (front, back, infra).',
      'Migration de contenus, optimisation des performances et transfert de compétences à l\'équipe.',
    ],
  },
  {
    title: 'Chargé de Communication',
    company: 'CHU de La Réunion',
    period: '2020',
    bullets: ['Gestion de contenu WordPress, création de supports graphiques et communication institutionnelle.'],
  },
  {
    title: 'Assistant Direction',
    company: 'Station ENGEN',
    period: '2019',
    bullets: ['Gestion des stocks, relation client et suivi des commandes avec support Excel.'],
  },
  {
    title: 'Animateur Apprentissage',
    company: 'Communauté de communes CIVIS',
    period: '2018',
    bullets: ['Initiation des jeunes aux technologies de l\'information avec approche pédagogique adaptée.'],
  },
];

const education: Education[] = [
  {
    title: 'Techniques d\'Intégration Multimédia',
    school: 'Cégep de Jonquière',
    period: '2021 – 2025',
    description: 'Concentration sur le développement front-end, l\'expérience utilisateur et la conception d\'interfaces immersives.',
  },
  {
    title: 'Formation en Développement Front-End (React)',
    school: 'edX en partenariat avec IBM',
    period: '2024',
    description: 'Renforcement des compétences en React.js, JSX, ES6, Redux et hooks, dans un contexte technique anglophone.',
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

const interests = ['Nouvelles technologies', 'Réalité virtuelle', 'Snowboard', 'Randonnées', 'Vélo', 'Voyages', 'Nature et plein air'];

const profile =
  'Développeur passionné par la création d\'interfaces innovantes et de solutions numériques utiles, je conçois des expériences web performantes alliant front-end moderne, automatisation et intelligence artificielle. Mon objectif est de contribuer à des projets à forte valeur métier, visibles et impactants.';

/** Traductions anglaises des contenus du CV (clé = texte français). */
const EN: Record<string, string> = {
  [profile]:
    'Developer focused on building useful digital products and modern user experiences. I design robust web solutions combining frontend engineering, process automation and practical AI integration to deliver measurable business value.',
  'Développement Front-End': 'Front-End Development',
  'Back-End et Données': 'Back-End and Data',
  'Cloud, Outils et Observabilité': 'Cloud, Tooling and Observability',
  'Design et Produit': 'Design and Product',
  'Accessibilité web': 'Web accessibility',
  'Spécialiste en Innovation Numérique': 'Digital Innovation Specialist',
  'Co-fondateur et Développeur Web': 'Co-founder and Web Developer',
  'Développeur Full-Stack et DevOps': 'Full-Stack and DevOps Developer',
  'Chargé de Communication': 'Communications Officer',
  'Assistant Direction': 'Assistant Manager',
  'Animateur Apprentissage': 'Digital Learning Facilitator',
  'Fév. 2026 – Présent': 'Feb. 2026 – Present',
  'Avr. 2025 – Présent': 'Apr. 2025 – Present',
  'Mars 2025 – Août 2025': 'Mar. 2025 – Aug. 2025',
  'Conception d\'applications internes et automatisation de flux métiers (catalogues, fournisseurs, opérations).':
    'Design of internal applications and automation of business workflows (catalogs, suppliers, operations).',
  'Intégration de solutions IA et assistants intelligents pour la recherche et l\'aide à la décision.':
    'Integration of AI solutions and intelligent assistants for search and decision support.',
  'Mise en place de monitoring, alerting et observabilité pour améliorer la fiabilité des systèmes.':
    'Implementation of monitoring, alerting and observability to improve system reliability.',
  'Création de sites vitrines et boutiques en ligne performantes, axées UX, SEO et conversion.':
    'Creation of high-performance showcase websites and online stores focused on UX, SEO and conversion.',
  'Accompagnement technique d\'entreprises sur leurs projets web et intégrations numériques.':
    'Technical guidance for companies on web projects and digital integrations.',
  'Refonte complète d\'une plateforme WordPress headless vers Next.js (front, back, infra).':
    'Full rebuild of a headless WordPress platform to Next.js (frontend, backend, infrastructure).',
  'Migration de contenus, optimisation des performances et transfert de compétences à l\'équipe.':
    'Content migration, performance optimization and knowledge transfer to internal teams.',
  'Gestion de contenu WordPress, création de supports graphiques et communication institutionnelle.':
    'WordPress content management, graphic support creation and institutional communication.',
  'Gestion des stocks, relation client et suivi des commandes avec support Excel.':
    'Inventory management, customer relationship and order tracking with Excel support.',
  'Initiation des jeunes aux technologies de l\'information avec approche pédagogique adaptée.':
    'Introduction of young learners to information technologies with an adapted pedagogical approach.',
  'Techniques d\'Intégration Multimédia': 'Multimedia Integration Techniques',
  'Formation en Développement Front-End (React)': 'Front-End Application Development Training (React)',
  'Certificat en Design de Jeux Vidéo': 'Video Game Design Certificate',
  'Cégep de Jonquière': 'Cégep de Jonquière (College)',
  'edX en partenariat avec IBM': 'edX in partnership with IBM',
  'Concentration sur le développement front-end, l\'expérience utilisateur et la conception d\'interfaces immersives.':
    'Focus on front-end development, user experience and immersive interface design.',
  'Renforcement des compétences en React.js, JSX, ES6, Redux et hooks, dans un contexte technique anglophone.':
    'Strengthened skills in React.js, JSX, ES6, Redux and hooks in an English technical environment.',
  'Acquisition de compétences en level design et création d\'expériences interactives.':
    'Acquired skills in level design and interactive experience creation.',
  'Automatisation de processus internes à fort impact opérationnel.': 'Business process automation with measurable operational impact.',
  'Mise en production de solutions IA (agents, workflows, assistance métier).':
    'Production deployment of AI solutions (agents, workflows, decision support).',
  'Architecture web moderne orientée performance, accessibilité et fiabilité.':
    'Modern web architecture focused on performance, accessibility and reliability.',
  'Nouvelles technologies': 'Emerging technologies',
  'Réalité virtuelle': 'Virtual reality',
  Snowboard: 'Snowboarding',
  Randonnées: 'Hiking',
  Vélo: 'Cycling',
  Voyages: 'Travel',
  'Nature et plein air': 'Outdoors and nature',
};

const CONTACT = {
  phone: '(418) 376-2612',
  phoneHref: 'tel:+14183762612',
  email: 'christen.dijoux@gmail.com',
  site: 'christendijoux.com',
  github: 'github.com/Akiyo974',
  linkedin: 'linkedin.com/in/christen-dijoux',
};

/** Version imprimable (PDF) : une page Lettre, papier blanc, identité du site. */
function CVPrint({ isEn, tx }: { isEn: boolean; tx: (s: string) => string }) {
  const L = isEn
    ? { role: 'Digital Innovation Specialist · Full-Stack & AI Developer', profile: 'Profile', exp: 'Experience', edu: 'Education', skills: 'Skills', strengths: 'Key strengths', interests: 'Interests', place: 'Saguenay, QC, Canada' }
    : { role: 'Spécialiste en innovation numérique · Développeur full-stack & IA', profile: 'Profil', exp: 'Expérience', edu: 'Formation', skills: 'Compétences', strengths: 'Points forts', interests: 'Intérêts', place: 'Saguenay, QC, Canada' };
  const H = ({ n, children }: { n: string; children: string }) => (
    <h2 className="cvp-h">
      <span>{n}</span>
      {children}
    </h2>
  );

  return (
    <div className="cv-print" lang={isEn ? 'en' : 'fr'}>
      <header className="cvp-head">
        <div>
          <h1 className="cvp-name">Christen Dijoux</h1>
          <p className="cvp-role">{L.role}</p>
        </div>
        <ul className="cvp-contact">
          <li><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></li>
          <li><a href={CONTACT.phoneHref}>{CONTACT.phone}</a></li>
          <li><a href={`https://${CONTACT.site}`}>{CONTACT.site}</a></li>
          <li><a href={`https://www.${CONTACT.linkedin}`}>{CONTACT.linkedin}</a></li>
          <li><a href={`https://${CONTACT.github}`}>{CONTACT.github}</a></li>
          <li>{L.place}</li>
        </ul>
      </header>

      <div className="cvp-grid">
        <main>
          <section>
            <H n="01">{L.profile}</H>
            <p className="cvp-lead">{tx(profile)}</p>
          </section>

          <section>
            <H n="02">{L.exp}</H>
            {experiences.map((e) => (
              <article key={e.title + e.period} className="cvp-item">
                <p className="cvp-date">{tx(e.period)}</p>
                <div>
                  <h3 className="cvp-title">{tx(e.title)}</h3>
                  <p className="cvp-org">{e.company}</p>
                  <ul className="cvp-bullets">
                    {e.bullets.map((b) => <li key={b}>{tx(b)}</li>)}
                  </ul>
                </div>
              </article>
            ))}
          </section>
        </main>

        <aside>
          <section>
            <H n="03">{L.skills}</H>
            {skillGroups.map((g) => (
              <div key={g.title} className="cvp-skill">
                <p className="cvp-k">{tx(g.title)}</p>
                <p>{g.items.map(tx).join(' · ')}</p>
              </div>
            ))}
          </section>

          <section>
            <H n="04">{L.edu}</H>
            {education.map((ed) => (
              <div key={ed.title} className="cvp-edu">
                <p className="cvp-k">{ed.period}</p>
                <h3 className="cvp-title cvp-title-sm">{tx(ed.title)}</h3>
                <p className="cvp-org">{tx(ed.school)}</p>
              </div>
            ))}
          </section>

          <section>
            <H n="05">{L.strengths}</H>
            <ul className="cvp-bullets">
              {highlights.map((h) => <li key={h}>{tx(h)}</li>)}
            </ul>
          </section>

          <section>
            <H n="06">{L.interests}</H>
            <p>{interests.map(tx).join(' · ')}</p>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default function CVPage() {
  const { i18n } = useTranslation();
  const isEn = i18n.language.startsWith('en');
  const tx = (s: string) => (isEn ? EN[s] ?? s : s);

  useEffect(() => {
    document.body.classList.add('cv-print-mode');
    return () => {
      document.body.classList.remove('cv-print-mode');
    };
  }, []);

  return (
    <main className="cv-page min-h-screen bg-ink text-paper px-4 pb-16 pt-10 sm:px-6 md:px-10">
      <Seo
        path="/cv"
        type="profile"
        title={isEn ? 'Resume — Christen Dijoux' : 'CV — Christen Dijoux'}
        description={
          isEn
            ? 'Resume of Christen Dijoux — Digital Innovation Specialist and full-stack & AI developer in Saguenay, Québec.'
            : 'CV de Christen Dijoux — Spécialiste en innovation numérique et développeur full-stack & IA à Saguenay, Québec.'
        }
      />

      {createPortal(<CVPrint isEn={isEn} tx={tx} />, document.body)}

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <Link to="/" className="btn-ghost" data-magnetic>
            <ArrowLeft className="w-4 h-4" />
            {isEn ? 'Back to website' : 'Retour au site'}
          </Link>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => window.print()} className="btn-ghost" data-magnetic>
              {isEn ? 'Print' : 'Imprimer'}
            </button>
            <a
              href={isEn ? '/assets/cv-christen-dijoux-en.pdf' : '/assets/cv-christen-dijoux-fr.pdf'}
              download={isEn ? 'Christen-Dijoux-Resume.pdf' : 'Christen-Dijoux-CV.pdf'}
              className="btn-solid"
              data-magnetic
            >
              <Download className="w-4 h-4" />
              {isEn ? 'Download PDF' : 'Télécharger le PDF'}
            </a>
          </div>
        </div>

        <section className="crosshair border border-line bg-white/[0.02] p-6 md:p-10">
          <header className="border-b border-line pb-8">
            <h1 className="display text-[clamp(3rem,8vw,7.5rem)]">CHRISTEN DIJOUX</h1>
            <p className="heading mt-3 text-[clamp(1.4rem,2.4vw,2.2rem)] text-paper/70">
              {isEn ? 'Digital Innovation Specialist | Full-Stack Developer' : 'Spécialiste en Innovation Numérique | Développeur Full-Stack'}
            </p>

            <div className="mt-8 grid grid-cols-1 gap-3 font-mono text-[12px] uppercase tracking-[0.06em] md:grid-cols-2 lg:grid-cols-4">
              <a href={CONTACT.phoneHref} className="inline-flex items-center gap-2 text-paper/80 hover:text-paper transition-colors">
                <Phone className="w-4 h-4" />
                {CONTACT.phone}
              </a>
              <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-2 text-paper/80 hover:text-paper transition-colors">
                <Mail className="w-4 h-4" />
                {CONTACT.email}
              </a>
              <span className="inline-flex items-center gap-2 text-paper/80">
                <MapPin className="w-4 h-4" />
                {isEn ? 'Saguenay, Quebec, Canada' : 'Saguenay, Québec, Canada'}
              </span>
              <div className="inline-flex items-center gap-3">
                <a href={`https://${CONTACT.github}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-paper/80 hover:text-paper transition-colors">
                  <Github className="w-4 h-4" /> GitHub
                </a>
                <a href={`https://www.${CONTACT.linkedin}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-paper/80 hover:text-paper transition-colors">
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </a>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-10">
            <div className="lg:col-span-2 space-y-10">
              <section>
                <h2 className="heading mb-5 border-b border-line pb-2 text-3xl uppercase">{isEn ? 'Profile' : 'Objectif'}</h2>
                <p className="text-paper/80 leading-relaxed">{tx(profile)}</p>
              </section>

              <section>
                <h2 className="heading mb-5 border-b border-line pb-2 text-3xl uppercase">
                  {isEn ? 'Professional Experience' : 'Expérience Professionnelle'}
                </h2>
                <div className="space-y-6">
                  {experiences.map((experience) => (
                    <article key={`${experience.title}-${experience.period}`} className="border border-line bg-white/[0.02] p-4 transition-colors hover:border-paper/30">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                        <div>
                          <h3 className="heading text-2xl">{tx(experience.title)}</h3>
                          <p className="text-paper/70">{experience.company}</p>
                        </div>
                        <span className="label shrink-0">{tx(experience.period)}</span>
                      </div>
                      <ul className="mt-3 space-y-2 text-paper/80 text-sm">
                        {experience.bullets.map((bullet) => (
                          <li key={bullet} className="leading-relaxed">• {tx(bullet)}</li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="heading mb-5 border-b border-line pb-2 text-3xl uppercase">{isEn ? 'Education' : 'Formations'}</h2>
                <div className="space-y-5">
                  {education.map((item) => (
                    <article key={`${item.title}-${item.period}`} className="border border-line bg-white/[0.02] p-4 transition-colors hover:border-paper/30">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                        <div>
                          <h3 className="heading text-2xl">{tx(item.title)}</h3>
                          <p className="text-paper/70">{tx(item.school)}</p>
                        </div>
                        <span className="label shrink-0">{item.period}</span>
                      </div>
                      <p className="mt-2 text-paper/80 text-sm leading-relaxed">{tx(item.description)}</p>
                    </article>
                  ))}
                </div>
              </section>
            </div>

            <aside className="space-y-10">
              <section>
                <h2 className="heading mb-5 border-b border-line pb-2 text-3xl uppercase">{isEn ? 'Skills' : 'Compétences'}</h2>
                <div className="space-y-5">
                  {skillGroups.map((group) => (
                    <div key={group.title}>
                      <h3 className="label mb-2">{tx(group.title)}</h3>
                      <div className="flex flex-wrap gap-2">
                        {group.items.map((item) => (
                          <span key={item} className="chip">{tx(item)}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="heading mb-5 border-b border-line pb-2 text-3xl uppercase">{isEn ? 'Key Strengths' : 'Points Forts'}</h2>
                <ul className="space-y-3 text-sm text-paper/80">
                  {highlights.map((item) => (
                    <li key={item} className="leading-relaxed">• {tx(item)}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="heading mb-5 border-b border-line pb-2 text-3xl uppercase">{isEn ? 'Interests' : 'Intérêts'}</h2>
                <div className="flex flex-wrap gap-2 text-sm text-paper/80">
                  {interests.map((interest) => (
                    <span key={interest} className="chip normal-case tracking-normal">{tx(interest)}</span>
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
