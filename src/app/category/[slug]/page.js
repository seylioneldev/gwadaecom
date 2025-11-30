/**
 * PAGE : Catégorie Dynamique
 * ===========================
 *
 * Affiche tous les produits d'une catégorie spécifique.
 * Récupère les données depuis Firestore.
 *
 * 📄 FICHIER MODIFIÉ : src/app/category/[slug]/page.js
 * DATE : 2025-11-30
 *
 * CHANGEMENT : Remplace import des données statiques par le hook useProductsByCategory
 */

"use client";

import Header from "../../../components/layout/Header";
import Footer from "../../../components/layout/Footer";
import Link from 'next/link';
import { ChevronRight } from "lucide-react";
import { useParams } from 'next/navigation';
import { useProductsByCategory } from '@/hooks/useProducts'; // Nouveau : récupère depuis Firestore

export default function CategoryPage() {
  // Récupère le nom de la catégorie depuis l'URL (ex: "kitchen")
  const params = useParams();
  const slug = params?.slug;

  // Décoder l'URL (remplacer %20 par des espaces, etc.)
  const decodedSlug = slug ? decodeURIComponent(slug) : '';

  // Récupération des produits de cette catégorie depuis Firestore
  const { products: filteredProducts, loading, error } = useProductsByCategory(decodedSlug);

  // Met la première lettre en majuscule pour l'affichage (ex: "bijou en argent" -> "Bijou en argent")
  const categoryName = decodedSlug ? decodedSlug.charAt(0).toUpperCase() + decodedSlug.slice(1) : '';

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Fil d'ariane et Titre */}
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-6">
        <div className="text-[10px] uppercase tracking-widest text-gray-500 flex items-center gap-2 mb-4">
          <Link href="/">Home</Link> <ChevronRight size={10} />
          <span className="text-gray-800 font-medium">{categoryName}</span>
        </div>

        <h1 className="font-serif text-4xl text-gray-800 tracking-wider border-b border-gray-200 pb-4">
          {categoryName} {!loading && `(${filteredProducts.length} items)`}
        </h1>
      </div>

      {/* Message de chargement */}
      {loading && (
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <p className="text-gray-500 text-sm tracking-wider">Chargement des produits...</p>
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <p className="text-red-500 text-sm">Erreur : {error}</p>
        </div>
      )}

      {/* Grille des produits filtrés */}
      {!loading && !error && (
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            {filteredProducts.map(product => (
              <Link href={`/products/${product.id}`} key={product.id} className="group cursor-pointer block">

                <div className="aspect-[4/5] w-full relative overflow-hidden">
                   {/* Si c'est une URL d'image */}
                   {(product.imageUrl?.startsWith('http') || product.image?.startsWith('http')) ? (
                     <img
                       src={product.imageUrl || product.image}
                       alt={product.name}
                       className="w-full h-full object-cover"
                     />
                   ) : (
                     /* Si c'est une couleur Tailwind */
                     <div className={`w-full h-full ${product.imageUrl || product.image || 'bg-gray-100'} flex items-center justify-center text-gray-400`}>
                       <span className="text-xs uppercase tracking-widest">No Image</span>
                     </div>
                   )}
                </div>

                <div className="text-center mt-4 space-y-1">
                  <h3 className="font-serif text-lg text-gray-700 group-hover:text-[#5d6e64] transition">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 tracking-wider">${product.price}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Message si aucun produit n'est trouvé dans cette catégorie */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-20 text-gray-500 text-sm italic">
              Aucun produit trouvé dans la catégorie "{categoryName}".
            </div>
          )}
        </div>
      )}

      <Footer />
    </main>
  );
}