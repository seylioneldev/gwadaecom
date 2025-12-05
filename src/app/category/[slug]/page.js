/**
 * PAGE : Catégorie Dynamique
 * ===========================
 *
 * Affiche tous les produits d'une catégorie spécifique.
 * Récupère les données depuis Firestore.
 *
 * 📄 FICHIER MODIFIÉ : src/app/category/[slug]/page.js
 * DATE : 2025-11-30
 *
 * CHANGEMENT : Remplace import des données statiques par le hook useProductsByCategory
 */

import CategoryClient from "@/components/products/CategoryClient";
import { adminDb } from "@/lib/firebase-admin";
import cmsConfig from "../../../../cms.config";

async function getProductsByCategorySlug(slug) {
  if (!adminDb || !slug) {
    return [];
  }

  try {
    const collectionName = cmsConfig.collections?.products || "products";

    // Le segment d'URL est encodé (Bijoux%20en%20acier...), on le décode d'abord
    const decodedSlug = decodeURIComponent(slug.toString());
    const normalizedSlug = decodedSlug.toLowerCase();
    const normalizedSlugWithSpaces = normalizedSlug.replace(/-/g, " ");

    // On récupère les produits puis on filtre en mémoire, comme le faisait
    // useProductsByCategory côté client (comparaison insensible à la casse).
    const snapshot = await adminDb.collection(collectionName).get();

    const raw = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const distinctCategories = Array.from(
      new Set(
        raw.map((p) =>
          (p.category || "").toString().toLowerCase().replace(/-/g, " ")
        )
      )
    );

    console.log("[CategoryPage] slug:", slug);
    console.log("[CategoryPage] normalizedSlug:", normalizedSlugWithSpaces);
    console.log("[CategoryPage] catégories trouvées:", distinctCategories);

    const filtered = raw.filter((product) => {
      const categoryValue = (product.category || "").toString().toLowerCase();

      // On considère plusieurs formes équivalentes :
      // - slug tel quel ("bijoux en argent")
      // - slug avec traits d’union ("bijoux-en-argent")
      // - catégorie en base (avec ou sans majuscules)
      return (
        categoryValue === normalizedSlug ||
        categoryValue === normalizedSlugWithSpaces ||
        categoryValue.replace(/-/g, " ") === normalizedSlugWithSpaces
      );
    });

    console.log("[CategoryPage] produits filtrés:", filtered.length);

    return JSON.parse(JSON.stringify(filtered));
  } catch (error) {
    console.error(
      "Erreur lors du chargement des produits serveur pour la catégorie:",
      error
    );
    return [];
  }
}

export default async function CategoryPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;

  const products = await getProductsByCategorySlug(slug);

  return <CategoryClient categorySlug={slug} products={products} />;
}
