import { Search, ShoppingBasket, User, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full font-sans text-gray-800">
      
      {/* ========================================================== */}
      {/* 1. BANDEAU SUPÉRIEUR (Promo / Carte Cadeau)                */}
      {/* Ce bloc est codé en dur (texte statique).                  */}
      {/* Pour le rendre dynamique, il faudrait le lier à un champ CMS. */}
      {/* ========================================================== */}
      <div className="bg-[#5d6e64] text-white text-xs py-2 px-4 flex justify-between items-center">
        <div className="hidden md:flex tracking-widest italic">carte cadeau</div>
        <div className="flex-1 text-center font-light">
          Looking for the perfect gift? A gift card is the perfect solution.
        </div>
        <button className="border border-white px-4 py-1 uppercase text-[10px] hover:bg-white hover:text-[#5d6e64] transition duration-300">
          Shop Gift Cards
        </button>
      </div>

      {/* ========================================================== */}
      {/* 2. ZONE PRINCIPALE (Logo & Outils de l'utilisateur)        */}
      {/* Le design ici est responsive (masque le champ Search sur mobile). */}
      {/* ========================================================== */}
      <div className="bg-[#6B7A6E] text-white py-8 px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* A Gauche : Sélecteur de devise (Statique pour l'instant) */}
          <div className="hidden md:flex items-center gap-2 bg-white text-[#5d6e64] px-3 py-1 text-xs font-semibold cursor-pointer">
            <span>USD ($)</span>
            <ChevronDown size={14} />
          </div>

          {/* Au Centre : Le Logo - Les polices 'serif' donnent un look élégant */}
          <div className="text-3xl md:text-5xl font-serif tracking-widest text-center flex-1">
            VIVI <span className="text-lg italic mx-1 font-serif">et</span> MARGOT
          </div>

          {/* A Droite : Icônes (Recherche, Panier, Utilisateur) */}
          <div className="flex items-center gap-6">
            {/* Barre de recherche (Icône: Search) */}
            <div className="hidden md:flex items-center border border-white/50 px-3 py-1 gap-2">
              <Search size={14} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none outline-none text-xs text-white placeholder-white/70 w-20"
              />
            </div>
            
            {/* Icône Panier (L'outil 'Lucide-React' fournit les icônes) */}
            <div className="flex flex-col items-center cursor-pointer hover:opacity-80 transition">
              <ShoppingBasket size={22} strokeWidth={1.5} />
              <span className="text-[10px] italic mt-1 font-serif">panier</span>
            </div>
            
            {/* Icône Utilisateur */}
            <User size={22} strokeWidth={1.5} className="cursor-pointer hover:opacity-80 transition" />
          </div>
        </div>

        {/* ========================================================== */}
        {/* 3. MENU DE NAVIGATION (LA PARTIE DYNAMIQUE)               */}
        {/* C'est ici que tu peux ajouter/modifier tes catégories.     */}
        {/* ========================================================== */}
        <nav className="mt-8 border-t border-white/20 pt-5">
          <ul className="flex flex-wrap justify-center gap-8 text-[11px] md:text-xs uppercase tracking-[0.15em] font-medium">
            {/* DONNÉES EN DUR : Pour modifier une catégorie, édite simplement cet ARRAY d'objets : */}
            {[
              // Structure : { label: 'Texte affiché', slug: 'Nom dans l'URL (sans accent, minuscule)' }
              { label: 'Shop Brand', slug: 'shop-brand' },
              { label: 'Kitchen', slug: 'kitchen' },
              { label: 'Baskets', slug: 'baskets' },
              { label: 'Textiles', slug: 'textiles' },
              { label: 'Etc', slug: 'etc' },
              { label: 'Soaps', slug: 'soaps' },
              { label: 'More', slug: 'more' },
            ].map((item) => (
              <li key={item.slug} className="cursor-pointer hover:text-gray-200 transition relative group">
                {/* FONCTIONNEMENT DYNAMIQUE : Le Link utilise le 'slug' pour construire l'URL /category/kitchen */}
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