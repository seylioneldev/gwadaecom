# Scripts de Configuration

Ce dossier contient les scripts utilitaires pour configurer et gérer la boutique e-commerce.

## update-theme-settings.js

Script pour mettre à jour le thème et la configuration générale de la boutique dans Firestore.

### Usage

```bash
npm run update-theme
```

### Configuration appliquée

#### Thème "Perles des Îles" - Boutique de Bijoux Artisanaux de Guadeloupe

**Palette de couleurs 2025 :**
- **Or élégant** (#D4AF37) - Couleur principale
- **Noir profond** (#1A1A1A) - Couleur secondaire
- **Beige crème** (#F5E6D3) - Couleur accent
- **Blanc cassé** (#FEFEFE) - Fond de page

**Polices :**
- Titres : Playfair Display (serif, élégante)
- Corps de texte : Lato (sans-serif, moderne)

**Informations de la boutique :**
- Nom : Perles des Îles
- Email : contact@perlesdesiles.com
- Téléphone : +590 690 12 34 56
- Adresse : Pointe-à-Pitre, Guadeloupe

**Configuration e-commerce :**
- Devise : €
- Frais de livraison : 5,90€
- Livraison gratuite à partir de : 75€
- Taux de taxe : 8,5%

**Blocs de la page d'accueil :**
1. Hero avec image de fond
2. Bande d'informations (livraison, retours, sécurité)
3. Grille de produits (12 par page)
4. Bloc image avec description de l'artisanat
5. Témoignages clients (3 avis)
6. Section histoire/story
7. Newsletter

### Prérequis

Les variables d'environnement suivantes doivent être configurées dans `.env.local` :

```
FIREBASE_ADMIN_PROJECT_ID=votre-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=votre-client-email
FIREBASE_ADMIN_PRIVATE_KEY=votre-private-key
```

### Structure Firestore

Le script met à jour le document :
```
Collection: settings
Document: general
```

Avec la structure complète incluant :
- Informations générales du site
- Configuration e-commerce
- Contenu de la page d'accueil
- Styles personnalisés (header, footer, couleurs, polices)
- Configuration des blocs de la homepage

### Vérification

Après l'exécution, le script affiche :
- Confirmation de la mise à jour
- Résumé de la configuration appliquée
- Vérification que les données ont bien été enregistrées

### Notes

- Le script utilise `set({ merge: true })` pour préserver les champs existants
- La connexion Firebase Admin est automatiquement fermée après l'exécution
- En cas d'erreur, le processus se termine avec un code d'erreur et affiche les détails
