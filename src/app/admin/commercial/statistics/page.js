/**
 * PAGE ADMIN : Statistiques
 * ===========================
 *
 * Tableau de bord des statistiques de vente et performances.
 *
 * 🆕 NOUVEAU FICHIER CRÉÉ : src/app/admin/commercial/statistics/page.js
 * DATE : 2025-11-30
 *
 * FONCTIONNALITÉS :
 * - Statistiques de ventes (CA, nombre de commandes, panier moyen)
 * - Graphiques de performance
 * - Produits les plus vendus
 * - Évolution des ventes
 */

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function StatisticsPage() {
  const { user } = useAuth();
  const [period, setPeriod] = useState("all");
  const [chartMetric, setChartMetric] = useState("revenue");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    averageBasket: 0,
    totalCustomers: 0,
    topProducts: [],
    salesSeries: [],
  });
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    const fetchAnalytics = async () => {
      if (!user) {
        setLoading(false);
        setError(
          "Vous devez être connecté en tant qu'administrateur pour voir ces statistiques."
        );
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const token = await user.getIdToken();
        const response = await fetch(
          `/api/admin/analytics?period=${encodeURIComponent(period)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || "Erreur lors du chargement des statistiques");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(
            data.error || "Erreur lors du chargement des statistiques"
          );
        }

        if (isCancelled) {
          return;
        }

        const metrics = data.metrics || {};
        const ts = data.timeSeries || {};
        const points = Array.isArray(ts.points) ? ts.points : [];

        const salesSeries = points.map((p) => ({
          key: p.key,
          date: p.date,
          label: p.label,
          total: Number(p.revenue) || 0,
          orders: Number(p.orders) || 0,
        }));

        setStats({
          totalRevenue: Number(metrics.totalRevenue) || 0,
          totalOrders: Number(metrics.totalOrders) || 0,
          averageBasket: Number(metrics.averageBasket) || 0,
          totalCustomers: Number(metrics.totalCustomers) || 0,
          topProducts: Array.isArray(metrics.topProducts)
            ? metrics.topProducts
            : [],
          salesSeries,
        });
      } catch (err) {
        if (isCancelled) {
          return;
        }
        console.error("Erreur lors du chargement des analytics admin:", err);
        setError(err.message);
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchAnalytics();

    return () => {
      isCancelled = true;
    };
  }, [user, period]);

  const series = Array.isArray(stats.salesSeries) ? stats.salesSeries : [];

  const metricKey = chartMetric === "orders" ? "orders" : "total";

  const hasChartData = series.length > 0;

  const maxValueRaw = series.reduce((max, point) => {
    const value = Number(point[metricKey]) || 0;
    return value > max ? value : max;
  }, 0);

  const maxValue = maxValueRaw > 0 ? maxValueRaw : 1;

  const periodLabelMap = {
    all: "Tout",
    "30d": "30 derniers jours",
    month: "Ce mois",
    year: "Année en cours",
  };

  const periodLabel = periodLabelMap[period] || "Tout";

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin"
            className="p-2 hover:bg-gray-200 rounded-full transition"
            title="Retour au dashboard"
          >
            <ArrowLeft size={24} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-serif text-gray-800 mb-2">
              Statistiques
            </h1>
            <p className="text-sm text-gray-500">
              Analyse des performances de votre boutique
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Chiffre d'affaires */}
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs uppercase tracking-wider text-gray-500">
                Chiffre d'affaires
              </p>
              <DollarSign className="text-green-500" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-800">
              {stats.totalRevenue.toFixed(2)} €
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs uppercase tracking-wider text-gray-500">
                Commandes
              </p>
              <ShoppingCart className="text-blue-500" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-800">
              {stats.totalOrders}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs uppercase tracking-wider text-gray-500">
                Panier moyen
              </p>
              <TrendingUp className="text-purple-500" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-800">
              {stats.averageBasket.toFixed(2)} €
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs uppercase tracking-wider text-gray-500">
                Clients
              </p>
              <Users className="text-orange-500" size={20} />
            </div>
            <p className="text-3xl font-bold text-gray-800">
              {stats.totalCustomers}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-10">
          <div className="flex items-center gap-2 mb-6 pb-4 border-b">
            <Package className="text-[#5d6e64]" size={24} />
            <h2 className="text-xl font-serif text-gray-800">
              Produits les Plus Vendus
            </h2>
          </div>

          {stats.topProducts.length === 0 ? (
            <p className="text-center text-gray-500 py-10">
              Aucune donnée de vente disponible
            </p>
          ) : (
            <div className="space-y-4">
              {stats.topProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-gray-300">
                      #{index + 1}
                    </span>
                    <div>
                      <h3 className="font-serif text-gray-800">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {product.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">
                      {product.revenue.toFixed(2)} €
                    </p>
                    <p className="text-xs text-gray-500">
                      {product.quantity} vente{product.quantity > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-serif text-gray-800 mb-4">
            Évolution des Ventes ({periodLabel})
          </h2>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="inline-flex rounded-full bg-gray-100 p-1">
              {[
                { value: "all", label: "Tout" },
                { value: "30d", label: "30 jours" },
                { value: "month", label: "Ce mois" },
                { value: "year", label: "Année en cours" },
              ].map((option) => {
                const isActive = period === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setPeriod(option.value)}
                    className={
                      "px-3 py-1 rounded-full transition-colors " +
                      (isActive
                        ? "bg-gray-900 text-white shadow-sm"
                        : "text-gray-700 hover:bg-white")
                    }
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
            <div className="inline-flex rounded-full bg-gray-100 p-1">
              {[
                { value: "revenue", label: "CA (€)" },
                { value: "orders", label: "Commandes" },
              ].map((option) => {
                const isActive = chartMetric === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setChartMetric(option.value)}
                    className={
                      "px-3 py-1 rounded-full transition-colors " +
                      (isActive
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-gray-700 hover:bg-white")
                    }
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
            {process.env.NODE_ENV !== "production" && (
              <button
                type="button"
                onClick={() => setShowDebug((prev) => !prev)}
                className="text-[11px] text-gray-500 hover:text-gray-700 underline underline-offset-2"
              >
                {showDebug ? "Masquer debug" : "Afficher debug"}
              </button>
            )}
          </div>
          {loading ? (
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-sm">Chargement des données…</p>
            </div>
          ) : !hasChartData ? (
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-sm">
                Aucune donnée disponible pour cette période.
              </p>
            </div>
          ) : (
            <div className="h-64 flex flex-col justify-between">
              <div className="flex-1 flex items-end gap-0.5 bg-linear-to-r from-blue-50 to-purple-50 rounded-lg px-3 py-4 overflow-hidden">
                {series.map((point) => {
                  const value = Number(point[metricKey]) || 0;
                  const heightPercent = maxValue ? (value / maxValue) * 100 : 0;
                  const safeHeight = Math.max(heightPercent, 4);

                  const tooltipValue =
                    metricKey === "orders"
                      ? `${value.toFixed(0)} commande${value > 1 ? "s" : ""}`
                      : `${value.toFixed(2)} €`;

                  return (
                    <div
                      key={point.key}
                      className="flex-1 flex flex-col items-center justify-end"
                    >
                      <div
                        className="w-full rounded-t-md bg-blue-500"
                        style={{ height: `${safeHeight}%` }}
                        title={tooltipValue}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="mt-2 flex text-[10px] text-gray-500 justify-between">
                {series.map((point) => (
                  <span key={point.key} className="flex-1 text-center">
                    {point.label}
                  </span>
                ))}
              </div>
            </div>
          )}
          {process.env.NODE_ENV !== "production" && showDebug && (
            <div className="mt-3 max-h-32 overflow-auto rounded bg-gray-50 p-2 text-[10px] text-gray-500">
              <div className="mb-1 font-semibold">
                Debug analytics (dev seulement)
              </div>
              <pre className="whitespace-pre-wrap break-all">
                {JSON.stringify(
                  {
                    period,
                    metricKey,
                    firstPoints: series.slice(0, 5),
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          )}
        </div>

        {/* Note */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-yellow-900 mb-2">
            ℹ️ Note
          </h3>
          <p className="text-xs text-yellow-800">
            Les données affichées sont calculées à partir des commandes validées
            (statuts payée, en préparation, expédiée, livrée) présentes dans
            votre collection Firestore "orders". Seules les ventes réellement
            payées via Stripe sont prises en compte.
          </p>
        </div>
      </div>
    </div>
  );
}
