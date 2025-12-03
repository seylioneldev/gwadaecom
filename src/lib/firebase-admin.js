/**
 * FIREBASE ADMIN SDK
 * ===================
 * Utilisé côté serveur pour les opérations admin (suppression de comptes Auth, etc.)
 *
 * ⚠️ IMPORTANT : Ce fichier nécessite des credentials Firebase Admin
 *
 * CONFIGURATION :
 * 1. Allez sur Firebase Console → Project Settings → Service Accounts
 * 2. Cliquez sur "Generate New Private Key"
 * 3. Téléchargez le fichier JSON
 * 4. Ajoutez les variables d'environnement dans .env.local :
 *    - FIREBASE_ADMIN_PROJECT_ID
 *    - FIREBASE_ADMIN_CLIENT_EMAIL
 *    - FIREBASE_ADMIN_PRIVATE_KEY
 */

import admin from 'firebase-admin';

// Initialiser Firebase Admin (singleton)
if (!admin.apps.length) {
  try {
    // Vérifier que les variables d'environnement existent
    const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
      console.warn('⚠️ Firebase Admin SDK : Variables d\'environnement manquantes');
      console.warn('La suppression de comptes Firebase Auth ne sera pas disponible');
    } else {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      console.log('✅ Firebase Admin SDK initialisé avec succès');
    }
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de Firebase Admin SDK:', error);
  }
}

export const adminAuth = admin.apps.length > 0 ? admin.auth() : null;
export const adminDb = admin.apps.length > 0 ? admin.firestore() : null;

export default admin;
