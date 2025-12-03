"use client";

import { Instagram, Facebook, Mail, Twitter } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import Link from "next/link";

export default function Footer() {
  const { settings } = useSettings();

  return (
    // ==========================================================
    // 1. BLOC CONTENEUR (Arrière-plan et marges)
    // Ce bloc définit le style général du pied de page
    // ==========================================================
    <footer className="bg-white text-gray-600 py-16 border-t border-gray-200 mt-10">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* ========================================================== */}
        {/* 2. CERCLE LOGO (Structure statique pour l'image/texte)   */}
        {/* À remplacer par une vraie image de logo si tu en as une. */}
        {/* ========================================================== */}
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 rounded-full border border-gray-300 flex items-center justify-center">
            {/* Logo dynamique basé sur le nom du site */}
            <div className="text-center">
              {settings?.siteName ? (
                settings.siteName.split(" et ").length === 2 ? (
                  <>
                    <span className="block font-serif text-sm italic">
                      {settings.siteName.split(" et ")[0]}
                    </span>
                    <span className="block text-[8px]">&</span>
                    <span className="block font-serif text-sm italic">
                      {settings.siteName.split(" et ")[1]}
                    </span>
                  </>
                ) : (
                  <span className="block font-serif text-sm">
                    {settings.siteName}
                  </span>
                )
              ) : (
                <>
                  <span className="block font-serif text-sm italic">Vivi</span>
                  <span className="block text-[8px]">&</span>
                  <span className="block font-serif text-sm italic">
                    Margot
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 3. TITRE PRINCIPAL DU FOOTER (Texte dynamique depuis les paramètres) */}
        <h3 className="font-serif text-xl tracking-widest text-gray-800 mb-8 uppercase">
          {settings?.siteName ? (
            settings.siteName.split(" et ").length === 2 ? (
              <>
                {settings.siteName.split(" et ")[0].toUpperCase()}{" "}
                <span className="italic text-sm mx-1">et</span>{" "}
                {settings.siteName.split(" et ")[1].toUpperCase()}
              </>
            ) : (
              settings.siteName.toUpperCase()
            )
          ) : (
            <>
              VIVI <span className="italic text-sm mx-1">et</span> MARGOT
            </>
          )}
        </h3>

        {/* ========================================================== */}
        {/* 4. RÉSEAUX SOCIAUX & EMAIL                                 */}
        {/* Liens dynamiques depuis les paramètres                    */}
        {/* ========================================================== */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-10">
          {/* Les icônes des réseaux sociaux */}
          <div className="flex gap-4">
            {settings?.social?.instagram && (
              <a
                href={settings.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram
                  size={20}
                  className="cursor-pointer hover:text-[#5d6e64] transition"
                />
              </a>
            )}
            {settings?.social?.facebook && (
              <a
                href={settings.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <Facebook
                  size={20}
                  className="cursor-pointer hover:text-[#5d6e64] transition"
                />
              </a>
            )}
            {settings?.social?.twitter && (
              <a
                href={settings.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <Twitter
                  size={20}
                  className="cursor-pointer hover:text-[#5d6e64] transition"
                />
              </a>
            )}
            {settings?.email && (
              <a href={`mailto:${settings.email}`} aria-label="Email">
                <Mail
                  size={20}
                  className="cursor-pointer hover:text-[#5d6e64] transition"
                />
              </a>
            )}
          </div>

          {/* Champ de recherche */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="border border-gray-300 px-4 py-1 text-xs w-48 focus:outline-none focus:border-[#5d6e64]"
            />
          </div>
        </div>

        {/* ========================================================== */}
        {/* 5. INFORMATIONS DE CONTACT (si disponibles)                */}
        {/* ========================================================== */}
        {(settings?.email || settings?.phone || settings?.address) && (
          <div className="text-xs text-gray-500 mb-8 space-y-1">
            {settings?.phone && <p>Tél: {settings.phone}</p>}
            {settings?.email && <p>Email: {settings.email}</p>}
            {settings?.address && <p>{settings.address}</p>}
          </div>
        )}

        {/* ========================================================== */}
        {/* 6. LIENS UTILES (Structure future pour les conditions)     */}
        {/* Pour la gestion CMS, ces liens seraient chargés depuis une DB. */}
        {/* ========================================================== */}
        <div className="flex flex-wrap justify-center gap-6 text-[10px] uppercase tracking-widest text-gray-500 mb-8">
          <Link href="/support" className="hover:underline">
            Contact & Support
          </Link>
          <Link href="/politique-remboursement" className="hover:underline">
            Politique de Remboursement
          </Link>
          <Link href="/compte/commandes" className="hover:underline">
            Mes Commandes
          </Link>
        </div>

        {/* 7. COPYRIGHT (Informations légales avec nom dynamique) */}
        <div className="text-[10px] text-gray-400">
          &copy; 2025 {settings?.siteName || "Vivi et Margot"}. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
