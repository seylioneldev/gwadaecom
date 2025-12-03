import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import admin, { adminAuth, adminDb } from "@/lib/firebase-admin";
import cmsConfig from "../../../../../cms.config";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

async function getAuthenticatedUser(request) {
  if (!adminAuth || !adminDb) {
    return {
      error: NextResponse.json(
        {
          success: false,
          error:
            "Firebase Admin SDK non configuré. Ajoutez les variables d'environnement FIREBASE_ADMIN_*",
        },
        { status: 500 }
      ),
    };
  }

  const authHeader = request.headers.get("authorization") || "";
  if (!authHeader.startsWith("Bearer ")) {
    return {
      error: NextResponse.json(
        { success: false, error: "Header Authorization Bearer requis" },
        { status: 401 }
      ),
    };
  }

  const idToken = authHeader.slice(7).trim();
  if (!idToken) {
    return {
      error: NextResponse.json(
        { success: false, error: "Token Firebase manquant" },
        { status: 401 }
      ),
    };
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const requestUserId = decodedToken.uid;

    const userDoc = await adminDb.collection("users").doc(requestUserId).get();
    const userData = userDoc.data();

    return { uid: requestUserId, userData };
  } catch (error) {
    console.error("Erreur de vérification du token Firebase:", error);
    return {
      error: NextResponse.json(
        { success: false, error: "Token Firebase invalide" },
        { status: 401 }
      ),
    };
  }
}

async function getAuthenticatedAdmin(request) {
  const authHeader = request.headers.get("authorization") || "";
  if (!authHeader.startsWith("Bearer ")) {
    return {
      error: NextResponse.json(
        { success: false, error: "Header Authorization Bearer requis" },
        { status: 401 }
      ),
    };
  }

  if (!adminAuth || !adminDb) {
    return {
      error: NextResponse.json(
        {
          success: false,
          error:
            "Firebase Admin SDK non configuré. Ajoutez les variables d'environnement FIREBASE_ADMIN_*",
        },
        { status: 500 }
      ),
    };
  }

  const idToken = authHeader.slice(7).trim();
  if (!idToken) {
    return {
      error: NextResponse.json(
        { success: false, error: "Token Firebase manquant" },
        { status: 401 }
      ),
    };
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const requestUserId = decodedToken.uid;

    const userDoc = await adminDb.collection("users").doc(requestUserId).get();
    const userData = userDoc.data();

    if (!userData || userData.role !== "admin") {
      return {
        error: NextResponse.json(
          {
            success: false,
            error:
              "Accès refusé : seuls les administrateurs peuvent modifier les commandes",
          },
          { status: 403 }
        ),
      };
    }

    return { uid: requestUserId, userData };
  } catch (error) {
    console.error("Erreur de vérification du token Firebase:", error);
    return {
      error: NextResponse.json(
        { success: false, error: "Token Firebase invalide" },
        { status: 401 }
      ),
    };
  }
}

function serializeTimestamp(ts) {
  if (!ts) return null;

  try {
    if (typeof ts.toDate === "function") {
      return ts.toDate().toISOString();
    }

    if (ts instanceof Date) {
      return ts.toISOString();
    }
  } catch (e) {
    console.warn("Impossible de sérialiser le timestamp Firestore", e);
  }

  return null;
}

