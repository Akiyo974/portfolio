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
    items: ['HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React', 'GSAP', 'Kotlin (Wear OS)', 'jQuery', 'Bootstrap', 'SASS'],
  },
  {
    title: 'Back-End et Données',
    items: ['PHP', 'Python', 'MicroPython', 'Node.js', 'MySQL', 'PostgreSQL', 'GraphQL', 'API REST', 'CodeIgniter'],
  },
  {
    title: 'Cloud, Outils et Observabilité',
    items: ['Azure', 'Power Platform', 'Git', 'GitHub', 'GitHub Actions', 'VSCode', 'Postman', 'New Relic', 'Cloudflare'],
  },
  {
    title: 'Design et Produit',
    items: ['WordPress', 'Responsive Design', 'Accessibilité web', 'UX/UI', 'Photoshop', 'Illustrator', 'After Effects'],
  },
];

const experiences: Experience[] = [
  {
    title: 'Spécialiste en innovation numérique',
    company: 'Gagnon Frères',
    period: 'Fév. 2026 – Présent',
    bullets: [
      'Plateforme interne, accueil client des 7 magasins et app de vente sur tablette reliée à l\'ERP, de bout en bout.',
      'Assistant IA en langage naturel sur l\'ERP ; pilote Copilot et agents.',
      'Dynamics NAV (point de vente compris) et architecture Azure.',
      'Organisation GitHub (Team, règles, CI/CD) et sécurité des dépôts.',
    ],
  },
  {
    title: 'Co-fondateur et Développeur Web',
    company: 'Synaptia Web',
    period: 'Avr. 2025 – Présent',
    bullets: [
      'Création de sites vitrines et boutiques en ligne performantes, axées UX, SEO et conversion.',
      'Accompagnement technique d\'entreprises sur leurs projets web.',
    ],
  },
  {
    title: 'Développeur Full-Stack et DevOps',
    company: 'CTREQ',
    period: 'Mars 2025 – Août 2025',
    bullets: [
      'Refonte complète d\'une plateforme WordPress headless vers Next.js (front, back, infra).',
      'Migration de contenus, performances et transfert de compétences.',
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
    title: 'Certifications IA',
    school: 'Microsoft · DeepLearning.AI · Coursera',
    period: '2025 – 2026',
    description: 'GitHub Copilot (Microsoft Pro Badge, Proficient), ChatGPT Prompt Engineering pour les développeurs, Machine Learning et Data Science avec Python (en cours).',
  },
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
    title: 'Certificat en design de jeux vidéo',
    school: 'Cégep de Jonquière',
    period: '2023',
    description: 'Acquisition de compétences en level design et création d\'expériences interactives.',
  },
];

interface Project {
  name: string;
  period: string;
  text: string;
  url: string;
}

const projects: Project[] = [
  {
    name: 'Badger',
    period: 'Oct. 2026',
    text: 'Apps MicroPython pour le badge de GitHub Universe, un app store dans le navigateur (Web Serial) et une télécommande Wear OS.',
    url: 'github.com/Akiyo974/badger',
  },
  {
    name: 'Fort Mason Octodex',
    period: 'Oct. 2026',
    text: 'Jeu créé à cinq à San Francisco : 39 des 47 commits, dont le badge en manette et second écran.',
    url: 'github.com/Akiyo974/Mona-Game',
  },
  {
    name: 'Open source',
    period: 'Depuis oct. 2026',
    text: '11 pull requests fusionnées dans Tempest Highlight (PHP) et dev-null.sh.',
    url: 'github.com/tempestphp/highlight',
  },
];

const highlights = [
  'Automatisation de processus internes à fort impact opérationnel.',
  'Mise en production de solutions IA (agents, workflows).',
  'Architecture web moderne orientée performance, accessibilité et fiabilité.',
];

const interests = ['Nouvelles technologies', 'Réalité virtuelle', 'Snowboard', 'Randonnées', 'Vélo', 'Voyages', 'Nature et plein air'];

const profile =
  'Spécialiste en innovation numérique, je conçois et développe des logiciels de bout en bout : plateformes internes, applications pour les magasins, assistants IA et automatisations, du prototype au déploiement cloud. Formé en intégration multimédia, je soigne leurs interfaces autant que leur code.';

