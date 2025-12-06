/**
 * Script pour vérifier les paramètres Firestore actuels
 * Usage: node scripts/check-settings.js
 */

import admin from 'firebase-admin';

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

      console.log('✅ Firebase Admin SDK initialisé\n');
    } catch (error) {
      console.error('❌ Erreur initialisation Firebase Admin:', error.message);
      process.exit(1);
    }
  }
};

// Fonction pour afficher les paramètres actuels
const checkSettings = async () => {
  try {
    console.log('🔍 Vérification des paramètres Firestore...\n');

    initializeFirebaseAdmin();

    const db = admin.firestore();
    const settingsRef = db.collection('settings').doc('general');
    const doc = await settingsRef.get();

    if (!doc.exists) {
      console.log('❌ Le document settings/general n\'existe pas encore');
      process.exit(1);
    }

    const data = doc.data();

    console.log('📋 INFORMATIONS GÉNÉRALES');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Site Name:        ${data.siteName || 'Non défini'}`);
    console.log(`Description:      ${data.siteDescription || 'Non défini'}`);
    console.log(`Email:            ${data.email || 'Non défini'}`);
    console.log(`Téléphone:        ${data.phone || 'Non défini'}`);
    console.log(`Adresse:          ${data.address || 'Non défini'}`);

    console.log('\n💰 CONFIGURATION E-COMMERCE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    if (data.shop) {
      console.log(`Devise:           ${data.shop.currency}`);
      console.log(`Frais livraison:  ${data.shop.shippingCost}€`);
      console.log(`Franco port:      ${data.shop.freeShippingThreshold}€`);
      console.log(`Taux de taxe:     ${data.shop.taxRate}%`);
    } else {
      console.log('Non configuré');
    }

    console.log('\n🎨 STYLES PERSONNALISÉS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    if (data.customStyles) {
      console.log('Header:');
      console.log(`  - BG Color:     ${data.customStyles.header?.backgroundColor || 'Non défini'}`);
      console.log(`  - Text Color:   ${data.customStyles.header?.textColor || 'Non défini'}`);
      console.log(`  - Promo Bar BG: ${data.customStyles.header?.promoBarBgColor || 'Non défini'}`);

      console.log('\nPage:');
      console.log(`  - BG Color:     ${data.customStyles.page?.backgroundColor || 'Non défini'}`);
      console.log(`  - Primary:      ${data.customStyles.page?.primaryColor || 'Non défini'}`);

      console.log('\nPolices:');
      console.log(`  - Titres:       ${data.customStyles.fonts?.headingFont || 'Non défini'}`);
      console.log(`  - Corps:        ${data.customStyles.fonts?.bodyFont || 'Non défini'}`);

      console.log('\nBoutons:');
      console.log(`  - BG:           ${data.customStyles.buttons?.primaryBgColor || 'Non défini'}`);
      console.log(`  - Text:         ${data.customStyles.buttons?.primaryTextColor || 'Non défini'}`);
      console.log(`  - Hover:        ${data.customStyles.buttons?.primaryHoverBgColor || 'Non défini'}`);
    } else {
      console.log('Non configuré');
    }

    console.log('\n🏠 PAGE D\'ACCUEIL');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    if (data.homepage) {
      console.log(`Hero Titre:       ${data.homepage.heroTitle || 'Non défini'}`);
      console.log(`Hero Sous-titre:  ${data.homepage.heroSubtitle || 'Non défini'}`);
      console.log(`Produits/page:    ${data.homepage.productsPerPage || 'Non défini'}`);
      console.log(`Nouveautés:       ${data.homepage.showNewArrivals ? 'Oui' : 'Non'}`);

      console.log('\nBlocs actifs:');
      if (data.homepage.layout) {
        data.homepage.layout.forEach((block, index) => {
          const status = block.enabled ? '✅' : '❌';
          console.log(`  ${index + 1}. ${status} ${block.type} (${block.id})`);
        });
      }

      console.log('\nTémoignages:');
      if (data.homepage.testimonialsItems) {
        console.log(`  Nombre: ${data.homepage.testimonialsItems.length}`);
        data.homepage.testimonialsItems.forEach((testimonial, index) => {
          console.log(`  ${index + 1}. ${testimonial.name} - ${testimonial.rating}⭐`);
        });
      }
    } else {
      console.log('Non configuré');
    }

    console.log('\n🌐 RÉSEAUX SOCIAUX');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    if (data.social) {
      console.log(`Facebook:         ${data.social.facebook || 'Non défini'}`);
      console.log(`Instagram:        ${data.social.instagram || 'Non défini'}`);
      console.log(`Twitter:          ${data.social.twitter || 'Non défini'}`);
    } else {
      console.log('Non configuré');
    }

    console.log('\n✅ Vérification terminée!\n');

  } catch (error) {
    console.error('\n❌ Erreur lors de la vérification:', error);
    console.error('Détails:', error.message);
    process.exit(1);
  } finally {
    await admin.app().delete();
  }
};

// Exécution du script
checkSettings();
