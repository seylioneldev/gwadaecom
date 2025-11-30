/**
 * CONTEXTE : Authentification Firebase
 * ======================================
 *
 * Gère l'authentification des utilisateurs avec Firebase Auth.
 * Système hybride : ADMIN_EMAILS (fallback) + Firestore role (flexible)
 *
 * 🆕 FICHIER MODIFIÉ : src/context/AuthContext.jsx
 * DATE : 2025-11-30
 *
 * UTILISATION :
 * - Envelopper l'app dans <AuthProvider>
 * - Utiliser useAuth() dans n'importe quel composant
 */

"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

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
 * LISTE DES EMAILS ADMIN (FALLBACK)
 * ==================================
 *
 * Ces emails auront TOUJOURS accès admin, même si Firestore est vide.
 * Utile pour le premier démarrage et comme sécurité de secours.
 */
const ADMIN_EMAILS = [
  'admin@gwadecom.com', // 👈 Email admin principal
  // Ajoutez d'autres emails admin de secours ici
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState(null);

  /**
   * VÉRIFIER LE RÔLE DANS FIRESTORE
   * =================================
   * Méthode hybride :
   * 1. Vérifier si l'email est dans ADMIN_EMAILS (fallback)
   * 2. Sinon, vérifier le rôle dans Firestore
   */
  const checkUserRole = async (currentUser) => {
    if (!currentUser) {
      setIsAdmin(false);
      setUserRole(null);
      return;
    }

    // 1. Vérifier d'abord dans ADMIN_EMAILS (fallback)
    const isInAdminList = ADMIN_EMAILS.includes(currentUser.email);

    if (isInAdminList) {
      setIsAdmin(true);
      setUserRole('admin');
      return;
    }

    // 2. Vérifier le rôle dans Firestore
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const role = userData.role || 'client';

        setUserRole(role);
        setIsAdmin(role === 'admin');
      } else {
        // Si l'utilisateur n'existe pas dans Firestore, c'est un client par défaut
        setUserRole('client');
        setIsAdmin(false);

        // Créer le document utilisateur dans Firestore
        await setDoc(userRef, {
          email: currentUser.email,
          role: 'client',
          createdAt: new Date()
        });
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du rôle:', error);
      setUserRole('client');
      setIsAdmin(false);
    }
  };

  /**
   * ÉCOUTER LES CHANGEMENTS D'AUTHENTIFICATION
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      await checkUserRole(currentUser);
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
      await checkUserRole(userCredential.user);
      return userCredential.user;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  };

  /**
   * INSCRIPTION (NOUVEAU COMPTE CLIENT)
   */
  const signUp = async (email, password, displayName = '') => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Créer le profil utilisateur dans Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: displayName,
        role: 'client', // Par défaut : client
        createdAt: new Date()
      });

      setUserRole('client');
      setIsAdmin(false);

      return user;
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
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
      setUserRole(null);
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Créer le profil admin dans Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        role: 'admin',
        createdAt: new Date()
      });

      setUserRole('admin');
      setIsAdmin(true);

      return user;
    } catch (error) {
      console.error('Erreur de création de compte admin:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isAdmin,
    userRole,
    signIn,
    signUp,
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
 * SYSTÈME HYBRIDE :
 * 1. ADMIN_EMAILS (ligne 50) : Admins permanents (fallback)
 * 2. Firestore role : Admins flexibles (sans modification de code)
 *
 * CRÉER UN ADMIN :
 *
 * Méthode 1 : Via ADMIN_EMAILS (permanent)
 *   - Modifiez la ligne 50
 *   - Redéployez l'application
 *
 * Méthode 2 : Via Firestore (flexible, recommandé)
 *   - Firebase Console → Firestore
 *   - Collection : users
 *   - Document : [uid de l'utilisateur]
 *   - Champ : role = "admin"
 *
 * Méthode 3 : Via la page admin (plus tard)
 *   - /admin/users → Changer le rôle d'un utilisateur
 *
 * CRÉER UN CLIENT :
 *   - L'utilisateur s'inscrit sur /mon-compte
 *   - Rôle par défaut : "client"
 *
 * ============================================
 */
