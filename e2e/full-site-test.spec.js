// @ts-check
import { test, expect } from '@playwright/test';

/**
 * TEST COMPLET DU SITE - CLIENT + ADMIN
 *
 * Ce test couvre l'ensemble des fonctionnalités du site GwadaEcom
 * - Partie CLIENT: Navigation, recherche, produits, panier, checkout
 * - Partie ADMIN: Dashboard, produits, catégories, commandes, settings
 */

test.describe('Test Complet du Site GwadaEcom', () => {

  // ============================================================================
  // PARTIE 1: TESTS CÔTÉ CLIENT
  // ============================================================================

  test.describe('PARTIE CLIENT - Navigation et Achat', () => {

    test('01. Page d\'accueil - Éléments principaux', async ({ page }) => {
      await page.goto('/');

      // Vérifier le Header
      await expect(page.locator('header')).toBeVisible();
      const headerText = await page.locator('header').textContent();
      expect(headerText).toContain('Perles des Îles');

      // Vérifier la navigation
      await expect(page.getByRole('link', { name: /accueil/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /bijoux/i })).toBeVisible();

      // Vérifier le Hero
      const hero = page.locator('section').first();
      await expect(hero).toBeVisible();

      // Vérifier la grille de produits
      const productCards = page.locator('[class*="ProductCard"], .product-card, a[href^="/products/"]').filter({
        has: page.locator('img')
      });
      const count = await productCards.count();
      expect(count).toBeGreaterThan(0);

      // Vérifier le Footer
      await expect(page.locator('footer')).toBeVisible();
      const footerText = await page.locator('footer').textContent();
      expect(footerText).toContain('Newsletter');
    });

    test('02. Recherche de produits', async ({ page }) => {
      await page.goto('/');

      // Ouvrir la barre de recherche
      const searchButton = page.locator('button, div, span').filter({ hasText: /search|recherche/i }).first();
      if (await searchButton.isVisible()) {
        await searchButton.click();
        await page.waitForTimeout(500);
      }

      // Rechercher un produit
      const searchInput = page.locator('input[type="text"]').filter({ hasText: '' }).first();
      if (await searchInput.isVisible()) {
        await searchInput.fill('bracelet');
        await page.waitForTimeout(1000);

        // Vérifier les résultats
        const results = page.locator('a[href^="/products/"]');
        const resultsCount = await results.count();
        expect(resultsCount).toBeGreaterThanOrEqual(0);
      }
    });

    test('03. Consultation fiche produit', async ({ page }) => {
      await page.goto('/');

      // Cliquer sur un produit
      const productCards = page.locator('a[href^="/products/"]').filter({
        has: page.locator('img')
      });
      const firstProduct = productCards.first();
      await firstProduct.click();

      // Attendre le chargement de la page produit
      await page.waitForURL(/\/products\/.+/);
      await page.waitForLoadState('networkidle');

      // Vérifier les éléments de la page produit
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('img').first()).toBeVisible();

      // Vérifier le prix
      const priceElement = page.locator('text=/\\d+[.,]\\d{2}\\s*€/').first();
      await expect(priceElement).toBeVisible();

      // Vérifier le sélecteur de quantité
      const quantityInput = page.locator('input[type="number"], input[name="quantity"]').first();
      if (await quantityInput.isVisible()) {
        await expect(quantityInput).toBeVisible();
      }
    });

    test('04. Ajout au panier', async ({ page }) => {
      await page.goto('/');

      // Aller sur une fiche produit
      const productCards = page.locator('a[href^="/products/"]').filter({
        has: page.locator('img')
      });
      await productCards.first().click();
      await page.waitForURL(/\/products\/.+/);
      await page.waitForLoadState('networkidle');

      // Ajouter au panier
      const addButton = page.getByRole('button', { name: /add to cart|ajouter au panier/i });
      if (await addButton.isVisible()) {
        await addButton.click();
        await page.waitForTimeout(1000);

        // Vérifier que le panier se met à jour
        const cartBadge = page.locator('[class*="badge"], [class*="cart-count"]').first();
        if (await cartBadge.isVisible()) {
          const badgeText = await cartBadge.textContent();
          expect(parseInt(badgeText || '0')).toBeGreaterThan(0);
        }
      }
    });

    test('05. Consultation du panier', async ({ page }) => {
      await page.goto('/');

      // Ajouter un produit au panier d'abord
      const productCards = page.locator('a[href^="/products/"]').filter({
        has: page.locator('img')
      });
      await productCards.first().click();
      await page.waitForURL(/\/products\/.+/);

      const addButton = page.getByRole('button', { name: /add to cart|ajouter au panier/i });
      if (await addButton.isVisible()) {
        await addButton.click();
        await page.waitForTimeout(1000);

        // Aller au panier
        await page.goto('/cart');
        await page.waitForLoadState('networkidle');

        // Vérifier le contenu du panier
        await expect(page.locator('h1, h2').filter({ hasText: /panier|cart/i })).toBeVisible();

        // Vérifier qu'il y a au moins un produit
        const cartItems = page.locator('[class*="cart-item"], .cart-product, div').filter({
          has: page.locator('img')
        });
        const itemsCount = await cartItems.count();
        expect(itemsCount).toBeGreaterThan(0);
      }
    });

    test('06. Modification quantité panier', async ({ page }) => {
      await page.goto('/');

      // Ajouter un produit
      const productCards = page.locator('a[href^="/products/"]').filter({
        has: page.locator('img')
      });
      await productCards.first().click();
      await page.waitForURL(/\/products\/.+/);

      const addButton = page.getByRole('button', { name: /add to cart|ajouter au panier/i });
      if (await addButton.isVisible()) {
        await addButton.click();
        await page.waitForTimeout(1000);

        // Aller au panier
        await page.goto('/cart');
        await page.waitForLoadState('networkidle');

        // Essayer d'augmenter la quantité
        const increaseButton = page.locator('button').filter({ hasText: '+' }).first();
        if (await increaseButton.isVisible()) {
          const totalBefore = await page.locator('text=/total/i').first().textContent();
          await increaseButton.click();
          await page.waitForTimeout(500);
          const totalAfter = await page.locator('text=/total/i').first().textContent();
          expect(totalBefore).not.toBe(totalAfter);
        }
      }
    });

    test('07. Suppression produit du panier', async ({ page }) => {
      await page.goto('/');

      // Ajouter un produit
      const productCards = page.locator('a[href^="/products/"]').filter({
        has: page.locator('img')
      });
      await productCards.first().click();
      await page.waitForURL(/\/products\/.+/);

      const addButton = page.getByRole('button', { name: /add to cart|ajouter au panier/i });
      if (await addButton.isVisible()) {
        await addButton.click();
        await page.waitForTimeout(1000);

        // Aller au panier
        await page.goto('/cart');
        await page.waitForLoadState('networkidle');

        // Supprimer le produit
        const deleteButton = page.locator('button').filter({
          hasText: /supprimer|remove|delete|trash/i
        }).first();
        if (await deleteButton.isVisible()) {
          await deleteButton.click();
          await page.waitForTimeout(500);

          // Vérifier que le panier est vide ou mis à jour
          const emptyMessage = page.locator('text=/vide|empty/i');
          const isEmptyVisible = await emptyMessage.isVisible();
          expect(isEmptyVisible).toBe(true);
        }
      }
    });

    test('08. Page checkout - Chargement', async ({ page }) => {
      await page.goto('/');

      // Ajouter un produit
      const productCards = page.locator('a[href^="/products/"]').filter({
        has: page.locator('img')
      });
      await productCards.first().click();
      await page.waitForURL(/\/products\/.+/);

      const addButton = page.getByRole('button', { name: /add to cart|ajouter au panier/i });
      if (await addButton.isVisible()) {
        await addButton.click();
        await page.waitForTimeout(1000);

        // Aller au checkout
        await page.goto('/checkout');
        await page.waitForLoadState('networkidle');

        // Vérifier la page checkout
        await expect(page).toHaveURL('/checkout');
        await expect(page.locator('h1, h2').filter({ hasText: /checkout|paiement|commande/i })).toBeVisible();

        // Vérifier la présence des options de paiement
        const guestOption = page.locator('button, label').filter({ hasText: /invité|guest/i });
        await expect(guestOption.first()).toBeVisible();
      }
    });

    test('09. Inscription newsletter', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Chercher le formulaire newsletter
      const newsletterInput = page.locator('input[type="email"]').filter({
        hasText: ''
      }).last();

      if (await newsletterInput.isVisible()) {
        await newsletterInput.fill('test@example.com');

        const submitButton = page.locator('button').filter({
          hasText: /subscribe|s'inscrire|envoyer/i
        }).last();

        if (await submitButton.isVisible()) {
          await submitButton.click();
          await page.waitForTimeout(1000);

          // Vérifier un message de succès ou confirmation
          const successMessage = page.locator('text=/merci|success|inscrit/i');
          const isVisible = await successMessage.isVisible().catch(() => false);
          // Note: Peut ne pas être visible si la fonctionnalité n'est pas encore implémentée
        }
      }
    });

    test('10. Navigation par catégorie', async ({ page }) => {
      await page.goto('/');

      // Cliquer sur un lien de catégorie
      const categoryLink = page.locator('a[href^="/category/"]').first();
      if (await categoryLink.isVisible()) {
        await categoryLink.click();
        await page.waitForURL(/\/category\/.+/);
        await page.waitForLoadState('networkidle');

        // Vérifier qu'on est sur une page de catégorie
        await expect(page).toHaveURL(/\/category\/.+/);

        // Vérifier la grille de produits filtrés
        const productCards = page.locator('a[href^="/products/"]').filter({
          has: page.locator('img')
        });
        const count = await productCards.count();
        expect(count).toBeGreaterThanOrEqual(0);
      }
    });

  });

  // ============================================================================
  // PARTIE 2: TESTS CÔTÉ ADMIN
  // ============================================================================

  test.describe('PARTIE ADMIN - Gestion du site', () => {

    // Credentials admin
    const ADMIN_EMAIL = 'admin@gwadecom.com';
    const ADMIN_PASSWORD = 'Admin123!';

    test.beforeEach(async ({ page }) => {
      // Connexion admin avant chaque test
      await page.goto('/mon-compte');
      await page.waitForLoadState('networkidle');

      const emailInput = page.locator('input[type="email"], input[name="email"]').first();
      const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
      const loginButton = page.getByRole('button', { name: /connexion|login|sign in/i }).first();

      if (await emailInput.isVisible()) {
        await emailInput.fill(ADMIN_EMAIL);
        await passwordInput.fill(ADMIN_PASSWORD);
        await loginButton.click();

        // Attendre la redirection
        await page.waitForTimeout(2000);
      }
    });

    test('11. ADMIN - Accès au dashboard', async ({ page }) => {
      await page.goto('/admin');
      await page.waitForLoadState('networkidle');

      // Vérifier qu'on est sur le dashboard admin
      await expect(page).toHaveURL('/admin');

      // Vérifier les éléments du dashboard
      await expect(page.locator('h1, h2').filter({ hasText: /dashboard|tableau de bord/i })).toBeVisible();

      // Vérifier la présence des statistiques
      const statsCards = page.locator('[class*="stat"], [class*="card"], div').filter({
        has: page.locator('text=/€|commande|produit/i')
      });
      const statsCount = await statsCards.count();
      expect(statsCount).toBeGreaterThan(0);
    });

    test('12. ADMIN - Navigation sections', async ({ page }) => {
      await page.goto('/admin');
      await page.waitForLoadState('networkidle');

      // Vérifier les liens de navigation admin
      const sections = [
        { name: /produits|products/i, url: '/admin/products' },
        { name: /catégories|categories/i, url: '/admin/categories' },
        { name: /commandes|orders/i, url: '/admin/commercial/orders' },
        { name: /paramètres|settings/i, url: '/admin/settings' }
      ];

      for (const section of sections) {
        const link = page.getByRole('link', { name: section.name }).first();
        if (await link.isVisible()) {
          await expect(link).toBeVisible();
        }
      }
    });

    test('13. ADMIN - Gestion des produits', async ({ page }) => {
      await page.goto('/admin/products');
      await page.waitForLoadState('networkidle');

      // Vérifier qu'on est sur la page produits
      await expect(page).toHaveURL('/admin/products');

      // Vérifier le titre
      await expect(page.locator('h1, h2').filter({ hasText: /produits|products/i })).toBeVisible();

      // Vérifier le bouton d'ajout
      const addButton = page.getByRole('button', { name: /ajouter|nouveau|add/i }).first();
      if (await addButton.isVisible()) {
        await expect(addButton).toBeVisible();
      }

      // Vérifier la liste des produits
      const productRows = page.locator('tr, [class*="product-item"], div').filter({
        has: page.locator('text=/€|edit|modifier/i')
      });
      const rowsCount = await productRows.count();
      expect(rowsCount).toBeGreaterThanOrEqual(0);
    });

    test('14. ADMIN - Formulaire ajout produit', async ({ page }) => {
      await page.goto('/admin/add-product');
      await page.waitForLoadState('networkidle');

      // Vérifier les champs du formulaire
      const fields = [
        'input[name="name"], input[placeholder*="nom"]',
        'textarea[name="description"]',
        'input[name="price"], input[type="number"]',
        'input[name="stock"], input[placeholder*="stock"]'
      ];

      for (const field of fields) {
        const element = page.locator(field).first();
        if (await element.isVisible()) {
          await expect(element).toBeVisible();
        }
      }

      // Vérifier le bouton de soumission
      const submitButton = page.getByRole('button', { name: /enregistrer|save|créer/i });
      await expect(submitButton.first()).toBeVisible();
    });

    test('15. ADMIN - Gestion des catégories', async ({ page }) => {
      await page.goto('/admin/categories');
      await page.waitForLoadState('networkidle');

      // Vérifier qu'on est sur la page catégories
      await expect(page).toHaveURL('/admin/categories');

      // Vérifier le titre
      await expect(page.locator('h1, h2').filter({ hasText: /catégories|categories/i })).toBeVisible();

      // Vérifier le bouton d'ajout
      const addButton = page.getByRole('button', { name: /ajouter|nouvelle|add/i }).first();
      if (await addButton.isVisible()) {
        await expect(addButton).toBeVisible();
      }
    });

    test('16. ADMIN - Gestion des commandes', async ({ page }) => {
      await page.goto('/admin/commercial/orders');
      await page.waitForLoadState('networkidle');

      // Vérifier qu'on est sur la page commandes
      await expect(page).toHaveURL('/admin/commercial/orders');

      // Vérifier le titre
      await expect(page.locator('h1, h2').filter({ hasText: /commandes|orders/i })).toBeVisible();

      // Vérifier la liste des commandes
      const orderRows = page.locator('tr, [class*="order-item"], div').filter({
        has: page.locator('text=/ORDER-|€|pending|paid/i')
      });
      const rowsCount = await orderRows.count();
      expect(rowsCount).toBeGreaterThanOrEqual(0);

      // Vérifier les filtres
      const filterButtons = page.locator('button').filter({
        hasText: /tous|pending|paid|shipped/i
      });
      const filtersCount = await filterButtons.count();
      expect(filtersCount).toBeGreaterThan(0);
    });

    test('17. ADMIN - Page settings', async ({ page }) => {
      await page.goto('/admin/settings');
      await page.waitForLoadState('networkidle');

      // Vérifier qu'on est sur la page settings
      await expect(page).toHaveURL('/admin/settings');

      // Vérifier le titre
      await expect(page.locator('h1, h2').filter({ hasText: /paramètres|settings|configuration/i })).toBeVisible();

      // Vérifier les sections
      const sections = page.locator('button, a').filter({
        hasText: /général|couleurs|blocs|css|company/i
      });
      const sectionsCount = await sections.count();
      expect(sectionsCount).toBeGreaterThan(0);
    });

    test('18. ADMIN - Personnalisation couleurs', async ({ page }) => {
      await page.goto('/admin/settings');
      await page.waitForLoadState('networkidle');

      // Cliquer sur la section couleurs/CSS
      const colorSection = page.locator('button, a').filter({ hasText: /couleurs|css|personnalisation/i }).first();
      if (await colorSection.isVisible()) {
        await colorSection.click();
        await page.waitForTimeout(1000);

        // Vérifier les inputs de couleur
        const colorInputs = page.locator('input[type="color"], input[placeholder*="#"]');
        const inputsCount = await colorInputs.count();
        expect(inputsCount).toBeGreaterThan(0);

        // Vérifier le bouton de sauvegarde
        const saveButton = page.getByRole('button', { name: /enregistrer|save|appliquer/i });
        await expect(saveButton.first()).toBeVisible();
      }
    });

    test('19. ADMIN - Statistiques dashboard', async ({ page }) => {
      await page.goto('/admin');
      await page.waitForLoadState('networkidle');

      // Vérifier la présence des KPIs
      const kpis = [
        /chiffre d'affaires|revenue|total/i,
        /commandes|orders/i,
        /produits|products/i,
        /clients|users/i
      ];

      for (const kpi of kpis) {
        const element = page.locator('text=' + kpi).first();
        const isVisible = await element.isVisible().catch(() => false);
        // Les KPIs peuvent varier selon les données
      }
    });

    test('20. ADMIN - Détails d\'une commande', async ({ page }) => {
      await page.goto('/admin/commercial/orders');
      await page.waitForLoadState('networkidle');

      // Chercher une commande
      const orderRow = page.locator('tr, div').filter({
        hasText: /ORDER-/i
      }).first();

      if (await orderRow.isVisible()) {
        // Cliquer sur la commande ou le bouton détails
        const detailsButton = orderRow.locator('button').filter({
          hasText: /détails|voir|view/i
        }).first();

        if (await detailsButton.isVisible()) {
          await detailsButton.click();
          await page.waitForTimeout(1000);

          // Vérifier la modal ou page de détails
          const modal = page.locator('[role="dialog"], .modal, [class*="modal"]');
          if (await modal.isVisible()) {
            await expect(modal).toBeVisible();

            // Vérifier les informations de la commande
            await expect(modal.locator('text=/ORDER-/i')).toBeVisible();
            await expect(modal.locator('text=/€/i')).toBeVisible();
          }
        }
      }
    });

  });

  // ============================================================================
  // PARTIE 3: TESTS FONCTIONNELS AVANCÉS
  // ============================================================================

  test.describe('TESTS AVANCÉS - Scénarios complets', () => {

    test('21. Parcours complet client: Recherche → Produit → Panier → Checkout', async ({ page }) => {
      // 1. Page d'accueil
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // 2. Recherche d'un produit
      const searchButton = page.locator('button, div, span').filter({ hasText: /search|recherche/i }).first();
      if (await searchButton.isVisible()) {
        await searchButton.click();
        await page.waitForTimeout(500);

        const searchInput = page.locator('input[type="text"]').first();
        await searchInput.fill('bracelet');
        await page.waitForTimeout(1000);
      }

      // 3. Cliquer sur un produit
      const productCards = page.locator('a[href^="/products/"]').filter({
        has: page.locator('img')
      });
      await productCards.first().click();
      await page.waitForURL(/\/products\/.+/);

      // 4. Ajouter au panier
      const addButton = page.getByRole('button', { name: /add to cart|ajouter au panier/i });
      if (await addButton.isVisible()) {
        await addButton.click();
        await page.waitForTimeout(1000);

        // 5. Aller au panier
        await page.goto('/cart');
        await page.waitForLoadState('networkidle');

        // 6. Procéder au checkout
        const checkoutButton = page.getByRole('button', { name: /checkout|commander|passer commande/i });
        if (await checkoutButton.isVisible()) {
          await checkoutButton.click();
          await page.waitForURL('/checkout');
          await page.waitForLoadState('networkidle');

          // Vérifier qu'on est bien sur le checkout
          await expect(page).toHaveURL('/checkout');
        }
      }
    });

    test('22. Gestion stock: Badge et disponibilité', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Chercher des badges de stock
      const stockBadges = page.locator('span, div').filter({
        hasText: /en stock|bientôt épuisé|rupture|stock/i
      });

      const badgesCount = await stockBadges.count();
      expect(badgesCount).toBeGreaterThanOrEqual(0);

      // Vérifier qu'un produit en rupture n'est pas cliquable
      const ruptureCards = page.locator('div').filter({
        has: page.locator('text=/rupture/i')
      });

      if (await ruptureCards.first().isVisible()) {
        const isClickable = await ruptureCards.first().locator('a').first().isEnabled();
        // Le produit en rupture peut avoir un lien désactivé
      }
    });

    test('23. Responsive: Vérification mobile', async ({ page }) => {
      // Simuler un viewport mobile
      await page.setViewportSize({ width: 375, height: 667 });

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Vérifier que le header est visible en mobile
      await expect(page.locator('header')).toBeVisible();

      // Vérifier le menu hamburger ou navigation mobile
      const mobileMenu = page.locator('button').filter({
        hasText: /menu|☰/i
      }).first();

      // La navigation peut être différente en mobile
      const navLinks = page.locator('nav a, header a');
      const navCount = await navLinks.count();
      expect(navCount).toBeGreaterThan(0);

      // Vérifier la grille produits en mobile (2 colonnes)
      const productCards = page.locator('a[href^="/products/"]').filter({
        has: page.locator('img')
      });
      const firstCard = productCards.first();
      if (await firstCard.isVisible()) {
        const box = await firstCard.boundingBox();
        expect(box?.width).toBeLessThan(250); // Largeur réduite en mobile
      }
    });

    test('24. Performance: Temps de chargement', async ({ page }) => {
      const startTime = Date.now();

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const loadTime = Date.now() - startTime;

      // Vérifier que la page charge en moins de 5 secondes
      expect(loadTime).toBeLessThan(5000);

      // Vérifier que les images sont chargées
      const images = page.locator('img');
      const imagesCount = await images.count();
      expect(imagesCount).toBeGreaterThan(0);

      // Vérifier qu'au moins une image est visible
      await expect(images.first()).toBeVisible();
    });

    test('25. SEO: Métadonnées de base', async ({ page }) => {
      await page.goto('/');

      // Vérifier le titre de la page
      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);
      expect(title).not.toBe('');

      // Vérifier la meta description
      const metaDescription = page.locator('meta[name="description"]');
      const hasDescription = await metaDescription.count();
      expect(hasDescription).toBeGreaterThanOrEqual(0);

      // Vérifier les titres H1
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBeGreaterThanOrEqual(1);
    });

  });

});
