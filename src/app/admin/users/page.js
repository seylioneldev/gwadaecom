/**
 * PAGE ADMIN : Gestion des Utilisateurs
 * ========================================
 *
 * Permet de visualiser tous les utilisateurs et de modifier leurs rôles.
 * Accessible uniquement aux administrateurs.
 *
 * 🆕 NOUVEAU FICHIER : src/app/admin/users/page.js
 * DATE : 2025-11-30
 */

"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { ArrowLeft, Users, Shield, User, Mail, Calendar, AlertCircle, CheckCircle, Trash2, RotateCcw, Filter } from 'lucide-react';
import Link from 'next/link';

export default function AdminUsersPage() {
  const { isAdmin, loading: authLoading, softDeleteUser, restoreUser } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);

  /**
   * REDIRECTION SI NON ADMIN
   */
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/admin/login');
    }
  }, [isAdmin, authLoading, router]);

  /**
   * CHARGER LA LISTE DES UTILISATEURS
   */
  useEffect(() => {
    const fetchUsers = async () => {
      if (!isAdmin) return;

      try {
        setLoading(true);
        const usersRef = collection(db, 'users');
        const snapshot = await getDocs(usersRef);

        const usersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Trier par date de création (plus récents en premier)
        usersData.sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(0);
          const dateB = b.createdAt?.toDate?.() || new Date(0);
          return dateB - dateA;
        });

        setUsers(usersData);
        setError('');
      } catch (err) {
        console.error('Erreur lors du chargement des utilisateurs:', err);
        setError('Impossible de charger les utilisateurs');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isAdmin]);

  /**
   * CHANGER LE RÔLE D'UN UTILISATEUR
   */
  const handleRoleChange = async (userId, newRole) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { role: newRole });

      // Mettre à jour l'état local
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );

      setSuccessMessage(`Rôle mis à jour avec succès`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Erreur lors de la mise à jour du rôle:', err);
      setError('Impossible de mettre à jour le rôle');
      setTimeout(() => setError(''), 3000);
    }
  };

  /**
   * SUPPRIMER UN COMPTE (SOFT DELETE)
   */
  const handleDeleteUser = async (userId, userName) => {
    const confirmed = window.confirm(
      `⚠️ Êtes-vous sûr de vouloir supprimer le compte de "${userName}" ?\n\n` +
      `Le compte sera marqué comme supprimé mais :\n` +
      `✅ Les commandes seront conservées\n` +
      `✅ L'historique sera préservé\n` +
      `✅ Le compte pourra être restauré plus tard\n\n` +
      `L'utilisateur ne pourra plus se connecter.`
    );

    if (!confirmed) return;

    try {
      await softDeleteUser(userId, true);

      // Mettre à jour l'état local
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? { ...user, status: 'deleted', deletedAt: new Date(), email: `deleted_${userId}@deleted.local`, displayName: 'Compte supprimé' }
            : user
        )
      );

      setSuccessMessage(`✅ Le compte de "${userName}" a été supprimé avec succès`);
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError(err.message || 'Impossible de supprimer le compte');
      setTimeout(() => setError(''), 5000);
    }
  };

  /**
   * RESTAURER UN COMPTE SUPPRIMÉ
   */
  const handleRestoreUser = async (userId) => {
    const confirmed = window.confirm(
      `Restaurer ce compte ?\n\n` +
      `L'utilisateur pourra à nouveau se connecter.`
    );

    if (!confirmed) return;

    try {
      await restoreUser(userId);

      // Recharger la liste des utilisateurs pour récupérer les données mises à jour
      const usersRef = collection(db, 'users');
      const snapshot = await getDocs(usersRef);
      const usersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      usersData.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB - dateA;
      });

      setUsers(usersData);

      setSuccessMessage(`✅ Le compte a été restauré avec succès`);
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      console.error('Erreur lors de la restauration:', err);
      setError(err.message || 'Impossible de restaurer le compte');
      setTimeout(() => setError(''), 5000);
    }
  };

  /**
   * FORMATER LA DATE
   */
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Date inconnue';
    try {
      const date = timestamp.toDate?.() || new Date(timestamp);
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return 'Date invalide';
    }
  };

  /**
   * FILTRER LES UTILISATEURS
   */
  const filteredUsers = users.filter((user) => {
    const isDeleted = user.status === 'deleted' || user.deletedAt;
    return showDeleted ? isDeleted : !isDeleted;
  });

  // Statistiques
  const activeUsers = users.filter((u) => u.status !== 'deleted' && !u.deletedAt);
  const deletedUsers = users.filter((u) => u.status === 'deleted' || u.deletedAt);
  const activeAdmins = activeUsers.filter((u) => u.role === 'admin').length;
  const activeClients = activeUsers.filter((u) => u.role === 'client').length;

  // Loader pendant la vérification de l'auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#5d6e64] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  // Si non admin, ne rien afficher (useEffect gère la redirection)
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">

        {/* En-tête */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-2 hover:bg-gray-200 rounded-full transition">
              <ArrowLeft size={24} className="text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-serif text-gray-800 flex items-center gap-3">
                <Users size={32} className="text-[#5d6e64]" />
                Gestion des Utilisateurs
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Visualisez et gérez les rôles des utilisateurs
              </p>
            </div>
          </div>

          {/* Bouton de filtre */}
          <button
            onClick={() => setShowDeleted(!showDeleted)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition ${
              showDeleted
                ? 'bg-red-50 border-red-300 text-red-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter size={18} />
            {showDeleted ? (
              <>Comptes supprimés ({deletedUsers.length})</>
            ) : (
              <>Comptes actifs ({activeUsers.length})</>
            )}
          </button>
        </div>

        {/* Messages de succès/erreur */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded mb-6 flex items-center gap-3">
            <CheckCircle size={20} />
            <p className="text-sm">{successMessage}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-6 flex items-center gap-3">
            <AlertCircle size={20} />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Informations */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">ℹ️ Informations - Soft Delete</h3>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Les admins ont accès au dashboard admin (/admin)</li>
            <li>• Les clients ont accès à leur espace personnel (/compte)</li>
            <li>• Vous pouvez changer le rôle d'un utilisateur en sélectionnant une option dans le menu déroulant</li>
            <li>• <strong>Suppression de compte :</strong> Les comptes sont marqués comme supprimés (soft delete)</li>
            <li>• <strong>Commandes préservées :</strong> Les commandes des utilisateurs supprimés restent intactes</li>
            <li>• <strong>Restauration possible :</strong> Un compte supprimé peut être restauré à tout moment</li>
            <li>• Les utilisateurs supprimés ne peuvent plus se connecter</li>
          </ul>
        </div>

        {/* Tableau des utilisateurs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">

          {loading ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 border-4 border-[#5d6e64] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Chargement des utilisateurs...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center">
              <Users size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {showDeleted ? 'Aucun compte supprimé' : 'Aucun utilisateur actif'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Utilisateur
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Rôle
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date d'inscription
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => {
                    const isDeleted = user.status === 'deleted' || user.deletedAt;
                    return (
                    <tr key={user.id} className={`transition ${isDeleted ? 'bg-red-50' : 'hover:bg-gray-50'}`}>
                      {/* Nom d'utilisateur */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#5d6e64] text-white rounded-full flex items-center justify-center">
                            {user.role === 'admin' ? (
                              <Shield size={20} />
                            ) : (
                              <User size={20} />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {user.displayName || 'Sans nom'}
                            </p>
                            <p className="text-xs text-gray-500">ID: {user.id.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Mail size={14} className="text-gray-400" />
                          {user.email}
                        </div>
                      </td>

                      {/* Rôle */}
                      <td className="px-6 py-4">
                        {user.role === 'admin' ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#5d6e64] text-white text-xs font-semibold rounded-full">
                            <Shield size={12} />
                            Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-200 text-gray-700 text-xs font-semibold rounded-full">
                            <User size={12} />
                            Client
                          </span>
                        )}
                      </td>

                      {/* Date d'inscription */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar size={14} className="text-gray-400" />
                          {formatDate(user.createdAt)}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {isDeleted ? (
                            // Compte supprimé : bouton Restaurer
                            <button
                              onClick={() => handleRestoreUser(user.id)}
                              className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm"
                            >
                              <RotateCcw size={14} />
                              Restaurer
                            </button>
                          ) : (
                            // Compte actif : dropdown rôle + bouton Supprimer
                            <>
                              <select
                                value={user.role || 'client'}
                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:border-[#5d6e64]"
                              >
                                <option value="client">Client</option>
                                <option value="admin">Admin</option>
                              </select>
                              <button
                                onClick={() => handleDeleteUser(user.id, user.displayName || user.email)}
                                className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
                                title="Supprimer le compte"
                              >
                                <Trash2 size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

        </div>

        {/* Statistiques */}
        {users.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Utilisateurs actifs</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{activeUsers.length}</p>
                </div>
                <Users size={32} className="text-gray-300" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Administrateurs</p>
                  <p className="text-3xl font-bold text-[#5d6e64] mt-1">{activeAdmins}</p>
                </div>
                <Shield size={32} className="text-[#5d6e64]/30" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Clients</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{activeClients}</p>
                </div>
                <User size={32} className="text-gray-300" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Comptes supprimés</p>
                  <p className="text-3xl font-bold text-red-600 mt-1">{deletedUsers.length}</p>
                </div>
                <Trash2 size={32} className="text-red-300" />
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

/**
 * ============================================
 * COMMENT CRÉER UN ADMIN
 * ============================================
 *
 * MÉTHODE 1 : Via cette page (recommandé)
 * - Connectez-vous comme admin
 * - Allez sur /admin/users
 * - Trouvez l'utilisateur
 * - Changez son rôle en "Admin"
 *
 * MÉTHODE 2 : Via ADMIN_EMAILS (fallback)
 * - Ouvrez src/context/AuthContext.jsx
 * - Ajoutez l'email dans le tableau ADMIN_EMAILS
 * - Redéployez l'application
 *
 * MÉTHODE 3 : Via Firebase Console
 * - Allez sur Firebase Console → Firestore
 * - Collection : users
 * - Document : [uid de l'utilisateur]
 * - Modifiez le champ "role" en "admin"
 *
 * ============================================
 */
