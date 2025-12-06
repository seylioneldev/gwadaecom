# 🛍️ CMS E-commerce Next.js

**Solution e-commerce complète et prête à l'emploi**

---

## ✨ Fonctionnalités

### Interface Client
- ✅ Catalogue de produits responsive
- ✅ Panier d'achat
- ✅ Paiement sécurisé Stripe
- ✅ Authentification utilisateur
- ✅ Suivi de commandes
- ✅ Emails transactionnels

### Interface Admin (`/admin`)
- ✅ Gestion des produits et catégories
- ✅ Tableau de bord statistiques
- ✅ Gestion des commandes
- ✅ Paramètres du site
- ✅ Gestion utilisateurs
- ✅ Monitoring système

---

## 🚀 Installation Rapide

### Prérequis

- Node.js 18+
- Compte Firebase
- Compte Stripe (mode test)
- Compte Vercel

### Étapes

1. **Cloner le projet**
   ```bash
   git clone -b share-bones https://github.com/VOTRE-REPO/cms-ecommerce.git
   cd cms-ecommerce
   npm install
   ```

2. **Configurer les variables d'environnement**

   Créez `.env.local` avec vos clés :
   ```env
   # Firebase
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...

   # Stripe
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...

   # Email
   GMAIL_USER=...
   GMAIL_APP_PASSWORD=...
   ```

3. **Lancer en local**
   ```bash
   npm run dev
   ```

4. **Déployer sur Vercel**
   - Connectez votre repository GitHub
   - Configurez les variables d'environnement
   - Déployez !

---

## 📚 Documentation Complète

**Guide d'installation détaillé** : [INSTALLATION-CLIENT.md](INSTALLATION-CLIENT.md)
- Installation pas à pas (4h)
- Configuration Firebase, Stripe, Vercel
- Personnalisation
- Formation

**Autres guides** :
- [DEPLOIEMENT-VERCEL.md](DEPLOIEMENT-VERCEL.md) - Déploiement Vercel
- [WORKFLOW-DEV.md](WORKFLOW-DEV.md) - Workflow développement
- [CMS_README.md](CMS_README.md) - Documentation technique

---

## 🛠️ Technologies

- **Framework** : Next.js 16 (App Router)
- **Base de données** : Firebase Firestore
- **Authentification** : Firebase Auth
- **Paiements** : Stripe
- **Hébergement** : Vercel
- **Emails** : Gmail SMTP ou Resend
- **Styling** : Tailwind CSS

---

## 🎨 Personnalisation

### Changer les couleurs

Éditez `src/app/globals.css` :
```css
:root {
  --color-primary: #votre-couleur;
  --color-secondary: #votre-couleur;
}
```

### Remplacer le logo

Placez votre logo dans `public/logo.png` (200x50px recommandé)

### Configurer le site

Allez sur `/admin/settings` après le premier déploiement

---

## 📞 Support

Pour toute question :
- 📧 Email : support@votre-email.com
- 📚 Documentation : [INSTALLATION-CLIENT.md](INSTALLATION-CLIENT.md)

---

## ⚠️ Mode Test

**Par défaut, Stripe est en MODE TEST** :
- Utilisez les clés `pk_test_*` et `sk_test_*`
- Testez avec la carte : `4242 4242 4242 4242`
- Aucun paiement réel ne sera effectué

---

## 📄 Licence

Ce CMS est fourni dans le cadre d'un contrat de licence.
Contactez votre fournisseur pour plus d'informations.

---

**Version** : 1.0
**Branche** : share-bones
