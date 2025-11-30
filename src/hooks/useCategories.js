/**
 * HOOK PERSONNALISÉ : useCategories
 * ==================================
 *
 * Ce hook récupère les catégories depuis Firestore en temps réel.
 * Utilisé pour afficher les catégories dans le menu de navigation.
 *
 * 🆕 NOUVEAU FICHIER CRÉÉ : src/hooks/useCategories.js
 * DATE : 2025-11-30
 *
 * UTILISATION :
 * ```jsx
 * import { useCategories } from '@/hooks/useCategories';
 *
 * function Header() {
 *   const { categories, loading, error } = useCategories();
 *
 *   return (
 *     <nav>
 *       {categories.map(cat => (
 *         <Link href={`/category/${cat.slug}`}>{cat.name}</Link>
 *       ))}
 *     </nav>
 *   );
 * }
 * ```
 */

"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, where, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import cmsConfig from '../../cms.config';

/**
 * Hook pour récupérer toutes les catégories depuis Firestore
 *
 * @returns {Object} - { categories: Array, loading: Boolean, error: String|null }
 */
export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    /**
     * Fonction pour récupérer les catégories depuis Firestore
     * - Récupère la collection "categories"
     * - Trie par ordre d'affichage
     * - Filtre uniquement les catégories visibles
     */
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        // Créer une requête pour récupérer les catégories triées par ordre
        const categoriesQuery = query(
          collection(db, cmsConfig.collections.categories),
          where("visible", "==", true), // Seulement les catégories visibles
          orderBy("order", "asc") // Tri par ordre croissant
        );

        // Exécuter la requête
        const querySnapshot = await getDocs(categoriesQuery);

        // Transformer les documents en tableau d'objets
        const categoriesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setCategories(categoriesData);
      } catch (err) {
        console.error("Erreur lors de la récupération des catégories:", err);
        setError(err.message);

        // Si aucune catégorie n'existe, utiliser les catégories par défaut
        if (err.message.includes("indexes")) {
          console.warn("Index Firestore manquant. Création d'un index composite requis.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
}

/**
 * Hook pour récupérer TOUTES les catégories (y compris celles masquées)
 * Utile pour l'admin
 *
 * @returns {Object} - { categories: Array, loading: Boolean, error: String|null }
 */
export function useAllCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        const categoriesQuery = query(
          collection(db, cmsConfig.collections.categories),
          orderBy("order", "asc")
        );

        const querySnapshot = await getDocs(categoriesQuery);
        const categoriesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setCategories(categoriesData);
      } catch (err) {
        console.error("Erreur lors de la récupération des catégories:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllCategories();
  }, []);

  return { categories, loading, error, refetch: () => {} };
}

/**
 * Fonction pour ajouter une nouvelle catégorie
 *
 * @param {Object} categoryData - Données de la catégorie
 * @returns {Promise<String>} - ID de la catégorie créée
 */
export async function addCategory(categoryData) {
  try {
    const docRef = await addDoc(collection(db, cmsConfig.collections.categories), {
      name: categoryData.name,
      slug: categoryData.slug || categoryData.name.toLowerCase().replace(/\s+/g, '-'),
      order: categoryData.order || 999,
      visible: categoryData.visible !== undefined ? categoryData.visible : true,
      description: categoryData.description || "",
      createdAt: new Date()
    });

    return docRef.id;
  } catch (error) {
    console.error("Erreur lors de l'ajout de la catégorie:", error);
    throw error;
  }
}

/**
 * Fonction pour mettre à jour une catégorie existante
 *
 * @param {String} categoryId - ID de la catégorie
 * @param {Object} updates - Données à mettre à jour
 */
export async function updateCategory(categoryId, updates) {
  try {
    const categoryRef = doc(db, cmsConfig.collections.categories, categoryId);
    await updateDoc(categoryRef, {
      ...updates,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la catégorie:", error);
    throw error;
  }
}

/**
 * Fonction pour supprimer une catégorie
 *
 * @param {String} categoryId - ID de la catégorie à supprimer
 */
export async function deleteCategory(categoryId) {
  try {
    const categoryRef = doc(db, cmsConfig.collections.categories, categoryId);
    await deleteDoc(categoryRef);
  } catch (error) {
    console.error("Erreur lors de la suppression de la catégorie:", error);
    throw error;
  }
}

/**
 * ============================================
 * GUIDE D'UTILISATION
 * ============================================
 *
 * 1. Récupérer les catégories visibles (pour le menu) :
 *    const { categories, loading, error } = useCategories();
 *
 * 2. Récupérer toutes les catégories (pour l'admin) :
 *    const { categories, loading, error } = useAllCategories();
 *
 * 3. Ajouter une catégorie :
 *    await addCategory({ name: "Nouvelle catégorie", order: 5 });
 *
 * 4. Modifier une catégorie :
 *    await updateCategory(categoryId, { name: "Nom modifié", visible: false });
 *
 * 5. Supprimer une catégorie :
 *    await deleteCategory(categoryId);
 *
 * ============================================
 */
