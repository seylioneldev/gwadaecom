// Import des fonctions nécessaires de Firebase
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Pour stocker les images des produits

// Configuration de l'application (utilise les variables cachées)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialisation (Singleton : pour éviter de se connecter 2 fois)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// On exporte les outils pour les utiliser dans le site
export const auth = getAuth(app); // Pour l'authentification (Login)
export const db = getFirestore(app); // Pour la base de données (Produits)
export const storage = getStorage(app); // Pour les images