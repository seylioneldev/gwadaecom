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
import DynamicStyles from "../components/DynamicStyles"; // Styles CSS personnalisés depuis l'admin

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Les Bijoux de Guadeloupe - Bijoux Artisanaux de Guadeloupe",
  description:
    "Boutique en ligne de bijoux artisanaux authentiques de Guadeloupe. Découvrez notre collection unique.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {/* Authentification Firebase (enveloppe tout) */}
        <AuthProvider>
          {/* Paramètres du site (nom, configuration...) */}
          <SettingsProvider>
            {/* Le Fournisseur de données (Panier) */}
            <CartProvider>
              {/* Styles CSS personnalisés depuis l'admin */}
              <DynamicStyles />

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
