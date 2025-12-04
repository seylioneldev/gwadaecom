/**
 * PAGE : Fiche Produit Dynamique
 * ===============================
 *
 * Affiche les détails d'un produit spécifique.
 * Récupère les données depuis Firestore.
 *
 * 📄 FICHIER MODIFIÉ : src/app/products/[id]/page.js
 * DATE : 2025-11-30
 *
 * CHANGEMENT : Remplace import des données statiques par le hook useProduct
 */

"use client";

import Header from "../../../components/layout/Header";
import Footer from "../../../components/layout/Footer";
import Price from "@/components/Price";
import { ChevronRight, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "../../../context/CartContext";
import { useParams } from "next/navigation";
import { useProduct } from "@/hooks/useProducts"; // Nouveau : récupère depuis Firestore

function getStockStatus(stock) {
  if (typeof stock !== "number" || Number.isNaN(stock) || stock < 0) {
    return {
      label: "En stock",
      containerClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
      dotClass: "bg-emerald-500",
    };
  }

  if (stock === 0) {
    return {
      label: "Rupture",
      containerClass: "bg-gray-900 text-white border-gray-900",
      dotClass: "bg-white",
    };
  }

  if (stock <= 10) {
    return {
      label: "Bientôt épuisé",
      containerClass: "bg-amber-50 text-amber-700 border-amber-200",
      dotClass: "bg-amber-500",
    };
  }

  return {
    label: "En stock",
    containerClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotClass: "bg-emerald-500",
  };
}

export default function ProductPage() {
  // Récupération des outils du panier
  const { addItem, totalItems } = useCart();

  // État local pour gérer la quantité choisie par l'utilisateur
  const [quantity, setQuantity] = useState(1);
  const [quantityAdjusted, setQuantityAdjusted] = useState(false);

  // Récupération de l'ID depuis l'URL
  const params = useParams();
  const id = params?.id;

  // Récupération du produit depuis Firestore
  const { product, loading, error } = useProduct(id);

  // Affichage du chargement
  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-500 text-sm tracking-wider">
          Chargement du produit...
        </p>
      </main>
    );
  }

  // Affichage des erreurs
  if (error) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-red-500 text-sm">Erreur : {error}</p>
      </main>
    );
  }

  // Si le produit n'existe pas
  if (!product) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-2xl font-serif text-gray-800 mb-4">
            Produit introuvable
          </h1>
          <p className="text-gray-500 mb-8">
            Ce produit n'existe pas ou a été supprimé.
          </p>
          <Link
            href="/"
            className="text-[#5d6e64] underline text-sm tracking-wider"
          >
            Retour à l'accueil
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  // Fonction déclenchée au clic sur "Add to Cart"
  const handleAddToCart = () => {
    if (isOutOfStock) {
      return;
    }

    let safeQuantity = quantity;

    if (availableStock !== null && availableStock > 0) {
      safeQuantity = Math.min(quantity, availableStock);
    }

    addItem(product, safeQuantity);
  };

  const hasNumericStock =
    typeof product.stock === "number" && !Number.isNaN(product.stock);
  const stockValue = hasNumericStock ? product.stock : null;
  const availableStock =
    stockValue !== null ? Math.max(stockValue - 1, 0) : null;
  const isOutOfStock = availableStock !== null && availableStock <= 0;

  // Source unique de vérité pour le badge : on utilise le stock vendable quand il est connu,
  // sinon on retombe sur la valeur brute (ou "En stock" si aucune info).
  const stockLabelSource =
    availableStock !== null ? availableStock : stockValue;
  const stockStatus = getStockStatus(stockLabelSource);

  const handleQuantityChange = (value) => {
    if (!Number.isFinite(value)) {
      setQuantity(1);
      setQuantityAdjusted(false);
      return;
    }

    let next = Math.max(1, value);
    let adjusted = false;

    if (
      availableStock !== null &&
      availableStock > 0 &&
      next > availableStock
    ) {
      next = availableStock;
      adjusted = true;
    }

    setQuantity(next);
    setQuantityAdjusted(adjusted);
  };

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Fil d'ariane */}
      <div className="max-w-7xl mx-auto px-6 py-4 text-[10px] uppercase tracking-widest text-gray-500 flex items-center gap-2">
        <Link href="/">Home</Link> <ChevronRight size={10} />
        {/* On affiche la catégorie du produit trouvé */}
        <span>{product.category}</span> <ChevronRight size={10} />
        <span className="text-gray-800 font-medium">{product.name}</span>
      </div>

      {/* Zone principale du produit */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        {/* COLONNE GAUCHE : Image */}
        <div className="aspect-[4/5] w-full relative overflow-hidden">
          {/* Si c'est une URL d'image */}
          {product.imageUrl?.startsWith("http") ||
          product.image?.startsWith("http") ? (
            <img
              src={product.imageUrl || product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            /* Si c'est une couleur Tailwind */
            <div
              className={`w-full h-full ${
                product.imageUrl || product.image || "bg-gray-100"
              } flex items-center justify-center text-gray-400`}
            >
              <span className="uppercase tracking-widest text-xs">
                Photo : {product.name}
              </span>
            </div>
          )}
        </div>

        {/* COLONNE DROITE : Détails et Actions */}
        <div className="flex flex-col justify-center">
          <h1 className="font-serif text-3xl md:text-4xl text-gray-800 mb-2">
            {product.name}
          </h1>
          <Price
            amount={product.price}
            className="text-lg text-gray-600 mb-6 font-light"
          />

          <div className="mb-4">
            <span
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] border ${stockStatus.containerClass}`}
            >
              <span
                className={`w-2 h-2 rounded-full ${stockStatus.dotClass}`}
              ></span>
              {stockStatus.label}
            </span>
          </div>

          <p className="text-xs leading-relaxed text-gray-500 mb-8 border-b border-gray-100 pb-8">
            {product.description}
          </p>

          {/* Sélecteur de Quantité */}
          {!isOutOfStock && (
            <div className="flex flex-col gap-2 mb-8">
              <div className="flex items-center gap-4">
                <span className="text-xs uppercase tracking-widest text-gray-500">
                  Quantity
                </span>
                <div className="flex items-center border border-gray-300">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="p-2 hover:bg-gray-100 text-gray-600"
                  >
                    <Minus size={14} />
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={availableStock !== null ? availableStock : undefined}
                    value={quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value, 10);
                      if (Number.isNaN(value)) {
                        setQuantity(1);
                        setQuantityAdjusted(false);
                        return;
                      }
                      handleQuantityChange(value);
                    }}
                    className="w-16 text-center text-sm font-medium px-2 py-1 border-l border-r border-gray-300 outline-none"
                  />
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="p-2 hover:bg-gray-100 text-gray-600"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              {quantityAdjusted && (
                <p className="text-[11px] text-amber-700">
                  Quantité ajustée au stock maximal disponible.
                </p>
              )}
            </div>
          )}

          {/* Bouton d'ajout */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`py-4 px-8 uppercase tracking-[0.2em] text-xs transition w-full md:w-auto ${
              isOutOfStock
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#5d6e64] text-white hover:bg-[#4a5850]"
            }`}
          >
            {isOutOfStock ? "Indisponible" : `Add to Cart (${totalItems})`}
          </button>
        </div>
      </div>

      <Footer />
    </main>
  );
}
