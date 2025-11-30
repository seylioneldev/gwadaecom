// ==========================================================
// FICHIER : layout.js (Le SQUELETTE HTML de toute l'application)
// ==========================================================
import { Geist, Geist_Mono } from "next/font/google"; 
import "./globals.css"; 

// 1. IMPORT DU CONTEXTE ET DU COMPOSANT PANIER
import { CartProvider } from "../context/CartContext"; 
import SideCart from "../components/layout/SideCart"; // <--- IL MANQUAIT CETTE LIGNE !

const geistSans = Geist({
  variable: "--font-geist-sans", 
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono", 
  subsets: ["latin"],
});

export const metadata = {
  title: "Vivi et Margot - Votre Boutique de Lifestyle Français", 
  description: "Boutique en ligne pour les paniers, savons et articles textiles de style français authentique.", 
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        
        {/* Le Fournisseur de données (Panier) enveloppe tout */}
        <CartProvider>
          
          {/* Le contenu de la page (Accueil, Produit...) */}
          {children} 

          {/* 2. LE PANNEAU LATÉRAL (Il doit être ici pour s'afficher par-dessus le reste) */}
          <SideCart /> 

        </CartProvider>
      
      </body>
    </html>
  );
}