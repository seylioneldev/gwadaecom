# Rapport des Tests - GwadaEcom

**Date** : 2025-12-01 (Mise à jour)
**Tests exécutés** : Checkout flows + Admin + Navigation + Panier

---

## ✅ Progrès Réalisés

### Corrections apportées au code de checkout

#### 1. ✅ Structure de la page checkout corrigée
- **Problème initial** : Les tests cherchaient des radio buttons qui n'existaient pas
- **Solution** : Mise à jour des tests pour cliquer sur les boutons "Continuer en tant qu'invité", "J'ai déjà un compte", et "Créer un compte"

#### 2. ✅ Attributs `name` ajoutés aux formulaires
- **Problème** : Les champs input n'avaient pas d'attributs `name`, rendant impossible la sélection par Playwright
- **Solution** : Ajout des attributs `name` à tous les champs :
  - Formulaire invité : `email`, `firstName`, `lastName`, `address`, `city`, `postalCode`, `country`, `phone`
  - Formulaire inscription : `firstName`, `lastName`, `email`, `password`, `confirmPassword`

#### 3. ✅ Bouton "Procéder au paiement" ajouté aux tests
- **Problème** : Les tests attendaient directement le formulaire Stripe sans cliquer sur le bouton de soumission
- **Solution** : Ajout du clic sur "Procéder au paiement" dans tous les tests

#### 4. ✅ Formulaire de création de compte
- **Problème** : Après inscription, le formulaire de livraison n'était pas complètement rempli
- **Solution** : Ajout de la vérification et du remplissage des champs `firstName` et `lastName` après l'inscription

#### 5. ✅ Index Firestore créé
- **Problème** : L'index `customer.email + createdAt` manquait
- **Solution** : Index créé manuellement dans la Firebase Console

---

## ❌ Problèmes Restants

### 1. 🔴 CRITIQUE - Formulaire Stripe Payment Element

**Status** : En cours de résolution
**Impact** : Bloque tous les tests de checkout à l'étape du paiement

**Erreur** :
```
Error: Impossible de trouver l'iframe du numéro de carte Stripe
```

**Analyse** :
- Le composant utilise `PaymentElement` de Stripe (pas des champs séparés)
- Le Payment Element crée des iframes avec une structure différente
- Les sélecteurs `[name="number"]`, `[name="expiry"]`, `[name="cvc"]` ne fonctionnent pas
- Les iframes Stripe chargées :
  - `elements-inner-payment` : iframe principale du Payment Element
  - `elements-inner-easel` : iframe pour l'UI Stripe
  - Plusieurs iframes de tracking Stripe (`m-outer`, `controller`, etc.)

**Tentatives effectuées** :
- Recherche de `[name="number"]` dans toutes les frames → échec
- Recherche de `[placeholder="Card number"]` → échec
- Recherche dynamique dans toutes les iframes → les champs ne sont pas trouvables avec ces sélecteurs

**Solutions possibles** :
1. **Option A** : Utiliser l'API de test Stripe pour bypasser l'UI
   - Créer directement un PaymentIntent confirmed via l'API
   - Avantage : Tests plus rapides et fiables
   - Inconvénient : Ne teste pas vraiment l'UI Stripe

2. **Option B** : Utiliser des sélecteurs CSS/XPath plus génériques
   - Chercher les iframes Stripe par leur URL
   - Utiliser des sélecteurs plus larges (input[type="text"], etc.)
   - Avantage : Teste vraiment l'UI
   - Inconvénient : Très fragile, peut casser avec les mises à jour Stripe

3. **Option C** : Tester uniquement jusqu'à l'affichage du formulaire Stripe
   - Vérifier que le Payment Element se charge
   - Ne pas tester la saisie réelle
   - Avantage : Simple et stable
   - Inconvénient : Ne teste pas le flow complet

**Recommandation** : **Option C** pour les tests E2E + tests manuels pour le paiement

---

### 2. ⚠️ MOYEN - Test utilisateur connecté échoue

**Status** : À investiguer
**Impact** : 1 test sur 4 échoue

**Erreur** :
```
Error: expect(locator).toBeVisible() failed
Locator: locator('text=/Jean/i')
```

**Problème** :
- La création du compte sur `/mon-compte` ne redirige pas vers `/compte`
- Le prénom de l'utilisateur n'est pas affiché après inscription
- Cela empêche la vérification de la connexion

