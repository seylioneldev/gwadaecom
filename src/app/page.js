// ==========================================================
// FICHIER : PAGE.JS (L'assembleur principal de la page d'accueil)
// RÔLE : Importe tous les composants et définit leur ordre d'affichage.
// ==========================================================

// 1. IMPORT DES COMPOSANTS (La clé de l'architecture propre)
// Ces chemins pointent vers les dossiers que nous avons créés :
import Header from "../components/layout/Header"; // Le haut de page (menu)
import Hero from "../components/layout/Hero";     // La bannière d'accueil
import Footer from "../components/layout/Footer"; // Le pied de page
import ProductGrid from "../components/products/ProductGrid"; // La grille de produits
import AdminFloatingButton from "../components/AdminFloatingButton"; // Bouton d'accès admin (visible uniquement pour le propriétaire)

export default function Home() {
  return (
    // <main> est le conteneur principal de la page.
    // 'flex flex-col' assure que les éléments s'empilent verticalement.
    <main className="min-h-screen bg-white flex flex-col">

      {/* 1. Haut de page - Affiche le composant Header */}
      <Header />

      {/* 2. Bannière - Affiche le composant Hero */}
      <Hero />

      {/* 3. Contenu principal - Affiche le composant ProductGrid */}
      <ProductGrid />

      {/* 4. Bas de page - Affiche le composant Footer */}
      <Footer />

      {/* 5. Bouton flottant admin - Visible uniquement pour le propriétaire (mode dev) */}
      <AdminFloatingButton />
    </main>
  );
}
