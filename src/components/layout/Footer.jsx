import { Instagram, Facebook, Mail } from 'lucide-react';

export default function Footer() {
  return (
    // ==========================================================
    // 1. BLOC CONTENEUR (Arrière-plan et marges)
    // Ce bloc définit le style général du pied de page
    // ==========================================================
    <footer className="bg-white text-gray-600 py-16 border-t border-gray-200 mt-10">
      <div className="max-w-4xl mx-auto px-6 text-center">
        
        {/* ========================================================== */}
        {/* 2. CERCLE LOGO (Structure statique pour l'image/texte)   */}
        {/* À remplacer par une vraie image de logo si tu en as une. */}
        {/* ========================================================== */}
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 rounded-full border border-gray-300 flex items-center justify-center">
             {/* DONNÉES EN DUR : Texte du logo temporaire */}
             <div className="text-center">
                <span className="block font-serif text-sm italic">Vivi</span>
                <span className="block text-[8px]">&</span>
                <span className="block font-serif text-sm italic">Margot</span>
             </div>
          </div>
        </div>

        {/* 3. TITRE PRINCIPAL DU FOOTER (Texte facilement modifiable) */}
        <h3 className="font-serif text-xl tracking-widest text-gray-800 mb-8 uppercase">
          VIVI <span className="italic text-sm mx-1">et</span> MARGOT
        </h3>

        {/* ========================================================== */}
        {/* 4. RÉSEAUX SOCIAUX & RECHERCHE                             */}
        {/* Liens et icônes fournis par 'Lucide-React'                */}
        {/* ========================================================== */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-10">
            {/* Les icônes Instagram, Facebook, Mail */}
            <div className="flex gap-4">
                {/* Pour lier l'icône à ton compte, tu devrais l'entourer d'une balise <a> */}
                <Instagram size={20} className="cursor-pointer hover:text-[#5d6e64] transition"/>
                <Facebook size={20} className="cursor-pointer hover:text-[#5d6e64] transition"/>
                <Mail size={20} className="cursor-pointer hover:text-[#5d6e64] transition"/>
            </div>
            
            {/* Champ de recherche */}
            <div className="relative">
                <input 
                    type="text" 
                    placeholder="Search..." // <-- Texte à modifier
                    className="border border-gray-300 px-4 py-1 text-xs w-48 focus:outline-none focus:border-[#5d6e64]"
                />
            </div>
        </div>

        {/* ========================================================== */}
        {/* 5. LIENS UTILES (Structure future pour les conditions)     */}
        {/* Pour la gestion CMS, ces liens seraient chargés depuis une DB. */}
        {/* ========================================================== */}
        <div className="flex flex-wrap justify-center gap-6 text-[10px] uppercase tracking-widest text-gray-500 mb-8">
            {/* Chaque <a> est un lien. Change le texte et la propriété href="#" */}
            <a href="#" className="hover:underline">Gift Cards</a>
            <a href="#" className="hover:underline">Contact</a>
            <a href="#" className="hover:underline">Policy & Returns</a>
            <a href="#" className="hover:underline">Accessibility Statement</a>
        </div>

        {/* 6. COPYRIGHT (Informations légales) */}
        <div className="text-[10px] text-gray-400">
            © 2025 Vivi et Margot. All rights reserved. // Année à vérifier / Texte à modifier
        </div>

      </div>
    </footer>
  );
}