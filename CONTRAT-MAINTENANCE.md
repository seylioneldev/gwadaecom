# 📋 Contrat de Maintenance - GwadaEcom CMS

**Document de référence pour la vente et la maintenance du CMS**

---

## 📌 Types de maintenance inclus

### 1. Maintenance Corrective (Bugs)

**Délai d'intervention selon gravité** :

| Gravité | Délai | Exemples |
|---------|-------|----------|
| **Critique** | 4h | Site inaccessible, paiements bloqués, faille de sécurité |
| **Haute** | 24h | Fonctionnalité majeure cassée, erreurs fréquentes |
| **Moyenne** | 72h | Bug mineur, problème d'affichage |
| **Basse** | 7 jours | Amélioration cosmétique, suggestion UX |

**Inclus** :
- ✅ Correction des bugs causés par le code initial
- ✅ Correction des incompatibilités navigateurs
- ✅ Support technique par email

**Non inclus** :
- ❌ Bugs causés par des modifications faites par le client
- ❌ Bugs causés par des services tiers (Stripe, Firebase)
- ❌ Formation utilisateur

---

### 2. Maintenance Évolutive (Nouvelles fonctionnalités)

**Facturation** : Au forfait ou à l'heure

**Exemples de demandes évolutives** :
- Ajout d'une nouvelle méthode de paiement
- Création d'un système de fidélité
- Intégration avec un ERP
- Nouveau design de page produit
- Export de données avancé

**Processus** :
1. Demande du client par email
2. Analyse et chiffrage (gratuit)
3. Devis envoyé sous 48h
4. Validation du client
5. Développement sur branche `dev`
6. Tests sur environnement de staging
7. Mise en production

---

### 3. Maintenance Préventive (Mises à jour)

**Fréquence** : Trimestrielle (ou selon besoin)

**Inclus** :
- ✅ Mises à jour de sécurité critiques (Next.js, React, Stripe)
- ✅ Mises à jour mineures des dépendances
- ✅ Optimisations de performance
- ✅ Backup avant chaque mise à jour majeure

**Processus** :
1. Vérification des mises à jour disponibles
2. Test en environnement de staging
3. Planification avec le client (date et heure)
4. Backup complet
5. Mise à jour en production
6. Vérification post-déploiement
7. Rollback si problème

**Communication** :
- Email 7 jours avant : "Mise à jour planifiée le..."
- Email 24h avant : Rappel
- Email après : "Mise à jour réussie"

---

## 🔍 Vérifications techniques régulières

### Health Check mensuel

**Vérifications automatiques** :
- [ ] Statut Firebase (connexion, quota)
- [ ] Statut Stripe (webhook fonctionnel)
- [ ] Envoi d'emails (SMTP opérationnel)
- [ ] Certificat SSL valide
- [ ] Temps de réponse API < 500ms
- [ ] Aucune erreur 500 récurrente

**Accessible via** : `/admin/system` → "Health Check"

---

### Monitoring continu

**Outils recommandés** (à mettre en place) :
1. **Vercel Analytics** : Performance et erreurs
2. **Sentry** (optionnel) : Tracking d'erreurs JavaScript
3. **UptimeRobot** (gratuit) : Monitoring uptime
4. **Google Analytics** : Trafic et comportement utilisateurs

---

## 📊 Tableau de bord Système (`/admin/system`)

**Fonctionnalités disponibles** :

✅ **Statut en temps réel**
- Santé des services (Firebase, Stripe, Email)
- Version actuelle du CMS
- Dernière mise à jour
- Uptime

✅ **Health Check manuel**
- Vérification de tous les services
- Détection des problèmes
- Rapport détaillé

✅ **Informations techniques**
- Versions des dépendances
- Configuration environnement
- Performance

✅ **Contact support**
- Email direct au développeur
- Lien vers documentation

---

## 🚨 Procédure en cas de bug critique

### Pour le client :

1. **Accéder à `/admin/system`**
2. Cliquer sur "Health Check"
3. Prendre une capture d'écran
4. Envoyer email à : `support@votreemail.com` avec :
   - Description du problème
   - Capture d'écran du Health Check
   - Étapes pour reproduire le bug
   - Navigateur utilisé

### Pour le développeur :

