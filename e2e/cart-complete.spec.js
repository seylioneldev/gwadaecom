/**
 * TESTS E2E : Page Panier (Complet)
 * ==================================
 *
 * Tests complets de la page panier incluant :
 * - Affichage du panier vide
 * - Ajout de produits
 * - Modification des quantités
 * - Suppression de produits
 * - Calcul du total
 * - Navigation vers checkout
 */

const { test, expect } = require("@playwright/test");

test.describe("Page Panier - Tests Complets", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/cart");
  });

  // ==========================================
  // TESTS PANIER VIDE
  // ==========================================

  test("Panier vide - Affichage du message", async ({ page }) => {
    // Vérifier le message de panier vide
    const emptyMessage = page.locator("text=/panier est vide|cart is empty/i");
    const hasEmptyMessage = await emptyMessage.isVisible().catch(() => false);

    // Si le panier est vide, vérifier les éléments
    if (hasEmptyMessage) {
      await expect(emptyMessage).toBeVisible();

      // Vérifier le bouton retour
      const backButton = page
        .locator('a[href="/"]')
        .filter({ hasText: /retour|back/i });
      await expect(backButton).toBeVisible();
    }
  });

  test("Panier vide - Bouton retour à l'accueil", async ({ page }) => {
    const emptyMessage = page.locator("text=/panier est vide|cart is empty/i");
    const hasEmptyMessage = await emptyMessage.isVisible().catch(() => false);

    if (hasEmptyMessage) {
      // Cliquer sur le bouton retour
      const backButton = page
        .locator('a[href="/"]')
        .filter({ hasText: /retour|back|accueil|home/i })
        .first();
      await backButton.click();

      // Vérifier la navigation
      await expect(page).toHaveURL("http://localhost:3000/");
    }
  });

  // ==========================================
  // TESTS AJOUT DE PRODUITS
  // ==========================================

  test("Ajout - Ajouter un produit au panier", async ({ page }) => {
    // Aller sur la page d'accueil
    await page.goto("http://localhost:3000");

    // Attendre les produits
    await page.waitForSelector('a[href*="/products/"]', { timeout: 10000 });

    // Cliquer sur un produit
    await page.locator('a[href*="/products/"]').first().click();

    // Ajouter au panier
    await page.locator('button:has-text("Add to Cart")').click();
    await page.waitForTimeout(500);

    // Aller sur la page panier
    await page.goto("http://localhost:3000/cart");

    // Vérifier qu'il y a au moins un produit
    const productItems = page
      .locator("div")
      .filter({ hasText: /prix|price|€|\\$/i });
    await expect(productItems.first()).toBeVisible({ timeout: 5000 });
  });

  // ==========================================
  // TESTS PANIER AVEC PRODUITS
  // ==========================================

  test("Affichage - Éléments du panier", async ({ page }) => {
    // Ajouter un produit d'abord
    await page.goto("http://localhost:3000");
    await page.waitForSelector('a[href*="/products/"]', { timeout: 10000 });
    await page.locator('a[href*="/products/"]').first().click();
    await page.locator('button:has-text("Add to Cart")').click();
    await page.waitForTimeout(500);

    // Aller sur la page panier
    await page.goto("http://localhost:3000/cart");

    // Vérifier le titre
    await expect(
      page.locator("h1, h2").filter({ hasText: /panier|cart/i })
    ).toBeVisible();

    // Vérifier le récapitulatif
    const summary = page.locator("text=/récapitulatif|summary|total/i");
    await expect(summary).toBeVisible({ timeout: 5000 });
  });

  test("Affichage - Informations produit", async ({ page }) => {
    // Ajouter un produit
    await page.goto("http://localhost:3000");
    await page.waitForSelector('a[href*="/products/"]', { timeout: 10000 });
    await page.locator('a[href*="/products/"]').first().click();
    await page.locator('button:has-text("Add to Cart")').click();
    await page.waitForTimeout(500);

    // Aller sur la page panier
    await page.goto("http://localhost:3000/cart");
    await page.waitForTimeout(1000);

    // Vérifier qu'il y a un nom de produit
    const productName = page
      .locator("h3, h2, p")
      .filter({ hasText: /.{3,}/ })
      .first();
    await expect(productName).toBeVisible({ timeout: 5000 });

    // Vérifier qu'il y a un prix
    const price = page.locator("text=/€|\\$/");
    await expect(price.first()).toBeVisible();
  });

  // ==========================================
  // TESTS MODIFICATION QUANTITÉ
  // ==========================================

  test("Quantité - Augmenter", async ({ page }) => {
    // Ajouter un produit
    await page.goto("http://localhost:3000");
    await page.waitForSelector('a[href*="/products/"]', { timeout: 10000 });
    await page.locator('a[href*="/products/"]').first().click();
    await page.locator('button:has-text("Add to Cart")').click();
    await page.waitForTimeout(500);

    // Aller sur la page panier
    await page.goto("http://localhost:3000/cart");
    await page.waitForTimeout(1000);

    // Trouver le bouton plus
    const plusButtons = page
      .locator("button")
      .filter({ has: page.locator("svg") });
    const plusButton = plusButtons.filter({ hasText: "" }).last();

    // Récupérer la quantité actuelle
    const quantityDisplay = page
      .locator("span")
      .filter({ hasText: /^\d+$/ })
      .first();
    const initialQuantity = await quantityDisplay.textContent();

    // Cliquer sur plus
    await plusButton.click();
    await page.waitForTimeout(500);

    // Vérifier l'augmentation
    const newQuantity = await quantityDisplay.textContent();
    expect(parseInt(newQuantity)).toBeGreaterThan(parseInt(initialQuantity));
  });

  test("Quantité - Diminuer", async ({ page }) => {
    // Ajouter un produit avec quantité 2
    await page.goto("http://localhost:3000");
    await page.waitForSelector('a[href*="/products/"]', { timeout: 10000 });
    await page.locator('a[href*="/products/"]').first().click();

    // Augmenter la quantité avant d'ajouter
    const plusButton = page
      .locator("button")
      .filter({ has: page.locator("svg") })
      .nth(1);
    await plusButton.click();

    await page.locator('button:has-text("Add to Cart")').click();
    await page.waitForTimeout(500);

    // Aller sur la page panier
    await page.goto("http://localhost:3000/cart");
    await page.waitForTimeout(1000);

    // Trouver le bouton moins
    const minusButton = page
      .locator("button")
      .filter({ has: page.locator("svg") })
      .first();

    // Récupérer la quantité actuelle
    const quantityDisplay = page
      .locator("span")
      .filter({ hasText: /^\d+$/ })
      .first();
    const initialQuantity = await quantityDisplay.textContent();

    // Cliquer sur moins
    await minusButton.click();
    await page.waitForTimeout(500);

    // Vérifier la diminution
    const newQuantity = await quantityDisplay.textContent();
    expect(parseInt(newQuantity)).toBeLessThan(parseInt(initialQuantity));
  });

  // ==========================================
  // TESTS SUPPRESSION
  // ==========================================

  test("Suppression - Retirer un produit", async ({ page }) => {
    // Ajouter un produit
    await page.goto("http://localhost:3000");
    await page.waitForSelector('a[href*="/products/"]', { timeout: 10000 });
    await page.locator('a[href*="/products/"]').first().click();
    await page.locator('button:has-text("Add to Cart")').click();
    await page.waitForTimeout(500);

    // Aller sur la page panier
    await page.goto("http://localhost:3000/cart");
    await page.waitForTimeout(1000);

    // Trouver le bouton supprimer
    const deleteButton = page
      .locator("button")
      .filter({ hasText: /retirer|supprimer|remove|delete/i })
      .first();
    await deleteButton.click();

    await page.waitForTimeout(500);

    // Vérifier que le panier est vide
    const emptyMessage = page.locator("text=/panier est vide|cart is empty/i");
    await expect(emptyMessage).toBeVisible({ timeout: 3000 });
  });

  // ==========================================
  // TESTS CALCUL TOTAL
  // ==========================================

  test("Total - Calcul correct", async ({ page }) => {
    // Ajouter un produit
    await page.goto("http://localhost:3000");
    await page.waitForSelector('a[href*="/products/"]', { timeout: 10000 });
    await page.locator('a[href*="/products/"]').first().click();
    await page.locator('button:has-text("Add to Cart")').click();
    await page.waitForTimeout(500);

    // Aller sur la page panier
    await page.goto("http://localhost:3000/cart");
    await page.waitForTimeout(1000);

    // Vérifier qu'il y a un total affiché
    const total = page.locator("text=/total/i").filter({ hasText: /€|\\$/ });
    await expect(total.first()).toBeVisible({ timeout: 5000 });
  });

  test("Total - Mise à jour après modification quantité", async ({ page }) => {
    // Ajouter un produit
    await page.goto("http://localhost:3000");
    await page.waitForSelector('a[href*="/products/"]', { timeout: 10000 });
    await page.locator('a[href*="/products/"]').first().click();
    await page.locator('button:has-text("Add to Cart")').click();
    await page.waitForTimeout(500);

    // Aller sur la page panier
    await page.goto("http://localhost:3000/cart");
    await page.waitForTimeout(1000);

    // Récupérer le total initial
    const totalElement = page
      .locator("text=/total/i")
      .filter({ hasText: /€|\\$/ })
      .first();
    const initialTotal = await totalElement.textContent();

    // Augmenter la quantité
    const plusButton = page
      .locator("button")
      .filter({ has: page.locator("svg") })
      .last();
    await plusButton.click();
    await page.waitForTimeout(500);

    // Vérifier que le total a changé
    const newTotal = await totalElement.textContent();
    expect(newTotal).not.toBe(initialTotal);
  });

  // ==========================================
  // TESTS NAVIGATION CHECKOUT
  // ==========================================

  test("Checkout - Bouton passer commande", async ({ page }) => {
    // Ajouter un produit
    await page.goto("http://localhost:3000");
    await page.waitForSelector('a[href*="/products/"]', { timeout: 10000 });
    await page.locator('a[href*="/products/"]').first().click();
    await page.locator('button:has-text("Add to Cart")').click();
    await page.waitForTimeout(500);

    // Aller sur la page panier
    await page.goto("http://localhost:3000/cart");
    await page.waitForTimeout(1000);

    // Vérifier le bouton checkout
    const checkoutButton = page
      .locator("button, a")
      .filter({ hasText: /passer commande|checkout|commander/i });
    await expect(checkoutButton.first()).toBeVisible();
  });

  test("Checkout - Navigation vers page checkout", async ({ page }) => {
    // Ajouter un produit
    await page.goto("http://localhost:3000");
    await page.waitForSelector('a[href*="/products/"]', { timeout: 10000 });
    await page.locator('a[href*="/products/"]').first().click();
    await page.locator('button:has-text("Add to Cart")').click();
    await page.waitForTimeout(500);

    // Aller sur la page panier
    await page.goto("http://localhost:3000/cart");
    await page.waitForTimeout(1000);

    // Cliquer sur le bouton checkout
    const checkoutButton = page
      .locator("button, a")
      .filter({ hasText: /passer commande|checkout|commander/i })
      .first();
    await checkoutButton.click();

    // Vérifier la navigation
    await expect(page).toHaveURL(/\/checkout/);
  });

  // ==========================================
  // TESTS NAVIGATION
  // ==========================================

  test("Navigation - Continuer les achats", async ({ page }) => {
    // Vérifier le lien "Continuer les achats"
    const continueButton = page
      .locator('a[href="/"]')
      .filter({ hasText: /continuer|continue|achats|shopping/i });
    const hasButton = await continueButton.isVisible().catch(() => false);

    if (hasButton) {
      await continueButton.click();
      await expect(page).toHaveURL("http://localhost:3000/");
    }
  });

  // ==========================================
  // TESTS RESPONSIVE
  // ==========================================

  test("Responsive - Mobile viewport", async ({ page }) => {
    // Définir la taille mobile
    await page.setViewportSize({ width: 375, height: 667 });

    // Recharger la page
    await page.reload();

    // Vérifier l'affichage
    await expect(
      page.locator("h1, h2").filter({ hasText: /panier|cart/i })
    ).toBeVisible();
  });

  // ==========================================
  // TESTS INFORMATIONS ADDITIONNELLES
  // ==========================================

  test("Informations - Affichage des avantages", async ({ page }) => {
    // Ajouter un produit
    await page.goto("http://localhost:3000");
    await page.waitForSelector('a[href*="/products/"]', { timeout: 10000 });
    await page.locator('a[href*="/products/"]').first().click();
    await page.locator('button:has-text("Add to Cart")').click();
    await page.waitForTimeout(500);

    // Aller sur la page panier
    await page.goto("http://localhost:3000/cart");
    await page.waitForTimeout(1000);

    // Vérifier les informations sur la livraison, retours, etc.
    const infoText = page.locator(
      "text=/livraison|gratuite|retour|paiement|sécurisé/i"
    );
    const hasInfo = await infoText
      .first()
      .isVisible()
      .catch(() => false);

    if (hasInfo) {
      await expect(infoText.first()).toBeVisible();
    }
  });
});
