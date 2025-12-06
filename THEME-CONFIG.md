# Configuration du Thème - Perles des Îles

## Vue d'ensemble

Thème moderne et élégant pour une boutique de bijoux artisanaux de Guadeloupe, configuré et déployé sur Firestore.

---

## 🎨 Palette de Couleurs 2025

| Couleur | Code HEX | Usage |
|---------|----------|-------|
| **Or Élégant** | `#D4AF37` | Couleur principale, boutons, accents |
| **Noir Profond** | `#1A1A1A` | Header, footer, texte de contraste |
| **Beige Crème** | `#F5E6D3` | Arrière-plans sections, accents doux |
| **Blanc Cassé** | `#FEFEFE` | Fond de page principal |
| **Or Foncé** | `#C19B2B` | Hover des boutons |

---

## 🔤 Typographie

- **Titres** : Playfair Display (serif) - Élégante et raffinée
- **Corps de texte** : Lato (sans-serif) - Moderne et lisible

---

## 🏪 Informations Boutique

```
Nom         : Perles des Îles
Description : Bijoux artisanaux de Guadeloupe - Créations uniques faites main avec passion
Email       : contact@perlesdesiles.com
Téléphone   : +590 690 12 34 56
Adresse     : Pointe-à-Pitre, Guadeloupe
```

---

## 💳 Configuration E-commerce

| Paramètre | Valeur |
|-----------|--------|
| Devise | € (Euro) |
| Frais de livraison | 5,90€ |
| Livraison gratuite à partir de | 75€ |
| Taux de taxe (TVA) | 8,5% |

---

## 🏠 Structure de la Page d'Accueil

Les 7 blocs de la homepage dans l'ordre :

1. **Hero Section**
   - Titre : "Bijoux Artisanaux de Guadeloupe"
   - Sous-titre : "Créations uniques inspirées des Caraïbes, faites main avec passion"
   - Image de fond : Bijoux (Unsplash)
   - Effet : Flou 3, Assombrissement 25%

2. **Info Strip**
   - Fond : Noir (#1A1A1A)
   - Texte : "Livraison offerte dès 75€ • Retours sous 30 jours • Paiement 100% sécurisé • Créations uniques"

3. **Product Grid**
   - 12 produits par page
   - Nouveautés affichées
   - Titre : "NOUVELLES CRÉATIONS"

4. **Image Block**
   - Titre : "Artisanat d'Exception"
   - Description de l'atelier guadeloupéen
   - Image : Bijoux artisanaux

5. **Testimonials**
   - 3 témoignages clients
   - Notes : 5 étoiles chacun
   - Fond : #F9F9F9

6. **Story Section**
   - Titre : "L'Art de la Bijouterie Caribéenne"
   - Histoire du savoir-faire traditionnel
   - Fond : Beige crème (#F5E6D3)

7. **Newsletter**
   - Titre : "Rejoignez Notre Communauté"
   - Image de fond avec effet de flou
   - Fond noir avec overlay

---

## 🎨 Styles par Section

### Header
```css
Background: #1A1A1A (Noir)
Text Color: #FFFFFF (Blanc)
Promo Bar BG: #D4AF37 (Or)
Promo Bar Text: #1A1A1A (Noir)
Search Dropdown: Blanc avec texte noir
User Menu: Blanc avec texte noir
```

### Footer
```css
Background: #1A1A1A (Noir)
Text Color: #F5E6D3 (Beige crème)
```

### Boutons Principaux
```css
Background: #D4AF37 (Or)
Text: #1A1A1A (Noir)
Hover: #C19B2B (Or foncé)
```

### Blocs Homepage

| Bloc | Background | Effet |
|------|------------|-------|
| Hero | #F5E6D3 + Image | Flou 3, Sombre 25% |
| Info Strip | #1A1A1A | Aucun |
| Product Grid | #FEFEFE | Aucun |
| Image Block | #FEFEFE | Aucun |
| Testimonials | #F9F9F9 | Aucun |
| Story | #F5E6D3 | Aucun |
| Newsletter | #1A1A1A + Image | Flou 4, Sombre 50% |

---

## 🌐 Réseaux Sociaux

- Facebook : https://facebook.com/perlesdesiles
- Instagram : https://instagram.com/perlesdesiles
- Twitter : https://twitter.com/perlesdesiles

---

## 💬 Témoignages Clients

1. **Marie-Claire D.** - ⭐⭐⭐⭐⭐
   > "Des bijoux magnifiques et de qualité exceptionnelle. Le travail artisanal est remarquable, je recommande vivement !"

2. **Sophie L.** - ⭐⭐⭐⭐⭐
   > "Un savoir-faire unique ! J'ai offert un collier à ma sœur, elle était émue par la beauté et l'authenticité de la pièce."

3. **Julien M.** - ⭐⭐⭐⭐⭐
   > "Livraison rapide et soignée. Les bijoux sont encore plus beaux en vrai. Service client au top !"

---

## 🛠️ Scripts Disponibles

### Mettre à jour le thème
```bash
npm run update-theme
```

### Vérifier la configuration
```bash
npm run check-settings
```

---

## 📂 Structure Firestore

```
firestore/
└── settings/
    └── general (document)
        ├── siteName
        ├── siteDescription
        ├── email
        ├── phone
        ├── address
        ├── social/
        │   ├── facebook
        │   ├── instagram
        │   └── twitter
        ├── shop/
        │   ├── currency
        │   ├── shippingCost
        │   ├── freeShippingThreshold
        │   └── taxRate
        ├── homepage/
        │   ├── heroTitle
        │   ├── heroSubtitle
        │   ├── layout[]
        │   ├── testimonialsItems[]
        │   └── ...
        ├── headerContent/
        ├── cartPage/
        ├── checkoutPage/
        └── customStyles/
            ├── header/
            ├── footer/
            ├── page/
            ├── fonts/
            ├── buttons/
            └── homepageBlocks/
```

---

## ✅ Statut de Configuration

- ✅ Informations générales configurées
- ✅ Configuration e-commerce appliquée
- ✅ Palette de couleurs définie
- ✅ Typographie configurée
- ✅ Blocs homepage activés (7/7)
- ✅ Témoignages clients ajoutés (3)
- ✅ Réseaux sociaux configurés
- ✅ Styles header/footer personnalisés
- ✅ Document Firestore créé et vérifié

---

## 🚀 Prochaines Étapes

1. Vérifier le rendu sur le site web
2. Ajuster les images si nécessaire
3. Tester la responsivité mobile
4. Ajouter de vrais produits
5. Personnaliser davantage si besoin

---

**Dernière mise à jour** : 5 décembre 2025
**Statut** : ✅ Configuration terminée avec succès
