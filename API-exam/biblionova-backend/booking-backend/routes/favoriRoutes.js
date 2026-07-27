const express = require('express');
const router = express.Router();
const favoriController = require('../controllers/favoriController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/', favoriController.mesFavoris);
router.post('/', favoriController.ajouter);
router.delete('/:bookId', favoriController.retirer);

module.exports = router;
