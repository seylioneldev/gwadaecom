/**
 * Script de Seed - Produits de Test pour GwadaEcom
 *
 * Ce script ajoute des produits de test dans Firestore pour les tests Playwright
 *
 * Usage: node scripts/seed-test-products.js
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialiser Firebase Admin
const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json');

let serviceAccount;
try {
  serviceAccount = require(serviceAccountPath);
} catch (error) {
  console.error('❌ Erreur: Le fichier serviceAccountKey.json est introuvable.');
  console.error('📝 Veuillez télécharger votre clé de service depuis Firebase Console:');
  console.error('   https://console.firebase.google.com/project/gwadaecom-d4464/settings/serviceaccounts/adminsdk');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Produits de test
const testProducts = [
  {
    name: 'Bracelet Perles Bleues',
    description: 'Magnifique bracelet en perles bleues de Guadeloupe, fait main avec amour. Parfait pour un style élégant et tropical.',
    price: 29.99,
    category: 'bracelets',
    stock: 15,
    isVisible: true,
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500'
    ],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    name: 'Collier Coquillage Doré',
    description: 'Élégant collier avec pendentif coquillage doré. Inspiré des plages paradisiaques des Antilles.',
    price: 45.50,
    category: 'colliers',
    stock: 8,
    isVisible: true,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500'
    ],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    name: 'Boucles d\'Oreilles Créoles',
    description: 'Authentiques boucles d\'oreilles créoles en argent 925. Un classique intemporel.',
    price: 35.00,
    category: 'boucles-oreilles',
    stock: 12,
    isVisible: true,
    images: [
      'https://images.unsplash.com/photo-1535556116002-6281ff3e9f36?w=500',
      'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=500'
    ],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    name: 'Bracelet Corail Rouge',
    description: 'Bracelet artisanal en perles de corail rouge. Pièce unique confectionnée par nos artisans locaux.',
    price: 52.90,
    category: 'bracelets',
    stock: 5,
    isVisible: true,
    images: [
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500'
    ],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    name: 'Collier Nacre Blanche',
    description: 'Sublime collier en nacre blanche, symbole de pureté et d\'élégance. Longueur ajustable.',
    price: 38.00,
    category: 'colliers',
    stock: 10,
    isVisible: true,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500',
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=500'
    ],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    name: 'Bague Turquoise',
    description: 'Bague en argent sertie d\'une pierre de turquoise véritable. Taille ajustable.',
    price: 42.00,
    category: 'bagues',
    stock: 7,
    isVisible: true,
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500',
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500'
    ],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    name: 'Parure Complète Or',
    description: 'Magnifique parure complète (collier + boucles + bracelet) plaquée or 18 carats. Coffret cadeau inclus.',
    price: 125.00,
    category: 'parures',
    stock: 3,
    isVisible: true,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500',
      'https://images.unsplash.com/photo-1535556116002-6281ff3e9f36?w=500'
    ],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    name: 'Bracelet Bientôt Épuisé',
    description: 'Bracelet test pour vérifier le badge "Bientôt épuisé" - Stock entre 1 et 10.',
    price: 19.99,
    category: 'bracelets',
    stock: 3,
    isVisible: true,
    images: [
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500'
    ],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    name: 'Collier Rupture de Stock',
    description: 'Collier test pour vérifier le badge "Rupture" et le blocage du panier.',
    price: 25.00,
    category: 'colliers',
    stock: 0,
    isVisible: true,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500'
    ],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    name: 'Boucles d\'Oreilles Premium',
    description: 'Boucles d\'oreilles haut de gamme en or blanc 18 carats avec diamants. Certificat d\'authenticité fourni.',
    price: 289.00,
    category: 'boucles-oreilles',
    stock: 20,
    isVisible: true,
    images: [
      'https://images.unsplash.com/photo-1535556116002-6281ff3e9f36?w=500',
      'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=500'
    ],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }
];

// Catégories de test
const testCategories = [
  {
    name: 'Bracelets',
    slug: 'bracelets',
    description: 'Collection de bracelets artisanaux de Guadeloupe',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500',
    isVisible: true,
    order: 1,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    name: 'Colliers',
    slug: 'colliers',
    description: 'Colliers élégants inspirés des Antilles',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500',
    isVisible: true,
    order: 2,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    name: 'Boucles d\'Oreilles',
    slug: 'boucles-oreilles',
    description: 'Boucles d\'oreilles créoles et modernes',
    image: 'https://images.unsplash.com/photo-1535556116002-6281ff3e9f36?w=500',
    isVisible: true,
    order: 3,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    name: 'Bagues',
    slug: 'bagues',
    description: 'Bagues artisanales avec pierres précieuses',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500',
    isVisible: true,
    order: 4,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  },
  {
    name: 'Parures',
    slug: 'parures',
    description: 'Ensembles complets de bijoux assortis',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500',
    isVisible: true,
    order: 5,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  }
];

async function seedDatabase() {
  console.log('🌱 Début du seed des données de test...\n');

  try {
    // 1. Ajouter les catégories
    console.log('📁 Ajout des catégories...');
    let categoriesAdded = 0;

    for (const category of testCategories) {
      try {
        // Vérifier si la catégorie existe déjà
        const existingCategory = await db.collection('categories')
          .where('slug', '==', category.slug)
          .limit(1)
          .get();

        if (existingCategory.empty) {
          await db.collection('categories').add(category);
          console.log(`  ✅ Catégorie ajoutée: ${category.name}`);
          categoriesAdded++;
        } else {
          console.log(`  ⏭️  Catégorie existe déjà: ${category.name}`);
        }
      } catch (error) {
        console.error(`  ❌ Erreur ajout catégorie ${category.name}:`, error.message);
      }
    }

    console.log(`\n✅ ${categoriesAdded} catégories ajoutées\n`);

    // 2. Ajouter les produits
    console.log('🛍️  Ajout des produits...');
    let productsAdded = 0;

    for (const product of testProducts) {
      try {
        // Vérifier si le produit existe déjà (par nom)
        const existingProduct = await db.collection('products')
          .where('name', '==', product.name)
          .limit(1)
          .get();

        if (existingProduct.empty) {
          await db.collection('products').add(product);
          console.log(`  ✅ Produit ajouté: ${product.name} (${product.price}€, stock: ${product.stock})`);
          productsAdded++;
        } else {
          console.log(`  ⏭️  Produit existe déjà: ${product.name}`);
        }
      } catch (error) {
        console.error(`  ❌ Erreur ajout produit ${product.name}:`, error.message);
      }
    }

    console.log(`\n✅ ${productsAdded} produits ajoutés\n`);

    // 3. Statistiques finales
    const productsSnapshot = await db.collection('products').get();
    const categoriesSnapshot = await db.collection('categories').get();

    console.log('📊 Statistiques de la base de données:');
    console.log(`   - Total produits: ${productsSnapshot.size}`);
    console.log(`   - Total catégories: ${categoriesSnapshot.size}`);
    console.log('');

    // 4. Afficher les produits par statut de stock
    console.log('📦 Répartition des stocks:');
    let enStock = 0;
    let bientotEpuise = 0;
    let rupture = 0;

    productsSnapshot.forEach(doc => {
      const stock = doc.data().stock || 0;
      if (stock > 10) enStock++;
      else if (stock > 0) bientotEpuise++;
      else rupture++;
    });

    console.log(`   - En stock (>10): ${enStock}`);
    console.log(`   - Bientôt épuisé (1-10): ${bientotEpuise}`);
    console.log(`   - Rupture (0): ${rupture}`);
    console.log('');

    console.log('✅ Seed terminé avec succès!\n');
    console.log('🎯 Vous pouvez maintenant exécuter les tests Playwright:\n');
    console.log('   npx playwright test e2e/full-site-test.spec.js\n');

  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
    process.exit(1);
  } finally {
    // Fermer la connexion
    process.exit(0);
  }
}

// Exécuter le seed
seedDatabase();
