// ==========================================================
// FICHIER : ProductGrid.jsx
// RÔLE : Affiche une grille de produits. C'est un composant clé
// pour présenter les articles sur la page d'accueil ou les pages de catégorie.
// ==========================================================

import { ShoppingBag } from "lucide-react";
import Link from "next/link"; // Import pour la navigation

// ==========================================================
// DONNÉES EN DUR (À REMPLACER PAR UN APPEL API/CMS)
// C'est ici que la liste des produits est définie.
// À terme, cet array sera remplacé par des données dynamiques.
// La structure de chaque objet est importante :
// { id, name, price, image, category, label? }
// ==========================================================
const products = [
  {
    id: 1,
    name: "Vintage French Jar",
    price: "45.00",
    image: "bg-[#E5E5E5]",
    category: "Kitchen",
    label: "Sold Out",
  },
  {
    id: 2,
    name: "Market Basket",
    price: "65.00",
    image: "bg-[#F0EBE5]",
    category: "Baskets",
  },
  {
    id: 3,
    name: "Olive Wood Board",
    price: "85.00",
    image: "bg-[#E8E0D5]",
    category: "Kitchen",
  },
  {
    id: 4,
    name: "Linen Tea Towel",
    price: "28.00",
    image: "bg-[#DCDCDC]",
    category: "Textiles",
  },
  {
    id: 5,
    name: "Antique Bottle",
    price: "32.00",
    image: "bg-[#EAEAEA]",
    category: "Etc",
  },
  {
    id: 6,
    name: "Savon de Marseille",
    price: "12.00",
    image: "bg-[#F5F5F5]",
    category: "Soaps",
  },
];

export default function ProductGrid() {
  return (
    // <section> est un conteneur sémantique pour une section de page.
    <section className="py-16 px-4 md:px-8 bg-white text-gray-800">
      {/* ========================================================== */}
      {/* 1. TITRE DE LA SECTION                                     */}
      {/* Ce titre peut aussi devenir dynamique (ex: "Nouveautés").   */}
      {/* ========================================================== */}
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-serif tracking-widest text-[#5d6e64] mb-2">
          NEW ARRIVALS
        </h2>
        <div className="w-16 h-0.5 bg-[#5d6e64] mx-auto opacity-50"></div>
      </div>

      {/* ========================================================== */}
      {/* 2. GRILLE DES PRODUITS                                     */}
      {/* C'est le cœur du composant. On utilise .map() pour boucler */}
      {/* sur l'array 'products' et créer une carte pour chaque produit. */}
      {/* ========================================================== */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12">
        {products.map((product) => (
          // Le composant <Link> de Next.js rend toute la carte produit cliquable.
          // L'URL est construite dynamiquement avec l'ID du produit. Ex: /products/1
          <Link
            href={`/products/${product.id}`}
            key={product.id}
            className="group cursor-pointer block"
          >
            {/* BLOC DE L'IMAGE */}
            <div
              className={`aspect-[4/5] w-full ${product.image} relative overflow-hidden`}
            >
              {/* ÉTIQUETTE (ex: "Sold Out") - S'affiche seulement si 'product.label' existe */}
              {product.label && (
                <span className="absolute top-4 left-4 bg-white/90 text-[10px] px-2 py-1 uppercase tracking-widest font-semibold">
                  {product.label}
                </span>
              )}

              {/* BANDEAU AU SURVOL (HOVER) */}
              {/* 'group-hover:translate-y-0' fait apparaître le bandeau quand on survole le <Link> parent. */}
              <div className="absolute bottom-0 left-0 w-full bg-[#5d6e64] text-white text-center py-3 translate-y-full group-hover:translate-y-0 transition duration-300 flex items-center justify-center gap-2 text-xs uppercase tracking-widest">
                <ShoppingBag size={14} /> View Details
              </div>
            </div>

            {/* INFORMATIONS SOUS L'IMAGE (Nom et Prix) */}
            <div className="text-center mt-4 space-y-1">
              {/* Le nom du produit change de couleur au survol grâce à 'group-hover:text-[#5d6e64]' */}
              <h3 className="font-serif text-lg text-gray-700 group-hover:text-[#5d6e64] transition">
                {product.name}
              </h3>
              <p className="text-xs text-gray-500 tracking-wider">
                ${product.price}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* ========================================================== */}
      {/* 3. BOUTON "VOIR TOUT"                                      */}
      {/* Ce bouton pourrait mener vers une page listant tous les produits. */}
      {/* ========================================================== */}
      <div className="text-center mt-16">
        <button className="border border-[#5d6e64] text-[#5d6e64] px-8 py-3 text-xs uppercase tracking-[0.2em] hover:bg-[#5d6e64] hover:text-white transition duration-300">
          View All Products
        </button>
      </div>
    </section>
  );
}
