// 1. On importe les composants depuis leurs dossiers
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer"; // <--- C'est ici qu'on l'importe
import ProductGrid from "../components/products/ProductGrid";

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col">
      {/* Haut de page */}
      <Header />
      
      {/* Contenu principal */}
      <ProductGrid />
      
      {/* Bas de page */}
      <Footer /> {/* <--- C'est ici qu'on l'affiche */}
    </main>
  );
}