/**
 * Script pour mettre à jour les paramètres Firestore
 * Thème moderne et élégant pour boutique de bijoux artisanaux de Guadeloupe
 *
 * Usage: node scripts/update-theme-settings.js
 */

import admin from 'firebase-admin';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration Firebase Admin
const initializeFirebaseAdmin = () => {
  if (!admin.apps.length) {
    try {
      const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
      const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

      if (!projectId || !clientEmail || !privateKey) {
        throw new Error('Variables d\'environnement Firebase Admin manquantes');
      }

      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });

      console.log('✅ Firebase Admin SDK initialisé');
    } catch (error) {
      console.error('❌ Erreur initialisation Firebase Admin:', error.message);
      process.exit(1);
    }
  }
};

// Configuration du thème
const themeSettings = {
  siteName: "Perles des Îles",
  siteDescription: "Bijoux artisanaux de Guadeloupe - Créations uniques faites main avec passion",
  email: "contact@perlesdesiles.com",
  phone: "+590 690 12 34 56",
  address: "Pointe-à-Pitre, Guadeloupe",

  social: {
    facebook: "https://facebook.com/perlesdesiles",
    instagram: "https://instagram.com/perlesdesiles",
    twitter: "https://twitter.com/perlesdesiles"
  },

  shop: {
    currency: "€",
    shippingCost: 5.90,
    freeShippingThreshold: 75,
    taxRate: 8.5
  },

  homepage: {
    heroTitle: "Bijoux Artisanaux de Guadeloupe",
    heroSubtitle: "Créations uniques inspirées des Caraïbes, faites main avec passion",
    heroCtaLabel: "Découvrir la Collection",
    heroCtaLink: "/category/shop-brand",
    productsPerPage: 12,
    showNewArrivals: true,
    newArrivalsTitle: "NOUVELLES CRÉATIONS",
    newArrivalsSubtitle: "Nos dernières pièces artisanales",
    infoStripText: "Livraison offerte dès 75€ • Retours sous 30 jours • Paiement 100% sécurisé • Créations uniques",
    storyTitle: "L'Art de la Bijouterie Caribéenne",
    storyText: "Chaque bijou raconte une histoire. Nos créations allient le savoir-faire traditionnel guadeloupéen aux tendances contemporaines. Des matériaux nobles, des pierres naturelles et une attention méticuleuse aux détails pour des pièces qui vous ressemblent.",
    newsletterTitle: "Rejoignez Notre Communauté",
    newsletterSubtitle: "Recevez en exclusivité nos nouvelles collections et profitez d'offres privilégiées",
    newsletterCtaLabel: "S'inscrire",
    newsletterPlaceholder: "Votre adresse email",
    imageBlockImageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=600&fit=crop",
    imageBlockTitle: "Artisanat d'Exception",
    imageBlockSubtitle: "Découvrez l'authenticité de nos créations faites main dans notre atelier guadeloupéen. Chaque pièce est unique et reflète la richesse de notre patrimoine caribéen.",
    testimonialsTitle: "Ils Nous Font Confiance",
    testimonialsItems: [
      {
        name: "Marie-Claire D.",
        text: "Des bijoux magnifiques et de qualité exceptionnelle. Le travail artisanal est remarquable, je recommande vivement !",
        rating: 5
      },
      {
        name: "Sophie L.",
        text: "Un savoir-faire unique ! J'ai offert un collier à ma sœur, elle était émue par la beauté et l'authenticité de la pièce.",
        rating: 5
      },
      {
        name: "Julien M.",
        text: "Livraison rapide et soignée. Les bijoux sont encore plus beaux en vrai. Service client au top !",
        rating: 5
      }
    ],
    layout: [
      { id: "hero", type: "hero", enabled: true },
      { id: "infoStrip", type: "infoStrip", enabled: true },
      { id: "productGrid", type: "productGrid", enabled: true },
      { id: "imageBlock", type: "imageBlock", enabled: true },
      { id: "testimonials", type: "testimonials", enabled: true },
      { id: "story", type: "story", enabled: true },
      { id: "newsletter", type: "newsletter", enabled: true }
    ]
  },

  headerContent: {
    promoBarLabel: "NOUVEAU",
    promoBarText: "Collection été 2025 disponible - Livraison offerte dès 75€",
    promoBarButtonLabel: "Découvrir"
  },

  cartPage: {
    title: "Mon Panier",
    continueShoppingLinkLabel: "Continuer mes achats",
    emptyTitle: "Votre panier est vide",
    emptySubtitle: "Découvrez nos créations uniques et ajoutez vos coups de cœur",
    emptyCtaLabel: "Voir la Collection"
  },

  checkoutPage: {
    title: "Finaliser ma Commande",
    choiceTitle: "Comment souhaitez-vous commander ?",
    guestTitle: "Commander en tant qu'invité",
    guestSubtitle: "Commandez rapidement sans créer de compte"
  },

  customStyles: {
    header: {
      backgroundColor: "#1A1A1A",
      textColor: "#FFFFFF",
      searchDropdownTextColor: "#1A1A1A",
      searchDropdownBgColor: "#FFFFFF",
      promoBarBgColor: "#D4AF37",
      promoBarTextColor: "#1A1A1A",
      userMenuBgColor: "#FFFFFF",
      userMenuTextColor: "#1A1A1A"
    },
    footer: {
      backgroundColor: "#1A1A1A",
      textColor: "#F5E6D3"
    },
    page: {
      backgroundColor: "#FEFEFE",
      primaryColor: "#D4AF37"
    },
    fonts: {
      headingFont: '"Playfair Display", serif',
      bodyFont: '"Lato", sans-serif'
    },
    buttons: {
      primaryBgColor: "#D4AF37",
      primaryTextColor: "#1A1A1A",
      primaryHoverBgColor: "#C19B2B"
    },
    homepageBlocks: {
      heroBgColor: "#F5E6D3",
      heroBgImageUrl: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=1920&h=800&fit=crop",
      heroBgBlur: 3,
      heroBgDarken: 25,
      heroContentBgColor: "#FFFFFF",
      heroContentBgImageUrl: "",
      heroContentBgBlur: 0,
      heroContentBgDarken: 0,
      productGridBgColor: "#FEFEFE",
      productGridBgImageUrl: "",
      productGridBgBlur: 0,
      productGridBgDarken: 0,
      infoStripBgColor: "#1A1A1A",
      infoStripBgImageUrl: "",
      infoStripBgBlur: 0,
      infoStripBgDarken: 0,
      storyBgColor: "#F5E6D3",
      storyBgImageUrl: "",
      storyBgBlur: 0,
      storyBgDarken: 0,
      newsletterBgColor: "#1A1A1A",
      newsletterBgImageUrl: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&h=600&fit=crop",
      newsletterBgBlur: 4,
      newsletterBgDarken: 50,
      imageBlockBgColor: "#FEFEFE",
      imageBlockBgImageUrl: "",
      imageBlockBgBlur: 0,
      imageBlockBgDarken: 0,
      testimonialsBgColor: "#F9F9F9",
      testimonialsBgImageUrl: "",
      testimonialsBgBlur: 0,
      testimonialsBgDarken: 0
    }
  }
};

