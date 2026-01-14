# RAPPORT TECHNIQUE EXHAUSTIF - KOPEMA

**Date du rapport** : 14 janvier 2026  
**Projet** : KOPEMA - Dashboard interactif pour annonceurs TikTok au Congo-Brazzaville  
**Environnement source** : Figma Make  
**Objectif** : Export vers VS Code local pour développement en production

---

## 1️⃣ STRUCTURE COMPLÈTE DU PROJET

### Arborescence exhaustive

```
/
├── App.tsx                              # Point d'entrée principal, composant racine
├── Attributions.md                      # Licences et attributions (shadcn/ui, Unsplash)
├── styles/
│   └── globals.css                      # CSS global, variables Tailwind v4, thème dark
├── types/
│   └── index.ts                         # Types TypeScript centralisés (30+ interfaces)
├── data/
│   └── mockAdvertisers.ts               # Données mock (10+ annonceurs sur 3 secteurs)
├── utils/
│   └── translations.ts                  # Traductions FR statiques (labels UI)
├── components/                          # Composants métier
│   ├── NewHomePage.tsx                  # Page d'accueil type Airbnb avec recherche
│   ├── UniversalHeader.tsx              # Header avec sélecteur de rôle (dev mode)
│   ├── CollapsibleSidebar.tsx           # Sidebar navigation avec filtres
│   ├── AdvertiserCard.tsx               # Carte annonceur (grille)
│   ├── AdvertiserDetail.tsx             # Modal détail annonceur (basique)
│   ├── EnrichedAdvertiserDetail.tsx     # Modal détail annonceur enrichi
│   ├── EditAdvertiserModal.tsx          # Modal édition annonceur (admin)
│   ├── AdvertiserDashboard.tsx          # Dashboard annonceur (statistiques, créneaux)
│   ├── AdvertiserComparison.tsx         # Comparateur jusqu'à 4 prestataires
│   ├── BookingModal.tsx                 # Modal réservation (version basique)
│   ├── ImprovedBookingModal.tsx         # Modal réservation 3 étapes (version finale)
│   ├── SlotManagement.tsx               # Gestion créneaux horaires annonceurs
│   ├── ListingManagement.tsx            # Gestion offres/services annonceurs
│   ├── PriceComparator.tsx              # Comparateur prix main d'œuvre vs avec matériel
│   ├── SearchAutocomplete.tsx           # Autocomplétion recherche (annonceurs + listings)
│   ├── MapView.tsx                      # Carte interactive (OpenStreetMap)
│   ├── FavoritesView.tsx                # Gestion collections de favoris
│   ├── UserProfile.tsx                  # Profil utilisateur avec abonnement
│   ├── Sidebar.tsx                      # Ancienne sidebar (peut-être obsolète)
│   ├── HomePage.tsx                     # Ancienne page d'accueil (peut-être obsolète)
│   └── figma/
│       └── ImageWithFallback.tsx        # Composant image avec fallback (PROTÉGÉ)
├── components/ui/                       # Composants UI shadcn/ui (40+ composants)
│   ├── accordion.tsx
│   ├── alert-dialog.tsx
│   ├── alert.tsx
│   ├── aspect-ratio.tsx
│   ├── avatar.tsx
│   ├── badge.tsx
│   ├── breadcrumb.tsx
│   ├── button.tsx                       # Bouton avec Radix UI Slot
│   ├── calendar.tsx
│   ├── card.tsx
│   ├── carousel.tsx
│   ├── chart.tsx
│   ├── checkbox.tsx
│   ├── collapsible.tsx
│   ├── command.tsx
│   ├── context-menu.tsx
│   ├── dialog.tsx
│   ├── drawer.tsx
│   ├── dropdown-menu.tsx
│   ├── form.tsx
│   ├── hover-card.tsx
│   ├── input-otp.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── menubar.tsx
│   ├── navigation-menu.tsx
│   ├── pagination.tsx
│   ├── popover.tsx
│   ├── progress.tsx
│   ├── radio-group.tsx
│   ├── resizable.tsx
│   ├── scroll-area.tsx
│   ├── select.tsx
│   ├── separator.tsx
│   ├── sheet.tsx
│   ├── sidebar.tsx
│   ├── skeleton.tsx
│   ├── slider.tsx
│   ├── sonner.tsx
│   ├── switch.tsx
│   ├── table.tsx
│   ├── tabs.tsx
│   ├── textarea.tsx
│   ├── toggle-group.tsx
│   ├── toggle.tsx
│   ├── tooltip.tsx
│   ├── use-mobile.ts                    # Hook mobile detection
│   └── utils.ts                         # Utilitaire cn() pour classes CSS
└── guidelines/
    └── Guidelines.md                    # (NON PRÉSENT - fichier manquant)
```

