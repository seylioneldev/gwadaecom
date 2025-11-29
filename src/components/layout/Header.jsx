import { Search, ShoppingBasket, User, ChevronDown } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full font-sans text-gray-800">
      {/* 1. Bandeau supérieur (Gris/Vert) */}
      <div className="bg-[#5d6e64] text-white text-xs py-2 px-4 flex justify-between items-center">
        <div className="hidden md:flex tracking-widest italic">carte cadeau</div>
        <div className="flex-1 text-center font-light">
          Looking for the perfect gift? A gift card is the perfect solution.
        </div>
        <button className="border border-white px-4 py-1 uppercase text-[10px] hover:bg-white hover:text-[#5d6e64] transition duration-300">
          Shop Gift Cards
        </button>
      </div>

      {/* 2. Zone Principale (Logo & Outils) */}
      <div className="bg-[#6B7A6E] text-white py-8 px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* A Gauche : Sélecteur de devise */}
          <div className="hidden md:flex items-center gap-2 bg-white text-[#5d6e64] px-3 py-1 text-xs font-semibold cursor-pointer">
            <span>USD ($)</span>
            <ChevronDown size={14} />
          </div>

          {/* Au Centre : Le Logo */}
          <div className="text-3xl md:text-5xl font-serif tracking-widest text-center flex-1">
            VIVI <span className="text-lg italic mx-1 font-serif">et</span> MARGOT
          </div>

          {/* A Droite : Icônes */}
          <div className="flex items-center gap-6">
            {/* Barre de recherche */}
            <div className="hidden md:flex items-center border border-white/50 px-3 py-1 gap-2">
              <Search size={14} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none outline-none text-xs text-white placeholder-white/70 w-20"
              />
            </div>
            
            <div className="flex flex-col items-center cursor-pointer hover:opacity-80 transition">
              <ShoppingBasket size={22} strokeWidth={1.5} />
              <span className="text-[10px] italic mt-1 font-serif">panier</span>
            </div>
            
            <User size={22} strokeWidth={1.5} className="cursor-pointer hover:opacity-80 transition" />
          </div>
        </div>

        {/* 3. Menu de Navigation */}
        <nav className="mt-8 border-t border-white/20 pt-5">
          <ul className="flex flex-wrap justify-center gap-8 text-[11px] md:text-xs uppercase tracking-[0.15em] font-medium">
            {['Shop Brand', 'Kitchen', 'Baskets', 'Textiles', 'Etc', 'Soaps', 'More'].map((item) => (
              <li key={item} className="cursor-pointer hover:text-gray-200 transition relative group">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all group-hover:w-full"></span>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}