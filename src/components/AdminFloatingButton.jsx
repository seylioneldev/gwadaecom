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

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Settings, X } from 'lucide-react';

export default function AdminFloatingButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    /**
     * CONDITION D'AFFICHAGE DU BOUTON ADMIN
     * ========================================
     *
     * Option 1 : Mode développement (NODE_ENV)
     * Option 2 : Variable d'environnement personnalisée
     * Option 3 : Vérifier si l'utilisateur est connecté (Firebase Auth)
     *
     * Pour le moment, on utilise NODE_ENV en développement.
     *
     * IMPORTANT : En production, remplacez cette logique par :
     * - Une vérification Firebase Auth (isAdmin: true dans le profil)
     * - Ou un email spécifique autorisé
     */

    const isDev = process.env.NODE_ENV === 'development';
    const isAdminEnabled = process.env.NEXT_PUBLIC_SHOW_ADMIN_BUTTON === 'true';

    // Afficher si en mode dev OU si la variable d'environnement est activée
    setIsVisible(isDev || isAdminEnabled);
  }, []);

  // Ne rien afficher si le bouton n'est pas visible
  if (!isVisible) return null;

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
 * ============================================
 * GUIDE D'UTILISATION
 * ============================================
 *
 * 1. INTÉGRATION DANS LA PAGE D'ACCUEIL :
 *
 *    Dans src/app/page.js, ajoutez :
 *
 *    ```jsx
 *    import AdminFloatingButton from '@/components/AdminFloatingButton';
 *
 *    export default function HomePage() {
 *      return (
 *        <>
 *          {/* Votre contenu de page */}
 *          <AdminFloatingButton />
 *        </>
 *      );
 *    }
 *    ```
 *
 * 2. CONFIGURATION DE LA VISIBILITÉ :
 *
 *    Par défaut, le bouton s'affiche en mode développement.
 *
 *    Pour l'activer en production, ajoutez dans .env.local :
 *    ```
 *    NEXT_PUBLIC_SHOW_ADMIN_BUTTON=true
 *    ```
 *
 * 3. SÉCURITÉ AVEC FIREBASE AUTH :
 *
 *    Pour une vraie sécurité, remplacez la logique useEffect par :
 *
 *    ```jsx
 *    import { useAuth } from '@/hooks/useAuth'; // Votre hook d'authentification
 *
 *    const { user } = useAuth();
 *    const isAdmin = user?.email === 'votre-email@admin.com';
 *    setIsVisible(isAdmin);
 *    ```
 *
 * 4. PERSONNALISATION :
 *
 *    - Couleur : Modifiez bg-[#5d6e64] et hover:bg-[#4a5850]
 *    - Position : Modifiez bottom-6 right-6
 *    - Taille : Modifiez w-14 h-14
 *    - Icône : Remplacez <Settings /> par une autre icône Lucide
 *
 * 5. MASQUER EN PRODUCTION :
 *
 *    Si vous voulez masquer complètement le bouton en production :
 *
 *    ```jsx
 *    if (process.env.NODE_ENV === 'production') return null;
 *    ```
 *
 * ============================================
 */
