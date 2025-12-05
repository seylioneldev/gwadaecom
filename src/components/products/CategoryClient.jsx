"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Price from "@/components/Price";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

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

export default function CategoryClient({ categorySlug, products }) {
  const decodedSlug = categorySlug ? decodeURIComponent(categorySlug) : "";

  const categoryName = decodedSlug
    ? decodedSlug.charAt(0).toUpperCase() + decodedSlug.slice(1)
    : "";

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
          {categoryName} ({products.length} items)
        </h1>
      </div>

      {/* Grille des produits filtrés */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {products.map((product) => {
            const hasNumericStock =
              typeof product.stock === "number" && !Number.isNaN(product.stock);
            const stockValue = hasNumericStock ? product.stock : null;
            const isOutOfStock = stockValue !== null && stockValue <= 0;
            const stockStatus = getStockStatus(stockValue);

            const CardInner = (
              <>
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
                      } flex items-center justify-center text-gray-400`}
                    >
                      <span className="text-xs uppercase tracking-widest">
                        No Image
                      </span>
                    </div>
                  )}

                  <div className="absolute top-4 right-4 z-10">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[9px] uppercase tracking-[0.2em] border ${stockStatus.containerClass}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${stockStatus.dotClass}`}
                      ></span>
                      {stockStatus.label}
                    </span>
                  </div>

                  <div
                    className={`absolute bottom-0 left-0 w-full text-center py-3 translate-y-full group-hover:translate-y-0 transition duration-300 flex items-center justify-center gap-2 text-xs uppercase tracking-widest z-10 ${
                      isOutOfStock
                        ? "bg-gray-900 text-white"
                        : "bg-[#5d6e64] text-white"
                    }`}
                  >
                    {isOutOfStock ? (
                      <>Rupture de stock</>
                    ) : (
                      <>Voir le produit</>
                    )}
                  </div>
                </div>

                <div className="text-center mt-4 space-y-2">
                  <h3 className="font-serif text-lg text-gray-700 group-hover:text-[#5d6e64] transition">
                    {product.name}
                  </h3>
                  <Price
                    amount={product.price}
                    className="text-xs text-gray-500 tracking-wider"
                  />
                </div>
              </>
            );

            if (isOutOfStock) {
              return (
                <div
                  key={product.id}
                  className="group cursor-not-allowed block opacity-80"
                >
                  {CardInner}
                </div>
              );
            }

            return (
              <Link
                href={`/products/${product.id}`}
                key={product.id}
                className="group cursor-pointer block"
              >
                {CardInner}
              </Link>
            );
          })}
        </div>

        {products.length === 0 && (
          <div className="text-center py-20 text-gray-500 text-sm italic">
            Aucun produit trouvé dans la catégorie "{categoryName}".
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
