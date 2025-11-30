/**
 * PAGE ADMIN : Commandes
 * ========================
 *
 * Gestion des commandes clients.
 *
 * 🆕 NOUVEAU FICHIER CRÉÉ : src/app/admin/commercial/orders/page.js
 * DATE : 2025-11-30
 */

"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Search, Filter, Eye, Check, X, Clock } from 'lucide-react';

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Commandes mockées
  const mockOrders = [
    { id: '001', customer: 'Jean Dupont', total: 156.90, status: 'delivered', date: '2025-11-28', items: 3 },
    { id: '002', customer: 'Marie Martin', total: 89.50, status: 'pending', date: '2025-11-29', items: 2 },
    { id: '003', customer: 'Pierre Durand', total: 234.00, status: 'shipped', date: '2025-11-29', items: 5 },
    { id: '004', customer: 'Sophie Blanc', total: 67.30, status: 'pending', date: '2025-11-30', items: 1 },
  ];

  const statusConfig = {
    pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    shipped: { label: 'Expédiée', color: 'bg-blue-100 text-blue-800', icon: ShoppingCart },
    delivered: { label: 'Livrée', color: 'bg-green-100 text-green-800', icon: Check },
    cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-800', icon: X },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">

        {/* En-tête */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="p-2 hover:bg-gray-200 rounded-full transition">
            <ArrowLeft size={24} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-serif text-gray-800 mb-2">Gestion des Commandes</h1>
            <p className="text-sm text-gray-500">Suivez et gérez toutes les commandes clients</p>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 pl-10 pr-4 py-2 text-sm"
                placeholder="Rechercher par numéro de commande ou client..."
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 px-4 py-2 text-sm"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="shipped">Expédiées</option>
              <option value="delivered">Livrées</option>
              <option value="cancelled">Annulées</option>
            </select>
          </div>
        </div>

        {/* Liste des commandes */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-600">N° Commande</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-600">Client</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-600">Date</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-600">Articles</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-600">Total</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-600">Statut</th>
                <th className="px-6 py-4 text-right text-xs uppercase tracking-wider text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {mockOrders.map((order) => {
                const StatusIcon = statusConfig[order.status].icon;
                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-sm">#{order.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{order.customer}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{order.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{order.items} produit(s)</td>
                    <td className="px-6 py-4 font-semibold text-gray-800">{order.total.toFixed(2)} €</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusConfig[order.status].color}`}>
                        <StatusIcon size={12} />
                        {statusConfig[order.status].label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-blue-600 hover:bg-blue-100 rounded" title="Voir détails">
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Note */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-yellow-900 mb-2">ℹ️ Note</h3>
          <p className="text-xs text-yellow-800">
            Cette page affiche des commandes mockées. Pour gérer de vraies commandes, créez une collection Firestore "orders"
            et connectez-la avec un hook useOrders similaire à useProducts.
          </p>
        </div>

      </div>
    </div>
  );
}
