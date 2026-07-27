const db = require('../config/db');

const UserModel = {
  async create({ nom, prenom, email, password }) {
    const [result] = await db.query(
      'INSERT INTO users (nom, prenom, email, password) VALUES (?, ?, ?, ?)',
      [nom, prenom, email, password]
    );
    return result.insertId;
  },

  async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  },

  async findById(id) {
    const [rows] = await db.query(
      'SELECT id, nom, prenom, email, avatar, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  },

  async update(id, { nom, prenom, avatar }) {
    await db.query(
      'UPDATE users SET nom = ?, prenom = ?, avatar = ? WHERE id = ?',
      [nom, prenom, avatar, id]
    );
  }
};

module.exports = UserModel;
