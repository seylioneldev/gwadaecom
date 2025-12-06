# 🚀 Déploiement Rapide sur Vercel - Guide Express

> **Déployez GwadaEcom en 10 minutes**

## ⚡ En 5 Étapes

### 1️⃣ Préparer les variables d'environnement

```bash
node scripts/copy-env-for-vercel.js
```

→ **Gardez cette fenêtre ouverte !**

---

### 2️⃣ Créer le projet sur Vercel

1. [vercel.com](https://vercel.com) → **"Add New..."** → **"Project"**
2. Importez **gwadaecom**
3. **NE CLIQUEZ PAS ENCORE SUR "DEPLOY"**

---

### 3️⃣ Ajouter les variables d'environnement

1. Cliquez sur **"Environment Variables"**
2. Sélectionnez **"Plaintext"**
3. **Copiez-collez** la sortie du script (section "FORMAT POUR DASHBOARD VERCEL")
4. Sélectionnez **"Production"**
5. Cliquez sur **"Add"**

---

### 4️⃣ Déployer

1. Cliquez sur **"Deploy"**
2. Attendez 2-5 minutes
3. **Notez votre URL** (ex: `https://gwadaecom.vercel.app`)

---

### 5️⃣ Configurer le webhook Stripe

1. [dashboard.stripe.com/test/webhooks](https://dashboard.stripe.com/test/webhooks)
2. **"+ Add endpoint"**
3. **URL** : `https://VOTRE-SITE.vercel.app/api/webhooks/stripe`
4. **Événements** : `payment_intent.succeeded` + `payment_intent.payment_failed`
5. **Copiez le Signing Secret** (commence par `whsec_...`)
6. **Vercel** → Settings → Environment Variables → Éditez `STRIPE_WEBHOOK_SECRET`
7. Collez le nouveau secret → **Redéployez**

---

## ✅ Tester

1. Allez sur votre site Vercel
2. Ajoutez un produit au panier
3. Payez avec : **4242 4242 4242 4242**
4. Vérifiez :
   - ✅ Page de confirmation
   - ✅ Commande en statut `paid` dans Firestore
   - ✅ Email reçu
   - ✅ Webhook "Succeeded" dans Stripe

---

## 📚 Documentation

- [DEPLOIEMENT-VERCEL.md](./DEPLOIEMENT-VERCEL.md) - Guide complet
- [STRIPE-WEBHOOK-GUIDE.md](./STRIPE-WEBHOOK-GUIDE.md) - Configuration webhook

---

## 🎯 Important

- ✅ **Stripe en MODE TEST** (`pk_test_*`, `sk_test_*`)
- ✅ **Aucun paiement réel**
- ✅ **Carte de test** : 4242 4242 4242 4242

---

**Version** : 1.0.0
