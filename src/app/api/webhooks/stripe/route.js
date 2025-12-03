import { NextResponse } from "next/server";
import Stripe from "stripe";
import nodemailer from "nodemailer";
import admin, { adminDb } from "@/lib/firebase-admin";
import cmsConfig from "../../../../../cms.config";
import { generateEmailHTML } from "@/app/api/send-order-confirmation/route";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2024-12-18.acacia",
    })
  : null;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

function ensureStripeConfigured() {
  if (!stripe || !webhookSecret) {
    console.error("Stripe Webhook non configuré correctement");
    return false;
  }
  return true;
}

async function processOrderPaymentSucceeded(paymentIntent) {
  if (!adminDb) {
    console.error("Firebase Admin DB non initialisé");
    return;
  }

  try {
    const ordersRef = adminDb.collection(cmsConfig.collections.orders);

    const snapshot = await ordersRef
      .where("paymentIntentId", "==", paymentIntent.id)
      .limit(1)
      .get();

    if (snapshot.empty) {
      console.warn(
        `Aucune commande trouvée pour paymentIntentId=${paymentIntent.id}`
      );
      return;
    }

    const orderDoc = snapshot.docs[0];

    const result = await adminDb.runTransaction(async (transaction) => {
      const freshOrderSnap = await transaction.get(orderDoc.ref);

      if (!freshOrderSnap.exists) {
        throw new Error("Commande introuvable pendant la transaction");
      }

      const orderData = freshOrderSnap.data() || {};

      if (orderData.status === "paid") {
        return { orderData, lowStockProducts: [], alreadyPaid: true };
      }

      const items = Array.isArray(orderData.items) ? orderData.items : [];
      const lowStockProducts = [];
      const productsCollection = adminDb.collection(
        cmsConfig.collections.products
      );

      let threshold = 3;
      const thresholdEnv = parseInt(process.env.LOW_STOCK_THRESHOLD || "", 10);
      if (!Number.isNaN(thresholdEnv) && thresholdEnv >= 0) {
        threshold = thresholdEnv;
      }

      for (const item of items) {
        if (!item || !item.id || !item.quantity) {
          continue;
        }

        const productRef = productsCollection.doc(String(item.id));
        const productSnap = await transaction.get(productRef);

        if (!productSnap.exists) {
          continue;
        }

        const productData = productSnap.data() || {};

        if (typeof productData.stock === "number") {
          const currentStock = Number(productData.stock);
          const quantity = Number(item.quantity);

          if (!Number.isFinite(currentStock) || !Number.isFinite(quantity)) {
            continue;
          }

          let newStock = currentStock - quantity;
          if (newStock < 0) {
            newStock = 0;
          }

          transaction.update(productRef, {
            stock: newStock,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });

          if (newStock <= threshold) {
            lowStockProducts.push({
              id: productRef.id,
              name: productData.name || "",
              stock: newStock,
            });
          }
        }
      }

      transaction.update(orderDoc.ref, {
        status: "paid",
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return {
        orderData: { ...orderData, status: "paid" },
        lowStockProducts,
        alreadyPaid: false,
      };
    });

    if (result && !result.alreadyPaid) {
      await sendOrderEmails(result.orderData, result.lowStockProducts);
    }
  } catch (error) {
    console.error(
      "Erreur lors du traitement de payment_intent.succeeded:",
      error
    );
  }
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

async function sendOrderEmails(orderData, lowStockProducts) {
  try {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error(
        "Configuration Gmail manquante dans .env.local pour l'envoi des emails de commande"
      );
      return;
    }

    const adminEmail =
      process.env.ADMIN_NOTIFICATION_EMAIL || process.env.GMAIL_USER;

    if (orderData?.customer?.email) {
      try {
        const html = generateEmailHTML(orderData);

        await transporter.sendMail({
          from: `"Les Bijoux de Guadeloupe" <${process.env.GMAIL_USER}>`,
          to: orderData.customer.email,
          subject: `Confirmation de commande ${orderData.orderId}`,
          html,
        });
      } catch (error) {
        console.error(
          "Erreur lors de l'envoi de l'email de confirmation client:",
          error
        );
      }
    }

    try {
      const lines = [];
      lines.push(`Nouvelle commande ${orderData.orderId}`);
      lines.push(`Total: ${orderData.total} ${orderData.currency || "EUR"}`);
      if (orderData.customer?.email) {
        lines.push(`Client: ${orderData.customer.email}`);
      }
      lines.push("");
      lines.push("Articles:");

      (orderData.items || []).forEach((item) => {
        lines.push(`- ${item.name || ""} x${item.quantity} = ${item.total}€`);
      });

      await transporter.sendMail({
        from: `"Les Bijoux de Guadeloupe" <${process.env.GMAIL_USER}>`,
        to: adminEmail,
        subject: `[Admin] Nouvelle commande ${orderData.orderId}`,
        text: lines.join("\n"),
      });
    } catch (error) {
      console.error(
        "Erreur lors de l'envoi de l'email d'alerte admin (nouvelle commande):",
        error
      );
    }

    if (Array.isArray(lowStockProducts) && lowStockProducts.length > 0) {
      try {
        const stockLines = [];
        stockLines.push("Alertes de stock faible:");
        lowStockProducts.forEach((p) => {
          stockLines.push(`- ${p.name || p.id}: ${p.stock}`);
        });

        await transporter.sendMail({
          from: `"Les Bijoux de Guadeloupe" <${process.env.GMAIL_USER}>`,
          to: adminEmail,
          subject: "[Stock] Alertes de stock faible",
          text: stockLines.join("\n"),
        });
      } catch (error) {
        console.error(
          "Erreur lors de l'envoi des emails d'alerte de stock faible:",
          error
        );
      }
    }
  } catch (error) {
    console.error(
      "Erreur inattendue lors de l'envoi des emails de commande:",
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
        await processOrderPaymentSucceeded(paymentIntent);
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
