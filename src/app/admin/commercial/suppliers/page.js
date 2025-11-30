/**
 * PAGE ADMIN : Fournisseurs
 * ===========================
 *
 * Gestion des fournisseurs.
 *
 * 🆕 NOUVEAU FICHIER CRÉÉ : src/app/admin/commercial/suppliers/page.js
 * DATE : 2025-11-30
 */

"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Truck, Plus, Edit2, Trash2, Mail, Phone, MapPin } from 'lucide-react';

export default function SuppliersPage() {
  const [showAddForm, setShowAddForm] = useState(false);

  // Fournisseurs mockés
  const mockSuppliers = [
    { id: 1, name: 'Textiles Eco', contact: 'Sophie Bernard', email: 'sophie@textiles-eco.fr', phone: '+33 6 11 22 33 44', address: 'Lyon', category: 'Textiles' },
    { id: 2, name: 'Bois Artisan', contact: 'Luc Petit', email: 'luc@bois-artisan.fr', phone: '+33 6 55 66 77 88', address: 'Toulouse', category: 'Bois' },
    { id: 3, name: 'Céramiques du Sud', contact: 'Anne Moreau', email: 'anne@ceramiques.fr', phone: '+33 6 99 88 77 66', address: 'Marseille', category: 'Céramique' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">

        {/* En-tête */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 hover:bg-gray-200 rounded-full transition">
              <ArrowLeft size={24} className="text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-serif text-gray-800 mb-2">Gestion des Fournisseurs</h1>
              <p className="text-sm text-gray-500">Gérez vos fournisseurs et approvisionnements</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-[#5d6e64] text-white px-6 py-3 text-sm uppercase tracking-wider hover:bg-[#4a5850] transition flex items-center gap-2"
          >
            <Plus size={16} />
            {showAddForm ? 'Annuler' : 'Nouveau Fournisseur'}
          </button>
        </div>

        {/* Formulaire d'ajout */}
        {showAddForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-serif text-gray-800 mb-4">Ajouter un fournisseur</h2>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Nom de l'entreprise" className="border border-gray-300 px-4 py-2 text-sm" />
              <input type="text" placeholder="Nom du contact" className="border border-gray-300 px-4 py-2 text-sm" />
              <input type="email" placeholder="Email" className="border border-gray-300 px-4 py-2 text-sm" />
              <input type="tel" placeholder="Téléphone" className="border border-gray-300 px-4 py-2 text-sm" />
              <input type="text" placeholder="Adresse" className="col-span-2 border border-gray-300 px-4 py-2 text-sm" />
              <select className="border border-gray-300 px-4 py-2 text-sm">
                <option>Catégorie de produits</option>
                <option>Textiles</option>
                <option>Bois</option>
                <option>Céramique</option>
                <option>Métal</option>
              </select>
            </div>
            <button className="mt-4 bg-[#5d6e64] text-white px-6 py-2 text-xs uppercase tracking-wider hover:bg-[#4a5850] transition">
              Enregistrer
            </button>
          </div>
        )}

        {/* Liste des fournisseurs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-600">Entreprise</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-600">Contact</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-600">Coordonnées</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-600">Catégorie</th>
                <th className="px-6 py-4 text-right text-xs uppercase tracking-wider text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {mockSuppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                        <Truck className="text-teal-600" size={20} />
                      </div>
                      <span className="font-serif text-gray-800">{supplier.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{supplier.contact}</td>
                  <td className="px-6 py-4">
                    <div className="space-y-1 text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <Mail size={12} />
                        <span>{supplier.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={12} />
                        <span>{supplier.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={12} />
                        <span>{supplier.address}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-teal-100 text-teal-800 px-2 py-1 rounded text-xs">
                      {supplier.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <button className="p-2 text-blue-600 hover:bg-blue-100 rounded">
                        <Edit2 size={18} />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-100 rounded">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Note */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-yellow-900 mb-2">ℹ️ Note</h3>
          <p className="text-xs text-yellow-800">
            Pour sauvegarder les fournisseurs, créez une collection Firestore "suppliers" et connectez-la avec un hook.
          </p>
        </div>

      </div>
    </div>
  );
}
