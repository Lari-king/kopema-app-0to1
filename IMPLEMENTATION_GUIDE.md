# KOPEMA - Guide d'implémentation production

**Ce document liste TOUT ce qui doit être implémenté pour transformer le prototype UI KOPEMA en application production.**

---

## 🎯 Vue d'ensemble

Ce kit UI fournit **uniquement** l'interface utilisateur. Pour lancer en production, vous devez implémenter :

1. **Backend API complet**
2. **Base de données**
3. **Authentification sécurisée**
4. **Système de paiement**
5. **Notifications (email/SMS)**
6. **Upload de fichiers**
7. **Conformité RGPD**
8. **Extension Chrome** (optionnel)

---

## 1️⃣ Backend API

### Technologie recommandée
- **Node.js + NestJS** (TypeScript, architecture scalable)
- Alternatives : Express.js, Fastify, Python FastAPI

### Base de données
**PostgreSQL** (recommandé) ou MongoDB

#### Schéma de données (PostgreSQL)

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  photo_url TEXT,
  role VARCHAR(50) NOT NULL DEFAULT 'client', -- 'client', 'advertiser', 'admin'
  membership_tier VARCHAR(50) NOT NULL DEFAULT 'free', -- 'free', 'plus', 'vip'
  member_card_number VARCHAR(50) UNIQUE,
  phone VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Advertisers table
CREATE TABLE advertisers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  handle VARCHAR(255) UNIQUE NOT NULL,
  photo_url TEXT,
  banner_url TEXT,
  service_type VARCHAR(50) NOT NULL, -- 'beauty', 'food', 'fashion', 'realestate'
  district VARCHAR(100),
  address TEXT,
  phone VARCHAR(50),
  email VARCHAR(255),
  description TEXT,
  price_level INTEGER CHECK (price_level BETWEEN 1 AND 3),
  is_open BOOLEAN DEFAULT true,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Listings (services/offres)
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advertiser_id UUID REFERENCES advertisers(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  price_unit VARCHAR(50), -- 'hour', 'service', 'day', 'month'
  labor_cost DECIMAL(10, 2),
  material_cost DECIMAL(10, 2),
  category VARCHAR(100),
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Time slots (créneaux)
CREATE TABLE time_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advertiser_id UUID REFERENCES advertisers(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time TIME NOT NULL,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(advertiser_id, date, time)
);

-- Bookings (réservations)
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  advertiser_id UUID REFERENCES advertisers(id),
  listing_id UUID REFERENCES listings(id),
  date DATE NOT NULL,
  time TIME NOT NULL,
  service_location VARCHAR(50) NOT NULL, -- 'advertiser', 'client'
  client_address TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'cancelled'
  base_price DECIMAL(10, 2) NOT NULL,
  transport_cost DECIMAL(10, 2) DEFAULT 0,
  transport_type VARCHAR(50), -- 'taxi', 'moto'
  guardian_service BOOLEAN DEFAULT false,
  guardian_cost DECIMAL(10, 2) DEFAULT 0,
  total_price DECIMAL(10, 2) NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'refunded'
  payment_method VARCHAR(50), -- 'stripe', 'airtel_money', 'mtn_money'
  stripe_payment_intent_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  advertiser_id UUID REFERENCES advertisers(id),
  booking_id UUID REFERENCES bookings(id),
  rating INTEGER CHECK (rating BETWEEN 1 AND 10),
  comment TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Favorites
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  advertiser_id UUID REFERENCES advertisers(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, advertiser_id)
);

-- Subscriptions (abonnements KOPEMA+/VIP)
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tier VARCHAR(50) NOT NULL, -- 'plus', 'vip'
  status VARCHAR(50) NOT NULL, -- 'active', 'cancelled', 'expired'
  stripe_subscription_id VARCHAR(255) UNIQUE,
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### API Endpoints à implémenter

