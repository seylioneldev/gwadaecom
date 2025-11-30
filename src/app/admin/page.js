/**
 * PAGE ADMIN : Tableau de Bord Principal
 * ========================================
 *
 * Page d'accueil de l'interface d'administration.
 * Présente toutes les fonctionnalités du CMS avec des boutons de navigation.
 *
 * 📄 FICHIER MODIFIÉ : src/app/admin/page.js
 * DATE : 2025-11-30
 *
 * CHANGEMENT : Transformé en dashboard avec navigation vers toutes les fonctionnalités
 */

"use client";

import Link from 'next/link';
import { Package, FolderTree, Settings, ShoppingBag, BarChart3, FileText, TrendingUp, Users, Truck, ShoppingCart, FileCheck } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';

export default function AdminDashboard() {
  // Récupération des statistiques
  const { products, loading: productsLoading } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-[#5d6e64] text-white py-8 px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-serif mb-2">Tableau de Bord Admin</h1>
          <p className="text-sm text-white/80">Gérez votre boutique en ligne facilement</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-10">

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Stat 1 : Produits */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Produits</p>
                <p className="text-3xl font-bold text-gray-800">
                  {productsLoading ? '...' : products.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          {/* Stat 2 : Catégories */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Catégories</p>
                <p className="text-3xl font-bold text-gray-800">
                  {categoriesLoading ? '...' : categories.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FolderTree className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          {/* Stat 3 : Status */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">Status</p>
                <p className="text-lg font-semibold text-green-600">En ligne</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <BarChart3 className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Titre des actions - Gestion du site */}
        <h2 className="text-2xl font-serif text-gray-800 mb-6">Gestion du Site</h2>

        {/* Grille des fonctionnalités */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Carte 1 : Ajouter un Produit */}
          <Link href="/admin/add-product" className="group">
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition border-2 border-transparent hover:border-[#5d6e64]">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition">
                <ShoppingBag className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-serif text-gray-800 mb-2">Ajouter un Produit</h3>
              <p className="text-sm text-gray-500">
                Créez un nouveau produit avec nom, prix, catégorie et image
              </p>
            </div>
          </Link>

          {/* Carte 2 : Gérer les Produits */}
          <Link href="/admin/products" className="group">
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition border-2 border-transparent hover:border-[#5d6e64]">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition">
                <Package className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-serif text-gray-800 mb-2">Gérer les Produits</h3>
              <p className="text-sm text-gray-500">
                Modifier, supprimer ou rechercher vos produits existants
              </p>
            </div>
          </Link>

          {/* Carte 3 : Gérer les Catégories */}
          <Link href="/admin/categories" className="group">
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition border-2 border-transparent hover:border-[#5d6e64]">
              <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-200 transition">
                <FolderTree className="text-yellow-600" size={32} />
              </div>
              <h3 className="text-xl font-serif text-gray-800 mb-2">Gérer les Catégories</h3>
              <p className="text-sm text-gray-500">
                Organisez le menu de navigation et l'ordre des catégories
              </p>
            </div>
          </Link>

          {/* Carte 4 : Paramètres du Site */}
          <Link href="/admin/settings" className="group">
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition border-2 border-transparent hover:border-[#5d6e64]">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition">
                <Settings className="text-purple-600" size={32} />
              </div>
              <h3 className="text-xl font-serif text-gray-800 mb-2">Paramètres du Site</h3>
              <p className="text-sm text-gray-500">
                Configurez les informations générales, réseaux sociaux et boutique
              </p>
            </div>
          </Link>

          {/* Carte 5 : Documentation */}
          <Link href="/" target="_blank" className="group">
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition border-2 border-transparent hover:border-gray-300">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gray-200 transition">
                <FileText className="text-gray-600" size={32} />
              </div>
              <h3 className="text-xl font-serif text-gray-800 mb-2">Voir le Site</h3>
              <p className="text-sm text-gray-500">
                Prévisualisez votre boutique en ligne telle qu'elle apparaît aux visiteurs
              </p>
            </div>
          </Link>

          {/* Carte 6 : Documentation CMS */}
          <div className="bg-gradient-to-br from-[#5d6e64] to-[#4a5850] p-8 rounded-lg shadow-md text-white">
            <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center mb-4">
              <FileText className="text-white" size={32} />
            </div>
            <h3 className="text-xl font-serif mb-2">Documentation</h3>
            <p className="text-sm text-white/80 mb-4">
              Consultez le fichier CMS_README.md pour apprendre à utiliser et transférer ce CMS
            </p>
            <div className="text-xs bg-white/10 px-3 py-2 rounded">
              📄 CMS_README.md
            </div>
          </div>

        </div>

        {/* SECTION COMMERCIAL */}
        <h2 className="text-2xl font-serif text-gray-800 mb-6 mt-16 pt-8 border-t">Commercial & Gestion</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Carte : Statistiques */}
          <Link href="/admin/commercial/statistics" className="group">
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition border-2 border-transparent hover:border-[#5d6e64]">
              <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition">
                <TrendingUp className="text-indigo-600" size={32} />
              </div>
              <h3 className="text-xl font-serif text-gray-800 mb-2">Statistiques</h3>
              <p className="text-sm text-gray-500">
                Visualisez les ventes, revenus et performances de votre boutique
              </p>
            </div>
          </Link>

          {/* Carte : Commandes */}
          <Link href="/admin/commercial/orders" className="group">
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition border-2 border-transparent hover:border-[#5d6e64]">
              <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-200 transition">
                <ShoppingCart className="text-orange-600" size={32} />
              </div>
              <h3 className="text-xl font-serif text-gray-800 mb-2">Commandes</h3>
              <p className="text-sm text-gray-500">
                Gérez les commandes clients, statuts de livraison et suivi
              </p>
            </div>
          </Link>

          {/* Carte : Partenaires */}
          <Link href="/admin/commercial/partners" className="group">
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition border-2 border-transparent hover:border-[#5d6e64]">
              <div className="w-16 h-16 bg-pink-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-pink-200 transition">
                <Users className="text-pink-600" size={32} />
              </div>
              <h3 className="text-xl font-serif text-gray-800 mb-2">Partenaires</h3>
              <p className="text-sm text-gray-500">
                Gérez vos partenaires commerciaux et collaborations
              </p>
            </div>
          </Link>

          {/* Carte : Fournisseurs */}
          <Link href="/admin/commercial/suppliers" className="group">
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition border-2 border-transparent hover:border-[#5d6e64]">
              <div className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-teal-200 transition">
                <Truck className="text-teal-600" size={32} />
              </div>
              <h3 className="text-xl font-serif text-gray-800 mb-2">Fournisseurs</h3>
              <p className="text-sm text-gray-500">
                Gérez vos fournisseurs, contacts et approvisionnements
              </p>
            </div>
          </Link>

          {/* Carte : Facturation */}
          <Link href="/admin/commercial/invoicing" className="group">
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition border-2 border-transparent hover:border-[#5d6e64]">
              <div className="w-16 h-16 bg-cyan-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-cyan-200 transition">
                <FileCheck className="text-cyan-600" size={32} />
              </div>
              <h3 className="text-xl font-serif text-gray-800 mb-2">Facturation</h3>
              <p className="text-sm text-gray-500">
                Générez et gérez les factures, devis et paiements
              </p>
            </div>
          </Link>

        </div>

        {/* Aide rapide */}
        <div className="mt-10 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <span>💡</span> Guide Rapide
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <strong>Pour commencer :</strong>
              <ol className="list-decimal list-inside mt-2 space-y-1 text-xs">
                <li>Créez vos catégories de menu</li>
                <li>Ajoutez vos premiers produits</li>
                <li>Configurez les paramètres du site</li>
                <li>Prévisualisez votre boutique</li>
              </ol>
            </div>
            <div>
              <strong>Raccourcis utiles :</strong>
              <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
                <li><code className="bg-blue-100 px-1 py-0.5 rounded">/admin/products</code> - Modifier produits</li>
                <li><code className="bg-blue-100 px-1 py-0.5 rounded">/admin/categories</code> - Gérer menu</li>
                <li><code className="bg-blue-100 px-1 py-0.5 rounded">/admin/settings</code> - Paramètres site</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer admin */}
        <div className="mt-10 text-center text-sm text-gray-500">
          <p>CMS Réutilisable • Créé avec Next.js 15 + Firebase Firestore</p>
          <p className="text-xs mt-1">Consultez CMS_README.md pour transférer ce CMS sur d'autres projets</p>
        </div>

      </div>
    </div>
  );
}

/**
 * ============================================
 * GUIDE D'UTILISATION
 * ============================================
 *
 * Cette page est le tableau de bord principal de l'admin.
 * Elle présente :
 *
 * 1. STATISTIQUES EN TEMPS RÉEL :
 *    - Nombre de produits
 *    - Nombre de catégories
 *    - Status du site
 *
 * 2. NAVIGATION VERS LES FONCTIONNALITÉS :
 *    - Ajouter un produit (/admin/add-product)
 *    - Gérer les produits (/admin/products)
 *    - Gérer les catégories (/admin/categories)
 *    - Paramètres du site (/admin/settings)
 *    - Voir le site (/)
 *
 * 3. GUIDE RAPIDE :
 *    - Étapes pour démarrer
 *    - Raccourcis utiles
 *
 * ACCÈS : /admin
 *
 * ============================================
 */
