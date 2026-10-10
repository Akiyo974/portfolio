import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  Clipboard,
  Download,
  FileText,
  RotateCcw,
} from 'lucide-react';

interface LetterDraft {
  placeAndDate: string;
  recipient: string;
  subject: string;
  salutation: string;
  body: string;
  closing: string;
  signature: string;
}

type TemplateId = 'board-interest' | 'motivation' | 'spontaneous' | 'internship' | 'recommendation' | 'resignation' | 'interview-thanks';

interface LetterTemplate {
  id: TemplateId;
  label: string;
  filename: string;
  draft: LetterDraft;
}

const STORAGE_KEY = 'portfolio-letter-generator-draft-v3';
const SELECTED_TEMPLATE_KEY = 'portfolio-letter-generator-selected-template';
const PREVIOUS_PROFESSIONAL_SIGNATURE = `Christen Dijoux
Spécialiste en innovation numérique / Intégrateur Web
Gagnon Frères
418-690-3366, poste 1246
1460, boul. Talbot, 2e étage
Chicoutimi (QC) G7H 4C2
christen.dijoux@gmail.com`;
const PREVIOUS_PERSONAL_SIGNATURE = `Christen Dijoux
Spécialiste en innovation numérique / Intégrateur Web
Gagnon Frères
(218) 376-2612
christen.dijoux@gmail.com`;
const PROFESSIONAL_SIGNATURE = `Christen Dijoux
Spécialiste en innovation numérique / Intégrateur Web
Gagnon Frères
(418) 376-2612
christen.dijoux@gmail.com`;

const defaultDraft: LetterDraft = {
  placeAndDate: `Saguenay, le ${new Intl.DateTimeFormat('fr-CA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())}`,
  recipient: "Conseil d’administration\nCégep de Jonquière",
  subject: "Lettre d’intérêt – Siège au conseil d’administration du Cégep de Jonquière",
  salutation: 'Madame, Monsieur,',
  body: `Diplômé du programme de **Techniques d’intégration multimédia du Cégep de Jonquière**, je souhaite vous faire part de mon intérêt à siéger au conseil d’administration du Cégep à titre de personne diplômée d’un programme d’études techniques.

Mon parcours réunit la **gestion, les technologies et l’entrepreneuriat**. Avant de m’orienter vers le numérique, j’ai étudié en administration et gestion des affaires, acquérant ainsi des bases en gestion, en administration et en comptabilité. J’ai ensuite choisi de poursuivre mes études au Québec, au Cégep de Jonquière, où ma formation m’a conduit vers le développement logiciel.

Depuis l’obtention de mon diplôme, j’occupe un poste de **spécialiste en innovation numérique**. Je contribue à la conception et à l’évolution de solutions en intelligence artificielle, en automatisation, en développement logiciel, en cloud, en cybersécurité et en exploitation des données. Ces projets m’amènent à évaluer les choix technologiques d’une organisation selon leurs retombées, leurs risques, leurs coûts et leur capacité à soutenir les opérations et la prise de décision.

Je porte un intérêt particulier aux **enjeux liés à l’intelligence artificielle et à l’évolution rapide des technologies** : gouvernance et protection des données, cybersécurité, dépendance envers les fournisseurs, transformation des métiers et développement des compétences. Dans un établissement d’enseignement, ces questions concernent autant les orientations de l’organisation que la préparation des étudiantes et étudiants à un marché du travail en constante évolution.

Je maintiens cette compréhension à jour en participant à des **conférences technologiques au Québec et à l’extérieur**, dont **GitHub Universe à San Francisco**. Ces échanges avec des professionnels du secteur nourrissent ma réflexion et m’aident à considérer aussi bien les possibilités des nouvelles technologies que leurs limites.

Je suis également **cofondateur d’une entreprise spécialisée dans le développement Web et les solutions numériques**. Cette expérience approfondit ma compréhension des réalités entrepreneuriales, de la gestion de projets et des besoins concrets des organisations.

Comme diplômé récent ayant choisi de venir étudier au Québec, je suis par ailleurs sensible à l’accueil, à l’intégration et à l’accompagnement des étudiantes et étudiants provenant de parcours et d’horizons différents.

Je souhaiterais mettre cette diversité d’expériences au service du conseil d’administration, particulièrement lorsque les décisions comportent une dimension **numérique, technologique ou stratégique**. Je pourrais contribuer aux réflexions sur la pertinence, la pérennité, le coût et la sécurité des solutions envisagées, ainsi que sur leur valeur pour la communauté collégiale.

Cette implication serait enfin une occasion de **redonner à un établissement qui a joué un rôle déterminant dans mon parcours et mon intégration professionnelle au Québec**, tout en participant concrètement à son évolution et à sa mission auprès des prochaines générations.

Je vous remercie de l’attention portée à ma candidature et demeure disponible pour toute information supplémentaire ou pour une rencontre.`,
  closing: 'Veuillez agréer, Madame, Monsieur, mes salutations distinguées.',
  signature: PROFESSIONAL_SIGNATURE,
};