#### Authentication
```
POST   /auth/register           # Inscription
POST   /auth/login              # Connexion (retourne JWT)
POST   /auth/logout             # Déconnexion
POST   /auth/refresh            # Refresh token
POST   /auth/forgot-password    # Mot de passe oublié
POST   /auth/reset-password     # Réinitialisation
GET    /auth/me                 # User actuel
```

#### Users
```
GET    /users/:id               # Profil utilisateur
PUT    /users/:id               # Modifier profil
DELETE /users/:id               # Supprimer compte (RGPD)
GET    /users/:id/bookings      # Historique réservations
GET    /users/:id/favorites     # Favoris
POST   /users/:id/favorites     # Ajouter favori
DELETE /users/:id/favorites/:advertiserId  # Supprimer favori
```

#### Advertisers
```
GET    /advertisers             # Liste annonceurs (avec pagination, filtres)
GET    /advertisers/:id         # Détail annonceur
POST   /advertisers             # Créer annonceur (auth required, role advertiser)
PUT    /advertisers/:id         # Modifier annonceur
DELETE /advertisers/:id         # Supprimer annonceur
GET    /advertisers/search      # Recherche (query, location, serviceType)
GET    /advertisers/:id/reviews # Reviews annonceur
POST   /advertisers/:id/reviews # Ajouter review
```

#### Listings
```
GET    /listings                # Liste offres
GET    /listings/:id            # Détail offre
POST   /advertisers/:id/listings        # Créer offre
PUT    /listings/:id            # Modifier offre
DELETE /listings/:id            # Supprimer offre
```

#### Time Slots
```
GET    /advertisers/:id/slots   # Créneaux disponibles
POST   /advertisers/:id/slots   # Créer créneau
PUT    /slots/:id               # Modifier créneau
DELETE /slots/:id               # Supprimer créneau
GET    /advertisers/:id/slots/available?date=YYYY-MM-DD  # Créneaux dispo par date
```

#### Bookings
```
POST   /bookings                # Créer réservation (avec paiement Stripe)
GET    /bookings/:id            # Détail réservation
PUT    /bookings/:id/cancel     # Annuler réservation
GET    /users/:id/bookings      # Réservations d'un user
GET    /advertisers/:id/bookings  # Réservations d'un annonceur
POST   /bookings/:id/confirm    # Confirmer réservation (annonceur)
```

#### Subscriptions
```
POST   /subscriptions/create-checkout  # Créer Stripe Checkout session
POST   /subscriptions/cancel    # Annuler abonnement
GET    /subscriptions/:id       # Détail abonnement
POST   /webhooks/stripe         # Webhook Stripe (important!)
```

#### Admin
```
GET    /admin/users             # Liste users (admin only)
GET    /admin/advertisers       # Liste annonceurs (admin only)
PUT    /admin/advertisers/:id/verify  # Vérifier annonceur
DELETE /admin/users/:id         # Supprimer user
GET    /admin/stats             # Statistiques plateforme
```

---

## 2️⃣ Authentification

### Technologie recommandée
**JWT (JSON Web Tokens)** avec refresh tokens

### Librairies
- `bcrypt` : Hashage mots de passe
- `jsonwebtoken` : Génération/vérification JWT
- `passport` : Middleware auth (optionnel)

### Flow auth recommandé

1. **Inscription** :
   - User soumet email + password
   - Backend hash le password avec bcrypt (salt rounds 10+)
   - Créer user en DB
   - Retourner access token + refresh token
   - Envoyer email de confirmation (optionnel)

2. **Connexion** :
   - User soumet email + password
   - Backend vérifie hash
   - Retourner access token (15min) + refresh token (7 jours)

3. **Refresh** :
   - Frontend envoie refresh token
   - Backend vérifie et génère nouveau access token

4. **Logout** :
   - Invalider refresh token (blacklist Redis ou supprimer de DB)

### Payload JWT recommandé
```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "role": "client",
  "membershipTier": "plus",
  "iat": 1234567890,
  "exp": 1234568790
}
```