1. Recevoir l'alerte
2. Accéder aux logs Vercel : `vercel.com → Projet → Logs`
3. Identifier la cause
4. Créer une branche `hotfix/issue-xxx`
5. Corriger le bug
6. Tester en local et sur preview
7. Merger dans `main`
8. Déploiement automatique
9. Vérifier que le problème est résolu
10. Notifier le client

**Délai** : Max 4h pour bugs critiques

---

## 💰 Tarification suggérée

### Forfait Maintenance Annuel

**Option 1 : Basique** (499€/an)
- ✅ Corrections de bugs critiques (24/7)
- ✅ Mises à jour de sécurité
- ✅ Support par email (48h)
- ✅ 2 mises à jour majeures/an
- ❌ Nouvelles fonctionnalités

**Option 2 : Standard** (999€/an)
- ✅ Tout "Basique" +
- ✅ Mises à jour mensuelles
- ✅ Support prioritaire (12h)
- ✅ Health check mensuel
- ✅ 5h de développement évolutif incluses
- ✅ Monitoring Sentry

**Option 3 : Premium** (1999€/an)
- ✅ Tout "Standard" +
- ✅ Support 24/7 (4h)
- ✅ Health check hebdomadaire
- ✅ 15h de développement évolutif incluses
- ✅ Monitoring avancé
- ✅ Backups automatiques quotidiens
- ✅ Consultation stratégique trimestrielle

### Interventions hors forfait

- **Développement évolutif** : 80€/h
- **Intervention urgente hors heures** : 120€/h
- **Formation utilisateur** : 60€/h
- **Migration/Déploiement** : Devis sur demande

---

## 📝 SLA (Service Level Agreement)

### Disponibilité

- **Objectif** : 99.5% uptime
- **Calcul** : Basé sur Vercel uptime
- **Exclusions** : Pannes Vercel, Stripe, Firebase (tiers)

### Temps de réponse

| Type | Temps de réponse | Temps de résolution |
|------|------------------|---------------------|
| Critique | 4h | 24h |
| Haute | 12h | 72h |
| Moyenne | 24h | 5 jours |
| Basse | 48h | 15 jours |

### Fenêtres de maintenance

- **Préférence** : Dimanche 2h-6h (heure locale)
- **Notification** : 7 jours à l'avance
- **Durée max** : 2h pour mises à jour standard

---

## 🔐 Sécurité et Accès

### Accès développeur

**Le développeur conserve** :
- Accès GitHub (repository)
- Accès Vercel (déploiement)
- Accès Firebase Console (admin)
- Accès Stripe Dashboard (consultation)

**Le client possède** :
- Compte admin CMS (`/admin`)
- Domaine personnalisé
- Compte Firebase (propriétaire)
- Compte Stripe (propriétaire)

### Backup et disaster recovery

**Backup automatique Vercel** :
- Historique de tous les déploiements
- Rollback en 1 clic

**Backup Firebase** :
- Export manuel mensuel (via script)
- Stockage sécurisé (Google Cloud Storage)

**Plan de reprise** :
- Rollback déploiement : < 5 minutes
- Restauration base de données : < 30 minutes
- Reconstruction complète : < 2 heures

---

## 📞 Contact et Support

### Canaux de support

**Email prioritaire** : support@votreemail.com
- Réponse sous 12h (jours ouvrés)
- Réponse sous 4h (bugs critiques)

**Documentation** :
- Guide utilisateur : `/docs/user-guide.pdf`
- FAQ : `/docs/faq.md`
- Vidéos tutoriels : Lien YouTube

**Réunion trimestrielle** (Forfait Premium)
- Visio 1h
- Revue des stats
- Suggestions d'amélioration
- Planification évolutions

---

## 📄 Annexes

### Checklist de livraison client

- [ ] Accès admin CMS fourni
- [ ] Documentation utilisateur remise
- [ ] Formation réalisée (1h minimum)
- [ ] Accès Firebase transféré
- [ ] Accès Stripe configuré
- [ ] Domaine personnalisé configuré
- [ ] Variables d'environnement documentées
- [ ] Backups configurés
- [ ] Monitoring activé
- [ ] Contrat de maintenance signé

### Changements de périmètre

**Modifications nécessitant avenant** :
- Changement de plateforme d'hébergement
- Migration vers Stripe en production
- Intégration ERP/CRM
- Refonte design majeure
- Ajout multi-boutiques

---

**Version du contrat** : 1.0
**Dernière mise à jour** : 2025-12-06
**Valable pour** : GwadaEcom CMS v1.x
