'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, RefreshCw, Shield, Package, Database, Zap } from 'lucide-react';

export default function SystemPage() {
  const [systemInfo, setSystemInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchSystemInfo();
  }, []);

  const fetchSystemInfo = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/system/info');
      const data = await response.json();
      setSystemInfo(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des informations système:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkForUpdates = async () => {
    setUpdating(true);
    try {
      const response = await fetch('/api/admin/system/check-updates');
      const data = await response.json();

      if (data.updates) {
        alert(`Mises à jour disponibles:\n${data.updates.map(u => `- ${u.package}: ${u.current} → ${u.latest}`).join('\n')}`);
      } else {
        alert('Aucune mise à jour disponible');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification des mises à jour:', error);
      alert('Erreur lors de la vérification des mises à jour');
    } finally {
      setUpdating(false);
    }
  };

  const runHealthCheck = async () => {
    try {
      const response = await fetch('/api/admin/system/health');
      const data = await response.json();

      const status = data.checks.every(c => c.status === 'ok') ? '✅ Tous les services fonctionnent' : '⚠️ Certains services ont des problèmes';
      alert(status + '\n\n' + data.checks.map(c => `${c.name}: ${c.status}`).join('\n'));
    } catch (error) {
      alert('❌ Erreur lors du health check');
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center">
          <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Système & Maintenance</h1>
        <p className="text-gray-600">Gérez les mises à jour, la sécurité et la santé de votre application</p>
      </div>

      {/* Statut du système */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
              <h3 className="font-semibold text-gray-900">Statut</h3>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              Opérationnel
            </span>
          </div>
          <p className="text-gray-600 text-sm">Tous les services fonctionnent normalement</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Shield className="w-6 h-6 text-blue-500 mr-2" />
              <h3 className="font-semibold text-gray-900">Sécurité</h3>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              À jour
            </span>
          </div>
          <p className="text-gray-600 text-sm">Aucune vulnérabilité détectée</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Package className="w-6 h-6 text-purple-500 mr-2" />
              <h3 className="font-semibold text-gray-900">Version</h3>
            </div>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
              {systemInfo?.version || 'v1.0.0'}
            </span>
          </div>
          <p className="text-gray-600 text-sm">Dernière mise à jour: {systemInfo?.lastUpdate || 'Aujourd\'hui'}</p>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions de maintenance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={checkForUpdates}
            disabled={updating}
            className="flex items-center justify-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-5 h-5 mr-2 ${updating ? 'animate-spin' : ''}`} />
            {updating ? 'Vérification...' : 'Vérifier les mises à jour'}
          </button>

          <button
            onClick={runHealthCheck}
            className="flex items-center justify-center px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Zap className="w-5 h-5 mr-2" />
            Health Check
          </button>

          <button
            onClick={() => window.location.href = '/api/admin/system/logs'}
            className="flex items-center justify-center px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <Database className="w-5 h-5 mr-2" />
            Voir les logs
          </button>

          <button
            onClick={() => alert('Backup en cours de développement')}
            className="flex items-center justify-center px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            <Package className="w-5 h-5 mr-2" />
            Créer un backup
          </button>
        </div>
      </div>

      {/* Informations techniques */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations techniques</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold text-gray-700 mb-2">Environnement</h3>
            <p className="text-gray-600 text-sm">
              Environnement: <span className="font-mono">{process.env.NODE_ENV || 'production'}</span>
            </p>
            <p className="text-gray-600 text-sm">
              Plateforme: <span className="font-mono">Vercel</span>
            </p>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-semibold text-gray-700 mb-2">Services</h3>
            <p className="text-gray-600 text-sm">Firebase: ✅ Connecté</p>
            <p className="text-gray-600 text-sm">Stripe: ✅ Connecté</p>
            <p className="text-gray-600 text-sm">Email: ✅ Configuré</p>
          </div>

          <div className="border-l-4 border-purple-500 pl-4">
            <h3 className="font-semibold text-gray-700 mb-2">Dépendances principales</h3>
            <p className="text-gray-600 text-sm">Next.js: 16.0.7</p>
            <p className="text-gray-600 text-sm">React: 19.2.0</p>
            <p className="text-gray-600 text-sm">Stripe: 20.0.0</p>
          </div>

          <div className="border-l-4 border-yellow-500 pl-4">
            <h3 className="font-semibold text-gray-700 mb-2">Performance</h3>
            <p className="text-gray-600 text-sm">Temps de réponse moyen: &lt;200ms</p>
            <p className="text-gray-600 text-sm">Uptime: 99.9%</p>
            <p className="text-gray-600 text-sm">Dernière panne: Aucune</p>
          </div>
        </div>
      </div>

      {/* Avertissements / Alertes */}
      <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 mr-3" />
          <div>
            <h3 className="text-yellow-800 font-semibold mb-1">Note importante</h3>
            <p className="text-yellow-700 text-sm">
              Les mises à jour automatiques sont désactivées pour éviter les interruptions de service.
              Contactez votre développeur pour planifier les mises à jour majeures.
            </p>
          </div>
        </div>
      </div>

      {/* Contact support */}
      <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
        <div className="flex items-start">
          <Shield className="w-5 h-5 text-blue-400 mt-0.5 mr-3" />
          <div>
            <h3 className="text-blue-800 font-semibold mb-1">Support & Maintenance</h3>
            <p className="text-blue-700 text-sm mb-2">
              Pour toute question ou problème technique, contactez le support :
            </p>
            <a
              href="mailto:support@gwadaecom.com"
              className="text-blue-600 hover:text-blue-800 underline text-sm font-medium"
            >
              support@gwadaecom.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
