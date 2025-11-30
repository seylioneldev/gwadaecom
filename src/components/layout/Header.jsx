"use client"; // INDISPENSABLE car ce composant est interactif (clic bouton)

import { Search, ShoppingBasket, User, ChevronDown } from 'lucide-react';
import Link from 'next/link';

// --- CORRECTION CRITIQUE ICI ---
// Le chemin '../..' remonte de 2 dossiers (layout -> components -> src) pour trouver 'context'
import { useCart } from '../../context/CartContext'; 

export default function Header() {
  // On récupère les outils du panier depuis le contexte
  const { totalItems, setIsCartOpen } = useCart(); 

  // Fonction pour ouvrir le panneau quand on clique sur l'icône
  const handleCartClick = () => {
    console.log("Ouverture du panier"); // Petit test pour la console
    setIsCartOpen(true);
  };

  return (
    <header className="w-full font-sans text-gray-800 sticky top-0 z-30 bg-white shadow-sm">
      
      {/* 1. Bandeau supérieur */}
      <div className="bg-[#5d6e64] text-white text-xs py-2 px-4 flex justify-between items-center">
        <div className="hidden md:flex tracking-widest italic">carte cadeau</div>
        <div className="flex-1 text-center font-light">
          Looking for the perfect gift? A gift card is the perfect solution.
        </div>
        <button className="border border-white px-4 py-1 uppercase text-[10px] hover:bg-white hover:text-[#5d6e64] transition duration-300">
          Shop Gift Cards
        </button>
      </div>

      {/* 2. Zone Principale */}
      <div className="bg-[#6B7A6E] text-white py-6 px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* Devise */}
          <div className="hidden md:flex items-center gap-2 bg-white text-[#5d6e64] px-3 py-1 text-xs font-semibold cursor-pointer">
            <span>USD ($)</span>
            <ChevronDown size={14} />
          </div>

          {/* Logo */}
          <Link href="/" className="text-3xl md:text-5xl font-serif tracking-widest text-center flex-1 cursor-pointer hover:opacity-90">
            VIVI <span className="text-lg italic mx-1 font-serif">et</span> MARGOT
          </Link>

          {/* Icônes */}
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center border border-white/50 px-3 py-1 gap-2">
              <Search size={14} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none outline-none text-xs text-white placeholder-white/70 w-20"
              />
            </div>
            
            {/* BOUTON PANIER (C'est ici que l'action se passe) */}
            <button 
              onClick={handleCartClick}
              className="flex flex-col items-center cursor-pointer hover:opacity-80 transition relative bg-transparent border-none p-0 text-white"
            >
              <ShoppingBasket size={22} strokeWidth={1.5} />
              <span className="text-[10px] italic mt-1 font-serif">panier</span>
              
              {/* Badge Compteur (S'affiche seulement si > 0) */}
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-2 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </button>
            
            <User size={22} strokeWidth={1.5} className="cursor-pointer hover:opacity-80 transition" />
          </div>
        </div>

        {/* 3. Menu de Navigation */}
        <nav className="mt-8 border-t border-white/20 pt-5">
          <ul className="flex flex-wrap justify-center gap-8 text-[11px] md:text-xs uppercase tracking-[0.15em] font-medium">
            {[
              { label: 'Shop Brand', slug: 'shop-brand' },
              { label: 'Kitchen', slug: 'kitchen' },
              { label: 'Baskets', slug: 'baskets' },
              { label: 'Textiles', slug: 'textiles' },
              { label: 'Etc', slug: 'etc' },
              { label: 'Soaps', slug: 'soaps' },
              { label: 'More', slug: 'more' },
            ].map((item) => (
              <li key={item.slug} className="cursor-pointer hover:text-gray-200 transition relative group">
                <Link href={`/category/${item.slug}`} className="block">
                  {item.label}
                </Link>
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all group-hover:w-full"></span>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}