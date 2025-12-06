# 🚀 Guide de Déploiement sur Vercel (Mode Test Stripe)

> **Documentation complète pour déployer GwadaEcom sur Vercel en gardant Stripe en mode test**

**Dernière mise à jour** : 2025-12-06
**Temps estimé** : 15-20 minutes
**Niveau** : Débutant

---

## 📋 Table des Matières

1. [Prérequis](#prérequis)
2. [Préparation du projet](#préparation-du-projet)
3. [Créer le projet sur Vercel](#créer-le-projet-sur-vercel)
4. [Configurer les variables d'environnement](#configurer-les-variables-denvironnement)
5. [Déployer le site](#déployer-le-site)
6. [Configurer le webhook Stripe](#configurer-le-webhook-stripe)
7. [Tester le déploiement](#tester-le-déploiement)
8. [Dépannage](#dépannage)

---

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir :

- ✅ Un compte GitHub avec votre projet GwadaEcom
- ✅ Un compte Vercel (gratuit) - [Créer un compte](https://vercel.com/signup)
- ✅ Un compte Stripe (mode test) - Déjà configuré
- ✅ Node.js installé localement (pour le script de copie)

---

## 📦 Étape 1 : Préparation du Projet

### 1.1 Vérifier que tout est committé sur GitHub

```bash
git status
git add .
git commit -m "feat: préparation déploiement Vercel"
git push origin main
```

### 1.2 Générer la liste des variables d'environnement

**Exécutez le script pour copier vos variables** :

```bash
node scripts/copy-env-for-vercel.js
```

Ce script affiche :
- ✅ La liste de toutes vos variables d'environnement
- ✅ Le format pour le dashboard Vercel (copier/coller)
- ✅ Les commandes Vercel CLI (alternative)

**💡 IMPORTANT** : **Gardez cette fenêtre de terminal ouverte** - vous en aurez besoin pour copier les valeurs !

---

## 🌐 Étape 2 : Créer le Projet sur Vercel

### 2.1 Connexion à Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur **"Sign Up"** (ou "Log In")
3. Connectez-vous avec **GitHub** (recommandé)

### 2.2 Importer le projet

1. Dashboard Vercel → **"Add New..."** → **"Project"**
2. Trouvez votre dépôt **gwadaecom**
3. Cliquez sur **"Import"**

### 2.3 Configuration du projet

**Framework Preset** : Next.js (détecté automatiquement)

**Build Settings** :
- Build Command : `npm run build`
- Output Directory : `.next`
- Install Command : `npm install`

✅ **Ne cliquez PAS encore sur "Deploy"** - On doit d'abord ajouter les variables d'environnement !

---

## 🔐 Étape 3 : Configurer les Variables d'Environnement

### 3.1 Accéder aux variables d'environnement

Sur la page d'import, cliquez sur **"Environment Variables"** (section dépliable)

### 3.2 Ajouter les variables

**Option recommandée : Ajout en bloc**

1. Cliquez sur **"Add Environment Variables"**
2. Sélectionnez **"Plaintext"** (en haut à droite)
3. **Copiez-collez** la sortie du script `copy-env-for-vercel.js` (section "FORMAT POUR DASHBOARD VERCEL")
4. Sélectionnez **"Production"**
5. Cliquez sur **"Add"**

**Variables nécessaires** (16 au total) :
- Firebase (6 variables : `NEXT_PUBLIC_FIREBASE_*`)
- Stripe MODE TEST (3 variables : `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`)
- Gmail SMTP (3 variables : `GMAIL_USER`, `ADMIN_NOTIFICATION_EMAIL`, `GMAIL_APP_PASSWORD`)
- Firebase Admin (3 variables : `FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_CLIENT_EMAIL`, `FIREBASE_ADMIN_PRIVATE_KEY`)
- Resend (optionnel : `RESEND_API_KEY`)

---

## 🚀 Étape 4 : Déployer le Site

### 4.1 Lancer le déploiement

1. Vérifiez que **toutes les variables** sont ajoutées
2. Cliquez sur **"Deploy"**
3. Attendez la fin du build (2-5 minutes)

### 4.2 Récupérer l'URL de production

Une fois déployé, **notez votre URL** :
- Ex: `https://gwadaecom.vercel.app`

**💡 Vous en aurez besoin pour configurer le webhook Stripe !**

---

## 🔗 Étape 5 : Configurer le Webhook Stripe

### 5.1 Créer le webhook

1. Allez sur [dashboard.stripe.com/test/webhooks](https://dashboard.stripe.com/test/webhooks)
2. Assurez-vous d'être en **mode TEST**
3. Cliquez sur **"+ Add endpoint"**
4. **Endpoint URL** : `https://VOTRE-SITE.vercel.app/api/webhooks/stripe`
5. **Événements** : Sélectionnez :
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
6. Cliquez sur **"Add endpoint"**

### 5.2 Récupérer le Signing Secret

1. Cliquez sur le webhook que vous venez de créer
2. Section **"Signing secret"** → Cliquez sur **"Reveal"**
3. **Copiez le secret** (commence par `whsec_...`)

### 5.3 Mettre à jour Vercel

1. Dashboard Vercel → Votre projet → **Settings** → **Environment Variables**
2. Trouvez `STRIPE_WEBHOOK_SECRET` → **Éditez**
3. Collez le **nouveau** Signing Secret
4. **Redéployez** : Deployments → Redeploy

⚠️ **IMPORTANT** : Les variables ne sont appliquées qu'après un redéploiement !

---

## ✅ Étape 6 : Tester le Déploiement

### 6.1 Test complet du paiement

1. Allez sur `https://votre-site.vercel.app`
2. Ajoutez un produit au panier
3. Passez commande en mode invité
4. Payez avec : **4242 4242 4242 4242**
5. Vérifiez :
   - ✅ Redirection vers `/order-confirmation`
   - ✅ Message "Commande confirmée"
   - ✅ Commande en statut `paid` dans Firestore
   - ✅ Email de confirmation reçu
   - ✅ Webhook "Succeeded" dans Stripe Dashboard

---

## 🐛 Étape 7 : Dépannage

### Problème : Site ne se charge pas
→ Vérifiez les logs Vercel : Dashboard → Deployments → Function Logs

### Problème : Paiement échoue
→ Vérifiez que toutes les variables Stripe sont présentes

### Problème : Webhook ne fonctionne pas
→ Vérifiez que `STRIPE_WEBHOOK_SECRET` correspond au secret Stripe et redéployez

### Problème : Commandes restent en "pending"
→ Le webhook n'est pas configuré correctement, voir [STRIPE-WEBHOOK-GUIDE.md](./STRIPE-WEBHOOK-GUIDE.md)

---

## 📚 Documentation Complète

- **Configuration webhook Stripe** : [STRIPE-WEBHOOK-GUIDE.md](./STRIPE-WEBHOOK-GUIDE.md)
- **Guide express** : [QUICKSTART-DEPLOY.md](./QUICKSTART-DEPLOY.md)

---

## 🎯 Important

- ✅ **Stripe reste en MODE TEST** (clés `pk_test_*` et `sk_test_*`)
- ✅ **Aucun paiement réel ne sera traité**
- ✅ **Utilisez toujours la carte 4242 pour tester**

---

## 🎉 Félicitations !

Votre site e-commerce est maintenant en ligne avec :
- ✅ Paiements Stripe (mode test)
- ✅ Webhooks configurés
- ✅ Emails fonctionnels
- ✅ Firebase intégré

**Dernière mise à jour** : 2025-12-06
**Version** : 1.0.0
