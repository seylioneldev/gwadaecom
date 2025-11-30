/**
 * PAGE ADMIN - Back-Office de gestion des produits
 * ================================================
 *
 * Cette page permet à l'administrateur de :
 * 1. Se connecter avec Firebase Authentication
 * 2. Ajouter de nouveaux produits à la base de données Firestore
 *
 * FICHIER MODIFIÉ : src/app/admin/page.js
 * DATE : 2025-11-30
 *
 * STRUCTURE :
 * - Zone de login (si non connecté)
 * - Tableau de bord avec formulaire d'ajout de produit (si connecté)
 */

"use client";

// ============================================
// IMPORTS
// ============================================
import { useState, useEffect } from 'react';
import { auth, db } from '../../lib/firebase'; // Firebase : auth pour login, db pour Firestore
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore'; // Pour ajouter des documents à Firestore
import { useRouter } from 'next/navigation';

// ============================================
// COMPOSANT PRINCIPAL
// ============================================
export default function AdminPage() {

  // ----------------------------------------
  // ÉTATS POUR L'AUTHENTIFICATION
  // ----------------------------------------
  const [email, setEmail] = useState(""); // Email de l'admin
  const [password, setPassword] = useState(""); // Mot de passe de l'admin
  const [user, setUser] = useState(null); // Utilisateur connecté (null si non connecté)
  const [error, setError] = useState(""); // Messages d'erreur
  const router = useRouter();

  // ----------------------------------------
  // ÉTATS POUR LE FORMULAIRE DE PRODUIT
  // ----------------------------------------
  const [productName, setProductName] = useState(""); // Nom du produit
  const [price, setPrice] = useState(""); // Prix du produit (en texte, sera converti en nombre)
  const [category, setCategory] = useState("Kitchen"); // Catégorie par défaut
  const [description, setDescription] = useState(""); // Description du produit
  const [imageUrl, setImageUrl] = useState(""); // URL de l'image ou couleur Tailwind (ex: bg-[#E5E5E5])
  const [isSubmitting, setIsSubmitting] = useState(false); // Indique si le formulaire est en cours d'envoi
  const [successMessage, setSuccessMessage] = useState(""); // Message de succès après ajout

  // ----------------------------------------
  // SURVEILLANCE DE L'ÉTAT DE CONNEXION
  // ----------------------------------------
  // useEffect s'exécute une fois au chargement du composant
  // onAuthStateChanged surveille en temps réel si l'utilisateur est connecté
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Met à jour l'état avec l'utilisateur connecté (ou null)
    });
    return () => unsubscribe(); // Nettoyage : arrête la surveillance quand le composant est démonté
  }, []);

  // ----------------------------------------
  // FONCTION : CONNEXION DE L'ADMIN
  // ----------------------------------------
  /**
   * Gère la connexion de l'administrateur
   * @param {Event} e - L'événement du formulaire
   */
  const handleLogin = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    setError(""); // Réinitialise les erreurs
    try {
      // Tente de connecter l'utilisateur avec Firebase Auth
      await signInWithEmailAndPassword(auth, email, password);
      // Si succès, onAuthStateChanged mettra à jour l'état 'user' automatiquement
    } catch (err) {
      setError("Email ou mot de passe incorrect.");
    }
  };

  // ----------------------------------------
  // FONCTION : DÉCONNEXION DE L'ADMIN
  // ----------------------------------------
  /**
   * Déconnecte l'administrateur
   */
  const handleLogout = async () => {
    await signOut(auth); // Déconnexion Firebase
    // onAuthStateChanged mettra automatiquement 'user' à null
  };

  // ----------------------------------------
  // FONCTION : AJOUT D'UN PRODUIT À FIRESTORE
  // ----------------------------------------
  /**
   * Ajoute un nouveau produit à la collection "products" dans Firestore
   * @param {Event} e - L'événement du formulaire
   *
   * ÉTAPES :
   * 1. Valide que le prix est un nombre positif
   * 2. Crée un nouveau document dans la collection "products"
   * 3. Réinitialise le formulaire
   * 4. Affiche un message de succès
   */
  const handleAddProduct = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    setError(""); // Réinitialise les messages d'erreur
    setSuccessMessage(""); // Réinitialise les messages de succès
    setIsSubmitting(true); // Active l'état de chargement

    try {
      // ---- VALIDATION DU PRIX ----
      const priceNum = parseFloat(price); // Convertit le texte en nombre décimal
      if (isNaN(priceNum) || priceNum <= 0) {
        setError("Le prix doit être un nombre positif.");
        setIsSubmitting(false);
        return; // Arrête l'exécution si le prix est invalide
      }

      // ---- AJOUT DU PRODUIT À FIRESTORE ----
      /**
       * addDoc() ajoute un nouveau document à la collection "products"
       * Le document contiendra :
       * - name : nom du produit
       * - price : prix en nombre (avec décimales)
       * - category : catégorie choisie
       * - description : description du produit
       * - imageUrl : URL ou couleur Tailwind
       * - createdAt : date de création (pour trier les produits plus tard)
       */
      await addDoc(collection(db, "products"), {
        name: productName,
        price: priceNum,
        category: category,
        description: description,
        imageUrl: imageUrl,
        createdAt: new Date() // Timestamp de création
      });

      // ---- RÉINITIALISATION DU FORMULAIRE ----
      // Vide tous les champs après l'ajout réussi
      setProductName("");
      setPrice("");
      setCategory("Kitchen"); // Remet la catégorie par défaut
      setDescription("");
      setImageUrl("");
      setSuccessMessage("Produit ajouté avec succès !");

      // ---- MESSAGE DE SUCCÈS TEMPORAIRE ----
      // Efface le message de succès après 3 secondes
      setTimeout(() => setSuccessMessage(""), 3000);

    } catch (err) {
      // En cas d'erreur (problème de connexion, permissions, etc.)
      setError("Erreur lors de l'ajout du produit : " + err.message);
    } finally {
      setIsSubmitting(false); // Désactive l'état de chargement
    }
  };

  // ============================================
  // RENDU CONDITIONNEL : SI L'ADMIN EST CONNECTÉ
  // ============================================
  /**
   * Si 'user' n'est pas null, l'admin est connecté
   * Affiche le tableau de bord avec le formulaire d'ajout de produit
   */
  if (user) {
    return (
      <div className="min-h-screen bg-gray-50 p-10">
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-8">

          {/* ---- EN-TÊTE DU BACK-OFFICE ---- */}
          <div className="flex justify-between items-center mb-8 border-b pb-4">
            <h1 className="text-2xl font-serif text-gray-800">Back-Office</h1>
            <div className="flex items-center gap-4">
                {/* Affiche l'email de l'utilisateur connecté */}
                <span className="text-sm text-gray-500">{user.email}</span>
                {/* Bouton de déconnexion */}
                <button onClick={handleLogout} className="text-red-500 hover:text-red-700 text-sm underline">
                    Se déconnecter
                </button>
            </div>
          </div>

          {/* ---- MESSAGES DE SUCCÈS ET D'ERREUR ---- */}
          {/* Affiche uniquement si successMessage contient du texte */}
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 text-sm">
              {successMessage}
            </div>
          )}
          {/* Affiche uniquement si error contient du texte */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-sm">
              {error}
            </div>
          )}

          {/* ---- FORMULAIRE D'AJOUT DE PRODUIT ---- */}
          <form onSubmit={handleAddProduct} className="space-y-6">
            <h2 className="text-xl font-serif text-gray-800 mb-6">Ajouter un nouveau produit</h2>

            {/* CHAMP : Nom du produit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du produit *
              </label>
              <input
                type="text"
                required // Champ obligatoire
                value={productName}
                onChange={(e) => setProductName(e.target.value)} // Met à jour l'état à chaque frappe
                className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-[#5d6e64]"
                placeholder="Ex: Panier artisanal"
              />
            </div>

            {/* CHAMP : Prix */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix (€) *
              </label>
              <input
                type="number"
                step="0.01" // Permet les décimales (ex: 29.99)
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-[#5d6e64]"
                placeholder="Ex: 29.99"
              />
            </div>

            {/* CHAMP : Catégorie (liste déroulante) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-[#5d6e64] bg-white"
              >
                {/* MODIFICATION FUTURE : Si vous voulez ajouter une catégorie, ajoutez une ligne <option> ici */}
                <option value="Kitchen">Kitchen</option>
                <option value="Baskets">Baskets</option>
                <option value="Decoration">Decoration</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>

            {/* CHAMP : Description (zone de texte multiligne) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-[#5d6e64] resize-none"
                placeholder="Décrivez le produit..."
              />
            </div>

            {/* CHAMP : Image (URL ou couleur Tailwind) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image (URL ou couleur Tailwind)
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-[#5d6e64]"
                placeholder="Ex: bg-[#E5E5E5] ou https://..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Pour l'instant, utilisez une couleur (ex: bg-[#E5E5E5]) ou une URL d'image
              </p>
              {/* NOTE : Plus tard, vous pourrez ajouter l'upload d'images avec Firebase Storage */}
            </div>

            {/* BOUTON : Soumettre le formulaire */}
            <button
              type="submit"
              disabled={isSubmitting} // Désactive le bouton pendant l'envoi
              className={`w-full py-3 rounded text-white font-bold uppercase tracking-widest text-sm transition ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed' // Style si en cours d'envoi
                  : 'bg-[#5d6e64] hover:bg-[#4a5850]' // Style normal
              }`}
            >
              {/* Texte du bouton change selon l'état */}
              {isSubmitting ? 'Ajout en cours...' : 'Ajouter le produit'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDU CONDITIONNEL : SI L'ADMIN N'EST PAS CONNECTÉ
  // ============================================
  /**
   * Si 'user' est null, l'admin n'est pas connecté
   * Affiche le formulaire de connexion
   */
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f0f0] px-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded-lg p-8">
        <h1 className="text-3xl font-serif text-center text-[#5d6e64] mb-8">Admin Login</h1>

        {/* Affiche les erreurs de connexion si elles existent */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        {/* FORMULAIRE DE CONNEXION */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Champ Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email" required
              className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-[#5d6e64]"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {/* Champ Mot de passe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
            <input
              type="password" required
              className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-[#5d6e64]"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {/* Bouton de connexion */}
          <button type="submit" className="w-full bg-[#5d6e64] text-white py-3 rounded hover:bg-[#4a5850] transition uppercase tracking-widest text-sm font-bold">
            Se Connecter
          </button>
        </form>
      </div>
    </div>
  );
}

/**
 * ============================================
 * GUIDE DE MODIFICATION
 * ============================================
 *
 * Pour ajouter une nouvelle catégorie :
 * - Allez à la ligne 264 (section <select>)
 * - Ajoutez une nouvelle ligne : <option value="NouvelleCategorie">Nouvelle Catégorie</option>
 *
 * Pour changer les couleurs du thème :
 * - Remplacez #5d6e64 par votre couleur (ex: #FF6B6B)
 * - Recherchez toutes les occurrences dans le fichier
 *
 * Pour ajouter un nouveau champ au formulaire :
 * 1. Créez un nouvel état : const [nouveauChamp, setNouveauChamp] = useState("");
 * 2. Ajoutez un <div> avec <input> ou <select> dans le formulaire
 * 3. Ajoutez le champ dans addDoc() (ligne 63)
 * 4. Réinitialisez-le dans setNouveauChamp("") (ligne 77)
 *
 * Pour modifier la collection Firestore :
 * - Changez "products" à la ligne 63 : collection(db, "products")
 *
 * ============================================
 */
