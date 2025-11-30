/**
 * CONFIGURATION PLAYWRIGHT
 * =========================
 *
 * Configuration des tests E2E pour l'application Next.js.
 *
 * 🆕 NOUVEAU FICHIER CRÉÉ : playwright.config.js
 * DATE : 2025-11-30
 */

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Dossier contenant les tests
  testDir: './e2e',

  // Timeout pour chaque test (30 secondes)
  timeout: 30000,

  // Timeout pour les assertions (5 secondes)
  expect: {
    timeout: 5000
  },

  // Exécuter les tests en parallèle
  fullyParallel: true,

  // Réessayer les tests échoués en CI
  retries: process.env.CI ? 2 : 0,

  // Nombre de workers (processus parallèles)
  workers: process.env.CI ? 1 : undefined,

  // Reporter pour afficher les résultats
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list']
  ],

  // Configuration partagée pour tous les tests
  use: {
    // URL de base de l'application
    baseURL: 'http://localhost:3000',

    // Prendre une capture d'écran en cas d'échec
    screenshot: 'only-on-failure',

    // Enregistrer une trace vidéo en cas d'échec
    trace: 'on-first-retry',

    // Viewport par défaut
    viewport: { width: 1280, height: 720 },
  },

  // Navigateurs sur lesquels exécuter les tests
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Serveur de développement Next.js
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
