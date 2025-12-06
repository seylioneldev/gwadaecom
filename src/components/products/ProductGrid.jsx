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
  if (typeof stock !== "number" || Number.isNaN(stock)) {
    return {
      label: "En stock",
      containerClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
      dotClass: "bg-emerald-500",
    };
  }

  // Dès que le stock est à 1 ou 0, on considère le produit en rupture
  if (stock <= 1) {
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
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif tracking-wider text-[#D4AF37] mb-3">
            {newArrivalsTitle}
          </h2>
          {newArrivalsSubtitle && (
            <p className="text-sm md:text-base text-gray-600 mb-6 font-light tracking-wide">
              {newArrivalsSubtitle}
            </p>
          )}
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto"></div>
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
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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
                  // On rend le produit indisponible dès que le stock est à 1 ou 0
                  const isOutOfStock = stockValue !== null && stockValue <= 1;
                  const stockStatus = getStockStatus(stockValue);

                  const CardInner = (
                    <>
                      {/* Zone Image */}
                      <div className="aspect-[3/4] w-full relative overflow-hidden rounded-sm group-hover:shadow-2xl transition-all duration-500">
                        {/* Si c'est une URL d'image */}
                        {product.imageUrl?.startsWith("http") ||
                        product.image?.startsWith("http") ? (
                          <img
                            src={product.imageUrl || product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
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
                          <span className="absolute top-3 left-3 bg-[#D4AF37] text-[#1A1A1A] text-[9px] px-3 py-1.5 uppercase tracking-[0.15em] font-bold z-10 shadow-sm">
                            {product.label}
                          </span>
                        )}

                        <div className="absolute top-3 right-3 z-10">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[8px] uppercase tracking-[0.15em] font-semibold border shadow-sm backdrop-blur-sm ${stockStatus.containerClass}`}
                          >
                            <span
                              className={`w-1 h-1 rounded-full ${stockStatus.dotClass}`}
                            ></span>
                            {stockStatus.label}
                          </span>
                        </div>

                        <div
                          className={`absolute bottom-0 left-0 w-full text-center py-3.5 translate-y-full group-hover:translate-y-0 transition-all duration-500 flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.2em] font-semibold z-10 backdrop-blur-md ${
                            isOutOfStock
                              ? "bg-gray-900/90 text-white"
                              : "bg-[#D4AF37]/95 text-[#1A1A1A]"
                          }`}
                        >
                          {isOutOfStock ? (
                            <>Rupture de stock</>
                          ) : (
                            <>
                              <ShoppingBag size={13} strokeWidth={2.5} /> Voir les détails
                            </>
                          )}
                        </div>
                      </div>

                      {/* Zone Texte */}
                      <div className="text-center mt-3 space-y-1 px-1">
                        <h3 className="font-serif text-sm md:text-base text-gray-800 group-hover:text-[#D4AF37] transition-colors duration-300 leading-tight line-clamp-2">
                          {product.name}
                        </h3>
                        <Price
                          amount={product.price}
                          className="text-xs md:text-sm font-semibold text-[#1A1A1A] tracking-wide"
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

            <div className="text-center mt-20">
              <button className="border-2 border-[#D4AF37] text-[#1A1A1A] px-10 py-3.5 text-xs uppercase tracking-[0.25em] font-semibold hover:bg-[#D4AF37] hover:text-[#1A1A1A] hover:shadow-lg transition-all duration-300 rounded-sm">
                Voir tous les produits
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
