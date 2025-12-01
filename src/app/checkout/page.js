/**
 * PAGE : Checkout (Passage de commande)
 * ======================================
 *
 * Page de commande avec système hybride :
 * - Invité (checkout rapide sans compte)
 * - Connexion (utilisateur existant)
 * - Inscription (nouveau compte)
 *
 * 🔧 FICHIER MODIFIÉ : src/app/checkout/page.js
 * DATE : 2025-11-30
 */

"use client";

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, LogIn, UserPlus, ArrowLeft, ArrowRight, CreditCard } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StripePaymentForm from '@/components/StripePaymentForm';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import cmsConfig from '../../../cms.config';

export default function CheckoutPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const { user, signIn, signUp } = useAuth();
  const router = useRouter();

  // État du mode de checkout
  const [checkoutMode, setCheckoutMode] = useState(null); // null | 'guest' | 'login' | 'signup'
  const [showPayment, setShowPayment] = useState(false); // Afficher le formulaire de paiement

  // État du formulaire invité
  const [guestForm, setGuestForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
    phone: '',
  });

  // État du formulaire connexion
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  // État du formulaire inscription
  const [signupForm, setSignupForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });

  // États des erreurs et chargement
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * REDIRECTION SI PANIER VIDE
   */
  useEffect(() => {
    if (cart.length === 0) {
      router.push('/cart');
    }
  }, [cart, router]);

  /**
   * SI UTILISATEUR DÉJÀ CONNECTÉ, PASSER EN MODE INVITÉ
   */
  useEffect(() => {
    if (user && checkoutMode === null) {
      setCheckoutMode('guest');
      setGuestForm({
        ...guestForm,
        email: user.email || '',
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ')[1] || '',
      });
    }
  }, [user]);

  /**
   * GESTION DE LA CONNEXION
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(loginForm.email, loginForm.password);
      setCheckoutMode('guest'); // Passer au formulaire de commande
    } catch (err) {
      setError('Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  /**
   * GESTION DE L'INSCRIPTION
   */
  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (signupForm.password !== signupForm.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    try {
      await signUp(signupForm.email, signupForm.password, `${signupForm.firstName} ${signupForm.lastName}`);
      setCheckoutMode('guest'); // Passer au formulaire de commande
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  /**
   * TRAITEMENT DU FORMULAIRE INVITÉ - Passer à l'étape paiement
   */
  const handleGuestCheckout = async (e) => {
    e.preventDefault();
    setError('');

    // Validation basique
    if (!guestForm.email || !guestForm.firstName || !guestForm.lastName || !guestForm.address) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Passer à l'étape de paiement
    setShowPayment(true);
  };

  /**
   * GESTION DU PAIEMENT RÉUSSI
   */
  const handlePaymentSuccess = async (paymentIntent) => {
    console.log('Paiement réussi !', paymentIntent);

    try {
      // Préparer les données de la commande
      const orderData = {
        // Informations de la commande
        orderId: `ORDER-${Date.now()}`,
        paymentIntentId: paymentIntent.id,
        status: 'paid',

        // Informations client
        customer: {
          email: guestForm.email,
          firstName: guestForm.firstName,
          lastName: guestForm.lastName,
          phone: guestForm.phone || '',
          userId: user?.uid || null,
        },

        // Adresse de livraison
        shippingAddress: {
          address: guestForm.address,
          city: guestForm.city,
          postalCode: guestForm.postalCode,
          country: guestForm.country,
        },

        // Produits commandés
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: parseFloat(item.price),
          quantity: item.quantity,
          total: parseFloat(item.price) * item.quantity,
        })),

        // Totaux
        subtotal: parseFloat(totalPrice),
        shipping: 0, // Livraison gratuite
        total: parseFloat(totalPrice),
        currency: 'EUR',

        // Timestamps
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // Enregistrer la commande dans Firestore
      const ordersCollection = collection(db, cmsConfig.collections.orders);
      const docRef = await addDoc(ordersCollection, orderData);

      console.log('Commande enregistrée avec succès:', docRef.id);

      // Rediriger vers la page de confirmation avec l'ID de la commande
      // Note: Le panier sera vidé sur la page de confirmation pour éviter les conflits de redirection
      router.push(`/order-confirmation?order_id=${docRef.id}&payment_intent=${paymentIntent.id}`);

    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la commande:', error);

      // Même en cas d'erreur, on redirige vers la confirmation
      // car le paiement a réussi
      router.push(`/order-confirmation?payment_intent=${paymentIntent.id}`);
    }
  };

  /**
   * GESTION DES ERREURS DE PAIEMENT
   */
  const handlePaymentError = (error) => {
    console.error('Erreur de paiement:', error);
    setError(error.message || 'Erreur lors du paiement');
  };

  // Si panier vide, ne rien afficher
  if (cart.length === 0) {
    return null;
  }

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">

          {/* En-tête */}
          <div className="mb-8">
            <Link href="/cart" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition mb-4">
              <ArrowLeft size={16} />
              Retour au panier
            </Link>
            <h1 className="text-3xl font-serif text-gray-800 flex items-center gap-3">
              <CreditCard size={32} className="text-[#5d6e64]" />
              Finaliser ma commande
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* FORMULAIRE DE COMMANDE */}
            <div className="lg:col-span-2">

              {/* CHOIX DU MODE DE CHECKOUT */}
              {checkoutMode === null && !user && (
                <div className="bg-white rounded-lg shadow-md p-8">
                  <h2 className="text-2xl font-serif text-gray-800 mb-6 text-center">Comment souhaitez-vous commander ?</h2>

                  <div className="space-y-4">
                    {/* Invité */}
                    <button
                      onClick={() => setCheckoutMode('guest')}
                      className="w-full p-6 border-2 border-gray-200 rounded-lg hover:border-[#5d6e64] hover:bg-gray-50 transition text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                          <User size={24} className="text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800 mb-1">Continuer en tant qu'invité</h3>
                          <p className="text-sm text-gray-600">Commandez rapidement sans créer de compte</p>
                        </div>
                        <ArrowRight size={20} className="text-gray-400" />
                      </div>
                    </button>

                    {/* Connexion */}
                    <button
                      onClick={() => setCheckoutMode('login')}
                      className="w-full p-6 border-2 border-gray-200 rounded-lg hover:border-[#5d6e64] hover:bg-gray-50 transition text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                          <LogIn size={24} className="text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800 mb-1">J'ai déjà un compte</h3>
                          <p className="text-sm text-gray-600">Connectez-vous pour accéder à votre historique</p>
                        </div>
                        <ArrowRight size={20} className="text-gray-400" />
                      </div>
                    </button>

                    {/* Inscription */}
                    <button
                      onClick={() => setCheckoutMode('signup')}
                      className="w-full p-6 border-2 border-gray-200 rounded-lg hover:border-[#5d6e64] hover:bg-gray-50 transition text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                          <UserPlus size={24} className="text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800 mb-1">Créer un compte</h3>
                          <p className="text-sm text-gray-600">Suivez vos commandes et bénéficiez d'avantages</p>
                        </div>
                        <ArrowRight size={20} className="text-gray-400" />
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* FORMULAIRE CONNEXION */}
              {checkoutMode === 'login' && (
                <div className="bg-white rounded-lg shadow-md p-8">
                  <h2 className="text-2xl font-serif text-gray-800 mb-6">Connexion</h2>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-6 text-sm">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        required
                        className="w-full border border-gray-300 px-4 py-3 rounded focus:outline-none focus:border-[#5d6e64]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
                      <input
                        type="password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        required
                        className="w-full border border-gray-300 px-4 py-3 rounded focus:outline-none focus:border-[#5d6e64]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#5d6e64] text-white py-3 rounded font-medium hover:bg-[#4a5850] transition disabled:opacity-50"
                    >
                      {loading ? 'Connexion...' : 'Se connecter'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setCheckoutMode(null)}
                      className="w-full text-sm text-gray-600 hover:text-gray-800"
                    >
                      ← Retour aux options
                    </button>
                  </form>
                </div>
              )}

              {/* FORMULAIRE INSCRIPTION */}
              {checkoutMode === 'signup' && (
                <div className="bg-white rounded-lg shadow-md p-8">
                  <h2 className="text-2xl font-serif text-gray-800 mb-6">Créer un compte</h2>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-6 text-sm">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSignup} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                        <input
                          type="text"
                          value={signupForm.firstName}
                          onChange={(e) => setSignupForm({ ...signupForm, firstName: e.target.value })}
                          required
                          className="w-full border border-gray-300 px-4 py-3 rounded focus:outline-none focus:border-[#5d6e64]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                        <input
                          type="text"
                          value={signupForm.lastName}
                          onChange={(e) => setSignupForm({ ...signupForm, lastName: e.target.value })}
                          required
                          className="w-full border border-gray-300 px-4 py-3 rounded focus:outline-none focus:border-[#5d6e64]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={signupForm.email}
                        onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                        required
                        className="w-full border border-gray-300 px-4 py-3 rounded focus:outline-none focus:border-[#5d6e64]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
                      <input
                        type="password"
                        value={signupForm.password}
                        onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                        required
                        minLength={6}
                        className="w-full border border-gray-300 px-4 py-3 rounded focus:outline-none focus:border-[#5d6e64]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirmer le mot de passe</label>
                      <input
                        type="password"
                        value={signupForm.confirmPassword}
                        onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                        required
                        minLength={6}
                        className="w-full border border-gray-300 px-4 py-3 rounded focus:outline-none focus:border-[#5d6e64]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-[#5d6e64] text-white py-3 rounded font-medium hover:bg-[#4a5850] transition disabled:opacity-50"
                    >
                      {loading ? 'Création...' : 'Créer mon compte'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setCheckoutMode(null)}
                      className="w-full text-sm text-gray-600 hover:text-gray-800"
                    >
                      ← Retour aux options
                    </button>
                  </form>
                </div>
              )}

              {/* FORMULAIRE INVITÉ */}
              {checkoutMode === 'guest' && !showPayment && (
                <div className="bg-white rounded-lg shadow-md p-8">
                  <h2 className="text-2xl font-serif text-gray-800 mb-6">Informations de livraison</h2>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-6 text-sm">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleGuestCheckout} className="space-y-6">
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        value={guestForm.email}
                        onChange={(e) => setGuestForm({ ...guestForm, email: e.target.value })}
                        required
                        disabled={!!user}
                        className="w-full border border-gray-300 px-4 py-3 rounded focus:outline-none focus:border-[#5d6e64] disabled:bg-gray-100"
                      />
                    </div>

                    {/* Nom et Prénom */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                        <input
                          type="text"
                          value={guestForm.firstName}
                          onChange={(e) => setGuestForm({ ...guestForm, firstName: e.target.value })}
                          required
                          className="w-full border border-gray-300 px-4 py-3 rounded focus:outline-none focus:border-[#5d6e64]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                        <input
                          type="text"
                          value={guestForm.lastName}
                          onChange={(e) => setGuestForm({ ...guestForm, lastName: e.target.value })}
                          required
                          className="w-full border border-gray-300 px-4 py-3 rounded focus:outline-none focus:border-[#5d6e64]"
                        />
                      </div>
                    </div>

                    {/* Adresse */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Adresse *</label>
                      <input
                        type="text"
                        value={guestForm.address}
                        onChange={(e) => setGuestForm({ ...guestForm, address: e.target.value })}
                        required
                        className="w-full border border-gray-300 px-4 py-3 rounded focus:outline-none focus:border-[#5d6e64]"
                        placeholder="Numéro et nom de rue"
                      />
                    </div>

                    {/* Ville et Code postal */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ville *</label>
                        <input
                          type="text"
                          value={guestForm.city}
                          onChange={(e) => setGuestForm({ ...guestForm, city: e.target.value })}
                          required
                          className="w-full border border-gray-300 px-4 py-3 rounded focus:outline-none focus:border-[#5d6e64]"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Code postal *</label>
                        <input
                          type="text"
                          value={guestForm.postalCode}
                          onChange={(e) => setGuestForm({ ...guestForm, postalCode: e.target.value })}
                          required
                          className="w-full border border-gray-300 px-4 py-3 rounded focus:outline-none focus:border-[#5d6e64]"
                        />
                      </div>
                    </div>

                    {/* Pays */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pays *</label>
                      <select
                        value={guestForm.country}
                        onChange={(e) => setGuestForm({ ...guestForm, country: e.target.value })}
                        required
                        className="w-full border border-gray-300 px-4 py-3 rounded focus:outline-none focus:border-[#5d6e64]"
                      >
                        <option value="France">France</option>
                        <option value="Guadeloupe">Guadeloupe</option>
                        <option value="Martinique">Martinique</option>
                        <option value="Guyane">Guyane</option>
                        <option value="Réunion">Réunion</option>
                      </select>
                    </div>

                    {/* Téléphone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                      <input
                        type="tel"
                        value={guestForm.phone}
                        onChange={(e) => setGuestForm({ ...guestForm, phone: e.target.value })}
                        className="w-full border border-gray-300 px-4 py-3 rounded focus:outline-none focus:border-[#5d6e64]"
                        placeholder="+33 6 12 34 56 78"
                      />
                    </div>

                    <div className="border-t pt-6">
                      <button
                        type="submit"
                        className="w-full bg-[#5d6e64] text-white py-3 rounded font-medium hover:bg-[#4a5850] transition flex items-center justify-center gap-2"
                      >
                        Procéder au paiement
                        <ArrowRight size={20} />
                      </button>
                    </div>

                    {!user && (
                      <button
                        type="button"
                        onClick={() => setCheckoutMode(null)}
                        className="w-full text-sm text-gray-600 hover:text-gray-800"
                      >
                        ← Retour aux options
                      </button>
                    )}
                  </form>
                </div>
              )}

              {/* FORMULAIRE DE PAIEMENT STRIPE */}
              {showPayment && (
                <div className="space-y-6">
                  {/* Récapitulatif des informations */}
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-serif text-gray-800">Informations de livraison</h3>
                      <button
                        onClick={() => setShowPayment(false)}
                        className="text-sm text-[#5d6e64] hover:underline"
                      >
                        Modifier
                      </button>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="font-medium text-gray-800">{guestForm.firstName} {guestForm.lastName}</p>
                      <p>{guestForm.email}</p>
                      <p>{guestForm.address}</p>
                      <p>{guestForm.postalCode} {guestForm.city}</p>
                      <p>{guestForm.country}</p>
                      {guestForm.phone && <p>{guestForm.phone}</p>}
                    </div>
                  </div>

                  {/* Formulaire de paiement Stripe */}
                  <StripePaymentForm
                    amount={totalPrice * 100} // Convertir en centimes
                    customerEmail={guestForm.email}
                    orderId={`ORDER-${Date.now()}`}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </div>
              )}

            </div>

            {/* RÉCAPITULATIF */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-serif text-gray-800 mb-4">Récapitulatif</h2>

                {/* Liste des produits */}
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className={`w-12 h-14 ${item.image} bg-cover bg-center rounded shrink-0`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-500">Qté : {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-800">
                        {(item.price * item.quantity).toFixed(2)}€
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totaux */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Sous-total</span>
                    <span className="font-medium text-gray-800">€{totalPrice}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Livraison</span>
                    <span className="text-green-600 font-medium">Gratuite</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-lg font-semibold text-gray-800">Total</span>
                  <span className="text-2xl font-bold text-[#5d6e64]">€{totalPrice}</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}

/**
 * ============================================
 * GUIDE D'UTILISATION
 * ============================================
 *
 * ACCÈS : /checkout
 *
 * MODES DE CHECKOUT :
 * 1. Invité : Achat rapide sans compte
 * 2. Connexion : Utilisateur existant
 * 3. Inscription : Nouveau compte
 *
 * ÉTAPES :
 * 1. Choix du mode (invité/login/signup)
 * 2. Formulaire de livraison (invité) ou auth
 * 3. Paiement (à implémenter avec Stripe)
 * 4. Confirmation
 *
 * TODO :
 * - Intégrer Stripe pour le paiement
 * - Enregistrer les commandes dans Firestore
 * - Envoyer emails de confirmation
 *
 * ============================================
 */
