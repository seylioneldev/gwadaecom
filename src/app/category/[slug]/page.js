import Header from "../../../components/layout/Header";
import Footer from "../../../components/layout/Footer";
import Link from 'next/link';
import { ChevronRight } from "lucide-react";

// ==========================================================
// 1. IMPORTATION DES DONNÉES CENTRALISÉES
// On remplace la liste 'mockProducts' par l'import de notre fichier data.
// Chemin : on remonte de 3 niveaux (../../../) pour atteindre src/data
// ==========================================================
import { products } from '../../../data/products';

export default async function CategoryPage({ params }) {
  // Récupère le nom de la catégorie depuis l'URL (ex: "kitchen")
  const { slug } = await params;
  
  // Met la première lettre en majuscule pour l'affichage (ex: kitchen -> Kitchen)
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);

  // 2. FILTRAGE DES DONNÉES
  // On utilise la liste importée 'products' pour filtrer.
  const filteredProducts = products.filter(p => 
    p.category.toLowerCase() === slug.toLowerCase()
  );

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
          {categoryName} ({filteredProducts.length} items)
        </h1>
      </div>

      {/* Grille des produits filtrés */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {filteredProducts.map(product => (
            <Link href={`/products/${product.id}`} key={product.id} className="group cursor-pointer block">
              
              <div className={`${product.image || 'bg-gray-100'} aspect-[4/5] w-full relative overflow-hidden flex items-center justify-center text-gray-400`}>
                 {/* Si pas d'image, on affiche le nom */}
                 {!product.image?.startsWith('bg-') && !product.image?.startsWith('http') && (
                    <span className="text-xs uppercase tracking-widest">No Image</span>
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

      <Footer />
    </main>
  );
}