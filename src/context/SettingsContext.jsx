/**
 * CONTEXTE : Paramètres du Site
 * ==============================
 *
 * Context provider pour les paramètres généraux du site.
 * Permet de partager les paramètres entre tous les composants
 * et de les mettre à jour de manière réactive.
 *
 * 🆕 NOUVEAU FICHIER : src/context/SettingsContext.jsx
 * DATE : 2025-11-30
 */

"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import cmsConfig from '../../cms.config';

// Créer le contexte
const SettingsContext = createContext({});

// Hook pour utiliser le contexte
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings doit être utilisé dans un SettingsProvider');
  }
  return context;
};

/**
 * Provider des paramètres du site
 */
export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Référence au document des paramètres
    const settingsDocRef = doc(db, cmsConfig.collections.settings, "general");

    // Écouter les changements en temps réel avec onSnapshot
    const unsubscribe = onSnapshot(
      settingsDocRef,
      async (docSnapshot) => {
        try {
          if (docSnapshot.exists()) {
            // Les paramètres existent, on les charge
            setSettings(docSnapshot.data());
            setError(null);
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
      },
      (err) => {
        console.error("Erreur Firestore onSnapshot:", err);
        setError(err.message);
        setSettings(cmsConfig.defaultSettings);
        setLoading(false);
      }
    );

    // Nettoyer l'écoute lors du démontage du composant
    return () => unsubscribe();
  }, []);

  /**
   * Fonction pour mettre à jour les paramètres
   */
  const updateSettings = async (updates) => {
    try {
      const settingsDocRef = doc(db, cmsConfig.collections.settings, "general");

      await setDoc(settingsDocRef, {
        ...settings,
        ...updates,
        updatedAt: new Date()
      });

      // Pas besoin de setSettings ici car onSnapshot va le faire automatiquement
    } catch (err) {
      console.error("Erreur lors de la mise à jour des paramètres:", err);
      throw err;
    }
  };

  /**
   * Fonction pour réinitialiser les paramètres
   */
  const resetSettings = async () => {
    try {
      const settingsDocRef = doc(db, cmsConfig.collections.settings, "general");

      await setDoc(settingsDocRef, {
        ...cmsConfig.defaultSettings,
        updatedAt: new Date()
      });

      // Pas besoin de setSettings ici car onSnapshot va le faire automatiquement
    } catch (err) {
      console.error("Erreur lors de la réinitialisation des paramètres:", err);
      throw err;
    }
  };

  const value = {
    settings,
    loading,
    error,
    updateSettings,
    resetSettings,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

/**
 * ============================================
 * GUIDE D'UTILISATION
 * ============================================
 *
 * 1. Envelopper l'application dans le Provider (layout.js) :
 *
 * import { SettingsProvider } from '@/context/SettingsContext';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <SettingsProvider>
 *       {children}
 *     </SettingsProvider>
 *   );
 * }
 *
 * 2. Utiliser les paramètres dans n'importe quel composant :
 *
 * import { useSettings } from '@/context/SettingsContext';
 *
 * function Header() {
 *   const { settings, loading } = useSettings();
 *
 *   if (loading) return <div>Chargement...</div>;
 *
 *   return <h1>{settings.siteName}</h1>;
 * }
 *
 * 3. Mettre à jour les paramètres :
 *
 * const { updateSettings } = useSettings();
 *
 * await updateSettings({
 *   siteName: "Nouveau Nom"
 * });
 *
 * AVANTAGES :
 * - Temps réel : Les changements sont visibles immédiatement partout
 * - Performance : Un seul listener Firestore pour toute l'app
 * - Simplicité : Pas besoin de recharger manuellement
 *
 * ============================================
 */