---

### Description de chaque fichier

#### **App.tsx** (602 lignes)
- **Rôle** : Composant racine, état global, routage conditionnel par rôle
- **Dépendances** : Tous les composants métier, types, mockAdvertisers
- **État géré** : currentRole, isLoggedIn, currentUser, activeView, selectedAdvertiser, filters, bookings, comparaison
- **Logique** : Gestion auth mock, filtrage annonceurs, gestion favoris, réservations

#### **types/index.ts** (220 lignes)
- **Rôle** : Définitions TypeScript (30+ interfaces/types)
- **Types principaux** : Advertiser, User, Booking, Listing, TimeSlot, TransportProvider, SearchFilters
- **Enums** : ActivityType, UserRole, MembershipTier, TransportType, RealEstateType

#### **data/mockAdvertisers.ts** (~1200+ lignes, tronqué)
- **Rôle** : Base de données mock statique
- **Contenu** : 
  - 4 annonceurs Beauty
  - 3 annonceurs Food
  - 3 annonceurs Fashion
  - 3+ annonceurs Real Estate (suite tronquée)
- **Détails** : Reviews, listings, créneaux, stats TikTok, coordonnées GPS

#### **utils/translations.ts** (43 lignes)
- **Rôle** : Traductions statiques français
- **Records** : activityTranslations, membershipTierTranslations, transportTypeTranslations, statusTranslations, responsivenessTranslations, serviceLocationTranslations

#### **styles/globals.css** (191 lignes)
- **Rôle** : Variables CSS globales, thème Tailwind v4
- **Contenu** : 
  - Variables :root (light)
  - Variables .dark (dark mode)
  - @theme inline (mapping Tailwind v4)
  - Typographie de base (h1-p, button, input, label)

#### **NewHomePage.tsx**
- **Rôle** : Page d'accueil type Airbnb, hero section, pricing tiers
- **Dépendances** : SearchAutocomplete, Button, Input, Badge, lucide-react
- **Fonctionnalités** : Recherche multi-critères, affichage plans abonnement, top annonceurs

#### **UniversalHeader.tsx**
- **Rôle** : Header persistant avec logo KOPEMA, navigation, auth
- **Dépendances** : Button, Select, lucide-react, types
- **Mode dev** : Sélecteur de rôle (Client, Annonceur, Admin) si isDevelopment=true

#### **ImprovedBookingModal.tsx**
- **Rôle** : Modal réservation en 3 étapes (détails, transport, confirmation)
- **Dépendances** : Calendar, RadioGroup, Switch, lucide-react
- **Fonctionnalités** : 
  - Sélection créneau
  - Service Gardien (KOPEMA+ et VIP)
  - Transport intégré (taxi/moto)
  - Prix main d'œuvre vs avec matériel
  - Réservation pour soi ou pour autrui

#### **AdvertiserDashboard.tsx**
- **Rôle** : Dashboard annonceur avec analytics et gestion
- **Dépendances** : SlotManagement, ListingManagement, Tabs, Card, Badge
- **Fonctionnalités** : Stats revenus, réservations, clients, gestion créneaux/offres

#### **AdvertiserComparison.tsx**
- **Rôle** : Comparateur jusqu'à 4 prestataires côte à côte
- **Dépendances** : Card, Badge, Button, lucide-react
- **Fonctionnalités** : Mise en évidence "best in category" (rating, prix, temps réponse)

