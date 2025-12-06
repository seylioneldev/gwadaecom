# 🔒 Guide de Sécurité - Repository Privé

**Comment protéger votre code et votre design**

---

## ⚠️ Important

Par défaut, votre repository GitHub est **PUBLIC**, ce qui signifie :
- ❌ Tout le monde peut voir votre code
- ❌ Votre design unique est visible
- ❌ Vos configurations sont exposées
- ❌ Quelqu'un pourrait copier votre CMS

**Solution** : Rendre votre repository **PRIVÉ**

---

## 🔐 Option 1 : Rendre TOUT le Repository Privé (RECOMMANDÉ)

### Avantages
- ✅ Votre code reste protégé
- ✅ Votre design GwadaEcom reste secret
- ✅ Les 3 branches (`main`, `dev`, `share-bones`) sont protégées
- ✅ Vous contrôlez qui a accès

### Comment faire

**Sur GitHub** :

1. Allez sur votre repository : https://github.com/seylioneldev/gwadaecom
2. Cliquez sur **"Settings"** (en haut à droite)
3. Scrollez tout en bas jusqu'à **"Danger Zone"**
4. Cliquez sur **"Change visibility"**
5. Sélectionnez **"Make private"**
6. Tapez le nom du repository pour confirmer : `gwadaecom`
7. Cliquez sur **"I understand, make this repository private"**

**C'est tout !** Votre repository est maintenant privé.

---

## 🤝 Donner Accès à des Collaborateurs

Une fois le repository privé, vous pouvez inviter des personnes :

1. Repository → **"Settings"** → **"Collaborators"**
2. Cliquez sur **"Add people"**
3. Entrez leur username GitHub ou email
4. Choisissez le niveau d'accès :
   - **Read** : Voir le code seulement
   - **Write** : Modifier le code
   - **Admin** : Contrôle total

---

## 📦 Option 2 : Repository Séparé pour share-bones

Si vous voulez partager `share-bones` publiquement mais garder `main` et `dev` privés :

### Créer un repository PUBLIC pour le template

```bash
# 1. Sur GitHub, créez un NOUVEAU repository PUBLIC
# Nom : "cms-ecommerce-template" ou "ecommerce-starter"

# 2. Localement, basculez sur share-bones
git checkout share-bones

# 3. Ajoutez le remote public
git remote add public-template https://github.com/seylioneldev/cms-ecommerce-template.git

# 4. Poussez share-bones vers le repo public
git push public-template share-bones:main

# 5. Maintenant vous avez :
# - Repository PRIVÉ "gwadaecom" (main + dev + share-bones)
# - Repository PUBLIC "cms-ecommerce-template" (juste share-bones)
```

### Synchroniser les mises à jour

Quand vous ajoutez des features dans `dev` :

```bash
# 1. Mettez à jour share-bones
git checkout share-bones
git merge dev

# 2. Poussez vers le repo privé
git push origin share-bones

# 3. Poussez vers le repo public
git push public-template share-bones:main
```

### Avantages Option 2
- ✅ Votre design GwadaEcom reste privé
- ✅ Le template client est public (facilite le partage)
- ✅ Marketing : montre votre travail

### Inconvénients
- ❌ Gestion de 2 repositories
- ❌ Synchronisation manuelle
- ❌ Plus complexe

---

## 💡 Ma Recommandation

**GARDEZ TOUT PRIVÉ** (Option 1) pour ces raisons :

### 1. Protection de votre travail
- Votre design unique reste secret
- Vos configurations restent privées
- Personne ne peut copier votre CMS

### 2. Contrôle total
- Vous choisissez qui voit quoi
- Vous pouvez donner accès temporaire à des clients
- Vous pouvez révoquer l'accès à tout moment

### 3. Workflow pour clients

**Vous clonez share-bones et créez un NOUVEAU repo pour chaque client** :

```bash
# 1. Cloner share-bones localement
git clone -b share-bones https://github.com/seylioneldev/gwadaecom.git client-marie

cd client-marie

# 2. Créer un NOUVEAU repo sur GitHub pour le client
# Repository : "client-marie-ecommerce" (PRIVÉ ou PUBLIC selon le client)

# 3. Changer l'origine
git remote set-url origin https://github.com/seylioneldev/client-marie-ecommerce.git

# 4. Pousser
git push -u origin share-bones
git checkout -b main
git push -u origin main

# 5. Le client a maintenant son propre repository
```

