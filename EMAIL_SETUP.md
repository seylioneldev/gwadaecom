# Configuration de l'envoi d'emails

Ce document explique comment configurer l'envoi d'emails de confirmation de commande pour votre boutique e-commerce.

## 📋 Aperçu

L'application envoie automatiquement un email de confirmation après chaque commande réussie. Vous pouvez choisir parmi plusieurs services d'email en fonction de vos besoins.

## 🚀 Services d'email recommandés

### Option 1 : Resend (⭐ Recommandé)

**Avantages :**
- Interface moderne et simple
- Excellente documentation
- Prix compétitifs (100 emails/jour gratuits)
- Support React Email pour des templates avancés

**Installation :**

```bash
npm install resend
```

**Configuration :**

1. Créez un compte sur [resend.com](https://resend.com)
2. Obtenez votre clé API
3. Ajoutez à votre `.env.local` :

```env
RESEND_API_KEY=re_votre_cle_api
```

4. Dans `src/app/api/send-order-confirmation/route.js`, décommentez la section Resend :

```javascript
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

// Dans la fonction POST, décommentez :
await resend.emails.send({
  from: 'Les Bijoux de Guadeloupe <noreply@votre-domaine.com>',
  to: orderData.customer.email,
  subject: `Confirmation de commande ${orderData.orderId}`,
  html: emailContent,
});
```

5. Vérifiez votre domaine dans Resend pour utiliser votre propre adresse email

---

### Option 2 : SendGrid

**Avantages :**
- Service établi et fiable
- 100 emails/jour gratuits
- Analytics détaillées

**Installation :**

```bash
npm install @sendgrid/mail
```

**Configuration :**

1. Créez un compte sur [sendgrid.com](https://sendgrid.com)
2. Obtenez votre clé API
3. Ajoutez à votre `.env.local` :

```env
SENDGRID_API_KEY=SG.votre_cle_api
```

4. Dans `src/app/api/send-order-confirmation/route.js`, décommentez la section SendGrid :

```javascript
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Dans la fonction POST, décommentez :
await sgMail.send({
  to: orderData.customer.email,
  from: 'noreply@votre-domaine.com',
  subject: `Confirmation de commande ${orderData.orderId}`,
  html: emailContent,
});
```

---

### Option 3 : Nodemailer (SMTP)

**Avantages :**
- Utilise votre propre serveur email
- Gratuit (si vous avez déjà un serveur SMTP)
- Contrôle total

**Installation :**

```bash
npm install nodemailer
```

**Configuration :**

1. Obtenez les informations SMTP de votre hébergeur
2. Ajoutez à votre `.env.local` :

```env
SMTP_HOST=smtp.votre-hebergeur.com
SMTP_PORT=465
SMTP_USER=votre_email@votre-domaine.com
SMTP_PASS=votre_mot_de_passe
```

3. Dans `src/app/api/send-order-confirmation/route.js`, décommentez la section Nodemailer :

```javascript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Dans la fonction POST, décommentez :
await transporter.sendMail({
  from: '"Les Bijoux de Guadeloupe" <noreply@votre-domaine.com>',
  to: orderData.customer.email,
  subject: `Confirmation de commande ${orderData.orderId}`,
  html: emailContent,
});
```

---

## 🎨 Personnalisation de l'email

Le template d'email est dans `src/app/api/send-order-confirmation/route.js` dans la fonction `generateEmailHTML()`.

Vous pouvez personnaliser :
- Les couleurs (`#5d6e64` pour la couleur principale)
- Le logo (ajoutez une image hébergée)
- Le texte des messages
- La structure HTML

**Exemple d'ajout de logo :**

```html
<div style="background-color: #5d6e64; color: white; padding: 32px; text-align: center;">
  <img src="https://votre-domaine.com/logo.png" alt="Logo" style="max-width: 200px; margin-bottom: 16px;" />
  <h1 style="margin: 0; font-size: 28px;">Les Bijoux de Guadeloupe</h1>
</div>
```

---

## 🧪 Test en développement

Par défaut, l'API affiche l'email dans la console au lieu de l'envoyer. Cela permet de tester sans envoyer de vrais emails.

Pour voir les emails dans la console :
1. Passez une commande
2. Regardez la console du serveur Next.js
3. Vous verrez un log avec le contenu de l'email

Commentez la section "MODE DÉVELOPPEMENT" pour activer l'envoi réel.

---

## 📝 Variables d'environnement

Créez ou modifiez `.env.local` à la racine du projet :

```env
# Resend (Option 1)
RESEND_API_KEY=re_votre_cle_api

# OU SendGrid (Option 2)
SENDGRID_API_KEY=SG.votre_cle_api

# OU SMTP/Nodemailer (Option 3)
SMTP_HOST=smtp.votre-hebergeur.com
SMTP_PORT=465
SMTP_USER=votre_email@votre-domaine.com
SMTP_PASS=votre_mot_de_passe
```

⚠️ **Important :** N'ajoutez jamais `.env.local` à Git ! Ce fichier est déjà dans `.gitignore`.

---

## 🔒 Sécurité

### Validation du domaine

Pour éviter que vos emails soient marqués comme spam :

1. **Vérifiez votre domaine** dans le service d'email choisi
2. **Configurez SPF, DKIM et DMARC** pour votre domaine
3. **Utilisez une adresse email de votre domaine** (pas de Gmail, Yahoo, etc.)

### Rate limiting

Pour éviter les abus, ajoutez une limitation de débit :

```javascript
// Dans route.js, ajoutez au début de la fonction POST :
const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
// Implémentez une logique de rate limiting basée sur l'IP
```

---

## 📊 Monitoring

Pour suivre les emails envoyés :

1. **Resend** : Dashboard avec analytics intégrées
2. **SendGrid** : Dashboard avec statistiques détaillées
3. **Nodemailer** : Ajoutez des logs personnalisés

**Exemple de logging :**

```javascript
console.log({
  type: 'order_confirmation_email',
  orderId: orderData.orderId,
  customerEmail: orderData.customer.email,
  timestamp: new Date().toISOString(),
});
```

---

## 🐛 Dépannage

### L'email n'arrive pas

1. Vérifiez les logs de la console
2. Vérifiez le dossier spam
3. Vérifiez que la clé API est correcte
4. Vérifiez que le domaine est vérifié

### Erreur "Invalid API key"

- Vérifiez que `.env.local` est bien à la racine
- Redémarrez le serveur Next.js après avoir modifié `.env.local`
- Vérifiez qu'il n'y a pas d'espaces dans la clé API

### Email marqué comme spam

- Vérifiez votre domaine (SPF, DKIM, DMARC)
- Utilisez une adresse email de votre propre domaine
- Évitez les mots "spam" dans le sujet
- Ajoutez un lien de désinscription si vous envoyez des newsletters

---

## 📚 Ressources

- [Documentation Resend](https://resend.com/docs)
- [Documentation SendGrid](https://docs.sendgrid.com/)
- [Documentation Nodemailer](https://nodemailer.com/)
- [Guide SPF, DKIM, DMARC](https://www.cloudflare.com/learning/dns/dns-records/)

---

## ✅ Checklist de mise en production

- [ ] Service d'email configuré et testé
- [ ] Variables d'environnement ajoutées à `.env.local`
- [ ] Domaine vérifié dans le service d'email
- [ ] SPF, DKIM et DMARC configurés
- [ ] Template d'email personnalisé
- [ ] Logo ajouté (si souhaité)
- [ ] Test d'envoi effectué
- [ ] Mode développement désactivé
- [ ] Monitoring en place
- [ ] Variables d'environnement ajoutées sur le serveur de production (Vercel, etc.)
