const BookModel = require('../models/bookModel');

exports.getAll = async (req, res) => {
  try {
    const { search, categorie_id } = req.query;
    const books = await BookModel.findAll({ search, categorie_id });
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.getById = async (req, res) => {
  try {
    const book = await BookModel.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Livre introuvable.' });
    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.create = async (req, res) => {
  try {
    const { titre, auteur, annee, description, nb_pages, image_url, categorie_id } = req.body;
    if (!titre || !auteur) {
      return res.status(400).json({ message: 'Titre et auteur requis.' });
    }
    const id = await BookModel.create({ titre, auteur, annee, description, nb_pages, image_url, categorie_id });
    res.status(201).json({ message: 'Livre créé.', id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.update = async (req, res) => {
  try {
    const book = await BookModel.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Livre introuvable.' });

    const { titre, auteur, annee, description, nb_pages, image_url, categorie_id } = req.body;
    await BookModel.update(req.params.id, { titre, auteur, annee, description, nb_pages, image_url, categorie_id });
    res.json({ message: 'Livre mis à jour.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.remove = async (req, res) => {
  try {
    await BookModel.remove(req.params.id);
    res.json({ message: 'Livre supprimé.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await BookModel.findAllCategories();
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
