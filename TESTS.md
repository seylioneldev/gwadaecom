# Guide des Tests E2E avec Playwright

Ce document explique comment exécuter et comprendre les tests end-to-end (E2E) de l'application e-commerce.

## 📋 Aperçu

Les tests Playwright vérifient les flux complets de commande dans trois contextes différents :
1. **Invité** : Utilisateur non connecté passant commande
2. **Utilisateur connecté** : Utilisateur existant avec compte
3. **Nouvel utilisateur** : Création de compte pendant le processus de commande

## 🚀 Prérequis

- Node.js installé
- Dependencies installées (`npm install`)
- Firebase configuré avec Firestore
- Stripe configuré en mode test
- Variables d'environnement configurées dans `.env.local`

## ▶️ Exécution des tests

### Tous les tests

```bash
npm test
```

### Tests en mode UI (interface graphique)

```bash
npm run test:ui
```

Cette commande ouvre une interface qui permet de :
- Voir les tests disponibles
- Exécuter les tests un par un
- Voir le navigateur en action
- Inspecter les étapes

### Tests en mode visible (headed)

```bash
npm run test:headed
```

Exécute les tests avec le navigateur visible (utile pour le débogage).

### Tests en mode debug

```bash
npm run test:debug
```

Ouvre le débogueur Playwright avec :
- Points d'arrêt
- Exécution pas à pas
- Inspection du DOM

### Voir le rapport de tests

```bash
npm run test:report
```

Ouvre le rapport HTML des derniers tests exécutés.

## 📝 Description des tests

### Test 1 : Commande en tant qu'invité

**Fichier** : `e2e/checkout-flows.spec.js`

**Ce que le test fait** :
1. Ajoute un produit au panier
2. Va sur la page de checkout
3. Remplit le formulaire invité (sans créer de compte)
4. Entre les informations de paiement Stripe (carte de test)
5. Soumet la commande
6. Vérifie la redirection vers la page de confirmation
7. Vérifie que les détails de la commande sont affichés
8. Vérifie que l'API d'envoi d'email est appelée

**Points de vérification** :
- ✅ Le formulaire invité fonctionne
- ✅ Le paiement Stripe est traité
- ✅ La commande est enregistrée dans Firestore
- ✅ La page de confirmation affiche les bonnes informations
- ✅ Pas d'erreurs de permission Firestore

### Test 2 : Commande utilisateur connecté

**Ce que le test fait** :
1. Se connecte avec un utilisateur existant
2. Ajoute un produit au panier
3. Va sur la page de checkout
4. Vérifie que l'email est pré-rempli
5. Remplit le reste du formulaire
6. Entre les informations de paiement Stripe
7. Soumet la commande
8. Vérifie la confirmation

**Points de vérification** :
- ✅ La connexion fonctionne
- ✅ Les informations utilisateur sont récupérées
- ✅ Le processus de commande fonctionne pour un utilisateur authentifié

**Note** : Ce test nécessite un utilisateur de test existant avec :
- Email : `test.user@example.com`
- Mot de passe : `TestPassword123!`

Vous pouvez soit créer ce compte manuellement, soit modifier le test avec vos propres identifiants.

### Test 3 : Commande avec création de compte

**Ce que le test fait** :
1. Ajoute un produit au panier
2. Va sur la page de checkout
3. Sélectionne "Créer un compte"
4. Remplit le formulaire complet avec mot de passe
5. Entre les informations de paiement Stripe
6. Soumet la commande
7. Vérifie que le compte est créé
8. Vérifie que l'utilisateur est automatiquement connecté

**Points de vérification** :
- ✅ La création de compte fonctionne pendant le checkout
- ✅ Le mot de passe est correctement enregistré
- ✅ L'utilisateur est automatiquement connecté après la commande
- ✅ La commande est bien associée au nouveau compte

### Test 4 : Vérification des permissions

**Ce que le test fait** :
1. Passe rapidement une commande invité
2. Capture toutes les erreurs console
3. Vérifie spécifiquement les erreurs Firestore
4. Échoue si des erreurs de permission sont détectées

**Points de vérification** :
- ✅ Pas d'erreur "Missing or insufficient permissions"
- ✅ Pas d'erreur FirebaseError sur la page de confirmation
- ✅ Les règles Firestore sont correctement configurées

## 🔍 Débogage des échecs de tests

### Problème : Tests échouent lors du paiement Stripe

**Causes possibles** :
- Le formulaire Stripe n'est pas chargé
- Les iframe Stripe sont bloquées
- Mauvaise configuration des clés Stripe

**Solution** :
1. Vérifiez que `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` est défini
2. Utilisez `npm run test:headed` pour voir ce qui se passe
3. Vérifiez la console pour les erreurs Stripe

