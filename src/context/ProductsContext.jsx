"use client";

import { createContext, useContext } from "react";

/**
 * CONTEXTE : Produits de la home
 * ==============================
 * Fourni la liste de produits affichée sur la page d'accueil.
 * Les données initiales sont chargées côté serveur (Firebase Admin)
 * dans le layout, puis passées via `initialProducts` pour éviter
 * le délai de chargement côté client.
 */
const ProductsContext = createContext(null);

export const ProductsProvider = ({ children, initialProducts }) => {
  const value = {
    products: Array.isArray(initialProducts) ? initialProducts : [],
    loading: false,
    error: null,
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useHomeProducts = () => {
  const ctx = useContext(ProductsContext);
  if (!ctx) {
    throw new Error(
      "useHomeProducts doit être utilisé dans un ProductsProvider"
    );
  }
  return ctx;
};
