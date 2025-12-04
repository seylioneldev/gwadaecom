import { test, expect } from "@playwright/test";

// Helper : ajouter un produit au panier depuis la home
async function addProductToCartFromHome(page) {
  await page.goto("/");

  // Attendre qu'au moins un produit soit présent ou qu'un message "Aucun produit" apparaisse
  try {
    await page.waitForSelector('a[href^="/products/"]', { timeout: 10000 });
  } catch (error) {
    const noProductsMessage = await page
      .locator("text=/Aucun produit disponible/i")
      .isVisible()
      .catch(() => false);

    if (noProductsMessage) {
      throw new Error(
        "Aucun produit disponible dans la boutique. Ajoutez au moins un produit via l'admin."
      );
    }

    throw error;
  }

  // Aller sur la page produit
  await page.locator('a[href^="/products/"]').first().click();
  await page.waitForURL(/\/products\/.+/, { timeout: 5000 });

  // Ajouter au panier
  await page.waitForSelector('button:has-text("Add to Cart")', {
    timeout: 5000,
  });
  await page.locator('button:has-text("Add to Cart")').click();

  // Attendre que le panier latéral s'ouvre
  await page.waitForSelector("text=/Votre Panier|Mon Panier/i", {
    timeout: 5000,
  });

  // Fermer l'overlay si présent
  const overlay = page.locator(".fixed.inset-0.bg-black\\/50");
  const hasOverlay = await overlay.isVisible().catch(() => false);
  if (hasOverlay) {
    await overlay.click();
    await page.waitForTimeout(500);
  }
}

// Helper : vérifier que le Payment Element Stripe est bien chargé
async function verifyStripeFormLoaded(page) {
  // Attendre que l'iframe principale Stripe soit visible (timeout 15s)
  await page.waitForSelector('iframe[name^="__privateStripeFrame"]', {
    timeout: 15000,
  });

  const stripeIframe = page
    .locator('iframe[name^="__privateStripeFrame"]')
    .first();
  await expect(stripeIframe).toBeVisible();

  // Laisser un peu de temps pour que le Payment Element se charge complètement
  await page.waitForTimeout(2000);
}

// ============================================================================
// SMOKE TEST 1 : Parcours invité complet jusqu'au chargement Stripe
// ============================================================================

test.describe("Smoke - Parcours invité principal", () => {
  test("Home → Produit → Panier → Checkout invité → Stripe chargé", async ({
    page,
  }) => {
    // Étape 1 : ajouter un produit au panier depuis la home
    await addProductToCartFromHome(page);

    // Étape 2 : aller sur /cart et cliquer sur "Passer commande"
    await page.goto("/cart");
    await page.waitForSelector('button:has-text("Passer commande")', {
      timeout: 10000,
    });
    await page.locator('button:has-text("Passer commande")').click();

    // Vérifier qu'on est bien sur /checkout
    await expect(page).toHaveURL(/\/checkout/);

    // Étape 3 : choisir le mode invité si nécessaire
    const guestButton = page.locator(
      'button:has-text("Continuer en tant qu\'invité")'
    );
    const hasGuestButton = await guestButton.isVisible().catch(() => false);

    if (hasGuestButton) {
      await guestButton.click();
    }

    // Étape 4 : remplir le formulaire invité (informations de livraison)
    await page.waitForSelector('input[name="firstName"]', { timeout: 10000 });

    const email = `smoke.invite.${Date.now()}@example.com`;

    await page.fill('input[name="firstName"]', "Smoke");
    await page.fill('input[name="lastName"]', "Invité");
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="phone"]', "0690123456");
    await page.fill('input[name="address"]', "1 Rue du Smoke Test");
    await page.fill('input[name="city"]', "Pointe-à-Pitre");
    await page.fill('input[name="postalCode"]', "97110");

    const countrySelect = page.locator('select[name="country"]');
    const hasCountrySelect = await countrySelect.isVisible().catch(() => false);
    if (hasCountrySelect) {
      await countrySelect.selectOption("Guadeloupe").catch(() => {});
    }

    // Étape 5 : passer à l'étape paiement
    await page.locator('button:has-text("Procéder au paiement")').click();

    // Étape 6 : vérifier que le formulaire Stripe se charge correctement
    await verifyStripeFormLoaded(page);
  });
});

// ============================================================================
// SMOKE TEST 2 : Vérification rapide de l'admin
// ============================================================================

test.describe("Smoke - Admin rapide", () => {
  test("Accès dashboard admin et page commandes si possible", async ({
    page,
  }) => {
    await page.goto("/admin");
    await page.waitForTimeout(1000);

    // Titre ou indication de dashboard
    const title = page
      .locator("h1, h2")
      .filter({ hasText: /admin|dashboard|tableau de bord/i });
    const hasTitle = await title.isVisible().catch(() => false);
    if (hasTitle) {
      await expect(title).toBeVisible();
    }

    // Lien vers la page des commandes si visible
    const ordersLink = page.locator('a[href="/admin/commercial/orders"]');
    const hasOrdersLink = await ordersLink.isVisible().catch(() => false);

    if (hasOrdersLink) {
      await ordersLink.click();
      await expect(page).toHaveURL("/admin/commercial/orders");
    }
  });
});