### Problème : Erreurs de permission Firestore

**Causes possibles** :
- Les règles Firestore sont trop restrictives
- Les invités ne peuvent pas lire les commandes

**Solution** :
Mettez à jour vos règles Firestore :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /orders/{orderId} {
      allow create: if true;
      allow read: if true;  // Important : permet la lecture avec l'ID
      allow update, delete: if request.auth != null;
    }
  }
}
```

### Problème : Email API non appelée

**Causes possibles** :
- L'API route n'existe pas
- RESEND_API_KEY manquante
- Erreur dans le code de l'API

**Solution** :
1. Vérifiez les logs console côté serveur (`npm run dev`)
2. Cherchez les messages `📧 API d'envoi d'email appelée`
3. Vérifiez que `.env.local` contient `RESEND_API_KEY`
4. Testez l'API manuellement avec curl :

```bash
curl -X POST http://localhost:3000/api/send-order-confirmation \
  -H "Content-Type: application/json" \
  -d '{
    "orderData": {
      "orderId": "TEST123",
      "customer": {
        "email": "test@example.com",
        "firstName": "Test",
        "lastName": "User"
      },
      "items": [],
      "total": 100,
      "shippingAddress": {
        "address": "123 Test",
        "city": "Test",
        "postalCode": "97110",
        "country": "Guadeloupe"
      }
    }
  }'
```

### Problème : Utilisateur de test non trouvé (Test 2)

**Solution** :
Créez l'utilisateur de test :
1. Allez sur `/mon-compte`
2. Créez un compte avec :
   - Email : `test.user@example.com`
   - Mot de passe : `TestPassword123!`
   - Prénom : Jean
   - Nom : Dupont

Ou modifiez le test pour utiliser un compte existant.

## 📊 Interprétation des résultats

### Tous les tests passent ✅

Félicitations ! Votre application fonctionne correctement dans tous les contextes.

### Tests invité passent, mais pas utilisateur connecté ⚠️

**Problème** : L'authentification ou la récupération des données utilisateur a un problème.

**À vérifier** :
- Firebase Auth configuré
- Context d'authentification fonctionne
- Pré-remplissage des formulaires

### Test de permissions échoue ❌

**Problème** : Les règles Firestore sont trop restrictives.

**Solution** : Voir section "Erreurs de permission Firestore" ci-dessus.

### Email API non appelée dans tous les tests ⚠️

**Problème** : L'appel à l'API d'envoi d'email ne se fait pas.

**À vérifier** :
1. Console du serveur Next.js pour les logs `📧`
2. Onglet Network dans les DevTools pour voir si la requête est faite
3. Erreurs JavaScript qui empêchent l'appel

## 🐛 Logs et débogage

### Logs utiles pendant les tests

Les tests affichent des logs colorés :
- `📦` : Ajout de produit au panier
- `🛒` : Navigation vers checkout
- `📝` : Remplissage de formulaire
- `💳` : Paiement Stripe
- `✅` : Soumission réussie
- `📧` : Email API
- `⏳` : Attente de confirmation
- `❌` : Erreurs

### Activer les logs Playwright

Dans `playwright.config.js`, ajoutez :

```javascript
use: {
  trace: 'on',  // Active les traces pour tous les tests
  video: 'on',  // Enregistre des vidéos
}
```

### Voir les screenshots d'échec

Les screenshots sont automatiquement pris en cas d'échec et sauvegardés dans :
```
test-results/
```

## 📈 CI/CD

Les tests peuvent être exécutés en CI avec :

```bash
CI=true npm test
```

En mode CI :
- Les tests sont réessayés 2 fois en cas d'échec
- Un seul worker est utilisé (séquentiel)
- Les traces sont activées automatiquement

## 🔐 Variables d'environnement pour les tests

Assurez-vous que `.env.local` contient :

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Stripe (mode test)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Resend
RESEND_API_KEY=re_...
```

## 📚 Ressources

- [Documentation Playwright](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Stripe Testing](https://docs.stripe.com/testing)
- [Firebase Emulator](https://firebase.google.com/docs/emulator-suite) (optionnel pour tests locaux)

## ✅ Checklist avant commit

- [ ] Tous les tests passent localement
- [ ] Pas d'erreurs de permission Firestore
- [ ] Email API est appelée (vérifier les logs)
- [ ] Test utilisateur connecté passe (créer compte de test si nécessaire)
- [ ] Screenshots d'échec vérifiés (si échecs)

---

**Date de création** : 2025-12-01
**Version Playwright** : 1.57.0
**Version Next.js** : 16.0.5
