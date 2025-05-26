const nodemailer = require('nodemailer');

async function sendPasswordResetEmail(email, token) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'aidaradiarracherif29@gmail.com',          
      pass: 'qxdw oxxx axvw lzkr'   
    }
  });

  const resetLink = `http://localhost:3000/reset-password/${token}`;

  const mailOptions = {
    from: 'aidaradiarracherif29@gmail.com',
    to: email,
    subject: 'Définir votre mot de passe',
    html: `<p>Bonjour,</p>
           <p>Veuillez cliquer sur le lien suivant pour définir votre mot de passe :</p>
           <a href="${resetLink}">${resetLink}</a>
           <p>Ce lien expirera dans 1 heure.</p>`
  };

  await transporter.sendMail(mailOptions);
}

module.exports = {
  sendPasswordResetEmail
};
