"use client"; // CRUCIAL pour utiliser les hooks React comme useState et useCart

// Les chemins d'importation doivent remonter de 3 niveaux pour atteindre le dossier `src`
// depuis `src/app/products/[id]/`
import Header from "../../../components/layout/Header";
import Footer from "../../../components/layout/Footer";
import { ChevronRight, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react"; // Hook pour gérer l'état local (quantité)
import { useParams } from "next/navigation"; // Hook pour lire les paramètres de l'URL
import { useCart } from "../../../context/CartContext"; // Hook pour interagir avec le panier

// Les données fictives (simule un appel API)
const mockProducts = [
  {
    id: 1,
    name: "Vintage French Jar",
    price: "45.00",
    category: "Kitchen",
    description:
      "Un bocal en verre vintage authentique, parfait pour la décoration ou le rangement.",
  },
  {
    id: 2,
    name: "Market Basket",
    price: "65.00",
    category: "Baskets",
    description:
      "Le panier de marché classique français, tissé à la main avec des feuilles de palmier.",
  },
  {
    id: 3,
    name: "Olive Wood Board",
    price: "85.00",
    category: "Kitchen",
    description:
      "Planche à découper robuste en bois d'olivier, idéale pour présenter vos fromages.",
  },
  {
    id: 4,
    name: "Linen Tea Towel",
    price: "28.00",
    category: "Textiles",
    description:
      "Torchon en lin pur, doux et absorbant, apportant une touche rustique à votre cuisine.",
  },
  {
    id: 5,
    name: "Antique Bottle",
    price: "32.00",
    category: "Etc",
    description:
      "Bouteille ancienne chinée en brocante, chaque pièce est unique.",
  },
  {
    id: 6,
    name: "Savon de Marseille",
    price: "12.00",
    category: "Soaps",
    description:
      "L'authentique cube de savon de Marseille, 72% d'huile d'olive, sans parfum ajouté.",
  },
];

// NOUVEAU : La fonction est désormais SYNCHRONE (plus de 'async')
export default function ProductPage() {
  // Récupération des fonctions et états du panier
  const { addItem, totalItems } = useCart();

  // État local pour la quantité sélectionnée
  const [quantity, setQuantity] = useState(1);

  // Récupération de l'ID depuis l'URL avec le hook useParams()
  const { id } = useParams();
  const productId = parseInt(id);

  const product = mockProducts.find((p) => p.id === productId) || {
    name: `Produit Inconnu ${id}`,
    price: "0.00",
    description: "Ce produit n'existe pas encore dans notre catalogue.",
    category: "Inconnu",
  };

  // Fonction appelée quand on clique sur "Add to Cart"
  const handleAddToCart = () => {
    // La fonction addItem() vient du CartContext et ajoute le produit
    addItem(product, quantity);
  };

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Fil d'ariane (Breadcrumb) */}
      <div className="max-w-7xl mx-auto px-6 py-4 text-[10px] uppercase tracking-widest text-gray-500 flex items-center gap-2">
        <Link href="/">Home</Link> <ChevronRight size={10} />
        <span>{product.category}</span> <ChevronRight size={10} />
        <span className="text-gray-800 font-medium">{product.name}</span>
      </div>

      {/* Zone Produit */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        {/* Colonne Image (Gauche) */}
        <div className="bg-[#F0EBE5] aspect-[4/5] w-full relative flex items-center justify-center text-gray-400">
          <span className="uppercase tracking-widest text-xs">
            Photo : {product.name}
          </span>
        </div>

        {/* Colonne Détails (Droite) */}
        <div className="flex flex-col justify-center">
          <h1 className="font-serif text-3xl md:text-4xl text-gray-800 mb-2">
            {product.name}
          </h1>
          <p className="text-lg text-gray-600 mb-6 font-light">
            ${product.price}
          </p>

          <p className="text-xs leading-relaxed text-gray-500 mb-8 border-b border-gray-100 pb-8">
            {product.description}
            <br />
            <br />
            Authentique et charmant, ce produit apportera une touche française à
            votre intérieur.
          </p>

          {/* Sélecteur Quantité */}
          <div className="flex items-center gap-4 mb-8">
            <span className="text-xs uppercase tracking-widest text-gray-500">
              Quantity
            </span>
            <div className="flex items-center border border-gray-300">
              {/* Bouton Moins : Empêche la quantité de descendre sous 1 */}
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="p-2 hover:bg-gray-100 text-gray-600"
              >
                <Minus size={14} />
              </button>
              {/* Affichage de la quantité */}
              <span className="px-4 text-sm font-medium">{quantity}</span>
              {/* Bouton Plus */}
              <button
                onClick={() => setQuantity((prev) => prev + 1)}
                className="p-2 hover:bg-gray-100 text-gray-600"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Bouton Ajouter au Panier */}
          <button
            onClick={handleAddToCart} // Connecté à la fonction qui utilise le Context
            className="bg-[#5d6e64] text-white py-4 px-8 uppercase tracking-[0.2em] text-xs hover:bg-[#4a5850] transition w-full md:w-auto"
          >
            Add to Cart ({totalItems}){" "}
            {/* Affiche le nombre total d'articles pour vérification */}
          </button>
        </div>
      </div>

      <Footer />
    </main>
  );
}
