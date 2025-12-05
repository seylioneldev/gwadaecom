"use client";

import { createContext, useContext } from "react";

/**
 * CONTEXTE : Catégories de navigation
 * ==================================
 * - Fournit les catégories visibles pour le Header (menu principal).
 * - Les données initiales sont fournies par le serveur via `initialCategories`
 *   dans le layout racine, pour que le menu soit déjà rempli au premier rendu.
 */
const CategoriesContext = createContext(null);

export const CategoriesProvider = ({ children, initialCategories }) => {
  const value = {
    categories: Array.isArray(initialCategories) ? initialCategories : [],
    loading: false,
    error: null,
  };

  return (
    <CategoriesContext.Provider value={value}>
      {children}
    </CategoriesContext.Provider>
  );
};

export const useNavCategories = () => {
  const ctx = useContext(CategoriesContext);
  if (!ctx) {
    throw new Error(
      "useNavCategories doit être utilisé dans un CategoriesProvider"
    );
  }
  return ctx;
};