export async function GET(request, { params }) {
  try {
    const authResult = await getAuthenticatedUser(request);
    if (authResult.error) {
      return authResult.error;
    }

    const { uid, userData } = authResult;
    const orderDocId = params?.id;

    if (!orderDocId) {
      return NextResponse.json(
        { success: false, error: "ID de commande manquant dans l’URL" },
        { status: 400 }
      );
    }

    const orderRef = adminDb
      .collection(cmsConfig.collections.orders)
      .doc(orderDocId);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
      return NextResponse.json(
        { success: false, error: "Commande introuvable" },
        { status: 404 }
      );
    }

    const data = orderSnap.data() || {};

    const isAdmin = userData && userData.role === "admin";
    const isOwner = data.customer && data.customer.userId === uid;

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        {
          success: false,
          error: "Accès refusé : vous ne pouvez voir que vos propres commandes",
        },
        { status: 403 }
      );
    }

    const order = {
      id: orderSnap.id,
      ...data,
      createdAt: serializeTimestamp(data.createdAt),
      updatedAt: serializeTimestamp(data.updatedAt),
    };

    return NextResponse.json({ success: true, order }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération de la commande:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erreur serveur lors de la récupération de la commande",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

async function sendStatusChangeEmail(orderData, previousStatus, newStatus) {
  try {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error(
        "Configuration Gmail manquante dans .env.local pour les emails de statut de commande"
      );
      return;
    }

    const customerEmail = orderData?.customer?.email;
    if (!customerEmail) {
      return;
    }

    const normalizedStatus = String(newStatus || "").toLowerCase();
    const orderId = orderData.orderId || orderData.id || "";

    if (
      !["processing", "shipped", "delivered", "cancelled"].includes(
        normalizedStatus
      )
    ) {
      return;
    }

    let statusLabel = normalizedStatus;
    if (normalizedStatus === "processing") statusLabel = "en préparation";
    if (normalizedStatus === "shipped") statusLabel = "expédiée";
    if (normalizedStatus === "delivered") statusLabel = "livrée";
    if (normalizedStatus === "cancelled") statusLabel = "annulée";

    const subject = `Mise à jour de votre commande ${orderId}`;

    const textLines = [];
    textLines.push(`Bonjour ${orderData.customer?.firstName || ""},`);
    textLines.push("");
    textLines.push(
      `Le statut de votre commande ${orderId} a été mis à jour : elle est maintenant ${statusLabel}.`
    );
    textLines.push("");
    if (normalizedStatus === "shipped") {
      textLines.push(
        "Votre commande a quitté nos ateliers et est en cours d'acheminement."
      );
    }
    if (normalizedStatus === "delivered") {
      textLines.push(
        "Votre commande a été livrée. Nous espérons qu'elle vous plaira !"
      );
    }
    if (normalizedStatus === "cancelled") {
      textLines.push(
        "Votre commande a été annulée. Si vous n'êtes pas à l'origine de cette annulation, contactez-nous."
      );
    }
    textLines.push("");
    textLines.push("Merci pour votre confiance.");
    textLines.push("Les Bijoux de Guadeloupe");

    await transporter.sendMail({
      from: `"Les Bijoux de Guadeloupe" <${process.env.GMAIL_USER}>`,
      to: customerEmail,
      subject,
      text: textLines.join("\n"),
    });
  } catch (error) {
    console.error(
      "Erreur lors de l'envoi de l'email de changement de statut:",
      error
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const authResult = await getAuthenticatedAdmin(request);
    if (authResult.error) {
      return authResult.error;
    }

    const orderDocId = params?.id;

    if (!orderDocId) {
      return NextResponse.json(
        { success: false, error: "ID de commande manquant dans l’URL" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const requestedStatus = String(body?.status || "").toLowerCase();

    const allowedStatuses = [
      "pending",
      "paid",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatuses.includes(requestedStatus)) {
      return NextResponse.json(
        {
          success: false,
          error: "Statut de commande invalide",
          allowedStatuses,
        },
        { status: 400 }
      );
    }

    if (!adminDb) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Firebase Admin SDK non configuré. Ajoutez les variables d'environnement FIREBASE_ADMIN_*",
        },
        { status: 500 }
      );
    }

    const orderRef = adminDb
      .collection(cmsConfig.collections.orders)
      .doc(orderDocId);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
      return NextResponse.json(
        { success: false, error: "Commande introuvable" },
        { status: 404 }
      );
    }

    const previousData = orderSnap.data() || {};
    const previousStatus = String(
      previousData.status || "pending"
    ).toLowerCase();

    if (previousStatus === requestedStatus) {
      return NextResponse.json(
        {
          success: true,
          order: {
            id: orderSnap.id,
            ...previousData,
          },
          message: "Aucun changement de statut effectué",
        },
        { status: 200 }
      );
    }

    await orderRef.update({
      status: requestedStatus,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const updatedSnap = await orderRef.get();
    const updatedData = updatedSnap.data() || {};

    await sendStatusChangeEmail(updatedData, previousStatus, requestedStatus);

    const order = {
      id: updatedSnap.id,
      ...updatedData,
      createdAt: serializeTimestamp(updatedData.createdAt),
      updatedAt: serializeTimestamp(updatedData.updatedAt),
    };

    return NextResponse.json({ success: true, order }, { status: 200 });
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour du statut de la commande:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Erreur serveur lors de la mise à jour du statut de la commande",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
