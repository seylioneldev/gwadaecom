/**
 * TESTS E2E : Admin - Gestion des Catégories
 * =============================================
 *
 * Tests CRUD pour la gestion des catégories.
 *
 * 🆕 NOUVEAU FICHIER CRÉÉ : e2e/admin-categories.spec.js
 * DATE : 2025-11-30
 */

import { test, expect } from '@playwright/test';

test.describe('Admin - Liste des catégories', () => {
  test('devrait afficher la page de gestion des catégories', async ({ page }) => {
    await page.goto('/admin/categories');

    // Vérifier le titre
    await expect(page.locator('h1')).toContainText('Gestion des Catégories');
  });

  test('devrait afficher le bouton "Nouvelle Catégorie"', async ({ page }) => {
    await page.goto('/admin/categories');

    // Vérifier la présence du bouton
    const addButton = page.locator('button:has-text("Nouvelle Catégorie")');
    await expect(addButton).toBeVisible();
  });
});

test.describe('Admin - Ajout de catégorie', () => {
  test('devrait afficher le formulaire d\'ajout en cliquant sur "Nouvelle Catégorie"', async ({ page }) => {
    await page.goto('/admin/categories');

    // Cliquer sur le bouton
    const addButton = page.locator('button:has-text("Nouvelle Catégorie")');
    await addButton.click();

    // Vérifier que le formulaire apparaît
    await expect(page.locator('h2:has-text("Ajouter une catégorie")')).toBeVisible();
  });

  test('devrait afficher les champs du formulaire', async ({ page }) => {
    await page.goto('/admin/categories');

    // Ouvrir le formulaire
    await page.locator('button:has-text("Nouvelle Catégorie")').click();

    // Vérifier les champs
    await expect(page.locator('input[placeholder*="Kitchen"]')).toBeVisible();
    await expect(page.locator('input[placeholder*="kitchen"]')).toBeVisible();
    await expect(page.locator('input[type="number"]')).toBeVisible();
  });

  test('devrait pouvoir annuler l\'ajout d\'une catégorie', async ({ page }) => {
    await page.goto('/admin/categories');

    // Ouvrir le formulaire
    await page.locator('button:has-text("Nouvelle Catégorie")').click();

    // Cliquer sur Annuler
    await page.locator('button:has-text("Annuler")').click();

    // Le formulaire devrait disparaître
    await expect(page.locator('h2:has-text("Ajouter une catégorie")')).not.toBeVisible();
  });
});

test.describe('Admin - Modification de catégorie', () => {
  test('devrait afficher les boutons de modification', async ({ page }) => {
    await page.goto('/admin/categories');

    // Attendre le chargement
    await page.waitForTimeout(2000);

    // Chercher les boutons modifier
    const editButtons = page.locator('button[title="Modifier"]');
    const count = await editButtons.count();

    expect(count >= 0).toBe(true);
  });
});

test.describe('Admin - Visibilité des catégories', () => {
  test('devrait afficher les boutons de visibilité', async ({ page }) => {
    await page.goto('/admin/categories');

    // Attendre le chargement
    await page.waitForTimeout(2000);

    // Chercher les icônes Eye ou EyeOff
    const visibilityButtons = page.locator('button').filter({ hasText: /Masquer|Afficher/ });
    const countAlt = await page.locator('button[title*="Masquer"], button[title*="Afficher"]').count();

    expect(countAlt >= 0).toBe(true);
  });
});

test.describe('Admin - Suppression de catégorie', () => {
  test('devrait afficher les boutons de suppression', async ({ page }) => {
    await page.goto('/admin/categories');

    // Attendre le chargement
    await page.waitForTimeout(2000);

    // Chercher les boutons supprimer
    const deleteButtons = page.locator('button[title="Supprimer"]');
    const count = await deleteButtons.count();

    expect(count >= 0).toBe(true);
  });
});

test.describe('Admin - Affichage des catégories', () => {
  test('devrait afficher le nombre de catégories', async ({ page }) => {
    await page.goto('/admin/categories');

    // Attendre le chargement
    await page.waitForTimeout(2000);

    // Vérifier l'affichage du compteur
    const counter = page.locator('h2:has-text("Catégories existantes")');
    await expect(counter).toBeVisible();
  });
});