### Sécurité obligatoire
- ✅ HTTPS uniquement
- ✅ Password policy (8+ caractères, majuscules, chiffres)
- ✅ Rate limiting login (max 5 tentatives / 15 min)
- ✅ 2FA (recommandé pour admin et VIP)

---

## 3️⃣ Paiements

### Stripe (Recommandé pour cartes bancaires)

#### Setup
1. Créer compte Stripe : https://stripe.com
2. Obtenir clés API (test + production)
3. Installer SDK : `npm install stripe`

#### Abonnements KOPEMA+ et VIP

1. **Créer products dans Stripe Dashboard**
   - KOPEMA+ : 1,500 FCFA/mois (recurring)
   - KOPEMA VIP : 5,000 FCFA/mois (recurring)

2. **Flow abonnement** :
   ```typescript
   // Backend
   const session = await stripe.checkout.sessions.create({
     mode: 'subscription',
     line_items: [{
       price: 'price_kopema_plus_fcfa', // Price ID depuis Stripe
       quantity: 1,
     }],
     success_url: 'https://kopema.com/success?session_id={CHECKOUT_SESSION_ID}',
     cancel_url: 'https://kopema.com/cancelled',
     customer_email: user.email,
   });
   
   return { checkoutUrl: session.url };
   ```

3. **Webhook Stripe** (CRITIQUE) :
   ```typescript
   // /webhooks/stripe
   app.post('/webhooks/stripe', async (req, res) => {
     const sig = req.headers['stripe-signature'];
     const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
     
     switch (event.type) {
       case 'checkout.session.completed':
         // User a payé → activer abonnement
         await activateSubscription(event.data.object);
         break;
       case 'customer.subscription.deleted':
         // Abonnement annulé → downgrade user
         await downgradeUser(event.data.object);
         break;
     }
     
     res.json({ received: true });
   });
   ```

#### Réservations one-time

```typescript
// Créer PaymentIntent pour réservation
const paymentIntent = await stripe.paymentIntents.create({
  amount: totalPrice * 100, // Stripe utilise cents
  currency: 'xaf', // Franc CFA (XAF)
  metadata: {
    bookingId: booking.id,
    userId: user.id,
  },
});

return { clientSecret: paymentIntent.client_secret };
```

### Mobile Money (Airtel Money, MTN Mobile Money)

#### Airtel Money API
- Documentation : https://developers.airtel.africa
- Flow : Initiate payment → Poll status → Callback

#### MTN Mobile Money API
- Documentation : https://momodeveloper.mtn.com
- Flow : Request to pay → Poll status → Callback

#### Implémentation recommandée
```typescript
// Service abstrait
interface PaymentProvider {
  createPayment(amount: number, phone: string): Promise<PaymentResponse>;
  checkStatus(transactionId: string): Promise<PaymentStatus>;
}

class AirtelMoneyProvider implements PaymentProvider { /* ... */ }
class MTNMoMoProvider implements PaymentProvider { /* ... */ }
class StripeProvider implements PaymentProvider { /* ... */ }
```

---

## 4️⃣ Notifications

### Email (SendGrid recommandé)

#### Setup
```bash
npm install @sendgrid/mail
```

#### Templates email nécessaires
1. **Email de confirmation inscription**
2. **Email de confirmation réservation** (avec détails, QR code optionnel)
3. **Email de rappel réservation** (24h avant)
4. **Email de confirmation paiement**
5. **Email de facture** (abonnement)
6. **Email Service Gardien** (notifier contact de confiance)

#### Exemple
```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

async function sendBookingConfirmation(booking: Booking) {
  await sgMail.send({
    to: booking.user.email,
    from: 'noreply@kopema.com',
    templateId: 'd-xxxxx', // Template SendGrid
    dynamicTemplateData: {
      userName: booking.user.name,
      serviceName: booking.listing.title,
      providerName: booking.advertiser.name,
      date: booking.date,
      time: booking.time,
      totalPrice: booking.totalPrice,
    },
  });
}
```

