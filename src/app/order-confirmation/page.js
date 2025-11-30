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

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Mail, Home, ArrowRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paymentIntentId = searchParams.get('payment_intent');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!paymentIntentId) {
      // Si pas de payment intent, rediriger vers l'accueil
      router.push('/');
    } else {
      // Simuler un chargement (en attendant l'intégration Firestore)
      setTimeout(() => setLoading(false), 1000);
    }
  }, [paymentIntentId, router]);

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
                  {paymentIntentId ? paymentIntentId.slice(-12).toUpperCase() : 'N/A'}
                </p>
              </div>
            </div>
          </div>

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
                  <p className="font-medium text-gray-800 mb-1">Email de confirmation</p>
                  <p>Vous recevrez un email de confirmation avec les détails de votre commande dans quelques minutes.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#5d6e64] text-white rounded-full flex items-center justify-center shrink-0 text-xs font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium text-gray-800 mb-1">Préparation de votre commande</p>
                  <p>Nous préparons votre commande avec soin. Vous recevrez une notification dès son expédition.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#5d6e64] text-white rounded-full flex items-center justify-center shrink-0 text-xs font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium text-gray-800 mb-1">Livraison</p>
                  <p>Votre commande sera livrée sous 3 à 5 jours ouvrés à l'adresse indiquée.</p>
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
              <strong>Besoin d'aide ?</strong> Contactez notre service client à{' '}
              <a href="mailto:support@gwadecom.com" className="underline">
                support@gwadecom.com
              </a>
              {' '}ou consultez notre{' '}
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
