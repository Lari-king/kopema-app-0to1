# KOPEMA - UI Prototype Kit

**⚠️ CECI EST UN KIT UI UNIQUEMENT - PAS UNE APPLICATION DE PRODUCTION**

Ce projet Figma Make contient **exclusivement** les composants visuels et écrans de KOPEMA. Il ne contient **aucune logique métier, backend, authentification, ou système de paiement**.

---

## 🎯 Objectif

Ce kit UI sert à :
- ✅ Prototyper rapidement l'UX/UI
- ✅ Valider le design auprès des clients/investisseurs
- ✅ Fournir une base visuelle pour le développement frontend
- ❌ **NE PAS** être utilisé tel quel en production

---

## 📁 Structure du projet

```
/src
├── screens/              # Pages complètes (assemblage de composants)
│   ├── HomeScreen.tsx    # Page d'accueil type Airbnb
│   └── SearchResultsScreen.tsx  # Page de résultats de recherche
│
├── components/           # Composants UI réutilisables
│   ├── AdvertiserCard.tsx      # Carte prestataire
│   ├── BookingModal.tsx        # Modal réservation 3 étapes
│   ├── Header.tsx              # Header avec auth
│   ├── PricingCard.tsx         # Carte plan d'abonnement
│   └── SearchBar.tsx           # Barre de recherche
│
├── ui/                   # Composants shadcn/ui (base)
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   └── ... (40+ composants)
│
├── styles/
│   └── globals.css       # Thème Tailwind dark mode jaune/noir/beige
│
├── types/
│   └── ui.ts             # Types TypeScript UI uniquement
│
└── App.tsx               # Point d'entrée minimal (démo)
```

---

## 🔧 Stack technique

| Technologie | Version | Usage |
|-------------|---------|-------|
| React | 18.x | Framework UI |
| TypeScript | 5.x | Typage |
| Tailwind CSS | **v3** | Styling |
| shadcn/ui | Latest | Composants de base |
| Radix UI | Primitives individuelles | Headless components |
| Lucide React | Latest | Icônes |

---

## 🚀 Utilisation

### 1. Dans Figma Make (environnement actuel)

Le projet fonctionne **out-of-the-box** dans Figma Make. Aucun setup nécessaire.

### 2. Export vers un projet local

Pour utiliser ce code dans VS Code / projet professionnel :

1. **Exporter tout le code depuis Figma Make**
2. **Créer un nouveau projet Vite + React + TypeScript**
   ```bash
   npm create vite@latest kopema-frontend -- --template react-ts
   cd kopema-frontend
   ```
3. **Installer les dépendances**
   ```bash
   npm install tailwindcss@3 @tailwindcss/forms
   npm install @radix-ui/react-slot class-variance-authority clsx tailwind-merge
   npm install lucide-react
   ```
4. **Copier les fichiers du projet**
   - Copier `/src/*` vers `kopema-frontend/src/`
5. **Configurer Tailwind**
   ```bash
   npx tailwindcss init -p
   ```
   Puis éditer `tailwind.config.js` :
   ```js
   export default {
     content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
     darkMode: 'class',
     theme: { extend: {} },
     plugins: [],
   }
   ```
6. **Lancer le dev server**
   ```bash
   npm run dev
   ```

---

## ⚠️ Ce qui n'est PAS implémenté (volontairement)

### Authentification
- ❌ Pas de login/signup réels
- ❌ Pas de JWT / OAuth / sessions
- ❌ Pas de gestion de mots de passe

👉 **À implémenter** : Firebase Auth, Supabase Auth, ou backend custom avec bcrypt + JWT

### Backend / API
- ❌ Pas d'appels API
- ❌ Pas de base de données
- ❌ Pas de persistence des données
- ❌ Pas de gestion des créneaux réels
- ❌ Pas de notifications (email/SMS)

👉 **À implémenter** : API REST ou GraphQL (Node.js / NestJS / Python FastAPI)

### Paiements
- ❌ Pas d'intégration Stripe
- ❌ Pas de Mobile Money (Airtel, MTN)
- ❌ Pas de gestion d'abonnements
- ❌ Pas de facturation

👉 **À implémenter** : Stripe Subscriptions + Mobile Money API

