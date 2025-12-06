# 🌿 Guide des Branches - CMS E-commerce

**Système de 3 branches pour gérer développement, production et vente**

---

## 🎯 Vue d'ensemble

Ce projet utilise **3 branches** avec des objectifs différents :

```
main (Production GwadaEcom)
  ↓
  → Votre site en production
  → Design personnalisé (Or + Noir)
  → Vos vrais produits
  → URL: https://gwadaecom.vercel.app

dev (Développement)
  ↓
  → Nouvelles fonctionnalités
  → Tests avant production
  → Preview deployments
  → Merge vers main quand prêt

share-bones (Squelette Client) ⭐
  ↓
  → Version neutre noir/blanc/gris
  → Données mockées
  → À cloner pour chaque client
  → Jamais mergée vers main
```

---

## 📚 Détails des Branches

### 1. `main` - Production GwadaEcom

**Objectif** : Site de production de VOTRE boutique

**Contenu** :
- ✅ Design premium Or #D4AF37 + Noir #1A1A1A
- ✅ Logo "Perles des Îles"
- ✅ Vos vrais produits
- ✅ Configuration production

**Déploiement** : Automatique sur Vercel
**URL** : `https://gwadaecom.vercel.app`

**Ne jamais** :
- ❌ Pousser du code non testé
- ❌ Faire des experiments
- ❌ Merger share-bones

**Toujours** :
- ✅ Merger depuis `dev` après tests
- ✅ Créer des backups avant gros changements
- ✅ Vérifier que tout fonctionne avant de merger

---

### 2. `dev` - Développement

**Objectif** : Développement et tests de nouvelles fonctionnalités

**Contenu** :
- ✅ Nouvelles features en cours
- ✅ Bugs fixes
- ✅ Améliorations
- ✅ Même design que `main`

**Déploiement** : Preview deployment sur Vercel
**URL** : `https://gwadaecom-git-dev-*.vercel.app`

**Workflow** :
```bash
# Vous êtes sur dev par défaut
git checkout dev

# Développement
git add .
git commit -m "feat: nouvelle fonctionnalité"
git push origin dev

# Tester sur URL preview
# Si OK, merger dans main
git checkout main
git merge dev
git push origin main
```

**À utiliser pour** :
- ✅ Toutes vos nouvelles fonctionnalités
- ✅ Corrections de bugs
- ✅ Expérimentations
- ✅ Tests

---

### 3. `share-bones` - Squelette Client ⭐

**Objectif** : Version neutre à cloner pour chaque nouveau client

**Contenu** :
- ✅ Design noir/blanc/gris neutre
- ✅ Données d'exemple mockées
- ✅ Toutes les fonctionnalités du CMS
- ✅ Documentation d'installation

**Déploiement** : Jamais déployé directement
**Usage** : Clonage pour clients

**Caractéristiques** :
- Pas de couleurs spécifiques (neutre)
- Nom générique "Ma Boutique"
- Logo placeholder
- Produits d'exemple
- Prêt à être personnalisé

**Workflow pour un nouveau client** :
```bash
# Cloner la branche share-bones
git clone -b share-bones https://github.com/votre-repo/gwadaecom.git client-nom

cd client-nom

# Changer l'origine vers le repo du client
git remote set-url origin https://github.com/client/nouveau-repo.git

# Pousser
git push -u origin share-bones
git checkout -b main
git push -u origin main

# Le client personnalise à partir de là
```

**Ne jamais** :
- ❌ Merger vers `main` ou `dev`
- ❌ Ajouter votre design personnel
- ❌ Ajouter vos vraies données

**Toujours** :
- ✅ Garder un design neutre
- ✅ Utiliser des données mockées
- ✅ Mettre à jour avec les nouvelles fonctionnalités de `dev`

---

## 🔄 Workflows Courants

### Workflow 1 : Développer une nouvelle fonctionnalité

```bash
# 1. Assurez-vous d'être sur dev
git checkout dev
git pull origin dev

# 2. Développez
# ... codage ...

# 3. Testez en local
npm run dev

# 4. Committez
git add .
git commit -m "feat: description de la fonctionnalité"
git push origin dev

# 5. Testez sur preview Vercel
# URL: https://gwadaecom-git-dev-*.vercel.app

# 6. Si tout est OK, mergez dans main
git checkout main
git pull origin main
git merge dev
git push origin main

# 7. Retournez sur dev
git checkout dev
```

---

### Workflow 2 : Corriger un bug urgent en production

```bash
# 1. Créer une branche hotfix depuis main
git checkout main
git pull origin main
git checkout -b hotfix/nom-du-bug

# 2. Corriger le bug
# ... correction ...

# 3. Tester
npm run dev

# 4. Merger dans main
git checkout main
git merge hotfix/nom-du-bug
git push origin main

# 5. Merger aussi dans dev pour garder la synchro
git checkout dev
git merge hotfix/nom-du-bug
git push origin dev

# 6. Supprimer la branche hotfix
git branch -d hotfix/nom-du-bug
```

