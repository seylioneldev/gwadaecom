// ==========================================================
// FICHIER : layout.js (Le SQUELETTE HTML de toute l'application)
// ==========================================================
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// 1. IMPORT DES CONTEXTES ET COMPOSANTS
import { CartProvider } from "../context/CartContext";
import { AuthProvider } from "../context/AuthContext"; // Authentification Firebase
import { SettingsProvider } from "../context/SettingsContext"; // Paramètres du site
import SideCart from "../components/layout/SideCart";
import cmsConfig from "../../cms.config";
import { adminDb } from "@/lib/firebase-admin";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

async function getServerSettings() {
  if (!adminDb) {
    console.warn(
      "⚠️ adminDb non initialisé, utilisation des paramètres par défaut pour le thème."
    );
    return cmsConfig.defaultSettings;
  }

  try {
    const docRef = adminDb
      .collection(cmsConfig.collections.settings)
      .doc("general");
    const snapshot = await docRef.get();

    if (snapshot.exists) {
      return snapshot.data();
    }

    return cmsConfig.defaultSettings;
  } catch (error) {
    console.error(
      "Erreur lors du chargement des paramètres serveur pour le thème:",
      error
    );
    return cmsConfig.defaultSettings;
  }
}

function generateCustomStylesCss(customStyles) {
  const styles = customStyles || cmsConfig.defaultSettings.customStyles;

  if (!styles) return "";

  return `
      /* ========================================
         STYLES PERSONNALISÉS DEPUIS L'ADMIN (SSR)
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
}

export const metadata = {
  title: "Les Bijoux de Guadeloupe - Bijoux Artisanaux de Guadeloupe",
  description:
    "Boutique en ligne de bijoux artisanaux authentiques de Guadeloupe. Découvrez notre collection unique.",
};

export default async function RootLayout({ children }) {
  const serverSettings = await getServerSettings();

  // Nettoyer les données pour qu'elles soient sérialisables (timestamps, etc.)
  const safeSettings = JSON.parse(JSON.stringify(serverSettings));
  const css = generateCustomStylesCss(safeSettings?.customStyles);

  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <style
          id="dynamic-custom-styles"
          dangerouslySetInnerHTML={{ __html: css }}
        />

        {/* Authentification Firebase (enveloppe tout) */}
        <AuthProvider>
          {/* Paramètres du site (nom, configuration...) */}
          <SettingsProvider initialSettings={safeSettings}>
            {/* Le Fournisseur de données (Panier) */}
            <CartProvider>
              {/* Le contenu de la page (Accueil, Produit...) */}
              {children}

              {/* LE PANNEAU LATÉRAL (Il doit être ici pour s'afficher par-dessus le reste) */}
              <SideCart />
            </CartProvider>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
