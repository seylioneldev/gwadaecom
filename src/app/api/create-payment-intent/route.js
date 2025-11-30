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

import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialiser Stripe avec la clé secrète (côté serveur uniquement)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
});

/**
 * POST /api/create-payment-intent
 * ================================
 *
 * Corps de la requête attendu :
 * {
 *   amount: number (en centimes, ex: 1999 pour $19.99)
 *   currency: string (ex: "usd")
 *   customerEmail: string (optionnel)
 *   orderId: string (optionnel, pour référence)
 * }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { amount, currency = 'usd', customerEmail, orderId } = body;

    // Validation
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Le montant doit être supérieur à 0' },
        { status: 400 }
      );
    }

    // Créer le Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // S'assurer que c'est un entier
      currency: currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true, // Active tous les moyens de paiement disponibles
      },
      metadata: {
        orderId: orderId || 'N/A',
        customerEmail: customerEmail || 'guest',
      },
      description: `Commande ${orderId || 'sans référence'}`,
    });

    // Retourner le client secret au client
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });

  } catch (error) {
    console.error('Erreur lors de la création du Payment Intent:', error);

    return NextResponse.json(
      {
        error: 'Erreur lors de la création du paiement',
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
