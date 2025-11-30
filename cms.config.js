/**
 * ============================================
 * CONFIGURATION DU CMS RÉUTILISABLE
 * ============================================
 *
 * Ce fichier permet de configurer facilement le CMS pour n'importe quel projet.
 * Pour réutiliser ce CMS sur un autre projet, modifiez simplement ce fichier.
 *
 * 🆕 NOUVEAU FICHIER CRÉÉ : cms.config.js
 * DATE : 2025-11-30
 */

const cmsConfig = {
  // ============================================
  // INFORMATIONS DU PROJET
  // ============================================
  project: {
    name: "Vivi et Margot",
    description: "Boutique en ligne d'artisanat",
    url: "https://vivi-et-margot.com",
    logo: "/logo.png", // Chemin vers le logo (à ajouter dans /public)
  },

  // ============================================
  // THÈME ET COULEURS
  // ============================================
  theme: {
    primaryColor: "#5d6e64",      // Couleur principale (vert)
    primaryColorHover: "#4a5850", // Couleur au survol
    secondaryColor: "#E5E5E5",    // Couleur secondaire (gris clair)
    backgroundColor: "#f0f0f0",   // Couleur de fond
    textColor: "#333333",         // Couleur du texte

    // Police de caractères
    fontFamily: {
      serif: "serif",     // Pour les titres
      sansSerif: "sans-serif", // Pour le texte normal
    },
  },

  // ============================================
  // COLLECTIONS FIRESTORE
  // ============================================
  // Définit les noms des collections dans Firestore
  // Modifier ces noms si vous voulez une structure différente
  collections: {
    products: "products",       // Collection des produits
    categories: "categories",   // Collection des catégories du menu
    settings: "settings",       // Collection des paramètres généraux
    orders: "orders",           // Collection des commandes (futur)
    pages: "pages",             // Collection des pages statiques (futur)
  },

  // ============================================
  // CATÉGORIES PAR DÉFAUT
  // ============================================
  // Catégories créées automatiquement lors de l'initialisation
  defaultCategories: [
    {
      name: "Kitchen",
      slug: "kitchen",
      order: 1,
      visible: true,
      description: "Ustensiles et accessoires de cuisine",
    },
    {
      name: "Baskets",
      slug: "baskets",
      order: 2,
      visible: true,
      description: "Paniers artisanaux",
    },
    {
      name: "Decoration",
      slug: "decoration",
      order: 3,
      visible: true,
      description: "Objets de décoration",
    },
    {
      name: "Accessories",
      slug: "accessories",
      order: 4,
      visible: true,
      description: "Accessoires divers",
    },
  ],

  // ============================================
  // CHAMPS PERSONNALISÉS POUR LES PRODUITS
  // ============================================
  // Définit les champs disponibles pour les produits
  // Utile pour personnaliser le CMS selon vos besoins
  productFields: {
    required: [
      { name: "name", label: "Nom du produit", type: "text" },
      { name: "price", label: "Prix (€)", type: "number" },
      { name: "category", label: "Catégorie", type: "select" },
      { name: "description", label: "Description", type: "textarea" },
    ],
    optional: [
      { name: "imageUrl", label: "Image (URL)", type: "text" },
      { name: "stock", label: "Stock disponible", type: "number" },
      { name: "label", label: "Badge (ex: Sold Out)", type: "text" },
      { name: "featured", label: "Produit vedette", type: "checkbox" },
    ],
  },

  // ============================================
  // PARAMÈTRES GÉNÉRAUX DU SITE
  // ============================================
  // Paramètres modifiables depuis l'admin
  defaultSettings: {
    siteName: "Vivi et Margot",
    siteDescription: "Boutique en ligne d'artisanat de qualité",
    email: "contact@vivi-et-margot.com",
    phone: "+33 6 12 34 56 78",
    address: "123 Rue de l'Artisanat, 75001 Paris",

    // Réseaux sociaux
    social: {
      facebook: "",
      instagram: "",
      twitter: "",
    },

    // Paramètres de la boutique
    shop: {
      currency: "€",
      shippingCost: 5.00,
      freeShippingThreshold: 50.00,
      taxRate: 20, // TVA en %
    },

    // Page d'accueil
    homepage: {
      heroTitle: "Bienvenue chez Vivi et Margot",
      heroSubtitle: "Découvrez notre collection d'artisanat",
      showNewArrivals: true,
      productsPerPage: 9,
    },
  },

  // ============================================
  // CONFIGURATION ADMIN
  // ============================================
  admin: {
    menuItems: [
      { name: "Dashboard", path: "/admin", icon: "home" },
      { name: "Produits", path: "/admin/products", icon: "package" },
      { name: "Catégories", path: "/admin/categories", icon: "folder" },
      { name: "Paramètres", path: "/admin/settings", icon: "settings" },
    ],
  },

  // ============================================
  // RÈGLES FIRESTORE (Pour référence)
  // ============================================
  // Ces règles doivent être configurées dans Firebase Console
  firestoreRules: `
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        // Products - Lecture publique, écriture admin
        match /products/{productId} {
          allow read: if true;
          allow write: if request.auth != null;
        }

        // Categories - Lecture publique, écriture admin
        match /categories/{categoryId} {
          allow read: if true;
          allow write: if request.auth != null;
        }

        // Settings - Lecture publique, écriture admin
        match /settings/{settingId} {
          allow read: if true;
          allow write: if request.auth != null;
        }

        // Orders - Lecture/écriture uniquement pour l'utilisateur connecté
        match /orders/{orderId} {
          allow read, write: if request.auth != null;
        }
      }
    }
  `,
};

// Export pour utilisation dans les composants
export default cmsConfig;

/**
 * ============================================
 * GUIDE DE RÉUTILISATION
 * ============================================
 *
 * Pour réutiliser ce CMS sur un autre projet :
 *
 * 1. Copiez tous les fichiers suivants :
 *    - cms.config.js (ce fichier)
 *    - src/hooks/useProducts.js
 *    - src/hooks/useCategories.js (à créer)
 *    - src/hooks/useSettings.js (à créer)
 *    - src/app/admin/ (tout le dossier)
 *
 * 2. Configurez Firebase :
 *    - Créez un nouveau projet Firebase
 *    - Ajoutez les clés dans .env.local
 *    - Configurez les règles Firestore (voir ci-dessus)
 *
 * 3. Personnalisez cms.config.js :
 *    - Changez project.name
 *    - Modifiez les couleurs du thème
 *    - Adaptez les catégories par défaut
 *    - Personnalisez les champs de produits si besoin
 *
 * 4. Initialisez Firestore :
 *    - Créez les collections manuellement ou via un script
 *    - Ajoutez les catégories par défaut
 *
 * 5. C'est prêt ! 🚀
 *
 * ============================================
 */
