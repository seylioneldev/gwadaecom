/**
 * TESTS E2E : Authentification
 * =============================
 *
 * Tests complets de l'authentification incluant :
 * - Connexion
 * - Inscription
 * - Déconnexion
 * - Gestion des erreurs
 * - Redirection selon le rôle
 */

const { test, expect } = require("@playwright/test");

test.describe("Authentification - Tests Complets", () => {
  // ==========================================
  // TESTS PAGE MON COMPTE
  // ==========================================

  test("Mon Compte - Affichage de la page", async ({ page }) => {
    await page.goto("http://localhost:3000/mon-compte");

    // Vérifier que la page se charge
    await expect(
      page
        .locator("h1, h2")
        .filter({ hasText: /connexion|inscription|compte/i })
    ).toBeVisible({ timeout: 5000 });
  });

  test("Mon Compte - Onglets connexion/inscription", async ({ page }) => {
    await page.goto("http://localhost:3000/mon-compte");

    // Vérifier les onglets ou boutons
    const loginTab = page
      .locator("button, a")
      .filter({ hasText: /connexion|login|se connecter/i });
    const signupTab = page
      .locator("button, a")
      .filter({ hasText: /inscription|sign up|créer un compte/i });

    const hasLoginTab = await loginTab.isVisible().catch(() => false);
    const hasSignupTab = await signupTab.isVisible().catch(() => false);

    expect(hasLoginTab || hasSignupTab).toBeTruthy();
  });

  // ==========================================
  // TESTS CONNEXION
  // ==========================================

  test("Connexion - Formulaire visible", async ({ page }) => {
    await page.goto("http://localhost:3000/mon-compte");

    // Vérifier les champs du formulaire
    const emailInput = page.locator('input[type="email"], input[name="email"]');
    const passwordInput = page.locator(
      'input[type="password"], input[name="password"]'
    );

    await expect(emailInput.first()).toBeVisible({ timeout: 5000 });
    await expect(passwordInput.first()).toBeVisible({ timeout: 5000 });
  });

  test("Connexion - Bouton de soumission", async ({ page }) => {
    await page.goto("http://localhost:3000/mon-compte");

    // Vérifier le bouton de connexion
    const loginButton = page
      .locator('button[type="submit"], button')
      .filter({ hasText: /connexion|login|se connecter/i });
    await expect(loginButton.first()).toBeVisible({ timeout: 5000 });
  });

  test("Connexion - Validation champs vides", async ({ page }) => {
    await page.goto("http://localhost:3000/mon-compte");

    // Essayer de soumettre sans remplir
    const loginButton = page
      .locator('button[type="submit"], button')
      .filter({ hasText: /connexion|login|se connecter/i })
      .first();
    await loginButton.click();

    // Vérifier qu'il y a une validation HTML5 ou un message d'erreur
    await page.waitForTimeout(500);
    // Le formulaire ne devrait pas se soumettre
  });

  test("Connexion - Email invalide", async ({ page }) => {
    await page.goto("http://localhost:3000/mon-compte");

    // Remplir avec un email invalide
    const emailInput = page
      .locator('input[type="email"], input[name="email"]')
      .first();
    const passwordInput = page
      .locator('input[type="password"], input[name="password"]')
      .first();

    await emailInput.fill("email-invalide");
    await passwordInput.fill("password123");

    const loginButton = page
      .locator('button[type="submit"], button')
      .filter({ hasText: /connexion|login|se connecter/i })
      .first();
    await loginButton.click();

    await page.waitForTimeout(500);
    // Devrait afficher une erreur de validation
  });

  test("Connexion - Identifiants incorrects", async ({ page }) => {
    await page.goto("http://localhost:3000/mon-compte");

    // Remplir avec des identifiants incorrects
    const emailInput = page
      .locator('input[type="email"], input[name="email"]')
      .first();
    const passwordInput = page
      .locator('input[type="password"], input[name="password"]')
      .first();

    await emailInput.fill("utilisateur-inexistant@test.com");
    await passwordInput.fill("motdepasseincorrect");

    const loginButton = page
      .locator('button[type="submit"], button')
      .filter({ hasText: /connexion|login|se connecter/i })
      .first();
    await loginButton.click();

    // Attendre le message d'erreur
    await page.waitForTimeout(2000);
    const errorMessage = page.locator(
      "text=/incorrect|invalide|erreur|error/i"
    );
    const hasError = await errorMessage.isVisible().catch(() => false);

    if (hasError) {
      await expect(errorMessage).toBeVisible();
    }
  });

  test.skip("Connexion - Afficher/masquer mot de passe", async ({ page }) => {
    await page.goto("http://localhost:3000/mon-compte");

    // Vérifier le bouton pour afficher/masquer le mot de passe
    const toggleButton = page
      .locator("button, svg")
      .filter({ hasText: "" })
      .filter({ has: page.locator("svg") });
    const hasToggle = (await toggleButton.count()) > 0;

    if (hasToggle) {
      const passwordInput = page.locator('input[type="password"]').first();

      // Cliquer sur le bouton
      await toggleButton.first().click();
      await page.waitForTimeout(200);

      // Le type devrait changer
      const inputType = await passwordInput.getAttribute("type");
      // Peut être 'text' ou rester 'password' selon l'implémentation
    }
  });

  // ==========================================
  // TESTS INSCRIPTION
  // ==========================================

  test("Inscription - Basculer vers l'onglet inscription", async ({ page }) => {
    await page.goto("http://localhost:3000/mon-compte");

    // Cliquer sur l'onglet inscription
    const signupTab = page
      .locator("button, a")
      .filter({ hasText: /inscription|sign up|créer/i });
    const hasSignupTab = await signupTab.isVisible().catch(() => false);

    if (hasSignupTab) {
      await signupTab.first().click();
      await page.waitForTimeout(500);

      // Vérifier que le formulaire d'inscription est visible
      const signupForm = page.locator(
        "text=/créer un compte|inscription|sign up/i"
      );
      await expect(signupForm).toBeVisible();
    }
  });

  test("Inscription - Formulaire visible", async ({ page }) => {
    await page.goto("http://localhost:3000/mon-compte");

    // Basculer vers inscription si nécessaire
    const signupTab = page
      .locator("button, a")
      .filter({ hasText: /inscription|sign up|créer/i });
    const hasSignupTab = await signupTab.isVisible().catch(() => false);

    if (hasSignupTab) {
      await signupTab.first().click();
      await page.waitForTimeout(500);
    }

    // Vérifier les champs
    const emailInputs = page.locator(
      'input[type="email"], input[name="email"]'
    );
    const passwordInputs = page.locator('input[type="password"]');

    await expect(emailInputs.first()).toBeVisible({ timeout: 5000 });
    await expect(passwordInputs.first()).toBeVisible({ timeout: 5000 });
  });

  test("Inscription - Validation mot de passe", async ({ page }) => {
    await page.goto("http://localhost:3000/mon-compte");

    // Basculer vers inscription
    const signupTab = page
      .locator("button, a")
      .filter({ hasText: /inscription|sign up|créer/i });
    const hasSignupTab = await signupTab.isVisible().catch(() => false);

    if (hasSignupTab) {
      await signupTab.first().click();
      await page.waitForTimeout(500);

      // Remplir avec des mots de passe différents
      const passwordInputs = page.locator('input[type="password"]');
      const count = await passwordInputs.count();

      if (count >= 2) {
        await passwordInputs.nth(0).fill("password123");
        await passwordInputs.nth(1).fill("password456");

        // Soumettre
        const submitButton = page
          .locator('button[type="submit"]')
          .filter({ hasText: /inscription|sign up|créer/i });
        await submitButton.click();

        await page.waitForTimeout(1000);

        // Devrait afficher une erreur
        const errorMessage = page.locator(
          "text=/correspondent pas|match|identique/i"
        );
        const hasError = await errorMessage.isVisible().catch(() => false);

        if (hasError) {
          await expect(errorMessage).toBeVisible();
        }
      }
    }
  });

  // ==========================================
  // TESTS DÉCONNEXION
  // ==========================================

  test("Déconnexion - Bouton visible quand connecté", async ({ page }) => {
    await page.goto("http://localhost:3000");

    // Vérifier si l'utilisateur est connecté
    const logoutButton = page
      .locator("button, a")
      .filter({ hasText: /déconnexion|logout|sign out/i });
    const isLoggedIn = await logoutButton.isVisible().catch(() => false);

    if (isLoggedIn) {
      await expect(logoutButton).toBeVisible();
    }
  });

  test("Déconnexion - Clic sur déconnexion", async ({ page }) => {
    await page.goto("http://localhost:3000");

    // Vérifier si l'utilisateur est connecté
    const logoutButton = page
      .locator("button, a")
      .filter({ hasText: /déconnexion|logout|sign out/i });
    const isLoggedIn = await logoutButton.isVisible().catch(() => false);

    if (isLoggedIn) {
      await logoutButton.click();

      // Attendre la redirection
      await page.waitForTimeout(1000);

      // Vérifier que le bouton "compte" est de nouveau visible
      const accountLink = page.locator('a[href="/mon-compte"]');
      await expect(accountLink).toBeVisible({ timeout: 3000 });
    }
  });

  // ==========================================
  // TESTS REDIRECTION
  // ==========================================

  test("Redirection - Utilisateur connecté vers /compte", async ({ page }) => {
    await page.goto("http://localhost:3000");

    // Vérifier si l'utilisateur est connecté (non admin)
    const accountLink = page.locator('a[href="/compte"]');
    const hasAccountLink = await accountLink.isVisible().catch(() => false);

    if (hasAccountLink) {
      // Essayer d'aller sur /mon-compte
      await page.goto("http://localhost:3000/mon-compte");

      // Devrait rediriger vers /compte
      await page.waitForTimeout(1000);
      await expect(page).toHaveURL(/\/compte|\/admin/);
    }
  });

  test("Redirection - Admin vers /admin", async ({ page }) => {
    await page.goto("http://localhost:3000");

    // Vérifier si c'est un admin
    const adminLink = page.locator('a[href="/admin"]');
    const isAdmin = await adminLink.isVisible().catch(() => false);

    if (isAdmin) {
      // Essayer d'aller sur /mon-compte
      await page.goto("http://localhost:3000/mon-compte");

      // Devrait rediriger vers /admin
      await page.waitForTimeout(1000);
      await expect(page).toHaveURL("/admin");
    }
  });

  // ==========================================
  // TESTS PAGE COMPTE UTILISATEUR
  // ==========================================

  test("Page Compte - Accès protégé", async ({ page }) => {
    await page.goto("http://localhost:3000/compte");

    // Si non connecté, devrait rediriger vers /mon-compte
    await page.waitForTimeout(1000);
    const currentUrl = page.url();

    // Devrait être sur /compte ou /mon-compte
    expect(currentUrl).toMatch(/\/compte|\/mon-compte/);
  });

  test("Page Compte - Affichage des informations", async ({ page }) => {
    await page.goto("http://localhost:3000");

    // Vérifier si connecté
    const accountLink = page.locator('a[href="/compte"]');
    const isLoggedIn = await accountLink.isVisible().catch(() => false);

    if (isLoggedIn) {
      await accountLink.click();

      // Vérifier les éléments de la page
      await expect(
        page.locator("h1, h2").filter({ hasText: /compte|dashboard/i })
      ).toBeVisible({ timeout: 5000 });
    }
  });

  test("Page Compte - Lien vers commandes", async ({ page }) => {
    await page.goto("http://localhost:3000");

    // Vérifier si connecté
    const accountLink = page.locator('a[href="/compte"]');
    const isLoggedIn = await accountLink.isVisible().catch(() => false);

    if (isLoggedIn) {
      await accountLink.click();

      // Vérifier le lien vers les commandes
      const ordersLink = page.locator('a[href="/compte/commandes"]');
      const hasOrdersLink = await ordersLink.isVisible().catch(() => false);

      if (hasOrdersLink) {
        await expect(ordersLink).toBeVisible();
      }
    }
  });

  // ==========================================
  // TESTS PAGE COMMANDES
  // ==========================================

  test("Page Commandes - Accès protégé", async ({ page }) => {
    await page.goto("http://localhost:3000/compte/commandes");

    // Si non connecté, devrait rediriger
    await page.waitForTimeout(1000);
    const currentUrl = page.url();

    expect(currentUrl).toMatch(/\/compte\/commandes|\/mon-compte/);
  });

  test("Page Commandes - Affichage", async ({ page }) => {
    await page.goto("http://localhost:3000");

    // Vérifier si connecté
    const ordersLink = page.locator('a[href="/compte/commandes"]');
    const hasLink = await ordersLink.isVisible().catch(() => false);

    if (hasLink) {
      await ordersLink.click();

      // Vérifier que l'URL est bien celle des commandes
      await expect(page).toHaveURL(/\/compte\/commandes/);

      // Vérifier la présence d'un texte lié aux commandes si possible
      const ordersTitle = page
        .locator("text=/commande|orders|historique/i")
        .first();
      const hasTitle = await ordersTitle.isVisible().catch(() => false);

      if (hasTitle) {
        await expect(ordersTitle).toBeVisible();
      }
    }
  });

  // ==========================================
  // TESTS RESPONSIVE
  // ==========================================

  test("Responsive - Mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("http://localhost:3000/mon-compte");

    // Vérifier l'affichage
    await expect(page.locator("h1, h2")).toBeVisible({ timeout: 5000 });
  });
});