const LETTER_TEMPLATES: LetterTemplate[] = [
  {
    id: 'board-interest',
    label: 'Conseil d’administration — Cégep',
    filename: 'lettre-interet-cegep-jonquiere.pdf',
    draft: defaultDraft,
  },
  {
    id: 'motivation',
    label: 'Lettre de motivation',
    filename: 'lettre-motivation-christen-dijoux.pdf',
    draft: {
      ...defaultDraft,
      recipient: 'Service des ressources humaines\n[Nom de l’organisation]',
      subject: 'Candidature au poste de [titre du poste]',
      body: `Je vous présente ma candidature au poste de **[titre du poste]**. Spécialiste en innovation numérique et diplômé en Techniques d’intégration multimédia, je souhaite mettre mon expérience en développement logiciel, en automatisation et en intelligence artificielle au service de votre organisation.

Dans mon poste actuel, je contribue à la conception et à l’évolution de solutions numériques qui soutiennent les opérations et la prise de décision. Mon travail m’amène à évaluer les besoins, à recommander des approches adaptées et à collaborer avec différents intervenants, en tenant compte des coûts, de la sécurité et de la pérennité des solutions.

Mon parcours en administration et gestion des affaires, ainsi que mon expérience comme cofondateur d’une entreprise de développement Web, complètent mon profil technique par une compréhension concrète de la gestion de projets et des réalités organisationnelles.

Je suis particulièrement attiré par **[raison précise liée au poste ou à l’organisation]**. Je serais heureux de contribuer à vos projets grâce à ma polyvalence, à ma curiosité et à ma capacité à transformer des enjeux complexes en solutions utiles.

Je vous remercie de l’attention portée à ma candidature et demeure disponible pour une rencontre afin d’échanger sur ma contribution éventuelle à votre équipe.`,
    },
  },
  {
    id: 'spontaneous',
    label: 'Candidature spontanée',
    filename: 'candidature-spontanee-christen-dijoux.pdf',
    draft: {
      ...defaultDraft,
      recipient: 'Service des ressources humaines\n[Nom de l’organisation]',
      subject: 'Candidature spontanée — Innovation et solutions numériques',
      body: `Je souhaite vous soumettre ma candidature spontanée pour toute occasion correspondant à mon profil en **innovation numérique, développement logiciel et intelligence artificielle**.

J’occupe actuellement un poste de spécialiste en innovation numérique, dans lequel je participe à la conception de solutions touchant l’automatisation, le cloud, la cybersécurité et l’exploitation des données. J’accompagne également la réflexion entourant les choix technologiques, leurs risques et leur valeur pour l’organisation.

Ma formation en intégration multimédia, mes études en administration et gestion des affaires et mon expérience entrepreneuriale me permettent d’aborder les projets avec une perspective à la fois technique, stratégique et orientée vers les besoins des utilisateurs.

L’intérêt que je porte à **[nom de l’organisation]** repose notamment sur **[raison personnalisée]**. Je serais heureux d’échanger avec vous afin d’explorer les besoins auxquels mon expérience et ma polyvalence pourraient répondre.

Je vous remercie de l’attention portée à ma démarche et demeure disponible pour une rencontre.`,
    },
  },
  {
    id: 'internship',
    label: 'Demande de stage',
    filename: 'demande-stage-christen-dijoux.pdf',
    draft: {
      ...defaultDraft,
      recipient: 'Responsable des stages\n[Nom de l’organisation]',
      subject: 'Demande de stage en [domaine]',
      body: `Actuellement étudiant en **[nom du programme]** à **[nom de l’établissement]**, je souhaite effectuer un stage en **[domaine]** du **[date de début]** au **[date de fin]**.

Ma formation m’a permis de développer des compétences en **[compétences principales]** et de les mettre en pratique dans le cadre de **[projet ou réalisation pertinente]**. Cette expérience a renforcé mon intérêt pour **[spécialité recherchée]** ainsi que ma capacité à apprendre rapidement et à travailler en équipe.

Votre organisation retient particulièrement mon attention en raison de **[projet, valeur ou expertise de l’organisation]**. Ce stage serait pour moi l’occasion de contribuer concrètement à vos activités tout en approfondissant mes connaissances auprès de professionnels expérimentés.

Sérieux, curieux et autonome, je serais heureux de vous rencontrer afin de discuter de vos besoins et des objectifs du stage.

Je vous remercie de l’attention portée à ma demande et demeure disponible pour toute information supplémentaire.`,
    },
  },
  {
    id: 'recommendation',
    label: 'Lettre de recommandation',
    filename: 'lettre-recommandation.pdf',
    draft: {
      ...defaultDraft,
      recipient: 'À qui de droit',
      subject: 'Lettre de recommandation pour [nom de la personne]',
      body: `J’ai le plaisir de recommander **[nom de la personne]**, avec qui j’ai eu l’occasion de travailler dans le cadre de **[contexte de la collaboration]** pendant **[durée]**.

Au cours de cette période, [prénom] s’est distingué(e) par **[qualités principales]**. Sa contribution à **[projet ou responsabilité]** a notamment permis de **[résultat concret]**. J’ai particulièrement apprécié sa capacité à **[compétence ou comportement observable]**.

[Prénom] fait preuve de professionnalisme, de fiabilité et d’un réel souci de la qualité. Sa facilité à collaborer, à recevoir de la rétroaction et à s’adapter aux imprévus en fait une personne appréciée de ses collègues.

Je suis convaincu que [prénom] saura apporter une contribution positive à **[organisation, programme ou poste visé]**. Je recommande donc sa candidature sans hésitation.

Je demeure disponible pour fournir toute information complémentaire.`,
    },
  },
  {
    id: 'resignation',
    label: 'Lettre de démission',
    filename: 'lettre-demission-christen-dijoux.pdf',
    draft: {
      ...defaultDraft,
      recipient: '[Nom du gestionnaire]\n[Nom de l’organisation]',
      subject: 'Démission de mon poste de [titre du poste]',
      body: `Par la présente, je vous informe de ma décision de quitter mon poste de **[titre du poste]** au sein de **[nom de l’organisation]**. Conformément au préavis convenu, ma dernière journée de travail sera le **[date]**.

Je tiens à vous remercier pour les occasions d’apprentissage et de développement professionnel qui m’ont été offertes durant mon passage dans l’organisation. J’ai apprécié la confiance accordée ainsi que les collaborations établies avec mes collègues.

D’ici mon départ, je veillerai à documenter mes dossiers et à faciliter le transfert de mes responsabilités afin d’assurer une transition aussi fluide que possible.

Je souhaite à l’équipe et à l’organisation beaucoup de succès pour la suite.`,
    },
  },
  {
    id: 'interview-thanks',
    label: 'Remerciement après entretien',
    filename: 'remerciement-entretien-christen-dijoux.pdf',
    draft: {
      ...defaultDraft,
      recipient: '[Nom de la personne]\n[Nom de l’organisation]',
      subject: 'Remerciements — Entretien pour le poste de [titre du poste]',
      salutation: 'Bonjour [nom de la personne],',
      body: `Je vous remercie pour le temps accordé lors de notre entretien du **[date]** concernant le poste de **[titre du poste]**.

Notre échange a renforcé mon intérêt pour cette occasion, particulièrement en ce qui concerne **[projet, responsabilité ou enjeu discuté]**. Les besoins présentés correspondent bien à mon expérience en innovation numérique, en développement logiciel et en accompagnement des décisions technologiques.

Je serais heureux de mettre ma polyvalence et mon approche orientée vers les solutions au service de votre équipe. N’hésitez pas à communiquer avec moi si vous avez besoin d’informations supplémentaires pour la suite du processus.

Merci encore pour la qualité de notre échange. Au plaisir de poursuivre la discussion.`,
      closing: 'Cordialement,',
    },
  },
];

