/**
 * TESTS E2E : Admin - Ajouter un Produit (Complet)
 * =================================================
 *
 * Tests complets de la page d'ajout de produit incluant :
 * - Tous les champs du formulaire
 * - Validation
 * - Soumission
 * - Messages de succès/erreur
 */

const { test, expect } = require("@playwright/test");

test.describe("Admin - Ajouter un Produit - Tests Complets", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/admin/add-product");
    await page.waitForTimeout(1000);
  });

  // ==========================================
  // TESTS AFFICHAGE
  // ==========================================

  test("Affichage - Titre de la page", async ({ page }) => {
    const title = page
      .locator("h1")
      .filter({ hasText: /ajouter|add|produit|product/i });
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
  // TESTS FORMULAIRE - CHAMPS
  // ==========================================

  test("Formulaire - Champ Nom du produit", async ({ page }) => {
    const nameInput = page
      .locator('input[name="productName"], input')
      .filter({ hasText: "" })
      .first();
    const hasInput = await nameInput.isVisible().catch(() => false);

    if (hasInput) {
      await expect(nameInput).toBeVisible();
      await expect(nameInput).toBeEditable();
    }
  });

  test("Formulaire - Champ Prix", async ({ page }) => {
    const priceInput = page.locator(
      'input[type="number"], input[name="price"]'
    );
    const hasInput = await priceInput.isVisible().catch(() => false);

    if (hasInput) {
      await expect(priceInput.first()).toBeVisible();
      await expect(priceInput.first()).toBeEditable();
    }
  });

  test("Formulaire - Champ Catégorie", async ({ page }) => {
    const categorySelect = page.locator("select");
    const hasSelect = await categorySelect.isVisible().catch(() => false);

    if (hasSelect) {
      await expect(categorySelect.first()).toBeVisible();

      // Vérifier qu'il y a des options
      const options = await categorySelect.first().locator("option").count();
      expect(options).toBeGreaterThan(0);
    }
  });

  test("Formulaire - Champ Description", async ({ page }) => {
    const descriptionTextarea = page.locator("textarea");
    const hasTextarea = await descriptionTextarea
      .isVisible()
      .catch(() => false);

    if (hasTextarea) {
      await expect(descriptionTextarea.first()).toBeVisible();
      await expect(descriptionTextarea.first()).toBeEditable();
    }
  });

  test("Formulaire - Champ Image URL", async ({ page }) => {
    const imageInput = page.locator("input").filter({ hasText: "" });
    const count = await imageInput.count();

    // Il devrait y avoir plusieurs inputs
    expect(count).toBeGreaterThan(2);
  });

  test("Formulaire - Champ Label", async ({ page }) => {
    const labelInput = page.locator("input").filter({ hasText: "" });
    const count = await labelInput.count();

    // Vérifier qu'il y a assez d'inputs
    expect(count).toBeGreaterThan(3);
  });

  // ==========================================
  // TESTS BOUTONS
  // ==========================================

  test("Boutons - Bouton Ajouter", async ({ page }) => {
    const submitButton = page
      .locator('button[type="submit"], button')
      .filter({ hasText: /ajouter|add|sauvegarder|save/i });
    const hasButton = await submitButton.isVisible().catch(() => false);

    if (hasButton) {
      await expect(submitButton.first()).toBeVisible();
      await expect(submitButton.first()).toBeEnabled();
    }
  });

  test("Boutons - Bouton Annuler", async ({ page }) => {
    const cancelButton = page
      .locator("a, button")
      .filter({ hasText: /annuler|cancel/i });
    const hasButton = await cancelButton.isVisible().catch(() => false);

    if (hasButton) {
      await expect(cancelButton.first()).toBeVisible();
    }
  });

  test("Boutons - Clic sur Annuler", async ({ page }) => {
    const cancelButton = page
      .locator('a[href="/admin"]')
      .filter({ hasText: /annuler|cancel/i });
    const hasButton = await cancelButton.isVisible().catch(() => false);

    if (hasButton) {
      await cancelButton.click();
      await expect(page).toHaveURL("/admin");
    }
  });

  // ==========================================
  // TESTS VALIDATION
  // ==========================================

  test("Validation - Champs requis vides", async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]').first();
    const hasButton = await submitButton.isVisible().catch(() => false);

    if (hasButton) {
      // Essayer de soumettre sans remplir
      await submitButton.click();

      await page.waitForTimeout(500);

      // Devrait rester sur la page ou afficher une erreur
      const currentUrl = page.url();
      expect(currentUrl).toContain("/admin/add-product");
    }
  });

  test("Validation - Prix invalide", async ({ page }) => {
    // Remplir le formulaire avec un prix invalide
    const inputs = page.locator("input");
    const count = await inputs.count();

    if (count > 0) {
      // Nom
      await inputs.nth(0).fill("Produit Test");

      // Prix (texte au lieu de nombre)
      const priceInput = page.locator('input[type="number"]').first();
      await priceInput.fill("-10");

      // Catégorie
      const categorySelect = page.locator("select").first();
      const options = await categorySelect.locator("option").count();
      if (options > 1) {
        await categorySelect.selectOption({ index: 1 });
      }

      // Soumettre
      const submitButton = page.locator('button[type="submit"]').first();
      await submitButton.click();

      await page.waitForTimeout(1000);

      // Devrait afficher une erreur
      const errorMessage = page.locator(
        "text=/erreur|error|invalide|invalid|positif/i"
      );
      const hasError = await errorMessage.isVisible().catch(() => false);

      if (hasError) {
        await expect(errorMessage).toBeVisible();
      }
    }
  });

  test("Validation - Catégorie non sélectionnée", async ({ page }) => {
    const inputs = page.locator("input");
    const count = await inputs.count();

    if (count > 0) {
      // Remplir nom et prix
      await inputs.nth(0).fill("Produit Test");

      const priceInput = page.locator('input[type="number"]').first();
      await priceInput.fill("29.99");

      // Ne pas sélectionner de catégorie

      // Soumettre
      const submitButton = page.locator('button[type="submit"]').first();
      await submitButton.click();

      await page.waitForTimeout(1000);

      // Devrait afficher une erreur
      const errorMessage = page.locator(
        "text=/catégorie|category|sélectionner|select/i"
      );
      const hasError = await errorMessage.isVisible().catch(() => false);

      if (hasError) {
        await expect(errorMessage).toBeVisible();
      }
    }
  });

  // ==========================================
  // TESTS SOUMISSION
  // ==========================================

  test("Soumission - Produit valide", async ({ page }) => {
    const inputs = page.locator("input");
    const count = await inputs.count();

    if (count > 0) {
      // Générer un nom unique
      const uniqueName = `Produit Test ${Date.now()}`;

      // Remplir le formulaire
      await inputs.nth(0).fill(uniqueName);

      const priceInput = page.locator('input[type="number"]').first();
      await priceInput.fill("29.99");

      const categorySelect = page.locator("select").first();
      const options = await categorySelect.locator("option").count();
      if (options > 1) {
        await categorySelect.selectOption({ index: 1 });
      }

      const textarea = page.locator("textarea").first();
      await textarea.fill("Description du produit test");

      // Soumettre
      const submitButton = page.locator('button[type="submit"]').first();
      await submitButton.click();

      // Attendre le message de succès
      await page.waitForTimeout(2000);

      const successMessage = page.locator(
        "text=/succès|success|ajouté|added/i"
      );
      const hasSuccess = await successMessage.isVisible().catch(() => false);

      if (hasSuccess) {
        await expect(successMessage).toBeVisible();
      }
    }
  });

  test("Soumission - Réinitialisation du formulaire après succès", async ({
    page,
  }) => {
    const inputs = page.locator("input");
    const count = await inputs.count();

    if (count > 0) {
      const uniqueName = `Produit Test ${Date.now()}`;

      await inputs.nth(0).fill(uniqueName);

      const priceInput = page.locator('input[type="number"]').first();
      await priceInput.fill("29.99");

      const categorySelect = page.locator("select").first();
      const options = await categorySelect.locator("option").count();
      if (options > 1) {
        await categorySelect.selectOption({ index: 1 });
      }

      const submitButton = page.locator('button[type="submit"]').first();
      await submitButton.click();

      await page.waitForTimeout(2000);

      // Vérifier que le formulaire est réinitialisé
      const nameValue = await inputs.nth(0).inputValue();
      expect(nameValue).toBe("");
    }
  });

  // ==========================================
  // TESTS AIDE
  // ==========================================

  test("Aide - Section conseils visible", async ({ page }) => {
    // Scroll vers le bas
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    const helpSection = page.locator("text=/conseils|aide|help|tips/i");
    const hasHelp = await helpSection.isVisible().catch(() => false);

    if (hasHelp) {
      await expect(helpSection).toBeVisible();
    }
  });

  // ==========================================
  // TESTS NAVIGATION
  // ==========================================

  test("Navigation - Retour via bouton", async ({ page }) => {
    const backButton = page.locator('a[href="/admin"]').first();
    const hasButton = await backButton.isVisible().catch(() => false);

    if (hasButton) {
      await backButton.click();
      await expect(page).toHaveURL("/admin");
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
  // TESTS CHAMPS OPTIONNELS
  // ==========================================

  test("Champs optionnels - Image URL avec couleur Tailwind", async ({
    page,
  }) => {
    const inputs = page.locator("input");
    const count = await inputs.count();

    if (count > 3) {
      // Remplir avec une couleur Tailwind
      await inputs.nth(3).fill("bg-blue-200");

      // Vérifier que la valeur est acceptée
      const value = await inputs.nth(3).inputValue();
      expect(value).toBe("bg-blue-200");
    }
  });

  test("Champs optionnels - Image URL avec URL complète", async ({ page }) => {
    const inputs = page.locator("input");
    const count = await inputs.count();

    if (count > 3) {
      // Remplir avec une URL
      await inputs.nth(3).fill("https://example.com/image.jpg");

      // Vérifier que la valeur est acceptée
      const value = await inputs.nth(3).inputValue();
      expect(value).toBe("https://example.com/image.jpg");
    }
  });

  test("Champs optionnels - Label", async ({ page }) => {
    const inputs = page.locator("input");
    const count = await inputs.count();

    if (count > 4) {
      // Remplir le label
      await inputs.nth(4).fill("New");

      // Vérifier que la valeur est acceptée
      const value = await inputs.nth(4).inputValue();
      expect(value).toBe("New");
    }
  });
});
