# Guide d'Authentification Admin - Firebase Auth

Guide complet pour configurer l'authentification administrateur avec Firebase.

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Configuration Firebase](#configuration-firebase)
3. [Créer votre premier compte admin](#créer-votre-premier-compte-admin)
4. [Se connecter](#se-connecter)
5. [Sécurité](#sécurité)
6. [Dépannage](#dépannage)

---

## 🎯 Vue d'ensemble

Le système d'authentification admin permet de :
- ✅ Protéger l'accès au dashboard admin
- ✅ Afficher le bouton flottant uniquement aux admins
- ✅ Gérer plusieurs comptes admin
- ✅ Déconnecter en toute sécurité

### Fichiers créés

- `src/context/AuthContext.jsx` - Contexte d'authentification
- `src/app/admin/login/page.js` - Page de connexion
- `src/app/admin/setup/page.js` - Page de création de compte (temporaire)
- `src/components/AdminFloatingButton.jsx` - Bouton flottant (modifié)
- `src/app/layout.js` - Layout avec AuthProvider (modifié)

---

## 🔧 Configuration Firebase

### Étape 1 : Activer Firebase Auth

1. Allez sur [Firebase Console](https://console.firebase.google.com)
2. Sélectionnez votre projet
3. Dans le menu latéral : **Authentication** → **Get Started**
4. Cliquez sur **Sign-in method**
5. Activez **Email/Password**
6. Cliquez sur **Save**

![Firebase Auth](https://i.imgur.com/example.png)

### Étape 2 : Configurer les emails admin

Ouvrez `src/context/AuthContext.jsx` et modifiez la ligne 42 :

```javascript
const ADMIN_EMAILS = [
  'votre-email@admin.com', // 👈 Remplacez par VOTRE email
  // 'autre-admin@example.com', // Ajoutez d'autres admins ici
];
```

**Options alternatives :**

**Option A : Variable d'environnement (recommandé)**
```env
# Dans .env.local
NEXT_PUBLIC_ADMIN_EMAILS=admin@example.com,admin2@example.com
```

Puis dans `AuthContext.jsx` :
```javascript
const ADMIN_EMAILS = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || [];
```

**Option B : Stockage dans Firestore (avancé)**
Créez une collection `settings` avec un document `admins` contenant la liste.

---

## 👤 Créer votre premier compte admin

### Méthode 1 : Via la page de setup (recommandé)

1. **Démarrez le serveur de développement**
   ```bash
   npm run dev
   ```

2. **Accédez à la page de setup**
   ```
   http://localhost:3000/admin/setup
   ```

3. **Remplissez le formulaire**
   - Email : L'email que vous avez ajouté dans `ADMIN_EMAILS`
   - Mot de passe : Minimum 6 caractères
   - Confirmation du mot de passe

4. **Cliquez sur "Créer le compte"**

5. **🚨 IMPORTANT : Supprimez la page de setup**
   ```bash
   rm -rf src/app/admin/setup
   # Ou sur Windows :
   # del /s /q src\app\admin\setup
   ```

### Méthode 2 : Via Firebase Console

1. Allez sur [Firebase Console](https://console.firebase.google.com)
2. **Authentication** → **Users**
3. Cliquez sur **Add user**
4. Entrez :
   - Email : Votre email admin
   - Password : Votre mot de passe (min. 6 caractères)
5. Cliquez sur **Add user**

---

## 🔐 Se connecter

### Accès à la page de connexion

```
http://localhost:3000/admin/login
```

### Processus de connexion

1. Entrez votre email et mot de passe
2. Cliquez sur **Se connecter**
3. Vous serez redirigé vers `/admin`

### Vérifier que vous êtes connecté

Le **bouton flottant admin** apparaîtra en bas à droite de la page d'accueil :
- ✅ Visible si vous êtes connecté comme admin
- ✅ Visible en mode développement (pour faciliter le dev)
- ❌ Invisible pour les utilisateurs non-admin

---

## 🛡️ Sécurité

### Niveau de sécurité actuel

**Ce qui est protégé :**
- ✅ Connexion requise pour afficher le bouton admin
- ✅ Seuls les emails dans `ADMIN_EMAILS` peuvent se connecter
- ✅ Mot de passe hashé par Firebase (bcrypt)

**Ce qui N'est PAS protégé (à faire) :**
- ❌ Les routes `/admin/*` sont accessibles directement
- ❌ Pas de middleware de protection côté serveur

### Prochaines étapes de sécurité

**1. Protéger les routes admin côté serveur**

Créez un middleware Next.js pour vérifier l'authentification :

```javascript
// middleware.js (à la racine)
import { NextResponse } from 'next/server';

export function middleware(request) {
  // Vérifier si l'utilisateur est authentifié
  const token = request.cookies.get('auth-token');

  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
```

**2. Utiliser Firebase Admin SDK**

Pour une vraie protection côté serveur, utilisez Firebase Admin SDK pour vérifier les tokens.

**3. Ajouter un rôle dans Firestore**

Au lieu de hardcoder les emails, stockez les rôles dans Firestore :

```javascript
// Collection : users
{
  email: 'admin@example.com',
  role: 'admin',
  createdAt: timestamp
}
```

### Bonnes pratiques

✅ **À FAIRE :**
- Utiliser des mots de passe forts (12+ caractères)
- Activer l'authentification à deux facteurs (2FA) dans Firebase
- Supprimer la page `/admin/setup` après utilisation
- Utiliser HTTPS en production
- Ne jamais committer les mots de passe

❌ **À NE PAS FAIRE :**
- Laisser la page de setup accessible en production
- Partager vos identifiants admin
- Utiliser le même mot de passe partout
- Stocker les mots de passe en clair

---

## 🐛 Dépannage

### Problème 1 : "Accès refusé : vous n'êtes pas administrateur"

**Cause :** Votre email n'est pas dans `ADMIN_EMAILS`

**Solution :**
1. Ouvrez `src/context/AuthContext.jsx`
2. Ligne 42, ajoutez votre email :
   ```javascript
   const ADMIN_EMAILS = [
     'votre-email@example.com', // 👈 Votre email ici
   ];
   ```
3. Redémarrez le serveur : `npm run dev`

### Problème 2 : "Email ou mot de passe incorrect"

**Causes possibles :**
- Email ou mot de passe incorrect (vérifiez la casse)
- Compte pas encore créé dans Firebase

**Solution :**
1. Vérifiez dans Firebase Console → Authentication → Users
2. Si le compte n'existe pas, créez-le via `/admin/setup`

### Problème 3 : "auth is not defined"

**Cause :** Firebase Auth n'est pas initialisé correctement

**Solution :**
1. Vérifiez que `src/lib/firebase.js` exporte `auth`
2. Ajoutez cette ligne si elle manque :
   ```javascript
   import { getAuth } from 'firebase/auth';
   export const auth = getAuth(app);
   ```

### Problème 4 : Le bouton flottant ne s'affiche pas

**Vérifications :**
1. Êtes-vous connecté ? → Allez sur `/admin/login`
2. Votre email est-il dans `ADMIN_EMAILS` ?
3. Êtes-vous en mode développement ? (`npm run dev`)

**Mode debug :**
```javascript
// Dans AdminFloatingButton.jsx, ajoutez :
console.log('isAdmin:', isAdmin);
console.log('isDev:', isDev);
console.log('isVisible:', isVisible);
```

### Problème 5 : "Cannot read property 'signIn' of undefined"

**Cause :** `useAuth()` est utilisé hors du `AuthProvider`

**Solution :**
Vérifiez que `<AuthProvider>` enveloppe votre app dans `layout.js`

---

## 📚 Utilisation avancée

### Déconnexion

Ajoutez un bouton de déconnexion dans le dashboard admin :

```javascript
import { useAuth } from '@/context/AuthContext';

export default function AdminPage() {
  const { user, signOut } = useAuth();

  return (
    <div>
      <p>Connecté en tant que {user?.email}</p>
      <button onClick={signOut}>Déconnexion</button>
    </div>
  );
}
```

### Vérifier si un utilisateur est admin

```javascript
import { useAuth } from '@/context/AuthContext';

export default function MonComposant() {
  const { isAdmin, loading } = useAuth();

  if (loading) return <p>Chargement...</p>;
  if (!isAdmin) return <p>Accès refusé</p>;

  return <div>Contenu admin</div>;
}
```

### Rediriger les non-admins

```javascript
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedPage() {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/admin/login');
    }
  }, [isAdmin, loading, router]);

  if (loading) return <p>Chargement...</p>;
  if (!isAdmin) return null;

  return <div>Contenu protégé</div>;
}
```

---

## 🎉 Résumé des étapes

1. ✅ Activer Firebase Auth (Email/Password)
2. ✅ Configurer `ADMIN_EMAILS` dans `AuthContext.jsx`
3. ✅ Créer votre compte admin via `/admin/setup`
4. ✅ Supprimer la page `/admin/setup`
5. ✅ Se connecter sur `/admin/login`
6. ✅ Vérifier que le bouton flottant apparaît

---

## 🔗 Ressources

- [Documentation Firebase Auth](https://firebase.google.com/docs/auth)
- [Next.js Authentication](https://nextjs.org/docs/authentication)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)

---

**Besoin d'aide ?** Consultez la section [Dépannage](#dépannage) ou créez une issue sur GitHub.
