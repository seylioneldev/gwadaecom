"use client"; // Indispensable pour l'interactivité (panier, quantité)

import Header from "../../../components/layout/Header";
import Footer from "../../../components/layout/Footer";
import { ChevronRight, Minus, Plus } from "lucide-react";
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '../../../context/CartContext';
import { useParams } from 'next/navigation'; // <--- 1. NOUVEL IMPORT

// ==========================================================
// 1. IMPORTATION DES DONNÉES CENTRALISÉES
// ==========================================================
import { products } from '../../../data/products';

export default function ProductPage() { // <--- 2. ON ENLÈVE { params } D'ICI
  // Récupération des outils du panier
  const { addItem, totalItems } = useCart();
  
  // État local pour gérer la quantité choisie par l'utilisateur
  const [quantity, setQuantity] = useState(1);

  // 3. RÉCUPÉRATION DE L'ID (VERSION NEXT.JS 15 CLIENT)
  // On utilise le hook useParams() au lieu des props
  const params = useParams();
  const id = params?.id; 
  
  // Sécurité : si l'ID n'est pas encore chargé, on ne fait rien
  if (!id) return null;

  const productId = parseInt(id);

  // 4. RECHERCHE DU PRODUIT DANS LA LISTE IMPORTÉE
  const product = products.find((p) => p.id === productId) || {
    name: `Produit Inconnu`,
    price: "0.00",
    description: "Ce produit est introuvable.",
    category: "Inconnu",
    image: "bg-gray-200"
  };

  // Fonction déclenchée au clic sur "Add to Cart"
  const handleAddToCart = () => {
    addItem(product, quantity);
  };
  
  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Fil d'ariane */}
      <div className="max-w-7xl mx-auto px-6 py-4 text-[10px] uppercase tracking-widest text-gray-500 flex items-center gap-2">
        <Link href="/">Home</Link> <ChevronRight size={10} />
        {/* On affiche la catégorie du produit trouvé */}
        <span>{product.category}</span> <ChevronRight size={10} />
        <span className="text-gray-800 font-medium">{product.name}</span>
      </div>

      {/* Zone principale du produit */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        
        {/* COLONNE GAUCHE : Image */}
        <div className={`${product.image || 'bg-gray-100'} aspect-[4/5] w-full relative flex items-center justify-center text-gray-400`}>
            {/* Si pas de vraie image (juste une couleur de fond), on affiche le texte */}
            {!product.image?.startsWith('http') && <span className="uppercase tracking-widest text-xs">Photo : {product.name}</span>}
        </div>

        {/* COLONNE DROITE : Détails et Actions */}
        <div className="flex flex-col justify-center">
            <h1 className="font-serif text-3xl md:text-4xl text-gray-800 mb-2">{product.name}</h1>
            <p className="text-lg text-gray-600 mb-6 font-light">${product.price}</p>
            
            <p className="text-xs leading-relaxed text-gray-500 mb-8 border-b border-gray-100 pb-8">
                {product.description}
            </p>

            {/* Sélecteur de Quantité */}
            <div className="flex items-center gap-4 mb-8">
                <span className="text-xs uppercase tracking-widest text-gray-500">Quantity</span>
                <div className="flex items-center border border-gray-300">
                    <button onClick={() => setQuantity(prev => Math.max(1, prev - 1))} className="p-2 hover:bg-gray-100 text-gray-600"><Minus size={14}/></button>
                    <span className="px-4 text-sm font-medium">{quantity}</span>
                    <button onClick={() => setQuantity(prev => prev + 1)} className="p-2 hover:bg-gray-100 text-gray-600"><Plus size={14}/></button>
                </div>
            </div>

            {/* Bouton d'ajout */}
            <button 
                onClick={handleAddToCart}
                className="bg-[#5d6e64] text-white py-4 px-8 uppercase tracking-[0.2em] text-xs hover:bg-[#4a5850] transition w-full md:w-auto"
            >
                Add to Cart ({totalItems})
            </button>
        </div>
      </div>

      <Footer />
    </main>
  );
}