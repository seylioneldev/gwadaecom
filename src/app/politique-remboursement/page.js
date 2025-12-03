"use client";

import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Mail,
  Package,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="p-2 hover:bg-white rounded-full transition">
            <ArrowLeft size={24} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-serif text-gray-800 mb-2">
              Politique de Remboursement
            </h1>
            <p className="text-sm text-gray-500">
              Dernière mise à jour : Décembre 2025
            </p>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
          {/* Introduction */}
          <div className="bg-[#5d6e64] text-white rounded-lg p-6">
            <p className="text-center">
              Votre satisfaction est notre priorité. Si vous n'êtes pas
              entièrement satisfait de votre achat, nous sommes là pour vous
              aider.
            </p>
          </div>

          {/* Délai de rétractation */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Clock className="text-[#5d6e64]" size={28} />
              <h2 className="text-2xl font-serif text-gray-800">
                Délai de rétractation
              </h2>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <p className="text-gray-700 mb-2">
                Vous disposez de{" "}
                <strong className="text-blue-700">14 jours calendaires</strong>{" "}
                à compter de la date de réception de votre commande pour exercer
                votre droit de rétractation.
              </p>
              <p className="text-sm text-gray-600">
                Ce délai est conforme à la législation européenne sur la
                protection des consommateurs.
              </p>
            </div>
          </section>

          {/* Conditions de retour */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Package className="text-[#5d6e64]" size={28} />
              <h2 className="text-2xl font-serif text-gray-800">
                Conditions de retour
              </h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle
                  className="text-green-500 shrink-0 mt-1"
                  size={20}
                />
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Produit non porté
                  </h3>
                  <p className="text-sm text-gray-600">
                    Le produit ne doit pas avoir été porté, lavé ou altéré de
                    quelque manière que ce soit.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle
                  className="text-green-500 shrink-0 mt-1"
                  size={20}
                />
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Emballage d'origine
                  </h3>
                  <p className="text-sm text-gray-600">
                    Le produit doit être retourné dans son emballage d'origine,
                    avec toutes les étiquettes attachées.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle
                  className="text-green-500 shrink-0 mt-1"
                  size={20}
                />
                <div>
                  <h3 className="font-semibold text-gray-800">État neuf</h3>
                  <p className="text-sm text-gray-600">
                    Le produit doit être dans un état permettant sa remise en
                    vente.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Procédure de remboursement */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="text-[#5d6e64]" size={28} />
              <h2 className="text-2xl font-serif text-gray-800">
                Comment demander un remboursement
              </h2>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-[#5d6e64]">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-[#5d6e64] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                    1
                  </span>
                  <h3 className="font-semibold text-gray-800">
                    Contactez-nous par email
                  </h3>
                </div>
                <p className="text-sm text-gray-600 ml-11">
                  Envoyez un email à{" "}
                  <a
                    href="mailto:seymlionel@gmail.com"
                    className="text-[#5d6e64] hover:underline font-medium"
                  >
                    seymlionel@gmail.com
                  </a>{" "}
                  en indiquant votre numéro de commande.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-[#5d6e64]">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-[#5d6e64] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                    2
                  </span>
                  <h3 className="font-semibold text-gray-800">
                    Indiquez votre numéro de commande
                  </h3>
                </div>
                <p className="text-sm text-gray-600 ml-11">
                  Votre numéro de commande se trouve dans l'email de
                  confirmation que vous avez reçu (format : CMD-XXXXXX).
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-[#5d6e64]">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-[#5d6e64] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                    3
                  </span>
                  <h3 className="font-semibold text-gray-800">
                    Expliquez la raison du retour
                  </h3>
                </div>
                <p className="text-sm text-gray-600 ml-11">
                  Décrivez brièvement pourquoi vous souhaitez retourner le
                  produit (taille, couleur, défaut, etc.).
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-[#5d6e64]">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-[#5d6e64] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                    4
                  </span>
                  <h3 className="font-semibold text-gray-800">
                    Recevez nos instructions
                  </h3>
                </div>
                <p className="text-sm text-gray-600 ml-11">
                  Nous vous répondrons sous <strong>24 heures ouvrées</strong>{" "}
                  avec les instructions de retour et l'adresse d'expédition.
                </p>
              </div>
            </div>
          </section>

          {/* Délais de remboursement */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Mail className="text-[#5d6e64]" size={28} />
              <h2 className="text-2xl font-serif text-gray-800">
                Délais de remboursement
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Traitement de votre demande
                </h3>
                <p className="text-2xl font-bold text-blue-600 mb-1">
                  2-3 jours
                </p>
                <p className="text-sm text-gray-600">
                  Une fois que nous avons reçu et inspecté votre retour
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Remboursement sur votre compte
                </h3>
                <p className="text-2xl font-bold text-green-600 mb-1">
                  5-10 jours
                </p>
                <p className="text-sm text-gray-600">
                  Délai bancaire après validation du remboursement
                </p>
              </div>
            </div>
          </section>

          {/* Frais de retour */}
          <section>
            <h2 className="text-2xl font-serif text-gray-800 mb-4">
              Frais de retour
            </h2>
            <div className="space-y-3">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">
                  À la charge du client
                </h3>
                <p className="text-sm text-gray-700">
                  Les frais de retour sont généralement à votre charge, sauf
                  dans les cas suivants :
                </p>
                <ul className="text-sm text-gray-700 mt-2 space-y-1 ml-4">
                  <li>• Produit défectueux ou endommagé à la réception</li>
                  <li>• Erreur dans la commande expédiée</li>
                  <li>• Problème de qualité avéré</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Pris en charge par nous
                </h3>
                <p className="text-sm text-gray-700">
                  Si le retour est dû à une erreur de notre part ou à un défaut
                  du produit, nous prenons en charge les frais de retour.
                </p>
              </div>
            </div>
          </section>

          {/* Exceptions */}
          <section>
            <h2 className="text-2xl font-serif text-gray-800 mb-4">
              Produits non remboursables
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-gray-700 mb-2">
                Pour des raisons d'hygiène et de sécurité, certains produits ne
                peuvent pas être retournés :
              </p>
              <ul className="text-sm text-gray-700 space-y-1 ml-4">
                <li>• Sous-vêtements et maillots de bain (sauf défaut)</li>
                <li>• Produits personnalisés ou sur mesure</li>
                <li>• Articles soldés ou en promotion finale</li>
              </ul>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-[#5d6e64] text-white rounded-lg p-6 text-center">
            <h2 className="text-2xl font-serif mb-3">Des questions ?</h2>
            <p className="mb-4">
              Notre équipe est à votre disposition pour toute question
              concernant les retours et remboursements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="mailto:seymlionel@gmail.com"
                className="bg-white text-[#5d6e64] px-6 py-3 rounded hover:bg-gray-100 transition font-medium"
              >
                Nous contacter par email
              </a>
              <Link
                href="/support"
                className="border border-white text-white px-6 py-3 rounded hover:bg-white hover:text-[#5d6e64] transition font-medium"
              >
                Formulaire de contact
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
