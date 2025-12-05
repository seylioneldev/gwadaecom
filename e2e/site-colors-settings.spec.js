/**
 * TEST E2E : Paramètres de couleurs du site -> DynamicStyles
 * ==========================================================
 *
 * Vérifie que les champs de couleurs dans /admin/settings
 * (header, footer, page, boutons) sont bien appliqués sur le
 * site public via le composant DynamicStyles.
 */

const { test, expect } = require("@playwright/test");

// Identifiants admin pour les tests E2E.
// Configurez PLAYWRIGHT_ADMIN_EMAIL / PLAYWRIGHT_ADMIN_PASSWORD
// dans votre environnement pour surcharger ces valeurs.
const ADMIN_EMAIL = process.env.PLAYWRIGHT_ADMIN_EMAIL || "admin@gwadecom.com";
const ADMIN_PASSWORD = process.env.PLAYWRIGHT_ADMIN_PASSWORD;

async function loginAsAdmin(page) {
  if (!ADMIN_PASSWORD) {
    console.warn(
      "PLAYWRIGHT_ADMIN_PASSWORD non défini : le test site-colors-settings s'exécute sans authentification admin. " +
        "La sauvegarde Firestore des paramètres risque d'échouer (règles de sécurité)."
    );
    return;
  }

  await page.goto("/admin/login");
  await page.waitForTimeout(1000);

  await page.fill('input[type="email"], input[name="email"]', ADMIN_EMAIL);
  await page.fill(
    'input[type="password"], input[name="password"]',
    ADMIN_PASSWORD
  );

  const loginButton = page
    .locator('button[type="submit"], button')
    .filter({ hasText: /se connecter|connexion|login/i })
    .first();

  await loginButton.click();
  await page.waitForTimeout(1500);

  const loginError = page.locator(
    "text=/Email ou mot de passe incorrect|Accès refusé|Erreur de connexion/i"
  );
  const hasLoginError = await loginError.isVisible().catch(() => false);
  if (hasLoginError) {
    const msg = await loginError.textContent();
    throw new Error(
      `Impossible de se connecter en admin pour le test site-colors-settings : ${msg}`
    );
  }
}

function hexToRgb(hex) {
  const match = hex
    .toLowerCase()
    .match(/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);

  if (!match) return hex;

  const r = parseInt(match[1], 16);
  const g = parseInt(match[2], 16);
  const b = parseInt(match[3], 16);

  return `rgb(${r}, ${g}, ${b})`;
}

