# 🔄 Workflow de Développement - GwadaEcom

**Guide pour travailler sans affecter le site en production**

---

## 📋 Branches disponibles

- **`main`** : Branche de production (déployée sur Vercel en production)
- **`dev`** : Branche de développement (pour tester avant de mettre en prod)

---

## 🚀 Workflow quotidien

### 1. Commencer une nouvelle fonctionnalité

```bash
# Assurez-vous d'être sur la branche dev
git checkout dev

# Récupérez les dernières modifications
git pull origin dev

# Commencez à coder !
```

### 2. Tester en local

```bash
# Lancez le serveur de développement
npm run dev

# Testez sur http://localhost:3000
```

### 3. Committer vos changements

```bash
# Ajoutez vos fichiers modifiés
git add .

# Créez un commit avec un message descriptif
git commit -m "feat: ajout de ma nouvelle fonctionnalité"

# Poussez sur la branche dev
git push origin dev
```

**Important** : Vercel créera automatiquement un **Preview Deployment** pour votre branche `dev`. Vous pourrez le tester en ligne sans affecter la production !

### 4. Tester sur Vercel Preview

1. Allez sur votre dashboard Vercel
2. Dans "Deployments", trouvez le déploiement de la branche `dev`
3. Cliquez sur "Visit" pour accéder à l'URL de preview
4. Testez votre nouvelle fonctionnalité
5. Si tout fonctionne, passez à l'étape 5

### 5. Mettre en production

**Quand vous êtes satisfait et que tout fonctionne** :

```bash
# Retournez sur la branche main
git checkout main

# Récupérez les dernières modifications de main
git pull origin main

# Mergez votre branche dev dans main
git merge dev

# Poussez sur main (déclenche un déploiement en production)
git push origin main
```

**Vercel déploiera automatiquement** votre nouvelle version en production !

### 6. Retournez sur dev pour continuer

```bash
# Retournez sur la branche dev pour continuer le développement
git checkout dev
```

---

## 📝 Exemples de messages de commit

Suivez cette convention pour vos commits :

- `feat: ajout de...` - Nouvelle fonctionnalité
- `fix: correction de...` - Correction de bug
- `docs: mise à jour de...` - Documentation
- `style: amélioration du design...` - Changements visuels
- `refactor: restructuration de...` - Refactoring du code
- `test: ajout de tests pour...` - Tests

---

## 🔧 Mode Maintenance (si nécessaire)

Si vous devez vraiment bloquer le site en production :

### Activer le mode maintenance

1. Allez sur Vercel → Settings → Environment Variables
2. Ajoutez : `MAINTENANCE_MODE` = `true` (Production)
3. Deployments → Redeploy

Le site affichera la page de maintenance.

### Désactiver le mode maintenance

1. Vercel → Settings → Environment Variables
2. Supprimez `MAINTENANCE_MODE` ou changez à `false`
3. Redéployez

---

## 🎯 Résumé visuel

```
┌─────────────────────────────────────────────┐
│  Développement local (npm run dev)          │
│  ↓                                          │
│  git add . && git commit                    │
│  ↓                                          │
│  git push origin dev                        │
│  ↓                                          │
│  Vercel Preview Deployment (test en ligne)  │
│  ↓                                          │
│  ✅ Tout fonctionne ?                       │
│  ↓                                          │
│  git checkout main                          │
│  git merge dev                              │
│  git push origin main                       │
│  ↓                                          │
│  🚀 Production déployée !                   │
└─────────────────────────────────────────────┘
```

---

## 💡 Bonnes pratiques

1. **Testez toujours en local d'abord** avec `npm run dev`
2. **Committez régulièrement** avec des messages clairs
3. **Testez sur le Preview Deployment** avant de merger dans main
4. **Ne poussez sur main que du code testé et fonctionnel**
5. **Restez sur la branche dev** pour le développement quotidien

---

## 🆘 Commandes utiles

```bash
# Voir sur quelle branche vous êtes
git branch

# Basculer vers dev
git checkout dev

# Basculer vers main
git checkout main

# Voir l'état de vos modifications
git status

# Annuler les modifications locales (attention !)
git reset --hard

# Voir l'historique des commits
git log --oneline
```

---

## 📚 URLs importantes

- **Site Production** : https://gwadaecom.vercel.app
- **Dashboard Vercel** : https://vercel.com/dashboard
- **Repository GitHub** : https://github.com/seylioneldev/gwadaecom

---

**Dernière mise à jour** : 2025-12-06
