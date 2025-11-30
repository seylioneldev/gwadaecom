/**
 * PAGE ADMIN : Ajouter un Produit
 * =================================
 *
 * Formulaire pour ajouter un nouveau produit à Firestore.
 *
 * 🆕 NOUVEAU FICHIER CRÉÉ : src/app/admin/add-product/page.js
 * DATE : 2025-11-30
 *
 * FONCTIONNALITÉS :
 * - Formulaire complet avec tous les champs produit
 * - Validation du prix
 * - Sélection de catégorie dynamique depuis Firestore
 * - Support URL image ou couleur Tailwind
 * - Messages de succès/erreur
 * - Réinitialisation automatique après ajout
 */

"use client";

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useCategories } from '@/hooks/useCategories';
import cmsConfig from '../../../../cms.config';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function AddProductPage() {
  // Récupération des catégories pour le dropdown
  const { categories, loading: categoriesLoading } = useCategories();

  // États pour le formulaire
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [label, setLabel] = useState(""); // Badge optionnel (ex: "Sold Out", "New")

  // États pour les messages
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  /**
   * Afficher un message temporaire
   */
  const showMessage = (type, text) => {
    if (type === 'success') {
      setSuccessMessage(text);
      setTimeout(() => setSuccessMessage(""), 3000);
    } else {
      setError(text);
      setTimeout(() => setError(""), 3000);
    }
  };

  /**
   * AJOUTER UN PRODUIT À FIRESTORE
   */
  const handleAddProduct = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      // Validation du prix
      const priceNum = parseFloat(price);
      if (isNaN(priceNum) || priceNum <= 0) {
        showMessage('error', "Le prix doit être un nombre positif.");
        setIsSubmitting(false);
        return;
      }

      // Validation du nom
      if (!productName.trim()) {
        showMessage('error', "Le nom du produit est requis.");
        setIsSubmitting(false);
        return;
      }

      // Validation de la catégorie
      if (!category) {
        showMessage('error', "Veuillez sélectionner une catégorie.");
        setIsSubmitting(false);
        return;
      }

      // Ajout du produit à Firestore
      await addDoc(collection(db, cmsConfig.collections.products), {
        name: productName,
        price: priceNum,
        category: category,
        description: description || "",
        imageUrl: imageUrl || "bg-gray-200",
        label: label || "",
        createdAt: new Date()
      });

      showMessage('success', `Produit "${productName}" ajouté avec succès !`);

      // Réinitialisation du formulaire
      setProductName("");
      setPrice("");
      setCategory("");
      setDescription("");
      setImageUrl("");
      setLabel("");

    } catch (err) {
      showMessage('error', "Erreur lors de l'ajout du produit : " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">

        {/* En-tête */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin"
            className="p-2 hover:bg-gray-200 rounded-full transition"
            title="Retour au dashboard"
          >
            <ArrowLeft size={24} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-serif text-gray-800 mb-2">Ajouter un Produit</h1>
            <p className="text-sm text-gray-500">Créez un nouveau produit pour votre boutique</p>
          </div>
        </div>

        {/* Messages de succès/erreur */}
        {successMessage && (
          <div className="mb-6 p-4 rounded bg-green-100 text-green-800 border border-green-200">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 rounded bg-red-100 text-red-800 border border-red-200">
            {error}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleAddProduct} className="bg-white rounded-lg shadow-md p-8">

          <div className="space-y-6">

            {/* Nom du produit */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                Nom du produit *
              </label>
              <input
                type="text"
                required
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-[#5d6e64]"
                placeholder="Ex: Panier artisanal"
              />
            </div>

            {/* Prix et Catégorie */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Prix */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                  Prix (€) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-[#5d6e64]"
                  placeholder="Ex: 29.99"
                />
              </div>

              {/* Catégorie */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                  Catégorie *
                </label>
                <select
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-[#5d6e64] bg-white"
                  disabled={categoriesLoading}
                >
                  <option value="">-- Sélectionner une catégorie --</option>
                  {categoriesLoading ? (
                    <option disabled>Chargement...</option>
                  ) : (
                    categories.map(cat => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-[#5d6e64]"
                rows="4"
                placeholder="Description du produit..."
              />
            </div>

            {/* Image et Label */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image URL */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                  Image (URL ou couleur Tailwind)
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-[#5d6e64]"
                  placeholder="https://... ou bg-blue-200"
                />
                <p className="text-xs text-gray-500 mt-1">
                  URL complète ou classe Tailwind (ex: bg-gray-200)
                </p>
              </div>

              {/* Label */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                  Label (optionnel)
                </label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-[#5d6e64]"
                  placeholder="Ex: New, Sold Out"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Badge affiché sur l'image du produit
                </p>
              </div>
            </div>

          </div>

          {/* Boutons */}
          <div className="flex gap-4 mt-8 pt-6 border-t">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#5d6e64] text-white px-8 py-3 text-sm uppercase tracking-wider hover:bg-[#4a5850] transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={16} />
              {isSubmitting ? 'Ajout en cours...' : 'Ajouter le produit'}
            </button>

            <Link
              href="/admin"
              className="bg-gray-200 text-gray-700 px-8 py-3 text-sm uppercase tracking-wider hover:bg-gray-300 transition"
            >
              Annuler
            </Link>
          </div>

        </form>

        {/* Aide */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 Conseils</h3>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• <strong>Image :</strong> Utilisez une URL complète (https://...) ou une couleur Tailwind (bg-gray-200)</li>
            <li>• <strong>Prix :</strong> Entrez un nombre avec décimales (ex: 29.99)</li>
            <li>• <strong>Label :</strong> Optionnel. Affiche un badge sur l'image (ex: "New", "Sold Out")</li>
            <li>• <strong>Catégorie :</strong> Si aucune catégorie n'apparaît, créez-en dans "Gérer les Catégories"</li>
          </ul>
        </div>

      </div>
    </div>
  );
}

/**
 * ============================================
 * GUIDE D'UTILISATION
 * ============================================
 *
 * Cette page permet d'ajouter un nouveau produit.
 *
 * CHAMPS REQUIS :
 * - Nom du produit
 * - Prix
 * - Catégorie
 *
 * CHAMPS OPTIONNELS :
 * - Description
 * - Image (URL ou couleur Tailwind)
 * - Label (badge affiché sur l'image)
 *
 * ACCÈS : /admin/add-product
 *
 * ============================================
 */
