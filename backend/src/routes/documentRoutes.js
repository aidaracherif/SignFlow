const express = require('express');
const router = express.Router();
const { createDocument, getDocuments, getActiveDocuments, getArchiveDocuments, archiveDocument, generateContrat, envoyerPourSignature} = require('../controllers/documentController');
const { isAuthenticated } = require('../middleware/auth');
const { getWorkFlowStatus } = require('../services/emSignerTrackingService');
const { downloadSignedDocument } = require('../services/downloadDocument');



router.post('/documents', isAuthenticated, createDocument);
router.get('/documents/archives', isAuthenticated, getArchiveDocuments);
router.get('/documents/actifs', isAuthenticated, getActiveDocuments);
router.put('/documents/archiver/:id', isAuthenticated, archiveDocument);
router.get('/documents/:id/contrat-pdf', isAuthenticated, generateContrat);
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


module.exports = router;
