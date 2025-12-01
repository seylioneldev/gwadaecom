/**
 * PAGE : Historique des Commandes
 * ==================================
 *
 * Page dédiée à l'historique complet des commandes d'un utilisateur.
 *
 * 🆕 NOUVEAU FICHIER : src/app/compte/commandes/page.js
 * DATE : 2025-12-01
 */

"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Package, Eye, X } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import cmsConfig from '../../../../cms.config';

export default function CommandesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Redirection si non connecté
  useEffect(() => {
    if (!loading && !user) {
      router.push('/mon-compte');
    }
  }, [user, loading, router]);

  // Récupérer toutes les commandes de l'utilisateur
  useEffect(() => {
    if (!user?.email) {
      setOrdersLoading(false);
      return;
    }

    const ordersQuery = query(
      collection(db, cmsConfig.collections.orders),
      where('customer.email', '==', user.email),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      }));
      setOrders(ordersData);
      setOrdersLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Formater la date
  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Obtenir le statut en français
  const getStatusLabel = (status) => {
    const statusLabels = {
      paid: 'Payée',
      processing: 'En préparation',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      cancelled: 'Annulée'
    };
    return statusLabels[status] || status;
  };

  // Obtenir la couleur du statut
  const getStatusColor = (status) => {
    const colors = {
      paid: 'bg-green-100 text-green-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-emerald-100 text-emerald-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Afficher un loader pendant la vérification
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#5d6e64] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">

        {/* En-tête */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/compte" className="p-2 hover:bg-white rounded-full transition">
            <ArrowLeft size={24} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-serif text-gray-800 mb-2">Mes Commandes</h1>
            <p className="text-sm text-gray-500">
              {ordersLoading ? 'Chargement...' : `${orders.length} commande${orders.length > 1 ? 's' : ''} au total`}
            </p>
          </div>
        </div>

        {/* Liste des commandes */}
        {ordersLoading ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="w-16 h-16 border-4 border-[#5d6e64] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Chargement de vos commandes...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Package size={48} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Vous n'avez pas encore passé de commande</p>
            <Link
              href="/"
              className="inline-block bg-[#5d6e64] text-white px-6 py-3 rounded hover:bg-[#4a5850] transition"
            >
              Découvrir nos produits
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-mono text-lg font-semibold text-gray-800 mb-1">
                      {order.orderId}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Commandé le {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                      title="Voir détails"
                    >
                      <Eye size={20} />
                    </button>
                  </div>
                </div>

                {/* Résumé des produits */}
                <div className="border-t pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Articles</p>
                      <p className="font-medium text-gray-800">
                        {order.items?.length || 0} produit{order.items?.length > 1 ? 's' : ''}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Adresse de livraison</p>
                      <p className="font-medium text-gray-800">
                        {order.shippingAddress?.city}, {order.shippingAddress?.country}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">Total</p>
                      <p className="text-xl font-bold text-gray-800">
                        {order.total?.toFixed(2)} €
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
              {/* Statut */}
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded">
                <span className="text-sm font-medium text-gray-600">Statut de la commande</span>
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(selectedOrder.status)}`}>
                  {getStatusLabel(selectedOrder.status)}
                </span>
              </div>

              {/* Informations client */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Informations de livraison</h3>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="font-medium">{selectedOrder.customer.firstName} {selectedOrder.customer.lastName}</p>
                  <p className="text-sm text-gray-600 mt-1">{selectedOrder.shippingAddress.address}</p>
                  <p className="text-sm text-gray-600">
                    {selectedOrder.shippingAddress.postalCode} {selectedOrder.shippingAddress.city}
                  </p>
                  <p className="text-sm text-gray-600">{selectedOrder.shippingAddress.country}</p>
                  {selectedOrder.customer.phone && (
                    <p className="text-sm text-gray-600 mt-2">Tél : {selectedOrder.customer.phone}</p>
                  )}
                  <p className="text-sm text-gray-600 mt-1">Email : {selectedOrder.customer.email}</p>
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

              {/* Date de commande */}
              <div className="bg-blue-50 p-4 rounded">
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
