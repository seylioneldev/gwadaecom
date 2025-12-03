# Guide de Gestion des Remboursements

## 📋 Vue d'ensemble

Ce guide décrit le système de gestion manuelle des remboursements mis en place pour gwadaecom. Le système permet aux clients de demander des remboursements via email et formulaire de contact, avec une gestion manuelle via Stripe Dashboard.

## 🎯 Fonctionnalités Implémentées

### 1. Page Contact & Support (`/support`)

**Fichier:** `src/app/support/page.js`

#### Caractéristiques:

- **Formulaire de contact complet** avec les champs suivants:

  - Nom complet
  - Email
  - Numéro de commande (optionnel)
  - Sujet (demande de remboursement, retour, question sur commande, etc.)
  - Message détaillé

- **Section informative** incluant:

  - Email de contact visible: `seymlionel@gmail.com`
  - Liens vers la politique de remboursement
  - Liens vers les commandes
  - Informations sur les délais de réponse (24h)

- **Aide contextuelle**:
  - Affichage automatique d'informations supplémentaires pour les demandes de remboursement
  - Instructions claires sur les conditions de retour

#### Accès:

- URL directe: `/support`
- Lien dans le footer
- Lien depuis la modal d'aide dans les commandes

---

### 2. Page Politique de Remboursement (`/politique-remboursement`)

**Fichier:** `src/app/politique-remboursement/page.js`

#### Sections:

1. **Délai de rétractation**

   - 14 jours calendaires après réception
   - Conforme à la législation européenne

2. **Conditions de retour**

   - Produit non porté
   - Emballage d'origine
   - État neuf

3. **Procédure de remboursement** (4 étapes):

   - Étape 1: Contacter par email
   - Étape 2: Indiquer le numéro de commande
   - Étape 3: Expliquer la raison du retour
   - Étape 4: Recevoir les instructions (sous 24h)

4. **Délais de remboursement**

   - Traitement: 2-3 jours ouvrés
   - Remboursement bancaire: 5-10 jours ouvrés

5. **Frais de retour**

   - À la charge du client (sauf défaut ou erreur)
   - Pris en charge si produit défectueux

6. **Produits non remboursables**
   - Sous-vêtements et maillots de bain
   - Produits personnalisés
   - Articles soldés

#### Accès:

- URL directe: `/politique-remboursement`
- Lien dans le footer
- Lien depuis la page support
- Lien depuis la modal d'aide

---

### 3. Modal d'Aide dans l'Espace Commandes

**Fichier:** `src/app/compte/commandes/page.js`

#### Fonctionnalités:

- **Bouton "Besoin d'aide ?"** en haut de la page des commandes
- **Bouton d'aide par commande** avec icône HelpCircle sur chaque commande

#### Contenu de la modal:

1. **Email de contact**

   - Adresse email cliquable
   - Délai de réponse affiché

2. **Numéro de commande pré-rempli**

   - Automatiquement affiché si ouvert depuis une commande spécifique
   - Facilite la communication avec le support

3. **Lien vers la politique de remboursement**

   - Bouton vert avec redirection

4. **Lien vers le formulaire de contact**
   - Bouton jaune avec redirection vers `/support`

#### Accès:

- Bouton global en haut de `/compte/commandes`
- Bouton individuel sur chaque commande listée

---

### 4. Navigation Mise à Jour

**Fichier:** `src/components/layout/Footer.jsx`

#### Liens ajoutés dans le footer:

- **Contact & Support** → `/support`
- **Politique de Remboursement** → `/politique-remboursement`
- **Mes Commandes** → `/compte/commandes`

---

## 📧 Processus de Gestion Manuelle

### Pour le Client:

1. **Demande de remboursement**

   - Via formulaire `/support`
   - Via email direct à `seymlionel@gmail.com`
   - Via modal d'aide depuis ses commandes

2. **Informations à fournir**

   - Numéro de commande (format: CMD-XXXXXX)
   - Raison du retour
   - Coordonnées de contact

3. **Réception de la réponse**
   - Sous 24h ouvrées
   - Instructions de retour
   - Adresse d'expédition

### Pour l'Administrateur:

1. **Réception de la demande**

   - Email à `seymlionel@gmail.com`
   - Vérifier le numéro de commande

2. **Vérification dans Stripe Dashboard**

   - Se connecter à [Stripe Dashboard](https://dashboard.stripe.com)
   - Rechercher la commande par ID ou email client
   - Vérifier le statut du paiement

3. **Traitement du remboursement**

   - Aller dans la section "Payments" → "All payments"
   - Trouver la transaction concernée
   - Cliquer sur "Refund" (Rembourser)
   - Options:
     - **Remboursement complet**: Rembourser le montant total
     - **Remboursement partiel**: Spécifier le montant
   - Ajouter une raison (optionnel mais recommandé)
   - Confirmer le remboursement

4. **Communication avec le client**
   - Envoyer un email de confirmation
   - Indiquer le montant remboursé
   - Préciser le délai bancaire (5-10 jours)

---

## 🔧 Configuration Requise

### Email de Contact

Assurez-vous que l'email `seymlionel@gmail.com` est:

- ✅ Configuré et fonctionnel
- ✅ Surveillé régulièrement
- ✅ Configuré avec des réponses automatiques (optionnel)

### Stripe Dashboard

- ✅ Accès administrateur au compte Stripe
- ✅ Permissions de remboursement activées
- ✅ Notifications par email configurées

---

## 📊 Suivi et Statistiques

### Métriques à Surveiller:

1. **Taux de demandes de remboursement**
   - Nombre de demandes / Nombre de commandes
2. **Délai de traitement moyen**

   - Temps entre demande et remboursement effectué

3. **Raisons principales de retour**

   - Taille incorrecte
   - Produit défectueux
   - Ne correspond pas à la description
   - Changement d'avis

4. **Satisfaction client**
   - Feedback après remboursement

---

## 🚀 Améliorations Futures Possibles

### Court terme:

- [ ] Ajouter un système de tickets de support
- [ ] Créer des templates d'emails de réponse
- [ ] Ajouter un FAQ sur les retours

### Moyen terme:

- [ ] Intégration API Stripe pour remboursements automatiques
- [ ] Dashboard admin pour gérer les demandes
- [ ] Système de suivi de statut pour le client

### Long terme:

- [ ] Portail client pour suivre les demandes
- [ ] Génération automatique d'étiquettes de retour
- [ ] Intégration avec un système de gestion de stock

---

## 📝 Notes Importantes

### Conformité Légale:

- ✅ Délai de rétractation de 14 jours (conforme UE)
- ✅ Politique de remboursement claire et accessible
- ✅ Conditions de retour transparentes

### Bonnes Pratiques:

- Répondre rapidement aux demandes (< 24h)
- Être flexible et compréhensif avec les clients
- Documenter chaque remboursement dans Stripe
- Garder une trace des communications

### Sécurité:

- Ne jamais demander d'informations de carte bancaire par email
- Tous les remboursements via Stripe uniquement
- Vérifier l'identité du client si doute

---

## 🆘 Support et Contact

Pour toute question sur ce système:

- **Email technique**: seymlionel@gmail.com
- **Documentation Stripe**: [Stripe Refunds Guide](https://stripe.com/docs/refunds)

---

**Date de création**: Décembre 2025  
**Version**: 1.0  
**Dernière mise à jour**: 3 décembre 2025
