"use client"; 

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

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

  // Mémoriser les fonctions pour éviter les re-renders inutiles
  const addItem = useCallback((product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      } else {
        return [...prevCart, { ...product, quantity }];
      }
    });
    setIsCartOpen(true);
  }, []);

  const removeItem = useCallback((productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, newQuantity) => {
    if (newQuantity <= 0) {
      setCart(prevCart => prevCart.filter(item => item.id !== productId));
      return;
    }
    setCart(prevCart => prevCart.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item));
  }, []);

  // Vider le panier
  const clearCart = useCallback(() => {
    setCart([]);
  }, []);
  
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