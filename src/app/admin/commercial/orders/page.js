/**
 * PAGE ADMIN : Commandes
 * ========================
 *
 * Gestion des commandes clients avec données Firestore.
 *
 * 🔧 FICHIER MODIFIÉ : src/app/admin/commercial/orders/page.js
 * DATE : 2025-12-01
 */

"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Search, Eye, Check, X, Clock, Package, Loader } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import cmsConfig from '../../../../../cms.config';

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Récupérer les commandes depuis Firestore
  useEffect(() => {
    const ordersQuery = query(
      collection(db, cmsConfig.collections.orders),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      }));
      setOrders(ordersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const statusConfig = {
    paid: { label: 'Payée', color: 'bg-green-100 text-green-800', icon: Check },
    processing: { label: 'En préparation', color: 'bg-blue-100 text-blue-800', icon: Package },
    shipped: { label: 'Expédiée', color: 'bg-purple-100 text-purple-800', icon: ShoppingCart },
    delivered: { label: 'Livrée', color: 'bg-emerald-100 text-emerald-800', icon: Check },
    cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-800', icon: X },
  };

  // Filtrer les commandes
  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${order.customer?.firstName} ${order.customer?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Mettre à jour le statut d'une commande
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, cmsConfig.collections.orders, orderId);
      await updateDoc(orderRef, {
        status: newStatus,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  // Formater la date
  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
            <p className="text-sm text-gray-500">
              {loading ? 'Chargement...' : `${orders.length} commande${orders.length > 1 ? 's' : ''} au total`}
            </p>
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
                className="w-full border border-gray-300 pl-10 pr-4 py-2 text-sm rounded"
                placeholder="Rechercher par numéro, email ou nom..."
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 px-4 py-2 text-sm rounded"
            >
              <option value="all">Tous les statuts</option>
              <option value="paid">Payées</option>
              <option value="processing">En préparation</option>
              <option value="shipped">Expédiées</option>
              <option value="delivered">Livrées</option>
              <option value="cancelled">Annulées</option>
            </select>
          </div>
        </div>

        {/* Liste des commandes */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Loader size={48} className="animate-spin text-[#5d6e64] mx-auto mb-4" />
            <p className="text-gray-600">Chargement des commandes...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <ShoppingCart size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all'
                ? 'Aucune commande ne correspond aux critères de recherche'
                : 'Aucune commande pour le moment'}
            </p>
          </div>
        ) : (
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
                {filteredOrders.map((order) => {
                  const StatusIcon = statusConfig[order.status]?.icon || Clock;
                  const statusStyle = statusConfig[order.status] || statusConfig.paid;

                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-mono text-sm">{order.orderId}</td>
                      <td className="px-6 py-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-800">
                            {order.customer.firstName} {order.customer.lastName}
                          </p>
                          <p className="text-xs text-gray-500">{order.customer.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatDate(order.createdAt)}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{order.items?.length || 0} produit(s)</td>
                      <td className="px-6 py-4 font-semibold text-gray-800">{order.total?.toFixed(2)} €</td>
                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusStyle.color} border-0 cursor-pointer`}
                        >
                          <option value="paid">Payée</option>
                          <option value="processing">En préparation</option>
                          <option value="shipped">Expédiée</option>
                          <option value="delivered">Livrée</option>
                          <option value="cancelled">Annulée</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                          title="Voir détails"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Modal détails de la commande */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-2xl font-serif text-gray-800">
                Commande {selectedOrder.orderId}
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Informations client */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Informations client</h3>
                <div className="bg-gray-50 p-4 rounded">
                  <p><span className="font-medium">Nom :</span> {selectedOrder.customer.firstName} {selectedOrder.customer.lastName}</p>
                  <p><span className="font-medium">Email :</span> {selectedOrder.customer.email}</p>
                  {selectedOrder.customer.phone && (
                    <p><span className="font-medium">Téléphone :</span> {selectedOrder.customer.phone}</p>
                  )}
                </div>
              </div>

              {/* Adresse de livraison */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Adresse de livraison</h3>
                <div className="bg-gray-50 p-4 rounded">
                  <p>{selectedOrder.shippingAddress.address}</p>
                  <p>{selectedOrder.shippingAddress.postalCode} {selectedOrder.shippingAddress.city}</p>
                  <p>{selectedOrder.shippingAddress.country}</p>
                </div>
              </div>

              {/* Produits commandés */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Produits commandés</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-50 p-4 rounded">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">Quantité : {item.quantity} × {item.price.toFixed(2)} €</p>
                      </div>
                      <p className="font-semibold">{item.total.toFixed(2)} €</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totaux */}
              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span>Sous-total</span>
                  <span>{selectedOrder.subtotal?.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Livraison</span>
                  <span>{selectedOrder.shipping === 0 ? 'Gratuite' : `${selectedOrder.shipping.toFixed(2)} €`}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>{selectedOrder.total?.toFixed(2)} €</span>
                </div>
              </div>

              {/* Informations paiement */}
              <div className="bg-blue-50 p-4 rounded">
                <p className="text-sm"><span className="font-medium">ID Paiement Stripe :</span> {selectedOrder.paymentIntentId}</p>
                <p className="text-sm"><span className="font-medium">Date de commande :</span> {formatDate(selectedOrder.createdAt)}</p>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full bg-gray-800 text-white py-3 rounded hover:bg-gray-700 transition"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
