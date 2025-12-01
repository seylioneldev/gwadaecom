/**
 * TESTS E2E : Flux de Commande
 * ==============================
 *
 * Tests complets pour les trois scénarios de commande :
 * 1. Commande en tant qu'invité
 * 2. Commande en tant qu'utilisateur connecté
 * 3. Commande avec création de compte
 *
 * 🆕 NOUVEAU FICHIER : e2e/checkout-flows.spec.js
 * DATE : 2025-12-01
 */

import { test, expect } from '@playwright/test';

// Helper : Remplir le formulaire de paiement Stripe
async function fillStripePaymentForm(page) {
  // Attendre que le formulaire Stripe soit chargé
  const stripeFrame = page.frameLocator('iframe[name^="__privateStripeFrame"]').first();

  // Remplir le numéro de carte (carte de test Stripe)
  await stripeFrame.locator('[placeholder="Card number"]').fill('4242424242424242');

  // Remplir la date d'expiration
  await stripeFrame.locator('[placeholder="MM / YY"]').fill('1234');

  // Remplir le CVC
  await stripeFrame.locator('[placeholder="CVC"]').fill('123');
}

// Helper : Ajouter un produit au panier
async function addProductToCart(page) {
  // Aller sur la page d'accueil
  await page.goto('/');

  // Attendre que les produits soient chargés
  // Attendre soit l'apparition d'un produit, soit le message "Aucun produit disponible"
  try {
    await page.waitForSelector('a[href^="/products/"]', { timeout: 10000 });
  } catch (error) {
    // Si pas de produits, vérifier s'il y a le message "Aucun produit"
    const noProductsMessage = await page.locator('text=/Aucun produit disponible/i').isVisible();
    if (noProductsMessage) {
      throw new Error('Aucun produit disponible dans la boutique. Ajoutez des produits depuis l\'admin.');
    }
    throw error;
  }

  // Cliquer sur le premier produit pour aller sur sa page détail
  await page.locator('a[href^="/products/"]').first().click();

  // Attendre d'être sur la page de détail du produit
  await page.waitForURL(/\/products\/.+/, { timeout: 5000 });

  // Attendre que le bouton "Add to Cart" soit visible
  await page.waitForSelector('button:has-text("Add to Cart")', { timeout: 5000 });

  // Cliquer sur le bouton "Add to Cart"
  await page.locator('button:has-text("Add to Cart")').click();

  // Attendre que le panier soit ouvert (le composant CartSidebar)
  await page.waitForSelector('text=/Votre Panier|Mon Panier/i', { timeout: 5000 });

  // Fermer le panier en cliquant sur l'overlay (fond noir semi-transparent)
  // ou simplement naviguer ailleurs - le panier se fermera automatiquement
  const overlay = page.locator('.fixed.inset-0.bg-black\\/50');
  if (await overlay.isVisible()) {
    await overlay.click();
    await page.waitForTimeout(500);
  }
}

// Helper : Vérifier les erreurs console
test.beforeEach(async ({ page }) => {
  // Capturer les erreurs console
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`❌ Console Error: ${msg.text()}`);
    }
  });

  // Capturer les erreurs non gérées
  page.on('pageerror', error => {
    console.log(`❌ Page Error: ${error.message}`);
  });
});

// =============================================================================
// TEST 1 : COMMANDE EN TANT QU'INVITÉ
// =============================================================================

