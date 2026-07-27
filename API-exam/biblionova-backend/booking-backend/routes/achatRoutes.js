const express = require('express');
const router = express.Router();
const achatController = require('../controllers/achatController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.post('/simuler', achatController.simulerPaiement);
router.get('/', achatController.mesAchats);

module.exports = router;
