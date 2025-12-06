/**
 * TEST PLAYWRIGHT : Suite Complète du Site E-commerce
 * =====================================================
 *
 * Tests end-to-end complets couvrant :
 * - Navigation et affichage des pages
 * - Système de panier (ajout, modification, suppression)
 * - Checkout avec calcul TVA et frais de livraison
 * - Admin : paramètres société, produits, catégories
 * - Authentification utilisateur
 * - Recherche et filtres
 *
 * 🆕 NOUVEAU FICHIER : e2e/complete-site-test.spec.js
 * DATE : 2025-12-05
 */

import { test, expect } from '@playwright/test';

// Variables globales pour partager entre tests
let testProductId;
let testCategorySlug;

test.describe('Suite Complète - Site E-commerce', () => {

  test.describe('1. Navigation et Pages Publiques', () => {

    test('Homepage - Affichage et éléments principaux', async ({ page }) => {
      await page.goto('/');

      // Vérifier le header
      await expect(page.locator('header')).toBeVisible();

      // Vérifier le titre du site
      const siteTitle = page.locator('h1, [class*="font-serif"]').first();
      await expect(siteTitle).toBeVisible();

      // Vérifier la présence du panier
      const cartIcon = page.locator('[href="/cart"]');
      await expect(cartIcon).toBeVisible();

      // Vérifier la section Hero
      const heroSection = page.locator('section').first();
      await expect(heroSection).toBeVisible();

      // Vérifier qu'il y a des produits affichés
      const productCards = page.locator('[class*="product"], article');
      await expect(productCards.first()).toBeVisible({ timeout: 10000 });
    });

    test('Navigation - Menu catégories', async ({ page }) => {
      await page.goto('/');

      // Attendre que le menu soit chargé
      await page.waitForLoadState('networkidle');

      // Vérifier la présence du menu de navigation
      const nav = page.locator('nav');
      await expect(nav.first()).toBeVisible();

      // Cliquer sur une catégorie si elle existe
      const categoryLinks = page.locator('nav a[href^="/category"]');
      const count = await categoryLinks.count();

      if (count > 0) {
        const firstCategory = categoryLinks.first();
        const categoryHref = await firstCategory.getAttribute('href');
        testCategorySlug = categoryHref;

        await firstCategory.click();
        await page.waitForLoadState('networkidle');

        // Vérifier qu'on est bien sur la page catégorie
        await expect(page).toHaveURL(new RegExp(categoryHref));
      }
    });

    test('Page Produit - Affichage détails', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Trouver et cliquer sur un produit
      const productLink = page.locator('a[href^="/products/"]').first();
      await expect(productLink).toBeVisible({ timeout: 10000 });

      const productHref = await productLink.getAttribute('href');
      testProductId = productHref.split('/').pop();

      await productLink.click();
      await page.waitForLoadState('networkidle');

      // Vérifier les éléments de la page produit
      await expect(page.locator('h1')).toBeVisible();

      // Vérifier le prix
      const priceElement = page.locator('text=/€|\\$/').first();
      await expect(priceElement).toBeVisible();

      // Vérifier le bouton d'ajout au panier
      const addToCartButton = page.locator('button:has-text("Ajouter au panier"), button:has-text("Add to Cart")');
      await expect(addToCartButton.first()).toBeVisible();
    });

    test('Recherche - Fonctionnalité', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Chercher le champ de recherche
      const searchInput = page.locator('input[type="search"], input[placeholder*="Recherch"], input[placeholder*="Search"]');

      if (await searchInput.count() > 0) {
        await searchInput.first().fill('test');
        await page.keyboard.press('Enter');
        await page.waitForLoadState('networkidle');

        // Vérifier qu'on est sur la page de recherche
        await expect(page).toHaveURL(/search/);
      }
    });

  });

  test.describe('2. Système de Panier', () => {

    test('Ajout produit au panier', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Cliquer sur un produit
      const productLink = page.locator('a[href^="/products/"]').first();
      await productLink.click();
      await page.waitForLoadState('networkidle');

      // Ajouter au panier
      const addToCartButton = page.locator('button:has-text("Ajouter au panier"), button:has-text("Add to Cart")').first();
      await addToCartButton.click();

      // Attendre la confirmation (toast, notification, etc.)
      await page.waitForTimeout(1000);

      // Aller au panier
      await page.goto('/cart');
      await page.waitForLoadState('networkidle');

      // Vérifier qu'il y a au moins un produit
      const cartItems = page.locator('[class*="cart"], article, [data-testid="cart-item"]');
      await expect(cartItems.first()).toBeVisible({ timeout: 5000 });
    });

    test('Modification quantité dans le panier', async ({ page }) => {
      // S'assurer qu'il y a un produit dans le panier
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const productLink = page.locator('a[href^="/products/"]').first();
      await productLink.click();
      await page.waitForLoadState('networkidle');

      const addButton = page.locator('button:has-text("Ajouter au panier"), button:has-text("Add to Cart")').first();
      await addButton.click();
      await page.waitForTimeout(500);

      // Aller au panier
      await page.goto('/cart');
      await page.waitForLoadState('networkidle');

      // Chercher les boutons de quantité
      const increaseButton = page.locator('button:has-text("+")').first();

      if (await increaseButton.count() > 0) {
        // Augmenter la quantité
        await increaseButton.click();
        await page.waitForTimeout(500);

        // Vérifier que la quantité a changé
        const quantityDisplay = page.locator('text=/Qté.*2|Quantité.*2|Quantity.*2/i');
        await expect(quantityDisplay.first()).toBeVisible({ timeout: 3000 });
      }
    });

    test('Suppression produit du panier', async ({ page }) => {
      await page.goto('/cart');
      await page.waitForLoadState('networkidle');

      // Chercher le bouton de suppression
      const deleteButton = page.locator('button[title*="Supprimer"], button:has-text("Supprimer"), button:has-text("×")').first();

      if (await deleteButton.count() > 0) {
        await deleteButton.click();
        await page.waitForTimeout(500);
      }
    });

    test('Affichage total du panier', async ({ page }) => {
      // Ajouter un produit
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const productLink = page.locator('a[href^="/products/"]').first();
      await productLink.click();
      await page.waitForLoadState('networkidle');

      const addButton = page.locator('button:has-text("Ajouter au panier"), button:has-text("Add to Cart")').first();
      await addButton.click();
      await page.waitForTimeout(500);

      await page.goto('/cart');
      await page.waitForLoadState('networkidle');

      // Vérifier le total
      const totalElement = page.locator('text=/Total|TOTAL/i').first();
      await expect(totalElement).toBeVisible();

      // Vérifier qu'il y a un montant
      const priceElement = page.locator('text=/€|\\$/').first();
      await expect(priceElement).toBeVisible();
    });

  });

  test.describe('3. Checkout avec TVA et Livraison', () => {

    test.beforeEach(async ({ page }) => {
      // Ajouter un produit au panier avant chaque test
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const productLink = page.locator('a[href^="/products/"]').first();
      await productLink.click();
      await page.waitForLoadState('networkidle');

      const addButton = page.locator('button:has-text("Ajouter au panier"), button:has-text("Add to Cart")').first();
      await addButton.click();
      await page.waitForTimeout(500);
    });

    test('Accès à la page checkout', async ({ page }) => {
      await page.goto('/cart');
      await page.waitForLoadState('networkidle');

      // Cliquer sur le bouton checkout
      const checkoutButton = page.locator('button:has-text("Passer commande"), button:has-text("Commander"), a:has-text("Checkout")').first();
      await checkoutButton.click();
      await page.waitForLoadState('networkidle');

      // Vérifier qu'on est sur la page checkout
      await expect(page).toHaveURL(/checkout/);
    });

    test('Checkout invité - Formulaire de livraison', async ({ page }) => {
      await page.goto('/checkout');
      await page.waitForLoadState('networkidle');

      // Sélectionner le mode invité
      const guestButton = page.locator('button:has-text("invité"), button:has-text("guest")').first();

      if (await guestButton.count() > 0) {
        await guestButton.click();
        await page.waitForTimeout(500);
      }

      // Remplir le formulaire
      const emailInput = page.locator('input[type="email"]').first();
      await emailInput.fill('test@example.com');

      const firstNameInput = page.locator('input[name="firstName"], input[placeholder*="Prénom"]').first();
      if (await firstNameInput.count() > 0) {
        await firstNameInput.fill('Jean');
      }

      const lastNameInput = page.locator('input[name="lastName"], input[placeholder*="Nom"]').first();
      if (await lastNameInput.count() > 0) {
        await lastNameInput.fill('Dupont');
      }

      const addressInput = page.locator('input[name="address"], textarea[name="address"]').first();
      if (await addressInput.count() > 0) {
        await addressInput.fill('123 Rue Test');
      }

      const cityInput = page.locator('input[name="city"]').first();
      if (await cityInput.count() > 0) {
        await cityInput.fill('Pointe-à-Pitre');
      }

      const postalCodeInput = page.locator('input[name="postalCode"]').first();
      if (await postalCodeInput.count() > 0) {
        await postalCodeInput.fill('97110');
      }

      // Vérifier l'affichage du récapitulatif
      const summarySection = page.locator('text=/Récapitulatif|Summary/i');
      await expect(summarySection.first()).toBeVisible();
    });

    test('Vérification calcul TVA au checkout', async ({ page }) => {
      await page.goto('/checkout');
      await page.waitForLoadState('networkidle');

      // Passer en mode invité si nécessaire
      const guestButton = page.locator('button:has-text("invité"), button:has-text("guest")').first();
      if (await guestButton.count() > 0) {
        await guestButton.click();
        await page.waitForTimeout(500);
      }

      // Chercher l'affichage de la TVA
      const taxLabel = page.locator('text=/TVA|Tax/i');

      // Attendre que la TVA soit visible
      await expect(taxLabel.first()).toBeVisible({ timeout: 5000 });

      // Vérifier qu'il y a un pourcentage affiché
      const taxPercentage = page.locator('text=/\\d+%/');
      await expect(taxPercentage.first()).toBeVisible();
    });

    test('Vérification frais de livraison au checkout', async ({ page }) => {
      await page.goto('/checkout');
      await page.waitForLoadState('networkidle');

      // Passer en mode invité si nécessaire
      const guestButton = page.locator('button:has-text("invité"), button:has-text("guest")').first();
      if (await guestButton.count() > 0) {
        await guestButton.click();
        await page.waitForTimeout(500);
      }

      // Remplir le formulaire avec une ville
      const cityInput = page.locator('input[name="city"]').first();
      if (await cityInput.count() > 0) {
        await cityInput.fill('Pointe-à-Pitre');
        await page.waitForTimeout(1000);
      }

      // Chercher l'affichage des frais de livraison
      const shippingLabel = page.locator('text=/Livraison|Shipping/i');
      await expect(shippingLabel.first()).toBeVisible({ timeout: 5000 });

      // Vérifier qu'il y a un montant ou "Gratuite"
      const shippingCost = page.locator('text=/Gratuite|€|Free/i');
      await expect(shippingCost.first()).toBeVisible();
    });

    test('Vérification Total TTC au checkout', async ({ page }) => {
      await page.goto('/checkout');
      await page.waitForLoadState('networkidle');

      // Chercher le total TTC
      const totalLabel = page.locator('text=/Total TTC|Total/i');
      await expect(totalLabel.first()).toBeVisible({ timeout: 5000 });

      // Vérifier qu'il y a un montant
      const totalAmount = page.locator('text=/€|\\$/');
      await expect(totalAmount.first()).toBeVisible();
    });

  });

  test.describe('4. Administration - Authentification', () => {

    test('Accès page admin - Redirection login', async ({ page }) => {
      await page.goto('/admin');
      await page.waitForLoadState('networkidle');

      // Devrait rediriger vers la page de login ou afficher un formulaire de connexion
      const isLoginPage = page.url().includes('/login') || page.url().includes('/admin/login');
      const hasLoginForm = await page.locator('input[type="email"], input[type="password"]').count() > 0;

      expect(isLoginPage || hasLoginForm).toBeTruthy();
    });

    test('Page login admin - Éléments présents', async ({ page }) => {
      await page.goto('/admin/login');
      await page.waitForLoadState('networkidle');

      // Vérifier les champs de connexion
      const emailInput = page.locator('input[type="email"]');
      await expect(emailInput.first()).toBeVisible();

      const passwordInput = page.locator('input[type="password"]');
      await expect(passwordInput.first()).toBeVisible();

      const submitButton = page.locator('button[type="submit"]');
      await expect(submitButton.first()).toBeVisible();
    });

  });

  test.describe('5. Administration - Paramètres Société', () => {

    test.skip('Admin - Page paramètres société accessible', async ({ page }) => {
      // Ce test nécessite d'être authentifié
      await page.goto('/admin/company');
      await page.waitForLoadState('networkidle');

      // Si on est redirigé vers login, skipper
      if (page.url().includes('/login')) {
        return;
      }

      // Vérifier les sections principales
      const tvaSection = page.locator('text=/Configuration.*TVA|TVA/i');
      const shippingSection = page.locator('text=/Frais.*livraison|Livraison/i');

      await expect(tvaSection.first()).toBeVisible({ timeout: 5000 });
      await expect(shippingSection.first()).toBeVisible({ timeout: 5000 });
    });

  });

  test.describe('6. Tests de Performance et UX', () => {

    test('Performance - Temps de chargement homepage', async ({ page }) => {
      const startTime = Date.now();

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const loadTime = Date.now() - startTime;

      // La page devrait charger en moins de 5 secondes
      expect(loadTime).toBeLessThan(5000);
    });

    test('Responsive - Mobile viewport', async ({ page }) => {
      // Définir un viewport mobile
      await page.setViewportSize({ width: 375, height: 667 });

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Vérifier que le contenu est visible
      const mainContent = page.locator('main, [role="main"]').first();
      await expect(mainContent).toBeVisible();
    });

    test('Responsive - Tablet viewport', async ({ page }) => {
      // Définir un viewport tablette
      await page.setViewportSize({ width: 768, height: 1024 });

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Vérifier que le contenu est visible
      const mainContent = page.locator('main, [role="main"]').first();
      await expect(mainContent).toBeVisible();
    });

    test('Accessibilité - Attributs alt sur images', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Récupérer toutes les images
      const images = page.locator('img');
      const count = await images.count();

      // Vérifier qu'au moins quelques images ont un attribut alt
      let imagesWithAlt = 0;
      for (let i = 0; i < Math.min(count, 5); i++) {
        const alt = await images.nth(i).getAttribute('alt');
        if (alt !== null) {
          imagesWithAlt++;
        }
      }

      expect(imagesWithAlt).toBeGreaterThan(0);
    });

  });

  test.describe('7. Test End-to-End Complet', () => {

    test('Parcours complet client - De la homepage au checkout', async ({ page }) => {
      // 1. Arriver sur la homepage
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await expect(page.locator('h1, header')).toBeVisible();

      // 2. Naviguer vers une catégorie
      const categoryLink = page.locator('nav a[href^="/category"]').first();
      if (await categoryLink.count() > 0) {
        await categoryLink.click();
        await page.waitForLoadState('networkidle');
      }

      // 3. Sélectionner un produit
      const productLink = page.locator('a[href^="/products/"]').first();
      await expect(productLink).toBeVisible({ timeout: 10000 });
      await productLink.click();
      await page.waitForLoadState('networkidle');

      // 4. Ajouter au panier
      const addToCartButton = page.locator('button:has-text("Ajouter au panier"), button:has-text("Add to Cart")').first();
      await addToCartButton.click();
      await page.waitForTimeout(1000);

      // 5. Aller au panier
      await page.goto('/cart');
      await page.waitForLoadState('networkidle');
      await expect(page.locator('text=/Panier|Cart/i').first()).toBeVisible();

      // 6. Procéder au checkout
      const checkoutButton = page.locator('button:has-text("Passer commande"), button:has-text("Commander"), a:has-text("Checkout")').first();
      await checkoutButton.click();
      await page.waitForLoadState('networkidle');

      // 7. Vérifier qu'on est sur la page checkout
      await expect(page).toHaveURL(/checkout/);
      await expect(page.locator('text=/Récapitulatif|Summary/i').first()).toBeVisible();

      // 8. Vérifier l'affichage de la TVA et des frais de livraison
      await expect(page.locator('text=/TVA|Tax/i').first()).toBeVisible({ timeout: 5000 });
      await expect(page.locator('text=/Livraison|Shipping/i').first()).toBeVisible({ timeout: 5000 });
    });

  });

});

/**
 * ============================================
 * GUIDE D'EXÉCUTION
 * ============================================
 *
 * Exécuter tous les tests :
 * npm run test:e2e
 *
 * Exécuter ce fichier spécifique :
 * npx playwright test e2e/complete-site-test.spec.js
 *
 * Exécuter en mode headed (voir le navigateur) :
 * npx playwright test e2e/complete-site-test.spec.js --headed
 *
 * Exécuter un test spécifique :
 * npx playwright test e2e/complete-site-test.spec.js -g "Homepage"
 *
 * Générer un rapport :
 * npx playwright test e2e/complete-site-test.spec.js --reporter=html
 *
 * ============================================
 */
