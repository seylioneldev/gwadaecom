/**
 * PAGE ADMIN : Gestion des Catégories
 * =====================================
 *
 * Interface admin pour gérer les catégories du menu.
 * Permet d'ajouter, modifier, supprimer et réorganiser les catégories.
 *
 * 🆕 NOUVEAU FICHIER CRÉÉ : src/app/admin/categories/page.js
 * DATE : 2025-11-30
 *
 * FONCTIONNALITÉS :
 * - Afficher toutes les catégories (y compris masquées)
 * - Ajouter une nouvelle catégorie
 * - Modifier une catégorie existante (nom, slug, ordre, visibilité)
 * - Supprimer une catégorie
 * - Réorganiser l'ordre d'affichage
 *
 * UTILISE :
 * - useAllCategories() : Récupère toutes les catégories
 * - addCategory() : Ajouter une catégorie
 * - updateCategory() : Modifier une catégorie
 * - deleteCategory() : Supprimer une catégorie
 */

"use client";

import { useState } from 'react';
import { useAllCategories, addCategory, updateCategory, deleteCategory } from '@/hooks/useCategories';
import { Eye, EyeOff, Edit2, Trash2, Plus, Save, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminCategoriesPage() {
  // Récupération de toutes les catégories (y compris masquées)
  const { categories, loading, error } = useAllCategories();

  // États pour le formulaire d'ajout
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    slug: '',
    order: 999,
    visible: true,
    description: ''
  });

  // États pour l'édition
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  // Messages de succès/erreur
  const [message, setMessage] = useState({ type: '', text: '' });

  /**
   * Afficher un message temporaire (succès ou erreur)
   */
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  /**
   * AJOUTER UNE NOUVELLE CATÉGORIE
   */
  const handleAddCategory = async (e) => {
    e.preventDefault();

    // Validation
    if (!newCategory.name.trim()) {
      showMessage('error', 'Le nom de la catégorie est requis');
      return;
    }

    try {
      // Générer automatiquement le slug si vide
      const categoryData = {
        ...newCategory,
        slug: newCategory.slug || newCategory.name.toLowerCase().replace(/\s+/g, '-')
      };

      await addCategory(categoryData);

      showMessage('success', `Catégorie "${newCategory.name}" ajoutée avec succès`);

      // Réinitialiser le formulaire
      setNewCategory({
        name: '',
        slug: '',
        order: 999,
        visible: true,
        description: ''
      });
      setShowAddForm(false);

      // Recharger la page pour voir la nouvelle catégorie
      window.location.reload();
    } catch (err) {
      showMessage('error', `Erreur : ${err.message}`);
    }
  };

  /**
   * DÉMARRER L'ÉDITION D'UNE CATÉGORIE
   */
  const startEditing = (category) => {
    setEditingId(category.id);
    setEditData({ ...category });
  };

  /**
   * ANNULER L'ÉDITION
   */
  const cancelEditing = () => {
    setEditingId(null);
    setEditData({});
  };

  /**
   * SAUVEGARDER LES MODIFICATIONS
   */
  const handleSaveEdit = async (categoryId) => {
    try {
      // Ne garder que les champs modifiables
      const { id, createdAt, ...updates } = editData;

      await updateCategory(categoryId, updates);

      showMessage('success', 'Catégorie mise à jour avec succès');
      setEditingId(null);

      // Recharger pour voir les changements
      window.location.reload();
    } catch (err) {
      showMessage('error', `Erreur : ${err.message}`);
    }
  };

  /**
   * SUPPRIMER UNE CATÉGORIE
   */
  const handleDelete = async (categoryId, categoryName) => {
    const confirmed = window.confirm(`Voulez-vous vraiment supprimer la catégorie "${categoryName}" ?`);

    if (!confirmed) return;

    try {
      await deleteCategory(categoryId);
      showMessage('success', `Catégorie "${categoryName}" supprimée`);

      // Recharger la page
      window.location.reload();
    } catch (err) {
      showMessage('error', `Erreur : ${err.message}`);
    }
  };

  /**
   * BASCULER LA VISIBILITÉ
   */
  const toggleVisibility = async (category) => {
    try {
      await updateCategory(category.id, { visible: !category.visible });
      showMessage('success', `Catégorie ${category.visible ? 'masquée' : 'affichée'}`);
      window.location.reload();
    } catch (err) {
      showMessage('error', `Erreur : ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">

        {/* En-tête */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 hover:bg-gray-200 rounded-full transition">
              <ArrowLeft size={24} className="text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-serif text-gray-800 mb-2">Gestion des Catégories</h1>
              <p className="text-sm text-gray-500">Gérez les catégories affichées dans le menu de navigation</p>
            </div>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-[#5d6e64] text-white px-6 py-3 text-sm uppercase tracking-wider hover:bg-[#4a5850] transition flex items-center gap-2"
          >
            {showAddForm ? <X size={16} /> : <Plus size={16} />}
            {showAddForm ? 'Annuler' : 'Nouvelle Catégorie'}
          </button>
        </div>

        {/* Message de succès/erreur */}
        {message.text && (
          <div className={`mb-6 p-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </div>
        )}

        {/* Formulaire d'ajout */}
        {showAddForm && (
          <form onSubmit={handleAddCategory} className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-serif text-gray-800 mb-4">Ajouter une catégorie</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                  Nom de la catégorie *
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full border border-gray-300 px-4 py-2 text-sm"
                  placeholder="Ex: Kitchen"
                  required
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                  Slug (URL)
                </label>
                <input
                  type="text"
                  value={newCategory.slug}
                  onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                  className="w-full border border-gray-300 px-4 py-2 text-sm"
                  placeholder="Ex: kitchen (auto-généré si vide)"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                  Ordre d'affichage
                </label>
                <input
                  type="number"
                  value={newCategory.order}
                  onChange={(e) => setNewCategory({ ...newCategory, order: parseInt(e.target.value) })}
                  className="w-full border border-gray-300 px-4 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                  Visibilité
                </label>
                <select
                  value={newCategory.visible}
                  onChange={(e) => setNewCategory({ ...newCategory, visible: e.target.value === 'true' })}
                  className="w-full border border-gray-300 px-4 py-2 text-sm"
                >
                  <option value="true">Visible</option>
                  <option value="false">Masquée</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                  Description (optionnel)
                </label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  className="w-full border border-gray-300 px-4 py-2 text-sm"
                  rows="2"
                  placeholder="Description de la catégorie"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-4 bg-[#5d6e64] text-white px-6 py-3 text-xs uppercase tracking-wider hover:bg-[#4a5850] transition"
            >
              Ajouter la catégorie
            </button>
          </form>
        )}

        {/* Liste des catégories */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-100 px-6 py-4 border-b">
            <h2 className="text-lg font-serif text-gray-800">Catégories existantes ({categories.length})</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Chargement des catégories...
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">
              Erreur : {error}
            </div>
          ) : categories.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Aucune catégorie. Ajoutez-en une pour commencer.
            </div>
          ) : (
            <div className="divide-y">
              {categories.map((category) => (
                <div key={category.id} className="p-6 hover:bg-gray-50 transition">

                  {editingId === category.id ? (
                    /* MODE ÉDITION */
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={editData.name || ''}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="border border-gray-300 px-3 py-2 text-sm"
                        placeholder="Nom"
                      />
                      <input
                        type="text"
                        value={editData.slug || ''}
                        onChange={(e) => setEditData({ ...editData, slug: e.target.value })}
                        className="border border-gray-300 px-3 py-2 text-sm"
                        placeholder="Slug"
                      />
                      <input
                        type="number"
                        value={editData.order || 0}
                        onChange={(e) => setEditData({ ...editData, order: parseInt(e.target.value) })}
                        className="border border-gray-300 px-3 py-2 text-sm"
                        placeholder="Ordre"
                      />
                      <select
                        value={editData.visible}
                        onChange={(e) => setEditData({ ...editData, visible: e.target.value === 'true' })}
                        className="border border-gray-300 px-3 py-2 text-sm"
                      >
                        <option value="true">Visible</option>
                        <option value="false">Masquée</option>
                      </select>
                      <textarea
                        value={editData.description || ''}
                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                        className="col-span-2 border border-gray-300 px-3 py-2 text-sm"
                        placeholder="Description"
                        rows="2"
                      />
                      <div className="col-span-2 flex gap-2">
                        <button
                          onClick={() => handleSaveEdit(category.id)}
                          className="bg-green-600 text-white px-4 py-2 text-xs uppercase tracking-wider hover:bg-green-700 transition flex items-center gap-2"
                        >
                          <Save size={14} /> Enregistrer
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="bg-gray-400 text-white px-4 py-2 text-xs uppercase tracking-wider hover:bg-gray-500 transition flex items-center gap-2"
                        >
                          <X size={14} /> Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* MODE AFFICHAGE */
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-serif text-gray-800">{category.name}</h3>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            /{category.slug}
                          </span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            Ordre: {category.order}
                          </span>
                          {category.visible ? (
                            <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded flex items-center gap-1">
                              <Eye size={12} /> Visible
                            </span>
                          ) : (
                            <span className="text-xs text-red-700 bg-red-100 px-2 py-1 rounded flex items-center gap-1">
                              <EyeOff size={12} /> Masquée
                            </span>
                          )}
                        </div>
                        {category.description && (
                          <p className="text-sm text-gray-500">{category.description}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleVisibility(category)}
                          className="p-2 text-gray-600 hover:bg-gray-200 rounded transition"
                          title={category.visible ? 'Masquer' : 'Afficher'}
                        >
                          {category.visible ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        <button
                          onClick={() => startEditing(category)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded transition"
                          title="Modifier"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id, category.name)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded transition"
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Aide */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 Aide</h3>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• <strong>Ordre d'affichage :</strong> Les catégories sont triées par ordre croissant (1, 2, 3...)</li>
            <li>• <strong>Slug :</strong> Utilisé dans l'URL (ex: /category/kitchen). Auto-généré depuis le nom si vide.</li>
            <li>• <strong>Visibilité :</strong> Seules les catégories visibles apparaissent dans le menu.</li>
            <li>• <strong>Suppression :</strong> Supprime définitivement la catégorie (attention aux produits liés).</li>
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
 * Cette page admin permet de gérer complètement les catégories :
 *
 * 1. AJOUTER UNE CATÉGORIE :
 *    - Cliquer sur "Nouvelle Catégorie"
 *    - Remplir le formulaire
 *    - Le slug est auto-généré si laissé vide
 *    - Définir l'ordre et la visibilité
 *
 * 2. MODIFIER UNE CATÉGORIE :
 *    - Cliquer sur l'icône "crayon"
 *    - Modifier les champs souhaités
 *    - Cliquer sur "Enregistrer"
 *
 * 3. MASQUER/AFFICHER :
 *    - Cliquer sur l'icône "œil"
 *    - Bascule entre visible/masqué
 *
 * 4. SUPPRIMER :
 *    - Cliquer sur l'icône "poubelle"
 *    - Confirmer la suppression
 *
 * ACCÈS : /admin/categories
 *
 * ============================================
 */
