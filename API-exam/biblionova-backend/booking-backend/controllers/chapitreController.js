const ChapitreModel = require('../models/chapitreModel');
const EmpruntModel = require('../models/empruntModel');
const AchatModel = require('../models/achatModel');

// Liste des chapitres d'un livre (numéros et titres sans contenu)
exports.getChapitresByBook = async (req, res) => {
  try {
    const chapitres = await ChapitreModel.findByBook(req.params.bookId);
    res.json(chapitres);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Ajouter un chapitre à un livre (réservé a l'admin only)
exports.create = async (req, res) => {
  try {
    const { book_id, numero, titre, contenu_url } = req.body;
    if (!book_id || !numero || !contenu_url) {
      return res.status(400).json({ message: 'book_id, numero et contenu_url sont requis.' });
    }
    const id = await ChapitreModel.create({ book_id, numero, titre, contenu_url });
    res.status(201).json({ message: 'Chapitre créé.', id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Lire le contenu d'un chapitre 
exports.lireChapitre = async (req, res) => {
  try {
    const user_id = req.user.id;
    const chapitre = await ChapitreModel.findById(req.params.id);

    if (!chapitre) {
      return res.status(404).json({ message: 'Chapitre introuvable.' });
    }

    // 1. L'urilisateur doit avoir emprunté le livre
    const emprunt = await EmpruntModel.findActifByUserAndBook(user_id, chapitre.book_id);
    if (!emprunt) {
      return res.status(403).json({ message: 'Vous devez emprunter ce livre avant de le lire.' });
    }

    // 2. Chapitres 1 et 2 : accès libre une fois emprunté
    if (ChapitreModel.estGratuit(chapitre.numero)) {
      return res.json({
        numero: chapitre.numero,
        titre: chapitre.titre,
        contenu_url: chapitre.contenu_url
      });
    }

    // 3. Chapitre 3+ : il faut un achat validé (statut = paye)
    const paye = await AchatModel.estPaye(user_id, chapitre.book_id);
    if (!paye) {
      return res.status(402).json({
        message: 'Paiement requis pour accéder à ce chapitre.',
        code: 'PAIEMENT_REQUIS'
      });
    }

    res.json({
      numero: chapitre.numero,
      titre: chapitre.titre,
      contenu_url: chapitre.contenu_url
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

//la logique derriere: le client peut emprunté un livre. L'emprunt permet l'acces gratuit aux deux premiers chapitres du livre
//Mais pour aller au dela , il faudra payer: principe de librairie en ligne
