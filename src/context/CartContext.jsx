"use client"; 

import React, { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // ... (useEffect pour charger/sauvegarder restent identiques)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('vivi-et-margot-cart');
      if (savedCart) {
        try { setCart(JSON.parse(savedCart)); } catch (e) { setCart([]); }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('vivi-et-margot-cart', JSON.stringify(cart));
    }
  }, [cart]);

  // ... (addItem, removeItem, updateQuantity restent identiques)
  const addItem = (product, quantity = 1) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item));
    } else {
      setCart([...cart, { ...product, quantity }]);
    }
    setIsCartOpen(true);
  };

  const removeItem = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) { removeItem(productId); return; }
    setCart(cart.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item));
  };

  // NOUVELLE FONCTION : Vider le panier
  const clearCart = () => {
    setCart([]);
  };
  
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0).toFixed(2);

  const contextValue = {
    cart,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart, // N'oublie pas d'ajouter la nouvelle fonction ici !
    isCartOpen,
    setIsCartOpen,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};