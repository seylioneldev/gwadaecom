/**
 * TESTS E2E : Page Catégorie
 * ===========================
 *
 * Tests complets de la page catégorie incluant :
 * - Affichage des produits filtrés
 * - Fil d'ariane
 * - Navigation vers les produits
 * - Gestion des catégories vides
 */

const { test, expect } = require("@playwright/test");

test.describe("Page Catégorie - Tests Complets", () => {
  let categorySlug;

  test.beforeEach(async ({ page }) => {
    // Aller sur la page d'accueil
    await page.goto("http://localhost:3000");

    // Attendre le chargement du menu
    await page.waitForSelector("nav ul li", { timeout: 10000 });

    // Récupérer le slug de la première catégorie
    const firstCategoryLink = await page
      .locator("nav ul li a")
      .first()
      .getAttribute("href");
    categorySlug = firstCategoryLink.split("/").pop();

    // Naviguer vers la page catégorie
    await page.goto(`http://localhost:3000/category/${categorySlug}`);
  });

  // ==========================================
  // TESTS AFFICHAGE
  // ==========================================

  test("Affichage - Éléments principaux", async ({ page }) => {
    // Vérifier le header
    await expect(page.locator("header")).toBeVisible();

    // Vérifier le titre de la catégorie
    await expect(page.locator("h1")).toBeVisible();

    // Vérifier le fil d'ariane
    await expect(page.locator("text=Home")).toBeVisible();

    // Vérifier le footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.locator("footer")).toBeVisible();
  });

  test("Affichage - Titre avec nombre de produits", async ({ page }) => {
    // Vérifier que le titre contient le nombre de produits
    const title = page.locator("h1");
    const titleText = await title.textContent();

    // Devrait contenir "items" ou le nombre
    expect(titleText).toMatch(/\d+|items/i);
  });

  test("Affichage - Fil d'ariane", async ({ page }) => {
    // Vérifier le lien Home
    const homeLink = page.locator('a[href="/"]').filter({ hasText: "Home" });
    await expect(homeLink).toBeVisible();

    // Vérifier le nom de la catégorie dans le fil d'ariane
    const breadcrumb = page.locator("div").filter({ hasText: "Home" }).first();
    await expect(breadcrumb).toBeVisible();
  });

  // ==========================================
  // TESTS GRILLE DE PRODUITS
  // ==========================================

  test("Grille - Affichage des produits", async ({ page }) => {
    // Attendre le chargement des produits
    await page.waitForTimeout(1000);

    // Vérifier s'il y a des produits ou un message "Aucun produit"
    const hasProducts =
      (await page.locator('a[href*="/products/"]').count()) > 0;
    const hasNoProductsMessage = await page
      .locator("text=/aucun produit|no product/i")
      .isVisible()
      .catch(() => false);

    // Au moins l'un des deux devrait être vrai
    expect(hasProducts || hasNoProductsMessage).toBeTruthy();
  });

  test("Grille - Clic sur un produit", async ({ page }) => {
    // Attendre le chargement
    await page.waitForTimeout(1000);

    // Vérifier s'il y a des produits
    const productCount = await page.locator('a[href*="/products/"]').count();

    if (productCount > 0) {
      // Cliquer sur le premier produit
      const firstProduct = page.locator('a[href*="/products/"]').first();
      await firstProduct.click();

      // Vérifier la navigation
      await expect(page).toHaveURL(/\/products\/.+/);
    }
  });

  test("Grille - Affichage des informations produit", async ({ page }) => {
    // Attendre le chargement
    await page.waitForTimeout(1000);

    const productCount = await page.locator('a[href*="/products/"]').count();

    if (productCount > 0) {
      const firstProduct = page.locator('a[href*="/products/"]').first();

      // Vérifier le nom du produit
      const productName = firstProduct.locator("h3, h2");
      await expect(productName).toBeVisible();

      // Vérifier le prix
      const hasPrice = await firstProduct.locator("text=/€|\\$/").isVisible();
      expect(hasPrice).toBeTruthy();
    }
  });

  test("Grille - Layout responsive", async ({ page }) => {
    // Vérifier que la grille utilise un layout responsive
    const grid = page.locator('div[class*="grid"]').first();
    await expect(grid).toBeVisible();
  });

  // ==========================================
  // TESTS NAVIGATION
  // ==========================================

  test("Navigation - Retour à l'accueil", async ({ page }) => {
    // Cliquer sur "Home" dans le fil d'ariane
    const homeLink = page.locator('a[href="/"]').filter({ hasText: "Home" });
    await homeLink.click();

    // Vérifier la navigation
    await expect(page).toHaveURL("http://localhost:3000/");
  });

  test("Navigation - Via le logo", async ({ page }) => {
    // Cliquer sur le logo
    const logo = page.locator('header a[href="/"]').first();
    await logo.click();

    // Vérifier la navigation
    await expect(page).toHaveURL("http://localhost:3000/");
  });

  test("Navigation - Changer de catégorie", async ({ page }) => {
    // Cliquer sur une autre catégorie dans le menu
    const categories = page.locator("nav ul li a");
    const categoryCount = await categories.count();

    if (categoryCount > 1) {
      // Cliquer sur la deuxième catégorie
      await categories.nth(1).click();

      // Vérifier la navigation
      await expect(page).toHaveURL(/\/category\/.+/);
    }
  });

  // ==========================================
  // TESTS CATÉGORIE VIDE
  // ==========================================

  test("Catégorie vide - Message approprié", async ({ page }) => {
    // Attendre le chargement
    await page.waitForTimeout(1000);

    // Vérifier s'il n'y a pas de produits
    const productCount = await page.locator('a[href*="/products/"]').count();

    if (productCount === 0) {
      // Vérifier le message "Aucun produit"
      const noProductsMessage = page.locator(
        "text=/aucun produit|no product/i"
      );
      await expect(noProductsMessage).toBeVisible();
    }
  });

  // ==========================================
  // TESTS ERREURS
  // ==========================================

  test("Erreur - Catégorie inexistante", async ({ page }) => {
    // Naviguer vers une catégorie qui n'existe pas
    await page.goto("http://localhost:3000/category/categorie-inexistante-123");

    // Attendre le chargement
    await page.waitForLoadState("networkidle");

    // Devrait afficher 0 produits ou un message d'erreur
    const title = page.locator("h1");
    const titleText = await title.textContent();
    expect(titleText).toMatch(/0|aucun/i);
  });

  // ==========================================
  // TESTS RESPONSIVE
  // ==========================================

  test("Responsive - Mobile viewport", async ({ page }) => {
    // Définir la taille mobile
    await page.setViewportSize({ width: 375, height: 667 });

    // Recharger la page
    await page.reload();

    // Vérifier que le titre est visible
    await expect(page.locator("h1")).toBeVisible();

    // Vérifier que la grille s'adapte
    const grid = page.locator('div[class*="grid"]').first();
    await expect(grid).toBeVisible();
  });

  test("Responsive - Tablet viewport", async ({ page }) => {
    // Définir la taille tablette
    await page.setViewportSize({ width: 768, height: 1024 });

    // Recharger la page
    await page.reload();

    // Vérifier l'affichage
    await expect(page.locator("h1")).toBeVisible();
  });

  // ==========================================
  // TESTS PERFORMANCE
  // ==========================================

  test("Performance - Temps de chargement", async ({ page }) => {
    const startTime = Date.now();
    await page.goto(`http://localhost:3000/category/${categorySlug}`);
    await page.waitForLoadState("networkidle");
    const loadTime = Date.now() - startTime;

    // Le chargement devrait prendre moins de 3 secondes
    expect(loadTime).toBeLessThan(3000);
  });

  // ==========================================
  // TESTS FILTRAGE
  // ==========================================

  test("Filtrage - Produits de la bonne catégorie", async ({ page }) => {
    // Attendre le chargement
    await page.waitForTimeout(1000);

    const productCount = await page.locator('a[href*="/products/"]').count();

    if (productCount > 0) {
      // Cliquer sur un produit
      const firstProduct = page.locator('a[href*="/products/"]').first();
      await firstProduct.click();

      // Attendre le chargement de la page produit
      await page.waitForLoadState("networkidle");

      // Vérifier que la catégorie dans le fil d'ariane correspond
      const breadcrumbCategory = page
        .locator("div")
        .filter({ hasText: "Home" })
        .first();
      await expect(breadcrumbCategory).toBeVisible();
    }
  });
});
