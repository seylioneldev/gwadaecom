import { useState, useEffect } from "react";

/**
 * Hook personnalisé pour détecter la taille d'écran
 * Évite les problèmes d'hydration en n'évaluant window qu'après le montage
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event) => setMatches(event.matches);
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  // Retourne false pendant le SSR et le premier rendu
  // pour correspondre au HTML du serveur
  return mounted ? matches : false;
}

/**
 * Hook spécifique pour mobile (< 768px)
 */
export function useIsMobile() {
  return useMediaQuery("(max-width: 767px)");
}
