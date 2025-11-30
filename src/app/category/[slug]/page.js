import Header from "../../../components/layout/Header";
import Footer from "../../../components/layout/Footer";
import Link from 'next/link';
import { ChevronRight } from "lucide-react";

// Les données doivent être ici pour le filtre
const mockProducts = [
  { id: 1, name: "Vintage French Jar", price: "45.00", image: "bg-[#E5E5E5]", category: "Kitchen", label: "Sold Out" },
  { id: 2, name: "Market Basket", price: "65.00", image: "bg-[#F0EBE5]", category: "Baskets" },
  { id: 3, name: "Olive Wood Board", price: "85.00", image: "bg-[#E8E0D5]", category: "Kitchen" },
  { id: 4, name: "Linen Tea Towel", price: "28.00", image: "bg-[#DCDCDC]", category: "Textiles" },
  { id: 5, name: "Antique Bottle", price: "32.00", image: "bg-[#EAEAEA]", category: "Etc" },
  { id: 6, name: "Savon de Marseille", price: "12.00", image: "bg-[#F5F5F5]", category: "Soaps" },
];

export default async function CategoryPage({ params }) {
  // Récupère le nom de la catégorie depuis l'URL (ex: "kitchen")
  const { slug } = await params;
  
  // Met la première lettre en majuscule pour l'affichage (ex: kitchen -> Kitchen)
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);

  // Filtre les produits pour n'afficher que ceux de cette catégorie
  const filteredProducts = mockProducts.filter(p => 
    p.category.toLowerCase() === slug.toLowerCase()
  );

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Fil d'ariane et Titre */}
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-6">
        <div className="text-[10px] uppercase tracking-widest text-gray-500 flex items-center gap-2 mb-4">
          <span>Home</span> <ChevronRight size={10} />
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
              
              <div className={`aspect-[4/5] w-full ${product.image} relative overflow-hidden`}>
                {/* Image Placeholder */}
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
        
        {/* Message si pas de produit */}
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