test.describe('Commande en tant qu\'invité', () => {
  test('doit permettre une commande complète sans compte', async ({ page }) => {
    // Étape 1 : Ajouter un produit au panier
    console.log('📦 Ajout d\'un produit au panier...');
    await addProductToCart(page);

    // Étape 2 : Ouvrir le panier et aller au checkout
    console.log('🛒 Navigation vers le checkout...');
    await page.goto('/panier');
    await page.waitForSelector('text=/Commander|Passer la commande/i');
    await page.locator('text=/Commander|Passer la commande/i').click();

    // Vérifier qu'on est sur la page checkout
    await expect(page).toHaveURL(/\/checkout/);

    // Étape 3 : Remplir le formulaire invité (sans créer de compte)
    console.log('📝 Remplissage du formulaire invité...');

    // Vérifier que l'option invité est sélectionnée par défaut
    await page.waitForSelector('input[type="radio"][value="guest"]');
    const guestRadio = page.locator('input[type="radio"][value="guest"]');
    await expect(guestRadio).toBeChecked();

    // Remplir les informations client
    await page.fill('input[name="firstName"]', 'Test');
    await page.fill('input[name="lastName"]', 'Invité');
    await page.fill('input[name="email"]', `test.invite.${Date.now()}@example.com`);
    await page.fill('input[name="phone"]', '0690123456');

    // Remplir l'adresse de livraison
    await page.fill('input[name="address"]', '123 Rue de Test');
    await page.fill('input[name="city"]', 'Pointe-à-Pitre');
    await page.fill('input[name="postalCode"]', '97110');

    // Sélectionner le pays (Guadeloupe devrait être par défaut)
    const countrySelect = page.locator('select[name="country"]');
    await countrySelect.selectOption('Guadeloupe');

    // Étape 4 : Remplir le formulaire de paiement Stripe
    console.log('💳 Remplissage du formulaire Stripe...');
    await page.waitForSelector('iframe[name^="__privateStripeFrame"]', { timeout: 10000 });
    await fillStripePaymentForm(page);

    // Étape 5 : Soumettre la commande
    console.log('✅ Soumission de la commande...');

    // Intercepter l'appel API d'envoi d'email
    let emailAPICalled = false;
    page.on('request', request => {
      if (request.url().includes('/api/send-order-confirmation')) {
        emailAPICalled = true;
        console.log('📧 API d\'envoi d\'email appelée');
      }
    });

    await page.locator('button:has-text("Payer")').click();

    // Étape 6 : Vérifier la redirection vers la page de confirmation
    console.log('⏳ Attente de la confirmation...');
    await page.waitForURL(/\/order-confirmation/, { timeout: 30000 });

    // Vérifier qu'on est sur la page de confirmation
    await expect(page).toHaveURL(/\/order-confirmation\?order_id=/);

    // Vérifier que la page de confirmation affiche le succès
    await expect(page.locator('text=/Merci pour votre commande|Commande confirmée/i')).toBeVisible();

    // Vérifier que les détails de la commande sont affichés
    await expect(page.locator('text=/Test Invité/i')).toBeVisible();
    await expect(page.locator('text=/123 Rue de Test/i')).toBeVisible();

    // Attendre un peu pour voir si l'API email est appelée
    await page.waitForTimeout(2000);

    // Vérifier si l'API email a été appelée
    if (emailAPICalled) {
      console.log('✅ L\'API d\'envoi d\'email a été appelée');
    } else {
      console.warn('⚠️ L\'API d\'envoi d\'email n\'a PAS été appelée');
    }

    // Vérifier qu'il n'y a pas d'erreurs de permission Firestore
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().includes('permission')) {
        consoleErrors.push(msg.text());
      }
    });

    if (consoleErrors.length > 0) {
      console.error('❌ Erreurs de permission détectées:', consoleErrors);
    }

    console.log('✅ Test invité terminé avec succès');
  });
});

// =============================================================================
// TEST 2 : COMMANDE EN TANT QU'UTILISATEUR CONNECTÉ
// =============================================================================

