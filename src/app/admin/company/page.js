/**
 * PAGE ADMIN : Paramètres de la Société
 * ======================================
 *
 * Interface admin pour gérer les paramètres de facturation :
 * - Configuration de la TVA (taux par défaut, TVA réduite, etc.)
 * - Frais de livraison standard
 * - Frais de livraison spécifiques par ville en Guadeloupe
 *
 * 🆕 NOUVEAU FICHIER CRÉÉ : src/app/admin/company/page.js
 * DATE : 2025-12-05
 */

"use client";

import { useState, useEffect } from "react";
import { useSettings } from "@/context/SettingsContext";
import {
  Save,
  ArrowLeft,
  DollarSign,
  Truck,
  MapPin,
  Plus,
  Trash2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

export default function CompanySettingsPage() {
  const { settings, loading, error, updateSettings } = useSettings();

  // État local pour le formulaire
  const [formData, setFormData] = useState({
    shop: {
      currency: "€",
      taxRate: 20,
      reducedTaxRate: 10,
      shippingCost: 5.0,
      freeShippingThreshold: 50.0,
    },
    shipping: {
      cities: [],
    },
  });

  // Messages de succès/erreur
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isSaving, setIsSaving] = useState(false);

  // Villes de la Guadeloupe avec codes postaux
  const guadeloupeRegions = [
    { name: "Pointe-à-Pitre", postalCode: "97110" },
    { name: "Les Abymes", postalCode: "97139" },
    { name: "Baie-Mahault", postalCode: "97122" },
    { name: "Le Gosier", postalCode: "97190" },
    { name: "Sainte-Anne", postalCode: "97180" },
    { name: "Saint-François", postalCode: "97118" },
    { name: "Le Moule", postalCode: "97160" },
    { name: "Petit-Bourg", postalCode: "97170" },
    { name: "Capesterre-Belle-Eau", postalCode: "97130" },
    { name: "Gourbeyre", postalCode: "97113" },
    { name: "Trois-Rivières", postalCode: "97114" },
    { name: "Basse-Terre", postalCode: "97100" },
    { name: "Bouillante", postalCode: "97125" },
    { name: "Pointe-Noire", postalCode: "97116" },
    { name: "Deshaies", postalCode: "97126" },
    { name: "Sainte-Rose", postalCode: "97115" },
    { name: "Lamentin", postalCode: "97129" },
    { name: "Morne-à-l'Eau", postalCode: "97111" },
    { name: "Port-Louis", postalCode: "97117" },
    { name: "Anse-Bertrand", postalCode: "97121" },
  ];

  /**
   * Initialiser le formulaire avec les paramètres chargés
   */
  useEffect(() => {
    if (settings) {
      setFormData({
        shop: {
          currency: settings.shop?.currency || "€",
          taxRate: settings.shop?.taxRate || 20,
          reducedTaxRate: settings.shop?.reducedTaxRate || 10,
          shippingCost: settings.shop?.shippingCost || 5.0,
          freeShippingThreshold: settings.shop?.freeShippingThreshold || 50.0,
        },
        shipping: {
          cities: settings.shipping?.cities || [],
        },
      });
    }
  }, [settings]);

  /**
   * Afficher un message temporaire
   */
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  /**
   * Gérer les changements dans les champs du formulaire
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");

    if (keys.length === 2 && keys[0] === "shop") {
      setFormData((prev) => ({
        ...prev,
        shop: {
          ...prev.shop,
          [keys[1]]: value,
        },
      }));
    }
  };

  /**
   * Ajouter une ville spécifique pour la livraison
   */
  const addCityShipping = () => {
    setFormData((prev) => ({
      ...prev,
      shipping: {
        ...prev.shipping,
        cities: [
          ...prev.shipping.cities,
          { city: "", postalCode: "", cost: 5.0 },
        ],
      },
    }));
  };

  /**
   * Supprimer une ville spécifique
   */
  const removeCityShipping = (index) => {
    setFormData((prev) => ({
      ...prev,
      shipping: {
        ...prev.shipping,
        cities: prev.shipping.cities.filter((_, i) => i !== index),
      },
    }));
  };

  /**
   * Mettre à jour une ville spécifique
   */
  const updateCityShipping = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      shipping: {
        ...prev.shipping,
        cities: prev.shipping.cities.map((city, i) =>
          i === index ? { ...city, [field]: value } : city
        ),
      },
    }));
  };

  /**
   * SAUVEGARDER LES PARAMÈTRES
   */
  const handleSave = async (e) => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }

    try {
      setIsSaving(true);

      // Fusionner avec les paramètres existants
      const updatedSettings = {
        ...settings,
        shop: {
          ...settings.shop,
          ...formData.shop,
        },
        shipping: formData.shipping,
      };

      await updateSettings(updatedSettings);
      showMessage("success", "Paramètres sauvegardés avec succès");
    } catch (err) {
      showMessage("error", `Erreur : ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
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
        <div className="flex justify-between items-start mb-8 sticky top-0 z-20 bg-gray-50 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="p-2 hover:bg-gray-200 rounded-full transition"
            >
              <ArrowLeft size={24} className="text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-serif text-gray-800 mb-2">
                Paramètres de la Société
              </h1>
              <p className="text-sm text-gray-500">
                Configurez la TVA et les frais de livraison
              </p>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[#5d6e64] text-white px-6 py-3 text-sm uppercase tracking-wider hover:bg-[#4a5850] transition flex items-center gap-2 disabled:opacity-50"
          >
            <Save size={16} />
            {isSaving ? "Sauvegarde..." : "Sauvegarder"}
          </button>
        </div>

        {/* Message de succès/erreur */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded ${
              message.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* SECTION 1 : CONFIGURATION TVA */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b">
              <DollarSign className="text-[#5d6e64]" size={24} />
              <h2 className="text-xl font-serif text-gray-800">
                Configuration de la TVA
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                  Devise
                </label>
                <input
                  type="text"
                  name="shop.currency"
                  value={formData.shop.currency}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 text-sm"
                  placeholder="€"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                  Taux de TVA Normal (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="shop.taxRate"
                  value={formData.shop.taxRate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 text-sm"
                  placeholder="20"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                  Taux de TVA Réduit (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="shop.reducedTaxRate"
                  value={formData.shop.reducedTaxRate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 text-sm"
                  placeholder="10"
                />
              </div>
            </div>

            <div className="mt-4 bg-blue-50 border border-blue-200 rounded p-4">
              <div className="flex items-start gap-2">
                <AlertCircle size={16} className="text-blue-600 mt-0.5" />
                <div className="text-xs text-blue-800">
                  <p className="font-semibold mb-1">
                    À propos de la TVA en Guadeloupe
                  </p>
                  <p>
                    Le taux normal de TVA en Guadeloupe est de 8,5%. Le taux
                    réduit est de 2,1%. Ces taux sont différents de ceux de la
                    France métropolitaine.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2 : FRAIS DE LIVRAISON STANDARD */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b">
              <Truck className="text-[#5d6e64]" size={24} />
              <h2 className="text-xl font-serif text-gray-800">
                Frais de Livraison Standard
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                  Frais de Port Standard ({formData.shop.currency})
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="shop.shippingCost"
                  value={formData.shop.shippingCost}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 text-sm"
                  placeholder="5.00"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                  Livraison Gratuite à Partir De ({formData.shop.currency})
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="shop.freeShippingThreshold"
                  value={formData.shop.freeShippingThreshold}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 text-sm"
                  placeholder="50.00"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3 : FRAIS DE LIVRAISON PAR VILLE */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-6 pb-4 border-b">
              <div className="flex items-center gap-2">
                <MapPin className="text-[#5d6e64]" size={24} />
                <h2 className="text-xl font-serif text-gray-800">
                  Frais de Livraison par Ville (Guadeloupe)
                </h2>
              </div>
              <button
                type="button"
                onClick={addCityShipping}
                className="bg-[#5d6e64] text-white px-4 py-2 text-sm rounded hover:bg-[#4a5850] transition flex items-center gap-2"
              >
                <Plus size={16} />
                Ajouter une Ville
              </button>
            </div>

            {formData.shipping.cities.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                <MapPin size={48} className="mx-auto mb-3 text-gray-300" />
                <p>Aucune ville spécifique configurée</p>
                <p className="text-xs mt-1">
                  Les frais de livraison standard seront appliqués partout
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {formData.shipping.cities.map((city, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded p-4 hover:border-gray-300 transition"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs text-gray-600 mb-2">
                          Ville
                        </label>
                        <select
                          value={city.city}
                          onChange={(e) => {
                            const selectedCity = e.target.value;
                            updateCityShipping(index, "city", selectedCity);

                            // Auto-remplir le code postal
                            const selectedRegion = guadeloupeRegions.find(
                              (r) => r.name === selectedCity
                            );
                            if (selectedRegion) {
                              updateCityShipping(
                                index,
                                "postalCode",
                                selectedRegion.postalCode
                              );
                            }
                          }}
                          className="w-full border border-gray-300 px-4 py-2 text-sm rounded"
                        >
                          <option value="">Sélectionner une ville</option>
                          {guadeloupeRegions.map((region) => (
                            <option key={region.name} value={region.name}>
                              {region.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs text-gray-600 mb-2">
                          Code Postal
                        </label>
                        <input
                          type="text"
                          value={city.postalCode}
                          onChange={(e) =>
                            updateCityShipping(
                              index,
                              "postalCode",
                              e.target.value
                            )
                          }
                          className="w-full border border-gray-300 px-4 py-2 text-sm rounded"
                          placeholder="97110"
                        />
                      </div>

                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <label className="block text-xs text-gray-600 mb-2">
                            Frais ({formData.shop.currency})
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={city.cost}
                            onChange={(e) =>
                              updateCityShipping(
                                index,
                                "cost",
                                parseFloat(e.target.value)
                              )
                            }
                            className="w-full border border-gray-300 px-4 py-2 text-sm rounded"
                            placeholder="5.00"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeCityShipping(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded p-4">
              <div className="flex items-start gap-2">
                <AlertCircle size={16} className="text-yellow-600 mt-0.5" />
                <div className="text-xs text-yellow-800">
                  <p className="font-semibold mb-1">
                    Comment fonctionnent les frais spécifiques ?
                  </p>
                  <p>
                    Si une ville est configurée ici avec des frais spécifiques,
                    ces frais seront appliqués en priorité pour cette ville. Si
                    la ville n'est pas dans la liste, les frais standard seront
                    appliqués.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bouton de sauvegarde en bas */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-[#5d6e64] text-white px-8 py-3 text-sm uppercase tracking-wider hover:bg-[#4a5850] transition flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={16} />
              {isSaving ? "Sauvegarde..." : "Sauvegarder les Modifications"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