### Fonctionnalités métier
- ❌ Pas de système de favoris persistant
- ❌ Pas de comparateur dynamique (algorithme)
- ❌ Pas de service Gardien réel
- ❌ Pas d'intégration transport (taxi/moto)
- ❌ Pas de gestion des créneaux annonceurs
- ❌ Pas d'extension Chrome TikTok

👉 **À implémenter** : Logique métier dans le backend

### Sécurité
- ❌ Pas de protection CSRF
- ❌ Pas de rate limiting
- ❌ Pas de validation backend
- ❌ Pas de sanitization des inputs

👉 **À implémenter** : Middleware de sécurité (Helmet, CORS, etc.)

### Légal / RGPD
- ❌ Pas de mentions légales
- ❌ Pas de CGU/CGV
- ❌ Pas de consentement cookies
- ❌ Pas de gestion RGPD (droit à l'oubli, etc.)

👉 **À implémenter** : Conformité légale complète

---

## 📦 Composants disponibles

### Screens (Pages complètes)

#### `HomeScreen`
- Hero section avec slogan
- Barre de recherche multi-critères
- Stats (500+ prestataires, 98% satisfaction, etc.)
- Section prestataires recommandés
- Plans tarifaires (Gratuit, KOPEMA+, VIP)
- Footer

**Props** :
```typescript
{
  user?: UserProfileData | null;
  featuredAdvertisers?: AdvertiserCardData[];
  onLogin?: () => void;
  onSignup?: () => void;
  onSearch?: (query: string, location: string, serviceType?: ServiceType) => void;
  onSelectPlan?: (tier: MembershipTier) => void;
  onViewAdvertiser?: (id: string) => void;
}
```

#### `SearchResultsScreen`
- Barre de recherche
- Nombre de résultats
- Bouton filtres
- Barre de comparaison (si prestataires sélectionnés)
- Grille de résultats (AdvertiserCard)

**Props** :
```typescript
{
  user?: UserProfileData | null;
  results: AdvertiserCardData[];
  query: string;
  location: string;
  serviceType?: ServiceType;
  onSearch?: (query: string, location: string, serviceType?: ServiceType) => void;
  onViewAdvertiser?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onToggleComparison?: (id: string) => void;
  onQuickBook?: (id: string) => void;
  favoriteIds?: string[];
  comparisonIds?: string[];
}
```

### Components (Réutilisables)

#### `Header`
Header sticky avec logo KOPEMA, navigation, boutons auth/profil

**Props** :
```typescript
{
  user?: UserProfileData | null;
  onLoginClick?: () => void;
  onSignupClick?: () => void;
  onProfileClick?: () => void;
  onLogoClick?: () => void;
}
```

#### `SearchBar`
Recherche avec champs "Quoi", "Où", filtres par type de service

**Props** :
```typescript
{
  query: string;
  location: string;
  serviceType?: ServiceType;
  onQueryChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onServiceTypeChange: (value: ServiceType | undefined) => void;
  onSearch: () => void;
  onFilterClick?: () => void;
}
```

#### `AdvertiserCard`
Carte prestataire avec image, note, prix, district, tags, boutons favori/comparaison/réserver

**Props** :
```typescript
{
  data: AdvertiserCardData;
  isFavorite?: boolean;
  isInComparison?: boolean;
  onViewDetails?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onToggleComparison?: (id: string) => void;
  onQuickBook?: (id: string) => void;
}
```

#### `BookingModal`
Modal de réservation en 3 étapes :
1. Date, heure, lieu de prestation
2. Transport (taxi/moto), Service Gardien (KOPEMA+ et VIP)
3. Récapitulatif et confirmation

**Props** :
```typescript
{
  serviceName: string;
  providerName: string;
  basePrice: number;
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: BookingFormData) => void;
  userMembershipTier?: 'free' | 'plus' | 'vip';
}
```

#### `PricingCard`
Carte plan d'abonnement avec features, prix, CTA

**Props** :
```typescript
{
  tier: MembershipTier;
  price: string;
  features: string[];
  isPopular?: boolean;
  isCurrentPlan?: boolean;
  onSelectPlan?: (tier: MembershipTier) => void;
}
```

---

## 🎨 Charte graphique

### Couleurs principales

| Couleur | Code | Usage |
|---------|------|-------|
| Noir pur | `#000000` | Background principal |
| Jaune KOPEMA | `#FACC15` (yellow-400) | Primary, CTA, accents |
| Zinc-900 | `#18181B` | Cards, modals |
| Zinc-800 | `#27272A` | Inputs, borders |
| Zinc-400 | `#A1A1AA` | Texte secondaire |
| Blanc | `#FFFFFF` | Texte principal |

### Thème Dark Mode

Le projet utilise **exclusivement le dark mode** avec :
- Background noir (`bg-black`)
- Cards zinc-900 avec bordures jaunes semi-transparentes (`border-yellow-400/20`)
- Textes blancs avec accents jaunes
- Boutons primaires en gradient jaune (`from-yellow-400 to-yellow-500`)

### Typographie

- Font par défaut : Système (sans-serif)
- Pas de custom fonts (pour performance)

---

## 🔄 Workflow recommandé

### Phase 1 : Prototypage UI (actuel)
✅ Valider l'UX/UI avec Figma Make
✅ Tester les parcours utilisateurs
✅ Affiner le design

### Phase 2 : Migration vers projet professionnel
1. Créer projet Vite + TypeScript
2. Copier les composants UI
3. Setup Tailwind v3
4. Tester que tout compile

### Phase 3 : Architecture frontend
1. Ajouter React Router (routing)
2. Ajouter Zustand ou Redux (state management)
3. Ajouter React Query (data fetching)
4. Créer services API (stubs)

### Phase 4 : Backend development
1. Créer API REST/GraphQL
2. Setup base de données (PostgreSQL)
3. Implémenter auth (JWT)
4. Implémenter endpoints métier

### Phase 5 : Intégrations tierces
1. Stripe (paiements)
2. Twilio (SMS)
3. SendGrid (emails)
4. Cloudinary (uploads)

### Phase 6 : Fonctionnalités avancées
1. Service Gardien
2. Extension Chrome TikTok
3. Comparateur dynamique
4. Système de reviews

### Phase 7 : Production
1. Tests (Jest, Playwright)
2. CI/CD (GitHub Actions)
3. Déploiement (Vercel + Railway)
4. Monitoring (Sentry)
5. RGPD / Légal

---

## 📝 Types UI disponibles

```typescript
// src/types/ui.ts

type MembershipTier = 'free' | 'plus' | 'vip';
type ServiceType = 'beauty' | 'food' | 'fashion' | 'realestate';

interface AdvertiserCardData {
  id: string;
  name: string;
  photo: string;
  rating: number;
  priceLevel: 1 | 2 | 3;
  district: string;
  isOpen: boolean;
  tags: string[];
}

interface BookingFormData {
  date: string;
  time: string;
  serviceLocation: 'advertiser' | 'client';
  clientAddress?: string;
  needsTransport: boolean;
  transportType?: 'taxi' | 'moto';
  guardianService: boolean;
}

interface UserProfileData {
  name: string;
  email: string;
  photo: string;
  membershipTier: MembershipTier;
  memberCardNumber?: string;
}

interface SearchFiltersData {
  query: string;
  serviceType?: ServiceType;
  district?: string;
  priceLevel?: (1 | 2 | 3)[];
  minRating?: number;
}
```

---

## 🚨 Avertissements importants

### ⚠️ Ne PAS utiliser en production tel quel

Ce code :
- N'a aucune sécurité
- N'a aucune validation backend
- N'a aucune persistence
- N'a aucun système de paiement
- N'est pas conforme RGPD

### ⚠️ Données fictives

Toutes les données (annonceurs, users, etc.) sont des fixtures UI pour démonstration uniquement.

### ⚠️ Extension Chrome TikTok

Le scraping de données TikTok peut violer les conditions d'utilisation de TikTok. Consultez un avocat avant de développer cette fonctionnalité.

---

## 📞 Support

Pour toute question sur ce kit UI :
1. Lire le fichier `IMPLEMENTATION_GUIDE.md` (instructions détaillées)
2. Consulter le rapport technique `RAPPORT_TECHNIQUE_KOPEMA.md`
3. Contacter l'équipe de développement

---

## 📄 Licence

Ce kit UI KOPEMA est fourni "tel quel" pour prototypage uniquement.

Les composants shadcn/ui sont sous licence MIT.
Les images Unsplash sont utilisées conformément à la licence Unsplash.

---

**🎯 Remember: This is UI prototyping, not production code. Always implement proper backend, security, and legal compliance before launching.**