### SMS (Twilio)

#### Setup
```bash
npm install twilio
```

#### Use cases
1. **SMS confirmation réservation** (immédiat)
2. **SMS rappel réservation** (1h avant)
3. **SMS annulation**
4. **SMS Service Gardien** (notifier contact de confiance)
5. **SMS OTP** (2FA optionnel)

#### Exemple
```typescript
import twilio from 'twilio';

const client = twilio(accountSid, authToken);

async function sendBookingReminder(booking: Booking) {
  await client.messages.create({
    to: booking.user.phone,
    from: '+242XXXXXXXX', // Numéro Twilio
    body: `Rappel KOPEMA : RDV demain à ${booking.time} chez ${booking.advertiser.name}. Bon rendez-vous ! 😊`,
  });
}
```

---

## 5️⃣ Upload de fichiers

### Cloudinary (Recommandé)

#### Setup
```bash
npm install cloudinary
```

#### Use cases
- Photo de profil user
- Photo de profil annonceur
- Banner annonceur
- Photos des offres/services
- Carte membre physique (VIP)

#### Exemple
```typescript
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadAdvertiserPhoto(file: Express.Multer.File) {
  const result = await cloudinary.uploader.upload(file.path, {
    folder: 'kopema/advertisers',
    transformation: [
      { width: 400, height: 400, crop: 'fill', gravity: 'face' },
    ],
  });
  
  return result.secure_url;
}
```

### Alternative : AWS S3
- Plus complexe mais plus de contrôle
- Moins cher à grande échelle

---

## 6️⃣ Service Gardien

### Concept
Fonctionnalité KOPEMA+ et VIP : notifier automatiquement un contact de confiance lors d'une réservation (sécurité).

### Implémentation

1. **Enregistrer contact Gardien** (profil user)
   ```sql
   ALTER TABLE users ADD COLUMN guardian_name VARCHAR(255);
   ALTER TABLE users ADD COLUMN guardian_phone VARCHAR(50);
   ALTER TABLE users ADD COLUMN guardian_email VARCHAR(255);
   ```

2. **Lors de la réservation** (si guardianService = true)
   - Enregistrer dans DB : `bookings.guardian_service = true`
   - Envoyer SMS au contact Gardien :
     ```
     [KOPEMA Service Gardien] Marie Dupont a un RDV le 15/01/2026 à 14h chez Salon Élégance (15 Av. de la Paix, Poto-Poto). Adresse : [Google Maps link]
     ```
   - Envoyer email avec détails complets + lien Google Maps

3. **Après la réservation**
   - SMS de confirmation au contact Gardien : "Marie est bien arrivée chez Salon Élégance. Merci pour votre vigilance."

### Coût
+3,000 FCFA (SMS + email)

---

## 7️⃣ Transport intégré

### Partenariats recommandés
- **Yango** (ex-Uber en Afrique)
- **Taxibrousse.com** (Congo-Brazzaville)
- Partenariats locaux avec compagnies de taxi/moto

### Implémentation API Yango (exemple)

```typescript
async function requestTransport(booking: Booking, type: 'taxi' | 'moto') {
  const response = await axios.post('https://yango-api.com/v1/rides', {
    pickup: {
      lat: booking.user.latitude,
      lng: booking.user.longitude,
    },
    destination: {
      lat: booking.advertiser.latitude,
      lng: booking.advertiser.longitude,
    },
    vehicleType: type === 'taxi' ? 'economy' : 'motorbike',
    scheduledFor: new Date(`${booking.date}T${booking.time}`),
  }, {
    headers: {
      Authorization: `Bearer ${process.env.YANGO_API_KEY}`,
    },
  });
  
  return response.data.rideId;
}
```

### Alternative : Chauffeurs KOPEMA
- Créer table `drivers`
- Gérer disponibilités
- Système de dispatch interne
- Plus complexe mais plus de contrôle

---

## 8️⃣ Extension Chrome TikTok

