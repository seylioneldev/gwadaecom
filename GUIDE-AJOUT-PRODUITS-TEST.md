# Guide d'Ajout de Produits de Test

Vous êtes actuellement connecté en admin. Voici comment ajouter rapidement 10 produits de test pour faire fonctionner les tests Playwright.

## Option 1: Via l'Interface Admin (RECOMMANDÉ)

### Étape 1: Cliquer sur "Ajouter un Produit"

Dans le tableau de bord admin, cliquez sur la carte **"Ajouter un Produit"**.

### Étape 2: Copier-Coller ces Produits

Créez les 10 produits suivants en copiant-collant les informations:

---

#### Produit 1: Bracelet Perles Bleues
- **Nom**: `Bracelet Perles Bleues`
- **Description**: `Magnifique bracelet en perles bleues de Guadeloupe, fait main avec amour. Parfait pour un style élégant et tropical.`
- **Prix**: `29.99`
- **Catégorie**: `Bracelets` (ou créer si n'existe pas)
- **Stock**: `15`
- **Visible**: ✅ Oui
- **Image**: Uploader une image ou laisser vide

---

#### Produit 2: Collier Coquillage Doré
- **Nom**: `Collier Coquillage Doré`
- **Description**: `Élégant collier avec pendentif coquillage doré. Inspiré des plages paradisiaques des Antilles.`
- **Prix**: `45.50`
- **Catégorie**: `Colliers`
- **Stock**: `8`
- **Visible**: ✅ Oui

---

#### Produit 3: Boucles d'Oreilles Créoles
- **Nom**: `Boucles d'Oreilles Créoles`
- **Description**: `Authentiques boucles d'oreilles créoles en argent 925. Un classique intemporel.`
- **Prix**: `35.00`
- **Catégorie**: `Boucles d'Oreilles`
- **Stock**: `12`
- **Visible**: ✅ Oui

---

#### Produit 4: Bracelet Corail Rouge
- **Nom**: `Bracelet Corail Rouge`
- **Description**: `Bracelet artisanal en perles de corail rouge. Pièce unique confectionnée par nos artisans locaux.`
- **Prix**: `52.90`
- **Catégorie**: `Bracelets`
- **Stock**: `5`
- **Visible**: ✅ Oui

---

#### Produit 5: Collier Nacre Blanche
- **Nom**: `Collier Nacre Blanche`
- **Description**: `Sublime collier en nacre blanche, symbole de pureté et d'élégance. Longueur ajustable.`
- **Prix**: `38.00`
- **Catégorie**: `Colliers`
- **Stock**: `10`
- **Visible**: ✅ Oui

---

#### Produit 6: Bague Turquoise
- **Nom**: `Bague Turquoise`
- **Description**: `Bague en argent sertie d'une pierre de turquoise véritable. Taille ajustable.`
- **Prix**: `42.00`
- **Catégorie**: `Bagues`
- **Stock**: `7`
- **Visible**: ✅ Oui

---

#### Produit 7: Parure Complète Or
- **Nom**: `Parure Complète Or`
- **Description**: `Magnifique parure complète (collier + boucles + bracelet) plaquée or 18 carats. Coffret cadeau inclus.`
- **Prix**: `125.00`
- **Catégorie**: `Parures`
- **Stock**: `3`
- **Visible**: ✅ Oui

---

#### Produit 8: Bracelet Bientôt Épuisé (TEST)
- **Nom**: `Bracelet Bientôt Épuisé`
- **Description**: `Bracelet test pour vérifier le badge "Bientôt épuisé" - Stock entre 1 et 10.`
- **Prix**: `19.99`
- **Catégorie**: `Bracelets`
- **Stock**: `3` ⚠️ Important: entre 1 et 10 pour tester le badge
- **Visible**: ✅ Oui

---

#### Produit 9: Collier Rupture Stock (TEST)
- **Nom**: `Collier Rupture Stock`
- **Description**: `Collier test pour vérifier le badge "Rupture" et le blocage du panier.`
- **Prix**: `25.00`
- **Catégorie**: `Colliers`
- **Stock**: `0` ⚠️ Important: 0 pour tester le badge rupture
- **Visible**: ✅ Oui

---

#### Produit 10: Boucles Premium
- **Nom**: `Boucles Premium`
- **Description**: `Boucles d'oreilles haut de gamme en or blanc 18 carats avec diamants. Certificat d'authenticité fourni.`
- **Prix**: `289.00`
- **Catégorie**: `Boucles d'Oreilles`
- **Stock**: `20`
- **Visible**: ✅ Oui

---

## Option 2: Via Script (Si Firebase Admin configuré)

Si vous avez configuré Firebase Admin SDK, exécutez:

```bash
node scripts/seed-test-products.js
```

---

## Vérification

Après avoir ajouté les produits:

1. Allez sur la page d'accueil: `http://localhost:3000`
2. Vous devriez voir les 10 produits affichés
3. Vérifiez les badges de stock:
   - ✅ **En stock** (vert) pour les produits avec stock > 10
   - ⚠️ **Bientôt épuisé** (orange) pour stock entre 1-10
   - ❌ **Rupture** (noir) pour stock = 0

---

## Lancer les Tests

Une fois les produits ajoutés:

```bash
# Lancer tous les tests
npx playwright test e2e/full-site-test.spec.js

# Lancer en mode visible
npx playwright test e2e/full-site-test.spec.js --headed

# Lancer en mode UI
npx playwright test e2e/full-site-test.spec.js --ui
```

---

## Catégories à Créer

Si elles n'existent pas encore, créez d'abord ces catégories via "Gérer les Catégories":

1. **Bracelets** (slug: `bracelets`)
2. **Colliers** (slug: `colliers`)
3. **Boucles d'Oreilles** (slug: `boucles-oreilles`)
4. **Bagues** (slug: `bagues`)
5. **Parures** (slug: `parures`)

---

**Temps estimé**: 10-15 minutes pour ajouter les 10 produits manuellement

**Astuce**: Vous pouvez dupliquer un produit existant et modifier juste le nom/prix/stock pour gagner du temps!
