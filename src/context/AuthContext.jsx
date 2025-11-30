/**
 * CONTEXTE : Authentification Firebase
 * ======================================
 *
 * Gère l'authentification des utilisateurs avec Firebase Auth.
 * Permet de savoir si l'utilisateur est connecté et s'il est admin.
 *
 * 🆕 NOUVEAU FICHIER CRÉÉ : src/context/AuthContext.jsx
 * DATE : 2025-11-30
 *
 * UTILISATION :
 * - Envelopper l'app dans <AuthProvider>
 * - Utiliser useAuth() dans n'importe quel composant
 */

"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword
} from 'firebase/auth';

// Créer le contexte
const AuthContext = createContext({});

// Hook pour utiliser le contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

/**
 * LISTE DES EMAILS ADMIN
 * =======================
 *
 * IMPORTANT : Remplacez cet email par le vôtre !
 * Seuls les emails dans cette liste auront accès à l'admin.
 *
 * Option 1 : Liste en dur (simple mais nécessite redéploiement)
 * Option 2 : Stocké dans Firestore (plus flexible)
 * Option 3 : Variable d'environnement (recommandé)
 */
const ADMIN_EMAILS = [
  'votre-email@admin.com', // 👈 REMPLACEZ PAR VOTRE EMAIL
  // Ajoutez d'autres emails admin ici si besoin
];

// Alternative : Utiliser une variable d'environnement
// const ADMIN_EMAILS = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || [];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  /**
   * ÉCOUTER LES CHANGEMENTS D'AUTHENTIFICATION
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      // Vérifier si l'utilisateur est admin
      if (currentUser) {
        const userIsAdmin = ADMIN_EMAILS.includes(currentUser.email);
        setIsAdmin(userIsAdmin);
      } else {
        setIsAdmin(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * CONNEXION AVEC EMAIL/PASSWORD
   */
  const signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Vérifier si c'est un admin
      if (!ADMIN_EMAILS.includes(email)) {
        await firebaseSignOut(auth);
        throw new Error('Accès refusé : vous n\'êtes pas administrateur');
      }

      return userCredential.user;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  };

  /**
   * DÉCONNEXION
   */
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setIsAdmin(false);
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      throw error;
    }
  };

  /**
   * CRÉER UN COMPTE ADMIN (À UTILISER UNE SEULE FOIS)
   */
  const createAdminAccount = async (email, password) => {
    try {
      // Vérifier que l'email est dans la liste des admins
      if (!ADMIN_EMAILS.includes(email)) {
        throw new Error('Cet email n\'est pas autorisé comme admin');
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Erreur de création de compte:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isAdmin,
    signIn,
    signOut,
    createAdminAccount,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * ============================================
 * GUIDE D'UTILISATION
 * ============================================
 *
 * 1. CONFIGURATION DANS layout.js :
 *
 *    ```jsx
 *    import { AuthProvider } from '@/context/AuthContext';
 *
 *    export default function RootLayout({ children }) {
 *      return (
 *        <html>
 *          <body>
 *            <AuthProvider>
 *              <CartProvider>
 *                {children}
 *              </CartProvider>
 *            </AuthProvider>
 *          </body>
 *        </html>
 *      );
 *    }
 *    ```
 *
 * 2. UTILISATION DANS UN COMPOSANT :
 *
 *    ```jsx
 *    import { useAuth } from '@/context/AuthContext';
 *
 *    export default function MonComposant() {
 *      const { user, isAdmin, signOut } = useAuth();
 *
 *      if (!isAdmin) {
 *        return <p>Accès refusé</p>;
 *      }
 *
 *      return (
 *        <div>
 *          <p>Bienvenue {user.email}</p>
 *          <button onClick={signOut}>Déconnexion</button>
 *        </div>
 *      );
 *    }
 *    ```
 *
 * 3. CRÉER VOTRE PREMIER COMPTE ADMIN :
 *
 *    Créez une page temporaire /admin/setup pour créer le compte :
 *
 *    ```jsx
 *    const { createAdminAccount } = useAuth();
 *
 *    const handleCreate = async () => {
 *      await createAdminAccount('votre-email@admin.com', 'votre-mot-de-passe');
 *    };
 *    ```
 *
 *    Supprimez cette page après création du compte !
 *
 * 4. CONFIGURER LES EMAILS ADMIN :
 *
 *    Option A : Modifier directement dans ce fichier (ligne 42)
 *    Option B : Utiliser une variable d'environnement dans .env.local :
 *
 *    ```
 *    NEXT_PUBLIC_ADMIN_EMAILS=admin@example.com,admin2@example.com
 *    ```
 *
 * 5. ACTIVER FIREBASE AUTH :
 *
 *    Dans la console Firebase :
 *    - Allez dans Authentication > Sign-in method
 *    - Activez "Email/Password"
 *
 * ============================================
 */
