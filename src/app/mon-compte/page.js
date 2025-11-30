/**
 * PAGE : Mon Compte (Connexion / Inscription)
 * ============================================
 *
 * Page unifiée pour la connexion et l'inscription.
 * Redirige automatiquement selon le rôle :
 * - Admin → /admin
 * - Client → /compte
 *
 * 🆕 NOUVEAU FICHIER : src/app/mon-compte/page.js
 * DATE : 2025-11-30
 */

"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, LogIn, UserPlus, Mail, Lock, User } from 'lucide-react';
import Link from 'next/link';

export default function MonComptePage() {
  const { user, isAdmin, userRole, loading, signIn, signUp } = useAuth();
  const router = useRouter();

  // État de l'interface
  const [activeTab, setActiveTab] = useState('login'); // 'login' ou 'signup'
  const [showPassword, setShowPassword] = useState(false);

  // État du formulaire de connexion
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // État du formulaire d'inscription
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupDisplayName, setSignupDisplayName] = useState('');
  const [signupError, setSignupError] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);

  /**
   * REDIRECTION AUTOMATIQUE SI DÉJÀ CONNECTÉ
   */
  useEffect(() => {
    if (!loading && user && userRole) {
      if (isAdmin) {
        router.push('/admin');
      } else {
        router.push('/compte');
      }
    }
  }, [user, userRole, isAdmin, loading, router]);

  /**
   * GESTION DE LA CONNEXION
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      await signIn(loginEmail, loginPassword);
      // La redirection se fera automatiquement via useEffect
    } catch (err) {
      console.error('Erreur de connexion:', err);

      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setLoginError('Email ou mot de passe incorrect');
      } else if (err.code === 'auth/user-not-found') {
        setLoginError('Aucun compte trouvé avec cet email');
      } else if (err.code === 'auth/invalid-email') {
        setLoginError('Email invalide');
      } else if (err.code === 'auth/too-many-requests') {
        setLoginError('Trop de tentatives. Veuillez réessayer plus tard.');
      } else {
        setLoginError(err.message || 'Erreur lors de la connexion');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  /**
   * GESTION DE L'INSCRIPTION
   */
  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupError('');
    setSignupLoading(true);

    // Validation des mots de passe
    if (signupPassword !== signupConfirmPassword) {
      setSignupError('Les mots de passe ne correspondent pas');
      setSignupLoading(false);
      return;
    }

    if (signupPassword.length < 6) {
      setSignupError('Le mot de passe doit contenir au moins 6 caractères');
      setSignupLoading(false);
      return;
    }

    try {
      await signUp(signupEmail, signupPassword, signupDisplayName);
      // La redirection se fera automatiquement via useEffect
    } catch (err) {
      console.error('Erreur d\'inscription:', err);

      if (err.code === 'auth/email-already-in-use') {
        setSignupError('Cet email est déjà utilisé');
      } else if (err.code === 'auth/invalid-email') {
        setSignupError('Email invalide');
      } else if (err.code === 'auth/weak-password') {
        setSignupError('Mot de passe trop faible');
      } else {
        setSignupError(err.message || 'Erreur lors de l\'inscription');
      }
    } finally {
      setSignupLoading(false);
    }
  };

  // Afficher un loader pendant la vérification de l'auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#5d6e64] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  // Si l'utilisateur est déjà connecté, ne rien afficher (useEffect gère la redirection)
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo / Titre */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-gray-800 mb-2">Mon Compte</h1>
          <p className="text-sm text-gray-600">Connectez-vous ou créez votre compte</p>
        </div>

        {/* Carte principale */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">

          {/* Onglets */}
          <div className="flex border-b">
            <button
              onClick={() => {
                setActiveTab('login');
                setLoginError('');
                setSignupError('');
              }}
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'login'
                  ? 'text-[#5d6e64] border-b-2 border-[#5d6e64]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <LogIn size={20} className="inline mr-2" />
              Connexion
            </button>
            <button
              onClick={() => {
                setActiveTab('signup');
                setLoginError('');
                setSignupError('');
              }}
              className={`flex-1 py-4 text-center font-medium transition ${
                activeTab === 'signup'
                  ? 'text-[#5d6e64] border-b-2 border-[#5d6e64]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <UserPlus size={20} className="inline mr-2" />
              Inscription
            </button>
          </div>

          <div className="p-8">

            {/* ONGLET CONNEXION */}
            {activeTab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-6">

                {/* Message d'erreur */}
                {loginError && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded text-sm">
                    {loginError}
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail size={16} className="inline mr-1" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="w-full border border-gray-300 px-4 py-3 rounded focus:outline-none focus:border-[#5d6e64]"
                    placeholder="votre-email@example.com"
                    disabled={loginLoading}
                  />
                </div>

                {/* Mot de passe */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Lock size={16} className="inline mr-1" />
                    Mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      className="w-full border border-gray-300 px-4 py-3 rounded focus:outline-none focus:border-[#5d6e64]"
                      placeholder="••••••••"
                      disabled={loginLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Bouton de connexion */}
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full bg-[#5d6e64] text-white py-3 rounded font-medium hover:bg-[#4a5850] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loginLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Connexion en cours...
                    </>
                  ) : (
                    <>
                      <LogIn size={20} />
                      Se connecter
                    </>
                  )}
                </button>

              </form>
            )}

            {/* ONGLET INSCRIPTION */}
            {activeTab === 'signup' && (
              <form onSubmit={handleSignup} className="space-y-6">

                {/* Message d'erreur */}
                {signupError && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded text-sm">
                    {signupError}
                  </div>
                )}

                {/* Nom d'affichage (optionnel) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User size={16} className="inline mr-1" />
                    Nom complet (optionnel)
                  </label>
                  <input
                    type="text"
                    value={signupDisplayName}
                    onChange={(e) => setSignupDisplayName(e.target.value)}
                    className="w-full border border-gray-300 px-4 py-3 rounded focus:outline-none focus:border-[#5d6e64]"
                    placeholder="Jean Dupont"
                    disabled={signupLoading}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail size={16} className="inline mr-1" />
                    Email *
                  </label>
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                    className="w-full border border-gray-300 px-4 py-3 rounded focus:outline-none focus:border-[#5d6e64]"
                    placeholder="votre-email@example.com"
                    disabled={signupLoading}
                  />
                </div>

                {/* Mot de passe */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Lock size={16} className="inline mr-1" />
                    Mot de passe *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full border border-gray-300 px-4 py-3 rounded focus:outline-none focus:border-[#5d6e64]"
                      placeholder="Minimum 6 caractères"
                      disabled={signupLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Confirmation du mot de passe */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Lock size={16} className="inline mr-1" />
                    Confirmer le mot de passe *
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full border border-gray-300 px-4 py-3 rounded focus:outline-none focus:border-[#5d6e64]"
                    placeholder="Retapez le mot de passe"
                    disabled={signupLoading}
                  />
                </div>

                {/* Bouton d'inscription */}
                <button
                  type="submit"
                  disabled={signupLoading}
                  className="w-full bg-[#5d6e64] text-white py-3 rounded font-medium hover:bg-[#4a5850] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {signupLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Inscription en cours...
                    </>
                  ) : (
                    <>
                      <UserPlus size={20} />
                      Créer mon compte
                    </>
                  )}
                </button>

              </form>
            )}

          </div>

        </div>

        {/* Lien retour à l'accueil */}
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-800 transition">
            ← Retour à l'accueil
          </Link>
        </div>

      </div>
    </div>
  );
}
