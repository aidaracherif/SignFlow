const express = require('express');
const router = express.Router();
const { createDocument, getDocuments, getActiveDocuments, getArchiveDocuments, archiveDocument, generateContrat} = require('../controllers/documentController');
const { isAuthenticated } = require('../middleware/auth');



router.post('/documents', isAuthenticated, createDocument);
router.get('/documents/archives', isAuthenticated, getArchiveDocuments);
router.get('/documents/actifs', isAuthenticated, getActiveDocuments);
router.put('/documents/archiver/:id', isAuthenticated, archiveDocument);
router.get('/documents/:id/contrat-pdf', isAuthenticated, generateContrat);

module.exports = router;
