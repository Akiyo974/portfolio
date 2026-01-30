# 🤖 Documentation du Chatbot

## 📚 Vue d'ensemble

Le chatbot est un assistant virtuel intelligent intégré au portfolio pour répondre aux questions des visiteurs sur Christen Dijoux, ses compétences, projets et parcours.

## 🏗️ Architecture

```
src/components/Chatbot/
├── index.tsx              # Point d'entrée du module
├── Chatbot.tsx            # Composant principal
├── ChatWindow.tsx         # Fenêtre de chat
├── ChatHeader.tsx         # En-tête avec boutons
├── ChatMessages.tsx       # Liste des messages
├── ChatMessage.tsx        # Message individuel
├── ChatInput.tsx          # Champ de saisie
├── MessageBubble.tsx      # Bulle de message stylée
├── types.ts               # Types TypeScript
└── botLogic/
    ├── intents.ts         # Intentions et patterns
    ├── knowledge.ts       # Base de connaissances
    ├── messageHandler.ts  # Logique de traitement
    └── types.ts           # Types pour la logique
```

## 🧠 Base de Connaissances (`knowledge.ts`)

La base de connaissances contient toutes les informations sur Christen Dijoux :

```typescript
export const botKnowledge = {
  name: "Christen Dijoux",
  role: "Développeur Full-stack",
  company: "Freelance",
  
  skills: [
    "React", "TypeScript", "Next.js", "Node.js",
    "TailwindCSS", "GSAP", "Three.js", "PostgreSQL",
    "Supabase", "Git", "WordPress"
  ],
  
  projects: [
    {
      name: "CTREQ",
      description: "Migration WordPress headless vers Next.js...",
      url: "/project/ctreq"
    },
    // ... autres projets
  ],
  
  education: [
    {
      title: "Attestation d'Études Collégiales (AEC)",
      school: "Collège de Maisonneuve",
      period: "2023-2025"
    }
  ],
  
  contact: {
    email: "christen.dijoux@gmail.com",
    linkedin: "https://linkedin.com/in/christen-dijoux",
    github: "https://github.com/Akiyo974"
  },
  
  languages: ["Français (natif)", "Anglais (intermédiaire)", "Créole réunionnais"],
  interests: ["Développement web", "UI/UX Design", "Nouvelles technologies", "Gaming", "Musique", "Sport"]
};
```

### 📝 Ajouter de nouvelles informations

Pour ajouter des données au chatbot, modifiez `knowledge.ts` :

1. **Nouvelle compétence** : Ajoutez-la dans `skills[]`
2. **Nouveau projet** : Ajoutez un objet dans `projects[]`
3. **Nouvelle formation** : Ajoutez un objet dans `education[]`
4. **Nouveaux centres d'intérêt** : Ajoutez dans `interests[]`

## 🎯 Système d'Intentions (`intents.ts`)

Les intentions définissent comment le chatbot comprend et répond aux questions.

### Structure d'une intention

```typescript
greeting: {
  patterns: [
    /bonjour/i, /salut/i, /hello/i, /hi/i
  ],
  responses: [
    "Bonjour ! Je suis l'assistant virtuel de Christen Dijoux.",
    "Salut ! Je suis là pour répondre à vos questions.",
    "Hey ! Ravi de vous rencontrer."
  ]
}
```

### Intentions disponibles

| Intention | Description | Exemples de questions |
|-----------|-------------|-----------------------|
| `greeting` | Salutations | "Bonjour", "Salut", "Hello" |
| `role` | Rôle professionnel | "Que fais-tu ?", "Quel est ton métier ?" |
| `skills` | Compétences techniques | "Quelles compétences ?", "Technologies maîtrisées ?" |
| `projects` | Projets réalisés | "Quels projets ?", "Portfolio", "Réalisations" |
| `education` | Parcours académique | "Formation ?", "Études ?", "Diplôme ?" |
| `interests` | Centres d'intérêt | "Passions ?", "Hobbies ?", "Loisirs ?" |
| `contact` | Coordonnées | "Contact ?", "Email ?", "LinkedIn ?" |
| `languages` | Langues parlées | "Quelles langues ?", "Parles-tu anglais ?" |
| `thanks` | Remerciements | "Merci", "Thank you" |
| `goodbye` | Au revoir | "Bye", "À plus", "Bonne journée" |
| `unknown` | Question non comprise | Fallback par défaut |

