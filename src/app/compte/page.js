/**
 * PAGE : Espace Client
 * ======================
 *
 * Dashboard personnel pour les clients.
 * Affiche les informations du compte, les commandes, et permet la déconnexion.
 *
 * 🆕 NOUVEAU FICHIER : src/app/compte/page.js
 * DATE : 2025-11-30
 */

"use client";

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { LogOut, User, Package, Settings, Mail } from 'lucide-react';
import Link from 'next/link';

export default function ComptePage() {
  const { user, userRole, isAdmin, loading, signOut } = useAuth();
  const router = useRouter();

  /**
   * REDIRECTION SI NON CONNECTÉ OU SI ADMIN
   */
  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Pas connecté → redirection vers /mon-compte
        router.push('/mon-compte');
      } else if (isAdmin) {
        // Admin → redirection vers /admin
        router.push('/admin');
      }
    }
  }, [user, isAdmin, loading, router]);

  /**
   * GESTION DE LA DÉCONNEXION
   */
  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Afficher un loader pendant la vérification
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#5d6e64] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement de votre espace...</p>
        </div>
      </div>
    );
  }

  // Si pas connecté ou admin, ne rien afficher (useEffect gère la redirection)
  if (!user || isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">

        {/* En-tête */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#5d6e64] text-white rounded-full flex items-center justify-center">
                <User size={32} />
              </div>
              <div>
                <h1 className="text-2xl font-serif text-gray-800 mb-1">Mon Compte</h1>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Mail size={14} />
                  {user.email}
                </p>
                {user.displayName && (
                  <p className="text-sm text-gray-600 mt-1">{user.displayName}</p>
                )}
              </div>
            </div>

            {/* Bouton de déconnexion */}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition text-sm text-gray-700"
            >
              <LogOut size={16} />
              Déconnexion
            </button>
          </div>
        </div>

        {/* Grille de cartes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Carte : Mes Commandes */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#5d6e64] text-white rounded-full flex items-center justify-center">
                <Package size={24} />
              </div>
              <h2 className="text-xl font-serif text-gray-800">Mes Commandes</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Consultez l'historique de vos commandes et suivez vos livraisons.
            </p>
            <div className="bg-gray-50 rounded p-4 text-center">
              <p className="text-sm text-gray-500 italic">Aucune commande pour le moment</p>
            </div>
            {/* Futur lien : <Link href="/compte/commandes" className="...">Voir toutes mes commandes</Link> */}
          </div>

          {/* Carte : Paramètres du compte */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#5d6e64] text-white rounded-full flex items-center justify-center">
                <Settings size={24} />
              </div>
              <h2 className="text-xl font-serif text-gray-800">Paramètres</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Modifiez vos informations personnelles et vos préférences.
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#5d6e64] rounded-full"></span>
                Email : {user.email}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#5d6e64] rounded-full"></span>
                Rôle : Client
              </li>
            </ul>
            {/* Futur lien : <Link href="/compte/parametres" className="...">Modifier mes informations</Link> */}
          </div>

          {/* Carte : Adresses de livraison */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#5d6e64] text-white rounded-full flex items-center justify-center">
                <Package size={24} />
              </div>
              <h2 className="text-xl font-serif text-gray-800">Mes Adresses</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Gérez vos adresses de livraison et de facturation.
            </p>
            <div className="bg-gray-50 rounded p-4 text-center">
              <p className="text-sm text-gray-500 italic">Aucune adresse enregistrée</p>
            </div>
            {/* Futur lien : <Link href="/compte/adresses" className="...">Gérer mes adresses</Link> */}
          </div>

          {/* Carte : Mes Favoris */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#5d6e64] text-white rounded-full flex items-center justify-center">
                <User size={24} />
              </div>
              <h2 className="text-xl font-serif text-gray-800">Mes Favoris</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Retrouvez vos produits préférés en un clic.
            </p>
            <div className="bg-gray-50 rounded p-4 text-center">
              <p className="text-sm text-gray-500 italic">Aucun favori pour le moment</p>
            </div>
            {/* Futur lien : <Link href="/compte/favoris" className="...">Voir mes favoris</Link> */}
          </div>

        </div>

        {/* Lien retour à l'accueil */}
        <div className="text-center mt-8">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-800 transition">
            ← Retour à l'accueil
          </Link>
        </div>

      </div>
    </div>
  );
}

/**
 * ============================================
 * ÉVOLUTIONS FUTURES
 * ============================================
 *
 * 1. Créer /compte/commandes pour l'historique des commandes
 * 2. Créer /compte/parametres pour modifier les infos (nom, email, mot de passe)
 * 3. Créer /compte/adresses pour gérer les adresses de livraison
 * 4. Créer /compte/favoris pour les produits favoris
 * 5. Ajouter une section "Points de fidélité" ou "Code promo"
 *
 * ============================================
 */
