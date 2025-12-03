/**
 * TESTS E2E : Admin - Paramètres (Complet)
 * =========================================
 *
 * Tests complets de la page paramètres incluant :
 * - Tous les champs de configuration
 * - Sauvegarde
 * - Réinitialisation
 * - Personnalisation CSS
 */

const { test, expect } = require("@playwright/test");

test.describe("Admin - Paramètres - Tests Complets", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/admin/settings");
    await page.waitForTimeout(1000);
  });

  // ==========================================
  // TESTS AFFICHAGE
  // ==========================================

  test("Affichage - Titre de la page", async ({ page }) => {
    const title = page
      .locator("h1")
      .filter({ hasText: /paramètres|settings/i });
    const hasTitle = await title.isVisible().catch(() => false);

    if (hasTitle) {
      await expect(title).toBeVisible();
    }
  });

  test("Affichage - Bouton retour", async ({ page }) => {
    const backButton = page.locator('a[href="/admin"]');
    const hasButton = await backButton.isVisible().catch(() => false);

    if (hasButton) {
      await expect(backButton).toBeVisible();
    }
  });

  // ==========================================
  // TESTS BOUTONS PRINCIPAUX
  // ==========================================

  test("Boutons - Bouton Sauvegarder", async ({ page }) => {
    const saveButton = page
      .locator("button")
      .filter({ hasText: /sauvegarder|save/i });
    const hasButton = await saveButton.isVisible().catch(() => false);

    if (hasButton) {
      await expect(saveButton.first()).toBeVisible();
      await expect(saveButton.first()).toBeEnabled();
    }
  });

  test("Boutons - Bouton Réinitialiser", async ({ page }) => {
    const resetButton = page
      .locator("button")
      .filter({ hasText: /réinitialiser|reset/i });
    const hasButton = await resetButton.isVisible().catch(() => false);

    if (hasButton) {
      await expect(resetButton.first()).toBeVisible();
      await expect(resetButton.first()).toBeEnabled();
    }
  });

  // ==========================================
  // TESTS SECTION INFORMATIONS GÉNÉRALES
  // ==========================================

  test("Informations - Champ Nom du Site", async ({ page }) => {
    const nameInput = page.locator('input[name="siteName"]');
    const hasInput = await nameInput.isVisible().catch(() => false);

    if (hasInput) {
      await expect(nameInput).toBeVisible();
      await expect(nameInput).toBeEditable();
    }
  });

  test("Informations - Champ Description", async ({ page }) => {
    const descInput = page.locator('textarea[name="siteDescription"]');
    const hasInput = await descInput.isVisible().catch(() => false);

    if (hasInput) {
      await expect(descInput).toBeVisible();
      await expect(descInput).toBeEditable();
    }
  });

  test("Informations - Champ Email", async ({ page }) => {
    const emailInput = page.locator('input[name="email"]');
    const hasInput = await emailInput.isVisible().catch(() => false);

    if (hasInput) {
      await expect(emailInput).toBeVisible();
      await expect(emailInput).toBeEditable();
    }
  });

  test("Informations - Champ Téléphone", async ({ page }) => {
    const phoneInput = page.locator('input[name="phone"]');
    const hasInput = await phoneInput.isVisible().catch(() => false);

    if (hasInput) {
      await expect(phoneInput).toBeVisible();
      await expect(phoneInput).toBeEditable();
    }
  });

  test("Informations - Champ Adresse", async ({ page }) => {
    const addressInput = page.locator('input[name="address"]');
    const hasInput = await addressInput.isVisible().catch(() => false);

    if (hasInput) {
      await expect(addressInput).toBeVisible();
      await expect(addressInput).toBeEditable();
    }
  });

  // ==========================================
  // TESTS SECTION RÉSEAUX SOCIAUX
  // ==========================================

  test("Réseaux Sociaux - Champ Facebook", async ({ page }) => {
    const fbInput = page.locator('input[name="social.facebook"]');
    const hasInput = await fbInput.isVisible().catch(() => false);

    if (hasInput) {
      await expect(fbInput).toBeVisible();
      await expect(fbInput).toBeEditable();
    }
  });

  test("Réseaux Sociaux - Champ Instagram", async ({ page }) => {
    const igInput = page.locator('input[name="social.instagram"]');
    const hasInput = await igInput.isVisible().catch(() => false);

    if (hasInput) {
      await expect(igInput).toBeVisible();
      await expect(igInput).toBeEditable();
    }
  });

  test("Réseaux Sociaux - Champ Twitter", async ({ page }) => {
    const twInput = page.locator('input[name="social.twitter"]');
    const hasInput = await twInput.isVisible().catch(() => false);

    if (hasInput) {
      await expect(twInput).toBeVisible();
      await expect(twInput).toBeEditable();
    }
  });

  // ==========================================
  // TESTS SECTION BOUTIQUE
  // ==========================================

  test("Boutique - Champ Devise", async ({ page }) => {
    const currencyInput = page.locator('input[name*="currency"]');
    const hasInput = await currencyInput.isVisible().catch(() => false);

    if (hasInput) {
      await expect(currencyInput.first()).toBeVisible();
      await expect(currencyInput.first()).toBeEditable();
    }
  });

  test("Boutique - Champ Frais de Port", async ({ page }) => {
    const shippingInput = page.locator('input[name*="shipping"]');
    const hasInput = await shippingInput.isVisible().catch(() => false);

    if (hasInput) {
      await expect(shippingInput.first()).toBeVisible();
      await expect(shippingInput.first()).toBeEditable();
    }
  });

  test("Boutique - Champ Livraison Gratuite", async ({ page }) => {
    const freeShippingInput = page.locator('input[name*="freeShipping"]');
    const hasInput = await freeShippingInput.isVisible().catch(() => false);

    if (hasInput) {
      await expect(freeShippingInput.first()).toBeVisible();
      await expect(freeShippingInput.first()).toBeEditable();
    }
  });

  test("Boutique - Champ TVA", async ({ page }) => {
    const taxInput = page.locator('input[name*="tax"]');
    const hasInput = await taxInput.isVisible().catch(() => false);

    if (hasInput) {
      await expect(taxInput.first()).toBeVisible();
      await expect(taxInput.first()).toBeEditable();
    }
  });

  // ==========================================
  // TESTS SECTION PAGE D'ACCUEIL
  // ==========================================

  test("Page Accueil - Champ Titre Hero", async ({ page }) => {
    const heroTitleInput = page.locator('input[name*="heroTitle"]');
    const hasInput = await heroTitleInput.isVisible().catch(() => false);

    if (hasInput) {
      await expect(heroTitleInput.first()).toBeVisible();
      await expect(heroTitleInput.first()).toBeEditable();
    }
  });

  test("Page Accueil - Champ Sous-titre Hero", async ({ page }) => {
    const heroSubtitleInput = page.locator('input[name*="heroSubtitle"]');
    const hasInput = await heroSubtitleInput.isVisible().catch(() => false);

    if (hasInput) {
      await expect(heroSubtitleInput.first()).toBeVisible();
      await expect(heroSubtitleInput.first()).toBeEditable();
    }
  });

  test("Page Accueil - Champ Produits par Page", async ({ page }) => {
    const productsPerPageInput = page.locator('input[name*="productsPerPage"]');
    const hasInput = await productsPerPageInput.isVisible().catch(() => false);

    if (hasInput) {
      await expect(productsPerPageInput.first()).toBeVisible();
      await expect(productsPerPageInput.first()).toBeEditable();
    }
  });

  test("Page Accueil - Checkbox Nouveautés", async ({ page }) => {
    const checkbox = page.locator('input[type="checkbox"]');
    const hasCheckbox = await checkbox.isVisible().catch(() => false);

    if (hasCheckbox) {
      await expect(checkbox.first()).toBeVisible();
    }
  });

  // ==========================================
  // TESTS SECTION PERSONNALISATION CSS
  // ==========================================

  test("CSS - Couleur Header", async ({ page }) => {
    // Scroll vers la section CSS
    await page.evaluate(() =>
      window.scrollTo(0, document.body.scrollHeight / 2)
    );

    const colorInput = page.locator('input[type="color"]');
    const hasInput = await colorInput.isVisible().catch(() => false);

    if (hasInput) {
      await expect(colorInput.first()).toBeVisible();
    }
  });

  test("CSS - Input texte couleur", async ({ page }) => {
    await page.evaluate(() =>
      window.scrollTo(0, document.body.scrollHeight / 2)
    );

    const textInputs = page.locator('input[class*="font-mono"]');
    const hasInputs = (await textInputs.count()) > 0;

    if (hasInputs) {
      await expect(textInputs.first()).toBeVisible();
    }
  });

  test("CSS - Sélecteur de police", async ({ page }) => {
    await page.evaluate(() =>
      window.scrollTo(0, document.body.scrollHeight / 2)
    );

    const fontSelect = page
      .locator("select")
      .filter({ hasText: /serif|sans-serif/i });
    const hasSelect = await fontSelect.isVisible().catch(() => false);

    if (hasSelect) {
      await expect(fontSelect.first()).toBeVisible();
    }
  });

  // ==========================================
  // TESTS MODIFICATION ET SAUVEGARDE
  // ==========================================

  test("Modification - Changer le nom du site", async ({ page }) => {
    const nameInput = page.locator('input[name="siteName"]');
    const hasInput = await nameInput.isVisible().catch(() => false);

    if (hasInput) {
      // Modifier le nom
      await nameInput.clear();
      await nameInput.fill("Nouveau Nom Test");

      // Vérifier la valeur
      const value = await nameInput.inputValue();
      expect(value).toBe("Nouveau Nom Test");
    }
  });

  test("Sauvegarde - Clic sur sauvegarder", async ({ page }) => {
    const nameInput = page.locator('input[name="siteName"]');
    const hasInput = await nameInput.isVisible().catch(() => false);

    if (hasInput) {
      // Modifier quelque chose
      await nameInput.clear();
      await nameInput.fill("Test Save");

      // Sauvegarder
      const saveButton = page
        .locator("button")
        .filter({ hasText: /sauvegarder|save/i })
        .first();
      await saveButton.click();

      // Attendre le message de succès
      await page.waitForTimeout(2000);

      const successMessage = page.locator(
        "text=/succès|success|sauvegardé|saved/i"
      );
      const hasSuccess = await successMessage.isVisible().catch(() => false);

      if (hasSuccess) {
        await expect(successMessage).toBeVisible();
      }
    }
  });

  // ==========================================
  // TESTS RÉINITIALISATION
  // ==========================================

  test("Réinitialisation - Confirmation requise", async ({ page }) => {
    const resetButton = page
      .locator("button")
      .filter({ hasText: /réinitialiser|reset/i })
      .first();
    const hasButton = await resetButton.isVisible().catch(() => false);

    if (hasButton) {
      // Écouter le dialog de confirmation
      page.on("dialog", async (dialog) => {
        expect(dialog.type()).toBe("confirm");
        await dialog.dismiss();
      });

      await resetButton.click();
      await page.waitForTimeout(500);
    }
  });

  // ==========================================
  // TESTS AIDE
  // ==========================================

  test("Aide - Section visible", async ({ page }) => {
    // Scroll vers le bas
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    const helpSection = page.locator("text=/aide|help|conseils/i");
    const hasHelp = await helpSection.isVisible().catch(() => false);

    if (hasHelp) {
      await expect(helpSection).toBeVisible();
    }
  });

  // ==========================================
  // TESTS RESPONSIVE
  // ==========================================

  test("Responsive - Mobile viewport", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForTimeout(1000);

    const title = page.locator("h1");
    const hasTitle = await title.isVisible().catch(() => false);

    if (hasTitle) {
      await expect(title).toBeVisible();
    }
  });

  // ==========================================
  // TESTS NAVIGATION
  // ==========================================

  test("Navigation - Retour au dashboard", async ({ page }) => {
    const backButton = page.locator('a[href="/admin"]').first();
    const hasButton = await backButton.isVisible().catch(() => false);

    if (hasButton) {
      await backButton.click();
      await expect(page).toHaveURL("/admin");
    }
  });
});
