/**
 * COMPOSANT : Bouton Flottant Admin
 * ====================================
 *
 * Bouton d'accès rapide au dashboard admin.
 * Visible uniquement pour les administrateurs authentifiés.
 *
 * 🆕 FICHIER MODIFIÉ : src/components/AdminFloatingButton.jsx
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
   * Le bouton s'affiche UNIQUEMENT si :
   * - L'utilisateur est connecté ET admin (isAdmin === true)
   */

  // Ne rien afficher si pas admin ou en chargement
  if (!isAdmin || loading) return null;

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
 * - Visible UNIQUEMENT si l'utilisateur est connecté comme admin (isAdmin === true)
 * - Pour se connecter comme admin : /mon-compte
 *
 * PERSONNALISATION :
 * - Couleur : bg-[#5d6e64] et hover:bg-[#4a5850]
 * - Position : bottom-6 right-6
 * - Taille : w-14 h-14
 *
 * SÉCURITÉ :
 * - Utilise Firebase Auth via useAuth()
 * - Vérifie le rôle dans Firestore (users collection)
 * - Fallback sur ADMIN_EMAILS dans AuthContext.jsx
 */
