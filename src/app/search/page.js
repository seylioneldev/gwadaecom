import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import Link from "next/link";
import { ChevronRight, Search as SearchIcon, Sparkles } from "lucide-react";
import { adminDb } from "@/lib/firebase-admin";
import cmsConfig from "../../../cms.config";

export default async function SearchPage({ searchParams }) {
  // Récupération du paramètre 'q' dans l'URL (ex: ?q=savon)
  const params = await searchParams;
  const query = params?.q || "";

  let products = [];

  if (adminDb) {
    try {
      const collectionName = cmsConfig.collections?.products || "products";
      const snapshot = await adminDb.collection(collectionName).get();

      products = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error(
        "Erreur lors du chargement des produits pour la recherche:",
        error
      );
    }
  }

  const normalizedQuery = query.toLowerCase().trim();

  // Filtrage des produits (insensible à la casse)
  const filteredProducts = normalizedQuery
    ? products.filter((p) => {
        const name = (p.name || "").toLowerCase();
        const description = (p.description || "").toLowerCase();
        const category = (p.category || "").toLowerCase();

        return (
          name.includes(normalizedQuery) ||
          description.includes(normalizedQuery) ||
          category.includes(normalizedQuery)
        );
      })
    : [];

  // LOGIQUE DE SUGGESTION :
  // Si aucun résultat, on prend les 3 premiers produits du catalogue comme "Suggestions"
  const suggestions = filteredProducts.length === 0 ? products.slice(0, 3) : [];
  const hasResults = filteredProducts.length > 0;

  // On décide quelle liste afficher (les résultats OU les suggestions)
  const displayList = hasResults ? filteredProducts : suggestions;

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* En-tête de la page recherche */}
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-6">
        <div className="text-[10px] uppercase tracking-widest text-gray-500 flex items-center gap-2 mb-4">
          <Link href="/">Home</Link> <ChevronRight size={10} />
          <span className="text-gray-800 font-medium">Search Results</span>
        </div>

        <h1 className="font-serif text-3xl text-gray-800 tracking-wider border-b border-gray-200 pb-4 flex items-center gap-3">
          <SearchIcon size={24} className="text-[#5d6e64]" />
          {hasResults ? (
            <>Résultats pour "{query}"</>
          ) : (
            <>Aucun résultat pour "{query}"</>
          )}
        </h1>
      </div>

      {/* Corps de la page */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Message spécifique si pas de résultats */}
        {!hasResults && (
          <div className="mb-16 text-center">
            <p className="text-gray-500 mb-8 italic">
              Nous n'avons pas trouvé ce que vous cherchez. Essayez un autre
              terme ou découvrez nos favoris :
            </p>
            <div className="flex items-center justify-center gap-2 text-[#5d6e64] uppercase tracking-widest text-sm font-semibold">
              <Sparkles size={16} /> Ces produits pourraient vous plaire
            </div>
          </div>
        )}

        {/* Grille (Affiche soit les résultats, soit les suggestions) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {displayList.map((product) => (
            <Link
              href={`/products/${product.id}`}
              key={product.id}
              className="group cursor-pointer block"
            >
              <div className="aspect-[4/5] w-full relative overflow-hidden">
                {product.imageUrl?.startsWith("http") ||
                product.image?.startsWith("http") ? (
                  <img
                    src={product.imageUrl || product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className={`w-full h-full ${
                      product.imageUrl || product.image || "bg-gray-100"
                    }`}
                  ></div>
                )}
              </div>

              <div className="text-center mt-4 space-y-1">
                <h3 className="font-serif text-lg text-gray-700 group-hover:text-[#5d6e64] transition">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500 tracking-wider">
                  {product.price} €
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}
