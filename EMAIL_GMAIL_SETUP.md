# Configuration Gmail SMTP pour les tests

## 📧 Configuration Gmail pour envoyer des emails de test

Cette configuration vous permet d'envoyer des emails à **n'importe quelle adresse** sans limitation de destinataires, parfait pour les tests !

## ⚠️ Important

- Gmail SMTP est parfait pour les **tests et le développement**
- Limite : 500 emails/jour (largement suffisant pour débuter)
- Pour la **production**, il est recommandé d'utiliser Resend avec un domaine personnalisé

---

## 🔧 Étape 1 : Créer un mot de passe d'application Gmail

### 📝 Instructions détaillées :

1. **Allez sur votre compte Google** : [https://myaccount.google.com/](https://myaccount.google.com/)

2. **Cliquez sur "Sécurité"** dans le menu de gauche

3. **Activez la "Validation en deux étapes"** (si ce n'est pas déjà fait)
   - Faites défiler jusqu'à la section "Comment vous connecter à Google"
   - Cliquez sur "Validation en deux étapes"
   - Suivez les instructions pour activer la validation en deux étapes

4. **Générez un mot de passe d'application**
   - Retournez dans la section **"Sécurité"**
   - Faites défiler jusqu'à trouver **"Mots de passe des applications"** (App passwords)
   - Si vous ne voyez pas cette option, assurez-vous que la validation en deux étapes est activée
   - Cliquez sur "Mots de passe des applications"
   - Sélectionnez :
     - Application : **"Mail"**
     - Appareil : **"Ordinateur Windows"** (ou votre système)
   - Cliquez sur **"Générer"**

5. **Copiez le mot de passe de 16 caractères** généré
   - Format : `abcd efgh ijkl mnop` (avec des espaces)
   - ⚠️ **Important** : Ce mot de passe ne sera affiché qu'une seule fois !

---

## 🔧 Étape 2 : Ajouter les variables d'environnement

Ouvrez votre fichier `.env.local` et vérifiez que ces lignes sont présentes :

```env
# ==================================
# GMAIL SMTP CONFIGURATION (Pour les tests)
# ==================================
GMAIL_USER=votre.email@gmail.com
GMAIL_APP_PASSWORD=abcdefghijklmnop
```

**Remplacez** :
- `votre.email@gmail.com` par votre adresse Gmail
- `abcdefghijklmnop` par le mot de passe d'application (sans espaces)

### ⚠️ Attention
- Retirez tous les espaces du mot de passe d'application
- Exemple : `abcd efgh ijkl mnop` devient `abcdefghijklmnop`

---

## 🔧 Étape 3 : Vérification de l'installation

Nodemailer est déjà installé dans le projet. Si vous avez besoin de le réinstaller :

```bash
npm install nodemailer
```

---

## 🔧 Étape 4 : Les fichiers API sont configurés

Les fichiers suivants ont été mis à jour pour utiliser Gmail SMTP :

1. **`src/app/api/send-order-confirmation/route.js`**
   - Envoie les confirmations de commande
   - Utilise Gmail SMTP via Nodemailer

2. **`src/app/api/send-welcome-email/route.js`**
   - Envoie les emails de bienvenue
   - Utilise Gmail SMTP via Nodemailer

### Configuration technique :
```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});
```

---

## ✅ Test de la configuration

Pour tester que tout fonctionne :

1. **Démarrez votre serveur de développement** :
   ```bash
   npm run dev
   ```

2. **Testez l'envoi d'un email de bienvenue** :
   - Créez un nouveau compte utilisateur sur votre application
   - Vérifiez la console pour voir les logs d'envoi
   - Vérifiez l'email de destination (peut être dans les spams la première fois)

3. **Testez l'envoi d'une confirmation de commande** :
   - Passez une commande de test
   - Vérifiez la console pour les logs
   - Vérifiez l'email de confirmation

### 🔍 Vérification dans la console :
Si tout fonctionne, vous devriez voir :
```
📧 ========================================
📧 API d'envoi d'email appelée
🔑 Configuration Gmail détectée: votre.email@gmail.com
📨 Envoi de l'email à: destinataire@example.com
✅ Email envoyé avec succès via Gmail SMTP!
📧 ========================================
```

---

## 🐛 Dépannage

### ❌ Erreur : "Invalid login"
- Vérifiez que la validation en deux étapes est activée
- Vérifiez que vous utilisez un mot de passe d'application (pas votre mot de passe Gmail)
- Assurez-vous qu'il n'y a pas d'espaces dans le mot de passe d'application

### ❌ Erreur : "Configuration email manquante"
- Vérifiez que `GMAIL_USER` et `GMAIL_APP_PASSWORD` sont dans `.env.local`
- Redémarrez votre serveur de développement après modification du `.env.local`

### ❌ L'email n'arrive pas
- Vérifiez le dossier spam/courrier indésirable
- Vérifiez les logs de la console pour voir si l'envoi a réussi
- Attendez quelques minutes (Gmail peut avoir un léger délai)

### ❌ Erreur : "Daily user sending quota exceeded"
- Vous avez dépassé la limite de 500 emails/jour
- Attendez 24 heures ou utilisez un autre compte Gmail

---

## ✅ Avantages de cette solution

- ✅ Envoi à **n'importe quelle adresse email**
- ✅ Pas de limite de destinataires (500 emails/jour)
- ✅ Pas besoin de domaine personnalisé
- ✅ Configuration rapide (5 minutes)
- ✅ Gratuit
- ✅ Parfait pour les tests et le développement

## ⚠️ Inconvénients

- ⚠️ Limite de 500 emails/jour
- ⚠️ L'expéditeur sera votre Gmail (pas très professionnel)
- ⚠️ Risque de blocage si vous envoyez trop d'emails rapidement
- ⚠️ Les emails peuvent arriver dans les spams au début

---

## 🚀 Pour la production

Une fois que vous serez prêt à passer en production, configurez un domaine personnalisé sur Resend pour :
- ✅ Expéditeur professionnel (`noreply@gwadecom.com`)
- ✅ Meilleure délivrabilité
- ✅ Pas de limite d'envoi
- ✅ Analytics détaillées
- ✅ Support commercial

Pour passer à Resend en production, voir le fichier `EMAIL_SETUP.md` (non encore créé).

---

## 📚 Ressources supplémentaires

- [Documentation Nodemailer](https://nodemailer.com/)
- [Gmail SMTP settings](https://support.google.com/mail/answer/7126229)
- [Mots de passe d'application Google](https://support.google.com/accounts/answer/185833)

---

**✅ Configuration terminée !** Vous pouvez maintenant envoyer des emails à n'importe quelle adresse pour tester votre application.
