/**
 * PAGE : Fiche Produit Dynamique
 * ===============================
 *
 * Affiche les détails d'un produit spécifique.
 * Récupère les données depuis Firestore.
 *
 * 📄 FICHIER MODIFIÉ : src/app/products/[id]/page.js
 * DATE : 2025-11-30
 *
 * CHANGEMENT : Remplace import des données statiques par le hook useProduct
 */

import ProductDetailClient from "@/components/products/ProductDetailClient";
import { adminDb } from "@/lib/firebase-admin";
import cmsConfig from "../../../../cms.config";

async function getProductById(id) {
  if (!adminDb || !id) {
    console.warn("[getProductById] adminDb ou id manquant", {
      hasAdminDb: !!adminDb,
      id,
    });
    return null;
  }

  try {
    const collectionName = cmsConfig.collections?.products || "products";
    console.log("[getProductById] Lecture produit", { collectionName, id });
    const docRef = adminDb.collection(collectionName).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      console.warn("[getProductById] Document introuvable", { id });
      return null;
    }

    const rawData = {
      id: doc.id,
      ...doc.data(),
    };

    // Nettoyer les champs Firestore (Timestamp, etc.) pour les rendre sérialisables
    const data = JSON.parse(JSON.stringify(rawData));

    console.log("[getProductById] Document trouvé", {
      id: data.id,
      name: data.name,
      category: data.category,
    });

    return data;
  } catch (error) {
    console.error("Erreur lors du chargement serveur du produit:", error);
    return null;
  }
}

export default async function ProductPage({ params }) {
  // Dans Next.js 16, `params` est une Promise qu'il faut résoudre
  const resolvedParams = await params;
  console.log("[ProductPage] params résolus", resolvedParams);

  const id = resolvedParams?.id;
  const product = await getProductById(id);

  return <ProductDetailClient product={product} />;
}
