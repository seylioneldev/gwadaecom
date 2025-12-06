"use client";

import Link from "next/link"; // Import nécessaire pour que le bouton soit un lien URL
import { useSettings } from "@/context/SettingsContext";

export default function Hero() {
  const { settings } = useSettings();

  const heroSubtitle =
    settings?.homepage?.heroSubtitle || "Authentic French Lifestyle";
  const heroTitle = settings?.homepage?.heroTitle || "SPRING COLLECTION";
  const heroCtaLabel = settings?.homepage?.heroCtaLabel || "Discover Now";
  const heroCtaLink = settings?.homepage?.heroCtaLink || "/category/shop-brand";

  const heroBgColor =
    settings?.customStyles?.homepageBlocks?.heroBgColor || "#e0e0e0";

  const heroBgImageUrl =
    settings?.customStyles?.homepageBlocks?.heroBgImageUrl || "";
  const heroBgBlurRaw = settings?.customStyles?.homepageBlocks?.heroBgBlur ?? 0;
  const heroBgDarkenRaw =
    settings?.customStyles?.homepageBlocks?.heroBgDarken ?? 0;

  const heroBgBlur = Number(heroBgBlurRaw) || 0;
  const heroBgDarken = Number(heroBgDarkenRaw) || 0;

  const hasHeroImage =
    typeof heroBgImageUrl === "string" && heroBgImageUrl.trim() !== "";
  const heroOverlayAlpha = Math.min(Math.max(heroBgDarken / 100, 0), 0.85);

  const heroContentBgColor =
    settings?.customStyles?.homepageBlocks?.heroContentBgColor || "#ffffff";
  const heroContentBgImageUrl =
    settings?.customStyles?.homepageBlocks?.heroContentBgImageUrl || "";
  const heroContentBgBlurRaw =
    settings?.customStyles?.homepageBlocks?.heroContentBgBlur ?? 0;
  const heroContentBgDarkenRaw =
    settings?.customStyles?.homepageBlocks?.heroContentBgDarken ?? 0;

  const heroContentBgBlur = Number(heroContentBgBlurRaw) || 0;
  const heroContentBgDarken = Number(heroContentBgDarkenRaw) || 0;

  const hasHeroContentImage =
    typeof heroContentBgImageUrl === "string" &&
    heroContentBgImageUrl.trim() !== "";
  const heroContentOverlayAlpha = Math.min(
    Math.max(heroContentBgDarken / 100, 0),
    0.85
  );

  return (
    // ==========================================================
    // 1. BLOC CONTENEUR (Arrière-plan, taille et centrage)
    // C'est l'enveloppe du Hero : définit sa taille et sa couleur
    // ==========================================================
    <div
      data-testid="hero-section"
      className="relative w-full h-[60vh] min-h-[400px] flex flex-col justify-center items-center text-center px-4 overflow-hidden"
      style={!hasHeroImage ? { backgroundColor: heroBgColor } : undefined}
    >
      {hasHeroImage && (
        <>
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              backgroundImage: `url(${heroBgImageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              filter: heroBgBlur ? `blur(${heroBgBlur}px)` : undefined,
              transform: heroBgBlur ? "scale(1.05)" : undefined,
            }}
          />
          {heroOverlayAlpha > 0 && (
            <div
              className="absolute inset-0"
              aria-hidden="true"
              style={{
                backgroundColor: `rgba(0, 0, 0, ${heroOverlayAlpha})`,
              }}
            />
          )}
        </>
      )}
      {/* ========================================================== */}
      {/* 2. CONTENU TEXTE (bloc central configurable) */}
      {/* ========================================================== */}
      <div
        className="relative overflow-hidden p-10 md:p-16 max-w-2xl shadow-sm z-10 mx-4"
        style={
          !hasHeroContentImage
            ? { backgroundColor: heroContentBgColor }
            : undefined
        }
      >
        {hasHeroContentImage && (
          <>
            <div
              className="absolute inset-0"
              aria-hidden="true"
              style={{
                backgroundImage: `url(${heroContentBgImageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                filter: heroContentBgBlur
                  ? `blur(${heroContentBgBlur}px)`
                  : undefined,
                transform: heroContentBgBlur ? "scale(1.05)" : undefined,
              }}
            />
            {heroContentOverlayAlpha > 0 && (
              <div
                className="absolute inset-0"
                aria-hidden="true"
                style={{
                  backgroundColor: `rgba(0, 0, 0, ${heroContentOverlayAlpha})`,
                }}
              />
            )}
          </>
        )}

        <div className="relative z-10">
          {/* SOUS-TITRE (P) - Texte facilement modifiable */}
          <p className="text-xs md:text-sm uppercase tracking-[0.25em] text-gray-500 mb-4">
            {heroSubtitle}
          </p>

          {/* TITRE PRINCIPAL (H1) - Texte facilement modifiable */}
          <h1 className="font-serif text-3xl md:text-5xl text-[#5d6e64] tracking-widest mb-8">
            {heroTitle}
          </h1>

          {/* BOUTON D'ACTION - À remplacer par <Link> si tu veux naviguer */}
          <Link
            href={heroCtaLink}
            className="inline-block w-full md:w-auto border-2 border-[#D4AF37] text-[#1A1A1A] px-8 py-3.5 text-xs uppercase tracking-[0.25em] font-semibold hover:bg-[#D4AF37] hover:text-[#1A1A1A] hover:shadow-lg transition-all duration-300 cursor-pointer"
          >
            {heroCtaLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
