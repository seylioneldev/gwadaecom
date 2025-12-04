"use client";

import Link from "next/link"; // Import nécessaire pour que le bouton soit un lien URL
import { useSettings } from "@/context/SettingsContext";

export default function Hero() {
  const { settings } = useSettings();
  return (
    // ==========================================================
    // 1. BLOC CONTENEUR (Arrière-plan, taille et centrage)
    // C'est l'enveloppe du Hero : définit sa taille et sa couleur
    // ==========================================================
    <div
      data-testid="hero-section"
      className="relative w-full h-[60vh] min-h-[400px] bg-[#e0e0e0] flex flex-col justify-center items-center text-center px-4"
    >
      {/* Indicateur visuel pour toi (à retirer quand tu mettras une vraie photo) */}
      <span className="absolute top-4 left-4 text-[10px] text-gray-500 uppercase tracking-widest border border-gray-400 px-2 py-1">
        Emplacement Grande Photo
      </span>

      {/* ========================================================== */}
      {/* 2. CONTENU TEXTE (Superposé, sur un fond blanc/transparent) */}
      {/* Ce bloc est centré sur l'image et contient les messages clés */}
      {/* ========================================================== */}
      <div className="bg-white/90 p-10 md:p-16 max-w-2xl shadow-sm z-10 mx-4">
        {/* SOUS-TITRE (P) - Texte facilement modifiable */}
        <p className="text-xs md:text-sm uppercase tracking-[0.25em] text-gray-500 mb-4">
          {settings?.homepage?.heroSubtitle || "Authentic French Lifestyle"}
        </p>

        {/* TITRE PRINCIPAL (H1) - Texte facilement modifiable */}
        <h1 className="font-serif text-3xl md:text-5xl text-[#5d6e64] tracking-widest mb-8">
          {settings?.homepage?.heroTitle || "SPRING COLLECTION"}
        </h1>

        {/* BOUTON D'ACTION - À remplacer par <Link> si tu veux naviguer */}
        <Link
          href="/category/shop-brand"
          className="border border-[#5d6e64] text-[#5d6e64] px-8 py-3 text-[10px] md:text-xs uppercase tracking-[0.2em] hover:bg-[#5d6e64] hover:text-white transition duration-300 cursor-pointer"
        >
          Discover Now
        </Link>
      </div>
    </div>
  );
}
