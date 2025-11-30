/**
 * COMPOSANT : Bouton Flottant Admin
 * ====================================
 *
 * Bouton d'accès rapide au dashboard admin.
 * Visible uniquement pour le propriétaire du site (mode dev ou connecté).
 *
 * 🆕 NOUVEAU FICHIER CRÉÉ : src/components/AdminFloatingButton.jsx
 * DATE : 2025-11-30
 *
 * UTILISATION :
 * - Ajouter ce composant dans src/app/page.js (page d'accueil)
 * - Le bouton s'affiche en bas à droite, fixe
 * - Clic → Redirige vers /admin
 */

"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Settings } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminFloatingButton() {
  const [isHovered, setIsHovered] = useState(false);
  const { isAdmin, loading } = useAuth();

  /**
   * CONDITION D'AFFICHAGE DU BOUTON ADMIN
   * ========================================
   *
   * Le bouton s'affiche si :
   * - L'utilisateur est connecté ET admin (isAdmin === true)
   * - OU en mode développement (pour faciliter le développement)
   */

  const isDev = process.env.NODE_ENV === 'development';
  const isVisible = isAdmin || isDev;

  // Ne rien afficher si le bouton n'est pas visible ou en chargement
  if (!isVisible || loading) return null;

  return (
    <>
      {/* Bouton flottant */}
      <Link
        href="/admin"
        className="fixed bottom-6 right-6 z-50 group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title="Accès Admin"
      >
        <div className="relative">
          {/* Badge "Admin" qui apparaît au survol */}
          {isHovered && (
            <div className="absolute bottom-full right-0 mb-2 bg-gray-800 text-white text-xs px-3 py-1 rounded whitespace-nowrap">
              Tableau de bord Admin
            </div>
          )}

          {/* Bouton circulaire */}
          <div className="bg-[#5d6e64] text-white w-14 h-14 rounded-full shadow-lg hover:shadow-xl hover:bg-[#4a5850] transition-all duration-200 flex items-center justify-center">
            <Settings size={24} className="group-hover:rotate-90 transition-transform duration-300" />
          </div>

          {/* Badge "Dev Mode" (optionnel) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
              DEV
            </div>
          )}
        </div>
      </Link>
    </>
  );
}

/**
 * GUIDE D'UTILISATION
 * ===================
 *
 * Ce bouton est déjà intégré dans src/app/page.js
 *
 * VISIBILITÉ :
 * - Visible en mode développement (NODE_ENV === 'development')
 * - Visible si l'utilisateur est connecté comme admin (isAdmin === true)
 *
 * PERSONNALISATION :
 * - Couleur : bg-[#5d6e64] et hover:bg-[#4a5850]
 * - Position : bottom-6 right-6
 * - Taille : w-14 h-14
 *
 * SÉCURITÉ :
 * - Utilise Firebase Auth via useAuth()
 * - Seuls les emails dans ADMIN_EMAILS peuvent se connecter
 * - Voir AuthContext.jsx pour la configuration
 */
