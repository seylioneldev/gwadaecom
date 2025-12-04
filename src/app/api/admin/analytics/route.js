import { NextResponse } from "next/server";
import admin, { adminAuth, adminDb } from "@/lib/firebase-admin";
import cmsConfig from "../../../../../cms.config";

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
              "Accès refusé : seuls les administrateurs peuvent accéder aux analytics",
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

function getPeriodConfig(rawPeriod) {
  const now = new Date();
  const normalized = String(rawPeriod || "all").toLowerCase();

  if (normalized === "30d" || normalized === "30days") {
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - 29);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(now);
    endDate.setHours(23, 59, 59, 999);

    return {
      period: "30d",
      bucketType: "day",
      startDate,
      endDate,
    };
  }

  if (normalized === "month" || normalized === "current_month") {
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endDate.setHours(23, 59, 59, 999);

    return {
      period: "month",
      bucketType: "day",
      startDate,
      endDate,
    };
  }

  if (normalized === "year" || normalized === "current_year") {
    const startDate = new Date(now.getFullYear(), 0, 1);
    const endDate = new Date(now.getFullYear(), 11, 31);
    endDate.setHours(23, 59, 59, 999);

    return {
      period: "year",
      bucketType: "month",
      startDate,
      endDate,
    };
  }

  // Période "Tout" : on groupe par mois mais sans bornes de dates strictes
  return {
    period: "all",
    bucketType: "month",
    startDate: null,
    endDate: null,
  };
}

function ensureDate(value) {
  if (!value) return null;

  try {
    // JS Date
    if (value instanceof Date) {
      return value;
    }

    // Firestore Timestamp (ou objet avec toDate)
    if (typeof value.toDate === "function") {
      return value.toDate();
    }

    // ISO string ou autre string parsable
    if (typeof value === "string") {
      const parsed = new Date(value);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed;
      }
    }

    // Timestamp numérique (ms depuis epoch)
    if (typeof value === "number") {
      const parsed = new Date(value);
      if (!Number.isNaN(parsed.getTime())) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Impossible de convertir createdAt en Date", e);
  }

  return null;
}

function formatBucketLabel(date, bucketType) {
  try {
    if (bucketType === "day") {
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
      });
    }

    if (bucketType === "month") {
      return date.toLocaleDateString("fr-FR", {
        month: "short",
        year: "2-digit",
      });
    }
  } catch (e) {
    // Fallback simple
  }

  return "";
}

function seedBuckets(periodConfig) {
  const { startDate, endDate, bucketType, period } = periodConfig;
  const buckets = new Map();

  if (!startDate || !endDate) {
    return buckets;
  }

  if (bucketType === "day") {
    const cursor = new Date(startDate);
    while (cursor <= endDate) {
      const key = cursor.toISOString().slice(0, 10);
      const label = formatBucketLabel(cursor, bucketType);
      buckets.set(key, {
        key,
        date: cursor.toISOString(),
        label,
        revenue: 0,
        orders: 0,
      });
      cursor.setDate(cursor.getDate() + 1);
    }
  } else if (bucketType === "month") {
    const cursor = new Date(startDate);
    cursor.setDate(1);

    while (cursor <= endDate) {
      const key = `${cursor.getFullYear()}-${String(
        cursor.getMonth() + 1
      ).padStart(2, "0")}`;
      const label = formatBucketLabel(cursor, bucketType);
      buckets.set(key, {
        key,
        date: cursor.toISOString(),
        label,
        revenue: 0,
        orders: 0,
      });
      cursor.setMonth(cursor.getMonth() + 1);
    }
  }

  return buckets;
}

