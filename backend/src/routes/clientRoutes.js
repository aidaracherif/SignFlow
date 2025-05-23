const express = require('express');
const router = express.Router();
const { createClient, getAllClients, getClientById } = require('../controllers/clientController');
const { isAuthenticated } = require('../middleware/auth');

function isAgent(req, res, next) {
    if (req.user && req.user.role === 'AGENT') {
        next();
    } else {
        res.status(403).json({ message: 'Accès refusé. Vous devez être un agent.' });
    }
}

/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: Gestion des clients
 */

/**
 * @swagger
 * /clients:
 *   post:
 *     summary: Créer un nouveau client
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
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
 *               - telephone
 *               - adresse
 *               - dateNaissance
 *             properties:
 *               nom:
 *                 type: string
 *                 example: Dupont
 *               prenom:
 *                 type: string
 *                 example: Jean
 *               email:
 *                 type: string
 *                 example: jean.dupont@example.com
 *               telephone:
 *                 type: string
 *                 example: "0601020304"
 *               adresse:
 *                 type: string
 *                 example: "123 Rue de Paris, 75000 Paris"
 *               dateNaissance:
 *                 type: string
 *                 format: date
 *                 example: 1990-05-20
 *     responses:
 *       201:
 *         description: Client créé avec succès
 *       400:
 *         description: Erreur de validation ou client existant
 */
router.post('/clients', isAuthenticated, isAgent, createClient);

/**
 * @swagger
 * /clients:
 *   get:
 *     summary: Obtenir tous les clients
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des clients
 */
router.get('/clients', isAuthenticated, isAgent, getAllClients);

/**
 * @swagger
 * /clients/{id}:
 *   get:
 *     summary: Obtenir un client par ID
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du client
 *     responses:
 *       200:
 *         description: Détails du client
 *       404:
 *         description: Client non trouvé
 */
router.get('/clients/:id', isAuthenticated, isAgent, getClientById);

module.exports = router;
