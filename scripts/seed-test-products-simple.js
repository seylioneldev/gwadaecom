/**
 * Script de Seed Simple - Produits de Test
 * Utilise les credentials Firebase client
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';

// Configuration Firebase depuis .env.local
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Produits de test
const testProducts = [
  {
    name: 'Bracelet Perles Bleues',
    description: 'Magnifique bracelet en perles bleues de Guadeloupe, fait main avec amour.',
    price: 29.99,
    category: 'bracelets',
    stock: 15,
    isVisible: true,
    images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500'],
  },
  {
    name: 'Collier Coquillage Doré',
    description: 'Élégant collier avec pendentif coquillage doré.',
    price: 45.50,
    category: 'colliers',
    stock: 8,
    isVisible: true,
    images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500'],
  },
  {
    name: 'Boucles d\'Oreilles Créoles',
    description: 'Authentiques boucles d\'oreilles créoles en argent 925.',
    price: 35.00,
    category: 'boucles-oreilles',
    stock: 12,
    isVisible: true,
    images: ['https://images.unsplash.com/photo-1535556116002-6281ff3e9f36?w=500'],
  },
  {
    name: 'Bracelet Corail Rouge',
    description: 'Bracelet artisanal en perles de corail rouge.',
    price: 52.90,
    category: 'bracelets',
    stock: 5,
    isVisible: true,
    images: ['https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500'],
  },
  {
    name: 'Collier Nacre Blanche',
    description: 'Sublime collier en nacre blanche.',
    price: 38.00,
    category: 'colliers',
    stock: 10,
    isVisible: true,
    images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500'],
  },
  {
    name: 'Bague Turquoise',
    description: 'Bague en argent sertie d\'une pierre de turquoise.',
    price: 42.00,
    category: 'bagues',
    stock: 7,
    isVisible: true,
    images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500'],
  },
  {
    name: 'Parure Complète Or',
    description: 'Magnifique parure complète plaquée or 18 carats.',
    price: 125.00,
    category: 'parures',
    stock: 3,
    isVisible: true,
    images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500'],
  },
  {
    name: 'Bracelet Bientôt Épuisé',
    description: 'Test badge "Bientôt épuisé" - Stock entre 1 et 10.',
    price: 19.99,
    category: 'bracelets',
    stock: 3,
    isVisible: true,
    images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500'],
  },
  {
    name: 'Collier Rupture Stock',
    description: 'Test badge "Rupture" et blocage panier.',
    price: 25.00,
    category: 'colliers',
    stock: 0,
    isVisible: true,
    images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500'],
  },
  {
    name: 'Boucles Premium',
    description: 'Boucles d\'oreilles en or blanc 18 carats.',
    price: 289.00,
    category: 'boucles-oreilles',
    stock: 20,
    isVisible: true,
    images: ['https://images.unsplash.com/photo-1535556116002-6281ff3e9f36?w=500'],
  }
];

async function seedProducts() {
  console.log('🌱 Ajout des produits de test...\n');

  let added = 0;
  let skipped = 0;

  for (const product of testProducts) {
    try {
      // Vérifier si le produit existe déjà
      const q = query(collection(db, 'products'), where('name', '==', product.name));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        const productData = {
          ...product,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };

        await addDoc(collection(db, 'products'), productData);
        console.log(`✅ ${product.name} (${product.price}€, stock: ${product.stock})`);
        added++;
      } else {
        console.log(`⏭️  ${product.name} (existe déjà)`);
        skipped++;
      }
    } catch (error) {
      console.error(`❌ Erreur: ${product.name}:`, error.message);
    }
  }

  console.log(`\n✅ Terminé: ${added} ajoutés, ${skipped} ignorés\n`);
}

seedProducts()
  .then(() => {
    console.log('🎯 Vous pouvez maintenant lancer les tests!\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Erreur:', error);
    process.exit(1);
  });
