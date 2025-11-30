/**
 * HOOK PERSONNALISÉ : useProducts
 * ================================
 *
 * Ce hook récupère les produits depuis Firestore en temps réel.
 * Il remplace l'ancien système avec src/data/products.js
 *
 * 🆕 NOUVEAU FICHIER CRÉÉ : src/hooks/useProducts.js
 * DATE : 2025-11-30
 *
 * UTILISATION :
 * ```jsx
 * import { useProducts } from '@/hooks/useProducts';
 *
 * function MaPage() {
 *   const { products, loading, error } = useProducts();
 *
 *   if (loading) return <p>Chargement...</p>;
 *   if (error) return <p>Erreur : {error}</p>;
 *
 *   return <div>{products.map(p => ...)}</div>;
 * }
 * ```
 */

"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

/**
 * Hook pour récupérer tous les produits depuis Firestore
 *
 * @returns {Object} - { products: Array, loading: Boolean, error: String|null }
 */
export function useProducts() {
  const [products, setProducts] = useState([]); // Liste des produits
  const [loading, setLoading] = useState(true); // État de chargement
  const [error, setError] = useState(null); // Message d'erreur éventuel

  useEffect(() => {
    /**
     * Fonction pour récupérer les produits depuis Firestore
     * - Récupère la collection "products"
     * - Trie par date de création (les plus récents en premier)
     * - Transforme les documents Firestore en objets JavaScript
     */
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Créer une requête pour récupérer tous les produits triés par date de création
        const productsQuery = query(
          collection(db, "products"),
          orderBy("createdAt", "desc") // Les plus récents en premier
        );

        // Exécuter la requête
        const querySnapshot = await getDocs(productsQuery);

        // Transformer les documents en tableau d'objets
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id, // ID unique du document Firestore
          ...doc.data() // Toutes les données du produit (name, price, etc.)
        }));

        setProducts(productsData);
      } catch (err) {
        console.error("Erreur lors de la récupération des produits:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // [] = s'exécute une seule fois au montage du composant

  return { products, loading, error };
}

/**
 * Hook pour récupérer les produits d'une catégorie spécifique
 *
 * @param {String} categorySlug - Le slug de la catégorie (ex: "Kitchen", "Baskets")
 * @returns {Object} - { products: Array, loading: Boolean, error: String|null }
 */
export function useProductsByCategory(categorySlug) {
  const { products, loading, error } = useProducts();

  // Filtre les produits par catégorie (côté client)
  const filteredProducts = products.filter(
    product => product.category?.toLowerCase() === categorySlug?.toLowerCase()
  );

  return {
    products: filteredProducts,
    loading,
    error
  };
}

/**
 * Hook pour récupérer un produit spécifique par son ID
 *
 * @param {String} productId - L'ID du produit à récupérer
 * @returns {Object} - { product: Object|null, loading: Boolean, error: String|null }
 */
export function useProduct(productId) {
  const { products, loading, error } = useProducts();

  // Trouve le produit correspondant à l'ID
  const product = products.find(p => p.id === productId);

  return {
    product: product || null,
    loading,
    error
  };
}

/**
 * ============================================
 * GUIDE D'UTILISATION
 * ============================================
 *
 * 1. Récupérer tous les produits :
 *    const { products, loading, error } = useProducts();
 *
 * 2. Récupérer les produits d'une catégorie :
 *    const { products, loading, error } = useProductsByCategory("Kitchen");
 *
 * 3. Récupérer un produit spécifique :
 *    const { product, loading, error } = useProduct("abc123");
 *
 * ============================================
 */
