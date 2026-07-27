const EmpruntModel = require('../models/empruntModel');
const BookModel = require('../models/bookModel');

exports.emprunter = async (req, res) => {
  try {
    const { book_id } = req.body;
    const user_id = req.user.id;

    if (!book_id) return res.status(400).json({ message: 'book_id requis.' });

    const book = await BookModel.findById(book_id);
    if (!book) return res.status(404).json({ message: 'Livre introuvable.' });

    const dejaEmprunte = await EmpruntModel.findActifByUserAndBook(user_id, book_id);
    if (dejaEmprunte) {
      return res.status(409).json({ message: 'Vous avez déjà emprunté ce livre.', emprunt: dejaEmprunte });
    }

    const id = await EmpruntModel.create({ user_id, book_id });
    res.status(201).json({ message: 'Livre emprunté avec succès. Chapitres 1 et 2 accessibles gratuitement.', id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.mesEmprunts = async (req, res) => {
  try {
    const emprunts = await EmpruntModel.findEnCoursByUser(req.user.id);
    res.json(emprunts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.historique = async (req, res) => {
  try {
    const historique = await EmpruntModel.findHistoriqueByUser(req.user.id);
    res.json(historique);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.terminerEmprunt = async (req, res) => {
  try {
    await EmpruntModel.terminer(req.params.id, req.user.id);
    res.json({ message: 'Emprunt marqué comme terminé.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
