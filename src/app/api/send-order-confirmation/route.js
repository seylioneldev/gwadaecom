/**
 * API ROUTE : Envoi d'email de confirmation de commande
 * ======================================================
 *
 * Envoie un email de confirmation après une commande réussie.
 *
 * CONFIGURATION REQUISE :
 * -----------------------
 * 1. Installer un service d'email (voir EMAIL_SETUP.md)
 * 2. Ajouter les variables d'environnement nécessaires dans .env.local
 *
 * SERVICES D'EMAIL SUPPORTÉS :
 * ----------------------------
 * - Resend (recommandé) : npm install resend
 * - SendGrid : npm install @sendgrid/mail
 * - Nodemailer : npm install nodemailer
 *
 * 🆕 NOUVEAU FICHIER : src/app/api/send-order-confirmation/route.js
 * DATE : 2025-12-01
 */

import { NextResponse } from 'next/server';

// OPTION 1: Resend (recommandé - moderne et simple)
// ===================================================
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

// OPTION 2: SendGrid
// ===================================================
// Décommentez ce bloc si vous utilisez SendGrid
// import sgMail from '@sendgrid/mail';
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// OPTION 3: Nodemailer (SMTP)
// ===================================================
// Décommentez ce bloc si vous utilisez Nodemailer
// import nodemailer from 'nodemailer';
// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: process.env.SMTP_PORT,
//   secure: true,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

export async function POST(request) {
  try {
    console.log('📧 ========================================');
    console.log('📧 API d\'envoi d\'email appelée');
    console.log('📧 ========================================');

    const { orderData } = await request.json();

    console.log('📦 Données de commande reçues:', {
      orderId: orderData?.orderId,
      customerEmail: orderData?.customer?.email,
      hasItems: !!orderData?.items,
      itemsCount: orderData?.items?.length
    });

    // Valider les données
    if (!orderData || !orderData.customer?.email) {
      console.error('❌ Données de commande invalides');
      return NextResponse.json(
        { error: 'Données de commande invalides' },
        { status: 400 }
      );
    }

    // Vérifier la clé API Resend
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY non définie dans .env.local');
      return NextResponse.json(
        { error: 'Configuration email manquante' },
        { status: 500 }
      );
    }

    console.log('🔑 Clé API Resend détectée:', process.env.RESEND_API_KEY.substring(0, 10) + '...');

    // Préparer le contenu de l'email
    const emailContent = generateEmailHTML(orderData);
    console.log('📄 Contenu email généré (longueur):', emailContent.length, 'caractères');

    // ====================================================================
    // ENVOI DE L'EMAIL - Resend activé
    // ====================================================================

    console.log('📨 Envoi de l\'email à:', orderData.customer.email);
    console.log('📨 Depuis:', 'Les Bijoux de Guadeloupe <onboarding@resend.dev>');
    console.log('📨 Sujet:', `Confirmation de commande ${orderData.orderId}`);

    // OPTION 1: Avec Resend (ACTIF)
    // ----------------------
    const result = await resend.emails.send({
      from: 'Les Bijoux de Guadeloupe <onboarding@resend.dev>',
      to: orderData.customer.email,
      subject: `Confirmation de commande ${orderData.orderId}`,
      html: emailContent,
    });

    console.log('✅ Email envoyé avec succès!');
    console.log('📧 Résultat Resend:', result);

    // OPTION 2: Avec SendGrid (DÉSACTIVÉ)
    // ----------------------
    // await sgMail.send({
    //   to: orderData.customer.email,
    //   from: 'noreply@votre-domaine.com',
    //   subject: `Confirmation de commande ${orderData.orderId}`,
    //   html: emailContent,
    // });

    // OPTION 3: Avec Nodemailer (DÉSACTIVÉ)
    // ----------------------
    // await transporter.sendMail({
    //   from: '"Les Bijoux de Guadeloupe" <noreply@votre-domaine.com>',
    //   to: orderData.customer.email,
    //   subject: `Confirmation de commande ${orderData.orderId}`,
    //   html: emailContent,
    // });

    // MODE DÉVELOPPEMENT : Désactivé - Envoi réel activé
    // ======================================================
    // console.log('📧 Email de confirmation (MODE DEV):');
    // console.log('To:', orderData.customer.email);
    // console.log('Subject:', `Confirmation de commande ${orderData.orderId}`);
    // console.log('Content:', emailContent.substring(0, 200) + '...');

    console.log('📧 ========================================');
    console.log('✅ Traitement terminé avec succès');
    console.log('📧 ========================================');

    return NextResponse.json({
      success: true,
      message: 'Email de confirmation envoyé',
      emailId: result?.id || 'unknown'
    });

  } catch (error) {
    console.error('❌ ========================================');
    console.error('❌ ERREUR lors de l\'envoi de l\'email');
    console.error('❌ ========================================');
    console.error('❌ Type d\'erreur:', error.name);
    console.error('❌ Message:', error.message);
    console.error('❌ Stack:', error.stack);

    if (error.response) {
      console.error('❌ Réponse API:', error.response);
    }

    return NextResponse.json(
      {
        error: 'Erreur lors de l\'envoi de l\'email',
        details: error.message,
        type: error.name
      },
      { status: 500 }
    );
  }
}

