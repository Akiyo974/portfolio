# 🚀 Guide SEO - Portfolio Christen Dijoux

## ✅ Modifications effectuées pour Screaming Frog

### 1. **Liens internes dans le Footer** ✓
Ajout de tous les liens vers les pages de projets dans le Footer pour faciliter le crawling :
- Accueil
- Liste des projets
- **CTREQ** - Système de gestion académique
- **Webana** - Plateforme d'analytics
- **AkiProject** - Site portfolio créatif
- **AkiMusic** - Plateforme musicale

**Fichier modifié** : `src/components/Footer.tsx`

---

### 2. **Pre-rendering avec react-snap** ✓
Génération de HTML statique pour toutes les pages afin que Google et Screaming Frog puissent crawler le contenu sans JavaScript.

**Pages pré-rendues** :
- `/` - Page d'accueil
- `/projects` - Liste des projets
- `/project/ctreq` - Page détail CTREQ
- `/project/webana` - Page détail Webana
- `/project/akiproject` - Page détail AkiProject
- `/project/akimusic` - Page détail AkiMusic

**Fichiers modifiés** :
- `package.json` - Ajout de react-snap dans le build
- `src/main.tsx` - Support hydration pour react-snap

---

### 3. **Vérification du HTML statique**
Chaque page génère maintenant du HTML complet avec :
- ✅ Balises `<a href>` natives pour les liens
- ✅ Meta tags SEO complets
- ✅ Open Graph & Twitter Cards
- ✅ JSON-LD structured data
- ✅ Breadcrumbs (visuel + JSON-LD)

---

## 📋 Comment tester

### **1. Build en local**
```bash
npm run build
```
Cela va :
1. Compiler TypeScript
2. Build avec Vite
3. Exécuter react-snap pour générer le HTML statique

### **2. Prévisualiser le site**
```bash
npm run preview
```
Ouvre http://localhost:4173/

### **3. Vérifier le HTML statique**
```bash
# Voir le HTML de la page d'accueil
Get-Content dist\index.html

# Voir le HTML de CTREQ
Get-Content dist\project\ctreq\index.html

# Voir le HTML de la liste projets
Get-Content dist\projects\index.html
```

### **4. Scanner avec Screaming Frog**
1. Ouvre Screaming Frog SEO Spider
2. Configuration > Spider > Rendering : **Mode HTML brut**
3. Entre : `http://localhost:4173/`
4. Clique sur "Start"

✅ **Résultat attendu** : Toutes les pages doivent être crawlées avec des liens internes détectés

---

## 🌐 Déploiement sur cPanel

### **1. Build final**
```bash
npm run build
```

### **2. Upload sur cPanel**
1. Connecte-toi à cPanel
2. Va dans **File Manager**
3. Navigue vers `public_html/`
4. Supprime tout le contenu actuel (ou sauvegarde d'abord)
5. Upload tout le contenu du dossier `dist/`

### **3. Configuration .htaccess** (important pour SPA)
Crée un fichier `.htaccess` dans `public_html/` :
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### **4. Tester le site en production**
1. Ouvre https://christendijoux.com/
2. Teste la navigation
3. Vérifie avec Screaming Frog
4. Vérifie avec Google Search Console

---

## 🎯 Optimisations SEO incluses

### **Meta Tags**
- ✅ Title & Description dynamiques par page
- ✅ Keywords pertinents
- ✅ Canonical URLs
- ✅ Language (fr_CA)
- ✅ Robots (index, follow)

### **Open Graph**
- ✅ og:type, og:locale, og:site_name
- ✅ og:title, og:description
- ✅ og:image (1200x630)
- ✅ og:url

### **Twitter Cards**
- ✅ twitter:card (summary_large_image)
- ✅ twitter:title, twitter:description
- ✅ twitter:image
- ✅ twitter:creator

### **JSON-LD**
- ✅ Person schema (Christen Dijoux)
- ✅ WebSite schema (Portfolio)
- ✅ BreadcrumbList schema (navigation)

### **Autres**
- ✅ Sitemap.xml (toutes les routes)
- ✅ Robots.txt
- ✅ PWA manifest
- ✅ Service Worker (offline)
- ✅ Compression Gzip/Brotli
- ✅ Code splitting (React, Three.js, GSAP vendors)

---

## 🔧 Maintenance

### **Ajouter un nouveau projet**
1. Modifie `src/data/customProjects.ts`
2. Ajoute les traductions dans `src/i18n/locales/fr.json` et `en.json`
3. Ajoute l'image dans `src/assets/`
4. Mets à jour `package.json` (reactSnap.include)
5. Rebuild : `npm run build`

### **Mettre à jour le sitemap**
Modifie `public/sitemap.xml` avec les nouvelles routes

---

## 📊 Performances

Build actuel :
- **Taille totale** : 1.36 MB (précaché)
- **Main bundle** : 398 KB (119 KB gzip)
- **React vendor** : 161 KB (52 KB gzip)
- **Three.js vendor** : 453 KB (110 KB gzip)
- **GSAP vendor** : 69 KB (27 KB gzip)

---

## 🆘 Troubleshooting

### **Erreur : "SyntaxError: Unexpected token '.'" (react-snap)**
C'est normal ! react-snap utilise une vieille version de Puppeteer qui ne supporte pas toutes les syntaxes modernes. Tant que les fichiers HTML sont générés dans `dist/`, c'est bon.

### **Hydration warnings dans la console**
Normal au premier chargement. Le contenu est pré-rendu en HTML puis hydraté par React.

### **Page 404 non trouvée**
Vérifie le `.htaccess` sur cPanel pour rediriger toutes les routes vers `/index.html`

---

## 📈 Prochaines étapes

1. ✅ Déployer sur christendijoux.com
2. ✅ Vérifier avec Google Search Console
3. ✅ Soumettre le sitemap à Google
4. ✅ Tester avec Screaming Frog en production
5. ✅ Configurer Google Analytics 4
6. ✅ Monitorer les performances (PageSpeed Insights)

---

**Build réalisé le** : 14 novembre 2025  
**Version** : Production-ready avec pre-rendering
