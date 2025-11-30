/**
 * PAGE ADMIN : Paramètres Généraux
 * ==================================
 *
 * Interface admin pour gérer tous les paramètres du site :
 * - Informations générales (nom, description, contact)
 * - Réseaux sociaux (Facebook, Instagram, Twitter)
 * - Paramètres boutique (devise, frais de port, TVA)
 * - Page d'accueil (titre hero, affichage)
 *
 * 🆕 NOUVEAU FICHIER CRÉÉ : src/app/admin/settings/page.js
 * DATE : 2025-11-30
 *
 * FONCTIONNALITÉS :
 * - Formulaire organisé par sections
 * - Sauvegarde en temps réel
 * - Réinitialisation aux valeurs par défaut
 * - Prévisualisation des changements
 */

"use client";

import { useState, useEffect } from 'react';
import { useSettings, updateSettings, resetSettings } from '@/hooks/useSettings';
import { Save, RotateCcw, Globe, Store, Home, Share2 } from 'lucide-react';

export default function AdminSettingsPage() {
  // Récupération des paramètres actuels
  const { settings, loading, error } = useSettings();

  // État local pour le formulaire
  const [formData, setFormData] = useState(null);

  // Messages de succès/erreur
  const [message, setMessage] = useState({ type: '', text: '' });

  // État de sauvegarde
  const [isSaving, setIsSaving] = useState(false);

  /**
   * Initialiser le formulaire avec les paramètres chargés
   */
  useEffect(() => {
    if (settings && !formData) {
      setFormData(settings);
    }
  }, [settings, formData]);

  /**
   * Afficher un message temporaire
   */
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  /**
   * Gérer les changements dans les champs du formulaire
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const keys = name.split('.');

    if (keys.length === 1) {
      // Champ simple (ex: siteName)
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    } else if (keys.length === 2) {
      // Champ imbriqué (ex: social.facebook)
      setFormData(prev => ({
        ...prev,
        [keys[0]]: {
          ...prev[keys[0]],
          [keys[1]]: type === 'checkbox' ? checked : value
        }
      }));
    } else if (keys.length === 3) {
      // Champ doublement imbriqué (ex: shop.currency)
      setFormData(prev => ({
        ...prev,
        [keys[0]]: {
          ...prev[keys[0]],
          [keys[1]]: {
            ...prev[keys[0]]?.[keys[1]],
            [keys[2]]: type === 'checkbox' ? checked : value
          }
        }
      }));
    }
  };

  /**
   * SAUVEGARDER LES PARAMÈTRES
   */
  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setIsSaving(true);
      await updateSettings(formData);
      showMessage('success', 'Paramètres sauvegardés avec succès');
    } catch (err) {
      showMessage('error', `Erreur : ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * RÉINITIALISER AUX VALEURS PAR DÉFAUT
   */
  const handleReset = async () => {
    const confirmed = window.confirm(
      'Voulez-vous vraiment réinitialiser tous les paramètres aux valeurs par défaut ? Cette action est irréversible.'
    );

    if (!confirmed) return;

    try {
      setIsSaving(true);
      await resetSettings();
      showMessage('success', 'Paramètres réinitialisés avec succès');

      // Recharger la page pour afficher les nouvelles valeurs
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      showMessage('error', `Erreur : ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500 text-sm">Chargement des paramètres...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-500 text-sm">Erreur : {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">

        {/* En-tête */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif text-gray-800 mb-2">Paramètres du Site</h1>
            <p className="text-sm text-gray-500">Personnalisez les informations générales de votre site</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleReset}
              disabled={isSaving}
              className="bg-gray-400 text-white px-6 py-3 text-sm uppercase tracking-wider hover:bg-gray-500 transition flex items-center gap-2 disabled:opacity-50"
            >
              <RotateCcw size={16} />
              Réinitialiser
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-[#5d6e64] text-white px-6 py-3 text-sm uppercase tracking-wider hover:bg-[#4a5850] transition flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={16} />
              {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </div>

        {/* Message de succès/erreur */}
        {message.text && (
          <div className={`mb-6 p-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">

          {/* SECTION 1 : INFORMATIONS GÉNÉRALES */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b">
              <Globe className="text-[#5d6e64]" size={24} />
              <h2 className="text-xl font-serif text-gray-800">Informations Générales</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                  Nom du Site
                </label>
                <input
                  type="text"
                  name="siteName"
                  value={formData.siteName || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 text-sm"
                  placeholder="Ex: Vivi et Margot"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                  Description du Site
                </label>
                <textarea
                  name="siteDescription"
                  value={formData.siteDescription || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 text-sm"
                  rows="3"
                  placeholder="Description courte de votre site"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                  Email de Contact
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 text-sm"
                  placeholder="contact@example.com"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 text-sm"
                  placeholder="+33 6 12 34 56 78"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                  Adresse
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 text-sm"
                  placeholder="123 Rue Exemple, 75001 Paris"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2 : RÉSEAUX SOCIAUX */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b">
              <Share2 className="text-[#5d6e64]" size={24} />
              <h2 className="text-xl font-serif text-gray-800">Réseaux Sociaux</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                  Facebook
                </label>
                <input
                  type="url"
                  name="social.facebook"
                  value={formData.social?.facebook || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 text-sm"
                  placeholder="https://facebook.com/..."
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                  Instagram
                </label>
                <input
                  type="url"
                  name="social.instagram"
                  value={formData.social?.instagram || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 text-sm"
                  placeholder="https://instagram.com/..."
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                  Twitter
                </label>
                <input
                  type="url"
                  name="social.twitter"
                  value={formData.social?.twitter || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 text-sm"
                  placeholder="https://twitter.com/..."
                />
              </div>
            </div>
          </div>

          {/* SECTION 3 : PARAMÈTRES BOUTIQUE */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b">
              <Store className="text-[#5d6e64]" size={24} />
              <h2 className="text-xl font-serif text-gray-800">Paramètres Boutique</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                  Devise
                </label>
                <input
                  type="text"
                  name="shop.currency"
                  value={formData.shop?.currency || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 text-sm"
                  placeholder="€"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                  Frais de Port
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="shop.shippingCost"
                  value={formData.shop?.shippingCost || 0}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 text-sm"
                  placeholder="5.00"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                  Livraison Gratuite à Partir De
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="shop.freeShippingThreshold"
                  value={formData.shop?.freeShippingThreshold || 0}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 text-sm"
                  placeholder="50.00"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                  Taux de TVA (%)
                </label>
                <input
                  type="number"
                  name="shop.taxRate"
                  value={formData.shop?.taxRate || 0}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 text-sm"
                  placeholder="20"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4 : PAGE D'ACCUEIL */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b">
              <Home className="text-[#5d6e64]" size={24} />
              <h2 className="text-xl font-serif text-gray-800">Page d'Accueil</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                  Titre Hero
                </label>
                <input
                  type="text"
                  name="homepage.heroTitle"
                  value={formData.homepage?.heroTitle || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 text-sm"
                  placeholder="Bienvenue chez Vivi et Margot"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                  Sous-titre Hero
                </label>
                <input
                  type="text"
                  name="homepage.heroSubtitle"
                  value={formData.homepage?.heroSubtitle || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 text-sm"
                  placeholder="Découvrez notre collection d'artisanat"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                  Produits par Page
                </label>
                <input
                  type="number"
                  name="homepage.productsPerPage"
                  value={formData.homepage?.productsPerPage || 9}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 text-sm"
                  placeholder="9"
                />
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="homepage.showNewArrivals"
                    checked={formData.homepage?.showNewArrivals || false}
                    onChange={handleChange}
                    className="w-5 h-5"
                  />
                  <span className="text-xs uppercase tracking-wider text-gray-600">
                    Afficher "Nouveautés"
                  </span>
                </label>
              </div>
            </div>
          </div>

        </form>

        {/* Aide */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 Aide</h3>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• <strong>Sauvegarde :</strong> Les modifications sont appliquées immédiatement sur tout le site.</li>
            <li>• <strong>Réseaux sociaux :</strong> Laissez vide si vous ne souhaitez pas afficher le réseau.</li>
            <li>• <strong>Réinitialisation :</strong> Restaure les valeurs définies dans cms.config.js.</li>
            <li>• <strong>Devise :</strong> Utilisée pour l'affichage des prix sur tout le site.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/**
 * ============================================
 * GUIDE D'UTILISATION
 * ============================================
 *
 * Cette page permet de configurer tous les paramètres du site :
 *
 * 1. INFORMATIONS GÉNÉRALES :
 *    - Nom du site, description
 *    - Email, téléphone, adresse
 *
 * 2. RÉSEAUX SOCIAUX :
 *    - Liens vers Facebook, Instagram, Twitter
 *
 * 3. BOUTIQUE :
 *    - Devise (€, $, etc.)
 *    - Frais de port
 *    - Seuil livraison gratuite
 *    - Taux de TVA
 *
 * 4. PAGE D'ACCUEIL :
 *    - Textes hero
 *    - Nombre de produits affichés
 *    - Options d'affichage
 *
 * ACCÈS : /admin/settings
 *
 * ============================================
 */
