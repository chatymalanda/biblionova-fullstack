const db = require('../config/db');

const EmpruntModel = {
  async findActifByUserAndBook(user_id, book_id) {
    const [rows] = await db.query(
      "SELECT * FROM emprunts WHERE user_id = ? AND book_id = ? AND statut = 'en_cours'",
      [user_id, book_id]
    );
    return rows[0];
  },

  async create({ user_id, book_id }) {
    const [result] = await db.query(
      'INSERT INTO emprunts (user_id, book_id) VALUES (?, ?)',
      [user_id, book_id]
    );
    return result.insertId;
  },

  async findEnCoursByUser(user_id) {
    const [rows] = await db.query(
      `SELECT e.id, e.date_emprunt, e.statut, b.id AS book_id, b.titre, b.auteur, b.image_url
       FROM emprunts e
       JOIN books b ON e.book_id = b.id
       WHERE e.user_id = ? AND e.statut = 'en_cours'
       ORDER BY e.date_emprunt DESC`,
      [user_id]
    );
    return rows;
  },

  async findHistoriqueByUser(user_id) {
    const [rows] = await db.query(
      `SELECT e.id, e.date_emprunt, e.statut, b.id AS book_id, b.titre, b.auteur, b.image_url
       FROM emprunts e
       JOIN books b ON e.book_id = b.id
       WHERE e.user_id = ? AND e.statut = 'termine'
       ORDER BY e.date_emprunt DESC`,
      [user_id]
    );
    return rows;
  },

  async terminer(id, user_id) {
    await db.query(
      "UPDATE emprunts SET statut = 'termine' WHERE id = ? AND user_id = ?",
      [id, user_id]
    );
  }
};

module.exports = EmpruntModel;
