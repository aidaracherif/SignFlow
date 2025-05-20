const express = require('express');
const router = express.Router();
const { createUtilisateur, login, resetPassword } = require('../controllers/utilisateurController');
const { isAuthenticated } = require('../middleware/auth');

function isAdmin(req, res, next) {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    }
    else {
        res.status(403).json({ message: 'Accès refusé. Vous devez être un administrateur.' });
    }
}
router.post('/login', login);
router.post('/utilisateurs', isAuthenticated, isAdmin, createUtilisateur);
router.post('/reset-password/:token', resetPassword);



module.exports = router;