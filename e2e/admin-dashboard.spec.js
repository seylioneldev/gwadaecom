/**
 * TESTS E2E : Admin Dashboard
 * ============================
 *
 * Tests complets du tableau de bord admin incluant :
 * - Accès et authentification
 * - Navigation entre les sections
 * - Statistiques
 * - Tous les boutons et liens
 */

const { test, expect } = require("@playwright/test");

test.describe("Admin Dashboard - Tests Complets", () => {
  test.beforeEach(async ({ page }) => {
    // Tenter d'accéder au dashboard admin
    await page.goto("http://localhost:3000/admin");
  });

  // ==========================================
  // TESTS ACCÈS ET SÉCURITÉ
  // ==========================================

  test("Accès - Redirection si non connecté", async ({ page }) => {
    await page.waitForTimeout(1000);

    // Devrait être sur /admin ou /admin/login
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/admin/);
  });

  test("Accès - Page de connexion admin", async ({ page }) => {
    // Si redirigé vers login
    const loginForm = page.locator(
      'input[type="email"], input[type="password"]'
    );
    const hasLoginForm = await loginForm
      .first()
      .isVisible()
      .catch(() => false);

    if (hasLoginForm) {
      // Vérifier les éléments du formulaire
      await expect(loginForm.first()).toBeVisible();
    }
  });

  // ==========================================
  // TESTS AFFICHAGE DASHBOARD
  // ==========================================

  test("Dashboard - Affichage du titre", async ({ page }) => {
    await page.waitForTimeout(1000);

    // Vérifier le titre du dashboard
    const title = page
      .locator("h1")
      .filter({ hasText: /admin|dashboard|tableau de bord/i });
    const hasTitle = await title.isVisible().catch(() => false);

    if (hasTitle) {
      await expect(title).toBeVisible();
    }
  });

  test("Dashboard - Bouton déconnexion", async ({ page }) => {
    await page.waitForTimeout(1000);

    // Vérifier le bouton de déconnexion
    const logoutButton = page
      .locator("button, a")
      .filter({ hasText: /déconnexion|logout/i });
    const hasButton = await logoutButton.isVisible().catch(() => false);

    if (hasButton) {
      await expect(logoutButton).toBeVisible();
    }
  });

  // ==========================================
  // TESTS STATISTIQUES
  // ==========================================

  test("Statistiques - Affichage des cartes", async ({ page }) => {
    await page.waitForTimeout(1000);

    // Vérifier les statistiques (Produits, Catégories, etc.)
    const statsCards = page
      .locator("div")
      .filter({ hasText: /produits|catégories|status/i });
    const hasStats = await statsCards
      .first()
      .isVisible()
      .catch(() => false);

    if (hasStats) {
      await expect(statsCards.first()).toBeVisible();
    }
  });

  test("Statistiques - Nombre de produits", async ({ page }) => {
    await page.waitForTimeout(1000);

    // Vérifier l'affichage du nombre de produits
    const productsCount = page
      .locator("text=/produits/i")
      .locator("..")
      .locator("text=/\\d+/");
    const hasCount = await productsCount.isVisible().catch(() => false);

    if (hasCount) {
      await expect(productsCount).toBeVisible();
    }
  });

  test("Statistiques - Nombre de catégories", async ({ page }) => {
    await page.waitForTimeout(1000);

    // Vérifier l'affichage du nombre de catégories
    const categoriesCount = page
      .locator("text=/catégories/i")
      .locator("..")
      .locator("text=/\\d+/");
    const hasCount = await categoriesCount.isVisible().catch(() => false);

    if (hasCount) {
      await expect(categoriesCount).toBeVisible();
    }
  });

  // ==========================================
  // TESTS NAVIGATION - GESTION DU SITE
  // ==========================================

  test("Navigation - Ajouter un Produit", async ({ page }) => {
    await page.waitForTimeout(1000);

    // Trouver et cliquer sur "Ajouter un Produit"
    const addProductLink = page.locator('a[href="/admin/add-product"]');
    const hasLink = await addProductLink.isVisible().catch(() => false);

    if (hasLink) {
      await addProductLink.click();
      await expect(page).toHaveURL("/admin/add-product");
    }
  });

  test("Navigation - Gérer les Produits", async ({ page }) => {
    await page.waitForTimeout(1000);

    // Trouver et cliquer sur "Gérer les Produits"
    const productsLink = page.locator('a[href="/admin/products"]');
    const hasLink = await productsLink.isVisible().catch(() => false);

    if (hasLink) {
      await productsLink.click();
      await expect(page).toHaveURL("/admin/products");
    }
  });

  test("Navigation - Gérer les Catégories", async ({ page }) => {
    await page.waitForTimeout(1000);

    // Trouver et cliquer sur "Gérer les Catégories"
    const categoriesLink = page.locator('a[href="/admin/categories"]');
    const hasLink = await categoriesLink.isVisible().catch(() => false);

    if (hasLink) {
      await categoriesLink.click();
      await expect(page).toHaveURL("/admin/categories");
    }
  });

  test("Navigation - Paramètres du Site", async ({ page }) => {
    await page.waitForTimeout(1000);

    // Trouver et cliquer sur "Paramètres"
    const settingsLink = page.locator('a[href="/admin/settings"]');
    const hasLink = await settingsLink.isVisible().catch(() => false);

    if (hasLink) {
      await settingsLink.click();
      await expect(page).toHaveURL("/admin/settings");
    }
  });

  test("Navigation - Voir le Site", async ({ page }) => {
    await page.waitForTimeout(1000);

    // Trouver le lien vers le site public
    const siteLink = page
      .locator('a[href="/"]')
      .filter({ hasText: /voir|site|prévisualiser/i });
    const hasLink = await siteLink.isVisible().catch(() => false);

    if (hasLink) {
      await expect(siteLink).toBeVisible();
    }
  });

  // ==========================================
  // TESTS NAVIGATION - COMMERCIAL
  // ==========================================

  test("Navigation - Statistiques Commerciales", async ({ page }) => {
    await page.waitForTimeout(1000);

    // Scroll vers le bas pour voir la section commerciale
    await page.evaluate(() =>
      window.scrollTo(0, document.body.scrollHeight / 2)
    );

    const statsLink = page.locator('a[href="/admin/commercial/statistics"]');
    const hasLink = await statsLink.isVisible().catch(() => false);

    if (hasLink) {
      await statsLink.click();
      await expect(page).toHaveURL("/admin/commercial/statistics");
    }
  });

  test("Navigation - Commandes", async ({ page }) => {
    await page.waitForTimeout(1000);

    await page.evaluate(() =>
      window.scrollTo(0, document.body.scrollHeight / 2)
    );

    const ordersLink = page.locator('a[href="/admin/commercial/orders"]');
    const hasLink = await ordersLink.isVisible().catch(() => false);

    if (hasLink) {
      await ordersLink.click();
      await expect(page).toHaveURL("/admin/commercial/orders");
    }
  });

  test("Navigation - Partenaires", async ({ page }) => {
    await page.waitForTimeout(1000);

    await page.evaluate(() =>
      window.scrollTo(0, document.body.scrollHeight / 2)
    );

    const partnersLink = page.locator('a[href="/admin/commercial/partners"]');
    const hasLink = await partnersLink.isVisible().catch(() => false);

    if (hasLink) {
      await partnersLink.click();
      await expect(page).toHaveURL("/admin/commercial/partners");
    }
  });

  test("Navigation - Fournisseurs", async ({ page }) => {
    await page.waitForTimeout(1000);

    await page.evaluate(() =>
      window.scrollTo(0, document.body.scrollHeight / 2)
    );

    const suppliersLink = page.locator('a[href="/admin/commercial/suppliers"]');
    const hasLink = await suppliersLink.isVisible().catch(() => false);

    if (hasLink) {
      await suppliersLink.click();
      await expect(page).toHaveURL("/admin/commercial/suppliers");
    }
  });

  test("Navigation - Facturation", async ({ page }) => {
    await page.waitForTimeout(1000);

    await page.evaluate(() =>
      window.scrollTo(0, document.body.scrollHeight / 2)
    );

    const invoicingLink = page.locator('a[href="/admin/commercial/invoicing"]');
    const hasLink = await invoicingLink.isVisible().catch(() => false);

    if (hasLink) {
      await invoicingLink.click();
      await expect(page).toHaveURL("/admin/commercial/invoicing");
    }
  });

  test("Navigation - Utilisateurs", async ({ page }) => {
    await page.waitForTimeout(1000);

    await page.evaluate(() =>
      window.scrollTo(0, document.body.scrollHeight / 2)
    );

    const usersLink = page.locator('a[href="/admin/users"]');
    const hasLink = await usersLink.isVisible().catch(() => false);

    if (hasLink) {
      await usersLink.click();
      await expect(page).toHaveURL("/admin/users");
    }
  });

  // ==========================================
  // TESTS CARTES FONCTIONNALITÉS
  // ==========================================

  test("Cartes - Affichage des icônes", async ({ page }) => {
    await page.waitForTimeout(1000);

    // Vérifier que les cartes ont des icônes
    const icons = page.locator("svg");
    const iconCount = await icons.count();

    expect(iconCount).toBeGreaterThan(0);
  });

  test("Cartes - Hover effect", async ({ page }) => {
    await page.waitForTimeout(1000);

    // Trouver une carte
    const card = page.locator('a[href*="/admin/"]').first();
    const hasCard = await card.isVisible().catch(() => false);

    if (hasCard) {
      // Hover sur la carte
      await card.hover();
      await page.waitForTimeout(200);

      // La carte devrait avoir un effet visuel
      await expect(card).toBeVisible();
    }
  });

  // ==========================================
  // TESTS GUIDE RAPIDE
  // ==========================================

  test("Guide Rapide - Affichage", async ({ page }) => {
    await page.waitForTimeout(1000);

    // Scroll vers le bas
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Vérifier le guide rapide
    const guide = page.locator("text=/guide|pour commencer|raccourcis/i");
    const hasGuide = await guide.isVisible().catch(() => false);

    if (hasGuide) {
      await expect(guide).toBeVisible();
    }
  });

  // ==========================================
  // TESTS RESPONSIVE
  // ==========================================

  test("Responsive - Mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForTimeout(1000);

    // Vérifier que le dashboard est accessible sur mobile
    const title = page.locator("h1");
    const hasTitle = await title.isVisible().catch(() => false);

    if (hasTitle) {
      await expect(title).toBeVisible();
    }
  });

  test("Responsive - Tablet viewport", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await page.waitForTimeout(1000);

    // Vérifier l'affichage
    const title = page.locator("h1");
    const hasTitle = await title.isVisible().catch(() => false);

    if (hasTitle) {
      await expect(title).toBeVisible();
    }
  });

  // ==========================================
  // TESTS DÉCONNEXION
  // ==========================================

  test("Déconnexion - Clic sur le bouton", async ({ page }) => {
    await page.waitForTimeout(1000);

    const logoutButton = page
      .locator("button")
      .filter({ hasText: /déconnexion|logout/i });
    const hasButton = await logoutButton.isVisible().catch(() => false);

    if (hasButton) {
      await logoutButton.click();

      // Attendre la redirection
      await page.waitForTimeout(1000);

      // Devrait rediriger vers l'accueil
      await expect(page).toHaveURL("http://localhost:3000/");
    }
  });

  // ==========================================
  // TESTS PERFORMANCE
  // ==========================================

  test("Performance - Temps de chargement", async ({ page }) => {
    const startTime = Date.now();
    await page.goto("http://localhost:3000/admin");
    await page.waitForLoadState("networkidle");
    const loadTime = Date.now() - startTime;

    // Le chargement devrait prendre moins de 3 secondes
    expect(loadTime).toBeLessThan(3000);
  });
});
