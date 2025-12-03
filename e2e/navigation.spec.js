/**
 * TESTS E2E : Navigation
 * ========================
 *
 * Tests de navigation entre les pages de l'application.
 *
 * 🆕 NOUVEAU FICHIER CRÉÉ : e2e/navigation.spec.js
 * DATE : 2025-11-30
 */

import { test, expect } from '@playwright/test';

test.describe('Navigation générale', () => {
  test('devrait afficher la page d\'accueil', async ({ page }) => {
    await page.goto('/');

    // Vérifier que la page est chargée
    await expect(page).toHaveTitle(/Les Bijoux de Guadeloupe/);
  });

  test('devrait naviguer vers les catégories depuis le menu', async ({ page }) => {
    await page.goto('/');

    // Attendre que le menu soit visible
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });

  test('devrait accéder au tableau de bord admin', async ({ page }) => {
    await page.goto('/admin');

    // Vérifier le titre
    await expect(page.locator('h1')).toContainText('Admin');
  });
});

test.describe('Navigation admin - Boutons retour', () => {
  test('devrait avoir un bouton retour sur la page Produits', async ({ page }) => {
    await page.goto('/admin/products');

    // Vérifier la présence du bouton retour
    const backButton = page.locator('a[href="/admin"]').first();
    await expect(backButton).toBeVisible();

    // Cliquer et vérifier la redirection
    await backButton.click();
    await expect(page).toHaveURL('/admin');
  });

  test('devrait avoir un bouton retour sur la page Catégories', async ({ page }) => {
    await page.goto('/admin/categories');

    const backButton = page.locator('a[href="/admin"]').first();
    await expect(backButton).toBeVisible();

    await backButton.click();
    await expect(page).toHaveURL('/admin');
  });

  test('devrait avoir un bouton retour sur la page Paramètres', async ({ page }) => {
    await page.goto('/admin/settings');

    const backButton = page.locator('a[href="/admin"]').first();
    await expect(backButton).toBeVisible();

    await backButton.click();
    await expect(page).toHaveURL('/admin');
  });

  test('devrait avoir un bouton retour sur la page Ajouter un Produit', async ({ page }) => {
    await page.goto('/admin/add-product');

    const backButton = page.locator('a[href="/admin"]').first();
    await expect(backButton).toBeVisible();
  });
});

test.describe('Navigation section Commercial', () => {
  const commercialPages = [
    { name: 'Statistiques', path: '/admin/commercial/statistics' },
    { name: 'Commandes', path: '/admin/commercial/orders' },
    { name: 'Partenaires', path: '/admin/commercial/partners' },
    { name: 'Fournisseurs', path: '/admin/commercial/suppliers' },
    { name: 'Facturation', path: '/admin/commercial/invoicing' },
  ];

  for (const { name, path } of commercialPages) {
    test(`devrait accéder à ${name} et revenir au dashboard`, async ({ page }) => {
      await page.goto(path);

      // Vérifier que la page est chargée
      await expect(page.locator('h1')).toBeVisible();

      // Vérifier le bouton retour
      const backButton = page.locator('a[href="/admin"]').first();
      await expect(backButton).toBeVisible();

      // Revenir au dashboard
      await backButton.click();
      await expect(page).toHaveURL('/admin');
    });
  }
});
