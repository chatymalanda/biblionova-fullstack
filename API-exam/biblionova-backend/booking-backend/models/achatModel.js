const db = require('../config/db');

const AchatModel = {
  async findByUserAndBook(user_id, book_id) {
    const [rows] = await db.query(
      'SELECT * FROM achats WHERE user_id = ? AND book_id = ?',
      [user_id, book_id]
    );
    return rows[0];
  },

  async estPaye(user_id, book_id) {
    const achat = await this.findByUserAndBook(user_id, book_id);
    return !!(achat && achat.statut === 'paye');
  },

  async createOrUpdate({ user_id, book_id, montant }) {
    const existant = await this.findByUserAndBook(user_id, book_id);
    if (existant) {
      await db.query('UPDATE achats SET statut = ? WHERE id = ?', ['paye', existant.id]);
      return existant.id;
    }
    const [result] = await db.query(
      'INSERT INTO achats (user_id, book_id, montant, statut) VALUES (?, ?, ?, ?)',
      [user_id, book_id, montant, 'paye']
    );
    return result.insertId;
  },

  async findAllByUser(user_id) {
    const [rows] = await db.query(
      `SELECT a.*, b.titre, b.auteur
       FROM achats a
       JOIN books b ON a.book_id = b.id
       WHERE a.user_id = ?
       ORDER BY a.date_achat DESC`,
      [user_id]
    );
    return rows;
  }
};

module.exports = AchatModel;
