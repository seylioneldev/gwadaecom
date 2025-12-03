# 🔥 Configuration Firebase Admin SDK

Ce guide explique comment configurer Firebase Admin SDK pour permettre la suppression complète des comptes utilisateurs (libération de l'email pour réinscription).

---

## ⚠️ Pourquoi c'est nécessaire ?

Lorsqu'un admin supprime un compte utilisateur :
1. ✅ Le compte est **soft deleted** dans Firestore (données conservées)
2. ✅ L'email est libéré en **supprimant** le compte de Firebase Auth
3. ✅ L'utilisateur peut **se réinscrire** avec le même email
4. ✅ Si l'utilisateur se réinscrit, son ancien compte Firestore peut être automatiquement restauré

Sans Firebase Admin SDK, l'email reste bloqué dans Firebase Auth et l'utilisateur ne peut pas se réinscrire.

---

## 📋 Étapes de configuration

### 1. Générer une clé privée Firebase Admin

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez votre projet **GwadaEcom**
3. Cliquez sur l'engrenage ⚙️ → **Project Settings**
4. Allez dans l'onglet **Service Accounts**
5. Cliquez sur **Generate New Private Key**
6. Confirmez en cliquant sur **Generate Key**
7. Un fichier JSON sera téléchargé (gardez-le **SECRET** !)

### 2. Extraire les variables d'environnement

Ouvrez le fichier JSON téléchargé. Il ressemble à ceci :

```json
{
  "type": "service_account",
  "project_id": "gwadaecom-xxxxx",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBA...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@gwadaecom-xxxxx.iam.gserviceaccount.com",
  "client_id": "123456789",
  ...
}
```

Vous aurez besoin de ces 3 valeurs :
- `project_id`
- `client_email`
- `private_key`

### 3. Ajouter les variables dans `.env.local`

Créez ou modifiez le fichier `.env.local` à la racine du projet :

```bash
# Firebase Admin SDK (pour suppression de comptes)
FIREBASE_ADMIN_PROJECT_ID=votre-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@votre-projet.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBA...\n-----END PRIVATE KEY-----\n"
```

⚠️ **IMPORTANT** :
- Mettez la `private_key` entre **guillemets doubles**
- Conservez les `\n` (sauts de ligne)
- Ne committez **JAMAIS** ce fichier dans Git (il est déjà dans `.gitignore`)

### 4. Vérifier que `.env.local` est dans `.gitignore`

Assurez-vous que votre fichier `.gitignore` contient :

```
.env.local
.env*.local
```

### 5. Redémarrer le serveur de développement

Après avoir ajouté les variables d'environnement, redémarrez le serveur :

```bash
npm run dev
```

---

## ✅ Vérification de la configuration

Pour vérifier que Firebase Admin SDK est bien configuré :

1. Démarrez le serveur : `npm run dev`
2. Vérifiez les logs dans le terminal :
   - ✅ Vous devriez voir : **"✅ Firebase Admin SDK initialisé avec succès"**
   - ❌ Si vous voyez un warning, vérifiez vos variables d'environnement

---

## 🧪 Test de la suppression de compte

1. Allez sur `/admin/users`
2. Supprimez un compte test
3. Vérifiez dans la console du navigateur :
   - ✅ `"✅ Compte supprimé de Firebase Auth - L'email est maintenant disponible"`
4. Essayez de créer un nouveau compte avec le même email
   - ✅ L'inscription devrait fonctionner
   - ✅ L'ancien compte Firestore sera automatiquement restauré

---

## 🔒 Sécurité

- ✅ L'API `/api/admin/delete-auth-user` vérifie que l'utilisateur est admin
- ✅ Seuls les admins authentifiés peuvent supprimer des comptes
- ✅ Le token Firebase est vérifié à chaque requête
- ✅ Les credentials admin ne sont **jamais** exposés au client

---

## 🐛 Dépannage

### Erreur : "Firebase Admin SDK non configuré"

**Cause** : Variables d'environnement manquantes ou incorrectes

**Solution** :
1. Vérifiez que `.env.local` existe à la racine du projet
2. Vérifiez que les 3 variables commencent par `FIREBASE_ADMIN_`
3. Redémarrez le serveur (`npm run dev`)

### Erreur : "Token invalide"

**Cause** : L'utilisateur qui tente de supprimer n'est pas admin

**Solution** :
1. Vérifiez que vous êtes connecté en tant qu'admin
2. Vérifiez votre rôle dans Firestore (collection `users`, champ `role` = `"admin"`)

### L'utilisateur ne peut toujours pas se réinscrire

**Cause** : Firebase Auth n'a pas été supprimé

**Solution** :
1. Vérifiez les logs de la console (F12)
2. Si vous voyez "⚠️ Échec de la suppression Firebase Auth", vérifiez la configuration Admin SDK
3. Vérifiez Firebase Console → Authentication → Users (le compte doit avoir disparu)

---

## 📚 Ressources

- [Documentation Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Gestion des utilisateurs avec Admin SDK](https://firebase.google.com/docs/auth/admin/manage-users)

---

## 🎯 Récapitulatif du flux de suppression

```
Admin clique sur "Supprimer"
    ↓
softDeleteUser() appelé
    ↓
1. Firestore mis à jour (soft delete)
   - status: 'deleted'
   - originalEmail conservé
   - email anonymisé
    ↓
2. API /api/admin/delete-auth-user appelée
   - Vérification admin
   - Suppression Firebase Auth
    ↓
✅ Email libéré pour réinscription

Si l'utilisateur se réinscrit :
    ↓
signUp() détecte un compte supprimé
    ↓
Restaure automatiquement l'ancien compte Firestore
    ↓
✅ Historique préservé
```

---

**Dernière mise à jour** : 2025-12-01
