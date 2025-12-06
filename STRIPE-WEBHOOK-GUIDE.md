# 🔗 Configuration du Webhook Stripe - Guide Détaillé

> **Guide complet pour configurer le webhook Stripe en mode test**

---

## 📋 Pourquoi un Webhook ?

Un webhook permet à Stripe d'informer votre site lorsqu'un événement se produit (paiement réussi/échoué).

**Sans webhook** :
- ❌ Commandes restent en statut `pending`
- ❌ Pas de mise à jour automatique

**Avec webhook** :
- ✅ Mise à jour automatique du statut (`pending` → `paid`)
- ✅ Gestion des paiements échoués
- ✅ Synchronisation Stripe ↔ Firestore

---

## 🚀 Configuration en 5 Minutes

### Étape 1 : Accéder à Stripe Dashboard

1. [dashboard.stripe.com](https://dashboard.stripe.com)
2. **Basculez en mode TEST** (toggle en haut à droite)
3. Menu → **Developers** → **Webhooks**

### Étape 2 : Créer le Webhook

1. Cliquez sur **"+ Add endpoint"**
2. **Endpoint URL** : `https://VOTRE-SITE.vercel.app/api/webhooks/stripe`
   - Remplacez `VOTRE-SITE` par votre URL Vercel
   - Exemple : `https://gwadaecom.vercel.app/api/webhooks/stripe`
3. **Description** : `GwadaEcom - Webhook production (mode test)`

### Étape 3 : Sélectionner les Événements

Cochez ces événements uniquement :
- ✅ `payment_intent.succeeded`
- ✅ `payment_intent.payment_failed`

(Optionnel : `charge.succeeded` et `charge.failed`)

### Étape 4 : Récupérer le Signing Secret

1. Cliquez sur **"Add endpoint"**
2. Section **"Signing secret"** → **"Reveal"**
3. **Copiez le secret** (commence par `whsec_...`)

⚠️ **IMPORTANT** : Ce secret est différent de celui en local !

### Étape 5 : Mettre à Jour Vercel

1. Dashboard Vercel → Votre projet → **Settings** → **Environment Variables**
2. Trouvez `STRIPE_WEBHOOK_SECRET` → **Éditez**
3. Collez le **nouveau** secret Stripe
4. **Save**
5. **Redéployez** le site : Deployments → Redeploy

⚠️ Les variables ne sont appliquées qu'après redéploiement !

---

## ✅ Tester le Webhook

### Test avec un paiement réel

1. Site Vercel → Ajoutez un produit au panier
2. Passez commande avec carte **4242 4242 4242 4242**
3. Vérifiez :
   - ✅ Redirection vers page de confirmation
   - ✅ Commande en statut `paid` dans Firestore
   - ✅ Email de confirmation reçu

### Vérifier dans Stripe Dashboard

1. [dashboard.stripe.com/test/webhooks](https://dashboard.stripe.com/test/webhooks)
2. Cliquez sur votre webhook
3. Onglet **"Events"**
4. Vous devez voir des événements avec statut **"Succeeded"** (vert)

---

## 🐛 Dépannage

### Webhook en erreur (Failed)

**Causes** :
- URL incorrecte (vérifiez qu'elle finit par `/api/webhooks/stripe`)
- Signing Secret incorrect
- Site Vercel pas redéployé après modification

**Solutions** :
1. Éditez le webhook dans Stripe et corrigez l'URL
2. Mettez à jour `STRIPE_WEBHOOK_SECRET` sur Vercel
3. Redéployez le site

### Commandes restent en "pending"

**Cause** : Webhook pas configuré ou Signing Secret incorrect

**Solution** :
1. Vérifiez que le webhook existe dans Stripe
2. Vérifiez que `STRIPE_WEBHOOK_SECRET` correspond au secret Stripe
3. Redéployez le site
4. Refaites un paiement test

### Erreur 401 (Unauthorized)

**Cause** : Signing Secret incorrect

**Solution** :
1. Révélez le secret dans Stripe Dashboard
2. Copiez-le exactement
3. Mettez à jour sur Vercel
4. Redéployez

### Erreur 404 (Not Found)

**Cause** : URL incorrecte

**Solution** :
Vérifiez l'URL : `https://votre-site.vercel.app/api/webhooks/stripe`
- ✅ Commence par `https://`
- ✅ Contient `/api/webhooks/stripe`
- ❌ Pas de slash `/` à la fin

---

## 📊 Monitoring

### Surveiller les Webhooks

**Stripe Dashboard** :
- Dashboard → Webhooks → Votre webhook → **Events**
- **Success rate** : Devrait être proche de 100%

**Vercel Logs** :
- Dashboard → Deployments → Function Logs
- Cherchez `/api/webhooks/stripe` dans les logs

---

## 🎯 Checklist Finale

- [ ] ✅ Webhook créé dans Stripe Dashboard
- [ ] ✅ URL correcte : `https://votre-site.vercel.app/api/webhooks/stripe`
- [ ] ✅ Événements sélectionnés
- [ ] ✅ Signing Secret copié
- [ ] ✅ `STRIPE_WEBHOOK_SECRET` mis à jour sur Vercel
- [ ] ✅ Site redéployé
- [ ] ✅ Paiement test réussi
- [ ] ✅ Commande en statut `paid`
- [ ] ✅ Événements "Succeeded" dans Stripe

---

## 📚 Documentation

- [DEPLOIEMENT-VERCEL.md](./DEPLOIEMENT-VERCEL.md) - Guide complet
- [Documentation Stripe Webhooks](https://stripe.com/docs/webhooks)

---

**Version** : 1.0.0
**Dernière mise à jour** : 2025-12-06
