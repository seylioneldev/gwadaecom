"use client"; // Le panneau est interactif (boutons, fermeture)

import { X, Trash2, ShoppingBasket, Minus, Plus } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import Link from 'next/link';

export default function SideCart() {
  // Récupération des données et des fonctions de contrôle du contexte
  const { 
    cart, 
    totalItems, 
    totalPrice, 
    removeItem, 
    updateQuantity, 
    isCartOpen, 
    setIsCartOpen 
  } = useCart();
  
  // Fonction de fermeture pour le bouton X et l'overlay
  const closeCart = () => setIsCartOpen(false);

  return (
    <>
      {/* 1. OVERLAY (Arrière-plan sombre et cliquable) */}
      {/* S'affiche uniquement si isCartOpen est true */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300" 
          onClick={closeCart}
        ></div>
      )}

      {/* 2. PANNEAU PRINCIPAL DU PANIER */}
      <div 
        className={`
          fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-2xl z-50 
          transform transition-transform duration-500
          ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} // Gère l'animation de glissement
        `}
      >
        <div className="flex flex-col h-full">
          
          {/* A. Entête du Panneau */}
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#f0f0f0]">
            <h2 className="font-serif text-xl tracking-wider text-gray-800">
              Votre Panier ({totalItems})
            </h2>
            <button 
              onClick={closeCart} 
              className="text-gray-500 hover:text-gray-800 transition p-1"
            >
              <X size={20} />
            </button>
          </div>

          {/* B. Corps du Panier (Liste des Articles) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {cart.length === 0 ? (
              // Message si le panier est vide
              <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center py-20">
                <ShoppingBasket size={48} className="mb-4 text-gray-300"/>
                <p className="text-sm tracking-wide">Votre panier est vide.</p>
              </div>
            ) : (
              // Liste des produits
              cart.map(item => (
                <div key={item.id} className="flex items-center space-x-4 border-b border-gray-100 pb-4">
                  
                  {/* Image/Placeholder */}
                  {/* L'image est simulée par la couleur de fond du produit */}
                  <div className={`w-20 h-24 ${item.image} flex-shrink-0 border border-gray-200`}></div>
                  
                  {/* Détails du produit */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.id}`} onClick={closeCart} className="font-serif text-sm text-gray-800 hover:text-[#5d6e64]">
                      {item.name}
                    </Link>
                    <p className="text-xs text-gray-500 my-1">${parseFloat(item.price).toFixed(2)}</p>
                    
                    {/* Contrôle de Quantité (connecté à updateQuantity) */}
                    <div className="flex items-center mt-2 border border-gray-200 w-fit">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 text-gray-500 hover:bg-gray-100"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="px-3 text-xs">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 text-gray-500 hover:bg-gray-100"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Bouton Supprimer (connecté à removeItem) */}
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-500 transition p-2 flex-shrink-0"
                    title="Supprimer l'article"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* C. Pied de Panneau (Totaux et Boutons d'Action) */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex justify-between font-bold text-lg mb-4">
              <span>Total :</span>
              <span>${totalPrice}</span>
            </div>
            
            {/* Bouton pour aller à la page de Checkout (désactivé si panier vide) */}
            <button 
              onClick={closeCart}
              className={`w-full py-3 text-sm uppercase tracking-widest text-white transition duration-300
                ${cart.length === 0 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-[#5d6e64] hover:bg-[#4a5850]'
                }`
              }
              disabled={cart.length === 0}
            >
              Checkout
            </button>
            
            <button onClick={closeCart} className="w-full mt-2 text-xs text-gray-500 hover:underline">
              Continuer mes achats
            </button>
          </div>
        </div>
      </div>
    </>
  );
}