// Fonction principale pour mettre à jour Firestore
const updateFirestoreSettings = async () => {
  try {
    console.log('🚀 Début de la mise à jour des paramètres Firestore...\n');

    initializeFirebaseAdmin();

    const db = admin.firestore();
    const settingsRef = db.collection('settings').doc('general');

    console.log('📝 Configuration du thème :');
    console.log('   - Site: Perles des Îles');
    console.log('   - Couleur principale: #D4AF37 (Or élégant)');
    console.log('   - Couleur secondaire: #1A1A1A (Noir profond)');
    console.log('   - Couleur accent: #F5E6D3 (Beige crème)\n');

    // Mise à jour du document avec merge pour préserver les champs existants
    await settingsRef.set(themeSettings, { merge: true });

    console.log('✅ Document Firestore mis à jour avec succès!\n');

    // Vérification de la mise à jour
    console.log('🔍 Vérification de la mise à jour...');
    const doc = await settingsRef.get();

    if (doc.exists) {
      const data = doc.data();
      console.log('✅ Vérification réussie!');
      console.log('\n📊 Résumé de la configuration:');
      console.log(`   - Nom du site: ${data.siteName}`);
      console.log(`   - Email: ${data.email}`);
      console.log(`   - Téléphone: ${data.phone}`);
      console.log(`   - Couleur principale: ${data.customStyles?.page?.primaryColor}`);
      console.log(`   - Couleur header: ${data.customStyles?.header?.backgroundColor}`);
      console.log(`   - Police titres: ${data.customStyles?.fonts?.headingFont}`);
      console.log(`   - Police corps: ${data.customStyles?.fonts?.bodyFont}`);
      console.log(`   - Nombre de témoignages: ${data.homepage?.testimonialsItems?.length}`);
      console.log(`   - Blocs homepage: ${data.homepage?.layout?.length}`);
      console.log('\n🎉 Thème "Perles des Îles" configuré avec succès!');
    } else {
      console.log('⚠️ Le document existe mais les données sont vides');
    }

  } catch (error) {
    console.error('\n❌ Erreur lors de la mise à jour:', error);
    console.error('Détails:', error.message);
    process.exit(1);
  } finally {
    // Fermer la connexion
    await admin.app().delete();
    console.log('\n👋 Connexion Firebase fermée');
  }
};

// Exécution du script
updateFirestoreSettings();