### ⚠️ Avertissement légal
Le scraping de TikTok peut **violer les conditions d'utilisation**. Alternatives :
1. **TikTok Official API** (si accès approuvé)
2. **Partenariat avec TikTok**
3. **Import manuel** (annonceurs saisissent eux-mêmes leurs stats)

### Si vous décidez de créer l'extension (à vos risques)

#### Structure
```
/chrome-extension
├── manifest.json
├── background.js
├── content.js (injecté sur tiktok.com)
├── popup.html
└── popup.js
```

#### manifest.json
```json
{
  "manifest_version": 3,
  "name": "KOPEMA TikTok Importer",
  "version": "1.0.0",
  "permissions": ["storage", "activeTab"],
  "host_permissions": ["https://*.tiktok.com/*"],
  "content_scripts": [{
    "matches": ["https://*.tiktok.com/*"],
    "js": ["content.js"]
  }],
  "action": {
    "default_popup": "popup.html"
  }
}
```

#### content.js (scraper)
```javascript
// Extraire données publiques du profil TikTok
function extractProfileData() {
  const name = document.querySelector('[data-e2e="user-title"]')?.textContent;
  const followers = document.querySelector('[data-e2e="followers-count"]')?.textContent;
  const likes = document.querySelector('[data-e2e="likes-count"]')?.textContent;
  
  return { name, followers, likes };
}

chrome.runtime.sendMessage({
  action: 'PROFILE_EXTRACTED',
  data: extractProfileData(),
});
```

#### Workflow
1. User navigue sur profil TikTok d'un annonceur
2. Clique sur extension KOPEMA
3. Extension extrait données publiques
4. Envoie vers API KOPEMA (`POST /admin/advertisers/import`)
5. Backend crée fiche annonceur

---

## 9️⃣ RGPD et conformité légale

### Obligations légales (si utilisateurs européens ou africains avec données sensibles)

#### 1. Mentions légales (obligatoire)
- Nom de l'entreprise
- Adresse du siège
- Numéro SIREN/SIRET (ou équivalent Congo)
- Contact
- Hébergeur

#### 2. CGU (Conditions Générales d'Utilisation)
- Objet du service
- Inscription
- Résiliation
- Responsabilités
- Propriété intellectuelle

#### 3. CGV (Conditions Générales de Vente)
- Prix
- Paiement
- Annulation / Remboursement
- Réclamations

#### 4. Politique de confidentialité (RGPD)
- Données collectées
- Finalités
- Durée de conservation
- Droits des utilisateurs :
  - Droit d'accès
  - Droit de rectification
  - Droit à l'effacement (droit à l'oubli)
  - Droit à la portabilité
  - Droit d'opposition
- Base légale (consentement, contrat, intérêt légitime)

#### 5. Consentement cookies
- Banner de cookies (obligatoire si cookies non essentiels)
- Gestion des préférences
- Opt-out analytics

### Implémentation technique RGPD

#### Droit à l'effacement (Article 17)
```typescript
// DELETE /users/:id
async function deleteUser(userId: string) {
  // 1. Anonymiser les reviews (garder contenu mais supprimer lien user)
  await db.reviews.update({
    where: { userId },
    data: { userId: null, userName: 'Utilisateur supprimé' },
  });
  
  // 2. Supprimer bookings après 3 ans (obligation légale comptabilité)
  // Garder bookings récents anonymisés
  
  // 3. Supprimer user
  await db.users.delete({ where: { id: userId } });
  
  // 4. Notifier services tiers (Stripe, SendGrid)
  await stripe.customers.del(user.stripeCustomerId);
}
```

#### Export de données (Article 20 - Portabilité)
```typescript
// GET /users/:id/export
async function exportUserData(userId: string) {
  const user = await db.users.findUnique({ where: { id: userId } });
  const bookings = await db.bookings.findMany({ where: { userId } });
  const reviews = await db.reviews.findMany({ where: { userId } });
  const favorites = await db.favorites.findMany({ where: { userId } });
  
  return {
    user,
    bookings,
    reviews,
    favorites,
  }; // Format JSON téléchargeable
}
```