test.describe("Admin - Paramètres de couleurs -> Site public", () => {
  test("Changer les couleurs dans /admin/settings et vérifier le rendu public", async ({
    page,
  }) => {
    // 1. Se connecter en admin pour pouvoir écrire dans Firestore (settings)
    await loginAsAdmin(page);

    // 2. Aller sur la page des paramètres du site
    await page.goto("/admin/settings");
    await page.waitForTimeout(2000);

    // 3. Définir des couleurs de test (faciles à reconnaître)
    const colors = {
      headerBg: "#112233",
      headerText: "#ffcc00",
      footerBg: "#221144",
      footerText: "#fafafa",
      pageBg: "#ffeedd",
      buttonBg: "#008000",
      buttonText: "#ffffff",
      buttonHoverBg: "#0000aa",
    };

    // 3. Renseigner les couleurs dans la section "Personnalisation CSS"
    await page.fill(
      'input[name="customStyles.header.backgroundColor"]',
      colors.headerBg
    );
    await page.fill(
      'input[name="customStyles.header.textColor"]',
      colors.headerText
    );

    await page.fill(
      'input[name="customStyles.footer.backgroundColor"]',
      colors.footerBg
    );
    await page.fill(
      'input[name="customStyles.footer.textColor"]',
      colors.footerText
    );

    await page.fill(
      'input[name="customStyles.page.backgroundColor"]',
      colors.pageBg
    );

    await page.fill(
      'input[name="customStyles.buttons.primaryBgColor"]',
      colors.buttonBg
    );
    await page.fill(
      'input[name="customStyles.buttons.primaryTextColor"]',
      colors.buttonText
    );
    await page.fill(
      'input[name="customStyles.buttons.primaryHoverBgColor"]',
      colors.buttonHoverBg
    );

    // 4. Sauvegarder les paramètres
    const saveButton = page
      .locator("button")
      .filter({ hasText: /sauvegarder|save/i })
      .first();
    await saveButton.click();

    // Vérifier que la sauvegarde s'est bien passée côté admin
    const successMessage = page.locator(
      "text=Paramètres sauvegardés avec succès"
    );
    const errorMessage = page.locator("text=/Erreur :/i");

    // Si un message d'erreur apparaît, échouer le test immédiatement
    const hasError = await errorMessage.isVisible().catch(() => false);
    if (hasError) {
      const errorText = await errorMessage.textContent();
      throw new Error(
        `Échec de la sauvegarde des paramètres admin : ${errorText}`
      );
    }

    // Sinon, on attend explicitement le message de succès
    await expect(successMessage).toBeVisible({ timeout: 5000 });

    // Laisser un léger délai pour que SettingsContext / DynamicStyles
    // propagent les nouvelles valeurs.
    await page.waitForTimeout(1500);

    // 5. Aller sur la page d'accueil (site public)
    await page.goto("/");

    // Attendre que DynamicStyles injecte le CSS
    await page.waitForTimeout(2000);

    // 6. Vérifications des styles calculés

    // 6.1. Couleur de fond de la page (body)
    const expectedBodyBg = hexToRgb(colors.pageBg);

    // Utiliser une assertion Playwright dédiée au CSS pour éviter
    // les timeouts fragiles avec waitForFunction.
    await expect(page.locator("body")).toHaveCSS(
      "background-color",
      expectedBodyBg,
      { timeout: 30000 }
    );

    const bodyBg = await page.evaluate(
      () => getComputedStyle(document.body).backgroundColor
    );
    expect(bodyBg).toBe(expectedBodyBg);

    // 6.2. Header : background + couleur de texte
    const header = await page.$("header");
    expect(header).not.toBeNull();

    const headerBg = await header.evaluate(
      (el) => getComputedStyle(el).backgroundColor
    );
    const headerColor = await header.evaluate(
      (el) => getComputedStyle(el).color
    );

    expect(headerBg).toBe(hexToRgb(colors.headerBg));
    expect(headerColor).toBe(hexToRgb(colors.headerText));

    // 6.3. Footer : background + couleur de texte
    const footer = await page.$("footer");
    expect(footer).not.toBeNull();

    const footerBg = await footer.evaluate(
      (el) => getComputedStyle(el).backgroundColor
    );
    const footerColor = await footer.evaluate(
      (el) => getComputedStyle(el).color
    );

    expect(footerBg).toBe(hexToRgb(colors.footerBg));
    expect(footerColor).toBe(hexToRgb(colors.footerText));

    // 6.4. Bouton principal (bg, texte, hover) basé sur la couleur primaire des boutons
    const primaryButton = page
      .locator('button[class*="bg-[#5d6e64]"], a[class*="bg-[#5d6e64]"]')
      .first();

    await expect(primaryButton).toBeVisible({ timeout: 5000 });

    const buttonBg = await primaryButton.evaluate(
      (el) => getComputedStyle(el).backgroundColor
    );
    const buttonColor = await primaryButton.evaluate(
      (el) => getComputedStyle(el).color
    );

    expect(buttonBg).toBe(hexToRgb(colors.buttonBg));
    expect(buttonColor).toBe(hexToRgb(colors.buttonText));

    // Vérifier la couleur de fond au survol (hover)
    await primaryButton.hover();
    await page.waitForTimeout(300);

    const buttonHoverBg = await primaryButton.evaluate(
      (el) => getComputedStyle(el).backgroundColor
    );

    expect(buttonHoverBg).toBe(hexToRgb(colors.buttonHoverBg));
  });
});
