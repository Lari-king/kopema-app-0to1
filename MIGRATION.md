# KOPEMA - Guide de migration

**Comment passer de l'ancien code monolithique au nouveau kit UI**

---

## 📋 Changements effectués

### ✅ Nouvelle structure
```
/src
├── screens/              # ✨ NOUVEAU
├── components/           # ✨ NOUVEAU (composants stateless)
├── ui/                   # ✅ Conservé (shadcn/ui)
├── styles/              # ✨ NOUVEAU (Tailwind v3)
├── types/               # ✨ NOUVEAU (types UI uniquement)
└── App.tsx              # ✨ NOUVEAU (démo minimale)
```

### ❌ Ancien code supprimé
- `/App.tsx` (ancien, 600 lignes avec état global)
- `/data/mockAdvertisers.ts` (1200+ lignes de données mock)
- `/types/index.ts` (types métier complexes)
- `/utils/translations.ts` (hardcodé)
- Tous les anciens composants monolithiques

---

## 🔄 Comment utiliser le nouveau code

### Option 1 : Dans Figma Make (actuel)

1. **Les fichiers protégés ne peuvent pas être supprimés**
   - `/App.tsx` (racine)
   - `/styles/globals.css` (racine)

2. **Vous devez manuellement pointer vers le nouveau code** :
   - Copiez le contenu de `/src/App.tsx` vers `/App.tsx`
   - Copiez le contenu de `/src/styles/globals.css` vers `/styles/globals.css`

3. **Le projet fonctionnera dans Figma Make** avec les nouvelles importations.

### Option 2 : Export vers projet local (recommandé)

1. **Exporter tout depuis Figma Make**

2. **Créer nouveau projet Vite**
   ```bash
   npm create vite@latest kopema-ui -- --template react-ts
   cd kopema-ui
   ```

3. **Installer dépendances**
   ```bash
   npm install
   npm install tailwindcss@3 postcss autoprefixer
   npm install @radix-ui/react-slot class-variance-authority clsx tailwind-merge
   npm install lucide-react
   ```

4. **Copier les fichiers**
   ```bash
   # Copier TOUT le contenu de /src vers kopema-ui/src
   cp -r figma-make-export/src/* kopema-ui/src/
   
   # Copier les composants UI
   cp -r figma-make-export/components/ui kopema-ui/src/ui
   ```

5. **Configurer Tailwind**
   ```bash
   npx tailwindcss init -p
   ```
   
   Éditer `tailwind.config.js` :
   ```js
   /** @type {import('tailwindcss').Config} */
   export default {
     content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
     darkMode: 'class',
     theme: {
       extend: {},
     },
     plugins: [],
   }
   ```

6. **Créer index.html**
   ```html
   <!doctype html>
   <html lang="fr" class="dark">
     <head>
       <meta charset="UTF-8" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       <title>KOPEMA - Prototypage UI</title>
     </head>
     <body>
       <div id="root"></div>
       <script type="module" src="/src/main.tsx"></script>
     </body>
   </html>
   ```

7. **Créer src/main.tsx**
   ```tsx
   import React from 'react'
   import ReactDOM from 'react-dom/client'
   import App from './App.tsx'
   import './styles/globals.css'

   ReactDOM.createRoot(document.getElementById('root')!).render(
     <React.StrictMode>
       <App />
     </React.StrictMode>,
   )
   ```

8. **Lancer**
   ```bash
   npm run dev
   ```

---

## 🆕 Changements clés dans les composants

### Avant (ancien)
```typescript
// Composant avec état global et logique métier
function AdvertiserCard({ advertiser, onToggleFavorite, isFavorite }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleFavorite = () => {
    // Logique métier ici
    if (!isLoggedIn) {
      alert('Connexion requise');
      return;
    }
    onToggleFavorite(advertiser.id);
  };
  
  return (/* JSX */);
}
```

### Après (nouveau)
```typescript
// Composant stateless, props uniquement
interface AdvertiserCardProps {
  data: AdvertiserCardData;  // Type UI simple
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export function AdvertiserCard({ data, isFavorite, onToggleFavorite }: AdvertiserCardProps) {
  // Aucun état, aucune logique métier
  // Juste affichage et callbacks
  return (/* JSX */);
}
```

**Différences** :
- ✅ Pas d'état interne (sauf UI locale comme hover)
- ✅ Pas de vérification auth
- ✅ Pas de logique métier
- ✅ Types UI simples (pas de modèles complexes)
- ✅ Callbacks optionnels (permet utilisation sans parent)

