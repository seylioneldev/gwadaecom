/**
 * API ROUTE : Créer un Payment Intent Stripe
 * ============================================
 *
 * Cette route API côté serveur crée un Payment Intent Stripe
 * pour traiter les paiements de manière sécurisée.
 *
 * 🆕 NOUVEAU FICHIER : src/app/api/create-payment-intent/route.js
 * DATE : 2025-11-30
 */

import { NextResponse } from "next/server";
import Stripe from "stripe";
import admin, { adminDb } from "@/lib/firebase-admin";
import cmsConfig from "../../../../cms.config";

// Initialiser Stripe avec la clé secrète (côté serveur uniquement)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-12-18.acacia",
});

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      amount,
      currency = "usd",
      customerEmail,
      orderId,
      items,
      customer,
      shippingAddress,
    } = body;

    let finalAmountInCents = null;
    const orderItems = [];

    // Si un panier d'articles est fourni, recalculer le montant côté serveur
    if (Array.isArray(items) && items.length > 0 && adminDb) {
      try {
        const productsCollection = adminDb.collection(
          cmsConfig.collections.products
        );

        let computedTotal = 0;

        for (const item of items) {
          if (!item || !item.id || !item.quantity || item.quantity <= 0) {
            continue;
          }

          const productSnap = await productsCollection
            .doc(String(item.id))
            .get();

          if (!productSnap.exists) {
            continue;
          }

          const productData = productSnap.data() || {};
          const price = Number(productData.price);
          const quantity = Number(item.quantity);

          if (
            !Number.isFinite(price) ||
            price <= 0 ||
            !Number.isFinite(quantity) ||
            quantity <= 0
          ) {
            continue;
          }

          if (typeof productData.stock === "number") {
            const availableStock = Number(productData.stock);
            if (Number.isFinite(availableStock) && quantity > availableStock) {
              return NextResponse.json(
                {
                  error: `Stock insuffisant pour le produit "${
                    productData.name || ""
                  }"`,
                  productId: String(item.id),
                  requestedQuantity: quantity,
                  availableStock,
                },
                { status: 400 }
              );
            }
          }

          // price est supposé être en euros côté Firestore, convertir en centimes
          const lineTotal = price * quantity;
          computedTotal += Math.round(price * 100) * quantity;

          orderItems.push({
            id: item.id,
            name: productData.name || "",
            price,
            quantity,
            total: lineTotal,
          });
        }

        if (computedTotal > 0) {
          finalAmountInCents = computedTotal;
        }
      } catch (firestoreError) {
        console.error(
          "Erreur lors du recalcul des prix via Firestore (fallback sur amount):",
          firestoreError
        );
        // On laisse finalAmountInCents à null pour utiliser le fallback amount
      }
    }

    // Fallback : si aucun panier valide n'est fourni ou si adminDb n'est pas dispo,
    // utiliser le montant reçu (pour compatibilité), mais en l'arrondissant proprement.
    if (finalAmountInCents === null) {
      if (!amount || amount <= 0) {
        return NextResponse.json(
          { error: "Le montant doit être supérieur à 0" },
          { status: 400 }
        );
      }

      finalAmountInCents = Math.round(amount);
    }

    // Créer le Payment Intent avec le montant validé côté serveur
    const safeOrderId = orderId || `ORDER-${Date.now()}`;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalAmountInCents,
      currency: currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true, // Active tous les moyens de paiement disponibles
      },
      metadata: {
        orderId: safeOrderId,
        customerEmail: customerEmail || "guest",
      },
      description: `Commande ${safeOrderId}`,
    });

    // Créer la commande côté serveur en statut pending (si Firebase Admin est disponible)
    let orderDocId = null;

    if (adminDb) {
      try {
        const ordersCollection = adminDb.collection(
          cmsConfig.collections.orders
        );

        const subtotal = finalAmountInCents / 100;
        const shipping = 0; // Livraison gratuite pour le moment
        const total = subtotal + shipping;

        const orderData = {
          orderId: safeOrderId,
          paymentIntentId: paymentIntent.id,
          status: "pending",
          customer: {
            email: customer?.email || customerEmail || "guest",
            firstName: customer?.firstName || "",
            lastName: customer?.lastName || "",
            phone: customer?.phone || "",
            userId: customer?.userId || null,
          },
          shippingAddress: {
            address: shippingAddress?.address || "",
            city: shippingAddress?.city || "",
            postalCode: shippingAddress?.postalCode || "",
            country: shippingAddress?.country || "",
          },
          items: orderItems,
          subtotal,
          shipping,
          total,
          currency: currency.toUpperCase(),
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        const orderRef = await ordersCollection.add(orderData);
        orderDocId = orderRef.id;
      } catch (orderError) {
        console.error(
          "Erreur lors de la création de la commande côté serveur:",
          orderError
        );
      }
    }

    // Retourner le client secret au client
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      orderDocId,
    });
  } catch (error) {
    console.error("Erreur lors de la création du Payment Intent:", error);

    return NextResponse.json(
      {
        error: "Erreur lors de la création du paiement",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * ============================================
 * GUIDE D'UTILISATION
 * ============================================
 *
 * UTILISATION DEPUIS LE CLIENT :
 *
 * ```javascript
 * const response = await fetch('/api/create-payment-intent', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     amount: 1999, // $19.99 en centimes
 *     currency: 'usd',
 *     customerEmail: 'client@example.com',
 *     orderId: 'ORDER-12345'
 *   })
 * });
 *
 * const { clientSecret } = await response.json();
 * ```
 *
 * MONTANTS :
 * - Toujours en centimes (ex: $50.00 = 5000)
 * - Pas de décimales (utiliser Math.round si nécessaire)
 *
 * DEVISES SUPPORTÉES :
 * - usd (Dollar américain)
 * - eur (Euro)
 * - gbp (Livre sterling)
 * - Plus : https://stripe.com/docs/currencies
 *
 * SÉCURITÉ :
 * - Cette route s'exécute côté serveur uniquement
 * - La clé secrète Stripe n'est jamais exposée au client
 * - Le client reçoit uniquement le clientSecret pour finaliser le paiement
 *
 * ============================================
 */
