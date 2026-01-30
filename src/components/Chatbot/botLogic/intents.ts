import { IntentCategory } from './types';
import { botKnowledge } from './knowledge';

export const intents: IntentCategory = {
  greeting: {
    patterns: [
      /bonjour/i, /salut/i, /hello/i, /hi/i, /hey/i, /bonsoir/i, /comment ca va/i, /comment allez vous/i, /yo/i, /coucou/i, /cc/i, /slt/i, /bjr/i
    ],
    responses: [
      `Bonjour ! Je suis l'assistant virtuel de ${botKnowledge.name}. Comment puis-je vous aider ?`,
      `Salut ! Je suis là pour répondre à vos questions sur ${botKnowledge.name}. Que souhaitez-vous savoir ?`,
      `Hey ! Ravi de vous rencontrer. Je peux vous parler des projets, compétences ou du parcours de ${botKnowledge.name}.`
    ]
  },
  
  role: {
    patterns: [
      /que fais tu/i, /quel est ton travail/i, /quel poste/i, /quelle profession/i, /que fais tu dans la vie/i, 
      /ou travailles tu/i, /ou travailles vous/i, /ou travailles-tu/i, /ou travailles-vous/i, 
      /quelle est ta profession/i, /quelle est votre profession/i, /quel est ton rôle/i, 
      /quel est votre rôle/i, /quel est ton métier/i, /quel est votre métier/i
    ],
    responses: [
      `${botKnowledge.name} est ${botKnowledge.role} ${botKnowledge.company}. Il se spécialise dans la création d'expériences web interactives et esthétiques.`,
      `En tant que ${botKnowledge.role}, ${botKnowledge.name} combine créativité et technique pour développer des solutions web innovantes.`,
      `${botKnowledge.name} est passionné par le développement front-end et crée des interfaces utilisateurs modernes et performantes.`
    ]
  },

  skills: {
    patterns: [
      /competences/i, /technologies/i, /stack technique/i, /langages/i, /que sais tu faire/i, 
      /technologies maitrisees/i, /stack/i, /quels langages/i, /quelles technologies/i, 
      /quels langages de programmation/i, /quelles technologies de programmation/i
    ],
    responses: [
      `Les principales compétences de ${botKnowledge.name} incluent : ${botKnowledge.skills.join(', ')}. Il se spécialise particulièrement en React et TypeScript.`,
      `${botKnowledge.name} maîtrise plusieurs technologies front-end : ${botKnowledge.skills.slice(0, 5).join(', ')} et bien d'autres. Que souhaitez-vous savoir en particulier ?`,
      `Dans sa stack technique, on retrouve : ${botKnowledge.skills.join(', ')}. Il continue d'apprendre de nouvelles technologies régulièrement.`
    ]
  },

  projects: {
    patterns: [
      /projets/i, /portfolio/i, /realisations/i, /travaux/i, /creations/i, /applications/i,
      /sites web/i, /sites internet/i, /experiences/i, /demo/i, /github/i
    ],
    responses: [
      `Voici quelques projets notables de ${botKnowledge.name} :\n${botKnowledge.projects.map(p => `- ${p.name}: ${p.description}\n  ${p.url}`).join('\n')}`,
      `${botKnowledge.name} a réalisé plusieurs projets intéressants, notamment :\n${botKnowledge.projects.map(p => `- ${p.name}: ${p.description}`).join('\n')}`,
      `Parmi ses réalisations, on peut citer :\n${botKnowledge.projects.map(p => `- ${p.name}: ${p.description}\n  Voir le projet: ${p.url}`).join('\n')}`
    ]
  },

  education: {
    patterns: [
      /formation/i, /etudes/i, /parcours/i, /diplome/i, /diplôme/i, /education/i, /université/i,
      /ecole/i, /école/i, /cursus/i, /academique/i, /académique/i, /scolaire/i
    ],
    responses: [
      `${botKnowledge.name} suit actuellement ${botKnowledge.education[0].title} à ${botKnowledge.education[0].school} (${botKnowledge.education[0].period}).`,
      `Parcours académique :\n${botKnowledge.education.map(e => `- ${e.title} à ${e.school} (${e.period})`).join('\n')}`,
      `Formation actuelle : ${botKnowledge.education[0].title} (${botKnowledge.education[0].period})`
    ]
  },

  interests: {
    patterns: [
      /interets/i, /intérêts/i, /passions/i, /hobbies/i, /loisirs/i, /temps libre/i,
      /que fait/i, /aime faire/i, /centres d'intérêt/i
    ],
    responses: [
      `${botKnowledge.name} s'intéresse à : ${botKnowledge.interests.join(', ')}.`,
      `Ses centres d'intérêt incluent : ${botKnowledge.interests.join(', ')}.`,
      `En dehors du développement, ${botKnowledge.name} est passionné par : ${botKnowledge.interests.slice(3).join(', ')}.`
    ]
  },

  contact: {
    patterns: [
      /contact/i, /email/i, /mail/i, /coordonnees/i, /linkedin/i, /github/i, /comment te contacter/i,
      /comment le contacter/i, /comment vous contacter/i, /comment la contacter/i
    ],
    responses: [
      `Vous pouvez contacter ${botKnowledge.name} via :\n- Email : ${botKnowledge.contact.email}\n- LinkedIn : ${botKnowledge.contact.linkedin}\n- GitHub : ${botKnowledge.contact.github}`,
      `Pour contacter ${botKnowledge.name} :\n- Email professionnel : ${botKnowledge.contact.email}\n- Profil LinkedIn : ${botKnowledge.contact.linkedin}`,
      `${botKnowledge.name} est joignable par email (${botKnowledge.contact.email}) ou sur les réseaux professionnels comme LinkedIn.`
    ]
  },

  languages: {
    patterns: [
      /langues/i, /langues parlees/i, /parles tu anglais/i, /quelles langues/i,
      /niveau en anglais/i, /niveau en francais/i, /niveau en creole/i, /niveau en espagnol/i
    ],
    responses: [
      `${botKnowledge.name} parle : ${botKnowledge.languages.join(', ')}.`,
      `Langues maîtrisées : ${botKnowledge.languages.join(', ')}.`,
      `Compétences linguistiques : ${botKnowledge.languages.join(', ')}.`
    ]
  },

  thanks: {
    patterns: [
      /merci/i, /thanks/i, /thank you/i, /thx/i, /remercie/i, /remercier/i,
      /je vous remercie/i, /je te remercie/i
    ],
    responses: [
      "Je vous en prie ! N'hésitez pas si vous avez d'autres questions.",
      "Avec plaisir ! Je suis là pour vous aider.",
      "De rien ! Avez-vous d'autres questions ?"
    ]
  },

  goodbye: {
    patterns: [
      /au revoir/i, /bye/i, /ciao/i, /adieu/i, /a plus/i, /à plus/i,
      /a bientot/i, /à bientôt/i, /bonne journee/i, /bonne journée/i
    ],
    responses: [
      "Au revoir ! N'hésitez pas à revenir si vous avez d'autres questions.",
      "À bientôt ! Je suis toujours là pour répondre à vos questions.",
      "Bonne journée ! Revenez quand vous voulez."
    ]
  },

  unknown: {
    patterns: [],
    responses: [
      "Je ne suis pas sûr de comprendre votre question. Pouvez-vous la reformuler ?",
      "Désolé, je n'ai pas bien saisi. Pourriez-vous préciser votre demande ?",
      `Je peux vous parler des compétences, projets, formations ou coordonnées de ${botKnowledge.name}. Que souhaitez-vous savoir ?`
    ]
  }
};