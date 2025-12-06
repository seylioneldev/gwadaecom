/**
 * TEST PLAYWRIGHT : Paramètres de la Société (Admin)
 * ====================================================
 *
 * Tests spécifiques pour la configuration de la TVA et des frais de livraison
 *
 * 🆕 NOUVEAU FICHIER : e2e/admin-company-settings.spec.js
 * DATE : 2025-12-05
 */

import { test, expect } from '@playwright/test';

test.describe('Admin - Paramètres de la Société', () => {

  // Note: Ces tests nécessitent d'être authentifié en tant qu'admin
  // Pour l'instant, ils sont marqués comme skip mais peuvent être activés
  // une fois l'authentification configurée dans les tests

  test.describe('Configuration TVA', () => {

    test.skip('Accès à la page paramètres société', async ({ page }) => {
      await page.goto('/admin/company');
      await page.waitForLoadState('networkidle');

      // Vérifier le titre de la page
      const pageTitle = page.locator('h1:has-text("Paramètres de la Société")');
      await expect(pageTitle).toBeVisible();

      // Vérifier la section TVA
      const tvaSection = page.locator('text=/Configuration.*TVA/i');
      await expect(tvaSection).toBeVisible();
    });

    test.skip('Modification du taux de TVA normal', async ({ page }) => {
      await page.goto('/admin/company');
      await page.waitForLoadState('networkidle');

      // Trouver le champ taux de TVA normal
      const taxRateInput = page.locator('input[name="shop.taxRate"]');
      await expect(taxRateInput).toBeVisible();

      // Modifier la valeur
      await taxRateInput.fill('8.5');

      // Sauvegarder
      const saveButton = page.locator('button:has-text("Sauvegarder")');
      await saveButton.click();

      // Attendre la confirmation
      await expect(page.locator('text=/succès|success/i')).toBeVisible({ timeout: 5000 });
    });

    test.skip('Modification du taux de TVA réduit', async ({ page }) => {
      await page.goto('/admin/company');
      await page.waitForLoadState('networkidle');

      // Trouver le champ taux de TVA réduit
      const reducedTaxRateInput = page.locator('input[name="shop.reducedTaxRate"]');
      await expect(reducedTaxRateInput).toBeVisible();

      // Modifier la valeur
      await reducedTaxRateInput.fill('2.1');

      // Sauvegarder
      const saveButton = page.locator('button:has-text("Sauvegarder")');
      await saveButton.click();

      // Attendre la confirmation
      await expect(page.locator('text=/succès|success/i')).toBeVisible({ timeout: 5000 });
    });

    test.skip('Modification de la devise', async ({ page }) => {
      await page.goto('/admin/company');
      await page.waitForLoadState('networkidle');

      // Trouver le champ devise
      const currencyInput = page.locator('input[name="shop.currency"]');
      await expect(currencyInput).toBeVisible();

      // Modifier la valeur
      await currencyInput.fill('€');

      // Sauvegarder
      const saveButton = page.locator('button:has-text("Sauvegarder")');
      await saveButton.click();

      // Attendre la confirmation
      await expect(page.locator('text=/succès|success/i')).toBeVisible({ timeout: 5000 });
    });

  });

  test.describe('Frais de Livraison Standard', () => {

    test.skip('Modification frais de port standard', async ({ page }) => {
      await page.goto('/admin/company');
      await page.waitForLoadState('networkidle');

      // Trouver le champ frais de port
      const shippingCostInput = page.locator('input[name="shop.shippingCost"]');
      await expect(shippingCostInput).toBeVisible();

      // Modifier la valeur
      await shippingCostInput.fill('5.00');

      // Sauvegarder
      const saveButton = page.locator('button:has-text("Sauvegarder")');
      await saveButton.click();

      // Attendre la confirmation
      await expect(page.locator('text=/succès|success/i')).toBeVisible({ timeout: 5000 });
    });

    test.skip('Modification seuil livraison gratuite', async ({ page }) => {
      await page.goto('/admin/company');
      await page.waitForLoadState('networkidle');

      // Trouver le champ seuil livraison gratuite
      const freeShippingInput = page.locator('input[name="shop.freeShippingThreshold"]');
      await expect(freeShippingInput).toBeVisible();

      // Modifier la valeur
      await freeShippingInput.fill('50.00');

      // Sauvegarder
      const saveButton = page.locator('button:has-text("Sauvegarder")');
      await saveButton.click();

      // Attendre la confirmation
      await expect(page.locator('text=/succès|success/i')).toBeVisible({ timeout: 5000 });
    });

  });

  test.describe('Frais de Livraison par Ville', () => {

    test.skip('Ajout d\'une ville spécifique', async ({ page }) => {
      await page.goto('/admin/company');
      await page.waitForLoadState('networkidle');

      // Faire défiler jusqu'à la section villes
      await page.locator('text=/Frais.*Ville/i').scrollIntoViewIfNeeded();

      // Cliquer sur le bouton "Ajouter une ville"
      const addCityButton = page.locator('button:has-text("Ajouter une Ville")');
      await addCityButton.click();

      // Attendre que le nouveau formulaire apparaisse
      await page.waitForTimeout(500);

      // Sélectionner une ville
      const citySelect = page.locator('select').last();
      await citySelect.selectOption('Pointe-à-Pitre');

      // Le code postal devrait être auto-rempli
      await page.waitForTimeout(500);
      const postalCodeInput = page.locator('input[placeholder="97110"]').last();
      const postalCodeValue = await postalCodeInput.inputValue();
      expect(postalCodeValue).toBe('97110');

      // Définir les frais
      const costInput = page.locator('input[type="number"]').last();
      await costInput.fill('3.00');

      // Sauvegarder
      const saveButton = page.locator('button:has-text("Sauvegarder")').first();
      await saveButton.click();

      // Attendre la confirmation
      await expect(page.locator('text=/succès|success/i')).toBeVisible({ timeout: 5000 });
    });

    test.skip('Suppression d\'une ville spécifique', async ({ page }) => {
      await page.goto('/admin/company');
      await page.waitForLoadState('networkidle');

      // Faire défiler jusqu'à la section villes
      await page.locator('text=/Frais.*Ville/i').scrollIntoViewIfNeeded();

      // Compter les villes avant suppression
      const deleteButtons = page.locator('button[title="Supprimer"]');
      const initialCount = await deleteButtons.count();

      if (initialCount > 0) {
        // Supprimer la première ville
        await deleteButtons.first().click();
        await page.waitForTimeout(500);

        // Vérifier que le nombre a diminué
        const newCount = await page.locator('button[title="Supprimer"]').count();
        expect(newCount).toBe(initialCount - 1);

        // Sauvegarder
        const saveButton = page.locator('button:has-text("Sauvegarder")').first();
        await saveButton.click();

        // Attendre la confirmation
        await expect(page.locator('text=/succès|success/i')).toBeVisible({ timeout: 5000 });
      }
    });

    test.skip('Auto-complétion code postal lors sélection ville', async ({ page }) => {
      await page.goto('/admin/company');
      await page.waitForLoadState('networkidle');

      // Faire défiler jusqu'à la section villes
      await page.locator('text=/Frais.*Ville/i').scrollIntoViewIfNeeded();

      // Ajouter une nouvelle ville
      const addCityButton = page.locator('button:has-text("Ajouter une Ville")');
      await addCityButton.click();
      await page.waitForTimeout(500);

      // Sélectionner Basse-Terre
      const citySelect = page.locator('select').last();
      await citySelect.selectOption('Basse-Terre');
      await page.waitForTimeout(500);

      // Vérifier que le code postal est bien 97100
      const postalCodeInput = page.locator('input[placeholder="97110"]').last();
      const postalCodeValue = await postalCodeInput.inputValue();
      expect(postalCodeValue).toBe('97100');
    });

  });

  test.describe('Validation et Messages d\'Erreur', () => {

    test.skip('Vérification champs requis', async ({ page }) => {
      await page.goto('/admin/company');
      await page.waitForLoadState('networkidle');

      // Vider un champ requis
      const taxRateInput = page.locator('input[name="shop.taxRate"]');
      await taxRateInput.fill('');

      // Essayer de sauvegarder
      const saveButton = page.locator('button:has-text("Sauvegarder")');
      await saveButton.click();

      // Devrait afficher une erreur ou empêcher la sauvegarde
      // (selon l'implémentation)
      await page.waitForTimeout(1000);
    });

  });

  test.describe('Informations et Aide', () => {

    test.skip('Affichage note informative TVA Guadeloupe', async ({ page }) => {
      await page.goto('/admin/company');
      await page.waitForLoadState('networkidle');

      // Vérifier la présence de la note informative
      const infoNote = page.locator('text=/TVA.*Guadeloupe.*8,5%/i');
      await expect(infoNote).toBeVisible();
    });

    test.skip('Affichage aide frais spécifiques', async ({ page }) => {
      await page.goto('/admin/company');
      await page.waitForLoadState('networkidle');

      // Faire défiler jusqu'à la section villes
      await page.locator('text=/Frais.*Ville/i').scrollIntoViewIfNeeded();

      // Vérifier la présence de l'aide
      const helpNote = page.locator('text=/Comment.*frais.*spécifiques/i');
      await expect(helpNote).toBeVisible();
    });

  });

});

/**
 * ============================================
 * NOTES POUR L'ACTIVATION DES TESTS
 * ============================================
 *
 * Pour activer ces tests :
 *
 * 1. Configurer l'authentification dans les tests :
 *    - Ajouter un beforeEach qui se connecte en tant qu'admin
 *    - Ou utiliser un état de session sauvegardé
 *
 * 2. Retirer les test.skip et les remplacer par test
 *
 * 3. Exemple d'authentification :
 *
 * test.beforeEach(async ({ page }) => {
 *   await page.goto('/admin/login');
 *   await page.fill('input[type="email"]', 'admin@example.com');
 *   await page.fill('input[type="password"]', 'password123');
 *   await page.click('button[type="submit"]');
 *   await page.waitForURL('/admin');
 * });
 *
 * ============================================
 */
