/**
 * PAGE ADMIN : Partenaires
 * ==========================
 *
 * Gestion des partenaires commerciaux.
 *
 * 🆕 NOUVEAU FICHIER CRÉÉ : src/app/admin/commercial/partners/page.js
 * DATE : 2025-11-30
 */

"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, Plus, Edit2, Trash2, Mail, Phone } from 'lucide-react';

export default function PartnersPage() {
  const [showAddForm, setShowAddForm] = useState(false);

  // Partenaires mockés
  const mockPartners = [
    { id: 1, name: 'Artisan Local 1', contact: 'Jean Martin', email: 'jean@artisan1.fr', phone: '+33 6 12 34 56 78', type: 'Fournisseur' },
    { id: 2, name: 'Boutique Partenaire', contact: 'Marie Dupont', email: 'marie@boutique.fr', phone: '+33 6 98 76 54 32', type: 'Revendeur' },
    { id: 3, name: 'Galerie d\'Art', contact: 'Pierre Durand', email: 'pierre@galerie.fr', phone: '+33 6 11 22 33 44', type: 'Collaborateur' },
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
              <h1 className="text-3xl font-serif text-gray-800 mb-2">Gestion des Partenaires</h1>
              <p className="text-sm text-gray-500">Gérez vos partenaires commerciaux et collaborations</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-[#5d6e64] text-white px-6 py-3 text-sm uppercase tracking-wider hover:bg-[#4a5850] transition flex items-center gap-2"
          >
            <Plus size={16} />
            {showAddForm ? 'Annuler' : 'Nouveau Partenaire'}
          </button>
        </div>

        {/* Formulaire d'ajout */}
        {showAddForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-serif text-gray-800 mb-4">Ajouter un partenaire</h2>
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Nom de l'entreprise" className="border border-gray-300 px-4 py-2 text-sm" />
              <input type="text" placeholder="Nom du contact" className="border border-gray-300 px-4 py-2 text-sm" />
              <input type="email" placeholder="Email" className="border border-gray-300 px-4 py-2 text-sm" />
              <input type="tel" placeholder="Téléphone" className="border border-gray-300 px-4 py-2 text-sm" />
              <select className="border border-gray-300 px-4 py-2 text-sm">
                <option>Type de partenaire</option>
                <option>Fournisseur</option>
                <option>Revendeur</option>
                <option>Collaborateur</option>
              </select>
            </div>
            <button className="mt-4 bg-[#5d6e64] text-white px-6 py-2 text-xs uppercase tracking-wider hover:bg-[#4a5850] transition">
              Enregistrer
            </button>
          </div>
        )}

        {/* Liste des partenaires */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockPartners.map((partner) => (
            <div key={partner.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                  <Users className="text-pink-600" size={24} />
                </div>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{partner.type}</span>
              </div>
              <h3 className="font-serif text-lg text-gray-800 mb-2">{partner.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{partner.contact}</p>
              <div className="space-y-2 mb-4 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <Mail size={14} />
                  <span>{partner.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} />
                  <span>{partner.phone}</span>
                </div>
              </div>
              <div className="flex gap-2 pt-4 border-t">
                <button className="flex-1 bg-blue-600 text-white px-3 py-2 text-xs uppercase tracking-wider hover:bg-blue-700 transition flex items-center justify-center gap-1">
                  <Edit2 size={14} /> Modifier
                </button>
                <button className="bg-red-600 text-white px-3 py-2 text-xs uppercase tracking-wider hover:bg-red-700 transition">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-yellow-900 mb-2">ℹ️ Note</h3>
          <p className="text-xs text-yellow-800">
            Pour sauvegarder les partenaires, créez une collection Firestore "partners" et connectez-la avec un hook.
          </p>
        </div>

      </div>
    </div>
  );
}
