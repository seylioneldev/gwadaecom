"use client";

import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { useCart } from "../../context/CartContext";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Pour rediriger après le paiement

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const handlePayment = (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    setIsProcessing(true);

    // Simulation d'un délai réseau (2 secondes)
    setTimeout(() => {
      clearCart(); // On vide le panier
      router.push("/checkout/success"); // On redirige vers la page de succès
    }, 2000);
  };

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="flex flex-col items-center justify-center py-40">
          <h1 className="text-2xl font-serif text-gray-800 mb-4">Votre panier est vide</h1>
          <a href="/" className="text-[#5d6e64] hover:underline">Retourner à la boutique</a>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="font-serif text-3xl text-gray-800 mb-10 text-center">Finaliser la Commande</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* COLONNE GAUCHE : Formulaire */}
          <div>
            <h2 className="text-sm uppercase tracking-widest text-gray-500 mb-6 border-b pb-2">Informations de livraison</h2>
            <form onSubmit={handlePayment} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input required type="text" placeholder="Prénom" className="border border-gray-300 p-3 w-full text-sm outline-none focus:border-[#5d6e64]" />
                <input required type="text" placeholder="Nom" className="border border-gray-300 p-3 w-full text-sm outline-none focus:border-[#5d6e64]" />
              </div>
              <input required type="email" placeholder="Email" className="border border-gray-300 p-3 w-full text-sm outline-none focus:border-[#5d6e64]" />
              <input required type="text" placeholder="Adresse" className="border border-gray-300 p-3 w-full text-sm outline-none focus:border-[#5d6e64]" />
              <div className="grid grid-cols-2 gap-4">
                <input required type="text" placeholder="Ville" className="border border-gray-300 p-3 w-full text-sm outline-none focus:border-[#5d6e64]" />
                <input required type="text" placeholder="Code Postal" className="border border-gray-300 p-3 w-full text-sm outline-none focus:border-[#5d6e64]" />
              </div>

              <button 
                type="submit" 
                disabled={isProcessing}
                className="w-full bg-[#5d6e64] text-white py-4 uppercase tracking-widest text-xs hover:bg-[#4a5850] transition mt-6 disabled:opacity-50"
              >
                {isProcessing ? "Traitement en cours..." : `Payer $${totalPrice}`}
              </button>
            </form>
          </div>

          {/* COLONNE DROITE : Résumé */}
          <div className="bg-gray-50 p-8 h-fit">
            <h2 className="text-sm uppercase tracking-widest text-gray-500 mb-6 border-b pb-2">Résumé de la commande</h2>
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200"></div> {/* Placeholder image */}
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-gray-500 text-xs">Qté: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-gray-600">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-lg text-gray-800">
              <span>Total</span>
              <span>${totalPrice}</span>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}