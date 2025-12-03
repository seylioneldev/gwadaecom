/**
 * COMPOSANT : Formulaire de Paiement Stripe
 * ===========================================
 *
 * Intègre Stripe Elements pour accepter les paiements par carte bancaire.
 * Utilise le Payment Intent créé par l'API route.
 *
 * 🆕 NOUVEAU FICHIER : src/components/StripePaymentForm.jsx
 * DATE : 2025-11-30
 */

"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { CreditCard, Lock, AlertCircle, CheckCircle } from "lucide-react";

// Initialiser Stripe avec la clé publique
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

/**
 * COMPOSANT INTERNE : Formulaire de paiement
 * ===========================================
 * Ce composant doit être wrappé dans <Elements>
 */
function PaymentForm({
  onSuccess,
  onError,
  amount,
  customerEmail,
  orderId,
  orderDocId,
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      console.log("Stripe ou Elements non chargé");
      return; // Stripe.js n'est pas encore chargé
    }

    setIsProcessing(true);
    setErrorMessage("");

    try {
      console.log("Tentative de confirmation du paiement...");

      // Confirmer le paiement
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: orderDocId
            ? `${
                window.location.origin
              }/order-confirmation?order_id=${encodeURIComponent(orderDocId)}`
            : `${window.location.origin}/order-confirmation`,
        },
        redirect: "if_required", // Ne redirige que si nécessaire (3D Secure)
      });

      console.log("Résultat Stripe:", { error, paymentIntent });

      if (error) {
        // Erreur lors du paiement
        console.error("Erreur Stripe:", error);
        setErrorMessage(error.message || "Erreur de paiement inconnue");
        if (onError) {
          onError(error);
        }
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        // Paiement réussi !
        console.log("Paiement réussi !", paymentIntent);
        if (onSuccess) {
          onSuccess(paymentIntent, orderDocId);
        }
      }
    } catch (err) {
      console.error("Exception lors du paiement:", err);
      setErrorMessage("Une erreur inattendue est survenue");
      if (onError) {
        onError(err);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* En-tête sécurisé */}
      <div className="flex items-center gap-2 text-sm text-gray-600 bg-green-50 border border-green-200 rounded-lg p-3">
        <Lock size={16} className="text-green-600" />
        <span>Paiement sécurisé par Stripe</span>
      </div>

      {/* Stripe Payment Element (formulaire de carte) */}
      <div className="border border-gray-300 rounded-lg p-4 bg-white">
        <PaymentElement
          options={{
            layout: "tabs",
          }}
        />
      </div>

      {/* Message d'erreur */}
      {errorMessage && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <p className="text-sm">{errorMessage}</p>
        </div>
      )}

      {/* Bouton de soumission */}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-[#5d6e64] text-white py-3 rounded font-medium hover:bg-[#4a5850] transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Traitement en cours...</span>
          </>
        ) : (
          <>
            <CreditCard size={20} />
            <span>Payer {(amount / 100).toFixed(2)}€</span>
          </>
        )}
      </button>

      {/* Informations de test */}
      {process.env.NODE_ENV === "development" && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
          <p className="font-semibold mb-2">🧪 Mode Test - Carte de test :</p>
          <p>
            Numéro :{" "}
            <code className="bg-white px-2 py-1 rounded">
              4242 4242 4242 4242
            </code>
          </p>
          <p>
            Date : <code className="bg-white px-2 py-1 rounded">12/34</code>
          </p>
          <p>
            CVC : <code className="bg-white px-2 py-1 rounded">123</code>
          </p>
        </div>
      )}
    </form>
  );
}

/**
 * COMPOSANT PRINCIPAL : Wrapper Stripe Payment Form
 * ==================================================
 */
export default function StripePaymentForm({
  amount,
  customerEmail,
  orderId,
  items,
  customer,
  shippingAddress,
  onSuccess,
  onError,
}) {
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orderDocId, setOrderDocId] = useState(null);

  /**
   * Créer le Payment Intent au montage du composant
   */
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Math.round(amount), // Montant en centimes (fallback)
            currency: "eur",
            customerEmail,
            orderId,
            items,
            customer,
            shippingAddress,
          }),
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la création du paiement");
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
        setOrderDocId(data.orderDocId || null);
      } catch (err) {
        console.error("Erreur:", err);
        setError("Impossible d'initialiser le paiement. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [amount, customerEmail, orderId, items, customer, shippingAddress]);

  // Loader pendant la création du Payment Intent
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="w-12 h-12 border-4 border-[#5d6e64] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Initialisation du paiement...</p>
      </div>
    );
  }

  // Erreur lors de la création du Payment Intent
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold mb-1">Erreur</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Afficher le formulaire de paiement
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-[#5d6e64] text-white rounded-full flex items-center justify-center">
          <CreditCard size={20} />
        </div>
        <div>
          <h2 className="text-xl font-serif text-gray-800">Paiement</h2>
          <p className="text-sm text-gray-500">
            Entrez vos informations de carte bancaire
          </p>
        </div>
      </div>

      {clientSecret && (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: "stripe",
              variables: {
                colorPrimary: "#5d6e64",
                colorBackground: "#ffffff",
                colorText: "#1f2937",
                colorDanger: "#ef4444",
                fontFamily: "system-ui, sans-serif",
                borderRadius: "8px",
              },
            },
          }}
        >
          <PaymentForm
            onSuccess={onSuccess}
            onError={onError}
            amount={amount}
            customerEmail={customerEmail}
            orderId={orderId}
            orderDocId={orderDocId}
          />
        </Elements>
      )}
    </div>
  );
}

/**
 * ============================================
 * GUIDE D'UTILISATION
 * ============================================
 *
 * UTILISATION :
 *
 * ```jsx
 * import StripePaymentForm from '@/components/StripePaymentForm';
 *
 * <StripePaymentForm
 *   amount={5000} // $50.00 en centimes
 *   customerEmail="client@example.com"
 *   orderId="ORDER-12345"
 *   onSuccess={(paymentIntent) => {
 *     console.log('Paiement réussi !', paymentIntent);
 *     router.push('/order-confirmation');
 *   }}
 *   onError={(error) => {
 *     console.error('Erreur de paiement:', error);
 *   }}
 * />
 * ```
 *
 * PROPS :
 * - amount: number (OBLIGATOIRE) - Montant en centimes
 * - customerEmail: string - Email du client
 * - orderId: string - Référence de la commande
 * - onSuccess: function - Callback appelé en cas de succès
 * - onError: function - Callback appelé en cas d'erreur
 *
 * CARTES DE TEST :
 * - Paiement réussi : 4242 4242 4242 4242
 * - Paiement refusé : 4000 0000 0000 0002
 * - 3D Secure requis : 4000 0025 0000 3155
 *
 * ============================================
 */
