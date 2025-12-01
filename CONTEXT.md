# CONTEXT.md - Mémoire de Projet

> **Dernière mise à jour** : 2025-12-01
> **Version** : 1.0.0

---

## 📋 Vue d'Ensemble

**Nom du Projet** : GwadaEcom
**Type** : Site e-commerce de bijoux artisanaux de Guadeloupe
**Objectif Business** : Vente en ligne de bijoux avec système de paiement Stripe, gestion admin complète, et envoi automatique d'emails de confirmation.

**Public cible** :
- Clients : Achat de bijoux en ligne avec ou sans compte
- Administrateurs : Gestion des produits, catégories, commandes, et statistiques

---

## 🛠️ Stack Technique

### Frontend
- **Next.js** : `16.0.5` (App Router + Turbopack)
- **React** : `19.2.0`
- **Tailwind CSS** : `4.x`
- **Lucide React** : Icônes (`lucide-react`)

### Backend & Services
- **Firebase** : `12.6.0`
  - Firestore (base de données NoSQL)
  - Firebase Auth (authentification)
  - Firebase Storage (stockage d'images)
- **Stripe** : `20.0.0` (paiements)
  - `@stripe/stripe-js` : `8.5.3`
  - `@stripe/react-stripe-js` : `5.4.1`
- **Resend** : `6.5.2` (envoi d'emails)

### Testing
- **Playwright** : `1.57.0` (tests E2E)

### Environnement
- **Node.js** : Compatible avec Next.js 16.0.5
- **Package Manager** : npm
- **OS** : Windows (développement)

---

## 🏗️ Architecture

### Structure des Dossiers

```
gwadaecom/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── page.js                   # Page d'accueil
│   │   ├── layout.js                 # Layout principal
│   │   ├── globals.css               # Styles globaux
│   │   ├── products/[id]/            # Pages de détail produit
│   │   ├── cart/                     # Page panier
│   │   ├── checkout/                 # Page de paiement
│   │   ├── order-confirmation/       # Page de confirmation
│   │   ├── mon-compte/               # Connexion/Inscription
│   │   ├── compte/                   # Espace client
│   │   │   └── commandes/            # Historique des commandes
│   │   ├── admin/                    # Interface admin
│   │   │   ├── layout.js             # Layout admin
│   │   │   ├── page.js               # Dashboard admin
│   │   │   └── commercial/           # Section commerciale
│   │   │       ├── products/         # Gestion produits
│   │   │       ├── categories/       # Gestion catégories
│   │   │       └── orders/           # Gestion commandes
│   │   └── api/                      # API Routes
│   │       ├── create-payment-intent/
│   │       └── send-order-confirmation/
│   ├── components/                   # Composants React
│   │   ├── layout/                   # Header, Footer, Hero, SideCart
│   │   ├── products/                 # ProductGrid, ProductCard
│   │   ├── admin/                    # Composants admin
│   │   ├── Price.jsx                 # Affichage prix EUR
│   │   └── AdminFloatingButton.jsx   # Bouton admin flottant
│   ├── context/                      # React Context
│   │   ├── AuthContext.jsx           # Authentification
│   │   └── CartContext.jsx           # Panier (useCallback optimisé)
│   ├── hooks/                        # Hooks personnalisés
│   │   └── useProducts.js            # Récupération produits Firestore
│   ├── lib/                          # Bibliothèques
│   │   ├── firebase.js               # Config Firebase
│   │   ├── stripe.js                 # Config Stripe
│   │   └── cms-config.js             # Config collections Firestore
│   └── data/                         # Données statiques (legacy)
│       └── categories.js             # Catégories fixes
├── e2e/                              # Tests Playwright
│   ├── checkout-flows.spec.js        # Tests checkout (invité, user, nouveau)
│   ├── cart.spec.js                  # Tests panier
│   ├── navigation.spec.js            # Tests navigation
│   ├── admin-products.spec.js        # Tests admin produits
│   └── admin-categories.spec.js      # Tests admin catégories
├── public/                           # Assets statiques
├── .env.local                        # Variables d'environnement (ignoré Git)
├── .env.example                      # Template environnement
├── playwright.config.js              # Config Playwright
├── tailwind.config.js                # Config Tailwind
├── next.config.js                    # Config Next.js
├── package.json                      # Dépendances
├── TESTS.md                          # Guide des tests
├── TESTS_ISSUES.md                   # Rapport des problèmes tests
├── EMAIL_SETUP.md                    # Guide configuration email
└── CONTEXT.md                        # Ce fichier
```

### Patterns Clés

#### 1. Context Pattern (React Context API)
- **AuthContext** : Gestion auth Firebase (signIn, signUp, signOut, rôles)
- **CartContext** : Gestion panier (addItem, removeItem, updateQuantity, clearCart)
  - ⚠️ **Important** : Utilise `useCallback` pour éviter les re-renders infinis

#### 2. Custom Hooks
- **useProducts()** : Récupère tous les produits depuis Firestore
- **useProduct(id)** : Récupère un produit par ID
- **useProductsByCategory(slug)** : Filtre produits par catégorie

#### 3. Server-Side API Routes (Next.js)
- **POST /api/create-payment-intent** : Création PaymentIntent Stripe
- **POST /api/send-order-confirmation** : Envoi email confirmation (Resend)

#### 4. Firestore Collections
```javascript
// cms-config.js
{
  products: 'products',
  categories: 'categories',
  orders: 'orders',
  users: 'users'
}
```

#### 5. Authentication Flow
- Firebase Auth pour connexion/inscription
- Règles Firestore pour sécurité
- Redirection auto selon rôle (admin → /admin, client → /compte)

---

## ✅ État Actuel (Tracking)

### Fonctionnalités Terminées

#### 🎨 Frontend Public
- ✅ Page d'accueil avec grille de produits
- ✅ Page de détail produit dynamique
- ✅ Système de panier (SideCart + page /cart)
- ✅ Page de checkout avec 3 modes :
  - Invité (sans compte)
  - Utilisateur connecté
  - Création de compte pendant checkout
- ✅ Intégration Stripe Payment Element
- ✅ Page de confirmation de commande
- ✅ Header/Footer responsive
- ✅ Composant Price avec affichage EUR

#### 🔐 Authentification
- ✅ Page connexion/inscription (/mon-compte)
- ✅ Context d'authentification (AuthContext)
- ✅ Gestion des rôles (admin/client)
- ✅ Redirection automatique selon rôle
- ✅ Protection des routes admin

#### 👤 Espace Client
- ✅ Page compte client (/compte)
- ✅ Affichage des 3 dernières commandes
- ✅ Page historique complet (/compte/commandes)
- ✅ Modal détails commande
- ✅ Badges statut commande colorés

#### 🔧 Interface Admin
- ✅ Dashboard admin avec statistiques
- ✅ Gestion des produits (CRUD complet)
  - Création/Modification/Suppression
  - Upload d'images Firebase Storage
  - Gestion visibilité/stock
  - Vue grille et tableau
- ✅ Gestion des catégories (CRUD complet)
- ✅ Gestion des commandes
  - Liste temps réel (onSnapshot)
  - Recherche et filtres
  - Changement de statut
  - Modal détails complet
- ✅ Bouton admin flottant (mode dev)
- ✅ Navigation admin complète

#### 💳 Paiement & Commandes
- ✅ Intégration Stripe en mode test
- ✅ Création PaymentIntent
- ✅ Enregistrement commandes Firestore
- ✅ Génération ID commande unique
- ✅ Calcul total avec devise EUR
- ✅ Vidage panier après commande

#### 📧 Email
- ✅ API route envoi email (/api/send-order-confirmation)
- ✅ Support multiple providers (Resend, SendGrid, Nodemailer)
- ✅ Template HTML responsive
- ✅ Configuration Resend activée
- ✅ Logging détaillé pour debug

#### 🧪 Tests
- ✅ Configuration Playwright
- ✅ Tests E2E checkout (3 scénarios)
- ✅ Tests E2E panier
- ✅ Tests E2E navigation
- ✅ Tests E2E admin (produits + catégories)
- ✅ Documentation tests (TESTS.md)

---

## 📝 TODO List

### Priorité Haute
- [ ] **Créer l'index Firestore pour orders** (CRITIQUE)
  - Collection : `orders`
  - Champs : `customer.email` (Ascending) + `createdAt` (Descending)
  - Lien direct fourni dans TESTS_ISSUES.md
- [ ] Vérifier réception emails (tester avec vraie adresse)
- [ ] Valider que tous les tests Playwright passent après création index

### Priorité Moyenne
- [ ] Mettre à jour règles Firestore si nécessaire
- [ ] Configurer domaine personnalisé pour Resend (actuellement `onboarding@resend.dev`)
- [ ] Ajouter gestion des erreurs de paiement Stripe
- [ ] Implémenter système de pagination produits
- [ ] Ajouter filtres par catégorie sur page d'accueil
- [ ] Ajouter recherche de produits

### Priorité Basse
- [ ] Optimiser images (compression, lazy loading)
- [ ] Ajouter animations de transition
- [ ] Implémenter système de wishlist
- [ ] Ajouter section avis clients
- [ ] Créer page à propos/contact
- [ ] Ajouter multi-langue (FR/EN)

### Améliorations Futures
- [ ] Dashboard analytique avancé
- [ ] Export commandes CSV/PDF
- [ ] Gestion des promotions et codes promo
- [ ] Système de newsletter
- [ ] Intégration réseaux sociaux
- [ ] Mode sombre

---

## 🐛 Bugs Connus

### 🔴 CRITIQUE

#### 1. Index Firestore Manquant - Orders Collection
**Status** : Non résolu
**Impact** : Bloque les pages `/compte` et `/compte/commandes`
**Erreur** :
```
FirebaseError: The query requires an index
Collection: orders
Query: customer.email (Ascending) + createdAt (Descending)
```
**Solution** :
- Cliquer sur le lien auto-généré dans TESTS_ISSUES.md
- OU créer manuellement l'index dans Firebase Console
- Attendre 2-5 minutes pour la création
**Référence** : TESTS_ISSUES.md, ligne 30

#### 2. Emails Non Reçus
**Status** : À investiguer
**Impact** : Utilisateurs ne reçoivent pas les confirmations de commande
**Contexte** :
- Resend configuré avec clé API valide
- Code d'envoi activé (pas en mode dev)
- Logs serveur à vérifier
**À tester** :
1. Vérifier logs console serveur (chercher `📧`)
2. Vérifier dashboard Resend
3. Vérifier dossier spam
4. Tester avec adresse email enregistrée sur Resend (limitation `onboarding@resend.dev`)
**Référence** : TESTS_ISSUES.md, section "Test Email Envoi"

### ⚠️ MOYEN

#### 3. Tests Playwright Échouent (lié au bug #1)
**Status** : Résolu dès que bug #1 est fixé
**Impact** : 4 tests checkout échouent tous
**Cause** : Index Firestore manquant empêche le chargement des commandes
**Tests affectés** :
- Commande invité
- Commande utilisateur connecté
- Commande nouveau compte
- Vérification permissions Firestore

---

## 🔄 WORKFLOW & RÈGLES D'USAGE

### **RÈGLES IMPORTANTES** ⚠️

**🆕 Nouvelle Fonctionnalité** → Ouvrir une nouvelle discussion + Coller CONTEXT.md

**🐛 Résolution de Bug Complexe** → Ouvrir une nouvelle discussion + Coller CONTEXT.md + Fournir les logs d'erreur

**⛔ Ne JAMAIS tenter de résoudre un bug tenace dans une conversation qui a déjà servi à coder la fonctionnalité. Isoler le problème.**

### Commandes Utiles

#### Développement
```bash
# Lancer le serveur de développement
npm run dev

# Compiler le projet
npm run build

# Lancer en production
npm start

# Linter le code
npm run lint
```

#### Tests
```bash
# Tous les tests
npm test

# Tests en mode UI (interface graphique)
npm run test:ui

# Tests en mode visible (navigateur visible)
npm run test:headed

# Tests en mode debug
npm run test:debug

# Voir le rapport des tests
npm run test:report

# Tests spécifiques
npm test -- e2e/checkout-flows.spec.js
```

#### Git
```bash
# Commit standard
git add -A
git commit -m "Description"
git push

# Format de commit recommandé
# - feat: Nouvelle fonctionnalité
# - fix: Correction de bug
# - docs: Documentation
# - test: Ajout/modification tests
# - refactor: Refactorisation
```

### Variables d'Environnement

**Fichier** : `.env.local` (ne JAMAIS commit ce fichier)

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=gwadaecom-d4464
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Stripe (mode test)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Resend
RESEND_API_KEY=re_Xzt6x8Za_PoUpt76fNuXB6Er7KatL3UuB
```

### Règles Firestore Actuelles

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products - Lecture publique, écriture admin
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Categories - Lecture publique, écriture admin
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Orders - Création publique, lecture avec ID
    match /orders/{orderId} {
      allow create: if true;
      allow read: if true;  // Permet lecture avec l'ID (sécurisé car IDs aléatoires)
      allow update, delete: if request.auth != null;
    }

    // Users - Lecture/écriture authentifiée uniquement
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 📚 Documentation Associée

- **[TESTS.md](./TESTS.md)** - Guide complet des tests Playwright
- **[TESTS_ISSUES.md](./TESTS_ISSUES.md)** - Rapport détaillé des problèmes identifiés par les tests
- **[EMAIL_SETUP.md](./EMAIL_SETUP.md)** - Guide de configuration des emails (Resend, SendGrid, Nodemailer)
- **[.env.example](./.env.example)** - Template des variables d'environnement

---

## 🔗 Liens Importants

- **Firebase Console** : https://console.firebase.google.com/project/gwadaecom-d4464
- **Stripe Dashboard** : https://dashboard.stripe.com/test/dashboard
- **Resend Dashboard** : https://resend.com/dashboard
- **GitHub Repository** : https://github.com/seylioneldev/gwadaecom

---

## 📅 Historique des Modifications

### 2025-12-01 - Session Initiale
- ✅ Implémentation complète du système de commandes
- ✅ Ajout interface admin gestion commandes
- ✅ Historique commandes client
- ✅ Configuration système d'email (Resend)
- ✅ Création tests Playwright checkout flows
- ✅ Identification et documentation bug index Firestore
- ✅ Création de ce fichier CONTEXT.md

---

## 💡 Notes Importantes

1. **Stripe en Mode Test** : Toujours utiliser les cartes de test
   - Carte valide : `4242 4242 4242 4242`
   - Date : N'importe quelle date future
   - CVC : N'importe quel 3 chiffres

2. **Firebase Storage** : Les images de produits sont stockées dans Firebase Storage (dossier `/products/`)

3. **Optimisation CartContext** : Le CartContext utilise `useCallback` pour toutes ses fonctions pour éviter les re-renders infinis. Ne pas modifier sans comprendre pourquoi.

4. **Index Firestore** : Firestore nécessite des index pour les requêtes complexes. Toujours créer les index demandés par Firebase.

5. **Resend Limitations** : Avec `onboarding@resend.dev`, vous ne pouvez envoyer qu'à l'email enregistré sur votre compte Resend. Pour envoyer à n'importe quelle adresse, configurez un domaine personnalisé.

6. **Tests Playwright** : Les tests démarrent automatiquement le serveur Next.js. Pas besoin de lancer `npm run dev` avant de tester.

---

**Version du fichier** : 1.0.0
**Dernière synchronisation** : 2025-12-01 18:00 UTC
**Prochaine mise à jour recommandée** : Après résolution des bugs critiques
