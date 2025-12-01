/**
 * COMPOSANT : Price
 * ==================
 *
 * Affiche un prix formaté avec la devise configurée dans les paramètres.
 * Utilise les paramètres du site pour afficher la devise correcte.
 *
 * 🆕 NOUVEAU FICHIER CRÉÉ : src/components/Price.jsx
 * DATE : 2025-11-30
 *
 * UTILISATION :
 * ```jsx
 * import Price from '@/components/Price';
 *
 * <Price amount={29.99} />
 * // Affiche : $29.99 (si currency = "USD")
 * // Affiche : 29.99€ (si currency = "EUR")
 * ```
 */

"use client";

import { useSettings } from '@/context/SettingsContext';

export default function Price({ amount, className = "" }) {
  const { settings } = useSettings();

  // Récupérer la devise depuis les paramètres
  const currency = settings?.shop?.currency || "USD";

  // Formatter le prix selon la devise
  const formatPrice = (price, curr) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;

    switch (curr) {
      case "EUR":
        return `${numPrice.toFixed(2)}€`;
      case "GBP":
        return `£${numPrice.toFixed(2)}`;
      case "USD":
      default:
        return `$${numPrice.toFixed(2)}`;
    }
  };

  return (
    <span className={className}>
      {formatPrice(amount, currency)}
    </span>
  );
}

/**
 * ============================================
 * GUIDE D'UTILISATION
 * ============================================
 *
 * 1. Affichage simple :
 *    <Price amount={49.99} />
 *
 * 2. Avec classes CSS personnalisées :
 *    <Price amount={49.99} className="text-2xl font-bold text-red-500" />
 *
 * 3. Dans un composant produit :
 *    <div>
 *      <h3>{product.name}</h3>
 *      <Price amount={product.price} className="text-lg" />
 *    </div>
 *
 * 4. Modification de la devise :
 *    - Aller dans /admin/settings
 *    - Changer "Currency" de USD à EUR ou GBP
 *    - Tous les prix s'adapteront automatiquement
 *
 * DEVISES SUPPORTÉES :
 * - USD : Affiche $XX.XX
 * - EUR : Affiche XX.XX€
 * - GBP : Affiche £XX.XX
 *
 * Pour ajouter d'autres devises, modifier le switch dans formatPrice()
 *
 * ============================================
 */
