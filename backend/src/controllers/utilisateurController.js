const { PrismaClient, Role } = require('@prisma/client');
const { hashPassword } = require('../utils/hash');
const { sendPasswordResetEmail } = require('../utils/mailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const prisma = new PrismaClient();

//Fonction pour créer un utilisateur
const createUtilisateur = async (req, res) => {
  try {
    const { nom, prenom, email, motDePasse, role, telephone, departement, poste, service } = req.body;

    if (!nom || !prenom || !email || !motDePasse || !role) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
    }

    // Vérifier si l'email existe déjà
    const userExist = await prisma.utilisateur.findUnique({ where: { email } });
    if (userExist) return res.status(400).json({ message: 'L\'email existe déjà' });

    // Hasher le mot de passe (initialement inutile car l'utilisateur va le changer)
    const hashedPassword = await hashPassword(motDePasse);

    // Générer un token de reset
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 3600000); // 1h

    // Préparer les données
    let data = {
      nom,
      prenom,
      email,
      motDePasse: hashedPassword, // initialisé mais sera changé plus tard
      role,
      resetToken: token,
      resetTokenExpiration: expiry
    };

    switch (role) {
      case Role.ADMIN:
        if (!telephone) return res.status(400).json({ message: 'Le champ téléphone est requis pour un admin' });
        data.telephone = telephone;
        break;

      case Role.AGENT:
        if (!service) return res.status(400).json({ message: 'Le champ service est requis pour un agent' });
        data.service = service;
        break;

      case Role.RESPONSABLE_RH:
        break;

      case Role.EMPLOYE:
        if (!departement || !poste) {
          return res.status(400).json({ message: "Les champs département et poste sont requis pour un employé" });
        }
        data.departement = departement;
        data.poste = poste;
        break;

      default:
        return res.status(400).json({ message: 'Rôle non valide' });
    }

    const newUser = await prisma.utilisateur.create({ data });

    // ✅ Envoi du mail avec lien de réinitialisation
    await sendPasswordResetEmail(email, token);

    res.status(201).json({
      message: 'Utilisateur créé avec succès. Un lien de définition de mot de passe a été envoyé.',
      utilisateur: newUser
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

// ✅ Réinitialisation du mot de passe
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const user = await prisma.utilisateur.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiration: {
        gte: new Date()
      }
    }
  });

  if (!user) {
    return res.status(400).json({ message: 'Token invalide ou expiré' });
  }

  const hashed = await hashPassword(newPassword);

  await prisma.utilisateur.update({
    where: { id: user.id },
    data: {
      motDePasse: hashed,
      resetToken: null,
      resetTokenExpiration: null
    }
  });

  res.json({ message: 'Mot de passe défini avec succès' });
};

// ✅ Connexion
const login = async (req, res) => {
  const { email, motDePasse } = req.body;

  try {
    const utilisateur = await prisma.utilisateur.findUnique({
      where: { email }
    });

    if (!utilisateur) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const isMatch = await bcrypt.compare(motDePasse, utilisateur.motDePasse);

    if (!isMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const token = jwt.sign(
      { userId: utilisateur.id, role: utilisateur.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = {
  createUtilisateur,
  resetPassword,
  login
};