---

### Workflow 3 : Mettre à jour share-bones avec nouvelles fonctionnalités

```bash
# 1. Assurez-vous que dev est à jour avec main
git checkout main
git pull origin main
git checkout dev
git merge main
git push origin dev

# 2. Basculez sur share-bones
git checkout share-bones
git pull origin share-bones

# 3. Mergez les nouvelles fonctionnalités de dev
git merge dev

# 4. Vérifiez que le design reste neutre
# Supprimez les éléments spécifiques à GwadaEcom
# Gardez les couleurs neutres

# 5. Testez
npm run dev

# 6. Poussez
git push origin share-bones
```

---

### Workflow 4 : Installer le CMS pour un nouveau client

Voir le guide complet : [INSTALLATION-CLIENT.md](INSTALLATION-CLIENT.md)

**Résumé** :

```bash
# 1. Cloner share-bones
git clone -b share-bones https://github.com/votre-repo/gwadaecom.git client-nom

# 2. Configurer pour le client
cd client-nom
git remote set-url origin https://github.com/client/repo.git

# 3. Installer
npm install

# 4. Configurer .env.local avec les clés du client

# 5. Déployer sur Vercel du client

# 6. Personnaliser (couleurs, logo, contenu)
```

---

## 📊 Tableau Récapitulatif

| Aspect | main | dev | share-bones |
|--------|------|-----|-------------|
| **Design** | GwadaEcom (Or+Noir) | GwadaEcom | Neutre (N/B/Gris) |
| **Données** | Production | Production | Mockées |
| **Usage** | Site en ligne | Développement | Clonage client |
| **Déploiement** | Auto Vercel | Preview Vercel | Manuel par client |
| **Push direct** | ❌ Non (via dev) | ✅ Oui | ✅ Oui |
| **Merge depuis** | dev | - | dev (features) |
| **Merge vers** | - | main | ❌ Jamais |

---

## ⚠️ Règles Importantes

### À FAIRE ✅

- Développer sur `dev`
- Merger `dev` → `main` après tests
- Cloner `share-bones` pour clients
- Garder `share-bones` neutre
- Documenter vos commits

### À NE PAS FAIRE ❌

- Pousser directement sur `main`
- Merger `share-bones` → `main`
- Ajouter votre design dans `share-bones`
- Développer directement sur `main`
- Oublier de tester avant de merger

---

## 🎓 Commandes Utiles

### Voir toutes les branches

```bash
# Locales
git branch

# Toutes (locales + distantes)
git branch -a
```

### Basculer entre branches

```bash
git checkout main        # Production
git checkout dev         # Développement
git checkout share-bones # Squelette client
```

### Voir les différences entre branches

```bash
# Différences dev vs main
git diff main..dev

# Fichiers modifiés
git diff --name-only main..dev
```

### Synchroniser une branche

```bash
# Mettre à jour dev avec main
git checkout dev
git merge main
git push origin dev
```

### Créer une nouvelle branche

```bash
# Depuis dev
git checkout dev
git checkout -b feature/ma-nouvelle-feature
```

---

## 📞 Questions Fréquentes

### Q : Sur quelle branche dois-je travailler au quotidien ?

**R** : Sur `dev`. C'est votre branche de développement principale.

### Q : Quand dois-je utiliser share-bones ?

**R** : Uniquement pour cloner et installer le CMS pour un nouveau client.

### Q : Comment synchroniser share-bones avec mes nouvelles fonctionnalités ?

**R** :
```bash
git checkout share-bones
git merge dev
# Vérifiez que le design reste neutre
git push origin share-bones
```

### Q : J'ai fait une erreur sur main, que faire ?

**R** : Utilisez `git revert` ou créez un hotfix depuis `main`.

```bash
git checkout main
git revert HEAD  # Annule le dernier commit
git push origin main
```

### Q : Comment voir l'historique d'une branche ?

**R** :
```bash
git checkout nom-branche
git log --oneline --graph --decorate
```

---

## 📚 Documentation Associée

- [WORKFLOW-DEV.md](WORKFLOW-DEV.md) - Workflow git détaillé
- [INSTALLATION-CLIENT.md](INSTALLATION-CLIENT.md) - Guide installation client
- [README-SHARE-BONES.md](README-SHARE-BONES.md) - Spécifique à share-bones
- [VENTE-CMS-GUIDE.md](VENTE-CMS-GUIDE.md) - Guide de vente

---

## 🎯 Résumé en Image

```
┌─────────────────────────────────────────────────────────┐
│                    VOTRE WORKFLOW                       │
└─────────────────────────────────────────────────────────┘

Développement quotidien :
    dev (vous codez ici)
     ↓
    Tests locaux + preview
     ↓
    main (merge quand prêt)
     ↓
    Production déployée ✅

Installation nouveau client :
    share-bones (clonez)
     ↓
    Repo client
     ↓
    Configuration client
     ↓
    Personnalisation
     ↓
    Production client ✅
```

---

**Document créé** : 2025-12-06
**Version** : 1.0
