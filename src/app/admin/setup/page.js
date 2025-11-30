/**
 * PAGE : Setup Admin (À SUPPRIMER APRÈS UTILISATION)
 * ====================================================
 *
 * Page temporaire pour créer le premier compte administrateur.
 *
 * 🚨 IMPORTANT : SUPPRIMEZ CETTE PAGE APRÈS AVOIR CRÉÉ VOTRE COMPTE !
 *
 * 🆕 FICHIER TEMPORAIRE : src/app/admin/setup/page.js
 * DATE : 2025-11-30
 */

"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserPlus, CheckCircle, AlertCircle } from 'lucide-react';

export default function AdminSetupPage() {
  const { createAdminAccount } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  /**
   * CRÉER LE COMPTE ADMIN
   */
  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    // Validation
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    try {
      await createAdminAccount(email, password);
      setSuccess(true);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Cet email est déjà utilisé');
      } else if (err.code === 'auth/invalid-email') {
        setError('Email invalide');
      } else if (err.message?.includes('autorisé')) {
        setError('Cet email n\'est pas dans la liste des admins autorisés. Vérifiez AuthContext.jsx ligne 42.');
      } else {
        setError(err.message || 'Erreur lors de la création du compte');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">

        {/* Alerte importante */}
        <div className="bg-red-50 border-2 border-red-500 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-red-800 mb-2 flex items-center gap-2">
            <AlertCircle size={24} />
            🚨 PAGE TEMPORAIRE - À SUPPRIMER !
          </h2>
          <p className="text-sm text-red-700">
            Cette page est destinée à créer votre premier compte admin.
            <strong className="block mt-2">SUPPRIMEZ CE FICHIER APRÈS UTILISATION pour des raisons de sécurité :</strong>
          </p>
          <code className="block mt-2 bg-red-100 p-2 text-xs rounded">
            src/app/admin/setup/page.js
          </code>
        </div>

        {/* Carte principale */}
        <div className="bg-white rounded-lg shadow-md p-8">

          {/* Titre */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#5d6e64] text-white rounded-full mb-4">
              <UserPlus size={32} />
            </div>
            <h1 className="text-3xl font-serif text-gray-800 mb-2">Créer un compte Admin</h1>
            <p className="text-sm text-gray-500">Configuration initiale du système d'authentification</p>
          </div>

          {/* Message de succès */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-4 rounded mb-6 flex items-start gap-3">
              <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold mb-1">Compte admin créé avec succès !</p>
                <p className="text-sm">
                  Vous pouvez maintenant vous connecter sur{' '}
                  <a href="/admin/login" className="underline font-semibold">/admin/login</a>
                </p>
                <p className="text-sm mt-2 font-bold text-green-900">
                  ⚠️ N'oubliez pas de supprimer ce fichier : src/app/admin/setup/page.js
                </p>
              </div>
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleCreate} className="space-y-6">

            {/* Message d'erreur */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded flex items-start gap-3">
                <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">📝 Instructions</h3>
              <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
                <li>Vérifiez que votre email est dans la liste des admins (AuthContext.jsx ligne 42)</li>
                <li>Entrez votre email et un mot de passe (min. 6 caractères)</li>
                <li>Cliquez sur "Créer le compte"</li>
                <li>Connectez-vous ensuite sur /admin/login</li>
                <li><strong>SUPPRIMEZ ce fichier après utilisation !</strong></li>
              </ol>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Admin *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 px-4 py-3 rounded focus:outline-none focus:border-[#5d6e64]"
                placeholder="votre-email@admin.com"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Cet email doit être dans ADMIN_EMAILS (AuthContext.jsx)
              </p>
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe *
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full border border-gray-300 px-4 py-3 rounded focus:outline-none focus:border-[#5d6e64]"
                placeholder="Minimum 6 caractères"
                disabled={loading}
              />
            </div>

            {/* Confirmation du mot de passe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmer le mot de passe *
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full border border-gray-300 px-4 py-3 rounded focus:outline-none focus:border-[#5d6e64]"
                placeholder="Retapez le mot de passe"
                disabled={loading}
              />
            </div>

            {/* Bouton */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-[#5d6e64] text-white py-3 rounded font-medium hover:bg-[#4a5850] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Création en cours...
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  Créer le compte administrateur
                </>
              )}
            </button>
          </form>
        </div>

        {/* Lien retour */}
        <div className="text-center mt-6">
          <a href="/" className="text-sm text-gray-600 hover:text-gray-800 transition">
            ← Retour à l'accueil
          </a>
        </div>
      </div>
    </div>
  );
}

/**
 * ============================================
 * APRÈS UTILISATION
 * ============================================
 *
 * 1. Supprimez ce fichier : src/app/admin/setup/page.js
 * 2. Supprimez le dossier : src/app/admin/setup/
 * 3. Ou ajoutez une protection dans ce fichier pour empêcher l'accès en production
 *
 * ============================================
 */
