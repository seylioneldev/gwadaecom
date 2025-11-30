/**
 * PAGE ADMIN : Statistiques
 * ===========================
 *
 * Tableau de bord des statistiques de vente et performances.
 *
 * 🆕 NOUVEAU FICHIER CRÉÉ : src/app/admin/commercial/statistics/page.js
 * DATE : 2025-11-30
 *
 * FONCTIONNALITÉS :
 * - Statistiques de ventes (CA, nombre de commandes, panier moyen)
 * - Graphiques de performance
 * - Produits les plus vendus
 * - Évolution des ventes
 */

"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, DollarSign, ShoppingCart, Users, Package } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';

export default function StatisticsPage() {
  const { products } = useProducts();

  // Statistiques mockées (à remplacer par de vraies données)
  const stats = {
    totalRevenue: 12450.50,
    totalOrders: 87,
    averageBasket: 143.10,
    totalCustomers: 234,
    topProducts: products.slice(0, 5)
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">

        {/* En-tête */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin"
            className="p-2 hover:bg-gray-200 rounded-full transition"
            title="Retour au dashboard"
          >
            <ArrowLeft size={24} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-serif text-gray-800 mb-2">Statistiques</h1>
            <p className="text-sm text-gray-500">Analyse des performances de votre boutique</p>
          </div>
        </div>

        {/* Cartes de statistiques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

          {/* Chiffre d'affaires */}
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs uppercase tracking-wider text-gray-500">Chiffre d'affaires</p>
              <DollarSign className="text-green-500" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.totalRevenue.toFixed(2)} €</p>
            <p className="text-xs text-green-600 mt-2">+12% ce mois</p>
          </div>

          {/* Nombre de commandes */}
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs uppercase tracking-wider text-gray-500">Commandes</p>
              <ShoppingCart className="text-blue-500" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.totalOrders}</p>
            <p className="text-xs text-blue-600 mt-2">+5 aujourd'hui</p>
          </div>

          {/* Panier moyen */}
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs uppercase tracking-wider text-gray-500">Panier moyen</p>
              <TrendingUp className="text-purple-500" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.averageBasket.toFixed(2)} €</p>
            <p className="text-xs text-purple-600 mt-2">+8% vs mois dernier</p>
          </div>

          {/* Clients */}
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs uppercase tracking-wider text-gray-500">Clients</p>
              <Users className="text-orange-500" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.totalCustomers}</p>
            <p className="text-xs text-orange-600 mt-2">+18 ce mois</p>
          </div>

        </div>

        {/* Produits les plus vendus */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-10">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b">
            <Package className="text-[#5d6e64]" size={24} />
            <h2 className="text-xl font-serif text-gray-800">Produits les Plus Vendus</h2>
          </div>

          {stats.topProducts.length === 0 ? (
            <p className="text-center text-gray-500 py-10">Aucune donnée de vente disponible</p>
          ) : (
            <div className="space-y-4">
              {stats.topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-gray-300">#{index + 1}</span>
                    <div>
                      <h3 className="font-serif text-gray-800">{product.name}</h3>
                      <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">${product.price}</p>
                    <p className="text-xs text-gray-500">{Math.floor(Math.random() * 50) + 10} ventes</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Graphique placeholder */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-serif text-gray-800 mb-6">Évolution des Ventes (30 derniers jours)</h2>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 h-64 rounded-lg flex items-center justify-center">
            <p className="text-gray-500 text-sm">
              📊 Graphique à venir - Intégration future avec une bibliothèque de charts
            </p>
          </div>
        </div>

        {/* Note */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-yellow-900 mb-2">ℹ️ Note</h3>
          <p className="text-xs text-yellow-800">
            Les données affichées sont actuellement mockées. Pour afficher de vraies statistiques,
            connectez cette page à une collection Firestore "orders" contenant vos commandes.
          </p>
        </div>

      </div>
    </div>
  );
}
