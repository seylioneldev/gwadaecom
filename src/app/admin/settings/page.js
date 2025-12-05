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

import { useState, useEffect } from "react";
import { useSettings } from "@/context/SettingsContext";
import {
  Save,
  RotateCcw,
  Globe,
  Store,
  Home,
  Share2,
  Palette,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function AdminSettingsPage() {
  // Récupération des paramètres actuels depuis le contexte (temps réel)
  const { settings, loading, error, updateSettings, resetSettings } =
    useSettings();

  // État local pour le formulaire
  const [formData, setFormData] = useState(null);

  // Messages de succès/erreur
  const [message, setMessage] = useState({ type: "", text: "" });

  // État de sauvegarde
  const [isSaving, setIsSaving] = useState(false);
  const [homepageLayoutDragIndex, setHomepageLayoutDragIndex] = useState(null);

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
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  /**
   * Gérer les changements dans les champs du formulaire
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const keys = name.split(".");

    if (keys.length === 1) {
      // Champ simple (ex: siteName)
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    } else if (keys.length === 2) {
      // Champ imbriqué (ex: social.facebook)
      setFormData((prev) => ({
        ...prev,
        [keys[0]]: {
          ...prev[keys[0]],
          [keys[1]]: type === "checkbox" ? checked : value,
        },
      }));
    } else if (keys.length === 3) {
      // Champ doublement imbriqué (ex: shop.currency)
      setFormData((prev) => ({
        ...prev,
        [keys[0]]: {
          ...prev[keys[0]],
          [keys[1]]: {
            ...prev[keys[0]]?.[keys[1]],
            [keys[2]]: type === "checkbox" ? checked : value,
          },
        },
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
      showMessage("success", "Paramètres sauvegardés avec succès");
    } catch (err) {
      showMessage("error", `Erreur : ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * RÉINITIALISER AUX VALEURS PAR DÉFAUT
   */
  const handleReset = async () => {
    const confirmed = window.confirm(
      "Voulez-vous vraiment réinitialiser tous les paramètres aux valeurs par défaut ? Cette action est irréversible."
    );

    if (!confirmed) return;

    try {
      setIsSaving(true);
      await resetSettings();
      showMessage("success", "Paramètres réinitialisés avec succès");

      // Recharger la page pour afficher les nouvelles valeurs
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      showMessage("error", `Erreur : ${err.message}`);
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

  const defaultHomepageLayout = [
    { id: "hero", type: "hero", enabled: true },
    { id: "infoStrip", type: "infoStrip", enabled: true },
    { id: "story", type: "story", enabled: true },
    { id: "newsletter", type: "newsletter", enabled: true },
    { id: "productGrid", type: "productGrid", enabled: true },
  ];

  const normalizeHomepageLayout = (savedLayout) => {
    if (!Array.isArray(savedLayout) || savedLayout.length === 0) {
      return defaultHomepageLayout;
    }

    const defaultByType = new Map(
      defaultHomepageLayout.map((block) => [block.type, block])
    );

    const seenTypes = new Set();
    const normalized = [];

    savedLayout.forEach((block) => {
      if (!block || !block.type) return;
      if (seenTypes.has(block.type)) return;

      const defaultBlock = defaultByType.get(block.type) || {
        id: block.id || block.type,
        type: block.type,
        enabled: true,
      };

      normalized.push({
        ...defaultBlock,
        ...block,
        id: block.id || defaultBlock.id || block.type,
        enabled: block.enabled === false ? false : true,
      });

      seenTypes.add(block.type);
    });

    defaultHomepageLayout.forEach((defaultBlock) => {
      if (!seenTypes.has(defaultBlock.type)) {
        normalized.push(defaultBlock);
      }
    });

    return normalized;
  };

  const homepageLayout = normalizeHomepageLayout(formData.homepage?.layout);

  const handleHomepageLayoutUpdate = (newLayout) => {
    setFormData((prev) => ({
      ...prev,
      homepage: {
        ...(prev.homepage || {}),
        layout: newLayout,
      },
    }));
  };

  const handleHomepageLayoutDragStart = (event, index) => {
    try {
      if (event?.dataTransfer) {
        event.dataTransfer.effectAllowed = "move";
        // Certaines implémentations exigent au moins un setData pour activer le drop
        event.dataTransfer.setData("text/plain", String(index));
      }
    } catch (e) {
      // Sécurité : ne pas casser le drag si dataTransfer n'est pas disponible
    }

    setHomepageLayoutDragIndex(index);
  };

  const handleHomepageLayoutDrop = (targetIndex) => {
    if (
      homepageLayoutDragIndex === null ||
      homepageLayoutDragIndex === targetIndex
    ) {
      setHomepageLayoutDragIndex(null);
      return;
    }

    const updated = [...homepageLayout];
    const [moved] = updated.splice(homepageLayoutDragIndex, 1);
    updated.splice(targetIndex, 0, moved);

    setHomepageLayoutDragIndex(null);
    handleHomepageLayoutUpdate(updated);
  };

  const toggleHomepageLayoutEnabled = (index) => {
    const updated = homepageLayout.map((block, i) =>
      i === index
        ? { ...block, enabled: block.enabled === false ? true : false }
        : block
    );

    handleHomepageLayoutUpdate(updated);
  };

  const moveHomepageLayout = (fromIndex, toIndex) => {
    if (
      fromIndex === toIndex ||
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= homepageLayout.length ||
      toIndex >= homepageLayout.length
    ) {
      return;
    }

    const updated = [...homepageLayout];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);

    handleHomepageLayoutUpdate(updated);
  };

  const moveHomepageLayoutUp = (index) => {
    moveHomepageLayout(index, index - 1);
  };

  const moveHomepageLayoutDown = (index) => {
    moveHomepageLayout(index, index + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="p-2 hover:bg-gray-200 rounded-full transition"
            >
              <ArrowLeft size={24} className="text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-serif text-gray-800 mb-2">
                Paramètres du Site
              </h1>
              <p className="text-sm text-gray-500">
                Personnalisez les informations générales de votre site
              </p>
            </div>
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
              {isSaving ? "Sauvegarde..." : "Sauvegarder"}
            </button>
          </div>
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
          {/* SECTION 1 : INFORMATIONS GÉNÉRALES */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b">
              <Globe className="text-[#5d6e64]" size={24} />
              <h2 className="text-xl font-serif text-gray-800">
                Informations Générales
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                  Nom du Site
                </label>
                <input
                  type="text"
                  name="siteName"
                  value={formData.siteName || ""}
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
                  value={formData.siteDescription || ""}
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
                  value={formData.email || ""}
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
                  value={formData.phone || ""}
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
                  value={formData.address || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 text-sm"
                  placeholder="123 Rue Exemple, 75001 Paris"
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              Blocs d'accueil
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                  Bannière Hero - fond
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    name="customStyles.homepageBlocks.heroBgColor"
                    value={
                      formData.customStyles?.homepageBlocks?.heroBgColor ||
                      "#e0e0e0"
                    }
                    onChange={handleChange}
                    className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={
                      formData.customStyles?.homepageBlocks?.heroBgColor ||
                      "#e0e0e0"
                    }
                    onChange={(e) =>
                      handleChange({
                        target: {
                          name: "customStyles.homepageBlocks.heroBgColor",
                          value: e.target.value,
                        },
                      })
                    }
                    className="flex-1 border border-gray-300 px-4 py-2 text-sm font-mono"
                    placeholder="#e0e0e0"
                  />
                </div>

                <div className="mt-3 space-y-2">
                  <label className="block text-xs uppercase tracking-wider text-gray-600">
                    Image de fond (URL)
                  </label>
                  <input
                    type="text"
                    name="customStyles.homepageBlocks.heroBgImageUrl"
                    value={
                      formData.customStyles?.homepageBlocks?.heroBgImageUrl ||
                      ""
                    }
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-2 text-sm font-mono"
                    placeholder="https://.../hero.webp"
                  />

                  <label className="block text-xs uppercase tracking-wider text-gray-600">
                    Flou du fond
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="24"
                    step="1"
                    name="customStyles.homepageBlocks.heroBgBlur"
                    value={
                      formData.customStyles?.homepageBlocks?.heroBgBlur ?? 0
                    }
                    onChange={handleChange}
                    className="w-full"
                  />
                  <div className="flex justify-between text-[11px] text-gray-500">
                    <span>0 px</span>
                    <span>
                      {(formData.customStyles?.homepageBlocks?.heroBgBlur ??
                        0) + " px"}
                    </span>
                    <span>24 px</span>
                  </div>

                  <label className="block text-xs uppercase tracking-wider text-gray-600">
                    Voile noir
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="80"
                    step="5"
                    name="customStyles.homepageBlocks.heroBgDarken"
                    value={
                      formData.customStyles?.homepageBlocks?.heroBgDarken ?? 0
                    }
                    onChange={handleChange}
                    className="w-full"
                  />
                  <div className="flex justify-between text-[11px] text-gray-500">
                    <span>0%</span>
                    <span>
                      {(formData.customStyles?.homepageBlocks?.heroBgDarken ??
                        0) + "%"}
                    </span>
                    <span>80%</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    Bloc texte Hero
                  </p>

                  <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">
                    Couleur de fond
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="color"
                      name="customStyles.homepageBlocks.heroContentBgColor"
                      value={
                        formData.customStyles?.homepageBlocks
                          ?.heroContentBgColor || "#ffffff"
                      }
                      onChange={handleChange}
                      className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={
                        formData.customStyles?.homepageBlocks
                          ?.heroContentBgColor || "#ffffff"
                      }
                      onChange={(e) =>
                        handleChange({
                          target: {
                            name: "customStyles.homepageBlocks.heroContentBgColor",
                            value: e.target.value,
                          },
                        })
                      }
                      className="flex-1 border border-gray-300 px-4 py-2 text-sm font-mono"
                      placeholder="#ffffff"
                    />
                  </div>

                  <label className="block text-xs uppercase tracking-wider text-gray-600">
                    Image de fond (URL)
                  </label>
                  <input
                    type="text"
                    name="customStyles.homepageBlocks.heroContentBgImageUrl"
                    value={
                      formData.customStyles?.homepageBlocks
                        ?.heroContentBgImageUrl || ""
                    }
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-2 text-sm font-mono"
                    placeholder="https://.../hero-content.webp"
                  />

                  <label className="block text-xs uppercase tracking-wider text-gray-600">
                    Flou du fond
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="24"
                    step="1"
                    name="customStyles.homepageBlocks.heroContentBgBlur"
                    value={
                      formData.customStyles?.homepageBlocks
                        ?.heroContentBgBlur ?? 0
                    }
                    onChange={handleChange}
                    className="w-full"
                  />
                  <div className="flex justify-between text-[11px] text-gray-500">
                    <span>0 px</span>
                    <span>
                      {(formData.customStyles?.homepageBlocks
                        ?.heroContentBgBlur ?? 0) + " px"}
                    </span>
                    <span>24 px</span>
                  </div>

                  <label className="block text-xs uppercase tracking-wider text-gray-600">
                    Voile noir
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="80"
                    step="5"
                    name="customStyles.homepageBlocks.heroContentBgDarken"
                    value={
                      formData.customStyles?.homepageBlocks
                        ?.heroContentBgDarken ?? 0
                    }
                    onChange={handleChange}
                    className="w-full"
                  />
                  <div className="flex justify-between text-[11px] text-gray-500">
                    <span>0%</span>
                    <span>
                      {(formData.customStyles?.homepageBlocks
                        ?.heroContentBgDarken ?? 0) + "%"}
                    </span>
                    <span>80%</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                  Section Nouveautés / Produits - fond
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    name="customStyles.homepageBlocks.productGridBgColor"
                    value={
                      formData.customStyles?.homepageBlocks
                        ?.productGridBgColor || "#ffffff"
                    }
                    onChange={handleChange}
                    className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={
                      formData.customStyles?.homepageBlocks
                        ?.productGridBgColor || "#ffffff"
                    }
                    onChange={(e) =>
                      handleChange({
                        target: {
                          name: "customStyles.homepageBlocks.productGridBgColor",
                          value: e.target.value,
                        },
                      })
                    }
                    className="flex-1 border border-gray-300 px-4 py-2 text-sm font-mono"
                    placeholder="#ffffff"
                  />
                </div>

                <div className="mt-3 space-y-2">
                  <label className="block text-xs uppercase tracking-wider text-gray-600">
                    Image de fond (URL)
                  </label>
                  <input
                    type="text"
                    name="customStyles.homepageBlocks.productGridBgImageUrl"
                    value={
                      formData.customStyles?.homepageBlocks
                        ?.productGridBgImageUrl || ""
                    }
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-2 text-sm font-mono"
                    placeholder="https://.../products-bg.webp"
                  />

                  <label className="block text-xs uppercase tracking-wider text-gray-600">
                    Flou du fond
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="24"
                    step="1"
                    name="customStyles.homepageBlocks.productGridBgBlur"
                    value={
                      formData.customStyles?.homepageBlocks
                        ?.productGridBgBlur ?? 0
                    }
                    onChange={handleChange}
                    className="w-full"
                  />
                  <div className="flex justify-between text-[11px] text-gray-500">
                    <span>0 px</span>
                    <span>
                      {(formData.customStyles?.homepageBlocks
                        ?.productGridBgBlur ?? 0) + " px"}
                    </span>
                    <span>24 px</span>
                  </div>

                  <label className="block text-xs uppercase tracking-wider text-gray-600">
                    Voile noir
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="80"
                    step="5"
                    name="customStyles.homepageBlocks.productGridBgDarken"
                    value={
                      formData.customStyles?.homepageBlocks
                        ?.productGridBgDarken ?? 0
                    }
                    onChange={handleChange}
                    className="w-full"
                  />
                  <div className="flex justify-between text-[11px] text-gray-500">
                    <span>0%</span>
                    <span>
                      {(formData.customStyles?.homepageBlocks
                        ?.productGridBgDarken ?? 0) + "%"}
                    </span>
                    <span>80%</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                  Bandeau d'informations - fond
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    name="customStyles.homepageBlocks.infoStripBgColor"
                    value={
                      formData.customStyles?.homepageBlocks?.infoStripBgColor ||
                      "#f5f5f5"
                    }
                    onChange={handleChange}
                    className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={
                      formData.customStyles?.homepageBlocks?.infoStripBgColor ||
                      "#f5f5f5"
                    }
                    onChange={(e) =>
                      handleChange({
                        target: {
                          name: "customStyles.homepageBlocks.infoStripBgColor",
                          value: e.target.value,
                        },
                      })
                    }
                    className="flex-1 border border-gray-300 px-4 py-2 text-sm font-mono"
                    placeholder="#f5f5f5"
                  />
                </div>
                <div className="mt-3 space-y-2">
                  <label className="block text-xs uppercase tracking-wider text-gray-600">
                    Image de fond (URL)
                  </label>
                  <input
                    type="text"
                    name="customStyles.homepageBlocks.infoStripBgImageUrl"
                    value={
                      formData.customStyles?.homepageBlocks
                        ?.infoStripBgImageUrl || ""
                    }
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-2 text-sm font-mono"
                    placeholder="https://.../info-strip.webp"
                  />

                  <label className="block text-xs uppercase tracking-wider text-gray-600">
                    Flou du fond
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="24"
                    step="1"
                    name="customStyles.homepageBlocks.infoStripBgBlur"
                    value={
                      formData.customStyles?.homepageBlocks?.infoStripBgBlur ??
                      0
                    }
                    onChange={handleChange}
                    className="w-full"
                  />
                  <div className="flex justify-between text-[11px] text-gray-500">
                    <span>0 px</span>
                    <span>
                      {(formData.customStyles?.homepageBlocks
                        ?.infoStripBgBlur ?? 0) + " px"}
                    </span>
                    <span>24 px</span>
                  </div>

                  <label className="block text-xs uppercase tracking-wider text-gray-600">
                    Voile noir
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="80"
                    step="5"
                    name="customStyles.homepageBlocks.infoStripBgDarken"
                    value={
                      formData.customStyles?.homepageBlocks
                        ?.infoStripBgDarken ?? 0
                    }
                    onChange={handleChange}
                    className="w-full"
                  />
                  <div className="flex justify-between text-[11px] text-gray-500">
                    <span>0%</span>
                    <span>
                      {(formData.customStyles?.homepageBlocks
                        ?.infoStripBgDarken ?? 0) + "%"}
                    </span>
                    <span>80%</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                  Bloc histoire - fond
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    name="customStyles.homepageBlocks.storyBgColor"
                    value={
                      formData.customStyles?.homepageBlocks?.storyBgColor ||
                      "#ffffff"
                    }
                    onChange={handleChange}
                    className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={
                      formData.customStyles?.homepageBlocks?.storyBgColor ||
                      "#ffffff"
                    }
                    onChange={(e) =>
                      handleChange({
                        target: {
                          name: "customStyles.homepageBlocks.storyBgColor",
                          value: e.target.value,
                        },
                      })
                    }
                    className="flex-1 border border-gray-300 px-4 py-2 text-sm font-mono"
                    placeholder="#ffffff"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                  Bloc newsletter - fond
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    name="customStyles.homepageBlocks.newsletterBgColor"
                    value={
                      formData.customStyles?.homepageBlocks
                        ?.newsletterBgColor || "#f7f3ec"
                    }
                    onChange={handleChange}
                    className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={
                      formData.customStyles?.homepageBlocks
                        ?.newsletterBgColor || "#f7f3ec"
                    }
                    onChange={(e) =>
                      handleChange({
                        target: {
                          name: "customStyles.homepageBlocks.newsletterBgColor",
                          value: e.target.value,
                        },
                      })
                    }
                    className="flex-1 border border-gray-300 px-4 py-2 text-sm font-mono"
                    placeholder="#f7f3ec"
                  />
                </div>
                <div className="mt-3 space-y-2">
                  <label className="block text-xs uppercase tracking-wider text-gray-600">
                    Image de fond (URL)
                  </label>
                  <input
                    type="text"
                    name="customStyles.homepageBlocks.newsletterBgImageUrl"
                    value={
                      formData.customStyles?.homepageBlocks
                        ?.newsletterBgImageUrl || ""
                    }
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-2 text-sm font-mono"
                    placeholder="https://.../newsletter.webp"
                  />

                  <label className="block text-xs uppercase tracking-wider text-gray-600">
                    Flou du fond
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="24"
                    step="1"
                    name="customStyles.homepageBlocks.newsletterBgBlur"
                    value={
                      formData.customStyles?.homepageBlocks?.newsletterBgBlur ??
                      0
                    }
                    onChange={handleChange}
                    className="w-full"
                  />
                  <div className="flex justify-between text-[11px] text-gray-500">
                    <span>0 px</span>
                    <span>
                      {(formData.customStyles?.homepageBlocks
                        ?.newsletterBgBlur ?? 0) + " px"}
                    </span>
                    <span>24 px</span>
                  </div>

                  <label className="block text-xs uppercase tracking-wider text-gray-600">
                    Voile noir
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="80"
                    step="5"
                    name="customStyles.homepageBlocks.newsletterBgDarken"
                    value={
                      formData.customStyles?.homepageBlocks
                        ?.newsletterBgDarken ?? 0
                    }
                    onChange={handleChange}
                    className="w-full"
                  />
                  <div className="flex justify-between text-[11px] text-gray-500">
                    <span>0%</span>
                    <span>
                      {(formData.customStyles?.homepageBlocks
                        ?.newsletterBgDarken ?? 0) + "%"}
                    </span>
                    <span>80%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2 : RÉSEAUX SOCIAUX */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b">
              <Share2 className="text-[#5d6e64]" size={24} />
              <h2 className="text-xl font-serif text-gray-800">
                Réseaux Sociaux
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                  Facebook
                </label>
                <input
                  type="url"
                  name="social.facebook"
                  value={formData.social?.facebook || ""}
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
                  value={formData.social?.instagram || ""}
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
                  value={formData.social?.twitter || ""}
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
              <h2 className="text-xl font-serif text-gray-800">
                Paramètres Boutique
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
                  value={formData.shop?.currency || ""}
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
              <h2 className="text-xl font-serif text-gray-800">
                Page d'Accueil
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                  Titre Hero
                </label>
                <input
                  type="text"
                  name="homepage.heroTitle"
                  value={formData.homepage?.heroTitle || ""}
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
                  value={formData.homepage?.heroSubtitle || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 text-sm"
                  placeholder="Découvrez notre collection d'artisanat"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                  Texte du bouton Hero
                </label>
                <input
                  type="text"
                  name="homepage.heroCtaLabel"
                  value={formData.homepage?.heroCtaLabel || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 text-sm"
                  placeholder="Discover Now"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                  Lien du bouton Hero
                </label>
                <input
                  type="text"
                  name="homepage.heroCtaLink"
                  value={formData.homepage?.heroCtaLink || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-2 text-sm"
                  placeholder="/category/shop-brand"
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

            <div className="mt-8">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Mise en page de la page d'accueil
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Faites glisser les blocs pour changer leur ordre d'affichage.
              </p>
              <div className="space-y-3">
                {homepageLayout.map((block, index) => (
                  <div
                    key={block.id || block.type}
                    draggable
                    onDragStart={(e) => handleHomepageLayoutDragStart(e, index)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleHomepageLayoutDrop(index);
                    }}
                    className="flex items-center justify-between bg-gray-50 border border-dashed border-gray-300 rounded px-4 py-3 cursor-move"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400">
                        #{index + 1}
                      </span>
                      <span className="text-sm text-gray-700">
                        {block.type === "hero"
                          ? "Bannière Hero"
                          : block.type === "productGrid"
                          ? "Section Nouveautés / Produits"
                          : block.type === "infoStrip"
                          ? "Bandeau d'informations"
                          : block.type === "story"
                          ? "Bloc histoire"
                          : block.type === "newsletter"
                          ? "Bloc newsletter"
                          : block.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col gap-1">
                        <button
                          type="button"
                          onClick={() => moveHomepageLayoutUp(index)}
                          disabled={index === 0}
                          className="text-xs text-gray-400 hover:text-gray-700 disabled:opacity-30"
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={() => moveHomepageLayoutDown(index)}
                          disabled={index === homepageLayout.length - 1}
                          className="text-xs text-gray-400 hover:text-gray-700 disabled:opacity-30"
                        >
                          ↓
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={block.enabled !== false}
                          onChange={() => toggleHomepageLayoutEnabled(index)}
                          className="w-4 h-4"
                        />
                        <span className="text-xs text-gray-500">
                          {block.enabled === false ? "Masqué" : "Visible"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION : TEXTES DU SITE */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b">
              <Home className="text-[#5d6e64]" size={24} />
              <h2 className="text-xl font-serif text-gray-800">
                Textes du Site
              </h2>
            </div>

            <div className="space-y-8">
              {/* Header - Bandeau promo */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">
                  Header - Bandeau promo
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                      Label (gauche)
                    </label>
                    <input
                      type="text"
                      name="headerContent.promoBarLabel"
                      value={formData.headerContent?.promoBarLabel || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-4 py-2 text-sm"
                      placeholder="carte cadeau"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                      Texte principal
                    </label>
                    <input
                      type="text"
                      name="headerContent.promoBarText"
                      value={formData.headerContent?.promoBarText || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-4 py-2 text-sm"
                      placeholder="Looking for the perfect gift? A gift card is the perfect solution."
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                      Texte du bouton
                    </label>
                    <input
                      type="text"
                      name="headerContent.promoBarButtonLabel"
                      value={formData.headerContent?.promoBarButtonLabel || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-4 py-2 text-sm"
                      placeholder="Shop Gift Cards"
                    />
                  </div>
                </div>
              </div>

              {/* Accueil - Section Nouveautés */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">
                  Accueil - Section "Nouveautés"
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                      Titre section
                    </label>
                    <input
                      type="text"
                      name="homepage.newArrivalsTitle"
                      value={formData.homepage?.newArrivalsTitle || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-4 py-2 text-sm"
                      placeholder="NEW ARRIVALS"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                      Sous-titre section
                    </label>
                    <input
                      type="text"
                      name="homepage.newArrivalsSubtitle"
                      value={formData.homepage?.newArrivalsSubtitle || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-4 py-2 text-sm"
                      placeholder="Texte sous le titre (optionnel)"
                    />
                  </div>
                </div>
              </div>

              {/* Page Panier */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">
                  Page Panier
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                      Titre de la page
                    </label>
                    <input
                      type="text"
                      name="cartPage.title"
                      value={formData.cartPage?.title || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-4 py-2 text-sm"
                      placeholder="Mon Panier"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                      Lien "Continuer mes achats"
                    </label>
                    <input
                      type="text"
                      name="cartPage.continueShoppingLinkLabel"
                      value={formData.cartPage?.continueShoppingLinkLabel || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-4 py-2 text-sm"
                      placeholder="Continuer mes achats"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                      Titre panier vide
                    </label>
                    <input
                      type="text"
                      name="cartPage.emptyTitle"
                      value={formData.cartPage?.emptyTitle || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-4 py-2 text-sm"
                      placeholder="Votre panier est vide"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                      Sous-titre panier vide
                    </label>
                    <input
                      type="text"
                      name="cartPage.emptySubtitle"
                      value={formData.cartPage?.emptySubtitle || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-4 py-2 text-sm"
                      placeholder="Découvrez nos produits et ajoutez-les à votre panier"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                      Bouton panier vide
                    </label>
                    <input
                      type="text"
                      name="cartPage.emptyCtaLabel"
                      value={formData.cartPage?.emptyCtaLabel || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-4 py-2 text-sm"
                      placeholder="Retour à l'accueil"
                    />
                  </div>
                </div>
              </div>

              {/* Page Checkout */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-4">
                  Page Checkout
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                      Titre de la page
                    </label>
                    <input
                      type="text"
                      name="checkoutPage.title"
                      value={formData.checkoutPage?.title || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-4 py-2 text-sm"
                      placeholder="Finaliser ma commande"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                      Titre bloc de choix du mode
                    </label>
                    <input
                      type="text"
                      name="checkoutPage.choiceTitle"
                      value={formData.checkoutPage?.choiceTitle || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-4 py-2 text-sm"
                      placeholder="Comment souhaitez-vous commander ?"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                      Titre option invité
                    </label>
                    <input
                      type="text"
                      name="checkoutPage.guestTitle"
                      value={formData.checkoutPage?.guestTitle || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-4 py-2 text-sm"
                      placeholder="Continuer en tant qu'invité"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                      Sous-titre option invité
                    </label>
                    <input
                      type="text"
                      name="checkoutPage.guestSubtitle"
                      value={formData.checkoutPage?.guestSubtitle || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-4 py-2 text-sm"
                      placeholder="Commandez rapidement sans créer de compte"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 5 : PERSONNALISATION CSS */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b">
              <Palette className="text-[#5d6e64]" size={24} />
              <h2 className="text-xl font-serif text-gray-800">
                Personnalisation CSS
              </h2>
            </div>

            {/* Header */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                Header
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                    Couleur de fond
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      name="customStyles.header.backgroundColor"
                      value={
                        formData.customStyles?.header?.backgroundColor ||
                        "#6B7A6E"
                      }
                      onChange={handleChange}
                      className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={
                        formData.customStyles?.header?.backgroundColor ||
                        "#6B7A6E"
                      }
                      onChange={(e) =>
                        handleChange({
                          target: {
                            name: "customStyles.header.backgroundColor",
                            value: e.target.value,
                          },
                        })
                      }
                      className="flex-1 border border-gray-300 px-4 py-2 text-sm font-mono"
                      placeholder="#6B7A6E"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                    Couleur du texte
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      name="customStyles.header.textColor"
                      value={
                        formData.customStyles?.header?.textColor || "#FFFFFF"
                      }
                      onChange={handleChange}
                      className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={
                        formData.customStyles?.header?.textColor || "#FFFFFF"
                      }
                      onChange={(e) =>
                        handleChange({
                          target: {
                            name: "customStyles.header.textColor",
                            value: e.target.value,
                          },
                        })
                      }
                      className="flex-1 border border-gray-300 px-4 py-2 text-sm font-mono"
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                    Recherche - texte du dropdown
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      name="customStyles.header.searchDropdownTextColor"
                      value={
                        formData.customStyles?.header
                          ?.searchDropdownTextColor || "#1F2933"
                      }
                      onChange={handleChange}
                      className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={
                        formData.customStyles?.header
                          ?.searchDropdownTextColor || "#1F2933"
                      }
                      onChange={(e) =>
                        handleChange({
                          target: {
                            name: "customStyles.header.searchDropdownTextColor",
                            value: e.target.value,
                          },
                        })
                      }
                      className="flex-1 border border-gray-300 px-4 py-2 text-sm font-mono"
                      placeholder="#1F2933"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                    Bandeau promo - fond
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      name="customStyles.header.promoBarBgColor"
                      value={
                        formData.customStyles?.header?.promoBarBgColor ||
                        "#5d6e64"
                      }
                      onChange={handleChange}
                      className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={
                        formData.customStyles?.header?.promoBarBgColor ||
                        "#5d6e64"
                      }
                      onChange={(e) =>
                        handleChange({
                          target: {
                            name: "customStyles.header.promoBarBgColor",
                            value: e.target.value,
                          },
                        })
                      }
                      className="flex-1 border border-gray-300 px-4 py-2 text-sm font-mono"
                      placeholder="#5d6e64"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                    Bandeau promo - texte
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      name="customStyles.header.promoBarTextColor"
                      value={
                        formData.customStyles?.header?.promoBarTextColor ||
                        "#FFFFFF"
                      }
                      onChange={handleChange}
                      className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={
                        formData.customStyles?.header?.promoBarTextColor ||
                        "#FFFFFF"
                      }
                      onChange={(e) =>
                        handleChange({
                          target: {
                            name: "customStyles.header.promoBarTextColor",
                            value: e.target.value,
                          },
                        })
                      }
                      className="flex-1 border border-gray-300 px-4 py-2 text-sm font-mono"
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                    Menu utilisateur - fond
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      name="customStyles.header.userMenuBgColor"
                      value={
                        formData.customStyles?.header?.userMenuBgColor ||
                        "#FFFFFF"
                      }
                      onChange={handleChange}
                      className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={
                        formData.customStyles?.header?.userMenuBgColor ||
                        "#FFFFFF"
                      }
                      onChange={(e) =>
                        handleChange({
                          target: {
                            name: "customStyles.header.userMenuBgColor",
                            value: e.target.value,
                          },
                        })
                      }
                      className="flex-1 border border-gray-300 px-4 py-2 text-sm font-mono"
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                    Menu utilisateur - texte
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      name="customStyles.header.userMenuTextColor"
                      value={
                        formData.customStyles?.header?.userMenuTextColor ||
                        "#1F2933"
                      }
                      onChange={handleChange}
                      className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={
                        formData.customStyles?.header?.userMenuTextColor ||
                        "#1F2933"
                      }
                      onChange={(e) =>
                        handleChange({
                          target: {
                            name: "customStyles.header.userMenuTextColor",
                            value: e.target.value,
                          },
                        })
                      }
                      className="flex-1 border border-gray-300 px-4 py-2 text-sm font-mono"
                      placeholder="#1F2933"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                    Recherche - fond du dropdown
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      name="customStyles.header.searchDropdownBgColor"
                      value={
                        formData.customStyles?.header?.searchDropdownBgColor ||
                        "#FFFFFF"
                      }
                      onChange={handleChange}
                      className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={
                        formData.customStyles?.header?.searchDropdownBgColor ||
                        "#FFFFFF"
                      }
                      onChange={(e) =>
                        handleChange({
                          target: {
                            name: "customStyles.header.searchDropdownBgColor",
                            value: e.target.value,
                          },
                        })
                      }
                      className="flex-1 border border-gray-300 px-4 py-2 text-sm font-mono"
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                Footer
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                    Couleur de fond
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      name="customStyles.footer.backgroundColor"
                      value={
                        formData.customStyles?.footer?.backgroundColor ||
                        "#2D3748"
                      }
                      onChange={handleChange}
                      className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={
                        formData.customStyles?.footer?.backgroundColor ||
                        "#2D3748"
                      }
                      onChange={(e) =>
                        handleChange({
                          target: {
                            name: "customStyles.footer.backgroundColor",
                            value: e.target.value,
                          },
                        })
                      }
                      className="flex-1 border border-gray-300 px-4 py-2 text-sm font-mono"
                      placeholder="#2D3748"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                    Couleur du texte
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      name="customStyles.footer.textColor"
                      value={
                        formData.customStyles?.footer?.textColor || "#E2E8F0"
                      }
                      onChange={handleChange}
                      className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={
                        formData.customStyles?.footer?.textColor || "#E2E8F0"
                      }
                      onChange={(e) =>
                        handleChange({
                          target: {
                            name: "customStyles.footer.textColor",
                            value: e.target.value,
                          },
                        })
                      }
                      className="flex-1 border border-gray-300 px-4 py-2 text-sm font-mono"
                      placeholder="#E2E8F0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Page */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Page</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                    Couleur de fond
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      name="customStyles.page.backgroundColor"
                      value={
                        formData.customStyles?.page?.backgroundColor ||
                        "#FFFFFF"
                      }
                      onChange={handleChange}
                      className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={
                        formData.customStyles?.page?.backgroundColor ||
                        "#FFFFFF"
                      }
                      onChange={(e) =>
                        handleChange({
                          target: {
                            name: "customStyles.page.backgroundColor",
                            value: e.target.value,
                          },
                        })
                      }
                      className="flex-1 border border-gray-300 px-4 py-2 text-sm font-mono"
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                    Couleur primaire
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      name="customStyles.page.primaryColor"
                      value={
                        formData.customStyles?.page?.primaryColor || "#5d6e64"
                      }
                      onChange={handleChange}
                      className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={
                        formData.customStyles?.page?.primaryColor || "#5d6e64"
                      }
                      onChange={(e) =>
                        handleChange({
                          target: {
                            name: "customStyles.page.primaryColor",
                            value: e.target.value,
                          },
                        })
                      }
                      className="flex-1 border border-gray-300 px-4 py-2 text-sm font-mono"
                      placeholder="#5d6e64"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Polices */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                Polices
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                    Police des titres
                  </label>
                  <select
                    name="customStyles.fonts.headingFont"
                    value={formData.customStyles?.fonts?.headingFont || "serif"}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-2 text-sm"
                  >
                    <option value="serif">Serif (Georgia, Times)</option>
                    <option value="sans-serif">
                      Sans-Serif (Arial, Helvetica)
                    </option>
                    <option value="monospace">Monospace (Courier)</option>
                    <option value="cursive">Cursive (Comic Sans)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                    Police du texte
                  </label>
                  <select
                    name="customStyles.fonts.bodyFont"
                    value={
                      formData.customStyles?.fonts?.bodyFont || "sans-serif"
                    }
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-2 text-sm"
                  >
                    <option value="serif">Serif (Georgia, Times)</option>
                    <option value="sans-serif">
                      Sans-Serif (Arial, Helvetica)
                    </option>
                    <option value="monospace">Monospace (Courier)</option>
                    <option value="cursive">Cursive (Comic Sans)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Boutons */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-4">
                Boutons
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                    Couleur de fond
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      name="customStyles.buttons.primaryBgColor"
                      value={
                        formData.customStyles?.buttons?.primaryBgColor ||
                        "#5d6e64"
                      }
                      onChange={handleChange}
                      className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={
                        formData.customStyles?.buttons?.primaryBgColor ||
                        "#5d6e64"
                      }
                      onChange={(e) =>
                        handleChange({
                          target: {
                            name: "customStyles.buttons.primaryBgColor",
                            value: e.target.value,
                          },
                        })
                      }
                      className="flex-1 border border-gray-300 px-4 py-2 text-sm font-mono"
                      placeholder="#5d6e64"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                    Couleur du texte
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      name="customStyles.buttons.primaryTextColor"
                      value={
                        formData.customStyles?.buttons?.primaryTextColor ||
                        "#FFFFFF"
                      }
                      onChange={handleChange}
                      className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={
                        formData.customStyles?.buttons?.primaryTextColor ||
                        "#FFFFFF"
                      }
                      onChange={(e) =>
                        handleChange({
                          target: {
                            name: "customStyles.buttons.primaryTextColor",
                            value: e.target.value,
                          },
                        })
                      }
                      className="flex-1 border border-gray-300 px-4 py-2 text-sm font-mono"
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                    Couleur au survol
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      name="customStyles.buttons.primaryHoverBgColor"
                      value={
                        formData.customStyles?.buttons?.primaryHoverBgColor ||
                        "#4a5850"
                      }
                      onChange={handleChange}
                      className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={
                        formData.customStyles?.buttons?.primaryHoverBgColor ||
                        "#4a5850"
                      }
                      onChange={(e) =>
                        handleChange({
                          target: {
                            name: "customStyles.buttons.primaryHoverBgColor",
                            value: e.target.value,
                          },
                        })
                      }
                      className="flex-1 border border-gray-300 px-4 py-2 text-sm font-mono"
                      placeholder="#4a5850"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Aide */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 Aide</h3>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>
              • <strong>Sauvegarde :</strong> Les modifications sont appliquées
              immédiatement sur tout le site.
            </li>
            <li>
              • <strong>Réseaux sociaux :</strong> Laissez vide si vous ne
              souhaitez pas afficher le réseau.
            </li>
            <li>
              • <strong>Réinitialisation :</strong> Restaure les valeurs
              définies dans cms.config.js.
            </li>
            <li>
              • <strong>Devise :</strong> Utilisée pour l'affichage des prix sur
              tout le site.
            </li>
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
