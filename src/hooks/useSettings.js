/**
 * HOOK PERSONNALISÉ : useSettings
 * =================================
 *
 * Ce hook récupère et gère les paramètres généraux du site depuis Firestore.
 * Permet de personnaliser le nom du site, les couleurs, les informations de contact, etc.
 *
 * 🆕 NOUVEAU FICHIER CRÉÉ : src/hooks/useSettings.js
 * DATE : 2025-11-30
 *
 * UTILISATION :
 * ```jsx
 * import { useSettings } from '@/hooks/useSettings';
 *
 * function Header() {
 *   const { settings, loading } = useSettings();
 *
 *   return <h1>{settings?.siteName || 'Chargement...'}</h1>;
 * }
 * ```
 */

"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import cmsConfig from '../../cms.config';

/**
 * Hook pour récupérer les paramètres généraux du site
 *
 * Structure des paramètres :
 * - siteName : Nom du site
 * - siteDescription : Description du site
 * - email : Email de contact
 * - phone : Téléphone
 * - address : Adresse physique
 * - social : { facebook, instagram, twitter }
 * - shop : { currency, shippingCost, freeShippingThreshold, taxRate }
 * - homepage : { heroTitle, heroSubtitle, showNewArrivals, productsPerPage }
 *
 * @returns {Object} - { settings: Object, loading: Boolean, error: String|null }
 */
export function useSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    /**
     * Récupère les paramètres depuis Firestore
     * Si aucun paramètre n'existe, crée les paramètres par défaut depuis cms.config.js
     */
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);

        // On utilise un document unique avec l'ID "general"
        const settingsDocRef = doc(db, cmsConfig.collections.settings, "general");
        const settingsDoc = await getDoc(settingsDocRef);

        if (settingsDoc.exists()) {
          // Si les paramètres existent, on les charge
          setSettings(settingsDoc.data());
        } else {
          // Si aucun paramètre n'existe, on crée les paramètres par défaut
          console.log("Paramètres non trouvés. Initialisation avec les valeurs par défaut...");

          const defaultSettings = cmsConfig.defaultSettings;
          await setDoc(settingsDocRef, {
            ...defaultSettings,
            createdAt: new Date(),
            updatedAt: new Date()
          });

          setSettings(defaultSettings);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des paramètres:", err);
        setError(err.message);

        // En cas d'erreur, utiliser les paramètres par défaut du config
        setSettings(cmsConfig.defaultSettings);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading, error };
}

/**
 * Fonction pour mettre à jour les paramètres généraux
 *
 * @param {Object} updates - Données à mettre à jour
 * @returns {Promise<void>}
 */
export async function updateSettings(updates) {
  try {
    const settingsDocRef = doc(db, cmsConfig.collections.settings, "general");

    // Récupère les paramètres actuels pour fusionner
    const currentSettings = await getDoc(settingsDocRef);

    if (currentSettings.exists()) {
      // Mise à jour des paramètres existants
      await setDoc(settingsDocRef, {
        ...currentSettings.data(),
        ...updates,
        updatedAt: new Date()
      });
    } else {
      // Création des paramètres s'ils n'existent pas
      await setDoc(settingsDocRef, {
        ...cmsConfig.defaultSettings,
        ...updates,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour des paramètres:", error);
    throw error;
  }
}

/**
 * Fonction pour réinitialiser les paramètres aux valeurs par défaut
 *
 * @returns {Promise<void>}
 */
export async function resetSettings() {
  try {
    const settingsDocRef = doc(db, cmsConfig.collections.settings, "general");

    await setDoc(settingsDocRef, {
      ...cmsConfig.defaultSettings,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error("Erreur lors de la réinitialisation des paramètres:", error);
    throw error;
  }
}

/**
 * Hook pour récupérer un paramètre spécifique
 * Utile pour accéder rapidement à une valeur sans charger tous les paramètres
 *
 * @param {String} key - Clé du paramètre (ex: "siteName", "shop.currency")
 * @returns {Object} - { value: Any, loading: Boolean, error: String|null }
 */
export function useSetting(key) {
  const { settings, loading, error } = useSettings();
  const [value, setValue] = useState(null);

  useEffect(() => {
    if (settings && !loading) {
      // Support des clés imbriquées (ex: "shop.currency")
      const keys = key.split('.');
      let result = settings;

      for (const k of keys) {
        result = result?.[k];
      }

      setValue(result);
    }
  }, [settings, loading, key]);

  return { value, loading, error };
}

/**
 * ============================================
 * GUIDE D'UTILISATION
 * ============================================
 *
 * 1. Récupérer tous les paramètres :
 *    const { settings, loading, error } = useSettings();
 *    console.log(settings.siteName);
 *
 * 2. Récupérer un paramètre spécifique :
 *    const { value } = useSetting('siteName');
 *    const { value: currency } = useSetting('shop.currency');
 *
 * 3. Mettre à jour les paramètres :
 *    await updateSettings({
 *      siteName: "Nouveau Nom",
 *      email: "nouveau@email.com"
 *    });
 *
 * 4. Réinitialiser aux valeurs par défaut :
 *    await resetSettings();
 *
 * EXEMPLES D'UTILISATION DANS LES COMPOSANTS :
 *
 * // Afficher le nom du site dans le Header
 * function Header() {
 *   const { settings } = useSettings();
 *   return <h1>{settings?.siteName}</h1>;
 * }
 *
 * // Afficher les informations de contact dans le Footer
 * function Footer() {
 *   const { settings } = useSettings();
 *   return (
 *     <div>
 *       <p>Email: {settings?.email}</p>
 *       <p>Téléphone: {settings?.phone}</p>
 *       <p>Adresse: {settings?.address}</p>
 *     </div>
 *   );
 * }
 *
 * // Utiliser la devise dans les prix
 * function Product({ price }) {
 *   const { value: currency } = useSetting('shop.currency');
 *   return <p>{price} {currency}</p>;
 * }
 *
 * ============================================
 */
