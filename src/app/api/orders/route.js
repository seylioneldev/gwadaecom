import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import cmsConfig from "../../../../cms.config";

async function getAuthenticatedAdmin(request) {
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

    if (!userData || userData.role !== "admin") {
      return {
        error: NextResponse.json(
          {
            success: false,
            error:
              "Accès refusé : seuls les administrateurs peuvent accéder à cette ressource",
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

export async function GET(request) {
  try {
    const authResult = await getAuthenticatedAdmin(request);
    if (authResult.error) {
      return authResult.error;
    }

    const { searchParams } = new URL(request.url);
    const statusParam = (searchParams.get("status") || "all").toLowerCase();
    const limitParam = searchParams.get("limit");

    let limit = 50;
    if (limitParam) {
      const parsed = parseInt(limitParam, 10);
      if (!Number.isNaN(parsed) && parsed > 0) {
        limit = Math.min(parsed, 100);
      }
    }

    const allowedStatuses = [
      "paid",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "all",
    ];

    const statusFilter = allowedStatuses.includes(statusParam)
      ? statusParam
      : "all";

    let ordersQuery = adminDb
      .collection(cmsConfig.collections.orders)
      .orderBy("createdAt", "desc")
      .limit(limit);

    if (statusFilter !== "all") {
      ordersQuery = ordersQuery.where("status", "==", statusFilter);
    }

    const snapshot = await ordersQuery.get();

    const orders = snapshot.docs.map((doc) => {
      const data = doc.data() || {};

      return {
        id: doc.id,
        ...data,
        createdAt: serializeTimestamp(data.createdAt),
        updatedAt: serializeTimestamp(data.updatedAt),
      };
    });

    return NextResponse.json({ success: true, orders }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erreur serveur lors de la récupération des commandes",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