### 🆕 Ajouter une nouvelle intention

1. Ouvrez `intents.ts`
2. Ajoutez une nouvelle entrée :

```typescript
skills_specific: {
  patterns: [
    /react/i, /typescript/i, /next\.?js/i
  ],
  responses: [
    "Christen maîtrise React depuis 3 ans et l'utilise quotidiennement.",
    "TypeScript est son langage préféré pour le développement front-end.",
    "Next.js est sa stack principale pour les applications modernes."
  ]
}
```

3. Les patterns utilisent des **expressions régulières** :
   - `/i` : insensible à la casse
   - `\.?` : point optionnel (pour "Next.js" ou "Nextjs")
   - `|` : OU logique (ex: `/react|vue|angular/i`)

## 🔍 Traitement des Messages (`messageHandler.ts`)

### Algorithme de matching

Le chatbot utilise **Fuse.js** pour la recherche floue (fuzzy matching) :

```typescript
import Fuse from 'fuse.js';

// Configuration Fuse.js
const fuseOptions = {
  threshold: 0.4,        // Tolérance (0 = exact, 1 = très permissif)
  ignoreLocation: true,
  keys: ['patterns']
};

// Recherche de l'intention
const fuse = new Fuse(intentList, fuseOptions);
const results = fuse.search(userMessage);
```

### Flux de traitement

```
Message utilisateur
    ↓
Recherche fuzzy dans les patterns
    ↓
Intention trouvée ?
    ├─ OUI → Réponse aléatoire parmi responses[]
    └─ NON → Intention "unknown" (fallback)
    ↓
Retour de la réponse
```

### Configuration du matching

Modifiez `threshold` dans `messageHandler.ts` pour ajuster la sensibilité :

- **0.0 - 0.2** : Très strict (correspondance quasi-exacte)
- **0.3 - 0.5** : Équilibré (recommandé) ✅
- **0.6 - 1.0** : Très permissif (risque de faux positifs)

## 🎨 Personnalisation UI

### Props du composant Chatbot

```typescript
interface ChatbotProps {
  botName?: string;           // Nom du bot (défaut: "Assistant")
  welcomeMessage?: string;    // Message d'accueil personnalisé
  position?: 'bottom-right' | 'bottom-left'; // Position du bouton
}
```

### Exemple d'utilisation

```tsx
<Chatbot
  botName="Aki Assistant"
  welcomeMessage="👋 Salut ! Je suis l'IA de Christen. Pose-moi tes questions !"
  position="bottom-right"
/>
```

## 🧪 Extension du Chatbot

### 1. Ajouter une recherche de projets

Créez une intention pour chercher un projet spécifique :

```typescript
// Dans intents.ts
project_search: {
  patterns: [/ctreq/i, /webana/i, /akiproject/i, /akimusic/i],
  responses: [
    // Réponse dynamique générée dans messageHandler.ts
  ]
}

// Dans messageHandler.ts
if (intent === 'project_search') {
  const projectName = extractProjectName(message);
  const project = botKnowledge.projects.find(p => 
    p.name.toLowerCase().includes(projectName)
  );
  
  return project 
    ? `${project.description}\nVoir le projet : ${project.url}`
    : "Projet non trouvé. Essayez : CTREQ, Webana, AkiProject ou AkiMusic.";
}
```

### 2. Intégrer une API externe

Exemple : Récupérer les stats GitHub en temps réel

