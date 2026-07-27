const db = require('../config/db');

// Nombre de chapitres accessibles gratuitement après emprunt
const CHAPITRES_GRATUITS = 2;

const ChapitreModel = {
  async findByBook(book_id) {
    const [rows] = await db.query(
      'SELECT id, book_id, numero, titre, created_at FROM chapitres WHERE book_id = ? ORDER BY numero',
      [book_id]
    );
    // On ne renvoie pas contenu_url ici : la liste ne doit pas donner accès direct au contenu
    return rows;
  },

  async findById(id) {
    const [rows] = await db.query('SELECT * FROM chapitres WHERE id = ?', [id]);
    return rows[0];
  },

  async create({ book_id, numero, titre, contenu_url }) {
    const [result] = await db.query(
      'INSERT INTO chapitres (book_id, numero, titre, contenu_url) VALUES (?, ?, ?, ?)',
      [book_id, numero, titre, contenu_url]
    );
    return result.insertId;
  },

  estGratuit(numero) {
    return numero <= CHAPITRES_GRATUITS;
  }
};

module.exports = ChapitreModel;
