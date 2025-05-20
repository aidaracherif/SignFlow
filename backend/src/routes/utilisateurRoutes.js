const express = require('express');
const router = express.Router();
const { createUtilisateur } = require('../controllers/utilisateurController');



router.post('/utilisateurs', createUtilisateur);

module.exports = router;