**Avantages** :
- ✅ Votre repo source reste privé
- ✅ Chaque client a son propre repo
- ✅ Pas de mélange entre clients
- ✅ Vous gardez le contrôle

---

## 🚨 Choses à JAMAIS Pousser Publiquement

**Même si votre repo est privé, faites attention à** :

### Ne JAMAIS commit

- ❌ Fichiers `.env` ou `.env.local` avec vraies clés
- ❌ Clés API Stripe (secret keys)
- ❌ Clés Firebase Admin (private keys)
- ❌ Mots de passe Gmail
- ❌ Tokens d'accès
- ❌ Fichiers de configuration avec secrets

### Vérifier le .gitignore

Assurez-vous que ces fichiers sont dans `.gitignore` :

```
.env
.env.local
.env.production
.env.development
*.key
*.pem
secrets/
```

### Si vous avez committé un secret par erreur

**URGENT** :

```bash
# 1. RÉVOQUEZ immédiatement la clé exposée
# - Stripe : Générez de nouvelles clés
# - Firebase : Régénérez la clé privée
# - Gmail : Changez le mot de passe d'application

# 2. Supprimez le commit avec le secret
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env.local" \
  --prune-empty --tag-name-filter cat -- --all

# 3. Force push (ATTENTION : destructif)
git push origin --force --all

# 4. Nettoyez local
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

---

## 🔍 Vérifier la Visibilité du Repository

**Sur GitHub** :

1. Allez sur votre repository
2. En haut, à côté du nom, vous voyez :
   - 🔓 **Public** = Tout le monde peut voir
   - 🔒 **Private** = Seulement vous et vos collaborateurs

---

## 👥 Gérer les Accès Clients

### Scénario : Client veut accès au code

**Option A : Inviter comme collaborateur (déconseillé)**
- ❌ Le client voit TOUT (main, dev, share-bones)
- ❌ Le client voit votre design GwadaEcom

**Option B : Créer un repo séparé pour le client (recommandé)**
```bash
# Clonez share-bones dans un nouveau repo pour le client
git clone -b share-bones ... client-repo
# Changez l'origine vers un nouveau repo
# Donnez accès au client à CE repo seulement
```

**Option C : Forkez le repository**
- Le client fork depuis share-bones
- Il a son propre repository
- Vous gardez le contrôle de votre source

---

## 📊 Résumé des Options

| Aspect | Option 1 (Tout privé) | Option 2 (Repo séparé public) |
|--------|----------------------|-------------------------------|
| **Sécurité** | ✅ Maximum | ⚠️ Template public |
| **Simplicité** | ✅ Un seul repo | ❌ 2 repos à gérer |
| **Marketing** | ❌ Pas de visibilité | ✅ Portfolio public |
| **Contrôle** | ✅ Total | ⚠️ Template visible |
| **Recommandé pour** | Débutants, sécurité | Expérimentés, marketing |

---

## ✅ Checklist de Sécurité

Avant de vendre ou partager :

- [ ] Repository privé activé
- [ ] `.gitignore` vérifié
- [ ] Aucun secret dans le code
- [ ] Variables d'environnement documentées (mais pas les valeurs)
- [ ] Access contrôlé (collaborateurs)
- [ ] Branches protégées (optionnel)
- [ ] Logs GitHub vérifiés (qui a accès)

---

## 🎓 Questions Fréquentes

### Q : Si je rends le repo privé, est-ce que Vercel pourra toujours déployer ?

**R** : Oui ! Vercel a accès via l'intégration GitHub. Aucun problème.

### Q : Combien de collaborateurs puis-je inviter ?

**R** : Illimité sur les repos privés avec un compte GitHub gratuit.

### Q : Comment retirer l'accès à quelqu'un ?

**R** : Settings → Collaborators → Cliquez sur la personne → "Remove"

### Q : Est-ce que mes clients peuvent voir mon code si je leur donne le CMS ?

**R** : Seulement si vous leur donnez accès au repository OU si vous leur fournissez le code source. Recommandation : Créez un repo séparé pour chaque client.

---

## 📚 Ressources

- [GitHub Docs - Repository visibility](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/setting-repository-visibility)
- [GitHub Docs - Managing access](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/managing-repository-settings/managing-teams-and-people-with-access-to-your-repository)

---

**IMPORTANT** : Rendez votre repository privé DÈS MAINTENANT pour protéger votre travail !

---

**Document créé** : 2025-12-06
**Version** : 1.0
