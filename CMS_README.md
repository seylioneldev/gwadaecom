# 🚀 CMS Réutilisable - Guide Complet

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture du CMS](#architecture-du-cms)
3. [Fichiers du CMS](#fichiers-du-cms)
4. [Installation sur un Nouveau Projet](#installation-sur-un-nouveau-projet)
5. [Configuration](#configuration)
6. [Utilisation](#utilisation)
7. [Pages Admin](#pages-admin)
8. [Personnalisation](#personnalisation)
9. [FAQ](#faq)

---

## 🎯 Vue d'ensemble

Ce CMS (Content Management System) est un système de gestion de contenu complet et réutilisable pour boutiques en ligne Next.js avec Firebase Firestore.

### Fonctionnalités principales :

✅ **Gestion des produits** : Ajouter, modifier, supprimer des produits
✅ **Gestion des catégories** : Créer et organiser le menu de navigation
✅ **Paramètres du site** : Configurer les informations générales
✅ **Interface admin intuitive** : Pages dédiées pour chaque section
✅ **Temps réel** : Toutes les modifications sont appliquées immédiatement
✅ **100% réutilisable** : Transférable sur n'importe quel projet

---

## 🏗️ Architecture du CMS

```
gwadaecom/
├── cms.config.js                      # ⭐ Configuration centralisée
│
├── src/
│   ├── hooks/
│   │   ├── useProducts.js            # Hook pour les produits
│   │   ├── useCategories.js          # Hook pour les catégories
│   │   └── useSettings.js            # Hook pour les paramètres
│   │
│   ├── app/
│   │   └── admin/
│   │       ├── page.js               # Ajout de produits
│   │       ├── products/page.js      # Gestion des produits
│   │       ├── categories/page.js    # Gestion des catégories
│   │       └── settings/page.js      # Paramètres généraux
│   │
│   └── lib/
│       └── firebase.js               # Configuration Firebase
│
└── CMS_README.md                      # Ce fichier
```

---

## 📦 Fichiers du CMS

### Fichiers essentiels à copier :

| Fichier | Description |
|---------|-------------|
| `cms.config.js` | Configuration centralisée (couleurs, collections, paramètres par défaut) |
| `src/hooks/useProducts.js` | Hook pour récupérer/modifier les produits |
| `src/hooks/useCategories.js` | Hook pour gérer les catégories du menu |
| `src/hooks/useSettings.js` | Hook pour les paramètres généraux |
| `src/app/admin/page.js` | Page d'ajout de produits |
| `src/app/admin/products/page.js` | Page de gestion des produits |
| `src/app/admin/categories/page.js` | Page de gestion des catégories |
| `src/app/admin/settings/page.js` | Page des paramètres |
| `CMS_README.md` | Documentation (ce fichier) |

---

## 🔧 Installation sur un Nouveau Projet

### Étape 1 : Copier les fichiers

```bash
# 1. Créer un nouveau projet Next.js
npx create-next-app@latest mon-nouveau-cms

# 2. Copier les fichiers du CMS
cp cms.config.js mon-nouveau-cms/
cp -r src/hooks mon-nouveau-cms/src/
cp -r src/app/admin mon-nouveau-cms/src/app/
cp CMS_README.md mon-nouveau-cms/
```

### Étape 2 : Installer Firebase

```bash
cd mon-nouveau-cms
npm install firebase
```

### Étape 3 : Configurer Firebase

1. Créer un projet Firebase : https://console.firebase.google.com/
2. Activer **Firestore Database** (mode test pour commencer)
3. Copier les clés de configuration

4. Créer le fichier `.env.local` :

```env
NEXT_PUBLIC_FIREBASE_API_KEY=votre_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=votre_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=votre_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=votre_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=votre_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=votre_app_id
```

5. Créer le fichier `src/lib/firebase.js` :

```javascript
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

### Étape 4 : Configurer les règles Firestore

Dans la console Firebase > Firestore Database > Règles :

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

    // Settings - Lecture publique, écriture admin
    match /settings/{settingId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Étape 5 : Installer les dépendances UI

```bash
npm install lucide-react
```

---

## ⚙️ Configuration

### Personnaliser `cms.config.js`

Ouvrez le fichier `cms.config.js` et modifiez :

```javascript
const cmsConfig = {
  // 1. INFORMATIONS DU PROJET
  project: {
    name: "Votre Boutique",        // ⬅️ Changez ici
    description: "Votre description",
    url: "https://votresite.com",
    logo: "/logo.png",
  },

  // 2. THÈME ET COULEURS
  theme: {
    primaryColor: "#5d6e64",        // ⬅️ Couleur principale
    primaryColorHover: "#4a5850",
    secondaryColor: "#E5E5E5",
    // ...
  },

  // 3. CATÉGORIES PAR DÉFAUT
  defaultCategories: [
    { name: "Kitchen", slug: "kitchen", order: 1, visible: true },
    // ⬅️ Modifiez les catégories
  ],

  // 4. PARAMÈTRES PAR DÉFAUT
  defaultSettings: {
    siteName: "Votre Site",         // ⬅️ Nom du site
    email: "contact@votresite.com",
    // ...
  },
};
```

---

## 📖 Utilisation

### Accéder aux pages admin

| Page | URL | Description |
|------|-----|-------------|
| Ajouter un produit | `/admin` | Formulaire d'ajout de produits |
| Gérer les produits | `/admin/products` | Liste, modifier, supprimer |
| Gérer les catégories | `/admin/categories` | Menu de navigation |
| Paramètres | `/admin/settings` | Informations générales |

### Utiliser les hooks dans vos composants

```javascript
import { useProducts } from '@/hooks/useProducts';

function ProductList() {
  const { products, loading, error } = useProducts();

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

---

## 🎨 Pages Admin

### 1. `/admin` - Ajouter un Produit

Formulaire complet pour ajouter un nouveau produit :
- Nom, prix, catégorie
- Description
- Image (URL ou couleur Tailwind)
- Label optionnel

### 2. `/admin/products` - Gérer les Produits

- **Mode grille** : Vue visuelle avec miniatures
- **Mode tableau** : Vue détaillée pour édition rapide
- **Recherche** : Par nom ou description
- **Filtre** : Par catégorie
- **Modification** : Édition inline dans le tableau
- **Suppression** : Avec confirmation

### 3. `/admin/categories` - Gérer les Catégories

- **Ajouter** : Nouvelle catégorie avec nom, slug, ordre
- **Modifier** : Édition inline
- **Visibilité** : Masquer/afficher dans le menu
- **Réorganiser** : Changer l'ordre d'affichage
- **Supprimer** : Avec confirmation

### 4. `/admin/settings` - Paramètres

4 sections :
- **Informations générales** : Nom, description, contact
- **Réseaux sociaux** : Facebook, Instagram, Twitter
- **Boutique** : Devise, frais de port, TVA
- **Page d'accueil** : Titres hero, options d'affichage

---

## 🎛️ Personnalisation

### Ajouter un nouveau champ produit

1. Ouvrez `cms.config.js`
2. Ajoutez le champ dans `productFields` :

```javascript
productFields: {
  optional: [
    // ... champs existants
    { name: "weight", label: "Poids (kg)", type: "number" },
  ],
}
```

3. Modifiez le formulaire dans `src/app/admin/page.js`
4. Mettez à jour le hook `useProducts.js` si nécessaire

### Changer les couleurs

Éditez `cms.config.js` :

```javascript
theme: {
  primaryColor: "#FF5733",      // Nouvelle couleur
  primaryColorHover: "#C70039",
}
```

Puis remplacez `#5d6e64` par `{cmsConfig.theme.primaryColor}` dans vos composants.

### Ajouter une nouvelle collection Firestore

1. Ajoutez-la dans `cms.config.js` :

```javascript
collections: {
  products: "products",
  categories: "categories",
  settings: "settings",
  reviews: "reviews",  // ⬅️ Nouvelle collection
}
```

2. Créez un hook `useReviews.js`
3. Créez une page admin `src/app/admin/reviews/page.js`

---

## ❓ FAQ

### Comment ajouter un utilisateur admin ?

Pour le moment, le CMS n'a pas d'authentification. Pour ajouter :

1. Installer Firebase Auth : `npm install firebase/auth`
2. Créer une page de connexion
3. Protéger les routes admin avec un middleware
4. Modifier les règles Firestore pour vérifier `request.auth != null`

### Puis-je utiliser MongoDB au lieu de Firestore ?

Oui, mais vous devrez :
1. Remplacer tous les imports Firebase dans les hooks
2. Adapter les fonctions CRUD (getDocs, addDoc, etc.)
3. Modifier `src/lib/firebase.js` pour MongoDB

### Comment déployer sur Vercel ?

```bash
# 1. Installer Vercel CLI
npm install -g vercel

# 2. Déployer
vercel

# 3. Ajouter les variables d'environnement dans le dashboard Vercel
```

### Les images ne s'affichent pas

Vérifiez que :
1. L'URL de l'image commence par `http://` ou `https://`
2. Le domaine de l'image est autorisé dans `next.config.js` :

```javascript
module.exports = {
  images: {
    domains: ['example.com', 'images.unsplash.com'],
  },
}
```

### Comment traduire en anglais ?

Remplacez tous les textes français dans :
- `src/app/admin/**/*.js`
- `cms.config.js`

---

## 🎉 Félicitations !

Vous avez maintenant un CMS complet et réutilisable pour vos projets e-commerce Next.js + Firebase !

**Créé le** : 2025-11-30
**Compatible avec** : Next.js 15, Firebase Firestore
**Licence** : Libre d'utilisation

---

## 📞 Support

Pour toute question ou suggestion :
- Créez une issue sur GitHub
- Consultez la documentation Firebase : https://firebase.google.com/docs

**Bon développement ! 🚀**
