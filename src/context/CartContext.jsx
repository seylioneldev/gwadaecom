"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // ... (useEffect pour charger/sauvegarder restent identiques)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("vivi-et-margot-cart");
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (e) {
          setCart([]);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("vivi-et-margot-cart", JSON.stringify(cart));
    }
  }, [cart]);

  // Mémoriser les fonctions pour éviter les re-renders inutiles
  const addItem = useCallback((product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);

      const hasNumericStock =
        typeof product.stock === "number" && !Number.isNaN(product.stock);
      const maxVendable = hasNumericStock
        ? Math.max(product.stock - 1, 0)
        : null;

      if (existingItem) {
        let nextQuantity = existingItem.quantity + quantity;

        if (maxVendable !== null) {
          nextQuantity = Math.min(nextQuantity, maxVendable);
        }

        if (nextQuantity <= 0) {
          return prevCart.filter((item) => item.id !== product.id);
        }

        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: nextQuantity } : item
        );
      } else {
        let initialQuantity = quantity;

        if (maxVendable !== null) {
          initialQuantity = Math.min(quantity, maxVendable);
        }

        if (initialQuantity <= 0) {
          return prevCart;
        }

        return [...prevCart, { ...product, quantity: initialQuantity }];
      }
    });
    setIsCartOpen(true);
  }, []);

  const removeItem = useCallback((productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, newQuantity) => {
    setCart((prevCart) => {
      if (newQuantity <= 0) {
        return prevCart.filter((item) => item.id !== productId);
      }

      return prevCart
        .map((item) => {
          if (item.id !== productId) {
            return item;
          }

          let next = newQuantity;

          const hasNumericStock =
            typeof item.stock === "number" && !Number.isNaN(item.stock);
          if (hasNumericStock) {
            const maxVendable = Math.max(item.stock - 1, 0);
            if (maxVendable <= 0) {
              return { ...item, quantity: 0 };
            }
            if (next > maxVendable) {
              next = maxVendable;
            }
          }

          if (next <= 0) {
            return { ...item, quantity: 0 };
          }

          return { ...item, quantity: next };
        })
        .filter((item) => item.quantity > 0);
    });
  }, []);

  // Vider le panier
  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart
    .reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0)
    .toFixed(2);

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
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
