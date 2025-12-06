"use client"; // Composant Client obligatoire (hooks React et interactivité)

import { Search, ShoppingBasket, User, LogOut } from "lucide-react";
import Link from "next/link";
import { useCart } from "../../context/CartContext"; // Pour le compteur du panier
import { useAuth } from "../../context/AuthContext"; // Pour l'authentification
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation"; // Pour la redirection URL
import { useSettings } from "@/context/SettingsContext"; // Récupère les paramètres du site (Context temps réel)
import { useNavCategories } from "@/context/CategoriesContext"; // Catégories de navigation (menu principal)
import { useIsMobile } from "@/hooks/useMediaQuery"; // Hook pour détecter mobile sans bug d'hydration
import { useProducts } from "@/hooks/useProducts"; // Produits réels depuis Firestore pour les suggestions

export default function Header() {
  const { totalItems, setIsCartOpen } = useCart();
  const { user, signOut, isAdmin } = useAuth(); // Récupération de l'utilisateur, du rôle admin et de la fonction de déconnexion

  // Récupération des catégories depuis Firestore
  const { categories, loading: categoriesLoading } = useNavCategories();

  // Récupération des paramètres du site (nom du site, etc.)
  const { settings, loading: settingsLoading } = useSettings();

  // Détection mobile sans bug d'hydration
  const isMobile = useIsMobile();

  // Styles du header (dont fond du dropdown de recherche)
  const headerStyles = settings?.customStyles?.header || {};
  const searchDropdownBgColor = headerStyles.searchDropdownBgColor || "#ffffff";
  const searchDropdownTextColor =
    headerStyles.searchDropdownTextColor || "#1F2933";

  // Récupération des produits depuis Firestore (pour l'autocomplétion)
  const { products, loading: productsLoading } = useProducts();

  // ==========================================================
  // 1. GESTION DES ÉTATS (STATE)
  // ==========================================================
  const [searchTerm, setSearchTerm] = useState(""); // Ce que l'utilisateur tape
  const [suggestions, setSuggestions] = useState([]); // Liste des produits suggérés
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false); // Panneau de suggestions visible ?
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false); // Barre ouverte sur mobile ?
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // Menu utilisateur ouvert ?

  // Outils de navigation et références DOM
  const router = useRouter();
  const searchContainerRef = useRef(null); // Sert à détecter un clic "en dehors" de la barre
  const searchInputRef = useRef(null); // Sert à mettre le focus (curseur) dans le champ
  const userMenuRef = useRef(null); // Sert à fermer le menu utilisateur au clic extérieur

  // Ouvre le panier latéral
  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  // ==========================================================
  // 2. LOGIQUE DE SUGGESTION (AUTO-COMPLÉTION)
  // Se déclenche à chaque fois que 'searchTerm' change
  // ==========================================================
  useEffect(() => {
    if (
      searchTerm.trim().length > 0 &&
      !productsLoading &&
      products.length > 0
    ) {
      // On filtre les produits qui contiennent le texte tapé
      const filteredSuggestions = products
        .filter((product) =>
          (product.name || "").toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 5); // On ne garde que les 5 premiers

      setSuggestions(filteredSuggestions);
      setIsSuggestionsOpen(filteredSuggestions.length > 0);
    } else {
      // Si aucun terme ou pas encore de produits, on vide les suggestions
      setSuggestions([]);
      setIsSuggestionsOpen(false);
    }
  }, [searchTerm, products, productsLoading]);

  // ==========================================================
  // 3. GESTION CLIC EN DEHORS (UX)
  // Ferme les suggestions si on clique ailleurs sur la page
  // ==========================================================
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsSuggestionsOpen(false);
        // Si le champ est vide et qu'on clique ailleurs, on le referme pour gagner de la place
        if (searchTerm === "") {
          setIsMobileSearchOpen(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchContainerRef, searchTerm, isMobile]);

  // Fermeture du menu utilisateur au clic en dehors
  useEffect(() => {
    function handleClickOutsideUserMenu(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutsideUserMenu);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideUserMenu);
    };
  }, []);

  // ==========================================================
  // 4. GESTION RECHERCHE MOBILE
  // Animation d'ouverture et focus automatique
  // ==========================================================
  const handleMobileSearchToggle = () => {
    if (!isMobileSearchOpen) {
      setIsMobileSearchOpen(true);
      // Petit délai pour laisser le temps à l'élément de s'afficher avant de mettre le focus
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };

  // Lance la recherche et redirige vers la page de résultats
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
      setIsSuggestionsOpen(false); // Ferme les suggestions après validation
      setIsMobileSearchOpen(false); // Ferme la barre mobile après validation
    }
  };

  // Permet de valider avec la touche "Entrée"
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  // ==========================================================
  // 6. GESTION DÉCONNEXION
  // ==========================================================
  const handleSignOut = async () => {
    try {
      await signOut();
      setIsUserMenuOpen(false);
      router.push("/"); // Redirige vers l'accueil après déconnexion
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  return (
    <header className="relative w-full font-sans text-gray-800 sticky top-0 z-30 bg-white shadow-sm">
      {isAdmin && (
        <div className="absolute top-2 left-2 z-40">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-600 text-white text-xs font-semibold shadow">
            1
          </span>
        </div>
      )}
      {/* --- BANDEAU SUPÉRIEUR (Promo) --- */}
      <div className="hidden md:flex bg-[#5d6e64] text-white text-xs py-2 px-4 justify-between items-center">
        <div className="tracking-widest italic">
          {settings?.headerContent?.promoBarLabel || "carte cadeau"}
        </div>
        <div className="flex-1 text-center font-light">
          {settings?.headerContent?.promoBarText ||
            "Looking for the perfect gift? A gift card is the perfect solution."}
        </div>
        <button className="border border-white px-4 py-1 uppercase text-[10px] hover:bg-white hover:text-[#5d6e64] transition duration-300">
          {settings?.headerContent?.promoBarButtonLabel || "Shop Gift Cards"}
        </button>
      </div>

      {/* --- ZONE PRINCIPALE --- */}
      {/* Le fond principal du header est géré par DynamicStyles via <header>. */}
      <div className="text-white py-3 md:py-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl md:text-5xl font-serif tracking-widest text-center flex-1 cursor-pointer hover:opacity-90"
          >
            {settings?.siteName ? (
              settings.siteName.split(" et ").length === 2 ? (
                <>
                  {settings.siteName.split(" et ")[0].toUpperCase()}{" "}
                  <span className="text-lg italic mx-1 font-serif">et</span>{" "}
                  {settings.siteName.split(" et ")[1].toUpperCase()}
                </>
              ) : (
                settings.siteName.toUpperCase()
              )
            ) : (
              "LES BIJOUX DE GUADELOUPE"
            )}
          </Link>

          {/* --- ZONE ICÔNES & RECHERCHE --- */}
          <div className="flex items-center gap-3 md:gap-6">
            {/* Conteneur Recherche (Relatif pour positionner les suggestions) */}
            <div
              ref={searchContainerRef}
              className="flex items-center relative"
            >
              {/* Barre de recherche animée */}
              {/* Sur mobile : s'agrandit au clic grâce aux classes conditionnelles */}
              <div
                className={`
                  flex items-center gap-2 z-10 rounded-full md:rounded-none transition-all duration-200
                  ${
                    isMobileSearchOpen
                      ? "border border-white/60 px-3 py-1.5 bg-[#6B7A6E]"
                      : "px-0 py-0 bg-transparent border-transparent"
                  }
                `}
              >
                <Search
                  size={14}
                  className="text-white cursor-pointer hover:text-gray-200"
                  onClick={(e) => {
                    if (!isMobileSearchOpen) {
                      handleMobileSearchToggle(); // Ouvre sur mobile
                    } else {
                      handleSearch(e); // Cherche si déjà ouvert ou sur PC
                    }
                  }}
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search..."
                  suppressHydrationWarning
                  // Classes conditionnelles pour l'animation de largeur (w-0 -> w-32)
                  className={`
                    bg-transparent border-none outline-none text-xs text-white placeholder-white/70 transition-all duration-300
                    ${
                      isMobileSearchOpen
                        ? "w-32 px-1 md:w-40 md:px-2"
                        : "w-0 px-0 md:w-0 md:px-0"
                    }
                  `}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsSuggestionsOpen(suggestions.length > 0)}
                  onKeyDown={handleKeyDown}
                  onBlur={() => {
                    // Petite tempo pour ne pas fermer si on clique sur une suggestion
                    setTimeout(() => {
                      if (searchTerm === "") setIsMobileSearchOpen(false);
                    }, 200);
                  }}
                />
              </div>

              {/* Panneau des Suggestions (Liste déroulante) */}
              {isSuggestionsOpen && (
                <div
                  className="search-dropdown-panel absolute top-full left-0 mt-2 w-full min-w-[200px] shadow-lg rounded-b-md overflow-hidden z-20"
                  style={{ backgroundColor: searchDropdownBgColor }}
                >
                  <ul>
                    {suggestions.map((product) => (
                      <li key={product.id}>
                        <Link
                          href={`/products/${product.id}`}
                          onClick={() => {
                            setIsSuggestionsOpen(false);
                            setSearchTerm("");
                            setIsMobileSearchOpen(false);
                          }}
                          className="flex items-center gap-3 p-3 hover:bg-gray-100 transition text-gray-700 border-b border-gray-50 last:border-0"
                        >
                          {/* Miniature image */}
                          <div className="w-10 h-12 flex-shrink-0 overflow-hidden rounded-sm bg-gray-100">
                            {product.imageUrl?.startsWith("http") ||
                            product.image?.startsWith("http") ? (
                              <img
                                src={product.imageUrl || product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div
                                className={`w-full h-full ${
                                  product.image || "bg-gray-200"
                                }`}
                              ></div>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span
                              className="text-xs font-serif font-bold"
                              style={{ color: searchDropdownTextColor }}
                            >
                              {product.name}
                            </span>
                            <span
                              className="text-[10px] text-gray-500"
                              style={{ color: searchDropdownTextColor }}
                            >
                              {product.price} €
                            </span>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Bouton Panier */}
            <button
              onClick={handleCartClick}
              className="flex flex-col items-center cursor-pointer hover:opacity-80 transition relative bg-transparent border-none p-0 text-white"
            >
              <ShoppingBasket
                size={20}
                className="md:w-[22px] md:h-[22px]"
                strokeWidth={1.5}
              />
              <span className="hidden md:block text-[10px] italic mt-1 font-serif">
                panier
              </span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-2 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Compte Utilisateur */}
            <div ref={userMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full border border-white/60 bg-white/10 hover:bg-white/20 transition text-white"
                aria-haspopup="menu"
                aria-expanded={isUserMenuOpen}
              >
                <User
                  size={18}
                  className="md:w-[20px] md:h-[20px]"
                  strokeWidth={1.8}
                />
              </button>

              {isUserMenuOpen && (
                <div className="user-menu-panel absolute right-0 mt-3 w-52 bg-white text-gray-800 rounded-lg shadow-lg py-2 text-sm z-40">
                  {user ? (
                    <>
                      <div className="px-4 pb-2 mb-2 border-b border-gray-100 text-xs text-gray-500">
                        Connecté en tant que{" "}
                        <span className="font-medium">
                          {user.email || "client"}
                        </span>
                      </div>

                      <Link
                        href="/compte"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center px-4 py-2 hover:bg-gray-50 transition"
                      >
                        Mon compte
                      </Link>
                      <Link
                        href="/compte/commandes"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center px-4 py-2 hover:bg-gray-50 transition"
                      >
                        Mes commandes
                      </Link>
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-50 text-red-600 transition"
                      >
                        <LogOut size={14} className="mr-2" />
                        Déconnexion
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/mon-compte"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center px-4 py-2 hover:bg-gray-50 transition"
                      >
                        Se connecter / Créer un compte
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- MENU DE NAVIGATION --- */}
        {/* ✨ NOUVEAU : Menu dynamique depuis Firestore */}
        <nav className="mt-4 md:mt-8 border-t border-white/20 pt-3 md:pt-5">
          <ul className="flex flex-wrap justify-center gap-3 md:gap-8 text-[9px] md:text-xs uppercase tracking-[0.15em] font-medium">
            {categoriesLoading ? (
              // Message de chargement pendant la récupération des catégories
              <li className="text-white/50 text-xs">Chargement du menu...</li>
            ) : categories.length === 0 ? (
              // Si aucune catégorie n'est trouvée
              <li className="text-white/50 text-xs">
                Aucune catégorie disponible
              </li>
            ) : (
              // Affichage des catégories dynamiques depuis Firestore
              categories.map((category) => (
                <li
                  key={category.id}
                  className="cursor-pointer hover:text-gray-200 transition relative group"
                >
                  <Link href={`/category/${category.slug}`} className="block">
                    {category.name}
                  </Link>
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all group-hover:w-full"></span>
                </li>
              ))
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