---

## 📦 Mapping ancien → nouveau

| Ancien fichier | Nouveau fichier | Notes |
|----------------|-----------------|-------|
| `/App.tsx` (600 lignes) | `/src/App.tsx` (150 lignes) | Démonstration seulement |
| `/components/NewHomePage.tsx` | `/src/screens/HomeScreen.tsx` | Composant stateless |
| `/components/AdvertiserCard.tsx` | `/src/components/AdvertiserCard.tsx` | Props-based |
| `/components/ImprovedBookingModal.tsx` | `/src/components/BookingModal.tsx` | Simplifié, pas de logique métier |
| `/components/UniversalHeader.tsx` | `/src/components/Header.tsx` | Pas de gestion auth réelle |
| `/components/SearchBar.tsx` | `/src/components/SearchBar.tsx` | Nouveau (extrait de HomePage) |
| `/components/PricingCard.tsx` | `/src/components/PricingCard.tsx` | Nouveau |
| `/data/mockAdvertisers.ts` | ❌ Supprimé | Fixtures inline dans App.tsx |
| `/types/index.ts` | `/src/types/ui.ts` | Types UI uniquement |

---

## ⚠️ Points d'attention

### 1. Pas de routage
Le nouveau App.tsx utilise un système basique de "screens" avec state.

**En production**, remplacer par **React Router** :
```typescript
// App.tsx production
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/search" element={<SearchResultsScreen />} />
        <Route path="/advertiser/:id" element={<AdvertiserDetailScreen />} />
        {/* ... */}
      </Routes>
    </BrowserRouter>
  );
}
```

### 2. Pas de state management global
Les données sont stockées dans `useState` local.

**En production**, utiliser **Zustand** ou **Redux** :
```typescript
// stores/useAuthStore.ts
import create from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
```

### 3. Pas de data fetching
Pas d'appels API.

**En production**, utiliser **React Query** :
```typescript
// hooks/useAdvertisers.ts
import { useQuery } from '@tanstack/react-query';

export function useAdvertisers() {
  return useQuery(['advertisers'], async () => {
    const res = await fetch('https://api.kopema.com/advertisers');
    return res.json();
  });
}
```

---

## 🧪 Comment tester le nouveau code

### Test 1 : Affichage de la page d'accueil
1. Lancer l'app
2. Vérifier que HomeScreen s'affiche
3. Vérifier la charte graphique jaune/noir/beige
4. Vérifier que les 3 cartes advertiser factices s'affichent

### Test 2 : Recherche
1. Taper "coiffure" dans la barre de recherche
2. Cliquer sur "Rechercher"
3. Vérifier que SearchResultsScreen s'affiche
4. Vérifier que les résultats s'affichent

### Test 3 : Réservation
1. Cliquer sur "Réserver" sur une carte annonceur
2. Vérifier que BookingModal s'ouvre
3. Remplir les 3 étapes
4. Cliquer sur "Confirmer"
5. Vérifier l'alert "Réservation : À implémenter..."

### Test 4 : Responsive
1. Réduire la fenêtre (mobile)
2. Vérifier que la grille passe à 1 colonne
3. Vérifier que les composants restent lisibles

---

## 📝 TODO avant mise en production

- [ ] Implémenter React Router
- [ ] Implémenter Zustand (state management)
- [ ] Implémenter React Query (data fetching)
- [ ] Connecter à l'API backend (voir IMPLEMENTATION_GUIDE.md)
- [ ] Implémenter auth réelle (JWT)
- [ ] Implémenter paiements (Stripe)
- [ ] Tests unitaires (Jest)
- [ ] Tests E2E (Playwright)
- [ ] SEO (meta tags, sitemap)
- [ ] Analytics (Google Analytics)
- [ ] Monitoring (Sentry)
- [ ] RGPD (mentions légales, cookies)

---

## 🎯 Résultat attendu

Après migration, vous avez :
- ✅ Un kit UI propre et exportable
- ✅ Des composants réutilisables stateless
- ✅ Une architecture claire (/screens, /components)
- ✅ Des types UI séparés de la logique métier
- ✅ Une documentation complète (README + IMPLEMENTATION_GUIDE)
- ✅ Zéro logique backend dans le frontend
- ✅ Prêt pour intégration dans un vrai projet

---

**👉 Next steps : Lire IMPLEMENTATION_GUIDE.md et commencer le développement backend !**
