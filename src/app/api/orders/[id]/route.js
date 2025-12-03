import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import cmsConfig from "../../../../../cms.config";

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
