const express = require('express');
const router = express.Router();
const chapitreController = require('../controllers/chapitreController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/', authMiddleware, chapitreController.create);
router.get('/:id/lire', authMiddleware, chapitreController.lireChapitre);

module.exports = router;