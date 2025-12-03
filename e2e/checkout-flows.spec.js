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

// Helper : Vérifier que le formulaire Stripe est chargé
// NOTE: Ce test vérifie uniquement que le Payment Element Stripe se charge correctement.
// Le remplissage des champs et la soumission du paiement doivent être testés MANUELLEMENT
// car le Payment Element de Stripe utilise des iframes complexes difficiles à automatiser.
async function verifyStripeFormLoaded(page) {
  console.log('🔍 Vérification du chargement du formulaire Stripe...');

  // Attendre que l'iframe principale Stripe soit visible (timeout 15s)
  await page.waitForSelector('iframe[name^="__privateStripeFrame"]', { timeout: 15000 });

  // Vérifier que l'iframe est bien visible
  const stripeIframe = page.locator('iframe[name^="__privateStripeFrame"]').first();
  await expect(stripeIframe).toBeVisible();

  // Attendre un peu pour que le Payment Element soit complètement chargé
  await page.waitForTimeout(2000);

  console.log('✅ Formulaire Stripe chargé avec succès');
  console.log('⚠️  PAIEMENT À TESTER MANUELLEMENT :');
  console.log('   1. Carte: 4242 4242 4242 4242');
  console.log('   2. Date: 12/34');
  console.log('   3. CVC: 123');
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
    await page.goto('/cart');
    await page.waitForSelector('button:has-text("Passer commande")');
    await page.locator('button:has-text("Passer commande")').click();

    // Vérifier qu'on est sur la page checkout
    await expect(page).toHaveURL(/\/checkout/);

    // Étape 3 : Cliquer sur "Continuer en tant qu'invité"
    console.log('📝 Sélection du mode invité...');
    await page.waitForSelector('button:has-text("Continuer en tant qu\'invité")');
    await page.locator('button:has-text("Continuer en tant qu\'invité")').click();

    // Attendre que le formulaire de livraison apparaisse
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('input[name="firstName"]', { timeout: 10000 });

    console.log('📝 Remplissage du formulaire invité...');

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

    // Cliquer sur "Procéder au paiement"
    await page.locator('button:has-text("Procéder au paiement")').click();

    // Étape 4 : Vérifier que le formulaire Stripe se charge
    await verifyStripeFormLoaded(page);

    console.log('✅ Test invité terminé avec succès');
    console.log('📝 Le paiement et la confirmation doivent être testés MANUELLEMENT');
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
    await page.goto('/cart');
    await page.locator('button:has-text("Passer commande")').click();

    // Vérifier qu'on est sur la page checkout
    await expect(page).toHaveURL(/\/checkout/);

    // Étape 4 : Attendre que le formulaire de livraison apparaisse
    // (utilisateur connecté passe automatiquement en mode 'guest')
    console.log('📝 Attente du formulaire de livraison...');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('input[name="firstName"]', { timeout: 10000 });

    console.log('📝 Vérification des informations pré-remplies...');

    // L'email et le nom devraient être pré-remplis automatiquement
    await expect(page.locator('input[name="email"]')).toHaveValue(testUser.email);
    await expect(page.locator('input[name="firstName"]')).toHaveValue(testUser.firstName);
    await expect(page.locator('input[name="lastName"]')).toHaveValue(testUser.lastName);

    // Remplir les champs d'adresse (toujours vides pour un nouveau compte)
    await page.fill('input[name="phone"]', '0690987654');
    await page.fill('input[name="address"]', '456 Avenue de Test');
    await page.fill('input[name="city"]', 'Les Abymes');
    await page.fill('input[name="postalCode"]', '97139');
    await page.locator('select[name="country"]').selectOption('Guadeloupe');

    // Cliquer sur "Procéder au paiement"
    await page.locator('button:has-text("Procéder au paiement")').click();

    // Étape 5 : Vérifier que le formulaire Stripe se charge
    await verifyStripeFormLoaded(page);

    console.log('✅ Test utilisateur connecté terminé avec succès');
    console.log('📝 Le paiement et la confirmation doivent être testés MANUELLEMENT');
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
    await page.goto('/cart');
    await page.locator('button:has-text("Passer commande")').click();

    // Vérifier qu'on est sur la page checkout
    await expect(page).toHaveURL(/\/checkout/);

    // Étape 3 : Cliquer sur "Créer un compte"
    console.log('📝 Sélection de l\'option création de compte...');
    await page.waitForSelector('button:has-text("Créer un compte")');
    await page.locator('button:has-text("Créer un compte")').click();

    // Attendre que le formulaire d'inscription apparaisse
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('input[name="password"]', { timeout: 10000 });

    console.log('📝 Remplissage du formulaire d\'inscription...');

    // Remplir le formulaire d'inscription
    await page.fill('input[name="firstName"]', newUser.firstName);
    await page.fill('input[name="lastName"]', newUser.lastName);
    await page.fill('input[name="email"]', newUser.email);

    // Remplir les champs de mot de passe
    const passwordInputs = page.locator('input[type="password"]');
    await passwordInputs.first().fill(newUser.password);
    await passwordInputs.nth(1).fill(newUser.password); // Confirmer le mot de passe

    // Soumettre le formulaire d'inscription
    await page.locator('button:has-text("Créer mon compte")').click();

    // Attendre que le formulaire de livraison apparaisse (après création du compte)
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('input[name="firstName"]', { timeout: 10000 });

    console.log('📝 Remplissage de l\'adresse de livraison...');

    // Remplir tous les champs du formulaire de livraison
    // Les noms doivent être vides car le formulaire signup n'inclut pas l'adresse
    const firstNameValue = await page.locator('input[name="firstName"]').inputValue();
    if (!firstNameValue) {
      await page.fill('input[name="firstName"]', newUser.firstName);
      await page.fill('input[name="lastName"]', newUser.lastName);
    }

    await page.fill('input[name="phone"]', '0690555666');
    await page.fill('input[name="address"]', '789 Boulevard de Test');
    await page.fill('input[name="city"]', 'Basse-Terre');
    await page.fill('input[name="postalCode"]', '97100');
    await page.locator('select[name="country"]').selectOption('Guadeloupe');

    // Cliquer sur "Procéder au paiement"
    await page.locator('button:has-text("Procéder au paiement")').click();

    // Étape 4 : Vérifier que le formulaire Stripe se charge
    await verifyStripeFormLoaded(page);

    console.log('✅ Test création de compte terminé avec succès');
    console.log('📝 Le paiement, la confirmation et la connexion doivent être testés MANUELLEMENT');
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
    await page.goto('/cart');
    await page.locator('button:has-text("Passer commande")').click();

    // Cliquer sur "Continuer en tant qu'invité"
    await page.waitForSelector('button:has-text("Continuer en tant qu\'invité")');
    await page.locator('button:has-text("Continuer en tant qu\'invité")').click();

    // Attendre que le formulaire apparaisse
    await page.waitForLoadState('domcontentloaded');
    await page.waitForSelector('input[name="firstName"]', { timeout: 10000 });

    // Remplir le formulaire invité rapidement
    await page.fill('input[name="firstName"]', 'Test');
    await page.fill('input[name="lastName"]', 'Permission');
    await page.fill('input[name="email"]', `test.permission.${Date.now()}@example.com`);
    await page.fill('input[name="phone"]', '0690000000');
    await page.fill('input[name="address"]', '123 Test');
    await page.fill('input[name="city"]', 'Test');
    await page.fill('input[name="postalCode"]', '97110');

    // Cliquer sur "Procéder au paiement"
    await page.locator('button:has-text("Procéder au paiement")').click();

    // Vérifier que le formulaire Stripe se charge sans erreurs
    await verifyStripeFormLoaded(page);

    // Attendre un peu pour que toutes les erreurs éventuelles soient capturées
    await page.waitForTimeout(2000);

    // Vérifier qu'il n'y a pas d'erreurs Firestore jusqu'ici
    if (firestoreErrors.length > 0) {
      console.error('❌ Erreurs Firestore détectées:');
      firestoreErrors.forEach(error => console.error('  -', error));
      throw new Error(`Erreurs de permission Firestore détectées: ${firestoreErrors.length} erreur(s)`);
    }

    console.log('✅ Aucune erreur de permission détectée');
    console.log('📝 La vérification complète des permissions nécessite de TESTER MANUELLEMENT le paiement et la confirmation');

    if (consoleErrors.length > 0) {
      console.warn('⚠️ Autres erreurs console détectées:');
      consoleErrors.forEach(error => console.warn('  -', error));
    }
  });
});
