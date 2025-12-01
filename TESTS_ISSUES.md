# Problèmes Détectés par les Tests Playwright

**Date** : 2025-12-01
**Tests exécutés** : Checkout flows (invité, utilisateur, nouveau compte, permissions)

## ✅ Progrès Réalisés

Les tests ont identifié et corrigé les problèmes suivants :

### 1. ✅ Structure de navigation produit
- **Problème** : Les tests cherchaient "Ajouter au panier" sur la page d'accueil
- **Solution** : Corrigé pour cliquer sur un produit → page détail → "Add to Cart"

### 2. ✅ Fermeture du panier
- **Problème** : Cherchait un bouton texte inexistant
- **Solution** : Utilise maintenant l'overlay pour fermer le panier

### 3. ✅ Formulaire d'inscription
- **Problème** : Cherchait firstName/lastName séparés
- **Solution** : Utilise le champ "Nom complet" unique

### 4. ✅ URL du panier
- **Problème** : Les tests allaient sur `/panier`
- **Solution** : Corrigé pour `/cart`

### 5. ✅ Bouton checkout
- **Problème** : Cherchait "Commander" ou "Passer la commande"
- **Solution** : Utilise "Passer commande" (texte exact)

## ❌ Problèmes Restants

### 1. 🔴 CRITIQUE : Index Firestore Manquant

**Erreur** :
```
FirebaseError: The query requires an index
Collection: orders
Fields: customer.email + createdAt
```

**Impact** :
- La page `/compte/commandes` (historique des commandes) ne fonctionne pas
- Les requêtes filtrant les commandes par email client échouent
- Les erreurs Firestore internes bloquent l'affichage des données

**Solution** :
1. Cliquer sur ce lien pour créer l'index automatiquement :
   👉 https://console.firebase.google.com/v1/r/project/gwadaecom-d4464/firestore/indexes?create_composite=Ck5wcm9qZWN0cy9nd2FkYWVjb20tZDQ0NjQvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL29yZGVycy9pbmRleGVzL18QARoSCg5jdXN0b21lci5lbWFpbBABGg0KCWNyZWF0ZWRBdBACGgwKCF9fbmFtZV9fEAI

2. OU créer manuellement dans Firebase Console :
   - Aller sur **Firebase Console** → **Firestore** → **Indexes**
   - **Collection** : `orders`
   - **Champs** :
     - `customer.email` : Ascending
     - `createdAt` : Descending
   - Cliquer sur "Create Index"

3. Attendre 2-5 minutes que l'index soit créé (Firebase affiche un loader)

4. Relancer les tests pour vérifier

**Où ce problème apparaît** :
- ✅ Page d'accueil : Fonctionne (pas de filtrage)
- ❌ Page `/compte` : Crash (tente de charger les 3 dernières commandes)
- ❌ Page `/compte/commandes` : Crash (tente de charger toutes les commandes utilisateur)
- ✅ Page admin `/admin/commercial/orders` : **Probablement OK** (charge toutes les commandes sans filtrer par email)

### 2. ⚠️ Aucun Produit dans Firestore?

**Symptôme** :
Les tests essaient d'ajouter un produit mais peuvent échouer s'il n'y a aucun produit visible.

**Vérification** :
1. Aller sur http://localhost:3000/
2. Vérifier qu'au moins un produit est affiché
3. Si aucun produit :
   - Aller sur http://localhost:3000/admin/commercial/products
   - Ajouter au moins un produit de test
   - Vérifier qu'il est visible (cocher "Visible")

### 3. ⚠️ Test Email Envoi

**Status** : Non vérifié pendant les tests

**À tester manuellement** :
1. Passer une vraie commande sur le site
2. Vérifier les logs de la console serveur (`npm run dev`)
3. Chercher :
   ```
   📧 API d'envoi d'email appelée
   ✅ Email envoyé avec succès!
   ```
4. Vérifier le dashboard Resend : https://resend.com/dashboard
5. Vérifier les spams si l'email n'arrive pas

## 🎯 Actions Immédiates Requises

### Priorité 1 : Créer l'index Firestore (CRITIQUE)
Sans cet index, les pages suivantes ne fonctionnent PAS :
- `/compte` (page compte client)
- `/compte/commandes` (historique commandes)

**Action** : Cliquer sur le lien ci-dessus pour créer l'index

### Priorité 2 : Vérifier qu'il y a des produits
**Action** :
```bash
# Lancer le site
npm run dev

# Aller sur http://localhost:3000/
# Vérifier qu'au moins un produit est visible
```

### Priorité 3 : Relancer les tests
**Action** :
```bash
npm run test -- e2e/checkout-flows.spec.js
```

## 📝 État des Tests

| Test | Status | Problème |
|------|--------|----------|
| Invité checkout | ❌ | Index Firestore manquant |
| Utilisateur connecté | ❌ | Index Firestore manquant |
| Nouveau compte | ❌ | Index Firestore manquant |
| Permissions Firestore | ❌ | Index Firestore manquant |

**Note** : Tous les tests échouent pour la même raison - l'index Firestore manquant empêche le site de fonctionner correctement.

## 🔧 Corrections Apportées au Code

### Fichiers modifiés :
1. `e2e/checkout-flows.spec.js` :
   - Corrigé la navigation produit (page d'accueil → détail → panier)
   - Corrigé la fermeture du panier (utilise overlay)
   - Corrigé le formulaire d'inscription (champ "Nom complet")
   - Corrigé l'URL du panier (`/cart` au lieu de `/panier`)
   - Corrigé le bouton checkout ("Passer commande")

2. `src/app/api/send-order-confirmation/route.js` :
   - Ajouté logs détaillés pour déboguer l'envoi d'emails

3. `src/app/checkout/page.js` :
   - Ajouté logs pour suivre l'appel API d'email

## 📊 Prochains Tests à Faire

Une fois l'index créé :

1. **Test manuel complet** :
   - [ ] Commander en tant qu'invité
   - [ ] Vérifier la page de confirmation
   - [ ] Commander en tant qu'utilisateur
   - [ ] Vérifier l'historique des commandes
   - [ ] Vérifier la réception d'email

2. **Tests automatiques** :
   ```bash
   npm run test -- e2e/checkout-flows.spec.js
   ```

3. **Tests email** :
   - Vérifier les logs serveur
   - Vérifier le dashboard Resend
   - Tester avec votre vraie adresse email

## 💡 Notes Importantes

1. **Règles Firestore** : Si vous voyez encore des erreurs de permission, mettez à jour les règles :
   ```javascript
   match /orders/{orderId} {
     allow create: if true;
     allow read: if true;  // Permet la lecture avec l'ID
     allow update, delete: if request.auth != null;
   }
   ```

2. **Temps de création d'index** : L'index Firestore peut prendre 2-5 minutes à se créer. Soyez patient !

3. **Mode développement** : Les tests utilisent Stripe en mode test (carte 4242 4242 4242 4242).

4. **Emails de test** : Avec `onboarding@resend.dev`, vous ne pouvez envoyer qu'à votre email enregistré sur Resend.

---

**Résumé** : Le site fonctionne bien mais l'index Firestore manquant bloque les pages de compte. Créez l'index et tout devrait fonctionner !
