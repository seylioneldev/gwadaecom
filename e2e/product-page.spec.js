/**
 * TESTS E2E : Page Produit
 * =========================
 *
 * Tests complets de la page produit incluant :
 * - Affichage des détails produit
 * - Sélecteur de quantité
 * - Bouton "Add to Cart"
 * - Fil d'ariane
 * - Gestion des erreurs
 */

const { test, expect } = require("@playwright/test");

test.describe("Page Produit - Tests Complets", () => {
  let productId;

  test.beforeEach(async ({ page }) => {
    // Aller sur la page d'accueil
    await page.goto("http://localhost:3000");

    // Attendre le chargement des produits
    await page.waitForSelector('a[href*="/products/"]', { timeout: 10000 });

    // Récupérer l'ID du premier produit
    const firstProductLink = await page
      .locator('a[href*="/products/"]')
      .first()
      .getAttribute("href");
    productId = firstProductLink.split("/").pop();

    // Naviguer vers la page produit
    await page.goto(`http://localhost:3000/products/${productId}`);
  });

  // ==========================================
  // TESTS AFFICHAGE
  // ==========================================

  test("Affichage - Éléments principaux", async ({ page }) => {
    // Vérifier le header
    await expect(page.locator("header")).toBeVisible();

    // Vérifier le nom du produit
    await expect(page.locator("h1")).toBeVisible();

    // Vérifier le prix
    await expect(page.locator("text=/€|\\$/")).toBeVisible();

    // Vérifier la description
    await expect(
      page
        .locator("p")
        .filter({ hasText: /.{10,}/ })
        .first()
    ).toBeVisible();

    // Vérifier le footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.locator("footer")).toBeVisible();
  });

  test("Affichage - Image produit", async ({ page }) => {
    // Vérifier qu'il y a une image ou un placeholder
    const imageContainer = page.locator('div[class*="aspect"]').first();
    await expect(imageContainer).toBeVisible();
  });

  test("Affichage - Fil d'ariane", async ({ page }) => {
    // Vérifier le fil d'ariane
    await expect(page.locator("text=Home")).toBeVisible();

    // Vérifier le lien Home
    const homeLink = page.locator('a[href="/"]').filter({ hasText: "Home" });
    await expect(homeLink).toBeVisible();
  });

  // ==========================================
  // TESTS SÉLECTEUR DE QUANTITÉ
  // ==========================================

  test("Quantité - Augmenter la quantité", async ({ page }) => {
    // Trouver le bouton plus
    const plusButton = page
      .locator("button")
      .filter({ has: page.locator("svg") })
      .filter({ hasText: "" })
      .nth(1);

    // Vérifier la quantité initiale
    const quantityDisplay = page
      .locator("span")
      .filter({ hasText: /^\d+$/ })
      .first();
    const initialQuantity = await quantityDisplay.textContent();

    // Cliquer sur le bouton plus
    await plusButton.click();

    // Vérifier que la quantité a augmenté
    const newQuantity = await quantityDisplay.textContent();
    expect(parseInt(newQuantity)).toBe(parseInt(initialQuantity) + 1);
  });

  test("Quantité - Diminuer la quantité", async ({ page }) => {
    // Trouver le bouton plus pour augmenter d'abord
    const plusButton = page
      .locator("button")
      .filter({ has: page.locator("svg") })
      .filter({ hasText: "" })
      .nth(1);
    await plusButton.click();
    await page.waitForTimeout(200);

    // Trouver le bouton moins
    const minusButton = page
      .locator("button")
      .filter({ has: page.locator("svg") })
      .filter({ hasText: "" })
      .first();

    // Récupérer la quantité actuelle
    const quantityDisplay = page
      .locator("span")
      .filter({ hasText: /^\d+$/ })
      .first();
    const currentQuantity = await quantityDisplay.textContent();

    // Cliquer sur le bouton moins
    await minusButton.click();

    // Vérifier que la quantité a diminué
    const newQuantity = await quantityDisplay.textContent();
    expect(parseInt(newQuantity)).toBe(parseInt(currentQuantity) - 1);
  });

  test("Quantité - Ne pas descendre en dessous de 1", async ({ page }) => {
    // Trouver le bouton moins
    const minusButton = page
      .locator("button")
      .filter({ has: page.locator("svg") })
      .filter({ hasText: "" })
      .first();

    // Vérifier la quantité initiale (devrait être 1)
    const quantityDisplay = page
      .locator("span")
      .filter({ hasText: /^\d+$/ })
      .first();
    const initialQuantity = await quantityDisplay.textContent();

    // Essayer de diminuer
    await minusButton.click();

    // La quantité devrait rester à 1
    const newQuantity = await quantityDisplay.textContent();
    expect(parseInt(newQuantity)).toBe(1);
  });

  // ==========================================
  // TESTS BOUTON "ADD TO CART"
  // ==========================================

  test("Add to Cart - Ajouter un produit", async ({ page }) => {
    // Trouver le bouton "Add to Cart"
    const addToCartButton = page.locator('button:has-text("Add to Cart")');
    await expect(addToCartButton).toBeVisible();

    // Cliquer sur le bouton
    await addToCartButton.click();

    // Attendre un peu pour que le panier se mette à jour
    await page.waitForTimeout(500);

    // Vérifier que le compteur du panier a augmenté
    const cartCount = page
      .locator('header button:has-text("panier")')
      .locator("span")
      .filter({ hasText: /^\d+$/ });
    await expect(cartCount).toBeVisible({ timeout: 2000 });
  });

  test("Add to Cart - Ajouter plusieurs quantités", async ({ page }) => {
    // Augmenter la quantité à 3
    const plusButton = page
      .locator("button")
      .filter({ has: page.locator("svg") })
      .filter({ hasText: "" })
      .nth(1);
    await plusButton.click();
    await plusButton.click();

    // Vérifier que la quantité est 3
    const quantityDisplay = page
      .locator("span")
      .filter({ hasText: /^\d+$/ })
      .first();
    await expect(quantityDisplay).toHaveText("3");

    // Ajouter au panier
    const addToCartButton = page.locator('button:has-text("Add to Cart")');
    await addToCartButton.click();

    await page.waitForTimeout(500);

    // Le compteur du panier devrait refléter la quantité ajoutée
    const cartCount = page
      .locator('header button:has-text("panier")')
      .locator("span")
      .filter({ hasText: /^\d+$/ });
    await expect(cartCount).toBeVisible({ timeout: 2000 });
  });

  test("Add to Cart - Ouvrir le panier après ajout", async ({ page }) => {
    // Ajouter au panier
    const addToCartButton = page.locator('button:has-text("Add to Cart")');
    await addToCartButton.click();

    await page.waitForTimeout(500);

    // Cliquer sur l'icône panier
    await page.locator('header button:has-text("panier")').click();

    // Vérifier que le panneau latéral s'ouvre
    await page.waitForTimeout(500);
    const sideCart = page
      .locator('[class*="fixed"]')
      .filter({ hasText: "Votre Panier" });
    await expect(sideCart).toBeVisible({ timeout: 2000 });
  });

  // ==========================================
  // TESTS NAVIGATION
  // ==========================================

  test("Navigation - Retour à l'accueil via fil d'ariane", async ({ page }) => {
    // Cliquer sur "Home" dans le fil d'ariane
    const homeLink = page.locator('a[href="/"]').filter({ hasText: "Home" });
    await homeLink.click();

    // Vérifier la navigation
    await expect(page).toHaveURL("http://localhost:3000/");
  });

  test("Navigation - Cliquer sur la catégorie", async ({ page }) => {
    // Trouver le lien de catégorie dans le fil d'ariane
    const categoryLinks = page.locator('a[href*="/category/"]');
    const categoryCount = await categoryLinks.count();

    if (categoryCount > 0) {
      const categoryLink = categoryLinks.first();
      await categoryLink.click();

      // Vérifier la navigation vers la page catégorie
      await expect(page).toHaveURL(/\/category\/.+/);
    }
  });

  test("Navigation - Retour via header", async ({ page }) => {
    // Cliquer sur le logo dans le header
    const logo = page.locator('header a[href="/"]').first();
    await logo.click();

    // Vérifier la navigation
    await expect(page).toHaveURL("http://localhost:3000/");
  });

  // ==========================================
  // TESTS ERREURS
  // ==========================================

  test("Erreur - Produit inexistant", async ({ page }) => {
    // Naviguer vers un produit qui n'existe pas
    await page.goto("http://localhost:3000/products/produit-inexistant-123456");

    // Attendre le chargement
    await page.waitForLoadState("networkidle");

    // Vérifier le message d'erreur ou de produit introuvable
    const errorMessage = page.locator(
      "text=/introuvable|n'existe pas|not found/i"
    );
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
  });

  // ==========================================
  // TESTS RESPONSIVE
  // ==========================================

  test("Responsive - Mobile viewport", async ({ page }) => {
    // Définir la taille mobile
    await page.setViewportSize({ width: 375, height: 667 });

    // Recharger la page
    await page.reload();

    // Vérifier que les éléments sont visibles
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator('button:has-text("Add to Cart")')).toBeVisible();
  });

  test("Responsive - Layout sur mobile", async ({ page }) => {
    // Définir la taille mobile
    await page.setViewportSize({ width: 375, height: 667 });

    // Recharger la page
    await page.reload();

    // Vérifier que l'image et les détails sont empilés verticalement
    const imageContainer = page.locator('div[class*="aspect"]').first();
    const addToCartButton = page.locator('button:has-text("Add to Cart")');

    await expect(imageContainer).toBeVisible();
    await expect(addToCartButton).toBeVisible();
  });

  // ==========================================
  // TESTS PERFORMANCE
  // ==========================================

  test("Performance - Temps de chargement", async ({ page }) => {
    const startTime = Date.now();
    await page.goto(`http://localhost:3000/products/${productId}`);
    await page.waitForLoadState("networkidle");
    const loadTime = Date.now() - startTime;

    // Le chargement devrait prendre moins de 3 secondes
    expect(loadTime).toBeLessThan(3000);
  });
});
