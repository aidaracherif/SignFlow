const express = require('express');
const router = express.Router();
const { createClient, getAllClients, getClientById } = require('../controllers/clientController');
const { isAuthenticated } = require('../middleware/auth');


function isAgent(req, res, next) {
    if (req.user && req.user.role === 'AGENT') {
        next();
    }
    else {
        res.status(403).json({ message: 'Accès refusé. Vous devez être un agent.' });
    }
}

router.post('/clients', isAuthenticated,isAgent,createClient );
router.get('/clients', isAuthenticated,isAgent, getAllClients);
router.get('/clients/:id', isAuthenticated, isAgent, getClientById);

module.exports = router;
