const express = require('express');
const router = express.Router();

const {
    createDocument,
    getDocuments,
    getActiveDocuments,
    getArchiveDocuments,
    archiveDocument,
    generateConge,
    envoyerPourSignature
} = require('../controllers/documentController');
const { isAuthenticated } = require('../middleware/auth');
const { getWorkFlowStatus } = require('../services/emSignerTrackingService');
const { downloadSignedDocument } = require('../services/downloadDocument');

/**
 * @swagger
 * tags:
 *   name: Documents
 *   description: Gestion des documents
 */

/**
 * @swagger
 * /documents:
 *   post:
 *     summary: Créer un document (contrat ou congé)
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - typeDocument
 *               - titre
 *               - pathDocument
 *               - status
 *             properties:
 *               typeDocument:
 *                 type: string
 *                 enum: [CONTRAT, CONGE]
 *               titre:
 *                 type: string
 *               description:
 *                 type: string
 *               pathDocument:
 *                 type: string
 *               status:
 *                 type: string
 *               idClient:
 *                 type: integer
 *               idAgent:
 *                 type: integer
 *               idEmploye:
 *                 type: integer
 *               objetContrat:
 *                 type: string
 *               duree:
 *                 type: string
 *                 format: date
 *               montant:
 *                 type: number
 *               conditionGenerale:
 *                 type: string
 *               dateDebut:
 *                 type: string
 *                 format: date
 *               dateFin:
 *                 type: string
 *                 format: date
 *               typeConge:
 *                 type: string
 *               motif:
 *                 type: string
 *     responses:
 *       201:
 *         description: Document créé avec succès
 *       400:
 *         description: Erreur de validation
 *       500:
 *         description: Erreur interne du serveur
 */
router.post('/documents', isAuthenticated, createDocument);
router.post('/documents/:id/signature', envoyerPourSignature);
router.get('/documents/status', async (req, res) => {
    const workflowId = req.query.workflowId;
    if (!workflowId) {
    return res.status(400).json({ message: 'Paramètre "workflowId" requis' });
    }

  try {
    const status = await getWorkFlowStatus(workflowId);
    res.status(200).json(status);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du suivi', error: error.message });
  }

});
router.post('/documents/download', async (req, res) => {
  const workflowId = req.body.workflowId;

  if (!workflowId) {
    return res.status(400).json({ message: 'Paramètre "workflowId" requis' });
  }

  try {
    const filePath = await downloadSignedDocument(workflowId);
    res.download(filePath); 
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du téléchargement', error: error.message });
  }
});




/**
 * @swagger
 * /documents/archives:
 *   get:
 *     summary: Obtenir les documents archivés
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des documents archivés
 *       500:
 *         description: Erreur serveur
 */
router.get('/documents/archives', isAuthenticated, getArchiveDocuments);

/**
 * @swagger
 * /documents/actifs:
 *   get:
 *     summary: Obtenir les documents actifs
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des documents actifs
 *       500:
 *         description: Erreur serveur
 */
router.get('/documents/actifs', isAuthenticated, getActiveDocuments);

/**
 * @swagger
 * /documents/archiver/{id}:
 *   put:
 *     summary: Archiver un document
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Document archivé avec succès
 *       404:
 *         description: Document non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put('/documents/archiver/:id', isAuthenticated, archiveDocument);
router.get('/documents/:id/conge-pdf', isAuthenticated, generateConge)

module.exports = router;
