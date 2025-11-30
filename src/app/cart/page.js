/**
 * PAGE : Panier
 * ==============
 *
 * Page de visualisation du panier avec liste des produits,
 * gestion des quantités et passage de commande.
 *
 * 🆕 NOUVEAU FICHIER : src/app/cart/page.js
 * DATE : 2025-11-30
 */

"use client";

import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft, ArrowRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice } = useCart();
  const router = useRouter();

  /**
   * GESTION DES QUANTITÉS
   */
  const handleIncrease = (productId) => {
    const item = cart.find((item) => item.id === productId);
    if (item) {
      updateQuantity(productId, item.quantity + 1);
    }
  };

  const handleDecrease = (productId) => {
    const item = cart.find((item) => item.id === productId);
    if (item && item.quantity > 1) {
      updateQuantity(productId, item.quantity - 1);
    }
  };

  /**
   * PASSER COMMANDE
   */
  const handleCheckout = () => {
    router.push('/checkout');
  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">

          {/* En-tête */}
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition mb-4">
              <ArrowLeft size={16} />
              Continuer mes achats
            </Link>
            <h1 className="text-3xl font-serif text-gray-800 flex items-center gap-3">
              <ShoppingCart size={32} className="text-[#5d6e64]" />
              Mon Panier
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              {cart.length === 0 ? 'Votre panier est vide' : `${cart.length} article${cart.length > 1 ? 's' : ''} dans votre panier`}
            </p>
          </div>

          {/* Panier vide */}
          {cart.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <ShoppingCart size={64} className="text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-serif text-gray-800 mb-2">Votre panier est vide</h2>
              <p className="text-gray-500 mb-6">Découvrez nos produits et ajoutez-les à votre panier</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-[#5d6e64] text-white px-6 py-3 rounded hover:bg-[#4a5850] transition"
              >
                <ArrowLeft size={20} />
                Retour à l'accueil
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* LISTE DES PRODUITS */}
              <div className="lg:col-span-2 space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md p-6 flex items-center gap-6">

                    {/* Image du produit */}
                    <div className={`w-24 h-28 ${item.image} bg-cover bg-center rounded flex-shrink-0`}></div>

                    {/* Infos produit */}
                    <div className="flex-1">
                      <h3 className="text-lg font-serif text-gray-800 mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-500 mb-3">Prix unitaire : ${item.price}</p>

                      {/* Contrôle de quantité */}
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500">Quantité :</span>
                        <div className="flex items-center border border-gray-300 rounded">
                          <button
                            onClick={() => handleDecrease(item.id)}
                            disabled={item.quantity <= 1}
                            className="px-3 py-1 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-4 py-1 text-sm font-medium border-x border-gray-300">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleIncrease(item.id)}
                            className="px-3 py-1 hover:bg-gray-100 transition"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Prix total et suppression */}
                    <div className="text-right flex flex-col items-end gap-4">
                      <p className="text-xl font-bold text-gray-800">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800 transition"
                      >
                        <Trash2 size={16} />
                        Retirer
                      </button>
                    </div>

                  </div>
                ))}
              </div>

              {/* RÉCAPITULATIF */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                  <h2 className="text-xl font-serif text-gray-800 mb-6">Récapitulatif</h2>

                  {/* Détails */}
                  <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Sous-total</span>
                      <span className="font-medium text-gray-800">${getTotalPrice().toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Livraison</span>
                      <span className="text-gray-500 text-xs">Calculée à l'étape suivante</span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-lg font-semibold text-gray-800">Total</span>
                    <span className="text-2xl font-bold text-[#5d6e64]">${getTotalPrice().toFixed(2)}</span>
                  </div>

                  {/* Bouton Commander */}
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-[#5d6e64] text-white py-3 rounded font-medium hover:bg-[#4a5850] transition flex items-center justify-center gap-2"
                  >
                    Passer commande
                    <ArrowRight size={20} />
                  </button>

                  {/* Informations supplémentaires */}
                  <div className="mt-6 space-y-2">
                    <div className="flex items-start gap-2 text-xs text-gray-600">
                      <span className="text-green-600">✓</span>
                      <span>Livraison gratuite à partir de $50</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-gray-600">
                      <span className="text-green-600">✓</span>
                      <span>Retours gratuits sous 30 jours</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-gray-600">
                      <span className="text-green-600">✓</span>
                      <span>Paiement sécurisé</span>
                    </div>
                  </div>
                </div>

                {/* Lien continuer les achats (mobile) */}
                <Link
                  href="/"
                  className="w-full mt-4 border border-gray-300 text-gray-700 py-3 rounded font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={20} />
                  Continuer mes achats
                </Link>
              </div>

            </div>
          )}

        </div>
      </div>

      <Footer />
    </>
  );
}

/**
 * ============================================
 * GUIDE D'UTILISATION
 * ============================================
 *
 * ACCÈS : /cart
 *
 * FONCTIONNALITÉS :
 * - Affichage de tous les produits du panier
 * - Modification des quantités (+/-)
 * - Suppression d'articles
 * - Calcul du total en temps réel
 * - Bouton "Passer commande" → /checkout
 *
 * CONNEXIONS :
 * - Utilise CartContext pour la gestion du panier
 * - Header avec icône panier cliquable
 * - Footer standard
 *
 * ============================================
 */
