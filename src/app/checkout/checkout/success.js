"use client";

import Header from "../../../components/layout/Header";
import Footer from "../../../components/layout/Footer";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

// ==========================================================
// FICHIER : src/app/checkout/success/page.js
// RÔLE : Affiche la page de confirmation après un paiement réussi.
//        Informe l'utilisateur que sa commande est validée.
// ==========================================================

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. Entête du site */}
      <Header />

      {/* 2. Contenu principal de la page de succès */}
      <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
        
        {/* Icône de validation verte */}
        <CheckCircle size={64} className="text-[#5d6e64] mb-6" />
        
        {/* Titre principal */}
        <h1 className="font-serif text-4xl text-gray-800 mb-4">Merci pour votre commande !</h1>
        
        {/* Message de confirmation */}
        <p className="text-gray-600 mb-8 max-w-md">
          Votre commande a été confirmée. Vous recevrez bientôt un email de confirmation avec les détails de livraison.
        </p>
        
        {/* Bouton pour retourner à l'accueil */}
        <Link href="/" className="border border-[#5d6e64] text-[#5d6e64] px-8 py-3 text-xs uppercase tracking-widest hover:bg-[#5d6e64] hover:text-white transition">
          Retour à la boutique
        </Link>
      </div>

      {/* 3. Pied de page */}
      <Footer />
    </main>
  );
}