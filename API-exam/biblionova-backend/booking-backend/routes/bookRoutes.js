const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const chapitreController = require('../controllers/chapitreController');
const authMiddleware = require('../middlewares/authMiddleware');

// Catalogue
router.get('/', bookController.getAll);
router.get('/categories', bookController.getCategories);
router.get('/:id', bookController.getById);

// Gestion des livres (connexion requise)
router.post('/', authMiddleware, bookController.create);
router.put('/:id', authMiddleware, bookController.update);
router.delete('/:id', authMiddleware, bookController.remove);

// Chapitres d'un livre (liste, sans contenu -- public)
router.get('/:bookId/chapitres', chapitreController.getChapitresByBook);

module.exports = router;