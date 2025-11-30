# 🧪 Guide de Test - Paiement Stripe

## ✅ Installation Terminée !

L'intégration Stripe est maintenant complète et prête à être testée.

---

## 🚀 Démarrer le Serveur

Votre serveur de développement est déjà en cours d'exécution sur :
- **URL locale :** http://localhost:3001
- **URL réseau :** http://192.168.1.13:3001

Si vous devez redémarrer le serveur :
```bash
npm run dev
```

---

## 🧭 Étapes pour Tester le Paiement

### 1️⃣ Ajouter des Produits au Panier

1. Allez sur **http://localhost:3001**
2. Cliquez sur un produit
3. Cliquez sur **"Ajouter au panier"**
4. Répétez pour avoir plusieurs articles (optionnel)

### 2️⃣ Accéder au Panier

1. Cliquez sur l'icône **panier** dans le header
2. OU allez directement sur **http://localhost:3001/cart**
3. Vérifiez vos articles
4. Cliquez sur **"Passer commande"**

### 3️⃣ Remplir les Informations de Livraison

Vous avez 3 options :

#### Option A : Invité (Recommandé pour tester)
1. Cliquez sur **"Continuer en tant qu'invité"**
2. Remplissez le formulaire :
   - **Email :** test@example.com
   - **Prénom :** Jean
   - **Nom :** Dupont
   - **Adresse :** 123 Rue de Test
   - **Ville :** Paris
   - **Code postal :** 75001
   - **Pays :** France
   - **Téléphone :** (optionnel)
3. Cliquez sur **"Procéder au paiement"**

#### Option B : Connexion
1. Cliquez sur **"J'ai déjà un compte"**
2. Connectez-vous avec vos identifiants
3. Les informations seront pré-remplies

#### Option C : Inscription
1. Cliquez sur **"Créer un compte"**
2. Créez un nouveau compte
3. Remplissez les informations de livraison

### 4️⃣ Effectuer le Paiement

Une fois sur la page de paiement, vous verrez :
- **Récapitulatif de vos informations** (avec bouton "Modifier")
- **Formulaire de paiement Stripe**

#### 🔐 Cartes de Test Stripe

Utilisez ces numéros de carte **fictifs** fournis par Stripe :

**✅ Paiement Réussi :**
- **Numéro :** `4242 4242 4242 4242`
- **Date :** N'importe quelle date future (ex: `12/34`)
- **CVC :** N'importe quel 3 chiffres (ex: `123`)
- **Code postal :** N'importe lequel (ex: `75001`)

**❌ Paiement Refusé (pour tester les erreurs) :**
- **Numéro :** `4000 0000 0000 0002`
- **Date :** `12/34`
- **CVC :** `123`

**🔐 Authentification 3D Secure Requise :**
- **Numéro :** `4000 0025 0000 3155`
- **Date :** `12/34`
- **CVC :** `123`

Plus de cartes de test : https://docs.stripe.com/testing

### 5️⃣ Confirmer le Paiement

1. Remplissez le formulaire avec une **carte de test**
2. Cliquez sur **"Payer $XX.XX"**
3. Attendez quelques secondes (traitement)
4. Vous serez redirigé vers la **page de confirmation** 🎉

---

## ✅ Page de Confirmation

Après un paiement réussi, vous verrez :
- ✅ **Icône de succès** (cercle vert)
- 📦 **Numéro de commande** (basé sur le Payment Intent ID)
- 📧 **Prochaines étapes** (email, préparation, livraison)
- 🔗 **Boutons** : Retour à l'accueil / Voir mes commandes

---

## 🔍 Vérifier le Paiement dans Stripe

1. Allez sur votre **Stripe Dashboard** : https://dashboard.stripe.com/test/payments
2. Vous verrez tous les paiements de test effectués
3. Cliquez sur un paiement pour voir les détails :
   - Montant
   - Email du client
   - Numéro de commande (dans les métadonnées)
   - Statut du paiement

---

## 🛠️ En Cas de Problème

### Erreur : "Unable to acquire lock"
Le serveur de développement est déjà en cours. Pas de problème, utilisez le serveur existant.

### Erreur : "Missing or insufficient permissions" (Firestore)
Les commandes ne sont pas encore enregistrées dans Firestore. C'est normal, cette fonctionnalité sera ajoutée ensuite.

### Erreur : "Stripe is not defined"
Vérifiez que votre fichier `.env.local` contient bien :
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

Redémarrez le serveur après modification du `.env.local`.

### Le formulaire de paiement ne s'affiche pas
1. Ouvrez la console du navigateur (F12)
2. Vérifiez s'il y a des erreurs
3. Assurez-vous que les clés Stripe sont correctes dans `.env.local`

---

## 📊 Tests Automatisés

Pour exécuter les tests Playwright :
```bash
npm run test
```

**Note :** Certains tests peuvent échouer car ils ne sont pas encore adaptés au nouveau flux de paiement. C'est normal, nous les mettrons à jour ensuite.

---

## 🎯 Prochaines Étapes (TODO)

Après avoir testé et validé le paiement, voici ce qui reste à faire :

1. **Enregistrer les commandes dans Firestore**
   - Collection `orders` avec les détails de chaque commande
   - Lier les commandes aux utilisateurs (invités et enregistrés)

2. **Afficher l'historique des commandes**
   - Page `/compte` pour les utilisateurs
   - Page `/admin/commercial/commandes` pour les admins

3. **Envoyer des emails de confirmation**
   - Avec SendGrid, Mailgun ou Firebase Extensions

4. **Mettre à jour les tests Playwright**
   - Adapter les tests au nouveau flux de checkout

5. **Mode Production**
   - Remplacer les clés de test par les clés de production Stripe
   - Tester avec de vraies cartes en mode Live

---

## ✨ Félicitations !

Vous avez maintenant un système de paiement Stripe fonctionnel ! 🎉

**Points clés :**
- ✅ Paiements sécurisés avec Stripe
- ✅ Support des invités et utilisateurs enregistrés
- ✅ Interface utilisateur intuitive
- ✅ Page de confirmation professionnelle
- ✅ Mode test sans risque

**N'hésitez pas à tester avec différentes cartes de test pour voir les différents cas de figure !**
