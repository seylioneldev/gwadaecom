/**
 * COMPOSANT : ProductGrid
 * ========================
 *
 * Affiche la grille des produits sur la page d'accueil.
 * Récupère les produits depuis Firestore en temps réel.
 *
 * 📄 FICHIER MODIFIÉ : src/components/products/ProductGrid.jsx
 * DATE : 2025-11-30
 *
 * CHANGEMENT : Remplace import des données statiques par le hook useProducts
 */

"use client";

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import Price from "@/components/Price";
import { useSettings } from "@/context/SettingsContext";
import { useHomeProducts } from "@/context/ProductsContext"; // Produits de la home pré-chargés côté serveur

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

export default function ProductGrid() {
  // Produits de la home, fournis par le contexte (chargés côté serveur)
  const { products, loading, error } = useHomeProducts();
  const { settings } = useSettings();

  const showNewArrivals =
    settings?.homepage?.showNewArrivals !== undefined
      ? settings.homepage.showNewArrivals
      : true;

  const homepageBlocksStyles = settings?.customStyles?.homepageBlocks || {};

  const productGridBgColor =
    homepageBlocksStyles.productGridBgColor || "#ffffff";
  const productGridBgImageUrl =
    homepageBlocksStyles.productGridBgImageUrl || "";
  const productGridBgBlurRaw = homepageBlocksStyles.productGridBgBlur ?? 0;
  const productGridBgDarkenRaw = homepageBlocksStyles.productGridBgDarken ?? 0;

  const productGridBgBlur = Number(productGridBgBlurRaw) || 0;
  const productGridBgDarken = Number(productGridBgDarkenRaw) || 0;

  const hasBgImage =
    typeof productGridBgImageUrl === "string" &&
    productGridBgImageUrl.trim() !== "";
  const overlayAlpha = Math.min(Math.max(productGridBgDarken / 100, 0), 0.85);

  if (!showNewArrivals) {
    return null;
  }

  const newArrivalsTitle =
    settings?.homepage?.newArrivalsTitle || "NEW ARRIVALS";
  const newArrivalsSubtitle = settings?.homepage?.newArrivalsSubtitle || "";

  return (
    <section
      className="relative overflow-hidden py-16 px-4 md:px-8 text-gray-800"
      style={!hasBgImage ? { backgroundColor: productGridBgColor } : undefined}
    >
      {hasBgImage && (
        <>
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              backgroundImage: `url(${productGridBgImageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              filter: productGridBgBlur
                ? `blur(${productGridBgBlur}px)`
                : undefined,
              transform: productGridBgBlur ? "scale(1.05)" : undefined,
            }}
          />
          {overlayAlpha > 0 && (
            <div
              className="absolute inset-0"
              aria-hidden="true"
              style={{
                backgroundColor: `rgba(0, 0, 0, ${overlayAlpha})`,
              }}
            />
          )}
        </>
      )}

      <div className="relative z-10">
        {/* En-tête de section */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-serif tracking-widest text-[#5d6e64] mb-2">
            {newArrivalsTitle}
          </h2>
          {newArrivalsSubtitle && (
            <p className="text-xs md:text-sm text-gray-500 mb-4">
              {newArrivalsSubtitle}
            </p>
          )}
          <div className="w-16 h-0.5 bg-[#5d6e64] mx-auto opacity-50"></div>
        </div>

        {/* Message de chargement */}
        {loading && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-sm tracking-wider">
              Chargement des produits...
            </p>
          </div>
        )}

        {/* Message d'erreur */}
        {error && (
          <div className="text-center py-20">
            <p className="text-red-500 text-sm">Erreur : {error}</p>
          </div>
        )}

        {/* Grille responsive - Affichée uniquement si les produits sont chargés */}
        {!loading && !error && (
          <>
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12">
              {products.length === 0 ? (
                <div className="col-span-full text-center py-20">
                  <p className="text-gray-500 text-sm">
                    Aucun produit disponible pour le moment.
                  </p>
                </div>
              ) : (
                products.map((product) => {
                  const hasNumericStock =
                    typeof product.stock === "number" &&
                    !Number.isNaN(product.stock);
                  const stockValue = hasNumericStock ? product.stock : null;
                  const isOutOfStock = stockValue !== null && stockValue <= 0;
                  const stockStatus = getStockStatus(stockValue);

                  const CardInner = (
                    <>
                      {/* Zone Image */}
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
                            }`}
                          ></div>
                        )}

                        {product.label && (
                          <span className="absolute top-4 left-4 bg-white/90 text-[10px] px-2 py-1 uppercase tracking-widest font-semibold z-10">
                            {product.label}
                          </span>
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
                            <>
                              <ShoppingBag size={14} /> View Details
                            </>
                          )}
                        </div>
                      </div>

                      {/* Zone Texte */}
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
                })
              )}
            </div>

            <div className="text-center mt-16">
              <button className="border border-[#5d6e64] text-[#5d6e64] px-8 py-3 text-xs uppercase tracking-[0.2em] hover:bg-[#5d6e64] hover:text-white transition duration-300">
                View All Products
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
