# Guide des Tests Playwright

## Vue d'ensemble

Ce dossier contient la suite complète de tests end-to-end (E2E) pour le site e-commerce.

## Fichiers de tests

### 1. `complete-site-test.spec.js`
**Test complet du site** couvrant :
- ✅ Navigation et pages publiques (homepage, catégories, produits)
- ✅ Système de panier (ajout, modification, suppression)
- ✅ Checkout avec calcul TVA et frais de livraison
- ✅ Authentification admin
- ✅ Performance et responsive
- ✅ Parcours client complet E2E

### 2. `admin-company-settings.spec.js`
**Tests administration des paramètres société** :
- ⚠️ Configuration TVA (normal et réduit)
- ⚠️ Frais de livraison standard
- ⚠️ Frais de livraison par ville en Guadeloupe
- ⚠️ Auto-complétion et validation

*Note: Ces tests sont marqués `.skip` car ils nécessitent une authentification admin*

### Autres fichiers de tests existants
- `homepage.spec.js` - Tests de la page d'accueil
- `cart.spec.js` - Tests du panier
- `checkout-flows.spec.js` - Tests du processus de commande
- `admin-*.spec.js` - Tests d'administration
- etc.

## Installation

```bash
# Installer Playwright si ce n'est pas déjà fait
npm install -D @playwright/test

# Installer les navigateurs
npx playwright install
```

## Exécution des tests

### Exécuter tous les tests
```bash
npm run test:e2e
```

### Exécuter un fichier spécifique
```bash
npx playwright test e2e/complete-site-test.spec.js
```

### Exécuter avec interface graphique (headed mode)
```bash
npx playwright test e2e/complete-site-test.spec.js --headed
```

### Exécuter en mode debug
```bash
npx playwright test e2e/complete-site-test.spec.js --debug
```

### Exécuter un test spécifique par nom
```bash
npx playwright test e2e/complete-site-test.spec.js -g "Homepage"
```

### Exécuter sur un navigateur spécifique
```bash
# Chrome seulement
npx playwright test e2e/complete-site-test.spec.js --project=chromium

# Firefox seulement
npx playwright test e2e/complete-site-test.spec.js --project=firefox

# Safari seulement
npx playwright test e2e/complete-site-test.spec.js --project=webkit
```

## Génération de rapports

### Rapport HTML
```bash
npx playwright test --reporter=html
npx playwright show-report
```

### Rapport en ligne de commande
```bash
npx playwright test --reporter=list
```

### Rapport JSON
```bash
npx playwright test --reporter=json > results.json
```

## Mode UI interactif

Pour une expérience de débogage interactive :

```bash
npx playwright test --ui
```

## Configuration

La configuration Playwright se trouve dans `playwright.config.js` à la racine du projet.

### Paramètres importants :
- **baseURL** : URL de base du site à tester
- **timeout** : Délai d'attente par défaut (30s)
- **retries** : Nombre de tentatives en cas d'échec
- **projects** : Navigateurs à tester (Chromium, Firefox, WebKit)

## Tests couverts

### Navigation (7 tests)
- [x] Homepage - Affichage et éléments principaux
- [x] Navigation - Menu catégories
- [x] Page Produit - Affichage détails
- [x] Recherche - Fonctionnalité

### Panier (4 tests)
- [x] Ajout produit au panier
- [x] Modification quantité dans le panier
- [x] Suppression produit du panier
- [x] Affichage total du panier

### Checkout (5 tests)
- [x] Accès à la page checkout
- [x] Checkout invité - Formulaire de livraison
- [x] Vérification calcul TVA au checkout
- [x] Vérification frais de livraison au checkout
- [x] Vérification Total TTC au checkout

### Administration (2 tests)
- [x] Accès page admin - Redirection login
- [x] Page login admin - Éléments présents

### Performance & UX (4 tests)
- [x] Performance - Temps de chargement homepage
- [x] Responsive - Mobile viewport
- [x] Responsive - Tablet viewport
- [x] Accessibilité - Attributs alt sur images

### E2E (1 test)
- [x] Parcours complet client - De la homepage au checkout

## Tests Admin (nécessitent authentification)

Les tests suivants sont disponibles mais désactivés (`.skip`) :

### Configuration TVA
- [ ] Modification du taux de TVA normal
- [ ] Modification du taux de TVA réduit
- [ ] Modification de la devise

### Frais de livraison
- [ ] Modification frais de port standard
- [ ] Modification seuil livraison gratuite
- [ ] Ajout d'une ville spécifique
- [ ] Suppression d'une ville spécifique
- [ ] Auto-complétion code postal

## Activer les tests Admin

Pour activer les tests admin, suivez ces étapes :

1. Configurer l'authentification dans `playwright.config.js` :

```javascript
use: {
  storageState: 'auth.json', // État de session sauvegardé
}
```

2. Créer un script de setup pour l'authentification :

```javascript
// auth.setup.js
import { test as setup } from '@playwright/test';

setup('authenticate', async ({ page }) => {
  await page.goto('/admin/login');
  await page.fill('input[type="email"]', 'admin@example.com');
  await page.fill('input[type="password"]', 'yourpassword');
  await page.click('button[type="submit"]');
  await page.waitForURL('/admin');
  await page.context().storageState({ path: 'auth.json' });
});
```

3. Retirer les `.skip` dans `admin-company-settings.spec.js`

## Résultats attendus

### ✅ Tests qui devraient passer
- Navigation et affichage des pages
- Système de panier
- Calcul TVA et frais de livraison au checkout
- Responsive design
- Performance de base

### ⚠️ Tests à vérifier manuellement
- Authentification admin (nécessite configuration)
- Paiement Stripe (mode test)
- Envoi d'emails

## Métriques de performance

Les tests vérifient que :
- Homepage charge en moins de 5 secondes
- Les images ont des attributs `alt`
- Le site est responsive sur mobile et tablette

## Continuous Integration (CI)

Pour intégrer dans un pipeline CI/CD :

```yaml
# .github/workflows/test.yml
- name: Install dependencies
  run: npm ci

- name: Install Playwright
  run: npx playwright install --with-deps

- name: Run tests
  run: npx playwright test

- name: Upload report
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

## Dépannage

### Les tests échouent avec "Element not found"
- Vérifiez que le serveur de développement est démarré
- Augmentez les timeouts dans la configuration
- Utilisez `--headed` pour voir ce qui se passe

### Erreur "Browser not found"
```bash
npx playwright install
```

### Les tests sont très lents
- Utilisez `--workers=1` pour exécuter séquentiellement
- Vérifiez la performance du serveur local

## Support

Pour toute question sur les tests, consultez :
- [Documentation Playwright](https://playwright.dev/)
- Fichier `TESTING.md` à la racine du projet
- Issues GitHub du projet

## Auteur

Tests créés le 2025-12-05