```typescript
// Dans messageHandler.ts
async function getGitHubStats(): Promise<string> {
  const response = await fetch('https://api.github.com/users/Akiyo974');
  const data = await response.json();
  
  return `Christen a ${data.public_repos} repositories publics et ${data.followers} followers sur GitHub.`;
}

// Nouvelle intention
github_stats: {
  patterns: [/github stats/i, /repositories/i],
  responses: [], // Dynamique via API
  handler: getGitHubStats
}
```

### 3. Multi-langue (FR/EN)

Ajoutez le support i18n :

```typescript
// knowledge.ts
export const botKnowledgeEN = {
  name: "Christen Dijoux",
  role: "Full-stack Developer",
  // ... traductions anglaises
};

// intents.ts
export const intentsEN: IntentCategory = {
  greeting: {
    patterns: [/hello/i, /hi/i, /hey/i],
    responses: [
      "Hello! I'm Christen Dijoux's virtual assistant.",
      "Hi there! How can I help you?"
    ]
  },
  // ... autres intentions en anglais
};

// messageHandler.ts
const currentLang = i18n.language; // 'fr' ou 'en'
const knowledge = currentLang === 'en' ? botKnowledgeEN : botKnowledge;
const intentSet = currentLang === 'en' ? intentsEN : intents;
```

## 🔧 Debugging

### Activer les logs

Ajoutez dans `messageHandler.ts` :

```typescript
export const handleMessage = (message: string): string => {
  console.log('[Chatbot] Message reçu:', message);
  
  const intent = detectIntent(message);
  console.log('[Chatbot] Intention détectée:', intent);
  
  const response = generateResponse(intent);
  console.log('[Chatbot] Réponse générée:', response);
  
  return response;
};
```

### Tester les patterns

Console du navigateur :

```javascript
const pattern = /bonjour|salut|hello/i;
console.log(pattern.test("Bonjour!")); // true
console.log(pattern.test("bonsoir"));   // false
```

## 📊 Métriques & Analytics

### Tracker les questions populaires

```typescript
// Dans messageHandler.ts
const questionStats: { [key: string]: number } = {};

export const handleMessage = (message: string): string => {
  const intent = detectIntent(message);
  
  // Incrémenter le compteur
  questionStats[intent] = (questionStats[intent] || 0) + 1;
  
  // Logger dans la console (ou envoyer à Analytics)
  console.log('Top 5 questions:', 
    Object.entries(questionStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
  );
  
  return generateResponse(intent);
};
```

## 🚀 Performance

### Optimisations appliquées

- ✅ **Lazy loading** : Le chatbot se charge uniquement au clic
- ✅ **Recherche locale** : Pas d'appel API pour les réponses standard
- ✅ **Cache des réponses** : Réutilisation des réponses générées
- ✅ **Debounce** : Limite les recherches pendant la saisie

### Bundle size

- Fuse.js : ~20 KB gzipped
- Composants Chatbot : ~15 KB gzipped
- **Total** : ~35 KB

## 🔐 Sécurité

### Protection XSS

Les messages sont automatiquement échappés par React :

```tsx
<p>{message.text}</p> {/* Safe par défaut */}
```

### Limitation des messages

Ajoutez un rate limiting :

```typescript
const MESSAGE_LIMIT = 10;
const TIME_WINDOW = 60000; // 1 minute

let messageCount = 0;
let windowStart = Date.now();

export const handleMessage = (message: string): string => {
  const now = Date.now();
  
  if (now - windowStart > TIME_WINDOW) {
    messageCount = 0;
    windowStart = now;
  }
  
  if (messageCount >= MESSAGE_LIMIT) {
    return "⚠️ Trop de messages. Veuillez patienter 1 minute.";
  }
  
  messageCount++;
  return processMessage(message);
};
```

## 📚 Ressources

- [Fuse.js Documentation](https://fusejs.io/)
- [Regex101 (tester les patterns)](https://regex101.com/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

---

**Dernière mise à jour** : 18 novembre 2024  
**Auteur** : Christen Dijoux
