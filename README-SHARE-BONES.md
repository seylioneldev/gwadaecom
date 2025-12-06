# 🦴 CMS E-commerce - Version Share-Bones

**Version squelette neutre prête à être clonée pour vos clients**

---

## 🎯 À propos de cette branche

Cette branche `share-bones` contient une version **neutre** du CMS, sans votre design personnalisé :

- ✅ Design noir/blanc/gris minimaliste
- ✅ Données mockées (exemples)
- ✅ Prête à être personnalisée par le client
- ✅ Toutes les fonctionnalités intactes

**NE PAS utiliser cette branche pour votre propre site !**

---

## 🎨 Différences avec la branche `main`

| Aspect | main (GwadaEcom) | share-bones (Client) |
|--------|------------------|----------------------|
| **Couleurs** | Or #D4AF37 + Noir | Noir/Blanc/Gris |
| **Logo** | Perles des Îles | Logo générique |
| **Nom** | GwadaEcom | "Ma Boutique" (mockup) |
| **Produits** | Vos vrais produits | Produits d'exemple |
| **Design** | Premium 2025 | Minimaliste neutre |

---

## 📦 Installation pour un Client

**Suivez le guide complet** : [INSTALLATION-CLIENT.md](INSTALLATION-CLIENT.md)

### Démarrage rapide

```bash
# 1. Cloner cette branche
git clone -b share-bones https://github.com/VOTRE-USERNAME/gwadaecom.git nom-client-ecommerce

cd nom-client-ecommerce

# 2. Installer les dépendances
npm install

# 3. Configurer les variables (.env.local)
cp .env.example .env.local
# Éditer .env.local avec les clés du client

# 4. Lancer en local
npm run dev

# 5. Pousser vers le repo du client
git remote set-url origin https://github.com/CLIENT/nouveau-repo.git
git push -u origin share-bones
git checkout -b main
git push -u origin main
```

---

## ⚙️ Configuration Requise

### Variables d'environnement obligatoires

Créez un fichier `.env.local` :

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Stripe (MODE TEST)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (Gmail ou Resend)
GMAIL_USER=
ADMIN_NOTIFICATION_EMAIL=
GMAIL_APP_PASSWORD=

# Firebase Admin
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=
```

---

## 🎨 Personnalisation

### 1. Changer les couleurs

Éditez `src/app/globals.css` :

```css
:root {
  --color-primary: #votre-couleur;
  --color-secondary: #votre-couleur;
}
```

### 2. Remplacer le logo

Placez votre logo dans `public/logo.png`

### 3. Modifier le nom de la boutique

Allez sur `/admin/settings` après le premier déploiement

### 4. Ajouter vos produits

1. Créez vos catégories : `/admin/categories`
2. Ajoutez vos produits : `/admin/add-product`

---

## 🚀 Déploiement

### Vercel (Recommandé)

1. Connectez votre repository GitHub à Vercel
2. Configurez les variables d'environnement
3. Déployez !

**Guide complet** : [DEPLOIEMENT-VERCEL.md](DEPLOIEMENT-VERCEL.md)

---

## 📚 Documentation

- [Guide d'installation client](INSTALLATION-CLIENT.md) - Installation complète (4h)
- [Guide de déploiement Vercel](DEPLOIEMENT-VERCEL.md) - Déploiement pas à pas
- [Guide workflow développement](WORKFLOW-DEV.md) - Git et branches
- [Documentation CMS](CMS_README.md) - Fonctionnalités techniques

---

## 🛠️ Fonctionnalités Incluses

### Interface Client
- ✅ Catalogue produits avec filtres
- ✅ Panier d'achat
- ✅ Paiement sécurisé Stripe
- ✅ Authentification utilisateur
- ✅ Suivi de commandes
- ✅ Page de confirmation

### Interface Admin (`/admin`)
- ✅ Gestion des produits
- ✅ Gestion des catégories
- ✅ Paramètres du site
- ✅ Gestion des commandes
- ✅ Statistiques
- ✅ Gestion des utilisateurs
- ✅ Système & Maintenance

### Fonctionnalités Techniques
- ✅ Next.js 16.0.7 (App Router)
- ✅ Firebase Firestore (base de données)
- ✅ Firebase Authentication
- ✅ Stripe Payment Intent
- ✅ Webhooks Stripe
- ✅ Emails transactionnels
- ✅ Responsive design
- ✅ Health check système
- ✅ Mode maintenance

---

## ⚠️ Important

### Ce qui est en MODE TEST

- **Stripe** : Utilisez les clés de test `pk_test_*` et `sk_test_*`
- **Paiements** : Utilisez la carte test `4242 4242 4242 4242`
- **Emails** : Configurez un compte SMTP dédié

### Ne jamais mettre en production sans

- [ ] Passer Stripe en mode production
- [ ] Configurer un nom de domaine personnalisé
- [ ] Activer HTTPS
- [ ] Configurer les sauvegardes Firebase
- [ ] Mettre en place le monitoring

---

## 🆘 Support

Pour toute question lors de l'installation :

1. Consultez [INSTALLATION-CLIENT.md](INSTALLATION-CLIENT.md)
2. Vérifiez les logs Vercel
3. Testez le Health Check : `/admin/system`
4. Contactez le support : support@votre-email.com

---

## 📄 Licence

Ce CMS est fourni dans le cadre d'un contrat de licence.
Voir [CONTRAT-MAINTENANCE.md](CONTRAT-MAINTENANCE.md) pour les détails.

---

## 🔄 Mises à Jour

Cette branche est maintenue séparément de `main` et `dev`.

**Pour mettre à jour** :
1. Les mises à jour de sécurité sont appliquées régulièrement
2. Les nouvelles fonctionnalités sont ajoutées sur demande
3. Le design reste neutre intentionnellement

---

**Version** : 1.0
**Dernière mise à jour** : 2025-12-06
**Branche** : share-bones
**Status** : Prêt pour production
