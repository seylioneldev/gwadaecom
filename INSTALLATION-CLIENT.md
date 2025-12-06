# 🚀 Guide d'Installation Client - CMS E-commerce

**Guide pour installer rapidement le CMS chez un nouveau client**

---

## 📋 Table des Matières

1. [Prérequis](#prérequis)
2. [Étape 1 : Cloner le projet](#étape-1--cloner-le-projet)
3. [Étape 2 : Configuration Firebase](#étape-2--configuration-firebase)
4. [Étape 3 : Configuration Stripe](#étape-3--configuration-stripe)
5. [Étape 4 : Configuration Email](#étape-4--configuration-email)
6. [Étape 5 : Déploiement Vercel](#étape-5--déploiement-vercel)
7. [Étape 6 : Personnalisation](#étape-6--personnalisation)
8. [Checklist finale](#checklist-finale)

---

## ⏱️ Temps estimé : 2-3 heures

---

## 🔧 Prérequis

**Comptes à créer AVANT de commencer** :

- [ ] Compte GitHub (gratuit)
- [ ] Compte Vercel (gratuit)
- [ ] Compte Firebase (gratuit)
- [ ] Compte Stripe (gratuit, mode test)
- [ ] Compte Gmail ou Resend (pour emails)

**Logiciels nécessaires** :

- [ ] Git installé sur votre machine
- [ ] Node.js 18+ installé
- [ ] Éditeur de code (VS Code recommandé)

---

## 📂 Étape 1 : Cloner le Projet

### 1.1 Créer un nouveau repository pour le client

**Sur GitHub** :

1. Allez sur https://github.com/new
2. Nom du repository : `nom-client-ecommerce` (ex: `boutique-marie-ecommerce`)
3. **Privé** (recommandé)
4. **NE PAS** initialiser avec README/gitignore
5. Cliquez "Create repository"

### 1.2 Cloner la version squelette

**Sur votre machine** :

```bash
# Cloner la branche share-bones (version neutre)
git clone -b share-bones https://github.com/VOTRE-USERNAME/gwadaecom.git nom-client-ecommerce

cd nom-client-ecommerce

# Changer l'origine remote vers le nouveau repo client
git remote set-url origin https://github.com/VOTRE-USERNAME/nom-client-ecommerce.git

# Pousser vers le nouveau repo
git push -u origin share-bones

# Créer et pousser la branche main
git checkout -b main
git push -u origin main
```

### 1.3 Installer les dépendances

```bash
npm install
```

**⏱️ Temps : 10 minutes**

---

## 🔥 Étape 2 : Configuration Firebase

### 2.1 Créer un nouveau projet Firebase

1. Allez sur https://console.firebase.google.com
2. Cliquez "Ajouter un projet"
3. Nom : `nom-client-ecommerce`
4. Activez Google Analytics (optionnel)
5. Cliquez "Créer un projet"

### 2.2 Activer Firestore Database

1. Dans la console Firebase → "Firestore Database"
2. Cliquez "Créer une base de données"
3. Mode : **Production**
4. Région : `europe-west1` (ou proche du client)
5. Cliquez "Activer"

### 2.3 Configurer les règles Firestore

Dans Firestore → Règles, collez :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products - lecture publique, écriture admin
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Categories - lecture publique, écriture admin
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Orders - lecture/écriture propriétaire ou admin
    match /orders/{orderId} {
      allow read: if request.auth != null &&
        (resource.data.userId == request.auth.uid ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow create: if request.auth != null;
      allow update: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Users - lecture/écriture propriétaire ou admin
    match /users/{userId} {
      allow read: if request.auth != null && (request.auth.uid == userId ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Settings - lecture publique, écriture admin
    match /settings/{document=**} {
      allow read: if true;
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

Cliquez "Publier"

### 2.4 Activer Authentication

1. Firebase → "Authentication"
2. Cliquez "Commencer"
3. Activez "Email/Password"
4. Sauvegardez

### 2.5 Récupérer les clés Firebase

1. Firebase → Paramètres du projet (⚙️) → "Paramètres du projet"
2. Descendez jusqu'à "Vos applications"
3. Cliquez sur l'icône Web `</>`
4. Nom de l'app : `nom-client-web`
5. **Copiez les clés** qui apparaissent :

```javascript
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

### 2.6 Configurer Firebase Admin

1. Firebase → Paramètres du projet → "Comptes de service"
2. Cliquez "Générer une nouvelle clé privée"
3. **Téléchargez le fichier JSON**
4. Ouvrez-le et copiez :
   - `project_id`
   - `client_email`
   - `private_key` (toute la clé avec `-----BEGIN PRIVATE KEY-----`)

**⏱️ Temps : 15 minutes**

---

## 💳 Étape 3 : Configuration Stripe

### 3.1 Créer un compte Stripe

1. Allez sur https://dashboard.stripe.com/register
2. Créez un compte
3. **Restez en mode TEST** (ne passez pas en production)

### 3.2 Récupérer les clés API

1. Dashboard Stripe → "Developers" → "API keys"
2. **Mode TEST activé** (bascule en haut à droite)
3. Copiez :
   - **Publishable key** : `pk_test_...`
   - **Secret key** : `sk_test_...` (cliquez "Reveal")

### 3.3 Créer le webhook (APRÈS déploiement Vercel)

**Note** : Cette étape se fait APRÈS avoir déployé sur Vercel (étape 5)

1. Stripe → "Developers" → "Webhooks"
2. Cliquez "+ Add endpoint"
3. **Endpoint URL** : `https://nom-client.vercel.app/api/webhooks/stripe`
4. **Events to send** :
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Cliquez "Add endpoint"
6. Copiez le **Signing secret** : `whsec_...`

**⏱️ Temps : 10 minutes**

---

## 📧 Étape 4 : Configuration Email

### Option A : Gmail (Simple, gratuit)

1. Créez un compte Gmail dédié : `contact@nom-client.com` (via Google Workspace)
2. Activez la validation en 2 étapes
3. Générez un "Mot de passe d'application" :
   - Google Account → Sécurité → Validation en 2 étapes → Mots de passe d'application
   - App : "Mail"
   - Appareil : "Autre" → "CMS E-commerce"
   - **Copiez le mot de passe** (16 caractères)

### Option B : Resend (Professionnel, 100 emails/jour gratuit)

1. Créez un compte sur https://resend.com
2. API Keys → "Create API Key"
3. Nom : `nom-client-production`
4. Permission : "Sending access"
5. **Copiez la clé** : `re_...`

**⏱️ Temps : 10 minutes**

---

## 🚀 Étape 5 : Déploiement Vercel

### 5.1 Connecter GitHub à Vercel

1. Allez sur https://vercel.com/login
2. Connectez-vous avec GitHub
3. Cliquez "Add New..." → "Project"
4. Importez le repository `nom-client-ecommerce`

### 5.2 Configurer le projet

**Framework Preset** : Next.js (auto-détecté)

**Build Settings** :
- Build Command : `npm run build`
- Output Directory : `.next`
- Install Command : `npm install`

### 5.3 Ajouter les variables d'environnement

Cliquez sur "Environment Variables" :

**Variables Firebase** :
```
NEXT_PUBLIC_FIREBASE_API_KEY=votre_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=votre_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=votre_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=votre_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=votre_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=votre_app_id
```

**Variables Stripe** :
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... (À ajouter APRÈS création du webhook)
```

**Variables Email (Gmail)** :
```
GMAIL_USER=contact@nom-client.com
ADMIN_NOTIFICATION_EMAIL=admin@nom-client.com
GMAIL_APP_PASSWORD=votre_mot_de_passe_app_16_caracteres
```

**OU Variables Email (Resend)** :
```
RESEND_API_KEY=re_...
```

**Variables Firebase Admin** :
```
FIREBASE_ADMIN_PROJECT_ID=votre_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@votre-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nVOTRE_CLE...\n-----END PRIVATE KEY-----
```

**Important** : Pour `FIREBASE_ADMIN_PRIVATE_KEY`, remplacez les retours à la ligne par `\n`

### 5.4 Déployer

1. Cliquez "Deploy"
2. Attendez 2-3 minutes
3. Notez l'URL : `https://nom-client.vercel.app`

### 5.5 Configurer le webhook Stripe

Maintenant que vous avez l'URL :

1. Retournez sur Stripe → Webhooks (voir Étape 3.3)
2. Créez le webhook avec l'URL Vercel
3. Copiez le Signing Secret
4. Vercel → Settings → Environment Variables
5. Éditez `STRIPE_WEBHOOK_SECRET` et collez le secret
6. Redéployez : Deployments → Redeploy

**⏱️ Temps : 20 minutes**

---

## 🎨 Étape 6 : Personnalisation

### 6.1 Créer le premier compte admin

1. Allez sur `https://nom-client.vercel.app`
2. Créez un compte avec l'email admin
3. Dans Firebase Console → Firestore → Collection `users`
4. Trouvez le document de l'utilisateur
5. Ajoutez un champ : `role` = `admin` (type: string)

### 6.2 Configurer les paramètres du site

1. Connectez-vous sur `/admin`
2. Allez dans "Paramètres du Site"
3. Configurez :
   - Nom de la boutique
   - Description
   - Email de contact
   - Réseaux sociaux
   - Informations de livraison

### 6.3 Personnaliser les couleurs

Éditez `src/app/globals.css` :

```css
:root {
  /* Couleurs principales du client */
  --color-primary: #2563eb; /* Bleu par défaut */
  --color-secondary: #1e40af;
  --color-accent: #3b82f6;

  /* Ou gardez noir/blanc neutre */
  --color-primary: #000000;
  --color-secondary: #1a1a1a;
  --color-accent: #404040;
}
```

### 6.4 Remplacer le logo

1. Placez le logo dans `public/logo.png`
2. Recommandé : 200x50px, fond transparent

### 6.5 Ajouter des catégories et produits

1. `/admin/categories` → Créez les catégories du client
2. `/admin/add-product` → Ajoutez les premiers produits

**⏱️ Temps : 30 minutes**

---

## ✅ Checklist Finale

### Vérifications techniques

- [ ] Site accessible sur l'URL Vercel
- [ ] Connexion admin fonctionne
- [ ] Ajout de produits fonctionne
- [ ] Catégories créées
- [ ] Processus de paiement testé (carte 4242 4242 4242 4242)
- [ ] Email de confirmation reçu
- [ ] Webhook Stripe fonctionne (commande passe en "paid")
- [ ] Health Check dans `/admin/system` : tout OK

### Vérifications visuelles

- [ ] Logo personnalisé
- [ ] Couleurs personnalisées
- [ ] Nom de la boutique correct
- [ ] Informations de contact à jour
- [ ] Images produits chargées

### Documents fournis au client

- [ ] URL du site
- [ ] Email/mot de passe admin
- [ ] Accès Firebase Console (owner)
- [ ] Accès Stripe Dashboard (owner)
- [ ] Guide utilisateur PDF
- [ ] Contrat de maintenance signé

---

## 🎓 Formation Client (2h)

### Session 1 : Interface Admin (1h)

1. **Tour du dashboard** (10 min)
   - Statistiques
   - Navigation

2. **Gestion des produits** (30 min)
   - Ajouter un produit
   - Modifier un produit
   - Upload d'images
   - Catégorisation

3. **Paramètres** (20 min)
   - Informations générales
   - Configuration email
   - Réseaux sociaux

### Session 2 : Gestion Quotidienne (1h)

1. **Commandes** (30 min)
   - Consulter les commandes
   - Statuts de livraison
   - Remboursements Stripe

2. **Maintenance** (20 min)
   - Health Check
   - Quand contacter le support
   - Procédure en cas de problème

3. **Questions/Réponses** (10 min)

---

## 🚨 Dépannage

### Problème : Site ne se charge pas

**Solution** :
1. Vercel → Deployments → Logs
2. Vérifier les erreurs de build
3. Vérifier les variables d'environnement

### Problème : Paiement ne fonctionne pas

**Solution** :
1. Vérifier les clés Stripe (mode TEST)
2. Vérifier le webhook Stripe
3. Tester avec carte 4242 4242 4242 4242

### Problème : Emails non reçus

**Solution** :
1. Vérifier GMAIL_USER et GMAIL_APP_PASSWORD
2. Vérifier les spams
3. Tester avec un autre email

### Problème : Impossible de se connecter admin

**Solution** :
1. Firebase → Firestore → Collection `users`
2. Vérifier le champ `role` = `admin`

---

## 📞 Support

**En cas de problème** :
- Email : support@votre-email.com
- Documentation : Lien vers vos docs
- Délai de réponse : < 12h (jours ouvrés)

---

## 🎯 Temps Total Estimé

- Préparation : 30 min
- Configuration Firebase : 15 min
- Configuration Stripe : 10 min
- Configuration Email : 10 min
- Déploiement Vercel : 20 min
- Personnalisation : 30 min
- Formation client : 2h

**Total : ~4 heures** (installation + formation)

---

## 📚 Ressources Complémentaires

- [Guide de vente](VENTE-CMS-GUIDE.md)
- [Contrat de maintenance](CONTRAT-MAINTENANCE.md)
- [Workflow développement](WORKFLOW-DEV.md)

---

**Document créé** : 2025-12-06
**Version** : 1.0
