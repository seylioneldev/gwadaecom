"use client";

import { useState } from "react";
import { ArrowLeft, Mail, Send, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    orderNumber: "",
    subject: "refund",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Envoyer l'email via l'API
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        // Réinitialiser le formulaire après 3 secondes
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({
            name: "",
            email: "",
            orderNumber: "",
            subject: "refund",
            message: "",
          });
        }, 3000);
      } else {
        alert(
          "Erreur lors de l'envoi du message. Veuillez réessayer ou nous contacter directement par email."
        );
        console.error("Erreur:", data.error);
      }
    } catch (error) {
      alert(
        "Erreur lors de l'envoi du message. Veuillez réessayer ou nous contacter directement par email."
      );
      console.error("Erreur:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
              Contact & Support
            </h1>
            <p className="text-sm text-gray-500">
              Nous sommes là pour vous aider
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Colonne gauche - Informations */}
          <div className="md:col-span-1 space-y-6">
            {/* Contact Email */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="text-[#5d6e64]" size={24} />
                <h2 className="font-semibold text-gray-800">
                  Email de contact
                </h2>
              </div>
              <a
                href="mailto:seymlionel@gmail.com"
                className="text-[#5d6e64] hover:underline font-medium"
              >
                seymlionel@gmail.com
              </a>
              <p className="text-sm text-gray-500 mt-2">
                Réponse sous 24h ouvrées
              </p>
            </div>

            {/* Liens rapides */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="font-semibold text-gray-800 mb-4">Liens utiles</h2>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/politique-remboursement"
                    className="text-[#5d6e64] hover:underline"
                  >
                    Politique de remboursement
                  </Link>
                </li>
                <li>
                  <Link
                    href="/compte/commandes"
                    className="text-[#5d6e64] hover:underline"
                  >
                    Mes commandes
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-[#5d6e64] hover:underline">
                    Retour à l'accueil
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Colonne droite - Formulaire */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-serif text-gray-800 mb-6">
                Formulaire de contact
              </h2>

              {isSubmitted ? (
                <div className="text-center py-12">
                  <CheckCircle
                    size={64}
                    className="text-green-500 mx-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Message envoyé !
                  </h3>
                  <p className="text-gray-600">
                    Nous vous répondrons dans les plus brefs délais.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nom */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#5d6e64] focus:border-transparent outline-none"
                      placeholder="Votre nom"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#5d6e64] focus:border-transparent outline-none"
                      placeholder="votre@email.com"
                    />
                  </div>

                  {/* Numéro de commande */}
                  <div>
                    <label
                      htmlFor="orderNumber"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Numéro de commande
                    </label>
                    <input
                      type="text"
                      id="orderNumber"
                      name="orderNumber"
                      value={formData.orderNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#5d6e64] focus:border-transparent outline-none"
                      placeholder="Ex: CMD-123456"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Optionnel - Utile pour les demandes liées à une commande
                    </p>
                  </div>

                  {/* Sujet */}
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Sujet *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#5d6e64] focus:border-transparent outline-none"
                    >
                      <option value="refund">Demande de remboursement</option>
                      <option value="return">Retour de produit</option>
                      <option value="order">Question sur ma commande</option>
                      <option value="product">Question sur un produit</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows="6"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#5d6e64] focus:border-transparent outline-none resize-none"
                      placeholder="Décrivez votre demande en détail..."
                    />
                  </div>

                  {/* Section Remboursement */}
                  {formData.subject === "refund" && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-800 mb-2 text-sm">
                        📋 Informations importantes pour un remboursement
                      </h3>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• Indiquez votre numéro de commande</li>
                        <li>• Expliquez la raison du retour</li>
                        <li>
                          • Le produit doit être non porté et dans son emballage
                          d'origine
                        </li>
                        <li>
                          • Délai de rétractation : 14 jours après réception
                        </li>
                      </ul>
                    </div>
                  )}

                  {/* Bouton Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#5d6e64] text-white py-3 rounded hover:bg-[#4a5850] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Envoyer le message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Section Retours et Remboursements */}
            <div className="bg-white rounded-lg shadow-md p-8 mt-6">
              <h2 className="text-2xl font-serif text-gray-800 mb-4">
                Retours et Remboursements
              </h2>

              <div className="space-y-4 text-gray-700">
                <div>
                  <h3 className="font-semibold mb-2">Délai de rétractation</h3>
                  <p className="text-sm">
                    Vous disposez de <strong>14 jours</strong> à compter de la
                    réception de votre commande pour nous retourner un produit.
                    Le produit doit être non porté et dans son emballage
                    d'origine.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">
                    Comment demander un remboursement ?
                  </h3>
                  <ol className="text-sm space-y-1 list-decimal list-inside">
                    <li>
                      Envoyez un email à{" "}
                      <a
                        href="mailto:seymlionel@gmail.com"
                        className="text-[#5d6e64] hover:underline"
                      >
                        seymlionel@gmail.com
                      </a>
                    </li>
                    <li>Indiquez votre numéro de commande</li>
                    <li>Expliquez la raison du retour</li>
                    <li>Nous vous répondrons sous 24h</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Délai de remboursement</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Traitement de votre demande : 2-3 jours ouvrés</li>
                    <li>
                      • Remboursement sur votre compte : 5-10 jours ouvrés
                    </li>
                  </ul>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mt-4">
                  <p className="text-sm text-gray-700">
                    <strong>Note :</strong> Les frais de retour sont à la charge
                    du client, sauf en cas de produit défectueux ou d'erreur de
                    notre part.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
