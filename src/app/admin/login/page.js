/**
 * PAGE : Connexion Admin
 * ========================
 *
 * Page de connexion pour accéder au dashboard admin.
 *
 * 🆕 NOUVEAU FICHIER CRÉÉ : src/app/admin/login/page.js
 * DATE : 2025-11-30
 */

"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { LogIn, AlertCircle, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const { signIn, loading: authLoading, resetPassword } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [resetMessage, setResetMessage] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  /**
   * GÉRER LA CONNEXION
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(email, password);

      // Rediriger vers le dashboard admin
      router.push("/admin");
    } catch (err) {
      // Afficher un message d'erreur convivial
      if (err.code === "auth/invalid-credential") {
        setError("Email ou mot de passe incorrect");
      } else if (err.code === "auth/user-not-found") {
        setError("Aucun compte trouvé avec cet email");
      } else if (err.code === "auth/wrong-password") {
        setError("Mot de passe incorrect");
      } else if (err.code === "auth/too-many-requests") {
        setError("Trop de tentatives. Réessayez plus tard.");
      } else if (err.message?.includes("Accès refusé")) {
        setError("Accès refusé : vous n'êtes pas administrateur");
      } else {
        setError(err.message || "Erreur de connexion");
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * MOT DE PASSE OUBLIÉ
   */
  const handleForgotPassword = async () => {
    setResetMessage("");
    setResetError("");

    if (!email) {
      setResetError("Veuillez entrer votre email dans le champ ci-dessus.");
      return;
    }

    setResetLoading(true);

    try {
      await resetPassword(email);

      setResetMessage(
        "Si un compte administrateur existe pour cet email, vous recevrez un lien de réinitialisation dans quelques minutes."
      );
    } catch (err) {
      console.error("Erreur mot de passe oublié (admin):", err);

      if (err.code === "auth/invalid-email") {
        setResetError("Email invalide");
      } else if (err.code === "auth/user-not-found") {
        // Ne pas révéler si le compte admin existe ou non
        setResetMessage(
          "Si un compte administrateur existe pour cet email, vous recevrez un lien de réinitialisation dans quelques minutes."
        );
      } else {
        setResetError(
          "Impossible d'envoyer l'email de réinitialisation. Veuillez réessayer plus tard."
        );
      }
    } finally {
      setResetLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo / Titre */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#5d6e64] text-white rounded-full mb-4">
            <LogIn size={32} />
          </div>
          <h1 className="text-3xl font-serif text-gray-800 mb-2">
            Admin Login
          </h1>
          <p className="text-sm text-gray-500">
            Accédez au tableau de bord administrateur
          </p>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Message d'erreur */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded flex items-start gap-3">
                <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 px-4 py-3 rounded focus:outline-none focus:border-[#5d6e64] transition"
                placeholder="admin@example.com"
                disabled={loading}
              />
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full border border-gray-300 px-4 py-3 rounded focus:outline-none focus:border-[#5d6e64] transition pr-12"
                  placeholder="••••••••"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5d6e64] text-white py-3 rounded font-medium hover:bg-[#4a5850] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
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

            <div className="flex flex-col items-start gap-2 mt-2">
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={resetLoading || loading}
                className="text-xs text-gray-600 hover:text-gray-800 underline"
              >
                {resetLoading ? "Envoi du lien..." : "Mot de passe oublié ?"}
              </button>

              {resetMessage && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-3 py-2 rounded text-xs w-full">
                  {resetMessage}
                </div>
              )}

              {resetError && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-3 py-2 rounded text-xs w-full">
                  {resetError}
                </div>
              )}
            </div>
          </form>

          {/* Aide */}
          <div className="mt-6 pt-6 border-t">
            <p className="text-xs text-gray-500 text-center">
              Seuls les administrateurs autorisés peuvent se connecter.
            </p>
          </div>
        </div>

        {/* Retour à l'accueil */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-sm text-gray-600 hover:text-gray-800 transition"
          >
            ← Retour à l'accueil
          </a>
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
 * 1. CRÉER VOTRE PREMIER COMPTE ADMIN :
 *
 *    Option A : Via la console Firebase
 *    - Allez dans Firebase Console > Authentication
 *    - Cliquez sur "Add user"
 *    - Entrez votre email et mot de passe
 *
 *    Option B : Via une page de setup (recommandé)
 *    - Créez /admin/setup avec le formulaire de création
 *    - Supprimez la page après création
 *
 * 2. CONFIGURER LES EMAILS ADMIN :
 *
 *    Dans src/context/AuthContext.jsx, ligne 42 :
 *    ```javascript
 *    const ADMIN_EMAILS = [
 *      'votre-email@admin.com', // 👈 Votre email
 *    ];
 *    ```
 *
 * 3. ACTIVER FIREBASE AUTH :
 *
 *    - Console Firebase > Authentication > Sign-in method
 *    - Activez "Email/Password"
 *
 * 4. ACCÈS :
 *
 *    - URL : http://localhost:3000/admin/login
 *    - Entrez votre email et mot de passe
 *    - Vous serez redirigé vers /admin après connexion
 *
 * ============================================
 */