export async function GET(request) {
  try {
    const authResult = await getAuthenticatedAdmin(request);
    if (authResult.error) {
      return authResult.error;
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

    const { searchParams } = new URL(request.url);
    const periodConfig = getPeriodConfig(searchParams.get("period"));
    const { period, bucketType, startDate, endDate } = periodConfig;

    const ordersCollection = adminDb.collection(cmsConfig.collections.orders);
    const snapshot = await ordersCollection.get();

    const validStatuses = ["paid", "processing", "shipped", "delivered"];

    let totalRevenue = 0;
    let totalOrders = 0;
    const customersSet = new Set();
    const productsMap = new Map();
    const buckets = seedBuckets(periodConfig);

    snapshot.forEach((doc) => {
      const data = doc.data() || {};

      const status = String(data.status || "paid").toLowerCase();
      if (!validStatuses.includes(status)) {
        return;
      }

      const paymentStatus = data.paymentStatus;
      const stripeOk =
        !paymentStatus ||
        paymentStatus === "succeeded" ||
        paymentStatus === "paid";
      if (!stripeOk) {
        return;
      }

      // Utiliser updatedAt comme référence (date de paiement) si disponible,
      // sinon fallback sur createdAt
      const referenceDate = ensureDate(data.updatedAt || data.createdAt);
      if (!referenceDate) {
        return;
      }

      if (startDate && referenceDate < startDate) {
        return;
      }
      if (endDate && referenceDate > endDate) {
        return;
      }

      const orderTotal =
        typeof data.total === "number"
          ? data.total
          : (data.subtotal || 0) + (data.shipping || 0);

      if (!Number.isFinite(orderTotal) || orderTotal <= 0) {
        return;
      }

      totalRevenue += orderTotal;
      totalOrders += 1;

      const customerKey =
        data.customer?.userId || data.customer?.email || data.customer?.phone;
      if (customerKey) {
        customersSet.add(customerKey);
      }

      const items = Array.isArray(data.items) ? data.items : [];
      for (const item of items) {
        if (!item) continue;

        const key = item.id || item.productId || item.sku || item.name;
        if (!key) continue;

        const existing = productsMap.get(key) || {
          id: key,
          name: item.name || "Produit",
          category: item.category || "",
          revenue: 0,
          quantity: 0,
        };

        const quantity = Number(item.quantity) || 1;
        const lineRevenue =
          typeof item.total === "number"
            ? item.total
            : (Number(item.price) || 0) * quantity;

        if (Number.isFinite(lineRevenue) && lineRevenue > 0) {
          existing.revenue += lineRevenue;
        }
        if (Number.isFinite(quantity) && quantity > 0) {
          existing.quantity += quantity;
        }

        productsMap.set(key, existing);
      }

      let bucketKey;
      if (bucketType === "day") {
        const d = new Date(referenceDate);
        d.setHours(0, 0, 0, 0);
        bucketKey = d.toISOString().slice(0, 10);
      } else {
        const d = new Date(referenceDate);
        bucketKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
          2,
          "0"
        )}`;
      }

      let bucket = buckets.get(bucketKey);
      if (!bucket) {
        const label = formatBucketLabel(referenceDate, bucketType);
        bucket = {
          key: bucketKey,
          date: referenceDate.toISOString(),
          label,
          revenue: 0,
          orders: 0,
        };
        buckets.set(bucketKey, bucket);
      }

      bucket.revenue += orderTotal;
      bucket.orders += 1;
    });

    const averageBasket = totalOrders ? totalRevenue / totalOrders : 0;

    const topProducts = Array.from(productsMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    let points = Array.from(buckets.values());
    points.sort((a, b) => a.date.localeCompare(b.date));

    const responseBody = {
      success: true,
      period,
      metrics: {
        totalRevenue,
        totalOrders,
        averageBasket,
        totalCustomers: customersSet.size,
        topProducts,
      },
      timeSeries: {
        type: bucketType,
        points,
      },
    };

    return NextResponse.json(responseBody, { status: 200 });
  } catch (error) {
    console.error("Erreur lors du calcul des analytics admin:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erreur serveur lors du calcul des analytics",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
