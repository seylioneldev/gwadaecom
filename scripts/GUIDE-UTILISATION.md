# Guide d'Utilisation - Configuration du Thème

## Vue d'ensemble

Ce guide explique comment utiliser les scripts de configuration du thème "Perles des Îles" pour votre boutique de bijoux artisanaux.

---

## Prérequis

### 1. Variables d'environnement
Assurez-vous que votre fichier `.env.local` contient :

```env
FIREBASE_ADMIN_PROJECT_ID=votre-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=votre-client-email@...iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 2. Dépendances installées
```bash
npm install
```

---

## Commandes Disponibles

### 1. Mettre à jour le thème complet
```bash
npm run update-theme
```

**Ce que fait cette commande :**
- Se connecte à Firestore via Firebase Admin SDK
- Met à jour le document `settings/general`
- Applique toute la configuration du thème
- Affiche un résumé de la mise à jour
- Vérifie que les données ont bien été enregistrées

**Quand l'utiliser :**
- Première configuration du site
- Changement majeur de thème
- Réinitialisation des paramètres
- Mise à jour de plusieurs paramètres en une fois

---

### 2. Vérifier la configuration actuelle
```bash
npm run check-settings
```

**Ce que fait cette commande :**
- Lit le document Firestore actuel
- Affiche tous les paramètres configurés
- Format lisible et organisé par sections

**Quand l'utiliser :**
- Vérifier que la mise à jour a fonctionné
- Consulter la configuration actuelle
- Debug en cas de problème d'affichage
- Audit des paramètres

---

## Modification du Thème

### Option 1 : Via le script (Recommandé pour changements majeurs)

1. Ouvrez `scripts/update-theme-settings.js`
2. Modifiez les valeurs dans l'objet `themeSettings`
3. Exécutez `npm run update-theme`

**Exemple - Changer la couleur principale :**
```javascript
// Dans update-theme-settings.js
customStyles: {
  page: {
    backgroundColor: "#FEFEFE",
    primaryColor: "#D4AF37"  // ← Changez cette valeur
  }
}
```

### Option 2 : Via Firebase Console (Rapide pour petits changements)

1. Allez sur [Firebase Console](https://console.firebase.google.com)
2. Sélectionnez votre projet
3. Firestore Database
4. Collection `settings` → Document `general`
5. Cliquez sur "Modifier"
6. Modifiez les champs souhaités
7. Sauvegardez

---

## Scénarios d'Utilisation Courants

### Scénario 1 : Changer les couleurs du site

**Fichier** : `scripts/update-theme-settings.js`

**Sections à modifier :**
```javascript
customStyles: {
  page: {
    primaryColor: "#NOUVELLE_COULEUR"  // Couleur principale
  },
  header: {
    backgroundColor: "#NOUVELLE_COULEUR",  // Fond header
    promoBarBgColor: "#NOUVELLE_COULEUR"   // Fond barre promo
  },
  buttons: {
    primaryBgColor: "#NOUVELLE_COULEUR",      // Fond boutons
    primaryHoverBgColor: "#NOUVELLE_COULEUR"  // Hover boutons
  }
}
```

**Exécution :**
```bash
npm run update-theme
npm run check-settings  # Vérification
```

---

### Scénario 2 : Modifier le contenu de la page d'accueil

**Fichier** : `scripts/update-theme-settings.js`

**Sections à modifier :**
```javascript
homepage: {
  heroTitle: "Votre Nouveau Titre",
  heroSubtitle: "Votre nouveau sous-titre",
  storyTitle: "Nouveau titre de section",
  storyText: "Votre nouvelle histoire...",
  // etc.
}
```

**Exécution :**
```bash
npm run update-theme
```

---

### Scénario 3 : Ajouter/Modifier des témoignages

**Fichier** : `scripts/update-theme-settings.js`

**Section à modifier :**
```javascript
homepage: {
  testimonialsItems: [
    {
      name: "Nom du Client",
      text: "Son témoignage ici...",
      rating: 5
    },
    // Ajoutez plus de témoignages...
  ]
}
```

**Exécution :**
```bash
npm run update-theme
npm run check-settings  # Vérifiez le nombre de témoignages
```

---

### Scénario 4 : Changer les images

**Fichier** : `scripts/update-theme-settings.js`

**Sections à modifier :**
```javascript
homepage: {
  imageBlockImageUrl: "https://nouvelle-url.com/image.jpg"
},
customStyles: {
  homepageBlocks: {
    heroBgImageUrl: "https://nouvelle-url.com/hero.jpg",
    newsletterBgImageUrl: "https://nouvelle-url.com/newsletter.jpg"
  }
}
```

**Voir aussi :** `scripts/IMAGES-REFERENCES.md` pour plus de détails

**Exécution :**
```bash
npm run update-theme
```

---

### Scénario 5 : Modifier les informations de contact

**Fichier** : `scripts/update-theme-settings.js`

**Section à modifier :**
```javascript
siteName: "Nouveau Nom",
email: "nouveau@email.com",
phone: "+590 690 XX XX XX",
address: "Nouvelle adresse",
social: {
  facebook: "https://facebook.com/nouvelle-page",
  instagram: "https://instagram.com/nouvelle-page",
  twitter: "https://twitter.com/nouvelle-page"
}
```

**Exécution :**
```bash
npm run update-theme
```

---

### Scénario 6 : Réorganiser les blocs de la homepage

**Fichier** : `scripts/update-theme-settings.js`

**Section à modifier :**
```javascript
homepage: {
  layout: [
    { id: "hero", type: "hero", enabled: true },
    { id: "productGrid", type: "productGrid", enabled: true },  // Déplacé
    { id: "infoStrip", type: "infoStrip", enabled: false },     // Désactivé
    { id: "imageBlock", type: "imageBlock", enabled: true },
    { id: "testimonials", type: "testimonials", enabled: true },
    { id: "story", type: "story", enabled: true },
    { id: "newsletter", type: "newsletter", enabled: true }
  ]
}
```

**Astuce :** Changez `enabled: false` pour masquer un bloc

**Exécution :**
```bash
npm run update-theme
```

---

## Debugging

### Problème : "Variables d'environnement manquantes"

**Solution :**
1. Vérifiez que `.env.local` existe
2. Vérifiez les noms des variables (FIREBASE_ADMIN_*)
3. Redémarrez votre serveur de développement

---

### Problème : "Le document n'existe pas"

**Solution :**
1. Vérifiez que Firestore est activé dans Firebase
2. Vérifiez les permissions Firestore
3. Exécutez d'abord `npm run update-theme` pour créer le document

---

### Problème : "Les changements ne s'affichent pas"

**Solutions :**
1. Videz le cache du navigateur (Ctrl + Shift + R)
2. Vérifiez avec `npm run check-settings` que Firestore est bien à jour
3. Redémarrez le serveur Next.js (`npm run dev`)
4. Vérifiez que vos composants React lisent bien Firestore

---

## Workflow Recommandé

### Pour un changement mineur (1-2 paramètres)
```
1. Firebase Console → Modifier directement
2. Vérifier sur le site
3. Si OK, documenter le changement
```

### Pour un changement majeur (thème complet)
```
1. Modifier scripts/update-theme-settings.js
2. npm run update-theme
3. npm run check-settings (vérification)
4. Tester sur le site
5. Ajuster si nécessaire
6. Commit des changements
```

---

## Fichiers Importants

| Fichier | Description |
|---------|-------------|
| `scripts/update-theme-settings.js` | Script de mise à jour complet |
| `scripts/check-settings.js` | Script de vérification |
| `THEME-CONFIG.md` | Documentation du thème |
| `scripts/README.md` | Documentation des scripts |
| `scripts/IMAGES-REFERENCES.md` | Références des images |

---

## Sauvegarde et Restauration

### Créer une sauvegarde
```bash
# Via Firebase Console
Firestore → settings → general → Export
```

### Restaurer une sauvegarde
1. Copiez les anciennes valeurs
2. Collez-les dans `update-theme-settings.js`
3. Exécutez `npm run update-theme`

---

## Support

### Logs utiles
```bash
# Vérifier la configuration
npm run check-settings

# Logs Firebase Admin
# Voir dans la console lors de l'exécution des scripts
```

### En cas de problème
1. Vérifiez les variables d'environnement
2. Consultez les logs d'erreur
3. Vérifiez Firebase Console
4. Comparez avec `check-settings`

---

**Dernière mise à jour :** 5 décembre 2025
**Version :** 1.0.0
**Contact :** contact@perlesdesiles.com