const isTemplateId = (value: string | null): value is TemplateId =>
  LETTER_TEMPLATES.some((template) => template.id === value);

const getTemplate = (templateId: TemplateId) =>
  LETTER_TEMPLATES.find((template) => template.id === templateId) ?? LETTER_TEMPLATES[0];

const getDraftStorageKey = (templateId: TemplateId) =>
  templateId === 'board-interest' ? STORAGE_KEY : `${STORAGE_KEY}-${templateId}`;

const getInitialTemplateId = (): TemplateId => {
  const savedTemplateId = localStorage.getItem(SELECTED_TEMPLATE_KEY);
  return isTemplateId(savedTemplateId) ? savedTemplateId : 'board-interest';
};

const getInitialDraft = (templateId: TemplateId): LetterDraft => {
  const templateDraft = getTemplate(templateId).draft;
  try {
    const savedDraft = localStorage.getItem(getDraftStorageKey(templateId));
    if (!savedDraft) return templateDraft;

    const parsedDraft = { ...templateDraft, ...JSON.parse(savedDraft) };
    if (
      parsedDraft.signature === 'Christen Dijoux' ||
      parsedDraft.signature === PREVIOUS_PROFESSIONAL_SIGNATURE ||
      parsedDraft.signature === PREVIOUS_PERSONAL_SIGNATURE
    ) {
      parsedDraft.signature = PROFESSIONAL_SIGNATURE;
    }
    return parsedDraft;
  } catch {
    return templateDraft;
  }
};

