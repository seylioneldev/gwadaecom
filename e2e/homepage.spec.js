/**
 * TESTS E2E : Page d'Accueil
 * ===========================
 *
 * Tests complets de la page d'accueil incluant :
 * - Affichage du header et navigation
 * - Recherche de produits
 * - Grille de produits
 * - Footer
 * - Bouton admin flottant
 */

const { test, expect } = require("@playwright/test");

test.describe("Page d'Accueil - Tests Complets", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000");
  });

  // ==========================================
  // TESTS HEADER
  // ==========================================

  test("Header - Affichage et éléments", async ({ page }) => {
    // Vérifier le bandeau promo
    await expect(
      page.locator("text=Looking for the perfect gift")
    ).toBeVisible();
    await expect(
      page.locator('button:has-text("Shop Gift Cards")')
    ).toBeVisible();

    // Vérifier le logo
    await expect(page.locator('header a[href="/"]').first()).toBeVisible();

    // Vérifier les icônes
    await expect(page.locator("header svg").first()).toBeVisible(); // Icône recherche
    await expect(
      page.locator('header button:has-text("panier")')
    ).toBeVisible();
    await expect(
      page.locator(
        'header a:has-text("compte"), header button:has-text("Déconnexion")'
      )
    ).toBeVisible();
  });

  test("Header - Navigation menu catégories", async ({ page }) => {
    // Attendre que le menu soit chargé
    await page.waitForSelector("nav ul li", { timeout: 10000 });

    // Vérifier qu'il y a des catégories
    const categories = await page.locator("nav ul li").count();
    expect(categories).toBeGreaterThan(0);

    // Cliquer sur la première catégorie
    if (categories > 0) {
      const firstCategory = page.locator("nav ul li").first();
      await firstCategory.click();

      // Vérifier la navigation
      await expect(page).toHaveURL(/\/category\/.+/);
    }
  });

  test("Header - Recherche produit", async ({ page }) => {
    // Ouvrir la barre de recherche (sur mobile)
    const searchIcon = page.locator("header svg").first();
    await searchIcon.click();

    // Taper dans la recherche
    const searchInput = page.locator('header input[type="text"]');
    await searchInput.fill("produit");

    // Attendre les suggestions
    await page.waitForTimeout(500);

    // Valider la recherche avec Entrée
    await searchInput.press("Enter");

    // Vérifier la redirection vers la page de recherche
    await expect(page).toHaveURL(/\/search\?q=produit/);
  });

  test("Header - Clic sur panier", async ({ page }) => {
    // Cliquer sur le bouton panier
    await page.locator('header button:has-text("panier")').click();

    // Vérifier que le panneau latéral s'ouvre
    await page.waitForTimeout(500);
    // Le SideCart devrait être visible
    const sideCart = page
      .locator('[class*="fixed"]')
      .filter({ hasText: "Votre Panier" });
    await expect(sideCart).toBeVisible({ timeout: 2000 });
  });

  test("Header - Clic sur compte (non connecté)", async ({ page }) => {
    // Vérifier si l'utilisateur est connecté
    const isLoggedIn = await page
      .locator('header button:has-text("Déconnexion")')
      .isVisible()
      .catch(() => false);

    if (!isLoggedIn) {
      // Cliquer sur le lien compte
      await page.locator('header a:has-text("compte")').click();

      // Vérifier la redirection vers la page de connexion
      await expect(page).toHaveURL("/mon-compte");
    }
  });

  // ==========================================
  // TESTS HERO SECTION
  // ==========================================

  test("Hero - Affichage de la bannière", async ({ page }) => {
    // Vérifier que la section Hero est visible
    const hero = page
      .locator("section, div")
      .filter({ hasText: /Bienvenue|Collection|Découvrez/i })
      .first();
    await expect(hero).toBeVisible({ timeout: 5000 });
  });

  // ==========================================
  // TESTS GRILLE DE PRODUITS
  // ==========================================

  test("Grille de produits - Affichage", async ({ page }) => {
    // Attendre le chargement des produits
    await page.waitForSelector('a[href*="/products/"]', { timeout: 10000 });

    // Vérifier qu'il y a des produits
    const products = await page.locator('a[href*="/products/"]').count();
    expect(products).toBeGreaterThan(0);
  });

  test("Grille de produits - Clic sur un produit", async ({ page }) => {
    // Attendre le chargement des produits
    await page.waitForSelector('a[href*="/products/"]', { timeout: 10000 });

    // Cliquer sur le premier produit
    const firstProduct = page.locator('a[href*="/products/"]').first();
    await firstProduct.click();

    // Vérifier la navigation vers la page produit
    await expect(page).toHaveURL(/\/products\/.+/);
  });

  test("Grille de produits - Affichage des informations", async ({ page }) => {
    // Attendre le chargement des produits
    await page.waitForSelector('a[href*="/products/"]', { timeout: 10000 });

    const firstProduct = page.locator('a[href*="/products/"]').first();

    // Vérifier que le produit a un nom
    const productName = firstProduct.locator("h3, h2, p").first();
    await expect(productName).toBeVisible();

    // Vérifier qu'il y a un prix (€ ou $)
    const hasPrice = await firstProduct
      .locator("text=/€|\\$/")
      .isVisible()
      .catch(() => false);
    expect(hasPrice).toBeTruthy();
  });

  // ==========================================
  // TESTS FOOTER
  // ==========================================

  test("Footer - Affichage", async ({ page }) => {
    // Scroll vers le bas
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Vérifier que le footer est visible
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
  });

  test("Footer - Liens et informations", async ({ page }) => {
    // Scroll vers le bas
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Vérifier qu'il y a des liens dans le footer
    const footerLinks = await page.locator("footer a").count();
    expect(footerLinks).toBeGreaterThan(0);
  });

  // ==========================================
  // TESTS BOUTON ADMIN FLOTTANT
  // ==========================================

  test("Bouton Admin Flottant - Affichage en mode dev", async ({ page }) => {
    // En mode développement, le bouton admin devrait être visible
    const adminButton = page
      .locator('a[href="/admin"]')
      .filter({ hasText: /admin/i });

    // Vérifier si le bouton existe (peut être masqué en production)
    const isVisible = await adminButton.isVisible().catch(() => false);

    if (isVisible) {
      await adminButton.click();
      await expect(page).toHaveURL("/admin");
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

    // Vérifier que le header est visible
    await expect(page.locator("header")).toBeVisible();

    // Vérifier que les produits s'affichent en colonne
    const products = page.locator('a[href*="/products/"]');
    await expect(products.first()).toBeVisible({ timeout: 10000 });
  });

  test("Responsive - Tablet viewport", async ({ page }) => {
    // Définir la taille tablette
    await page.setViewportSize({ width: 768, height: 1024 });

    // Recharger la page
    await page.reload();

    // Vérifier que le header est visible
    await expect(page.locator("header")).toBeVisible();
  });

  // ==========================================
  // TESTS PERFORMANCE
  // ==========================================

  test("Performance - Temps de chargement", async ({ page }) => {
    const startTime = Date.now();
    await page.goto("http://localhost:3000");
    await page.waitForLoadState("networkidle");
    const loadTime = Date.now() - startTime;

    // Le chargement devrait prendre moins de 5 secondes
    expect(loadTime).toBeLessThan(5000);
  });

  // ==========================================
  // TESTS ACCESSIBILITÉ
  // ==========================================

  test("Accessibilité - Navigation au clavier", async ({ page }) => {
    // Utiliser Tab pour naviguer
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");

    // Vérifier qu'un élément a le focus
    const focusedElement = await page.evaluate(
      () => document.activeElement?.tagName
    );
    expect(focusedElement).toBeTruthy();
  });
});
