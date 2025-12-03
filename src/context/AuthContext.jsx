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

import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  updateProfile,
  deleteUser,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

// Créer le contexte
const AuthContext = createContext({});

// Hook pour utiliser le contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
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
  "admin@gwadecom.com", // 👈 Email admin principal
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
      setUserRole("admin");
      return;
    }

    // 2. Vérifier le rôle dans Firestore
    try {
      const userRef = doc(db, "users", currentUser.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();

        // Bloquer les comptes supprimés
        if (userData.status === "deleted" || userData.deletedAt) {
          console.warn("🚫 Compte supprimé - connexion refusée");
          await firebaseSignOut(auth);
          setUser(null);
          setIsAdmin(false);
          setUserRole(null);
          throw new Error(
            "Ce compte a été supprimé. Veuillez contacter le support."
          );
        }

        const role = userData.role || "client";

        setUserRole(role);
        setIsAdmin(role === "admin");
      } else {
        // Si l'utilisateur n'existe pas dans Firestore, c'est un client par défaut
        setUserRole("client");
        setIsAdmin(false);

        // Créer le document utilisateur dans Firestore
        await setDoc(userRef, {
          email: currentUser.email,
          role: "client",
          status: "active",
          createdAt: new Date(),
        });
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du rôle:", error);
      setUserRole("client");
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
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      await checkUserRole(userCredential.user);
      return userCredential.user;
    } catch (error) {
      console.error("Erreur de connexion:", error);
      throw error;
    }
  };

  /**
   * INSCRIPTION (NOUVEAU COMPTE CLIENT)
   */
  const signUp = async (email, password, displayName = "") => {
    try {
      // ÉTAPE 1 : Créer le compte Firebase Auth d'abord
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // ÉTAPE 2 : Mettre à jour le profil Firebase Auth avec le displayName
      if (displayName) {
        await updateProfile(user, {
          displayName: displayName,
        });
        // Recharger l'utilisateur pour forcer la mise à jour du contexte
        await user.reload();
        setUser(auth.currentUser);
      }

      // ÉTAPE 3 : Vérifier si un compte supprimé existe avec cet email (maintenant qu'on est authentifié)
      let restoredFromDeleted = false;
      try {
        const usersRef = collection(db, "users");
        const deletedQuery = query(
          usersRef,
          where("originalEmail", "==", email),
          where("status", "==", "deleted")
        );
        const deletedSnapshot = await getDocs(deletedQuery);

        if (!deletedSnapshot.empty) {
          const deletedUserDoc = deletedSnapshot.docs[0];
          const oldUserData = deletedUserDoc.data();
          restoredFromDeleted = true;

          console.log("📧 Compte supprimé trouvé - Restauration des données");

          // Créer le profil avec les anciennes données
          await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            displayName: displayName || oldUserData.displayName,
            role: oldUserData.role || "client",
            status: "active",
            createdAt: oldUserData.createdAt || new Date(),
            restoredAt: new Date(),
            previousUserId: deletedUserDoc.id,
          });
        }
      } catch (err) {
        console.log(
          "⚠️ Impossible de vérifier les comptes supprimés:",
          err.message
        );
        // Continuer avec la création normale
      }

      // ÉTAPE 4 : Créer le profil utilisateur dans Firestore (si pas restauré)
      if (!restoredFromDeleted) {
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          displayName: displayName,
          role: "client", // Par défaut : client
          status: "active",
          createdAt: new Date(),
        });
      }

      setUserRole("client");
      setIsAdmin(false);

      // Envoyer l'email de bienvenue
      try {
        // Extraire firstName et lastName du displayName
        const nameParts = displayName ? displayName.trim().split(" ") : [];
        const firstName = nameParts[0] || "Nouvel utilisateur";
        const lastName = nameParts.slice(1).join(" ") || "";

        console.log("📧 Envoi de l'email de bienvenue à:", email);

        const response = await fetch("/api/send-welcome-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userData: {
              email: email,
              firstName: firstName,
              lastName: lastName,
            },
          }),
        });

        if (response.ok) {
          console.log("✅ Email de bienvenue envoyé avec succès");
        } else {
          console.error(
            "⚠️ Erreur lors de l'envoi de l'email de bienvenue:",
            await response.text()
          );
        }
      } catch (emailError) {
        // Ne pas bloquer l'inscription si l'email échoue
        console.error(
          "⚠️ Échec de l'envoi de l'email de bienvenue (non bloquant):",
          emailError
        );
      }

      return user;
    } catch (error) {
      console.error("Erreur d'inscription:", error);
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
      console.error("Erreur de déconnexion:", error);
      throw error;
    }
  };

  /**
   * CRÉER UN COMPTE ADMIN (À UTILISER UNE SEULE FOIS)
   */
  const createAdminAccount = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Créer le profil admin dans Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: "admin",
        createdAt: new Date(),
      });

      setUserRole("admin");
      setIsAdmin(true);

      return user;
    } catch (error) {
      console.error("Erreur de création de compte admin:", error);
      throw error;
    }
  };

  /**
   * SOFT DELETE - SUPPRIMER UN COMPTE UTILISATEUR
   * ==============================================
   * Le compte est marqué comme supprimé dans Firestore (soft delete)
   * ET supprimé de Firebase Auth (hard delete) pour libérer l'email.
   * Les commandes de cet utilisateur restent intactes dans Firestore.
   *
   * @param {string} userId - L'ID Firebase de l'utilisateur à supprimer
   * @param {boolean} anonymize - Si true, anonymise l'email (par défaut: true)
   */
  const softDeleteUser = async (userId, anonymize = true) => {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        throw new Error("Utilisateur introuvable");
      }

      const userData = userDoc.data();
      const updateData = {
        deletedAt: new Date(),
        status: "deleted",
        // Conserver l'email original pour référence ET pour détecter les réinscriptions
        originalEmail: userData.email,
      };

      // Anonymiser l'email si demandé
      if (anonymize) {
        updateData.email = `deleted_${userId}@deleted.local`;
        updateData.displayName = "Compte supprimé";
      }

      // ÉTAPE 1 : Mettre à jour le document Firestore (SOFT DELETE)
      await updateDoc(userRef, updateData);

      // ÉTAPE 2 : Supprimer de Firebase Auth (HARD DELETE) pour libérer l'email
      // Note : Cela permet à l'utilisateur de se réinscrire avec le même email
      try {
        // Récupérer le token de l'utilisateur admin actuel
        const currentUser = auth.currentUser;
        if (currentUser) {
          const adminToken = await currentUser.getIdToken();

          // Appeler l'API pour supprimer le compte Firebase Auth
          const response = await fetch("/api/admin/delete-auth-user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId,
              adminToken,
            }),
          });

          const result = await response.json();

          if (result.success) {
            console.log(
              "✅ Compte supprimé de Firebase Auth - L'email est maintenant disponible"
            );
          } else {
            console.warn(
              "⚠️ Échec de la suppression Firebase Auth:",
              result.error
            );
            console.log(
              "ℹ️ Le compte Firestore est supprimé mais l'email reste bloqué dans Auth"
            );
          }
        } else {
          console.warn(
            "⚠️ Pas d'utilisateur connecté - impossible de supprimer le compte Auth"
          );
        }
      } catch (authError) {
        console.error(
          "Erreur lors de la suppression Firebase Auth:",
          authError
        );
        // On continue même si la suppression Auth échoue
      }

      return {
        success: true,
        message: "Compte utilisateur supprimé avec succès",
      };
    } catch (error) {
      console.error("Erreur lors de la suppression du compte:", error);
      throw error;
    }
  };

  /**
   * RESTAURER UN COMPTE SUPPRIMÉ
   * =============================
   * Restaure un compte précédemment supprimé.
   *
   * @param {string} userId - L'ID Firebase de l'utilisateur à restaurer
   */
  const restoreUser = async (userId) => {
    try {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        throw new Error("Utilisateur introuvable");
      }

      const userData = userDoc.data();

      // Restaurer les données originales
      const updateData = {
        deletedAt: null,
        status: "active",
      };

      // Restaurer l'email original s'il existe
      if (userData.originalEmail) {
        updateData.email = userData.originalEmail;
        updateData.displayName = userData.originalEmail.split("@")[0];
      }

      // Mettre à jour le document Firestore
      await updateDoc(userRef, updateData);

      return {
        success: true,
        message: "Compte utilisateur restauré avec succès",
      };
    } catch (error) {
      console.error("Erreur lors de la restauration du compte:", error);
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
    softDeleteUser,
    restoreUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
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
