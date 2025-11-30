# Tests E2E avec Playwright

Documentation complète des tests End-to-End pour l'application Gwadaecom.

## 📋 Table des matières

- [Installation](#installation)
- [Lancer les tests](#lancer-les-tests)
- [Structure des tests](#structure-des-tests)
- [Tests disponibles](#tests-disponibles)
- [Bonnes pratiques](#bonnes-pratiques)

## 🚀 Installation

Les dépendances Playwright sont déjà installées. Si vous avez besoin de réinstaller les navigateurs :

```bash
npx playwright install
```

## ▶️ Lancer les tests

### Mode headless (par défaut)
```bash
npm test
```

### Mode UI (interface graphique interactive)
```bash
npm run test:ui
```

### Mode headed (voir le navigateur)
```bash
npm run test:headed
```

### Mode debug (pas à pas avec inspecteur)
```bash
npm run test:debug
```

### Voir le rapport HTML
```bash
npm run test:report
```

### Lancer un seul fichier de test
```bash
npx playwright test e2e/navigation.spec.js
```

### Lancer un seul test
```bash
npx playwright test -g "devrait afficher la page d'accueil"
```

## 📁 Structure des tests

```
e2e/
├── navigation.spec.js         # Tests de navigation générale
├── cart.spec.js              # Tests du panier d'achat
├── admin-products.spec.js    # Tests CRUD produits (admin)
├── admin-categories.spec.js  # Tests CRUD catégories (admin)
└── README.md                 # Cette documentation
```

## 🧪 Tests disponibles

### 1. Navigation (`navigation.spec.js`)

**Tests généraux :**
- ✅ Affichage de la page d'accueil
- ✅ Navigation dans les catégories
- ✅ Accès au tableau de bord admin

**Tests des boutons retour :**
- ✅ Bouton retour sur page Produits → Dashboard
- ✅ Bouton retour sur page Catégories → Dashboard
- ✅ Bouton retour sur page Paramètres → Dashboard
- ✅ Bouton retour sur page Ajouter un Produit

**Tests section Commercial :**
- ✅ Navigation vers Statistiques + retour
- ✅ Navigation vers Commandes + retour
- ✅ Navigation vers Partenaires + retour
- ✅ Navigation vers Fournisseurs + retour
- ✅ Navigation vers Facturation + retour

### 2. Panier (`cart.spec.js`)

**Fonctionnalités de base :**
- ✅ Ouvrir et fermer le panier
- ✅ Affichage "Panier vide"

**Ajout et suppression :**
- ✅ Ajouter un produit depuis la page d'accueil

**Calcul du total :**
- ✅ Vérification du calcul du total

### 3. Admin - Produits (`admin-products.spec.js`)

**Liste des produits :**
- ✅ Affichage de la page de gestion
- ✅ Bouton "Ajouter un Produit"
- ✅ Basculement entre vue grille et tableau

**Recherche et filtres :**
- ✅ Recherche par nom
- ✅ Filtre par catégorie

**Ajout de produit :**
- ✅ Affichage du formulaire
- ✅ Validation des champs requis
- ✅ Annulation de l'ajout

**Modification et suppression :**
- ✅ Affichage des boutons modifier
- ✅ Affichage des boutons supprimer

### 4. Admin - Catégories (`admin-categories.spec.js`)

**Liste des catégories :**
- ✅ Affichage de la page de gestion
- ✅ Bouton "Nouvelle Catégorie"

**Ajout de catégorie :**
- ✅ Affichage du formulaire
- ✅ Vérification des champs
- ✅ Annulation de l'ajout

**Gestion :**
- ✅ Boutons de modification
- ✅ Boutons de visibilité
- ✅ Boutons de suppression
- ✅ Compteur de catégories

## ✅ Bonnes pratiques

### Avant de commencer les tests
1. Assurez-vous que Firebase est configuré
2. Vérifiez que le serveur de développement fonctionne (`npm run dev`)
3. Vérifiez vos règles Firestore (accès lecture/écriture)

### Écrire de nouveaux tests

**Structure recommandée :**
```javascript
import { test, expect } from '@playwright/test';

test.describe('Nom du groupe de tests', () => {
  test.beforeEach(async ({ page }) => {
    // Préparation avant chaque test
    await page.goto('/');
  });

  test('devrait faire quelque chose', async ({ page }) => {
    // Arrange
    await page.goto('/ma-page');

    // Act
    await page.click('button');

    // Assert
    await expect(page.locator('h1')).toBeVisible();
  });
});
```

### Sélecteurs recommandés

**Ordre de préférence :**
1. `data-testid` (le plus fiable)
   ```javascript
   page.locator('[data-testid="mon-element"]')
   ```

2. Rôle ARIA
   ```javascript
   page.getByRole('button', { name: 'Ajouter' })
   ```

3. Texte visible
   ```javascript
   page.locator('text=Mon texte')
   ```

4. ID ou classe (en dernier recours)
   ```javascript
   page.locator('#mon-id')
   ```

### Attendre les éléments

**Playwright attend automatiquement**, mais si nécessaire :

```javascript
// Attendre qu'un élément soit visible
await expect(page.locator('h1')).toBeVisible();

// Attendre un délai fixe (éviter si possible)
await page.waitForTimeout(1000);

// Attendre une navigation
await page.waitForURL('/nouvelle-page');
```

### Gestion des erreurs Firestore

Si vos tests échouent à cause de Firestore :

1. Vérifiez les règles Firestore
2. Assurez-vous que les collections existent
3. Utilisez des timeouts généreux pour les requêtes réseau

```javascript
await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
```

## 🐛 Déboguer les tests

### Voir les tests en temps réel
```bash
npm run test:headed
```

### Mode debug avec inspecteur
```bash
npm run test:debug
```

### Ajouter des points d'arrêt
```javascript
test('mon test', async ({ page }) => {
  await page.goto('/');
  await page.pause(); // 👈 Point d'arrêt
  await page.click('button');
});
```

### Prendre des captures d'écran
```javascript
await page.screenshot({ path: 'debug.png' });
```

### Afficher les logs
```javascript
page.on('console', msg => console.log('Browser log:', msg.text()));
```

## 📊 Rapport de tests

Après avoir lancé les tests, ouvrez le rapport HTML :

```bash
npm run test:report
```

Le rapport contient :
- ✅ Liste de tous les tests
- 📸 Captures d'écran des échecs
- 🎥 Traces vidéo (si activées)
- ⏱️ Durée d'exécution

## 🔄 CI/CD

Pour exécuter les tests en CI (GitHub Actions, GitLab CI, etc.) :

```yaml
- name: Install Playwright
  run: npx playwright install --with-deps

- name: Run tests
  run: npm test
```

## 📝 Notes importantes

- Les tests utilisent `http://localhost:3000` par défaut
- Le serveur Next.js est démarré automatiquement avant les tests
- Les tests s'exécutent en parallèle pour plus de rapidité
- Les captures d'écran sont prises uniquement en cas d'échec

## 🆘 Aide

Si vous rencontrez des problèmes :

1. Vérifiez que tous les services sont démarrés (Firebase, Next.js)
2. Lisez les logs d'erreur dans le terminal
3. Utilisez le mode debug : `npm run test:debug`
4. Consultez la documentation Playwright : https://playwright.dev

---

**Dernière mise à jour :** 2025-11-30
