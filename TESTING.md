# Guide de Test - Gwadaecom

Guide rapide pour utiliser Playwright et tester votre application.

## 🚀 Démarrage rapide

### 1. Lancer les tests

```bash
npm test
```

Cette commande lance tous les tests en mode headless (sans interface graphique).

### 2. Voir les tests en action (mode UI)

```bash
npm run test:ui
```

Ouvre une interface graphique interactive où vous pouvez :
- ✅ Voir tous les tests
- ✅ Relancer des tests individuels
- ✅ Voir les captures d'écran
- ✅ Inspecter le DOM

### 3. Déboguer un test qui échoue

```bash
npm run test:debug
```

Mode pas à pas avec inspecteur intégré.

## 📊 Voir le rapport de tests

Après avoir lancé `npm test`, ouvrez le rapport HTML :

```bash
npm run test:report
```

Le rapport contient :
- Liste complète des tests
- Captures d'écran des échecs
- Durée d'exécution
- Traces détaillées

## 🧪 Tests disponibles

### Navigation (18 tests)
```bash
npx playwright test e2e/navigation.spec.js
```
- ✅ Page d'accueil
- ✅ Navigation dans les catégories
- ✅ Boutons retour admin (produits, catégories, paramètres)
- ✅ Section Commercial (statistiques, commandes, partenaires, fournisseurs, facturation)

### Panier (3 tests)
```bash
npx playwright test e2e/cart.spec.js
```
- ✅ Ouvrir/fermer le panier
- ✅ Ajout de produits
- ✅ Calcul du total

### Admin - Produits (9 tests)
```bash
npx playwright test e2e/admin-products.spec.js
```
- ✅ Liste des produits
- ✅ Basculement grille/tableau
- ✅ Recherche et filtres
- ✅ Ajout de produit
- ✅ Modification et suppression

### Admin - Catégories (6 tests)
```bash
npx playwright test e2e/admin-categories.spec.js
```
- ✅ Liste des catégories
- ✅ Ajout de catégorie
- ✅ Modification et visibilité
- ✅ Suppression

## 🎯 Lancer un test spécifique

### Par nom de test
```bash
npx playwright test -g "devrait afficher la page d'accueil"
```

### Un seul fichier
```bash
npx playwright test e2e/navigation.spec.js
```

### Mode headed (voir le navigateur)
```bash
npm run test:headed
```

## 🐛 Déboguer un test qui échoue

### Méthode 1 : Mode debug
```bash
npm run test:debug
```

### Méthode 2 : Ajouter un point d'arrêt
```javascript
test('mon test', async ({ page }) => {
  await page.goto('/');
  await page.pause(); // 👈 Point d'arrêt
  await page.click('button');
});
```

### Méthode 3 : Voir le navigateur
```bash
npm run test:headed
```

## ✅ Avant de lancer les tests

### Vérifier que Next.js fonctionne
```bash
npm run dev
```
Ouvrez http://localhost:3000 dans votre navigateur.

### Vérifier Firebase
- ✅ Règles Firestore configurées (lecture/écriture autorisées)
- ✅ Collections `products`, `categories`, `settings` créées
- ✅ Fichier `.env.local` avec vos clés Firebase

## 📝 Bonnes pratiques

### 1. Lancez les tests avant de committer
```bash
npm test
```

### 2. Ajoutez des tests pour chaque nouvelle fonctionnalité
```javascript
test('devrait faire quelque chose', async ({ page }) => {
  await page.goto('/ma-page');
  await page.click('button');
  await expect(page.locator('h1')).toBeVisible();
});
```

### 3. Utilisez le mode UI pour explorer
```bash
npm run test:ui
```

### 4. Gardez vos tests rapides
- Évitez les `waitForTimeout()` fixes
- Utilisez les attentes automatiques de Playwright
- Exécutez en parallèle quand possible

## 🔥 Problèmes courants

### "Connection refused" sur localhost:3000
**Solution :** Le serveur Next.js n'est pas démarré
```bash
npm run dev
```

### Tests échouent avec erreur Firestore
**Solution :** Vérifiez vos règles Firestore
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // Pour le développement
    }
  }
}
```

### "Cannot find module @playwright/test"
**Solution :** Réinstallez Playwright
```bash
npm install -D @playwright/test
npx playwright install chromium
```

## 📚 Documentation complète

Consultez [e2e/README.md](e2e/README.md) pour la documentation détaillée.

## 🚀 Workflow recommandé

1. **Développement** → Ajoutez une fonctionnalité
2. **Test manuel** → Vérifiez dans le navigateur
3. **Écriture du test** → Créez un test Playwright
4. **Exécution** → `npm test`
5. **Correction** → Si le test échoue, corrigez le code
6. **Commit** → Commitez code + tests ensemble

## 📊 Statistiques actuelles

- **Total de tests :** 36
- **Fichiers de tests :** 4
- **Coverage :** Navigation, Panier, Admin (Produits + Catégories)
- **Temps d'exécution moyen :** ~30 secondes

## 🎉 Prochaines étapes

Après avoir maîtrisé les tests de base, vous pouvez :

1. **Ajouter des tests pour les paramètres** (admin/settings)
2. **Tester la personnalisation CSS** (changement de couleurs)
3. **Ajouter des tests pour la section Commercial** (avec données réelles)
4. **Configurer CI/CD** (GitHub Actions pour lancer les tests automatiquement)
5. **Ajouter des tests de performance** (Lighthouse)

---

**Besoin d'aide ?** Consultez la [documentation Playwright](https://playwright.dev) ou le fichier [e2e/README.md](e2e/README.md).
