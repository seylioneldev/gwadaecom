# Références des Images Utilisées

Ce document liste toutes les images utilisées dans la configuration du thème "Perles des Îles".

---

## Images Actuelles (Unsplash)

### 1. Hero Background
**URL** : `https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=1920&h=800&fit=crop`

**Description** : Bijoux artisanaux
**Dimensions** : 1920x800px
**Usage** : Arrière-plan de la section Hero
**Effets appliqués** :
- Flou : 3
- Assombrissement : 25%

**Alternative** : Remplacer par une photo de vos propres créations guadeloupéennes

---

### 2. Image Block
**URL** : `https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=600&fit=crop`

**Description** : Bijoux et perles
**Dimensions** : 800x600px
**Usage** : Bloc image "Artisanat d'Exception"
**Effets appliqués** : Aucun

**Alternative** : Photo de votre atelier à Pointe-à-Pitre ou de vos outils de travail

---

### 3. Newsletter Background
**URL** : `https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&h=600&fit=crop`

**Description** : Bijoux élégants
**Dimensions** : 1920x600px
**Usage** : Arrière-plan de la section Newsletter
**Effets appliqués** :
- Flou : 4
- Assombrissement : 50%

**Alternative** : Photo lifestyle de bijoux portés en Guadeloupe

---

## 📸 Recommandations pour Photos Personnalisées

### Photos Produits
- **Format** : JPEG ou WebP optimisé
- **Dimensions recommandées** : 1200x1200px (carré)
- **Fond** : Blanc ou neutre
- **Éclairage** : Naturel ou lumière diffuse
- **Détails** : Photos haute résolution montrant les détails

### Photos d'Ambiance
- **Hero** : 1920x800px minimum
- **Newsletter** : 1920x600px minimum
- **Story/Image Block** : 800x600px minimum

### Conseils Photo
1. Utilisez un fond neutre (blanc, beige, bois clair)
2. Éclairage naturel de préférence
3. Montrez les détails et textures
4. Incluez des photos lifestyle (bijoux portés)
5. Capturez l'ambiance caribéenne

---

## 🎯 Idées de Photos à Créer

### Photos de Produits
- [ ] Colliers sur fond blanc
- [ ] Bracelets avec détails de perles
- [ ] Boucles d'oreilles (paire)
- [ ] Ensembles coordonnés
- [ ] Gros plans sur les détails artisanaux

### Photos d'Ambiance
- [ ] Atelier de création à Pointe-à-Pitre
- [ ] Mains d'artisan au travail
- [ ] Matériaux et outils traditionnels
- [ ] Bijoux portés en situation (plage, ville)
- [ ] Packaging et présentation

### Photos Lifestyle
- [ ] Modèle portant les bijoux en Guadeloupe
- [ ] Scènes de vie caribéenne
- [ ] Détails culturels locaux
- [ ] Paysages inspirants de l'île

---

## 🔄 Comment Remplacer les Images

### Via le Script
Modifiez le fichier `scripts/update-theme-settings.js` :

```javascript
// Exemple pour changer l'image Hero
heroBgImageUrl: "https://votre-nouveau-lien.com/image.jpg",

// Exemple pour changer l'image bloc
imageBlockImageUrl: "https://votre-nouveau-lien.com/image2.jpg",

// Exemple pour changer l'image newsletter
newsletterBgImageUrl: "https://votre-nouveau-lien.com/image3.jpg",
```

Puis exécutez :
```bash
npm run update-theme
```

### Via Firebase Console
1. Allez sur Firebase Console
2. Firestore Database
3. Collection `settings` > Document `general`
4. Modifiez les champs :
   - `homepage.imageBlockImageUrl`
   - `customStyles.homepageBlocks.heroBgImageUrl`
   - `customStyles.homepageBlocks.newsletterBgImageUrl`

---

## 📦 Hébergement des Images

### Options Recommandées

1. **Firebase Storage** (Recommandé)
   - Intégré à votre projet
   - CDN rapide
   - Gratuit jusqu'à 5GB

2. **Cloudinary**
   - Optimisation automatique
   - Transformations d'images
   - Free tier généreux

3. **Unsplash** (Temporaire)
   - Gratuit et haute qualité
   - À remplacer par vos propres photos

---

## ✅ Checklist Images

- [ ] Remplacer les images Unsplash par des photos réelles
- [ ] Optimiser les images (compression, format WebP)
- [ ] Uploader sur Firebase Storage ou Cloudinary
- [ ] Mettre à jour les URLs dans Firestore
- [ ] Vérifier le rendu sur mobile et desktop
- [ ] Tester les temps de chargement

---

## 🎨 Cohérence Visuelle

Pour maintenir l'identité visuelle "Perles des Îles" :

- **Couleurs dominantes** : Or, noir, beige
- **Style** : Élégant, artisanal, authentique
- **Ambiance** : Caribéenne, chaleureuse, premium
- **Focus** : Détails, savoir-faire, tradition

---

**Dernière mise à jour** : 5 décembre 2025
