const FavoriModel = require('../models/favoriModel');

exports.mesFavoris = async (req, res) => {
  try {
    const favoris = await FavoriModel.findAllByUser(req.user.id);
    res.json(favoris);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.ajouter = async (req, res) => {
  try {
    const { book_id } = req.body;
    const user_id = req.user.id;

    if (!book_id) return res.status(400).json({ message: 'book_id requis.' });

    const existe = await FavoriModel.exists(user_id, book_id);
    if (existe) return res.status(409).json({ message: 'Ce livre est déjà dans vos favoris.' });

    const id = await FavoriModel.add(user_id, book_id);
    res.status(201).json({ message: 'Ajouté aux favoris.', id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.retirer = async (req, res) => {
  try {
    await FavoriModel.remove(req.user.id, req.params.bookId);
    res.json({ message: 'Retiré des favoris.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Selon ton frontend, notament dans le dashboard, il y'a un section favoris. Voila pourquoi j'ai ajouté un controller pour ca.
// Si y'en a pas au frontend, faudra soit l'ajouter comme option (bouton) ou soit le supprimer directement du dashboard ainsi que le controller

