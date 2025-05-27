const express = require('express');
const router = express.Router();
const { createUtilisateur, login, resetPassword } = require('../controllers/utilisateurController');
const { isAuthenticated } = require('../middleware/auth');

function isAdmin(req, res, next) {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        res.status(403).json({ message: 'Accès refusé. Vous devez être un administrateur.' });
    }
}

/**
 * @swagger
 * tags:
 *   name: Utilisateurs
 *   description: Opérations liées aux utilisateurs
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     tags: [Utilisateurs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - motDePasse
 *             properties:
 *               email:
 *                 type: string
 *                 example: utilisateur@example.com
 *               motDePasse:
 *                 type: string
 *                 example: motdepasse123
 *     responses:
 *       200:
 *         description: Connexion réussie avec un token JWT
 *       401:
 *         description: Email ou mot de passe incorrect
 */
router.post('/login', login);

/**
 * @swagger
 * /utilisateurs:
 *   post:
 *     summary: Créer un nouvel utilisateur
 *     tags: [Utilisateurs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *               - prenom
 *               - email
 *               - motDePasse
 *               - role
 *             properties:
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               email:
 *                 type: string
 *               motDePasse:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [ADMIN, AGENT, EMPLOYE, RESPONSABLE_RH]
 *               telephone:
 *                 type: string
 *               departement:
 *                 type: string
 *               poste:
 *                 type: string
 *               service:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Requête invalide
 */
router.post('/utilisateurs', isAuthenticated, isAdmin,createUtilisateur);

/**
 * @swagger
 * /reset-password/{token}:
 *   post:
 *     summary: Réinitialiser le mot de passe avec un token
 *     tags: [Utilisateurs]
 *     parameters:
 *       - name: token
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Token reçu par email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mot de passe modifié avec succès
 *       400:
 *         description: Token invalide ou expiré
 */
router.post('/reset-password/:token', resetPassword);

module.exports = router;