const renderEmphasis = (text: string) =>
  text.split(/(\*\*.*?\*\*)/g).map((part, index) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>
    ) : (
      part
    ),
  );

export default function LetterGeneratorPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>(getInitialTemplateId);
  const [draft, setDraft] = useState<LetterDraft>(() => getInitialDraft(selectedTemplate));
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const paragraphs = useMemo(
    () => draft.body.split(/\n\s*\n/).filter(Boolean),
    [draft.body],
  );

  useEffect(() => {
    localStorage.setItem(getDraftStorageKey(selectedTemplate), JSON.stringify(draft));
    localStorage.setItem(SELECTED_TEMPLATE_KEY, selectedTemplate);
  }, [draft, selectedTemplate]);

  useEffect(() => {
    document.body.classList.add('letter-print-mode');
    return () => document.body.classList.remove('letter-print-mode');
  }, []);

  const updateDraft = (field: keyof LetterDraft, value: string) => {
    setDraft((currentDraft) => ({ ...currentDraft, [field]: value }));
  };

  const getPlainText = () =>
    `${draft.placeAndDate}\n\n${draft.recipient}\n\nObjet : ${draft.subject}\n\n${draft.salutation}\n\n${draft.body.split('**').join('')}\n\n${draft.closing}\n\n${draft.signature}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getPlainText());
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const handleReset = () => {
    setDraft(getTemplate(selectedTemplate).draft);
  };

  const handleTemplateChange = (templateId: TemplateId) => {
    setSelectedTemplate(templateId);
    setDraft(getInitialDraft(templateId));
  };

  const handleExport = async () => {
    const letter = document.getElementById('letter-export-root');
    if (!letter || isExporting) return;

    setIsExporting(true);
    letter.classList.add('letter-exporting');
    try {
      const { default: html2pdf } = await import('html2pdf.js');
      await html2pdf()
        .set({
          filename: getTemplate(selectedTemplate).filename,
          margin: 0,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        })
        .from(letter)
        .save();
    } finally {
      letter.classList.remove('letter-exporting');
      setIsExporting(false);
    }
  };

  return (
    <main className="letter-generator min-h-screen bg-black px-4 pb-16 pt-10 text-white sm:px-6 lg:px-10">
      <Helmet>
        <title>Générateur de lettre | Christen Dijoux</title>
        <meta
          name="description"
          content="Créer, personnaliser et exporter une lettre professionnelle au format PDF."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="mx-auto max-w-[1500px]">
        <header className="letter-toolbar mb-8 flex flex-col gap-5 border-b border-white/15 pb-6 print:hidden lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link
              to="/"
              className="mb-5 inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour au portfolio
            </Link>
            <div className="flex items-center gap-3">
              <FileText className="h-7 w-7" aria-hidden="true" />
              <h1 className="text-3xl font-semibold sm:text-4xl">Générateur de lettre</h1>
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/60">
              Personnalisez le modèle, vérifiez le rendu, puis exportez une version prête à envoyer.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleReset}
              title="Réinitialiser la lettre"
              className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-white/20 transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="sr-only">Réinitialiser la lettre</span>
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex h-11 items-center gap-2 rounded-md border border-white/20 px-4 text-sm font-medium transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
            >
              {copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
              {copied ? 'Copiée' : 'Copier'}
            </button>
            <button
              type="button"
              onClick={handleExport}
              disabled={isExporting}
              className="inline-flex h-11 items-center gap-2 rounded-md bg-white px-4 text-sm font-semibold text-black transition-colors hover:bg-white/85 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
            >
              <Download className="h-4 w-4" />
              {isExporting ? 'Génération…' : 'Exporter en PDF'}
            </button>
          </div>
        </header>

        <div className="letter-workspace grid gap-8 xl:grid-cols-[390px_minmax(0,1fr)]">
          <aside className="letter-editor print:hidden">
            <div className="mb-6 border-b border-white/15 pb-6">
              <label htmlFor="letter-template" className="mb-2 block text-xs font-semibold uppercase text-white/50">
                Modèle
              </label>
              <select
                id="letter-template"
                className="w-full rounded-md border border-white/20 bg-black px-3 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white"
                value={selectedTemplate}
                onChange={(event) => handleTemplateChange(event.target.value as TemplateId)}
              >
                {LETTER_TEMPLATES.map((template) => (
                  <option key={template.id} value={template.id}>{template.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-5">
              <EditorField label="Lieu et date" value={draft.placeAndDate} onChange={(value) => updateDraft('placeAndDate', value)} />
              <EditorField label="Destinataire" value={draft.recipient} onChange={(value) => updateDraft('recipient', value)} rows={2} />
              <EditorField label="Objet" value={draft.subject} onChange={(value) => updateDraft('subject', value)} rows={3} />
              <EditorField label="Formule d’appel" value={draft.salutation} onChange={(value) => updateDraft('salutation', value)} />
              <EditorField
                label="Corps de la lettre"
                value={draft.body}
                onChange={(value) => updateDraft('body', value)}
                rows={18}
                hint="Entourez un passage de **deux astérisques** pour le mettre en gras."
              />
              <EditorField label="Formule de politesse" value={draft.closing} onChange={(value) => updateDraft('closing', value)} rows={2} />
              <EditorField label="Signature" value={draft.signature} onChange={(value) => updateDraft('signature', value)} rows={7} />
            </div>
          </aside>

          <section className="letter-preview-area min-w-0" aria-label="Aperçu de la lettre">
            <div className="mb-3 flex items-center justify-between text-xs uppercase text-white/40 print:hidden">
              <span>Aperçu</span>
              <span>Format A4</span>
            </div>
            <article className="letter-paper mx-auto bg-white text-[#151515] shadow-2xl" id="letter-export-root">
              <div className="letter-brand-rule" />
              <header className="letter-sender">
                <p className="letter-sender-name">CHRISTEN DIJOUX</p>
                <p>Spécialiste en innovation numérique</p>
                <p>Saguenay, Québec</p>
                <p>christen.dijoux@gmail.com · (418) 376-2612</p>
              </header>

              <div className="letter-date">{draft.placeAndDate}</div>
              <div className="letter-recipient whitespace-pre-line">{draft.recipient}</div>
              <p className="letter-subject"><strong>Objet&nbsp;:</strong> {draft.subject}</p>
              <p>{draft.salutation}</p>

              <div className="letter-body">
                {paragraphs.map((paragraph, index) => (
                  <p key={`${paragraph.slice(0, 24)}-${index}`}>{renderEmphasis(paragraph)}</p>
                ))}
              </div>

              <p className="letter-closing">{draft.closing}</p>
              <div className="letter-signature">
                <span className="letter-signature-mark">CD</span>
                <div className="letter-signature-details">
                  {draft.signature.split('\n').map((line, index) => (
                    index === 0
                      ? <strong key={`${line}-${index}`}>{line}</strong>
                      : <span key={`${line}-${index}`}>{line}</span>
                  ))}
                </div>
              </div>
            </article>
          </section>
        </div>
      </div>
      <span className="sr-only" aria-live="polite">{copied ? 'Lettre copiée dans le presse-papiers' : ''}</span>
    </main>
  );
}

interface EditorFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  hint?: string;
}

function EditorField({ label, value, onChange, rows = 1, hint }: EditorFieldProps) {
  const fieldId = `letter-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

  return (
    <div>
      <label htmlFor={fieldId} className="mb-2 block text-xs font-semibold uppercase text-white/50">
        {label}
      </label>
      <textarea
        id={fieldId}
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full resize-y rounded-md border border-white/15 bg-white/[0.04] px-3 py-2.5 text-sm leading-relaxed text-white transition-colors placeholder:text-white/30 hover:border-white/30 focus:border-white/60 focus:outline-none focus:ring-1 focus:ring-white/60"
      />
      {hint && <p className="mt-1.5 text-xs leading-relaxed text-white/40">{hint}</p>}
    </div>
  );
}
