/**
 * Script pour copier les variables d'environnement au format Vercel
 * Usage: node scripts/copy-env-for-vercel.js
 *
 * Ce script lit votre fichier .env.local et génère les commandes
 * pour ajouter les variables d'environnement sur Vercel
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('\n🚀 Script de copie des variables d\'environnement pour Vercel\n');

try {
  const envPath = join(__dirname, '..', '.env.local');
  const envContent = readFileSync(envPath, 'utf-8');

  // Parser les variables
  const envVars = {};
  const lines = envContent.split('\n');

  lines.forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine === '' || trimmedLine.startsWith('#')) return;

    const equalsIndex = trimmedLine.indexOf('=');
    if (equalsIndex > 0) {
      const key = trimmedLine.substring(0, equalsIndex).trim();
      let value = trimmedLine.substring(equalsIndex + 1).trim();

      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }

      envVars[key] = value;
    }
  });

  console.log('✅ Variables d\'environnement détectées:\n');
  console.log(`📊 Total: ${Object.keys(envVars).length} variables\n`);

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('📋 FORMAT POUR DASHBOARD VERCEL (copier/coller)\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  Object.entries(envVars).forEach(([key, value]) => {
    console.log(`${key}=${value}`);
  });

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('💻 FORMAT POUR VERCEL CLI (optionnel)\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('# Installation de Vercel CLI');
  console.log('npm i -g vercel\n');
  console.log('# Connexion à Vercel');
  console.log('vercel login\n');
  console.log('# Ajout des variables (exemple)\n');
  console.log('vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production');
  console.log('# ... répétez pour chaque variable\n');

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('⚠️  IMPORTANT:\n');
  console.log('1. STRIPE restera en MODE TEST (clés pk_test_* et sk_test_*)');
  console.log('2. Aucun paiement réel ne sera traité');
  console.log('3. Après déploiement, configurez le webhook Stripe (voir DEPLOIEMENT-VERCEL.md)');
  console.log('4. Testez le paiement avec: 4242 4242 4242 4242\n');

  console.log('📚 Documentation complète: DEPLOIEMENT-VERCEL.md\n');

} catch (error) {
  console.error('❌ Erreur lors de la lecture du fichier .env.local:', error.message);
  console.error('\n💡 Assurez-vous que le fichier .env.local existe à la racine du projet.\n');
  process.exit(1);
}
