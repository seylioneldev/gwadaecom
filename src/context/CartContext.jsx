"use client"

import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Création du Context
// Il sera utilisé par les autres composants pour accéder aux données.
const CartContext = createContext();

// 2. Le Provider (Le "fournisseur" de données)
export const CartProvider = ({ children }) => {
  // État local du panier. Le panier est un tableau d'objets (produits)
  const [cart, setCart] = useState([]);
  
  // État pour gérer l'ouverture/fermeture du panneau latéral du panier
  const [isCartOpen, setIsCartOpen] = useState(false);

  // =======================================================
  // PERSISTANCE : Charger/Sauvegarder le panier dans localStorage
  // =======================================================

  // Charge le panier au démarrage de l'application
  useEffect(() => {
    // Ce code s'exécute uniquement côté client (dans le navigateur)
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('vivi-et-margot-cart');
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (e) {
          console.error("Erreur de parsing du panier stocké:", e);
          setCart([]); // Réinitialise si le stockage est corrompu
        }
      }
    }
  }, []); // [] signifie que ce code ne s'exécute qu'une seule fois au chargement.

  // Sauvegarde le panier dès qu'il change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('vivi-et-margot-cart', JSON.stringify(cart));
    }
  }, [cart]); // [cart] signifie que ce code s'exécute à chaque modification du panier.

  // =======================================================
  // FONCTIONS DU PANIER
  // =======================================================

  // Fonction pour ajouter un produit au panier
  const addItem = (product, quantity = 1) => {
    // Vérifie si le produit est déjà dans le panier
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
      // Si oui, met à jour la quantité
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      // Si non, ajoute le nouveau produit
      setCart([...cart, { ...product, quantity }]);
    }
    // Ouvre le panneau du panier après l'ajout
    setIsCartOpen(true);
  };

  // Fonction pour supprimer un produit complètement
  const removeItem = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  // Fonction pour mettre à jour la quantité
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(productId);
      return;
    }
    setCart(cart.map(item =>
      item.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };
  
  // Fonction pour calculer le total des articles (nombre d'articles, pas le prix)
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  // Fonction pour calculer le prix total
  const totalPrice = cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0).toFixed(2);


  // Objet qui sera partagé avec les composants consommateurs
  const contextValue = {
    cart,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    isCartOpen,
    setIsCartOpen,
  };

  // Le 'children' est l'application entière qui peut maintenant utiliser le contexte
  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// 3. Hook personnalisé pour l'utiliser facilement
// N'importe quel composant peut appeler 'useCart()'
export const useCart = () => {
  return useContext(CartContext);
};