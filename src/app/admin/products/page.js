/**
 * PAGE ADMIN : Gestion des Produits
 * ===================================
 *
 * Interface admin pour gérer tous les produits de la boutique.
 * Permet de lister, modifier et supprimer les produits existants.
 *
 * 🆕 NOUVEAU FICHIER CRÉÉ : src/app/admin/products/page.js
 * DATE : 2025-11-30
 *
 * FONCTIONNALITÉS :
 * - Afficher tous les produits avec miniatures
 * - Modifier un produit (édition inline)
 * - Supprimer un produit avec confirmation
 * - Filtrer par catégorie
 * - Rechercher un produit
 * - Affichage en grille ou tableau
 */

"use client";

import { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { db } from '@/lib/firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import cmsConfig from '../../../../cms.config';
import { Edit2, Trash2, Save, X, Search, Grid, List } from 'lucide-react';
import Link from 'next/link';

export default function AdminProductsPage() {
  // Récupération des produits et catégories
  const { products, loading, error } = useProducts();
  const { categories } = useCategories();

  // États
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' ou 'table'
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });

  /**
   * Afficher un message temporaire
   */
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  /**
   * FILTRER LES PRODUITS
   */
  const filteredProducts = products.filter(product => {
    // Filtre par recherche
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description?.toLowerCase().includes(searchTerm.toLowerCase());

    // Filtre par catégorie
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  /**
   * DÉMARRER L'ÉDITION
   */
  const startEditing = (product) => {
    setEditingId(product.id);
    setEditData({ ...product });
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
  const handleSaveEdit = async (productId) => {
    try {
      // Validation du prix
      if (editData.price && isNaN(parseFloat(editData.price))) {
        showMessage('error', 'Le prix doit être un nombre valide');
        return;
      }

      const productRef = doc(db, cmsConfig.collections.products, productId);

      // Ne garder que les champs modifiables
      const { id, createdAt, ...updates } = editData;

      await updateDoc(productRef, {
        ...updates,
        price: parseFloat(updates.price),
        updatedAt: new Date()
      });

      showMessage('success', 'Produit mis à jour avec succès');
      setEditingId(null);

      // Recharger pour voir les changements
      window.location.reload();
    } catch (err) {
      showMessage('error', `Erreur : ${err.message}`);
    }
  };

  /**
   * SUPPRIMER UN PRODUIT
   */
  const handleDelete = async (productId, productName) => {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer le produit "${productName}" ? Cette action est irréversible.`
    );

    if (!confirmed) return;

    try {
      const productRef = doc(db, cmsConfig.collections.products, productId);
      await deleteDoc(productRef);

      showMessage('success', `Produit "${productName}" supprimé`);

      // Recharger la page
      window.location.reload();
    } catch (err) {
      showMessage('error', `Erreur : ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">

        {/* En-tête */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif text-gray-800 mb-2">Gestion des Produits</h1>
            <p className="text-sm text-gray-500">
              {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
            </p>
          </div>

          <Link
            href="/admin"
            className="bg-[#5d6e64] text-white px-6 py-3 text-sm uppercase tracking-wider hover:bg-[#4a5850] transition"
          >
            Ajouter un Produit
          </Link>
        </div>

        {/* Message de succès/erreur */}
        {message.text && (
          <div className={`mb-6 p-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </div>
        )}

        {/* Barre de Filtres */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">

            {/* Recherche */}
            <div className="md:col-span-1">
              <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                Rechercher
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 pl-10 pr-4 py-2 text-sm"
                  placeholder="Nom ou description..."
                />
              </div>
            </div>

            {/* Filtre Catégorie */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-gray-600 mb-2">
                Catégorie
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 text-sm"
              >
                <option value="all">Toutes les catégories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Mode d'affichage */}
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 border rounded ${viewMode === 'grid' ? 'bg-[#5d6e64] text-white' : 'bg-white text-gray-600'}`}
                title="Grille"
              >
                <Grid size={20} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 border rounded ${viewMode === 'table' ? 'bg-[#5d6e64] text-white' : 'bg-white text-gray-600'}`}
                title="Tableau"
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Affichage des produits */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">
            Chargement des produits...
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">
            Erreur : {error}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            Aucun produit trouvé
          </div>
        ) : viewMode === 'grid' ? (
          /* MODE GRILLE */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">

                {/* Image */}
                <div className="aspect-[4/5] w-full relative overflow-hidden">
                  {(product.imageUrl?.startsWith('http') || product.image?.startsWith('http')) ? (
                    <img
                      src={product.imageUrl || product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className={`w-full h-full ${product.imageUrl || product.image || 'bg-gray-100'} flex items-center justify-center text-gray-400`}>
                      <span className="text-xs uppercase tracking-widest">No Image</span>
                    </div>
                  )}
                  {product.label && (
                    <span className="absolute top-2 right-2 bg-white/90 text-[10px] px-2 py-1 uppercase tracking-widest font-semibold">
                      {product.label}
                    </span>
                  )}
                </div>

                {/* Contenu */}
                <div className="p-4">
                  <h3 className="font-serif text-lg text-gray-800 mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                  <p className="text-lg font-semibold text-[#5d6e64] mb-3">${product.price}</p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditing(product)}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 text-xs uppercase tracking-wider hover:bg-blue-700 transition flex items-center justify-center gap-1"
                    >
                      <Edit2 size={14} /> Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      className="bg-red-600 text-white px-3 py-2 text-xs uppercase tracking-wider hover:bg-red-700 transition flex items-center justify-center gap-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* MODE TABLEAU */
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-600">Image</th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-600">Nom</th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-600">Catégorie</th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-600">Prix</th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-600">Label</th>
                  <th className="px-6 py-4 text-right text-xs uppercase tracking-wider text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    {editingId === product.id ? (
                      /* MODE ÉDITION */
                      <>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={editData.imageUrl || editData.image || ''}
                            onChange={(e) => setEditData({ ...editData, imageUrl: e.target.value, image: e.target.value })}
                            className="border border-gray-300 px-2 py-1 text-xs w-full"
                            placeholder="URL image"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={editData.name || ''}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                            className="border border-gray-300 px-2 py-1 text-sm w-full"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={editData.category || ''}
                            onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                            className="border border-gray-300 px-2 py-1 text-sm w-full"
                          >
                            {categories.map(cat => (
                              <option key={cat.id} value={cat.slug}>{cat.name}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            step="0.01"
                            value={editData.price || ''}
                            onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                            className="border border-gray-300 px-2 py-1 text-sm w-20"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={editData.label || ''}
                            onChange={(e) => setEditData({ ...editData, label: e.target.value })}
                            className="border border-gray-300 px-2 py-1 text-xs w-full"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => handleSaveEdit(product.id)}
                              className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
                              title="Sauvegarder"
                            >
                              <Save size={16} />
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="bg-gray-400 text-white p-2 rounded hover:bg-gray-500"
                              title="Annuler"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      /* MODE AFFICHAGE */
                      <>
                        <td className="px-6 py-4">
                          <div className="w-12 h-16 overflow-hidden">
                            {(product.imageUrl?.startsWith('http') || product.image?.startsWith('http')) ? (
                              <img
                                src={product.imageUrl || product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className={`w-full h-full ${product.imageUrl || product.image || 'bg-gray-100'}`}></div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-serif text-gray-800">{product.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{product.category}</td>
                        <td className="px-6 py-4 font-semibold text-[#5d6e64]">${product.price}</td>
                        <td className="px-6 py-4 text-xs text-gray-500">{product.label || '-'}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => startEditing(product)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                              title="Modifier"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id, product.name)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded"
                              title="Supprimer"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Aide */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 Aide</h3>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• <strong>Recherche :</strong> Recherchez par nom ou description du produit.</li>
            <li>• <strong>Filtre :</strong> Filtrez par catégorie pour trouver rapidement vos produits.</li>
            <li>• <strong>Grille/Tableau :</strong> Basculez entre l'affichage en grille (visuel) ou tableau (détaillé).</li>
            <li>• <strong>Modification :</strong> Cliquez sur "Modifier" pour éditer directement dans la liste.</li>
            <li>• <strong>Suppression :</strong> La suppression est définitive et nécessite une confirmation.</li>
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
 * Cette page permet de gérer tous les produits :
 *
 * 1. AFFICHAGE :
 *    - Mode grille : Vue visuelle avec miniatures
 *    - Mode tableau : Vue détaillée en liste
 *
 * 2. RECHERCHE ET FILTRE :
 *    - Recherche par nom ou description
 *    - Filtre par catégorie
 *
 * 3. MODIFICATION :
 *    - Édition inline dans le tableau
 *    - Modification de tous les champs
 *
 * 4. SUPPRESSION :
 *    - Avec confirmation
 *    - Irréversible
 *
 * ACCÈS : /admin/products
 *
 * ============================================
 */
