import { Instagram, Facebook, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white text-gray-600 py-16 border-t border-gray-200 mt-10">
      <div className="max-w-4xl mx-auto px-6 text-center">
        
        {/* 1. Cercle Logo (Simplifié) */}
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 rounded-full border border-gray-300 flex items-center justify-center">
             {/* Ici on mettrait une image, on met du texte pour l'instant */}
             <div className="text-center">
                <span className="block font-serif text-sm italic">Vivi</span>
                <span className="block text-[8px]">&</span>
                <span className="block font-serif text-sm italic">Margot</span>
             </div>
          </div>
        </div>

        {/* 2. Titre */}
        <h3 className="font-serif text-xl tracking-widest text-gray-800 mb-8 uppercase">
          VIVI <span className="italic text-sm mx-1">et</span> MARGOT
        </h3>

        {/* 3. Réseaux Sociaux & Recherche */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-10">
            <div className="flex gap-4">
                <Instagram size={20} className="cursor-pointer hover:text-[#5d6e64] transition"/>
                <Facebook size={20} className="cursor-pointer hover:text-[#5d6e64] transition"/>
                <Mail size={20} className="cursor-pointer hover:text-[#5d6e64] transition"/>
            </div>
            
            {/* Barre recherche footer */}
            <div className="relative">
                <input 
                    type="text" 
                    placeholder="Search..." 
                    className="border border-gray-300 px-4 py-1 text-xs w-48 focus:outline-none focus:border-[#5d6e64]"
                />
            </div>
        </div>

        {/* 4. Liens Utiles */}
        <div className="flex flex-wrap justify-center gap-6 text-[10px] uppercase tracking-widest text-gray-500 mb-8">
            <a href="#" className="hover:underline">Gift Cards</a>
            <a href="#" className="hover:underline">Contact</a>
            <a href="#" className="hover:underline">Policy & Returns</a>
            <a href="#" className="hover:underline">Accessibility Statement</a>
        </div>

        {/* 5. Copyright */}
        <div className="text-[10px] text-gray-400">
            © 2025 Vivi et Margot. All rights reserved.
        </div>

      </div>
    </footer>
  );
}