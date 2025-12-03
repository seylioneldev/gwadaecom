import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Configuration Gmail SMTP avec Nodemailer
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(request) {
  try {
    const { name, email, orderNumber, subject, message } = await request.json();

    // Validation des champs requis
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Tous les champs obligatoires doivent être remplis" },
        { status: 400 }
      );
    }

    // Mapping des sujets en français
    const subjectMap = {
      refund: "Demande de remboursement",
      return: "Retour de produit",
      order: "Question sur ma commande",
      product: "Question sur un produit",
      other: "Autre demande",
    };

    const subjectText = subjectMap[subject] || "Demande de contact";

    // Construire le contenu de l'email
    const emailContent = `
Nouvelle demande de contact depuis le site gwadaecom

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 INFORMATIONS DU CLIENT

Nom: ${name}
Email: ${email}
${
  orderNumber
    ? `Numéro de commande: ${orderNumber}`
    : "Pas de numéro de commande"
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 SUJET: ${subjectText}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💬 MESSAGE:

${message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Pour répondre, utilisez: ${email}
${orderNumber ? `Référence commande: ${orderNumber}` : ""}
    `.trim();

    // Envoyer l'email via Gmail SMTP
    const result = await transporter.sendMail({
      from: `"GwadaEcom Support" <${process.env.GMAIL_USER}>`,
      to: "seymlionel@gmail.com", // Votre email admin
      replyTo: email, // Email du client pour répondre facilement
      subject: `[GwadaEcom] ${subjectText} - ${name}`,
      text: emailContent,
    });

    console.log("✅ Email de contact envoyé avec succès via Gmail SMTP!");
    console.log("📧 Résultat:", result);

    return NextResponse.json(
      {
        success: true,
        message: "Email envoyé avec succès",
        messageId: result.messageId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);

    return NextResponse.json(
      {
        error: "Erreur lors de l'envoi de l'email",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
