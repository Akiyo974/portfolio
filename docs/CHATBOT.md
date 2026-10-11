# Assistant du portfolio

Assistant conversationnel **local** : aucune requête vers un service externe, aucune clé API.
Il répond à partir des données du site, en français ou en anglais selon la langue active.

## Architecture

```
src/components/Chatbot/
├── Chatbot.tsx            # Interface (lanceur, panneau, suggestions, actions)
├── index.ts               # Export
└── botLogic/
    ├── types.ts           # BotReply, BotAction, BotContext, Knowledge
    ├── knowledge.ts       # Base de connaissances générée depuis les données du site
    ├── brain.ts           # Intentions, entités, questions de suivi, réponses FR/EN
    └── messageHandler.ts  # Point d'entrée asynchrone (délai de réponse naturel)
```

## Sources de connaissances

`knowledge.ts` ne contient presque aucun texte en dur : il lit

- `src/i18n/locales/{fr,en}.json` — rôle, intro, expériences, formations, disponibilité ;
- `src/data/customProjects.ts` — projets, stack, fonctionnalités, défis ;
- `src/data/skills.ts` — compétences par catégorie (partagées avec la section À propos).

Mettre à jour le site met donc l'assistant à jour automatiquement.

## Fonctionnement (`brain.ts`)

1. **Normalisation** : minuscules, accents et ponctuation retirés.
2. **Projet mentionné** (alias dans `extraAliases`) → résumé + lien vers l'étude de cas.
3. **Questions de suivi** sur le dernier projet évoqué : « quelle stack ? », « les défis ? », « projet suivant », « le lien ? ».
4. **Technologie** (`TECH_ALIASES`) → catégorie de compétence + projets qui l'utilisent.
5. **Intention** (`INTENTS`) : mots-clés entiers, `*` final = toute terminaison (`competen*`).
6. Sinon : message d'aide + suggestions.

Chaque réponse est un `BotReply` : `text`, `actions` (route interne, lien externe, ancre, téléchargement) et `suggestions` (boutons de relance).

## Ajouter une intention

1. Ajouter la clé et ses mots-clés FR/EN dans `INTENTS`.
2. Ajouter le `case` correspondant dans `intentReply`.
3. Ajouter un cas dans `src/tests/chatBrain.test.ts`.

## Interface

- Conversation conservée pendant la session (`sessionStorage`), réinitialisable.
- Invitation discrète après 9 s, une fois par session, sur grand écran.
- `Échap` ferme le panneau ; plein écran sur mobile ; animation de révélation désactivée si « réduire les animations ».