### Outils recommandés
- **Iubenda** : Générateur CGU/CGV/Confidentialité automatique (payant)
- **Cookie Consent** : Banner cookies open-source
- **Axeptio** : Solution française complète cookies + RGPD

---

## 🔟 Architecture technique complète

### Stack recommandée

```
┌─────────────────────────────────────────┐
│          FRONTEND (React SPA)           │
│  - Vite + React 18 + TypeScript         │
│  - Tailwind CSS v3                      │
│  - React Router (routing)               │
│  - Zustand (state management)           │
│  - React Query (data fetching)          │
│  - Stripe.js (payments)                 │
└─────────────────┬───────────────────────┘
                  │
                  │ HTTPS (Vercel)
                  ▼
┌─────────────────────────────────────────┐
│      BACKEND API (Node.js / NestJS)     │
│  - NestJS + TypeScript                  │
│  - Prisma ORM                           │
│  - JWT authentication                   │
│  - Helmet (sécurité)                    │
│  - Rate limiting                        │
└─────────────────┬───────────────────────┘
                  │
                  ├──► PostgreSQL (Railway / Supabase)
                  ├──► Redis (cache + sessions)
                  │
                  ├──► Stripe API (paiements CB)
                  ├──► Airtel Money API (mobile money)
                  ├──► MTN MoMo API (mobile money)
                  ├──► Twilio API (SMS)
                  ├──► SendGrid API (emails)
                  └──► Cloudinary API (uploads)
```

### Déploiement

#### Frontend
- **Vercel** (recommandé, gratuit tier généreux)
- Alternatives : Netlify, AWS Amplify

#### Backend
- **Railway** (recommandé, PostgreSQL inclus)
- Alternatives : Render, Fly.io, AWS ECS

