/**
 * API ROUTE : Envoi d'email de bienvenue
 * ========================================
 *
 * Envoie un email de bienvenue après la création d'un compte.
 *
 * 🆕 NOUVEAU FICHIER : src/app/api/send-welcome-email/route.js
 * DATE : 2025-12-01
 * 🔄 MODIFIÉ : Utilise Gmail SMTP via Nodemailer
 */

import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Configuration Gmail SMTP avec Nodemailer
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(request) {
  try {
    console.log('📧 ========================================');
    console.log('📧 API email de bienvenue appelée');
    console.log('📧 ========================================');

    const { userData } = await request.json();

    console.log('👤 Données utilisateur reçues:', {
      email: userData?.email,
      firstName: userData?.firstName,
      lastName: userData?.lastName
    });

    // Valider les données
    if (!userData || !userData.email) {
      console.error('❌ Données utilisateur invalides');
      return NextResponse.json(
        { error: 'Données utilisateur invalides' },
        { status: 400 }
      );
    }

    // Vérifier la configuration Gmail
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error('❌ Configuration Gmail manquante dans .env.local');
      console.error('❌ Vérifiez que GMAIL_USER et GMAIL_APP_PASSWORD sont définis');
      return NextResponse.json(
        { error: 'Configuration email manquante' },
        { status: 500 }
      );
    }

    console.log('🔑 Configuration Gmail détectée:', process.env.GMAIL_USER);

    // Préparer le contenu de l'email
    const emailContent = generateWelcomeEmailHTML(userData);
    console.log('📄 Contenu email généré');

    console.log('📨 Envoi de l\'email de bienvenue à:', userData.email);

    // Envoi avec Gmail SMTP via Nodemailer
    const result = await transporter.sendMail({
      from: `"Les Bijoux de Guadeloupe" <${process.env.GMAIL_USER}>`,
      to: userData.email,
      subject: 'Bienvenue sur Les Bijoux de Guadeloupe !',
      html: emailContent,
    });

    console.log('✅ Email de bienvenue envoyé avec succès via Gmail SMTP!');
    console.log('📧 Résultat Nodemailer:', result);

    console.log('📧 ========================================');
    console.log('✅ Traitement terminé avec succès');
    console.log('📧 ========================================');

    return NextResponse.json({
      success: true,
      message: 'Email de bienvenue envoyé via Gmail SMTP',
      messageId: result?.messageId || 'unknown',
      accepted: result?.accepted || []
    });

  } catch (error) {
    console.error('❌ ========================================');
    console.error('❌ ERREUR lors de l\'envoi de l\'email de bienvenue');
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
 * Génère le HTML de l'email de bienvenue
 */
function generateWelcomeEmailHTML(userData) {
  const { firstName, lastName, email } = userData;

  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bienvenue sur Les Bijoux de Guadeloupe</title>
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

          <!-- Message de bienvenue -->
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="width: 64px; height: 64px; background-color: #dbeafe; border-radius: 50%; margin: 0 auto 16px; display: inline-flex; align-items: center; justify-content: center;">
              <span style="font-size: 32px;">👋</span>
            </div>
            <h2 style="font-size: 24px; color: #1f2937; margin: 0 0 8px 0;">
              Bienvenue ${firstName} !
            </h2>
            <p style="color: #6b7280; margin: 0;">
              Votre compte a été créé avec succès
            </p>
          </div>

          <!-- Informations du compte -->
          <div style="background-color: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <h3 style="font-size: 16px; color: #1f2937; margin: 0 0 12px 0;">
              Vos informations de compte
            </h3>
            <p style="margin: 0; color: #6b7280;">
              <strong style="color: #1f2937;">Nom :</strong> ${firstName} ${lastName}
            </p>
            <p style="margin: 8px 0 0 0; color: #6b7280;">
              <strong style="color: #1f2937;">Email :</strong> ${email}
            </p>
          </div>

          <!-- Ce que vous pouvez faire -->
          <div style="margin-bottom: 24px;">
            <h3 style="font-size: 18px; color: #1f2937; margin: 0 0 16px 0;">
              Que pouvez-vous faire maintenant ?
            </h3>

            <div style="margin-bottom: 16px; padding: 16px; background-color: #f9fafb; border-left: 4px solid #5d6e64; border-radius: 4px;">
              <h4 style="margin: 0 0 8px 0; font-size: 16px; color: #1f2937;">🛍️ Faire des achats</h4>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">
                Parcourez notre collection de bijoux artisanaux de Guadeloupe et passez commande en toute simplicité.
              </p>
            </div>

            <div style="margin-bottom: 16px; padding: 16px; background-color: #f9fafb; border-left: 4px solid #5d6e64; border-radius: 4px;">
              <h4 style="margin: 0 0 8px 0; font-size: 16px; color: #1f2937;">📦 Suivre vos commandes</h4>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">
                Consultez l'historique de vos commandes et suivez leur statut en temps réel.
              </p>
            </div>

            <div style="padding: 16px; background-color: #f9fafb; border-left: 4px solid #5d6e64; border-radius: 4px;">
              <h4 style="margin: 0 0 8px 0; font-size: 16px; color: #1f2937;">👤 Gérer votre profil</h4>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">
                Mettez à jour vos informations personnelles et vos préférences.
              </p>
            </div>
          </div>

          <!-- Bouton CTA -->
          <div style="text-align: center; margin: 32px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}"
               style="display: inline-block; background-color: #5d6e64; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
              Découvrir nos bijoux
            </a>
          </div>

          <!-- Message de remerciement -->
          <div style="background-color: #fef3c7; border: 1px solid #fde047; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <p style="margin: 0; color: #92400e; font-size: 14px; text-align: center;">
              ✨ Merci de faire confiance aux Bijoux de Guadeloupe !
            </p>
          </div>

          <!-- Contact -->
          <div style="text-align: center; color: #6b7280; font-size: 14px;">
            <p style="margin: 0 0 8px 0;">Une question ?</p>
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
            Vous recevez cet email car vous avez créé un compte sur notre site.
          </p>
        </div>

      </div>
    </body>
    </html>
  `;
}
