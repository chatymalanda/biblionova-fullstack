const db = require('../config/db');

const FavoriModel = {
  async findAllByUser(user_id) {
    const [rows] = await db.query(
      `SELECT f.id, f.created_at, b.id AS book_id, b.titre, b.auteur, b.image_url
       FROM favoris f
       JOIN books b ON f.book_id = b.id
       WHERE f.user_id = ?
       ORDER BY f.created_at DESC`,
      [user_id]
    );
    return rows;
  },

  async exists(user_id, book_id) {
    const [rows] = await db.query(
      'SELECT id FROM favoris WHERE user_id = ? AND book_id = ?',
      [user_id, book_id]
    );
    return rows[0];
  },

  async add(user_id, book_id) {
    const [result] = await db.query(
      'INSERT INTO favoris (user_id, book_id) VALUES (?, ?)',
      [user_id, book_id]
    );
    return result.insertId;
  },

  async remove(user_id, book_id) {
    await db.query('DELETE FROM favoris WHERE user_id = ? AND book_id = ?', [user_id, book_id]);
  }
};

module.exports = FavoriModel;