test.describe('Commande en tant qu\'utilisateur connecté', () => {
  test('doit permettre une commande avec un compte existant', async ({ page }) => {
    // Créer un compte unique pour ce test
    const testUser = {
      email: `logged.user.${Date.now()}@example.com`,
      password: 'TestPassword123!',
      firstName: 'Jean',
      lastName: 'Dupont'
    };

    // Étape 1 : Créer le compte
    console.log('📝 Création du compte utilisateur...');
    await page.goto('/mon-compte');

    // Cliquer sur l'onglet "Inscription"
    const signupTab = page.locator('button:has-text("Inscription"), button:has-text("Créer un compte")');
    await signupTab.click();
    await page.waitForTimeout(500);

    // Remplir le formulaire d'inscription
    // Le champ "Nom complet" est le premier input type="text"
    const nameInput = page.locator('input[type="text"]').first();
    await nameInput.fill(`${testUser.firstName} ${testUser.lastName}`);

    // Email - le premier input type="email" dans le formulaire d'inscription
    const emailInputs = page.locator('input[type="email"]');
    await emailInputs.first().fill(testUser.email);

    // Mot de passe - les inputs type="password"
    const passwordInputs = page.locator('input[type="password"]');
    await passwordInputs.first().fill(testUser.password);
    await passwordInputs.nth(1).fill(testUser.password); // Confirmer le mot de passe

    // Soumettre le formulaire
    await page.locator('button:has-text("S\'inscrire"), button:has-text("Créer")').click();

    // Attendre la redirection vers le compte
    await page.waitForURL(/\/compte/, { timeout: 10000 });

    // Vérifier qu'on est connecté
    await expect(page.locator(`text=/${testUser.firstName}/i`)).toBeVisible();

    // Étape 2 : Ajouter un produit au panier
    console.log('📦 Ajout d\'un produit au panier...');
    await addProductToCart(page);

    // Étape 3 : Aller au checkout
    console.log('🛒 Navigation vers le checkout...');
    await page.goto('/panier');
    await page.locator('text=/Commander|Passer la commande/i').click();

    // Vérifier qu'on est sur la page checkout
    await expect(page).toHaveURL(/\/checkout/);

    // Étape 4 : Vérifier que les informations sont pré-remplies
    console.log('📝 Vérification des informations pré-remplies...');

    // Les champs devraient être pré-remplis si l'utilisateur a déjà passé une commande
    // Sinon, remplir le formulaire
    const firstNameInput = page.locator('input[name="firstName"]');
    const firstNameValue = await firstNameInput.inputValue();

    if (!firstNameValue) {
      await page.fill('input[name="firstName"]', testUser.firstName);
      await page.fill('input[name="lastName"]', testUser.lastName);
      await page.fill('input[name="phone"]', '0690987654');
      await page.fill('input[name="address"]', '456 Avenue de Test');
      await page.fill('input[name="city"]', 'Les Abymes');
      await page.fill('input[name="postalCode"]', '97139');
      await page.locator('select[name="country"]').selectOption('Guadeloupe');
    }

    // L'email devrait être pré-rempli et disabled
    await expect(page.locator('input[name="email"]')).toHaveValue(testUser.email);

    // Étape 5 : Remplir le formulaire de paiement Stripe
    console.log('💳 Remplissage du formulaire Stripe...');
    await page.waitForSelector('iframe[name^="__privateStripeFrame"]', { timeout: 10000 });
    await fillStripePaymentForm(page);

    // Étape 6 : Soumettre la commande
    console.log('✅ Soumission de la commande...');

    // Intercepter l'appel API d'envoi d'email
    let emailAPICalled = false;
    page.on('request', request => {
      if (request.url().includes('/api/send-order-confirmation')) {
        emailAPICalled = true;
        console.log('📧 API d\'envoi d\'email appelée');
      }
    });

    await page.locator('button:has-text("Payer")').click();

    // Étape 7 : Vérifier la redirection vers la page de confirmation
    console.log('⏳ Attente de la confirmation...');
    await page.waitForURL(/\/order-confirmation/, { timeout: 30000 });

    // Vérifier qu'on est sur la page de confirmation
    await expect(page).toHaveURL(/\/order-confirmation\?order_id=/);

    // Vérifier que la page de confirmation affiche le succès
    await expect(page.locator('text=/Merci pour votre commande|Commande confirmée/i')).toBeVisible();

    // Vérifier que les détails de la commande sont affichés
    await expect(page.locator(`text=/${testUser.firstName} ${testUser.lastName}/i`)).toBeVisible();

    // Attendre un peu pour voir si l'API email est appelée
    await page.waitForTimeout(2000);

    // Vérifier si l'API email a été appelée
    if (emailAPICalled) {
      console.log('✅ L\'API d\'envoi d\'email a été appelée');
    } else {
      console.warn('⚠️ L\'API d\'envoi d\'email n\'a PAS été appelée');
    }

    console.log('✅ Test utilisateur connecté terminé avec succès');
  });
});

// =============================================================================
// TEST 3 : COMMANDE AVEC CRÉATION DE COMPTE
// =============================================================================