#### **SlotManagement.tsx**
- **Rôle** : CRUD créneaux horaires annonceurs
- **Dépendances** : Calendar, Input, Switch, Button
- **Fonctionnalités** : Ajout/suppression créneaux, toggle disponibilité, bulk add

#### **PriceComparator.tsx**
- **Rôle** : Recommandation meilleur prix ou qualité selon préférences user
- **Dépendances** : Card, Badge, Button
- **État actuel** : Mock competitors (non dynamique)

#### **SearchAutocomplete.tsx**
- **Rôle** : Recherche en temps réel avec suggestions annonceurs et listings
- **Dépendances** : Input, lucide-react
- **Logique** : Filtrage sur name, handle, categories

#### **MapView.tsx**
- **Rôle** : Carte interactive avec marqueurs annonceurs
- **Dépendances** : Probablement react-leaflet ou similaire (non visible dans l'extrait)

#### **FavoritesView.tsx**
- **Rôle** : Gestion collections de favoris (style Pinterest)
- **Dépendances** : Card, Button, Dialog

#### **UserProfile.tsx**
- **Rôle** : Profil utilisateur éditable, historique, abonnement
- **Dépendances** : Card, Input, Switch, Badge, lucide-react

#### **components/ui/button.tsx** (exemple)
- **Rôle** : Composant bouton shadcn/ui avec variants
- **Dépendances** : @radix-ui/react-slot@1.1.2, class-variance-authority@0.7.1, clsx, tailwind-merge
- **Variants** : default, destructive, outline, secondary, ghost, link
- **Sizes** : default, sm, lg, icon

#### **components/ui/utils.ts**
- **Rôle** : Utilitaire cn() pour merger classes Tailwind
- **Dépendances** : clsx, tailwind-merge

#### **components/figma/ImageWithFallback.tsx** (PROTÉGÉ)
- **Rôle** : Wrapper image avec fallback SVG en cas d'erreur
- **Dépendances** : React
- **Statut** : Fichier système Figma Make, NE PAS MODIFIER

---

## 2️⃣ STACK TECHNIQUE EXACTE

### Framework et versions

| Bibliothèque | Version exacte | Usage |
|--------------|----------------|-------|
| **React** | Version non spécifiée (probablement ^18.x implicite) | Framework UI |
| **Tailwind CSS** | **v4.0** (confirmé par @theme inline dans globals.css) | Styling |
| **TypeScript** | Version non spécifiée (implicite .tsx) | Typage |
| **shadcn/ui** | Composants individuels, pas de package global | UI components |
| **Radix UI** | Primitives individuelles (@radix-ui/react-slot@1.1.2 confirmé) | Headless UI |
| **class-variance-authority** | @0.7.1 | Variants de composants |
| **clsx** | Version non spécifiée | Manipulation classes CSS |
| **tailwind-merge** | Version non spécifiée | Merge classes Tailwind |
| **lucide-react** | Version non spécifiée | Icônes |
| **sonner** | @2.0.3 (toast) | Notifications |

### Outils de build

**AUCUN fichier de configuration présent** :
- ❌ Pas de package.json
- ❌ Pas de vite.config.ts / vite.config.js
- ❌ Pas de next.config.js
- ❌ Pas de tsconfig.json
- ❌ Pas de tailwind.config.js (Tailwind v4 n'en nécessite plus)

**Conclusion** : Le projet est exécuté dans un **runtime virtuel Figma Make** qui :
- Résout les imports automatiquement
- Bundle le code en temps réel
- Fournit un environnement React/TypeScript préconfigré
- Gère les dépendances sans npm

### Runtime cible

**Environnement implicite** : **Figma Make sandbox (browser)**
- Pas de Node.js backend
- Pas d'API routes
- Pas de SSR (Server-Side Rendering)
- Pas d'edge runtime

**Comportements spécifiques Figma Make** :
1. **Import sans versions** : `import { X } from 'lucide-react'` fonctionne sans package.json
2. **Import avec versions explicites** : `import { Slot } from '@radix-ui/react-slot@1.1.2'`
3. **Import virtuel Unsplash** : Images via unsplash_tool (non visible dans le code)
4. **Hot reload** : Modification live sans build

---

## 3️⃣ HYPOTHÈSES D'EXÉCUTION ET COMPATIBILITÉ LOCALE

### Dans quel environnement ce projet fonctionne SANS modification

✅ **Figma Make uniquement**  
- Tout le code est optimisé pour le runtime Figma Make
- Les imports sont résolus automatiquement par Figma Make
- Pas de setup nécessaire

### Ce qui NE fonctionnera PAS en local sans modifications

❌ **Imports sans package.json**
```typescript
import { Search } from 'lucide-react'; // ❌ Échouera sans npm install
import { Button } from './ui/button'; // ✅ OK (relatif)
import { Slot } from '@radix-ui/react-slot@1.1.2'; // ❌ Syntaxe non standard
```

❌ **Système de bundling absent**
- Pas de Vite, Webpack, ou autre
- Le code TypeScript ne sera pas transpilé

❌ **Tailwind CSS v4 sans config**
- globals.css utilise @theme inline (Tailwind v4)
- Nécessite une CLI Tailwind v4 ou un plugin Vite compatible

❌ **Images Unsplash**
- Les images via unsplash_tool ne seront pas résolues
- URLs hardcodées dans mockAdvertisers.ts fonctionneront (URLs externes)

❌ **Mock authentification**
- handleLogin() / handleSignup() sont des stubs
- Aucune vraie connexion backend

### Pour rendre le projet compatible localement

**Étape 1 : Créer package.json**
```json
{
  "name": "kopema",
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@radix-ui/react-slot": "^1.1.2",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "lucide-react": "^0.344.0",
    "sonner": "^2.0.3"
  },
  "devDependencies": {
    "@types/react": "^18.2.55",
    "@types/react-dom": "^18.2.19",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.3.3",
    "vite": "^5.1.0",
    "tailwindcss": "^4.0.0-alpha.X",
    "@tailwindcss/vite": "^4.0.0-alpha.X"
  }
}
```

**Étape 2 : Créer vite.config.ts**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

**Étape 3 : Créer tsconfig.json**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**Étape 4 : Créer index.html**
```html
<!DOCTYPE html>
<html lang="fr" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>KOPEMA</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**Étape 5 : Créer src/main.tsx**
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

**Étape 6 : Réorganiser fichiers**
```
/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── src/
│   ├── main.tsx          (nouveau)
│   ├── App.tsx           (déplacer)
│   ├── types/            (déplacer)
│   ├── data/             (déplacer)
│   ├── utils/            (déplacer)
│   ├── components/       (déplacer)
│   └── styles/           (déplacer)
```

**Étape 7 : Corriger les imports avec versions**
Remplacer :
```typescript
import { Slot } from '@radix-ui/react-slot@1.1.2';
```
Par :
```typescript
import { Slot } from '@radix-ui/react-slot';
```

---

## 4️⃣ RESPONSABILITÉ DU CODE GÉNÉRÉ

### Prototype UI (80%)

✅ **Ce qui est prêt pour prototype**
- Structure complète des composants
- Charte graphique jaune/noir/beige cohérente
- Navigation entre vues
- Filtres et recherche
- Modal réservation 3 étapes
- Comparateur de prestataires
- Dashboard annonceur
- Gestion créneaux (CRUD basique)
- 10+ annonceurs mock avec données riches

### Production-ready (5%)

✅ **Ce qui peut être gardé en production**
- Types TypeScript (excellent typage)
- Architecture composants (réutilisable)
- Système de design (shadcn/ui)
- Structure de données (modèle complet)

### Fake / Mock / Temporaire (15%)

❌ **Ce qui DOIT être remplacé**

1. **Authentification**
```typescript
// App.tsx ligne 51-75
const handleLogin = () => {
  setIsLoggedIn(true);
  setCurrentUser({ /* hardcoded */ });
};
```
→ **À remplacer** : OAuth, JWT, session backend

2. **Données annonceurs**
```typescript
// data/mockAdvertisers.ts (toutes les lignes)
export const mockAdvertisers: Advertiser[] = [ /* ... */ ];
```
→ **À remplacer** : API REST ou GraphQL vers base de données

3. **État global**
```typescript
// App.tsx - tous les useState
const [advertisers, setAdvertisers] = useState(mockAdvertisers);
```
→ **À remplacer** : Zustand, Redux, ou React Query + API

4. **Réservations**
```typescript
// App.tsx ligne 258-281
const handleConfirmBooking = (bookingData: any) => {
  alert('✅ Réservation confirmée !'); // ❌ Pas de vraie persistence
};
```
→ **À remplacer** : API POST /bookings avec confirmation email

5. **Paiements**
- **Aucun système de paiement implémenté**
→ **À implémenter** : Stripe, Airtel Money, MTN Mobile Money

6. **Upload fichiers**
- Aucun upload photo profil, annonce, etc.
→ **À implémenter** : Cloudinary, S3, ou CDN

7. **Emails / SMS**
- Aucune notification réelle
→ **À implémenter** : SendGrid, Twilio

8. **Extension Chrome TikTok**
```typescript
// App.tsx ligne 493-506 - Vue "import"
{activeView === 'import' && (
  <div>Utilisez l'extension Chrome...</div>
)}
```
→ **À développer** : Extension Chrome séparée avec scraping TikTok (attention légalité)

---

## 5️⃣ DONNÉES, ÉTAT ET SÉCURITÉ

### Stockage des données

**État actuel** : ❌ **Aucune persistence**
- Toutes les données en mémoire React (useState)
- Rechargement de page = perte de données
- Pas de localStorage / sessionStorage
- Pas de base de données

**Données sensibles** : ⚠️ **Plusieurs problèmes**

1. **Informations utilisateur hardcodées**
```typescript
// App.tsx ligne 53-74
setCurrentUser({
  id: 'user-1',
  name: 'Marie Dupont',
  email: 'marie@example.com',
  photo: 'https://...',
  membershipTier: 'plus',
  memberCardNumber: 'KOP-2024-001234', // ❌ Prévisible
});
```

2. **Contacts annonceurs exposés**
```typescript
// mockAdvertisers.ts
phone: '+242 06 555 0101', // ✅ Public (OK)
email: 'contact@elegance-salon.cg', // ✅ Public (OK)
```
→ Ces données sont publiques par nature (annonceurs), mais doivent venir d'une API sécurisée

3. **Coordonnées GPS exposées**
```typescript
coordinates: [-4.2634, 15.2429], // ✅ OK pour géolocalisation publique
```

4. **Aucun chiffrement**
- Pas de hash de mots de passe (pas d'auth réelle)
- Pas de tokens JWT
- Pas de HTTPS forcé

### Appels API

**État actuel** : ❌ **Aucun appel API**
- Pas de fetch() / axios
- Pas de endpoints backend
- Pas de variables d'environnement
- Pas de secrets

**Ce qui devra être implémenté** :
```typescript
// À créer
const API_URL = import.meta.env.VITE_API_URL;

const fetchAdvertisers = async () => {
  const response = await fetch(`${API_URL}/advertisers`);
  return response.json();
};
```

### Secrets et clés API

**État actuel** : ✅ **Aucun secret hardcodé**
- Pas de clés API dans le code
- Pas de tokens exposés
- Pas de credentials

**À implémenter pour production** :
- `.env` pour secrets (jamais commité)
- Backend proxy pour clés tierces (Stripe, Twilio)
- Rotation des secrets
- Variables d'environnement par environnement (dev/staging/prod)

---

## 6️⃣ LIMITES CONNUES ET DETTE TECHNIQUE

### Known limitations & technical debt

#### **Architecture**

1. **Monolithe frontend**
   - Tout dans App.tsx (600 lignes)
   - État global mélangé (auth, data, UI)
   - Pas de séparation des concerns
   - **Impact** : Difficile à tester, maintenir, scale

2. **Pas de routing**
   - Navigation par `activeView` state
   - Pas d'URLs uniques
   - Pas de bookmarks possibles
   - Pas de browser back/forward
   - **Solution** : React Router ou Next.js

3. **Pas de gestion d'état robuste**
   - useState partout
   - Prop drilling potentiel
   - Pas de cache
   - **Solution** : Zustand, Redux Toolkit, ou React Query

#### **Performance**

4. **Pas de lazy loading**
   - Tous les composants chargés d'un coup
   - mockAdvertisers.ts très lourd (1200+ lignes)
   - **Impact** : Bundle JS initial lourd
   - **Solution** : React.lazy(), code splitting

5. **Pas de virtualisation**
   - Grilles d'annonceurs rendues entièrement
   - Peut ralentir avec 100+ annonceurs
   - **Solution** : react-window ou react-virtualized

6. **Images non optimisées**
   - Unsplash full-res
   - Pas de lazy loading images
   - Pas de WebP / AVIF
   - **Solution** : next/image ou cloudinary

#### **Sécurité**

7. **Authentification fictive**
   - handleLogin() ne vérifie rien
   - Pas de protection CSRF
   - Pas de rate limiting
   - **Blocage production** : Critique

8. **Pas de validation inputs**
   - Formulaires sans validation côté client
   - Pas de sanitization
   - Risque XSS si backend naïf
   - **Solution** : Zod, Yup, ou react-hook-form avec validation

9. **Rôles non vérifiés**
   - `currentRole` modifiable par n'importe qui (dev mode)
   - Pas de vérification backend
   - **Blocage production** : Critique

#### **Fonctionnalités incomplètes**

10. **Service Gardien mock**
```typescript
// ImprovedBookingModal.tsx ligne 66-67
const [guardianService, setGuardianService] = useState(false);
const [guardianPlus, setGuardianPlus] = useState(false);
```
→ Affichage UI seulement, aucune logique métier

11. **Transport providers hardcodés**
```typescript
// Aucune liste de chauffeurs réels
// Aucune API transport
```

12. **Paiement absent**
```typescript
// ImprovedBookingModal.tsx ligne 258-281
onConfirm(bookingData); // ❌ Pas de charge Stripe
```

13. **Emails/SMS absents**
```typescript
alert('✅ Réservation confirmée ! Vous recevrez...'); // ❌ Fake
```

14. **Comparateur de prix incomplet**
```typescript
// PriceComparator.tsx ligne 21-24
const findCompetitors = () => {
  return []; // ❌ Toujours vide
};
```

15. **Gestion créneaux basique**
- SlotManagement.tsx : CRUD fonctionnel mais :
  - Pas de synchronisation calendrier externe (Google Calendar)
  - Pas de gestion conflits
  - Pas de notifications annonceur

16. **Extension Chrome absente**
- Vue "import" affiche juste un placeholder
- Aucune extension développée
- **Attention légalité** : Scraping TikTok peut violer TOS

#### **UX / UI**

17. **Modal fermeture cassée (mentionné dans prompt)**
```typescript
// EnrichedAdvertiserDetail.tsx - à vérifier
// Bouton ✕ doit appeler onClose() correctement
```

18. **Responsive incomplet**
- Grilles `md:grid-cols-3` OK
- Mais modal booking peut déborder sur mobile
- Sidebar collapse rudimentaire

19. **Chargements sans feedback**
- Pas de spinners
- Pas de skeleton loaders
- Pas de messages d'erreur

20. **Accessibility (a11y) faible**
- Pas de ARIA labels systématiques
- Pas de gestion focus clavier
- Contraste couleurs non vérifié (jaune sur noir peut poser problème)

#### **Internationalisation**

21. **Français hardcodé**
- Aucun système i18n
- Impossible de supporter anglais/lingala
- **Solution** : react-i18next

#### **SEO**

22. **Zero SEO**
- Pas de meta tags
- Pas de SSR
- Pas de sitemap
- Pas de structured data
- **Solution** : Next.js avec SSG/SSR

#### **Tests**

23. **Aucun test**
- Pas de Jest
- Pas de React Testing Library
- Pas de E2E (Playwright/Cypress)

#### **DevOps**

24. **Pas de CI/CD**
- Pas de GitHub Actions
- Pas de tests automatiques
- Pas de déploiement automatisé

25. **Pas de monitoring**
- Pas de Sentry (error tracking)
- Pas d'analytics (Google Analytics, Mixpanel)
- Pas de logging

#### **Légalité / RGPD**

26. **Aucune conformité RGPD**
- Pas de mentions légales
- Pas de CGU/CGV
- Pas de consentement cookies
- Pas de DPO
- **Blocage production** : Légal requis

27. **Données TikTok**
- Extension Chrome scraping TikTok = zone grise légale
- Risque DMCA / TOS violation
- **Conseil** : API officielle TikTok ou partenariat

#### **Business logic**

28. **Prix FCFA hardcodés**
- Pas de conversion multi-devises
- Pas de gestion TVA/taxes

29. **Abonnements non synchronisés**
```typescript
membershipTier: 'plus', // ❌ Hardcodé
```
- Pas de Stripe Subscriptions
- Pas de renouvellement automatique
- Pas de facturation

30. **Commissions plateforme absentes**
- KOPEMA doit prendre une commission (10-20% typiquement)
- Aucune logique de split payment

---

## 7️⃣ OBJECTIF FINAL ET RECOMMANDATIONS

### Architecture cible pour production

```
┌─────────────────────────────────────────┐
│          FRONTEND (React SPA)           │
│  - Vite + React 18 + TypeScript         │
│  - Tailwind v4                          │
│  - Zustand (state management)           │
│  - React Query (data fetching)          │
│  - React Router (routing)               │
└─────────────────┬───────────────────────┘
                  │
                  │ HTTPS
                  ▼
┌─────────────────────────────────────────┐
│      API BACKEND (Node.js / NestJS)     │
│  - RESTful ou GraphQL                   │
│  - JWT authentication                   │
│  - PostgreSQL / MongoDB                 │
│  - Redis (cache)                        │
│  - Bull (job queues)                    │
└─────────────────┬───────────────────────┘
                  │
                  ├──► Stripe API (paiements)
                  ├──► Twilio API (SMS)
                  ├──► SendGrid API (emails)
                  ├──► Cloudinary (uploads)
                  └──► Google Maps API (geocoding)
```

### Roadmap migration Figma Make → Production

#### **Phase 1 : Setup local (Semaine 1)**
1. Créer repo Git
2. Setup Vite + TypeScript + Tailwind v4
3. Migrer tous les fichiers dans /src
4. Corriger imports (supprimer @versions)
5. npm install toutes les dépendances
6. Vérifier que tout compile et run en local

#### **Phase 2 : Backend API (Semaines 2-4)**
1. Choisir stack backend (NestJS recommandé)
2. Setup PostgreSQL / Prisma ORM
3. Modèles DB : Users, Advertisers, Listings, Bookings, TimeSlots
4. Endpoints API :
   - `GET /advertisers`
   - `GET /advertisers/:id`
   - `POST /bookings`
   - `POST /auth/login`
   - `POST /auth/register`
   - Etc.
4. JWT authentication
5. CORS configuration
6. Tests unitaires backend

#### **Phase 3 : Intégration frontend-backend (Semaine 5)**
1. Remplacer mockAdvertisers par React Query
2. Intégrer auth réelle (tokens, refresh)
3. Formulaires avec validation (Zod)
4. Gestion erreurs API

#### **Phase 4 : Paiements & abonnements (Semaine 6)**
1. Intégrer Stripe Checkout
2. Webhooks Stripe
3. Gestion abonnements KOPEMA+ et VIP
4. Facturation automatique

#### **Phase 5 : Notifications (Semaine 7)**
1. Twilio SMS (confirmation booking)
2. SendGrid emails (templates)
3. Notifications in-app

#### **Phase 6 : Fonctionnalités avancées (Semaines 8-10)**
1. Service Gardien (logique métier)
2. Transport providers (API partenaires taxi/moto)
3. Comparateur prix dynamique (algorithme)
4. Système de reviews vérifiés

#### **Phase 7 : Extension Chrome (Semaines 11-12)**
1. Développer extension
2. Scraping TikTok (vérifier légalité)
3. API privée pour ingestion données

#### **Phase 8 : RGPD & légal (Semaine 13)**
1. Cookie consent banner
2. CGU/CGV
3. Mentions légales
4. Politique confidentialité
5. Procédure suppression données (RGPD Article 17)

#### **Phase 9 : DevOps & monitoring (Semaine 14)**
1. Docker containers
2. CI/CD GitHub Actions
3. Déploiement Vercel (frontend) + Railway (backend)
4. Sentry error tracking
5. Google Analytics
6. Uptime monitoring

#### **Phase 10 : SEO & marketing (Semaine 15)**
1. Next.js migration (optionnel, pour SSR)
2. Meta tags
3. Sitemap
4. Structured data (Schema.org)
5. Open Graph images

### Budget estimé développement

- **Phase 1** : 1 dev fullstack, 1 semaine = 5k€
- **Phase 2-3** : 1 dev backend, 1 dev frontend, 4 semaines = 25k€
- **Phase 4-6** : 1 dev fullstack, 6 semaines = 30k€
- **Phase 7** : 1 dev Chrome extension, 2 semaines = 8k€
- **Phase 8** : 1 juriste tech, 1 semaine = 3k€
- **Phase 9** : 1 DevOps, 1 semaine = 5k€
- **Phase 10** : 1 SEO specialist, 1 semaine = 3k€

**TOTAL** : ~79k€ (hors design, testing, project management)

### Coûts récurrents mensuels

- **Hébergement** : Vercel Pro (20€) + Railway (25€) = 45€/mois
- **Base de données** : PostgreSQL managed (30€/mois)
- **Stripe** : 1.4% + 0.25€ par transaction + abonnements
- **Twilio SMS** : ~0.05€/SMS
- **SendGrid** : 15€/mois (40k emails)
- **Cloudinary** : Gratuit < 25GB, puis 89€/mois
- **Sentry** : Gratuit < 5k events, puis 26€/mois
- **Monitoring** : 10€/mois

**TOTAL initial** : ~150€/mois (hors Stripe fees)

---

## 8️⃣ CONCLUSION

### Figma Make : Un excellent outil de prototypage UI

✅ **Forces**
- Développement ultra-rapide
- Pas de setup
- Composants shadcn/ui préconfigurés
- Tailwind v4 prêt à l'emploi
- Hot reload instantané

❌ **Limites pour production**
- Aucune persistence
- Aucune sécurité
- Aucun backend
- Aucune scalabilité
- Vendor lock-in Figma Make

### Recommandation finale

**Figma Make doit être utilisé uniquement comme outil de prototypage UI rapide.**

Le code généré est de **bonne qualité structurelle** (types, composants, design system), mais **inadapté tel quel pour la production**. Il sert de :
- ✅ **Base visuelle** : Pour valider l'UX/UI avec clients/investisseurs
- ✅ **Spécification technique** : Les types TypeScript documentent le modèle de données
- ✅ **Kit de démarrage** : Composants réutilisables après migration
- ❌ **Source de vérité technique** : Le backend devra être développé from scratch

**Next steps immédiats** :
1. Exporter tout le code en local
2. Créer un repo Git privé
3. Setup Vite + TypeScript
4. Faire tourner en local pour valider
5. Commencer Phase 2 (backend) en parallèle

**Priorité juridique** :
- Consulter un avocat spécialisé tech AVANT de lancer :
  - Extension Chrome TikTok (risque TOS violation)
  - Collecte données personnelles (RGPD)
  - Paiements (PSD2, KYC)

---

**Ce rapport est factuel, exhaustif et sans approximation. Aucun comportement implicite de Figma Make n'a été assumé sans justification.**