**À vérifier** :
1. La page `/mon-compte` redirige-t-elle correctement après inscription ?
2. Le `displayName` est-il bien sauvegardé dans Firebase Auth ?
3. La page `/compte` affiche-t-elle le nom de l'utilisateur ?

---

## 📊 État des Tests

| Catégorie | Tests | Passés | Échoués | Status |
|-----------|-------|--------|---------|--------|
| Admin - Produits | 6 | 6 | 0 | ✅ |
| Admin - Catégories | 5 | 5 | 0 | ✅ |
| Navigation | 9 | 9 | 0 | ✅ |
| Panier | 2 | 2 | 0 | ✅ |
| Checkout - Invité | 1 | 0 | 1 | ❌ Stripe |
| Checkout - Connecté | 1 | 0 | 1 | ❌ Inscription |
| Checkout - Nouveau compte | 1 | 0 | 1 | ❌ Stripe |
| Checkout - Permissions | 1 | 0 | 1 | ❌ Stripe |
| **TOTAL** | **26** | **22** | **4** | **85%** |

---

## 🎯 Actions Prioritaires

### Priorité 1 : Résoudre le problème Stripe
**Options** :
- [ ] **Option recommandée** : Modifier les tests pour vérifier seulement que le Payment Element se charge
  - Modifier `fillStripePaymentForm` pour retirer la saisie des champs
  - Ajouter simplement une vérification que l'iframe Stripe est visible
  - Documenter que le paiement doit être testé manuellement

OU

- [ ] **Option alternative** : Créer un mock Stripe pour les tests
  - Remplacer temporairement Stripe par un faux formulaire en mode test
  - Avantage : Tester tout le flow sans dépendre de Stripe
  - Inconvénient : Nécessite du code supplémentaire

### Priorité 2 : Corriger le test utilisateur connecté
- [ ] Vérifier la redirection après inscription sur `/mon-compte`
- [ ] Vérifier que le displayName est bien sauvegardé
- [ ] Tester manuellement le flow de création de compte

### Priorité 3 : Validation manuelle
- [ ] Tester manuellement une commande invité
- [ ] Tester manuellement une commande utilisateur
- [ ] Vérifier la réception des emails
- [ ] Vérifier l'affichage des commandes dans `/compte/commandes`

---

## 💡 Recommandations

### Tests E2E
Les tests de checkout devraient être divisés en deux catégories :

1. **Tests automatisés (E2E)** :
   - Navigation et formulaires
   - Validation des champs
   - Affichage du Payment Element Stripe
   - Gestion des erreurs de validation
   → Ces tests sont stables et fiables

2. **Tests manuels** :
   - Saisie réelle dans Stripe
   - Paiement complet
   - Confirmation de commande
   - Réception d'email
   → Ces tests nécessitent une intervention humaine

### Alternatives pour automatiser le paiement

Si vraiment nécessaire d'automatiser le paiement :

1. **Utiliser l'API Stripe directement** :
   ```javascript
   // Créer un PaymentIntent confirmé directement
   const paymentIntent = await stripe.paymentIntents.create({
     amount: 5000,
     currency: 'eur',
     payment_method: 'pm_card_visa', // Carte de test Stripe
     confirm: true,
   });
   ```

2. **Utiliser Stripe Testing Mode avec auto-confirmation** :
   - Configurer Stripe pour auto-confirmer les paiements en mode test
   - Avantage : Pas besoin de remplir le formulaire
   - Inconvénient : Ne teste pas l'UI

---

## 📝 Fichiers Modifiés

1. **src/app/checkout/page.js** :
   - Ajout des attributs `name` aux inputs (email, firstName, lastName, etc.)
   - Correction des formulaires invité, connexion, et inscription

2. **e2e/checkout-flows.spec.js** :
   - Mise à jour des tests pour cliquer sur les boutons de choix
   - Ajout du clic sur "Procéder au paiement"
   - Ajout du remplissage complet après création de compte
   - Tentative de mise à jour de `fillStripePaymentForm` (non terminée)

3. **Firebase Console** :
   - Création de l'index `customer.email + createdAt` pour la collection `orders`

---

## 🔗 Ressources

- Documentation Stripe Payment Element : https://docs.stripe.com/payments/payment-element
- Guide Testing Stripe : https://docs.stripe.com/testing
- Playwright Testing Iframes : https://playwright.dev/docs/frames

---

**Prochaine étape recommandée** : Implémenter l'Option C (tests jusqu'au chargement de Stripe uniquement) pour avoir des tests E2E stables à 100%.
