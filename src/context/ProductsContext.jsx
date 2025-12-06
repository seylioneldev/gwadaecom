"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import cmsConfig from "../../cms.config";

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
  const hasInitialProducts =
    Array.isArray(initialProducts) && initialProducts.length > 0;

  const [products, setProducts] = useState(
    hasInitialProducts ? initialProducts : []
  );
  const [loading, setLoading] = useState(!hasInitialProducts);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const collectionName = cmsConfig.collections?.products || "products";

      const q = query(
        collection(db, collectionName),
        orderBy("createdAt", "desc"),
        limit(12)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const nextProducts = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setProducts(nextProducts);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error(
            "Erreur lors de l'écoute temps réel des produits pour la home:",
            err
          );
          setLoading(false);
          setError("Erreur lors de la mise à jour des produits");
        }
      );

      return () => {
        unsubscribe();
      };
    } catch (err) {
      console.error(
        "Erreur lors de la configuration du listener Firestore pour les produits de la home:",
        err
      );
      setError("Erreur lors de la mise à jour des produits");
      setLoading(false);
    }
  }, []);

  const value = {
    products,
    loading,
    error,
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