#### Base de données
- **Supabase PostgreSQL** (gratuit jusqu'à 500MB)
- Alternative : Railway PostgreSQL, AWS RDS

#### Redis
- **Upstash Redis** (gratuit tier)
- Alternative : Redis Cloud

---

## 1️⃣1️⃣ Monitoring et analytics

### Error tracking
**Sentry** (recommandé)
```bash
npm install @sentry/node @sentry/react
```

Capturer toutes les erreurs backend + frontend

### Analytics
**Google Analytics 4** ou **Mixpanel**
- Tracking pages vues
- Tracking conversions (réservations)
- Funnel analysis

### Uptime monitoring
**UptimeRobot** (gratuit, ping toutes les 5 min)

### Logs
**Better Stack** (ex-Logtail) ou **Datadog**

---

## 1️⃣2️⃣ Tests

### Tests unitaires (backend)
```bash
npm install jest @types/jest ts-jest
```

Tester :
- Modèles (validation)
- Services métier
- Helpers

### Tests intégration (API)
```bash
npm install supertest
```

Tester tous les endpoints

### Tests E2E (frontend)
```bash
npm install playwright
```

Tester parcours :
- Inscription → Connexion
- Recherche → Réservation → Paiement
- Dashboard annonceur

---

## 1️⃣3️⃣ CI/CD

### GitHub Actions (recommandé)

`.github/workflows/ci.yml`
```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test
      - run: npm run lint
      - run: npm run build
```

### Déploiement automatique
- Push sur `main` → Vercel déploie frontend automatiquement
- Push sur `main` → Railway déploie backend automatiquement

---

## 1️⃣4️⃣ Sécurité

### Checklist sécurité obligatoire

- [ ] HTTPS obligatoire (certificat SSL)
- [ ] Helmet.js (headers sécurisés)
- [ ] CORS configuré (pas de `*` en production)
- [ ] Rate limiting (max 100 req/min par IP)
- [ ] Validation inputs (Zod, Joi)
- [ ] Sanitization (XSS prevention)
- [ ] SQL injection protection (Prisma ORM)
- [ ] JWT avec refresh tokens
- [ ] Password hashing (bcrypt, salt rounds 10+)
- [ ] Secrets dans variables d'environnement (JAMAIS commités)
- [ ] Audit dépendances (`npm audit`)
- [ ] 2FA pour admin
- [ ] Logging accès (qui fait quoi quand)
- [ ] Backup base de données quotidien

---

## 1️⃣5️⃣ Performance

### Frontend
- [ ] Code splitting (React.lazy)
- [ ] Image optimization (WebP, lazy loading)
- [ ] Service Worker (PWA optionnel)
- [ ] CDN pour assets statiques

### Backend
- [ ] Index base de données (sur foreign keys, query fréquents)
- [ ] Cache Redis (annonceurs, listings)
- [ ] Pagination (max 50 items par page)
- [ ] Compression gzip
- [ ] Connection pooling DB

---

## 1️⃣6️⃣ Budget estimé

### Développement (outsourcing ou équipe interne)
- **Backend API complet** : 3-4 semaines = 15-20k€
- **Frontend intégration** : 2 semaines = 8-10k€
- **Paiements (Stripe + Mobile Money)** : 1 semaine = 4-5k€
- **Notifications (email/SMS)** : 1 semaine = 4-5k€
- **Extension Chrome** : 2 semaines = 8-10k€
- **Tests + QA** : 2 semaines = 8-10k€
- **RGPD / Légal** : Avocat tech = 3-5k€

**TOTAL développement** : **50-65k€**

### Coûts récurrents (par mois)
- **Hébergement** (Vercel + Railway) : ~50€
- **Base de données** (Supabase Pro) : ~25€
- **Redis** (Upstash) : ~10€
- **Stripe fees** : 1.4% + 0.25€ par transaction
- **SendGrid** (40k emails) : ~15€
- **Twilio** (SMS) : ~0.05€/SMS
- **Cloudinary** : ~20€
- **Monitoring** (Sentry + analytics) : ~30€
- **Certificat SSL** : Gratuit (Let's Encrypt)

**TOTAL récurrent** : **~150-200€/mois** (hors frais transactions)

---

## 1️⃣7️⃣ Roadmap recommandée

### Phase 1 : MVP (8 semaines)
- ✅ Backend API (auth, annonceurs, bookings basiques)
- ✅ Base de données PostgreSQL
- ✅ Frontend intégration (UI → API)
- ✅ Paiement Stripe (CB uniquement)
- ✅ Emails SendGrid (confirmation réservation)
- ✅ Déploiement Vercel + Railway

### Phase 2 : Paiements locaux (2 semaines)
- ✅ Airtel Money
- ✅ MTN Mobile Money
- ✅ SMS Twilio

### Phase 3 : Features premium (4 semaines)
- ✅ Service Gardien
- ✅ Abonnements KOPEMA+ et VIP
- ✅ Transport intégré (API Yango)
- ✅ Comparateur dynamique

### Phase 4 : Extension Chrome (2 semaines)
- ✅ Extension Chrome TikTok
- ✅ Import automatique annonceurs

### Phase 5 : Polish & Scale (4 semaines)
- ✅ Tests E2E complets
- ✅ RGPD / Légal
- ✅ Performance optimizations
- ✅ Monitoring / Analytics
- ✅ Documentation API

**TOTAL : 20 semaines (5 mois)**

---

## 📞 Support technique

Si vous avez besoin d'aide pour implémenter l'un de ces éléments :

1. Consultez les documentations officielles :
   - NestJS : https://nestjs.com
   - Prisma : https://prisma.io
   - Stripe : https://stripe.com/docs
   - Twilio : https://twilio.com/docs
   - SendGrid : https://sendgrid.com/docs

2. Stack Overflow pour questions spécifiques

3. Embaucher un développeur fullstack spécialisé Node.js/React

---

**🚀 Bon développement ! Ce guide couvre 95% des besoins pour transformer le prototype UI en application production.**
