const express = require('express');
const router = express.Router();
const empruntController = require('../controllers/empruntController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware); // toutes les routes emprunts nécessitent d'être connecté

router.post('/', empruntController.emprunter);
router.get('/', empruntController.mesEmprunts);
router.get('/historique', empruntController.historique);
router.put('/:id/terminer', empruntController.terminerEmprunt);

module.exports = router;
