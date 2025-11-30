// ==========================================================
// FICHIER : src/components/products/ProductGrid.jsx
// RÔLE : Affiche la grille des produits sur la page d'accueil.
// ==========================================================

import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';

// CORRECTION ICI : On remonte de 2 niveaux seulement (../../)
// components/ -> src/ -> data/
import { products } from '../../data/products'; 

export default function ProductGrid() {
  return (
    <section className="py-16 px-4 md:px-8 bg-white text-gray-800">
      
      {/* En-tête de section */}
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-serif tracking-widest text-[#5d6e64] mb-2">
          NEW ARRIVALS
        </h2>
        <div className="w-16 h-0.5 bg-[#5d6e64] mx-auto opacity-50"></div>
      </div>

      {/* Grille responsive */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12">
        
        {products.map((product) => (
          
          <Link href={`/products/${product.id}`} key={product.id} className="group cursor-pointer block">
            
            {/* Zone Image */}
            <div className={`aspect-[4/5] w-full ${product.image} relative overflow-hidden`}>
              
              {product.label && (
                <span className="absolute top-4 left-4 bg-white/90 text-[10px] px-2 py-1 uppercase tracking-widest font-semibold">
                  {product.label}
                </span>
              )}
              
              <div className="absolute bottom-0 left-0 w-full bg-[#5d6e64] text-white text-center py-3 translate-y-full group-hover:translate-y-0 transition duration-300 flex items-center justify-center gap-2 text-xs uppercase tracking-widest">
                <ShoppingBag size={14} /> View Details
              </div>
            </div>

            {/* Zone Texte */}
            <div className="text-center mt-4 space-y-1">
              <h3 className="font-serif text-lg text-gray-700 group-hover:text-[#5d6e64] transition">
                {product.name}
              </h3>
              <p className="text-xs text-gray-500 tracking-wider">${product.price}</p>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="text-center mt-16">
        <button className="border border-[#5d6e64] text-[#5d6e64] px-8 py-3 text-xs uppercase tracking-[0.2em] hover:bg-[#5d6e64] hover:text-white transition duration-300">
          View All Products
        </button>
      </div>

    </section>
  );
}