/**
 * PAGE ADMIN : Facturation
 * ==========================
 *
 * Gestion de la facturation et des devis.
 *
 * 🆕 NOUVEAU FICHIER CRÉÉ : src/app/admin/commercial/invoicing/page.js
 * DATE : 2025-11-30
 */

"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileCheck, Plus, Download, Eye, Check, Clock, XCircle } from 'lucide-react';

export default function InvoicingPage() {
  const [activeTab, setActiveTab] = useState('invoices'); // 'invoices' ou 'quotes'

  // Factures mockées
  const mockInvoices = [
    { id: 'F-2025-001', client: 'Jean Dupont', amount: 156.90, status: 'paid', date: '2025-11-25', dueDate: '2025-12-25' },
    { id: 'F-2025-002', client: 'Marie Martin', amount: 89.50, status: 'pending', date: '2025-11-28', dueDate: '2025-12-28' },
    { id: 'F-2025-003', client: 'Pierre Durand', amount: 234.00, status: 'overdue', date: '2025-11-10', dueDate: '2025-11-20' },
  ];

  const mockQuotes = [
    { id: 'D-2025-001', client: 'Sophie Blanc', amount: 450.00, status: 'sent', date: '2025-11-30', validUntil: '2025-12-15' },
    { id: 'D-2025-002', client: 'Luc Bernard', amount: 120.00, status: 'accepted', date: '2025-11-28', validUntil: '2025-12-13' },
  ];

  const statusConfig = {
    paid: { label: 'Payée', color: 'bg-green-100 text-green-800', icon: Check },
    pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    overdue: { label: 'En retard', color: 'bg-red-100 text-red-800', icon: XCircle },
    sent: { label: 'Envoyé', color: 'bg-blue-100 text-blue-800', icon: Clock },
    accepted: { label: 'Accepté', color: 'bg-green-100 text-green-800', icon: Check },
  };

  const data = activeTab === 'invoices' ? mockInvoices : mockQuotes;

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
              <h1 className="text-3xl font-serif text-gray-800 mb-2">Facturation</h1>
              <p className="text-sm text-gray-500">Gérez vos factures, devis et paiements</p>
            </div>
          </div>
          <button className="bg-[#5d6e64] text-white px-6 py-3 text-sm uppercase tracking-wider hover:bg-[#4a5850] transition flex items-center gap-2">
            <Plus size={16} />
            {activeTab === 'invoices' ? 'Nouvelle Facture' : 'Nouveau Devis'}
          </button>
        </div>

        {/* Onglets */}
        <div className="mb-6 border-b">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('invoices')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
                activeTab === 'invoices'
                  ? 'border-[#5d6e64] text-[#5d6e64]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Factures ({mockInvoices.length})
            </button>
            <button
              onClick={() => setActiveTab('quotes')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
                activeTab === 'quotes'
                  ? 'border-[#5d6e64] text-[#5d6e64]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Devis ({mockQuotes.length})
            </button>
          </div>
        </div>

        {/* Tableau */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-600">Numéro</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-600">Client</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-600">Date</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-600">
                  {activeTab === 'invoices' ? 'Échéance' : 'Valide jusqu\'au'}
                </th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-600">Montant</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-600">Statut</th>
                <th className="px-6 py-4 text-right text-xs uppercase tracking-wider text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.map((item) => {
                const StatusIcon = statusConfig[item.status].icon;
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-sm font-semibold">{item.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{item.client}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {activeTab === 'invoices' ? item.dueDate : item.validUntil}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-800">{item.amount.toFixed(2)} €</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusConfig[item.status].color}`}>
                        <StatusIcon size={12} />
                        {statusConfig[item.status].label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button className="p-2 text-blue-600 hover:bg-blue-100 rounded" title="Voir">
                          <Eye size={18} />
                        </button>
                        <button className="p-2 text-green-600 hover:bg-green-100 rounded" title="Télécharger PDF">
                          <Download size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">Total Factures</p>
            <p className="text-3xl font-bold text-gray-800">480.40 €</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">En Attente</p>
            <p className="text-3xl font-bold text-yellow-600">89.50 €</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-xs uppercase tracking-wider text-gray-500 mb-2">En Retard</p>
            <p className="text-3xl font-bold text-red-600">234.00 €</p>
          </div>
        </div>

        {/* Note */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-yellow-900 mb-2">ℹ️ Note</h3>
          <p className="text-xs text-yellow-800">
            Cette page affiche des données mockées. Pour gérer de vraies factures, créez une collection Firestore "invoices"
            et intégrez une bibliothèque de génération de PDF comme jsPDF ou react-pdf.
          </p>
        </div>

      </div>
    </div>
  );
}
