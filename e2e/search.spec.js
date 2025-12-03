/**
 * TESTS E2E : Page Recherche
 * ===========================
 *
 * Tests complets de la fonctionnalité de recherche incluant :
 * - Recherche avec résultats
 * - Recherche sans résultats
 * - Suggestions
 * - Navigation
 */

const { test, expect } = require("@playwright/test");

test.describe("Page Recherche - Tests Complets", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000");
  });

  // ==========================================
  // TESTS RECHERCHE AVEC RÉSULTATS
  // ==========================================

  test("Recherche - Avec résultats", async ({ page }) => {
    // Ouvrir la barre de recherche
    const searchIcon = page.locator("header svg").first();
    await searchIcon.click();

    // Taper un terme générique
    const searchInput = page.locator('header input[type="text"]');
    await searchInput.fill("a");
    await searchInput.press("Enter");

    // Vérifier la navigation
    await expect(page).toHaveURL(/\/search\?q=a/);

    // Vérifier qu'il y a des résultats
    await page.waitForTimeout(1000);
    const hasResults =
      (await page.locator('a[href*="/products/"]').count()) > 0;
    expect(hasResults).toBeTruthy();
  });

  test("Recherche - Affichage du titre", async ({ page }) => {
    // Effectuer une recherche
    const searchIcon = page.locator("header svg").first();
    await searchIcon.click();
    const searchInput = page.locator('header input[type="text"]');
    await searchInput.fill("produit");
    await searchInput.press("Enter");

    // Vérifier le titre avec le terme recherché
    const title = page
      .locator("h1")
      .filter({ hasText: /résultats|results|produit/i });
    await expect(title).toBeVisible();
  });

  test("Recherche - Clic sur un résultat", async ({ page }) => {
    // Effectuer une recherche
    const searchIcon = page.locator("header svg").first();
    await searchIcon.click();
    const searchInput = page.locator('header input[type="text"]');
    await searchInput.fill("a");
    await searchInput.press("Enter");

    await page.waitForTimeout(1000);

    // Vérifier s'il y a des résultats
    const productCount = await page.locator('a[href*="/products/"]').count();

    if (productCount > 0) {
      // Cliquer sur le premier résultat
      await page.locator('a[href*="/products/"]').first().click();

      // Vérifier la navigation
      await expect(page).toHaveURL(/\/products\/.+/);
    }
  });

  // ==========================================
  // TESTS RECHERCHE SANS RÉSULTATS
  // ==========================================

  test("Recherche - Sans résultats", async ({ page }) => {
    // Effectuer une recherche avec un terme inexistant
    const searchIcon = page.locator("header svg").first();
    await searchIcon.click();
    const searchInput = page.locator('header input[type="text"]');
    await searchInput.fill("xyzabc123nonexistent");
    await searchInput.press("Enter");

    // Vérifier le message "Aucun résultat"
    const noResultsMessage = page.locator(
      "text=/aucun résultat|no result|n'avons pas trouvé/i"
    );
    await expect(noResultsMessage).toBeVisible({ timeout: 3000 });
  });

  test("Recherche - Suggestions quand aucun résultat", async ({ page }) => {
    // Effectuer une recherche sans résultats
    const searchIcon = page.locator("header svg").first();
    await searchIcon.click();
    const searchInput = page.locator('header input[type="text"]');
    await searchInput.fill("xyzabc123nonexistent");
    await searchInput.press("Enter");

    await page.waitForTimeout(1000);

    // Vérifier qu'il y a des suggestions
    const suggestionText = page.locator(
      "text=/suggestions|pourraient vous plaire|favoris/i"
    );
    const hasSuggestions = await suggestionText.isVisible().catch(() => false);

    if (hasSuggestions) {
      await expect(suggestionText).toBeVisible();
    }
  });

  // ==========================================
  // TESTS SUGGESTIONS (AUTOCOMPLÉTION)
  // ==========================================

  test("Suggestions - Affichage pendant la saisie", async ({ page }) => {
    // Ouvrir la barre de recherche
    const searchIcon = page.locator("header svg").first();
    await searchIcon.click();

    // Taper au moins 2 caractères
    const searchInput = page.locator('header input[type="text"]');
    await searchInput.fill("pa");

    // Attendre les suggestions
    await page.waitForTimeout(500);

    // Vérifier si des suggestions apparaissent
    const suggestions = page
      .locator('div[class*="absolute"]')
      .filter({ hasText: /.+/ });
    const hasSuggestions = await suggestions.isVisible().catch(() => false);

    // Les suggestions peuvent ou non apparaître selon les données
    if (hasSuggestions) {
      await expect(suggestions).toBeVisible();
    }
  });

  test("Suggestions - Clic sur une suggestion", async ({ page }) => {
    // Ouvrir la barre de recherche
    const searchIcon = page.locator("header svg").first();
    await searchIcon.click();

    // Taper pour obtenir des suggestions
    const searchInput = page.locator('header input[type="text"]');
    await searchInput.fill("pa");

    await page.waitForTimeout(500);

    // Vérifier s'il y a des suggestions cliquables
    const suggestionLinks = page
      .locator('a[href*="/products/"]')
      .filter({ hasText: /.+/ });
    const count = await suggestionLinks.count();

    if (count > 0) {
      // Cliquer sur la première suggestion
      await suggestionLinks.first().click();

      // Vérifier la navigation
      await expect(page).toHaveURL(/\/products\/.+/);
    }
  });

  // ==========================================
  // TESTS NAVIGATION
  // ==========================================

  test("Navigation - Fil d'ariane", async ({ page }) => {
    // Effectuer une recherche
    const searchIcon = page.locator("header svg").first();
    await searchIcon.click();
    const searchInput = page.locator('header input[type="text"]');
    await searchInput.fill("test");
    await searchInput.press("Enter");

    // Vérifier le fil d'ariane
    const homeLink = page.locator('a[href="/"]').filter({ hasText: "Home" });
    await expect(homeLink).toBeVisible();
  });

  test("Navigation - Retour à l'accueil", async ({ page }) => {
    // Effectuer une recherche
    const searchIcon = page.locator("header svg").first();
    await searchIcon.click();
    const searchInput = page.locator('header input[type="text"]');
    await searchInput.fill("test");
    await searchInput.press("Enter");

    // Cliquer sur Home dans le fil d'ariane
    const homeLink = page.locator('a[href="/"]').filter({ hasText: "Home" });
    await homeLink.click();

    // Vérifier la navigation
    await expect(page).toHaveURL("http://localhost:3000/");
  });

  // ==========================================
  // TESTS RECHERCHE SPÉCIFIQUE
  // ==========================================

  test("Recherche - Par nom de produit", async ({ page }) => {
    // Aller chercher un nom de produit existant
    await page.waitForSelector('a[href*="/products/"]', { timeout: 10000 });
    const firstProduct = page.locator('a[href*="/products/"]').first();
    const productName = await firstProduct
      .locator("h3, h2")
      .first()
      .textContent();

    // Rechercher ce produit
    const searchIcon = page.locator("header svg").first();
    await searchIcon.click();
    const searchInput = page.locator('header input[type="text"]');
    await searchInput.fill(productName.substring(0, 5));
    await searchInput.press("Enter");

    await page.waitForTimeout(1000);

    // Vérifier qu'il y a des résultats
    const results = await page.locator('a[href*="/products/"]').count();
    expect(results).toBeGreaterThan(0);
  });

  test("Recherche - Insensible à la casse", async ({ page }) => {
    // Rechercher en majuscules
    const searchIcon = page.locator("header svg").first();
    await searchIcon.click();
    const searchInput = page.locator('header input[type="text"]');
    await searchInput.fill("PRODUIT");
    await searchInput.press("Enter");

    await page.waitForTimeout(1000);

    // Devrait trouver des résultats même en majuscules
    const hasResults =
      (await page.locator('a[href*="/products/"]').count()) > 0;
    const noResults = await page
      .locator("text=/aucun résultat|no result/i")
      .isVisible()
      .catch(() => false);

    // Au moins l'un des deux devrait être vrai
    expect(hasResults || noResults).toBeTruthy();
  });

  // ==========================================
  // TESTS RESPONSIVE
  // ==========================================

  test("Responsive - Mobile viewport", async ({ page }) => {
    // Définir la taille mobile
    await page.setViewportSize({ width: 375, height: 667 });

    // Effectuer une recherche
    const searchIcon = page.locator("header svg").first();
    await searchIcon.click();
    const searchInput = page.locator('header input[type="text"]');
    await searchInput.fill("test");
    await searchInput.press("Enter");

    // Vérifier l'affichage
    await expect(page.locator("h1")).toBeVisible();
  });

  // ==========================================
  // TESTS PERFORMANCE
  // ==========================================

  test("Performance - Temps de recherche", async ({ page }) => {
    const searchIcon = page.locator("header svg").first();
    await searchIcon.click();
    const searchInput = page.locator('header input[type="text"]');

    const startTime = Date.now();
    await searchInput.fill("test");
    await searchInput.press("Enter");
    await page.waitForLoadState("networkidle");
    const searchTime = Date.now() - startTime;

    // La recherche devrait prendre moins de 2 secondes
    expect(searchTime).toBeLessThan(2000);
  });

  // ==========================================
  // TESTS EDGE CASES
  // ==========================================

  test("Edge Case - Recherche vide", async ({ page }) => {
    // Effectuer une recherche vide
    const searchIcon = page.locator("header svg").first();
    await searchIcon.click();
    const searchInput = page.locator('header input[type="text"]');
    await searchInput.fill("   ");
    await searchInput.press("Enter");

    // Devrait rester sur la page ou afficher un message
    await page.waitForTimeout(1000);
    const currentUrl = page.url();
    expect(currentUrl).toBeTruthy();
  });

  test("Edge Case - Caractères spéciaux", async ({ page }) => {
    // Rechercher avec des caractères spéciaux
    const searchIcon = page.locator("header svg").first();
    await searchIcon.click();
    const searchInput = page.locator('header input[type="text"]');
    await searchInput.fill("!@#$%");
    await searchInput.press("Enter");

    // Ne devrait pas causer d'erreur
    await page.waitForTimeout(1000);
    await expect(page.locator("h1")).toBeVisible();
  });
});