test.describe('Commande avec création de nouveau compte', () => {
  test('doit permettre de créer un compte et passer commande', async ({ page }) => {
    // Générer un email unique pour chaque test
    const newUser = {
      email: `new.user.${Date.now()}@example.com`,
      password: 'NewPassword123!',
      firstName: 'Marie',
      lastName: 'Martin'
    };

    // Étape 1 : Ajouter un produit au panier
    console.log('📦 Ajout d\'un produit au panier...');
    await addProductToCart(page);

    // Étape 2 : Aller au checkout
    console.log('🛒 Navigation vers le checkout...');
    await page.goto('/panier');
    await page.locator('text=/Commander|Passer la commande/i').click();

    // Vérifier qu'on est sur la page checkout
    await expect(page).toHaveURL(/\/checkout/);

    // Étape 3 : Sélectionner l'option "Créer un compte"
    console.log('📝 Sélection de l\'option création de compte...');
    await page.locator('input[type="radio"][value="register"]').check();

    // Vérifier que le champ mot de passe apparaît
    await expect(page.locator('input[name="password"]')).toBeVisible();

    // Remplir le formulaire complet
    await page.fill('input[name="firstName"]', newUser.firstName);
    await page.fill('input[name="lastName"]', newUser.lastName);
    await page.fill('input[name="email"]', newUser.email);
    await page.fill('input[name="password"]', newUser.password);
    await page.fill('input[name="phone"]', '0690555666');

    // Remplir l'adresse de livraison
    await page.fill('input[name="address"]', '789 Boulevard de Test');
    await page.fill('input[name="city"]', 'Basse-Terre');
    await page.fill('input[name="postalCode"]', '97100');
    await page.locator('select[name="country"]').selectOption('Guadeloupe');

    // Étape 4 : Remplir le formulaire de paiement Stripe
    console.log('💳 Remplissage du formulaire Stripe...');
    await page.waitForSelector('iframe[name^="__privateStripeFrame"]', { timeout: 10000 });
    await fillStripePaymentForm(page);

    // Étape 5 : Soumettre la commande
    console.log('✅ Soumission de la commande et création du compte...');

    // Intercepter l'appel API d'envoi d'email
    let emailAPICalled = false;
    page.on('request', request => {
      if (request.url().includes('/api/send-order-confirmation')) {
        emailAPICalled = true;
        console.log('📧 API d\'envoi d\'email appelée');
      }
    });

    await page.locator('button:has-text("Payer")').click();

    // Étape 6 : Vérifier la redirection vers la page de confirmation
    console.log('⏳ Attente de la confirmation...');
    await page.waitForURL(/\/order-confirmation/, { timeout: 30000 });

    // Vérifier qu'on est sur la page de confirmation
    await expect(page).toHaveURL(/\/order-confirmation\?order_id=/);

    // Vérifier que la page de confirmation affiche le succès
    await expect(page.locator('text=/Merci pour votre commande|Commande confirmée/i')).toBeVisible();

    // Vérifier que les détails de la commande sont affichés
    await expect(page.locator(`text=/${newUser.firstName} ${newUser.lastName}/i`)).toBeVisible();

    // Attendre un peu pour voir si l'API email est appelée
    await page.waitForTimeout(2000);

    // Vérifier si l'API email a été appelée
    if (emailAPICalled) {
      console.log('✅ L\'API d\'envoi d\'email a été appelée');
    } else {
      console.warn('⚠️ L\'API d\'envoi d\'email n\'a PAS été appelée');
    }

    // Étape 7 : Vérifier que l'utilisateur est connecté
    console.log('🔐 Vérification de la connexion automatique...');
    await page.goto('/compte');

    // Vérifier qu'on est sur la page du compte (pas de redirection vers login)
    await expect(page).toHaveURL(/\/compte/);

    // Vérifier que le nom de l'utilisateur est affiché
    await expect(page.locator(`text=/${newUser.firstName}/i`)).toBeVisible();

    console.log('✅ Test création de compte terminé avec succès');
  });
});

// =============================================================================
// TEST 4 : VÉRIFICATION DES ERREURS DE PERMISSION
// =============================================================================

test.describe('Vérification des permissions Firestore', () => {
  test('ne doit pas avoir d\'erreurs de permission sur la page de confirmation', async ({ page }) => {
    const consoleErrors = [];
    const firestoreErrors = [];

    // Capturer toutes les erreurs console
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
        if (msg.text().includes('permission') || msg.text().includes('FirebaseError')) {
          firestoreErrors.push(msg.text());
        }
      }
    });

    // Ajouter un produit au panier et passer commande
    await addProductToCart(page);
    await page.goto('/panier');
    await page.locator('text=/Commander|Passer la commande/i').click();

    // Remplir le formulaire invité rapidement
    await page.fill('input[name="firstName"]', 'Test');
    await page.fill('input[name="lastName"]', 'Permission');
    await page.fill('input[name="email"]', `test.permission.${Date.now()}@example.com`);
    await page.fill('input[name="phone"]', '0690000000');
    await page.fill('input[name="address"]', '123 Test');
    await page.fill('input[name="city"]', 'Test');
    await page.fill('input[name="postalCode"]', '97110');

    // Paiement Stripe
    await page.waitForSelector('iframe[name^="__privateStripeFrame"]', { timeout: 10000 });
    await fillStripePaymentForm(page);
    await page.locator('button:has-text("Payer")').click();

    // Attendre la page de confirmation
    await page.waitForURL(/\/order-confirmation/, { timeout: 30000 });

    // Attendre un peu pour que toutes les erreurs éventuelles soient capturées
    await page.waitForTimeout(3000);

    // Vérifier qu'il n'y a pas d'erreurs Firestore
    if (firestoreErrors.length > 0) {
      console.error('❌ Erreurs Firestore détectées:');
      firestoreErrors.forEach(error => console.error('  -', error));
      throw new Error(`Erreurs de permission Firestore détectées: ${firestoreErrors.length} erreur(s)`);
    }

    console.log('✅ Aucune erreur de permission détectée');

    if (consoleErrors.length > 0) {
      console.warn('⚠️ Autres erreurs console détectées:');
      consoleErrors.forEach(error => console.warn('  -', error));
    }
  });
});
