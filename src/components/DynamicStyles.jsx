/**
 * COMPOSANT : DynamicStyles
 * ===========================
 *
 * Applique les styles CSS personnalisés définis dans les paramètres du site.
 * Injecte dynamiquement du CSS dans le <head> de la page.
 *
 * 🆕 NOUVEAU FICHIER CRÉÉ : src/components/DynamicStyles.jsx
 * DATE : 2025-11-30
 *
 * UTILISATION :
 * - Importer ce composant dans src/app/layout.js
 * - Il se chargera automatiquement d'appliquer les styles personnalisés
 */

"use client";

import { useSettings } from "@/context/SettingsContext";
import { useEffect } from "react";

export default function DynamicStyles() {
  const { settings, loading } = useSettings();

  useEffect(() => {
    if (!settings?.customStyles) return;

    const styles = settings.customStyles;

    // Créer une balise <style> pour injecter le CSS personnalisé
    const styleElement = document.createElement("style");
    styleElement.id = "dynamic-custom-styles";

    // Générer le CSS dynamique
    const css = `
      /* ========================================
         STYLES PERSONNALISÉS DEPUIS L'ADMIN
         ======================================== */

      /* HEADER */
      header.sticky {
        background-color: ${
          styles.header?.backgroundColor || "#6B7A6E"
        } !important;
        color: ${styles.header?.textColor || "#FFFFFF"} !important;
      }

      header.sticky * {
        color: ${styles.header?.textColor || "#FFFFFF"} !important;
      }

      /* Menu utilisateur (dropdown) du header */
      header .user-menu-panel {
        background-color: ${
          styles.header?.userMenuBgColor || "#FFFFFF"
        } !important;
        color: ${styles.header?.userMenuTextColor || "#1F2933"} !important;
      }

      header .user-menu-panel * {
        color: ${styles.header?.userMenuTextColor || "#1F2933"} !important;
      }

      /* Bandeau promo du header */
      header .bg-\\[\\#5d6e64\\] {
        background-color: ${
          styles.header?.promoBarBgColor || "#5d6e64"
        } !important;
        color: ${styles.header?.promoBarTextColor || "#FFFFFF"} !important;
      }

      /* FOOTER */
      footer {
        background-color: ${
          styles.footer?.backgroundColor || "#2D3748"
        } !important;
        color: ${styles.footer?.textColor || "#E2E8F0"} !important;
      }

      footer * {
        color: ${styles.footer?.textColor || "#E2E8F0"} !important;
      }

      /* PAGE */
      body {
        background-color: ${
          styles.page?.backgroundColor || "#FFFFFF"
        } !important;
        color: ${styles.page?.textColor || "#333333"} !important;
      }

      /* Couleur primaire (utilisée partout sur le site) */
      .bg-\\[\\#5d6e64\\],
      .text-\\[\\#5d6e64\\],
      .border-\\[\\#5d6e64\\],
      .hover\\:bg-\\[\\#5d6e64\\]:hover,
      .hover\\:text-\\[\\#5d6e64\\]:hover,
      .hover\\:border-\\[\\#5d6e64\\]:hover {
        --primary-color: ${styles.page?.primaryColor || "#5d6e64"};
      }

      .bg-\\[\\#5d6e64\\] {
        background-color: var(--primary-color) !important;
      }

      .text-\\[\\#5d6e64\\] {
        color: var(--primary-color) !important;
      }

      .border-\\[\\#5d6e64\\] {
        border-color: var(--primary-color) !important;
      }

      .hover\\:bg-\\[\\#5d6e64\\]:hover {
        background-color: var(--primary-color) !important;
      }

      .hover\\:text-\\[\\#5d6e64\\]:hover {
        color: var(--primary-color) !important;
      }

      /* POLICES */
      h1, h2, h3, h4, h5, h6, .font-serif {
        font-family: ${styles.fonts?.headingFont || "serif"} !important;
      }

      body, p, span, div, .font-sans {
        font-family: ${styles.fonts?.bodyFont || "sans-serif"} !important;
      }

      /* BOUTONS PRINCIPAUX */
      button[class*="bg-[#5d6e64]"],
      a[class*="bg-[#5d6e64]"],
      .btn-primary {
        background-color: ${
          styles.buttons?.primaryBgColor || "#5d6e64"
        } !important;
        color: ${styles.buttons?.primaryTextColor || "#FFFFFF"} !important;
      }

      button[class*="bg-[#5d6e64]"]:hover,
      a[class*="bg-[#5d6e64]"]:hover,
      .btn-primary:hover {
        background-color: ${
          styles.buttons?.primaryHoverBgColor || "#4a5850"
        } !important;
      }

      /* Couleur hover pour #4a5850 */
      .hover\\:bg-\\[\\#4a5850\\]:hover {
        background-color: ${
          styles.buttons?.primaryHoverBgColor || "#4a5850"
        } !important;
      }
    `;

    styleElement.textContent = css;

    // Supprimer l'ancien style s'il existe
    const existingStyle = document.getElementById("dynamic-custom-styles");
    if (existingStyle) {
      existingStyle.remove();
    }

    // Ajouter le nouveau style dans le <head>
    document.head.appendChild(styleElement);

    // Nettoyer lors du démontage du composant
    return () => {
      const style = document.getElementById("dynamic-custom-styles");
      if (style) {
        style.remove();
      }
    };
  }, [settings, loading]);

  // Ce composant ne rend rien visuellement
  return null;
}

/**
 * ============================================
 * GUIDE D'UTILISATION
 * ============================================
 *
 * 1. INTÉGRATION DANS L'APPLICATION :
 *
 *    Dans src/app/layout.js, ajoutez le composant :
 *
 *    ```jsx
 *    import DynamicStyles from '@/components/DynamicStyles';
 *
 *    export default function RootLayout({ children }) {
 *      return (
 *        <html>
 *          <body>
 *            <DynamicStyles />
 *            {children}
 *          </body>
 *        </html>
 *      );
 *    }
 *    ```
 *
 * 2. COMMENT ÇA FONCTIONNE :
 *    - Le composant charge les paramètres depuis Firestore via useSettings()
 *    - Il génère du CSS dynamique basé sur customStyles
 *    - Il injecte ce CSS dans une balise <style> dans le <head>
 *    - Les styles sont appliqués avec !important pour surcharger Tailwind
 *
 * 3. STYLES APPLIQUÉS :
 *    - Header : backgroundColor, textColor
 *    - Footer : backgroundColor, textColor
 *    - Page : backgroundColor, primaryColor
 *    - Polices : headingFont, bodyFont
 *    - Boutons : primaryBgColor, primaryTextColor, primaryHoverBgColor
 *
 * 4. MODIFICATION :
 *    - Les utilisateurs modifient les styles dans /admin/settings
 *    - Les changements sont sauvegardés dans Firestore
 *    - DynamicStyles se recharge automatiquement
 *    - Les styles sont appliqués instantanément
 *
 * ============================================
 */
