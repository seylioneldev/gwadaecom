import { ShoppingBag } from 'lucide-react';

// Données fictives pour simuler tes produits
const products = [
  { id: 1, name: "Vintage French Jar", price: "45.00", image: "bg-[#E5E5E5]", label: "Sold Out" },
  { id: 2, name: "Market Basket", price: "65.00", image: "bg-[#F0EBE5]" },
  { id: 3, name: "Olive Wood Board", price: "85.00", image: "bg-[#E8E0D5]" },
  { id: 4, name: "Linen Tea Towel", price: "28.00", image: "bg-[#DCDCDC]" },
  { id: 5, name: "Antique Bottle", price: "32.00", image: "bg-[#EAEAEA]" },
  { id: 6, name: "Savon de Marseille", price: "12.00", image: "bg-[#F5F5F5]" },
];

// C'est cette ligne "export default" qui est cruciale !
export default function ProductGrid() {
  return (
    <section className="py-16 px-4 md:px-8 bg-white text-gray-800">
      
      {/* Titre de section */}
      <div className="text-center mb-12">
        <h2 className="text-2xl md:text-3xl font-serif tracking-widest text-[#5d6e64] mb-2">NEW ARRIVALS</h2>
        <div className="w-16 h-0.5 bg-[#5d6e64] mx-auto opacity-50"></div>
      </div>

      {/* Grille de produits */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12">
        {products.map((product) => (
          <div key={product.id} className="group cursor-pointer">
            
            {/* Image (Zone grise simulée) */}
            <div className={`aspect-[4/5] w-full ${product.image} relative overflow-hidden`}>
              {/* Badge si épuisé */}
              {product.label && (
                <span className="absolute top-4 left-4 bg-white/90 text-[10px] px-2 py-1 uppercase tracking-widest font-semibold">
                  {product.label}
                </span>
              )}
              
              {/* Bouton d'ajout rapide */}
              <div className="absolute bottom-0 left-0 w-full bg-[#5d6e64] text-white text-center py-3 translate-y-full group-hover:translate-y-0 transition duration-300 flex items-center justify-center gap-2 text-xs uppercase tracking-widest">
                <ShoppingBag size={14} /> Add to Cart
              </div>
            </div>

            {/* Infos produit */}
            <div className="text-center mt-4 space-y-1">
              <h3 className="font-serif text-lg text-gray-700 group-hover:text-[#5d6e64] transition">
                {product.name}
              </h3>
              <p className="text-xs text-gray-500 tracking-wider">${product.price}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Bouton "Voir tout" */}
      <div className="text-center mt-16">
        <button className="border border-[#5d6e64] text-[#5d6e64] px-8 py-3 text-xs uppercase tracking-[0.2em] hover:bg-[#5d6e64] hover:text-white transition duration-300">
          View All Products
        </button>
      </div>

    </section>
  );
}