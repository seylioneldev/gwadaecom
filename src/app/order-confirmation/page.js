/**
 * PAGE : Confirmation de commande
 * =================================
 *
 * Page affichée après un paiement réussi.
 * Affiche les détails de la commande et le statut du paiement.
 *
 * 🆕 NOUVEAU FICHIER : src/app/order-confirmation/page.js
 * DATE : 2025-11-30
 */

"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  Package,
  Mail,
  Home,
  ArrowRight,
  MapPin,
  ShoppingBag,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/context/CartContext";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  limit,
} from "firebase/firestore";
import cmsConfig from "../../../cms.config";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const orderId = searchParams.get("order_id");
  const paymentIntentId = searchParams.get("payment_intent");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      if (!paymentIntentId) {
        router.push("/");
        return;
      }

      // Vider le panier maintenant que la commande est confirmée
      clearCart();

      try {
        let resolvedOrder = null;

        // Si on a un order_id, récupérer les détails de la commande
        if (orderId) {
          const orderRef = doc(db, cmsConfig.collections.orders, orderId);
          const orderSnap = await getDoc(orderRef);

          if (orderSnap.exists()) {
            resolvedOrder = { id: orderSnap.id, ...orderSnap.data() };
          }
        }

        // Fallback : si aucune commande trouvée via order_id, chercher par paymentIntentId
        if (!resolvedOrder && paymentIntentId) {
          try {
            const ordersRef = collection(db, cmsConfig.collections.orders);
            const q = query(
              ordersRef,
              where("paymentIntentId", "==", paymentIntentId),
              limit(1)
            );
            const querySnap = await getDocs(q);

            if (!querySnap.empty) {
              const docSnap = querySnap.docs[0];
              resolvedOrder = { id: docSnap.id, ...docSnap.data() };
            }
          } catch (err) {
            console.error(
              "Erreur lors de la recherche de la commande par paymentIntentId:",
              err
            );
          }
        }

        if (resolvedOrder) {
          setOrderData(resolvedOrder);
        } else {
          console.error("Commande non trouvée");
          setError("Commande non trouvée");
        }
      } catch (err) {
        console.error("Erreur lors de la récupération de la commande:", err);
        setError("Impossible de récupérer les détails de la commande");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [orderId, paymentIntentId, router, clearCart]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#5d6e64] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Vérification de votre commande...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail size={32} />
          </div>
          <h2 className="text-2xl font-serif text-gray-800 mb-2">Erreur</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#5d6e64] text-white px-6 py-3 rounded hover:bg-[#4a5850] transition"
          >
            <Home size={20} />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Confirmation visuelle */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6 text-center">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={48} />
            </div>

            <h1 className="text-3xl font-serif text-gray-800 mb-3">
              Merci pour votre commande !
            </h1>

            <p className="text-lg text-gray-600 mb-6">
              Votre paiement a été accepté avec succès.
            </p>

            <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
              <Package size={20} className="text-[#5d6e64]" />
              <div className="text-left">
                <p className="text-xs text-gray-500">Numéro de commande</p>
                <p className="font-mono font-semibold text-gray-800">
                  {orderData?.orderId ||
                    paymentIntentId?.slice(-12).toUpperCase() ||
                    "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Détails de la commande */}
          {orderData && (
            <>
              {/* Produits commandés */}
              <div className="bg-white rounded-lg shadow-md p-8 mb-6">
                <h2 className="text-xl font-serif text-gray-800 mb-4 flex items-center gap-2">
                  <ShoppingBag size={24} className="text-[#5d6e64]" />
                  Produits commandés
                </h2>

                <div className="space-y-4">
                  {orderData.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 pb-4 border-b last:border-b-0"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          Quantité : {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">
                          {item.total.toFixed(2)} €
                        </p>
                        <p className="text-sm text-gray-600">
                          {item.price.toFixed(2)} € / unité
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Totaux */}
                  <div className="pt-4 space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Sous-total</span>
                      <span>{orderData.subtotal.toFixed(2)} €</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Livraison</span>
                      <span>
                        {orderData.shipping === 0
                          ? "Gratuite"
                          : `${orderData.shipping.toFixed(2)} €`}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-gray-800 pt-2 border-t">
                      <span>Total</span>
                      <span>{orderData.total.toFixed(2)} €</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Adresse de livraison */}
              <div className="bg-white rounded-lg shadow-md p-8 mb-6">
                <h2 className="text-xl font-serif text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin size={24} className="text-[#5d6e64]" />
                  Adresse de livraison
                </h2>

                <div className="text-gray-600">
                  <p className="font-medium text-gray-800 mb-2">
                    {orderData.customer.firstName} {orderData.customer.lastName}
                  </p>
                  <p>{orderData.shippingAddress.address}</p>
                  <p>
                    {orderData.shippingAddress.postalCode}{" "}
                    {orderData.shippingAddress.city}
                  </p>
                  <p>{orderData.shippingAddress.country}</p>
                  {orderData.customer.phone && (
                    <p className="mt-2">Tél : {orderData.customer.phone}</p>
                  )}
                  <p className="mt-2">Email : {orderData.customer.email}</p>
                </div>
              </div>
            </>
          )}

          {/* Informations */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h2 className="text-xl font-serif text-gray-800 mb-4 flex items-center gap-2">
              <Mail size={24} className="text-[#5d6e64]" />
              Prochaines étapes
            </h2>

            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#5d6e64] text-white rounded-full flex items-center justify-center shrink-0 text-xs font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium text-gray-800 mb-1">
                    Email de confirmation
                  </p>
                  <p>
                    Vous recevrez un email de confirmation avec les détails de
                    votre commande dans quelques minutes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#5d6e64] text-white rounded-full flex items-center justify-center shrink-0 text-xs font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium text-gray-800 mb-1">
                    Préparation de votre commande
                  </p>
                  <p>
                    Nous préparons votre commande avec soin. Vous recevrez une
                    notification dès son expédition.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#5d6e64] text-white rounded-full flex items-center justify-center shrink-0 text-xs font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium text-gray-800 mb-1">Livraison</p>
                  <p>
                    Votre commande sera livrée sous 3 à 5 jours ouvrés à
                    l'adresse indiquée.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-6 py-3 rounded font-medium hover:border-[#5d6e64] hover:bg-gray-50 transition"
            >
              <Home size={20} />
              Retour à l'accueil
            </Link>

            <Link
              href="/compte"
              className="flex items-center justify-center gap-2 bg-[#5d6e64] text-white px-6 py-3 rounded font-medium hover:bg-[#4a5850] transition"
            >
              Voir mes commandes
              <ArrowRight size={20} />
            </Link>
          </div>

          {/* Informations supplémentaires */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Besoin d'aide ?</strong> Contactez notre service client à{" "}
              <a href="mailto:support@gwadecom.com" className="underline">
                support@gwadecom.com
              </a>{" "}
              ou consultez notre{" "}
              <Link href="/faq" className="underline">
                FAQ
              </Link>
              .
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#5d6e64] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}

/**
 * ============================================
 * GUIDE D'UTILISATION
 * ============================================
 *
 * ACCÈS : /order-confirmation?payment_intent=pi_xxxxx
 *
 * FONCTIONNALITÉS :
 * - Affiche la confirmation de paiement
 * - Affiche le numéro de commande
 * - Explique les prochaines étapes
 * - Liens vers l'accueil et l'espace compte
 *
 * TODO :
 * - Récupérer les détails de la commande depuis Firestore
 * - Afficher la liste des produits commandés
 * - Afficher l'adresse de livraison
 * - Ajouter le suivi de commande
 *
 * ============================================
 */