/** Traductions anglaises des contenus du CV (clé = texte français). */
const EN: Record<string, string> = {
  [profile]:
    'Digital innovation specialist, I design and build software end to end: internal platforms, in-store apps, AI assistants and automations, from prototype to cloud deployment. Trained in multimedia integration, I care about their interfaces as much as their code.',
  'Développement Front-End': 'Front-End Development',
  'Back-End et Données': 'Back-End and Data',
  'Cloud, Outils et Observabilité': 'Cloud, Tooling and Observability',
  'Design et Produit': 'Design and Product',
  'Accessibilité web': 'Web accessibility',
  'Spécialiste en innovation numérique': 'Digital Innovation Specialist',
  'Co-fondateur et Développeur Web': 'Co-founder and Web Developer',
  'Développeur Full-Stack et DevOps': 'Full-Stack and DevOps Developer',
  'Chargé de Communication': 'Communications Officer',
  'Assistant Direction': 'Assistant Manager',
  'Animateur Apprentissage': 'Digital Learning Facilitator',
  'Fév. 2026 – Présent': 'Feb. 2026 – Present',
  'Avr. 2025 – Présent': 'Apr. 2025 – Present',
  'Mars 2025 – Août 2025': 'Mar. 2025 – Aug. 2025',
  'Plateforme interne, accueil client des 7 magasins et app de vente sur tablette reliée à l\'ERP, de bout en bout.':
    'Internal platform, customer reception for 7 stores and a tablet sales app connected to the ERP, end to end.',
  'Assistant IA en langage naturel sur l\'ERP ; pilote Copilot et agents.':
    'Plain-language AI assistant over the ERP; Copilot and agents pilot.',
  'Dynamics NAV (point de vente compris) et architecture Azure.':
    'Dynamics NAV (point of sale included) and Azure architecture.',
  'Organisation GitHub (Team, règles, CI/CD) et sécurité des dépôts.':
    'GitHub organization (Team, rules, CI/CD) and repository security.',
  'Certifications IA': 'AI certifications',
  'GitHub Copilot (Microsoft Pro Badge, Proficient), ChatGPT Prompt Engineering pour les développeurs, Machine Learning et Data Science avec Python (en cours).':
    'GitHub Copilot (Microsoft Pro Badge, Proficient), ChatGPT Prompt Engineering for Developers, Machine Learning and Data Science with Python (in progress).',
  'Création de sites vitrines et boutiques en ligne performantes, axées UX, SEO et conversion.':
    'Creation of high-performance showcase websites and online stores focused on UX, SEO and conversion.',
  'Accompagnement technique d\'entreprises sur leurs projets web.':
    'Technical guidance for companies on their web projects.',
  'Refonte complète d\'une plateforme WordPress headless vers Next.js (front, back, infra).':
    'Full rebuild of a headless WordPress platform to Next.js (frontend, backend, infrastructure).',
  'Migration de contenus, performances et transfert de compétences.':
    'Content migration, performance and knowledge transfer.',
  'Gestion de contenu WordPress, création de supports graphiques et communication institutionnelle.':
    'WordPress content management, graphic support creation and institutional communication.',
  'Gestion des stocks, relation client et suivi des commandes avec support Excel.':
    'Inventory management, customer relationship and order tracking with Excel support.',
  'Initiation des jeunes aux technologies de l\'information avec approche pédagogique adaptée.':
    'Introduction of young learners to information technologies with an adapted pedagogical approach.',
  'Techniques d\'Intégration Multimédia': 'Multimedia Integration Techniques',
  'Formation en Développement Front-End (React)': 'Front-End Application Development Training (React)',
  'Certificat en design de jeux vidéo': 'Video Game Design Certificate',
  'Cégep de Jonquière': 'Cégep de Jonquière (College)',
  'edX en partenariat avec IBM': 'edX in partnership with IBM',
  'Concentration sur le développement front-end, l\'expérience utilisateur et la conception d\'interfaces immersives.':
    'Focus on front-end development, user experience and immersive interface design.',
  'Renforcement des compétences en React.js, JSX, ES6, Redux et hooks, dans un contexte technique anglophone.':
    'Strengthened skills in React.js, JSX, ES6, Redux and hooks in an English technical environment.',
  'Acquisition de compétences en level design et création d\'expériences interactives.':
    'Acquired skills in level design and interactive experience creation.',
  'Automatisation de processus internes à fort impact opérationnel.': 'Business process automation with measurable operational impact.',
  'Mise en production de solutions IA (agents, workflows).':
    'Production deployment of AI solutions (agents, workflows).',
  'Architecture web moderne orientée performance, accessibilité et fiabilité.':
    'Modern web architecture focused on performance, accessibility and reliability.',
  'Apps MicroPython pour le badge de GitHub Universe, un app store dans le navigateur (Web Serial) et une télécommande Wear OS.':
    'MicroPython apps for the GitHub Universe badge, an in-browser app store (Web Serial) and a Wear OS remote.',
  'Jeu créé à cinq à San Francisco : 39 des 47 commits, dont le badge en manette et second écran.':
    'A game built by a team of five in San Francisco: 39 of the 47 commits, including the badge as controller and second screen.',
  '11 pull requests fusionnées dans Tempest Highlight (PHP) et dev-null.sh.':
    '11 merged pull requests in Tempest Highlight (PHP) and dev-null.sh.',
  'Depuis oct. 2026': 'Since Oct. 2026',
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

/** Postes détaillés dans le PDF ; les suivants tiennent sur une ligne. */
const RECENT_JOBS = 3;

/** Version imprimable (PDF) : une page Lettre, papier blanc, identité du site. */
function CVPrint({ isEn, tx }: { isEn: boolean; tx: (s: string) => string }) {
  const earlier = experiences.slice(RECENT_JOBS);
  const L = isEn
    ? { role: 'Digital Innovation Specialist · Software, AI and Cloud', profile: 'Profile', exp: 'Experience', earlier: 'Earlier roles', projects: 'Recent projects', edu: 'Education', skills: 'Skills', strengths: 'Key strengths', interests: 'Interests', place: 'Saguenay, QC, Canada' }
    : { role: 'Spécialiste en innovation numérique · Logiciel, IA et cloud', profile: 'Profil', exp: 'Expérience', earlier: 'Expériences antérieures', projects: 'Projets récents', edu: 'Formation', skills: 'Compétences', strengths: 'Points forts', interests: 'Intérêts', place: 'Saguenay, QC, Canada' };
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
        <div>
          <section>
            <H n="01">{L.profile}</H>
            <p className="cvp-lead">{tx(profile)}</p>
          </section>

          <section>
            <H n="02">{L.exp}</H>
            {experiences.slice(0, RECENT_JOBS).map((e) => (
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
            {/* Emplois plus anciens regroupés en une ligne : le PDF tient sur une page */}
            <article className="cvp-item">
              <p className="cvp-date">{earlier[earlier.length - 1]?.period} – {earlier[0]?.period}</p>
              <div>
                <h3 className="cvp-title cvp-title-sm">{L.earlier}</h3>
                <p className="cvp-org">{earlier.map((e) => e.company).join(' · ')}</p>
              </div>
            </article>
          </section>

          <section>
            <H n="03">{L.projects}</H>
            {projects.map((p) => (
              <article key={p.name} className="cvp-item">
                <p className="cvp-date">{tx(p.period)}</p>
                <div>
                  <h3 className="cvp-title">{p.name}</h3>
                  <p className="cvp-proj">{tx(p.text)} <a href={`https://${p.url}`}>{p.url}</a></p>
                </div>
              </article>
            ))}
          </section>
        </div>

        <aside>
          <section>
            <H n="04">{L.skills}</H>
            {skillGroups.map((g) => (
              <div key={g.title} className="cvp-skill">
                <p className="cvp-k">{tx(g.title)}</p>
                <p>{g.items.map(tx).join(' · ')}</p>
              </div>
            ))}
          </section>

          <section>
            <H n="05">{L.edu}</H>
            {education.map((ed) => (
              <div key={ed.title} className="cvp-edu">
                <p className="cvp-k">{ed.period}</p>
                <h3 className="cvp-title cvp-title-sm">{tx(ed.title)}</h3>
                <p className="cvp-org">{tx(ed.school)}</p>
              </div>
            ))}
          </section>

          <section>
            <H n="06">{L.strengths}</H>
            <ul className="cvp-bullets">
              {highlights.map((h) => <li key={h}>{tx(h)}</li>)}
            </ul>
          </section>

          <section>
            <H n="07">{L.interests}</H>
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
              {isEn ? 'Digital Innovation Specialist | Full-Stack Developer' : 'Spécialiste en innovation numérique | Développeur Full-Stack'}
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
                  {isEn ? 'Professional Experience' : 'Expérience professionnelle'}
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
                <h2 className="heading mb-5 border-b border-line pb-2 text-3xl uppercase">{isEn ? 'Recent Projects' : 'Projets récents'}</h2>
                <div className="space-y-5">
                  {projects.map((p) => (
                    <article key={p.name} className="border border-line bg-white/[0.02] p-4 transition-colors hover:border-paper/30">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                        <h3 className="heading text-2xl">{p.name}</h3>
                        <span className="label shrink-0">{tx(p.period)}</span>
                      </div>
                      <p className="mt-2 text-paper/80 text-sm leading-relaxed">{tx(p.text)}</p>
                      <a href={`https://${p.url}`} target="_blank" rel="noopener noreferrer" className="label mt-2 inline-block py-1 -my-1 hover:text-paper">
                        {p.url} ↗
                      </a>
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
