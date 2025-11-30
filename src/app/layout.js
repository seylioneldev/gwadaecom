// ==========================================================
// FICHIER : layout.js (Le SQUELETTE HTML de toute l'application)
// RÔLE : Définit les balises <html> et <body>. Le contenu (Header, Footer, etc.)
//        est injecté via la variable {children}.
// ==========================================================
import { CartProvider } from "../context/CartContext";
import { Geist, Geist_Mono } from "next/font/google"; // Importe la police Geist (par défaut dans Next.js)
import "./globals.css"; // Importe les styles globaux (ton Tailwind CSS)

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// MÉTADONNÉES (Informations pour les moteurs de recherche - SEO)
export const metadata = {
  title: "Vivi et Margot - Votre Boutique de Lifestyle Français",
  description:
    "Boutique en ligne pour les paniers, savons et articles textiles de style français authentique.",
};

// COMPOSANT PRINCIPAL RootLayout
export default function RootLayout({ children }) {
  // Nous réintégrons le formatage original, mais avec tes valeurs.
  // Assure-toi que le 'return' commence directement sur la balise <html>
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
