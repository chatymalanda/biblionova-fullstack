const UserModel = require('../models/userModel');

exports.getProfil = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable.' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

exports.updateProfil = async (req, res) => {
  try {
    const { nom, prenom, avatar } = req.body;
    await UserModel.update(req.user.id, { nom, prenom, avatar });
    const user = await UserModel.findById(req.user.id);
    res.json({ message: 'Profil mis à jour.', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
