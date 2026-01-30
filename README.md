# 🎨 Portfolio - Christen Dijoux

Portfolio interactif moderne construit avec React, TypeScript et des animations avancées.

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.10-646CFF.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-38B2AC.svg)](https://tailwindcss.com/)

## ✨ Fonctionnalités

- 🎭 **Animations fluides** avec GSAP et Framer Motion
- 🌌 **Scène 3D** interactive avec Three.js
- 🎮 **Mini-jeu** de collection d'étoiles avec leaderboard
- 🤖 **Chatbot intelligent** avec traitement du langage naturel
- 📱 **Design responsive** et accessible (WCAG 2.1)
- ⚡ **Performances optimisées** (lazy loading, code splitting)
- 🎯 **SEO optimisé** avec meta tags complets

## 🚀 Technologies

| Catégorie | Technologies |
|-----------|-------------|
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | TailwindCSS, PostCSS |
| **Animations** | GSAP, Framer Motion, Lenis |
| **3D** | Three.js |
| **Backend** | Supabase |
| **Email** | EmailJS |
| **NLP** | Fuse.js |
| **UI** | Lucide React, Canvas Confetti |

## 📦 Installation

### Prérequis

- Node.js 18+ 
- npm ou yarn

### Étapes

1. **Cloner le repository**
```bash
git clone https://github.com/Akiyo974/portfolio.git
cd portfolio
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env
```

Éditez `.env` avec vos clés API :
```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_clé_supabase
VITE_EMAILJS_SERVICE_ID=votre_service_id
VITE_EMAILJS_TEMPLATE_ID=votre_template_id
VITE_EMAILJS_PUBLIC_KEY=votre_public_key
```

4. **Lancer le serveur de développement**
```bash
npm run dev
```

Le site sera accessible sur `http://localhost:5173`

## 🏗️ Build

```bash
npm run build
npm run preview
```

Les fichiers optimisés seront dans le dossier `dist/`

## 📂 Structure du Projet

```
portfolio/
├── src/
│   ├── components/      # Composants réutilisables
│   │   ├── Chatbot/    # Système de chatbot
│   │   ├── StarGame/   # Mini-jeu
│   │   └── ...
│   ├── contexts/        # Contextes React
│   ├── hooks/          # Hooks personnalisés
│   ├── lib/            # Bibliothèques (Supabase)
│   ├── pages/          # Pages de l'application
│   ├── assets/         # Images et ressources
│   └── main.tsx        # Point d'entrée
├── public/             # Fichiers statiques
└── ...
```

## 🎯 Fonctionnalités Clés

### Système de Gamification
- Collection d'étoiles cachées dans le portfolio
- Mini-jeu avec timer et leaderboard temps réel
- Animations de confetti pour célébrer les victoires

### Chatbot Intelligent
- Traitement du langage naturel avec Fuse.js
- Réponses contextuelles sur les projets et compétences
- Interface conversationnelle moderne

### Animations Avancées
- Smooth scroll avec Lenis
- Animations parallaxe avec ScrollTrigger (GSAP)
- Transitions de page avec Framer Motion
- Curseur personnalisé animé

### Performance
- Code splitting automatique
- Lazy loading des composants et images
- Compression Gzip/Brotli
- Cache localStorage pour GitHub API

## 🔐 Sécurité

- ✅ Clés API sécurisées via variables d'environnement
- ✅ Validation des formulaires côté client
- ✅ Protection contre les injections XSS
- ✅ HTTPS obligatoire en production

## ♿ Accessibilité

- Labels ARIA sur tous les éléments interactifs
- Navigation au clavier optimisée
- Contrastes WCAG 2.1 AA
- Support des lecteurs d'écran

## 🌐 SEO

- Meta tags Open Graph et Twitter Card
- Balises sémantiques HTML5
- Sitemap généré automatiquement
- Temps de chargement optimisé

## 📄 License

MIT License - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👤 Auteur

**Christen Dijoux**

- Portfolio: [https://akiyo974.github.io/portfolio/](https://akiyo974.github.io/portfolio/)
- GitHub: [@Akiyo974](https://github.com/Akiyo974)
- LinkedIn: [Christen Dijoux](https://www.linkedin.com/in/christen-dijoux)
- Email: christen.dijoux@gmail.com

## 🙏 Remerciements

- [React](https://reactjs.org/)
- [GSAP](https://greensock.com/gsap/)
- [Three.js](https://threejs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)

---

⭐ N'hésitez pas à laisser une étoile si vous aimez ce projet !
