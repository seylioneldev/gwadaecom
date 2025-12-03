/**
 * API ADMIN : Supprimer un utilisateur Firebase Auth
 * ===================================================
 *
 * Cette API utilise Firebase Admin SDK pour supprimer un compte Firebase Auth.
 * Cela libère l'email pour qu'il puisse être réutilisé.
 *
 * SÉCURITÉ : Accessible uniquement aux administrateurs
 */

import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(request) {
  try {
    // Vérifier que Firebase Admin SDK est initialisé
    if (!adminAuth) {
      return NextResponse.json(
        {
          success: false,
          error: 'Firebase Admin SDK non configuré. Ajoutez les variables d\'environnement FIREBASE_ADMIN_*',
        },
        { status: 500 }
      );
    }

    // Récupérer les données de la requête
    const { userId, adminToken } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'userId requis' },
        { status: 400 }
      );
    }

    // ⚠️ SÉCURITÉ : Vérifier que l'utilisateur qui fait la requête est un admin
    if (!adminToken) {
      return NextResponse.json(
        { success: false, error: 'Token admin requis' },
        { status: 401 }
      );
    }

    // Vérifier le token Firebase
    try {
      const decodedToken = await adminAuth.verifyIdToken(adminToken);
      const requestUserId = decodedToken.uid;

      // Vérifier dans Firestore que l'utilisateur est admin
      const userDoc = await adminDb.collection('users').doc(requestUserId).get();
      const userData = userDoc.data();

      if (!userData || userData.role !== 'admin') {
        return NextResponse.json(
          { success: false, error: 'Accès refusé : seuls les admins peuvent supprimer des comptes' },
          { status: 403 }
        );
      }
    } catch (error) {
      console.error('Erreur de vérification du token:', error);
      return NextResponse.json(
        { success: false, error: 'Token invalide' },
        { status: 401 }
      );
    }

    // ÉTAPE 1 : Vérifier que l'utilisateur existe dans Firebase Auth
    try {
      await adminAuth.getUser(userId);
    } catch (error) {
      console.log(`ℹ️ Utilisateur ${userId} déjà supprimé de Firebase Auth (ou n'existe pas)`);
      return NextResponse.json({
        success: true,
        message: 'Utilisateur déjà supprimé de Firebase Auth',
        alreadyDeleted: true,
      });
    }

    // ÉTAPE 2 : Supprimer l'utilisateur de Firebase Auth
    await adminAuth.deleteUser(userId);

    console.log(`✅ Utilisateur ${userId} supprimé de Firebase Auth`);

    return NextResponse.json({
      success: true,
      message: 'Utilisateur supprimé de Firebase Auth avec succès',
    });
  } catch (error) {
    console.error('❌ Erreur lors de la suppression de l\'utilisateur:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Erreur lors de la suppression',
      },
      { status: 500 }
    );
  }
}
