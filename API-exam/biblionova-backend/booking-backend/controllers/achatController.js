const AchatModel = require('../models/achatModel');
const BookModel = require('../models/bookModel');

// Simulation paiement
exports.simulerPaiement = async (req, res) => {
  try {
    const { book_id, montant } = req.body;
    const user_id = req.user.id;

    if (!book_id || !montant) {
      return res.status(400).json({ message: 'book_id et montant sont requis.' });
    }

    const book = await BookModel.findById(book_id);
    if (!book) return res.status(404).json({ message: 'Livre introuvable.' });

    const id = await AchatModel.createOrUpdate({ user_id, book_id, montant });

    res.json({
      message: 'Paiement simulé validé avec succès. Le livre est maintenant débloqué en entier.',
      achat: { id, book_id, montant, statut: 'paye' }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.mesAchats = async (req, res) => {
  try {
    const achats = await AchatModel.findAllByUser(req.user.id);
    res.json(achats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
