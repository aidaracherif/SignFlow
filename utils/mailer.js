const nodemailer = require('nodemailer');

// Fonction pour envoyer un lien de réinitialisation de mot de passe
async function sendPasswordResetEmail(email, token) {
  const transporter = nodemailer.createTransport(
    service: 'gmail'),
  }