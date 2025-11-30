// ==========================================================
// FICHIER : [slug]/page.js (Route Dynamique pour les Catégories)
// RÔLE : Affiche une page listant tous les produits d'une catégorie spécifique.
// Le nom de la catégorie est extrait de l'URL (le "slug").
// Par exemple, l'URL "/category/kitchen" affichera cette page
// avec le slug "kitchen".
// ==========================================================


import Header from "../../../components/layout/Header";
import Footer from "../../../components/layout/Footer";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

// ==========================================================
// DONNÉES EN DUR (Source de données temporaire)
// À terme, cette liste sera remplacée par un appel à une base de données
// ou un CMS pour récupérer les produits de manière dynamique.
// ==========================================================
const mockProducts = [
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

// ==========================================================
// COMPOSANT DE LA PAGE CATÉGORIE
// C'est un "Server Component" asynchrone, une pratique courante avec Next.js App Router.
// Il reçoit 'params' qui contient les segments dynamiques de l'URL.
// ==========================================================
export default async function CategoryPage({ params }) {
  // 1. RÉCUPÉRATION DU SLUG
  // On extrait le "slug" de l'URL. Pour "/category/kitchen", slug sera "kitchen".
  const { slug } = await params;

  // 2. FORMATAGE DU NOM POUR L'AFFICHAGE
  // On met la première lettre en majuscule pour un affichage plus propre (ex: "kitchen" -> "Kitchen").
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);

  // 3. LOGIQUE DE FILTRAGE
  // C'est le cœur de la page : on filtre la liste `mockProducts` pour ne garder
  // que les produits dont la catégorie correspond au slug de l'URL.
  // On compare en minuscules pour éviter les erreurs de casse.
  const filteredProducts = mockProducts.filter(
    (p) => p.category.toLowerCase() === slug.toLowerCase()
  );

  return (
    <main className="min-h-screen bg-white">
      {/* On inclut les composants de layout communs */}
      <Header />

      {/* ========================================================== */}
      {/* 4. EN-TÊTE DE LA PAGE (Fil d'Ariane et Titre)             */}
      {/* ========================================================== */}
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-6">
        {/* Le fil d'ariane aide l'utilisateur à se situer sur le site. */}
        <div className="text-[10px] uppercase tracking-widest text-gray-500 flex items-center gap-2 mb-4">
          <span>Home</span> <ChevronRight size={10} />
          <span className="text-gray-800 font-medium">{categoryName}</span>
        </div>

        {/* Le titre affiche dynamiquement le nom de la catégorie et le nombre de produits trouvés. */}
        <h1 className="font-serif text-4xl text-gray-800 tracking-wider border-b border-gray-200 pb-4">
          {categoryName} ({filteredProducts.length} items)
        </h1>
      </div>

      {/* ========================================================== */}
      {/* 5. GRILLE DES PRODUITS FILTRÉS                             */}
      {/* ========================================================== */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {/* On boucle sur la liste des produits filtrés pour créer une carte pour chacun. */}
          {filteredProducts.map((product) => (
            // Chaque carte est un lien qui mène vers la page détaillée du produit.
            <Link
              href={`/products/${product.id}`}
              key={product.id}
              className="group cursor-pointer block"
            >
              {/* Bloc pour l'image du produit */}
              <div
                className={`aspect-[4/5] w-full ${product.image} relative overflow-hidden`}
              >
                {/* Pour l'instant, c'est un fond de couleur. On pourrait y mettre une balise <Image> de Next.js. */}
              </div>

              {/* Informations sous l'image */}
              <div className="text-center mt-4 space-y-1">
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
        {/* 6. CAS OÙ AUCUN PRODUIT N'EST TROUVÉ                      */}
        {/* Ce bloc s'affiche uniquement si la liste `filteredProducts` est vide. */}
        {/* ========================================================== */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20 text-gray-500 text-sm italic">
            Aucun produit trouvé dans la catégorie "{categoryName}".
          </div>
        )}
      </div>

      {/* On inclut le pied de page */}
      <Footer />
    </main>
  );
}
