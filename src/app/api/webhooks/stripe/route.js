import { NextResponse } from "next/server";
import Stripe from "stripe";
import admin, { adminDb } from "@/lib/firebase-admin";
import cmsConfig from "../../../../../cms.config";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2024-12-18.acacia",
    })
  : null;

function ensureStripeConfigured() {
  if (!stripe || !webhookSecret) {
    console.error("Stripe Webhook non configuré correctement");
    return false;
  }
  return true;
}

async function updateOrderStatusByPaymentIntentId(paymentIntentId, newStatus) {
  if (!adminDb) {
    console.error("Firebase Admin DB non initialisé");
    return;
  }

  try {
    const ordersRef = adminDb.collection(cmsConfig.collections.orders);

    const snapshot = await ordersRef
      .where("paymentIntentId", "==", paymentIntentId)
      .limit(1)
      .get();

    if (snapshot.empty) {
      console.warn(
        `Aucune commande trouvée pour paymentIntentId=${paymentIntentId}`
      );
      return;
    }

    const orderDoc = snapshot.docs[0];

    await orderDoc.ref.update({
      status: newStatus,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour du statut de la commande via le webhook Stripe:",
      error
    );
  }
}

export async function POST(request) {
  try {
    if (!ensureStripeConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Stripe Webhook non configuré. Vérifiez STRIPE_SECRET_KEY et STRIPE_WEBHOOK_SECRET",
        },
        { status: 500 }
      );
    }

    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { success: false, error: "Header stripe-signature manquant" },
        { status: 400 }
      );
    }

    const payload = await request.text();

    let event;
    try {
      event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err) {
      console.error("Erreur de vérification de la signature Stripe:", err);
      return NextResponse.json(
        { success: false, error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        await updateOrderStatusByPaymentIntentId(paymentIntent.id, "paid");
        break;
      }
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        await updateOrderStatusByPaymentIntentId(paymentIntent.id, "cancelled");
        break;
      }
      default: {
        // Autres événements ignorés pour le moment
        break;
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors du traitement du webhook Stripe:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur serveur lors du traitement du webhook Stripe",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