/**
 * Génère le HTML de l'email de confirmation
 */
function generateEmailHTML(orderData) {
  const { customer, orderId, items, total, shippingAddress, createdAt } = orderData;

  // Formater la date
  const orderDate = createdAt?.toDate ? createdAt.toDate() : new Date();
  const formattedDate = orderDate.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Générer la liste des produits
  const itemsHTML = items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        <div style="font-weight: 600; color: #1f2937;">${item.name}</div>
        <div style="font-size: 14px; color: #6b7280;">Quantité : ${item.quantity}</div>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">
        ${item.total.toFixed(2)} €
      </td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmation de commande</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9fafb;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">

        <!-- En-tête -->
        <div style="background-color: #5d6e64; color: white; padding: 32px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; font-family: Georgia, serif;">
            Les Bijoux de Guadeloupe
          </h1>
        </div>

        <!-- Corps du message -->
        <div style="padding: 32px;">

          <!-- Message de confirmation -->
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="width: 64px; height: 64px; background-color: #d1fae5; border-radius: 50%; margin: 0 auto 16px; display: inline-flex; align-items: center; justify-content: center;">
              <span style="font-size: 32px;">✓</span>
            </div>
            <h2 style="font-size: 24px; color: #1f2937; margin: 0 0 8px 0;">
              Merci pour votre commande !
            </h2>
            <p style="color: #6b7280; margin: 0;">
              Votre paiement a été accepté avec succès
            </p>
          </div>

          <!-- Numéro de commande -->
          <div style="background-color: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <div style="font-size: 12px; color: #6b7280; margin-bottom: 4px;">Numéro de commande</div>
            <div style="font-family: monospace; font-weight: 700; font-size: 18px; color: #1f2937;">
              ${orderId}
            </div>
            <div style="font-size: 14px; color: #6b7280; margin-top: 8px;">
              Commandé le ${formattedDate}
            </div>
          </div>

          <!-- Adresse de livraison -->
          <div style="margin-bottom: 24px;">
            <h3 style="font-size: 18px; color: #1f2937; margin: 0 0 12px 0;">
              Adresse de livraison
            </h3>
            <div style="background-color: #f9fafb; padding: 16px; border-radius: 8px;">
              <p style="margin: 0; font-weight: 600; color: #1f2937;">
                ${customer.firstName} ${customer.lastName}
              </p>
              <p style="margin: 4px 0 0 0; color: #6b7280;">${shippingAddress.address}</p>
              <p style="margin: 4px 0 0 0; color: #6b7280;">
                ${shippingAddress.postalCode} ${shippingAddress.city}
              </p>
              <p style="margin: 4px 0 0 0; color: #6b7280;">${shippingAddress.country}</p>
              ${customer.phone ? `<p style="margin: 8px 0 0 0; color: #6b7280;">Tél : ${customer.phone}</p>` : ''}
            </div>
          </div>

          <!-- Produits commandés -->
          <div style="margin-bottom: 24px;">
            <h3 style="font-size: 18px; color: #1f2937; margin: 0 0 12px 0;">
              Produits commandés
            </h3>
            <table style="width: 100%; border-collapse: collapse; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px;">
              ${itemsHTML}
              <tr>
                <td style="padding: 16px; font-weight: 600; font-size: 18px; color: #1f2937;">
                  Total
                </td>
                <td style="padding: 16px; text-align: right; font-weight: 700; font-size: 18px; color: #1f2937;">
                  ${total.toFixed(2)} €
                </td>
              </tr>
            </table>
          </div>

          <!-- Prochaines étapes -->
          <div style="background-color: #eff6ff; border: 1px solid #dbeafe; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <h3 style="font-size: 16px; color: #1e40af; margin: 0 0 12px 0;">
              📦 Prochaines étapes
            </h3>
            <ol style="margin: 0; padding-left: 20px; color: #1e3a8a;">
              <li style="margin-bottom: 8px;">Nous préparons votre commande avec soin</li>
              <li style="margin-bottom: 8px;">Vous recevrez une notification dès son expédition</li>
              <li>Livraison sous 3 à 5 jours ouvrés</li>
            </ol>
          </div>

          <!-- Contact -->
          <div style="text-align: center; color: #6b7280; font-size: 14px;">
            <p style="margin: 0 0 8px 0;">Besoin d'aide ?</p>
            <p style="margin: 0;">
              Contactez-nous à
              <a href="mailto:support@gwadecom.com" style="color: #5d6e64; text-decoration: none;">
                support@gwadecom.com
              </a>
            </p>
          </div>

        </div>

        <!-- Pied de page -->
        <div style="background-color: #f9fafb; padding: 24px; text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0 0 8px 0;">© 2025 Les Bijoux de Guadeloupe. Tous droits réservés.</p>
          <p style="margin: 0;">
            Cet email a été envoyé pour confirmer votre commande ${orderId}
          </p>
        </div>

      </div>
    </body>
    </html>
  `;
}
